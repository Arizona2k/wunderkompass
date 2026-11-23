// Startet die Browser-Suiten gegen einen gebauten Stand.
// Aufruf: node tests/browser/run.mjs --suite smoke|ci|full [--browser chromium|firefox|webkit|all] [--jobs N] [--base URL] [--shard NAME] [name …]
//   --suite   smoke = nur Rauchtest; ci = smoke + ci; full = smoke + ci + full
//   --jobs    so viele Suiten laufen gleichzeitig im selben Browser; solo-Suiten danach allein
//   --base    nur mit --suite smoke: eine schon laufende Adresse prüfen, kein eigener Server
//   --shard   nur mit --suite full und einem Browser: eine Gruppe aus shards.mjs (CI-Job „Vollprüfung“)
//   name …    nur diese Suiten
// Am Ende steht eine Zeiten-Datei in .qa-output/browser/zeiten-<suite>-<browser>[-<gruppe>].json.
// Umgebung: QA_DIST (anderer Build-Ordner), QA_PLAYWRIGHT_MODULE, QA_BROWSER_EXECUTABLE (nur Chromium).

// Zuerst die Lade-Hooks: Browser-Module importieren App-Dateien mit endungslosen .ts-Importen.
await import('../../scripts/test-runtime.mjs');
const {SUITES} = await import('./suites.mjs');
const {shardsOf, suitesInShard} = await import('./shards.mjs');
const {PROJECT, newReport, ready, startPreview} = await import('./harness.mjs');
const {browserErrorsComplete, browserErrorsSettled, BROWSER_ERROR_FIELDS, meldeBildabbrueche, monitorBrowserErrors} = await import('../../scripts/browser-errors.mjs');
const fs = await import('node:fs/promises');
const {existsSync} = await import('node:fs');
const path = await import('node:path');

// Ältere Testmodule lesen dist/ und build/ relativ zum Arbeitsordner.
process.chdir(PROJECT);

const LEVELS = {smoke: ['smoke'], ci: ['smoke', 'ci'], full: ['smoke', 'ci', 'full']};
const ENGINES = ['chromium', 'firefox', 'webkit'];

const options = parseArguments(process.argv.slice(2));
const suites = selectSuites(options);
const engines = options.browser === 'all' ? ENGINES : [options.browser];
if (!engines.some(engine => suites.some(suite => engine === 'chromium' || !suite.chromiumOnly))) {
  stop(`Keine der gewählten Suiten läuft in ${engines.join(', ')} (nur Chromium).`);
}

if (!options.base) {
  const dist = path.resolve(PROJECT, process.env.QA_DIST ?? 'dist');
  if (!existsSync(path.join(dist, 'index.html'))) stop(`Erst pnpm run build ausführen (${dist}/index.html fehlt).`);
}

const playwright = await import(process.env.QA_PLAYWRIGHT_MODULE ?? 'playwright');
const server = options.base ? null : await startPreview();
const base = options.base ?? server.base;
const times = [];
// Jeder erwartete Firefox-Bildabbruch (Regeln in scripts/browser-errors.mjs) erscheint im Log, am Ende als Summe.
// So fällt auf, wenn eine Regel plötzlich oft greift. Bei --jobs > 1 steht die Zeile nicht sicher bei ihrer Suite.
const bildabbrueche = new Map();
meldeBildabbrueche(({phase, url}) => {
  bildabbrueche.set(phase, (bildabbrueche.get(phase) ?? 0) + 1);
  console.log(`  erwarteter Firefox-Bildabbruch (${phase}): ${new URL(url).pathname}`);
});
const runStarted = performance.now();
let failed = 0;
try {
  for (const engine of engines) failed += await runEngine(engine);
} finally {
  await server?.stop();
}
await writeTimes();
if (bildabbrueche.size) console.log('Erwartete Firefox-Bildabbrüche: ' + [...bildabbrueche].map(([phase, anzahl]) => `${phase} ${anzahl}`).join(', '));
console.log(failed ? `${failed} Suite(n) fehlgeschlagen.` : 'Alle Suiten bestanden.');
process.exit(failed ? 1 : 0);

async function runEngine(engine) {
  const browserType = playwright[engine];
  const launchOptions = {
    headless: true,
    timeout: 26000,
    // Ohne UTF-8-Gebietsschema (z. B. LANG leer im Container) verwirft Chromium Dateipfade mit Umlauten
    // beim Hochladen still; Testdateien wie „…-Früher-…json“ kämen dann nie in der App an.
    env: {...process.env, LANG: process.env.LANG || 'C.UTF-8'},
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
    for (const suite of runnable) {
      console.log(`FAIL ${suite.name} 0.0 s [${engine}] – Browser startet nicht`);
      times.push({name: suite.name, browser: engine, sekunden: 0, bestanden: false});
    }
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
  const report = newReport();
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
    await browserErrorsSettled(report);
    if (!browserErrorsComplete(report)) throw Error('Browserfehler während der Suite:\n' + describeBrowserErrors(report));
  } catch (caught) {
    error = caught;
  }
  const seconds = ((performance.now() - started) / 1000).toFixed(1);
  console.log(`${error ? 'FAIL' : 'PASS'} ${suite.name} ${seconds} s [${engine}]`);
  times.push({name: suite.name, browser: engine, sekunden: Number(seconds), bestanden: !error});
  if (error) console.error(String(error.stack ?? error).replace(/^/gm, '    '));
  // Scheitert ein Ablauf an einem Zeitlimit, steht die Ursache oft schon in den Browserfehlern.
  if (error && !String(error.message).startsWith('Browserfehler') && !browserErrorsComplete(report)) {
    console.error('    Dazu Browserfehler während der Suite:\n' + describeBrowserErrors(report));
  }
  return !error;
}

// Dauer je Suite für das Ausgleichen der Gruppen (shards.mjs); die CI lädt die Datei als Artefakt hoch.
async function writeTimes() {
  const name = ['zeiten', options.suite, options.browser, options.shard].filter(Boolean).join('-') + '.json';
  const file = path.join(PROJECT, '.qa-output', 'browser', name);
  const sekunden = Number(((performance.now() - runStarted) / 1000).toFixed(1));
  const data = {stufe: options.suite, browser: options.browser, gruppe: options.shard, jobs: options.jobs, sekunden, suiten: times};
  await fs.mkdir(path.dirname(file), {recursive: true});
  await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
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
  const parsed = {suite: null, browser: 'chromium', jobs: 1, base: null, shard: null, names: []};
  const values = args.filter(arg => arg !== '--');
  for (let index = 0; index < values.length; index++) {
    const arg = values[index];
    if (arg === '--suite') parsed.suite = values[++index];
    else if (arg === '--browser') parsed.browser = values[++index];
    else if (arg === '--jobs') parsed.jobs = Number(values[++index]);
    else if (arg === '--base') parsed.base = values[++index];
    else if (arg === '--shard') parsed.shard = values[++index];
    else if (arg.startsWith('-')) stop(`Unbekannte Option ${arg}`);
    else parsed.names.push(arg);
  }
  if (!LEVELS[parsed.suite]) stop('--suite muss smoke, ci oder full sein.');
  if (![...ENGINES, 'all'].includes(parsed.browser)) stop('--browser muss chromium, firefox, webkit oder all sein.');
  if (!Number.isInteger(parsed.jobs) || parsed.jobs < 1) stop('--jobs muss eine ganze Zahl ab 1 sein.');
  if (parsed.base && parsed.suite !== 'smoke') stop('--base ist nur mit --suite smoke erlaubt.');
  if (parsed.base) parsed.base = new URL(parsed.base).href.replace(/\/$/, '');
  if (parsed.shard !== null) {
    if (parsed.suite !== 'full' || parsed.browser === 'all') stop('--shard ist nur mit --suite full und einem einzelnen --browser erlaubt.');
    if (parsed.names.length) stop('--shard und Suitennamen gehen nicht zusammen.');
    if (!shardsOf(parsed.browser).includes(parsed.shard)) {
      stop(`Unbekannte Gruppe ${parsed.shard} für ${parsed.browser} (bekannt: ${shardsOf(parsed.browser).join(', ')}).`);
    }
  }
  return parsed;
}

function selectSuites({suite, names, browser, shard}) {
  const sets = LEVELS[suite];
  const unknown = names.filter(name => !SUITES.some(entry => entry.name === name && sets.includes(entry.set)));
  if (unknown.length) stop(`Unbekannte Suite für --suite ${suite}: ${unknown.join(', ')}`);
  let selected = SUITES.filter(entry => sets.includes(entry.set) && (!names.length || names.includes(entry.name)));
  if (shard) selected = suitesInShard(browser, shard, selected);
  if (!selected.length) stop('Keine Suite ausgewählt.');
  return selected;
}

function stop(message) {
  console.error(message);
  process.exit(2);
}
