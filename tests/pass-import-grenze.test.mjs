// Eine Grenze für Pass-Sicherungen (Technik-PR, Schritt c): Dateiauswahl, Wiederherstellen und Export
// benutzen dieselbe Zahl. Vorher nahm die Auswahl bis 2,6 MB an, der Store aber nur bis 2,0 Mio. Zeichen:
// Eine Sicherung dazwischen ließ sich auswählen und bestätigen und scheiterte erst dann.
// Ohne IndexedDB (wie in manchen privaten Fenstern): Der Pass liegt im Journal (localStorage).
// Die Zeit ist simuliert: Sonst hielten die Speicher-Wiederholungen (bis 30 s) den Testlauf offen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSave, restoreSave, SAVE_KEY, MAX_IMPORT_BYTES, byteLaenge } from '../app/progress-storage.ts';
import { createProgressStore } from '../app/local-progress-store.ts';

function umgebung() {
  const keys = ['localStorage', 'window', 'document', 'BroadcastChannel', 'indexedDB'];
  const original = new Map(keys.map(k => [k, Object.getOwnPropertyDescriptor(globalThis, k)]));
  const data = new Map();
  const fake = {
    localStorage: { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: k => data.delete(k) },
    window: { addEventListener() {} },
    document: { addEventListener() {} },
    BroadcastChannel: undefined,
    indexedDB: undefined,
  };
  for (const [key, value] of Object.entries(fake)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  return { data, weg() { for (const [key, d] of original) if (d) Object.defineProperty(globalThis, key, d); else delete globalThis[key]; } };
}

// Ausgedachte Sicherung, mit Leerzeichen am Ende auf genau `zeichen` Zeichen aufgefüllt (gültiges JSON).
const sicherung = favorites => JSON.stringify(createSave({ ...createSave().progress, favorites, discoveries: favorites }), null, 2);
const aufgefuellt = (raw, zeichen) => raw + ' '.repeat(zeichen - raw.length);

async function gestartet(u, favorites = ['topic:animal-elephant']) {
  const store = createProgressStore();
  await store.start();
  store.update(p => ({ ...p, favorites, discoveries: favorites }));
  return store;
}

test('Gültige Sicherung über der alten Grenze (2,3 MB) lässt sich wiederherstellen (früher lehnte der Store sie ab)', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = await gestartet(u);
    const raw = aufgefuellt(sicherung(['topic:history-maya', 'topic:space-moon']), 2_300_000);
    await store.importSave(raw);
    assert.deepEqual(store.getSnapshot().save.progress.favorites, ['topic:history-maya', 'topic:space-moon']);
    assert.deepEqual(JSON.parse(u.data.get(SAVE_KEY)).progress.favorites, ['topic:history-maya', 'topic:space-moon'], 'im Journal');
  } finally { u.weg(); }
});

test('genau an der Grenze geht es noch, ein Zeichen mehr wird abgelehnt, und der Pass bleibt unverändert', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = await gestartet(u);
    const vorher = store.getSnapshot(), journal = u.data.get(SAVE_KEY);
    const raw = sicherung(['topic:history-maya']);
    await assert.rejects(store.importSave(aufgefuellt(raw, MAX_IMPORT_BYTES + 1)), /zu groß/);
    assert.equal(store.getSnapshot(), vorher, 'gleicher Zustand');
    assert.equal(u.data.get(SAVE_KEY), journal, 'Journal unverändert');
    assert.equal(store.getSnapshot().save.epoch, vorher.save.epoch, 'kein neuer Pass begonnen');
    await store.importSave(aufgefuellt(raw, MAX_IMPORT_BYTES));
    assert.deepEqual(store.getSnapshot().save.progress.favorites, ['topic:history-maya']);
  } finally { u.weg(); }
});

test('Sicherung herunterladen und wiederherstellen ergibt denselben Pass (lesbar eingerückt)', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = await gestartet(u, ['topic:animal-elephant', 'topic:space-moon']);
    const raw = store.backup();
    assert.match(raw, /\n {2}"app"/, 'lesbar eingerückt');
    const vorher = store.getSnapshot().save.progress;
    const neu = createProgressStore(); await neu.start();
    await neu.importSave(raw);
    assert.deepEqual(neu.getSnapshot().save.progress, vorher);
  } finally { u.weg(); }
});

test('sehr großer Pass: Sicherung kommt kompakt unter die Grenze und lässt sich wiederherstellen', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    // Ausgedacht: 14 Spielstände mit je 10 000 kurzen Einträgen. Eingerückt über 2,6 MB, kompakt darunter.
    const sessions = Object.fromEntries(Array.from({ length: 14 }, (_, s) =>
      [`test:grosser-stand-${s}`, { gesehen: Array.from({ length: 10_000 }, (_, i) => `k-${s}-${i}`) }]));
    const store = createProgressStore(); await store.start();
    store.update(p => ({ ...p, gameSessions: { ...p.gameSessions, ...sessions } }));
    const save = store.getSnapshot().save;
    assert.ok(byteLaenge(JSON.stringify(save, null, 2)) > MAX_IMPORT_BYTES, 'Voraussetzung: eingerückt zu groß');
    const raw = store.backup();
    assert.ok(byteLaenge(raw) <= MAX_IMPORT_BYTES, `Sicherung ist ${byteLaenge(raw)} Bytes groß`);
    assert.equal(raw, JSON.stringify(save), 'kompakt in einer Zeile');
    const neu = createProgressStore(); await neu.start();
    await neu.importSave(raw);
    assert.deepEqual(neu.getSnapshot().save.progress.gameSessions, restoreSave(save).progress.gameSessions);
  } finally { u.weg(); }
});
