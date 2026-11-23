import {test} from 'node:test';
import assert from 'node:assert/strict';
import fixture from './fixtures/gespeicherte-antworten.json' with {type: 'json'};
import catalog from '../app/world-catalog.json' with {type: 'json'};
import {restoreAnswerWording} from '../app/retained-answer-wording.mjs';
import {challengeQuestionForOrder} from '../app/knowledge-challenge.ts';

// BACKLOG 23 (Pflicht vor Teilschritt 3, Aufgabe 5): Jede Antwort, die ein Kind im Pass gespeichert haben kann,
// bleibt lesbar – wörtlich gleich oder über einen Alias. Die feste Liste stammt aus test-live vor Aufgabe 5.
const karten = new Map(catalog.map(t => [t.id, t]));
const zusatz = new Map(catalog.flatMap(t => (t.moreQuestions ?? []).map(z => [z.id, z])));
const challenges = new Map(catalog.flatMap(t => (t.challenges ?? []).map(c => [c.id, c])));

// Was einer alten Frage heute fehlt: eine Antwort ohne Alias oder eine andere richtige Antwort.
function fehlt(alt, heute, aliasId) {
  const lies = wert => restoreAnswerWording(aliasId, wert);
  const fehler = alt.answers.filter(wert => !heute.answers.includes(lies(wert))).map(wert => 'Antwort fehlt: ' + wert);
  if (lies(alt.answers[alt.correct]) !== heute.answers[heute.correct]) fehler.push('richtige Antwort geändert');
  return fehler;
}

test('die feste Liste ist vollständig: alle Hauptfragen, 30 Zusatz- und 42 Challenge-Fragen', () => {
  assert.equal(fixture.hauptfragen.length, 204);
  assert.equal(fixture.zusatzfragen.length, 30);
  assert.equal(fixture.challenges.length, 42);
});

test('Hauptfragen bleiben wörtlich', () => {
  for (const alt of fixture.hauptfragen) {
    const heute = karten.get(alt.id)?.question;
    assert.ok(heute, 'Karte fehlt: ' + alt.id);
    assert.deepEqual(heute.answers, alt.answers, alt.id);
    assert.equal(heute.correct, alt.correct, alt.id);
  }
});

// Bewusst ersetzte falsche Antworten (Teilschritt 3, Befund 5 und 6 des stufen-pruefer: Fallen, die sich wiederholten oder zu
// weit daneben lagen). Die Lösung bleibt; wer eine ersetzte Antwort gespeichert hat, sieht auf der Karte „Hier gibt es neue
// Antworten. Früher hast du … gewählt“ und wählt neu (rate-mal.tsx, fruehereAuswahl). Nur falsche Antworten, nur mit Grund.
const ERSETZT = new Set([
  'person-marie_curie:rate-2 | Ganz allein, ohne jede Hilfe',
  'person-marie_curie:rate-2 | Mit dem Erfinder Gutenberg',
  'building-eiffel-tower:rate-2 | Damit er nachts leuchtet',
]);
test('Zusatzfragen: jede gespeicherte Antwort ist noch lesbar oder bewusst ersetzt', () => {
  for (const alt of fixture.zusatzfragen) {
    const heute = zusatz.get(alt.id);
    assert.ok(heute, 'Zusatzfrage fehlt: ' + alt.id);
    const fehler = fehlt(alt, heute, alt.id).filter(f => !ERSETZT.has(alt.id + ' | ' + f.replace('Antwort fehlt: ', '')));
    assert.deepEqual(fehler, [], alt.id);
  }
  for (const eintrag of ERSETZT) {
    const [id, antwort] = eintrag.split(' | ');
    const alt = fixture.zusatzfragen.find(q => q.id === id);
    assert.notEqual(alt.answers[alt.correct], antwort, 'nur falsche Antworten dürfen ersetzt werden: ' + eintrag);
  }
});

// Challenge-Fragen standen vor Teilschritt 3 nie auf der Karte; gespeichert sind sie nur in Runden der Wissens-Challenge.
// Wurde eine umformuliert, kennt die Liste früherer Fassungen ihre ganze alte Frage: Die alte Runde zeigt sie wie damals
// (nächster Test). Ganz neue Fragen bekamen neue IDs; die alte ID ruht (bleibt in den Daten, erscheint nicht mehr).
test('Challenge-Fragen: jede ID bleibt; eine Frage ist gleich, umformuliert mit alter Fassung oder ruht', () => {
  for (const alt of fixture.challenges) {
    const heute = challenges.get(alt.id);
    assert.ok(heute, 'Challenge-Frage fehlt: ' + alt.id);
    if (heute.ruht) assert.deepEqual([heute.prompt, heute.answers, heute.correct], [alt.prompt, alt.answers, alt.correct], alt.id + ' ruht unverändert');
  }
});

test('Challenge: eine angefangene Runde mit den alten Antworten lässt sich fortsetzen', () => {
  for (const alt of fixture.challenges) {
    const runde = challengeQuestionForOrder(alt.id, [...alt.answers].reverse());
    assert.ok(runde, 'alte Reihenfolge nicht mehr lesbar: ' + alt.id);
    assert.deepEqual([...runde.answers].sort(), [...alt.answers].sort(), alt.id + ': die Runde zeigt ihre alten Antworten');
    assert.equal(runde.answers[runde.correct], alt.answers[alt.correct], alt.id + ': dieselbe richtige Antwort');
  }
});

test('Mutationsprobe: fehlende Antwort und andere richtige Antwort werden erkannt', () => {
  const alt = {answers: ['A', 'B', 'C'], correct: 0};
  assert.deepEqual(fehlt(alt, {answers: ['A', 'B', 'C', 'D'], correct: 0}, 'x'), [], 'eine vierte Antwort ist erlaubt');
  assert.deepEqual(fehlt(alt, {answers: ['A', 'B', 'X'], correct: 0}, 'x'), ['Antwort fehlt: C']);
  assert.deepEqual(fehlt(alt, {answers: ['A', 'B', 'C'], correct: 1}, 'x'), ['richtige Antwort geändert']);
});
