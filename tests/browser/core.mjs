// Kernrundgang (aus dem alten portable-smoke-Block „core“ übernommen, Ablauf unverändert):
// vier Breiten mit Globus, Atlas, Pass, Entdecken, Suche, sechs Karten, verbundenen Entdeckungen
// und Energiemodell; bei 1440 px zusätzlich Merken, vier Lernbereiche und eine Memory-Runde;
// zum Schluss Atlas und Pass bei 320 px.
import assert from 'node:assert/strict';
import path from 'node:path';
import {articleAtlas} from './article-atlas.mjs';
import {connectedDiscoveries} from './connected-discoveries.mjs';
import {discoveryCentral} from './discovery-central.mjs';
import {passDesign} from './pass-atlas.mjs';
import {memoryRound, searchAndHistory} from './portable-flows.mjs';
import {bereich} from './harness.mjs';

const VIEWS = [[1440, 900], [768, 1024], [390, 844], [360, 800]];
const TOPICS = ['animal-polar-bear', 'history-maya', 'person-grace_hopper', 'invention-car', 'building-taj-mahal', 'science-energy'];
const HUBS = [['journeys', '.journey-tile'], ['games', '.game-tile'], ['labs', '.research-grid'], ['book', '.word-card']];
const SAVE_KEY = 'erde-entdecken:save:v3';

export async function core({browser, base, ready, monitor, report, shots}) {
  for (const [width, height] of VIEWS) {
    const mobile = width <= 390;
    const context = await browser.newContext({viewport: {width, height}, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce', acceptDownloads: true});
    try {
      const p = await context.newPage();
      monitor(p);
      p.setDefaultTimeout(20000);
      await p.goto(base + '/#globe');
      await ready(p);
      await p.locator('#globe-observatory').scrollIntoViewIfNeeded();
      await p.locator('canvas').waitFor();
      assert.equal(await p.title(), 'WunderKompass · Die große Abenteuerwelt des Wissens');

      const inspect = async name => {
        assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, name);
        for (const image of await p.locator('.world-article img').all()) {
          await image.evaluate(async element => { await element.decode(); if (!element.naturalWidth) throw Error('Undecoded image'); });
        }
        report.views.push({width, height, name});
      };
      await inspect('dedicated-globe');
      await articleAtlas(p, ready, report, width, shots);
      await passDesign(p, report, width, shots);
      await discoveryCentral(p, ready, report, width, shots);
      await searchAndHistory(p, report);

      for (const id of TOPICS) {
        await p.evaluate(topic => { location.hash = 'world/topic/' + topic; }, id);
        await p.locator('.world-mini-question').waitFor();
        await inspect(id);
      }

      if (width === 1440) {
        await p.evaluate(() => { location.hash = 'world/topic/animal-polar-bear'; });
        await p.locator('.world-mini-question').waitFor();
        await p.getByRole('button', {name: 'Das interessiert mich!', exact: true}).click();
        await p.waitForFunction(key => JSON.parse(localStorage.getItem(key))?.progress.favorites.includes('topic:animal-polar-bear'), SAVE_KEY);
        await p.reload();
        await ready(p);
        assert.ok(await p.evaluate(key => JSON.parse(localStorage.getItem(key)).progress.favorites.includes('topic:animal-polar-bear'), SAVE_KEY));
        report.checks.push('Favorite survives reload');
        for (const [id, selector] of HUBS) {
          await bereich(p, id).click();
          await p.locator(selector).first().waitFor();
        }
        report.checks.push('Four original learning hubs open');
        await memoryRound(p, ready, report);
      }

      await connectedDiscoveries(p, ready, report, width);
      await p.evaluate(() => { location.hash = 'world/topic/science-energy'; });
      await p.locator('.model-energy').waitFor();
      await p.screenshot({path: path.join(shots, 'portable-' + width + '.png')});
    } finally {
      await context.close();
    }
  }

  const small = await browser.newContext({viewport: {width: 320, height: 568}, hasTouch: true, reducedMotion: 'reduce'});
  try {
    const page = await small.newPage();
    monitor(page);
    await page.goto(base);
    await ready(page);
    await articleAtlas(page, ready, report, 320, shots);
    await passDesign(page, report, 320, shots);
  } finally {
    await small.close();
  }
}
