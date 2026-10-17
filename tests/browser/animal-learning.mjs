import {exerciseSolar} from './solar-comparison.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import review from '../../content/animal-editorial-review.json' with {type:'json'};
import DATA from '../../app/animal-inquiries.json' with {type:'json'};
import catalog from '../../app/world-catalog.json' with {type:'json'};
import {prepareAxe} from './axe-loader.mjs';
import {captureNativeViewport} from './native-screenshot.mjs';
await import('../../scripts/test-runtime.mjs');
const {createSave,SAVE_KEY}=await import('../../app/progress-storage.ts');
const widths=[320,360,390,768,1024,1440,1920];
const topics=catalog.filter(t=>DATA.entries.some(e=>e.id===t.id));

async function geometry(root,label){
 const result=await root.evaluate(root=>({overflow:document.documentElement.scrollWidth>innerWidth+2,bad:[...root.querySelectorAll('p,h3,h4,button,summary')].filter(e=>e.getClientRects().length&&(!e.closest('details:not([open])')||e.closest('details:not([open])')?.querySelector(':scope > summary')===e)).flatMap(e=>{const r=e.getBoundingClientRect();return r.left< -2||r.right>innerWidth+2||e.scrollWidth>e.clientWidth+2||(e.matches('button,summary')&&r.height<44)?[{text:e.textContent.slice(0,65),x:r.x,width:r.width,height:r.height}]:[];})}));
 assert.equal(result.overflow,false,label+' page overflow');assert.deepEqual(result.bad,[],label+' readable text and44px controls');
}
export async function exerciseAnimal(p,data,{width,shots,keyboard=false,state='normal'}={}){
 await p.evaluate(id=>location.hash='world/topic/'+id,data.id);
 const root=p.locator('[data-animal-inquiry="'+data.id+'"]');await root.waitFor({state:'attached'});
 if(!await root.evaluate(e=>e.open))await root.locator(':scope > summary').click();
 await root.getByRole('heading',{name:data.goal,exact:true}).waitFor();
 const levels=root.locator('.animal-inquiry-levels button');
 for(let level=0;level<3;level++){
  if(keyboard){await levels.nth(level).focus();await p.keyboard.press('Enter');}else await levels.nth(level).click();
  assert.equal(await levels.nth(level).getAttribute('aria-pressed'),'true');
  if(level===0){for(let i=0;i<2;i++){const b=root.locator('.animal-evidence-row button').nth(i);if(await b.getAttribute('aria-expanded')!=='true')await b.click();await root.getByText(data.evidence[i].text,{exact:true}).waitFor();}}
  else{
   const q=level===1?data.reason:data.transfer,task=root.locator('.animal-reason-task');
   await task.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
   const hint=task.locator('details');if(!await hint.evaluate(e=>e.open))await hint.locator('summary').click();await hint.getByText(q.hint,{exact:true}).waitFor();
   await task.locator('.quiz-answer').nth(1-q.correct).click();await task.getByText('Prüfe die Aussage noch einmal.',{exact:true}).waitFor();await task.locator('.lab-feedback').getByText(q.feedback[1-q.correct],{exact:true}).waitFor();
   await task.locator('.quiz-answer').nth(q.correct).click();await task.getByText('Gut begründet.',{exact:true}).waitFor();await task.locator('.lab-feedback').getByText(q.feedback[q.correct],{exact:true}).waitFor();
  }
  await geometry(root,data.id+' '+width+' level'+level);
  if(shots&&data.id==='animal-whale-shark')await root.screenshot({path:path.join(shots,'animal-workshop-'+state+'-'+level+'-'+width+'.png'),animations:'disabled'});
 }
 return {id:data.id,width,state,levels:[0,1,2],bothEvidence:true,wrongAndCorrect:true,keyboard,geometry:true};
}
export async function animalFlow(browser,base,ready,monitor,report,shots,{matrix=widths}={}){
 const observed=[],start=performance.now();
 for(const width of matrix){
  const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  const pass=createSave();pass.progress.favorites=['topic:animal-polar-bear'];pass.progress.notes=[{id:'animal-test-note',text:'Synthetische alte Notiz',at:'2026-10-17T07:00:00.000Z'}];pass.progress.gameSessions['world:animal-detective']={items:['animal-lion','animal-polar-bear'],index:1,roundAnswer:'alte Antwort'};
  for(const t of topics)pass.progress.gameSessions['topic:'+t.id]={items:[...t.question.answers].reverse(),topicAnswer:t.question.answers[t.question.correct],compareAnimal:true};
  await c.addInitScript(({key,pass})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));},{key:SAVE_KEY,pass});
  try{
   await p.goto(base+'#world/topic/'+DATA.entries[0].id);await ready(p);
   for(const data of DATA.entries)observed.push(await exerciseAnimal(p,data,{width,shots,keyboard:true}));
   const before=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
   for(const t of topics)for(const [key,value]of Object.entries(pass.progress.gameSessions['topic:'+t.id]))assert.deepEqual(before.gameSessions['topic:'+t.id][key],value,'retained original '+key+' '+t.id);
   for(const key of ['favorites','notes'])assert.deepEqual(before[key],pass.progress[key]);assert.deepEqual(before.gameSessions['world:animal-detective'],pass.progress.gameSessions['world:animal-detective']);
   await p.reload();await ready(p);const data=DATA.entries.at(-1),root=p.locator('[data-animal-inquiry="'+data.id+'"]');await root.locator(':scope > summary').click();await root.getByText('Gut begründet.',{exact:true}).waitFor();assert.equal(await root.locator('.animal-inquiry-levels button').nth(2).getAttribute('aria-pressed'),'true','selected level survives reload');
   const after=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.deepEqual(after.gameSessions,before.gameSessions,'every old and new session key survives reload');
   await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));
   for(const data of DATA.entries)observed.push(await exerciseAnimal(p,data,{width,shots,keyboard:true,state:'large'}));
   const audit=p.locator('.animal-inquiry');for(let i=0;i<3;i++){await audit.locator('.animal-inquiry-levels button').nth(i).click();await prepareAxe(p);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.animal-inquiry',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[],'workshop axe level'+i);}
   await audit.locator('.animal-inquiry-levels button').nth(2).focus();await audit.screenshot({path:path.join(shots,'animal-workshop-focus-'+width+'.png'),animations:'disabled'});
   console.log('Animal workshop',width,DATA.entries.length,'cards passed');
  }catch(error){await p.screenshot({path:path.join(shots,'animal-failure-'+width+'.png'),fullPage:true,timeout:5000}).catch(()=>{});throw error;}finally{await c.close();}
 }
 await animalNavigation(browser,base,ready,monitor);
 report.animalCoverage={observed,seconds:(performance.now()-start)/1000,oldSessionsPreserved:true,largeText:true,axe:true,independentAcceptance:false,navigation:true};
 report.checks.push('24 existing animal cards: individual evidence, three voluntary thinking paths,48 reasoning tasks, wrong/correct feedback, keyboard, large text, axe and old/new session reload at'+matrix.join('/'));
}
export async function animalNativeZoom(chromium,options,base,report,shots){
 const profile=path.join(shots,'animal-native-profile');await fs.mkdir(path.join(profile,'Default'),{recursive:true});await fs.writeFile(path.join(profile,'Default','Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(2)/Math.log(1.2)}}}));
 const c=await chromium.launchPersistentContext(profile,{...options,...(!options.executablePath?{channel:'chromium'}:{}),viewport:{width:1280,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}),p=c.pages()[0];
 try{await p.bringToFront();await p.goto(base+'#world/topic/'+DATA.entries[0].id);await p.locator('.world-mini-question').waitFor();const dimensions=await p.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));assert.deepEqual(dimensions,{cssWidth:640,scale:2});await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));const observed=[];for(const data of DATA.entries)observed.push(await exerciseAnimal(p,data,{width:640,keyboard:true,state:'large'}));const solarCaptures=[];report.solarNativeCoverage={observed:await exerciseSolar(p,{width:640,state:'large',shots,capture:async file=>{const shot=await captureNativeViewport(p,file);solarCaptures.push(shot);return shot;}}),percent:200,cssWidth:640,scale:2,captures:solarCaptures};await p.evaluate(id=>location.hash='world/topic/'+id,DATA.entries.at(-1).id);await p.locator('.animal-inquiry').locator(':scope > summary').click();await p.locator('.animal-inquiry').scrollIntoViewIfNeeded();const screenshot=await captureNativeViewport(p,shots+'/animal-native-200-large-640.png');report.animalNativeZoom={...dimensions,percent:200,screenshot,cards:DATA.entries.length,observed};}finally{await c.close();}
}
export async function offlineAnimals(p,report){const observed=[];for(const data of DATA.entries)observed.push(await exerciseAnimal(p,data,{width:1280,keyboard:true,state:'offline'}));report.animalOffline={cards:DATA.entries.length,coldRestart:true,observed};report.checks.push('All24 animal workshops usable after real server shutdown and cold offline browser restart');}

async function animalNavigation(browser,base,ready,monitor){
 const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage();monitor(p);
 try{await p.goto(base);await ready(p);for(const entry of DATA.entries){
  const t=topics.find(t=>t.id===entry.id);
  await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(t.title);await p.getByRole('option').filter({has:p.getByText(t.title,{exact:true})}).click();await p.locator('[data-animal-inquiry="'+entry.id+'"]').waitFor({state:'attached'});await p.reload();await ready(p);
  const edge=review.newConnections.find(e=>e.fromId===entry.id||e.toId===entry.id);assert.ok(edge,'individual explained context '+entry.id);const otherId=edge.fromId===entry.id?edge.toId:edge.fromId;
  const selector='[data-route-focus="world-connection-'+entry.id+'-'+otherId+'"]';await p.locator(selector).click();await p.getByRole('heading',{name:catalog.find(t=>t.id===otherId).title,exact:true}).waitFor();
  await p.goBack();await p.locator('[data-animal-inquiry="'+entry.id+'"]').waitFor({state:'attached'});await p.waitForFunction(selector=>document.activeElement?.matches(selector),selector);
 }
 }finally{await c.close();}
}
