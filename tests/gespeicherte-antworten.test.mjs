import {test} from 'node:test';
import assert from 'node:assert/strict';
import fixture from './fixtures/gespeicherte-antworten.json' with {type: 'json'};
import teilA from './fixtures/gespeicherte-antworten-teil-a.json' with {type: 'json'};
import feinschliff from './fixtures/gespeicherte-antworten-feinschliff.json' with {type: 'json'};
import catalog from '../app/world-catalog.json' with {type: 'json'};
import {restoreAnswerWording} from '../app/retained-answer-wording.mjs';
import {CHALLENGE_BANK, challengeQuestionForOrder} from '../app/knowledge-challenge.ts';

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

// Challenge-Fragen standen vor Teilschritt 3 nie auf der Karte; gespeichert sind sie nur in Runden von „Kreuz und quer“ (früher Wissens-Challenge).
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

// Die Listen wachsen nur (Code-Prüfung Teil A, Befund 4): Jeder Schritt, der neue Antworten bringt, legt vor dem Merge eine
// datierte Liste an (scripts/antworten-stand.mjs). Seit Teil A stehen vierte Antworten, 12 neue Zusatzfragen und alle
// Challenge-Fragen auf der Karte (gespeichert unter topicAnswer:<id>). Jede Antwort daraus bleibt lesbar, gleich oder über
// einen Alias, und die Lösung bleibt dieselbe. Eine Frage, die später ruht, bleibt unverändert in den Daten.
const heuteNachId = new Map(catalog.flatMap(t => [[t.id, t.question], ...(t.moreQuestions ?? []).map(q => [q.id, q]), ...(t.challenges ?? []).map(q => [q.id, q])]));
// Alle datierten Listen mit ihrer Mindestzahl; eine neue Liste kommt hier dazu (Stufen-Feinschliff: neue Elefanten-Frage :rate-5,
// dafür ruht :rate-3, darum wieder 287; die ruhende Frage prüft weiter die Liste Teil A).
const DATIERT = [['Teil A', teilA, 287], ['Stufen-Feinschliff', feinschliff, 287]];
for (const [name, liste, mindestens] of DATIERT) test(`datierte Liste ${name}: jede Antwort, die ein Kind auf einer Karte speichern konnte, ist noch lesbar`, () => {
  assert.ok(liste.fragen.length >= mindestens, 'die Liste ist vollständig');
  for (const alt of liste.fragen) {
    const heute = heuteNachId.get(alt.id);
    assert.ok(heute, 'Frage fehlt: ' + alt.id);
    if (heute.ruht) assert.deepEqual([heute.answers, heute.correct], [alt.answers, alt.correct], alt.id + ' ruht unverändert');
    else assert.deepEqual(fehlt(alt, heute, alt.id), [], alt.id);
  }
});

// Dieselben Antworten stecken auch in Runden von „Kreuz und quer“ (Hauptfragen als '<karte>:mini', Challenge-Fragen unter
// ihrer ID; heikle Karten sind nicht dabei). Eine angefangene Runde verlangt genau ihre Antworten oder eine frühere Fassung
// (retainedChallengeChoices); eine neue Antwort allein würde sie verwerfen (Code-Nachprüfung Teil A, M1).
const imChallenge = new Map(CHALLENGE_BANK.map(q => [q.id, q]));
for (const [name, liste] of DATIERT) test(`datierte Liste ${name}: eine angefangene Runde von Kreuz und quer lässt sich fortsetzen`, () => {
  let geprueft = 0;
  for (const alt of liste.fragen) {
    const q = imChallenge.get(alt.id) ?? (karten.has(alt.id) ? imChallenge.get(alt.id + ':mini') : undefined);
    if (!q) continue;
    geprueft++;
    const lies = wert => restoreAnswerWording(q.topic, wert), reihe = [...alt.answers].reverse().map(lies);
    const runde = challengeQuestionForOrder(q.id, reihe);
    assert.ok(runde, `Runde mit den Antworten aus ${name} nicht mehr lesbar: ` + q.id);
    assert.deepEqual([...runde.answers].sort(), [...reihe].sort(), q.id + ': die Runde zeigt ihre Antworten');
    assert.equal(runde.answers[runde.correct], lies(alt.answers[alt.correct]), q.id + ': dieselbe richtige Antwort');
  }
  assert.ok(geprueft >= 200, 'Testvoraussetzung: Haupt- und Challenge-Fragen der Liste geprüft (' + geprueft + ')');
});

test('Challenge: eine alte Runde mit der ganzen früheren Frage zeigt keine heutigen Tipps', () => {
  let alteFassungen = 0;
  for (const alt of fixture.challenges) {
    const runde = challengeQuestionForOrder(alt.id, [...alt.answers].reverse());
    const heute = challenges.get(alt.id);
    if (runde.prompt !== heute.prompt) {
      alteFassungen++;
      assert.deepEqual(runde.hints, [], alt.id + ': keine Tipps zur alten Fassung');
    }
    const neu = challengeQuestionForOrder(alt.id, [...heute.answers].reverse());
    assert.ok(neu, alt.id + ': eine Runde mit den heutigen Antworten ist lesbar');
    if (!heute.ruht) assert.equal(neu.prompt, heute.prompt, alt.id + ': eine neue Runde zeigt die heutige Frage');
  }
  assert.ok(alteFassungen > 0, 'Testvoraussetzung: es gibt umformulierte Fragen mit alter Fassung');
});

test('Mutationsprobe: fehlende Antwort und andere richtige Antwort werden erkannt', () => {
  const alt = {answers: ['A', 'B', 'C'], correct: 0};
  assert.deepEqual(fehlt(alt, {answers: ['A', 'B', 'C', 'D'], correct: 0}, 'x'), [], 'eine vierte Antwort ist erlaubt');
  assert.deepEqual(fehlt(alt, {answers: ['A', 'B', 'X'], correct: 0}, 'x'), ['Antwort fehlt: C']);
  assert.deepEqual(fehlt(alt, {answers: ['A', 'B', 'C'], correct: 1}, 'x'), ['richtige Antwort geändert']);
});
