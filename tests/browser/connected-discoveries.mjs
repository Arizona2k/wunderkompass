import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const topics=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const questionBank=topics.flatMap(t=>[{...t.question,id:t.id+':mini'},...(t.challenges??[])]);
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
 await page.getByRole('button',{name:'Nächste Seite',exact:true}).click();
 assert.equal(new URL(page.url()).hash,'#world/science/page/2');
 assert.equal(await page.locator('.world-topic-tile').count(),11);
 await page.goBack();await page.waitForFunction(()=>location.hash==='#world/science');
 assert.equal(await page.locator('.world-topic-tile').count(),12);
 await page.goForward();await page.waitForFunction(()=>location.hash==='#world/science/page/2');
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
   assert.ok((await hint.innerText()).length>60);
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
   await room.getByText('Richtig erklärt!',{exact:true}).waitFor();
   await room.getByText(q.why,{exact:true}).waitFor();
   assert.equal(await room.locator('.world-game-hint').count(),0);
   await room.getByRole('button',{name:i===5?'Spielstempel sammeln':'Nächste Aufgabe',exact:true}).click();
  }
  await room.getByRole('heading',{name:'Sechs Zusammenhänge erklärt!',exact:true}).waitFor();
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
   for(let i=0;i<5;i++){
    await page.locator('.world-mini-question').waitFor();
    const title=await page.locator('#world-topic-title').innerText(),t=topics.find(t=>t.title===title);
    const answer=page.locator('.world-mini-question .quiz-answer').filter({has:page.getByText(t.question.answers[t.question.correct],{exact:true})});
    if(!await answer.isDisabled())await answer.click();
    await page.getByRole('button',{name:i===4?'Lernreise abschließen':'Zur nächsten Station',exact:true}).click();
   }
   await page.getByRole('heading',{name:'Deine Reise ist erklärt!',exact:true}).waitFor();
   assert.ok((await pass()).discoveries.includes('route:'+id));
  }
  report.checks.push('Both new five-station routes completed through real mini questions');
 }
 report.checks.push('Connected discoveries '+width+': eight articles, both models, reload, reciprocal link, search, pagination/history, three difficulties with non-revealing hints, explanation only after success, wrong/right/reload/finish and fresh follow-up rounds');
}
