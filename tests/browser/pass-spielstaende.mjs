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

// Teilschritt 3, Aufgaben 1 und 2: die gemeinsame Stufe im Entdeckerpass (gameSessions['kern:stufe']).
// Ein Altpass mit der alten Quiz-Stufe „Knifflig“ startet auf Profi; Umstellen geht mit einem Tipp,
// „Zurück zu Entdecker“ steht auf Profi und Experte dabei; die Stufe übersteht Neuladen, Sicherung und Einlesen.
export async function stufeImPass(ctx) {
  const context = await ctx.browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce', acceptDownloads: true, hasTouch: true, ...(ctx.engine === 'chromium' ? {isMobile: true} : {})});
  try {
    const page = await context.newPage();
    ctx.monitor(page);
    page.setDefaultTimeout(20000);
    const gespeichert = () => page.evaluate(() => {const p = JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress; return {stufe: p.gameSessions['kern:stufe']?.stufe ?? null, lastActivity: p.lastActivity, difficulty: p.settings.difficulty};});
    const passOeffnen = async () => {
      await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').click();
      const wahl = page.locator('.passport-dialog .stufen-wahl');
      await wahl.scrollIntoViewIfNeeded();
      return wahl;
    };
    const mindestens48 = async (knopf, name) => {
      const box = await knopf.boundingBox();
      assert.ok(box && box.width >= 48 && box.height >= 48, name + ' ist mindestens 48 px groß: ' + JSON.stringify(box));
    };
    await page.goto(ctx.base);
    await ready(page);
    // Altpass (ohne Schema-Angabe) mit der alten Quiz-Stufe „Knifflig“, eingelesen über „Sicherung öffnen“.
    const altpass = {discoveries: ['animal-elephant'], chapters: {}, journeys: [], settings: {difficulty: 'tricky', sound: false, readRate: 0.9, largeText: false, reducedMotion: false}};
    await page.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true}).click();
    await page.locator('input[type=file]').setInputFiles({name: 'altpass.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(altpass))});
    await page.getByRole('button', {name: 'Pass wiederherstellen', exact: true}).click();
    await page.locator('.passport-dialog').waitFor({state: 'hidden'});
    let wahl = await passOeffnen();
    await expectText(wahl.locator('.stufen-zeile'), 'Stufe: Profi');
    const aendern = wahl.getByRole('button', {name: 'Stufe ändern'});
    const zurueck = wahl.getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker'});
    await zurueck.waitFor();
    await mindestens48(aendern, '„Ändern“');
    await mindestens48(zurueck, '„Zurück zu Entdecker“');
    assert.equal((await gespeichert()).stufe, null, 'Ansehen schreibt nichts in den Pass');
    await page.screenshot({path: ctx.shots + '/stufe-zu-390.png'});
    // Ein Tipp öffnet die drei Stufen, ein zweiter stellt um.
    await aendern.tap();
    await wahl.scrollIntoViewIfNeeded();
    await page.screenshot({path: ctx.shots + '/stufe-offen-390.png'});
    const knoepfe = wahl.getByRole('group', {name: 'Welche Stufe willst du spielen?', exact: true}).getByRole('button');
    assert.equal(await knoepfe.count(), 3, 'drei Stufen zur Wahl');
    for (const [i, name] of ['Entdecker', 'Profi', 'Experte'].entries()) {
      await mindestens48(knoepfe.nth(i), name);
      assert.equal(await knoepfe.nth(i).getAttribute('aria-pressed'), String(name === 'Profi'), name + ' gewählt?');
    }
    assert.equal(await knoepfe.nth(1).evaluate(el => el === document.activeElement), true, 'der Fokus steht auf der gewählten Stufe');
    assert.equal(await wahl.locator('.stufen-knoepfe').innerText().then(t => /\b\d+\s*(bis|–)\s*\d+\b|Jahre/.test(t)), false, 'kein Alter auf den Knöpfen');
    await knoepfe.nth(2).tap();
    await expectText(wahl.locator('.stufen-zeile'), 'Stufe: Experte');
    await zurueck.waitFor();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.gameSessions['kern:stufe']?.stufe === 'experte');
    const nachWahl = await gespeichert();
    assert.equal(nachWahl.lastActivity, null, 'die Stufenwahl ändert „Weiter entdecken“ nicht');
    assert.equal(nachWahl.difficulty, 'tricky', 'die alte Quiz-Stufe bleibt unverändert im Pass');
    // „Zurück zu Entdecker“ stellt mit einem Tipp um und verschwindet dann.
    await zurueck.tap();
    await expectText(wahl.locator('.stufen-zeile'), 'Stufe: Entdecker');
    await zurueck.waitFor({state: 'detached'});
    // Absichtlich sofort, ohne Warten: Die Seite setzt den Fokus noch im Klick. Ein Warten verdeckte, wenn er ein Bild lang
    // auf den Pass-Dialog springt (CI WebKit 24.11.2026; Technik-Prüfung WebKit-Fund, Befund 2a).
    assert.equal(await aendern.evaluate(el => el === document.activeElement), true, 'der Fokus bleibt in der Stufenwahl');
    // Tastatur: Enter öffnet, Umschalt+Tab wandert, Enter wählt.
    await aendern.focus();
    await page.keyboard.press('Enter');
    assert.equal(await knoepfe.nth(0).evaluate(el => el === document.activeElement), true, 'Fokus auf Entdecker');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expectText(wahl.locator('.stufen-zeile'), 'Stufe: Profi');
    // Auch hier sofort, aus demselben Grund.
    assert.equal(await aendern.evaluate(el => el === document.activeElement && el.matches(':focus-visible')), true, 'sichtbarer Fokus zurück auf „Ändern“');
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.gameSessions['kern:stufe']?.stufe === 'profi');
    // Neuladen
    await page.reload();
    await ready(page);
    wahl = await passOeffnen();
    await expectText(wahl.locator('.stufen-zeile'), 'Stufe: Profi');
    await wahl.getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker'}).waitFor();
    // Sicherung und Einlesen in einem frischen Browser
    const laden = page.waitForEvent('download');
    await page.getByRole('button', {name: 'Entdeckerpass sichern', exact: true}).click();
    const datei = ctx.shots + '/stufe-sicherung.json';
    await (await laden).saveAs(datei);
    const sicherung = JSON.parse(await fs.readFile(datei, 'utf8'));
    assert.equal(sicherung.progress.gameSessions['kern:stufe']?.stufe, 'profi', 'Stufe in der Sicherung');
    const frisch = await context.browser().newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
    try {
      const neu = await frisch.newPage();
      ctx.monitor(neu);
      neu.setDefaultTimeout(20000);
      await neu.goto(ctx.base);
      await ready(neu);
      await neu.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true}).click();
      await neu.locator('input[type=file]').setInputFiles(datei);
      await neu.getByRole('button', {name: 'Pass wiederherstellen', exact: true}).click();
      await neu.locator('.passport-dialog').waitFor({state: 'hidden'});
      await neu.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').click();
      const neueWahl = neu.locator('.passport-dialog .stufen-wahl');
      await neueWahl.scrollIntoViewIfNeeded();
      await expectText(neueWahl.locator('.stufen-zeile'), 'Stufe: Profi');
      await neu.screenshot({path: ctx.shots + '/stufe-1440.png'});
    } finally {
      await frisch.close();
    }
  } finally {
    await context.close();
  }
  ctx.report.checks.push('Stufe im Pass: Altpass mit Knifflig startet auf Profi, Umstellen mit einem Tipp und mit der Tastatur, „Zurück zu Entdecker“, Neuladen, Sicherung und Einlesen');
}

async function expectText(locator, text) {
  await locator.filter({hasText: text}).waitFor({timeout: 10000}).catch(async () => {
    assert.fail('erwartet „' + text + '“, gefunden „' + (await locator.innerText().catch(() => '?')) + '“');
  });
}
