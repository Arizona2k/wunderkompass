// Rauchtest: Startseite, Tierwelt, eine Karte, Merken im Pass und alte Links.
// Läuft einmal schmal mit Touch (360 × 800) und einmal breit (1440 × 900).
import assert from 'node:assert/strict';
import path from 'node:path';
import {browserErrorsSettled} from '../../scripts/browser-errors.mjs';
import {ladeanfragen, ready, withPage} from './harness.mjs';

const SAVE_KEY = 'erde-entdecken:save:v3';
const TOPIC = 'animal-polar-bear';
const VIEWS = [
  {width: 360, height: 800, touch: true},
  {width: 1440, height: 900},
];

export async function smoke(ctx) {
  for (const view of VIEWS) {
    await withPage(ctx, view, async page => {
      const width = view.width;
      const anfragenFertig = ladeanfragen(page);
      const screenshot = name => page.screenshot({path: path.join(ctx.shots, `${name}-${width}.png`)});

      await page.locator('.discovery-hero').waitFor();
      await assertNoOverflow(page, `Start ${width}`);
      await screenshot('start');

      await openHash(page, 'world/animals');
      await page.getByRole('textbox', {name: 'Entdeckerkarten durchsuchen'}).waitFor();
      await assertNoOverflow(page, `Tierwelt ${width}`);
      await screenshot('welt');

      await openHash(page, `world/topic/${TOPIC}`);
      await page.locator('.world-mini-question').waitFor();
      await assertNoOverflow(page, `Karte ${width}`);
      await screenshot('karte');

      await page.getByRole('button', {name:'Merken', exact: true}).click();
      const saved = ([key, id]) => (JSON.parse(localStorage.getItem(key) ?? 'null')?.progress?.favorites ?? []).includes(id);
      await page.waitForFunction(saved, [SAVE_KEY, 'topic:' + TOPIC], {polling: 100});
      await page.reload();
      await ready(page);
      assert.ok((await favorites(page)).includes('topic:' + TOPIC), `Merken ${width}: nach dem Neuladen verschwunden`);

      await page.goto(ctx.base + '#news/girl-day-2026');
      await ready(page);
      await page.waitForFunction(() => location.hash === '#home');
      // Die Startseite erst fertig laden lassen, dann weiter. Hat sie vor dem Neuladen schon ein Foto gezeigt (zufälliges
      // Entdeckungspaar, z. B. das Riff), fragt Firefox jetzt nach, ob seine Kopie noch gilt, bricht die Nachfrage selbst ab
      // und zeigt die Kopie. Die Überwachung streicht diesen Abbruch nur, wenn sie das Foto danach auf der Seite sieht
      // (scripts/browser-errors.mjs, Fall 2). Ging der Test 30 ms später schon zur Reise, blieb er rot (Engine-Schnellprüfung
      // Firefox, Lauf 45348967989, 24.11.2026; lokal 2 von 6 Läufen mit fest eingestelltem Riff-Paar).
      await page.locator('.discovery-hero').waitFor();
      await anfragenFertig();
      await browserErrorsSettled(ctx.report);

      await page.goto(ctx.base + '#journeys/water');
      await ready(page);
      await page.waitForFunction(() => /^#journeys\/water\/\d+$/.test(location.hash));

      ctx.report.checks.push(`Rauchtest ${width}: Start, Tierwelt, Karte, Merken nach Neuladen, alte Links`);
    });
  }
}

function openHash(page, hash) {
  return page.evaluate(value => { location.hash = value; }, hash);
}

async function assertNoOverflow(page, label) {
  // clientWidth statt innerWidth: Chromium im Handy-Modus vergrößert innerWidth mit dem Überlauf.
  const {scrollWidth, clientWidth} = await page.evaluate(() => ({scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth}));
  assert.ok(scrollWidth <= clientWidth + 2, `${label}: waagerechter Überlauf (${scrollWidth} px bei ${clientWidth} px Breite)`);
}

function favorites(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? 'null')?.progress?.favorites ?? [], SAVE_KEY);
}
