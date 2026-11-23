import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leereFolge, mitErsterAntwort, nachVorschlag, stufenVorschlag } from '../app/kern/stufe.ts';

// Teilschritt 3, E8 (Ergänzung Stufen, S3): Vorschläge statt Automatik. Die Folge zählt nur, solange die Seite offen ist.
const antworten=(folge,stufe,liste)=>liste.reduce((f,[frage,richtig])=>mitErsterAntwort(f,frage,richtig,stufe),folge);
const HOCH_PROFI={richtung:'schwerer',ziel:'profi',text:'Das war leicht für dich. Willst du Profi probieren?'};
const HOCH_EXPERTE={richtung:'schwerer',ziel:'experte',text:'Das war leicht für dich. Willst du Experte probieren?'};
const LEICHTER=ziel=>({richtung:'leichter',ziel,text:'Ganz schön knifflig. Willst du eine Stufe leichter spielen?'});

test('nach drei richtigen Antworten hintereinander kommt der Vorschlag eine Stufe höher',()=>{
 const zwei=antworten(leereFolge(),'entdecker',[['a:1',true],['a:2',true]]);
 assert.equal(stufenVorschlag(zwei,'entdecker','topic:a'),null,'zwei reichen nicht');
 const drei=mitErsterAntwort(zwei,'a:3',true,'entdecker');
 assert.deepEqual(stufenVorschlag(drei,'entdecker','topic:a'),HOCH_PROFI);
 const profi=antworten(leereFolge(),'profi',[['a:1',true],['a:2',true],['a:3',true]]);
 assert.deepEqual(stufenVorschlag(profi,'profi','topic:a'),HOCH_EXPERTE);
 const experte=antworten(leereFolge(),'experte',[['a:1',true],['a:2',true],['a:3',true]]);
 assert.equal(stufenVorschlag(experte,'experte','topic:a'),null,'über Experte gibt es nichts');
});

test('nach zwei falschen Antworten hintereinander auf Profi oder Experte kommt der Vorschlag eine Stufe leichter',()=>{
 assert.deepEqual(stufenVorschlag(antworten(leereFolge(),'profi',[['a:1',false],['a:2',false]]),'profi','topic:a'),LEICHTER('entdecker'));
 assert.deepEqual(stufenVorschlag(antworten(leereFolge(),'experte',[['a:1',false],['a:2',false]]),'experte','topic:a'),LEICHTER('profi'));
 assert.equal(stufenVorschlag(antworten(leereFolge(),'entdecker',[['a:1',false],['a:2',false],['a:3',false]]),'entdecker','topic:a'),null,'Entdecker wird nie herabgestuft');
 assert.equal(stufenVorschlag(antworten(leereFolge(),'profi',[['a:1',false]]),'profi','topic:a'),null,'eine falsche reicht nicht');
});

test('es zählt nur „hintereinander“',()=>{
 const folge=antworten(leereFolge(),'entdecker',[['a:1',true],['a:2',false],['a:3',true],['a:4',true]]);
 assert.equal(stufenVorschlag(folge,'entdecker','topic:a'),null);
 assert.deepEqual(stufenVorschlag(mitErsterAntwort(folge,'a:5',true,'entdecker'),'entdecker','topic:a'),HOCH_PROFI);
 const gemischt=antworten(leereFolge(),'profi',[['a:1',false],['a:2',true],['a:3',false]]);
 assert.equal(stufenVorschlag(gemischt,'profi','topic:a'),null);
});

test('nur die erste Antwort auf eine Frage zählt',()=>{
 // Falsch geraten, dann richtig: Die zweite Antwort derselben Frage zählt nicht.
 const folge=antworten(leereFolge(),'profi',[['a:1',false],['a:1',true],['a:2',false]]);
 assert.deepEqual(stufenVorschlag(folge,'profi','topic:a'),LEICHTER('entdecker'));
 const nochmal=antworten(leereFolge(),'entdecker',[['a:1',true],['a:1',true],['a:1',true]]);
 assert.equal(stufenVorschlag(nochmal,'entdecker','topic:a'),null,'dieselbe Frage dreimal ist keine Folge');
});

test('höchstens ein Vorschlag je Runde oder Karte; danach beginnt die Folge neu',()=>{
 const drei=antworten(leereFolge(),'entdecker',[['a:1',true],['a:2',true],['a:3',true]]);
 const gefragt=nachVorschlag(drei,'topic:a');
 const mehr=antworten(gefragt,'entdecker',[['a:4',true],['a:5',true],['a:6',true]]);
 assert.equal(stufenVorschlag(mehr,'entdecker','topic:a'),null,'dieselbe Karte fragt nicht noch einmal');
 assert.equal(stufenVorschlag(mitErsterAntwort(gefragt,'b:1',true,'entdecker'),'entdecker','topic:b'),null,'nach einem Vorschlag braucht es wieder drei');
 assert.deepEqual(stufenVorschlag(mehr,'entdecker','topic:b'),HOCH_PROFI,'eine andere Karte darf wieder fragen');
});

test('nach einem Stufenwechsel zählen die alten Antworten nicht mehr',()=>{
 const folge=antworten(leereFolge(),'entdecker',[['a:1',true],['a:2',true]]);
 const nachWechsel=mitErsterAntwort(folge,'a:3',true,'profi');
 assert.equal(stufenVorschlag(nachWechsel,'profi','topic:a'),null);
 const profiFalsch=antworten(leereFolge(),'profi',[['a:1',false]]);
 assert.equal(stufenVorschlag(mitErsterAntwort(profiFalsch,'a:2',false,'experte'),'experte','topic:a'),null);
});

test('ein Vorschlag ändert nie selbst die Stufe und die Folge nicht den Pass',()=>{
 const folge=antworten(leereFolge(),'entdecker',[['a:1',true],['a:2',true],['a:3',true]]);
 const vorher=structuredClone(folge);
 stufenVorschlag(folge,'entdecker','topic:a');
 assert.deepEqual(folge,vorher,'stufenVorschlag ist rein');
});
