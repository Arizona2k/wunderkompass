import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import catalog from '../../app/world-catalog.json' with {type:'json'};
import dossier from '../../content/building-editorial-review.json' with {type:'json'};
import {prepareAxe} from './axe-loader.mjs';
import {captureNativeViewport} from './native-screenshot.mjs';
await import('../../scripts/test-runtime.mjs');
const {createSave,SAVE_KEY}=await import('../../app/progress-storage.ts');
const topics=catalog.filter(t=>t.category==='buildings');
const widths=[320,360,390,768,1024,1440,1920];
const reveal=async d=>{if(!await d.evaluate(e=>e.open))await d.locator(':scope > summary').click();};
async function open(p,t){await p.evaluate(id=>location.hash='world/topic/'+id,t.id);const card=p.locator('.article-buildings');await card.getByRole('heading',{name:t.title,exact:true}).waitFor();await card.locator('.world-mini-question').waitFor();return card;}
async function geometry(card,label){const r=await card.evaluate(root=>({page:document.documentElement.scrollWidth>innerWidth+2,bad:[...root.querySelectorAll('h2,h3,h4,p,button,summary,.building-legend li')].filter(e=>e.getClientRects().length&&(!e.closest('details:not([open])')||e.matches('summary'))).filter(e=>{const r=e.getBoundingClientRect();return r.left< -2||r.right>innerWidth+2||e.scrollWidth>e.clientWidth+2||e.matches('button,summary')&&r.height<44;}).map(e=>e.tagName+': '+e.textContent.slice(0,70))}));assert.equal(r.page,false,label+' page overflow');assert.deepEqual(r.bad,[],label+' readable text and44px controls');}
export async function exerciseBuilding(p,t,{width,shots,full=true,seeded=false}={}){
 const card=await open(p,t),steps=[],variants=[];
 const model=card.locator('.building-discovery');
 if(t.building.exploration){await model.waitFor();for(let i=0;i<3;i++){await model.locator('.structure-buttons button').nth(i).focus();await p.keyboard.press('Enter');await model.locator('.model-result').filter({hasText:t.building.exploration.steps[i]}).waitFor();assert.equal(await model.getAttribute('data-building-step'),String(i));
   const kind=t.building.exploration.kind,layer=kind==='timber'?'[data-brackets]':kind==='earth'?'[data-surface]':kind==='rock-cut'?'[data-cut-space]':kind==='temple-water'?'[data-moat]':null;
   if(layer)assert.equal(await model.locator(layer).count(),i>0?1:0,'actual construction layer follows step');
   if(kind==='aqueduct')assert.equal(await model.locator('[data-arch-row]').count(),i+1);
   if(kind==='dry-stone')assert.equal(await model.locator('[data-houses]').count(),i===2?1:0);
   if(kind==='shells')assert.equal(await model.locator('[data-circle-arc]').count(),i>0?2:0);
   if(kind==='corbel'){const w=Number(await model.locator('[data-corbel-row="3"] rect').first().getAttribute('width'));assert.equal(i===0?w===115:w>115,true,'actual stone rows move inward');}
   for(const text of await model.locator('[data-building-marker] text').all())assert.equal(await text.evaluate(e=>getComputedStyle(e).stroke),'none','marker numbers are not overpainted by inherited path strokes');
   steps.push(i);}
  for(const li of await model.locator('.building-legend li').all())assert.ok(await li.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  const d=model.locator('.building-comparison');if(await d.count()){await reveal(d);const buttons=d.locator('.model-buttons button');let previous=null;for(let i=0;i<await buttons.count();i++){await buttons.nth(i).focus();await p.keyboard.press('Enter');assert.equal(await buttons.nth(i).getAttribute('aria-pressed'),'true');const actual=await model.locator('svg').evaluate((svg,kind)=>{if(kind==='aqueduct')return svg.querySelector('[data-flow]').getAttribute('data-flow');if(kind==='corbel')return Number(svg.querySelector('[data-clearance]').getAttribute('data-clearance'));const arc=svg.querySelector('[data-circle-arc=variable]').getAttribute('d'),nums=arc.match(/-?\d+(?:\.\d+)?/g).map(Number),x=nums.at(-2),y=nums.at(-1);return{arc,radius:Math.hypot(x-300,y-180)};},t.building.exploration.kind);
    if(t.building.exploration.kind==='aqueduct')assert.equal(actual,i===0?'toward-city':'no-gravity-route');
    else if(t.building.exploration.kind==='corbel')assert.equal(actual,[126,78,30][i]);
    else assert.ok(Math.abs(actual.radius-150)<1e-7,'both endpoints stay on same radius');
    if(previous!==null)assert.notDeepEqual(actual,previous,'control changes actual geometry, not just button');previous=actual;variants.push(i);
  }}
  if(shots&&[320,1440].includes(width))await model.screenshot({path:path.join(shots,'building-model-'+t.id+'-'+width+'.png'),animations:'disabled'});
  const lastLine=await model.locator('.model-result').evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);const lines=[...r.getClientRects()].filter(x=>x.width>0);return{count:lines.length,last:lines.at(-1)?.width,font:parseFloat(getComputedStyle(e).fontSize)};});
  if(lastLine.count>1)assert.ok(lastLine.last>=lastLine.font,t.id+' '+width+': no stranded single-letter ending');
 }
 if(full){for(const [label,text] of [['Ganz einfach · etwa 6–8 Jahre',t.learning.starter],['Selbst beobachten und erklären · freiwillig',t.learning.observe],['Noch genauer · etwa 12–14 Jahre',t.more[0]]]){const d=card.locator('details').filter({has:p.getByText(label,{exact:true})}).last();await reveal(d);await d.getByText(text,{exact:true}).waitFor();}
  const q=card.locator('.world-mini-question');await reveal(q.locator('.world-game-hint'));await q.getByText(t.questionFeedback.hint,{exact:true}).waitFor();
  if(seeded&&!t.building.exploration)assert.deepEqual(await q.locator('.quiz-answer > span:nth-child(2)').allTextContents(),[...t.question.answers].reverse(),'retained shuffled choices keep their order');
  if(await q.getByRole('button',{name:'Später noch einmal prüfen',exact:true}).count())await q.getByRole('button',{name:'Später noch einmal prüfen',exact:true}).click();
  for(let i=0;i<t.question.answers.length;i++)if(i!==t.question.correct){await q.getByRole('button',{name:t.question.answers[i],exact:false}).click();await q.getByText(t.questionFeedback.wrongReasons[i],{exact:true}).waitFor();await geometry(q,t.id+' wrong answer');}
  await q.getByRole('button',{name:t.question.answers[t.question.correct],exact:false}).click();await q.getByText(t.question.why,{exact:true}).waitFor();
  const sources=card.locator('.world-sources');await reveal(sources);for(const s of t.sources)assert.equal(await sources.getByRole('link',{name:s.label,exact:true}).getAttribute('href'),s.url);
 }
 await geometry(card,t.id+' '+width);
 return {id:t.id,width,kind:t.building.exploration?.kind??'retained',steps,variants,effectsVerified:true};
}
async function retainFailure(p,shots,error){if(shots&&!p.isClosed()){await p.screenshot({path:path.join(shots,'building-failure.png'),fullPage:true,timeout:5000}).catch(()=>{});await fs.writeFile(path.join(shots,'building-failure.json'),JSON.stringify({url:p.url(),error:String(error.stack??error)},null,2)).catch(()=>{});}}
export async function buildingsFlow(browser,base,ready,monitor,report,shots,{matrix=widths,navigation=true}={}){
 const observed=[];
 for(const width of matrix){const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  const pass=createSave();pass.progress.favorites=['topic:building-giza-pyramids'];pass.progress.gameSessions['world:technology']={items:['invention-car','invention-light'],index:1};for(const t of topics.filter(t=>!t.building.exploration))pass.progress.gameSessions['topic:'+t.id]={items:[...t.question.answers].reverse(),topicAnswer:t.question.answers[1],buildingStructure:2,buildingSectionsSeen:[0,2]};
  await c.addInitScript(({pass,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));},{pass,key:SAVE_KEY});
  try{await p.goto(base+'#world/topic/building-pont-du-gard');await ready(p);for(const t of topics)observed.push(await exerciseBuilding(p,t,{width,shots,seeded:true}));
   const current=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.deepEqual(current.favorites,pass.progress.favorites);assert.deepEqual(current.gameSessions['world:technology'],pass.progress.gameSessions['world:technology']);for(const t of topics.filter(t=>!t.building.exploration)){assert.equal(current.gameSessions['topic:'+t.id].buildingStructure,2);assert.deepEqual(current.gameSessions['topic:'+t.id].buildingSectionsSeen,[0,2]);}
   if(width===320){await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));for(const t of topics){const card=await open(p,t);await geometry(card,'large '+t.id);}await open(p,topics.at(-1));await p.locator('.building-discovery').screenshot({path:shots+'/building-large-320.png'});}
   if([320,1440].includes(width)){await prepareAxe(p);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.article-buildings',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);}
   console.log('Buildings viewport',width,topics.length,'topics passed');
  }catch(e){await retainFailure(p,shots,e);throw e;}finally{await c.close();}
 }
 if(navigation){const c=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'}),p=await c.newPage();monitor(p);try{await p.goto(base);await ready(p);for(const t of topics){await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(t.title);await p.getByRole('option').filter({has:p.getByText(t.title,{exact:true})}).click();await p.reload();const card=await open(p,t);const edge=dossier.newConnections.find(e=>e.from===t.id||e.to===t.id);if(edge){const other=catalog.find(x=>x.id===(edge.from===t.id?edge.to:edge.from)),b=card.locator('.knowledge-network .knowledge-link').filter({hasText:other.title});await b.focus();await p.keyboard.press('Enter');await p.locator('.knowledge-network').getByText(edge.why,{exact:true}).waitFor();await p.goBack();await p.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,'world-connection-'+t.id+'-'+other.id);}}}catch(e){await retainFailure(p,shots,e);throw e;}finally{await c.close();}}
 report.buildingCoverage={ids:topics.map(t=>t.id),widths:matrix,observed,navigationChecked:navigation,retainedSaves:true,independentAcceptance:false};report.checks.push('All16 building explanations, actual new geometry, specific feedback, sources, retained shuffled choices/model states/favorites, touch/keyboard reflow and search/back paths');
}
export async function buildingsNativeZoom(chromium,options,base,report,shots){const profile=path.join(shots,'building-native-profile');await fs.mkdir(path.join(profile,'Default'),{recursive:true});await fs.writeFile(path.join(profile,'Default','Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(2)/Math.log(1.2)}}}));const c=await chromium.launchPersistentContext(profile,{...options,...(!options.executablePath?{channel:'chromium'}:{}),viewport:{width:1280,height:900},reducedMotion:'reduce'}),p=c.pages()[0];try{await p.goto(base+'#world/topic/building-pont-du-gard');await p.locator('.world-mini-question').waitFor();const dimensions=await p.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));assert.equal(dimensions.cssWidth,640);assert.equal(dimensions.scale,2);await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));const observed=[];for(const t of topics)observed.push(await exerciseBuilding(p,t,{width:640}));await open(p,topics.at(-1));await p.locator('.building-comparison').scrollIntoViewIfNeeded();const screenshot=await captureNativeViewport(p,shots+'/building-native-200-large.png');report.buildingNativeZoom={...dimensions,percent:200,observed,screenshot,largeTextAlsoChecked:true};}catch(e){await retainFailure(p,shots,e);throw e;}finally{await c.close();}}
export async function offlineBuildings(p,report){const observed=[];for(const t of topics)observed.push(await exerciseBuilding(p,t,{width:1280,full:false}));report.buildingsOffline={coldRestart:true,observed};}
export async function buildingsEngine(browser,base,{engine,shots}){const report={checks:[]};await buildingsFlow(browser,base,p=>p.locator('.world-mini-question').waitFor(),()=>{},report,shots,{matrix:[320,390,768,1440],navigation:false});for(const file of await fs.readdir(shots))if(/^building-(?:model-|large-320)/.test(file)&&file.endsWith('.png'))await fs.rename(path.join(shots,file),path.join(shots,'journey-engine-'+engine+'-'+file));return{buildingObserved:report.buildingCoverage.observed,buildingIds:topics.map(t=>t.id)};}
