import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyProgress } from '../app/progress-storage.ts';
import { STUFEN, STUFE_SCHLUESSEL, leseStufe, mitStufe, quizStufe, stufeAusAltwert } from '../app/kern/stufe.ts';

// Eine Stufe für alles (Teilschritt 3, E1): Entdecker, Profi, Experte im freien Spielspeicher des Passes.
const pass=(patch={})=>({...emptyProgress(),...patch});
const mitEinstellung=difficulty=>pass({settings:{...emptyProgress().settings,difficulty}});
const mitEintrag=(eintrag,difficulty='normal')=>({...mitEinstellung(difficulty),gameSessions:{[STUFE_SCHLUESSEL]:eintrag}});

test('die drei Stufen heißen entdecker, profi und experte',()=>{
 assert.deepEqual(STUFEN,['entdecker','profi','experte']);
 assert.equal(STUFE_SCHLUESSEL,'kern:stufe');
});

test('ein neuer Pass startet auf Entdecker',()=>{
 assert.equal(leseStufe(emptyProgress()),'entdecker');
});

test('ohne eigenen Eintrag gilt die alte Quiz-Stufe: Knifflig wird Profi, alles andere Entdecker',()=>{
 assert.equal(leseStufe(mitEinstellung('tricky')),'profi');
 assert.equal(leseStufe(mitEinstellung('normal')),'entdecker');
 assert.equal(leseStufe(mitEinstellung('easy')),'entdecker');
});

test('eine gewählte Stufe gewinnt gegen die alte Quiz-Stufe',()=>{
 assert.equal(leseStufe(mitEintrag({stufe:'entdecker',seit:'2026-11-23'},'tricky')),'entdecker');
 assert.equal(leseStufe(mitEintrag({stufe:'experte',seit:'2026-11-23'},'easy')),'experte');
 assert.equal(leseStufe(mitEintrag({stufe:'profi',seit:'2026-11-23'})),'profi');
});

test('ein kaputter Eintrag zählt wie ein fehlender',()=>{
 for(const kaputt of [{stufe:'meister'},{stufe:2},{},{stufe:null},'profi',['profi'],null]){
  assert.equal(leseStufe(mitEintrag(kaputt)),'entdecker',JSON.stringify(kaputt));
  assert.equal(leseStufe(mitEintrag(kaputt,'tricky')),'profi',JSON.stringify(kaputt)+' mit Knifflig');
 }
 assert.equal(leseStufe({...emptyProgress(),gameSessions:undefined}),'entdecker');
 assert.equal(leseStufe({...emptyProgress(),settings:undefined}),'entdecker');
});

test('alte Stufenwerte der Spiele bilden auf die drei Stufen ab',()=>{
 assert.equal(stufeAusAltwert('easy'),'entdecker');
 assert.equal(stufeAusAltwert('medium'),'profi');
 assert.equal(stufeAusAltwert('hard'),'experte');
 assert.equal(stufeAusAltwert(0),'entdecker');
 assert.equal(stufeAusAltwert(1),'profi');
 assert.equal(stufeAusAltwert(2),'experte');
 for(const unbekannt of ['normal','tricky','',3,-1,1.5,null,undefined,{}])assert.equal(stufeAusAltwert(unbekannt),null,String(unbekannt));
});

test('Stufe schreiben merkt Stufe und Datum, lässt „Weiter entdecken“ und alle Spielstände unberührt',()=>{
 const vorher=pass({lastActivity:{type:'topic',id:'animal-elephant'},gameSessions:{'world:habitats':{round:[1,2]},'topic:animal-elephant':{topicAnswer:'Rüssel'}}});
 const nachher=mitStufe(vorher,'profi',new Date('2026-11-23T10:00:00Z'));
 assert.deepEqual(nachher.gameSessions[STUFE_SCHLUESSEL],{stufe:'profi',seit:'2026-11-23'});
 assert.deepEqual(nachher.lastActivity,vorher.lastActivity);
 assert.deepEqual(nachher.gameSessions['world:habitats'],{round:[1,2]});
 assert.deepEqual(nachher.gameSessions['topic:animal-elephant'],{topicAnswer:'Rüssel'});
 assert.deepEqual(nachher.settings,vorher.settings,'die alte Quiz-Stufe wird nie mehr geschrieben');
 assert.equal(leseStufe(nachher),'profi');
});

test('dieselbe Stufe noch einmal wählen ändert den Pass nicht',()=>{
 const vorher=mitStufe(emptyProgress(),'experte',new Date('2026-11-20T10:00:00Z'));
 assert.equal(mitStufe(vorher,'experte',new Date('2026-11-23T10:00:00Z')),vorher);
});

test('ohne Eintrag ist die übernommene Stufe schon gewählt: Profi aus Knifflig ändert nichts',()=>{
 const vorher=mitEinstellung('tricky');
 assert.equal(mitStufe(vorher,'profi',new Date('2026-11-23T10:00:00Z')),vorher);
 assert.equal(leseStufe(mitStufe(vorher,'entdecker',new Date('2026-11-23T10:00:00Z'))),'entdecker');
});

test('eine ungültige Stufe wird nicht geschrieben',()=>{
 const vorher=emptyProgress();
 assert.equal(mitStufe(vorher,'meister',new Date()),vorher);
});

test('das alte Quiz folgt der gemeinsamen Stufe: Entdecker spielt Normal, Profi und Experte Knifflig',()=>{
 assert.equal(quizStufe('entdecker'),'normal');
 assert.equal(quizStufe('profi'),'tricky');
 assert.equal(quizStufe('experte'),'tricky');
});
