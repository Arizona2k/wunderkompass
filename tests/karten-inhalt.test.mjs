// Die neuen Felder der Wissenskarte (chapters, claims, moreQuestions) sind wohlgeformt,
// und ihre IDs stoßen mit keiner vorhandenen ID zusammen (Pass-Einträge hängen an diesen IDs).
import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type: 'json'};
import {kartenFeldFehler} from '../app/kern/karte/karten-daten.ts';

const basis = catalog.find(t => t.id === 'animal-african-savanna-elephant');
const frage = n => ({id: 'x:rate-' + n, prompt: 'Frage ' + n + '?', answers: ['A', 'B', 'C'], correct: 0, why: 'Weil A.', hint: 'Denk an A.'});

test('kartenFeldFehler meldet kaputte neue Felder', () => {
  const heil = {
    ...basis,
    id: 'x',
    chapters: [{question: 'Wie?', text: 'So.'}],
    claims: [{id: 'x:stimmt-1', text: 'Elefanten können springen.', isTrue: false, explanation: 'Sie heben nie alle vier Füße zugleich.'}],
    moreQuestions: [frage(1)],
  };
  assert.deepEqual(kartenFeldFehler(heil), []);
  assert.deepEqual(kartenFeldFehler(basis), [], 'Karte ohne neue Felder ist in Ordnung');

  const fehler = feld => kartenFeldFehler({...heil, ...feld});
  assert.ok(fehler({moreQuestions: [{...frage(1), id: 'x-rate-1'}]}).length > 0, 'falsche Fragen-ID');
  assert.ok(fehler({moreQuestions: [{...frage(1), id: 'y:rate-1'}]}).length > 0, 'Fragen-ID einer anderen Karte');
  assert.ok(fehler({moreQuestions: [{...frage(1), answers: ['A', 'B']}]}).length > 0, 'nur zwei Antworten');
  assert.ok(fehler({moreQuestions: [{...frage(1), correct: 3}]}).length > 0, 'correct außerhalb');
  assert.ok(fehler({moreQuestions: [{...frage(1), hint: ' '}]}).length > 0, 'leerer Hinweis');
  assert.ok(fehler({moreQuestions: [{...frage(1), why: ''}]}).length > 0, 'leere Erklärung');
  assert.ok(fehler({chapters: [1, 2, 3, 4].map(n => ({question: 'F' + n + '?', text: 'T' + n}))}).length > 0, 'vier Häppchen');
  assert.ok(fehler({chapters: []}).length > 0, 'leere Häppchen-Liste');
  assert.ok(fehler({chapters: [{question: 'Wie?', text: ''}]}).length > 0, 'leeres Häppchen');
  assert.ok(fehler({claims: [{...heil.claims[0], id: 'x:stimmt'}]}).length > 0, 'falsche Behauptungs-ID');
  assert.ok(fehler({claims: [{...heil.claims[0], isTrue: 'nein'}]}).length > 0, 'isTrue ist kein Wahrheitswert');
  assert.ok(fehler({claims: [{...heil.claims[0], explanation: ''}]}).length > 0, 'leere Auflösung');
});

test('alle Karten haben wohlgeformte neue Felder', () => {
  const kaputt = catalog.map(t => [t.id, kartenFeldFehler(t)]).filter(([, fehler]) => fehler.length);
  assert.deepEqual(kaputt, []);
});

test('neue IDs sind eindeutig und gleichen keiner Challenge-ID', () => {
  const ids = catalog.flatMap(t => [
    t.id,
    t.id + ':mini', // Die Startfrage zählt in der Wissens-Challenge unter dieser ID (knowledge-challenge.ts).
    ...(t.challenges ?? []).map(q => q.id),
    ...(t.moreQuestions ?? []).map(q => q.id),
    ...(t.claims ?? []).map(c => c.id),
  ]);
  const doppelt = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(doppelt, []);
});
