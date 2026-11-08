import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import {beforeWaterPhotosynthesis,topicBeforeWaterPhotosynthesis,dossiersBeforeWaterPhotosynthesis,wholeWaterReference,waterPhotosynthesisBoundary as boundary} from './water-photosynthesis-reference.mjs';

const correction=()=>boundary.additionalSourceEndpointCorrections.find(row=>row.topic.id==='history-paper');
const dossiers=()=>JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers;
function changeTemporarily(row,run){const saved=structuredClone(row);try{run(row);}finally{for(const key of Object.keys(row))delete row[key];Object.assign(row,saved);}}

test('legacy paper source-only correction preserves all203 other whole current articles, all teaching and answers, and the exact earlier M93 inverse without creating a dossier',()=>{
 const c=correction(),topic=catalog.find(row=>row.id===c.topic.id);assert(c.legacyTopicWithoutExistingDossier);assert.equal(c.dossier,undefined);assert.deepEqual(topic,c.topic.after);
 assert.deepEqual(topic.sources.map(s=>s.url),['https://paper.gatech.edu/early-papermaking',c.topic.before.sources[1].url,'https://www.berkshirepublishing.com/ecph-china/2017/12/27/cai-lun-121-ce/']);
 for(const key of Object.keys(c.topic.before))if(!['sources','sourceNote','checkedAt'].includes(key))assert.deepEqual(topic[key],c.topic.before[key],key);
 assert.deepEqual(topic.sources[1],c.topic.before.sources[1]);const previous=catalog.map(t=>t.id===topic.id?c.topic.before:t);assert.equal(wholeWaterReference(previous),c.previousCurrentCatalogSHA256);
 assert.deepEqual(topicBeforeWaterPhotosynthesis(topic),c.topic.before);assert.deepEqual(topicBeforeWaterPhotosynthesis(c.topic.before),c.topic.before);assert.equal(wholeWaterReference(beforeWaterPhotosynthesis(catalog)),boundary.previousCatalogSHA256);
 const all=dossiers();assert.equal(all.length,288);assert(!all.some(row=>row.id==='topics-history:history-paper'));assert.equal(dossiersBeforeWaterPhotosynthesis(all).length,286);
});
test('unknown paper teaching, answer, history, unchanged Cambridge source and mixed source changes remain rejected',()=>{
 const c=correction(),topic=catalog.find(row=>row.id===c.topic.id);
 for(const mutate of[t=>t.paragraphs[0]+=' unreviewed',t=>t.question.answers.reverse(),t=>t.history.year=106,t=>t.sources[0].url='https://example.invalid/unreviewed',t=>t.sources[1].url+='?unreviewed',t=>t.sources[2]=structuredClone(c.topic.before.sources[2]),t=>t.checkedAt='invented',t=>t.sourceNote+=' unreviewed']){
  const bad=structuredClone(topic);mutate(bad);assert.throws(()=>topicBeforeWaterPhotosynthesis(bad));assert.throws(()=>beforeWaterPhotosynthesis(catalog.map(t=>t.id===bad.id?bad:t)));
 }
 const bad=structuredClone(catalog);bad[0].intro+=' unreviewed';assert.throws(()=>beforeWaterPhotosynthesis(bad));const reordered=structuredClone(catalog);[reordered[0],reordered[1]]=[reordered[1],reordered[0]];assert.throws(()=>beforeWaterPhotosynthesis(reordered));
});
test('the exact legacy source boundary cannot approve invented UI, omit an existing source dossier or authorize an unnamed correction',()=>{
 const c=correction(),all=dossiers(),expected=dossiersBeforeWaterPhotosynthesis(all);
 changeTemporarily(c,row=>{delete row.legacyTopicWithoutExistingDossier;assert.throws(()=>dossiersBeforeWaterPhotosynthesis(all));});
 changeTemporarily(c,row=>{row.dossier={id:'invented'};assert.throws(()=>dossiersBeforeWaterPhotosynthesis(all));});
 changeTemporarily(c,row=>{row.topic.id='history-unknown';assert.throws(()=>dossiersBeforeWaterPhotosynthesis(all));});
 assert.throws(()=>dossiersBeforeWaterPhotosynthesis([...all,{id:'topics-history:history-paper',ui:{build:boundary.sourceEndpointCorrection.pendingCurrentUIBuild,visible:true,search:true,back:true,offline:true}}]));
 const cai=boundary.additionalSourceEndpointCorrections.find(r=>r.topic.id==='person-cai_lun');changeTemporarily(cai,row=>{delete row.dossier;assert.throws(()=>dossiersBeforeWaterPhotosynthesis(all));});
 assert.deepEqual(dossiersBeforeWaterPhotosynthesis(all),expected);
});

