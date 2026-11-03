import {naturePredecessors,withNaturePreRetainedRuntime} from './nature-predecessor-reference.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {learningInputs, learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/retained-ecology-runtime-predecessor.json' with {type:'json'};

const sha = b => createHash('sha256').update(b).digest('hex');
const whole = value => sha(JSON.stringify(value));
const history = 'historicalUIBeforeRetained20261102';
export const RETAINED_CURRENT_RUNTIME = fixture.currentRuntimeBuild;

export function retainedPredecessors(items) {
  items=naturePredecessors(items);
  if (items.length < 203) return items; // Older exact layers verify their own input.
  const expected = [...fixture.whole203PredecessorDossiers, ...fixture.new17ContentOnlyBeforeActualUI];
  if (items.length === 203) {
    assert.deepEqual(items.map(row => ({id: row.id, sha256: whole(row)})), fixture.whole203PredecessorDossiers.map(({ui, ...row}) => row));
    return items;
  }
  assert.equal(items.length, 220);
  assert.deepEqual(items.map(row => row.id), expected.map(row => row.id));
  assert.equal(new Set(items.map(row => row.id)).size, 220);
  const file = new URL('./fixtures/editorial-before-retained-203.json', import.meta.url);
  const qualified = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
  const restored = items.map((row, index) => {
    const original = structuredClone(row);
    if (qualified) {
      assert.deepEqual(row.ui, {...qualified.currentTemplate, route: expected[index].ui?.route ?? qualified.addedDossiers[index - 203]?.route});
      if (index < 203) { assert.deepEqual(row[history], expected[index].ui); original.ui = original[history]; delete original[history]; }
      else { assert(!Object.hasOwn(row, history)); delete original.ui; }
    } else {
      assert(!Object.hasOwn(row, history), 'no premature retained UI history');
      if (index >= 203) assert(!Object.hasOwn(row, 'ui'), 'no invented current full UI');
    }
    assert.equal(whole(original), expected[index].sha256, row.id + ' entire original dossier/content-only study retained');
    return original;
  });
  return restored.slice(0, 203);
}

export function withEcologyPreRetainedRuntime(root, inspect) {return withNaturePreRetainedRuntime(root,prior=>originalWithEcologyPreRetainedRuntime(prior,inspect));}
function originalWithEcologyPreRetainedRuntime(root, inspect) {
  const actual = learningFingerprint(root);
  if (actual !== fixture.currentRuntimeBuild) return inspect(root); // Original inner predicates still reject unknown older builds.
  const current = new Map(learningInputs(root).map(file => [path.relative(root, file), file]));
  const expected = [...fixture.predecessorInputs, ...fixture.addedInputs];
  assert.deepEqual(new Set(current.keys()), new Set(expected.map(row => row.name)), 'all new runtime inputs enumerated');
  const replaced = new Map(fixture.replacedInputs.map(row => [row.name, row]));
  for (const row of fixture.predecessorInputs) {
    const replacement = replaced.get(row.name);
    assert.equal(sha(fs.readFileSync(current.get(row.name))), replacement?.currentSHA256 ?? row.sha256, row.name + ' entire current runtime');
    if (replacement) { assert.equal(sha(replacement.originalUTF8), row.sha256); assert.equal(replacement.originalSHA256, row.sha256); }
  }
  for (const row of fixture.addedInputs) assert.equal(sha(fs.readFileSync(current.get(row.name))), row.sha256, row.name);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wk-retained-reviewed-ecology-'));
  try {
    for (const row of fixture.predecessorInputs) {
      const target = path.join(temp, row.name); fs.mkdirSync(path.dirname(target), {recursive: true});
      const prior = replaced.get(row.name);
      if (prior) fs.writeFileSync(target, prior.originalUTF8);
      else { try { fs.linkSync(current.get(row.name), target); } catch (error) { if (error.code !== 'EXDEV') throw error; fs.copyFileSync(current.get(row.name), target); } }
    }
    assert.equal(learningFingerprint(temp), fixture.predecessorRuntimeBuild, 'actual confirmed M88 recomputed from all564 original inputs');
    return inspect(temp);
  } finally { fs.rmSync(temp, {recursive: true, force: false}); }
}
