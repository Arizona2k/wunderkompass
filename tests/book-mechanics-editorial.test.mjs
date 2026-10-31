// Apply only with the genuine post-full146 UI fixture and exact139 fully
// delivered corrective predecessor, including its native-short outer history.
// Raw current146 contract; genuine source-bound local full proof precedes its fixture.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MECHANICS_WORDS,MECHANICS_QUESTIONS} from '../app/book-mechanics-validation.mjs';
import {collectInventory,fingerprint} from '../scripts/content-inventory.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {validateDossier} from '../scripts/editorial-contract.mjs';
import {mechanicsHistoryReference} from './mechanics-history-reference.mjs';
import {assertCurrentLearningAuditSharedUI} from './learning-audit-reference.mjs';
const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const fixture=read('tests/fixtures/editorial-before-mechanics-139.json');
const reference=mechanicsHistoryReference(fixture,fixture.currentTemplate);
const oldIds=new Set(fixture.priorDossiers.map(row=>row.id));
const pack=read('app/book-mechanics-content.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json'),teaching=read('exports/content/book-mechanics.json');
const inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys());
function assertCurrent(items){
 assert.equal(items.length,146);assert.equal(fixture.priorDossiers.length,139);assert.equal(fixture.addedDossiers.length,7);
 assert.equal(fixture.currentTemplate.build,learningFingerprint(process.cwd()),'raw146UI is bound to actual current product inputs');
 reference.assertCurrentMechanicsSharedUI(items);
 const predecessor=items.filter(row=>oldIds.has(row.id)).map(reference.beforeMechanicsUI);
 assert.equal(predecessor.length,139);assertCurrentLearningAuditSharedUI(predecessor);
 const expectedIds=[...MECHANICS_WORDS.map(term=>'words:'+term),...MECHANICS_QUESTIONS.map(question=>'why:'+why.findIndex(row=>row.question===question))];
 assert.equal(new Set(expectedIds).size,7);assert.deepEqual(new Set(fixture.addedDossiers.map(row=>row.id)),new Set(expectedIds));
 for(const id of expectedIds){
  const dossier=items.find(row=>row.id===id),record=records.get(id);assert(dossier);assert(record);assert.equal(dossier.dataHash,record.dataHash,id+' exact current canonical payload');
  const isWord=record.family==='words',key=isWord?record.legacyId:why[record.sourceIndex].question;
  const canonical=isWord?words.find(row=>row.term===key):why[record.sourceIndex];
  assert.equal(record.dataHash,fingerprint(canonical),id+' independent canonical row hash');
  const lesson=teaching.find(row=>row.kind===(isWord?'word':'why')&&(isWord?row.term:row.whyQuestion)===key);assert(lesson,id+' one actual teaching identity');
  assert.equal(teaching.filter(row=>row.kind===lesson.kind&&(isWord?row.term:row.whyQuestion)===key).length,1);
  assert.equal(dossier.teachingDataHash,fingerprint(lesson),id+' complete actual teaching hash');
  const learning=(isWord?pack.learning:pack.whyLearning)[key];assert(learning);assert.equal(lesson.sourceReadOn,pack.sourceReadOn);
  assert.deepEqual(dossier.sources.map(row=>row.url),learning.sources.map(row=>row.url),id+' actual individual claim sources');
  assert.equal(validateDossier(dossier,record,{build:fixture.currentTemplate.build,knownIds}).structurallyReady,true,id+' current full content/UI contract');
 }
 return predecessor;
}
test('all seven real mechanics dossiers match current canonical and teaching hashes while every whole139 delivered predecessor and nested history is retained',()=>{
 const current=read('content/editorial-reviews.json').dossiers;
 const prior=assertCurrent(current);assert.deepEqual(prior.map(fingerprint),fixture.priorDossiers.map(row=>row.wholeSHA256));
});
test('stale new UI, mismatched teaching, changed old facts and lost nested technical history cannot pass the real146 current contract',()=>{
 const current=read('content/editorial-reviews.json').dossiers;
 for(const mutate of [
  rows=>rows[139].ui.build='stale',
  rows=>rows[139].teachingDataHash='0'.repeat(64),
  rows=>rows[139].dataHash='0'.repeat(64),
  rows=>rows[0].explanation+=' Unreviewed.',
  rows=>delete rows[0].historicalUIBeforeTechnicalLimits20261030,
  rows=>delete rows[0].historicalUIBeforeNativeShortReturn20261030,
  rows=>rows[0].historicalUIBeforeNativeShortReturn20261030.build="unreviewed",
  rows=>rows.reverse(),
  rows=>rows.pop()
 ]){const changed=structuredClone(current);mutate(changed);assert.throws(()=>assertCurrent(changed));}
});
