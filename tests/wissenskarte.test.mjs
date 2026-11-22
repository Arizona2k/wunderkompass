// Reine Logik der neuen Wissenskarte (app/kern/karte/karten-daten.ts): welche Fragen eine Karte stellt,
// welche zuerst kommt, was unter „Dazu passt“ steht und ob es einen Mitmach-Baustein gibt.
import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type: 'json'};
import hintBank from '../app/challenge-hints.json' with {type: 'json'};
import {connectionsFor} from '../app/knowledge-connections.ts';
import {kartenFragen, ersteFrage, dazuPasst, weitereVerbindungen, hatBaustein} from '../app/kern/karte/karten-daten.ts';

const karte = id => {
  const topic = catalog.find(t => t.id === id);
  assert.ok(topic, 'Karte fehlt im Katalog: ' + id);
  return topic;
};
// So formt die Karte die Verbindungen heute um (world-topic.tsx: connectionsFor, dann topic und why).
const verbindungen = id => connectionsFor(id).map(c => ({topic: c.topic, why: c.why}));

// Ausgedachte Karte mit zwei Zusatzfragen; alles andere vom Elefanten.
const mitZusatzfragen = {
  ...karte('animal-african-savanna-elephant'),
  id: 'x',
  moreQuestions: [
    {id: 'x:rate-1', prompt: 'Erste Zusatzfrage?', answers: ['A', 'B', 'C'], correct: 1, why: 'Weil B.', hint: 'Denk an B.'},
    {id: 'x:rate-2', prompt: 'Zweite Zusatzfrage?', answers: ['D', 'E', 'F'], correct: 2, why: 'Weil F.', hint: 'Denk an F.'},
  ],
};
const gesehen = due => ({correct: true, seen: 1, due});

test('kartenFragen ohne Zusatzfragen liefert nur die Hauptfrage mit alten Schlüsseln', () => {
  const elefant = karte('animal-african-savanna-elephant');
  const fragen = kartenFragen(elefant, hintBank);
  assert.equal(fragen.length, 1);
  const [haupt] = fragen;
  assert.equal(haupt.id, 'animal-african-savanna-elephant');
  assert.equal(haupt.reviewId, 'world-question:animal-african-savanna-elephant');
  assert.equal(haupt.answerKey, 'topicAnswer');
  assert.equal(haupt.itemsKey, 'items');
  assert.deepEqual(haupt.question, elefant.question);
  // Ohne questionFeedback kommen die Hinweise nur aus der Bank.
  assert.deepEqual(haupt.hints, hintBank['animal-african-savanna-elephant:mini'].steps);
  assert.equal(haupt.wrongReasons, undefined);
});

test('kartenFragen baut Hinweise wie bisher aus questionFeedback und Bank', () => {
  // Mit questionFeedback ersetzt dessen Hinweis den ersten Schritt der Bank (world-topic.tsx, TopicQuestion).
  const schrift = karte('history-writing');
  const [haupt] = kartenFragen(schrift, {'history-writing:mini': {steps: ['alter erster Schritt', 'zweiter Schritt']}});
  assert.deepEqual(haupt.hints, [schrift.questionFeedback.hint, 'zweiter Schritt']);
  assert.deepEqual(haupt.wrongReasons, schrift.questionFeedback.wrongReasons);
  // Ohne Bank-Eintrag bleibt der Hinweis aus questionFeedback.
  assert.deepEqual(kartenFragen(schrift, {})[0].hints, [schrift.questionFeedback.hint]);
});

test('Zusatzfragen bekommen eigene Review-ID und eigene Schlüssel', () => {
  const fragen = kartenFragen(mitZusatzfragen, hintBank);
  assert.deepEqual(fragen.map(f => f.id), ['x', 'x:rate-1', 'x:rate-2']);
  const [, erste, zweite] = fragen;
  assert.equal(erste.reviewId, 'world-question:x:rate-1');
  assert.equal(erste.answerKey, 'topicAnswer:x:rate-1');
  assert.equal(erste.itemsKey, 'items:x:rate-1');
  assert.deepEqual(erste.hints, ['Denk an B.']);
  assert.deepEqual(erste.question, {prompt: 'Erste Zusatzfrage?', answers: ['A', 'B', 'C'], correct: 1, why: 'Weil B.'});
  assert.equal(zweite.reviewId, 'world-question:x:rate-2');
});

test('ersteFrage ohne Pass-Einträge nimmt die Hauptfrage', () => {
  assert.equal(ersteFrage(kartenFragen(mitZusatzfragen, hintBank), {}).id, 'x');
});

test('ersteFrage nimmt die erste ungesehene Frage', () => {
  const review = {'world-question:x': gesehen('2026-11-30')};
  assert.equal(ersteFrage(kartenFragen(mitZusatzfragen, hintBank), review).id, 'x:rate-1');
});

test('ersteFrage nimmt bei lauter gesehenen die am frühesten fällige', () => {
  const fragen = kartenFragen(mitZusatzfragen, hintBank);
  const review = {
    'world-question:x': gesehen('2026-12-03'),
    'world-question:x:rate-1': gesehen('2026-12-01'),
    'world-question:x:rate-2': gesehen('2026-12-02'),
  };
  assert.equal(ersteFrage(fragen, review).id, 'x:rate-1');
  // Gleichstand: die frühere Frage.
  review['world-question:x'] = gesehen('2026-12-01');
  assert.equal(ersteFrage(fragen, review).id, 'x');
  // Fremde Einträge im Pass zählen nicht als gesehen.
  assert.equal(ersteFrage(fragen, {'world-question:anderes': gesehen('2026-01-01')}).id, 'x');
});

test('dazuPasst zeigt höchstens drei Kacheln in fester Reihenfolge', () => {
  const elefant = karte('animal-african-savanna-elephant');
  const kacheln = dazuPasst(elefant, verbindungen(elefant.id));
  assert.deepEqual(kacheln.map(k => k.art), ['karte', 'globus', 'link']);
  const erste = connectionsFor(elefant.id)[0];
  assert.deepEqual(kacheln[0], {art: 'karte', topicId: erste.topic, why: erste.why});
  assert.deepEqual(kacheln[2], {art: 'link', ...elefant.links[0]});
  for (const topic of catalog) assert.ok(dazuPasst(topic, verbindungen(topic.id)).length <= 3, topic.id);
});

test('dazuPasst zeigt nie related', () => {
  const ohneVerbindung = {...karte('animal-african-savanna-elephant'), id: 'z', related: ['animal-honey-bee', 'animal-giant-panda']};
  const kacheln = dazuPasst(ohneVerbindung, []);
  assert.ok(!kacheln.some(k => k.art === 'karte'), JSON.stringify(kacheln));
  assert.deepEqual(kacheln.map(k => k.art), ['globus', 'link']);
});

test('dazuPasst nimmt das Weltspiel, wenn links fehlt', () => {
  const feuer = karte('history-fire');
  assert.equal(feuer.links.length, 0);
  assert.equal(feuer.locations.length, 0);
  const kacheln = dazuPasst(feuer, verbindungen(feuer.id));
  assert.equal(kacheln.at(-1).art, 'spiel');
  assert.ok(!kacheln.some(k => k.art === 'globus'));
});

test('weitereVerbindungen lässt die erste weg', () => {
  const alle = connectionsFor('animal-african-savanna-elephant');
  assert.ok(alle.length >= 2);
  assert.deepEqual(weitereVerbindungen(alle), alle.slice(1));
  assert.deepEqual(weitereVerbindungen([]), []);
});

test('hatBaustein erkennt Tier, Erfindung, Bauwerk und Karten ohne Baustein', () => {
  assert.equal(hatBaustein(karte('animal-african-savanna-elephant')), true);
  assert.equal(hatBaustein(karte('invention-light')), true);
  assert.equal(hatBaustein(karte('building-giza-pyramids')), true);
  assert.equal(hatBaustein(karte('history-fire')), false);
  // Gleiche Bedingung wie die alte Karte (world-topic.tsx, „experiment“).
  for (const t of catalog) {
    const alt = !!(t.animal || t.invention || t.building || t.model || t.investigation || t.id === 'science-tides');
    assert.equal(hatBaustein(t), alt, t.id);
  }
});
