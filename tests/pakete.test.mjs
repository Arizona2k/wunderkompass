// Wächter: Jedes Paket steht exakt gepinnt in package.json (CLAUDE.md, „Neue Pakete: … exakt gepinnt“).
// Fängt ^, ~, *, latest, >=, 1.x und Bereiche. Peer-Angaben bleiben außen vor; das Lockfile prüft
// `pnpm install --frozen-lockfile` in der CI.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const exakt = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;

test('alle Pakete sind exakt gepinnt', () => {
  for (const feld of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, version] of Object.entries(pkg[feld] ?? {})) {
      assert.match(version, exakt, `${feld}: ${name} steht auf „${version}“ statt auf einer exakten Version`);
    }
  }
});
