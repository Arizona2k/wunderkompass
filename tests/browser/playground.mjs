import {AXE_FILE} from './axe-loader.mjs';
import {globeMissionFlow} from './globe-missions.mjs';
import assert from 'node:assert/strict';
import {gameNumberLabelView} from './game-number-labels.mjs';
import {retainedAnimalRounds} from './animal-game-saves.mjs';
import {habitatAnswerSemantics} from './habitat-answer-semantics.mjs';
import {worldGameLearningCopy} from './world-game-learning-copy.mjs';
await import('../../scripts/test-runtime.mjs');
const {PLAYGROUND_GAMES}=await import('../../app/playground-catalog.ts');
const {CLASSIC_QUESTIONS,neueKlassikRunde,klassikStufe,klassikSpielStufe}=await import('../../app/classic-learning.ts');
import {createSave,emptyProgress,SAVE_KEY} from '../../app/progress-storage.ts';
import {bereich,ladeanfragen} from './harness.mjs';
const {LAYERS}=await import('../../app/earth-data.ts');
const state=p=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
const select=p=>bereich(p,'games').click();
const open=(p,id)=>p.locator('[data-game-key="classic:'+id+'"]').click();
const back=p=>p.getByRole('button',{name:'Alle Spiele',exact:true}).click();
async function geometry(p,selector){
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2),false,'playground viewport overflow');
 const small=await p.locator('.playground button:visible,.playground select:visible,.playground summary:visible,.classic-learning button:visible,.classic-learning summary:visible').evaluateAll(nodes=>nodes.filter(n=>{const r=n.getBoundingClientRect();return r.height<44||r.width<44;}).map(n=>n.textContent.slice(0,60)));assert.deepEqual(small,[],'44px game touch targets');
 const bad=await p.locator(selector).evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden').filter(n=>n.scrollWidth>n.clientWidth+2).map(n=>n.textContent.slice(0,80)));
 assert.deepEqual(bad,[],'game text must wrap');
}
async function axe(p,selector){
 await p.addScriptTag({path:AXE_FILE});
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
   await p.locator('.playground-heading').scrollIntoViewIfNeeded();for(const image of await p.locator('.playground-preview img').all()){await image.evaluate(im=>im.decode());assert.equal(await image.evaluate(im=>im.naturalWidth>0&&im.naturalHeight>0),true,'actual preview must decode before its evidence capture');}await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:shots+'/playground-selection-'+width+'.png'});await p.screenshot({path:shots+'/playground-selection-full-'+width+'.png',fullPage:true});
   await p.locator('.playground-filter-panel > summary').click();
   await p.getByLabel('Thema',{exact:true}).selectOption('Tiere & Lebensräume');await p.getByLabel('Spielart',{exact:true}).selectOption('Paare merken');await p.locator('.playground-empty').waitFor();await p.getByRole('button',{name:'Alle Spiele zeigen',exact:true}).click();
   await p.getByLabel('Thema',{exact:true}).selectOption('Tiere & Lebensräume');await open(p,'habitats');await back(p);assert.equal(await p.getByLabel('Thema',{exact:true}).inputValue(),'Tiere & Lebensräume');await p.waitForFunction(()=>document.activeElement?.dataset.gameKey==='classic:habitats');
   await p.getByRole('button',{name:'Alle Filter zurücksetzen',exact:true}).click();
   if(width===1440){for(const g of PLAYGROUND_GAMES){await p.locator('[data-game-key="'+g.key+'"]').click();if(g.id==='hunt'||g.id==='quiz')await select(p);else{await p.locator('.game-board:visible').waitFor();await back(p);}await p.locator('.playground-grid:visible').waitFor();}report.checks.push('All 31 game identities open through the shared catalog, including distinct family IDs');}
   for(const id of ['order','habitats','detective']){
    await open(p,id);await p.locator('.classic-learning').waitFor();
    if(id!=='order')await p.locator('.classic-learning .stufen-wahl').waitFor();
    await p.locator('.classic-learning .world-game-hint summary').click();await p.locator('.classic-learning').scrollIntoViewIfNeeded();await geometry(p,'.classic-learning h2,.classic-learning button,.classic-learning p');
    await p.screenshot({path:shots+'/playground-'+id+'-'+width+'.png',fullPage:true});
    if(width===320||width===1440){await axe(p,'.classic-learning');await p.locator('.classic-learning .world-game-hint summary').focus();await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.matches(':focus-visible')&&parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),true);await p.screenshot({path:shots+'/playground-focus-'+id+'-'+width+'.png'});await p.emulateMedia({forcedColors:'active'});assert.equal(await p.evaluate(()=>parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2),true);await p.emulateMedia({forcedColors:'none'});}
    await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('switch',{name:'Größere Schrift',exact:true}).check();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();await geometry(p,'.classic-learning h2,.classic-learning button,.classic-learning p');await p.locator('.classic-learning').scrollIntoViewIfNeeded();await p.screenshot({path:shots+'/playground-large-'+id+'-'+width+'.png',fullPage:true});
    await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('switch',{name:'Größere Schrift',exact:true}).uncheck();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();await back(p);
   }
   if(width===320)await gameNumberLabelView(p,report);
   if(width===320){report.globeMissions=await globeMissionFlow(p);report.checks.push('All12 globe missions: progressive hints and revealed place/region do not earn stamps, actual selections earn all12; next focus, reload and voluntary repeat retain earned progress');}
   if(width===320||width===1440)await axe(p,'.playground');
   report.views.push({width,height,name:'Shared playground, filters, three game rooms, hints, large text'});console.log('Playground viewport',width);
  }finally{await c.close();}
 }
 const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',acceptDownloads:true}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
 // Im Spielebereich lädt die App die Weltkarte (world.json) im Hintergrund; ein Neuladen mittendrin bricht sie ab.
 try{
  await p.goto(base);await ready(p);await select(p);
  // Seit Teil B, Aufgabe 9 starten die Klassik-Spiele gleich auf der Stufe aus dem Pass; jede Stufe wird über die
  // Stufenzeile gewählt. Experte spielt Profi, solange es keine vier echten Experten-Fragen gibt (E3).
  for(const game of ['habitats','detective'])for(const [stufe,name] of [['entdecker','Entdecker'],['profi','Profi'],['experte','Experte']]){
   await open(p,game);const room=p.locator('.classic-learning'),zeile=room.locator('.stufen-wahl');await zeile.waitFor();
   // Das Spiel öffnet oben, nicht mitten in der Spieleliste (Spieltest PR 2, Befund 1; gemeinsamer Spielrahmen).
   await p.waitForFunction(()=>{const oben=document.querySelector('.game-room')?.getBoundingClientRect().top;return oben!==undefined&&oben>=0&&oben<=40;});
   assert.equal(await p.locator('.challenge-levels').count(),0,'keine Auswahl Leicht/Mittel/Schwer mehr');
   if(!(await zeile.locator('.stufen-zeile').filter({hasText:'Stufe: '+name}).count())){await zeile.getByRole('button',{name:'Stufe ändern',exact:true}).tap();await zeile.getByRole('group',{name:'Welche Stufe willst du spielen?',exact:true}).getByRole('button').filter({hasText:name}).tap();}
   await zeile.locator('.stufen-zeile').filter({hasText:'Stufe: '+name}).waitFor();
   const gespielt=klassikSpielStufe(game,stufe),erlaubt=gespielt==='experte'?['experte','profi']:[gespielt];
   await p.waitForFunction(({key,game,gespielt})=>{const r=JSON.parse(localStorage.getItem(key))?.progress.gameSessions[game]?.learningRound;return r?.stufe===gespielt&&r.index===0&&r.answer===null;},{key:SAVE_KEY,game,gespielt});
   if(stufe==='experte'&&gespielt==='profi')await zeile.getByText('Experten-Aufgaben gibt es hier noch nicht. Du spielst Profi.',{exact:true}).waitFor();
   let snapshot=(await state(p)).gameSessions[game].learningRound;assert.equal(snapshot.level,null);assert.equal(snapshot.ids.length,4);assert.ok(snapshot.ids.every(id=>erlaubt.includes(klassikStufe(CLASSIC_QUESTIONS.find(q=>q.id===id)))));
   for(let i=0;i<4;i++){
    const q=CLASSIC_QUESTIONS.find(q=>q.id===snapshot.ids[i]),hint=room.locator('.world-game-hint');await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
    // Advancing a question deliberately moves focus on the next frame. Finish that real handoff before directing
    // Enter to the native disclosure. The first question has no such handoff (the round starts with the room).
    if(i>0){await p.waitForFunction(()=>document.activeElement?.id==='reason-question');
     // Nach „Nächste Aufgabe“ sind Brettanfang (Stufenzeile) und ganze Frage zu sehen (Spieltest PR 2, Befund 4).
     assert.ok(await p.evaluate(()=>{const b=document.querySelector('.game-room .game-board').getBoundingClientRect(),h=document.getElementById('reason-question').getBoundingClientRect();return b.top>=0&&h.bottom<=innerHeight;}),'Stufenzeile und Frage sind nach „Nächste Aufgabe“ zu sehen');}
    // „Spielen“ in der Leiste schließt das offene Spiel und zeigt die Übersicht, direkt und über einen anderen Bereich;
    // der Stand bleibt, „Fortsetzen“ öffnet dieselbe Aufgabe (Entscheidung 25; Code-Prüfung PR 2, Hinweise 5 und 9).
    if(game==='detective'&&stufe==='profi'&&i===1){
     const runde=(await state(p)).gameSessions.detective.learningRound;
     for(const umweg of [false,true]){
      // Vor jedem Bereichswechsel warten, bis nichts mehr lädt (Regel „Seitenwechsel im Test“; Code-Nachprüfung PR 2, Klein 3).
      if(umweg){await ladeanfragen(p)();await bereich(p,'world').click();await p.waitForFunction(()=>location.hash.startsWith('#world'));}
      await ladeanfragen(p)();await bereich(p,'games').click();await p.locator('[data-game-key="classic:detective"]').waitFor();
      await p.waitForFunction(()=>document.activeElement?.dataset.gameKey==='classic:detective');
      assert.equal(await room.count(),0,'die Spielfläche ist zu');assert.deepEqual((await state(p)).gameSessions.detective.learningRound,runde,'der Stand bleibt');
      await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
     }
    }
    assert.equal(await hint.getAttribute('open'),null);await hint.locator('summary').focus();await p.keyboard.press('Enter');await hint.getByText(q.hints[0],{exact:true}).waitFor();assert.equal(await room.getByText(q.why,{exact:true}).count(),0);
    await hint.getByRole('button',{name:'Noch ein Tipp',exact:true}).click();await hint.getByText(q.hints[1],{exact:true}).waitFor();assert.deepEqual((await state(p)).gameSessions[game].learningRound,snapshot);
    const wrong=q.answers.find(a=>a!==q.correct);await room.locator('.quiz-answer').filter({has:p.getByText(wrong,{exact:true})}).tap();await room.getByText(q.wrongReasons[wrong],{exact:true}).waitFor();assert.equal(await room.getByText(q.why,{exact:true}).count(),0);
    assert.equal((await state(p)).review['classic:'+game+':'+q.id]?.correct,false,'die erste, falsche Antwort kommt in die Wiederholung');
    // Stufen-Vorschlag im Spiel (S8; Code-Nachprüfung PR 2, Klein 2): Nach dem Neuladen bei Aufgabe 1 zählen die ersten
    // Antworten von Aufgabe 2 und 3. Zwei falsche auf Profi oder Experte schlagen „leichter“ vor (nur Fragen der Stufe der
    // Runde zählen). „Nein, ich bleibe“ schließt den Hinweis, der Fokus geht zur Frage, die Stufe im Pass bleibt.
    if(i===2){
     const vorschlag=room.locator('.stufen-vorschlag'),gezaehlt=[1,2].every(k=>klassikStufe(CLASSIC_QUESTIONS.find(f=>f.id===snapshot.ids[k]))===gespielt);
     if(gespielt==='entdecker')assert.equal(await vorschlag.count(),0,'Entdecker wird nie herabgestuft');
     else if(gezaehlt){
      await vorschlag.getByText('Ganz schön knifflig. Willst du eine Stufe leichter spielen?',{exact:true}).waitFor();
      await vorschlag.getByRole('button',{name:'Nein, ich bleibe',exact:true}).click();await vorschlag.waitFor({state:'detached'});
      await p.waitForFunction(()=>document.activeElement?.id==='reason-question');
      assert.equal((await state(p)).gameSessions['kern:stufe']?.stufe,stufe,'ein Vorschlag stellt nie selbst um');
     }
    }
    if(i===0){const saved=(await state(p)).gameSessions[game].learningRound;await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await room.getByText(q.wrongReasons[wrong],{exact:true}).waitFor();assert.deepEqual((await state(p)).gameSessions[game].learningRound,saved);await p.screenshot({path:shots+'/playground-wrong-'+game+'-'+stufe+'-390.png',fullPage:true});}
    await room.locator('.quiz-answer').filter({has:p.getByText(q.correct,{exact:true})}).click();await room.getByText(q.why,{exact:true}).waitFor();
    // Nach der richtigen Antwort liegt der Fokus auf dem Weiter-Knopf, nicht auf der Seite (Spieltest PR 2, Befunde 2 und 3).
    await p.waitForFunction(name=>document.activeElement?.tagName==='BUTTON'&&document.activeElement.textContent===name,i===3?'Runde abschließen':'Nächste Aufgabe');
    if(i===0){await room.getByRole('button',{name:/Wissen vertiefen:/}).focus();await p.keyboard.press('Enter');await p.locator('.wissenskarte').waitFor();await p.goBack();await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();await p.waitForFunction(()=>document.activeElement?.dataset.routeFocus?.startsWith('game-knowledge-'));}
    await room.getByRole('button',{name:i===3?'Runde abschließen':'Nächste Aufgabe',exact:true}).click();snapshot=(await state(p)).gameSessions[game].learningRound;
   }
   await p.getByRole('heading',{name:'Zusammenhänge entdeckt!',exact:true}).waitFor();assert.equal(snapshot.done,true);assert.equal('firstCorrect' in snapshot,false);assert.ok((await state(p)).games.includes(game));
   assert.equal(await room.getByText(/beim ersten Versuch/).count(),0,'kein Zähler auf dem Abschlussbild (E13)');assert.equal(await room.getByRole('button',{name:/Unsichere Aufgaben/}).count(),0);
   await p.screenshot({path:shots+'/playground-finish-'+game+'-'+stufe+'-390.png',fullPage:true});
   await room.getByRole('button',{name:'Noch eine Runde',exact:true}).click();
   await p.waitForFunction(({key,game})=>{const r=JSON.parse(localStorage.getItem(key))?.progress.gameSessions[game]?.learningRound;return r&&!r.done&&r.index===0&&r.answer===null;},{key:SAVE_KEY,game});
   const neu=(await state(p)).gameSessions[game];assert.equal(neu.learningRound.done,false);assert.equal(neu.learningRound.stufe,gespielt);assert.deepEqual(neu.vorige,snapshot.ids,'die gespielte Runde ist gemerkt');
   if(gespielt==='profi')assert.equal(neu.learningRound.ids.some(id=>snapshot.ids.includes(id)),false,'die nächste Profi-Runde wiederholt die vorige nicht');
   await p.waitForFunction(()=>document.activeElement?.id==='reason-question');// Fokus nach „Noch eine Runde“ (Hinweis 2)
   // „Neu mischen“ oben beginnt frisch, merkt aber die laufende Runde und behält die geschaffte Stufe (Code-Prüfung PR 2,
   // Befund 1). Nur auf Profi: Dort wiederholt die nächste Runde die vorige sicher nicht.
   if(gespielt==='profi'){
    const alt=neu.learningRound.ids;assert.ok(Object.keys(neu.geschafft??{}).length,'die geschaffte Stufe steht im Pass');
    await p.getByRole('button',{name:'Neu mischen',exact:true}).click();
    await p.waitForFunction(({key,game,alt})=>{const r=JSON.parse(localStorage.getItem(key))?.progress.gameSessions[game]?.learningRound;return r?.ids?.length===4&&r.ids.join()!==alt;},{key:SAVE_KEY,game,alt:alt.join()});
    const gemischt=(await state(p)).gameSessions[game];assert.deepEqual(gemischt.vorige,alt,'„Neu mischen“ merkt die laufende Runde');assert.deepEqual(gemischt.geschafft,neu.geschafft,'„Neu mischen“ behält die geschaffte Stufe');
    assert.equal(gemischt.learningRound.ids.some(id=>alt.includes(id)),false);
   }
   await back(p);
  }
  await open(p,'order');for(const l of [...LAYERS].reverse())await p.locator('.order-pool button').filter({hasText:l.name}).tap();await p.getByRole('button',{name:'Reihenfolge prüfen',exact:true}).click();await p.getByText('Noch nicht ganz. Versuch es noch einmal!',{exact:true}).waitFor();const wrong=(await state(p)).gameSessions.order;await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();assert.deepEqual((await state(p)).gameSessions.order,wrong);await p.getByRole('button',{name:'Meinen Bau weiter bearbeiten',exact:true}).click();for(const l of LAYERS)await p.getByRole('button',{name:l.name+' aus der Reihenfolge entfernen',exact:true}).click();for(const l of LAYERS){await p.locator('.order-pool button').filter({hasText:l.name}).focus();await p.keyboard.press('Enter');}await p.getByRole('button',{name:'Reihenfolge prüfen',exact:true}).click();await p.getByRole('button',{name:'Erdschichten im Modell entdecken',exact:true}).waitFor();assert.ok((await state(p)).games.includes('order-layers'));await p.screenshot({path:shots+'/playground-order-success-390.png',fullPage:true});
  await p.getByRole('button',{name:'Wasserkreislauf',exact:true}).click();for(const id of ['sun','cloud','rain','river']){const saved=(await state(p)).gameSessions.order;await p.locator('.order-pool button').filter({hasText:saved.pool.find(x=>x.id===id).name}).click();}await p.getByRole('button',{name:'Reihenfolge prüfen',exact:true}).click();assert.ok((await state(p)).games.includes('order-water'));await p.getByRole('button',{name:'Wasserweg auf der Wissenskarte',exact:true}).click();await p.locator('.wissenskarte').waitFor();await p.goBack();await p.getByRole('button',{name:'Noch einmal bauen',exact:true}).waitFor();
  report.checks.push('Klassik-Spiele auf allen drei Stufen (Experte spielt Profi mit Satz): zwei Tipps, Erklärung je Antwort, Reihenfolge und falsche Antwort nach Neuladen, Wiederholung im Pass, Karte und Zurück, Stempel ohne Zähler, neue Runde ohne Wiederholung der vorigen; beide Sortier-Modelle mit Tastatur und Touch');
 }finally{await c.close();}
 for(const game of ['habitats','detective']){
  const progress=emptyProgress(),legacy=game==='habitats'?{items:[{name:'Eisbär',prompt:'Ich jage Robben auf dem Meereis.',correct:'Arktis',why:'Eisbären leben in der Arktis.'}],index:0,answer:null,finished:false}:{items:[['Korallen sind Tiere.',true,'Korallen sind Tiere.']],index:0,answer:false,score:0,finished:false};progress.gameSessions[game]=legacy;progress.lastActivity={type:'game',id:game,family:'classic'};
  const c=await browser.newContext({viewport:{width:360,height:800}});await c.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));},{key:SAVE_KEY,save:createSave(progress)});const p=await c.newPage();monitor(p);try{await p.goto(base);await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await p.getByText(/Deine gespeicherte Runde:/).waitFor();assert.deepEqual((await state(p)).gameSessions[game],legacy);await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();assert.deepEqual((await state(p)).gameSessions[game],legacy);await p.screenshot({path:shots+'/playground-legacy-'+game+'-360.png',fullPage:true});}finally{await c.close();}
 }
 report.checks.push('Legacy habitat object arrays and detective mixed tuples remain unchanged through production UI and reload');
 const routeProgress=emptyProgress(),r=neueKlassikRunde('habitats','entdecker');r.ids=[...r.ids.filter(id=>id!=='habitats-easy-coral'),'habitats-easy-coral'];r.index=3;r.answer=CLASSIC_QUESTIONS.find(q=>q.id===r.ids[3]).correct;r.done=true;routeProgress.gameSessions.habitats={learningRound:r};routeProgress.games=['habitats'];routeProgress.lastActivity={type:'game',id:'habitats',family:'classic'};
 const routeContext=await browser.newContext({viewport:{width:320,height:720},reducedMotion:'reduce'});await routeContext.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));},{key:SAVE_KEY,save:createSave(routeProgress)});const routePage=await routeContext.newPage();monitor(routePage);try{await routePage.goto(base);await ready(routePage);await routePage.getByRole('button',{name:'Fortsetzen',exact:true}).click();await routePage.getByRole('button',{name:/Wissensroute:/}).focus();await routePage.keyboard.press('Enter');await routePage.locator('.wissenskarte').waitFor();assert.equal(new URL(routePage.url()).hash,'#world/route/moon-to-sea');await routePage.goBack();await routePage.locator('.game-finish').waitFor();await routePage.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='game-route-habitats');assert.equal(await routePage.evaluate(()=>document.activeElement.matches(':focus-visible')),true);assert.deepEqual((await state(routePage)).gameSessions.habitats.learningRound,r);}finally{await routeContext.close();}
 report.checks.push('Completed modern game opens an actually existing knowledge route and browser Back restores its visible keyboard opener without changing the round');

}
export async function prepareOfflinePlayground(p){
 await select(p);await open(p,'habitats');await p.locator('.classic-learning .stufen-wahl').waitFor();
 await p.waitForFunction(key=>{const r=JSON.parse(localStorage.getItem(key))?.progress.gameSessions.habitats?.learningRound;return !!r?.stufe&&r.ids?.length===4;},SAVE_KEY);
 const r=(await state(p)).gameSessions.habitats.learningRound;await back(p);await open(p,'order');await p.locator('.ordering-game').waitFor();
 await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.progress.gameSessions.order?.pool?.length===4,SAVE_KEY);
 const name=(await state(p)).gameSessions.order.pool[0].name;await p.locator('.order-pool button').filter({hasText:name}).click();
 await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.progress.gameSessions.order?.chosen?.length===1,SAVE_KEY);
 await back(p);return {habitats:r,order:(await state(p)).gameSessions.order};
}
// Ein Tipp auf „Spiele“ führt aus einem offenen Spiel immer zur Übersicht (spielenOderBereich, useZurUebersicht). Das alte Brett
// ist dabei noch einen Augenblick zu sehen; darum auf die Übersicht warten, statt das Brett zu zählen (der alte Zählweg war rot).
export async function offlinePlayground(p,report,saved){await select(p);await p.locator('.playground-grid:visible').waitFor();assert.equal(await p.locator('[data-game-key]').count(),31);await open(p,'habitats');assert.deepEqual((await state(p)).gameSessions.habitats.learningRound,saved.habitats);const q=CLASSIC_QUESTIONS.find(q=>q.id===saved.habitats.ids[0]);await p.locator('.classic-learning .world-game-hint summary').click();await p.getByText(q.hints[0],{exact:true}).waitFor();await p.locator('.classic-learning .quiz-answer').filter({has:p.getByText(q.correct,{exact:true})}).click();await p.getByText(q.why,{exact:true}).waitFor();await back(p);await open(p,'order');assert.deepEqual((await state(p)).gameSessions.order,saved.order);await back(p);await open(p,'detective');await p.locator('#reason-question').waitFor();await p.locator('.classic-learning .stufen-wahl').waitFor();report.checks.push('New playground cold offline after browser closure and server stop: 31 cards, saved random question/order, hints, correct explanation and an unopened detective game starting on the pass level');}
