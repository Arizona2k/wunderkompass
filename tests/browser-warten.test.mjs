// Wächter für die Wartehilfe vor gewollten Seitenwechseln (ladeanfragen in tests/browser/harness.mjs).
// Bricht ein Neuladen oder Schließen ein Bild ab, das noch lädt, schlägt die Fehlerüberwachung an
// (Firefox: NS_BINDING_ABORTED). CI-Lauf 257: Das Korallenriff-Foto der Startseite startete erst, nachdem
// ein nachgeladener Programmteil fertig war und React den Bereich eingeblendet hatte. React 19 blendet
// nachgeladene Teile bis zu 300 ms gesammelt ein; die alte Ruhezeit von 250 ms war kürzer.
// Geprüft mit einer nachgebauten Seite, ohne Browser.
import assert from 'node:assert/strict';
import test from 'node:test';
import {ladeanfragen, RUHEZEIT} from './browser/harness.mjs';

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
