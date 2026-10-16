import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {aggregateQuality,canonicalScreenshotName} from '../../scripts/quality-evidence.mjs';
import {createHandoff,scheduleComplete} from '../../scripts/handoff.mjs';

const root=fileURLToPath(new URL('../..',import.meta.url)),started=performance.now(),basePort=Number(process.env.QA_PORT??4182),children=new Set();
let peakWorkers=0;
if(!Number.isInteger(basePort)||basePort<1024||basePort>65529)throw Error('Invalid isolated browser port');
for(const [signal,code]of[['SIGTERM',143],['SIGINT',130]])process.once(signal,()=>{for(const child of children)child.kill('SIGTERM');process.exit(code);});
const launch=(name,suites,offset,onPerformanceComplete=null)=>new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,[suites[0]==='news-feed'?'tests/browser/news-feed-runner.mjs':'tests/browser/portable-smoke.mjs'],{cwd:root,env:{...process.env,QA_SUITE:suites.join(','),QA_PORT:String(basePort+offset),QA_OUTPUT_DIR:'.qa-output/'+name},stdio:['ignore','pipe','pipe','ipc']});children.add(child);peakWorkers=Math.max(peakWorkers,children.size);
 child.stdout.on('data',b=>process.stdout.write('['+name+'] '+b));child.stderr.on('data',b=>process.stderr.write('['+name+'] '+b));
 if(onPerformanceComplete)child.on('message',message=>{try{onPerformanceComplete(message);}catch(error){child.kill('SIGTERM');reject(error);}});
 child.once('error',error=>{children.delete(child);reject(error);});child.once('exit',code=>{children.delete(child);resolve({name,suites,code});});
});
// Iteration selection remains partial. It cannot produce a full acceptance report.
if(process.env.QA_SUITE){const result=await launch('local-selected',process.env.QA_SUITE.split(','),0);process.exitCode=result.code??1;}
else{
 // Only clear our own previous-run output. Unit/content proofs from this run stay.
 await fs.mkdir(path.join(root,'.qa-output'),{recursive:true});
 for(const name of await fs.readdir(path.join(root,'.qa-output')))if(/^(quality-|journey-engine-)/.test(name)||['portable-report.json','handoff.json','engine-report.json','review'].includes(name))await fs.rm(path.join(root,'.qa-output',name),{recursive:true,force:true});
 let outcomes=[];
 const scheduling={mode:'balanced-three-workers',performanceSamples:0,performanceCompletedSeconds:null,bookStartedSeconds:null,foundationCompletedSeconds:null,newsCompletedSeconds:null,peakWorkers:0};
 try{
  // Performance remains alone. Balance the measured long Why/invention
  // groups across the same three isolated workers, without a new CI job.
  const foundation=await launch('quality-foundation',['foundation'],0,message=>{
   if(message?.type!=='quality-performance-complete'||message.samples!==21||scheduling.performanceSamples)throw Error('Missing, malformed or duplicate isolated performance completion');
   scheduling.performanceSamples=message.samples;scheduling.performanceCompletedSeconds=(performance.now()-started)/1000;
  });scheduling.foundationCompletedSeconds=(performance.now()-started)/1000;outcomes.push(foundation);if(foundation.code!==0)throw Error('Foundation phase failed');if(scheduling.performanceSamples!==21)throw Error('Isolated performance completion was not observed');
  const news=await launch('quality-news-feed',['news-feed'],3);scheduling.newsCompletedSeconds=(performance.now()-started)/1000;outcomes.push(news);if(news.code!==0)throw Error('Signed news phase failed');
  // Offline ends only navigation's server, after all of its online Why work.
  scheduling.bookStartedSeconds=(performance.now()-started)/1000;
  console.log('QUALITY_SCHEDULE',JSON.stringify(scheduling));
  outcomes.push(...await Promise.all([launch('quality-navigation',['home','core','why','offline'],1),launch('quality-learning',['journeys','playground','backup','challenge','research','nature'],2),launch('quality-book',['book','inventions'],5)]));
  const reports=await Promise.all(outcomes.map(async result=>({...result,report:JSON.parse(await fs.readFile(path.join(root,'.qa-output',result.name,'portable-report.json'),'utf8'))})));
  scheduling.peakWorkers=peakWorkers;if(!scheduleComplete(scheduling))throw Error('Performance isolation/book scheduling proof incomplete');
  const report=aggregateQuality(reports);report.seconds=(performance.now()-started)/1000;report.scheduling=scheduling;
  for(const result of outcomes)for(const file of await fs.readdir(path.join(root,'.qa-output',result.name)))if(file.endsWith('.png'))await fs.copyFile(path.join(root,'.qa-output',result.name,file),path.join(root,'.qa-output',canonicalScreenshotName(result.name,file)),constants.COPYFILE_EXCL);
  await fs.writeFile(path.join(root,'.qa-output/portable-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,seconds:report.seconds,checks:report.checks.length,timings:report.timings,scheduling}));
  await createHandoff(report);
 }catch(error){await fs.mkdir(path.join(root,'.qa-output'),{recursive:true});await fs.writeFile(path.join(root,'.qa-output/portable-report.json'),JSON.stringify({status:'failed',scope:'complete mandatory regression',seconds:(performance.now()-started)/1000,outcomes,scheduling:{...scheduling,peakWorkers},failure:error.stack},null,2));throw error;}
 finally{for(const child of children)child.kill('SIGTERM');}
}
