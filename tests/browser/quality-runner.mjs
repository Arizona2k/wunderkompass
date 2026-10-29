import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {aggregateQuality} from '../../scripts/quality-evidence.mjs';
import {createHandoff,sourceDigest} from '../../scripts/handoff.mjs';
import {learningFingerprint} from '../../build/learning-fingerprint.mjs';
import {fileSnapshot,coldBrowserEnvironment,sealColdOffline,restoreColdOffline,validateRestoredColdOffline} from '../../scripts/cold-offline-reuse.mjs';
import qualityContext from '../../scripts/release/quality-context.cjs';
import {copyWorkerEvidence} from './worker-evidence-copy.mjs';

const root=fileURLToPath(new URL('../..',import.meta.url)),started=performance.now(),basePort=Number(process.env.QA_PORT??4182),children=new Set();
// Optional local resource diagnosis/acceptance: every existing worker and gate remains.
const serialLocal=process.env.QA_SERIAL_LOCAL==='1';
if(process.env.QA_SERIAL_LOCAL!==undefined&&!['0','1'].includes(process.env.QA_SERIAL_LOCAL))throw Error('Invalid local worker execution mode');
if(serialLocal&&process.env.CI)throw Error('Serial local worker execution is forbidden in CI');
if(!Number.isInteger(basePort)||basePort<1024||basePort>65530)throw Error('Invalid isolated browser port');
process.once('SIGTERM',()=>{for(const child of children)child.kill('SIGTERM');process.exit(143);});
const launch=(name,suites,offset)=>new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,['tests/browser/portable-smoke.mjs'],{cwd:root,env:{...process.env,QA_SUITE:suites.join(','),QA_PORT:String(basePort+offset),QA_OUTPUT_DIR:'.qa-output/'+name},stdio:['ignore','pipe','pipe']});children.add(child);
 child.stdout.on('data',b=>process.stdout.write('['+name+'] '+b));child.stderr.on('data',b=>process.stderr.write('['+name+'] '+b));
 child.once('error',reject);child.once('exit',code=>{children.delete(child);resolve({name,suites,code});});
});
const ciCold=!!process.env.GITHUB_RUN_ID&&process.env.GITHUB_EVENT_NAME==='pull_request',coldDirectory=path.join(root,'.qa-output/local-selected'),coldSeal=path.join(root,'.qa-output/early-cold-offline-proof.json');
async function coldIdentity(){const context=qualityContext.currentContext();qualityContext.assertContext(JSON.parse(await fs.readFile(path.join(root,'.qa-output/ci-context.json'),'utf8')),context);return {context,sourceDigest:await sourceDigest(root),build:learningFingerprint(root),environment:coldBrowserEnvironment(),dist:await fileSnapshot(path.resolve(root,process.env.QA_DIST??'dist'))};}
// Iteration selection remains partial. It cannot produce a full acceptance report.
if(process.env.QA_SUITE){
 const sealEarly=ciCold&&process.env.QA_SUITE==='offline',identity=sealEarly?await coldIdentity():null;
 if(sealEarly){await fs.rm(coldDirectory,{recursive:true,force:true});await fs.rm(coldSeal,{force:true});}
 const result=await launch('local-selected',process.env.QA_SUITE.split(','),0);process.exitCode=result.code??1;
 if(sealEarly&&result.code===0){qualityContext.assertContext(await coldIdentity(),identity);await sealColdOffline(coldDirectory,coldSeal,identity);}
}
else{
 // Only clear our own previous-run output. Unit/content proofs from this run stay.
 await fs.mkdir(path.join(root,'.qa-output'),{recursive:true});
 for(const name of await fs.readdir(path.join(root,'.qa-output')))if(/^(quality-|journey-engine-)/.test(name)||['portable-report.json','handoff.json','engine-report.json','review'].includes(name))await fs.rm(path.join(root,'.qa-output',name),{recursive:true,force:true});
 let outcomes=[];
 try{
  const earlyIdentity=ciCold?await coldIdentity():null,earlyCold=ciCold?await restoreColdOffline(coldDirectory,coldSeal,path.join(root,'.qa-output/quality-early-offline'),earlyIdentity):null;
  if(earlyCold)outcomes.push(earlyCold);
  // Never run another browser beside the reproducible performance sample phase.
  const foundation=await launch('quality-foundation',['foundation'],0);outcomes.push(foundation);if(foundation.code!==0)throw Error('Foundation phase failed');
  const news=await launch('quality-no-news',['no-news'],3);outcomes.push(news);if(news.code!==0)throw Error('News removal phase failed');
  const navigation=()=>launch('quality-navigation',earlyCold?['core']:['core','offline'],1),learning=()=>launch('quality-learning',['home','research','journeys','playground','backup','challenge'],2);
  if(serialLocal){outcomes.push(await navigation());outcomes.push(await learning());}
  else outcomes.push(...await Promise.all([navigation(),learning()]));
  if(earlyCold)await validateRestoredColdOffline(coldDirectory,coldSeal,path.join(root,'.qa-output/quality-early-offline'),await coldIdentity(),earlyCold.provenance.sealSHA256);
  const reports=await Promise.all(outcomes.map(async result=>({...result,report:JSON.parse(await fs.readFile(path.join(root,'.qa-output',result.name,'portable-report.json'),'utf8'))})));
  const report=aggregateQuality(reports);if(earlyCold)report.reusedEarlyColdOffline={...earlyCold.provenance,originalsAndInputIdentityRecheckedAfterWorkers:true};if(serialLocal)report.localWorkerExecution='Same existing workers executed serially, local-only; complete assertions and scopes unchanged. CI must use the unchanged default parallel mode.';report.seconds=(performance.now()-started)/1000;
  for(const result of outcomes)for(const file of await fs.readdir(path.join(root,'.qa-output',result.name)))if(file.endsWith('.png'))await copyWorkerEvidence(path.join(root,'.qa-output',result.name,file),path.join(root,'.qa-output',result.name+'-'+file));
  await fs.writeFile(path.join(root,'.qa-output/portable-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,seconds:report.seconds,checks:report.checks.length,timings:report.timings}));
  await createHandoff(report);
 }catch(error){await fs.mkdir(path.join(root,'.qa-output'),{recursive:true});
  // Keep actual current worker diagnostics even when fail-closed aggregation rejects them.
  if(ciCold&&!outcomes.some(result=>result.name==='quality-early-offline'))for(const entry of await fs.readdir(coldDirectory,{withFileTypes:true}).catch(()=>[]))if(entry.isFile()&&/\.(png|json|xml)$/.test(entry.name))await fs.copyFile(path.join(coldDirectory,entry.name),path.join(root,'.qa-output','quality-early-offline-diagnostic-'+entry.name));
  for(const result of outcomes){const dir=path.join(root,'.qa-output',result.name);for(const file of await fs.readdir(dir).catch(()=>[]))if(/\.(png|json)$/.test(file))await copyWorkerEvidence(path.join(dir,file),path.join(root,'.qa-output',result.name+'-'+file));}
await fs.writeFile(path.join(root,'.qa-output/portable-report.json'),JSON.stringify({status:'failed',scope:'complete mandatory regression',seconds:(performance.now()-started)/1000,outcomes,failure:error.stack},null,2));throw error;}
 finally{for(const child of children)child.kill('SIGTERM');}
}
