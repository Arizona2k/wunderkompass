import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSave, SAVE_KEY, LEGACY_KEY } from '../app/progress-storage.ts';
import { createProgressStore } from '../app/local-progress-store.ts';

// Eigene Datei: progress-storage merkt sich die erste gelungene Datenbank-Verbindung je Prozess.
// Hier ist IndexedDB absichtlich kaputt (Öffnen und Schreiben schlagen fehl) und lässt sich auf „geht“ schalten.
// Die Zeit ist simuliert (mock.timers), damit sich Sekunden ohne Warten prüfen lassen.
const idb = { modus: 'kaputt', versuche: 0, persisted: undefined, journalVoll: false, geschlossen: false, oeffnungen: 0 };
const fehler = () => new Error('IndexedDB kaputt (Test)');
const db = {
  objectStoreNames: { contains: () => true },
  close() {},
  transaction() {
    idb.versuche++;
    // Wie ein Browser, der die Verbindung geschlossen hat: Schon das Anlegen der Transaktion wirft.
    if (idb.geschlossen) { const e = new Error('The database connection is closing. (Test)'); e.name = 'InvalidStateError'; throw e; }
    const tx = {
      objectStore: () => ({
        get() {
          const r = {};
          queueMicrotask(() => {
            if (idb.modus !== 'ok') { tx.error = fehler(); tx.onerror?.(); return; }
            r.result = idb.persisted; r.onsuccess?.(); queueMicrotask(() => tx.oncomplete?.());
          });
          return r;
        },
        put(value) { idb.persisted = structuredClone(value); },
      }),
    };
    return tx;
  },
};

function umgebung() {
  const keys = ['localStorage', 'window', 'document', 'BroadcastChannel', 'indexedDB'];
  const original = new Map(keys.map(k => [k, Object.getOwnPropertyDescriptor(globalThis, k)]));
  const data = new Map();
  const doc = { hidden: false, listeners: {}, addEventListener(type, fn) { doc.listeners[type] = fn; } };
  const fake = {
    localStorage: {
      getItem: k => data.get(k) ?? null,
      setItem: (k, v) => { if (idb.journalVoll) throw new Error('Browser-Speicher voll (Test)'); data.set(k, v); },
      removeItem: k => data.delete(k),
    },
    window: { addEventListener() {} },
    document: doc,
    BroadcastChannel: undefined,
    indexedDB: {
      open() {
        idb.versuche++;
        const r = {};
        queueMicrotask(() => { if (idb.modus === 'ok') { idb.geschlossen = false; idb.oeffnungen++; r.result = db; r.onsuccess?.(); } else { r.error = fehler(); r.onerror?.(); } });
        return r;
      },
    },
  };
  for (const [key, value] of Object.entries(fake)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  idb.modus = 'kaputt'; idb.versuche = 0;
  return { data, doc, weg() { for (const [key, d] of original) if (d) Object.defineProperty(globalThis, key, d); else delete globalThis[key]; } };
}
const ruhe = async () => { await new Promise(r => setImmediate(r)); await new Promise(r => setImmediate(r)); };
async function warte(t, ms) { for (let i = 0; i < ms; i += 100) { t.mock.timers.tick(100); await ruhe(); } }
const imJournal = data => JSON.parse(data.get(SAVE_KEY)).progress;

test('Dauerhaft kaputte Datenbank: wenige Versuche statt einer Schleife alle 200 ms, gleicher Zustand bleibt derselbe', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = createProgressStore();
    let meldungen = 0; store.subscribe(() => meldungen++);
    await store.start(); await warte(t, 300);
    const nachErstemFehler = store.getSnapshot();
    assert.equal(nachErstemFehler.storage, 'browser', 'der Pass liegt im Browser-Speicher');
    await warte(t, 4700);
    // Vorher: etwa 25 Öffnungsversuche und 25 neue Zustände in 5 s. Jetzt: Start, 0,2 s, 1,2 s, 3,2 s.
    assert.ok(idb.versuche <= 8, `zu viele Versuche: ${idb.versuche}`);
    assert.ok(meldungen <= 4, `zu viele Meldungen: ${meldungen}`);
    assert.equal(store.getSnapshot(), nachErstemFehler, 'gleicher Fehler ergibt keinen neuen Zustand');
  } finally { u.weg(); }
});

test('Fehlerfall: Änderungen stehen sofort im Journal und sind nach dem Neuladen da', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = createProgressStore(); await store.start(); await warte(t, 1500);
    store.update(p => ({ ...p, favorites: ['animal-elephant'], discoveries: [...p.discoveries, 'animal-elephant'] }));
    assert.deepEqual(imJournal(u.data).favorites, ['animal-elephant'], 'sofort im Journal');
    await warte(t, 5000);
    const neu = createProgressStore(); await neu.start();
    assert.deepEqual(neu.getSnapshot().save.progress.favorites, ['animal-elephant'], 'nach dem Neuladen');
    assert.ok(neu.getSnapshot().save.progress.discoveries.includes('animal-elephant'));
  } finally { u.weg(); }
});

test('Altpass bei kaputter Datenbank: zieht ins Journal um und bleibt beim Neustart vollständig', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    u.data.set(LEGACY_KEY, JSON.stringify({ discoveries: ['animal-elephant', 'space-moon'], chapters: {}, journeys: ['water'], favorites: ['space-moon'] }));
    const store = createProgressStore(); await store.start(); await warte(t, 5000);
    assert.deepEqual(imJournal(u.data).discoveries, ['animal-elephant', 'space-moon']);
    const neu = createProgressStore(); await neu.start();
    const p = neu.getSnapshot().save.progress;
    assert.deepEqual(p.discoveries, ['animal-elephant', 'space-moon']);
    assert.deepEqual(p.journeys, ['water']);
    assert.deepEqual(p.favorites, ['space-moon']);
  } finally { u.weg(); }
});

test('Laufende Änderungen verschieben die Wiederholung nicht für immer', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = createProgressStore(); await store.start(); await warte(t, 300);
    const vorher = idb.versuche;
    for (let i = 0; i < 20; i++) { store.update(p => ({ ...p, favorites: ['karte-' + i] })); await warte(t, 500); }
    const versuche = idb.versuche - vorher;
    // Ohne Schutz: entweder ein Versuch nach jeder Änderung (20) oder gar keiner mehr (die Pause wird immer neu gestartet).
    assert.ok(versuche >= 2 && versuche <= 8, `Versuche in 10 s: ${versuche}`);
    assert.deepEqual(imJournal(u.data).favorites, ['karte-19']);
  } finally { u.weg(); }
});

test('Neuerer Pass bleibt geschützt: keine Wiederholung, Hinweis bleibt sichtbar', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const neuer = JSON.stringify({ ...createSave(), schemaVersion: 4 });
    u.data.set(SAVE_KEY, neuer);
    const store = createProgressStore(); await store.start();
    const nachStart = idb.versuche;
    store.update(p => ({ ...p, favorites: ['animal-elephant'] }));
    await warte(t, 5000);
    assert.equal(idb.versuche, nachStart, 'kein Schreibversuch');
    assert.equal(u.data.get(SAVE_KEY), neuer, 'der neuere Pass ist unverändert');
    assert.match(store.getSnapshot().notice, /neuerer Pass/);
  } finally { u.weg(); }
});

test('Zurück im Tab: gleich ein neuer Versuch statt nach der langen Pause; beim Verlassen sofort', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = createProgressStore(); await store.start(); await warte(t, 8000);
    // Versuche bei 0,2 / 1,2 / 3,2 / 7,2 s, jetzt läuft eine Pause von 8 s.
    store.update(p => ({ ...p, favorites: ['space-moon'] }));
    const vorher = idb.versuche;
    await warte(t, 500);
    assert.equal(idb.versuche, vorher, 'in der Pause kein Versuch');
    u.doc.hidden = false; u.doc.listeners.visibilitychange();
    await warte(t, 300);
    const zurueck = idb.versuche;
    assert.ok(zurueck > vorher, 'nach der Rückkehr gleich ein Versuch');
    u.doc.hidden = true; u.doc.listeners.visibilitychange(); await ruhe();
    assert.ok(idb.versuche > zurueck, 'beim Verlassen sofort ein Versuch, ohne Pause');
    assert.deepEqual(imJournal(u.data).favorites, ['space-moon']);
  } finally { u.weg(); }
});

test('Ist auch der Browser-Speicher voll, bleibt die Pause kurz (höchstens 2 s)', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  idb.journalVoll = true;
  try {
    const store = createProgressStore(); await store.start();
    store.update(p => ({ ...p, favorites: ['space-moon'] }));
    const vorher = idb.versuche;
    await warte(t, 30_000);
    // Der Pass liegt nur im Arbeitsspeicher. Mit der langen Pause wären es in 30 s nur 5 Versuche, so etwa 16.
    const versuche = idb.versuche - vorher;
    assert.ok(versuche >= 12, `Versuche in 30 s: ${versuche}`);
    assert.equal(store.getSnapshot().storage, 'session');
    assert.deepEqual(store.getSnapshot().save.progress.favorites, ['space-moon'], 'im Arbeitsspeicher noch da');
  } finally { idb.journalVoll = false; u.weg(); }
});

test('Wird der Browser-Speicher erst während der langen Pause voll, kommt der nächste Versuch nach höchstens 2 s', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = createProgressStore(); await store.start(); await warte(t, 32_000);
    // Versuche bei 0,2 / 1,2 / 3,2 / 7,2 / 15,2 / 31,2 s, jetzt läuft eine Pause von 30 s.
    idb.journalVoll = true;
    store.update(p => ({ ...p, favorites: ['space-moon'] }));
    const vorher = idb.versuche;
    await warte(t, 2100);
    assert.ok(idb.versuche > vorher, 'neuer Versuch nach höchstens 2 s statt nach bis zu 30 s');
    assert.deepEqual(store.getSnapshot().save.progress.favorites, ['space-moon'], 'im Arbeitsspeicher noch da');
  } finally { idb.journalVoll = false; u.weg(); }
});

// Ab hier: Danach ist die Datenbank-Verbindung für diesen Prozess gemerkt.
test('Erholung: Sobald die Datenbank wieder geht, wird gespeichert und wieder kurz gesammelt', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  try {
    const store = createProgressStore(); await store.start(); await warte(t, 8000);
    store.update(p => ({ ...p, favorites: ['space-moon'] }));
    idb.modus = 'ok';
    await warte(t, 30_000);
    assert.deepEqual(idb.persisted?.progress.favorites, ['space-moon'], 'nach höchstens 30 s in der Datenbank');
    assert.equal(store.getSnapshot().storage, 'database');
    store.update(p => ({ ...p, favorites: ['space-moon', 'animal-elephant'] }));
    await warte(t, 300);
    assert.deepEqual(idb.persisted.progress.favorites, ['space-moon', 'animal-elephant'], 'danach wieder nach 200 ms');
  } finally { idb.modus = 'kaputt'; u.weg(); }
});

test('Schließt der Browser die Verbindung, öffnet der nächste Versuch sie neu (statt bis zum Neuladen zu scheitern)', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  idb.modus = 'ok';
  try {
    const store = createProgressStore(); await store.start(); await warte(t, 300);
    const vorher = idb.oeffnungen;
    idb.geschlossen = true;
    store.update(p => ({ ...p, favorites: ['history-maya'] }));
    await warte(t, 5000);
    assert.ok(idb.oeffnungen > vorher, 'Verbindung neu geöffnet');
    assert.deepEqual(idb.persisted?.progress.favorites, ['history-maya'], 'danach in der Datenbank');
    assert.equal(store.getSnapshot().storage, 'database');
    assert.deepEqual(imJournal(u.data).favorites, ['history-maya'], 'die ganze Zeit im Journal');
  } finally { idb.modus = 'kaputt'; idb.geschlossen = false; u.weg(); }
});

test('Meldet der Browser das Schließen (onclose), öffnet der nächste Versuch die Verbindung neu', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const u = umgebung();
  idb.modus = 'ok';
  try {
    const store = createProgressStore(); await store.start(); await warte(t, 300);
    const vorher = idb.oeffnungen;
    db.onclose?.();
    store.update(p => ({ ...p, favorites: ['animal-elephant'] }));
    await warte(t, 500);
    assert.ok(idb.oeffnungen > vorher, 'Verbindung neu geöffnet');
    assert.deepEqual(idb.persisted?.progress.favorites, ['animal-elephant']);
  } finally { idb.modus = 'kaputt'; u.weg(); }
});
