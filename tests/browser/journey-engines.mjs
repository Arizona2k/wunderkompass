import {historyLearningEngine} from './history-learning.mjs';
import {preserveEngineDiagnostics} from './engine-diagnostics.mjs';
import {solarFlow} from './solar-comparison.mjs';
import {animalFlow,animalNavigation} from './animal-learning.mjs';
import {journeySupportView} from './journeys.mjs';
import JOURNEY_CONTENT from '../../app/journey-content.json' with {type:'json'};
import JOURNEY_SOURCES from '../../app/journey-sources.json' with {type:'json'};
import {historyEngineView} from './discovery-central.mjs';
import {offlineResilience} from './offline-resilience.mjs';
import {offlineRetention} from './offline-retention.mjs';
import {natureEngine} from './nature-learning.mjs';
import {buildingsEngine} from './building-learning.mjs';
import {inventionsEngine} from './inventions-learning.mjs';
import {whyEngineFlow} from './why-learning.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';
import JOURNEYS from '../../exports/content/journeys.json' with {type:'json'};
import DATA from '../../app/journey-inquiries.json' with {type:'json'};
import {sourceDigest} from '../../scripts/handoff.mjs';
import {bookEngineFlow} from './book-excellence.mjs';
import {chromium,firefox,webkit} from '../../qa/node_modules/playwright/index.mjs';
const searchOnly=process.argv.includes('--search-only');
const chosen=process.argv.find(a=>a.startsWith('--engine='))?.slice(9);if(chosen&&!['firefox','webkit'].includes(chosen))throw Error('Unknown actual engine');
const kinds=chosen?[chosen]:process.argv.includes('--chromium-pair')?['chromium','chromium']:process.argv.includes('--chromium-only')?['chromium']:['firefox','webkit'];
const serial=!process.argv.includes('--parallel')||process.argv.includes('--serial'),output=process.env.QA_ENGINE_OUTPUT_DIR??'.qa-output',port=Number(process.env.QA_ENGINE_PORT??4480);
if(!Number.isInteger(port)||port<1024||port>65534)throw Error('Invalid isolated engine port');
const report={build:(await fs.readFile('dist/index.html','utf8')).match(/name="learning-build" content="([^"]+)"/)?.[1],sourceDigest:await sourceDigest(),testedCommit:process.env.GITHUB_SHA??null,status:'running',scope:searchOnly?'partial actual-engine keyboard search':process.argv.includes('--ocean-sources-only')?'partial local ocean source regression':kinds.join('+'),scheduling:serial?'serial':'parallel isolated servers/profiles',engines:[],errors:[]};
await fs.mkdir(output,{recursive:true});const servers=new Set(),browsers=new Set(),started=performance.now();
process.once('SIGTERM',()=>{for(const server of servers)server.kill('SIGTERM');for(const browser of browsers)void browser.close();process.exitCode=143;});
// Run the changed source controls before unrelated book/model matrices. Every
// original chapter, width, keyboard and axe case remains, with real geometry.
async function verifyOceanSources(p,name){
 const oceanSourceViews=[],initialRoute=await p.evaluate(()=>location.hash),viewport=p.viewportSize(),wasLarge=await p.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading'));let witness=null;
 try{
 for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});
  for(const [index,step] of JOURNEY_CONTENT.journeys.find(j=>j.id==='ocean').steps.entries()){
   await p.evaluate(i=>location.hash='journeys/ocean/'+(i+1),index);await p.locator('[data-chapter-inquiry="ocean:'+index+'"]').waitFor();await p.getByText(step.whyItMatters,{exact:true}).waitFor();await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));
   const summary=p.locator('summary').filter({hasText:'Für Erwachsene: Quellen'}),details=summary.locator('..');if(!await details.evaluate(e=>e.open))await summary.click();
   const links=p.locator('.journey-source'),observed=await links.evaluateAll(a=>a.map(e=>e.getAttribute('href')));assert.deepEqual(observed,step.sourceIds.map(id=>JOURNEY_SOURCES[id].url));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   const targets=[];
   for(const a of await links.all()){
    await a.scrollIntoViewIfNeeded();
    const box=await a.boundingBox(),dom=await a.evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {height:r.height,left:r.left,right:r.right,font:parseFloat(s.fontSize),minHeight:s.minHeight};});
    witness={id:'ocean:'+index,width,href:await a.getAttribute('href'),box,dom};
    assert.ok(box&&box.height>=44&&box.x>=-2&&box.x+box.width<=width+2&&dom.height>=44&&dom.left>=-2&&dom.right<=width+2&&dom.font>=16,'readable chapter source touch target '+JSON.stringify(witness));targets.push(witness);
   }
   const first=links.first();await first.focus();await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');assert.ok(await first.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')));
   await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await details.evaluate(async el=>(await window.axe.run(el,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
   if(index===3&&[320,1440].includes(width))await details.screenshot({path:path.join(output,'journey-engine-'+name+'-ocean-sources-'+width+'.png'),animations:'disabled'});
   oceanSourceViews.push({id:'ocean:'+index,width,links:observed,targets,readable:true,axe:true,largeText:true,keyboard:true});
  }
 }
  return oceanSourceViews;
 }catch(error){
  await p.screenshot({path:path.join(output,'journey-engine-'+name+'-ocean-source-failure.png'),fullPage:true}).catch(()=>{});
  await fs.writeFile(path.join(output,'journey-engine-'+name+'-ocean-source-failure.json'),JSON.stringify({scope:'failed actual source geometry',build:report.build,sourceDigest:report.sourceDigest,testedCommit:report.testedCommit,route:p.url(),witness,error:error.stack},null,2));throw error;
 }finally{if(!wasLarge)await p.evaluate(()=>document.querySelector('.earth-app')?.classList.remove('large-reading'));await p.setViewportSize(viewport);await p.evaluate(hash=>location.hash=hash,initialRoute);if(initialRoute==='#journeys')await p.locator('.journey-filters input').waitFor();}
}
async function runEngine(kind,offset){
 const name=kinds.filter(k=>k===kind).length>1?kind+'-'+(offset+1):kind,base='http://127.0.0.1:'+(port+offset),started=performance.now(),checked=[],errors=[];
 const server=spawn(process.execPath,['tests/browser/preview-server.mjs'],{env:{...process.env,QA_PORT:String(port+offset)},stdio:['ignore','pipe','pipe']});servers.add(server);let log='',browser;
 server.stdout.on('data',b=>log+=b);server.stderr.on('data',b=>log+=b);
 try{
  for(let n=0;n<40&&!log.includes('WK_PREVIEW_READY');n++){if(server.exitCode!==null)throw Error(log);await new Promise(r=>setTimeout(r,100));}assert.ok(log.includes('WK_PREVIEW_READY'),log);
  browser=await {chromium,firefox,webkit}[kind].launch({headless:true,...(kind==='chromium'&&process.env.QA_BROWSER_EXECUTABLE?{executablePath:process.env.QA_BROWSER_EXECUTABLE}:{}),args:kind==='chromium'?['--enable-unsafe-swiftshader']:[]});browsers.add(browser);
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(20000);await p.goto(base+'/#journeys');await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor();
  if(searchOnly){const historyLearning=await historyLearningEngine(browser,base,{engine:name+'-early',shots:output});const coveredAnimalIds=await animalNavigation(browser,base,page=>page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor(),page=>page.on('pageerror',e=>errors.push(e.message)),output);assert.deepEqual(errors,[]);return {name,version:browser.version(),scope:'partial actual-engine keyboard search',historyLearning,keyboardNavigation:true,coveredAnimalIds,seconds:(performance.now()-started)/1000};}
  const sourcesStarted=performance.now(),oceanSourceViews=await verifyOceanSources(p,name),sourceSeconds=(performance.now()-sourcesStarted)/1000;console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'ocean-sources',seconds:sourceSeconds}));
  if(process.argv.includes('--ocean-sources-only'))return {name,version:browser.version(),scope:'partial local ocean source regression; not full acceptance',chapters:[],widths:[320,390,768,1440],oceanSourceViews,seconds:(performance.now()-started)/1000,port:port+offset};
  const solarReport={checks:[]};await solarFlow(browser,base,p=>p.locator('.model-solar-system').waitFor(),p=>p.on('pageerror',e=>errors.push(e.message)),solarReport,output,{widths:[320,390,768,1440]});for(const file of await fs.readdir(output))if(/^solar-caption-.*\.png$/.test(file))await fs.rename(path.join(output,file),path.join(output,'journey-engine-'+name+'-'+file));
  const animalStarted=performance.now(),animalReport={checks:[]};await animalFlow(browser,base,p=>p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor(),p=>p.on('pageerror',e=>errors.push(e.message)),animalReport,output,{matrix:[320,390,768,1440]});const animalSeconds=(performance.now()-animalStarted)/1000;for(const file of await fs.readdir(output))if(/^animal-.*\.png$/.test(file))await fs.rename(path.join(output,file),path.join(output,'journey-engine-'+name+'-'+file));console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'animals',seconds:animalSeconds}));
  const journeySupport=await journeySupportView(p,{widths:[320,390,768,1440],shots:output,engine:name});
  const journeyStarted=performance.now();console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'journeys',state:'started'}));
  for(const j of JOURNEYS){await p.evaluate(id=>location.hash='journeys/'+id+'/1',j.id);const inquiry=p.locator('[data-chapter-inquiry="'+j.id+':0"]');await inquiry.waitFor();await p.getByText(j.steps[0].whyItMatters,{exact:true}).waitFor();for(const [name,value] of [['Ganz einfach · etwa 6–8 Jahre',j.steps[0].starter],['Noch genauer · etwa 12–14 Jahre',j.steps[0].deeper],['Selbst beobachten und erklären · freiwillig',j.steps[0].observe]]){const summary=p.locator('summary').filter({hasText:name}),details=summary.locator('..');assert.equal(await details.evaluate(e=>e.open),false,'detail starts closed');await summary.click();await p.getByText(value,{exact:true}).waitFor();assert.equal(await details.evaluate(e=>e.open),true,'detail opens');await summary.click();assert.equal(await details.evaluate(e=>e.open),false,'detail closes for the next chapter');await p.getByText(value,{exact:true}).waitFor({state:'hidden'});}const c=DATA.chapters.find(c=>c.id===j.id+':0'),q=c.tasks[2];await inquiry.locator('.journey-levels button').nth(2).click();await inquiry.locator('.quiz-answer').nth((q.correct+1)%3).click();assert.equal(await inquiry.getByText(q.why,{exact:true}).count(),0);await inquiry.locator('.quiz-answer').nth(q.correct).click();await inquiry.getByText(q.why,{exact:true}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);checked.push(c.id);}
  await p.evaluate(()=>location.hash='journeys/water/3');await p.locator('[data-chapter-inquiry="water:2"]').waitFor();await p.getByRole('button',{name:'Weiter entdecken',exact:true}).click();await p.locator('[data-chapter-inquiry="water:3"]').waitFor();await p.goBack();await p.locator('[data-chapter-inquiry="water:2"]').waitFor();await p.reload();await p.locator('[data-chapter-inquiry="water:2"]').waitFor();
  for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await p.locator('.journey-levels button').nth(1).focus();await p.screenshot({path:path.join(output,'journey-engine-'+name+'-'+width+'.png'),fullPage:false,animations:'disabled'});}
  await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.journey-reader',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
  const journeySeconds=(performance.now()-journeyStarted)/1000;console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'journeys',seconds:journeySeconds}));
  const offlineStarted=performance.now(),offlineProof=await offlineResilience(browser,{port:port+offset+10,shots:output,kind});console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'offline',seconds:(performance.now()-offlineStarted)/1000}));await p.bringToFront();
  const bookStarted=performance.now(),bookProof=await bookEngineFlow(p,output,name);const bookSeconds=(performance.now()-bookStarted)/1000;console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'book',seconds:bookSeconds}));
  const whyStarted=performance.now(),whyProof=await whyEngineFlow(p);const whySeconds=(performance.now()-whyStarted)/1000;console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'why',seconds:whySeconds}));
  const retentionProof=await offlineRetention(browser,{shots:output,kind});
  const natureStarted=performance.now(),natureProof=await natureEngine(p,{engine:name,shots:output}),natureSeconds=(performance.now()-natureStarted)/1000;console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'nature',seconds:natureSeconds}));
  assert.deepEqual(errors,[]);
  const inventionStarted=performance.now(),inventionProof=await inventionsEngine(browser,base,{engine:name,shots:output}),inventionSeconds=(performance.now()-inventionStarted)/1000;console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'inventions',seconds:inventionSeconds}));
  const historyViews=[];for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});historyViews.push(await historyEngineView(p,width,output,{engine:name}));}
 const buildingStarted=performance.now(),buildingProof=await buildingsEngine(browser,base,{engine:name,shots:output}),buildingSeconds=(performance.now()-buildingStarted)/1000;console.log('ENGINE_PHASE',JSON.stringify({engine:name,phase:'buildings',seconds:buildingSeconds}));
  const historyLearning=await historyLearningEngine(browser,base,{engine:name,shots:output});
  return {name,historyLearning,animalCoverage:animalReport.animalCoverage,solarCaptionCoverage:solarReport.solarCaptionCoverage,journeySupport,historyViews,oceanSourceViews,version:browser.version(),chapters:checked,widths:[320,390,768,1440],...bookProof,...whyProof,...natureProof,...inventionProof,...buildingProof,offlineRetention:retentionProof,offlineResilience:offlineProof,phaseSeconds:{animals:animalSeconds,oceanSources:sourceSeconds,journeys:journeySeconds,book:bookSeconds,why:whySeconds,nature:natureSeconds,inventions:inventionSeconds,buildings:buildingSeconds},seconds:(performance.now()-started)/1000,port:port+offset};
 }catch(error){console.error('ENGINE_CHECK_FAILURE',JSON.stringify({engine:name,error:error.stack}));throw error;
 }finally{try{await preserveEngineDiagnostics(output,kind,{phase:searchOnly?'early-search':'full'});}finally{await browser?.close();if(browser)browsers.delete(browser);server.kill('SIGTERM');servers.delete(server);}}
}
try{
 const outcomes=serial?await (async()=>{const results=[];for(const [i,kind] of kinds.entries()){try{results.push({status:'fulfilled',value:await runEngine(kind,i)});}catch(reason){results.push({status:'rejected',reason});}}return results;})():await Promise.allSettled(kinds.map(runEngine));
 for(const outcome of outcomes){if(outcome.status==='fulfilled')report.engines.push(outcome.value);else report.errors.push(outcome.reason?.stack??String(outcome.reason));}
 if(report.engines.length!==kinds.length||report.errors.length)throw Error('Incomplete or failed actual engine checks: '+report.errors.join('\n'));
 assert.equal(report.sourceDigest,await sourceDigest(),'source remains unchanged throughout engine checks');report.status='passed';
}catch(error){report.status='failed';report.failure=error.stack;throw error;}
finally{for(const browser of browsers)await browser.close();for(const server of servers)server.kill('SIGTERM');report.seconds=(performance.now()-started)/1000;await fs.writeFile(path.join(output,searchOnly?'early-search-report.json':'engine-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));}
