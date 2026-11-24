// Inhaltswächter (ersetzt das frühere `pnpm run verify`):
// 1. Der Export-Prüflauf ist grün: abgeleitete Dateien in app/ sind aktuell, die Validatoren bestehen.
//    Die eingecheckten Exporte in exports/content passen zum frischen Export.
// 2. Jedes Thema mit Foto verweist auf einen vorhandenen Bildnachweis und eine vorhandene Datei.
// 3. Das Spiel „Früher oder heute?“ enthält keine Forscherfragen-Erfindungen (walkthrough).
// 4. Stabile IDs: Jede ID, die im Entdeckerpass oder in Links vorkommt, gibt es noch.
//    fixtures/stable-ids.json: aus dem alten Inventar (Commit d0dc9a3) die Familien, deren IDs im Pass oder in
//    Hash-Links stehen, plus alle am 21.11.2026 vorhandenen IDs dieser Familien.
//    Die Liste darf nur wachsen; wer eine ID bewusst aufgibt, braucht eine Umleitung und einen BACKLOG-Eintrag.
//    Familie photos (seit 24.11.2026): Foto-IDs werden nie wiederverwendet; scripts/foto-einbau.mjs trägt neue ein.
// 5. Jedes Foto steht auf einer Karte oder einem Naturort, oder es ist ersetzt (fixtures/ersetzte-fotos.json:
//    Nachweis bleibt, gezeigt wird es nicht mehr). Der Browser-Test world-photos liest dieselbe Liste.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {isDeepStrictEqual} from 'node:util';
import {worldGameBank} from '../app/world-game-bank.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const CHECK_DIR = path.join(ROOT, '.qa-output/content-check');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const STABLE = readJson(path.join(import.meta.dirname, 'fixtures/stable-ids.json'));

// Läuft einmal vor den Tests; die Prüfdateien in .qa-output/content-check lesen die Tests unten.
let exportError;
try {
  execFileSync(process.execPath, [path.join(ROOT, 'scripts/export-content.mjs'), '--check'], {cwd: ROOT, stdio: 'pipe'});
} catch (error) {
  exportError = error;
}
const exported = name => readJson(path.join(CHECK_DIR, name + '.json'));

test('der Export-Prüflauf ist grün (abgeleitete Dateien aktuell, Validatoren bestanden)', () => {
  assert.equal(exportError, undefined, String(exportError?.stderr ?? exportError));
});

// exports/content bleibt in Git, weil Browser-Tests es lesen (BACKLOG). Weicht es vom frischen Export ab,
// prüfen diese Tests still alte Daten. Verglichen wird Byte für Byte, in index.json ohne den Zeitstempel.
const EXPORT_DIR = path.join(ROOT, 'exports/content');
function staleExportFiles(freshDir, savedDir) {
  const withoutStamp = file => {
    const data = readJson(file);
    delete data.generatedAt;
    return data;
  };
  const names = [...new Set([...fs.readdirSync(freshDir), ...fs.readdirSync(savedDir)])].sort();
  return names.filter(name => {
    const fresh = path.join(freshDir, name);
    const saved = path.join(savedDir, name);
    if (!fs.existsSync(fresh) || !fs.existsSync(saved)) return true;
    if (name === 'index.json') return !isDeepStrictEqual(withoutStamp(fresh), withoutStamp(saved));
    return !fs.readFileSync(fresh).equals(fs.readFileSync(saved));
  });
}

test('exports/content passt zum frischen Export', () => {
  assert.deepEqual(staleExportFiles(CHECK_DIR, EXPORT_DIR), [], 'Veraltete Exporte: pnpm run export:data ausführen und mit committen.');
});

test('Mutationsprobe: veraltete, fehlende und zusätzliche Exporte werden erkannt, ein neuer Zeitstempel nicht', () => {
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'wk-exports-'));
  try {
    for (const name of fs.readdirSync(CHECK_DIR)) fs.copyFileSync(path.join(CHECK_DIR, name), path.join(copy, name));
    const index = readJson(path.join(copy, 'index.json'));
    fs.writeFileSync(path.join(copy, 'index.json'), JSON.stringify({...index, generatedAt: '2000-01-01T00:00:00.000Z'}, null, 2));
    assert.deepEqual(staleExportFiles(CHECK_DIR, copy), []);
    const why = readJson(path.join(copy, 'why-questions.json'));
    why[0].answer += ' (alt)';
    fs.writeFileSync(path.join(copy, 'why-questions.json'), JSON.stringify(why));
    fs.rmSync(path.join(copy, 'earth-badges.json'));
    fs.writeFileSync(path.join(copy, 'zz-alt.json'), '[]');
    assert.deepEqual(staleExportFiles(CHECK_DIR, copy), ['earth-badges.json', 'why-questions.json', 'zz-alt.json']);
  } finally {
    fs.rmSync(copy, {recursive: true, force: true});
  }
});

// Fehlende Fotos oder Bildnachweise eines Themas, sortiert nach Thema.
function missingTopicPhotos(topics, photos, exists) {
  const problems = [];
  for (const topic of topics.filter(t => t.image)) {
    const photo = photos[topic.image];
    if (!photo) problems.push(topic.id + ': kein Bildnachweis für ' + topic.image);
    else if (!exists(photo.src)) problems.push(topic.id + ': Bilddatei fehlt ' + photo.src);
  }
  return problems;
}

const publicFileExists = src => fs.existsSync(path.join(ROOT, 'public', src));

test('jedes Thema mit Foto hat einen Bildnachweis und eine vorhandene Bilddatei', () => {
  const topics = readJson(path.join(ROOT, 'app/world-catalog.json'));
  const photos = readJson(path.join(ROOT, 'app/world-photos.json'));
  assert.ok(topics.some(t => t.image), 'kein Thema mit Foto gefunden');
  assert.deepEqual(missingTopicPhotos(topics, photos, publicFileExists), []);
});

test('Mutationsprobe: ein Bildpfad ins Leere wird erkannt', () => {
  const topics = readJson(path.join(ROOT, 'app/world-catalog.json'));
  const photos = structuredClone(readJson(path.join(ROOT, 'app/world-photos.json')));
  const victim = topics.find(t => t.image);
  photos[victim.image].src = '/photos/gibt-es-nicht.webp';
  assert.deepEqual(missingTopicPhotos(topics, photos, publicFileExists), [victim.id + ': Bilddatei fehlt /photos/gibt-es-nicht.webp']);
  delete photos[victim.image];
  assert.deepEqual(missingTopicPhotos(topics, photos, publicFileExists), [victim.id + ': kein Bildnachweis für ' + victim.image]);
});

test('„Früher oder heute?“ fragt nur nach historischen Erfindungen, nicht nach Forscherfragen-Erfindungen', () => {
  const topics = readJson(path.join(ROOT, 'app/world-catalog.json'));
  const walkthrough = new Set(topics.filter(t => t.invention?.walkthrough).map(t => t.id));
  const items = worldGameBank('then-now');
  assert.ok(walkthrough.size > 0 && items.length > 0, 'Testdaten fehlen');
  assert.deepEqual([...new Set(items.filter(item => walkthrough.has(item.topic)).map(item => item.topic))], []);
});

// Heutige IDs je Familie, gelesen aus den Prüfdateien des Exports (gleiche Schlüssel wie das alte Inventar).
function currentIds() {
  const ids = {};
  const topics = exported('world-topics');
  for (const category of exported('world-categories')) ids['topics-' + category.id] = topics.filter(t => t.category === category.id).map(t => t.id);
  const journeys = exported('journeys');
  ids.journeys = journeys.map(j => j.id);
  ids.chapters = journeys.flatMap(j => j.steps.map((_step, index) => j.id + ':' + index));
  ids.games = exported('games').map(g => g.family + ':' + g.id);
  const labs = exported('laboratories');
  ids.labs = labs.map(l => l.id);
  const questions = exported('research-questions');
  ids['lab-tasks'] = labs.flatMap(l => [l.id + ':easy', ...Object.keys(questions[l.id] ?? {}).map(level => l.id + ':' + level)]);
  ids.experiments = Object.keys(exported('home-experiment-research'));
  ids.missions = exported('globe-missions').map((_mission, index) => String(index));
  ids.quiz = exported('quiz-questions').map(q => q.id);
  ids['nature-topics'] = exported('nature-locations').filter(t => t.category !== 'animals').map(t => t.id);
  // Wörter und Warum-Fragen stecken als `word:…`/`why:…` in Favoriten und in Links #book/words/… bzw. #book/why/….
  ids.words = exported('knowledge-words').map(w => w.term);
  ids.why = exported('why-questions').map(w => w.question);
  // Lernrouten: Links #world/route/<id>, abgeschlossene Routen als `route:<id>` in den Entdeckungen.
  ids.routes = exported('world-routes').map(r => r.id);
  // Zusatzfragen und „Stimmt das?“ der Wissenskarten: `world-question:<id>` im Pass, `claim:<id>` in den Spielständen.
  // Dazu „Ordne richtig“ (Teilschritt 3): `ordnen:<id>` im Spielstand der Karte.
  ids['world-card-extras'] = topics.flatMap(t => [...(t.moreQuestions ?? []), ...(t.claims ?? []), ...(t.ordnen ? [t.ordnen] : [])].map(x => x.id));
  // Foto-IDs: stehen in Pass-Sicherungen nicht, aber eine wiederverwendete ID zeigte unter altem Nachweis ein anderes Bild.
  ids.photos = Object.keys(readJson(path.join(ROOT, 'app/world-photos.json')));
  return ids;
}

test('alle stabilen IDs (Themen, Reisen, Kapitel, Spiele, Labore, Aufgaben, Missionen, Quiz, Naturorte, Wörter, Warum-Fragen, Routen, Zusatzfragen, Fotos) gibt es noch', () => {
  assert.equal(exportError, undefined, 'Export-Prüflauf fehlgeschlagen');
  const current = currentIds();
  assert.deepEqual(Object.keys(STABLE).filter(family => !current[family]), [], 'Familie ohne heutige Quelle');
  const missing = Object.entries(STABLE).flatMap(([family, ids]) => ids.filter(id => !current[family].includes(id)).map(id => family + ':' + id));
  assert.deepEqual(missing, [], 'verlorene IDs: Pass-Fortschritt und Links würden brechen');
});

test('jede heutige Foto-ID steht in der festen Liste (stable-ids.json, Familie photos)', () => {
  const fotos = Object.keys(readJson(path.join(ROOT, 'app/world-photos.json')));
  assert.deepEqual(fotos.filter(id => !STABLE.photos.includes(id)), [], 'neue Foto-ID in tests/fixtures/stable-ids.json (photos) eintragen');
});

// Gleiche Regel wie scripts/foto-einbau.mjs (wirdGezeigt) und tests/browser/world-photos.mjs.
function fotosOhnePlatz(fotos, topics, naturFotos, naturOrte, ersetzt) {
  const gezeigt = id => topics.some(t => t.image === id) || (Object.hasOwn(naturFotos, id) && naturOrte.some(ort => ort.id === id));
  return Object.keys(fotos).flatMap(id => gezeigt(id) === ersetzt.includes(id)
    ? [ersetzt.includes(id) ? id + ': ersetzt, steht aber wieder auf einer Karte' : id + ': steht auf keiner Karte und keinem Naturort']
    : []);
}

test('jedes Foto wird gezeigt oder ist als ersetzt vermerkt', () => {
  const lese = name => readJson(path.join(ROOT, name));
  const ersetzt = readJson(path.join(import.meta.dirname, 'fixtures/ersetzte-fotos.json'));
  const fotos = lese('app/world-photos.json');
  assert.deepEqual(ersetzt.filter(id => !Object.hasOwn(fotos, id)), [], 'ersetzte Fotos behalten ihren Nachweis');
  assert.deepEqual(fotosOhnePlatz(fotos, lese('app/world-catalog.json'), lese('app/nature-photo-candidates.json'), lese('app/nature-new-places.json'), ersetzt), []);
});

test('Mutationsprobe: ein Foto ohne Platz und ein wieder gezeigtes ersetztes Foto fallen auf', () => {
  const fotos = {a: {}, b: {}, c: {}};
  const topics = [{id: 't1', image: 'a'}, {id: 't2', image: 'c'}];
  assert.deepEqual(fotosOhnePlatz(fotos, topics, {}, [], ['c']), ['b: steht auf keiner Karte und keinem Naturort', 'c: ersetzt, steht aber wieder auf einer Karte']);
  assert.deepEqual(fotosOhnePlatz(fotos, topics, {b: {}}, [{id: 'b'}], []), []);
});
