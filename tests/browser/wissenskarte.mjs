// Neue Wissenskarte (Phase 1, Teilschritt 2): Kopf, „Rate mal!“, Merken, heikle Karten, Vorlesen,
// Ausprobieren, Dazu passt und Bildnachweise.
// Jeder Fall mit Lernstand prüft auch den Pass nach Neuladen: Dort hängt der Lernstand der Kinder.
import assert from 'node:assert/strict';
import {ready, ladeanfragen} from './harness.mjs';
import {BROWSER_ERROR_FIELDS, browserErrorArrays, browserErrorsSettled, monitorBrowserErrors} from '../../scripts/browser-errors.mjs';
import {aufklapperErkennbar, bleibtGroesser, grosseSchriftWaechst, kontrast, schrift14, tippflaechen48, zeichenZeigtOffen} from './lesbarkeit.mjs';
import {angezeigteFrage, antwortKnopf, antworteRichtig, ersteFrageAufStufe, falscheAntworten, ganzEinfach, hauptfrage, karteDa, rateMal, richtigeAntwort, richtigerKnopf, stufeWaehlen, zeigtFrage, zusatzfragen, zusatzfragenAufStufe} from './karte-hilfen.mjs';
import catalog from '../../app/world-catalog.json' with {type: 'json'};
import {karteStufen} from './karte-stufen.mjs';
import photos from '../../app/world-photos.json' with {type: 'json'};
import verbindungen from '../../app/world-connections.json' with {type: 'json'};
import routen from '../../exports/content/world-routes.json' with {type: 'json'};
import fs from 'node:fs/promises';
import path from 'node:path';
await import('../../scripts/test-runtime.mjs');
const {createSave, emptyProgress, SAVE_KEY} = await import('../../app/progress-storage.ts');

const ELEFANT = catalog.find(t => t.id === 'animal-african-savanna-elephant');
const HEIKEL = catalog.find(t => t.id === 'history-holocaust');
const FOTOSYNTHESE = catalog.find(t => t.id === 'science-photosynthesis');
const GUTENBERG = catalog.find(t => t.id === 'person-johannes_gutenberg');
// Karte ohne Häppchen mit „Ganz einfach“ (nicht Person): Der Satz steht offen, die Absätze unter „Für Große“ (Teilschritt 3, E12).
const OHNE_HAEPPCHEN = catalog.find(t => t.id === 'science-buoyancy');
// Karte ohne Zusatzfragen: Nach dem Neuladen zeigt sie wieder die Hauptfrage (Pilot-Karten zeigen dann die nächste offene Frage).
const EINE_FRAGE = catalog.find(t => t.id === 'animal-lion');
// Karte mit großer Zeichnung im Kopf (Mondphasen) und Karte, deren Nachbarkachel diese Zeichnung zeigt (Apollo 11).
const MOND = catalog.find(t => t.id === 'science-moon-phases');
const APOLLO = catalog.find(t => t.id === 'history-apollo11');
const HANDY = {width: 390, height: 844, touch: true};
const BREIT = {width: 1440, height: 900};
const SCHMAL = {width: 320, height: 700, touch: true};
const ROUTE = routen[0];
// Route mit einer Pilot-Karte als erster Station (Elefant, mit Zusatzfragen).
const SAFARI = routen.find(r => r.id === 'safari');
const WARTEN = {timeout: 10000};

// Erklärte Verbindungen einer Karte in der Reihenfolge der Daten (wie connectionsFor in der App).
const verbindungenVon = id => verbindungen.connections
  .filter(c => c.fromId === id || c.toId === id)
  .map(c => ({...c, topic: c.fromId === id ? c.toId : c.fromId}));
const titelVon = id => catalog.find(t => t.id === id).title;

export async function wissenskarte(ctx) {
  for (const view of [HANDY, BREIT]) {
    await mitKarte(ctx, view, ELEFANT.id, karteOeffnenSchreibtBesuch);
    await mitKarte(ctx, view, EINE_FRAGE.id, richtigeAntwortSchreibtGelernt);
    await mitKarte(ctx, view, EINE_FRAGE.id, falscheAntwortOhneErklaerung);
    await mitKarte(ctx, view, ELEFANT.id, kapitelUndFuerGrosse);
    await mitKarte(ctx, view, ELEFANT.id, stimmtDas);
    await mitKarte(ctx, view, ELEFANT.id, nachDemTippenLesbar);
    await mitKarte(ctx, view, APOLLO.id, zeichnungInDazuPasstKompakt);
    await mitKarte(ctx, view, ELEFANT.id, merkenSchaltetFavoriten);
    await mitKarte(ctx, view, HEIKEL.id, heikleKarteFragtVorher);
    await mitKarte(ctx, view, ELEFANT.id, vorlesenLiestKopfUndFrage, vorleseAttrappe);
    await mitKarte(ctx, view, ELEFANT.id, dazuPasstHoechstensDrei);
    await mitKarte(ctx, view, ELEFANT.id, dazuPasstZurueck);
    await mitKarte(ctx, view, ELEFANT.id, dazuPasstZurueckOhneFokus);
    await mitKarte(ctx, view, ELEFANT.id, ausprobierenLaedtErstBeimOeffnen);
    await mitKarte(ctx, view, ELEFANT.id, bildnachweiseVollstaendig);
    await mitKarte(ctx, view, ELEFANT.id, lesbarFuerKinder);
    await mitKarte(ctx, view, ELEFANT.id, rueckwegZurWelt);
    await mitKarte(ctx, view, ELEFANT.id, rueckwegNachDazuPasst);
    await mitAdresse(ctx, view, 'world/route/' + ROUTE.id, eingebetteteKarte);
    await mitAdresse(ctx, view, 'world/route/' + SAFARI.id, pilotStation, passVorgeben(passMitFalscherHauptfrage()));
    ctx.report.checks.push(`Wissenskarte ${view.width}: Besuch im Pass, richtige Antwort schreibt „gelernt“ und Wiederholung, `
      + 'falsche Antwort ohne Erklärung, Merken an und aus, heikle Karte fragt vorher, Vorlesen liest Kopf und Frage (auch die Zusatzfrage nach „Noch eine Frage“) – jeweils auch nach Neuladen; '
      + 'Dazu passt mit höchstens drei Kacheln ohne related, Zurück führt nach beantworteter Frage zur Kachel, Ausprobieren lädt erst beim Öffnen, Bildnachweise vollständig; '
      + 'Aufklapper mit Zeichen, Tippflächen ab 48 px, Schrift ab 14 px, Buchstaben A/B/C mit Kontrast AA, „Größere Schrift“ vergrößert Frage und Einleitung; '
      + 'Rückweg direkt zur Welt und „Zurück“ nach Dazu passt; Routen-Station ohne Rückweg, richtige Antwort schaltet die nächste Station frei, '
      + 'auch an der Pilot-Station über eine Zusatzfrage; '
      + 'Häppchen mit Überschrift und „Für Große“ (zu, mit dem ersten Absatz); „Stimmt das?“ löst auf, speichert ohne „gelernt“, bleibt nach Neuladen; '
      + 'nach dem Tippen bleiben die übrigen Antworten unverblasst (Kontrast AA); Zeichnung als Nachbarkachel ohne Legende, so hoch wie eine Fotokachel');
  }
  // Teilschritt 3: Stufen auf der Karte (Wahl, Fragen je Stufe, Vorschläge).
  await karteStufen(ctx);
  await zusatzfrageImPass(ctx);
  await mitKarte(ctx, HANDY, ELEFANT.id, falscheHauptantwortBleibtOffen);
  ctx.report.checks.push('Pilot-Karte nach falscher Hauptantwort: zurück von der Nachbarkarte und über „Noch einmal nachdenken“ im Wissensbuch '
    + 'wieder die Hauptfrage mit „Noch nicht ganz …“, ohne Lösung und ohne neue Zusatzfrage; nach richtiger Antwort und Neuladen die erste Zusatzfrage');
  for (const view of [HANDY, BREIT]) await mitKarte(ctx, view, OHNE_HAEPPCHEN.id, ganzEinfachOffen);
  await mitKarte(ctx, HANDY, GUTENBERG.id, personOhneHaeppchen);
  ctx.report.checks.push(`„Ganz einfach“ ohne Häppchen (${OHNE_HAEPPCHEN.id}, 390 und 1440 px): offen, ohne Altersangabe, vor „Für Große“ (zu, mit dem ersten Absatz); `
    + `Person (${GUTENBERG.id}): Absätze offen, kein „Für Große“, der Satz oben in „Ausprobieren“`);
  const mitEinstieg = catalog.filter(t => t.chapters && t.learning);
  assert.ok(mitEinstieg.length > 0, 'es gibt Karten mit Häppchen und „Ganz einfach“');
  for (const t of mitEinstieg) await mitKarte(ctx, HANDY, t.id, einstiegImAusprobieren(t));
  ctx.report.checks.push(`„Ganz einfach“ bei ${mitEinstieg.length} Karten mit Häppchen: nicht in „Kurz erklärt“, sondern oben in „Ausprobieren“, `
    + 'sofort nach dem Öffnen und genau einmal');
  const hoehe = await mitKarte(ctx, HANDY, ELEFANT.id, karteHoeheHandy);
  ctx.report.checks.push(`Zusatzfrage: Pass mit beantworteter Hauptfrage zeigt rate-1, richtige Antwort schreibt Wiederholung und „gelernt“, „Noch eine Frage“ zeigt die nächste; `
    + `bleibt nach Neuladen, steht in der Sicherung und nach dem Einlesen im Pass, das Buch öffnet; offener Teil der Elefantenkarte bei 390 px ${hoehe} px (höchstens ${HOEHE_HANDY})`);
  await ausprobierenNochEinmal(ctx);
  ctx.report.checks.push('Ausprobieren nach Ladefehler: Noch einmal versuchen lädt Skript und Stil, ohne die Seite neu zu laden; '
    + 'Zurück nach jeder Kachel von Dazu passt fokussiert die Kachel auch ohne Fokus beim Antippen (wie Safari)');
  await mitKarte(ctx, SCHMAL, GUTENBERG.id, kennwortLesbar);
  const motivKarte = await motivkachel320(ctx);
  await mitKarte(ctx, HANDY, FOTOSYNTHESE.id, fotosyntheseZeichnungGestaltet);
  const mondKopf = [];
  for (const view of [SCHMAL, HANDY]) mondKopf.push(await mitKarte(ctx, view, MOND.id, zeichnungImKopfHandy));
  ctx.report.checks.push(`Kennwort auf dem Kartenbild ab 14 px; Motivkachel 320 px ohne Überlauf (${motivKarte}); Legende der Fotosynthese-Zeichnung gestaltet; `
    + `Mondzeichnung im Kartenkopf ${mondKopf.join(' / ')} px hoch (320 / 390 px, höchstens ${ZEICHNUNG_KOPF_HANDY})`);
}

// Frischer Kontext, Karte direkt per Link geöffnet. `fertig` wartet vor jedem Neuladen auf offene Anfragen,
// damit ein gewollter Seitenwechsel keine Ladefehler in der Überwachung erzeugt.
const mitKarte = (ctx, view, topicId, fn, initScript) => mitAdresse(ctx, view, 'world/topic/' + topicId, fn, initScript);

async function mitAdresse(ctx, {width, height, touch = false}, adresse, fn, initScript) {
  const context = await ctx.browser.newContext({
    viewport: {width, height},
    reducedMotion: 'reduce',
    ...(touch ? {hasTouch: true} : {}),
    ...(touch && ctx.engine === 'chromium' ? {isMobile: true} : {}),
  });
  try {
    if (initScript) await context.addInitScript(initScript);
    const page = await context.newPage();
    ctx.monitor(page);
    const fertig = ladeanfragen(page);
    await page.goto(new URL('#' + adresse, ctx.base).href);
    await ready(page);
    await page.locator('#world-topic-title').waitFor(WARTEN);
    const neuLaden = async () => {
      await fertig();
      await page.reload();
      await ready(page);
      await page.locator('#world-topic-title').waitFor(WARTEN);
    };
    return await fn(page, {neuLaden, touch});
  } finally {
    await context.close();
  }
}

const passLesen = page => page.evaluate(() => JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
const tippe = (ziel, touch) => (touch ? ziel.tap() : ziel.click());

async function karteOeffnenSchreibtBesuch(page, {neuLaden}) {
  await page.getByRole('heading', {name: ELEFANT.title, exact: true}).waitFor(WARTEN);
  assert.ok((await passLesen(page)).discoveries.includes('topic:' + ELEFANT.id), 'Öffnen schreibt den Besuch in den Pass');
  await neuLaden();
  assert.ok((await passLesen(page)).discoveries.includes('topic:' + ELEFANT.id), 'Besuch bleibt nach Neuladen');
}

async function richtigeAntwortSchreibtGelernt(page, {neuLaden, touch}) {
  assert.equal(zusatzfragen(EINE_FRAGE).length, 0, 'die Prüfkarte hat nur ihre Hauptfrage');
  await rateMal(page).getByRole('heading', {name: 'Rate mal!', exact: true}).waitFor(WARTEN);
  const {frage, knopf} = await richtigerKnopf(page, EINE_FRAGE);
  await tippe(knopf, touch);
  await rateMal(page).getByText('Richtig!', {exact: true}).waitFor(WARTEN);
  await rateMal(page).getByText(frage.question.why, {exact: true}).waitFor(WARTEN);
  await page.locator('.wissenskarte-gelernt').waitFor(WARTEN);
  const pass = await passLesen(page);
  assert.ok(pass.discoveries.includes('learned:' + EINE_FRAGE.id), 'richtige Antwort schreibt learned');
  assert.equal(pass.review[frage.reviewId]?.correct, true, 'richtige Antwort steht in der Wiederholung');
  await neuLaden();
  await zeigtFrage(page, EINE_FRAGE, frage);
  const knoepfe = rateMal(page).locator('.quiz-answer');
  assert.equal(await knoepfe.count(), frage.question.answers.length);
  for (const knopf of await knoepfe.all()) assert.equal(await knopf.isDisabled(), true, 'nach Neuladen bleiben die Antworten gesperrt');
  assert.ok((await passLesen(page)).discoveries.includes('learned:' + EINE_FRAGE.id), 'learned bleibt nach Neuladen');
  await page.locator('.wissenskarte-gelernt').waitFor(WARTEN);
}

async function falscheAntwortOhneErklaerung(page, {neuLaden, touch}) {
  const frage = await angezeigteFrage(page, EINE_FRAGE);
  const [falsch] = falscheAntworten(frage);
  await tippe(antwortKnopf(page, falsch), touch);
  await rateMal(page).getByText('Noch nicht ganz. Versuch es noch einmal!', {exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).getByText(frage.question.why, {exact: true}).count(), 0, 'keine Erklärung bei falscher Antwort');
  assert.ok(await rateMal(page).locator('.world-game-hint').count() > 0, 'der Hinweis bleibt erreichbar');
  assert.equal((await passLesen(page)).discoveries.includes('learned:' + EINE_FRAGE.id), false, 'falsche Antwort schreibt kein learned');
  await neuLaden();
  await zeigtFrage(page, EINE_FRAGE, frage);
  await rateMal(page).getByText('Noch nicht ganz. Versuch es noch einmal!', {exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).getByText(frage.question.why, {exact: true}).count(), 0, 'auch nach Neuladen keine Erklärung');
  assert.equal((await passLesen(page)).discoveries.includes('learned:' + EINE_FRAGE.id), false, 'auch nach Neuladen kein learned');
}

async function merkenSchaltetFavoriten(page, {neuLaden, touch}) {
  const merken = page.getByRole('button', {name: 'Merken', exact: true});
  await merken.waitFor(WARTEN);
  assert.equal(await merken.getAttribute('aria-pressed'), 'false');
  await tippe(merken, touch);
  await page.locator('button[aria-pressed="true"]', {hasText: 'Merken'}).waitFor(WARTEN);
  assert.ok((await passLesen(page)).favorites.includes('topic:' + ELEFANT.id), 'Merken schreibt den Favoriten');
  await neuLaden();
  assert.equal(await merken.getAttribute('aria-pressed'), 'true', 'Merken bleibt nach Neuladen an');
  assert.ok((await passLesen(page)).favorites.includes('topic:' + ELEFANT.id));
  await tippe(merken, touch);
  await page.locator('button[aria-pressed="false"]', {hasText: 'Merken'}).waitFor(WARTEN);
  assert.equal((await passLesen(page)).favorites.includes('topic:' + ELEFANT.id), false, 'zweiter Tipp nimmt den Favoriten heraus');
}

async function heikleKarteFragtVorher(page, {neuLaden, touch}) {
  await page.getByRole('button', {name: 'Die Erklärung anschauen', exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).count(), 0, 'vor der Entscheidung kein Inhalt');
  assert.equal(await page.locator('.world-short').count(), 0, 'vor der Entscheidung kein Text');
  await tippe(page.getByRole('button', {name: 'Die Erklärung anschauen', exact: true}), touch);
  await rateMal(page).getByRole('heading', {name: 'Rate mal!', exact: true}).waitFor(WARTEN);
  await page.locator('.world-short').waitFor(WARTEN);
  await neuLaden();
  await rateMal(page).getByRole('heading', {name: 'Rate mal!', exact: true}).waitFor(WARTEN);
  assert.equal(await page.getByRole('button', {name: 'Die Erklärung anschauen', exact: true}).count(), 0, 'die Entscheidung bleibt nach Neuladen');
}

// Ersetzt die Sprachausgabe des Browsers und merkt sich jeden vorgelesenen Text.
function vorleseAttrappe() {
  window.__vorgelesen = [];
  window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  Object.defineProperty(window, 'speechSynthesis', {value: {
    cancel() {}, addEventListener() {}, removeEventListener() {},
    getVoices() { return [{lang: 'de-DE', localService: true, voiceURI: 'test-lokal'}]; },
    speak(u) { window.__vorgelesen.push(u.text); queueMicrotask(() => u.onend?.()); },
  }});
}

// Vorlesen liest die Frage, die „Rate mal!“ gerade zeigt: zuerst die angezeigte, nach „Noch eine Frage“ die nächste.
async function vorlesenLiestKopfUndFrage(page, {touch}) {
  const vorlesen = async () => {
    const vorher = await page.evaluate(() => window.__vorgelesen.length);
    await tippe(page.locator('.wissenskarte-kopf').getByRole('button', {name: 'Vorlesen', exact: true}), touch);
    await page.waitForFunction(n => window.__vorgelesen.length > n, vorher, WARTEN);
    return (await page.evaluate(() => window.__vorgelesen)).at(-1);
  };
  // Teilschritt 3: Auf Entdecker hat der Elefant nur die Hauptfrage; Zusatzfragen gibt es auf Profi.
  await stufeWaehlen(page, 'profi', {touch});
  const erste = await angezeigteFrage(page, ELEFANT);
  const text = await vorlesen();
  for (const teil of [ELEFANT.title, ELEFANT.intro, erste.question.prompt, ...erste.question.answers]) assert.ok(text.includes(teil), 'Vorlesen enthält: ' + teil);
  await antworteRichtig(page, ELEFANT, {tippen: touch});
  await tippe(rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}), touch);
  await page.waitForFunction(id => document.querySelector('section.rate-mal')?.getAttribute('aria-labelledby') !== 'rate-mal-' + id, erste.id, WARTEN);
  const naechste = await angezeigteFrage(page, ELEFANT);
  assert.notEqual(naechste.id, erste.id, '„Noch eine Frage“ zeigt eine andere Frage');
  const neu = await vorlesen();
  for (const teil of [ELEFANT.title, naechste.question.prompt, ...naechste.question.answers]) assert.ok(neu.includes(teil), 'Vorlesen nach „Noch eine Frage“ enthält: ' + teil);
  assert.equal(neu.includes(erste.question.prompt), false, 'Vorlesen liest nicht mehr die vorige Frage');
}

const dazuPasst = page => page.locator('section.dazu-passt');

async function dazuPasstHoechstensDrei(page) {
  const alle = verbindungenVon(ELEFANT.id);
  const erste = alle[0];
  const bereich = dazuPasst(page);
  await bereich.getByRole('heading', {name: 'Dazu passt', exact: true}).waitFor(WARTEN);
  const kacheln = bereich.locator('.dazu-passt-kachel');
  const anzahl = await kacheln.count();
  assert.ok(anzahl >= 1 && anzahl <= 3, 'Dazu passt zeigt 1 bis 3 Kacheln, nicht ' + anzahl);
  const ersteKachel = kacheln.first();
  assert.equal(await ersteKachel.getAttribute('data-route-focus'), `world-connection-${ELEFANT.id}-${erste.topic}`);
  const text = await ersteKachel.textContent();
  assert.ok(text.includes(titelVon(erste.topic)), 'die erste Kachel nennt die Nachbarkarte');
  assert.ok(text.includes(erste.why), 'die erste Kachel nennt den Satz „warum“');
  const nurRelated = ELEFANT.related.filter(id => !alle.some(c => c.topic === id));
  assert.ok(nurRelated.length > 0, 'Testvoraussetzung: der Elefant hat einen Nachbarn nur in related');
  for (const id of nurRelated) {
    assert.equal(await page.locator(`[data-route-focus$="-${id}"]`).count(), 0, 'kein Knopf zu ' + id);
    assert.equal(await page.locator('.wissenskarte').getByText(titelVon(id), {exact: true}).count(), 0, 'related-Nachbar nicht zu sehen: ' + id);
  }
}

const kartenTitel = page => page.evaluate(() => document.getElementById('world-topic-title')?.getAttribute('aria-label'));

// Erst die Frage richtig beantworten, dann über die Kachel zur Nachbarkarte und zurück: Der Fokus liegt wieder auf
// der Kachel (nicht bei „Rate mal!“, das beim Zurückkommen seine nächste Frage wählt), „gelernt“ bleibt. Ohne Antwort prüfen das
// rueckwegNachDazuPasst und dazuPasstZurueckOhneFokus.
async function dazuPasstZurueck(page, {touch}) {
  await antworteRichtig(page, ELEFANT, {tippen: touch});
  const erste = verbindungenVon(ELEFANT.id)[0];
  const schluessel = `world-connection-${ELEFANT.id}-${erste.topic}`;
  const kachel = dazuPasst(page).locator(`[data-route-focus="${schluessel}"]`);
  await kachel.scrollIntoViewIfNeeded();
  await tippe(kachel, touch);
  await page.waitForFunction(t => document.getElementById('world-topic-title')?.getAttribute('aria-label') === t, titelVon(erste.topic), WARTEN);
  await page.goBack();
  await page.waitForFunction(t => document.getElementById('world-topic-title')?.getAttribute('aria-label') === t, ELEFANT.title, WARTEN);
  await page.waitForFunction(k => document.activeElement?.dataset?.routeFocus === k, schluessel, WARTEN);
  assert.equal(await kartenTitel(page), ELEFANT.title);
  const lage = await page.evaluate(() => {
    const r = document.activeElement.getBoundingClientRect();
    return {oben: r.top, unten: r.bottom, hoehe: innerHeight};
  });
  assert.ok(lage.oben >= 0 && lage.unten <= lage.hoehe, `die Kachel liegt im Bild (${JSON.stringify(lage)})`);
  assert.ok((await passLesen(page)).discoveries.includes('learned:' + ELEFANT.id), '„gelernt“ bleibt nach dem Rückweg');
  await angezeigteFrage(page, ELEFANT);
}

// Safari fokussiert Knöpfe beim Antippen nicht. Ein Klick per Skript tut das in keinem Browser; so prüft der Fall
// in Chromium und Firefox, dass die Kachel sich selbst fokussiert, bevor sie wechselt (dazu-passt.tsx, `wechsel`).
// Gilt für jede Kachel: Nachbarkarte, Globus, Link und Spiel haben je einen eigenen Fokus-Schlüssel.
async function dazuPasstZurueckOhneFokus(page) {
  const schluessel = await dazuPasst(page).locator('[data-route-focus]').evaluateAll(kacheln => kacheln.map(k => k.dataset.routeFocus));
  assert.ok(schluessel.length >= 2, 'mehrere Kacheln: ' + schluessel.join(', '));
  for (const k of schluessel) {
    const kachel = dazuPasst(page).locator(`[data-route-focus="${k}"]`);
    await kachel.scrollIntoViewIfNeeded();
    const vorher = await page.evaluate(() => location.hash);
    await kachel.evaluate(element => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      element.click();
    });
    await page.waitForFunction(h => location.hash !== h, vorher, WARTEN);
    await page.goBack();
    await page.waitForFunction(t => document.getElementById('world-topic-title')?.getAttribute('aria-label') === t, ELEFANT.title, WARTEN);
    await page.waitForFunction(f => document.activeElement?.dataset?.routeFocus === f, k, WARTEN)
      .catch(() => assert.fail('nach Zurück hat die Kachel den Fokus: ' + k));
  }
}

// Bricht das Netz ab, während „Ausprobieren“ sein Skript lädt, zeigt der Bereich einen Fehler. „Noch einmal versuchen“
// lädt Skript und Stil neu, ohne die Seite neu zu laden (ohne Netz und ohne Vorrat wäre die App dann weg).
// Ohne Service Worker, damit die Sperre greift; die Fehler der gesperrten Dateien sind erwartet, alle anderen zählen.
async function ausprobierenNochEinmal(ctx) {
  const context = await ctx.browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce', serviceWorkers: 'block'});
  const gesperrt = /\/assets\/bausteine-[^/]*\.(?:js|css)(?:\?|$)/;
  const beimSperren = browserErrorArrays(), danach = browserErrorArrays();
  let fehler = beimSperren;
  try {
    const page = await context.newPage();
    // Erst sammeln, dann je nach Phase einsortieren.
    const proof = browserErrorArrays();
    monitorBrowserErrors(page, ctx.base, proof, {engine: ctx.engine});
    // Erst offene Firefox-Bildabbrüche entscheiden lassen (browser-errors.mjs), dann nur die Fehlerfelder umfüllen.
    const umfuellen = async () => { await browserErrorsSettled(proof); for (const feld of BROWSER_ERROR_FIELDS) fehler[feld].push(...proof[feld].splice(0)); };
    let sperren = true;
    await page.route(gesperrt, route => (sperren ? route.abort() : route.fallback()));
    await page.goto(new URL('#world/topic/' + ELEFANT.id, ctx.base).href);
    await ready(page);
    await page.locator('#world-topic-title').waitFor(WARTEN);
    const ausprobieren = page.locator('details.wissenskarte-ausprobieren');
    await ausprobieren.locator('summary').click();
    const nochmal = ausprobieren.getByRole('button', {name: 'Noch einmal versuchen', exact: true});
    await nochmal.waitFor(WARTEN);
    assert.equal(await ausprobieren.locator('.wissenskarte-bausteine').count(), 0, 'ohne Skript kein Baustein');
    await page.evaluate(() => new Promise(fertig => requestAnimationFrame(() => setTimeout(fertig, 100))));
    await umfuellen();
    sperren = false;
    fehler = danach;
    const vorherNavigiert = await page.evaluate(() => performance.getEntriesByType('navigation').length);
    await nochmal.click();
    await ausprobieren.locator('.wissenskarte-bausteine').waitFor(WARTEN);
    await ausprobieren.locator('.animal-measure').waitFor({state: 'visible', ...WARTEN});
    assert.equal(await page.evaluate(() => performance.getEntriesByType('navigation').length), vorherNavigiert, 'ohne Neuladen');
    await page.waitForFunction(() => [...document.styleSheets].some(s => /\/bausteine-[^/]*\.css/.test(s.href ?? '')), null, WARTEN)
      .catch(() => assert.fail('der Stil der Bausteine ist geladen'));
    await umfuellen();
  } finally {
    await context.close();
  }
  // Beim Sperren: nur die gesperrten Dateien und die Meldung über den gescheiterten Import.
  for (const anfrage of beimSperren.failedRequests) assert.match(anfrage.url, gesperrt, 'nur gesperrte Dateien scheitern: ' + JSON.stringify(anfrage));
  for (const meldung of beimSperren.consoleErrors) {
    // Firefox gibt die Meldung von React über den abgefangenen Ladefehler nur als Klassennamen weiter („Error“).
    assert.match(meldung, /bausteine-|dynamically imported module|Importing a module script failed|Unable to preload CSS|Failed to load resource|^\[firefox\] (?:Type)?Error$/, 'erwartete Meldung: ' + meldung);
  }
  for (const feld of ['errors', 'ownHttpErrors', 'externalRequests']) assert.deepEqual(beimSperren[feld], [], feld + ' beim Sperren');
  assert.ok(beimSperren.failedRequests.length >= 1, 'die Sperre hat gegriffen');
  for (const [feld, liste] of Object.entries(danach)) assert.deepEqual(liste, [], feld + ' nach dem neuen Versuch');
}

const bausteinGeladen = page => page.evaluate(() => performance.getEntriesByType('resource').some(e => /\/bausteine-[^/]*\.js(?:\?|$)/.test(e.name)));

async function ausprobierenLaedtErstBeimOeffnen(page, {neuLaden, touch}) {
  const ausprobieren = page.locator('details.wissenskarte-ausprobieren');
  await ausprobieren.waitFor(WARTEN);
  assert.equal(await ausprobieren.evaluate(el => el.open), false, 'Ausprobieren ist zu Beginn zu');
  assert.equal(await bausteinGeladen(page), false, 'vor dem Öffnen lädt kein Baustein');
  assert.equal(await page.locator('.animal-measure').count(), 0, 'vor dem Öffnen steht kein Baustein auf der Seite');
  await tippe(ausprobieren.locator('summary'), touch);
  await ausprobieren.locator('.animal-measure').waitFor({state: 'visible', ...WARTEN});
  assert.equal(await bausteinGeladen(page), true, 'nach dem Öffnen ist der Baustein geladen');
  // Der Baustein speichert weiter unter dem Spielstand der Karte (topic:<id>), mit seinem alten Schlüssel.
  await tippe(ausprobieren.getByRole('button', {name: 'Einen Größenvergleich zeigen', exact: true}), touch);
  await ausprobieren.locator('.measure-bars').waitFor(WARTEN);
  assert.equal((await passLesen(page)).gameSessions['topic:' + ELEFANT.id]?.compareAnimal, true, 'Größenvergleich im Spielstand der Karte');
  await neuLaden();
  await tippe(page.locator('details.wissenskarte-ausprobieren > summary'), touch);
  await page.locator('details.wissenskarte-ausprobieren .measure-bars').waitFor(WARTEN);
}

async function bildnachweiseVollstaendig(page, {touch}) {
  const nachbar = catalog.find(t => t.id === verbindungenVon(ELEFANT.id)[0].topic);
  await dazuPasst(page).waitFor(WARTEN);
  const fotoIds = await page.locator('.wissenskarte [data-foto]').evaluateAll(els => els.map(el => el.dataset.foto));
  assert.ok(fotoIds.includes(ELEFANT.image) && fotoIds.includes(nachbar.image), 'Kopf- und Kachelfoto sind auf der Seite: ' + fotoIds.join(', '));
  const block = page.locator('details.bildnachweise');
  await block.locator('summary', {hasText: 'Bildnachweise auf dieser Seite'}).scrollIntoViewIfNeeded();
  await tippe(block.locator('summary'), touch);
  await block.locator('li').first().waitFor(WARTEN);
  const text = await block.textContent();
  for (const id of new Set(fotoIds)) {
    assert.ok(text.includes(photos[id].author), 'Urheber fehlt im Block: ' + id);
    assert.ok(text.includes(photos[id].license), 'Lizenz fehlt im Block: ' + id);
  }
}

// Gestaltungsregeln des Entwurfs auf der ganzen Karte (vor dem Öffnen von Ausprobieren, dessen Bausteine eigene Suiten haben).
async function lesbarFuerKinder(page) {
  const karte = page.locator('.wissenskarte');
  await dazuPasst(page).waitFor(WARTEN);
  await karte.locator('details.bildnachweise').waitFor(WARTEN);
  await aufklapperErkennbar(karte);
  await tippflaechen48(karte);
  await schrift14(karte);
  const buchstaben = rateMal(page).locator('.answer-letter');
  assert.ok(await buchstaben.count() >= 2, 'Antworten mit Buchstaben');
  for (const buchstabe of await buchstaben.all()) {
    const wert = await kontrast(buchstabe);
    assert.ok(wert >= 4.5, `Buchstabe ${await buchstabe.textContent()}: Kontrast ${wert.toFixed(2)}:1 unter 4,5:1`);
  }
  const mehr = karte.locator('details.wissenskarte-mehr');
  await zeichenZeigtOffen(mehr);
  await mehr.locator('.wissenskarte-mehr-inhalt .speech-button').first().waitFor(WARTEN);
  await tippflaechen48(mehr);
  await grosseSchriftWaechst(page, ['.wissenskarte .rate-mal-frage', '.wissenskarte-einleitung']);
  await bleibtGroesser(page, [['.wissenskarte .rate-mal-frage', '.wissenskarte .rate-mal .quiz-answer'], ['.wissenskarte-einleitung', '.wissenskarte .world-short > p']]);
}

// Nach dem Tippen bleiben die übrigen Antworten gut lesbar: Kinder lesen sie zum Vergleichen noch einmal.
// Vorher blasste die alte Regel button:disabled (Deckkraft 0,65) sie auf etwa 3,2:1 ab (Design-Prüfung 22.11.2026).
async function nachDemTippenLesbar(page, {touch}) {
  const {frage, knopf} = await richtigerKnopf(page, ELEFANT);
  await tippe(knopf, touch);
  await rateMal(page).getByText('Richtig!', {exact: true}).waitFor(WARTEN);
  const behauptung = ELEFANT.claims[0];
  const bereich = stimmtDasBereich(page);
  await tippe(bereich.getByRole('button', {name: behauptung.isTrue ? 'Stimmt' : 'Stimmt nicht', exact: true}), touch);
  await bereich.getByText(behauptung.explanation, {exact: true}).waitFor(WARTEN);
  const uebrige = [
    ...await rateMal(page).locator('.quiz-answer:not(.is-correct)').all(),
    bereich.getByRole('button', {name: behauptung.isTrue ? 'Stimmt nicht' : 'Stimmt', exact: true}),
  ];
  assert.equal(uebrige.length, frage.question.answers.length, 'alle nicht gewählten Antworten von „Rate mal!“ und der andere Knopf von „Stimmt das?“');
  for (const knopf of uebrige) {
    const name = (await knopf.innerText()).trim().replace(/\s+/g, ' ');
    assert.equal(await knopf.isDisabled(), true, `„${name}“ ist nach dem Tippen gesperrt`);
    const deckkraft = await knopf.evaluate(e => { let d = 1; for (let k = e; k; k = k.parentElement) d *= parseFloat(getComputedStyle(k).opacity); return d; });
    assert.equal(deckkraft, 1, `„${name}“ ist nach dem Tippen nicht abgeblasst (Deckkraft ${deckkraft})`);
    const wert = await kontrast(knopf);
    assert.ok(wert >= 4.5, `„${name}“: Kontrast ${wert.toFixed(2)}:1 unter 4,5:1`);
  }
}

// Eine Zeichnung als Nachbarkachel (Apollo 11 → Mondphasen): eine Reihe kleiner Bilder ohne Legende, höchstens so hoch
// wie eine Fotokachel (120 px am Handy, sonst 150 px). Die Legende steht auf der Karte mit der Zeichnung selbst;
// vorher war die Kachel mit Legende 171 px hoch (Design-Prüfung 22.11.2026).
async function zeichnungInDazuPasstKompakt(page) {
  assert.equal(verbindungenVon(APOLLO.id)[0]?.topic, MOND.id, 'die erste Verbindung von Apollo 11 führt zu den Mondphasen');
  const bild = dazuPasst(page).locator('.dazu-passt-bild').filter({has: page.locator('.topic-illustration')});
  await bild.waitFor(WARTEN);
  const masse = await bild.evaluate(e => ({
    hoehe: Math.round(e.getBoundingClientRect().height),
    legende: [...e.querySelectorAll('figcaption')].some(f => f.getBoundingClientRect().height > 0),
    handy: matchMedia('(max-width: 560px)').matches,
  }));
  const grenze = masse.handy ? 120 : 150;
  assert.equal(masse.legende, false, 'keine Legende in der Nachbarkachel');
  assert.ok(masse.hoehe <= grenze, `Zeichnung in der Nachbarkachel ${masse.hoehe} px hoch (höchstens ${grenze})`);
}

// Große Zeichnung im Kartenkopf (Mondphasen) am Handy: höchstens 400 px, damit Titel und „Rate mal!“ früh kommen
// (Design-Prüfung 22.11.2026: 587 px bei 390 px Breite). Die Namen der Phasen bleiben ganz lesbar.
const ZEICHNUNG_KOPF_HANDY = 400;
async function zeichnungImKopfHandy(page) {
  const bild = page.locator('.wissenskarte-kopf .kartenbild[data-bildart="zeichnung"]');
  await bild.waitFor(WARTEN);
  const masse = await bild.evaluate(e => ({
    hoehe: Math.round(e.getBoundingClientRect().height),
    namen: [...e.querySelectorAll('.topic-diagram-label')].map(l => ({text: l.textContent, sichtbar: l.getBoundingClientRect().height > 0, ganz: l.scrollWidth <= l.clientWidth})),
  }));
  assert.equal(masse.namen.length, 4, 'vier Phasen mit Namen');
  for (const name of masse.namen) assert.ok(name.sichtbar && name.ganz, `„${name.text}“ ist ganz zu sehen`);
  assert.ok(masse.hoehe <= ZEICHNUNG_KOPF_HANDY, `Zeichnung im Kartenkopf ${masse.hoehe} px hoch (höchstens ${ZEICHNUNG_KOPF_HANDY})`);
  return masse.hoehe;
}

// Kennwort auf dem Kartenbild (hier „Spätere Darstellung“ bei Gutenberg): mindestens 14 px wie aller Text.
async function kennwortLesbar(page) {
  const kopf = page.locator('.wissenskarte-kopf');
  await kopf.locator('.kartenbild-kennwort').waitFor(WARTEN);
  await schrift14(kopf);
}

// Längster Titel unter den Karten ohne Foto, deren Kopf die Motivkachel zeigt (Karten mit Zeichnung zählen nicht).
async function motivkachel320(ctx) {
  const kandidaten = catalog.filter(t => !t.image).sort((a, b) => b.title.length - a.title.length);
  for (const karte of kandidaten) {
    let gefunden = false;
    await mitKarte(ctx, SCHMAL, karte.id, async page => {
      const bild = page.locator('.wissenskarte-kopf .kartenbild');
      await bild.waitFor(WARTEN);
      if (await bild.getAttribute('data-bildart') !== 'motiv') return;
      gefunden = true;
      const masse = await page.evaluate(() => {
        const motivTitel = document.querySelector('.wissenskarte-kopf .kartenbild-motiv-titel');
        const titel = document.getElementById('world-topic-title');
        return {
          seite: document.documentElement.scrollWidth,
          motiv: [motivTitel.scrollWidth, motivTitel.clientWidth],
          titel: [titel.scrollWidth, titel.clientWidth],
        };
      });
      assert.ok(masse.seite <= 320, `${karte.id}: Seite breiter als 320 px (${masse.seite})`);
      assert.ok(masse.motiv[0] <= masse.motiv[1], `${karte.id}: Titel der Motivkachel abgeschnitten (${masse.motiv})`);
      assert.ok(masse.titel[0] <= masse.titel[1], `${karte.id}: Kartentitel abgeschnitten (${masse.titel})`);
    });
    if (gefunden) return karte.id;
  }
  assert.fail('Keine Karte mit Motivkachel gefunden');
}

async function fotosyntheseZeichnungGestaltet(page) {
  const rollen = page.locator('.photosynthesis-concept-roles');
  await rollen.waitFor(WARTEN);
  assert.equal(await rollen.evaluate(el => getComputedStyle(el).display), 'grid', 'die Legende der Zeichnung ist gestaltet (Stil der Zeichnung geladen)');
}

// Direkt geöffnet (frischer Kontext, kein Weg durch die App): Der Rückweg führt zur Welt der Karte.
async function rueckwegZurWelt(page, {touch}) {
  const rueckweg = page.locator('nav.karten-rueckweg');
  const link = rueckweg.getByRole('link', {name: 'Die Tierwelt', exact: true});
  await link.waitFor(WARTEN);
  assert.equal(await rueckweg.getByRole('link').count(), 1, 'genau ein Rückweg-Link');
  assert.match(await link.innerText(), /^←\s*Die Tierwelt$/, 'der Link zeigt den Pfeil und die Welt');
  assert.equal(await page.getByRole('button', {name: 'Alle Welten'}).count(), 0, 'die alte Kartenleiste ist weg');
  await tippe(link, touch);
  await page.waitForFunction(() => location.hash === '#world/animals', null, WARTEN);
  await page.locator('.world-topic-tile').first().waitFor(WARTEN);
}

// Über „Dazu passt“ gekommen: „← Zurück“ führt zur vorigen Karte, der Fokus liegt wieder auf der Kachel.
async function rueckwegNachDazuPasst(page, {touch}) {
  const erste = verbindungenVon(ELEFANT.id)[0];
  const schluessel = `world-connection-${ELEFANT.id}-${erste.topic}`;
  const kachel = dazuPasst(page).locator(`[data-route-focus="${schluessel}"]`);
  await kachel.scrollIntoViewIfNeeded();
  await tippe(kachel, touch);
  await page.waitForFunction(t => document.getElementById('world-topic-title')?.getAttribute('aria-label') === t, titelVon(erste.topic), WARTEN);
  const link = page.locator('nav.karten-rueckweg').getByRole('link', {name: 'Zurück', exact: true});
  await link.waitFor(WARTEN);
  assert.match(await link.innerText(), /^←\s*Zurück$/);
  await tippe(link, touch);
  await page.waitForFunction(t => document.getElementById('world-topic-title')?.getAttribute('aria-label') === t, ELEFANT.title, WARTEN);
  await page.waitForFunction(k => document.activeElement?.dataset?.routeFocus === k, schluessel, WARTEN);
}

// Karte als Station einer Lernroute: Titel h2, kein Rückweg; die richtige Antwort schreibt learned
// und schaltet die nächste Station frei.
async function eingebetteteKarte(page, {neuLaden, touch}) {
  const erste = catalog.find(t => t.id === ROUTE.topics[0]);
  const titel = page.locator('#world-topic-title');
  assert.equal(await titel.getAttribute('aria-label'), erste.title);
  assert.equal(await titel.evaluate(el => el.tagName), 'H2', 'in der Route ist der Kartentitel h2');
  assert.equal(await page.locator('nav.karten-rueckweg').count(), 0, 'die Station zeigt keinen Rückweg');
  const zweite = page.locator('details.world-route-stations .route-station-list button').nth(1);
  const weiter = page.locator('.route-next .primary-button');
  assert.equal(await zweite.isDisabled(), true, 'vor der richtigen Antwort ist die zweite Station gesperrt');
  assert.equal(await weiter.isDisabled(), true, 'vor der richtigen Antwort geht es nicht weiter');
  const {knopf} = await richtigerKnopf(page, erste);
  await tippe(knopf, touch);
  await rateMal(page).getByText('Richtig!', {exact: true}).waitFor(WARTEN);
  assert.ok((await passLesen(page)).discoveries.includes('learned:' + erste.id), 'richtige Antwort schreibt learned');
  assert.equal(await zweite.isDisabled(), false, 'die zweite Station ist frei');
  assert.equal(await weiter.isDisabled(), false, 'es geht weiter');
  await neuLaden();
  assert.equal(await zweite.isDisabled(), false, 'die zweite Station bleibt nach Neuladen frei');
}

// Ausgedachter Pass wie aus älteren Ständen: Die Hauptfrage der Elefantenkarte steht in der Wiederholung als falsch,
// eine Antwort auf der Karte ist nicht gespeichert, „gelernt“ fehlt.
function passMitFalscherHauptfrage() {
  const progress = emptyProgress();
  progress.review = {[hauptfrage(ELEFANT).reviewId]: {correct: false, seen: 1, due: '2000-01-01'}};
  // Teilschritt 3: Die Zusatzfragen des Elefanten sind Profi; die Station zeigt sie auf dieser Stufe.
  progress.gameSessions = {'kern:stufe': {stufe: 'profi', seit: '2026-11-23'}};
  return createSave(progress);
}

// Startskript, das einen Pass nur beim ersten Laden ablegt (nach dem Neuladen gilt, was die App gespeichert hat).
const passVorgeben = save => `if (!localStorage.getItem(${JSON.stringify(SAVE_KEY)})) localStorage.setItem(${JSON.stringify(SAVE_KEY)}, ${JSON.stringify(JSON.stringify(save))});`;

// Pilot-Karte als Station (Route „safari“, Elefant) mit passMitFalscherHauptfrage: Die Station zeigt eine Zusatzfrage
// (ersteFrage: eine neue vor der fälligen). Auch deren richtige Antwort schreibt „gelernt“ und schaltet die nächste Station frei;
// die Hauptfrage bleibt in der Wiederholung falsch.
async function pilotStation(page, {neuLaden, touch}) {
  assert.equal(SAFARI.topics[0], ELEFANT.id, 'Testvoraussetzung: die Route safari beginnt mit der Elefantenkarte');
  assert.equal(await page.locator('#world-topic-title').getAttribute('aria-label'), ELEFANT.title);
  const zweite = page.locator('details.world-route-stations .route-station-list button').nth(1);
  const weiter = page.locator('.route-next .primary-button');
  assert.equal(await zweite.isDisabled(), true, 'vor der richtigen Antwort ist die zweite Station gesperrt');
  assert.equal(await weiter.isDisabled(), true, 'vor der richtigen Antwort geht es nicht weiter');
  const haupt = hauptfrage(ELEFANT);
  const {frage, knopf} = await richtigerKnopf(page, ELEFANT);
  assert.notEqual(frage.id, haupt.id, 'die Station zeigt eine Zusatzfrage');
  await tippe(knopf, touch);
  await rateMal(page).getByText(frage.question.why, {exact: true}).waitFor(WARTEN);
  const pass = await passLesen(page);
  assert.ok(pass.discoveries.includes('learned:' + ELEFANT.id), 'die richtige Zusatzfrage schreibt learned');
  assert.equal(pass.review[frage.reviewId]?.correct, true, 'die Zusatzfrage steht in der Wiederholung');
  assert.equal(pass.review[haupt.reviewId]?.correct, false, 'die Hauptfrage bleibt in der Wiederholung falsch');
  assert.equal(await zweite.isDisabled(), false, 'die zweite Station ist frei');
  assert.equal(await weiter.isDisabled(), false, 'es geht weiter');
  await neuLaden();
  assert.equal(await zweite.isDisabled(), false, 'die zweite Station bleibt nach Neuladen frei');
}

// Aufgabe 11: Häppchen, „Für Große“, „Stimmt das?“ und Zusatzfragen der Pilot-Karten.
// Nutzerentscheid 22.11.2026: 3.100 px (Entwurf 6.3); mit „Stimmt das?“ und Zusatzfrage passt die Karte nicht mehr in 2.600 px.
const HOEHE_HANDY = 3100;
const kurzErklaert = page => page.locator('section.world-short');
const stimmtDasBereich = page => page.locator('section.stimmt-das');
const spielstand = async page => (await passLesen(page)).gameSessions['topic:' + ELEFANT.id] ?? {};

async function kapitelUndFuerGrosse(page) {
  const kurz = kurzErklaert(page);
  for (const kapitel of ELEFANT.chapters) {
    await kurz.getByRole('heading', {name: kapitel.question, exact: true}).waitFor(WARTEN);
    await kurz.getByText(kapitel.text, {exact: true}).waitFor({state: 'visible', ...WARTEN});
  }
  const gross = kurz.locator('details.wissenskarte-fuer-grosse');
  assert.equal(await gross.count(), 1, '„Für Große“ gibt es genau einmal');
  assert.equal((await gross.locator('summary').innerText()).trim(), 'Für Große');
  assert.equal(await gross.evaluate(d => d.open), false, '„Für Große“ ist zu Beginn zu');
  const absatz = gross.getByText(ELEFANT.paragraphs[0], {exact: true});
  assert.equal(await absatz.count(), 1, '„Für Große“ enthält den ersten Absatz unverändert');
  assert.equal(await absatz.isVisible(), false, 'der Absatz ist erst nach dem Öffnen zu sehen');
  await gross.locator('summary').click();
  await absatz.waitFor({state: 'visible', ...WARTEN});
}

// „Ganz einfach“ (learning.starter) bei Karten mit Häppchen: Die Häppchen sind die einfache Fassung, darum steht der
// Satz nicht in „Kurz erklärt“. Bei Personen ist er die Anleitung zum Versuch; er steht oben in „Ausprobieren“ und ist
// sofort nach dem Öffnen da, ohne auf den Baustein zu warten (große Prüfung, Aufgabe 13: vorher fehlte er ganz).
// Ort, „erst nach dem Öffnen“ und „genau einmal“ prüft ganzEinfach; `sofort` verlangt den Satz binnen 2 Sekunden.
const einstiegImAusprobieren = t => async (page, {touch}) => {
  const kurz = kurzErklaert(page);
  await kurz.getByRole('heading', {name: t.chapters[0].question, exact: true}).waitFor(WARTEN);
  assert.equal(await kurz.getByText('Ganz einfach', {exact: false}).count(), 0, t.id + ': kein „Ganz einfach“ in „Kurz erklärt“');
  await ganzEinfach(page.locator('.wissenskarte'), t, {sofort: true, touch});
};

// Teilschritt 3, E12: Ohne Häppchen steht „Ganz einfach“ offen und ohne Altersangabe vor „Für Große“; die Absätze sind zu.
// Ort und „genau einmal“ prüft ganzEinfach.
async function ganzEinfachOffen(page, {touch}) {
  const t = OHNE_HAEPPCHEN;
  assert.ok(t.learning?.starter && !t.chapters && t.category !== 'people', t.id + ': passende Testkarte');
  await ganzEinfach(page.locator('.wissenskarte'), t);
  const kurz = kurzErklaert(page);
  assert.equal(await kurz.getByText('etwa 6–8 Jahre', {exact: false}).count(), 0, 'keine Altersangabe');
  const gross = kurz.locator(':scope > details.wissenskarte-fuer-grosse');
  assert.equal(await gross.count(), 1, '„Für Große“ gibt es genau einmal');
  assert.equal(await gross.evaluate(d => d.open), false, '„Für Große“ ist zu Beginn zu');
  assert.equal(await kurz.evaluate(el => {
    const satz = el.querySelector(':scope > p.wissenskarte-ganz-einfach');
    const fuerGrosse = el.querySelector(':scope > details.wissenskarte-fuer-grosse');
    return Boolean(satz.compareDocumentPosition(fuerGrosse) & Node.DOCUMENT_POSITION_FOLLOWING);
  }), true, '„Ganz einfach“ steht vor „Für Große“');
  const absatz = gross.getByText(t.paragraphs[0], {exact: true});
  assert.equal(await absatz.isVisible(), false, 'die Absätze sind erst nach dem Öffnen zu sehen');
  await tippe(gross.locator(':scope > summary'), touch);
  await absatz.waitFor({state: 'visible', ...WARTEN});
}

// Personen: Der Satz ist meist die Anleitung zum Versuch; er steht oben in „Ausprobieren“, die Absätze bleiben offen.
async function personOhneHaeppchen(page, {touch}) {
  const t = GUTENBERG;
  const kurz = kurzErklaert(page);
  await kurz.getByText(t.paragraphs[0], {exact: true}).waitFor({state: 'visible', ...WARTEN});
  assert.equal(await kurz.locator('details.wissenskarte-fuer-grosse').count(), 0, 'Personen: kein „Für Große“, die Absätze stehen offen');
  await ganzEinfach(page.locator('.wissenskarte'), t, {sofort: true, touch});
}

async function stimmtDas(page, {neuLaden, touch}) {
  const behauptung = ELEFANT.claims[0];
  const bereich = stimmtDasBereich(page);
  await bereich.getByRole('heading', {name: 'Stimmt das?', exact: true}).waitFor(WARTEN);
  await bereich.getByText(behauptung.text, {exact: true}).waitFor(WARTEN);
  const aufloesung = behauptung.isTrue ? 'Das stimmt.' : 'Das stimmt nicht.';
  assert.equal(await bereich.getByText(behauptung.explanation, {exact: true}).count(), 0, 'die Auflösung kommt erst nach dem Tippen');
  // Absichtlich die falsche Wahl: Auch dann sagt die Auflösung klar, was stimmt,
  // und der passende Knopf ist markiert (Design-Prüfung 22.11.2026: vorher nur abgeblasst).
  const falsch = behauptung.isTrue ? 'Stimmt nicht' : 'Stimmt';
  const richtig = behauptung.isTrue ? 'Stimmt' : 'Stimmt nicht';
  const knoepfeMarkiert = async bereichJetzt => {
    const klasse = async name => (await bereichJetzt.getByRole('button', {name, exact: true}).getAttribute('class')) ?? '';
    assert.match(await klasse(falsch), /\bis-incorrect\b/, 'der getippte falsche Knopf ist als falsch markiert');
    assert.match(await klasse(richtig), /\bis-correct\b/, 'der passende Knopf ist als richtig markiert');
  };
  await tippe(bereich.getByRole('button', {name: falsch, exact: true}), touch);
  await bereich.getByText(aufloesung, {exact: true}).waitFor(WARTEN);
  await bereich.getByText(behauptung.explanation, {exact: true}).waitFor(WARTEN);
  await knoepfeMarkiert(bereich);
  assert.equal((await spielstand(page))['claim:' + behauptung.id], !behauptung.isTrue, 'die Wahl steht im Spielstand der Karte');
  const pass = await passLesen(page);
  assert.equal(pass.discoveries.includes('learned:' + ELEFANT.id), false, '„Stimmt das?“ schreibt kein „gelernt“');
  assert.deepEqual(Object.keys(pass.review), [], '„Stimmt das?“ schreibt nichts in die Wiederholung');
  await neuLaden();
  await stimmtDasBereich(page).getByText(aufloesung, {exact: true}).waitFor(WARTEN);
  await stimmtDasBereich(page).getByText(behauptung.explanation, {exact: true}).waitFor(WARTEN);
  await knoepfeMarkiert(stimmtDasBereich(page));
  assert.equal((await spielstand(page))['claim:' + behauptung.id], !behauptung.isTrue, 'die Wahl bleibt nach Neuladen');
}

// Ein ausgedachter Pass: Die Hauptfrage der Elefantenkarte ist schon beantwortet.
// Pilot-Karte mit falscher Hauptantwort (Schlussprüfung Teil B, W1): Wer zurückkommt, denkt an derselben Frage weiter,
// statt eine neue Zusatzfrage zu bekommen – zurück von der Nachbarkarte und über das Wissensbuch („Noch einmal nachdenken“).
async function falscheHauptantwortBleibtOffen(page, {neuLaden, touch}) {
  const haupt = await zeigtFrage(page, ELEFANT, hauptfrage(ELEFANT));
  const [falsch] = falscheAntworten(haupt);
  const richtig = richtigeAntwort(haupt);
  const titelIst = t => page.waitForFunction(x => document.getElementById('world-topic-title')?.getAttribute('aria-label') === x, t, WARTEN);
  const hauptfrageOffen = async wo => {
    await zeigtFrage(page, ELEFANT, haupt);
    await rateMal(page).getByText('Noch nicht ganz. Versuch es noch einmal!', {exact: true}).waitFor(WARTEN);
    assert.equal(await rateMal(page).getByText(haupt.question.why, {exact: true}).count(), 0, wo + ': keine Lösung');
    assert.equal(await antwortKnopf(page, richtig).isDisabled(), false, wo + ': neu wählen geht');
  };
  await tippe(antwortKnopf(page, falsch), touch);
  await hauptfrageOffen('nach der falschen Antwort');
  // Zur Nachbarkarte und zurück.
  const erste = verbindungenVon(ELEFANT.id)[0];
  const kachel = dazuPasst(page).locator(`[data-route-focus="world-connection-${ELEFANT.id}-${erste.topic}"]`);
  await kachel.scrollIntoViewIfNeeded();
  await tippe(kachel, touch);
  await titelIst(titelVon(erste.topic));
  await page.goBack();
  await titelIst(ELEFANT.title);
  await hauptfrageOffen('zurück von der Nachbarkarte');
  // Über das Wissensbuch: Die Karte steht dort unter „Ein Gedanke zum Wiederholen“.
  await page.evaluate(() => { location.hash = 'book/notes'; });
  const eintrag = page.locator('.knowledge-book article', {has: page.getByRole('heading', {name: ELEFANT.title, exact: true})});
  const nachdenken = eintrag.getByRole('button', {name: 'Noch einmal nachdenken', exact: true});
  await nachdenken.waitFor(WARTEN);
  await tippe(nachdenken, touch);
  await titelIst(ELEFANT.title);
  await hauptfrageOffen('über das Wissensbuch');
  let pass = await passLesen(page);
  assert.equal(pass.gameSessions['topic:' + ELEFANT.id]?.[haupt.answerKey], falsch, 'die falsche Antwort steht im Pass');
  assert.equal(pass.review[haupt.reviewId]?.correct, false, 'die Wiederholung kennt die falsche Antwort');
  for (const z of zusatzfragen(ELEFANT)) assert.equal(pass.review[z.reviewId], undefined, 'keine Zusatzfrage wurde gestellt: ' + z.id);
  // Jetzt richtig: Lösung und „gelernt“. Teilschritt 3, E16 (K7): Richtig nach falsch nimmt die Karte aus
  // „Ein Gedanke zum Wiederholen“ (morgen wieder fällig), zählt aber keine neue Wiederholung. Nach dem Neuladen die erste Zusatzfrage.
  const vorher = pass.review[haupt.reviewId];
  await tippe(antwortKnopf(page, richtig), touch);
  await rateMal(page).getByText(haupt.question.why, {exact: true}).waitFor(WARTEN);
  await page.waitForFunction(id => JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.review[id]?.correct === true, haupt.reviewId, WARTEN);
  pass = await passLesen(page);
  assert.ok(pass.discoveries.includes('learned:' + ELEFANT.id), 'richtige Antwort schreibt „gelernt“');
  const morgen = new Date(); morgen.setUTCDate(morgen.getUTCDate() + 1);
  assert.deepEqual(pass.review[haupt.reviewId], {correct: true, seen: vorher.seen, due: morgen.toISOString().slice(0, 10)}, 'richtig nach falsch: keine neue Wiederholung, morgen wieder dran');
  await neuLaden();
  // Dann wählt die Karte wie beim Öffnen (auf Entdecker hat der Elefant keine Zusatzfrage, also die fällige Hauptfrage).
  const nachher = await passLesen(page);
  await zeigtFrage(page, ELEFANT, ersteFrageAufStufe(ELEFANT, 'entdecker', nachher.review, nachher.gameSessions['topic:' + ELEFANT.id]));
}

function passMitHauptfrage() {
  const haupt = hauptfrage(ELEFANT);
  const progress = emptyProgress();
  progress.discoveries = ['topic:' + ELEFANT.id];
  progress.review = {[haupt.reviewId]: {correct: true, seen: 1, due: '2099-01-01'}};
  progress.gameSessions = {['topic:' + ELEFANT.id]: {[haupt.answerKey]: richtigeAntwort(haupt)}, 'kern:stufe': {stufe: 'profi', seit: '2026-11-23'}};
  return createSave(progress);
}

async function zusatzfrageImPass(ctx) {
  // Auf Profi (Pass oben): zuerst die Profi-Fragen in Datenreihenfolge.
  const [erste, zweite] = zusatzfragenAufStufe(ELEFANT, 'profi');
  const behauptung = ELEFANT.claims[0];
  const reviewId = erste.reviewId;
  let spielstandVorher;
  const optionen = {viewport: {width: HANDY.width, height: HANDY.height}, reducedMotion: 'reduce', hasTouch: true, ...(ctx.engine === 'chromium' ? {isMobile: true} : {})};
  const datei = path.join(ctx.shots, 'ausgedachter-pass-zusatzfrage.json');
  const context = await ctx.browser.newContext(optionen);
  try {
    await context.addInitScript(({key, save}) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(save)); }, {key: SAVE_KEY, save: passMitHauptfrage()});
    const page = await context.newPage();
    ctx.monitor(page);
    const fertig = ladeanfragen(page);
    await page.goto(new URL('#world/topic/' + ELEFANT.id, ctx.base).href);
    await ready(page);
    await zeigtFrage(page, ELEFANT, erste);
    await antwortKnopf(page, richtigeAntwort(erste)).tap();
    await rateMal(page).getByText('Richtig!', {exact: true}).waitFor(WARTEN);
    await rateMal(page).getByText(erste.question.why, {exact: true}).waitFor(WARTEN);
    let pass = await passLesen(page);
    assert.equal(pass.review[reviewId]?.correct, true, 'die Zusatzfrage steht in der Wiederholung');
    assert.equal(pass.review[hauptfrage(ELEFANT).reviewId]?.due, '2099-01-01', 'die Hauptfrage bleibt unverändert');
    assert.ok(pass.discoveries.includes('learned:' + ELEFANT.id), 'richtige Zusatzfrage schreibt „gelernt“');
    assert.equal(await rateMal(page).getByText(/\d+\s*(?:von|\/)\s*\d+/).count(), 0, 'kein Zähler');
    // Beide Knöpfe nach der Antwort in Antwortgröße (Design-Prüfung 22.11.2026). Eine alte globale Regel setzt
    // .speech-button am Handy mit !important auf 14 px; „Noch einmal raten“ ist so ein Knopf.
    for (const name of ['Noch eine Frage', 'Noch einmal raten']) {
      const groesse = await rateMal(page).getByRole('button', {name, exact: true}).evaluate(e => parseFloat(getComputedStyle(e).fontSize));
      assert.ok(groesse >= 18, `„${name}“ ist mindestens 18 px groß (ist ${groesse} px)`);
    }
    await rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}).tap();
    await zeigtFrage(page, ELEFANT, zweite);
    for (const knopf of await rateMal(page).locator('.quiz-answer').all()) assert.equal(await knopf.isDisabled(), false, 'die nächste Frage ist offen');
    await fertig();
    await page.reload();
    await ready(page);
    await zeigtFrage(page, ELEFANT, zweite);
    pass = await passLesen(page);
    assert.equal(pass.review[reviewId]?.correct, true, 'die Wiederholung bleibt nach Neuladen');
    assert.ok(pass.discoveries.includes('learned:' + ELEFANT.id), '„gelernt“ bleibt nach Neuladen');
    assert.equal(pass.gameSessions['topic:' + ELEFANT.id][erste.answerKey], richtigeAntwort(erste), 'die Antwort bleibt gespeichert');
    // Auch „Stimmt das?“ tippen: Sicherung und Einlesen müssen den ganzen Spielstand der Karte tragen
    // (Antworten, Antwort-Reihenfolgen, Wahl bei „Stimmt das?“), nicht nur Wiederholung und „gelernt“ (Code-Prüfung 22.11.2026).
    await stimmtDasBereich(page).getByRole('button', {name: 'Stimmt', exact: true}).tap();
    await stimmtDasBereich(page).getByText(behauptung.explanation, {exact: true}).waitFor(WARTEN);
    spielstandVorher = (await passLesen(page)).gameSessions['topic:' + ELEFANT.id];
    assert.equal(spielstandVorher['claim:' + behauptung.id], true, 'die Wahl bei „Stimmt das?“ steht im Spielstand');
    assert.ok(spielstandVorher[erste.itemsKey], 'die Antwort-Reihenfolge der Zusatzfrage steht im Spielstand');
    await page.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true}).click();
    const download = page.waitForEvent('download');
    await page.getByRole('button', {name: 'Entdeckerpass sichern', exact: true}).click();
    await (await download).saveAs(datei);
    await fertig();
  } finally {
    await context.close();
  }
  const sicherung = JSON.parse(await fs.readFile(datei, 'utf8'));
  assert.equal(sicherung.schemaVersion, 3);
  assert.equal(sicherung.progress.review[reviewId]?.correct, true, 'die Zusatzfrage steht in der Sicherung');
  assert.deepEqual(sicherung.progress.gameSessions['topic:' + ELEFANT.id], spielstandVorher, 'der ganze Spielstand der Karte steht in der Sicherung');
  const frisch = await ctx.browser.newContext(optionen);
  try {
    const page = await frisch.newPage();
    ctx.monitor(page);
    const fertig = ladeanfragen(page);
    await page.goto(ctx.base);
    await ready(page);
    await page.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true}).click();
    await page.locator('input[type=file]').setInputFiles(datei);
    await page.getByRole('button', {name: 'Pass wiederherstellen', exact: true}).click();
    await page.locator('.passport-dialog').waitFor({state: 'hidden', ...WARTEN});
    const pass = await passLesen(page);
    assert.equal(pass.review[reviewId]?.correct, true, 'nach dem Einlesen ist die Zusatzfrage im Pass');
    assert.ok(pass.discoveries.includes('learned:' + ELEFANT.id), 'nach dem Einlesen ist „gelernt“ im Pass');
    assert.deepEqual(pass.gameSessions['topic:' + ELEFANT.id], spielstandVorher, 'nach dem Einlesen ist der ganze Spielstand der Karte im Pass');
    // Die Karte nach dem Einlesen: Hauptfrage und erste Zusatzfrage gelten als beantwortet, also kommt die zweite;
    // „Stimmt das?“ zeigt die Auflösung.
    await page.evaluate(id => { location.hash = 'world/topic/' + id; }, ELEFANT.id);
    await karteDa(page, ELEFANT.id);
    await zeigtFrage(page, ELEFANT, zweite);
    await stimmtDasBereich(page).getByText(behauptung.explanation, {exact: true}).waitFor(WARTEN);
    await page.evaluate(() => { location.hash = 'book'; });
    await page.waitForFunction(() => document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value === '', null, WARTEN);
    await fertig();
  } finally {
    await frisch.close();
  }
}

// Der offene Teil (Kartenanfang bis Ende „Dazu passt“) bleibt auf dem Handy kurz genug.
async function karteHoeheHandy(page) {
  await dazuPasst(page).waitFor(WARTEN);
  const hoehe = await page.evaluate(() => {
    const karte = document.querySelector('article.wissenskarte').getBoundingClientRect();
    const ende = document.querySelector('section.dazu-passt').getBoundingClientRect();
    return Math.round(ende.bottom - karte.top);
  });
  assert.ok(hoehe <= HOEHE_HANDY, `offener Teil ${hoehe} px (höchstens ${HOEHE_HANDY})`);
  return hoehe;
}
