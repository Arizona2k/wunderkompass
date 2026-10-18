import test from 'node:test';import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type:'json'};
import index from '../app/world-index.json' with {type:'json'};
import dossier from '../content/building-editorial-review.json' with {type:'json'};
import retained from './fixtures/retained-building-mechanics.json' with {type:'json'};
import {fingerprint} from '../scripts/content-inventory.mjs';
import {validateWorldContent} from '../app/world-content-validation.mjs';
import {buildingCasesComplete} from '../scripts/handoff.mjs';
import {buildingProofCases} from './fixtures/building-proof.mjs';
test('eight distinct new buildings and eight individual retained explanations preserve old questions, models and boundaries',()=>{
 const topics=catalog.filter(t=>t.category==='buildings');assert.equal(topics.length,16);assert.equal(dossier.topics.length,16);assert.equal(dossier.topics.filter(t=>t.kind==='new').length,8);assert.equal(dossier.independentReview,false);assert.equal(new Set(topics.map(t=>t.learning.observe)).size,16);assert.equal(retained.length,8);
 for(const old of retained){const t=topics.find(t=>t.id===old.id);assert.deepEqual(t.question,old.question);assert.deepEqual(t.building,old.building);assert.equal(t.model??null,old.model);}
 for(const d of dossier.topics){const t=topics.find(t=>t.id===d.id);assert.equal(d.contentHash,fingerprint(t),t.id+' current dossier');assert.equal(d.independentReview,false);assert.equal(d.acceptedForDoubling,false);assert.ok(t.more.length>=2);assert.equal(d.ageLevels['6-8'],t.learning.starter);assert.ok(t.sources.every(s=>s.url.startsWith('https://')));assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);}
 for(const e of dossier.newConnections){assert.ok(catalog.find(t=>t.id===e.from).related.includes(e.to));assert.ok(catalog.find(t=>t.id===e.to).related.includes(e.from));assert.ok(e.why.length>50);}
 assert.equal(validateWorldContent(topics,index.filter(t=>t.category==='buildings'),index),topics);
});
test('corrupt building payloads and absent, duplicate, mixed or incomplete geometry observations fail closed',()=>{
 const topics=catalog.filter(t=>t.category==='buildings'),meta=index.filter(t=>t.category==='buildings');
 for(const mutate of [t=>t.building.exploration.kind='unsafe',t=>t.building.exploration.steps.pop(),t=>t.building.exploration.steps[0]='<script>',t=>t.building.exploration.note='',t=>delete t.learning,t=>delete t.questionFeedback]){const data=structuredClone(topics);mutate(data.find(t=>t.building.exploration));assert.throws(()=>validateWorldContent(data,meta,index),/Bauwerk/);}
 const cases=buildingProofCases([320,390]);assert.equal(buildingCasesComplete(cases,[320,390]),true);
 for(const mutate of [c=>c.pop(),c=>{c[0]=c[1]},c=>{c[0].width=1440},c=>{c.find(c=>c.kind==='aqueduct').effectsVerified=false},c=>{c.find(c=>c.kind==='corbel').variants.pop()},c=>{c.find(c=>c.kind==='shells').steps.pop()}]){const c=structuredClone(cases);mutate(c);assert.equal(buildingCasesComplete(c,[320,390]),false);}
});
