// Startet die Browser-Suiten gegen einen gebauten Stand.
// Aufruf: node tests/browser/run.mjs --suite smoke|ci|full [--browser chromium|firefox|webkit|all] [--jobs N] [--base URL] [name …]
//   --suite   smoke = nur Rauchtest; ci = smoke + ci; full = smoke + ci + full
//   --jobs    so viele Suiten laufen gleichzeitig im selben Browser; solo-Suiten danach allein
//   --base    nur mit --suite smoke: eine schon laufende Adresse prüfen, kein eigener Server
//   name …    nur diese Suiten
// Umgebung: QA_DIST (anderer Build-Ordner), QA_PLAYWRIGHT_MODULE, QA_BROWSER_EXECUTABLE (nur Chromium).

// Zuerst die Lade-Hooks: Browser-Module importieren App-Dateien mit endungslosen .ts-Importen.
await import('../../scripts/test-runtime.mjs');
const {SUITES} = await import('./suites.mjs');
const {PROJECT, ready, startPreview} = await import('./harness.mjs');
const {browserErrorArrays, browserErrorsComplete, BROWSER_ERROR_FIELDS, monitorBrowserErrors} = await import('../../scripts/browser-errors.mjs');
const fs = await import('node:fs/promises');
const {existsSync} = await import('node:fs');
const path = await import('node:path');

const LEVELS = {smoke: ['smoke'], ci: ['smoke', 'ci'], full: ['smoke', 'ci', 'full']};
const ENGINES = ['chromium', 'firefox', 'webkit'];

const options = parseArguments(process.argv.slice(2));
const suites = selectSuites(options);
const engines = options.browser === 'all' ? ENGINES : [options.browser];

if (!options.base) {
  const dist = path.resolve(PROJECT, process.env.QA_DIST ?? 'dist');
  if (!existsSync(path.join(dist, 'index.html'))) stop(`Erst pnpm run build ausführen (${dist}/index.html fehlt).`);
}

const playwright = await import(process.env.QA_PLAYWRIGHT_MODULE ?? 'playwright');
const server = options.base ? null : await startPreview();
const base = options.base ?? server.base;
let failed = 0;
try {
  for (const engine of engines) failed += await runEngine(engine);
} finally {
  await server?.stop();
}
console.log(failed ? `${failed} Suite(n) fehlgeschlagen.` : 'Alle Suiten bestanden.');
process.exit(failed ? 1 : 0);

async function runEngine(engine) {
  const browserType = playwright[engine];
  const launchOptions = {
    headless: true,
    timeout: 26000,
    ...(engine === 'chromium' ? {args: ['--enable-unsafe-swiftshader']} : {}),
    ...(engine === 'chromium' && process.env.QA_BROWSER_EXECUTABLE ? {executablePath: process.env.QA_BROWSER_EXECUTABLE} : {}),
  };
  const runnable = [];
  for (const suite of suites) {
    if (suite.chromiumOnly && engine !== 'chromium') console.log(`übersprungen ${suite.name} (nur Chromium) [${engine}]`);
    else runnable.push(suite);
  }
  if (!runnable.length) return 0;

  let browser;
  try {
    browser = await browserType.launch(launchOptions);
  } catch (error) {
    // Fehlt die Engine (zum Beispiel lokal kein Firefox), zählen ihre Suiten als fehlgeschlagen.
    for (const suite of runnable) console.log(`FAIL ${suite.name} 0.0 s [${engine}] – Browser startet nicht`);
    console.error(String(error.message).split('\n')[0].replace(/^/gm, '    '));
    return runnable.length;
  }
  if (engine === 'firefox') dropIsMobile(browser);
  try {
    const run = suite => runSuite(suite, {engine, browser, browserType, launchOptions});
    const parallel = await inLanes(runnable.filter(suite => !suite.solo), options.jobs, run);
    const solo = await inLanes(runnable.filter(suite => suite.solo), 1, run);
    return [...parallel, ...solo].filter(passed => !passed).length;
  } finally {
    await browser.close();
  }
}

async function runSuite(suite, {engine, browser, browserType, launchOptions}) {
  const report = {checks: [], ...browserErrorArrays()};
  const shots = path.join(PROJECT, '.qa-output', 'browser', engine, suite.name);
  await fs.rm(shots, {recursive: true, force: true});
  await fs.mkdir(shots, {recursive: true});
  const ctx = {
    engine, browser, browserType, launchOptions, base, ready, report, shots, startPreview,
    monitor: page => monitorBrowserErrors(page, base, report, {engine}),
  };

  const started = performance.now();
  let error = null;
  try {
    await suite.run(ctx);
    if (!browserErrorsComplete(report)) throw Error('Browserfehler während der Suite:\n' + describeBrowserErrors(report));
  } catch (caught) {
    error = caught;
  }
  const seconds = ((performance.now() - started) / 1000).toFixed(1);
  console.log(`${error ? 'FAIL' : 'PASS'} ${suite.name} ${seconds} s [${engine}]`);
  if (error) console.error(String(error.stack ?? error).replace(/^/gm, '    '));
  return !error;
}

// Führt `work` für alle Einträge aus, höchstens `limit` gleichzeitig. Ergebnisse in Eingabereihenfolge.
async function inLanes(items, limit, work) {
  const results = [];
  let next = 0;
  const lane = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await work(items[index]);
    }
  };
  await Promise.all(Array.from({length: Math.min(limit, items.length)}, lane));
  return results;
}

// Firefox kennt `isMobile` nicht und bricht sonst ab. Touch bleibt über `hasTouch` erhalten.
function dropIsMobile(browser) {
  for (const method of ['newContext', 'newPage']) {
    const original = browser[method].bind(browser);
    browser[method] = (settings = {}) => {
      const supported = {...settings};
      delete supported.isMobile;
      return original(supported);
    };
  }
}

function describeBrowserErrors(report) {
  return BROWSER_ERROR_FIELDS.filter(field => report[field].length)
    .map(field => `  ${field}: ${JSON.stringify(report[field].slice(0, 5))}${report[field].length > 5 ? ` (+${report[field].length - 5})` : ''}`)
    .join('\n');
}

function parseArguments(args) {
  const parsed = {suite: null, browser: 'chromium', jobs: 1, base: null, names: []};
  const values = args.filter(arg => arg !== '--');
  for (let index = 0; index < values.length; index++) {
    const arg = values[index];
    if (arg === '--suite') parsed.suite = values[++index];
    else if (arg === '--browser') parsed.browser = values[++index];
    else if (arg === '--jobs') parsed.jobs = Number(values[++index]);
    else if (arg === '--base') parsed.base = values[++index];
    else if (arg.startsWith('-')) stop(`Unbekannte Option ${arg}`);
    else parsed.names.push(arg);
  }
  if (!LEVELS[parsed.suite]) stop('--suite muss smoke, ci oder full sein.');
  if (![...ENGINES, 'all'].includes(parsed.browser)) stop('--browser muss chromium, firefox, webkit oder all sein.');
  if (!Number.isInteger(parsed.jobs) || parsed.jobs < 1) stop('--jobs muss eine ganze Zahl ab 1 sein.');
  if (parsed.base && parsed.suite !== 'smoke') stop('--base ist nur mit --suite smoke erlaubt.');
  if (parsed.base) parsed.base = new URL(parsed.base).href.replace(/\/$/, '');
  return parsed;
}

function selectSuites({suite, names}) {
  const sets = LEVELS[suite];
  const unknown = names.filter(name => !SUITES.some(entry => entry.name === name && sets.includes(entry.set)));
  if (unknown.length) stop(`Unbekannte Suite für --suite ${suite}: ${unknown.join(', ')}`);
  const selected = SUITES.filter(entry => sets.includes(entry.set) && (!names.length || names.includes(entry.name)));
  if (!selected.length) stop('Keine Suite ausgewählt.');
  return selected;
}

function stop(message) {
  console.error(message);
  process.exit(2);
}
