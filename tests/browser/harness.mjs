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

// Ein gewolltes Neuladen, Schließen oder Weiterblättern bricht Anfragen ab, die noch laden
// (Chromium: net::ERR_ABORTED, Firefox: NS_BINDING_ABORTED), und die Fehlerüberwachung schlägt an.
// Auf einem langsamen Rechner wie der CI ist dieses Zeitfenster groß. Deshalb vorher warten, bis alle
// Ladeanfragen der Seite fertig sind (außer Seitenaufrufen): Bilder, aber auch Programmteile, Stile und
// Daten, die die App erst nachlädt. Ein Bild erscheint oft erst, wenn sein Programmteil da ist
// (im November 2026 `research`; zum Riff-Foto aus CI-Lauf 257 siehe Nachtrag).
// Jede echte Fehlanfrage bleibt in der Überwachung sichtbar.
// Nachtrag 23.11.2026: Die Firefox-Abbrüche des Riff-Fotos (Läufe 249 und 257, auch unten) kamen vermutlich nicht vom
// Seitenwechsel, sondern von Firefox' gespeicherter Kopie nach dem Neuladen (zweite Regel in scripts/browser-errors.mjs).
// Nötig bleibt die Wartehilfe für Chromium und nachgeladene Programmteile (CI-Befund Chromium: research, journeys, engine-journeys).
// Gleich nach newPage aufrufen: const anfragenFertig = ladeanfragen(page); … await anfragenFertig(); await page.reload();
export function ladeanfragen(page, {timeout = 20000} = {}) {
  return offeneAnfragen(page, request => !request.isNavigationRequest(), 'Anfragen laufen', timeout);
}

// Fertig erst nach einer Ruhezeit ohne Anfrage. Sie beginnt nach jeder Anfrage neu (Start oder Ende).
// React 19 hält das Einblenden nachgeladener Teile (lazy + Suspense) bis zu 300 ms nach dem Platzhalter
// zurück; erst danach starten deren Bilder. Vom Ende des Programmteils an sind das höchstens 300 ms, dazu
// kommt das Rendern auf einem langsamen Rechner. 500 ms lassen dafür Reserve. Die frühere Ruhezeit von
// 250 ms (nur Bilder, nur ab Aufruf gezählt) war kürzer als diese Sammelzeit.
export const RUHEZEIT = 500;

function offeneAnfragen(page, passt, was, timeout) {
  const offen = new Set();
  let zuletzt = 0;
  page.on('request', request => { if (passt(request)) { offen.add(request); zuletzt = Date.now(); } });
  const fertig = request => { if (offen.delete(request)) zuletzt = Date.now(); };
  page.on('requestfinished', fertig);
  page.on('requestfailed', fertig);
  return async () => {
    const aufruf = Date.now(), ende = aufruf + timeout;
    for (;;) {
      if (Date.now() > ende) {
        throw Error(offen.size
          ? was + ' noch vor dem gewollten Seitenwechsel: ' + [...offen].map(r => r.url()).join(', ')
          : 'Seite vor dem gewollten Seitenwechsel nicht zur Ruhe gekommen: immer neue Anfragen, oder sie zeichnet nicht mehr');
      }
      if (offen.size || Date.now() - Math.max(aufruf, zuletzt) < RUHEZEIT) { await page.waitForTimeout(50); continue; }
      // Zum Schluss zwei Bildwechsel der Seite abwarten: Erst beim Zeichnen entscheidet der Browser, ob ein
      // Bild mit loading="lazy" jetzt lädt. Ist die Seite gerade beschäftigt, wartet dieser Schritt auf sie.
      const vorher = zuletzt;
      const gezeichnet = await zweiBildwechsel(page, ende - Date.now());
      if (gezeichnet && !offen.size && zuletzt === vorher) return;
      if (!gezeichnet) await page.waitForTimeout(50);
    }
  };
}

// true, wenn die Seite zweimal gezeichnet hat. false, wenn sie gerade das Dokument wechselt oder bis zum
// Zeitlimit nicht zeichnet (z. B. offener Dialog): Dann versucht es die nächste Runde noch einmal.
async function zweiBildwechsel(page, rest) {
  let uhr;
  const zuSpaet = new Promise(fertig => { uhr = setTimeout(fertig, Math.max(0, Math.min(3000, rest)) + 50, false); });
  try {
    const gezeichnet = page.evaluate(() => new Promise(fertig => {
      const notfalls = setTimeout(fertig, 1000);
      requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(notfalls); fertig(); }));
    })).then(() => true);
    return await Promise.race([gezeichnet, zuSpaet]);
  } catch (error) {
    if (page.isClosed()) throw error;
    return false;
  } finally {
    clearTimeout(uhr);
  }
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
