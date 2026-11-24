import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waehleAufgaben, vorigeRunde } from '../app/kern/auswahl.ts';

// Abwechslung in Spielrunden (Teilschritt 3, E7): falsch und fällig, dann ungesehen, dann fällig, dann der Rest.
// Die vorige Runde kommt zuletzt (Entscheidungsliste Teil B, Punkt 1).
const HEUTE='2026-11-24',GESTERN='2026-11-23',MORGEN='2026-11-25';
const schluessel=id=>'spiel:'+id;
// Fester Zufall: einfacher linearer Kongruenzgenerator, damit jeder Lauf gleich ist.
const zufallAus=start=>{let s=start>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/2**32;};};
const menge=liste=>[...liste].sort();

// Je vier Aufgaben pro Gruppe: f = falsch und fällig, u = ungesehen, d = fällig, r = Rest (nicht fällig).
const vorrat=['f1','f2','f3','f4','u1','u2','u3','u4','d1','d2','d3','d4','r1','r2','r3','r4'];
const review={
 ...Object.fromEntries(['f1','f2','f3','f4'].map(id=>[schluessel(id),{correct:false,seen:1,due:GESTERN}])),
 ...Object.fromEntries(['d1','d2','d3','d4'].map(id=>[schluessel(id),{correct:true,seen:2,due:HEUTE}])),
 ...Object.fromEntries(['r1','r2','r3','r4'].map(id=>[schluessel(id),{correct:true,seen:3,due:MORGEN}]))
};
const waehle=(extra={})=>waehleAufgaben({vorrat,review,schluessel,anzahl:4,heute:HEUTE,zufall:zufallAus(7),...extra});

test('falsch und fällig kommt vor ungesehen, ungesehen vor fällig, fällig vor dem Rest',()=>{
 assert.deepEqual(menge(waehle({anzahl:4})),['f1','f2','f3','f4']);
 assert.deepEqual(menge(waehle({anzahl:8})),['f1','f2','f3','f4','u1','u2','u3','u4']);
 assert.deepEqual(menge(waehle({anzahl:12})),menge([...vorrat.slice(0,12)]));
 assert.deepEqual(menge(waehle({anzahl:16})),menge(vorrat));
 const zwei=waehle({anzahl:6});
 assert.equal(zwei.filter(id=>id.startsWith('f')).length,4);
 assert.equal(zwei.filter(id=>id.startsWith('u')).length,2,'der Rest der Runde kommt aus der nächsten Gruppe');
});

test('falsch, aber noch nicht fällig zählt zum Rest',()=>{
 const spaeter={[schluessel('a')]:{correct:false,seen:1,due:MORGEN}};
 assert.deepEqual(waehleAufgaben({vorrat:['a','b'],review:spaeter,schluessel,anzahl:1,heute:HEUTE,zufall:zufallAus(1)}),['b']);
});

test('die vorige Runde kommt zuletzt, auch wenn sie falsch beantwortet ist',()=>{
 const runde=waehle({anzahl:4,vorige:['f1','f2']});
 assert.ok(runde.includes('f3')&&runde.includes('f4'),'die anderen Falschen kommen zuerst');
 assert.equal(runde.filter(id=>id.startsWith('u')).length,2,'dann Ungesehene');
 assert.ok(!runde.includes('f1')&&!runde.includes('f2'),'f1 und f2 warten eine Runde');
 const nurVorige=waehle({anzahl:16,vorige:['f1']});
 assert.equal(nurVorige.length,16,'reicht der Vorrat nicht, kommt auch die vorige Runde wieder dran');
});

test('nie dieselbe Auswahl wie die vorige Runde, wenn der Vorrat größer ist',()=>{
 const sieben=['a','b','c','d','e','f','g'];
 let vorige=[];
 for(let i=0;i<200;i++){
  const runde=waehleAufgaben({vorrat:sieben,review:{},schluessel,anzahl:6,vorige,heute:HEUTE,zufall:zufallAus(i)});
  assert.equal(runde.length,6);
  assert.equal(new Set(runde).size,6);
  if(vorige.length)assert.notDeepEqual(menge(runde),menge(vorige),'Runde '+i);
  vorige=runde;
 }
 const genau=waehleAufgaben({vorrat:sieben.slice(0,6),review:{},schluessel,anzahl:6,vorige:sieben.slice(0,6),heute:HEUTE,zufall:zufallAus(3)});
 assert.deepEqual(menge(genau),menge(sieben.slice(0,6)),'ist der Vorrat genau eine Runde groß, kommt dieselbe Auswahl');
});

test('kleiner Vorrat, doppelte IDs und unbekannte vorige IDs',()=>{
 assert.deepEqual(menge(waehleAufgaben({vorrat:['a','b','a'],review:{},schluessel,anzahl:5,heute:HEUTE,zufall:zufallAus(2)})),['a','b']);
 assert.deepEqual(menge(waehleAufgaben({vorrat:['a','b','c'],review:{},schluessel,anzahl:2,vorige:['x','y','a'],heute:HEUTE,zufall:zufallAus(2)})),['b','c']);
 assert.deepEqual(waehleAufgaben({vorrat:[],review:{},schluessel,anzahl:3,heute:HEUTE}),[]);
 assert.deepEqual(waehleAufgaben({vorrat:['a'],review:{},schluessel,anzahl:0,heute:HEUTE}),[]);
});

test('die Reihenfolge ist gemischt',()=>{
 const zehn=Array.from({length:10},(_,i)=>'q'+i);
 const reihen=new Set(Array.from({length:20},(_,i)=>waehleAufgaben({vorrat:zehn,review:{},schluessel,anzahl:10,heute:HEUTE,zufall:zufallAus(i)}).join(',')));
 assert.ok(reihen.size>10,'verschiedene Zufälle ergeben verschiedene Reihenfolgen');
 const ersteStellen=new Set(Array.from({length:40},(_,i)=>waehle({anzahl:8,zufall:zufallAus(i)})[0]));
 assert.ok([...ersteStellen].some(id=>id.startsWith('u')),'auch die bevorzugten Aufgaben stehen nicht immer vorn');
});

test('ohne heute zählt das heutige Datum',()=>{
 const faellig={[schluessel('a')]:{correct:false,seen:1,due:'2000-01-01'}};
 assert.deepEqual(waehleAufgaben({vorrat:['a','b'],review:faellig,schluessel,anzahl:1,zufall:zufallAus(5)}),['a']);
});

test('vorigeRunde liest items, challenge.ids, learningRound.ids und vorige',()=>{
 assert.deepEqual(vorigeRunde({learningRound:{ids:['k','l'],level:null,stufe:'profi'},vorige:['x']}),['k','l'],'Klassik-Runde („Neu mischen“, Code-Prüfung PR 2, Befund 1)');
 assert.deepEqual(vorigeRunde({items:['a','b'],vorige:['x']}),['a','b']);
 assert.deepEqual(vorigeRunde({challenge:{ids:['c','d']},vorige:['x']}),['c','d']);
 assert.deepEqual(vorigeRunde({challenge:{ids:[]},vorige:['x','y']}),['x','y'],'zweimal „Neue Runde“ ohne zu spielen');
 assert.deepEqual(vorigeRunde({items:[],vorige:['x']}),['x']);
 for(const kaputt of [undefined,null,7,'a',[],{items:[1,2]},{challenge:null},{challenge:{ids:'a'}},{vorige:[1]}])assert.deepEqual(vorigeRunde(kaputt),[]);
 assert.deepEqual(vorigeRunde({items:[{q:'Frage'}],vorige:['x']}),['x'],'Spiele mit Aufgaben-Objekten in items haben keine ID-Liste');
});
