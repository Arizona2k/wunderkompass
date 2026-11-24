import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {PLAYGROUND_GAMES,filterGames,gameStatus,gameSaveId} from '../app/playground-catalog.ts';
import {CLASSIC_QUESTIONS,KLASSIK_RUNDE,neueKlassikRunde,klassikStufe,klassikSpielStufe,hatExperte,restoreReasonRound,answerReasonRound,emptyReasonRound} from '../app/classic-learning.ts';
import {emptyProgress,createSave,restoreSave} from '../app/progress-storage.ts';
import {LAYERS} from '../app/earth-data.ts';
const find=(key)=>PLAYGROUND_GAMES.find(g=>g.key===key);
test('all 31 existing game identities retain a theme, mechanic and honest level support',()=>{
 assert.equal(PLAYGROUND_GAMES.length,31);assert.equal(new Set(PLAYGROUND_GAMES.map(g=>g.key)).size,31);
 for(const g of PLAYGROUND_GAMES){assert.ok(g.theme&&g.mechanic&&g.goal&&g.age>=6);assert.equal(gameSaveId(g),g.family==='world'?'world:'+g.id:g.id);}
 assert.equal(find('classic:memory').levels,false);assert.equal(find('extra:continent-sort').levels,false);
 assert.equal(filterGames('Tiere & Lebensräume','Paare merken').length,0);assert.ok(filterGames('Tiere & Lebensräume','Sortieren & zuordnen').length>1);
 const p=emptyProgress();p.gameSessions.habitats={items:[{name:'Eisbär'}],index:0};p.games=['world:habitats'];
 assert.equal(gameStatus(find('classic:habitats'),p).resume,true);assert.equal(gameStatus(find('world:habitats'),p).resume,false);assert.equal(gameStatus(find('world:habitats'),p).stamped,true);
 p.gameSessions['world:habitats']={roundDone:true};assert.equal(gameStatus(find('world:habitats'),p).finished,true);assert.equal(gameStatus(find('classic:habitats'),p).finished,false);
});
test('a past order stamp does not mark a wrong current build finished, and quiz/hunt use existing state',()=>{
 const p=emptyProgress();p.games=['order-layers'];p.gameSessions.order={topic:'layers',pool:LAYERS,chosen:[...LAYERS].reverse().map(l=>l.id),checked:true};
 assert.equal(gameStatus(find('classic:order'),p).finished,false);assert.equal(gameStatus(find('classic:order'),p).resume,true);
 p.gameSessions['ocean-find']={index:4,found:true};assert.equal(gameStatus(find('extra:ocean-find'),p).finished,true);p.gameSessions['ocean-find']={index:3,found:true};assert.equal(gameStatus(find('extra:ocean-find'),p).resume,true);p.gameSessions.habitats={learningRound:emptyReasonRound()};assert.equal(gameStatus(find('classic:habitats'),p).resume,false);
 p.gameSessions.order.chosen=LAYERS.map(l=>l.id);assert.equal(gameStatus(find('classic:order'),p).finished,true);
 p.quizSession={finished:false,index:2,ids:['a','b','c']};assert.equal(gameStatus(find('classic:quiz'),p).resume,true);
 p.missions=[0,1];assert.equal(gameStatus(find('classic:hunt'),p).resume,true);
});
const HEUTE='2026-11-24',GESTERN='2026-11-23';
test('Klassik-Fragen: Karte, Erklärung je Antwort, Tipps ohne Lösung, Antwortzahl und Vorrat je Stufe',()=>{
 const topics=JSON.parse(fs.readFileSync(new URL('../app/world-index.json',import.meta.url))),ids=new Set();
 for(const q of CLASSIC_QUESTIONS){
  assert.ok(!ids.has(q.id),q.id);ids.add(q.id);assert.ok(topics.some(t=>t.id===q.topic),q.id+' Karte');
  assert.equal(new Set(q.answers).size,q.answers.length,q.id);assert.ok(q.answers.includes(q.correct),q.id);assert.ok(q.why.length>40,q.id+' Erklärung');
  for(const a of q.answers.filter(a=>a!==q.correct))assert.ok(q.wrongReasons[a]?.length>20,q.id+' warum nicht: '+a);
  for(const h of q.hints)assert.ok(!h.toLocaleLowerCase('de').includes(q.correct.toLocaleLowerCase('de')),q.id+' Tipp verrät die Lösung');
 }
 // Teil B, Aufgabe 9: Entdecker 2 oder 3 Antworten, Profi und Experte vier (E5); jeder Vorrat ist größer als eine Runde.
 for(const q of CLASSIC_QUESTIONS.filter(q=>q.game==='detective'&&!q.ruht))assert.equal(q.answers.length,klassikStufe(q)==='entdecker'?2:4,q.id);
 for(const game of ['habitats','detective'])for(const stufe of ['entdecker','profi']){const pool=CLASSIC_QUESTIONS.filter(q=>q.game===game&&!q.ruht&&klassikStufe(q)===stufe);assert.ok(pool.length>=KLASSIK_RUNDE,game+' '+stufe+': '+pool.length);}
 assert.ok(hatExperte('detective'),'„Stimmt das wirklich?“ hat mindestens vier echte Experten-Fragen');assert.equal(hatExperte('habitats'),false);
 // Höchstens eine Frage einer Gruppe je Runde, und eine Erklärung in fester Reihenfolge wird nicht gemischt.
 for(let i=0;i<60;i++){const r=neueKlassikRunde('detective','experte',{},[],()=>((i*7919)%101)/101,HEUTE);const gruppen=r.ids.map(id=>CLASSIC_QUESTIONS.find(q=>q.id===id).gruppe).filter(Boolean);assert.equal(new Set(gruppen).size,gruppen.length,'zwei Fragen einer Gruppe');for(const id of r.ids){const q=CLASSIC_QUESTIONS.find(q=>q.id===id);if(q.festeReihenfolge)assert.deepEqual(r.orders[id],q.answers);}assert.ok(r.ids.filter(id=>klassikStufe(CLASSIC_QUESTIONS.find(q=>q.id===id))==='experte').length<=3);}
});
// Teil B, Aufgabe 9: „Stimmt das wirklich?“ und „Wer lebt wo?“ folgen der gemeinsamen Stufe.
const stufeVon=id=>klassikStufe(CLASSIC_QUESTIONS.find(q=>q.id===id));
test('neue Klassik-Runden folgen der Stufe, lesen Wiederholungen und meiden die vorige Runde',()=>{
 for(const game of ['habitats','detective']){
  for(const zufall of [.1,.5,.9]){
   const e=neueKlassikRunde(game,'entdecker',{},[],()=>zufall,HEUTE),p=neueKlassikRunde(game,'profi',{},[],()=>zufall,HEUTE);
   for(const r of [e,p]){assert.equal(r.level,null);assert.equal(r.ids.length,4);assert.equal(new Set(r.ids).size,4);for(const id of r.ids)assert.deepEqual([...r.orders[id]].sort(),[...CLASSIC_QUESTIONS.find(q=>q.id===id).answers].sort());}
   assert.equal(e.stufe,'entdecker');assert.ok(e.ids.every(id=>stufeVon(id)==='entdecker'));
   assert.equal(p.stufe,'profi');assert.ok(p.ids.every(id=>stufeVon(id)==='profi'));
   const zweite=neueKlassikRunde(game,'profi',{},p.ids,()=>zufall,HEUTE);assert.equal(zweite.ids.some(id=>p.ids.includes(id)),false,game+': die nächste Profi-Runde wiederholt die vorige nicht');
  }
  // Experte nur mit mindestens vier echten Experten-Fragen (E3, Entscheidung C1), sonst Profi.
  const x=neueKlassikRunde(game,'experte',{},[],()=>.3,HEUTE);
  if(hatExperte(game)){assert.equal(x.stufe,'experte');assert.ok(x.ids.filter(id=>stufeVon(id)==='experte').length<=3);}
  else{assert.equal(x.stufe,'profi');assert.equal(klassikSpielStufe(game,'experte'),'profi');assert.ok(x.ids.every(id=>stufeVon(id)==='profi'));}
  const pool=CLASSIC_QUESTIONS.filter(q=>q.game===game&&!q.ruht&&klassikStufe(q)==='profi'),falsch=pool.at(-1).id;
  assert.ok(neueKlassikRunde(game,'profi',{['classic:'+game+':'+falsch]:{correct:false,seen:1,due:GESTERN}},[],()=>.2,HEUTE).ids.includes(falsch),game+': eine falsch beantwortete, fällige Frage kommt wieder');
 }
 assert.equal(stufeVon('detective-easy-coral'),'entdecker');assert.equal(stufeVon('detective-hard-coral'),'profi','schwere Fragen sind Profi, keine Experten-Fragen (Stufen-Prüfung 24.11.2026)');
});
test('Antworten zählen ohne Zähler, neue und alte Runden überstehen Speichern und Laden',()=>{
 let r=neueKlassikRunde('habitats','profi',{},[],()=>.4,HEUTE);const ids=[...r.ids],orders=structuredClone(r.orders),q=CLASSIC_QUESTIONS.find(q=>q.id===r.ids[0]);
 r=answerReasonRound(r,q.answers.find(a=>a!==q.correct));assert.notEqual(r.answer,q.correct);r=answerReasonRound(r,q.correct);assert.equal(r.answer,q.correct);assert.equal(answerReasonRound(r,q.correct),r);
 assert.equal('firstCorrect' in r,false,'kein Zähler „… davon beim ersten Versuch“ (E13)');
 assert.deepEqual(restoreReasonRound('habitats',structuredClone(r)),r);assert.deepEqual(r.ids,ids);assert.deepEqual(r.orders,orders);
 for(let i=1;i<r.ids.length;i++){r={...r,index:i,answer:null};r=answerReasonRound(r,CLASSIC_QUESTIONS.find(q=>q.id===r.ids[i]).correct);}r={...r,done:true};assert.equal(restoreReasonRound('habitats',r).done,true);
 // Eine Runde aus der Zeit von Leicht/Mittel/Schwer läuft mit ihren Fragen weiter; alte Zählerfelder fallen weg.
 const alteIds=CLASSIC_QUESTIONS.filter(q=>q.game==='detective'&&q.level==='hard').map(q=>q.id);
 const alt={level:'hard',ids:alteIds,orders:Object.fromEntries(alteIds.map(id=>[id,[...CLASSIC_QUESTIONS.find(q=>q.id===id).answers].reverse()])),index:2,answer:null,done:false,missed:[alteIds[0]],firstCorrect:1,repeat:false};
 assert.deepEqual(restoreReasonRound('detective',structuredClone(alt)),{level:'hard',ids:alt.ids,orders:alt.orders,index:2,answer:null,done:false});
});
test('kaputte oder fremde Runden wechseln weder Spiel noch Stufe und verraten keine Antwort',()=>{
 const r=neueKlassikRunde('detective','profi',{},[],()=>.6,HEUTE);assert.deepEqual(restoreReasonRound('habitats',r),emptyReasonRound());assert.deepEqual(restoreReasonRound('detective',{...r,ids:[...r.ids,r.ids[0]]}),emptyReasonRound());
 assert.deepEqual(restoreReasonRound('detective',{...r,stufe:'meister'}),emptyReasonRound(),'unbekannte Stufe');
 assert.deepEqual(restoreReasonRound('detective',{...r,level:'hard'}),emptyReasonRound(),'neue Runde mit alter Einteilung');
 const entdecker=CLASSIC_QUESTIONS.find(q=>q.game==='detective'&&klassikStufe(q)==='entdecker').id;
 assert.deepEqual(restoreReasonRound('detective',{...r,ids:[...r.ids.slice(0,3),entdecker]}),emptyReasonRound(),'Frage aus einer anderen Stufe');
 const q=CLASSIC_QUESTIONS.find(q=>q.id===r.ids[0]),fixed=restoreReasonRound('detective',{...r,orders:{...r.orders,[q.id]:Array(3).fill(q.correct)},index:-20,answer:'made up',done:true});
 assert.deepEqual([...fixed.orders[q.id]].sort(),[...q.answers].sort(),'eine kaputte Reihenfolge wird neu gemischt');assert.equal(fixed.index,0);assert.equal(fixed.answer,null);assert.equal(fixed.done,false);
});
test('schema-3 backup retains legacy shuffled tuples, collisions, notes, stamps and new round fields together',()=>{
 const p=emptyProgress();p.settings.readVoice='';p.games=['order-water','world:habitats'];p.favorites=['topic:animal-polar-bear'];p.notes=[{id:'synthetic',text:'Prüfnotiz',at:'2026-10-11T13:00:00.000Z'}];
 const legacy={items:[['Korallen sind Tiere.',true,'Korallen sind Tiere.']],index:0,answer:false,score:0,finished:false};
 p.gameSessions={detective:legacy,habitats:{items:[{name:'Eisbär',correct:'Arktis',prompt:'Meereis',why:'Im Norden'}],index:0,answer:null,finished:false},'world:habitats':{items:['animal-polar-bear'],roundAnswer:'Savanne',roundDone:false},'world:animal-detective':{roundAnswer:null},'animal-detective':{items:[]},order:{chosen:['sun'],pool:[{id:'sun',name:'Wasser verdunstet',text:'Flüssig wird gasförmig'}]},'test-new':{learningRound:neueKlassikRunde('detective','profi',{},[],()=>.4,HEUTE),vorige:['detective-easy-coral'],geschafft:{profi:'2026-11-24'}}};
 const restored=restoreSave(JSON.parse(JSON.stringify(createSave(p))),true).progress;assert.deepEqual(restored,p);assert.deepEqual(restored.gameSessions.detective,legacy);
});
test('eine angefangene Klassik-Runde mit Stufe gilt in der Spiele-Übersicht als offen',()=>{
 const p=emptyProgress(),g=PLAYGROUND_GAMES.find(g=>g.key==='classic:detective');
 p.gameSessions.detective={learningRound:neueKlassikRunde('detective','profi',{},[],()=>.3,HEUTE)};
 assert.equal(gameStatus(g,p).resume,true);
 p.gameSessions.detective.learningRound={...p.gameSessions.detective.learningRound,index:3,answer:CLASSIC_QUESTIONS.find(q=>q.id===p.gameSessions.detective.learningRound.ids[3]).correct,done:true};
 assert.equal(gameStatus(g,p).finished,true);
});

// Umformulierte richtige Antworten (Teil B, PR 2): Eine alte, fertige Runde bleibt fertig (Code-Prüfung PR 2, Risiko 3).
test('alte Klassik-Runde behält ihre gelöste Frage nach dem Umformulieren',()=>{
 const alt=[['detective-hard-seasons','Nein, die Südhalbkugel hat die entgegengesetzte Jahreszeit','Nein, in Australien ist dann Sommer','Ja, ein kalter Ort beweist globale Kälte'],['detective-hard-coral','Nein, Bleiche zeigt Stress, aber nicht sicher den Tod','Nein, sie kann sich noch erholen','Ja, eine Farbänderung beweist immer den Tod']];
 for(const [letzte,alteRichtige,neueRichtige,alteFalsche] of alt){
  const ids=CLASSIC_QUESTIONS.filter(q=>q.game==='detective'&&q.level==='hard'&&q.id!==letzte).map(q=>q.id).slice(0,3).concat(letzte);
  const orders=Object.fromEntries(ids.map(id=>[id,[...CLASSIC_QUESTIONS.find(q=>q.id===id).answers]]));orders[letzte]=[alteRichtige,alteFalsche,'eine dritte alte Antwort'];
  const r=restoreReasonRound('detective',{level:'hard',ids,orders,index:3,answer:alteRichtige,done:true});
  assert.equal(r.answer,neueRichtige,letzte);assert.equal(r.done,true,'das Abschlussbild bleibt');
  assert.deepEqual([...r.orders[letzte]].sort(),[...CLASSIC_QUESTIONS.find(q=>q.id===letzte).answers].sort(),'die alte Reihenfolge wird durch die neuen Antworten ersetzt');
  const f=restoreReasonRound('detective',{level:'hard',ids,orders,index:3,answer:alteFalsche,done:false});
  assert.equal(f.answer,null,'eine alte falsche Antwort fällt still weg');assert.equal(f.done,false);
 }
 assert.equal(restoreReasonRound('detective',{level:'hard',ids:['detective-hard-seasons'],orders:{'detective-hard-seasons':[]},index:0,answer:'constructor',done:false}).answer,null,'kein Zugriff auf geerbte Schlüssel');
});
