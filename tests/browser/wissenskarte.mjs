// Neue Wissenskarte (Phase 1, Teilschritt 2): Kopf, „Rate mal!“, Merken, heikle Karten, Vorlesen.
// Jeder Fall prüft auch den Pass nach Neuladen: Dort hängt der Lernstand der Kinder.
import assert from 'node:assert/strict';
import {ready, ladeanfragen} from './harness.mjs';
import catalog from '../../app/world-catalog.json' with {type: 'json'};

const ELEFANT = catalog.find(t => t.id === 'animal-african-savanna-elephant');
const HEIKEL = catalog.find(t => t.id === 'history-holocaust');
const HANDY = {width: 390, height: 844, touch: true};
const BREIT = {width: 1440, height: 900};
const WARTEN = {timeout: 10000};

export async function wissenskarte(ctx) {
  for (const view of [HANDY, BREIT]) {
    await mitKarte(ctx, view, ELEFANT.id, karteOeffnenSchreibtBesuch);
    await mitKarte(ctx, view, ELEFANT.id, richtigeAntwortSchreibtGelernt);
    await mitKarte(ctx, view, ELEFANT.id, falscheAntwortOhneErklaerung);
    await mitKarte(ctx, view, ELEFANT.id, merkenSchaltetFavoriten);
    await mitKarte(ctx, view, HEIKEL.id, heikleKarteFragtVorher);
    await mitKarte(ctx, view, ELEFANT.id, vorlesenLiestKopfUndFrage, vorleseAttrappe);
    ctx.report.checks.push(`Wissenskarte ${view.width}: Besuch im Pass, richtige Antwort schreibt „gelernt“ und Wiederholung, `
      + 'falsche Antwort ohne Erklärung, Merken an und aus, heikle Karte fragt vorher, Vorlesen liest Kopf und Frage – jeweils auch nach Neuladen');
  }
}

// Frischer Kontext, Karte direkt per Link geöffnet. `fertig` wartet vor jedem Neuladen auf offene Anfragen,
// damit ein gewollter Seitenwechsel keine Ladefehler in der Überwachung erzeugt.
async function mitKarte(ctx, {width, height, touch = false}, topicId, fn, initScript) {
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
    await page.goto(new URL('#world/topic/' + topicId, ctx.base).href);
    await ready(page);
    await page.locator('#world-topic-title').waitFor(WARTEN);
    const neuLaden = async () => {
      await fertig();
      await page.reload();
      await ready(page);
      await page.locator('#world-topic-title').waitFor(WARTEN);
    };
    await fn(page, {neuLaden, touch});
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
  const q = ELEFANT.question;
  await rateMal(page).getByRole('heading', {name: 'Rate mal!', exact: true}).waitFor(WARTEN);
  await tippe(antwortKnopf(page, q.answers[q.correct]), touch);
  await rateMal(page).getByText('Passende Antwort gewählt.', {exact: true}).waitFor(WARTEN);
  await rateMal(page).getByText(q.why, {exact: true}).waitFor(WARTEN);
  await page.locator('.wissenskarte-gelernt').waitFor(WARTEN);
  const pass = await passLesen(page);
  assert.ok(pass.discoveries.includes('learned:' + ELEFANT.id), 'richtige Antwort schreibt learned');
  assert.equal(pass.review['world-question:' + ELEFANT.id]?.correct, true, 'richtige Antwort steht in der Wiederholung');
  await neuLaden();
  const knoepfe = rateMal(page).locator('.quiz-answer');
  assert.equal(await knoepfe.count(), q.answers.length);
  for (const knopf of await knoepfe.all()) assert.equal(await knopf.isDisabled(), true, 'nach Neuladen bleiben die Antworten gesperrt');
  assert.ok((await passLesen(page)).discoveries.includes('learned:' + ELEFANT.id), 'learned bleibt nach Neuladen');
  await page.locator('.wissenskarte-gelernt').waitFor(WARTEN);
}

async function falscheAntwortOhneErklaerung(page, {neuLaden, touch}) {
  const q = ELEFANT.question;
  const falsch = q.answers.find((_, i) => i !== q.correct);
  await tippe(antwortKnopf(page, falsch), touch);
  await rateMal(page).getByText('Überlege noch einmal.', {exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).getByText(q.why, {exact: true}).count(), 0, 'keine Erklärung bei falscher Antwort');
  assert.ok(await rateMal(page).locator('.world-game-hint').count() > 0, 'der Hinweis bleibt erreichbar');
  assert.equal((await passLesen(page)).discoveries.includes('learned:' + ELEFANT.id), false, 'falsche Antwort schreibt kein learned');
  await neuLaden();
  await rateMal(page).getByText('Überlege noch einmal.', {exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).getByText(q.why, {exact: true}).count(), 0, 'auch nach Neuladen keine Erklärung');
  assert.equal((await passLesen(page)).discoveries.includes('learned:' + ELEFANT.id), false, 'auch nach Neuladen kein learned');
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
