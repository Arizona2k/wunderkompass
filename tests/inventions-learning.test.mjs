import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import index from '../app/world-index.json' with {type:'json'};
import dossier from '../content/invention-editorial-review.json' with {type:'json'};
import retained from './fixtures/retained-challenge-bank.json' with {type:'json'};
import mechanics from './fixtures/retained-invention-mechanics.json' with {type:'json'};
import {validateWorldContent} from '../app/world-content-validation.mjs';
import {fingerprint} from '../scripts/content-inventory.mjs';
const inventions=catalog.filter(t=>t.category==='inventions'),metadata=index.filter(t=>t.category==='inventions');
test('twelve distinct integrated inventions preserve all twelve retained question banks, mechanics and independent approval boundaries',()=>{
 assert.equal(inventions.length,24);assert.equal(dossier.topics.length,24);assert.equal(dossier.preparedManuscripts.length,0);assert.equal(dossier.independentReview,false);
 const newIds=new Set(dossier.integratedManuscriptIds);assert.equal(newIds.size,12);assert.ok([...newIds].every(id=>inventions.some(t=>t.id===id)),'only actually integrated IDs replace the manuscript marker');
 assert.equal(validateWorldContent(inventions,metadata,index),inventions);
 for(const t of inventions){
  if(!newIds.has(t.id)){const old=retained.questions.find(q=>q.id===t.id+':mini');assert.ok(old,t.id+' retained identity');
   for(const key of ['prompt','answers','correct','why'])assert.deepEqual(t.question[key],old[key],t.id+' preserved '+key);
   assert.deepEqual(t.invention,mechanics[t.id],t.id+' retains all six stages, dates, parts and blueprint identity');
  }else{assert.equal(t.invention.walkthrough,true);assert.equal(retained.questions.some(q=>q.id===t.id+':mini'),false,'new concept is not an alias of a retained question');}
  const d=dossier.topics.find(d=>d.id===t.id);assert.ok(d);assert.equal(d.contentHash,fingerprint(t));assert.equal(d.independentReview,false);assert.equal(d.acceptedForDoubling,false);
  assert.equal(d.ageLevels['6-8'],t.learning.starter);assert.equal(d.observation,t.learning.observe);assert.ok(t.paragraphs.length>=1);
  if(newIds.has(t.id)){assert.equal(d.kind,'new');assert.ok(d.novelty.length>35);assert.ok(d.sourceClaims.length>=2);assert.equal(d.ageLevels['9-11'],t.paragraphs[0]);assert.equal(d.ageLevels['12-14'],t.more[0]);}
  assert.equal(t.invention.stages.length,6);assert.ok(t.invention.parts.length>=3);
  assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);
  assert.ok(t.questionFeedback.wrongReasons.every((reason,i)=>i===t.question.correct||reason!==t.question.why),'wrong choice cannot reveal right feedback');
 }
 assert.equal(Object.keys(mechanics).length,12);assert.equal(new Set(inventions.map(t=>t.learning.observe)).size,24);assert.equal(new Set(inventions.filter(t=>!newIds.has(t.id)).flatMap(t=>t.questionFeedback.wrongReasons.filter(Boolean))).size,24);
 assert.deepEqual(inventions.filter(t=>t.invention.model).map(t=>t.invention.model).sort(),['aperture','generator','layers','resolution','seismograph','transistor']);
 const baseline=JSON.parse(fs.readFileSync('content/excellence-baseline.json','utf8'));assert.ok(baseline.commit,'frozen baseline remains separate from drafts');
});

test('invention schema rejects corrupt plans, duplicate parts and models attached to the wrong physical concept',()=>{
 for(const mutate of [t=>{t.invention=null;},t=>{t.invention.year=NaN;},t=>t.invention.stages.pop(),t=>{t.invention.parts[1].id=t.invention.parts[0].id;},t=>{t.invention.blueprint='unknown';},t=>{t.invention.walkthrough='true';},t=>{t.invention.model='transistor';},t=>{t.invention.model='unknown';}]){
  const broken=structuredClone(inventions);mutate(broken.find(t=>t.id==='invention-generator'));assert.throws(()=>validateWorldContent(broken,metadata,index),/Erfindungsplan/);
 }
});
test('malformed answer-specific feedback and optional learning data fail closed before a category can render',()=>{
 for(const mutate of [t=>t.questionFeedback=null,t=>t.questionFeedback.hint='',t=>t.questionFeedback.wrongReasons.pop(),t=>t.questionFeedback.wrongReasons[t.question.correct]='Wrong explanation on the correct slot',t=>t.questionFeedback.wrongReasons[1]=null,t=>t.questionFeedback.wrongReasons[2]=t.questionFeedback.wrongReasons[1],t=>t.learning.observe='',t=>t.learning=null]){
  const broken=structuredClone(inventions);mutate(broken[0]);assert.throws(()=>validateWorldContent(broken,metadata,index));
 }
});
