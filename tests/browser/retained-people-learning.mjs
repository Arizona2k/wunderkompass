// Additive current canonical older18 coverage; the existing four+fourteen proof remains separate and unchanged.
import assert from 'node:assert/strict';
import {retainedPeopleMiniQuestion} from './retained-people-miniquestions.mjs';
import {capturePeopleFigureTree} from './fourteen-actual-dom-semantic-laws.mjs';
import {assertExisting18ActualDOMStates,rejectExisting18ActualDOMCountercases} from './retained-people-dom-laws.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const entries=JSON.parse(await fs.readFile(new URL('../../app/people-inquiries.json',import.meta.url),'utf8')).entries;
assert.deepEqual(entries.map(e=>e.id),["person-mary_anning","person-ibn_al_haytham","person-maria_sibylla_merian","person-inge_lehmann","person-henrietta_swan_leavitt","person-cecilia_payne_gaposchkin","person-rosalind_franklin","person-jocelyn_bell_burnell","person-katsushika_hokusai","person-murasaki_shikibu","person-rachel_carson","person-octavia_butler","person-nelson_mandela","person-chien_shiung_wu","person-lise_meitner","person-zaha_hadid","person-rabindranath_tagore","person-ibn_sina","person-ada_lovelace","person-al_khwarizmi","person-albert_einstein","person-alexander_humboldt","person-bertha_benz","person-cai_lun","person-charles_darwin","person-grace_hopper","person-jane_goodall","person-johannes_gutenberg","person-karl_benz","person-katherine_johnson","person-mae_jemison","person-marie_curie","person-neil_armstrong","person-tim_berners_lee","person-tu_youyou","person-wangari_maathai"],'all four retained, fourteen added and eighteen older biographies visited individually');
const retainedKinds=new Set(entries.slice(18).map(e=>e.figure));assert.equal(retainedKinds.size,18);
const reciprocalPlan={additions:JSON.parse(await fs.readFile(new URL('../fixtures/retained-people-reciprocal-additions.json',import.meta.url),'utf8'))};assert.equal(reciprocalPlan.additions.length,15);
const saveKey='erde-entdecken:save:v3';
const reveal=async d=>{if(!await d.evaluate(e=>e.open))await d.locator(':scope > summary').click();};
async function geometry(page,box){
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'biography activity has no page overflow');
 const bad=await box.evaluate(root=>{const found=[],walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){if(!n.textContent.trim()||!n.parentElement.getClientRects().length||n.parentElement.closest('details:not([open])')&&!n.parentElement.closest('summary'))continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&(b.left< -2||b.right>innerWidth+2))found.push(n.textContent);}return found;});
 assert.deepEqual(bad,[],'actual biography text and model labels fit the viewport');
 for(const button of await box.getByRole('button').all()){const b=await button.boundingBox();if(b)assert(b.width>=43.9&&b.height>=43.9,'biography control has an actual44px touch target');}
}
export let latestRetainedPeopleObservations=[];
export async function retainedPeopleSourceView(page,{width,shots,engine='chromium',native=false,questions=false,touch=false}={}){
 const initial=await page.evaluate(()=>location.hash),requestedLarge=await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading')),observed=[],retainedSemanticPairs={};let complete=false;
 latestRetainedPeopleObservations=observed;
 try{for(const entry of entries.filter(e=>retainedKinds.has(e.figure))){
  const topic=catalog.find(t=>t.id===entry.id);await page.evaluate(id=>location.hash='world/topic/'+id,entry.id);
  const article=page.locator('.world-article');await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();const box=article.locator('[data-person-evidence="'+entry.id+'"]');await box.waitFor();
  assert.equal(await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading')),requestedLarge,'each retained biography keeps the caller-selected text size');
  const learnedBefore=await page.evaluate(({id,key})=>JSON.parse(localStorage.getItem(key)).progress.discoveries.includes('learned:'+id),{id:entry.id,key:saveKey});
  await article.getByRole('navigation',{name:'In dieser Entdeckerkarte'}).getByRole('button',{name:/Ausprobieren$/}).focus();await page.keyboard.press('Enter');assert.equal(await box.evaluate(e=>e===document.activeElement),true,'wayfinder focuses the actual research activity');
  const figure=box.locator('.people-evidence-figure'),actualFigureStates=[],actualCalculationSteps=[];
  for(const scene of(entry.figure==='photon-number-vs-single-energy'?[0,1,2]:[0,1])){
   const button=figure.locator('.visual-choice').first().getByRole('button').nth(scene);await button.focus();await page.keyboard.press('Enter');assert.equal(await figure.getAttribute('data-evidence-scene'),String(scene));
   assert(retainedKinds.has(entry.figure),'Unreviewed retained-person figure '+entry.figure);
   if(entry.figure==='calculation-check-evidence'){
    const steps=figure.getByRole('group',{name:'Vergleichsschritt wählen',exact:true}),values=[0,3,4,3,0];
    for(let step=0;step<5;step++){
     const control=steps.getByRole('button',{name:'Schritt '+step,exact:true});await control.focus();await page.keyboard.press('Enter');
     assert.deepEqual(await steps.getByRole('button').evaluateAll(es=>es.map(e=>e.getAttribute('aria-pressed'))),[0,1,2,3,4].map(i=>String(i===step)));
     const expectedB=scene===0?values[step]:4*step;
     await figure.getByRole('status').filter({hasText:`Schritt ${step}: A = ${values[step]}; B = ${expectedB}.`}).waitFor();
     assert((await figure.locator('svg').getAttribute('aria-label')).includes(`Schritt ${step}: A ergibt ${values[step]}, B ergibt ${expectedB}.`));
     await geometry(page,steps);actualCalculationSteps.push({scene,step,A:values[step],B:expectedB,actualDOM:await figure.evaluate(capturePeopleFigureTree)});
    }
    await steps.getByRole('button',{name:'Schritt 2',exact:true}).click();
   }
   if(retainedKinds.has(entry.figure))actualFigureStates.push(await figure.evaluate(capturePeopleFigureTree));

  }
  const actualSemanticLaw=assertExisting18ActualDOMStates(entry.figure,actualFigureStates);
  if(retainedKinds.has(entry.figure))retainedSemanticPairs[entry.figure]=actualFigureStates;
  let actualCalculationStepReload=false;
  if(entry.figure==='calculation-check-evidence'){
   assert.equal(actualCalculationSteps.length,10);
   for(const step of[0,1,2,3,4])assertExisting18ActualDOMStates(entry.figure,[0,1].map(scene=>actualCalculationSteps.find(row=>row.scene===scene&&row.step===step).actualDOM));
   await figure.getByRole('group',{name:'Vergleichsschritt wählen',exact:true}).getByRole('button',{name:'Schritt 4',exact:true}).click();
   await page.waitForFunction(({key,id})=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['topic:'+id]?.peopleEvidenceCalculationStep===4,{key:saveKey,id:entry.id});
   const axeWasAvailable=await page.evaluate(()=>typeof window.axe?.run==='function');
   await page.reload();await box.waitFor();
   // The caller's enlarged-layout condition may be a transient DOM probe, not a saved preference.
   // Reapply precisely that condition after the real storage/reload check; never drop later large-text cases.
   await page.locator('.earth-app').evaluate((e,large)=>e.classList.toggle('large-reading',large),requestedLarge);
   assert.equal(await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading')),requestedLarge,'calculation reload preserves requested layout coverage');
   if(axeWasAvailable){await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.equal(await page.evaluate(()=>typeof window.axe?.run==='function'),true,'reload retains actual accessibility-check availability');}
   assert.equal(await figure.getAttribute('data-evidence-scene'),'1');
   assert.equal(await figure.getByRole('group',{name:'Vergleichsschritt wählen',exact:true}).getByRole('button',{name:'Schritt 4',exact:true}).getAttribute('aria-pressed'),'true');
   await figure.getByRole('status').filter({hasText:'Schritt 4: A = 0; B = 16.'}).waitFor();
   await figure.getByRole('group',{name:'Vergleichsschritt wählen',exact:true}).getByRole('button',{name:'Schritt 2',exact:true}).click();actualCalculationStepReload=true;
  }
  for(let level=0;level<3;level++){
   const task=entry.tasks[level],button=box.locator('.people-evidence-levels button').nth(level);if(touch)await button.tap();else{await button.focus();await page.keyboard.press('Enter');}
   assert.equal(await button.getAttribute('aria-pressed'),'true');const activity=box.locator('[data-person-evidence-task="'+task.age+'"]');await activity.getByText(task.example,{exact:true}).waitFor();await activity.getByRole('heading',{name:task.prompt,exact:true}).waitFor();await reveal(activity.locator('details'));await activity.getByText(task.hint,{exact:true}).waitFor();
   for(let i=0;i<3;i++)if(i!==task.correct){await activity.locator('.quiz-answer').nth(i).click();await activity.locator('.lab-feedback').getByText(task.wrongReasons[i],{exact:true}).waitFor();assert.equal(await activity.locator('.lab-feedback').getByText(task.why,{exact:true}).count(),0,'wrong explanation does not reveal the separate correct-feedback paragraph');}
   await activity.locator('.quiz-answer').nth(task.correct).click();await activity.locator('.lab-feedback').getByText(task.why,{exact:true}).waitFor();
  }
  assert.equal(await page.evaluate(({id,key})=>JSON.parse(localStorage.getItem(key)).progress.discoveries.includes('learned:'+id),{id:entry.id,key:saveKey}),learnedBefore,'voluntary activities cannot award a canonical mini-question stamp');
  for(const d of await article.locator('.world-short details').all())await reveal(d);await article.getByText(topic.learning.starter,{exact:true}).waitFor();await article.getByText(topic.learning.observe,{exact:true}).waitFor();await reveal(article.locator('.world-more'));for(const p of topic.more)await article.locator('.world-more').getByText(p,{exact:true}).waitFor();await reveal(article.locator('.world-sources'));for(const source of topic.sources)assert.equal(await article.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  const actualCanonicalMiniQuestion=questions?await retainedPeopleMiniQuestion(page,topic):null;
  if(questions&&width===390){await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(topic.title);await page.getByRole('option').filter({hasText:topic.title}).first().click();await box.waitFor();}
  if(await page.evaluate(()=>typeof window.axe?.run==='function')){const violations=await page.evaluate(async()=>{const r=await window.axe.run('.people-evidence',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));});assert.deepEqual(violations,[],'biography activity WCAG A/AA');}
  const large=await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading'));const actualCaptionFont=await article.locator(topic.image?'.world-photo figcaption':'.people-illustration figcaption').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));assert(actualCaptionFont>=(large?18.3:16),'biography media caption respects normal and larger text');
  const actualSVGFonts=await figure.locator('svg text').evaluateAll(es=>es.map(e=>({text:e.textContent,font:parseFloat(getComputedStyle(e).fontSize)*e.ownerSVGElement.getBoundingClientRect().width/e.ownerSVGElement.viewBox.baseVal.width})));assert(actualSVGFonts.every(row=>row.font>=(large?20:16)),'actual drawn label reading size');
  await geometry(page,box);
  for(const id of topic.related){
   const actualKeys=['world-connection-'+topic.id+'-'+id,'world-related-'+topic.id+'-'+id],button=page.locator(actualKeys.map(key=>'[data-route-focus="'+key+'"]').join(','));assert.equal(await button.count(),1,'one actual declared article opener across explained and plain-related link families');const focus=await button.getAttribute('data-route-focus');assert(actualKeys.includes(focus));const explained=reciprocalPlan.additions.find(e=>[e.fromId,e.toId].includes(topic.id)&&[e.fromId,e.toId].includes(id));if(explained)assert.equal(await button.locator('..').locator('p').textContent(),explained.why,'actual individually explained forward link');await button.focus();await page.keyboard.press('Enter');await page.locator('#world-topic-title').filter({hasText:catalog.find(t=>t.id===id).title}).waitFor();
   const backKeys=['world-connection-'+id+'-'+topic.id,'world-related-'+id+'-'+topic.id],reciprocal=page.locator(backKeys.map(key=>'[data-route-focus="'+key+'"]').join(','));await reciprocal.waitFor();assert.equal(await reciprocal.count(),1,'exact reciprocal article endpoint remains available');if(explained)assert.equal(await reciprocal.locator('..').locator('p').textContent(),explained.why,'same actual explanation on reciprocal endpoint');await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));await page.goBack();await box.waitFor();await page.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,focus);
  }
  if(shots&&[320,1440].includes(width))await box.screenshot({path:path.join(shots,'people-evidence-'+engine+'-'+entry.id+'-'+width+'.png'),animations:'disabled'});
  if(shots&&native){
   await page.bringToFront();const prefix='people-native-'+engine+'-'+entry.id+'-'+width;
   // At native320 with large text the whole figure is taller than the viewport.
   // Record the actual drawings, controls and limits separately, not only its bottom.
   let actualDrawings=figure.locator('svg'),htmlDrawing=false;
   if(await actualDrawings.count()===0){const htmlParts={'test-conditions-evidence':{selector:'[data-test-condition]',count:3},'instruction-meaning-evidence':{selector:'.people-evidence-comparison > figure',count:3},'apollo11-roles-snapshots':{selector:'.people-mission-role-map > section',count:2},'evidence-scope-comparison':{selector:'[data-evidence-level]',count:3}};const actualHTML=htmlParts[entry.figure];assert(actualHTML,'an unknown missing drawing cannot silently skip native capture');htmlDrawing=true;actualDrawings=figure.locator(actualHTML.selector);assert.equal(await actualDrawings.count(),actualHTML.count,'all individually declared actual HTML explanation parts captured');}
   for(const [i,drawing]of(await actualDrawings.all()).entries()){await drawing.evaluate(async e=>{e.scrollIntoView({block:'start',behavior:'instant'});await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));});assert.equal(await drawing.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=-2&&r.bottom<=innerHeight+2;}),true,'actual native drawing is fully in the viewport before capture');await captureNativeViewport(page,path.join(shots,prefix+(htmlDrawing?'-html-part':'-diagram')+i+'.png'));}
   for(const [suffix,part]of[['controls',figure.locator('.visual-choice').first()],...(entry.figure==='calculation-check-evidence'?[['steps',figure.getByRole('group',{name:'Vergleichsschritt wählen',exact:true})]]:[]),['limits',figure.locator('.small-note')]]){await part.evaluate(async e=>{e.scrollIntoView({block:'start',behavior:'instant'});await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));});await captureNativeViewport(page,path.join(shots,prefix+'-'+suffix+'.png'));}
  }
  observed.push({id:entry.id,width,native,threeVoluntaryLevels:true,allSixWrongFeedbacks:true,actualModelSemantics:true,actualCaptionFont,large,actualSemanticLaw,actualFigureStates,actualCalculationSteps,actualCalculationStepReload,actualSVGFonts,sourceLinks:true,noExplorationStamp:true,questionsChecked:questions,actualCanonicalMiniQuestion,reciprocalTargetAndBack:true});
 }assert.deepEqual(observed.map(e=>e.id),entries.filter(e=>retainedKinds.has(e.figure)).map(e=>e.id),'every registered biography activity was actually checked');observed[0].retained18ActualDOMCountercasesRejected=rejectExisting18ActualDOMCountercases(retainedSemanticPairs);complete=true;return observed;}finally{if(complete)await page.evaluate(hash=>location.hash=hash,initial);}
}
