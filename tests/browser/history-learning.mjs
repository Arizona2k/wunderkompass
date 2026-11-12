import {HISTORY_REGION_NAMES,exerciseSelectedHistoryModel} from './history-evidence-actions.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
import {assertTextInsideControls} from './text-geometry.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const topics=catalog.filter(t=>Object.hasOwn(HISTORY_REGION_NAMES,t.id));assert.equal(topics.length,16,'all16 individually selected historical topics are present');
const legacy=new Set(['history-khipu','history-mohenjo-daro','history-bronze']);
export async function assertBronzeEvidence(activity){
 assert.notEqual(await activity.getAttribute('data-bronze-evidence'),null);const bronze=activity;
 assert.match(await bronze.locator('.small-note').first().innerText(),/Erfundene Fundkarten/);
 assert.match(await bronze.locator('figcaption').innerText(),/Mit KI-Unterstützung.*keine Materialanalyse/);
 assert.match(await bronze.locator('[data-bronze-card="A"]').innerText(),/Materialangabe: Stein/);
 assert.match(await bronze.locator('[data-bronze-card="B"]').innerText(),/Materialangabe: Kupfer und Zinn/);
 const toggle=bronze.getByRole('button',{name:/Fundzusammenhang (?:ausblenden|einblenden)/}),shown=await toggle.getAttribute('aria-expanded')==='true';
 for(const text of await bronze.locator('[data-bronze-context]').allInnerTexts())assert.match(text,shown?/bronzezeitlicher Zusammenhang in Britannien/:/Ausgeblendet.*Material allein nennt kein Alter/);
 const labels=await bronze.locator('svg text').evaluateAll(es=>es.map(e=>({text:e.textContent,size:parseFloat(getComputedStyle(e).fontSize)*e.ownerSVGElement.getBoundingClientRect().width/e.ownerSVGElement.viewBox.baseVal.width})));assert.deepEqual(labels.map(e=>e.text),['A','B']);assert.ok(labels.every(e=>e.size>=16));
 return{inventedCards:true,aiAssistedDrawing:true,materialAndContextSeparate:true,contextVisible:shown,labelsReadable:true};
}
export async function assertKhipuCaptionContrast(activity){
 const actual=await activity.locator('.khipu-evidence-schematic').evaluate(figure=>{
  const rgb=value=>{const channels=value.match(/[\d.]+/g)?.map(Number);if(!channels||channels.length<3||channels.length>4||channels.length===4&&channels[3]!==1)throw Error('Opaque computed diagram colors required: '+value);return channels.slice(0,3);};
  const luminance=channels=>channels.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
  const css=getComputedStyle(figure),stops=css.backgroundImage.match(/rgba?\([^)]+\)/g);if(!stops||stops.length!==2)throw Error('Actual two-stop Khipu background required');
  const ends=stops.map(rgb),samples=Array.from({length:257},(_,i)=>ends[0].map((v,j)=>v+(ends[1][j]-v)*i/256));
  const caption=figure.querySelector('figcaption');if(!caption)throw Error('Actual Khipu caption required');
  return {backgroundImage:css.backgroundImage,labels:[caption,...caption.querySelectorAll('strong,span')].map(el=>{
   const color=getComputedStyle(el).color,foreground=luminance(rgb(color)),ratios=samples.map(c=>{const background=luminance(c);return(Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05);});
   return {text:el.textContent,color,minimumContrast:Math.min(...ratios)};
  })};
 });
 assert(actual.labels.length>=3,'the actual caption and both textual explanations are checked');
 for(const label of actual.labels)assert(label.minimumContrast>=4.5,'actual Khipu text remains readable on its light diagram background: '+JSON.stringify(label));
 return actual;
}
async function checkGeometry(p){
 await assertTextInsideControls(p,'.article-wayfinder button','article orientation');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'history learning model has no page overflow');
 const bad=await p.locator('.world-article .history-evidence').evaluate(el=>{const found=[],walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects())if(r.width&&(r.left< -2||r.right>innerWidth+2))found.push(n.textContent);}return found;});assert.deepEqual(bad,[],'actual diagram labels/tasks are within the viewport');
}
async function explore(p,t,{touch=false,width,shots,engine='chromium',native=false}={}){
 const activity=p.locator('.world-article .history-evidence');assert.equal(await activity.count(),1);assert.equal(await activity.getAttribute('aria-label'),HISTORY_REGION_NAMES[t.id],'exact declared descriptive accessible region name');assert.equal(await p.getByRole('region',{name:HISTORY_REGION_NAMES[t.id],exact:true}).count(),1);
 await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 for(let level=0;level<3;level++){
  const tier=activity.getByRole('group',{name:'Freiwillige Denkstufe'}).getByRole('button').nth(level);if(level===2){const previousTier=activity.getByRole('group',{name:'Freiwillige Denkstufe'}).getByRole('button').nth(level-1);await previousTier.focus();await p.keyboard.press('Tab');assert.equal(await tier.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')),true,'real Tab reaches the third level with a visible keyboard focus');await p.keyboard.press('Enter');assert.equal(await tier.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')),true,'keyboard activation retains its visible focus');}else if(touch)await tier.tap();else await tier.click();assert.equal(await tier.getAttribute('aria-pressed'),'true');
  if(!legacy.has(t.id)){await exerciseSelectedHistoryModel(p,activity,t.id,level);}
  else if(t.id==='history-khipu'){
   await activity.getByRole('combobox',{name:'Erste Menge',exact:true}).selectOption('2');await activity.getByRole('combobox',{name:'Zweite Menge',exact:true}).selectOption('6');const diagram=activity.getByRole('img',{name:/^Erfundene Zählschnüre: erste Menge 2, zweite Menge 6\./});await diagram.waitFor();assert.match(await diagram.getAttribute('aria-label'),/Unsere Vereinbarung zählt (?:Körbe|Personen)|Die Bedeutung ist ausgeblendet/,'the current accessible description also declares its actual meaning context');
   const toggle=activity.getByRole('button',{name:/Bedeutung ausblenden|Unsere Vereinbarung zeigen/});await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),String(level%2===0));await assertKhipuCaptionContrast(activity);
  }else if(t.id==='history-mohenjo-daro'){
   const toggle=activity.getByRole('button',{name:/Vergleichsplan öffnen|Plan mit Verbindung öffnen/});await toggle.click();await activity.getByRole('img',{name:level%2===0?'Erfundener Vergleichsplan: Der Wasserweg endet vor dem Kanal.':'Erfundener Plan mit eingezeichnetem Ablauf vom Haus in den Kanal.'}).waitFor();
  }else{
   const before=await assertBronzeEvidence(activity),toggle=activity.getByRole('button',{name:/Fundzusammenhang (?:ausblenden|einblenden)/});await toggle.click();assert.equal((await assertBronzeEvidence(activity)).contextVisible,!before.contextVisible);
  }
  if(legacy.has(t.id)){await activity.getByRole('button',{name:'Meine Überlegung vergleichen',exact:true}).click();await activity.getByRole('status').waitFor();}await checkGeometry(p);for(const control of await activity.locator('button,select').all()){const box=await control.boundingBox();const witness=await control.evaluate(el=>{const css=getComputedStyle(el);return {tag:el.tagName,label:el.getAttribute('aria-label')??el.textContent,fontSize:css.fontSize,minWidth:css.minWidth,minHeight:css.minHeight,appearance:css.appearance};});assert.ok(box&&box.width>=44&&box.height>=44,'history control has a real44px touch target: '+JSON.stringify({topic:t.id,level,box,...witness}));}
  if(shots){const prefix='history-source-'+engine+'-'+t.id+'-'+width+'-level-'+level;if(native){for(const [suffix,part]of[['heading',activity.locator('h3')],['model',modelPanel(activity,t.id,level)],['control',activity.locator('button,select').last()]]){assert.equal(await part.count(),1,'exact actual native capture target: '+t.id+' level'+level+' '+suffix);await part.scrollIntoViewIfNeeded();await captureNativeViewport(p,path.join(shots,prefix+'-'+suffix+'.png'));}}else if([320,1440].includes(width))await activity.screenshot({path:path.join(shots,prefix+'.png'),animations:'disabled'});}
 }
}
function modelPanel(activity,id,level){
 if(id==='history-timbuktu')return activity.locator('.timbuktu-copy-cards');
 if(id==='history-hattusha')return activity.locator('.hattusha-language-board');
 if(id==='history-kilwa')return activity.locator('.kilwa-evidence-route');
 if(id==='history-rosetta')return activity.locator('.rosetta-text-comparison');
 if(level===2&&id==='history-writing')return activity.locator('.writing-source-case');
 if(level===2&&id==='history-paper')return activity.locator('.paper-forming-source-case');
 if(level===1&&id==='history-caral')return activity.locator('.caral-evidence-areas');
 if(level===2&&id==='history-caral')return activity.locator('.caral-evidence-dating');
 if(level===1&&id==='history-nalanda')return activity.locator('.nalanda-evidence-periods');
 if(level>0&&id==='history-polynesia')return activity.locator(':scope > .model-result').first();
 return activity.locator('figure').first();
}
async function actualHistoryReadingLayout(page){
 return page.evaluate(()=>{
  const app=document.querySelector('.earth-app'),saved=JSON.parse(localStorage.getItem('erde-entdecken:save:v3'));
  const activity=document.querySelector('.world-article .history-evidence');
  const font=selector=>{const el=activity?.querySelector(selector);return el?getComputedStyle(el).fontSize:null;};
  return {largeReading:app.classList.contains('large-reading'),savedLargeText:saved.progress.settings.largeText,headingFont:font('h3'),goalFont:font('.learning-goal')};
 });
}
async function restoreRequestedHistoryLayoutAfterReload(page,requested,beforeReload){
 const actual=await actualHistoryReadingLayout(page);
 assert.equal(actual.savedLargeText,requested.savedLargeText,'actual reload preserves the saved user preference');
 assert.equal(actual.largeReading,requested.savedLargeText,'fresh app renders its actual saved large-text setting before any test-only layout is restored');
 const restoredTemporaryLayout=actual.largeReading!==requested.largeReading;
 if(restoredTemporaryLayout)await page.evaluate(large=>document.querySelector('.earth-app').classList.toggle('large-reading',large),requested.largeReading);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const after=await actualHistoryReadingLayout(page);
 assert.equal(after.savedLargeText,requested.savedLargeText,'restoring temporary test layout does not write a user preference');
 assert.equal(after.largeReading,requested.largeReading,'caller-requested reading layout remains present after actual reload');
 assert.equal(after.headingFont,beforeReload.headingFont,'actual model heading typography is retained across the test-only layout restoration');
 assert.equal(after.goalFont,beforeReload.goalFont,'actual model task typography is retained across the test-only layout restoration');
 return {beforeReload,actualSavedLayoutAfterReload:actual,restoredTemporaryLayout,after};
}
export async function historySourceView(page,{width,shots,engine='chromium',native=false,questions=false,touch=false}={}){
 if(native)await page.bringToFront();const initial=await page.evaluate(()=>location.hash),observed=[];let completed=false;const requestedLayout=await actualHistoryReadingLayout(page);assert.equal(typeof requestedLayout.savedLargeText,'boolean');
 try{for(const topic of topics){
  const beforeTopicLayout=await actualHistoryReadingLayout(page);assert.equal(beforeTopicLayout.largeReading,requestedLayout.largeReading,'every selected history topic starts in the requested reading layout');assert.equal(beforeTopicLayout.savedLargeText,requestedLayout.savedLargeText,'history navigation preserves the saved text preference');let reloadLayout=null;
  if(topic.id==='history-bronze'){
   await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.locator('input').fill('Bronzezeit');const result=page.getByRole('option').filter({hasText:topic.title});assert.equal(await result.count(),1,'the authored bronze alias finds exactly its intended topic');await result.click();
  }else{await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.locator('input').fill(topic.title);const result=dialog.getByRole('option').filter({hasText:topic.title});assert.equal(await result.count(),1,'each selected whole title resolves to its own actual global result');await result.click();}
  const article=page.locator('.world-article');await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();const question=article.locator('.world-mini-question');await question.waitFor();
  if(topic.id==='history-bronze'){for(const text of [topic.intro,...topic.paragraphs,...topic.facts.map(f=>f.text)])await article.getByText(text,{exact:true}).waitFor();}
  for(const summary of await article.locator('.world-short details summary').all()){if(!await summary.evaluate(e=>e.parentElement.open))await summary.click();}await article.getByText(topic.learning.starter,{exact:true}).waitFor();await article.getByText(topic.learning.observe,{exact:true}).waitFor();
  const more=article.locator('.world-more');if(!await more.evaluate(e=>e.open))await more.locator('summary').click();for(const text of topic.more)await more.getByText(text,{exact:true}).waitFor();const sources=article.locator('.world-sources');if(!await sources.evaluate(e=>e.open))await sources.locator('summary').click();for(const source of topic.sources)assert.equal(await sources.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  const actualWholeText=await article.innerText();for(const text of[topic.intro,...topic.paragraphs,...topic.facts.map(f=>f.text)])assert(actualWholeText.includes(text),'the actual selected article displays its complete authored teaching, not only a model or metadata: '+topic.id);
  const learnedBefore=await page.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),topic.id);const jump=article.getByRole('navigation',{name:'In dieser Entdeckerkarte'}).getByRole('button',{name:/Ausprobieren$/});await jump.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.world-article .history-evidence').evaluate(e=>e===document.activeElement),true,'actual article wayfinder reaches the new observation');await explore(page,topic,{touch,width,shots,engine,native});assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),topic.id),learnedBefore,'voluntary diagram exploration cannot award the mini-question mark');
  const activity=page.locator('.world-article .history-evidence');if(!legacy.has(topic.id)){const beforeReloadLayout=await actualHistoryReadingLayout(page);const reading=await page.evaluate(()=>history.state.wunderHistoryEvidence),next=article.locator('.article-network button.knowledge-link').first();assert.equal(await next.count(),1,'a real related article remains available');await next.click();await page.waitForFunction(id=>location.hash!=='#world/topic/'+id,topic.id);await page.goBack();await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();await activity.waitFor();assert.deepEqual(await page.evaluate(()=>history.state.wunderHistoryEvidence),reading,'actual model reading state survives related-article back');assert.deepEqual(await actualHistoryReadingLayout(page),beforeReloadLayout,'internal related-article return preserves the requested actual typography and saved preference');await page.reload();await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();await activity.waitFor();assert.deepEqual(await page.evaluate(()=>history.state.wunderHistoryEvidence),reading,'actual model reading state survives full reload');reloadLayout=await restoreRequestedHistoryLayoutAfterReload(page,requestedLayout,beforeReloadLayout);}if(shots){const prefix='history-source-'+engine+'-'+topic.id+'-'+width;if(native){await page.bringToFront();for(const [suffix,part]of [['heading',activity.locator('h3')],['diagram',modelPanel(activity,topic.id,2)],['controls',activity.locator('button,select').last()]]){await part.scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,prefix+'-'+suffix+'.png'));}}else if([320,1440].includes(width))await activity.screenshot({path:path.join(shots,prefix+'.png'),animations:'disabled'});}
  if(questions){const correct=question.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[topic.question.correct],{exact:true})});if(!await correct.isDisabled()){const hint=question.locator('.world-game-hint');if(!await hint.evaluate(e=>e.open))await hint.locator('summary').click();await hint.getByText(topic.questionFeedback.hint,{exact:true}).waitFor();for(let i=0;i<topic.question.answers.length;i++)if(i!==topic.question.correct){await question.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[i],{exact:true})}).click();await question.getByText(topic.questionFeedback.wrongReasons[i],{exact:true}).waitFor();assert.equal(await question.getByText(topic.question.why,{exact:true}).count(),0);}await correct.click();}await question.getByText(topic.question.why,{exact:true}).waitFor();assert.equal(await correct.isDisabled(),true);}
  await checkGeometry(page);observed.push({id:topic.id,width,threeDistinctThinkingLevels:true,actualControls:true,keyboardFocus:true,readingLevelsAndSources:true,noExplorationStamp:true,questionsChecked:questions,native,readingLayout:{requestedLargeReading:requestedLayout.largeReading,savedLargeText:requestedLayout.savedLargeText,reload:reloadLayout},...(topic.id==='history-khipu'?{captionContrast:await assertKhipuCaptionContrast(activity)}:{}),...(topic.id==='history-bronze'?{actualSearch:true,bronzeEvidence:await assertBronzeEvidence(activity)}:{})});
 }assert.equal(observed.length,16);completed=true;return observed;}finally{if(completed)await page.evaluate(hash=>location.hash=hash,initial);}
}
