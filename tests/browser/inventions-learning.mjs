import {exerciseInventionExperiment} from './invention-experiments.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import catalog from '../../app/world-catalog.json' with {type:'json'};
import dossier from '../../content/invention-editorial-review.json' with {type:'json'};
import connections from '../../app/world-connections.json' with {type:'json'};
import {prepareAxe} from './axe-loader.mjs';
import {captureNativeViewport} from './native-screenshot.mjs';
await import('../../scripts/test-runtime.mjs');
const {createSave,SAVE_KEY}=await import('../../app/progress-storage.ts');
const topics=catalog.filter(t=>t.category==='inventions'),widths=[320,360,390,768,1024,1440,1920];
const reveal=async d=>{if(!await d.evaluate(e=>e.open))await d.locator(':scope > summary').click();};
async function open(p,id){await p.evaluate(id=>location.hash='world/topic/'+id,id);const card=p.locator('.article-inventions');await card.getByRole('heading',{name:topics.find(t=>t.id===id).title,exact:true}).waitFor();await card.locator('.world-mini-question').waitFor();return card;}
async function geometry(p,card,label){
 const result=await card.evaluate(root=>{
  const clipped=[],small=[];
  for(const el of root.querySelectorAll('h2,h3,h4,p,summary,button,label')){
   if(!el.getClientRects().length||el.closest('details:not([open])')&&!el.closest('summary'))continue;
   const r=el.getBoundingClientRect();if(r.width&&(r.left< -2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+2))clipped.push(el.tagName+': '+el.textContent.slice(0,60));
   if(el.matches('button,summary')&&r.width&&r.height<44)small.push(el.textContent.slice(0,60));
  }
  return{overflow:document.documentElement.scrollWidth>innerWidth+2,clipped,small};
 });assert.equal(result.overflow,false,label+' page reflow');assert.deepEqual(result.clipped,[],label+' text/controls not clipped');assert.deepEqual(result.small,[],label+'44px alternative HTML controls');
}
async function exercise(p,card,t,{seeded=false,shots,width}={}){
 if(seeded){assert.equal(await card.locator('.story-stations button').nth(4).getAttribute('aria-pressed'),'true');if(!t.invention.walkthrough)assert.equal(await card.getByRole('button',{name:'Heute',exact:true}).getAttribute('aria-pressed'),'true');await card.locator('.part-explanation h4').filter({hasText:t.invention.parts.at(-1).name}).waitFor();}
 for(const [label,text]of[['Ganz einfach · etwa 6–8 Jahre',t.learning.starter],['Selbst beobachten und erklären · freiwillig',t.learning.observe],['Noch genauer · etwa 12–14 Jahre',t.more[0]]]){const d=card.locator('details').filter({has:p.getByText(label,{exact:true})}).last();await reveal(d);await d.getByText(text,{exact:true}).waitFor();}
 assert.equal(await card.locator('.journey-observation').innerText(),'Warum hilft dir das? '+t.learning.benefit);
 for(let i=0;i<t.invention.stages.length;i++){const b=card.locator('.story-stations button').nth(i);await b.focus();await p.keyboard.press('Enter');await card.locator('.story-panel p').filter({hasText:t.invention.stages[i].text}).waitFor();}
 if(!t.invention.walkthrough)for(const today of [false,true]){await card.getByRole('button',{name:today?'Heute':'Damals',exact:true}).click();const alt=await card.locator('.technology-picture svg').getAttribute('aria-label');assert.ok(alt.startsWith(today?'Heute:':'Damals:'));}
 for(const part of t.invention.parts){const b=card.locator('.blueprint-parts .part-button').nth(t.invention.parts.indexOf(part));await b.focus();await p.keyboard.press('Enter');await card.locator('.part-explanation h4').filter({hasText:part.name}).waitFor();assert.equal(await card.locator('.part-hotspot[aria-pressed=true]').getAttribute('aria-label'),'Bauteil '+(t.invention.parts.indexOf(part)+1)+': '+part.name);assert.equal(await card.locator('.part-explanation p').innerText(),part.description);}
 if(width===320&&await p.evaluate(()=>navigator.maxTouchPoints>0)){await card.locator('.part-button').first().tap();await card.locator('.part-explanation h4').filter({hasText:t.invention.parts[0].name}).waitFor();await card.locator('.part-button').last().focus();await p.keyboard.press('Enter');}
 for(let i=0;i<t.invention.parts.length;i++){assert.equal(await card.locator('.part-button .part-number').nth(i).innerText(),String(i+1),'part number remains readable after exploration');assert.ok(await card.locator('.part-button .part-name').nth(i).evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16),'readable HTML part name instead of tiny SVG-only text');const lines=await card.locator('.part-button .part-name').nth(i).evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);return{widths:[...r.getClientRects()].filter(r=>r.width>0).map(r=>r.width),font:parseFloat(getComputedStyle(el).fontSize)};});if(lines.widths.length>1)assert.ok(lines.widths.at(-1)>=lines.font,t.id+' '+width+' '+t.invention.parts[i].name+': wrapped part name does not end with a stranded single letter');}
 const model=await exerciseInventionExperiment(p,card,t);
 const q=card.locator('.world-mini-question');await reveal(q.locator('.world-game-hint'));await q.getByText(t.questionFeedback.hint,{exact:true}).waitFor();
 for(let i=0;i<t.question.answers.length;i++)if(i!==t.question.correct){await q.getByRole('button',{name:t.question.answers[i],exact:false}).click();await q.getByText(t.questionFeedback.wrongReasons[i],{exact:true}).waitFor();assert.equal(await q.getByText(t.question.why,{exact:true}).count(),0,'wrong answer never uses correct feedback');await geometry(p,q,t.id+' wrong '+i);}
 await q.getByRole('button',{name:t.question.answers[t.question.correct],exact:false}).click();await q.getByText(t.question.why,{exact:true}).waitFor();
 const sources=card.locator('.world-sources');await reveal(sources);await sources.getByText(t.sourceNote,{exact:true}).waitFor();for(const source of t.sources)assert.equal(await sources.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
 await geometry(p,card,t.id+' '+width);
 if(shots&&[320,1440].includes(width)){await card.locator('.invention-blueprint').screenshot({path:shots+'/invention-model-'+t.id+'-'+width+'.png'});if(model)await card.locator('[data-invention-experiment]').screenshot({path:shots+'/invention-experiment-'+t.id+'-'+width+'.png',animations:'disabled'});}
 return model;
}
export async function inventionsFlow(browser,base,ready,monitor,report,shots){
 const observed=[],modelObserved=[];
 for(const width of widths){
  const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  const pass=createSave();pass.progress.favorites=['topic:invention-car'];pass.progress.gameSessions['world:technology']={items:topics.slice(0,5).map(t=>t.id),index:2};
  for(const t of topics)pass.progress.gameSessions['topic:'+t.id]={storyStage:4,selectedPart:t.invention.parts.at(-1).id,partsSeen:[t.invention.parts.at(-1).id],compareToday:true,items:[...t.question.answers].reverse(),topicAnswer:t.question.answers[1]};
  await c.addInitScript(({pass,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));},{pass,key:SAVE_KEY});
  try{
   await p.goto(base+'#world/topic/invention-light');await ready(p);
   for(const t of topics){const card=await open(p,t.id);const model=await exercise(p,card,t,{seeded:true,shots,width});if(model)modelObserved.push(model);observed.push({id:t.id,width});}
   if(width===768){await open(p,'invention-refrigerator');await p.locator('.invention-blueprint').screenshot({path:shots+'/invention-labels-fridge-768.png'});}
   const saved=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.deepEqual(saved.favorites,pass.progress.favorites);assert.deepEqual(saved.gameSessions['world:technology'],pass.progress.gameSessions['world:technology']);
   if([320,1440].includes(width)){await prepareAxe(p);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.article-inventions',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);}
   if(width===320){await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));for(const t of topics)await geometry(p,await open(p,t.id),'large '+t.id);await open(p,'invention-battery');await p.locator('.story-stations').screenshot({path:shots+'/invention-steps-large-320.png'});await open(p,'invention-smartphone');await p.locator('.world-short').screenshot({path:shots+'/invention-large-320.png'});}
   console.log('Inventions viewport',width,topics.length+' topics and '+topics.filter(t=>t.invention.model).length+' complete models passed');
  }finally{await c.close();}
 }
 const c=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
 try{
  await p.goto(base+'#world/topic/invention-light');await ready(p);
  for(const t of topics){await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(t.title);await p.getByRole('option').filter({has:p.getByText(t.title,{exact:true})}).click();assert.equal(new URL(p.url()).hash,'#world/topic/'+t.id);const card=await open(p,t.id);await p.reload();await card.locator('.world-mini-question').waitFor();const linkInfo=dossier.newConnections.find(e=>e.from===t.id),other=catalog.find(e=>e.id===linkInfo.to),link=card.locator('.knowledge-network .knowledge-link').filter({hasText:other.title});await link.focus();await p.keyboard.press('Enter');await p.getByRole('heading',{name:other.title,exact:true}).waitFor();await p.locator('.knowledge-network').getByText(linkInfo.why,{exact:true}).waitFor();const reverse=p.locator('[data-route-focus="world-connection-'+other.id+'-'+t.id+'"]');await reverse.focus();await p.keyboard.press('Enter');await card.locator('.world-mini-question').waitFor();await p.goBack();await p.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,'world-connection-'+other.id+'-'+t.id);await p.goBack();await p.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,'world-connection-'+t.id+'-'+other.id);assert.ok(connections.connections.some(e=>e.fromId===t.id&&e.toId===other.id));}
 }finally{await c.close();}
 report.inventionCoverage={ids:topics.map(t=>t.id),widths,observed,modelObserved,retainedQuestionsAndSaves:true,reciprocalBackFocus:true,independentAcceptance:false};report.checks.push('All24 inventions at seven widths:12 stable banks with documented prompt corrections and unchanged mechanics plus12 new concepts, voluntary age/observation levels, six specific experiments/all qualitative states, every keyboard part, shuffled wrong-specific/right feedback, old saves, explained reciprocal connections/Back focus, large text and axe');
}
export async function offlineInventions(p,report){const models=[];for(const t of topics){const card=await open(p,t.id);assert.equal(await card.locator('.journey-observation').innerText(),'Warum hilft dir das? '+t.learning.benefit);const b=card.locator('.blueprint-parts .part-button').first();await b.click();await card.locator('.part-explanation p').filter({hasText:t.invention.parts[0].description}).waitFor();await geometry(p,card,'cold offline '+t.id);const model=await exerciseInventionExperiment(p,card,t);if(model)models.push(model);}report.inventionsOffline={ids:topics.map(t=>t.id),models,coldRestart:true,partsUsable:true};}
export async function inventionsEngine(browser,base,{engine,shots}){
 const observed=[],modelObserved=[];
 // Correct answers and explored parts are saved. Each width intentionally owns
 // a fresh context so every wrong/right path is actually usable and exercised.
 for(const width of [320,390,768,1440]){
  const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
  try{await p.goto(base+'#world/topic/invention-light');await p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
   for(const t of topics){const card=await open(p,t.id);const model=await exercise(p,card,t,{width});if(model)modelObserved.push(model);observed.push({id:t.id,width});if(width===320&&t.id==='invention-phone')await card.locator('.invention-blueprint').screenshot({path:shots+'/journey-engine-'+engine+'-invention-320.png'});}
   assert.deepEqual(errors,[]);
  }finally{await c.close();}
 }
 return{inventionIds:topics.map(t=>t.id),inventionObserved:observed,inventionModelObserved:modelObserved};
}
export async function inventionsNativeZoom(chromium,options,base,report,shots){
 const profile=path.join(shots,'invention-native-zoom-profile');await fs.rm(profile,{recursive:true,force:true});await fs.mkdir(path.join(profile,'Default'),{recursive:true});await fs.writeFile(path.join(profile,'Default','Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(2)/Math.log(1.2)}}}));
 const c=await chromium.launchPersistentContext(profile,{...options,...(!options.executablePath?{channel:'chromium'}:{}),viewport:{width:1280,height:900},reducedMotion:'reduce'}),p=c.pages()[0];
 try{await p.goto(base+'#world/topic/invention-light');await p.locator('.world-mini-question').waitFor();const dimensions=await p.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));assert.equal(dimensions.cssWidth,640);assert.equal(dimensions.scale,2);const blank=await c.newPage();try{await blank.setContent('<style>html,body{margin:0;background:#f4f8f9}</style>');await assert.rejects(captureNativeViewport(blank,shots+'/invention-blank-negative.png'),/Native screenshot is uniform/);}finally{await blank.close();await p.bringToFront();}await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));const models=[];for(const t of topics){const model=await exercise(p,await open(p,t.id),t,{width:640});if(model)models.push(model);}for(const t of topics.filter(t=>t.invention.model)){const card=await open(p,t.id);await exerciseInventionExperiment(p,card,t);await card.locator('[data-invention-result]').scrollIntoViewIfNeeded();await captureNativeViewport(p,shots+'/invention-experiment-native-'+t.id+'.png');}await open(p,'invention-smartphone');await p.locator('.blueprint-parts').scrollIntoViewIfNeeded();const screenshot=await captureNativeViewport(p,shots+'/invention-native-200-large.png');report.inventionNativeZoom={percent:200,...dimensions,largeTextAlsoChecked:true,ids:topics.map(t=>t.id),models,screenshot,blankCaptureRejected:true};}finally{await c.close();}
}
