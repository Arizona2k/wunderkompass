import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {learningFingerprint, learningInputs} from '../build/learning-fingerprint.mjs';
import {fallbackPredecessors, withFallbackPredecessorRuntime} from './fallback-predecessor-reference.mjs';
import fixture from './fixtures/fallback-runtime-predecessor.json' with {type: 'json'};

const root = process.cwd();
const dossiers = JSON.parse(fs.readFileSync('content/editorial-reviews.json', 'utf8')).dossiers;

test('fallback correction preserves all623 original runtime files and all254 whole dossiers', () => {
  assert.equal(learningFingerprint(root), fixture.currentRuntimeBuild);
  withFallbackPredecessorRuntime(root, previous => {
    assert.equal(learningInputs(previous).length, 623);
    assert.equal(learningFingerprint(previous), fixture.previousRuntimeBuild);
    assert.equal(fs.readFileSync(previous + '/app/globe.tsx', 'utf8'), fixture.replacedInputs[0].originalUTF8);
  });
  assert.equal(fallbackPredecessors(dossiers).length, 254);
});

test('fallback predecessor rejects a modified whole original renderer body', () => {
  const change = fixture.replacedInputs[0], original = change.originalUTF8;
  try {
    change.originalUTF8 += '\n';
    assert.throws(() => withFallbackPredecessorRuntime(root, () => assert.fail('tampered predecessor accepted')));
  } finally { change.originalUTF8 = original; }
});

test('fallback predecessor rejects altered factual content and unproved UI history', () => {
  const changed = structuredClone(dossiers);
  changed[0].unprovedClaim = 'not the original content';
  assert.throws(() => fallbackPredecessors(changed));
  const changedHistory = structuredClone(dossiers);
  changedHistory[0][fixture.historyField] = {route: '#home'};
  assert.throws(() => fallbackPredecessors(changedHistory));
});
