// Neue Wissenskarte (Phase 1, Teilschritt 2): Kopf, „Rate mal!“, Merken, heikle Karten, Vorlesen,
// Ausprobieren, Dazu passt und Bildnachweise.
// Jeder Fall mit Lernstand prüft auch den Pass nach Neuladen: Dort hängt der Lernstand der Kinder.
import assert from 'node:assert/strict';
import {ready, ladeanfragen} from './harness.mjs';
import {browserErrorArrays, monitorBrowserErrors} from '../../scripts/browser-errors.mjs';
import {aufklapperErkennbar, bleibtGroesser, grosseSchriftWaechst, kontrast, schrift14, tippflaechen48, zeichenZeigtOffen} from './lesbarkeit.mjs';
import catalog from '../../app/world-catalog.json' with {type: 'json'};
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
// Karte ohne Zusatzfragen: Nach dem Neuladen zeigt sie wieder die Hauptfrage (Pilot-Karten zeigen dann die nächste offene Frage).
const EINE_FRAGE = catalog.find(t => t.id === 'animal-lion');
const HANDY = {width: 390, height: 844, touch: true};
const BREIT = {width: 1440, height: 900};
const SCHMAL = {width: 320, height: 700, touch: true};
const ROUTE = routen[0];
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
    ctx.report.checks.push(`Wissenskarte ${view.width}: Besuch im Pass, richtige Antwort schreibt „gelernt“ und Wiederholung, `
      + 'falsche Antwort ohne Erklärung, Merken an und aus, heikle Karte fragt vorher, Vorlesen liest Kopf und Frage – jeweils auch nach Neuladen; '
      + 'Dazu passt mit höchstens drei Kacheln ohne related, Zurück führt zur Kachel, Ausprobieren lädt erst beim Öffnen, Bildnachweise vollständig; '
      + 'Aufklapper mit Zeichen, Tippflächen ab 48 px, Schrift ab 14 px, Buchstaben A/B/C mit Kontrast AA, „Größere Schrift“ vergrößert Frage und Einleitung; '
      + 'Rückweg direkt zur Welt und „Zurück“ nach Dazu passt; Routen-Station ohne Rückweg, richtige Antwort schaltet die nächste Station frei; '
      + 'Häppchen mit Überschrift und „Für Große“ (zu, mit dem ersten Absatz); „Stimmt das?“ löst auf, speichert ohne „gelernt“, bleibt nach Neuladen');
  }
  await zusatzfrageImPass(ctx);
  const hoehe = await mitKarte(ctx, HANDY, ELEFANT.id, karteHoeheHandy);
  ctx.report.checks.push(`Zusatzfrage: Pass mit beantworteter Hauptfrage zeigt rate-1, richtige Antwort schreibt Wiederholung und „gelernt“, „Noch eine Frage“ zeigt die nächste; `
    + `bleibt nach Neuladen, steht in der Sicherung und nach dem Einlesen im Pass, das Buch öffnet; offener Teil der Elefantenkarte bei 390 px ${hoehe} px (höchstens ${HOEHE_HANDY})`);
  await ausprobierenNochEinmal(ctx);
  ctx.report.checks.push('Ausprobieren nach Ladefehler: Noch einmal versuchen lädt Skript und Stil, ohne die Seite neu zu laden; '
    + 'Zurück nach jeder Kachel von Dazu passt fokussiert die Kachel auch ohne Fokus beim Antippen (wie Safari)');
  await mitKarte(ctx, SCHMAL, GUTENBERG.id, kennwortLesbar);
  const motivKarte = await motivkachel320(ctx);
  await mitKarte(ctx, HANDY, FOTOSYNTHESE.id, fotosyntheseZeichnungGestaltet);
  ctx.report.checks.push(`Kennwort auf dem Kartenbild ab 14 px; Motivkachel 320 px ohne Überlauf (${motivKarte}); Legende der Fotosynthese-Zeichnung gestaltet`);
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
const rateMal = page => page.locator('section.world-mini-question');
const antwortKnopf = (page, text) => rateMal(page).locator('.quiz-answer').filter({has: page.getByText(text, {exact: true})});
const tippe = (ziel, touch) => (touch ? ziel.tap() : ziel.click());

async function karteOeffnenSchreibtBesuch(page, {neuLaden}) {
  await page.getByRole('heading', {name: ELEFANT.title, exact: true}).waitFor(WARTEN);
  assert.ok((await passLesen(page)).discoveries.includes('topic:' + ELEFANT.id), 'Öffnen schreibt den Besuch in den Pass');
  await neuLaden();
  assert.ok((await passLesen(page)).discoveries.includes('topic:' + ELEFANT.id), 'Besuch bleibt nach Neuladen');
}

async function richtigeAntwortSchreibtGelernt(page, {neuLaden, touch}) {
  assert.equal(EINE_FRAGE.moreQuestions, undefined, 'die Prüfkarte hat nur ihre Hauptfrage');
  const q = EINE_FRAGE.question;
  await rateMal(page).getByRole('heading', {name: 'Rate mal!', exact: true}).waitFor(WARTEN);
  await tippe(antwortKnopf(page, q.answers[q.correct]), touch);
  await rateMal(page).getByText('Passende Antwort gewählt.', {exact: true}).waitFor(WARTEN);
  await rateMal(page).getByText(q.why, {exact: true}).waitFor(WARTEN);
  await page.locator('.wissenskarte-gelernt').waitFor(WARTEN);
  const pass = await passLesen(page);
  assert.ok(pass.discoveries.includes('learned:' + EINE_FRAGE.id), 'richtige Antwort schreibt learned');
  assert.equal(pass.review['world-question:' + EINE_FRAGE.id]?.correct, true, 'richtige Antwort steht in der Wiederholung');
  await neuLaden();
  const knoepfe = rateMal(page).locator('.quiz-answer');
  assert.equal(await knoepfe.count(), q.answers.length);
  for (const knopf of await knoepfe.all()) assert.equal(await knopf.isDisabled(), true, 'nach Neuladen bleiben die Antworten gesperrt');
  assert.ok((await passLesen(page)).discoveries.includes('learned:' + EINE_FRAGE.id), 'learned bleibt nach Neuladen');
  await page.locator('.wissenskarte-gelernt').waitFor(WARTEN);
}

async function falscheAntwortOhneErklaerung(page, {neuLaden, touch}) {
  const q = EINE_FRAGE.question;
  const falsch = q.answers.find((_, i) => i !== q.correct);
  await tippe(antwortKnopf(page, falsch), touch);
  await rateMal(page).getByText('Überlege noch einmal.', {exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).getByText(q.why, {exact: true}).count(), 0, 'keine Erklärung bei falscher Antwort');
  assert.ok(await rateMal(page).locator('.world-game-hint').count() > 0, 'der Hinweis bleibt erreichbar');
  assert.equal((await passLesen(page)).discoveries.includes('learned:' + EINE_FRAGE.id), false, 'falsche Antwort schreibt kein learned');
  await neuLaden();
  await rateMal(page).getByText('Überlege noch einmal.', {exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).getByText(q.why, {exact: true}).count(), 0, 'auch nach Neuladen keine Erklärung');
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

async function vorlesenLiestKopfUndFrage(page, {touch}) {
  const q = ELEFANT.question;
  await tippe(page.locator('.wissenskarte-kopf').getByRole('button', {name: 'Vorlesen', exact: true}), touch);
  await page.waitForFunction(() => window.__vorgelesen.length > 0, null, WARTEN);
  const text = (await page.evaluate(() => window.__vorgelesen)).at(-1);
  for (const teil of [ELEFANT.title, ELEFANT.intro, q.prompt, ...q.answers]) assert.ok(text.includes(teil), 'Vorlesen enthält: ' + teil);
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

async function dazuPasstZurueck(page, {touch}) {
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
    const umfuellen = () => { for (const [feld, liste] of Object.entries(proof)) fehler[feld].push(...liste.splice(0)); };
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
    umfuellen();
    sperren = false;
    fehler = danach;
    const vorherNavigiert = await page.evaluate(() => performance.getEntriesByType('navigation').length);
    await nochmal.click();
    await ausprobieren.locator('.wissenskarte-bausteine').waitFor(WARTEN);
    await ausprobieren.locator('.animal-measure').waitFor({state: 'visible', ...WARTEN});
    assert.equal(await page.evaluate(() => performance.getEntriesByType('navigation').length), vorherNavigiert, 'ohne Neuladen');
    await page.waitForFunction(() => [...document.styleSheets].some(s => /\/bausteine-[^/]*\.css/.test(s.href ?? '')), null, WARTEN)
      .catch(() => assert.fail('der Stil der Bausteine ist geladen'));
    umfuellen();
  } finally {
    await context.close();
  }
  // Beim Sperren: nur die gesperrten Dateien und die Meldung über den gescheiterten Import.
  for (const anfrage of beimSperren.failedRequests) assert.match(anfrage.url, gesperrt, 'nur gesperrte Dateien scheitern');
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
  const q = erste.question;
  await tippe(antwortKnopf(page, q.answers[q.correct]), touch);
  await rateMal(page).getByText('Passende Antwort gewählt.', {exact: true}).waitFor(WARTEN);
  assert.ok((await passLesen(page)).discoveries.includes('learned:' + erste.id), 'richtige Antwort schreibt learned');
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
function passMitHauptfrage() {
  const progress = emptyProgress();
  progress.discoveries = ['topic:' + ELEFANT.id];
  progress.review = {['world-question:' + ELEFANT.id]: {correct: true, seen: 1, due: '2099-01-01'}};
  progress.gameSessions = {['topic:' + ELEFANT.id]: {topicAnswer: ELEFANT.question.answers[ELEFANT.question.correct]}};
  return createSave(progress);
}

async function zusatzfrageImPass(ctx) {
  const [erste, zweite] = ELEFANT.moreQuestions;
  const reviewId = 'world-question:' + erste.id;
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
    await rateMal(page).locator('.rate-mal-frage').getByText(erste.prompt, {exact: true}).waitFor(WARTEN);
    await antwortKnopf(page, erste.answers[erste.correct]).tap();
    await rateMal(page).getByText('Passende Antwort gewählt.', {exact: true}).waitFor(WARTEN);
    await rateMal(page).getByText(erste.why, {exact: true}).waitFor(WARTEN);
    let pass = await passLesen(page);
    assert.equal(pass.review[reviewId]?.correct, true, 'die Zusatzfrage steht in der Wiederholung');
    assert.equal(pass.review['world-question:' + ELEFANT.id]?.due, '2099-01-01', 'die Hauptfrage bleibt unverändert');
    assert.ok(pass.discoveries.includes('learned:' + ELEFANT.id), 'richtige Zusatzfrage schreibt „gelernt“');
    assert.equal(await rateMal(page).getByText(/\d+\s*(?:von|\/)\s*\d+/).count(), 0, 'kein Zähler');
    await rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}).tap();
    await rateMal(page).locator('.rate-mal-frage').getByText(zweite.prompt, {exact: true}).waitFor(WARTEN);
    for (const knopf of await rateMal(page).locator('.quiz-answer').all()) assert.equal(await knopf.isDisabled(), false, 'die nächste Frage ist offen');
    await fertig();
    await page.reload();
    await ready(page);
    await rateMal(page).locator('.rate-mal-frage').getByText(zweite.prompt, {exact: true}).waitFor(WARTEN);
    pass = await passLesen(page);
    assert.equal(pass.review[reviewId]?.correct, true, 'die Wiederholung bleibt nach Neuladen');
    assert.ok(pass.discoveries.includes('learned:' + ELEFANT.id), '„gelernt“ bleibt nach Neuladen');
    assert.equal(pass.gameSessions['topic:' + ELEFANT.id]['topicAnswer:' + erste.id], erste.answers[erste.correct], 'die Antwort bleibt gespeichert');
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
