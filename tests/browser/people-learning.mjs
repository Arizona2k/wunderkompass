import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const entries=JSON.parse(await fs.readFile(new URL('../../app/people-inquiries.json',import.meta.url),'utf8')).entries;
const legacy=JSON.parse(await fs.readFile(new URL('../fixtures/legacy-people18-before-two-biographies.json',import.meta.url),'utf8'));
const saveKey='erde-entdecken:save:v3';
const reveal=async d=>{if(!await d.evaluate(e=>e.open))await d.locator(':scope > summary').click();};
async function geometry(page,box){
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'biography activity has no page overflow');
 const bad=await box.evaluate(root=>{const found=[],walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){if(!n.textContent.trim()||!n.parentElement.getClientRects().length||n.parentElement.closest('details:not([open])')&&!n.parentElement.closest('summary'))continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&(b.left< -2||b.right>innerWidth+2))found.push(n.textContent);}return found;});
 assert.deepEqual(bad,[],'actual biography text and model labels fit the viewport');
 for(const button of await box.getByRole('button').all()){const b=await button.boundingBox();if(b)assert(b.width>=43.9&&b.height>=43.9,'biography control has an actual44px touch target');}
}
export async function peopleSourceView(page,{width,shots,engine='chromium',native=false,questions=false,touch=false}={}){
 const initial=await page.evaluate(()=>location.hash),observed=[];let complete=false;
 try{for(const entry of entries){
  const topic=catalog.find(t=>t.id===entry.id);await page.evaluate(id=>location.hash='world/topic/'+id,entry.id);
  const article=page.locator('.world-article');await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();const box=article.locator('[data-person-evidence="'+entry.id+'"]');await box.waitFor();
  const learnedBefore=await page.evaluate(({id,key})=>JSON.parse(localStorage.getItem(key)).progress.discoveries.includes('learned:'+id),{id:entry.id,key:saveKey});
  await article.getByRole('navigation',{name:'In dieser Entdeckerkarte'}).getByRole('button',{name:/Ausprobieren$/}).focus();await page.keyboard.press('Enter');assert.equal(await box.evaluate(e=>e===document.activeElement),true,'wayfinder focuses the actual research activity');
  const figure=box.locator('.people-evidence-figure');
  const coreObservation=entry.figure==='inner-core-evidence-comparison'?await figure.locator('[data-core-observation]').textContent():null;
  for(const scene of[0,1]){
   const button=figure.locator('.visual-choice button').nth(scene);await button.focus();await page.keyboard.press('Enter');assert.equal(await figure.getAttribute('data-evidence-scene'),String(scene));
   if(entry.figure==='fossil-evidence'){
    const outlines=await figure.locator('[data-bone-outline]').evaluateAll(es=>es.map(e=>e.getAttribute('d')));assert.equal(outlines.length,scene?3:1);assert.equal(new Set(outlines).size,1,'both invented reconstructions retain exactly the observed bone outline');
    if(scene)assert.equal(new Set(await figure.locator('[data-reconstruction-skin]').evaluateAll(es=>es.map(e=>e.getAttribute('fill')))).size,2);
    await figure.getByText('Eigenes erfundenes Museumsbeispiel:',{exact:false}).waitFor();
   }else if(entry.figure==='light-to-eye'){
    const rays=figure.locator('[data-light-path]');assert.equal(await rays.count(),2);for(const ray of await rays.all())assert.match(await ray.getAttribute('marker-end'),/^url\(#people-light-/,'each actual light path has its own arrowhead');
    assert.equal(await figure.locator('[data-light-path="to-object"]').getAttribute('d'),'M82 120H181');assert.equal(await figure.locator('[data-light-path="'+(scene?'to-screen':'to-eye')+'"]').getAttribute('d'),scene?'M240 120H308':'M240 120H426');assert.equal(await figure.locator('[data-blocking-screen]').count(),scene);assert.equal(await figure.locator('[data-light-path="to-eye"]').count(),scene?0:1);
    await figure.getByText('Kein Nachbau eines historischen Versuchs',{exact:false}).waitFor();
   }else if(entry.figure==='insect-observation-series'){
    assert.deepEqual(await figure.locator('[data-observation-card]').evaluateAll(es=>es.map(e=>Number(e.dataset.observationCard))),scene?[0,1,2,3]:[3],'the sequence follows one butterfly from egg to adult without a return arrow');
    assert.equal(await figure.locator('[data-adult-outline]').count(),1,'the single adult is retained as the final observation');
    if(scene)await figure.getByText('Ein erwachsener Falter wird nicht wieder zum Ei',{exact:false}).waitFor();
    await figure.getByText('keine echten Beobachtungsdaten',{exact:false}).waitFor();
   }else if(entry.figure==='inner-core-evidence-comparison'){
    assert.equal(await figure.locator('[data-inner-core]').count(),scene,'the hypothesis changes only the inferred inner core');
    await figure.locator('[data-core-observation]').getByText('Schwache Erdbebenwellensignale wurden auch in einem Bereich aufgezeichnet',{exact:false}).waitFor();
    await figure.getByText('Kein Foto, originales Seismogramm oder berechneter Wellenverlauf',{exact:false}).waitFor();
    assert.equal(await figure.locator('[data-core-observation]').textContent(),coreObservation,'the observed signal stays the same when the explanation changes');
    assert.equal(await figure.locator('svg path').count(),0,'no invented measured wave ray or seismogram');
   }else assert.fail('Unreviewed people figure '+entry.figure);
   if(entry.figure==='insect-observation-series'||entry.figure==='inner-core-evidence-comparison'){
    assert.equal(await figure.locator('svg text').count(),0,'labels are readable wrapping HTML, not tiny SVG text');
    await figure.getByText('mit KI-Unterstützung',{exact:false}).waitFor();
   }
  }
  for(let level=0;level<3;level++){
   const task=entry.tasks[level],button=box.locator('.people-evidence-levels button').nth(level);if(touch)await button.tap();else{await button.focus();await page.keyboard.press('Enter');}
   assert.equal(await button.getAttribute('aria-pressed'),'true');const activity=box.locator('[data-person-evidence-task="'+task.age+'"]');await activity.getByText(task.example,{exact:true}).waitFor();await activity.getByRole('heading',{name:task.prompt,exact:true}).waitFor();await reveal(activity.locator('details'));await activity.getByText(task.hint,{exact:true}).waitFor();
   for(let i=0;i<3;i++)if(i!==task.correct){await activity.locator('.quiz-answer').nth(i).click();await activity.locator('.lab-feedback').getByText(task.wrongReasons[i],{exact:true}).waitFor();assert.equal(await activity.locator('.lab-feedback').getByText(task.why,{exact:true}).count(),0,'wrong explanation does not reveal the separate correct-feedback paragraph');}
   await activity.locator('.quiz-answer').nth(task.correct).click();await activity.locator('.lab-feedback').getByText(task.why,{exact:true}).waitFor();
  }
  assert.equal(await page.evaluate(({id,key})=>JSON.parse(localStorage.getItem(key)).progress.discoveries.includes('learned:'+id),{id:entry.id,key:saveKey}),learnedBefore,'voluntary activities cannot award a canonical mini-question stamp');
  for(const d of await article.locator('.world-short details').all())await reveal(d);await article.getByText(topic.learning.starter,{exact:true}).waitFor();await article.getByText(topic.learning.observe,{exact:true}).waitFor();await reveal(article.locator('.world-more'));for(const p of topic.more)await article.locator('.world-more').getByText(p,{exact:true}).waitFor();await reveal(article.locator('.world-sources'));for(const source of topic.sources)assert.equal(await article.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  if(questions){const q=article.locator('.world-mini-question'),right=q.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[topic.question.correct],{exact:true})});if(!await right.isDisabled()){await reveal(q.locator('.world-game-hint'));await q.getByText(topic.questionFeedback.hint,{exact:true}).waitFor();for(let i=0;i<3;i++)if(i!==topic.question.correct){await q.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[i],{exact:true})}).click();await q.getByText(topic.questionFeedback.wrongReasons[i],{exact:true}).waitFor();}await right.click();}await q.getByText(topic.question.why,{exact:true}).waitFor();}
  if(questions&&width===390){await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(topic.title);await page.getByRole('option').filter({hasText:topic.title}).first().click();await box.waitFor();}
  if(await page.evaluate(()=>typeof window.axe?.run==='function')){const violations=await page.evaluate(async()=>{const r=await window.axe.run('.people-evidence',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));});assert.deepEqual(violations,[],'biography activity WCAG A/AA');}
  const large=await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading'));assert((await article.locator('.people-illustration figcaption').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)))>=(large?18.3:16),'own biography media caption respects normal and larger text');
  await geometry(page,box);
  for(const id of topic.related){const focus='world-connection-'+topic.id+'-'+id,button=page.locator('[data-route-focus="'+focus+'"]');await button.focus();await page.keyboard.press('Enter');await page.locator('#world-topic-title').filter({hasText:catalog.find(t=>t.id===id).title}).waitFor();await page.locator('[data-route-focus="world-connection-'+id+'-'+topic.id+'"]').waitFor();await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));await page.goBack();await box.waitFor();await page.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,focus);}
  if(shots&&[320,1440].includes(width))await box.screenshot({path:path.join(shots,'people-evidence-'+engine+'-'+entry.id+'-'+width+'.png'),animations:'disabled'});
  if(shots&&native){
   await page.bringToFront();const prefix='people-native-'+engine+'-'+entry.id+'-'+width;
   // At native320 with large text the whole figure is taller than the viewport.
   // Record the actual drawings, controls and limits separately, not only its bottom.
   for(const [i,drawing]of(await figure.locator('svg').all()).entries()){await drawing.evaluate(async e=>{e.scrollIntoView({block:'start',behavior:'instant'});await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));});assert.equal(await drawing.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=-2&&r.bottom<=innerHeight+2;}),true,'actual native drawing is fully in the viewport before capture');await captureNativeViewport(page,path.join(shots,prefix+'-diagram'+i+'.png'));}
   for(const [suffix,part]of[['controls',figure.locator('.visual-choice')],['limits',figure.locator('.small-note')]]){await part.evaluate(async e=>{e.scrollIntoView({block:'start',behavior:'instant'});await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));});await captureNativeViewport(page,path.join(shots,prefix+'-'+suffix+'.png'));}
  }
  observed.push({id:entry.id,width,native,threeVoluntaryLevels:true,allSixWrongFeedbacks:true,actualModelSemantics:true,sourceLinks:true,noExplorationStamp:true,questionsChecked:questions,reciprocalTargetAndBack:true});
 }assert.deepEqual(observed.map(e=>e.id),entries.map(e=>e.id),'every registered biography activity was actually checked');complete=true;return observed;}finally{if(complete)await page.evaluate(hash=>location.hash=hash,initial);}
}
export async function peopleLegacyRound(browser,base,ready,report,shots){
 const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:'reduce',acceptDownloads:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[],http=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)http.push({url:r.url(),status:r.status()});});
 try{
  await page.goto(base);await ready(page);const original=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),saveKey);original.progress.notes=[{id:'legacy-people-test-note',text:'Erhaltener synthetischer Gedanke.',at:'2026-10-20T00:00:00.000Z'}];original.progress.favorites=['topic:science-moon'];original.progress.gameSessions['world:people']=structuredClone(legacy.round);original.progress.gameSessions.memory={cards:[1,2],flipped:[0]};
  const file=path.join(shots,'people-legacy-synthetic-import.json');await fs.writeFile(file,JSON.stringify(original,null,2)+'\n');await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.locator('input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await page.locator('.passport-dialog').waitFor({state:'hidden'});
  for(const reload of[false,true]){
   if(reload){await page.reload();await ready(page);}else await page.evaluate(()=>location.hash='games');
   await page.locator('[data-game-key="world:people"]').click();await page.locator('.world-game-room .is-incorrect').getByText('Neil Armstrong',{exact:true}).waitFor();await page.getByText('AUFGABE 3 VON 5',{exact:true}).waitFor();
   const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),saveKey),round=saved.progress.gameSessions['world:people'];for(const k of['items','index','roundAnswer','roundDone'])assert.deepEqual(round[k],legacy.round[k]);for(const[id,order]of Object.entries(legacy.round.orders))assert.deepEqual(round.orders[id],order);for(const k of['notes','favorites'])assert.deepEqual(saved.progress[k],original.progress[k]);assert.deepEqual(saved.progress.gameSessions.memory,original.progress.gameSessions.memory);
  }
  await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Entdeckerpass sichern',exact:true}).click();const fileOut=path.join(shots,'people-legacy-actual-export.json');await(await pending).saveAs(fileOut);const restored=JSON.parse(await fs.readFile(fileOut,'utf8'));for(const[id,order]of Object.entries(legacy.round.orders))assert.deepEqual(restored.progress.gameSessions['world:people'].orders[id],order);assert.deepEqual(restored.progress.gameSessions['world:people'].items,legacy.round.items);assert.deepEqual(errors,[]);assert.deepEqual(http,[]);
  report.checks.push('Two new biographies preserve an actually imported old five-person round, its wrong answer and all18 saved answer orders through real game opening, reload and pass download');report.retainedPeopleRound={oldPeople:18,oldRound:5,wrongAnswerRetained:true,actualImport:true,reload:true,actualDownload:true};
 }finally{await context.close();}
}
