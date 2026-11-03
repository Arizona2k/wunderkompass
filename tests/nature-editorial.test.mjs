import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {collectInventory,fingerprint} from '../scripts/content-inventory.mjs';import {validateDossierContent} from '../scripts/editorial-contract.mjs';import {learningFingerprint} from '../build/learning-fingerprint.mjs';import {naturePredecessors,withNaturePreRetainedRuntime} from './nature-predecessor-reference.mjs';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8')),pack=read('app/nature-learning-content.json'),fixture=read('tests/fixtures/nature-retained-runtime-predecessor.json');

test('34 actual Nature editorial dossiers retain all220 whole delivered histories and match the concrete teaching, source claims and routes',()=>{
 const registry=read('content/editorial-reviews.json').dossiers,inventory=collectInventory(),records=new Map(inventory.records.map(r=>[r.id,r])),knownIds=new Set(records.keys());
 assert.equal(registry.length,254);assert.deepEqual(naturePredecessors(registry).map(row=>({id:row.id,sha256:fingerprint(row)})),fixture.whole220PredecessorDossiers.map(({ui,...row})=>row));
 assert.deepEqual(registry.slice(220).map(row=>row.id),Object.keys(pack).map(id=>'nature-topics:'+id));
 for(const d of registry.slice(220)){
  const id=d.id.slice('nature-topics:'.length),lesson=pack[id].learning,r=records.get(d.id);assert.equal(r.route,'book/nature/'+encodeURIComponent(id));assert.equal(d.dataHash,r.dataHash);assert.equal(d.teachingDataHash,fingerprint(lesson));assert.equal(d.goal,lesson.learningGoal);assert.equal(d.explanation,lesson.deeper);assert.equal(d.example,lesson.starter);assert.equal(d.whyItMatters,lesson.benefit);assert.equal(d.observation,lesson.observe);assert.equal(d.modelLimits,lesson.figure.limits);assert.equal(d.hint,lesson.question.hint);assert.equal(d.question.prompt,lesson.question.prompt);assert.deepEqual(d.question.answers,lesson.question.answers);assert.equal(d.question.correct,lesson.question.correct);assert.deepEqual(d.question.feedbackPerAnswer,lesson.question.answers.map((_,i)=>i===lesson.question.correct?lesson.question.why:lesson.question.wrongReasons[i]));assert.deepEqual(d.sources.map(s=>s.url),lesson.sources.map(s=>s.url));assert.deepEqual(d.claims,lesson.claims.map(c=>({statement:c.claim,sourceId:d.sources[c.sourceIndex].id,anchor:lesson.sources[c.sourceIndex].anchor})));assert.equal(validateDossierContent(d,r,{knownIds}).contentReady,true,id);for(const media of d.media){assert(fs.existsSync(media.path));assert(media.alt.length>30&&media.learningPurpose.length>30);}assert.equal(d.reviewedBy.includes('keine fachliche Menschenabnahme'),true);assert(d.links.every(target=>knownIds.has(target)));
 }
 assert.equal(withNaturePreRetainedRuntime(process.cwd(),learningFingerprint),'378594e764fac3f0','recomputed complete actual578-input M89 predecessor');
});

test('missing or reordered dossiers, old factual/history edits, wrong new lessons and premature UI cannot pass the exact predecessor bridge',()=>{
 const rows=read('content/editorial-reviews.json').dossiers;
 for(const mutate of [r=>r.pop(),r=>r.reverse(),r=>r[0].explanation+=' changed',r=>delete r[0].historicalUIBeforeRetained20261102,r=>r[220].teachingDataHash='0'.repeat(64),r=>r[253].id='nature-topics:invented',r=>r[220].ui={build:'invented'}]){const bad=structuredClone(rows);mutate(bad);assert.throws(()=>naturePredecessors(bad));}
});
