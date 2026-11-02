import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {randomBytes, createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {inventoryReview, planReviewParts, prepareReviewParts, REVIEW_PART_LIMIT, ZIP_FOOTER_RESERVE, sha256} from '../scripts/review-parts.mjs';

test('native original volume grows into bounded ZIP parts with every file identity retained', () => {
  const files = Array.from({length: 41}, (_, i) => ({path: `original-${String(i).padStart(3, '0')}.png`, bytes: 19 * 1024 * 1024 + i, sha256: sha256(String(i))}));
  const parts = planReviewParts(files);
  assert.equal(parts.length, 5);
  assert.deepEqual(parts.flatMap(p => p.files), files);
  assert(parts.every(p => p.maximumZIPBytes <= REVIEW_PART_LIMIT && p.maximumZIPBytes > ZIP_FOOTER_RESERVE));
  assert.equal(planReviewParts(files.slice(0, 8)).length, 1);
  assert.throws(() => planReviewParts([...files, files[0]]), /Duplicate/);
  assert.throws(() => planReviewParts([{...files[0], bytes: REVIEW_PART_LIMIT}]), /Single original/);
  assert.throws(() => planReviewParts(files, REVIEW_PART_LIMIT + 1), /Invalid/);
  for (const name of ['../escape.png', '/absolute.png', 'dir/../escape', 'a\\b', 'file\nname', 'a:b', 'a//b']) assert.throws(() => planReviewParts([{...files[0], path: name}]), /Unsafe/);
});

test('actual binary, hidden and nested originals are staged losslessly without replacing source files', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'wk-review-parts-test-'));
  try {
    const root = path.join(tmp, 'review'); await fs.mkdir(root); await fs.mkdir(path.join(root, 'nested'));
    const context = {runId: '123', attempt: '2', repository: 'fixture/repo', head: 'a'.repeat(40)};
    const payloads = new Map([['.hidden', randomBytes(17000)], ['nested/ä-original.png', randomBytes(23000)], ['empty.xml', Buffer.alloc(0)], ['ci-context.json', Buffer.from(JSON.stringify(context))], ['review-manifest.json', Buffer.from(JSON.stringify({status: 'diagnostic', sourceDigest: 'b'.repeat(64), build: 'c'.repeat(16)}))]]);
    for (const [name, bytes] of payloads) await fs.writeFile(path.join(root, name), bytes);
    const before = await inventoryReview(root);
    const p = {root, staging: path.join(tmp, 'parts'), name: 'browser-evidence-123-2', runId: '123', attempt: '2', repository: 'fixture/repo', limitBytes: 96000};
    const index = await prepareReviewParts(p);
    assert.equal(index.complete, false); assert.equal(index.reviewStatus, 'diagnostic');
    assert.equal(index.files, payloads.size); assert(index.parts.length > 1);
    assert.deepEqual(await inventoryReview(root), before);
    for (const part of index.parts) for (const file of part.files) assert.deepEqual(await fs.readFile(path.join(p.staging, 'part-' + String(part.number).padStart(3, '0'), file.path)), payloads.get(file.path));
    await assert.rejects(() => prepareReviewParts(p), /EEXIST/);
    await assert.rejects(() => prepareReviewParts({...p, staging: path.join(root, 'nested', 'parts')}), /overlap/);
    await assert.rejects(() => prepareReviewParts({...p, attempt: '3', name: 'browser-evidence-123-3', staging: path.join(tmp, 'wrong-run')}), /different native run/);
    await fs.symlink(path.join(root, '.hidden'), path.join(root, 'link.png'));
    await assert.rejects(() => inventoryReview(root), /symlink/);
  } finally { await fs.rm(tmp, {recursive: true}); }
});

test('retrieved official multipart ZIP verification rejects incomplete, changed and wrong-context evidence', () => {
  const result = spawnSync('python3', ['-B', 'tests/review-parts-fixture.py'], {encoding: 'utf8', maxBuffer: 1024 * 1024});
  assert.equal(result.status, 0, result.stderr + result.stdout);
  const resultJSON = JSON.parse(result.stdout);
  assert.equal(resultJSON.actualSyntheticOriginalsVerified, 5);
  assert(resultJSON.rejectedCountercases >= 10);
});

test('bounded uploader keeps the exact already pinned official code and license bytes', async () => {
  const root = '.github/actions/upload-review-parts/vendor';
  const p = JSON.parse(await fs.readFile(path.join(root, 'provenance.json'), 'utf8'));
  assert.equal(p.revision, 'cf430e030ddbb5b0abf93d22962f4752f3646cd9');
  assert.equal(p.unmodified, true); assert.equal(p.version, '7.0.2'); assert.equal(p.files.length, 9);
  const entry = p.files.find(f => f.path === 'dist/upload/index.js');
  assert.equal(entry.sha, '7b3f92ae681d6eeca5f5e5e4cf892ad0dfb254ea');
  for (const row of p.files) {
    const b = await fs.readFile(path.join(root, row.path));
    assert.equal(b.length, row.size); assert.equal(sha256(b), row.sha256);
    assert.equal(createHash('sha1').update('blob ' + b.length + '\0').update(b).digest('hex'), row.sha);
  }
});
