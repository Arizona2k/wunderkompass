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

// Schritt 8.2: Vier Antworten auf Profi im Tierdetektiv, bei Personen und Technik (E5), Fallen aus derselben Gruppe oder Zeit.
import { profiKandidaten } from '../app/world-game-runde.ts';
import { validWorldGameOrder, restoreWorldGameOrders } from '../app/world-game-bank.ts';
import CATALOG from '../app/world-catalog.json' with { type: 'json' };
import FALLEN from '../app/world-game-fallen.json' with { type: 'json' };
const ERKENNEN = ['animal-detective', 'people', 'technology'];
const thema = id => CATALOG.find(t => t.id === id);
const GRUPPE = { Säugetiere: 's', Vögel: 'v', Fische: 'far', Amphibien: 'far', Reptilien: 'far', Weichtiere: 'w', Insekten: 'w', Spinnentiere: 'w', Krebstiere: 'w' };

test('Profi zieht im Tierdetektiv, bei Personen und Technik drei Fallen aus den Kandidaten', () => {
  for (const spiel of ERKENNEN) for (let seed = 0; seed < 15; seed++) {
    const pool = worldGameBank(spiel), profi = runde(spiel, 'profi', { zufall: zufallAus(seed) }), leicht = runde(spiel, 'entdecker', { zufall: zufallAus(seed) });
    for (const id of profi.items) {
      const q = pool.find(q => q.id === id), order = profi.orders[id], richtig = q.answers[q.correct];
      assert.equal(order.length, 4, spiel + ' ' + id + ': vier Antworten');
      assert.equal(new Set(order).size, 4);
      const namen = profiKandidaten(spiel, id).map(k => thema(k).title);
      assert.ok(order.filter(a => a !== richtig).every(a => namen.includes(a)), spiel + ' ' + id + ': Fallen nur aus den Kandidaten');
      assert.equal(validWorldGameOrder(order, q, pool, spiel), true, spiel + ' ' + id + ': nach Neuladen gültig');
    }
    for (const id of leicht.items) assert.deepEqual([...leicht.orders[id]].sort(), [...pool.find(q => q.id === id).answers].sort(), spiel + ': Entdecker wie bisher');
  }
});

test('Tierdetektiv-Kandidaten stammen aus derselben Tiergruppe, Personen und Technik aus derselben Zeit', () => {
  for (const t of CATALOG.filter(t => t.animal)) {
    const k = profiKandidaten('animal-detective', t.id);
    assert.ok(k.length >= 3, t.id);
    assert.ok(k.every(id => GRUPPE[thema(id).animal.group] === GRUPPE[t.animal.group] && id !== t.id), t.id);
  }
  const jahr = t => t.person ? Number(t.person.lifespan.match(/\d{3,4}/)[0]) : Number(t.invention.year);
  for (const [spiel, art] of [['people', 'person'], ['technology', 'invention']]) for (const t of CATALOG.filter(t => t[art])) {
    const k = profiKandidaten(spiel, t.id), alle = CATALOG.filter(x => x[art] && x.id !== t.id && !(FALLEN.ausschluss[spiel][t.id] ?? []).includes(x.id));
    assert.equal(k.length, 5, t.id);
    const weitester = Math.max(...k.map(id => Math.abs(jahr(thema(id)) - jahr(t))));
    assert.ok(alle.filter(x => !k.includes(x.id)).every(x => Math.abs(jahr(x) - jahr(t)) >= weitester), t.id + ': die fünf zeitlich nächsten');
  }
});

test('ausgeschlossene Paare kommen nie als Falle, die Ausschlussliste nennt nur vorhandene Aufgaben', () => {
  assert.deepEqual(Object.keys(FALLEN.ausschluss).sort(), [...ERKENNEN].sort());
  for (const spiel of ERKENNEN) {
    const pool = worldGameBank(spiel);
    for (const [id, nicht] of Object.entries(FALLEN.ausschluss[spiel])) {
      assert.ok(pool.some(q => q.id === id), spiel + ': unbekannte Aufgabe ' + id);
      assert.ok(nicht.length > 0 && nicht.every(x => thema(x) && x !== id), spiel + ' ' + id);
      assert.equal(profiKandidaten(spiel, id).some(k => nicht.includes(k)), false, spiel + ' ' + id);
    }
  }
});

test('eine gespeicherte Profi-Runde lädt mit denselben vier Antworten, zwei Antworten bleiben ungültig', () => {
  for (const spiel of ERKENNEN) {
    const pool = worldGameBank(spiel), r = runde(spiel, 'profi'), fallback = Object.fromEntries(pool.map(q => [q.id, [...q.answers]]));
    const restored = restoreWorldGameOrders(JSON.parse(JSON.stringify(r.orders)), fallback, pool, spiel);
    for (const id of r.items) assert.deepEqual(restored[id], r.orders[id], spiel + ' ' + id);
    const q = pool.find(q => q.id === r.items[0]);
    assert.equal(validWorldGameOrder(r.orders[q.id].slice(0, 2), q, pool, spiel), false);
    assert.equal(validWorldGameOrder([...r.orders[q.id], 'Erfundene Antwort'], q, pool, spiel), false, 'fünf Antworten sind ungültig');
  }
});

test('„Wer war das?“ schreibt „diese Person“ mitten im Satz klein', () => {
  const prompts = worldGameBank('people').map(q => q.prompt.replace('Wer passt zu diesem Hinweis? ', ''));
  for (const p of prompts) assert.doesNotMatch(p, /[^.!?:\s]\s+Diese Person/u, p);
  assert.ok(prompts.some(p => p.includes('Mit 26 Jahren begann diese Person')), 'Jane Goodall');
  assert.ok(prompts.filter(p => p.startsWith('Diese Person')).length > 20, 'am Satzanfang bleibt es groß');
});

// Schritt 8.3: Lebensraum und Nahrung ziehen ihre Fallen je Runde aus einer geprüften Liste je Tier (E9; Entscheidungsliste Punkt 6).
import TIER_FALLEN from '../app/world-game-tier-fallen.json' with { type: 'json' };
import { worldGameWrongFeedback } from '../app/world-game-support.mjs';
const TIERSPIELE = [['habitats', 'lebensraum', 'habitat'], ['food', 'nahrung', 'diet']];
const tiere = CATALOG.filter(t => t.animal);

test('jedes Tier hat genug geprüfte Fallen, alle sind Texte anderer Tiere', () => {
  for (const [, art, feld] of TIERSPIELE) {
    const texte = new Set(tiere.map(t => t.animal[feld]));
    assert.deepEqual(Object.keys(TIER_FALLEN[art]).sort(), tiere.map(t => t.id).sort(), art + ': jedes Tier hat einen Eintrag');
    for (const t of tiere) {
      const { entdecker, profi } = TIER_FALLEN[art][t.id];
      assert.ok(entdecker.length >= 3, art + ' ' + t.id + ': Entdecker');
      assert.ok(profi.length >= 4, art + ' ' + t.id + ': Profi');
      for (const liste of [entdecker, profi]) {
        assert.equal(new Set(liste).size, liste.length, art + ' ' + t.id + ': keine doppelten Fallen');
        assert.ok(liste.every(x => texte.has(x) && x !== t.animal[feld]), art + ' ' + t.id + ': nur Texte anderer Tiere');
      }
    }
  }
});

test('Entdecker zieht zwei, Profi drei Fallen je Runde, und sie wechseln', () => {
  for (const [spiel, art] of TIERSPIELE) {
    const pool = worldGameBank(spiel), gesehen = {};
    for (let seed = 0; seed < 20; seed++) for (const [stufe, liste, anzahl] of [['entdecker', 'entdecker', 3], ['profi', 'profi', 4]]) {
      const r = runde(spiel, stufe, { zufall: zufallAus(seed) });
      for (const id of r.items) {
        const q = pool.find(q => q.id === id), order = r.orders[id], richtig = q.answers[q.correct];
        assert.equal(order.length, anzahl, spiel + ' ' + stufe + ' ' + id);
        assert.ok(order.includes(richtig));
        assert.ok(order.filter(a => a !== richtig).every(a => TIER_FALLEN[art][id][liste].includes(a)), spiel + ' ' + stufe + ' ' + id);
        assert.equal(validWorldGameOrder(order, q, pool, spiel), true, spiel + ' ' + id + ': nach Neuladen gültig');
        (gesehen[id + stufe] ??= new Set()).add(order.filter(a => a !== richtig).sort().join('|'));
      }
    }
    assert.ok(Object.values(gesehen).some(s => s.size > 1), spiel + ': die Fallen wechseln von Runde zu Runde');
  }
});

test('alte Runden mit den festen Sätzen bleiben gültig, fremde Texte nicht', () => {
  for (const [spiel, art, feld] of TIERSPIELE) {
    const pool = worldGameBank(spiel);
    for (const q of pool) {
      assert.equal(validWorldGameOrder([...q.answers].reverse(), q, pool, spiel), true, spiel + ' ' + q.id + ': alte feste Runde');
      const erlaubt = new Set([...q.answers, ...TIER_FALLEN[art][q.id].entdecker, ...TIER_FALLEN[art][q.id].profi]);
      const fremd = tiere.map(t => t.animal[feld]).find(x => !erlaubt.has(x));
      if (fremd) assert.equal(validWorldGameOrder([q.answers[q.correct], q.answers[1], fremd], q, pool, spiel), false, spiel + ' ' + q.id + ': ' + fremd);
    }
  }
});

test('nach einer gezogenen Falle nennt die Rückmeldung ein Tier, zu dem sie passt', () => {
  for (const [spiel, art, feld] of TIERSPIELE) for (const q of worldGameBank(spiel)) {
    const falle = TIER_FALLEN[art][q.id].profi[0], besitzer = tiere.filter(t => t.animal[feld] === falle).map(t => t.title);
    const text = worldGameWrongFeedback(spiel, q, falle);
    assert.ok(besitzer.some(name => text.includes(name)), spiel + ' ' + q.id + ': ' + text);
    // Die feste Schlussfrage („Pflanzen, andere Tiere oder beides?“) und die Tiernamen zählen nicht als verratene Lösung.
    const ohneFeste = text.replace(/Gesucht ist aber: .*$/u, '').replace(/zu: [^.]*\./u, 'zu: .');
    assert.equal(ohneFeste.includes(q.answers[q.correct]), false, spiel + ' ' + q.id + ': verrät die Lösung nicht');
    assert.ok(text.includes('Gesucht ist aber: ' + thema(q.id).title + '.'), spiel + ' ' + q.id);
  }
});
