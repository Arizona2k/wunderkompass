import {assertHonestChallengeFeedback} from './challenge-hints.mjs';
import assert from 'node:assert/strict';
import {bookNormalizationView} from './book-normalization.mjs';
import fs from 'node:fs/promises';
const routes=JSON.parse(await fs.readFile(new URL('../../exports/content/world-routes.json',import.meta.url),'utf8'));
const topics=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const hints=JSON.parse(await fs.readFile(new URL('../../app/challenge-hints.json',import.meta.url),'utf8'));
const questionBank=topics.flatMap(t=>[{...t.question,id:t.id+':mini'},...(t.challenges??[])]);
export async function assertSciencePage(page,number,count){
 await page.locator('#world-results').getByText('46 passende Entdeckerkarten · Seite '+number+' von 4',{exact:true}).waitFor();
 assert.equal(new URL(page.url()).hash,'#world/science/page/'+number);
 assert.equal(await page.locator('.world-topic-tile').count(),count,'actual science page '+number+' contains all expected visible cards');
 return page.locator('.world-topic-tile').evaluateAll(es=>es.map(e=>e.dataset.routeFocus.replace(/^world-topic-/,'')));
}
// Reuse the exact existing main-fallback contract in early affected checks.
export async function completedRouteFocus(page,report){
  await page.evaluate(()=>location.hash='world');await page.locator('.world-choice').first().waitFor();
  const completed=page.locator('[data-route-focus="world-route-moon-to-sea"]');await completed.focus();await page.keyboard.press('Enter');await page.locator('.world-route-finish').waitFor();await page.waitForFunction(()=>document.activeElement?.id==='learning-main');
  await page.evaluate(()=>location.hash='home');await page.locator('.continue-card').waitFor();await page.getByRole('button',{name:'Fortsetzen',exact:true}).click();await page.locator('.world-route-finish').waitFor();await page.waitForFunction(()=>document.activeElement?.id==='learning-main');
  assert.equal(new URL(page.url()).hash,'#world/route/moon-to-sea','completed route retains its finish state when resumed');
  report.checks.push('Completed learning route: keyboard entry/resume retains finish state and a focusable main fallback');
}

export async function connectedDiscoveries(page,ready,report,width){
 const pass=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 for(const t of topics.filter(t=>t.checkedAt==='2026-10-09')){
  await page.evaluate(id=>location.hash='world/topic/'+id,t.id);
  await page.getByRole('heading',{name:t.title,exact:true}).waitFor();
  assert.ok(await page.locator('.connection-card').count());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,t.id+' overflow');
 }
 await page.evaluate(()=>location.hash='world/topic/science-water-cycle');
 for(const name of ['1. Verdunsten','2. Kondensieren','3. Niederschlag','4. Abfließen & versickern'])await page.getByRole('button',{name,exact:true}).click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('model:science-water-cycle'));
 await page.evaluate(()=>location.hash='world/topic/science-moon-phases');
 await page.getByRole('button',{name:'3. Vollmond',exact:true}).click();
 assert.ok(await page.locator('.moon-phase-2').count());
 await page.screenshot({path:new URL('../../.qa-output/moon-'+width+'.png',import.meta.url).pathname,fullPage:true});
 await page.reload();await ready(page);
 await page.locator('.moon-phase-2').waitFor();
 for(const name of ['1. Neumond','2. Zunehmender Halbmond','4. Abnehmender Halbmond'])await page.getByRole('button',{name,exact:true}).click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('model:science-moon-phases'));
 await page.locator('.connection-card').filter({hasText:'Mond reflektiert'}).getByRole('button').click();
 await page.getByRole('heading',{name:'Der Mond bewegt das Meer',exact:true}).waitFor();
 await page.evaluate(()=>location.hash='world/science');
 await page.locator('.world-topic-tile').first().waitFor();
 assert.equal(await page.locator('.world-topic-tile').count(),12);
 const scienceSeen=await page.locator('.world-topic-tile').evaluateAll(es=>es.map(e=>e.dataset.routeFocus.replace(/^world-topic-/,'')));
 await page.getByRole('button',{name:'Nächste Seite',exact:true}).click();
 assert.equal(new URL(page.url()).hash,'#world/science/page/2');
 scienceSeen.push(...await assertSciencePage(page,2,12));
 await page.goBack();await page.waitForFunction(()=>location.hash==='#world/science');
 assert.equal(await page.locator('.world-topic-tile').count(),12);
 await page.goForward();await page.waitForFunction(()=>location.hash==='#world/science/page/2');
 await assertSciencePage(page,2,12);
 for(const [number,count]of [[3,12],[4,10]]){await page.getByRole('button',{name:'Nächste Seite',exact:true}).click();scienceSeen.push(...await assertSciencePage(page,number,count));}
 assert.equal(await page.getByRole('button',{name:'Nächste Seite',exact:true}).isDisabled(),true);
 assert.equal(scienceSeen.length,46);assert.equal(new Set(scienceSeen).size,46,'no duplicated or lost science identity across the four actual pages');
 assert.deepEqual(new Set(scienceSeen),new Set(topics.filter(t=>t.category==='science').map(t=>t.id)));
 await page.goBack();await assertSciencePage(page,3,12);await page.goBack();await assertSciencePage(page,2,12);
 (report.sciencePagination??=[]).push({width,pageSizes:[12,12,12,10],all46Identities:scienceSeen,backForwardRetained:true,lastNextDisabled:true});
 await page.getByRole('textbox',{name:'Entdeckerkarten durchsuchen'}).fill('Mondphasen');
 assert.equal(await page.locator('.world-topic-tile').count(),1);
 await page.locator('.world-topic-tile').click();await page.locator('.moon-phase-3').waitFor();
 await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();
 await page.getByRole('dialog').locator('input').fill('Fotosynthese');
 await page.getByRole('option').filter({hasText:'Wie Blätter Sonnenlicht nutzen'}).first().click();
 await page.getByRole('heading',{name:'Wie Blätter Sonnenlicht nutzen',exact:true}).waitFor();
 await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();
 await page.getByRole('dialog').locator('input').fill('Wissens-Challenge');
 await page.getByRole('option').filter({hasText:'Wissens-Challenge'}).click();
 await page.locator('.challenge-levels').waitFor();
 for(const label of ['Leicht','Mittel','Schwer']){
  const choice=page.locator('.challenge-levels').getByRole('button').filter({hasText:label});
  if(label==='Leicht'&&width===1440){await choice.focus();await page.keyboard.press('Enter');}else await choice.click();
  const room=page.locator('.knowledge-challenge');
  const previous=(await pass()).gameSessions['world:knowledge-challenge'].challenge.ids;
  assert.equal(previous.length,6);
  for(let i=0;i<6;i++){
   const state=(await pass()).gameSessions['world:knowledge-challenge'].challenge,q=questionBank.find(q=>q.id===state.ids[i]);
   assert.equal(state.index,i);
   assert.equal(await room.locator('.lab-feedback').count(),0);
   const hint=room.locator('.world-game-hint');
   assert.equal(await hint.getAttribute('open'),null);
   await hint.locator('summary').click();
   await hint.getByText(hints[q.id].steps[0],{exact:true}).waitFor();
   if(hints[q.id].steps.length===2){
    assert.equal(await hint.getByText(hints[q.id].steps[1],{exact:true}).count(),0);
    await hint.getByRole('button',{name:'Noch ein Hinweis',exact:true}).click();
    await hint.getByText(hints[q.id].steps[1],{exact:true}).waitFor();
   }
   assert.equal(await room.getByText(q.why,{exact:true}).count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   const answers=room.locator('.quiz-answer');
   if(i===0){
    await answers.filter({has:page.getByText(q.answers.find((_,j)=>j!==q.correct),{exact:true})}).click();
    await room.getByText('Noch einmal nachdenken.',{exact:true}).waitFor();
    assert.equal(await room.getByText(q.why,{exact:true}).count(),0);
    assert.equal(await room.getByRole('button',{name:'Nächste Aufgabe',exact:true}).count(),0);
    await page.reload();await ready(page);await page.getByRole('button',{name:'Fortsetzen',exact:true}).click();
    await room.getByText('Noch einmal nachdenken.',{exact:true}).waitFor();
    assert.equal(await room.getByText(q.why,{exact:true}).count(),0);
    assert.deepEqual((await pass()).gameSessions['world:knowledge-challenge'].challenge.ids,previous);
   }
   await answers.filter({has:page.getByText(q.answers[q.correct],{exact:true})}).click();
   await room.getByText('Deine Auswahl passt.',{exact:true}).waitFor();await assertHonestChallengeFeedback(room);
   await room.getByText(q.why,{exact:true}).waitFor();
   assert.equal(await room.locator('.world-game-hint').count(),0);
   await room.getByRole('button',{name:i===5?'Spielstempel sammeln':'Nächste Aufgabe',exact:true}).click();
  }
  await room.getByRole('heading',{name:'Sechs Aufgaben gelöst!',exact:true}).waitFor();
  assert.ok((await pass()).games.includes('world:knowledge-challenge'));
  await room.getByRole('button',{name:'Andere Aufgaben auf dieser Stufe',exact:true}).click();
  const next=(await pass()).gameSessions['world:knowledge-challenge'].challenge.ids;
  assert.equal(next.some(id=>previous.includes(id)),false);
  await room.getByRole('button',{name:'Andere Stufe auswählen',exact:true}).click();
 }
 await page.screenshot({path:new URL('../../.qa-output/challenge-'+width+'.png',import.meta.url).pathname});
 if(width===1440){
  await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
  const result=await page.evaluate(async()=>window.axe.run('.knowledge-challenge',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.length})),[]);
  report.checks.push('New challenge: axe WCAG A/AA scope has no violations');
  for(const id of ['living-networks','moon-to-sea']){
   await page.evaluate(id=>location.hash='world/route/'+id,id);
   const route=routes.find(r=>r.id===id);
   for(let i=0;i<route.topics.length;i++){
    await page.locator('.world-mini-question').waitFor();
    const title=await page.locator('#world-topic-title').innerText(),t=topics.find(t=>t.title===title);
    assert.equal(t.id,route.topics[i],'each retained/appended route station is actually visited in order');
    const answer=page.locator('.world-mini-question .quiz-answer').filter({has:page.getByText(t.question.answers[t.question.correct],{exact:true})});
    if(!await answer.isDisabled())await answer.click();
    await page.getByRole('button',{name:i===route.topics.length-1?'Route abschließen':'Zur nächsten Station',exact:true}).click();
   }
   await page.getByRole('heading',{name:'Deine Wissensroute ist geschafft!',exact:true}).waitFor();
   assert.ok((await pass()).discoveries.includes('route:'+id));
  }
  report.checks.push('Both knowledge routes completed through every actual retained/appended station and real mini questions');
 }
 if(width===1440)await completedRouteFocus(page,report);
 if(width===320||width===1440)await bookNormalizationView(page,report,width);
 report.checks.push('Connected discoveries '+width+': eight articles, both models, reload, reciprocal link, search, pagination/history, three difficulties with non-revealing hints, explanation only after success, wrong/right/reload/finish and fresh follow-up rounds');
}
