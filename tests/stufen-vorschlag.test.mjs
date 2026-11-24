import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leereFolge, mitErsterAntwort, nachAntwort, nachVorschlag, spielVorschlagErlaubt, stufenVorschlag } from '../app/kern/stufe.ts';

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

test('nur Fragen der gewählten Stufe zählen; leichtere Fragen lassen die Folge, wie sie ist',()=>{
 // Code-Prüfung Teil A, Befund 1: Auf den meisten Karten gibt es nur die Entdecker-Hauptfrage. Ein Profi-Kind, das drei
 // solche Fragen richtig beantwortet, hat Profi nicht ausprobiert; zwei falsche dort heißen nicht „Profi ist zu schwer“.
 const leicht=(f,frage,richtig)=>mitErsterAntwort(f,frage,richtig,'profi','entdecker');
 const dreiLeichte=leicht(leicht(leicht(leereFolge(),'a',true),'b',true),'c',true);
 assert.deepEqual(dreiLeichte,leereFolge(),'drei richtige Entdecker-Fragen auf Profi zählen nicht');
 assert.equal(stufenVorschlag(dreiLeichte,'profi','topic:a'),null);
 const zweiFalsche=leicht(leicht(leereFolge(),'a',false),'b',false);
 assert.equal(stufenVorschlag(zweiFalsche,'profi','topic:a'),null,'zwei falsche Entdecker-Fragen auf Profi schlagen nichts vor');
 // Dazwischen bleibt die Folge stehen: Profi richtig, Entdecker-Frage, zweimal Profi richtig ergibt drei hintereinander.
 const gemischt=mitErsterAntwort(mitErsterAntwort(leicht(mitErsterAntwort(leereFolge(),'p:1',true,'profi','profi'),'e:1',false),'p:2',true,'profi','profi'),'p:3',true,'profi','profi');
 assert.deepEqual(stufenVorschlag(gemischt,'profi','topic:a'),HOCH_EXPERTE);
 // Eine schwerere Frage zählt auch nicht (kommt auf der Karte nicht vor, die Regel ist „genau die gewählte Stufe“).
 assert.deepEqual(mitErsterAntwort(leereFolge(),'x',true,'entdecker','profi'),leereFolge());
});

// Spiele, in denen Experte noch Profi spielt: Ein unterdrückter Vorschlag verbraucht den einen Vorschlag der Runde nicht
// (Code-Prüfung PR 2, Hinweis 6); ohne Filter bleibt alles wie auf der Karte.
test('nachAntwort: unterdrückter Vorschlag verbraucht die Runde nicht',()=>{
 const ohneExperte=ziel=>ziel!=='experte';let f=leereFolge(),v;
 for(const i of [1,2,3]){({folge:f,vorschlag:v}=nachAntwort(f,'q:'+i,true,'profi','profi','runde:x',ohneExperte));assert.equal(v,null);}
 assert.equal(f.gefragt.includes('runde:x'),false,'„Experte?“ war nicht erlaubt und zählt nicht als gefragt');
 ({folge:f,vorschlag:v}=nachAntwort(f,'q:4',false,'profi','profi','runde:x',ohneExperte));assert.equal(v,null);
 ({folge:f,vorschlag:v}=nachAntwort(f,'q:5',false,'profi','profi','runde:x',ohneExperte));
 assert.equal(v?.richtung,'leichter');assert.equal(v?.ziel,'entdecker');assert.equal(f.gefragt.includes('runde:x'),true);
 ({vorschlag:v}=nachAntwort(f,'q:6',false,'profi','profi','runde:x',ohneExperte));assert.equal(v,null,'höchstens ein Vorschlag je Runde');
 let g=leereFolge();for(const i of [1,2,3])({folge:g,vorschlag:v}=nachAntwort(g,'q:'+i,true,'profi','profi','runde:y'));
 assert.equal(v?.ziel,'experte','ohne Filter wie auf der Karte');
 assert.deepEqual(nachAntwort(g,'q:1',false,'profi','profi','runde:y'),{folge:g,vorschlag:null},'eine schon gezählte Frage ändert nichts');
});

// Code-Nachprüfung PR 2, Befund 1: Ein Spiel misst an der Stufe der Runde. Läuft noch eine Runde einer anderen Stufe als der
// gewählten (alte Runde, oder die Stufe wurde auf einer Karte geändert), darf kein Vorschlag die Stufe im Pass umstellen,
// weder in die falsche Richtung noch um zwei Stufen.
test('spielVorschlagErlaubt: nur, solange die Runde auf der gewählten Stufe läuft',()=>{
 const reihe=(gewaehlt,gespielt,richtig,erlaubt)=>{let f=leereFolge(),v=null,erster=null;for(const i of [1,2,3]){({folge:f,vorschlag:v}=nachAntwort(f,'q:'+i,richtig,gespielt,gespielt,'runde:'+gewaehlt+gespielt,erlaubt??spielVorschlagErlaubt(gewaehlt,gespielt)));erster??=v;}return erster;};
 assert.equal(reihe('experte','entdecker',true),null,'Pass Experte, Runde Entdecker: „Profi?“ würde die Stufe senken');
 assert.equal(reihe('entdecker','experte',false),null,'Pass Entdecker, Runde Experte: „leichter“ würde die Stufe heben');
 assert.equal(reihe('entdecker','profi',true),null,'Pass Entdecker, alte Mittel-Runde: kein Sprung um zwei Stufen');
 assert.equal(reihe('profi','entdecker',true),null,'Pass Profi, alte Leicht-Runde: Profi ist schon gewählt');
 assert.equal(reihe('entdecker','entdecker',true)?.ziel,'profi','Runde auf der gewählten Stufe: wie auf der Karte');
 assert.equal(reihe('experte','experte',false)?.ziel,'profi');
 // Spiele, in denen Experte noch Profi spielt: Pass Experte und eine Profi-Runde passen zusammen.
 const welt=s=>s==='experte'?'profi':s;
 assert.equal(reihe('experte','profi',true,spielVorschlagErlaubt('experte','profi',welt)),null,'„Experte?“ ist schon gewählt');
 assert.equal(reihe('experte','profi',false,spielVorschlagErlaubt('experte','profi',welt))?.ziel,'entdecker');
 assert.equal(reihe('profi','profi',true,spielVorschlagErlaubt('profi','profi',welt)),null,'„Experte?“ spielt hier nicht anders');
 assert.equal(reihe('profi','profi',true,spielVorschlagErlaubt('profi','profi'))?.ziel,'experte','mit echten Experten-Aufgaben schon');
});
