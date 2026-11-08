import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import actualHistoryCatalog from '../app/world-catalog.json' with {type:'json'};
import {beforeHistoryEvidence} from './history-evidence-reference.mjs';
const catalog=beforeHistoryEvidence(actualHistoryCatalog);
import {beforeWaterPhotosynthesis,dossiersBeforeWaterPhotosynthesis,wholeWaterReference,topicBeforeWaterPhotosynthesis,waterPhotosynthesisBoundary as boundary} from './water-photosynthesis-reference.mjs';
import {collectInventory} from '../scripts/content-inventory.mjs';
import {validateDossier} from '../scripts/editorial-contract.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';

test('the actual Darwin source correction composes with independently reviewed source boundaries and the entire earlier M93 inverse',()=>{
 const correction=boundary.sourceEndpointCorrection,topic=catalog.find(t=>t.id===correction.topic.id);
 assert.equal(topic.sources[3].url,'https://australian.museum/learn/species-identification/ask-an-expert/what-is-natural-selection/');
 for(const key of Object.keys(correction.topic.before))if(!['sources','sourceNote','checkedAt'].includes(key))assert.deepEqual(topic[key],correction.topic.before[key],key);
 assert.deepEqual(topic.sources.slice(0,3),correction.topic.before.sources.slice(0,3));
 const prior=catalog.map(t=>t.id===topic.id?correction.topic.before:boundary.additionalSourceEndpointCorrections?.find(row=>row.topic.id===t.id)?.topic.before??t);
 assert.equal(wholeWaterReference(prior),correction.previousCurrentCatalogSHA256);
 assert.equal(wholeWaterReference(beforeWaterPhotosynthesis(catalog)),boundary.previousCatalogSHA256);
});
test('an altered Darwin answer, unreviewed source or unrelated dossier cannot be hidden by the exact source inverse',()=>{
 for(const mutate of [rows=>rows.find(t=>t.id==='person-charles_darwin').question.answers.reverse(),rows=>rows.find(t=>t.id==='person-charles_darwin').sources[0].url+='?unreviewed',rows=>rows.find(t=>t.id==='person-charles_darwin').sources[3].url+='?unreviewed']){
  const rows=structuredClone(catalog);mutate(rows);assert.throws(()=>beforeWaterPhotosynthesis(rows));
 }
 const all=JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers;
 assert.equal(dossiersBeforeWaterPhotosynthesis(all).length,286);
 for(const mutate of [row=>row.goal+=' unreviewed',row=>row.sources[1].checkedOn='2026-11-07',row=>row.claims[3].anchor+=' unreviewed']){
  const bad=structuredClone(all);mutate(bad.find(d=>d.id===boundary.sourceEndpointCorrection.dossier.id));assert.throws(()=>dossiersBeforeWaterPhotosynthesis(bad));
 }
});
test('the earlier correctly qualified UI build never passes as the current source-corrected UI acceptance',()=>{
 const inventory=collectInventory(),record=inventory.records.find(r=>r.id===boundary.sourceEndpointCorrection.dossier.id),knownIds=new Set(inventory.records.map(r=>r.id));
 const dossier=structuredClone(JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers.find(d=>d.id===record.id));
 const currentBuild=learningFingerprint(process.cwd());assert.notEqual(currentBuild,'7483c6fa2774d7ff');
 dossier.ui.build='7483c6fa2774d7ff';
 const result=validateDossier(dossier,record,{knownIds,build:currentBuild});assert.equal(result.structurallyReady,false);assert(result.errors.includes('current built UI/search/back/offline proof required'));
});

test('historical inverse composition accepts only the actual whole older Darwin original and rejects altered old-looking objects',()=>{
 const old=JSON.parse(fs.readFileSync('tests/fixtures/retained-people-data-predecessor.json','utf8')).catalogChanges.find(row=>row.id==='person-charles_darwin').original;
 assert.deepEqual(topicBeforeWaterPhotosynthesis(old),old);
 for(const change of [row=>row.intro+=' altered',row=>row.sources[0].url+='?unreviewed',row=>row.question.answers.reverse()]){
  const altered=structuredClone(old);change(altered);assert.throws(()=>topicBeforeWaterPhotosynthesis(altered));
 }
});
