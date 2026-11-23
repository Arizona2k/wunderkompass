// Wächter für die Gruppen der Vollprüfung (tests/browser/shards.mjs und quality.yml):
// Jede Suite läuft je Browser in genau einer Gruppe, und die CI startet genau diese Gruppen.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import test from 'node:test';
import {SUITES} from './browser/suites.mjs';
import {REST, SHARDS, shardsOf, suitesInShard} from './browser/shards.mjs';

const ENGINES = ['chromium', 'firefox', 'webkit'];
// Die Vollprüfung läuft alle Stufen (run.mjs, LEVELS.full).
const VOLL = SUITES.filter(suite => ['smoke', 'ci', 'full'].includes(suite.set));
const laeuftIn = (engine, suite) => engine === 'chromium' || !suite.chromiumOnly;

test('jede Suite der Vollprüfung läuft je Browser in genau einer Gruppe', () => {
  assert.deepEqual(Object.keys(SHARDS).sort(), [...ENGINES].sort(), 'Gruppen für genau diese Browser');
  for (const engine of ENGINES) {
    const bekannt = new Set(VOLL.filter(suite => laeuftIn(engine, suite)).map(suite => suite.name));
    for (const [gruppe, namen] of Object.entries(SHARDS[engine])) {
      assert.notEqual(gruppe, REST, engine + ': „rest“ ergibt sich von selbst und steht nicht in der Liste');
      assert.ok(namen.length, engine + '/' + gruppe + ': leere Gruppe');
      for (const name of namen) assert.ok(bekannt.has(name), engine + '/' + gruppe + ': ' + name + ' ist keine Suite der Vollprüfung in ' + engine);
    }
    const verteilt = shardsOf(engine).flatMap(gruppe => suitesInShard(engine, gruppe, VOLL).filter(suite => laeuftIn(engine, suite)).map(suite => suite.name));
    const doppelt = verteilt.filter((name, index) => verteilt.indexOf(name) !== index);
    assert.deepEqual(doppelt, [], engine + ': Suiten in mehr als einer Gruppe');
    assert.deepEqual([...verteilt].sort(), [...bekannt].sort(), engine + ': jede Suite genau einmal');
  }
});

test('die CI startet genau die Gruppen aus shards.mjs', () => {
  const ci = fs.readFileSync(new URL('../.github/workflows/quality.yml', import.meta.url), 'utf8');
  const voll = ci.slice(ci.indexOf('\n  full:'));
  const gestartet = [...voll.matchAll(/- \{browser: ([\w-]+), shard: ([\w-]+)\}/g)].map(([, engine, gruppe]) => engine + '/' + gruppe);
  const erwartet = ENGINES.flatMap(engine => shardsOf(engine).map(gruppe => engine + '/' + gruppe));
  assert.deepEqual(gestartet.sort(), erwartet.sort());
  assert.match(voll, /--browser \$\{\{ matrix\.browser \}\} --shard \$\{\{ matrix\.shard \}\}/, 'der Job reicht seine Gruppe an den Runner');
  assert.match(voll, /name: Vollprüfung \(\$\{\{ matrix\.browser \}\} \$\{\{ matrix\.shard \}\}\)/, 'Jobname nennt Browser und Gruppe');
});

test('der Runner nimmt eine Gruppe nur mit --suite full und einem Browser an', () => {
  const run = args => spawnSync(process.execPath, ['tests/browser/run.mjs', ...args], {
    cwd: new URL('..', import.meta.url), encoding: 'utf8', timeout: 60000,
  });
  const alle = run(['--suite', 'full', '--browser', 'all', '--shard', 'rest']);
  assert.equal(alle.status, 2, alle.stdout + alle.stderr);
  assert.match(alle.stderr, /--shard ist nur mit --suite full und einem einzelnen --browser erlaubt/);
  const unbekannt = run(['--suite', 'full', '--browser', 'firefox', '--shard', 'kern']);
  assert.equal(unbekannt.status, 2, unbekannt.stdout + unbekannt.stderr);
  assert.match(unbekannt.stderr, /Unbekannte Gruppe kern für firefox \(bekannt: rest\)/);
});
