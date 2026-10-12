import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {aggregateQuality} from '../../scripts/quality-evidence.mjs';
import {createHandoff} from '../../scripts/handoff.mjs';

const root=fileURLToPath(new URL('../..',import.meta.url)),started=performance.now(),basePort=Number(process.env.QA_PORT??4182),children=new Set();
if(!Number.isInteger(basePort)||basePort<1024||basePort>65530)throw Error('Invalid isolated browser port');
process.once('SIGTERM',()=>{for(const child of children)child.kill('SIGTERM');process.exit(143);});
const launch=(name,suites,offset)=>new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,[suites[0]==='news-feed'?'tests/browser/news-feed-runner.mjs':'tests/browser/portable-smoke.mjs'],{cwd:root,env:{...process.env,QA_SUITE:suites.join(','),QA_PORT:String(basePort+offset),QA_OUTPUT_DIR:'.qa-output/'+name},stdio:['ignore','pipe','pipe']});children.add(child);
 child.stdout.on('data',b=>process.stdout.write('['+name+'] '+b));child.stderr.on('data',b=>process.stderr.write('['+name+'] '+b));
 child.once('error',reject);child.once('exit',code=>{children.delete(child);resolve({name,suites,code});});
});
// Iteration selection remains partial. It cannot produce a full acceptance report.
if(process.env.QA_SUITE){const result=await launch('local-selected',process.env.QA_SUITE.split(','),0);process.exitCode=result.code??1;}
else{
 let outcomes=[];
 try{
  // Never run another browser beside the reproducible performance sample phase.
  const foundation=await launch('quality-foundation',['foundation'],0);outcomes.push(foundation);if(foundation.code!==0)throw Error('Foundation phase failed');
  const news=await launch('quality-news-feed',['news-feed'],3);outcomes.push(news);if(news.code!==0)throw Error('Signed news phase failed');
  outcomes.push(...await Promise.all([launch('quality-navigation',['home','core','offline'],1),launch('quality-learning',['research','journeys','playground','backup','challenge'],2)]));
  const reports=await Promise.all(outcomes.map(async result=>({...result,report:JSON.parse(await fs.readFile(path.join(root,'.qa-output',result.name,'portable-report.json'),'utf8'))})));
  const report=aggregateQuality(reports);report.seconds=(performance.now()-started)/1000;
  for(const result of outcomes)for(const file of await fs.readdir(path.join(root,'.qa-output',result.name)))if(file.endsWith('.png'))await fs.copyFile(path.join(root,'.qa-output',result.name,file),path.join(root,'.qa-output',result.name+'-'+file));
  await fs.writeFile(path.join(root,'.qa-output/portable-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,seconds:report.seconds,checks:report.checks.length,timings:report.timings}));
  await createHandoff(report);
 }catch(error){await fs.mkdir(path.join(root,'.qa-output'),{recursive:true});await fs.writeFile(path.join(root,'.qa-output/portable-report.json'),JSON.stringify({status:'failed',scope:'complete mandatory regression',seconds:(performance.now()-started)/1000,outcomes,failure:error.stack},null,2));throw error;}
 finally{for(const child of children)child.kill('SIGTERM');}
}
