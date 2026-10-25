import {observeEngineLifecycle,readAnimalFailureView,captureAnimalFailureScreenshot} from './engine-diagnostics.mjs';
import {retainedAnswerWordingFlow,offlineRetainedAnswerWording} from './retained-answer-wording.mjs';
import {worldPhotoFlow,offlineWorldPhotos,photoCardOpenerFlow,pendingPhotoBackFocusFlow} from './world-photos.mjs';
import {journeySourceView,sourceRouteInputFlow} from './journey-sources.mjs';
import {exerciseSolar} from './solar-comparison.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import expansion from '../../content/animal-expansion-review.json' with {type:'json'};
import review from '../../content/animal-editorial-review.json' with {type:'json'};
import DATA from '../../app/animal-inquiries.json' with {type:'json'};
import OWN_MEDIA from '../../app/animal-illustrations.json' with {type:'json'};
import catalog from '../../app/world-catalog.json' with {type:'json'};
import {prepareAxe} from './axe-loader.mjs';
import {captureNativeViewport} from './native-screenshot.mjs';
await import('../../scripts/test-runtime.mjs');
const {createSave,SAVE_KEY}=await import('../../app/progress-storage.ts');
const widths=[320,360,390,768,1024,1440,1920];
const topics=catalog.filter(t=>DATA.entries.some(e=>e.id===t.id));

export async function assertOwnAnimalMedia(visual,id){
 const expected=OWN_MEDIA.entries.find(e=>e.id===id);assert.ok(expected,'declared subject image exists');
 const actual=await visual.evaluate(async el=>{const image=el.querySelector('img');if(!image)throw Error('Missing own topic image');await image.decode();if(!image.complete||!image.naturalWidth)throw Error('Missing decoded own topic image');return{src:image.getAttribute('src'),alt:image.alt,width:image.naturalWidth,height:image.naturalHeight,caption:el.querySelector('figcaption')?.textContent};});
 assert.equal(actual.src,expected.src,'reviewed subject image, not a generic substitute');
 assert.equal(actual.caption,expected.caption,'actual visible image disclosure and limits');
 if(expected.kind==='ai-illustration'){
  assert.match(actual.alt,/KI-Illustration/);assert.match(actual.caption,/KI-Illustration.*kein Foto/,'generated subject picture is explicitly distinguished from a photo');assert.equal(actual.width,expected.width);assert.equal(actual.height,expected.height);
 }else{
  assert.match(actual.alt,/schematische/);assert.match(actual.caption,/mit KI-Unterstützung/,'actual AI-assisted own drawing disclosure remains visible');
 }
 return actual;
}

export async function assertAnimalCompactOrigin(figure,kind,{width}={}){
 const label=kind==='ai-illustration'?'KI-Illustration':'Zeichnung mit KI-Unterstützung';
 const badge=figure.getByText(label,{exact:true});
 assert.equal(await badge.count(),1,'compact animal picture must have one visible honest AI-origin label');
 assert.equal(await badge.isVisible(),true,'compact animal AI-origin label is actually visible');
 const text=await figure.innerText();assert.ok(text.includes(label));assert.doesNotMatch(text,/echtes Foto|Originalfoto/i);
 const ink=await badge.evaluate(e=>{const box=e.closest('figure').getBoundingClientRect(),r=document.createRange();r.selectNodeContents(e);return{font:parseFloat(getComputedStyle(e).fontSize),rects:[...r.getClientRects()].map(x=>({left:x.left,right:x.right,top:x.top,bottom:x.bottom})),box:{left:box.left,right:box.right,top:box.top,bottom:box.bottom}};});
 assert.ok(ink.font>=16,'compact origin is readable, not fine print');assert.ok(ink.rects.length>0);assert.ok(ink.rects.every(r=>r.left>=-2&&r.right<=width+2&&r.left>=ink.box.left-1&&r.right<=ink.box.right+1&&r.bottom<=ink.box.bottom+1),'visible origin ink remains in the actual card');
 return{kind,label,font:ink.font,visibleHonestOrigin:true};
}

export async function animalCompactOriginFlow(p,{width,shots,engine='chromium',state='normal',native=false}={}){
 const initial=await p.evaluate(()=>location.hash),observed=[],entries=[OWN_MEDIA.entries.find(e=>e.kind==='ai-illustration'),OWN_MEDIA.entries.find(e=>e.kind!=='ai-illustration')];assert.ok(entries.every(Boolean));
 let complete=false,current=entries[0].id;
 try{for(const entry of entries){current=entry.id;
  const ordered=catalog.filter(t=>t.category==='animals'),page=Math.floor(ordered.findIndex(t=>t.id===entry.id)/12)+1;assert.ok(page>0);
  await p.evaluate(n=>location.hash='world/animals/page/'+n,page);const tile=p.locator('[data-route-focus="world-topic-'+entry.id+'"]');await tile.waitFor();const figure=tile.locator('[data-animal-illustration="'+entry.id+'"].compact');await figure.locator('img').evaluate(i=>i.decode());await prepareAxe(p);
  const origin=await assertAnimalCompactOrigin(figure,entry.kind,{width});
  if(shots&&[320,1440].includes(width)&&!native)await tile.screenshot({path:path.join(shots,'animal-compact-origin-'+engine+'-'+entry.id+'-'+state+'-'+width+'.png'),animations:'disabled'});
  if(shots&&native){await figure.getByText(origin.label,{exact:true}).evaluate(e=>e.scrollIntoView({block:'center'}));await captureNativeViewport(p,path.join(shots,'animal-compact-origin-'+engine+'-'+entry.id+'-'+state+'-200-'+width+'.png'));}
  await tile.click();await assertOwnAnimalMedia(p.locator('[data-animal-illustration="'+entry.id+'"]:not(.compact)'),entry.id);await p.goBack();await tile.waitFor();await p.waitForFunction(id=>document.activeElement?.getAttribute('data-route-focus')==='world-topic-'+id,entry.id);
  observed.push({id:entry.id,width,state,native,...origin,articleOriginRetained:true,actualBackFocus:true});
 }complete=true;}catch(error){
  // Keep the original failed route visible for the existing outer diagnostics.
  // Restoring the starting route in a finally block would hide the actual fault.
  try{const actual=await p.evaluate(()=>({url:location.href,history:history.state,title:document.querySelector('#world-topic-title')?.textContent??null,active:document.activeElement?.getAttribute('data-route-focus')}));const failure={current,width,state,native,error:error.message,actual};console.error('ANIMAL_COMPACT_ORIGIN_FAILURE',JSON.stringify(failure));if(shots){await fs.writeFile(path.join(shots,'animal-compact-origin-failure-'+engine+'-'+state+'-'+width+'.json'),JSON.stringify(failure,null,2)+'\n',{flag:'wx'});await p.screenshot({path:path.join(shots,'animal-compact-origin-failure-'+engine+'-'+state+'-'+width+'.png'),fullPage:true,timeout:5000}).catch(()=>{});}}catch(diagnosticError){console.error('ANIMAL_COMPACT_ORIGIN_DIAGNOSTIC_UNAVAILABLE',JSON.stringify({current,width,state,error:diagnosticError.message}));}throw error;
 }finally{if(complete){await p.evaluate(hash=>location.hash=hash,initial);if(initial.startsWith('#world/topic/'))await p.locator('#world-topic-title').waitFor();}}
 return observed;
}

async function geometry(root,label){
 const result=await root.evaluate(root=>({overflow:document.documentElement.scrollWidth>innerWidth+2,bad:[...root.querySelectorAll('p,h3,h4,button,summary')].filter(e=>e.getClientRects().length&&(!e.closest('details:not([open])')||e.closest('details:not([open])')?.querySelector(':scope > summary')===e)).flatMap(e=>{const r=e.getBoundingClientRect();return r.left< -2||r.right>innerWidth+2||e.scrollWidth>e.clientWidth+2||(e.matches('button,summary')&&r.height<44)?[{text:e.textContent.slice(0,65),x:r.x,width:r.width,height:r.height}]:[];})}));
 assert.equal(result.overflow,false,label+' page overflow');assert.deepEqual(result.bad,[],label+' readable text and44px controls');
}
export async function exerciseAnimal(p,data,{width,shots,keyboard=false,state='normal'}={}){
 // A restored persistent context can retain another active page. Explicitly
 // activate the page used for real keyboard/pointer work; do not force clicks
 // or change any actionability, content, geometry or feedback assertion.
 await p.bringToFront();
 await p.evaluate(id=>location.hash='world/topic/'+id,data.id);
 const root=p.locator('[data-animal-inquiry="'+data.id+'"]');await root.waitFor({state:'attached'});
 if(!await root.evaluate(e=>e.open))await root.locator(':scope > summary').click();
 await root.getByRole('heading',{name:data.goal,exact:true}).waitFor();
 if(expansion.entries.some(e=>e.id===data.id)){
  const visual=p.locator('[data-animal-illustration="'+data.id+'"]:not(.compact)');await visual.waitFor();
  await visual.locator('img').scrollIntoViewIfNeeded();
  await assertOwnAnimalMedia(visual,data.id);
  const labels=await visual.locator('.animal-illustration-labels span').evaluateAll(elements=>elements.map(e=>{const r=e.getBoundingClientRect();return {text:e.textContent,font:parseFloat(getComputedStyle(e).fontSize),left:r.left,right:r.right};}));
  assert.equal(labels.length,2);assert.ok(labels.every(l=>l.text&&l.font>=16&&l.left>=-2&&l.right<=width+2),'new illustration labels reflow');
  const captionEdges=await visual.evaluate(el=>{const box=el.getBoundingClientRect();return [...el.querySelectorAll('figcaption,.animal-illustration-labels span')].flatMap(e=>{const range=document.createRange();range.selectNodeContents(e);return [...range.getClientRects()].flatMap(r=>r.left<box.left+8||r.right>box.right-8||r.bottom>box.bottom-8?[{text:e.textContent,left:r.left-box.left,right:box.right-r.right,bottom:box.bottom-r.bottom}]:[]);});});
  assert.deepEqual(captionEdges,[],'actual text ink stays clear of rounded clipping, including the last caption line');
  const titleInk=await p.locator('#world-topic-title').evaluate(e=>{const range=document.createRange();range.selectNodeContents(e);return [...range.getClientRects()].map(r=>({left:r.left,right:r.right}));});
  assert.ok(titleInk.every(r=>r.left>=-2&&r.right<=width+2),'new animal title remains fully visible');



  if(shots&&[320,390,1440].includes(width)&&state==='normal')await visual.screenshot({path:path.join(shots,'animal-new-'+data.id.slice(7)+'-'+width+'.png'),animations:'disabled'});
 }

 const topic=topics.find(t=>t.id===data.id),measure=p.locator('.animal-measure');
 const weight=['g','kg'].includes(topic.animal.size.unit);await measure.getByRole('heading',{name:weight?'Ein Gefühl für das Gewicht':'Ein Gefühl für die Größe',exact:true}).waitFor();
 const compare=measure.getByRole('button',{name:weight?'Einen Gewichtsvergleich zeigen':'Einen Größenvergleich zeigen',exact:true});if(await compare.getAttribute('aria-expanded')!=='true')await compare.click();
 assert.ok((await measure.innerText()).includes(topic.animal.size.measurement_de));await geometry(measure,data.id+' exact measurement direction '+width);
 if(topic.animal.size.kind==='upper-bound')assert.ok((await measure.innerText()).includes('keinen Mindestwert'));
 await measure.getByText(topic.animal.size.measurement_de+': '+topic.animal.size.text_de,{exact:true}).waitFor();assert.equal(await measure.locator('.measure-bars strong').first().innerText(),(topic.animal.size.kind==='typical'?'etwa':'bis etwa')+' '+topic.animal.size.max.toLocaleString('de-DE',{maximumFractionDigits:3})+' '+topic.animal.size.unit);
 const sources=p.locator('.world-sources');if(!await sources.evaluate(e=>e.open))await sources.locator('summary').click();await sources.getByRole('link').first().waitFor();assert.deepEqual(await sources.getByRole('link').evaluateAll(links=>links.map(a=>a.getAttribute('href'))),data.sourceUrls,'all actual old/new article sources remain exact');
 if(shots&&data.id==='animal-jaguar'&&[320,1440].includes(width)&&state==='normal')await measure.screenshot({path:path.join(shots,'animal-jaguar-corrected-measure-'+width+'.png'),animations:'disabled'});

 const levels=root.locator('.animal-inquiry-levels button');
 for(let level=0;level<3;level++){
  if(keyboard){await levels.nth(level).focus();await p.keyboard.press('Enter');}else await levels.nth(level).click();
  assert.equal(await levels.nth(level).getAttribute('aria-pressed'),'true');
  if(level===0){for(let i=0;i<2;i++){const b=root.locator('.animal-evidence-row button').nth(i);if(await b.getAttribute('aria-expanded')!=='true')await b.click();await root.getByText(data.evidence[i].text,{exact:true}).waitFor();}}
  else{
   const q=level===1?data.reason:data.transfer,task=root.locator('.animal-reason-task');
   await task.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
   const hint=task.locator(':scope>details').first();if(!await hint.evaluate(e=>e.open))await hint.locator('summary').click();await hint.getByText(q.hint,{exact:true}).waitFor();
   await task.locator('.quiz-answer').nth(1-q.correct).click();await Promise.all([task.getByText('Prüfe die Aussage noch einmal.',{exact:true}).waitFor(),task.locator('.lab-feedback').getByText(q.feedback[1-q.correct],{exact:true}).waitFor()]);
   await task.locator('.quiz-answer').nth(q.correct).click();await Promise.all([task.getByText('Deine Auswahl passt.',{exact:true}).waitFor(),task.locator('.lab-feedback').getByText(q.feedback[q.correct],{exact:true}).waitFor()]);
   await assertAnimalSelectionFeedback(task);
   if(level===2&&q.reflection){const reflection=task.locator('.animal-transfer-reflection');await reflection.locator(':scope>summary').click();await reflection.getByText(q.reflection.prompt,{exact:true}).waitFor();assert.equal(await reflection.getByText(q.reflection.example,{exact:true}).isVisible(),false,'comparison example stays optional');await reflection.locator('details>summary').click();for(const text of [q.reflection.example,q.reflection.compare])await reflection.getByText(text,{exact:true}).waitFor();}

  }
  await geometry(root,data.id+' '+width+' level'+level);
  if(shots&&data.id==='animal-whale-shark')await root.screenshot({path:path.join(shots,'animal-workshop-'+state+'-'+level+'-'+width+'.png'),animations:'disabled'});
 }
 return {id:data.id,width,state,levels:[0,1,2],bothEvidence:true,wrongAndCorrect:true,selectionFeedbackHonest:true,...(data.transfer.reflection?{ownReflectionCompared:true}:{}),keyboard,geometry:true,measurement:true,sourceLinks:true};
}
export async function assertAnimalSelectionFeedback(task){
 assert.doesNotMatch(await task.getByRole('status').innerText(),/Gut begründet\./,'selection does not certify an unobserved original explanation');
}
export async function animalFlow(browser,base,ready,monitor,report,shots,{matrix=widths,navigationReuse}={}){
 const observed=[],focusChecks=[],compactOrigins=[],start=performance.now(),searchFocus=await delayedSearchFocus(browser,base,monitor,shots);
 for(const width of matrix){
  const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  let current=DATA.entries[0].id,stage='normal';
  const lifecycle=await observeEngineLifecycle(browser,c,p,()=>({current,stage,width}));
  const pass=createSave();pass.progress.favorites=['topic:animal-polar-bear'];pass.progress.notes=[{id:'animal-test-note',text:'Synthetische alte Notiz',at:'2026-10-17T07:00:00.000Z'}];pass.progress.gameSessions['world:animal-detective']={items:['animal-lion','animal-polar-bear'],index:1,roundAnswer:'alte Antwort'};
  for(const t of topics)pass.progress.gameSessions['topic:'+t.id]={items:[...t.question.answers].reverse(),topicAnswer:t.question.answers[t.question.correct],compareAnimal:true};
  await c.addInitScript(({key,pass})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));},{key:SAVE_KEY,pass});
  try{
   await p.goto(base+'#world/topic/'+DATA.entries[0].id);await ready(p);
   for(const data of DATA.entries){current=data.id;observed.push(await exerciseAnimal(p,data,{width,shots,keyboard:true}));}
   const before=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
   for(const t of topics)for(const [key,value]of Object.entries(pass.progress.gameSessions['topic:'+t.id]))assert.deepEqual(before.gameSessions['topic:'+t.id][key],value,'retained original '+key+' '+t.id);
   for(const key of ['favorites','notes'])assert.deepEqual(before[key],pass.progress[key]);assert.deepEqual(before.gameSessions['world:animal-detective'],pass.progress.gameSessions['world:animal-detective']);
   stage='reload';await p.reload();await ready(p);const data=DATA.entries.at(-1),root=p.locator('[data-animal-inquiry="'+data.id+'"]');await root.locator(':scope > summary').click();await root.getByText('Deine Auswahl passt.',{exact:true}).waitFor();assert.equal(await root.locator('.animal-inquiry-levels button').nth(2).getAttribute('aria-pressed'),'true','selected level survives reload');
   const after=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.deepEqual(after.gameSessions,before.gameSessions,'every old and new session key survives reload');
   stage='compact-origin-normal';compactOrigins.push(...await animalCompactOriginFlow(p,{width,shots,engine:browser.browserType().name(),state:'normal'}));
   await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));
   stage='large';for(const data of DATA.entries){current=data.id;observed.push(await exerciseAnimal(p,data,{width,shots,keyboard:true,state:'large'}));}
   stage='accessibility-and-focus';
   const audit=p.locator('.animal-inquiry');for(let i=0;i<3;i++){await audit.locator('.animal-inquiry-levels button').nth(i).click();await prepareAxe(p);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.animal-inquiry',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[],'workshop axe level'+i);}
   const focusTarget=audit.locator('.animal-inquiry-levels button').nth(2);await focusTarget.focus();await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');
   const focus=await focusTarget.evaluate(e=>{const style=getComputedStyle(e);return {active:document.activeElement===e,visible:e.matches(':focus-visible'),outlineWidth:parseFloat(style.outlineWidth),outlineStyle:style.outlineStyle};});
   assert.equal(focus.active,true,'real Tab/Shift+Tab returns to the selected thinking path');assert.equal(focus.visible,true,'keyboard focus, not just a pointer selection');assert.ok(focus.outlineWidth>=2&&focus.outlineStyle!=='none','visible keyboard outline');focusChecks.push({width,state:'large',tabNavigation:true,...focus});
   await audit.screenshot({path:path.join(shots,'animal-workshop-focus-'+width+'.png'),animations:'disabled'});
   stage='compact-origin-large';compactOrigins.push(...await animalCompactOriginFlow(p,{width,shots,engine:browser.browserType().name(),state:'large'}));
   console.log('Animal workshop',width,DATA.entries.length,'cards passed');
  }catch(error){
   // Preserve the original strict failure before teardown. A timeout alone does
   // not tell whether the requested route, actual article or browser was lost.
   // Keep this bounded record in the existing engine log/artifact namespace;
   // never retry an action or replace the original exception with a probe error.
   try{
    const actual=await readAnimalFailureView(p);
    const failure={engine:browser.browserType().name(),current,stage,width,error:error.message,actual,lifecycle:await lifecycle.snapshot()};
    console.error('ANIMAL_WORKSHOP_FAILURE',JSON.stringify(failure));
    await fs.writeFile(path.join(shots,'animal-workshop-failure-'+width+'.json'),JSON.stringify(failure,null,2)+'\n',{flag:'wx'});
   }catch(diagnosticError){console.error('ANIMAL_WORKSHOP_DIAGNOSTIC_UNAVAILABLE',JSON.stringify({current,stage,width,error:diagnosticError.message}));}
   await captureAnimalFailureScreenshot(p,shots,{engine:browser.browserType().name(),current,stage,width});throw error;
  }finally{lifecycle.stop();await c.close();}
 }
 const navigationProof={};await animalNavigation(browser,base,ready,monitor,shots,navigationProof,navigationReuse);
 report.animalCoverage={observed,focusChecks,compactOrigins,searchFocus,photoPendingBackFocus:navigationProof.photoPendingBackFocus,seconds:(performance.now()-start)/1000,oldSessionsPreserved:true,largeText:true,axe:true,independentAcceptance:false,navigation:true};
 await worldPhotoFlow(browser,base,ready,monitor,report,shots);
 report.animalCoverage.photoMetadata=report.photoMetadata;
 await retainedAnswerWordingFlow(browser,base,ready,monitor,report,shots);
 report.animalCoverage.answerWordingCompatibility=report.answerWordingCompatibility;
 report.checks.push('48 animal cards (24 retained and24 new): individual evidence, three voluntary thinking paths,96 reasoning tasks, wrong/correct feedback, keyboard, large text, axe and old/new session reload at'+matrix.join('/'));
}
export async function animalNativeZoom(chromium,options,base,report,shots){
 const profile=path.join(shots,'animal-native-profile');await fs.mkdir(path.join(profile,'Default'),{recursive:true});await fs.writeFile(path.join(profile,'Default','Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(2)/Math.log(1.2)}}}));
 const c=await chromium.launchPersistentContext(profile,{...options,...(!options.executablePath?{channel:'chromium'}:{}),viewport:{width:1280,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}),p=c.pages()[0];
 try{await p.bringToFront();await p.goto(base+'#world/topic/'+DATA.entries[0].id);await p.locator('.world-mini-question').waitFor();const dimensions=await p.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));assert.deepEqual(dimensions,{cssWidth:640,scale:2});await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));const observed=[];for(const data of DATA.entries)observed.push(await exerciseAnimal(p,data,{width:640,keyboard:true,state:'large'}));const solarCaptures=[];report.solarNativeCoverage={observed:await exerciseSolar(p,{width:640,state:'large',shots,capture:async file=>{const shot=await captureNativeViewport(p,file);solarCaptures.push(shot);return shot;}}),percent:200,cssWidth:640,scale:2,captures:solarCaptures};await p.evaluate(id=>location.hash='world/topic/'+id,DATA.entries.at(-1).id);await p.locator('.animal-inquiry').locator(':scope > summary').click();await p.locator('.animal-inquiry').scrollIntoViewIfNeeded();const screenshot=await captureNativeViewport(p,shots+'/animal-native-200-large-640.png');report.animalNativeZoom={...dimensions,percent:200,screenshot,cards:DATA.entries.length,observed};report.animalNativeZoom.compactOrigins=await animalCompactOriginFlow(p,{width:640,shots,engine:'chromium-native',state:'large',native:true});}finally{await c.close();}
}
export async function offlineAnimals(p,report){const observed=[];for(const data of DATA.entries)observed.push(await exerciseAnimal(p,data,{width:1280,keyboard:true,state:'offline'}));await offlineWorldPhotos(p,report);await offlineRetainedAnswerWording(p,report);const compactOrigins=await animalCompactOriginFlow(p,{width:1280,state:'offline'});report.animalOffline={cards:DATA.entries.length,coldRestart:true,observed,compactOrigins};report.checks.push('All48 animal workshops usable after real server shutdown and cold offline browser restart');}

export async function animalNavigation(browser,base,ready,monitor,shots,navigationProof={},reuse){
 const engineName=browser.browserType().name(),commonStarted=performance.now();
 if(reuse!==undefined){
  assert.equal(typeof reuse,'function');assert.equal(process.argv.includes('--search-only'),false,'producer always executes the actual common navigation');const restored=await reuse();Object.assign(navigationProof,restored.proof,{reused:restored.provenance});
  // Source controls and their fresh product pages remain an actual later test.
  await sourceRouteInputFlow(browser,base,shots,engineName,monitor);return topics.map(t=>t.id);
 }

 // Existing actual-engine precondition: fail on broken photo-card Back before
 // the long search, workshop and complete regression; every later check stays.
 const photoOpeners=await photoCardOpenerFlow(browser,base,ready,monitor,shots);navigationProof.photoOpeners=photoOpeners;console.log('EARLY_PHOTO_CARD_OPENERS',JSON.stringify({engine:browser.browserType().name(),cases:photoOpeners}));
 const pendingBack=await pendingPhotoBackFocusFlow(browser,base,ready,monitor,{},shots);navigationProof.photoPendingBackFocus=pendingBack;console.log('PHOTO_PENDING_BACK',JSON.stringify({engine:browser.browserType().name(),cases:pendingBack}));
 const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage(),engine=browser.browserType().name();monitor(p);const initial=await c.storageState();assert.deepEqual(initial,{cookies:[],origins:[]},'common navigation starts in a new empty context');navigationProof.freshContext=true;navigationProof.input={base,viewport:{width:390,height:844},reducedMotion:'reduce',initialStorage:'empty new browser context',photoWidths:[320,1440],photoCategories:['animals','history','people','buildings'],pendingBackKinds:['category','pagination'],input:'actual keyboard titles, reload, explained connection and browser Back for every current animal ID'};let current='initial',stage='home';const lifecycle=await observeEngineLifecycle(browser,c,p,()=>({current,stage}));
 await p.addInitScript(()=>{window.__animalSearchTrace=[];for(const type of ['beforeinput','input','change','focusin','focusout','hashchange','popstate'])window.addEventListener(type,event=>{const target=event.target;if(target?.getAttribute?.('role')==='combobox'||type==='hashchange'||type==='popstate'){window.__animalSearchTrace.push({type,value:target?.value??null,hash:location.hash,at:performance.now(),trusted:event.isTrusted,inputType:event.inputType??null,composing:event.isComposing??null});if(window.__animalSearchTrace.length>32)window.__animalSearchTrace.shift();}},true);});
 try{await p.goto(base);await ready(p);for(const entry of DATA.entries){
  current=entry.id;const t=topics.find(t=>t.id===entry.id);stage='open search';
  await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();const input=p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true});await input.waitFor();
  stage='actual input focus';await p.waitForFunction(()=>document.activeElement?.matches('.search-dialog [role="combobox"]'));
  stage='type exact title with actual keyboard';await p.keyboard.type(t.title);assert.equal(await input.inputValue(),t.title,'complete title from actual keyboard, including accents and spaces');
  stage='select exact result';await p.getByRole('option').filter({has:p.getByText(t.title,{exact:true})}).click();await p.locator('[data-animal-inquiry="'+entry.id+'"]').waitFor({state:'attached'});stage='reload';await p.reload();await ready(p);
  if(expansion.entries.some(e=>e.id===entry.id)){
   const quiz=p.locator('.world-mini-question');await quiz.getByRole('heading',{name:t.question.prompt,exact:true}).waitFor();
   if(await quiz.getByRole('button',{name:'Später noch einmal prüfen',exact:true}).count())await quiz.getByRole('button',{name:'Später noch einmal prüfen',exact:true}).click();
   const hint=quiz.locator('.world-game-hint');assert.equal(await hint.count(),1,'new mini-question has its own voluntary hint');
   assert.equal(await hint.getByText(t.questionFeedback.hint,{exact:true}).isVisible(),false,'hint does not open itself');
   await hint.locator('summary').focus();await p.keyboard.press('Enter');await hint.getByText(t.questionFeedback.hint,{exact:true}).waitFor();await hint.locator('summary').click();
   for(const [index,answer] of t.question.answers.entries())if(index!==t.question.correct){
    await quiz.locator('.quiz-answer').filter({has:p.getByText(answer,{exact:true})}).click();
    await quiz.locator('.lab-feedback').getByText(t.questionFeedback.wrongReasons[index],{exact:true}).waitFor();
    assert.equal(await quiz.locator('.lab-feedback').getByText(t.question.why,{exact:true}).count(),0,'wrong choice does not display the correct explanation');
   }
   await quiz.locator('.quiz-answer').filter({has:p.getByText(t.question.answers[t.question.correct],{exact:true})}).click();
   await quiz.locator('.lab-feedback').getByText(t.question.why,{exact:true}).waitFor();
   assert.ok(await quiz.locator('.quiz-answer').first().isDisabled(),'new quiz retains the existing earned-answer gate');
   await quiz.getByRole('button',{name:'Später noch einmal prüfen',exact:true}).click();
  }
  const edge=[...review.newConnections,...expansion.newConnections].find(e=>e.fromId===entry.id||e.toId===entry.id);assert.ok(edge,'individual explained context '+entry.id);const otherId=edge.fromId===entry.id?edge.toId:edge.fromId;
  const selector='[data-route-focus="world-connection-'+entry.id+'-'+otherId+'"]';stage='explained connection';await p.locator(selector).click();await p.getByRole('heading',{name:catalog.find(t=>t.id===otherId).title,exact:true}).waitFor();
  stage='back and opener focus';await p.goBack();await p.locator('[data-animal-inquiry="'+entry.id+'"]').waitFor({state:'attached'});await p.waitForFunction(selector=>document.activeElement?.matches(selector),selector);
 }
 navigationProof.coveredAnimalIds=topics.map(t=>t.id);navigationProof.commonSeconds=(performance.now()-commonStarted)/1000;
 // Extend the existing early keyboard-navigation path with the changed source
 // controls. The complete later journey matrix remains unchanged.
 if(process.argv.includes('--search-only')){const sourceProof=await journeySourceView(p,{widths:[320,390,768,1440],shots,engine});navigationProof.earlySourceViews=sourceProof.views.length;navigationProof.earlySourceChapters=sourceProof.chapters;console.log('EARLY_JOURNEY_SOURCES',JSON.stringify({engine,views:sourceProof.views.length,chapters:sourceProof.chapters}));}
 await sourceRouteInputFlow(browser,base,shots,engine,monitor);
 if(process.argv.includes('--search-only')){await delayedSearchFocus(browser,base,monitor,shots);navigationProof.earlyDelayedSearch=true;}
 return topics.map(t=>t.id);
 }catch(error){const state=await p.evaluate(()=>({url:location.href,active:document.activeElement?.outerHTML.slice(0,700),query:document.querySelector('.search-dialog [role="combobox"]')?.value??null,queryAttribute:document.querySelector('.search-dialog [role="combobox"]')?.getAttribute('value')??null,dialog:document.querySelector('.search-dialog')?.getAttribute('data-state')??null,options:[...document.querySelectorAll('[role="option"]')].map(e=>({value:e.getAttribute('data-value'),text:e.textContent?.slice(0,180)})),trace:window.__animalSearchTrace??[]})).catch(()=>({unavailable:true}));const failure={engine,current,stage,error:error.message,...state,lifecycle:await lifecycle.snapshot()};console.error('ANIMAL_SEARCH_FAILURE',JSON.stringify(failure));if(shots){await fs.writeFile(path.join(shots,'animal-search-failure-'+engine+'.json'),JSON.stringify(failure,null,2));await p.screenshot({path:path.join(shots,'animal-search-failure-'+engine+'.png'),fullPage:true,animations:'disabled'}).catch(()=>{});}throw new Error('Animal navigation '+engine+' '+current+' '+stage+': '+error.message,{cause:error});}finally{lifecycle.stop();await c.close();}
}

// A lazy search must focus its real input even if the dialog initially contains
// only the loading state and close button. No sleep or request retry is used.
export async function delayedSearchFocus(browser,base,monitor,shots){
 const engine=browser.browserType().name(),proof={engine,scope:'delayed search input; real foreground keyboard, no action retries',stages:[]};
 const state=p=>p.evaluate(()=>({documentFocus:document.hasFocus(),active:document.activeElement?.outerHTML.slice(0,600),query:document.querySelector('.search-dialog [role="combobox"]')?.value??null,trace:window.__delayedSearchTrace??[]}));
 async function setup(){
  const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage();monitor(p);let release;const gate=new Promise(resolve=>release=resolve);
  await p.addInitScript(()=>{window.__delayedSearchTrace=[];for(const type of ['keydown','keyup','beforeinput','input','change','focusin','focusout'])window.addEventListener(type,event=>{const target=event.target;if(target?.matches?.('.search-dialog [role="combobox"]')){window.__delayedSearchTrace.push({type,key:event.key??null,data:event.data??null,value:target.value,attribute:target.getAttribute('value'),documentFocus:document.hasFocus(),trusted:event.isTrusted,inputType:event.inputType??null,composing:event.isComposing??null,at:performance.now()});if(window.__delayedSearchTrace.length>96)window.__delayedSearchTrace.shift();}},true);});
  await p.route('**/assets/global-search-*.js',async route=>{await gate;await route.continue();});
  await p.goto(base+'#world/topic/animal-whale-shark');await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor();const previouslyFocused=await p.evaluate(()=>document.hasFocus());await p.bringToFront();await p.waitForFunction(()=>document.hasFocus());proof.stages.push({stage:'foreground preparation',previouslyFocused,...await state(p)});const requested=p.waitForRequest(r=>/\/assets\/global-search-.*\.js/.test(r.url()));const opener=p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true});await opener.focus();await p.keyboard.press('Enter');await requested;await p.waitForFunction(()=>!!document.activeElement?.closest('.search-dialog'));return {c,p,release,opener};
 }
 let a=await setup();
 try{
  a.release();const input=a.p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true});await input.waitFor();await a.p.waitForFunction(()=>document.hasFocus()&&document.activeElement?.matches('.search-dialog [role="combobox"]'));proof.stages.push({stage:'before first actual keyboard input',...await state(a.p)});
  await a.p.keyboard.type('Großer Tümmler');assert.equal(await input.inputValue(),'Großer Tümmler');proof.stages.push({stage:'first complete title entered',...await state(a.p)});const result=a.p.getByRole('option').filter({has:a.p.getByText('Großer Tümmler',{exact:true})});await result.waitFor();if(shots)await a.p.locator('.search-dialog').screenshot({path:path.join(shots,'animal-search-delayed-390.png'),animations:'disabled'});await result.click();await a.p.locator('[data-animal-inquiry="animal-common-bottlenose-dolphin"]').waitFor({state:'attached'});
  await a.p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await a.p.waitForFunction(()=>document.activeElement?.matches('.search-dialog [role="combobox"]'));await a.p.keyboard.type('Grüne Meeresschildkröte');assert.equal(await input.inputValue(),'Grüne Meeresschildkröte');proof.stages.push({stage:'second complete title entered',...await state(a.p)});await a.p.getByRole('option').filter({has:a.p.getByText('Grüne Meeresschildkröte',{exact:true})}).click();await a.p.locator('[data-animal-inquiry="animal-green-sea-turtle"]').waitFor({state:'attached'});await a.p.waitForLoadState('networkidle');
 }catch(error){proof.error=error.stack;throw error;}finally{proof.stages.push({stage:'after first context',...await state(a.p).catch(()=>({unavailable:true}))});if(shots){await fs.writeFile(path.join(shots,'animal-search-delayed-proof-'+engine+'.json'),JSON.stringify(proof,null,2));if(proof.error)await a.p.screenshot({path:path.join(shots,'animal-search-delayed-failure-'+engine+'.png'),fullPage:true,animations:'disabled'}).catch(()=>{});}a.release();await a.c.close();}
 a=await setup();
 try{
  await a.p.keyboard.press('Escape');await a.p.locator('.search-dialog').waitFor({state:'hidden'});await a.p.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Lernwelt durchsuchen');const response=a.p.waitForResponse(r=>/\/assets\/global-search-.*\.js/.test(r.url()));a.release();await (await response).finished();await a.p.waitForLoadState('networkidle');assert.equal(await a.p.locator('.search-dialog').count(),0,'late module cannot reopen a closed dialog');assert.equal(await a.opener.evaluate(e=>document.activeElement===e),true,'late module cannot steal restored opener focus');
 }finally{a.release();await a.c.close();}
 proof.stages.push({stage:'early close and restored opener passed'});if(shots)await fs.writeFile(path.join(shots,'animal-search-delayed-proof-'+engine+'.json'),JSON.stringify(proof,null,2));console.log('DELAYED_SEARCH_DOCUMENT',JSON.stringify({engine,preparation:proof.stages.filter(s=>s.stage==='foreground preparation').map(s=>({previouslyFocused:s.previouslyFocused,focused:s.documentFocus})),status:'passed'}));
 console.log('Delayed search input',engine,'real keyboard, two accented full titles, reopen and early close passed');
 return {delayedModule:true,keyboardQuery:true,reopenReady:true,closedBeforeReady:true,openerRestored:true};
}
