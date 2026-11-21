import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {HEAT_WORDS,HEAT_QUESTIONS,validateHeatPack} from '../app/book-heat-validation.mjs';
import {bookHeatContent} from '../scripts/book-heat-index.mjs';
import {GLOSSARY,WHY_QUESTIONS} from '../app/learning-data.ts';

const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),pack=read('app/book-heat-content.json');

test('all six heat explanations use one verified payload, matching projections and published routes',()=>{
 assert.deepEqual(bookHeatContent(true),pack);
 const bytes=fs.readFileSync('app/book-heat-content.json'),integrity=read('app/book-heat-integrity.json');
 assert.equal(bytes.length,integrity.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),integrity.sha256);
 const words=GLOSSARY.map(([term,short,more])=>({term,short,more})),why=WHY_QUESTIONS.map(([question,answer])=>({question,answer})),topics=read('app/world-index.json'),links=read('app/book-heat-topic-index.json');
 assert.equal(links.length,4);assert.equal(new Set(words.map(w=>w.term)).size,words.length);assert.equal(new Set(why.map(w=>w.question)).size,why.length);
 for(const term of HEAT_WORDS){
  const definition=words.find(w=>w.term===term),item=pack.learning[term];assert.ok(definition);assert.deepEqual([definition.term,definition.short,definition.more],pack.words[term]);
  assert.ok(topics.some(t=>t.id===item.topic));assert.deepEqual(links.find(l=>l.term===term),{term,topic:item.topic,connection:item.benefit});
 }
 for(const question of HEAT_QUESTIONS){const definition=why.find(w=>w.question===question);assert.ok(definition);assert.deepEqual([definition.question,definition.answer],pack.why[question]);}
 for(const item of[...Object.values(pack.learning),...Object.values(pack.whyLearning)]){
  for(const link of item.relatedWords??[])assert.ok(words.some(w=>w.term===link.term));
  for(const link of item.relatedQuestions??[])assert.ok(why.some(w=>w.question===link.question));
 }
});

test('partial heat packs, mismatched source dates, unsafe links and incomplete wrong-answer feedback are rejected',()=>{
 assert.equal(validateHeatPack(pack),pack);
 for(const mutate of[
  d=>{delete d.words.Wärme;},d=>{delete d.learning.Konvektion;},d=>{delete d.why[HEAT_QUESTIONS[0]];},d=>{delete d.whyLearning[HEAT_QUESTIONS[1]];},
  d=>{d.learning.Wärme.question.correct=99;},d=>{d.learning.Wärme.question.answers[1]=d.learning.Wärme.question.answers[0];},
  d=>{d.learning.Wärmeleitung.question.wrongReasons[0]='';},d=>{d.learning.Konvektion.sources[0].url='http://example.invalid';},
  d=>{d.learning.Konvektion.sources[0].checkedOn='2026-10-27';},d=>{d.sourceReadOn='2026-02-30';},
  d=>{d.learning.Wärmestrahlung.figure='measured-thermal-camera';},d=>{d.learning.Wärmestrahlung.relatedWords[1].term='Unpublished word';},
  d=>{d.whyLearning[HEAT_QUESTIONS[0]].topic='unpublished-topic';},d=>{d.words.Wärme[0]='alias';}
 ]){const broken=structuredClone(pack);mutate(broken);assert.throws(()=>validateHeatPack(broken),/Incomplete heat/);}
});
