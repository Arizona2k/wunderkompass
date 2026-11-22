// Offline-Kaltstart (aus dem alten portable-smoke-Block „offline“ übernommen):
// Lernwelt offline vorbereiten, Browser schließen, eigenen Server stoppen, dann einen kalten
// Browser offline starten und Foto, Energiemodell und Pass-Dialog prüfen. Danach in der
// zwischengespeicherten App gespeicherte Spielrunden und alte Antworten über den Pass-Import
// (früher nur im Lauf offline-resilience).
// Mit {full: true} laufen zusätzlich die Offline-Runden der Inhaltsbereiche.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {monitorBrowserErrors} from '../../scripts/browser-errors.mjs';
import {offlineAnimals} from './animal-learning.mjs';
import {offlineArticleAtlas} from './article-atlas.mjs';
import {offlineChallengeHints} from './challenge-hints.mjs';
import {offlineDiscoveryCentral} from './discovery-central.mjs';
import {offlineJourneys, prepareOfflineJourneys} from './journeys.mjs';
import {offlinePlayground, prepareOfflinePlayground} from './playground.mjs';
import {offlineResearch} from './research.mjs';
import {offlineSolar} from './solar-comparison.mjs';
import {ausprobierenAuf} from './karte-hilfen.mjs';
import {learningTaskOfflineSemantics} from './learning-task-offline.mjs';
import {worldGameOfflineSemantics} from './world-game-offline-semantics.mjs';

export async function offlineCold(ctx, {full = false} = {}) {
  const {browserType, launchOptions, ready, report, shots, engine} = ctx;
  const server = await ctx.startPreview();
  const profile = path.join(shots, 'offline-profile');
  await fs.rm(profile, {recursive: true, force: true});
  const contextOptions = {...launchOptions, viewport: {width: 1280, height: 900}, reducedMotion: 'reduce'};
  const open = async context => {
    const page = context.pages()[0] ?? await context.newPage();
    monitorBrowserErrors(page, server.base, report, {engine});
    page.setDefaultTimeout(20000);
    return page;
  };

  let savedPlayground;
  try {
    let context = await browserType.launchPersistentContext(profile, contextOptions);
    try {
      const page = await open(context);
      await page.goto(server.base);
      await ready(page);
      if (full) {
        savedPlayground = await prepareOfflinePlayground(page);
        await prepareOfflineJourneys(page);
      }
      await page.getByRole('button', {name: 'Für offline vorbereiten', exact: true}).click();
      await page.getByText('Deine Lernwelt ist offline vorbereitet.', {exact: true}).waitFor({timeout: 58500});
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      report.offlineCache = await page.evaluate(async () => {
        const result = [];
        for (const name of await caches.keys()) {
          const cache = await caches.open(name);
          result.push({name, assets: (await cache.keys()).length, complete: !!await cache.match('/__learning_offline_ready__')});
        }
        return result;
      });
      assert.ok(report.offlineCache.some(cache => cache.complete && cache.assets > 100));
      report.checks.push('Actual offline preparation completed');
    } finally {
      await context.close();
    }

    await server.stop();
    await assert.rejects(fetch(server.base, {signal: AbortSignal.timeout(2600)}));

    // Offline gilt schon, bevor der kalte Kontext seine erste Seite und seinen Worker startet.
    context = await browserType.launchPersistentContext(profile, {...contextOptions, offline: true});
    try {
      await context.setOffline(true);
      const page = await open(context);
      await page.goto(server.base);
      await page.screenshot({path: path.join(shots, 'offline-start.png')});
      await ready(page);
      assert.equal(await page.evaluate(() => navigator.onLine), false, 'Cold context must report offline before any learning exercise');
      const nunitoOffline = await page.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts].some(face => face.family.replace(/["']/g, '') === 'Nunito Variable' && face.status === 'loaded');
      });
      assert.ok(nunitoOffline, 'Schrift Nunito kommt beim Offline-Kaltstart aus dem Vorrat');
      report.checks.push('Schrift Nunito nach Offline-Kaltstart geladen');

      await page.evaluate(() => { location.hash = 'world/topic/animal-whale-shark'; });
      const photo = page.locator('.world-photo img').first();
      await photo.waitFor();
      await photo.evaluate(async image => { await image.decode(); if (!image.naturalWidth) throw Error('Offline image missing'); });
      // „Ausprobieren“ lädt seinen Baustein erst beim Aufklappen nach; offline muss er aus dem Vorrat kommen.
      await page.evaluate(() => { location.hash = 'world/topic/animal-african-savanna-elephant'; });
      await ausprobierenAuf(page, 'animal-african-savanna-elephant');
      await page.locator('details.wissenskarte-ausprobieren .animal-measure').waitFor();
      await page.evaluate(() => { location.hash = 'world/topic/science-energy'; });
      await ausprobierenAuf(page, 'science-energy');
      await page.locator('.model-energy').waitFor();
      await page.getByRole('button', {name: 'Einen Zeitschritt testen', exact: true}).click();
      report.checks.push('Closed browser and cold offline restart with preview server stopped; unopened animal photo, „Ausprobieren“ on two cards and energy model work');

      if (full) {
        await offlineSolar(page, report);
        await offlineAnimals(page, report);
        await offlineArticleAtlas(page, report);
      }

      await page.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true}).click();
      await page.getByRole('button', {name: 'Pass sichern', exact: true}).click();
      await page.getByRole('heading', {name: 'Sichern & mitnehmen', exact: true}).waitFor();
      await page.getByRole('button', {name: 'Entdeckerpass schließen', exact: true}).click();
      report.checks.push('New pass shell and direct backup access work after actual cold offline restart');

      if (full) {
        await offlineChallengeHints(page, report);
        await offlineDiscoveryCentral(page, report);
        await offlineResearch(page, report);
        await offlineJourneys(page, report);
        await offlinePlayground(page, report, savedPlayground);
      }

      report.worldGameSemantics = await worldGameOfflineSemantics(page, {shots, kind: engine});
      report.learningTaskSemantics = await learningTaskOfflineSemantics(page, {shots, kind: engine});
      report.checks.push('Saved world-game rounds and old research/journey answers work in the cold cached app');
    } finally {
      await context.close();
    }
  } finally {
    await server.stop();
  }
}
