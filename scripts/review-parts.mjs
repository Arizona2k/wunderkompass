import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

// A transport boundary only. Original curation, captures and quality gates stay
// in review-evidence.mjs. The bound includes worst-case deflate and ZIP headers.
export const REVIEW_PART_LIMIT = 200 * 1024 * 1024;
export const ZIP_FOOTER_RESERVE = 65536;
export const sha256 = data => createHash('sha256').update(data).digest('hex');
const digestPattern = /^[a-f0-9]{64}$/;
export function reviewPath(name) {
  if (typeof name !== 'string' || !name || name.includes('\\') || /[\x00-\x1f:*?"<>|]/.test(name) || name.startsWith('/') || name.split('/').some(p => !p || p === '.' || p === '..')) throw Error('Unsafe review path');
  return name;
}
export function zipEntryBound(file) {
  reviewPath(file.path);
  const n = file.bytes;
  if (!Number.isSafeInteger(n) || n < 0 || !digestPattern.test(file.sha256)) throw Error('Invalid review file metadata');
  // zlib compressBound, then ample local/central/ZIP64/Unicode header space.
  return n + Math.floor(n / 4096) + Math.floor(n / 16384) + Math.floor(n / 33554432) + 13 + 1024 + 2 * Buffer.byteLength(file.path);
}
export function planReviewParts(files, limitBytes = REVIEW_PART_LIMIT) {
  if (!Number.isSafeInteger(limitBytes) || limitBytes <= ZIP_FOOTER_RESERVE || limitBytes > REVIEW_PART_LIMIT || !files.length) throw Error('Invalid or empty review transport');
  const sorted = [...files].sort((a, b) => Buffer.compare(Buffer.from(a.path), Buffer.from(b.path)));
  if (new Set(sorted.map(f => f.path)).size !== sorted.length) throw Error('Duplicate review path');
  const parts = [];
  for (const file of sorted) {
    const bound = zipEntryBound(file);
    if (bound + ZIP_FOOTER_RESERVE > limitBytes) throw Error('Single original exceeds transport boundary; originals retained: ' + file.path);
    let part = parts.at(-1);
    if (!part || part.maximumZIPBytes + bound > limitBytes) {
      part = {number: parts.length + 1, maximumZIPBytes: ZIP_FOOTER_RESERVE, files: []};
      parts.push(part);
    }
    part.files.push({...file});
    part.maximumZIPBytes += bound;
  }
  return parts;
}
export async function inventoryReview(root) {
  root = path.resolve(root);
  const rows = [];
  async function walk(relative = '') {
    for (const entry of await fs.readdir(path.join(root, relative), {withFileTypes: true})) {
      const name = relative ? relative + '/' + entry.name : entry.name;
      reviewPath(name);
      const file = path.join(root, name), before = await fs.lstat(file, {bigint: true});
      if (before.isSymbolicLink()) throw Error('Review symlink is not an original: ' + name);
      if (before.isDirectory()) { await walk(name); continue; }
      if (!before.isFile()) throw Error('Nonregular review original: ' + name);
      const hash = createHash('sha256');
      for await (const chunk of createReadStream(file)) hash.update(chunk);
      const after = await fs.lstat(file, {bigint: true});
      for (const key of ['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs']) if (before[key] !== after[key]) throw Error('Review original changed while hashing: ' + name);
      rows.push({path: name, bytes: Number(before.size), sha256: hash.digest('hex')});
    }
  }
  await walk();
  return rows.sort((a, b) => Buffer.compare(Buffer.from(a.path), Buffer.from(b.path)));
}
async function optionalJSON(root, name) {
  try { return JSON.parse(await fs.readFile(path.join(root, name), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
export async function prepareReviewParts({root, staging, name, runId, attempt, repository, limitBytes = REVIEW_PART_LIMIT}) {
  if (!/^browser-evidence-[0-9]+-[0-9]+$/.test(name) || name !== `browser-evidence-${runId}-${attempt}` || !/^[0-9]+$/.test(runId) || !/^[0-9]+$/.test(attempt) || !/^[\w.-]+\/[\w.-]+$/.test(repository)) throw Error('Invalid artifact run identity');
  root = path.resolve(root); staging = path.resolve(staging);
  if (staging === root || staging.startsWith(root + path.sep) || root.startsWith(staging + path.sep)) throw Error('Original and transport directories overlap');
  const files = await inventoryReview(root), parts = planReviewParts(files, limitBytes);
  const context = await optionalJSON(root, 'ci-context.json'), review = await optionalJSON(root, 'review-manifest.json');
  if (context && (context.runId !== runId || context.attempt !== attempt || context.repository !== repository)) throw Error('Review context is from a different native run');
  await fs.mkdir(staging); // Existing output is an error, never overwrite evidence.
  for (const part of parts) {
    part.name = name + '-part-' + String(part.number).padStart(3, '0');
    const directory = path.join(staging, 'part-' + String(part.number).padStart(3, '0'));
    await fs.mkdir(directory);
    for (const row of part.files) {
      const dest = path.join(directory, row.path);
      await fs.mkdir(path.dirname(dest), {recursive: true});
      await fs.link(path.join(root, row.path), dest);
    }
  }
  // Hard links consume no second payload copy; verify every staged byte too.
  for (const part of parts) {
    const directory = path.join(staging, 'part-' + String(part.number).padStart(3, '0'));
    if (JSON.stringify(await inventoryReview(directory)) !== JSON.stringify(part.files)) throw Error('Staged review bytes differ from originals');
  }
  return {schemaVersion: 1, kind: 'wunderkompass-original-review-parts', name, runId, attempt, repository, limitBytes, sourceDigest: review?.sourceDigest ?? null, build: review?.build ?? null, reviewStatus: review?.status ?? 'missing-review-manifest', context, files: files.length, originalBytes: files.reduce((n, f) => n + f.bytes, 0), parts, complete: false, meaning: 'Lossless transport only. Native run conclusion, original semantic/visual acceptance and every existing quality gate must be verified independently.'};
}
