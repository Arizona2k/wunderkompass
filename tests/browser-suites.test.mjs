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
// Pflicht bei jedem PR: Pass, gespeicherte Antworten, Offline und alte Links. Sie sind nicht auf Chromium beschränkt;
// jeder PR prüft sie in Chromium (Pflicht, offline-cold und backup auch in WebKit) und in der Engine-Schnellprüfung
// in Firefox und WebKit.
const PASS_OFFLINE = [
  'offline-cold', 'no-news', 'backup', 'pass-spielstaende', 'animal-game-saves', 'habitat-answer-semantics',
  'retained-answer-wording', 'journey-transfer', 'research-transfer', 'offline-retention',
  'pass-atlas', 'portable-flows', 'kern-huelle', 'people-learning', 'wissenskarte',
];
// Sichtbare Lernansichten, die nicht auf Chromium beschränkt sind.
const ANSICHTEN = ['reise-kapitel', 'solar-labels'];
// Dazu die Tempo-Prüfung (Ladegröße, Layout-Rutschen), damit zu große Seiten schon im PR auffallen.
const CI = [...PASS_OFFLINE, ...ANSICHTEN, 'performance'];
// Die große Prüfung: alles, was die alten Läufe portable-smoke und journey-engines erreichten.
const FULL = [
  'components', 'offline-resilience', 'research', 'journeys', 'home', 'home-visits',
  'core', 'animals', 'animal-native-zoom', 'playground', 'challenge',
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

test('Pass- und Offline-Suiten sind nicht auf Chromium beschränkt', () => {
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

// Kartenfragen und „Ganz einfach“ nur über tests/browser/karte-hilfen.mjs (Technik-Prüfung 23.11.2026, Befund 2).
// In Teil B beantworteten rund zehn Suiten die Hauptfrage mit eigenem Code, obwohl die Karte nach einer Antwort schon
// eine Zusatzfrage zeigte, und suchten „Ganz einfach“ selbst; sie fielen nacheinander in langen Läufen auf.
// Die Stufen ändern wieder, welche Frage kommt. Verboten außerhalb von karte-hilfen.mjs:
// eigene Antwortsuche an einer Kartenfrage (.question.answers[…], .question.correct), .moreQuestions,
// .learning.starter und das Weiterreichen einer Kartenfrage in eine Variable (q = t.question, {question: q} = t).
// Keine Kartenfragen sind Reise- und Buchfragen (journey.question, j.question, item.question, learning.question)
// und die Überschriften der Häppchen (kapitel.question, chapter.question).
const NICHT_KARTE = String.raw`(?<!\b(?:journey|j|item|learning|kapitel|chapter))`;
const KARTENFRAGE_EIGEN = [
  [new RegExp(NICHT_KARTE + String.raw`\.question\.(?:answers\[|correct\b)`), 'eigene Antwortsuche an einer Kartenfrage'],
  [/\.moreQuestions\b/, 'Zusatzfragen selbst gelesen'],
  [/\.learning\.starter\b/, '„Ganz einfach“ selbst gesucht'],
  [new RegExp(String.raw`[=:,(]\s*` + NICHT_KARTE.replace('(?<!', '(?!').replace('))', ')\\.)') + String.raw`\w+\.question\s*[,;)}]`), 'Kartenfrage in eine Variable gereicht'],
  [/\{[^}]*\bquestion\b[^}]*\}\s*=/, 'Kartenfrage aus einer Karte ausgepackt'],
];
test('Kartenfragen und „Ganz einfach“ nur über karte-hilfen.mjs', () => {
  const dir = new URL('./browser/', import.meta.url);
  const treffer = [];
  for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.mjs') && name !== 'karte-hilfen.mjs')) {
    fs.readFileSync(new URL(file, dir), 'utf8').split('\n').forEach((line, index) => {
      for (const [muster, grund] of KARTENFRAGE_EIGEN) if (muster.test(line)) treffer.push(file + ':' + (index + 1) + ' ' + grund);
    });
  }
  assert.deepEqual(treffer, [], 'Bausteine aus karte-hilfen.mjs nutzen (angezeigteFrage, antworteRichtig, frageDurchspielen, hauptfrage, ganzEinfach)');
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

// React meldet einen Renderfehler, den es selbst repariert hat (#520), nur als Hülle; die Ursache steht in `error.cause`.
// Die Überwachung schickt Ursache und Adresse mit. Ohne das zeigte die CI-Vollprüfung (Lauf 253, Firefox) nur „#520“.
test('Überwachung nennt Ursache und Adresse eines reparierten React-Renderfehlers', () => {
  const handler = {}, skripte = [];
  const page = {
    on: (name, fn) => { (handler[name] ??= []).push(fn); },
    addInitScript: fn => { skripte.push(fn); return Promise.resolve(); },
    mainFrame: () => null,
  };
  const proof = browserErrorArrays();
  monitorBrowserErrors(page, 'http://127.0.0.1:4173', proof, {engine: 'firefox'});
  const fenster = [];
  const melde = type => text => handler.console?.forEach(fn => fn({type: () => type, text: () => text, location: () => ({url: ''})}));
  const konsole = {error: melde('error'), debug: melde('debug')};
  for (const skript of skripte) new Function('addEventListener', 'console', 'location', 'return (' + skript + ')()')((name, fn) => fenster.push({name, fn}), konsole, {hash: '#world/topic/people-marie-curie'});
  const ursache = new TypeError('frage is undefined');
  const huelle = new Error('Minified React error #520', {cause: ursache});
  for (const {name, fn} of fenster) if (name === 'error') { fn({message: huelle.message, error: huelle}); fn({message: 'Ohne Ursache', error: new Error('Ohne Ursache')}); }
  assert.equal(proof.errors.length, 1, 'nur der Fehler mit Ursache bekommt einen Zusatzeintrag; der Seitenfehler selbst kommt über pageerror');
  assert.match(proof.errors[0], /^\[firefox\] WK-URSACHE \{/);
  const detail = JSON.parse(proof.errors[0].slice('[firefox] WK-URSACHE '.length));
  assert.equal(detail.adresse, '#world/topic/people-marie-curie');
  assert.equal(detail.ursache, 'frage is undefined');
  assert.match(detail.stapel, /TypeError: frage is undefined/);
  assert.deepEqual(proof.consoleErrors, []);
});

// Jeder PR prüft Pass und Offline zusätzlich in WebKit (Safari auf iPhone und iPad). Beide alten WebKit-Fehler
// fielen sonst erst in der Vollprüfung auf (23.11.2026). Skript und CI-Schritt müssen dazu zusammenpassen.
test('WebKit-Kurzprüfung läuft bei jedem PR', () => {
  const skripte = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')).scripts;
  const befehl = skripte['test:browser:webkit'] ?? '';
  assert.match(befehl, /run\.mjs --suite ci --browser webkit\b/, 'test:browser:webkit muss den CI-Satz in WebKit starten');
  const namen = befehl.split(/\s+/).filter(wort => !wort.startsWith('-') && SUITES.some(suite => suite.name === wort));
  assert.deepEqual(namen.sort(), ['backup', 'offline-cold'], 'WebKit-Kurzprüfung soll offline-cold und backup prüfen');
  for (const name of namen) assert.notEqual(SUITES.find(suite => suite.name === name)?.chromiumOnly, true, name + ' läuft nicht in WebKit');
  assert.match(skripte.check, /pnpm run test:browser:webkit\b/, 'pnpm run check soll die WebKit-Kurzprüfung enthalten');

  const ci = fs.readFileSync(new URL('../.github/workflows/quality.yml', import.meta.url), 'utf8');
  const pflicht = ci.slice(ci.indexOf('name: Required quality checks'), ci.indexOf('\n  full:'));
  assert.match(pflicht, /playwright install --with-deps chromium webkit\b/, 'Pflichtjob muss WebKit installieren');
  assert.match(pflicht, /run: pnpm run test:browser:webkit\b/, 'Pflichtjob muss die WebKit-Kurzprüfung starten');
});

// Jeder PR prüft den CI-Satz auch in Firefox und WebKit (Job „Engine-Schnellprüfung“). Läuft der Job nur bei
// Veröffentlichungs-PRs oder fehlt ein Browser, fallen browserspezifische Fehler wieder erst am Phasenende auf.
test('Engine-Schnellprüfung prüft den CI-Satz bei jedem PR in Firefox und WebKit', () => {
  const ci = fs.readFileSync(new URL('../.github/workflows/quality.yml', import.meta.url), 'utf8');
  const start = ci.indexOf('\n  engines:');
  assert.ok(start > 0, 'Job engines fehlt in quality.yml');
  const rest = ci.slice(start + 1);
  const ende = rest.search(/\n {2}[a-z][\w-]*:\n/);
  const job = ende < 0 ? rest : rest.slice(0, ende);
  assert.doesNotMatch(job, /^ {4}if:/m, 'Engine-Schnellprüfung darf nicht auf bestimmte PRs beschränkt sein');
  assert.match(job, /browser: \[firefox, webkit\]/, 'Engine-Schnellprüfung braucht Firefox und WebKit');
  assert.match(job, /playwright install --with-deps \$\{\{ matrix\.browser \}\}/);
  assert.match(job, /run: pnpm run test:browser -- --browser \$\{\{ matrix\.browser \}\}/);
  const skripte = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')).scripts;
  assert.match(skripte['test:browser'], /run\.mjs --suite ci\b/, 'test:browser muss den CI-Satz starten');
  assert.ok(SUITES.some(suite => suite.set === 'ci' && !suite.chromiumOnly), 'CI-Satz hat keine Suite für Firefox und WebKit');
});
