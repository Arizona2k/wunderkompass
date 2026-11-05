import {naturePredecessors,withNaturePreRetainedRuntime} from './nature-predecessor-reference.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {collectInventory as collectCurrentInventory, fingerprint} from '../scripts/content-inventory.mjs';
import {inventoryBeforeFourteenBacklinks} from './people-fourteen-reference.mjs';
const collectInventory=(...args)=>inventoryBeforeFourteenBacklinks(collectCurrentInventory(...args));
import {validateDossierContent} from '../scripts/editorial-contract.mjs';
import {bookRetainedContent} from '../scripts/book-retained-index.mjs';
import {retainedPredecessors, withEcologyPreRetainedRuntime} from './retained-predecessor-reference.mjs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const whole = value => sha(JSON.stringify(value));
const words = read('exports/content/knowledge-words.json'), why = read('exports/content/why-questions.json');
const before = read('tests/fixtures/book-before-retained-171-hashes.json');
const pack = read('app/book-retained-content.json');

test('nine additional words and eight Why preserve all171 whole previous words,52 Why positions and twelve full teaching packs', () => {
  assert.equal(before.sourceCommit, '7d56bc792b7ef0bb4296ae0a323589260a3b25bf');
  assert.equal(words.length, 180); assert.equal(new Set(words.map(w => w.term)).size, 180);
  assert.equal(why.length, 60); assert.equal(new Set(why.map(w => w.question)).size, 60);
  assert.equal(Object.keys(before.words).length, 171); assert.equal(Object.keys(before.why).length, 52);
  for (const [term, hash] of Object.entries(before.words)) assert.equal(whole(words.find(w => w.term === term)), hash, term + ' entire previously delivered word');
  assert.deepEqual(words.filter(w => Object.hasOwn(before.words, w.term)).map(w => w.term), before.wordOrder);
  assert.deepEqual(why.slice(0, 52).map(w => w.question), before.whyOrder);
  for (const [question, hash] of Object.entries(before.why)) assert.equal(whole(why.find(w => w.question === question)), hash, question + ' stable previous Why');
  assert.equal(Object.keys(before.packs).length, 12);
  for (const [file, hash] of Object.entries(before.packs)) assert.equal(sha(fs.readFileSync(file)), hash, file + ' entire original teaching pack');
  assert.deepEqual(bookRetainedContent(true), pack);
  assert.deepEqual(words.filter(w => !Object.hasOwn(before.words, w.term)).map(w => w.term).toSorted(), Object.keys(pack.words).toSorted());
  assert.deepEqual(why.slice(52).map(w => w.question), Object.keys(pack.why));
});

test('all203 entire delivered dossiers survive and the17 new content-only dossiers match actual lessons, sources, tasks and existing targets', () => {
  const registry = naturePredecessors(read('content/editorial-reviews.json').dossiers);
  const prior = retainedPredecessors(registry);
  assert.deepEqual(prior.map(row => ({id: row.id, sha256: whole(row)})), before.whole203PredecessorDossiers);
  const inventory = collectInventory(), records = new Map(inventory.records.map(row => [row.id, row])), knownIds = new Set(records.keys());
  const lessons = read('exports/content/book-retained.json');
  assert.equal(registry.length, 220); assert.equal(lessons.length, 17);
  const expected = [...Object.keys(pack.words).map(term => 'words:' + term), ...Object.keys(pack.why).map((q, i) => 'why:' + (52 + i))];
  assert.deepEqual(registry.slice(203).map(row => row.id), expected);
  for (const row of registry.slice(203)) {
    const record = records.get(row.id); assert(record, row.id);
    const word = record.family === 'words', key = word ? record.legacyId : why[record.sourceIndex].question;
    const lesson = lessons.find(l => word ? l.kind === 'word' && l.term === key : l.kind === 'why' && l.whyQuestion === key);
    const canonical = (word ? pack.learning : pack.whyLearning)[key]; assert(lesson && canonical);
    assert.equal(row.dataHash, record.dataHash); assert.equal(row.teachingDataHash, fingerprint(lesson));
    assert.deepEqual(row.answerReview, canonical.question);
    assert.deepEqual(row.sources.map(s => s.url), canonical.sources.map(s => s.url));
    const result = validateDossierContent(row, record, {knownIds});
    assert.equal(result.contentReady, true, row.id); assert.equal(result.scientificApproval, false);
  }
  assert.equal(withEcologyPreRetainedRuntime(process.cwd(), learningFingerprint), '83a6046493a37f25', 'recomputed full actual M88 runtime, no selected weak inverse');
});

test('lost whole prior history, changed old explanations, wrong new teaching, missing or reordered dossiers and invented new UI fail', () => {
  const registry = naturePredecessors(read('content/editorial-reviews.json').dossiers);
  for (const mutate of [rows => rows.pop(), rows => rows.reverse(), rows => rows[0].explanation += ' unreviewed', rows => delete rows[0].historicalUIBeforeEcology20261101, rows => rows[203].teachingDataHash = '0'.repeat(64), rows => rows[219].id = 'why:invented', rows => rows[203].ui = {build: 'invented'}]) {
    const bad = structuredClone(registry); mutate(bad); assert.throws(() => retainedPredecessors(bad));
  }
});

test('all220 delivered predecessor technical UI retains all203 whole histories and rejects lost or invented UI', async () => {
  const {validateDossier}=await import('../scripts/editorial-contract.mjs');
  const registry=naturePredecessors(read('content/editorial-reviews.json').dossiers),fixture=read('tests/fixtures/editorial-before-retained-203.json');
  assert.equal(fixture.sourceCommit,'7d56bc792b7ef0bb4296ae0a323589260a3b25bf');assert.equal(fixture.priorDossiers.length,203);assert.equal(fixture.addedDossiers.length,17);
  const previous=retainedPredecessors(registry);assert.deepEqual(previous.map(row=>({id:row.id,wholeSHA256:fingerprint(row)})),fixture.priorDossiers);
  const records=new Map(collectInventory().records.map(row=>[row.id,row])),knownIds=new Set(records.keys());
  const actualUnchangedPredecessorBuild=withNaturePreRetainedRuntime(process.cwd(),learningFingerprint);
  assert.equal(registry.length,220);for(const row of registry)assert.equal(validateDossier(row,records.get(row.id),{build:actualUnchangedPredecessorBuild,knownIds}).structurallyReady,true,row.id);
  for(const mutate of [rows=>delete rows[0].historicalUIBeforeRetained20261102,rows=>rows[0].historicalUIBeforeRetained20261102.build='invented',rows=>rows[219].ui.offline=false,rows=>delete rows[203].ui]){const bad=structuredClone(registry);mutate(bad);assert.throws(()=>retainedPredecessors(bad));}
});
