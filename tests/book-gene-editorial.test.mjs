import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {genePredecessors,withCellPreGeneRuntime} from './gene-predecessor-reference.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {fingerprint} from '../scripts/content-inventory.mjs';
import fixture from './fixtures/gene-cell-runtime-predecessor.json' with {type:'json'};
const read=()=>JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers;
test('the genetics layer preserves every whole delivered M83 dossier and reconstructs its real runtime bytes without claiming new UI',()=>{
 const previous=genePredecessors(read());assert.equal(previous.length,156);
 assert.deepEqual(previous.map(row=>({id:row.id,sha256:fingerprint(row)})),fixture.whole156PredecessorDossiers);
 assert.equal(withCellPreGeneRuntime(process.cwd(),learningFingerprint),fixture.predecessorRuntimeBuild);
});
test('genetics history rejects unreviewed prior facts, lost nested history, altered new claims, provisional UI and changed identities',()=>{
 for(const mutate of[
  rows=>rows[0].explanation+=' Unreviewed.',
  rows=>delete rows[0].historicalUIBeforeTechnicalLimits20261030,
  rows=>delete rows[0].historicalUIBeforeNativeShortReturn20261030,
  rows=>rows[156].dataHash='0'.repeat(64),
  rows=>rows[156].teachingDataHash='0'.repeat(64),
  rows=>rows[156].ui={build:'invented',visible:true,search:true,back:true,offline:true},
  rows=>rows.reverse(),rows=>rows.pop()
 ]){const changed=structuredClone(read());mutate(changed);assert.throws(()=>genePredecessors(changed));}
});

// Appended to the existing two history tests only after real full qualification.
import {GENE_WORDS,GENE_QUESTIONS} from '../app/book-gene-validation.mjs';
import {collectInventory} from '../scripts/content-inventory.mjs';
import {validateDossier} from '../scripts/editorial-contract.mjs';
import {geneHistoryReference} from './gene-history-reference.mjs';
const geneRead=name=>JSON.parse(fs.readFileSync(name,'utf8')),currentFixture=geneRead('tests/fixtures/editorial-before-gene-156.json'),currentReference=geneHistoryReference(currentFixture,currentFixture.currentTemplate),inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys()),genePack=geneRead('app/book-gene-content.json'),geneTeaching=geneRead('exports/content/book-gene.json'),geneWords=geneRead('exports/content/knowledge-words.json'),geneWhy=geneRead('exports/content/why-questions.json');
function assertActualCurrent166(items){
 assert.equal(items.length,166);assert.equal(currentFixture.priorDossiers.length,156);assert.equal(currentFixture.addedDossiers.length,10);assert.equal(currentFixture.currentTemplate.build,learningFingerprint(process.cwd()),'all raw166 UI bound to actual current runtime');currentReference.assertCurrentGeneSharedUI(items);
 const expectedIds=[...GENE_WORDS.map(term=>'words:'+term),...GENE_QUESTIONS.map(question=>'why:'+geneWhy.findIndex(row=>row.question===question))];assert.equal(new Set(expectedIds).size,10);assert.deepEqual(new Set(currentFixture.addedDossiers.map(row=>row.id)),new Set(expectedIds));
 for(const id of expectedIds){
  const dossier=items.find(row=>row.id===id),record=records.get(id);assert(dossier&&record);assert.equal(dossier.dataHash,record.dataHash,id+' canonical inventory hash');
  const word=record.family==='words',key=word?record.legacyId:geneWhy[record.sourceIndex].question,canonical=word?geneWords.find(row=>row.term===key):geneWhy[record.sourceIndex];assert.equal(record.dataHash,fingerprint(canonical));
  const lesson=geneTeaching.find(row=>row.kind===(word?'word':'why')&&(word?row.term:row.whyQuestion)===key);assert(lesson);assert.equal(geneTeaching.filter(row=>row.kind===lesson.kind&&(word?row.term:row.whyQuestion)===key).length,1);assert.equal(dossier.teachingDataHash,fingerprint(lesson));assert.equal(lesson.sourceReadOn,genePack.sourceReadOn);assert.deepEqual(dossier.sources.map(row=>row.url),(word?genePack.learning:genePack.whyLearning)[key].sources.map(row=>row.url));assert.equal(validateDossier(dossier,record,{build:currentFixture.currentTemplate.build,knownIds}).structurallyReady,true);
 }
 assert.deepEqual(items.slice(0,156).map(currentReference.beforeGeneUI).map(fingerprint),currentFixture.priorDossiers.map(row=>row.wholeSHA256));
}
test('all raw166 current dossiers retain complete156 delivered predecessors and ten real canonical genetics UI contracts',()=>assertActualCurrent166(read()));
test('current166UI rejects stale new binding, mismatched teaching, changed old facts, reordered IDs and lost nested histories',()=>{
 for(const mutate of[rows=>rows[156].ui.build='stale',rows=>rows[156].teachingDataHash='0'.repeat(64),rows=>rows[156].dataHash='0'.repeat(64),rows=>rows[0].explanation+=' Unreviewed.',rows=>delete rows[0].historicalUIBeforeGene20261031,rows=>delete rows[0].historicalUIBeforeCell20261031,rows=>delete rows[0].historicalUIBeforeNativeShortReturn20261030,rows=>rows.reverse(),rows=>rows.pop()]){const changed=structuredClone(read());mutate(changed);assert.throws(()=>assertActualCurrent166(changed));}
});
