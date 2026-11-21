// Gemeinsame Bausteine für alle Browser-Suiten:
// Vorschau-Server starten, auf die fertige Seite warten, eine Seite in einem frischen Kontext öffnen.
import {spawn} from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {browserErrorArrays} from '../../scripts/browser-errors.mjs';

export const PROJECT = fileURLToPath(new URL('../..', import.meta.url));

// Leerer Bericht für eine Suite. Ältere Abläufe schreiben in checks und views.
export function newReport() {
  return {checks: [], views: [], ...browserErrorArrays()};
}

// Die Seite ist bedienbar, sobald der Entdeckerpass-Knopf aktiv ist.
export function ready(page) {
  return page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor({timeout: 26000});
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
