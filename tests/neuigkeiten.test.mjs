// „Was ist neu?“: kurze Einträge für Kinder, neueste zuerst; die frühere Chronik liegt unter „Früher“.
import test from 'node:test';
import assert from 'node:assert/strict';
import {NEUIGKEITEN, NEUSTART, datumLesbar, aufteilen} from '../app/kern/neuigkeiten.ts';

const SYMBOLE = ['kompass', 'globus', 'stern', 'buch', 'lupe'];

test('jeder Eintrag ist kurz, eindeutig und richtig datiert', () => {
  assert.ok(NEUIGKEITEN.length >= 1);
  const ids = new Set();
  let vorher = '9999-12-31';
  for (const eintrag of NEUIGKEITEN) {
    assert.match(eintrag.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, eintrag.id);
    assert.ok(!ids.has(eintrag.id), 'doppelte ID ' + eintrag.id);
    ids.add(eintrag.id);
    assert.match(eintrag.datum, /^\d{4}-\d{2}-\d{2}$/, eintrag.id);
    assert.equal(new Date(eintrag.datum + 'T00:00:00Z').toISOString().slice(0, 10), eintrag.datum, 'echter Tag ' + eintrag.id);
    assert.ok(eintrag.datum <= vorher, 'neueste zuerst: ' + eintrag.id);
    vorher = eintrag.datum;
    assert.ok(SYMBOLE.includes(eintrag.symbol), eintrag.id);
    assert.ok(eintrag.titel.length <= 40, 'Titel zu lang: ' + eintrag.id);
    assert.ok(eintrag.text.length <= 160, 'Text zu lang: ' + eintrag.id);
    assert.ok((eintrag.text.match(/[.!?](\s|$)/g) ?? []).length <= 2, 'höchstens zwei Sätze: ' + eintrag.id);
    assert.doesNotMatch(eintrag.titel + ' ' + eintrag.text, /Nachrichten/i, eintrag.id);
  }
});

test('Datum steht so da, wie Kinder es lesen', () => {
  assert.equal(datumLesbar('2026-11-21'), '21. November 2026');
  assert.equal(datumLesbar('2026-03-01'), '1. März 2026');
});

test('oben stehen die neuen Einträge, alles davor kommt unter „Früher“', () => {
  const {neu, frueher} = aufteilen();
  assert.ok(neu.length >= 1, 'mindestens ein neuer Eintrag');
  assert.ok(neu.every(e => e.datum >= NEUSTART));
  assert.deepEqual([...neu, ...frueher], [...NEUIGKEITEN], 'nichts geht verloren, Reihenfolge bleibt');
  const eintrag = (id, datum) => ({id, datum, symbol: 'stern', titel: id, text: 'Kurz.'});
  const viele = Array.from({length: 8}, (_, i) => eintrag('neu-' + i, '2026-12-0' + (9 - i)));
  const alt = [eintrag('alt', '2026-10-06')];
  const geteilt = aufteilen([...viele, ...alt]);
  assert.deepEqual(geteilt.neu.map(e => e.id), viele.slice(0, 6).map(e => e.id), 'höchstens sechs oben');
  assert.deepEqual(geteilt.frueher.map(e => e.id), [...viele.slice(6).map(e => e.id), 'alt']);
  assert.deepEqual(aufteilen(alt), {neu: [], frueher: alt});
});
