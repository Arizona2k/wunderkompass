import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {HEAT_WORDS,HEAT_QUESTIONS,validateHeatPack} from '../app/book-heat-validation.mjs';
import {bookHeatContent} from '../scripts/book-heat-index.mjs';

const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),pack=read('app/book-heat-content.json');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('all six heat explanations use one verified payload, matching projections and published routes',()=>{
 assert.deepEqual(bookHeatContent(true),pack);
 const bytes=fs.readFileSync('app/book-heat-content.json'),integrity=read('app/book-heat-integrity.json');
 assert.equal(bytes.length,integrity.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),integrity.sha256);
 const words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json'),exported=read('exports/content/book-heat.json'),topics=read('app/world-index.json'),links=read('app/book-heat-topic-index.json');
 assert.equal(exported.length,6);assert.equal(links.length,4);
 for(const term of HEAT_WORDS){
  const definition=words.find(w=>w.term===term),item=pack.learning[term];assert.ok(definition);assert.deepEqual([definition.term,definition.short,definition.more],pack.words[term]);
  assert.deepEqual(exported.find(e=>e.kind==='word'&&e.term===term),{kind:'word',term,definition:definition.more,...item,sourceReadOn:pack.sourceReadOn});
  assert.ok(topics.some(t=>t.id===item.topic));assert.deepEqual(links.find(l=>l.term===term),{term,topic:item.topic,connection:item.benefit});
 }
 for(const question of HEAT_QUESTIONS){const definition=why.find(w=>w.question===question);assert.ok(definition);assert.deepEqual([definition.question,definition.answer],pack.why[question]);assert.deepEqual(exported.find(e=>e.kind==='why'&&e.question===question),{kind:'why',question,definition:definition.answer,...pack.whyLearning[question],sourceReadOn:pack.sourceReadOn});}
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

test('all97 delivered definitions,30 old Why answers and the full seven-SI payload remain byte-identical in meaning',()=>{
 const before=read('tests/fixtures/book-before-heat-97-hashes.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');
 assert.equal(Object.keys(before.words).length,97);assert.equal(Object.keys(before.why).length,30);assert.equal(words.length,134);assert.equal(why.length,42);
 assert.equal(new Set(words.map(w=>w.term)).size,134);assert.equal(new Set(why.map(w=>w.question)).size,42);
 for(const [term,hash]of Object.entries(before.words))assert.equal(digest(words.find(w=>w.term===term)),hash,term);
 for(const [question,hash]of Object.entries(before.why))assert.equal(digest(why.find(w=>w.question===question)),hash,question);
 assert.equal(createHash('sha256').update(fs.readFileSync('app/book-measurement-content.json')).digest('hex'),before.sevenSIPackSHA256);
 assert.equal(read('content/excellence-baseline.json').families.find(f=>f.id==='words').count,90);
 assert.equal(read('content/excellence-baseline.json').families.find(f=>f.id==='why').count,30);
});


test('scoped source-reviewed heat followup preserves every existing question, answer and unrelated topic field',()=>{
 const before=read('tests/fixtures/heat-topic-before-book-20261028.json');assert.equal(before.sourceCommit,'aa2764a352ae84790cef7a9084a974a3c4023e33');
 const old=before.topic,current=read('app/world-catalog.json').find(t=>t.id===old.id);
 assert.equal(digest(old),'abdb24bc9040ab25f4e1aae13e3b2129ea81ff37ae0e8ccaa7f95a5cb9713ad1');
 assert.equal(digest(current),'50d9a3a82746412bae92707373a42925df054405eefd6051bc9dc89dd9784d84');
 const fields=new Set(['intro','surprise','sources','sourceNote','checkedAt','revision','learning']);
 for(const key of new Set([...Object.keys(old),...Object.keys(current)]))if(!fields.has(key))assert.deepEqual(current[key],old[key],key+' remains exact');
 for(const key of new Set([...Object.keys(old.learning),...Object.keys(current.learning)]))if(!['starter','observe'].includes(key))assert.deepEqual(current.learning[key],old.learning[key],key+' old learning field remains exact');
 assert.equal(current.revision,old.revision+1);assert.equal(current.checkedAt,pack.sourceReadOn);
 assert.match(current.intro,/Flüssigkeit.*Gas/);assert.match(current.learning.observe,/Gedankenvergleich/);
 const readURLs=new Set([...Object.values(pack.learning),...Object.values(pack.whyLearning)].flatMap(item=>item.sources.map(s=>s.url)));assert(current.sources.every(s=>readURLs.has(s.url)));
});
