import {test} from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type: 'json'};
import HINTS from '../app/challenge-hints.json' with {type: 'json'};
import {ersteFrage, festGemischt, frageNachWechsel, fragenDerStufe, fragenFuerStufe, gespielteStufe, gueltigeReihe, hatFragenDerStufe, kartenFragen, naechsteFrage, schlussSatz, stufenHinweis, zeigtSchluss} from '../app/kern/karte/karten-daten.ts';

// Teilschritt 3, Aufgabe 5 (E4, E6): Die Karte zeigt je Stufe eine passende Frage.
// Ausgedachte Karte: Hauptfrage (Entdecker), je eine Zusatzfrage Entdecker, Profi, Experte und zwei Challenge-Fragen.
const elefant = catalog.find(t => t.id === 'animal-african-savanna-elephant');
const karte = {
  ...elefant,
  id: 'x',
  moreQuestions: [
    {id: 'x:rate-1', level: 'entdecker', prompt: 'E?', answers: ['A', 'B', 'C'], correct: 1, why: 'Weil B.', hint: 'Denk an B.'},
    {id: 'x:rate-2', level: 'profi', prompt: 'P?', answers: ['D', 'E', 'F', 'G'], correct: 2, why: 'Weil F.', hints: ['Denk an F.']},
    {id: 'x:rate-3', level: 'experte', prompt: 'X?', answers: ['H', 'I', 'J', 'K'], correct: 0, why: 'Weil H.', hints: ['Erster Schritt.', 'Zweiter Schritt.']},
  ],
  challenges: [
    {id: 'x-1', difficulty: 'medium', level: 'profi', prompt: 'C1?', answers: ['L', 'M', 'N', 'O'], correct: 0, why: 'Weil L.'},
    {id: 'x-2', difficulty: 'easy', level: 'entdecker', prompt: 'C2?', answers: ['Q', 'R', 'S'], correct: 1, why: 'Weil R.'},
  ],
};
const bank = {'x-1': {steps: ['Tipp zu C1.', 'Noch ein Tipp zu C1.'], wrongReasons: [null, 'nicht M', 'nicht N', 'nicht O']}};
const fragen = kartenFragen(karte, bank);
const ids = liste => liste.map(f => f.id);
const gesehen = (due = '2026-12-01', correct = true) => ({correct, seen: 1, due});
const alleGesehen = (ausser = []) => Object.fromEntries(fragen.filter(f => !ausser.includes(f.id)).map(f => [f.reviewId, gesehen()]));

test('kartenFragen: Hauptfrage, Zusatzfragen, dann Challenge-Fragen, jede mit Stufe', () => {
  assert.deepEqual(ids(fragen), ['x', 'x:rate-1', 'x:rate-2', 'x:rate-3', 'x-1', 'x-2']);
  assert.deepEqual(fragen.map(f => f.level), ['entdecker', 'entdecker', 'profi', 'experte', 'profi', 'entdecker']);
});

test('Challenge-Fragen bekommen auf der Karte eigene Schlüssel und ihre Tipps und Sätze aus der Bank', () => {
  const c = fragen.find(f => f.id === 'x-1');
  assert.equal(c.reviewId, 'world-question:x-1', 'auf der Karte eine eigene Wiederholung; in der Challenge bleibt challenge:x-1');
  assert.equal(c.answerKey, 'topicAnswer:x-1');
  assert.equal(c.itemsKey, 'items:x-1');
  assert.deepEqual(c.hints, ['Tipp zu C1.', 'Noch ein Tipp zu C1.']);
  assert.deepEqual(c.wrongReasons, [null, 'nicht M', 'nicht N', 'nicht O']);
  assert.deepEqual(c.question, {prompt: 'C1?', answers: ['L', 'M', 'N', 'O'], correct: 0, why: 'Weil L.'});
  assert.deepEqual(fragen.find(f => f.id === 'x-2').hints, [], 'ohne Eintrag in der Bank keine Tipps');
});

test('Zusatzfragen: neues Feld hints, altes Feld hint; ohne Stufe gilt Entdecker', () => {
  assert.deepEqual(fragen.find(f => f.id === 'x:rate-1').hints, ['Denk an B.']);
  assert.deepEqual(fragen.find(f => f.id === 'x:rate-3').hints, ['Erster Schritt.', 'Zweiter Schritt.']);
  const ohne = kartenFragen({...karte, moreQuestions: [{id: 'x:rate-1', prompt: 'E?', answers: ['A', 'B', 'C'], correct: 1, why: 'Weil B.', hint: 'Denk an B.'}], challenges: []}, {});
  assert.equal(ohne[1].level, 'entdecker');
});

test('Entdecker: Hauptfrage, dann Entdecker-Fragen; nie Profi oder Experte', () => {
  assert.equal(ersteFrage(fragen, {}, undefined, 'entdecker').id, 'x');
  assert.equal(ersteFrage(fragen, alleGesehen(['x:rate-1', 'x-2']), undefined, 'entdecker').id, 'x:rate-1');
  assert.equal(ersteFrage(fragen, alleGesehen(['x:rate-2', 'x:rate-3', 'x-1']), undefined, 'entdecker').level, 'entdecker', 'ungesehene schwere Fragen bleiben verborgen');
  assert.deepEqual(ids(fragenFuerStufe(fragen, 'entdecker')), ['x', 'x:rate-1', 'x-2']);
});

test('ohne Stufe verhält sich ersteFrage wie Entdecker', () => {
  assert.equal(ersteFrage(fragen, alleGesehen(['x:rate-2'])).level, 'entdecker');
});

test('Profi: zuerst eine ungesehene Profi-Frage, sonst Hauptfrage und Entdecker-Fragen', () => {
  assert.equal(ersteFrage(fragen, {}, undefined, 'profi').id, 'x:rate-2');
  assert.equal(ersteFrage(fragen, {'world-question:x:rate-2': gesehen()}, undefined, 'profi').id, 'x-1');
  assert.equal(ersteFrage(fragen, alleGesehen(['x', 'x:rate-3']), undefined, 'profi').id, 'x', 'alle Profi-Fragen gesehen: Hauptfrage');
  assert.deepEqual(ids(fragenFuerStufe(fragen, 'profi')), ['x:rate-2', 'x-1', 'x', 'x:rate-1', 'x-2']);
});

test('Experte: zuerst die Experten-Frage, sonst wie Profi', () => {
  assert.equal(ersteFrage(fragen, {}, undefined, 'experte').id, 'x:rate-3');
  assert.equal(ersteFrage(fragen, {'world-question:x:rate-3': gesehen()}, undefined, 'experte').id, 'x:rate-2');
  assert.deepEqual(ids(fragenFuerStufe(fragen, 'experte')), ['x:rate-3', 'x:rate-2', 'x-1', 'x', 'x:rate-1', 'x-2']);
});

test('eine falsch beantwortete Frage kommt zuerst, aber nur bis zur gewählten Stufe', () => {
  const profi = fragen.find(f => f.id === 'x:rate-2');
  const falsch = profi.question.answers.find((_, i) => i !== profi.question.correct);
  const stand = {[profi.answerKey]: falsch};
  assert.equal(ersteFrage(fragen, alleGesehen(), stand, 'experte').id, 'x:rate-2');
  assert.equal(ersteFrage(fragen, alleGesehen(), stand, 'profi').id, 'x:rate-2');
  assert.equal(ersteFrage(fragen, alleGesehen(), stand, 'entdecker').level, 'entdecker', 'zurück auf Entdecker: die Profi-Frage wartet');
});

test('sind alle Fragen der Stufe gesehen, kommt die am frühesten fällige darunter', () => {
  const review = {...alleGesehen(), 'world-question:x:rate-1': gesehen('2026-11-01'), 'world-question:x:rate-3': gesehen('2026-10-01')};
  assert.equal(ersteFrage(fragen, review, undefined, 'entdecker').id, 'x:rate-1', 'Experten-Frage zählt auf Entdecker nicht');
  assert.equal(ersteFrage(fragen, review, undefined, 'experte').id, 'x:rate-3');
});

test('hatFragenDerStufe: Experte nur, wo es eine Experten-Frage gibt (E3)', () => {
  assert.equal(hatFragenDerStufe(fragen, 'experte'), true);
  assert.equal(hatFragenDerStufe(kartenFragen(elefant, {}), 'experte'), elefant.moreQuestions?.some(q => q.level === 'experte') ?? false);
  const nurHaupt = kartenFragen({...karte, moreQuestions: [], challenges: []}, {});
  assert.equal(hatFragenDerStufe(nurHaupt, 'profi'), false);
  assert.equal(hatFragenDerStufe(nurHaupt, 'entdecker'), true);
});

test('gueltigeReihe: eine gespeicherte Reihenfolge gilt nur, wenn sie genau die heutigen Antworten vertauscht', () => {
  const profi = fragen.find(f => f.id === 'x:rate-2');
  assert.deepEqual(gueltigeReihe(profi, ['G', 'F', 'E', 'D']), ['G', 'F', 'E', 'D']);
  // Vor der vierten Antwort gespeichert (drei Einträge): ungültig. Die Karte zeigt dann die feste Mischung (festGemischt)
  // und schreibt nichts in den Pass.
  assert.equal(gueltigeReihe(profi, ['F', 'E', 'D']), null);
  assert.equal(gueltigeReihe(profi, ['G', 'F', 'E', 'E']), null, 'doppelt');
  assert.equal(gueltigeReihe(profi, ['G', 'F', 'E', 'Z']), null, 'fremd');
  assert.equal(gueltigeReihe(profi, 'GFED'), null);
  assert.equal(gueltigeReihe(profi, undefined), null);
});

test('festGemischt: feste Mischung je Frage, alle Antworten genau einmal, nicht für alle Fragen die Reihenfolge der Daten', () => {
  const fragen = catalog.flatMap(t => kartenFragen(t, HINTS));
  for (const frage of fragen.slice(0, 50)) {
    const reihe = festGemischt(frage);
    assert.deepEqual([...reihe].sort(), [...frage.question.answers].sort(), frage.id);
    assert.deepEqual(festGemischt(frage), reihe, frage.id + ': gleich bei jedem Aufruf');
  }
  const wieDaten = fragen.filter(frage => festGemischt(frage).every((a, i) => a === frage.question.answers[i])).length;
  assert.ok(wieDaten < fragen.length / 2, 'die Mischung weicht meist von der Reihenfolge der Daten ab: ' + wieDaten + ' von ' + fragen.length);
});

test('gueltigeReihe liest ein altes Wort über seinen Alias', () => {
  const adler = kartenFragen(catalog.find(t => t.id === 'animal-white-tailed-eagle'), {})[0];
  const alt = adler.question.answers.map(a => a === 'Die Länge einer einzelnen Schwanzfeder.' ? 'Die Länge eines einzelnen Schwanzfeder.' : a);
  assert.deepEqual(gueltigeReihe(adler, [...alt].reverse()), [...adler.question.answers].reverse());
});

test('stufenHinweis: sagt ehrlich, wenn es die gewählte Stufe auf der Karte noch nicht gibt (E3)', () => {
  assert.equal(stufenHinweis(fragen, 'experte'), null, 'die Karte hat eine Experten-Frage');
  assert.equal(stufenHinweis(fragen, 'entdecker'), null);
  const ohneExperte = kartenFragen({...karte, moreQuestions: karte.moreQuestions.slice(0, 2)}, bank);
  assert.equal(stufenHinweis(ohneExperte, 'experte'), 'Experte gibt es hier noch nicht. Du spielst Profi.');
  const nurHaupt = kartenFragen({...karte, moreQuestions: [], challenges: []}, {});
  assert.equal(stufenHinweis(nurHaupt, 'profi'), 'Profi gibt es hier noch nicht. Du spielst Entdecker.');
  assert.equal(stufenHinweis(nurHaupt, 'experte'), 'Experte gibt es hier noch nicht. Du spielst Entdecker.');
});

// Stufen-Feinschliff aus dem ersten Spieltest (24.11.2026, BACKLOG Phase 1, Punkt 12 a, c, d).
test('gespielteStufe und fragenDerStufe: genau die Stufe, die die Karte spielt', () => {
  assert.equal(gespielteStufe(fragen, 'experte'), 'experte');
  assert.deepEqual(ids(fragenDerStufe(fragen, 'entdecker')), ['x', 'x:rate-1', 'x-2']);
  assert.deepEqual(ids(fragenDerStufe(fragen, 'profi')), ['x:rate-2', 'x-1'], 'auf Profi keine Entdecker-Fragen');
  assert.deepEqual(ids(fragenDerStufe(fragen, 'experte')), ['x:rate-3']);
  const ohneExperte = kartenFragen({...karte, moreQuestions: karte.moreQuestions.slice(0, 2)}, bank);
  assert.equal(gespielteStufe(ohneExperte, 'experte'), 'profi');
  assert.deepEqual(ids(fragenDerStufe(ohneExperte, 'experte')), ['x:rate-2', 'x-1'], 'Experte ohne Experten-Frage spielt Profi');
  const nurHaupt = kartenFragen({...karte, moreQuestions: [], challenges: []}, {});
  for (const stufe of ['entdecker', 'profi', 'experte']) {
    assert.equal(gespielteStufe(nurHaupt, stufe), 'entdecker');
    assert.deepEqual(ids(fragenDerStufe(nurHaupt, stufe)), ['x']);
  }
});

test('Fehler (a): nach dem Wechsel auf Profi kommt eine Profi-Frage, nicht die falsch beantwortete Entdecker-Frage', () => {
  const haupt = fragen[0];
  const falsch = haupt.question.answers.find((_, i) => i !== haupt.question.correct);
  const stand = {[haupt.answerKey]: falsch};
  const review = {[haupt.reviewId]: gesehen('2026-12-01', false)};
  // Beim Öffnen bleibt es bei E4: Die falsch beantwortete Frage kommt zuerst, auch auf Profi.
  assert.equal(ersteFrage(fragen, review, stand, 'profi').id, 'x');
  // Beim Wechsel auf der offenen Karte zählt nur die neue Stufe.
  assert.equal(frageNachWechsel(fragen, review, stand, 'profi').id, 'x:rate-2');
  assert.equal(frageNachWechsel(fragen, review, stand, 'experte').id, 'x:rate-3');
  assert.equal(frageNachWechsel(fragen, review, stand, 'entdecker').id, 'x', 'zurück auf Entdecker: die falsche Antwort wartet dort');
  // Eine falsch beantwortete Frage der neuen Stufe kommt auch nach dem Wechsel zuerst.
  const profi = fragen.find(f => f.id === 'x-1');
  const profiFalsch = profi.question.answers.find((_, i) => i !== profi.question.correct);
  assert.equal(frageNachWechsel(fragen, alleGesehen(), {...stand, [profi.answerKey]: profiFalsch}, 'profi').id, 'x-1');
  // Hat die Karte die Stufe nicht, kommt eine Frage der Stufe, die sie spielt.
  const nurHaupt = kartenFragen({...karte, moreQuestions: [], challenges: []}, {});
  assert.equal(frageNachWechsel(nurHaupt, {}, undefined, 'experte').id, 'x');
});

test('„Noch eine Frage“ (c, d): jede Frage der gespielten Stufe einmal je Runde, dann null für den Schluss', () => {
  // Runde ab der ersten Frage: in Datenreihenfolge bis zum Ende.
  assert.equal(naechsteFrage(fragen, 'entdecker', 'x', ['x'])?.id, 'x:rate-1');
  assert.equal(naechsteFrage(fragen, 'entdecker', 'x:rate-1', ['x', 'x:rate-1'])?.id, 'x-2');
  assert.equal(naechsteFrage(fragen, 'entdecker', 'x-2', ['x', 'x:rate-1', 'x-2']), null, 'alle dran: Schluss statt wieder von vorn');
  // Runde ab einer späteren Frage: am Ende geht es vorn weiter, bis jede einmal dran war.
  assert.equal(naechsteFrage(fragen, 'entdecker', 'x-2', ['x:rate-1', 'x-2'])?.id, 'x');
  assert.equal(naechsteFrage(fragen, 'entdecker', 'x', ['x:rate-1', 'x-2', 'x']), null);
  // Profi blättert nie in Entdecker-Fragen.
  assert.equal(naechsteFrage(fragen, 'profi', 'x:rate-2', ['x:rate-2'])?.id, 'x-1');
  assert.equal(naechsteFrage(fragen, 'profi', 'x-1', ['x:rate-2', 'x-1']), null, 'nach den Profi-Fragen der Schluss');
  // Experte mit nur einer Experten-Frage: gleich der Schluss.
  assert.equal(naechsteFrage(fragen, 'experte', 'x:rate-3', ['x:rate-3']), null);
  // Öffnet die Karte auf Profi mit einer falsch beantworteten Entdecker-Frage (E4), folgen danach die Profi-Fragen.
  assert.equal(naechsteFrage(fragen, 'profi', 'x', ['x'])?.id, 'x:rate-2');
  assert.equal(naechsteFrage(fragen, 'profi', 'x-1', ['x', 'x:rate-2', 'x-1']), null);
  // Karte nur mit der Hauptfrage: nichts zum Blättern.
  const nurHaupt = kartenFragen({...karte, moreQuestions: [], challenges: []}, {});
  assert.equal(naechsteFrage(nurHaupt, 'profi', 'x', ['x']), null);
});

test('zeigtSchluss: auf Profi und Experte immer, auf Entdecker nur nach mehr als einer Frage', () => {
  assert.equal(zeigtSchluss(fragen, 'entdecker'), true, 'drei Entdecker-Fragen');
  assert.equal(zeigtSchluss(fragen, 'profi'), true);
  assert.equal(zeigtSchluss(fragen, 'experte'), true, 'auch mit nur einer Experten-Frage: klarer Schluss');
  const nurHauptUndProfi = kartenFragen({...karte, moreQuestions: karte.moreQuestions.filter(q => q.level === 'profi'), challenges: []}, bank);
  assert.equal(zeigtSchluss(nurHauptUndProfi, 'entdecker'), false, 'eine einzelne Entdecker-Frage bleibt ohne Schluss, wie auf Karten nur mit der Hauptfrage');
  assert.equal(zeigtSchluss(nurHauptUndProfi, 'profi'), true);
  assert.equal(zeigtSchluss(nurHauptUndProfi, 'experte'), true, 'Experte spielt dort Profi');
  const nurHaupt = kartenFragen({...karte, moreQuestions: [], challenges: []}, {});
  for (const stufe of ['entdecker', 'profi', 'experte']) assert.equal(zeigtSchluss(nurHaupt, stufe), false, 'nur die Hauptfrage: ' + stufe);
});

test('schlussSatz nennt die Stufe, die die Karte spielt', () => {
  assert.equal(schlussSatz(fragen, 'profi'), 'Geschafft! Mehr Profi-Fragen hat diese Karte nicht.');
  assert.equal(schlussSatz(fragen, 'experte'), 'Geschafft! Mehr Experten-Fragen hat diese Karte nicht.', 'Fugen-n nur in der Zusammensetzung');
  assert.equal(schlussSatz(fragen, 'entdecker'), 'Geschafft! Mehr Entdecker-Fragen hat diese Karte nicht.');
  const ohneExperte = kartenFragen({...karte, moreQuestions: karte.moreQuestions.slice(0, 2)}, bank);
  assert.equal(schlussSatz(ohneExperte, 'experte'), 'Geschafft! Mehr Profi-Fragen hat diese Karte nicht.');
});

test('ruhende Fragen erscheinen nicht mehr auf der Karte, ihre ID bleibt in den Daten', () => {
  const mitRuhend = {...karte, moreQuestions: [...karte.moreQuestions, {id: 'x:rate-9', ruht: true, prompt: 'Alt?', answers: ['A', 'B', 'C'], correct: 0, why: 'Alt.', hint: 'Alt.'}], challenges: [...karte.challenges, {id: 'x-9', ruht: true, difficulty: 'medium', prompt: 'Alt?', answers: ['A', 'B', 'C'], correct: 0, why: 'Alt.'}]};
  const ids = kartenFragen(mitRuhend, bank).map(f => f.id);
  assert.equal(ids.includes('x:rate-9'), false);
  assert.equal(ids.includes('x-9'), false);
});
