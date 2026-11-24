// Wächter für die Wartehilfe vor gewollten Seitenwechseln (scripts/seitenwechsel.mjs, ladeanfragen in tests/browser/harness.mjs).
// Bricht ein Neuladen oder Schließen ein Bild ab, das noch lädt, schlägt die Fehlerüberwachung an
// (Chromium: net::ERR_ABORTED, Firefox: NS_BINDING_ABORTED, WebKit: Load request cancelled). Ein Bild aus einem nachgeladenen Programmteil startet
// erst, wenn React den Bereich einblendet; React 19 blendet nachgeladene Teile bis zu 300 ms gesammelt ein, die alte
// Ruhezeit von 250 ms war kürzer. Seit dem 24.11.2026 warten reload, goto und close von selbst (Tests unten).
// Geprüft mit einer nachgebauten Seite, ohne Browser.
import assert from 'node:assert/strict';
import test from 'node:test';
import {ladeanfragen, RUHEZEIT} from './browser/harness.mjs';
import {beobachteAnfragen, installiere} from '../scripts/seitenwechsel.mjs';

// So lange hält React 19 das Einblenden nachgeladener Teile höchstens zurück (FALLBACK_THROTTLE_MS).
const REACT_SAMMELZEIT = 300;

function nachgebauteSeite({beimZeichnen, zeichnen} = {}) {
  const handler = {};
  const seite = {
    on: (name, fn) => { (handler[name] ??= []).push(fn); },
    waitForTimeout: ms => new Promise(r => setTimeout(r, ms)),
    // Zwei Bildwechsel der Seite: Dabei entscheidet der Browser, ob ein loading="lazy"-Bild jetzt lädt.
    evaluate: async () => {
      seite.versucht++;
      if (zeichnen) return zeichnen(seite.versucht);
      seite.gezeichnet++; beimZeichnen?.(); await new Promise(r => setTimeout(r, 20));
    },
    isClosed: () => false,
    gezeichnet: 0,
    versucht: 0,
  };
  const sende = (name, anfrage) => handler[name]?.forEach(fn => fn(anfrage));
  const anfrage = (typ, url) => ({resourceType: () => typ, isNavigationRequest: () => false, url: () => url});
  return {seite, sende, anfrage};
}
const warte = ms => new Promise(r => setTimeout(r, ms));

test('wartet auf ein Bild, das React bis zu 300 ms nach dem Programmteil einblendet', async () => {
  assert.ok(RUHEZEIT >= REACT_SAMMELZEIT + 200, 'die Ruhezeit braucht Reserve über Reacts Sammelzeit');
  const {seite, sende, anfrage} = nachgebauteSeite();
  const fertig = ladeanfragen(seite);
  const programmteil = anfrage('script', 'http://127.0.0.1/assets/discovery-topic-media.js');
  const bild = anfrage('image', 'http://127.0.0.1/photos/reef.jpg');
  let bildFertig = 0, zurueck = 0;
  sende('request', programmteil);
  setTimeout(() => sende('requestfinished', programmteil), 30);
  setTimeout(() => sende('request', bild), 30 + 290);
  setTimeout(() => { sende('requestfinished', bild); bildFertig = Date.now(); }, 30 + 290 + 60);
  await warte(40);
  await fertig();
  zurueck = Date.now();
  assert.ok(bildFertig, 'die Wartehilfe kam zurück, bevor das spät eingeblendete Bild überhaupt startete');
  assert.ok(zurueck >= bildFertig, 'die Wartehilfe kam zurück, während das Bild noch lud');
});

test('beginnt die Ruhezeit nach jeder Anfrage neu, auch nach einer, die zwischen zwei Prüfungen startet und endet', async () => {
  const {seite, sende, anfrage} = nachgebauteSeite();
  const fertig = ladeanfragen(seite);
  const daten = anfrage('fetch', 'http://127.0.0.1/world-photos.json');
  const bild = anfrage('image', 'http://127.0.0.1/world/elefant.webp');
  let bildFertig = 0;
  // Die Daten kommen kurz vor Ende der Ruhezeit schnell aus dem Zwischenspeicher (5 ms, zwischen zwei
  // Prüfungen im 50-ms-Takt); ihr Bild erscheint erst danach. Zählte die Ruhezeit nur ab dem Aufruf,
  // käme die Wartehilfe vor dem Bild zurück.
  const daten0 = RUHEZEIT - 200;
  setTimeout(() => sende('request', daten), daten0);
  setTimeout(() => sende('requestfinished', daten), daten0 + 5);
  setTimeout(() => sende('request', bild), daten0 + 5 + REACT_SAMMELZEIT - 10);
  setTimeout(() => { sende('requestfinished', bild); bildFertig = Date.now(); }, daten0 + 5 + REACT_SAMMELZEIT + 30);
  await fertig();
  assert.ok(bildFertig && Date.now() >= bildFertig, 'die Ruhezeit muss nach jeder Anfrage neu beginnen');
});

test('wartet zum Schluss zwei Bildwechsel der Seite ab und zählt Bilder, die dabei starten', async () => {
  let bild;
  const {seite, sende, anfrage} = nachgebauteSeite({
    beimZeichnen: () => {
      if (bild) return;
      bild = anfrage('image', 'http://127.0.0.1/photos/reef.jpg');
      sende('request', bild);
      setTimeout(() => sende('requestfinished', bild), 80);
    },
  });
  const fertig = ladeanfragen(seite);
  await fertig();
  assert.ok(seite.gezeichnet >= 2, 'nach dem Bild, das beim Zeichnen startete, muss noch einmal gezeichnet werden');
  assert.ok(bild, 'die Seite wurde nie gezeichnet');
});

test('nennt nach dem Zeitlimit die offenen Anfragen', async () => {
  const {seite, sende, anfrage} = nachgebauteSeite();
  const fertig = ladeanfragen(seite, {timeout: 300});
  sende('request', anfrage('image', 'http://127.0.0.1/photos/haengt.jpg'));
  await assert.rejects(fertig(), /noch vor dem gewollten Seitenwechsel: http:\/\/127\.0\.0\.1\/photos\/haengt\.jpg/);
});

test('zeichnet nach einem Dokumentwechsel noch einmal, bevor sie freigibt', async () => {
  const {seite} = nachgebauteSeite({
    zeichnen: async versuch => {
      if (versuch === 1) throw Error('Execution context was destroyed, most likely because of a navigation');
      seite.gezeichnet++;
    },
  });
  await ladeanfragen(seite)();
  assert.equal(seite.gezeichnet, 1, 'nach dem abgebrochenen Zeichnen muss die Seite noch einmal zeichnen');
});

test('bricht mit klarer Meldung ab, wenn die Seite nicht mehr zeichnet', {timeout: 5000}, async () => {
  const {seite} = nachgebauteSeite({zeichnen: () => new Promise(() => {})});
  await assert.rejects(ladeanfragen(seite, {timeout: RUHEZEIT + 400})(), /nicht zur Ruhe gekommen/);
});

// Automatische Wartepunkte: nachgebaute Playwright-Klassen, je Test frisch, damit installiere() sie neu einhängen kann.
// Die Ruhezeit ist hier kürzer (KURZ), damit der Wächter schnell bleibt; die echte prüfen die Tests oben.
const KURZ = 100;
function nachgebauteKlassen() {
  const protokoll = [];
  class Kontext {
    constructor() { this.seiten = []; this.routen = []; }
    pages() { return this.seiten; }
    async close() { protokoll.push('kontext geschlossen'); for (const seite of this.seiten) seite.geschlossen = true; }
    async route(url, handler) { this.routen.push(handler); }
    async unroute(url, handler) { this.routen = this.routen.filter(h => h !== handler); }
    async newPage() { const seite = new Seite(); this.seiten.push(seite); return seite; }
  }
  class Seite {
    constructor(adresse = 'http://127.0.0.1/') { this.adresse = adresse; this.handler = {}; this.geschlossen = false; }
    on(name, fn) { (this.handler[name] ??= []).push(fn); }
    sende(name, anfrage) { this.handler[name]?.forEach(fn => fn(anfrage)); }
    waitForTimeout(ms) { return new Promise(r => setTimeout(r, ms)); }
    async evaluate() { await new Promise(r => setTimeout(r, 10)); }
    isClosed() { return this.geschlossen; }
    url() { return this.adresse; }
    async reload() { protokoll.push('neu geladen'); }
    async goto(url) { protokoll.push('goto ' + url); this.adresse = url; }
    async close() { protokoll.push('geschlossen'); this.geschlossen = true; }
    async route(url, handler) { (this.routen ??= []).push(handler); }
    async unroute(url, handler) { this.routen = this.routen.filter(h => h !== handler); }
  }
  installiere(Kontext.prototype, Seite.prototype);
  return {Kontext, Seite, protokoll};
}
const bild = url => ({resourceType: () => 'image', isNavigationRequest: () => false, url: () => url});

test('reload wartet von selbst, bis eine laufende Anfrage fertig ist', async () => {
  const {Seite, protokoll} = nachgebauteKlassen();
  const seite = new Seite();
  beobachteAnfragen(seite, {proof: {errors: []}, ruhezeit: KURZ});
  const anfrage = bild('http://127.0.0.1/world/elefant.webp');
  seite.sende('request', anfrage);
  let fertig = 0;
  setTimeout(() => { seite.sende('requestfinished', anfrage); fertig = Date.now(); }, 200);
  await seite.reload();
  assert.ok(fertig && fertig <= Date.now(), 'reload kam, bevor das Bild fertig war');
  assert.deepEqual(protokoll, ['neu geladen']);
});

test('eine Anfrage, die ein route-Handler des Tests festhält, hält das Neuladen nicht auf', async () => {
  const {Kontext, Seite, protokoll} = nachgebauteKlassen();
  const kontext = new Kontext(), seite = new Seite();
  kontext.seiten.push(seite);
  const proof = {errors: []};
  beobachteAnfragen(seite, {proof, timeout: 1500, ruhezeit: KURZ});
  let freigeben;
  const halten = async eingriff => { await new Promise(r => { freigeben = r; }); return eingriff; };
  await kontext.route('**/held', halten);
  const anfrage = bild('http://127.0.0.1/held');
  seite.sende('request', anfrage);
  const behandelt = kontext.routen[0]({request: () => anfrage});
  await seite.reload();
  assert.deepEqual(proof.errors, [], 'auf eine festgehaltene Anfrage darf niemand warten');
  assert.deepEqual(protokoll, ['neu geladen']);
  freigeben();
  await behandelt;
  await kontext.unroute('**/held', halten);
  assert.equal(kontext.routen.length, 0, 'unroute muss den gehüllten Handler finden');
});

test('kommt die Seite vor dem Schließen nicht zur Ruhe, steht das im Bericht, und sie schließt trotzdem', async () => {
  const {Seite, protokoll} = nachgebauteKlassen();
  const seite = new Seite();
  const proof = {errors: []};
  beobachteAnfragen(seite, {proof, tag: '[chromium] ', timeout: 300});
  seite.sende('request', bild('http://127.0.0.1/photos/haengt.jpg'));
  await seite.close();
  assert.deepEqual(protokoll, ['geschlossen']);
  assert.equal(proof.errors.length, 1);
  assert.match(proof.errors[0], /^\[chromium\] Vor dem gewollten Seitenwechsel \(Schließen\): Anfragen laufen noch .*haengt\.jpg/);
});

test('der erste goto einer frischen Seite wartet nicht, ein späterer schon', async () => {
  const {Seite} = nachgebauteKlassen();
  const seite = new Seite('about:blank');
  beobachteAnfragen(seite, {proof: {errors: []}, ruhezeit: KURZ});
  let start = Date.now();
  await seite.goto('http://127.0.0.1/');
  assert.ok(Date.now() - start < KURZ, 'eine leere Seite hat nichts abzubrechen');
  start = Date.now();
  await seite.goto('http://127.0.0.1/#updates');
  assert.ok(Date.now() - start >= KURZ, 'eine geladene Seite wartet die Ruhezeit ab');
});

test('context.close wartet auf jede überwachte Seite des Kontexts', async () => {
  const {Kontext, Seite, protokoll} = nachgebauteKlassen();
  const kontext = new Kontext(), a = new Seite(), b = new Seite();
  kontext.seiten.push(a, b);
  beobachteAnfragen(a, {proof: {errors: []}, ruhezeit: KURZ});
  beobachteAnfragen(b, {proof: {errors: []}, ruhezeit: KURZ});
  const anfrage = bild('http://127.0.0.1/world/eisbaer.webp');
  b.sende('request', anfrage);
  let fertig = 0;
  setTimeout(() => { b.sende('requestfinished', anfrage); fertig = Date.now(); }, 200);
  await kontext.close();
  assert.ok(fertig, 'der Kontext schloss, während auf der zweiten Seite noch ein Bild lud');
  assert.deepEqual(protokoll, ['kontext geschlossen']);
});

test('Schließen wartet auf laufende Anfragen, aber ohne feste Ruhezeit', async () => {
  const {Seite} = nachgebauteKlassen();
  const ruhig = new Seite();
  beobachteAnfragen(ruhig, {proof: {errors: []}});
  const fertigeAnfrage = bild('http://127.0.0.1/world/elefant.webp');
  ruhig.sende('request', fertigeAnfrage);
  ruhig.sende('requestfinished', fertigeAnfrage);
  let start = Date.now();
  await ruhig.close();
  assert.ok(Date.now() - start < RUHEZEIT, 'ohne laufende Anfrage schließt die Seite nach zwei Bildwechseln');
  const ladend = new Seite();
  beobachteAnfragen(ladend, {proof: {errors: []}});
  const anfrage = bild('http://127.0.0.1/world/eisbaer.webp');
  ladend.sende('request', anfrage);
  let fertig = 0;
  setTimeout(() => { ladend.sende('requestfinished', anfrage); fertig = Date.now(); }, 200);
  start = Date.now();
  await ladend.close();
  assert.ok(fertig && fertig <= Date.now(), 'eine laufende Anfrage wird vor dem Schließen fertig');
});

test('nach dem ersten Zeitlimit wartet dieselbe Seite nicht noch einmal (ein Fehler im Bericht reicht)', async () => {
  const {Seite, protokoll} = nachgebauteKlassen();
  const seite = new Seite();
  const proof = {errors: []};
  beobachteAnfragen(seite, {proof, timeout: 300, ruhezeit: KURZ});
  seite.sende('request', bild('http://127.0.0.1/photos/haengt.jpg'));
  await seite.reload();
  const start = Date.now();
  await seite.reload();
  await seite.close();
  assert.ok(Date.now() - start < 200, 'nach dem ersten Scheitern darf kein Wartepunkt mehr das Zeitlimit abwarten');
  assert.equal(proof.errors.length, 1);
  assert.deepEqual(protokoll, ['neu geladen', 'neu geladen', 'geschlossen']);
});

test('jede neue Seite wird gleich beobachtet; der Bericht kommt mit der Überwachung nach, samt Browser-Name', async () => {
  const {Kontext} = nachgebauteKlassen();
  const seite = await new Kontext().newPage();
  const anfrage = bild('http://127.0.0.1/world/elefant.webp');
  seite.sende('request', anfrage);
  let fertig = 0;
  setTimeout(() => { seite.sende('requestfinished', anfrage); fertig = Date.now(); }, 150);
  beobachteAnfragen(seite, {ruhezeit: KURZ});
  await seite.reload();
  assert.ok(fertig && fertig <= Date.now(), 'auch ohne Überwachung wartet reload auf eine Anfrage, die vor der Überwachung startete');
  const proof = {errors: []};
  beobachteAnfragen(seite, {proof, tag: '[webkit] ', timeout: 300});
  seite.sende('request', bild('http://127.0.0.1/photos/haengt.jpg'));
  await seite.close();
  assert.match(proof.errors[0] ?? '', /^\[webkit\] Vor dem gewollten Seitenwechsel \(Schließen\)/);
});
