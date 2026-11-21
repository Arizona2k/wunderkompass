// Wächter für die Browser-Suiten: Lädt alle Browser-Module (ein kaputter Import fällt so schon
// in `pnpm test` auf) und prüft, dass die Liste vollständig und eindeutig ist.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {SUITES} from './browser/suites.mjs';
import {newReport} from './browser/harness.mjs';

const SETS = ['smoke', 'ci', 'full'];
// Pflicht bei jedem PR: Pass, gespeicherte Antworten, Offline und alte Links.
const CI = [
  'offline-cold', 'no-news', 'backup', 'animal-game-saves', 'habitat-answer-semantics',
  'retained-answer-wording', 'journey-transfer', 'research-transfer', 'offline-retention',
  'pass-atlas', 'portable-flows', 'people-learning',
];
// Die große Prüfung: alles, was die alten Läufe portable-smoke und journey-engines erreichten.
const FULL = [
  'performance', 'components', 'offline-resilience', 'research', 'journeys', 'home', 'home-visits',
  'core', 'solar-labels', 'animals', 'animal-native-zoom', 'playground', 'challenge',
  'offline-cold-full', 'engine-journeys',
];

test('jede Suite hat einen eindeutigen Namen, eine Funktion und eine gültige Stufe', () => {
  const names = SUITES.map(suite => suite.name);
  assert.equal(new Set(names).size, names.length, 'doppelte Namen: ' + names.filter((name, index) => names.indexOf(name) !== index));
  for (const suite of SUITES) {
    assert.equal(typeof suite.run, 'function', suite.name + ': run fehlt');
    assert.ok(SETS.includes(suite.set), suite.name + ': unbekannte Stufe ' + suite.set);
    for (const flag of ['chromiumOnly', 'solo']) {
      if (flag in suite) assert.equal(typeof suite[flag], 'boolean', suite.name + ': ' + flag + ' ist kein Wahrheitswert');
    }
  }
});

test('Rauchtest, Pflicht- und Vollprüfung sind vollständig eingetragen', () => {
  const byName = new Map(SUITES.map(suite => [suite.name, suite]));
  assert.equal(byName.get('smoke')?.set, 'smoke');
  for (const name of CI) assert.equal(byName.get(name)?.set, 'ci', 'CI-Suite fehlt oder falsche Stufe: ' + name);
  for (const name of FULL) assert.equal(byName.get(name)?.set, 'full', 'Voll-Suite fehlt oder falsche Stufe: ' + name);
  assert.equal(SUITES.length, 1 + CI.length + FULL.length, 'nicht erfasste Suite in suites.mjs');
});

test('Pass- und Offline-Suiten laufen in jeder Engine', () => {
  for (const name of ['smoke', ...CI]) {
    assert.notEqual(SUITES.find(suite => suite.name === name)?.chromiumOnly, true, name + ' darf nicht nur in Chromium laufen');
  }
});

test('Suiten mit eigenem Server oder Persistenzprofil laufen allein', () => {
  for (const name of ['offline-cold', 'offline-resilience', 'offline-cold-full', 'performance']) {
    assert.equal(SUITES.find(suite => suite.name === name)?.solo, true, name + ' muss solo laufen');
  }
});

// Ältere Abläufe schreiben in report.<feld>.push(…). Fehlt das Feld, bricht die Suite mitten im Lauf ab
// („Cannot read properties of undefined (reading 'push')“). Jedes Feld legt entweder der Runner an
// (newReport) oder die Datei selbst.
test('jedes Berichtsfeld, in das eine Suite schreibt, ist angelegt', () => {
  const base = Object.keys(newReport());
  const missing = [];
  for (const file of reachableModules('suites.mjs')) {
    const source = fs.readFileSync(new URL('./browser/' + file, import.meta.url), 'utf8');
    for (const [, field] of source.matchAll(/report\.([a-zA-Z]+)\.push/g)) {
      // Angelegt per report.feld = … / ??= … oder in einem eigenen report = {feld: …}.
      const created = new RegExp(`report\\.${field}\\s*(\\?\\?=|=(?!=))|report\\s*=\\s*\\{[^}]*\\b${field}\\s*:`).test(source);
      if (!created && !base.includes(field)) missing.push(file + ': ' + field);
    }
  }
  assert.deepEqual([...new Set(missing)], []);
});

// Alle Browser-Module, die von `start` aus über relative Importe erreichbar sind.
function reachableModules(start) {
  const seen = new Set();
  const visit = file => {
    if (seen.has(file)) return;
    seen.add(file);
    const source = fs.readFileSync(new URL('./browser/' + file, import.meta.url), 'utf8');
    for (const [, next] of source.matchAll(/(?:from|import\()\s*['"]\.\/([\w-]+\.mjs)['"]/g)) visit(next);
  };
  visit(start);
  return [...seen];
}
