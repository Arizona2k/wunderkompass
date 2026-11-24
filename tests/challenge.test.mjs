import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHALLENGE_BANK,createChallenge,emptyChallenge,restoreChallenge} from '../app/knowledge-challenge.ts';
import {KNOWLEDGE_CONNECTIONS,connectionsFor} from '../app/knowledge-connections.ts';
const topics=JSON.parse(fs.readFileSync('app/world-catalog.json','utf8'));
test('challenge banks are unambiguous and sufficiently varied at every difficulty',()=>{
 assert.equal(new Set(CHALLENGE_BANK.map(q=>q.id)).size,CHALLENGE_BANK.length);
 for(const d of ['easy','medium','hard'])assert.ok(CHALLENGE_BANK.filter(q=>q.difficulty===d).length>=12);
 for(const q of CHALLENGE_BANK){assert.equal(new Set(q.answers).size,q.answers.length);assert.ok(q.answers[q.correct]);assert.ok(q.why.length>30);assert.ok(topics.some(t=>t.id===q.topic));}
});
test('new rounds avoid the immediately previous six questions and survive serialization',()=>{
 for(const d of ['easy','medium','hard']){
  const first=createChallenge(d,[],()=>.37),next=createChallenge(d,first.ids,()=>.72);
  assert.equal(next.ids.some(id=>first.ids.includes(id)),false);
  assert.deepEqual(restoreChallenge(JSON.parse(JSON.stringify(first)),emptyChallenge()),first);
 }
});
// Auswahl mit dem gemeinsamen Helfer (Teil B, Aufgabe 7): erst Wiederholen, dann Neues, die vorige Runde zuletzt.
const HEUTE='2026-11-24',GESTERN='2026-11-23',MORGEN='2026-11-25';
const spielbar=d=>CHALLENGE_BANK.filter(q=>q.difficulty===d&&!q.ruht);
test('eine falsch beantwortete, fällige Frage kommt in die nächste Runde',()=>{
 for(const d of ['easy','medium','hard'])for(const q of [spielbar(d)[0],spielbar(d).at(-1)]){
  const review={['challenge:'+q.id]:{correct:false,seen:1,due:GESTERN}};
  for(const zufall of [.1,.5,.9])assert.ok(createChallenge(d,[],()=>zufall,review,HEUTE).ids.includes(q.id),d+' '+q.id);
 }
});
test('schon gesehene, nicht fällige Fragen kommen erst nach allen ungesehenen',()=>{
 const pool=spielbar('medium'),offen=pool.slice(-6).map(q=>q.id);
 const review=Object.fromEntries(pool.slice(0,-6).map(q=>['challenge:'+q.id,{correct:true,seen:1,due:MORGEN}]));
 assert.deepEqual([...createChallenge('medium',[],()=>.3,review,HEUTE).ids].sort(),[...offen].sort());
});
test('eine falsche Antwort aus der vorigen Runde kommt eine Runde später wieder',()=>{
 const erste=createChallenge('hard',[],()=>.4,{},HEUTE),falsch=erste.ids[2];
 const review=Object.fromEntries(erste.ids.map(id=>['challenge:'+id,id===falsch?{correct:false,seen:1,due:HEUTE}:{correct:true,seen:1,due:MORGEN}]));
 const zweite=createChallenge('hard',erste.ids,()=>.4,review,HEUTE);
 assert.equal(zweite.ids.includes(falsch),false,'nicht sofort in der nächsten Runde');
 assert.ok(createChallenge('hard',zweite.ids,()=>.4,review,HEUTE).ids.includes(falsch),'aber in der übernächsten');
});
test('ruhende Fragen kommen nie in eine Runde, auch wenn sie in review stehen',()=>{
 const ruhend=CHALLENGE_BANK.filter(q=>q.ruht);assert.ok(ruhend.length>0,'es gibt ruhende Fragen');
 const review=Object.fromEntries(ruhend.map(q=>['challenge:'+q.id,{correct:false,seen:1,due:GESTERN}]));
 for(const d of ['easy','medium','hard'])for(const zufall of [.2,.7])assert.equal(createChallenge(d,[],()=>zufall,review,HEUTE).ids.some(id=>ruhend.some(q=>q.id===id)),false,d);
});

test('corrupt or outdated sessions cannot show invalid choices or a fabricated finish',()=>{
 const s=createChallenge('hard',[],()=>.5),fallback=emptyChallenge();
 for(const broken of [{...s,ids:[s.ids[0],...s.ids.slice(0,5)]},{...s,index:99},{...s,answer:'invalid'},{...s,done:true},{...s,orders:{}},{...s,difficulty:'unknown'},null])assert.deepEqual(restoreChallenge(broken,fallback),fallback);
 const q=CHALLENGE_BANK.find(q=>q.id===s.ids[5]);
 const completed={...s,index:5,answer:q.answers[q.correct],done:true};
 assert.deepEqual(restoreChallenge(completed,fallback),completed);
});
test('explained relationships are unique, resolvable from both ends and point to existing topic IDs',()=>{
 const graph=JSON.parse(fs.readFileSync('app/world-connections.json','utf8')).connections;
 assert.ok(graph.length>0);assert.deepEqual(KNOWLEDGE_CONNECTIONS,graph,'the app resolver reads the canonical connection file');
 assert.equal(new Set(graph.map(c=>c.id)).size,graph.length,'connection IDs are unique');
 const pairs=new Set();
 for(const c of graph){
  const from=topics.find(t=>t.id===c.fromId),to=topics.find(t=>t.id===c.toId);
  assert.ok(from,c.id+' from '+c.fromId);assert.ok(to,c.id+' to '+c.toId);assert.notEqual(c.fromId,c.toId,c.id+' links two different topics');
  const pair=[c.fromId,c.toId].sort().join('|');assert.equal(pairs.has(pair),false,c.id+' duplicate topic pair');pairs.add(pair);
  assert.ok(c.why.length>50);for(const[a,b]of[[from,to],[to,from]])assert.ok(connectionsFor(a.id).some(r=>r.id===c.id&&r.topic===b.id&&r.why===c.why),c.id+' shown at '+a.id);
 }
});
import {createSave,restoreSave,emptyProgress} from '../app/progress-storage.ts';
test('schema-3 export/import keeps the new round alongside existing progress',()=>{
 const progress=emptyProgress(),session=createChallenge('medium',[],()=>.44);
 progress.favorites=['topic:animal-polar-bear'];progress.journeys=['ocean'];
 progress.gameSessions={'world:knowledge-challenge':{challenge:session,vorige:createChallenge('medium',[],()=>.61).ids},memory:{open:[0],matched:[]}};
 progress.lastActivity={type:'game',id:'world:knowledge-challenge',family:'world'};
 const imported=restoreSave(JSON.parse(JSON.stringify(createSave(progress))),true).progress;
 assert.deepEqual(imported.favorites,progress.favorites);assert.deepEqual(imported.journeys,progress.journeys);
 assert.deepEqual(imported.gameSessions,progress.gameSessions);assert.deepEqual(imported.lastActivity,progress.lastActivity);
 assert.deepEqual(restoreChallenge(imported.gameSessions['world:knowledge-challenge'].challenge,emptyChallenge()),session);
});

const hints=JSON.parse(fs.readFileSync('app/challenge-hints.json','utf8'));
test('every playable question has individually authored hints and no orphan or copied solution',()=>{
 assert.deepEqual(Object.keys(hints).sort(),CHALLENGE_BANK.map(q=>q.id).sort());
 const first=new Set();
 for(const q of CHALLENGE_BANK){
  assert.deepEqual(q.hints,hints[q.id].steps,q.id);
  assert.ok(q.topicTitle,q.id);
  assert.ok(q.hints.length>=1&&q.hints.length<=2,q.id);
  assert.equal(first.has(q.hints[0]),false,q.id+' repeated standard hint');first.add(q.hints[0]);
  for(const hint of q.hints){
   // Ein echter, eigener Satz (keine Platzhalter). Seit Teilschritt 3 sind Tipps kindgerecht kurz (kinder-redaktion); früher galten 45 Zeichen.
   assert.ok(typeof hint==='string'&&hint.length>=20&&hint.length<=350,q.id);
   assert.notEqual(hint,q.why,q.id+' answer explanation used as hint');
   const correct=q.answers[q.correct].toLocaleLowerCase('de').replace(/[.!?]$/,'');
   assert.equal(hint.toLocaleLowerCase('de').includes(correct),false,q.id+' literal answer leak');
  }
  if(q.hints.length===2)assert.notEqual(q.hints[0],q.hints[1],q.id);
 }
});
test('pre-hint saved rounds keep their IDs, order, answer and earned finish at all levels',()=>{
 for(const difficulty of ['easy','medium','hard']){
  const round=createChallenge(difficulty,[],()=>.31);
  for(const index of [0,3,5]){
   const q=CHALLENGE_BANK.find(q=>q.id===round.ids[index]);
   for(const answer of [null,q.answers[q.correct],q.answers.find((_,i)=>i!==q.correct)]){
    const old={...round,index,answer};
    assert.deepEqual(restoreChallenge(JSON.parse(JSON.stringify(old)),emptyChallenge()),old);
   }
  }
  const q=CHALLENGE_BANK.find(q=>q.id===round.ids[5]);
  const earned={...round,index:5,answer:q.answers[q.correct],done:true};
  assert.deepEqual(restoreChallenge(JSON.parse(JSON.stringify(earned)),emptyChallenge()),earned);
 }
});

// Teil B, Aufgabe 9.1: Kreuz und quer nach der gemeinsamen Stufe (Entscheidungsliste Teil B, Punkt 8).
import {kreuzUndQuerRunde,stufeDerFrage,EXPERTEN_HINWEIS} from '../app/knowledge-challenge.ts';
test('Kreuz und quer wählt je Stufe aus dem passenden Vorrat',()=>{
 const stufeVon=id=>stufeDerFrage(CHALLENGE_BANK.find(q=>q.id===id));
 for(const seed of [.1,.4,.8]){
  const e=kreuzUndQuerRunde('entdecker',[],()=>seed,{},HEUTE),p=kreuzUndQuerRunde('profi',[],()=>seed,{},HEUTE),x=kreuzUndQuerRunde('experte',[],()=>seed,{},HEUTE);
  for(const r of [e,p,x]){assert.equal(r.ids.length,6);assert.equal(new Set(r.ids).size,6);assert.equal(r.difficulty,null);assert.equal(r.ids.some(id=>CHALLENGE_BANK.find(q=>q.id===id).ruht),false);}
  assert.equal(e.stufe,'entdecker');assert.ok(e.ids.every(id=>stufeVon(id)==='entdecker'));
  assert.equal(p.stufe,'profi');assert.ok(p.ids.every(id=>stufeVon(id)==='profi'));
  const experten=CHALLENGE_BANK.filter(q=>stufeDerFrage(q)==='experte'&&!q.ruht).map(q=>q.id);
  assert.equal(x.stufe,'experte');assert.ok(experten.length<6,'es gibt erst wenige Experten-Fragen');
  assert.equal(x.ids.filter(id=>experten.includes(id)).length,Math.min(3,experten.length),'Experte bekommt höchstens drei Experten-Fragen');
  assert.ok(x.ids.slice(0,Math.min(3,experten.length)).every(id=>experten.includes(id)),'sie kommen zuerst');
  assert.ok(x.ids.filter(id=>!experten.includes(id)).every(id=>stufeVon(id)==='profi'),'dann Profi-Fragen');
 }
 assert.equal(EXPERTEN_HINWEIS,'Hier gibt es erst wenige Experten-Fragen. Du bekommst bis zu drei davon, dann Profi-Fragen.');
});
test('Hauptfragen sind Entdecker, Challenge-Fragen ohne Einstufung Profi',()=>{
 for(const q of CHALLENGE_BANK)assert.equal(stufeDerFrage(q),q.id.endsWith(':mini')?'entdecker':(q.level??'profi'),q.id);
});
test('eine neue Runde übersteht Speichern und Laden, alte Runden mit Leicht/Mittel/Schwer auch',()=>{
 for(const stufe of ['entdecker','profi','experte']){
  const r=kreuzUndQuerRunde(stufe,[],()=>.33,{},HEUTE);
  assert.deepEqual(restoreChallenge(JSON.parse(JSON.stringify(r)),emptyChallenge()),r,stufe);
  const q=CHALLENGE_BANK.find(q=>q.id===r.ids[5]);
  const fertig={...r,index:5,answer:q.answers[q.correct],done:true};
  assert.deepEqual(restoreChallenge(fertig,emptyChallenge()),fertig,stufe+' fertig');
  assert.deepEqual(restoreChallenge({...r,stufe:'meister'},emptyChallenge()),emptyChallenge(),'unbekannte Stufe');
  const fremd={...r,ids:[...r.ids.slice(0,5),CHALLENGE_BANK.find(q=>stufeDerFrage(q)!==stufe&&!(stufe==='experte'&&stufeDerFrage(q)==='profi')).id]};
  assert.deepEqual(restoreChallenge(fremd,emptyChallenge()),emptyChallenge(),stufe+': Frage aus einer anderen Stufe');
 }
 const alt=createChallenge('medium',[],()=>.5);
 assert.deepEqual(restoreChallenge(JSON.parse(JSON.stringify(alt)),emptyChallenge()),alt,'alte Runde läuft weiter');
});
test('Kreuz und quer liest Wiederholungen und meidet die vorige Runde',()=>{
 const pool=CHALLENGE_BANK.filter(q=>stufeDerFrage(q)==='profi'&&!q.ruht),falsch=pool.at(-1).id;
 assert.ok(kreuzUndQuerRunde('profi',[],()=>.2,{['challenge:'+falsch]:{correct:false,seen:1,due:GESTERN}},HEUTE).ids.includes(falsch));
 const erste=kreuzUndQuerRunde('profi',[],()=>.2,{},HEUTE),zweite=kreuzUndQuerRunde('profi',erste.ids,()=>.7,{},HEUTE);
 assert.equal(zweite.ids.some(id=>erste.ids.includes(id)),false);
});
test('Experten-Runden wechseln: nach einer Runde kommt die übrige Experten-Frage zuerst',()=>{
 const experten=CHALLENGE_BANK.filter(q=>stufeDerFrage(q)==='experte'&&!q.ruht).map(q=>q.id);
 assert.ok(experten.length>3,'mehr Experten-Fragen als je Runde gezogen werden');
 const erste=kreuzUndQuerRunde('experte',[],()=>.3,{},HEUTE),zweite=kreuzUndQuerRunde('experte',erste.ids,()=>.3,{},HEUTE);
 const neu=experten.filter(id=>!erste.ids.includes(id));
 assert.ok(neu.every(id=>zweite.ids.includes(id)),'die Experten-Frage aus der vorigen Runde fehlt nicht noch einmal');
});
