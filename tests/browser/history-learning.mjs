import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const topics=catalog.filter(t=>['history-khipu','history-mohenjo-daro','history-bronze'].includes(t.id));assert.equal(topics.length,3,'all three required historical topics are present');
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
async function checkGeometry(p){
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'history learning model has no page overflow');
 const bad=await p.getByRole('region',{name:'Geschichtsdetektiv'}).evaluate(el=>{const found=[],walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects())if(r.width&&(r.left< -2||r.right>innerWidth+2))found.push(n.textContent);}return found;});assert.deepEqual(bad,[],'actual diagram labels/tasks are within the viewport');
}
async function explore(p,t,{touch=false}={}){
 const activity=p.getByRole('region',{name:'Geschichtsdetektiv'});
 await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 for(let level=0;level<3;level++){
  const tier=activity.getByRole('group',{name:'Freiwillige Denkstufe'}).getByRole('button').nth(level);if(level===2){const previousTier=activity.getByRole('group',{name:'Freiwillige Denkstufe'}).getByRole('button').nth(level-1);await previousTier.focus();await p.keyboard.press('Tab');assert.equal(await tier.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')),true,'real Tab reaches the third level with a visible keyboard focus');await p.keyboard.press('Enter');assert.equal(await tier.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')),true,'keyboard activation retains its visible focus');}else if(touch)await tier.tap();else await tier.click();assert.equal(await tier.getAttribute('aria-pressed'),'true');
  if(t.id==='history-khipu'){
   await activity.getByRole('combobox',{name:'Erste Menge',exact:true}).selectOption('2');await activity.getByRole('combobox',{name:'Zweite Menge',exact:true}).selectOption('6');await activity.getByRole('img',{name:'Erfundene Zählschnüre: erste Menge 2, zweite Menge 6.'}).waitFor();
   const toggle=activity.getByRole('button',{name:/Bedeutung ausblenden|Unsere Vereinbarung zeigen/});await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),String(level%2===0));
  }else if(t.id==='history-mohenjo-daro'){
   const toggle=activity.getByRole('button',{name:/Vergleichsplan öffnen|Plan mit Verbindung öffnen/});await toggle.click();await activity.getByRole('img',{name:level%2===0?'Erfundener Vergleichsplan: Der Wasserweg endet vor dem Kanal.':'Erfundener Plan mit eingezeichnetem Ablauf vom Haus in den Kanal.'}).waitFor();
  }else{
   const before=await assertBronzeEvidence(activity),toggle=activity.getByRole('button',{name:/Fundzusammenhang (?:ausblenden|einblenden)/});await toggle.click();assert.equal((await assertBronzeEvidence(activity)).contextVisible,!before.contextVisible);
  }
  await activity.getByRole('button',{name:'Meine Überlegung vergleichen',exact:true}).click();await activity.getByRole('status').waitFor();await checkGeometry(p);for(const control of await activity.locator('button,select').all()){const box=await control.boundingBox();const witness=await control.evaluate(el=>{const css=getComputedStyle(el);return {tag:el.tagName,label:el.getAttribute('aria-label')??el.textContent,fontSize:css.fontSize,minWidth:css.minWidth,minHeight:css.minHeight,appearance:css.appearance};});assert.ok(box&&box.width>=44&&box.height>=44,'history control has a real44px touch target: '+JSON.stringify({topic:t.id,level,box,...witness}));}
 }
}
export async function historySourceView(page,{width,shots,engine='chromium',native=false,questions=false,touch=false}={}){
 if(native)await page.bringToFront();const initial=await page.evaluate(()=>location.hash),observed=[];let completed=false;
 try{for(const topic of topics){
  if(topic.id==='history-bronze'){
   await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.locator('input').fill('Bronzezeit');const result=page.getByRole('option').filter({hasText:topic.title});assert.equal(await result.count(),1,'the authored bronze alias finds exactly its intended topic');await result.click();
  }else await page.evaluate(id=>location.hash='world/topic/'+id,topic.id);
  const article=page.locator('.world-article');await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();const question=article.locator('.world-mini-question');await question.waitFor();
  for(const summary of await article.locator('.world-short details summary').all()){if(!await summary.evaluate(e=>e.parentElement.open))await summary.click();}await article.getByText(topic.learning.starter,{exact:true}).waitFor();await article.getByText(topic.learning.observe,{exact:true}).waitFor();
  const more=article.locator('.world-more');if(!await more.evaluate(e=>e.open))await more.locator('summary').click();for(const text of topic.more)await more.getByText(text,{exact:true}).waitFor();const sources=article.locator('.world-sources');if(!await sources.evaluate(e=>e.open))await sources.locator('summary').click();for(const source of topic.sources)assert.equal(await sources.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  const learnedBefore=await page.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),topic.id);const jump=article.getByRole('navigation',{name:'In dieser Entdeckerkarte'}).getByRole('button',{name:/Ausprobieren$/});await jump.focus();await page.keyboard.press('Enter');assert.equal(await page.getByRole('region',{name:'Geschichtsdetektiv'}).evaluate(e=>e===document.activeElement),true,'actual article wayfinder reaches the new observation');await explore(page,topic,{touch});assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),topic.id),learnedBefore,'voluntary diagram exploration cannot award the mini-question mark');
  const activity=page.getByRole('region',{name:'Geschichtsdetektiv'});if(shots){const prefix='history-source-'+engine+'-'+topic.id+'-'+width;if(native){await page.bringToFront();for(const [suffix,part]of [['heading',activity.locator('h3')],['diagram',activity.locator('figure')],['controls',activity.locator('.model-buttons').last()]]){await part.scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,prefix+'-'+suffix+'.png'));}}else if([320,1440].includes(width))await activity.screenshot({path:path.join(shots,prefix+'.png'),animations:'disabled'});}
  if(questions){const correct=question.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[topic.question.correct],{exact:true})});if(!await correct.isDisabled()){const hint=question.locator('.world-game-hint');if(!await hint.evaluate(e=>e.open))await hint.locator('summary').click();await hint.getByText(topic.questionFeedback.hint,{exact:true}).waitFor();for(let i=0;i<topic.question.answers.length;i++)if(i!==topic.question.correct){await question.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[i],{exact:true})}).click();await question.getByText(topic.questionFeedback.wrongReasons[i],{exact:true}).waitFor();assert.equal(await question.getByText(topic.question.why,{exact:true}).count(),0);}await correct.click();}await question.getByText(topic.question.why,{exact:true}).waitFor();assert.equal(await correct.isDisabled(),true);}
  await checkGeometry(page);observed.push({id:topic.id,width,threeDistinctThinkingLevels:true,actualControls:true,keyboardFocus:true,readingLevelsAndSources:true,noExplorationStamp:true,questionsChecked:questions,native,...(topic.id==='history-bronze'?{actualSearch:true,bronzeEvidence:await assertBronzeEvidence(activity)}:{})});
 }assert.equal(observed.length,3);completed=true;return observed;}finally{if(completed)await page.evaluate(hash=>location.hash=hash,initial);}
}
