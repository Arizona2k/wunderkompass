import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nachgebessert, wiederholungFuerAntwort } from '../app/kern/wiederholung.ts';

// Teilschritt 3, E16 (BACKLOG 19 und 23, K7): Es zählt die erste Antwort einer Runde. „Noch einmal raten“
// trägt keine neue Wiederholung ein; eine richtige Antwort nach einer falschen nimmt die Frage aber aus
// „Ein Gedanke zum Wiederholen“ (morgen ist sie wieder dran).
const HEUTE=new Date('2026-11-23T10:00:00Z');
const eintrag=(correct,due,seen=1)=>({correct,seen,due});

test('die erste Antwort auf eine neue Frage zählt',()=>{
 assert.equal(wiederholungFuerAntwort(undefined,true,true,HEUTE),'zaehlen');
 assert.equal(wiederholungFuerAntwort(undefined,false,true,HEUTE),'zaehlen');
});

test('nach „Noch einmal raten“ zählt eine Antwort nur, wenn die Frage wirklich wieder fällig ist',()=>{
 // Richtig beantwortet, in zwei Tagen fällig: Zum Spaß falsch raten ändert nichts.
 assert.equal(wiederholungFuerAntwort(eintrag(true,'2026-11-25'),false,true,HEUTE),null);
 assert.equal(wiederholungFuerAntwort(eintrag(true,'2026-11-25'),true,true,HEUTE),null);
 // Fällig (heute oder früher): eine echte Wiederholung.
 assert.equal(wiederholungFuerAntwort(eintrag(true,'2026-11-23'),true,true,HEUTE),'zaehlen');
 assert.equal(wiederholungFuerAntwort(eintrag(true,'2026-11-20'),false,true,HEUTE),'zaehlen');
});

test('der zweite Versuch in derselben Runde trägt keine neue Wiederholung ein, bessert aber eine falsche nach',()=>{
 assert.equal(wiederholungFuerAntwort(eintrag(false,'2026-11-23'),true,false,HEUTE),'nachbessern');
 assert.equal(wiederholungFuerAntwort(eintrag(false,'2026-11-23'),false,false,HEUTE),null);
 assert.equal(wiederholungFuerAntwort(eintrag(true,'2026-11-25'),true,false,HEUTE),null);
 assert.equal(wiederholungFuerAntwort(undefined,true,false,HEUTE),null,'ohne Eintrag gibt es nichts nachzubessern');
});

test('nach „erst falsch, dann richtig“ ist die Frage heute nicht mehr zum Wiederholen dran, morgen wieder',()=>{
 const vorher=eintrag(false,'2026-11-23',3);
 const nachher=nachgebessert(vorher,HEUTE);
 assert.deepEqual(nachher,{correct:true,seen:3,due:'2026-11-24'});
 // Was das Wissensbuch unter „Ein Gedanke zum Wiederholen“ zeigt: falsch oder fällig.
 const imBuch=r=>!r.correct||r.due<=HEUTE.toISOString().slice(0,10);
 assert.equal(imBuch(vorher),true);
 assert.equal(imBuch(nachher),false);
 // Danach noch einmal zum Spaß falsch raten: nicht fällig, also keine neue Wiederholung.
 assert.equal(wiederholungFuerAntwort(nachher,false,true,HEUTE),null);
});
