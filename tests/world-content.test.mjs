import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import index from '../app/world-index.json' with {type:'json'};
import hints from '../app/challenge-hints.json' with {type:'json'};
import questions from '../app/world-question-index.json' with {type:'json'};
import {fingerprint} from '../scripts/content-inventory.mjs';
import {challengeIndex,worldParts} from '../scripts/world-question-index.mjs';
import {validateWorldContent} from '../app/world-content-validation.mjs';
test('all six demand-loaded categories reconstruct the exact canonical catalog and its full question bank',()=>{
 worldParts(true);const parts=['animals','history','people','inventions','buildings','science'].flatMap(category=>{
  const data=JSON.parse(fs.readFileSync('app/world-content-parts/world-content-'+category+'.json','utf8'));
  assert.equal(validateWorldContent(data,index.filter(t=>t.category===category),index),data);return data;
 });
 assert.deepEqual(catalog, catalog.map(t=>parts.find(p=>p.id===t.id)));assert.equal(parts.length,catalog.length);
 assert.deepEqual(questions,challengeIndex(catalog,hints));const old=JSON.parse(fs.readFileSync('tests/fixtures/retained-challenge-bank.json','utf8'));assert.equal(old.questions.length,142);for(const q of old.questions)assert.deepEqual(questions.find(next=>next.id===q.id),q);assert.equal(questions.length,165);
});
test('damaged, partial, swapped and falsely linked card payloads fail closed before rendering',()=>{
 const original=catalog.filter(t=>t.category==='science'),metadata=index.filter(t=>t.category==='science');
 for(const mutate of [d=>d.pop(),d=>d[1]=d[0],d=>d[0].title='wrong',d=>d[0].paragraphs=['<script>'],d=>d[0].question.correct=99,d=>d[0].related.push('missing'),d=>d[0].sources=[],d=>d[0].sources[0].url='http://insecure',d=>delete d[0].learning,d=>d[0].investigation='unreviewed',d=>d.find(t=>t.challenges).challenges[0].correct=99]){
  const broken=structuredClone(original);mutate(broken);assert.throws(()=>validateWorldContent(broken,metadata,index));
 }
});
test('new science records remain distinct, dossier hashes stay current and prior IDs/questions are preserved',()=>{
 const dossier=JSON.parse(fs.readFileSync('content/science-editorial-review.json','utf8'));const science=catalog.filter(t=>t.category==='science');assert.equal(science.length,46);assert.equal(dossier.topics.length,46);assert.equal(dossier.topics.filter(t=>t.kind==='new').length,23);assert.equal(dossier.independentReview,false);
 const old=JSON.parse(fs.readFileSync('tests/fixtures/baseline-topics.json','utf8'));for(const t of old){const current=catalog.find(x=>x.id===t.id);assert.ok(current);}
 for(const item of dossier.topics){const t=catalog.find(t=>t.id===item.id);assert.equal(item.contentHash,fingerprint(t),item.id+' stale editorial dossier');assert.equal(item.independentReview,false);assert.equal(item.acceptedForDoubling,false);assert.equal(item.ageLevels['6-8'],t.learning.starter);assert.equal(item.observation,t.learning.observe);assert.ok(item.sources.every(s=>s.url.startsWith('https://')));assert.ok(item.claims.length>=2);if(item.kind==='new'){assert.ok(item.semanticDecision);assert.ok(t.related.length>=2);for(const id of t.related)assert.ok(catalog.find(x=>x.id===id).related.includes(t.id),'reciprocal '+t.id+' '+id);}}
});
