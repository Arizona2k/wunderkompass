import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RUNDEN_GROESSE, STUFEN_SPIELE, neueWeltRunde, rundenStufe, weltSpielStufe } from '../app/world-game-runde.ts';
import { worldGameBank } from '../app/world-game-bank.ts';

// Welt-Spiel-Runden mit der gemeinsamen Stufe (Teil B, Aufgabe 8, Schritt 8.1).
const HEUTE = '2026-11-24';
const zufallAus = start => { let s = start >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; }; };
const runde = (spiel, stufe, extra = {}) => neueWeltRunde({ spiel, stufe, review: {}, vorige: [], zufall: zufallAus(11), heute: HEUTE, ...extra });

test('Entdecker spielt 5 Aufgaben, Profi 8, Experte spielt Profi', () => {
  assert.deepEqual(RUNDEN_GROESSE, { entdecker: 5, profi: 8, experte: 8 });
  assert.deepEqual(STUFEN_SPIELE, ['animal-detective', 'habitats', 'food', 'people', 'technology', 'then-now']);
  assert.equal(weltSpielStufe('entdecker'), 'entdecker');
  assert.equal(weltSpielStufe('profi'), 'profi');
  assert.equal(weltSpielStufe('experte'), 'profi', 'Experte gibt es in den Welt-Spielen noch nicht (E3)');
  for (const spiel of STUFEN_SPIELE) {
    const pool = worldGameBank(spiel);
    assert.ok(pool.length >= 8, spiel + ' hat genug Aufgaben für Profi');
    for (const [stufe, anzahl, gespielt] of [['entdecker', 5, 'entdecker'], ['profi', 8, 'profi'], ['experte', 8, 'profi']]) {
      const r = runde(spiel, stufe);
      assert.equal(r.stufe, gespielt, spiel + ' ' + stufe);
      assert.equal(r.items.length, anzahl, spiel + ' ' + stufe);
      assert.equal(new Set(r.items).size, anzahl);
      assert.ok(r.items.every(id => pool.some(q => q.id === id)), spiel + ': nur Aufgaben aus dem Vorrat');
    }
  }
});

test('Spiele ohne Stufen spielen wie bisher 5 Aufgaben als Entdecker', () => {
  const r = runde('records', 'profi');
  assert.equal(r.stufe, 'entdecker');
  assert.equal(r.items.length, 5);
});

test('orders enthält genau die gewählten Aufgaben, jede mit der richtigen Antwort', () => {
  for (const spiel of STUFEN_SPIELE) for (const stufe of ['entdecker', 'profi']) {
    const r = runde(spiel, stufe), pool = worldGameBank(spiel);
    assert.deepEqual(Object.keys(r.orders).sort(), [...r.items].sort());
    for (const id of r.items) {
      const q = pool.find(q => q.id === id), order = r.orders[id];
      assert.ok(order.includes(q.answers[q.correct]), spiel + ' ' + id);
      assert.equal(new Set(order).size, order.length);
    }
  }
});

test('die Auswahl liest die Wiederholungen des Spiels', () => {
  const pool = worldGameBank('habitats'), falsch = pool.at(-1).id;
  const review = { ['world-game:habitats:' + falsch]: { correct: false, seen: 1, due: '2026-11-01' } };
  for (const seed of [1, 2, 3]) assert.ok(neueWeltRunde({ spiel: 'habitats', stufe: 'entdecker', review, vorige: [], zufall: zufallAus(seed), heute: HEUTE }).items.includes(falsch));
  const anderesSpiel = { ['world-game:food:' + falsch]: { correct: false, seen: 1, due: '2026-11-01' } };
  const ohne = Array.from({ length: 30 }, (_, i) => neueWeltRunde({ spiel: 'habitats', stufe: 'entdecker', review: anderesSpiel, vorige: [], zufall: zufallAus(i), heute: HEUTE }).items.includes(falsch));
  assert.ok(ohne.includes(false), 'Wiederholungen anderer Spiele zählen nicht');
});

test('die vorige Runde kommt nicht gleich wieder', () => {
  for (const spiel of STUFEN_SPIELE) {
    const erste = runde(spiel, 'profi'), zweite = runde(spiel, 'profi', { vorige: erste.items, zufall: zufallAus(99) });
    assert.equal(zweite.items.some(id => erste.items.includes(id)), false, spiel);
  }
});

test('rundenStufe liest die Stufe einer gespeicherten Runde, alte Runden spielen Entdecker', () => {
  assert.equal(rundenStufe({ items: ['a'], stufe: 'profi' }), 'profi');
  assert.equal(rundenStufe({ items: ['a'] }), 'entdecker');
  for (const kaputt of [undefined, null, 'profi', [], { stufe: 'meister' }, { stufe: 2 }]) assert.equal(rundenStufe(kaputt), 'entdecker');
});
