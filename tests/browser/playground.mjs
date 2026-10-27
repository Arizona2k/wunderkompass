import assert from 'node:assert/strict';
import {retainedAnimalRounds} from './animal-game-saves.mjs';
import {habitatAnswerSemantics} from './habitat-answer-semantics.mjs';
import {worldGameLearningCopy} from './world-game-learning-copy.mjs';
await import('../../scripts/test-runtime.mjs');
const {PLAYGROUND_GAMES}=await import('../../app/playground-catalog.ts');
const {CLASSIC_QUESTIONS,createReasonRound}=await import('../../app/classic-learning.ts');
import {createSave,emptyProgress,SAVE_KEY} from '../../app/progress-storage.ts';
const {LAYERS}=await import('../../app/earth-data.ts');
const state=p=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
const select=p=>p.getByRole('tab',{name:'Spielplatz',exact:true}).click();
const open=(p,id)=>p.locator('[data-game-key="classic:'+id+'"]').click();
const back=p=>p.getByRole('button',{name:'Alle Spiele',exact:true}).click();
async function geometry(p,selector){
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'playground viewport overflow');
 const small=await p.locator('.playground button:visible,.playground select:visible,.playground summary:visible,.classic-learning button:visible,.classic-learning summary:visible').evaluateAll(nodes=>nodes.filter(n=>{const r=n.getBoundingClientRect();return r.height<44||r.width<44;}).map(n=>n.textContent.slice(0,60)));assert.deepEqual(small,[],'44px game touch targets');
 const bad=await p.locator(selector).evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden').filter(n=>n.scrollWidth>n.clientWidth+2).map(n=>n.textContent.slice(0,80)));
 assert.deepEqual(bad,[],'game text must wrap');
}
async function axe(p,selector){
 await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 const result=await p.evaluate(async s=>(await window.axe.run(s,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),selector);
 assert.deepEqual(result,[],'playground WCAG checks');
}
export async function playgroundFlow(browser,base,ready,monitor,report,shots){
 await habitatAnswerSemantics(browser,base,ready,monitor,report,shots);
 await worldGameLearningCopy(browser,base,ready,monitor,report,shots);
 await retainedAnimalRounds(browser,base,ready,monitor,report,shots);
 for(const [width,height] of [[320,720],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080]]){
  const c=await browser.newContext({viewport:{width,height},hasTouch:width<=390,reducedMotion:'reduce',acceptDownloads:true}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.goto(base);await ready(p);await select(p);await p.locator('.playground-grid').waitFor();assert.equal(await p.locator('[data-game-key]').count(),31);
   await geometry(p,'.playground h2,.playground h3,.playground button,.playground-goal');
   await p.locator('.playground-heading').scrollIntoViewIfNeeded();await p.screenshot({path:shots+'/playground-selection-'+width+'.png'});await p.screenshot({path:shots+'/playground-selection-full-'+width+'.png',fullPage:true});
   await p.locator('.playground-filter-panel > summary').click();
   await p.getByLabel('Thema',{exact:true}).selectOption('Tiere & Lebensräume');await p.getByLabel('Spielart',{exact:true}).selectOption('Paare merken');await p.locator('.playground-empty').waitFor();await p.getByRole('button',{name:'Alle Spiele zeigen',exact:true}).click();
   await p.getByLabel('Thema',{exact:true}).selectOption('Tiere & Lebensräume');await open(p,'habitats');await back(p);assert.equal(await p.getByLabel('Thema',{exact:true}).inputValue(),'Tiere & Lebensräume');await p.waitForFunction(()=>document.activeElement?.dataset.gameKey==='classic:habitats');
   await p.getByRole('button',{name:'Alle Filter zurücksetzen',exact:true}).click();
   if(width===1440){for(const g of PLAYGROUND_GAMES){await p.locator('[data-game-key="'+g.key+'"]').click();if(g.id==='hunt'||g.id==='quiz')await select(p);else{await p.locator('.game-board:visible').waitFor();await back(p);}await p.locator('.playground-grid:visible').waitFor();}report.checks.push('All 31 game identities open through the shared catalog, including distinct family IDs');}
   for(const id of ['order','habitats','detective']){
    await open(p,id);await p.locator('.classic-learning').waitFor();
    if(id!=='order')await p.locator('.classic-learning .challenge-levels button').filter({hasText:'Schwer'}).click();
    await p.locator('.classic-learning .world-game-hint summary').click();await p.locator('.classic-learning').scrollIntoViewIfNeeded();await geometry(p,'.classic-learning h2,.classic-learning button,.classic-learning p');
    await p.screenshot({path:shots+'/playground-'+id+'-'+width+'.png',fullPage:true});
    if(width===320||width===1440){await axe(p,'.classic-learning');await p.locator('.classic-learning .world-game-hint summary').focus();await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.matches(':focus-visible')&&parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),true);await p.screenshot({path:shots+'/playground-focus-'+id+'-'+width+'.png'});await p.emulateMedia({forcedColors:'active'});assert.equal(await p.evaluate(()=>parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),true);await p.emulateMedia({forcedColors:'none'});}
    await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('switch',{name:'Größere Schrift',exact:true}).check();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();await geometry(p,'.classic-learning h2,.classic-learning button,.classic-learning p');await p.locator('.classic-learning').scrollIntoViewIfNeeded();await p.screenshot({path:shots+'/playground-large-'+id+'-'+width+'.png',fullPage:true});
    await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('switch',{name:'Größere Schrift',exact:true}).uncheck();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();await back(p);
   }
   if(width===320||width===1440)await axe(p,'.playground');
   report.views.push({width,height,name:'Shared playground, filters, three game rooms, hints, large text'});console.log('Playground viewport',width);
  }finally{await c.close();}
 }
 const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',acceptDownloads:true}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
 try{
  await p.goto(base);await ready(p);await select(p);
  for(const game of ['habitats','detective'])for(const level of ['easy','medium','hard']){
   await open(p,game);await p.locator('.challenge-levels button').filter({hasText:{easy:'Leicht',medium:'Mittel',hard:'Schwer'}[level]}).click();
   let snapshot=(await state(p)).gameSessions[game].learningRound;assert.equal(snapshot.level,level);assert.equal(snapshot.ids.length,4);
   for(let i=0;i<4;i++){
    const q=CLASSIC_QUESTIONS.find(q=>q.id===snapshot.ids[i]),room=p.locator('.classic-learning'),hint=room.locator('.world-game-hint');await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
    // Starting/advancing a question deliberately moves focus on the next frame.
    // Finish that real handoff before directing Enter to the native disclosure.
    await p.waitForFunction(()=>document.activeElement?.id==='reason-question');
    assert.equal(await hint.getAttribute('open'),null);await hint.locator('summary').focus();await p.keyboard.press('Enter');await hint.getByText(q.hints[0],{exact:true}).waitFor();assert.equal(await room.getByText(q.why,{exact:true}).count(),0);
    await hint.getByRole('button',{name:'Noch ein Hinweis',exact:true}).click();await hint.getByText(q.hints[1],{exact:true}).waitFor();assert.deepEqual((await state(p)).gameSessions[game].learningRound,snapshot);
    const wrong=q.answers.find(a=>a!==q.correct);await room.locator('.quiz-answer').filter({has:p.getByText(wrong,{exact:true})}).tap();await room.getByText(q.wrongReasons[wrong],{exact:true}).waitFor();assert.equal(await room.getByText(q.why,{exact:true}).count(),0);
    if(i===0){const saved=(await state(p)).gameSessions[game].learningRound;await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await room.getByText(q.wrongReasons[wrong],{exact:true}).waitFor();assert.deepEqual((await state(p)).gameSessions[game].learningRound,saved);await p.screenshot({path:shots+'/playground-wrong-'+game+'-'+level+'-390.png',fullPage:true});}
    await room.locator('.quiz-answer').filter({has:p.getByText(q.correct,{exact:true})}).click();await room.getByText(q.why,{exact:true}).waitFor();
    if(i===0){await room.getByRole('button',{name:/Wissen vertiefen:/}).focus();await p.keyboard.press('Enter');await p.locator('.world-article').waitFor();await p.goBack();await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();await p.waitForFunction(()=>document.activeElement?.dataset.routeFocus?.startsWith('game-knowledge-'));}
    await room.getByRole('button',{name:i===3?'Runde abschließen':'Nächste Aufgabe',exact:true}).click();snapshot=(await state(p)).gameSessions[game].learningRound;
   }
   await p.getByRole('heading',{name:'Zusammenhänge entdeckt!',exact:true}).waitFor();assert.equal(snapshot.done,true);assert.equal(snapshot.firstCorrect,0);assert.equal(snapshot.missed.length,4);assert.ok((await state(p)).games.includes(game));await p.screenshot({path:shots+'/playground-finish-'+game+'-'+level+'-390.png',fullPage:true});await p.getByRole('button',{name:'Unsichere Aufgaben wiederholen · 4',exact:true}).click();const repeat=(await state(p)).gameSessions[game].learningRound;assert.equal(repeat.repeat,true);assert.equal(repeat.level,level);assert.deepEqual([...repeat.ids].sort(),[...snapshot.missed].sort());await p.getByRole('button',{name:'Neu mischen',exact:true}).click();await back(p);
  }
  await open(p,'order');for(const l of [...LAYERS].reverse())await p.locator('.order-pool button').filter({hasText:l.name}).tap();await p.getByRole('button',{name:'Reihenfolge prüfen',exact:true}).click();await p.getByText('Dein Bau braucht noch eine Änderung.',{exact:true}).waitFor();const wrong=(await state(p)).gameSessions.order;await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();assert.deepEqual((await state(p)).gameSessions.order,wrong);await p.getByRole('button',{name:'Meinen Bau weiter bearbeiten',exact:true}).click();for(const l of LAYERS)await p.getByRole('button',{name:l.name+' aus der Reihenfolge entfernen',exact:true}).click();for(const l of LAYERS){await p.locator('.order-pool button').filter({hasText:l.name}).focus();await p.keyboard.press('Enter');}await p.getByRole('button',{name:'Reihenfolge prüfen',exact:true}).click();await p.getByRole('button',{name:'Erdschichten im Modell entdecken',exact:true}).waitFor();assert.ok((await state(p)).games.includes('order-layers'));await p.screenshot({path:shots+'/playground-order-success-390.png',fullPage:true});
  await p.getByRole('button',{name:'Wasserkreislauf',exact:true}).click();for(const id of ['sun','cloud','rain','river']){const saved=(await state(p)).gameSessions.order;await p.locator('.order-pool button').filter({hasText:saved.pool.find(x=>x.id===id).name}).click();}await p.getByRole('button',{name:'Reihenfolge prüfen',exact:true}).click();assert.ok((await state(p)).games.includes('order-water'));await p.getByRole('button',{name:'Wasserweg auf der Wissenskarte',exact:true}).click();await p.locator('.world-article').waitFor();await p.goBack();await p.getByRole('button',{name:'Noch einmal bauen',exact:true}).waitFor();
  report.checks.push('All 24 new tasks and six genuine levels: two hint steps, specific wrong/right explanation, retained random order and wrong answer after reload, knowledge-card Back/focus, completion stamps and voluntary repeat; both sortable models with keyboard/touch correction');
 }finally{await c.close();}
 for(const game of ['habitats','detective']){
  const progress=emptyProgress(),legacy=game==='habitats'?{items:[{name:'Eisbär',prompt:'Ich jage Robben auf dem Meereis.',correct:'Arktis',why:'Eisbären leben in der Arktis.'}],index:0,answer:null,finished:false}:{items:[['Korallen sind Tiere.',true,'Korallen sind Tiere.']],index:0,answer:false,score:0,finished:false};progress.gameSessions[game]=legacy;progress.lastActivity={type:'game',id:game,family:'classic'};
  const c=await browser.newContext({viewport:{width:360,height:800}});await c.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));},{key:SAVE_KEY,save:createSave(progress)});const p=await c.newPage();monitor(p);try{await p.goto(base);await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await p.getByText(/Deine gespeicherte Runde:/).waitFor();assert.deepEqual((await state(p)).gameSessions[game],legacy);await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();assert.deepEqual((await state(p)).gameSessions[game],legacy);await p.screenshot({path:shots+'/playground-legacy-'+game+'-360.png',fullPage:true});}finally{await c.close();}
 }
 report.checks.push('Legacy habitat object arrays and detective mixed tuples remain unchanged through production UI and reload');
 const routeProgress=emptyProgress(),r=createReasonRound('habitats','easy');r.ids=[...r.ids.filter(id=>id!=='habitats-easy-coral'),'habitats-easy-coral'];r.index=3;r.answer=CLASSIC_QUESTIONS.find(q=>q.id===r.ids[3]).correct;r.done=true;r.firstCorrect=4;routeProgress.gameSessions.habitats={learningRound:r};routeProgress.games=['habitats'];routeProgress.lastActivity={type:'game',id:'habitats',family:'classic'};
 const routeContext=await browser.newContext({viewport:{width:320,height:720},reducedMotion:'reduce'});await routeContext.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));},{key:SAVE_KEY,save:createSave(routeProgress)});const routePage=await routeContext.newPage();monitor(routePage);try{await routePage.goto(base);await ready(routePage);await routePage.getByRole('button',{name:'Fortsetzen',exact:true}).click();await routePage.getByRole('button',{name:/Wissensroute:/}).focus();await routePage.keyboard.press('Enter');await routePage.locator('.world-article').waitFor();assert.equal(new URL(routePage.url()).hash,'#world/route/moon-to-sea');await routePage.goBack();await routePage.locator('.game-finish').waitFor();await routePage.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='game-route-habitats');assert.equal(await routePage.evaluate(()=>document.activeElement.matches(':focus-visible')),true);assert.deepEqual((await state(routePage)).gameSessions.habitats.learningRound,r);}finally{await routeContext.close();}
 report.checks.push('Completed modern game opens an actually existing knowledge route and browser Back restores its visible keyboard opener without changing the round');

}
export async function prepareOfflinePlayground(p){
 await select(p);await open(p,'habitats');await p.locator('.challenge-levels button').filter({hasText:'Mittel'}).click();
 await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.progress.gameSessions.habitats?.learningRound?.level==='medium',SAVE_KEY);
 const r=(await state(p)).gameSessions.habitats.learningRound;await back(p);await open(p,'order');await p.locator('.ordering-game').waitFor();
 await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.progress.gameSessions.order?.pool?.length===4,SAVE_KEY);
 const name=(await state(p)).gameSessions.order.pool[0].name;await p.locator('.order-pool button').filter({hasText:name}).click();
 await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.progress.gameSessions.order?.chosen?.length===1,SAVE_KEY);
 await back(p);return {habitats:r,order:(await state(p)).gameSessions.order};
}
export async function offlinePlayground(p,report,saved){await select(p);if(await p.locator('.game-board:visible').count())await back(p);assert.equal(await p.locator('[data-game-key]').count(),31);await open(p,'habitats');assert.deepEqual((await state(p)).gameSessions.habitats.learningRound,saved.habitats);const q=CLASSIC_QUESTIONS.find(q=>q.id===saved.habitats.ids[0]);await p.locator('.classic-learning .world-game-hint summary').click();await p.getByText(q.hints[0],{exact:true}).waitFor();await p.locator('.classic-learning .quiz-answer').filter({has:p.getByText(q.correct,{exact:true})}).click();await p.getByText(q.why,{exact:true}).waitFor();await back(p);await open(p,'order');assert.deepEqual((await state(p)).gameSessions.order,saved.order);await back(p);await open(p,'detective');await p.locator('.challenge-levels button').filter({hasText:'Schwer'}).click();await p.locator('#reason-question').waitFor();report.checks.push('New playground cold offline after browser closure and server stop: 31 cards, saved random question/order, hints, correct explanation and unopened detective level');}
