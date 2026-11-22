// Gemeinsame Bausteine für alle Browser-Suiten:
// Vorschau-Server starten, auf die fertige Seite warten, eine Seite in einem frischen Kontext öffnen.
import {spawn} from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {browserErrorArrays} from '../../scripts/browser-errors.mjs';
import {BEREICHE} from '../../app/kern/bereiche.ts';

export const PROJECT = fileURLToPath(new URL('../..', import.meta.url));

// Leerer Bericht für eine Suite. Ältere Abläufe schreiben in checks und views.
export function newReport() {
  return {checks: [], views: [], ...browserErrorArrays()};
}

// Die Seite ist bedienbar, sobald der Entdeckerpass-Knopf aktiv ist.
export function ready(page) {
  return page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor({timeout: 26000});
}

// Ein gewolltes Neuladen, Schließen oder Weiterblättern bricht Bilder ab, die noch laden
// (Chromium: net::ERR_ABORTED, Firefox: NS_BINDING_ABORTED), und die Fehlerüberwachung schlägt an.
// Auf einem langsamen Rechner wie der CI ist dieses Zeitfenster groß. Deshalb vorher warten, bis alle
// Bildanfragen der Seite fertig sind. Jede echte Fehlanfrage bleibt in der Überwachung sichtbar.
// Gleich nach newPage aufrufen: const bilderFertig = bildanfragen(page); … await bilderFertig(); await page.reload();
export function bildanfragen(page, {timeout = 20000} = {}) {
  return offeneAnfragen(page, request => request.resourceType() === 'image', 'Bilder laden', timeout);
}

// Wie bildanfragen, aber für alle Ladeanfragen außer Seitenaufrufen: auch Programmteile, Stile und Daten,
// die die App erst beim Öffnen eines Bereichs nachlädt. Ein Neuladen direkt danach bricht sie ab
// (net::ERR_ABORTED). So schlug die CI-Vollprüfung im November 2026 in `research` an.
export function ladeanfragen(page, {timeout = 20000} = {}) {
  return offeneAnfragen(page, request => !request.isNavigationRequest(), 'Anfragen laufen', timeout);
}

// Fertig erst nach einer Ruhezeit ohne offene Anfrage: Bilder weiter unten (loading="lazy") starten oft erst,
// wenn die ersten fertig sind und der Browser neu gezeichnet hat. Auf der breiten Startseite kamen sie etwa
// 30 ms danach; mit verzögertem Netz (150 ms) brach ein Neuladen in dieser Lücke 7 bis 10 Bilder ab.
const RUHEZEIT = 250;

function offeneAnfragen(page, passt, was, timeout) {
  const offen = new Set();
  const fertig = request => offen.delete(request);
  page.on('request', request => { if (passt(request)) offen.add(request); });
  page.on('requestfinished', fertig);
  page.on('requestfailed', fertig);
  return async () => {
    const ende = Date.now() + timeout;
    let ruhigSeit = 0;
    for (;;) {
      if (offen.size) ruhigSeit = 0;
      else if (!ruhigSeit) ruhigSeit = Date.now();
      else if (Date.now() - ruhigSeit >= RUHEZEIT) return;
      if (Date.now() > ende) throw Error(was + ' noch vor dem gewollten Seitenwechsel: ' + [...offen].map(r => r.url()).join(', '));
      await page.waitForTimeout(50);
    }
  };
}

// Öffnet einen der sechs Bereiche. id: 'explore'|'world'|'games'|'labs'|'journeys'|'book'.
// Gibt den Playwright-Locator auf den Link in der Bereichsleiste zurück.
export function bereich(page, id) {
  const eintrag = BEREICHE.find(b => b.id === id);
  if (!eintrag) throw Error('Unbekannter Bereich: ' + id);
  return page.getByRole('navigation', {name: 'Bereiche', exact: true}).getByRole('link', {name: eintrag.wort, exact: true});
}

// Öffnet die Hilfe so, wie ein Kind sie findet. Der Kopf hat keinen Hilfe-Knopf mehr (Entwurf Phase 1):
// Am Handy steht „So geht’s“ auf der Startseite, sonst führt der Fuß hin („Für Eltern“, dann
// „So funktioniert die Lernwelt“). Gibt den Knopf zurück, der nach dem Schließen den Fokus bekommt.
export async function hilfeOeffnen(page) {
  const kurz = page.getByRole('button', {name: 'So geht’s', exact: true});
  if (await kurz.isVisible()) {
    await kurz.focus();
    await page.keyboard.press('Enter');
    return kurz;
  }
  const eltern = page.getByRole('contentinfo').getByRole('button', {name: 'Für Eltern', exact: true});
  await eltern.focus();
  await page.keyboard.press('Enter');
  await page.locator('.parent-guide').getByRole('button', {name: 'So funktioniert die Lernwelt', exact: true}).click();
  return eltern;
}

// Startet `vite preview` für einen gebauten Stand auf einem freien Port.
// Fertig ist der Server erst, wenn er sein eigenes Startsignal schreibt UND /world.json liefert.
// So kann ein alter Server auf demselben Port die Bereitschaft nicht vortäuschen.
export async function startPreview({dist = process.env.QA_DIST ?? 'dist', port} = {}) {
  port ??= await freePort();
  const child = spawn(process.execPath, ['tests/browser/preview-server.mjs'], {
    cwd: PROJECT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {...process.env, QA_PORT: String(port), QA_DIST: path.resolve(PROJECT, dist)},
  });
  running.add(child);
  child.once('exit', () => running.delete(child));
  let log = '';
  child.stdout.on('data', chunk => { log += chunk; });
  child.stderr.on('data', chunk => { log += chunk; });

  const base = 'http://127.0.0.1:' + port;
  const stop = () => new Promise(resolve => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve();
    child.once('exit', () => resolve());
    child.kill('SIGTERM');
  });

  for (let attempt = 0; attempt < 46; attempt++) {
    if (child.exitCode !== null) throw Error('Vorschau-Server hat sich beendet:\n' + log);
    if (log.includes('WK_PREVIEW_READY ' + port) && await answers(base + '/world.json')) return {base, port, stop};
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  await stop();
  throw Error('Vorschau-Server antwortet nicht:\n' + log);
}

// Öffnet die Startseite in einem frischen Kontext, wartet auf Bereitschaft und ruft `fn(page)` auf.
// `isMobile` kennt nur Chromium; andere Engines bekommen bei Touch nur `hasTouch`.
export async function withPage(ctx, {width, height, touch = false}, fn) {
  const context = await ctx.browser.newContext({
    viewport: {width, height},
    reducedMotion: 'reduce',
    ...(touch ? {hasTouch: true} : {}),
    ...(touch && ctx.engine === 'chromium' ? {isMobile: true} : {}),
  });
  try {
    const page = await context.newPage();
    ctx.monitor(page);
    await page.goto(ctx.base);
    await ready(page);
    await fn(page);
  } finally {
    await context.close();
  }
}

const running = new Set();
process.once('exit', () => { for (const child of running) child.kill('SIGTERM'); });

// Ein freier Port für Suiten, die einen eigenen Testserver starten.
export function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const {port} = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function answers(url) {
  try {
    return (await fetch(url, {signal: AbortSignal.timeout(1300)})).ok;
  } catch {
    return false;
  }
}
