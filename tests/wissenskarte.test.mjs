// Reine Logik der neuen Wissenskarte (app/kern/karte/karten-daten.ts): welche Fragen eine Karte stellt,
// welche zuerst kommt, was unter „Dazu passt“ steht und ob es einen Mitmach-Baustein gibt.
import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type: 'json'};
import hintBank from '../app/challenge-hints.json' with {type: 'json'};
import fotos from '../app/world-photos.json' with {type: 'json'};
import fotoIds from '../app/world-photo-ids.json' with {type: 'json'};
import fotoKennwoerter from '../app/kern/karte/foto-kennwoerter.json' with {type: 'json'};
import belegeIds from '../app/kern/karte/belege-ids.json' with {type: 'json'};
import personenBelege from '../app/people-inquiries.json' with {type: 'json'};
import forscherblick from '../app/science-thinking.json' with {type: 'json'};
import {readFileSync} from 'node:fs';
import {connectionsFor} from '../app/knowledge-connections.ts';
import {kartenFragen, ersteFrage, dazuPasst, weitereVerbindungen, hatBaustein, hatAusprobieren, bildArt, fotoKennwort, bildnachweisListe} from '../app/kern/karte/karten-daten.ts';

const karte = id => {
  const topic = catalog.find(t => t.id === id);
  assert.ok(topic, 'Karte fehlt im Katalog: ' + id);
  return topic;
};
// So formte schon die alte Karte die Verbindungen um (connectionsFor, dann topic und why).
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
  // Mit questionFeedback ersetzt dessen Hinweis den ersten Schritt der Bank (wie TopicQuestion auf der alten Karte).
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
  // Gleiche Bedingung wie die alte Karte („experiment“).
  for (const t of catalog) {
    const alt = !!(t.animal || t.invention || t.building || t.model || t.investigation || t.id === 'science-tides');
    assert.equal(hatBaustein(t), alt, t.id);
  }
});

// „Ausprobieren“ zeigt auch Belege zu Personen und Geschichte und den Forscherblick (Entwurf 6.3).
// Die Karte kennt dafür nur eine kleine ID-Liste; die großen Daten lädt erst der aufgeklappte Bereich.
test('belege-ids.json passt zu den Daten der Bausteine', () => {
  const sortiert = liste => [...liste].sort();
  assert.deepEqual(belegeIds.personen, sortiert(personenBelege.entries.map(e => e.id)), 'Personen-Belege (people-inquiries.json)');
  assert.deepEqual(belegeIds.forscherblick, sortiert(forscherblick.entries.map(e => e.id)), 'Forscherblick (science-thinking.json)');
  // Die Geschichtsbausteine halten ihre Karten im Code: Schlüssel 'history-…' in CONTEXT und ACTIVITIES, dazu die Bronzezeit.
  const schluessel = datei => [...readFileSync(new URL('../app/' + datei, import.meta.url), 'utf8').matchAll(/'(history-[a-z0-9_-]+)':\[?\{?/g)].map(m => m[1]);
  const geschichte = [...schluessel('history-context.tsx'), ...schluessel('history-evidence.tsx'), 'history-bronze'];
  assert.deepEqual(sortiert(belegeIds.geschichte), sortiert(new Set(geschichte)), 'Geschichtsbelege (history-context.tsx, history-evidence.tsx)');
  for (const id of [...belegeIds.personen, ...belegeIds.geschichte, ...belegeIds.forscherblick]) karte(id);
});

test('hatAusprobieren: Mitmach-Baustein oder Belege', () => {
  assert.equal(hatAusprobieren(karte('animal-african-savanna-elephant')), true);
  assert.equal(hatAusprobieren(karte('person-marie_curie')), true);
  assert.equal(hatAusprobieren(karte('history-khipu')), true);
  assert.equal(hatAusprobieren(karte('science-photosynthesis')), true);
  assert.equal(hatAusprobieren(karte('history-fire')), false);
  const mitBelegen = new Set([...belegeIds.personen, ...belegeIds.geschichte, ...belegeIds.forscherblick]);
  for (const t of catalog) assert.equal(hatAusprobieren(t), hatBaustein(t) || mitBelegen.has(t.id), t.id);
});

// Bildregel 6.3: zuerst ein freies Foto, sonst die eigene Zeichnung, sonst die Motivkachel.
test('bildArt nimmt zuerst das Foto', () => {
  const elefant = karte('animal-african-savanna-elephant');
  assert.deepEqual(bildArt(elefant, true), {art: 'foto', photoId: elefant.image});
});

test('bildArt nimmt die Zeichnung vor der Motivkachel', () => {
  assert.deepEqual(bildArt({id: 'x'}, true), {art: 'zeichnung', kennwort: 'Zeichnung'});
  // Eine Bild-ID ohne freigegebenes Foto zählt nicht als Foto.
  assert.deepEqual(bildArt({id: 'x', image: 'gibt-es-nicht'}, true), {art: 'zeichnung', kennwort: 'Zeichnung'});
});

test('bildArt nimmt die Motivkachel ohne Foto und Zeichnung', () => {
  assert.deepEqual(bildArt({id: 'x'}, false), {art: 'motiv'});
  assert.deepEqual(bildArt({id: 'x', image: 'gibt-es-nicht'}, false), {art: 'motiv'});
});

test('Jede Bild-ID im Katalog ist ein freigegebenes Foto', () => {
  const ohneFoto = catalog.filter(t => t.image && bildArt(t, false).art !== 'foto').map(t => t.id + ' → ' + t.image);
  assert.deepEqual(ohneFoto, []);
});

test('bildArt nennt das Kennwort des Fotos', () => {
  // Kein Foto im Katalog heißt „KI-Bild“; spätere Bildnisse heißen dort „Darstellung“.
  assert.equal(fotos['johannes-gutenberg'].label, 'Darstellung');
  assert.deepEqual(bildArt({id: 'x', image: 'johannes-gutenberg'}, true), {art: 'foto', photoId: 'johannes-gutenberg', kennwort: 'Spätere Darstellung'});
  assert.deepEqual(bildArt({id: 'x', image: 'hokusai-great-wave-jp1847'}, false), {art: 'foto', photoId: 'hokusai-great-wave-jp1847', kennwort: 'Historischer Druck'});
  for (const label of ['KI-Bild', 'Rekonstruktion', 'Spätere Darstellung', 'Historischer Druck']) assert.equal(fotoKennwort(label), label);
  assert.equal(fotoKennwort('Darstellung'), 'Spätere Darstellung');
  // Gewöhnliche Fotos brauchen kein Kennwort.
  assert.equal(fotoKennwort('Foto'), undefined);
  assert.equal(fotoKennwort(undefined), undefined);
});

test('Kennwörter der Karte passen genau zu den Fotodaten', () => {
  const erwartet = Object.fromEntries(Object.values(fotos).filter(f => fotoKennwort(f.label)).map(f => [f.id, fotoKennwort(f.label)]));
  assert.deepEqual(fotoKennwoerter, erwartet, 'app/kern/karte/foto-kennwoerter.json an world-photos.json angleichen');
});

test('bildnachweisListe liefert für jedes Foto Urheber, Lizenz, Lizenz-Link und Quelle', () => {
  assert.equal(fotoIds.length, 60);
  const liste = bildnachweisListe(fotoIds, fotos);
  assert.deepEqual(liste.map(n => n.photoId), fotoIds);
  for (const n of liste) {
    for (const feld of ['alt', 'author', 'license', 'licenseUrl', 'sourceUrl']) assert.ok(n[feld]?.trim(), n.photoId + ': ' + feld + ' fehlt');
    assert.match(n.licenseUrl, /^https:\/\//, n.photoId);
    assert.match(n.sourceUrl, /^https:\/\//, n.photoId);
  }
  // Doppelte und unbekannte IDs fallen weg; jedes Foto steht nur einmal im Block.
  assert.deepEqual(bildnachweisListe(['lion', 'lion', 'gibt-es-nicht'], fotos).map(n => n.photoId), ['lion']);
  assert.equal(bildnachweisListe(['lion'], fotos)[0].changes, fotos.lion.transformations_de);
});
