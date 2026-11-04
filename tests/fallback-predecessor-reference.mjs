import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {learningInputs, learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/fallback-runtime-predecessor.json' with {type: 'json'};

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const whole = row => sha(JSON.stringify(row));

// A technical renderer qualification must preserve each entire earlier dossier.
export function fallbackPredecessors(items) {
  if (items.length < 254) return items;
  const previous = fixture.whole254PreviousDossiers;
  assert.equal(items.length, 254);
  assert.deepEqual(items.map(row => row.id), previous.map(row => row.id));
  const file = new URL('./fixtures/editorial-before-fallback-254.json', import.meta.url);
  const qualified = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
  return items.map((row, index) => {
    const original = structuredClone(row);
    if (qualified) {
      assert.deepEqual(row.ui, {...qualified.currentTemplate, route: previous[index].ui.route});
      assert.deepEqual(row[fixture.historyField], previous[index].ui);
      original.ui = original[fixture.historyField];
      delete original[fixture.historyField];
    } else {
      assert(!Object.hasOwn(row, fixture.historyField), 'no premature fallback UI qualification history');
    }
    assert.equal(whole(original), previous[index].sha256, 'whole original M90 dossier: ' + row.id);
    return original;
  });
}

// Only this exact, fully enumerated renderer correction has this predecessor.
// Unknown sources still reach (and fail) the unchanged inner historical checks.
export function withFallbackPredecessorRuntime(root, inspect) {
  if (learningFingerprint(root) !== fixture.currentRuntimeBuild) return inspect(root);
  const current = new Map(learningInputs(root).map(file => [path.relative(root, file), file]));
  const changes = new Map(fixture.replacedInputs.map(row => [row.name, row]));
  assert.equal(fixture.previousInputs.length, 623);
  assert.deepEqual([...changes.keys()], ['app/globe.tsx']);
  assert.deepEqual(new Set(current.keys()), new Set(fixture.previousInputs.map(row => row.name)));
  for (const row of fixture.previousInputs) {
    const change = changes.get(row.name);
    const bytes = fs.readFileSync(current.get(row.name));
    assert.equal(sha(bytes), change?.currentSHA256 ?? row.sha256, row.name + ' whole current runtime');
    assert.equal(bytes.length, change?.currentBytes ?? row.bytes, row.name + ' current bytes');
    if (change) {
      assert.equal(sha(change.originalUTF8), row.sha256);
      assert.equal(change.originalSHA256, row.sha256);
      assert.equal(Buffer.byteLength(change.originalUTF8), row.bytes);
    }
  }
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wk-fallback-whole-M90-'));
  try {
    for (const row of fixture.previousInputs) {
      const target = path.join(temp, row.name);
      fs.mkdirSync(path.dirname(target), {recursive: true});
      const change = changes.get(row.name);
      if (change) fs.writeFileSync(target, change.originalUTF8);
      else {
        try { fs.linkSync(current.get(row.name), target); }
        catch (error) { if (error.code !== 'EXDEV') throw error; fs.copyFileSync(current.get(row.name), target); }
      }
    }
    assert.equal(learningFingerprint(temp), fixture.previousRuntimeBuild, 'all623 original M90 runtime files reconstructed');
    return inspect(temp);
  } finally { fs.rmSync(temp, {recursive: true, force: false}); }
}
