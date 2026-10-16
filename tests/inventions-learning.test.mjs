import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import index from '../app/world-index.json' with {type:'json'};
import dossier from '../content/invention-editorial-review.json' with {type:'json'};
import retained from './fixtures/retained-challenge-bank.json' with {type:'json'};
import {validateWorldContent} from '../app/world-content-validation.mjs';
import {fingerprint} from '../scripts/content-inventory.mjs';
const inventions=catalog.filter(t=>t.category==='inventions'),metadata=index.filter(t=>t.category==='inventions');
test('individual invention explanations retain original questions/identities and distinguish unpublished work manuscripts',()=>{
 assert.equal(inventions.length,12);assert.equal(dossier.topics.length,12);assert.equal(dossier.preparedManuscripts.length,12);assert.equal(dossier.independentReview,false);
 const newIds=new Set(dossier.preparedManuscripts.map(t=>t.id));assert.equal(newIds.size,12);assert.ok(catalog.every(t=>!newIds.has(t.id)),'manuscripts never masquerade as available catalog content');
 assert.equal(validateWorldContent(inventions,metadata,index),inventions);
 for(const t of inventions){
  const old=retained.questions.find(q=>q.id===t.id+':mini');assert.ok(old,t.id+' retained identity');
  for(const key of ['prompt','answers','correct','why'])assert.deepEqual(t.question[key],old[key],t.id+' preserved '+key);
  const d=dossier.topics.find(d=>d.id===t.id);assert.ok(d);assert.equal(d.contentHash,fingerprint(t));assert.equal(d.independentReview,false);assert.equal(d.acceptedForDoubling,false);
  assert.equal(d.ageLevels['6-8'],t.learning.starter);assert.equal(d.observation,t.learning.observe);assert.ok(t.paragraphs.length>=2);
  assert.equal(t.invention.stages.length,6);assert.ok(t.invention.parts.length>=3);
  assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);
  assert.ok(t.questionFeedback.wrongReasons.every((reason,i)=>i===t.question.correct||reason!==t.question.why),'wrong choice cannot reveal right feedback');
 }
 assert.equal(new Set(inventions.map(t=>t.learning.observe)).size,12);assert.equal(new Set(inventions.flatMap(t=>t.questionFeedback.wrongReasons.filter(Boolean))).size,24);
 const baseline=JSON.parse(fs.readFileSync('content/excellence-baseline.json','utf8'));assert.ok(baseline.commit,'frozen baseline remains separate from drafts');
});
test('malformed answer-specific feedback and optional learning data fail closed before a category can render',()=>{
 for(const mutate of [t=>t.questionFeedback=null,t=>t.questionFeedback.hint='',t=>t.questionFeedback.wrongReasons.pop(),t=>t.questionFeedback.wrongReasons[t.question.correct]='Wrong explanation on the correct slot',t=>t.questionFeedback.wrongReasons[1]=null,t=>t.questionFeedback.wrongReasons[2]=t.questionFeedback.wrongReasons[1],t=>t.learning.observe='',t=>t.learning=null]){
  const broken=structuredClone(inventions);mutate(broken[0]);assert.throws(()=>validateWorldContent(broken,metadata,index));
 }
});
