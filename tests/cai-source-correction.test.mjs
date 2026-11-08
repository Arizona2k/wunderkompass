// Prepared canonical regression; imports are rebased only when the natural boundary admits integration.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import {beforeWaterPhotosynthesis,dossiersBeforeWaterPhotosynthesis,wholeWaterReference,topicBeforeWaterPhotosynthesis,waterPhotosynthesisBoundary as boundary} from './water-photosynthesis-reference.mjs';

test('Cai Lun source-only replacement composes with independent reviewed source boundaries while every teaching and saved-answer field is preserved',()=>{
 const correction=boundary.additionalSourceEndpointCorrections.find(row=>row.topic.id==='person-cai_lun');
 const topic=catalog.find(row=>row.id===correction.topic.id);
 assert.deepEqual(topic,correction.topic.after);
 assert.equal(topic.sources[0].url,'https://www.berkshirepublishing.com/ecph-china/2017/12/27/cai-lun-121-ce/');
 for(const key of Object.keys(correction.topic.before))if(!['sources','sourceNote','checkedAt'].includes(key))assert.deepEqual(topic[key],correction.topic.before[key]);
 assert.deepEqual(topic.sources.slice(1),correction.topic.before.sources.slice(1));
 const previous=catalog.map(row=>boundary.additionalSourceEndpointCorrections.find(change=>change.topic.id===row.id)?.topic.before??row);
 assert.equal(wholeWaterReference(previous),correction.previousCurrentCatalogSHA256);
 assert.equal(wholeWaterReference(beforeWaterPhotosynthesis(catalog)),boundary.previousCatalogSHA256);
 const dossiers=JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers;
 assert.equal(dossiersBeforeWaterPhotosynthesis(dossiers).length,286);
 const dossier=dossiers.find(row=>row.id===correction.dossier.id);
 assert.deepEqual(dossier.sources.slice(1),correction.dossier.before.sources.slice(1));
 assert.equal(dossier.teachingDataHash,correction.dossier.before.teachingDataHash);
});

test('unknown Cai answers, a changed unaffected source and damaged historical factual claims cannot be hidden by source inversion',()=>{
 for(const change of [topic=>topic.question.answers.reverse(),topic=>topic.sources[1].url+='?unreviewed',topic=>topic.more.push('unreviewed')]){
  const changed=structuredClone(catalog);change(changed.find(row=>row.id==='person-cai_lun'));assert.throws(()=>beforeWaterPhotosynthesis(changed));
 }
 const dossiers=JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers;
 for(const change of [row=>row.goal+=' unreviewed',row=>row.sources[1].checkedOn='2026-11-07',row=>row.claims[0].anchor+=' unreviewed']){
  const changed=structuredClone(dossiers);change(changed.find(row=>row.id==='topics-people:person-cai_lun'));assert.throws(()=>dossiersBeforeWaterPhotosynthesis(changed));
 }
});

test('composed older releases admit the exact preserved pre-retained Cai article and reject plausible but altered old-looking data',()=>{
 const retained=JSON.parse(fs.readFileSync('tests/fixtures/retained-people-data-predecessor.json','utf8')).catalogChanges.find(row=>row.id==='person-cai_lun').original;
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-people20-before-merian-lehmann.json','utf8')).peopleTopics.find(row=>row.id==='person-cai_lun');
 assert.equal(wholeWaterReference(legacy),'4e7fe5580da207a855400da0c71a60d1fe8582c367a046241491ceedf01fad6b');
 assert.deepEqual(legacy,{...retained,related:retained.related.filter(id=>id!=='person-katsushika_hokusai')});
 for(const old of [retained,legacy]){
  assert.deepEqual(topicBeforeWaterPhotosynthesis(old),old);
  for(const change of [row=>row.intro+=' altered',row=>row.question.answers.reverse(),row=>row.sources[0].url+='?unreviewed',row=>row.related.push('person-unreviewed')]){
   const changed=structuredClone(old);change(changed);assert.throws(()=>topicBeforeWaterPhotosynthesis(changed));
  }
 }
});
