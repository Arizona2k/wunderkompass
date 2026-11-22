// Lernreisen: einfach zuerst (Entwurf A5, Phase 1 Teilschritt 2, Aufgabe 7).
// Offen stehen die einfache Fassung (starter), eine Tatsache (fact) und der Beobachtungsauftrag (observe).
// Der lange Text (text) und die Vertiefung (deeper) liegen unter „Für Große“, whyItMatters unter
// „Für Erwachsene: Warum das wichtig ist“. Beide sind zu Beginn zu. Die Texte bleiben wörtlich.
import assert from 'node:assert/strict';
import {ready} from './harness.mjs';
import {aufklapperErkennbar, bleibtGroesser, grosseSchriftWaechst, tippflaechen48, zeichenZeigtOffen} from './lesbarkeit.mjs';
import inhalt from '../../app/journey-content.json' with {type: 'json'};
import verzeichnis from '../../app/journey-index.json' with {type: 'json'};

const REISE = inhalt.journeys[0];
const KAPITEL = REISE.steps[0];
const ANSICHTEN = [{width: 390, height: 844, touch: true}, {width: 1440, height: 900}];

export async function reiseKapitel(ctx) {
  for (const view of ANSICHTEN) await mitKapitel(ctx, view, reiseEinfachZuerst);
  await mitKapitel(ctx, ANSICHTEN[0], reiseOhneKurztext, {serviceWorkers: 'block'});
  ctx.report.checks.push('Lernreise 390 und 1440 px: Aufklapper mit Zeichen, Tippflächen ab 48 px, einfache Fassung größer als der übrige Text, „Größere Schrift“ vergrößert sie');
  ctx.report.checks.push('Lernreise: Text offen, solange die einfache Fassung lädt; „Für Große“ nach Weiter und Zurück wieder offen');
}

async function mitKapitel(ctx, {width, height, touch = false}, fn, extra = {}) {
  const context = await ctx.browser.newContext({
    viewport: {width, height},
    reducedMotion: 'reduce',
    ...extra,
    ...(touch ? {hasTouch: true} : {}),
    ...(touch && ctx.engine === 'chromium' ? {isMobile: true} : {}),
  });
  try {
    const page = await context.newPage();
    ctx.monitor(page);
    page.setDefaultTimeout(20000);
    await fn(page, {width}, async () => {
      await page.goto(new URL('#journeys/' + REISE.id + '/1', ctx.base).href);
      await ready(page);
    });
  } finally {
    await context.close();
  }
}

// Sichtbar und nicht in einem geschlossenen Aufklapper.
async function offen(locator, name) {
  await locator.waitFor();
  assert.equal(await locator.evaluate(element => element.closest('details:not([open])') === null), true, name + ' steht offen');
}

async function reiseEinfachZuerst(page, {width}, oeffnen) {
  await oeffnen();
  const kapitel = page.locator('.chapter-card');
  // Ohne Tippen sichtbar: einfache Fassung, Tatsache, Beobachtungsauftrag.
  await offen(kapitel.getByText(KAPITEL.starter, {exact: true}), 'starter');
  await offen(kapitel.getByText(KAPITEL.fact, {exact: true}), 'fact');
  await offen(kapitel.getByText(KAPITEL.observe, {exact: true}), 'observe');

  // „Kapitel vorlesen“ steht über dem, was er liest (vor der einfachen Fassung), nicht unter dem Beobachtungskasten
  // (kinder-redaktion: sonst hält man ihn für den Knopf des Kastens).
  const vorlesen = kapitel.getByRole('button', {name: 'Kapitel vorlesen', exact: true});
  assert.equal(await vorlesen.count(), 1, 'genau ein „Kapitel vorlesen“');
  assert.ok(await vorlesen.evaluate((knopf, starter) => {
    const einfach = [...document.querySelectorAll('.chapter-card p')].find(p => p.textContent === starter);
    return Boolean(einfach && knopf.compareDocumentPosition(einfach) & Node.DOCUMENT_POSITION_FOLLOWING);
  }, KAPITEL.starter), '„Kapitel vorlesen“ steht vor der einfachen Fassung');

  // „Für Große“: zu Beginn zu, darin der lange Text wörtlich, danach die Vertiefung.
  const gross = kapitel.locator('details').filter({has: page.locator(':scope > summary', {hasText: /^Für Große$/})});
  assert.equal(await gross.count(), 1, 'genau ein „Für Große“');
  assert.equal(await gross.getAttribute('open'), null, '„Für Große“ ist zu Beginn zu');
  assert.equal(await gross.locator('.chapter-text').isVisible(), false, 'langer Text erst nach dem Öffnen');
  // Zugeklappt erkennbar und groß genug zum Tippen; „Größere Schrift“ vergrößert die einfache Fassung.
  await aufklapperErkennbar(kapitel);
  await tippflaechen48(kapitel);
  await grosseSchriftWaechst(page, ['.journey-reader .chapter-starter']);
  await bleibtGroesser(page, [['.journey-reader .chapter-starter', '.chapter-card .fact-callout p']]);
  await zeichenZeigtOffen(gross);
  await gross.locator('.chapter-text').waitFor();
  const text = await gross.locator('.chapter-text p').evaluateAll(absaetze => absaetze.map(p => p.textContent).join(' '));
  assert.equal(text, KAPITEL.text, 'langer Text wörtlich wie in journey-content.json');
  await gross.getByText(KAPITEL.deeper, {exact: true}).waitFor();
  // Nicht „Für Große vorlesen“: das klänge wie „den Großen vorlesen“ (kinder-redaktion).
  assert.equal(await gross.getByRole('button', {name: 'Den langen Text vorlesen', exact: true}).count(), 1, 'Vorlese-Knopf unter „Für Große“');
  assert.ok(await gross.evaluate((element, deeper) => {
    const langerText = element.querySelector('.chapter-text');
    const vertiefung = [...element.querySelectorAll('p')].find(p => p.textContent === deeper);
    return Boolean(vertiefung && langerText.compareDocumentPosition(vertiefung) & Node.DOCUMENT_POSITION_FOLLOWING);
  }, KAPITEL.deeper), 'Vertiefung steht nach dem langen Text');

  // „Für Erwachsene: Warum das wichtig ist“: zu Beginn zu, darin whyItMatters.
  const erwachsene = kapitel.locator('details').filter({has: page.locator(':scope > summary', {hasText: /^Für Erwachsene: Warum das wichtig ist$/})});
  assert.equal(await erwachsene.count(), 1, 'genau ein „Für Erwachsene“');
  assert.equal(await erwachsene.getAttribute('open'), null, '„Für Erwachsene“ ist zu Beginn zu');
  assert.equal(await erwachsene.getByText(KAPITEL.whyItMatters, {exact: true}).isVisible(), false);
  await zeichenZeigtOffen(erwachsene);
  await erwachsene.getByText(KAPITEL.whyItMatters, {exact: true}).waitFor();

  // Die alten Klappen gibt es nicht mehr.
  for (const alt of ['Ganz einfach · etwa 6–8 Jahre', 'Noch genauer · etwa 12–14 Jahre', 'Selbst beobachten und erklären · freiwillig']) {
    assert.equal(await kapitel.locator('summary', {hasText: alt}).count(), 0, 'alte Klappe weg: ' + alt);
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2), false, 'kein waagerechtes Scrollen bei ' + width);

  // Im nächsten Kapitel sind beide Aufklapper wieder zu, die einfache Fassung steht wieder offen.
  const naechstes = REISE.steps[1];
  await kapitel.getByRole('button', {name: 'Weiter entdecken', exact: true}).click();
  await offen(kapitel.getByText(naechstes.starter, {exact: true}), 'starter im 2. Kapitel');
  assert.equal(await gross.getAttribute('open'), null, '„Für Große“ im 2. Kapitel wieder zu');
  assert.equal(await erwachsene.getAttribute('open'), null, '„Für Erwachsene“ im 2. Kapitel wieder zu');

  // Zurück ins 1. Kapitel: Wer „Für Große“ offen hatte, findet den langen Text wieder offen vor.
  await page.goBack();
  await offen(kapitel.getByText(KAPITEL.starter, {exact: true}), 'starter nach Zurück');
  await page.waitForFunction(() => document.querySelector('.chapter-gross')?.open === true, null, {timeout: 10000})
    .catch(() => assert.fail('„Für Große“ ist nach Zurück wieder offen'));
}

// Solange die einfache Fassung noch lädt (oder offline nicht kommt), steht der Text des Kapitels offen da,
// nicht versteckt unter „Für Große“. Kommt die einfache Fassung, wandert der Text unter „Für Große“.
async function reiseOhneKurztext(page, ansicht, oeffnen) {
  let freigeben;
  const gehalten = new Promise(fertig => { freigeben = fertig; });
  await page.route('**/assets/journey-content-*.json', async route => { await gehalten; await route.continue(); });
  try {
    await oeffnen();
    const kapitel = page.locator('.chapter-card');
    const langerText = verzeichnis.find(j => j.id === REISE.id).steps[0].text;
    await kapitel.locator('.chapter-text').first().waitFor();
    const text = await kapitel.locator('.chapter-text').first().evaluate(element => [...element.querySelectorAll('p')].map(p => p.textContent).join(' '));
    assert.equal(text, langerText, 'vor dem Nachladen: der Text des Kapitels');
    await offen(kapitel.locator('.chapter-text').first(), 'Text vor dem Nachladen');
    assert.equal(await kapitel.getByText(KAPITEL.starter, {exact: true}).count(), 0, 'einfache Fassung noch nicht da');
  } finally {
    freigeben();
  }
  const kapitel = page.locator('.chapter-card');
  await offen(kapitel.getByText(KAPITEL.starter, {exact: true}), 'starter nach dem Nachladen');
  const gross = kapitel.locator('details.chapter-gross');
  assert.equal(await gross.getAttribute('open'), null, '„Für Große“ ist zu');
  assert.equal(await kapitel.locator('.chapter-text').count(), 1, 'der Text steht nur noch einmal da');
  assert.equal(await gross.locator('.chapter-text').count(), 1, 'der Text steht unter „Für Große“');
}
