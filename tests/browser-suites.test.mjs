// Wächter für die Browser-Suiten: Lädt alle Browser-Module (ein kaputter Import fällt so schon
// in `pnpm test` auf) und prüft, dass die Liste vollständig und eindeutig ist.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import test from 'node:test';
import {SUITES} from './browser/suites.mjs';
import {newReport} from './browser/harness.mjs';
import {browserErrorArrays, monitorBrowserErrors} from '../scripts/browser-errors.mjs';

const SETS = ['smoke', 'ci', 'full'];
// Pflicht bei jedem PR: Pass, gespeicherte Antworten, Offline und alte Links. Diese laufen in jeder Engine.
const PASS_OFFLINE = [
  'offline-cold', 'no-news', 'backup', 'animal-game-saves', 'habitat-answer-semantics',
  'retained-answer-wording', 'journey-transfer', 'research-transfer', 'offline-retention',
  'pass-atlas', 'portable-flows', 'kern-huelle', 'people-learning', 'wissenskarte',
];
// Sichtbare Lernansichten, die in jeder Engine laufen.
const ANSICHTEN = ['reise-kapitel'];
// Dazu die Tempo-Prüfung (Ladegröße, Layout-Rutschen), damit zu große Seiten schon im PR auffallen.
const CI = [...PASS_OFFLINE, ...ANSICHTEN, 'performance'];
// Die große Prüfung: alles, was die alten Läufe portable-smoke und journey-engines erreichten.
const FULL = [
  'components', 'offline-resilience', 'research', 'journeys', 'home', 'home-visits',
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

test('CI-Satz enthält die Tempo-Prüfung', () => {
  assert.deepEqual(SUITES.filter(suite => suite.set === 'ci').map(suite => suite.name).sort(), [...CI].sort());
});

test('Pass- und Offline-Suiten laufen in jeder Engine', () => {
  for (const name of ['smoke', ...PASS_OFFLINE, ...ANSICHTEN]) {
    assert.notEqual(SUITES.find(suite => suite.name === name)?.chromiumOnly, true, name + ' darf nicht nur in Chromium laufen');
  }
});

test('Suiten mit eigenem Server oder Persistenzprofil laufen allein', () => {
  for (const name of ['offline-cold', 'offline-resilience', 'offline-cold-full', 'performance']) {
    assert.equal(SUITES.find(suite => suite.name === name)?.solo, true, name + ' muss solo laufen');
  }
});

// Läuft in keiner gewählten Engine eine Suite (z. B. nur Chromium-Suiten mit --browser firefox),
// darf der Runner nicht „Alle Suiten bestanden.“ melden.
test('der Runner bricht ab, wenn in keiner Engine eine Suite laufen würde', () => {
  const result = spawnSync(process.execPath, ['tests/browser/run.mjs', '--suite', 'full', '--browser', 'firefox', 'performance'], {
    cwd: new URL('..', import.meta.url), encoding: 'utf8', timeout: 60000,
  });
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.match(result.stderr, /Keine der gewählten Suiten läuft in firefox/);
  assert.doesNotMatch(result.stdout, /Alle Suiten bestanden/);
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

// Chromium im Handy-Modus (isMobile) vergrößert innerWidth mit dem Überlauf: 10 px zu breit gibt dort
// innerWidth 330 statt 320, und ein Vergleich mit innerWidth sieht nichts (Befund 21.11.2026, Startfrage).
// Überlauf deshalb immer gegen document.documentElement.clientWidth messen.
test('Überlauf-Prüfungen messen nicht gegen innerWidth', () => {
  const dir = new URL('./browser/', import.meta.url);
  const blind = [];
  for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.mjs'))) {
    fs.readFileSync(new URL(file, dir), 'utf8').split('\n').forEach((line, index) => {
      if (/[<>]=?\s*innerWidth\b|\binnerWidth\s*[<>]|viewport:\s*innerWidth\b/.test(line)) blind.push(file + ':' + (index + 1));
    });
  }
  assert.deepEqual(blind, [], 'Vergleich mit innerWidth statt clientWidth');
});

// Schlägt die Browserüberwachung an, soll die Meldung die Fehler nennen (browserErrorText), nicht nur „false“.
test('Browserfehler-Zusicherungen nennen die Fehler', () => {
  const dir = new URL('./browser/', import.meta.url);
  const stumm = [];
  for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.mjs'))) {
    fs.readFileSync(new URL(file, dir), 'utf8').split('\n').forEach((line, index) => {
      if (/assert(?:\.ok)?\(browserErrorsComplete\([^()]*\)\)/.test(line)) stumm.push(file + ':' + (index + 1));
    });
  }
  assert.deepEqual(stumm, [], 'Zusicherung ohne browserErrorText');
});

// Chromium und Firefox melden eine ResizeObserver-Schleife nur leise. Die Überwachung gibt sie deshalb
// per Init-Skript als Konsolenfehler weiter. Fällt das weg, wird sie dort wieder blind (so lange unbemerkt
// bis zur WebKit-Vollprüfung in Teilschritt 1). Geprüft mit einer nachgebauten Seite, ohne Browser.
test('Überwachung meldet ResizeObserver-Schleifen in jeder Engine', () => {
  const handler = {}, skripte = [];
  const page = {
    on: (name, fn) => { (handler[name] ??= []).push(fn); },
    addInitScript: fn => { skripte.push(fn); return Promise.resolve(); },
    mainFrame: () => null,
  };
  const proof = browserErrorArrays();
  monitorBrowserErrors(page, 'http://127.0.0.1:4173', proof, {engine: 'chromium'});
  const fenster = [];
  const konsole = {error: text => handler.console?.forEach(fn => fn({type: () => 'error', text: () => text, location: () => ({url: ''})}))};
  for (const skript of skripte) new Function('addEventListener', 'console', 'return (' + skript + ')()')((name, fn) => fenster.push({name, fn}), konsole);
  for (const {name, fn} of fenster) if (name === 'error') fn({message: 'ResizeObserver loop completed with undelivered notifications.'});
  assert.deepEqual(proof.consoleErrors, ['[chromium] ResizeObserver loop completed with undelivered notifications.']);
});
