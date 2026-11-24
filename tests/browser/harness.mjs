// Gemeinsame Bausteine für alle Browser-Suiten:
// Vorschau-Server starten, auf die fertige Seite warten, eine Seite in einem frischen Kontext öffnen.
import {spawn} from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {browserErrorArrays} from '../../scripts/browser-errors.mjs';
import {beobachteAnfragen, warteAufRuhe} from '../../scripts/seitenwechsel.mjs';
export {RUHEZEIT} from '../../scripts/seitenwechsel.mjs';
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

// Öffnet die Suche, tippt `text` und wartet, bis die Trefferliste zu dieser Eingabe gehört. Gibt den Dialog zurück.
// Zwei Wartepunkte (CI-Lauf 45344729398, WebKit, 24.11.2026):
// 1. Erst tippen, wenn die Kapiteltexte da sind. Sie kommen meist genau dann an, wenn das Suchfeld erscheint.
//    Fiel `fill` in diesen Moment, war das Feld danach leer (in der CI und 1-mal in rund 1000 Probeläufen;
//    warum genau, ist offen, siehe BACKLOG). Diesen Moment mit echtem Tippen prüft eigens
//    `tippenWaehrendKapiteltexteKommen` (portable-flows.mjs, CI-Satz, alle drei Browser).
// 2. Erst danach die Treffer lesen: Vorher stehen dort die Startideen (erste: lab:moon).
//    „Passende Entdeckungen“ erscheint nur über Treffern zu einer Eingabe.
export async function inSucheTippen(page, text) {
  await page.getByRole('button', {name: 'Lernwelt durchsuchen', exact: true}).click();
  const dialog = page.getByRole('dialog');
  const input = dialog.locator('input');
  await input.waitFor();
  await dialog.getByText('Kapiteltexte werden noch ergänzt …', {exact: true}).waitFor({state: 'detached'});
  await input.fill(text);
  await dialog.getByText('Passende Entdeckungen', {exact: true}).waitFor();
  if (await input.inputValue() !== text) throw new Error(`Suche: Eingabe ${JSON.stringify(text)} ist nicht im Suchfeld angekommen`);
  return dialog;
}

// Wartet vor einem Wechsel innerhalb der App (Klick auf einen Bereich, goBack, Wechsel der Ansicht), bis alle
// Ladeanfragen der Seite fertig sind (außer Seitenaufrufen): Bilder, Programmteile, Stile und Daten.
// Neuladen, goto und Schließen warten seit dem 24.11.2026 von selbst (scripts/seitenwechsel.mjs); dafür
// braucht es diese Hilfe nicht mehr. Aufruf: const anfragenFertig = ladeanfragen(page); … await anfragenFertig();
// oder gleich warten: await ladeanfragen(page)();
// Die Seite muss überwacht sein (ctx.monitor oder monitorBrowserErrors gleich nach newPage), sonst zählt sie erst ab hier.
export function ladeanfragen(page, {timeout} = {}) {
  beobachteAnfragen(page);
  return () => warteAufRuhe(page, {timeout});
}

// Klickt erst, wenn die Seite fertig geladen hat. Für Ziele, die nachgeladene Teile darüber noch verschieben
// können, vor allem den Fuß der Startseite. Playwright prüft nur beim Drücken, was unter dem Zeiger liegt.
// Rutscht das Ziel bis zum Loslassen weg, trifft das Loslassen etwas anderes, der Klick verpufft, und
// Playwright meldet trotzdem Erfolg (CI-Lauf 45397127026, Firefox, 24.11.2026).
export async function klickNachRuhe(locator) {
  await ladeanfragen(locator.page())();
  await locator.click();
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

// Init-Skript für einen Kontext: hält am Ende jedes Klicks fest, wo der Fokus liegt (`window.__fokusNachKlick`).
// Der Lauscher auf window läuft nach Reacts Lauscher an der Wurzel und, bei echten Eingaben, nach dessen Microtasks.
// So prüft ein Test „Fokus noch im Klick“, egal wie schnell der Rechner das nächste Bild zeichnet (Code-Prüfung flushSync, Befund 1).
// Zu Beginn jedes Klicks (Capture-Phase auf window, läuft zuerst) wird der Wert geleert: Hält ein Handler das Ereignis
// unterwegs an, bleibt kein alter Wert vom vorigen Klick stehen, und der Test wird rot statt still grün (Code-Nachprüfung Fokus-Tests, Befund 1).
export const FOKUS_NACH_KLICK = () => {
  window.addEventListener('click', () => { window.__fokusNachKlick = null; }, true);
  window.addEventListener('click', () => { window.__fokusNachKlick = document.activeElement; });
};

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
