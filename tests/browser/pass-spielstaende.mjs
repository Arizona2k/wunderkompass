// BACKLOG 18: Ein voller Pass (je Karte, Spiel, Reise und Labor ein Spielstand, zusammen über 256) übersteht im
// echten Browser Import, Neuladen und Sicherung, ohne dass ein Spielstand verloren geht. Der Pass ist ausgedacht.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {ready} from './harness.mjs';
import catalog from '../../app/world-catalog.json' with {type: 'json'};
import spiele from '../../app/game-index.json' with {type: 'json'};
import reisen from '../../app/journey-index.json' with {type: 'json'};

const LABORE = ['depth', 'volcano', 'quake', 'weather', 'water', 'seasons', 'plates', 'moon', 'clocks', 'tides', 'solar'];

function vollerPass() {
  const ids = [
    ...catalog.map(t => 'topic:' + t.id),
    ...spiele.map(g => g.family === 'world' ? 'world:' + g.id : g.id),
    ...reisen.map(r => 'journey:' + r.id),
    ...LABORE.map(id => 'lab:' + id),
  ];
  const at = '2026-11-22T08:00:00.000Z';
  return {
    app: 'earth-explorer', schemaVersion: 3, createdAt: at, updatedAt: at,
    progress: {
      discoveries: [], journeys: [], games: [], missions: [], labs: [], experiments: [], favorites: [],
      favoritePlaces: {}, chapters: {}, completedChapters: {}, review: {}, notes: [],
      settings: {sound: false, readRate: 0.9, largeText: false, reducedMotion: false, difficulty: 'normal'},
      quizResults: [], quizSession: null, lastActivity: null,
      gameSessions: Object.fromEntries(ids.map((id, i) => [id, {qaFeld: 'Spielstand ' + i, qaZahl: i}])),
    },
  };
}

export async function passSpielstaende(ctx) {
  const pass = vollerPass(), anzahl = Object.keys(pass.progress.gameSessions).length;
  assert.ok(anzahl > 256, 'der ausgedachte Pass hat mehr als 256 Spielstände: ' + anzahl);
  const context = await ctx.browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce', acceptDownloads: true});
  try {
    const page = await context.newPage();
    ctx.monitor(page);
    page.setDefaultTimeout(20000);
    const browserSpeicher = () => page.evaluate(() => JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.gameSessions);
    const datenbank = () => page.evaluate(() => new Promise((resolve, reject) => {
      const offen = indexedDB.open('earth-explorer', 1);
      offen.onerror = () => reject(offen.error);
      offen.onsuccess = () => {
        const lesen = offen.result.transaction('saves', 'readonly').objectStore('saves').get('main');
        lesen.onerror = () => reject(lesen.error);
        lesen.onsuccess = () => { resolve(lesen.result?.progress.gameSessions ?? null); offen.result.close(); };
      };
    }));
    await page.goto(ctx.base);
    await ready(page);
    await page.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true}).click();
    await page.locator('input[type=file]').setInputFiles({name: 'voller-pass.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(pass))});
    await page.getByRole('button', {name: 'Pass wiederherstellen', exact: true}).click();
    await page.locator('.passport-dialog').waitFor({state: 'hidden'});
    assert.deepEqual(await browserSpeicher(), pass.progress.gameSessions, 'nach dem Import');
    await page.waitForFunction(n => new Promise(resolve => {
      const offen = indexedDB.open('earth-explorer', 1);
      offen.onerror = () => resolve(false);
      offen.onsuccess = () => {
        const lesen = offen.result.transaction('saves', 'readonly').objectStore('saves').get('main');
        lesen.onsuccess = () => { resolve(Object.keys(lesen.result?.progress.gameSessions ?? {}).length === n); offen.result.close(); };
        lesen.onerror = () => resolve(false);
      };
    }), anzahl);
    assert.deepEqual(await datenbank(), pass.progress.gameSessions, 'in IndexedDB');
    await page.reload();
    await ready(page);
    await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
    assert.deepEqual(await browserSpeicher(), pass.progress.gameSessions, 'nach dem Neuladen im Browser-Speicher');
    assert.deepEqual(await datenbank(), pass.progress.gameSessions, 'nach dem Neuladen in IndexedDB');
    await page.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true}).click();
    const laden = page.waitForEvent('download');
    await page.getByRole('button', {name: 'Entdeckerpass sichern', exact: true}).click();
    const datei = ctx.shots + '/voller-pass-sicherung.json';
    await (await laden).saveAs(datei);
    const sicherung = JSON.parse(await fs.readFile(datei, 'utf8'));
    assert.deepEqual(sicherung.progress.gameSessions, pass.progress.gameSessions, 'in der Sicherung');
  } finally {
    await context.close();
  }
  ctx.report.checks.push('Voller Pass mit ' + anzahl + ' Spielständen: Import, IndexedDB, Neuladen und Sicherung ohne Verlust');
}
