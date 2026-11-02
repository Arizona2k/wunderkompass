import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {inventoryReview, prepareReviewParts, REVIEW_PART_LIMIT, sha256} from '../../../scripts/review-parts.mjs';

// The exact official v7.0.2 bundle already used by Quality, with its upstream
// license notices. No npm install, new credentials, permissions or service.
const here = path.dirname(fileURLToPath(import.meta.url));
const vendor = path.join(here, 'vendor');
const provenance = JSON.parse(await fs.readFile(path.join(vendor, 'provenance.json'), 'utf8'));
if (provenance.revision !== 'cf430e030ddbb5b0abf93d22962f4752f3646cd9' || provenance.unmodified !== true) throw Error('Unexpected official uploader origin');
if (provenance.files.length !== 9 || provenance.files.find(f => f.path === 'dist/upload/index.js')?.sha !== '7b3f92ae681d6eeca5f5e5e4cf892ad0dfb254ea') throw Error('Unexpected pinned official upload entry');
for (const row of provenance.files) {
  const data = await fs.readFile(path.join(vendor, row.path));
  if (data.length !== row.size || sha256(data) !== row.sha256 || createHash('sha1').update('blob ' + data.length + '\0').update(data).digest('hex') !== row.sha) throw Error('Changed pinned official uploader bytes');
}
const root = path.resolve('.qa-output/review'), staging = path.resolve('.qa-output/review-parts');
const runId = process.env.GITHUB_RUN_ID, attempt = process.env.GITHUB_RUN_ATTEMPT;
const name = `browser-evidence-${runId}-${attempt}`;
const index = await prepareReviewParts({root, staging, name, runId, attempt, repository: process.env.GITHUB_REPOSITORY});
const before = await inventoryReview(root);
async function upload(artifactName, directory, outputName) {
  const output = path.join(staging, outputName);
  await fs.writeFile(output, '', {flag: 'wx'});
  const child = spawn(process.execPath, [path.join(vendor, 'dist/upload/index.js')], {stdio: 'inherit', env: {...process.env, GITHUB_OUTPUT: output, INPUT_NAME: artifactName, INPUT_PATH: directory, 'INPUT_IF-NO-FILES-FOUND': 'error', 'INPUT_INCLUDE-HIDDEN-FILES': 'true', 'INPUT_RETENTION-DAYS': '7', 'INPUT_COMPRESSION-LEVEL': '6', INPUT_ARCHIVE: 'true', INPUT_OVERWRITE: 'false'}});
  const code = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', resolve); });
  if (code !== 0) throw Error('Official original upload failed: ' + artifactName);
  const raw = await fs.readFile(output, 'utf8');
  // @actions/core writes outputs with randomly delimited multiline records.
  const parsed = {};
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^([^=<]+)<<(.+)$/);
    if (match) { const values = []; while (++i < lines.length && lines[i] !== match[2]) values.push(lines[i]); if (i === lines.length) throw Error('Truncated official uploader output'); parsed[match[1]] = values.join('\n'); }
    else { const eq = lines[i].indexOf('='); if (eq > 0) parsed[lines[i].slice(0, eq)] = lines[i].slice(eq + 1); }
  }
  if (!/^[0-9]+$/.test(parsed['artifact-id']) || !/^[a-f0-9]{64}$/.test(parsed['artifact-digest']) || !parsed['artifact-url']?.startsWith('https://github.com/' + process.env.GITHUB_REPOSITORY + '/actions/runs/' + runId + '/')) throw Error('Missing native artifact receipt');
  return {id: parsed['artifact-id'], digest: parsed['artifact-digest'], url: parsed['artifact-url']};
}
try {
  for (const part of index.parts) {
    part.artifact = await upload(part.name, path.join(staging, 'part-' + String(part.number).padStart(3, '0')), 'upload-' + part.number + '.txt');
  }
  if (JSON.stringify(before) !== JSON.stringify(await inventoryReview(root))) throw Error('Original evidence changed during upload');
  index.complete = true;
  const indexDir = path.join(staging, 'index'); await fs.mkdir(indexDir);
  const json = Buffer.from(JSON.stringify(index, null, 2) + '\n');
  await fs.writeFile(path.join(indexDir, 'review-parts.json'), json, {flag: 'wx'});
  const sums = index.parts.flatMap(p => p.files.map(f => `${f.sha256}  ${f.path}`)).sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b))).join('\n') + '\n';
  await fs.writeFile(path.join(indexDir, 'SHA256SUMS.txt'), sums, {flag: 'wx'});
  await fs.writeFile(path.join(indexDir, 'review-parts.json.sha256'), sha256(json) + '  review-parts.json\n', {flag: 'wx'});
  const indexFiles = await inventoryReview(indexDir);
  // This tiny common index is bounded independently, too; no unlimited artifact.
  const {planReviewParts} = await import('../../../scripts/review-parts.mjs');
  if (planReviewParts(indexFiles, REVIEW_PART_LIMIT).length !== 1) throw Error('Common index exceeds transport boundary');
  const receipt = await upload(name + '-index', indexDir, 'upload-index.txt');
  console.log(JSON.stringify({status: 'complete original transport uploaded; no quality acceptance implied',parts: index.parts.length, files: index.files, originalBytes: index.originalBytes, limitBytes: index.limitBytes, indexArtifact: receipt}));
} catch (error) {
  // Preserve partial upload receipts locally; never label a subset complete.
  index.complete = false;
  await fs.writeFile(path.join(staging, 'partial-upload.json'), JSON.stringify(index, null, 2) + '\n', {flag: 'wx'});
  throw error;
}
