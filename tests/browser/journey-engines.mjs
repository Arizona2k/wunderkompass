import {preserveEngineDiagnostics,collectEngineEvidence} from './engine-diagnostics.mjs';
import {solarFlow} from './solar-comparison.mjs';
import {animalFlow,animalNavigation} from './animal-learning.mjs';
import {journeySupportView} from './journeys.mjs';
import {offlineResilience} from './offline-resilience.mjs';
import {offlineRetention} from './offline-retention.mjs';
import {historyEngineView} from './discovery-central.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';
import JOURNEYS from '../../exports/content/journeys.json' with {type:'json'};
import DATA from '../../app/journey-inquiries.json' with {type:'json'};
import {sourceDigest} from '../../scripts/handoff.mjs';
import {chromium,firefox,webkit} from '../../qa/node_modules/playwright/index.mjs';
const searchOnly=process.argv.includes('--search-only');
const engines=process.argv.includes('--chromium-only')?['chromium']:['firefox','webkit'];
const serialLocal=process.env.QA_SERIAL_LOCAL==='1';
if(process.env.QA_SERIAL_LOCAL!==undefined&&!['0','1'].includes(process.env.QA_SERIAL_LOCAL))throw Error('Invalid local worker execution mode');
if(serialLocal&&process.env.CI)throw Error('Serial local engine execution is forbidden in CI');
const port=4480,base='http://127.0.0.1:'+port,started=performance.now();
const report={build:(await fs.readFile('dist/index.html','utf8')).match(/name="learning-build" content="([^"]+)"/)?.[1],sourceDigest:await sourceDigest(),status:'running',scope:searchOnly?'partial actual-engine keyboard search':engines.join('+'),execution:searchOnly?'sequential early search':serialLocal?'same complete engines serially; local comparison only':'parallel engines with isolated evidence and offline ports',engines:[],errors:[]};
const server=spawn(process.execPath,['tests/browser/preview-server.mjs'],{env:{...process.env,QA_PORT:String(port)},stdio:['ignore','pipe','pipe']});
let log='';server.stdout.on('data',b=>log+=b);server.stderr.on('data',b=>log+=b);

// The unchanged full engine exercises use independent browsers, evidence
// directories and offline-app ports. Never run reproducible performance samples
// in this phase; those remain in the preceding unchanged Chromium worker.
async function runEngine(name,index){
 const shots=searchOnly?'.qa-output':path.join('.qa-output','journey-engine-work',name);
 await fs.mkdir(shots,{recursive:true});let browser;
 try{
  const started=performance.now(),checked=[],historyViews=[];browser=await {chromium,firefox,webkit}[name].launch({headless:true,...(name==='chromium'&&process.env.QA_BROWSER_EXECUTABLE?{executablePath:process.env.QA_BROWSER_EXECUTABLE}:{}),args:name==='chromium'?['--enable-unsafe-swiftshader']:[]});
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));p.setDefaultTimeout(20000);await p.goto(base+'/#journeys');await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor();
  if(searchOnly){
   const coveredAnimalIds=await animalNavigation(browser,base,page=>page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor(),page=>page.on('pageerror',e=>report.errors.push(e.message)),shots);
   return {name,version:browser.version(),scope:'partial actual-engine keyboard search',keyboardNavigation:true,coveredAnimalIds,seconds:(performance.now()-started)/1000};
  }
  const solarReport={checks:[]};await solarFlow(browser,base,p=>p.locator('.model-solar-system').waitFor(),p=>p.on('pageerror',e=>report.errors.push(e.message)),solarReport,shots,{widths:[320,390,768,1440]});for(const file of await fs.readdir(shots))if(/^solar-caption-.*\.png$/.test(file))await fs.rename(path.join(shots,file),path.join(shots,'journey-engine-'+name+'-'+file));
  const animalReport={checks:[]};await animalFlow(browser,base,p=>p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor(),p=>p.on('pageerror',e=>report.errors.push(e.message)),animalReport,shots,{matrix:[320,390,768,1440]});for(const file of await fs.readdir(shots))if(/^animal-.*\.png$/.test(file))await fs.rename(path.join(shots,file),path.join(shots,'journey-engine-'+name+'-'+file));
  const journeySupport=await journeySupportView(p,{widths:[320,390,768,1440],shots,engine:name});
  for(const j of JOURNEYS){await p.evaluate(id=>location.hash='journeys/'+id+'/1',j.id);const inquiry=p.locator('[data-chapter-inquiry="'+j.id+':0"]');await inquiry.waitFor();const c=DATA.chapters.find(c=>c.id===j.id+':0'),q=c.tasks[2];await inquiry.locator('.journey-levels button').nth(2).click();await inquiry.locator('.quiz-answer').nth((q.correct+1)%3).click();assert.equal(await inquiry.getByText(q.why,{exact:true}).count(),0);await inquiry.locator('.quiz-answer').nth(q.correct).click();await inquiry.getByText(q.why,{exact:true}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);checked.push(c.id);}
  await p.evaluate(()=>location.hash='journeys/water/3');await p.locator('[data-chapter-inquiry="water:2"]').waitFor();await p.getByRole('button',{name:'Weiter entdecken',exact:true}).click();await p.locator('[data-chapter-inquiry="water:3"]').waitFor();await p.goBack();await p.locator('[data-chapter-inquiry="water:2"]').waitFor();await p.reload();await p.locator('[data-chapter-inquiry="water:2"]').waitFor();
  for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await p.locator('.journey-levels button').nth(1).focus();await p.screenshot({path:path.join(shots,'journey-engine-'+name+'-'+width+'.png'),fullPage:true,animations:'disabled'});}
  await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.journey-reader',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
  for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});historyViews.push(await historyEngineView(p,width,shots,{engine:name}));}
  const offlineResilienceProof=await offlineResilience(browser,{port:4778+index,shots,kind:name}),offlineRetentionProof=await offlineRetention(browser,{shots,kind:name});
  return {name,animalCoverage:animalReport.animalCoverage,solarCaptionCoverage:solarReport.solarCaptionCoverage,historyViews,journeySupport,offlineResilience:offlineResilienceProof,offlineRetention:offlineRetentionProof,version:browser.version(),chapters:checked,widths:[320,390,768,1440],seconds:(performance.now()-started)/1000};
 }finally{
  try{await browser?.close();}finally{await preserveEngineDiagnostics(shots,name);}
 }
}


try{
 for(let n=0;n<40&&!log.includes('WK_PREVIEW_READY');n++){if(server.exitCode!==null)throw Error(log);await new Promise(r=>setTimeout(r,100));}assert.ok(log.includes('WK_PREVIEW_READY'),log);
 if(searchOnly||serialLocal){
  for(const [index,name]of engines.entries())report.engines.push(await runEngine(name,index));
 }else{
  // Settle both engines naturally; one failure never hides the other's proof.
  const results=await Promise.allSettled(engines.map((name,index)=>runEngine(name,index)));
  const failures=[];
  for(const [index,result]of results.entries()){
   if(result.status==='fulfilled')report.engines.push(result.value);
   else failures.push({name:engines[index],error:result.reason?.stack??String(result.reason)});
  }
  if(failures.length){report.engineFailures=failures;throw new AggregateError(results.filter(r=>r.status==='rejected').map(r=>r.reason),'Actual engine checks failed');}
 }
 assert.deepEqual(report.errors,[]);report.status='passed';
}catch(error){report.status='failed';report.failure=error.stack;throw error;}
finally{
 server.kill('SIGTERM');await fs.mkdir('.qa-output',{recursive:true});
 const transferFailures=searchOnly?[]:await collectEngineEvidence('.qa-output',engines);
 if(transferFailures.length){report.status='failed';report.evidenceTransferFailures=transferFailures;}
 report.seconds=(performance.now()-started)/1000;
 await fs.writeFile('.qa-output/'+(searchOnly?'early-search-report.json':'engine-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 if(transferFailures.length)throw new AggregateError(transferFailures.map(f=>Error(f.error)),'Engine evidence could not be preserved without overwriting');
}
