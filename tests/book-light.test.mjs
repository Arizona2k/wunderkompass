import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {LIGHT_WORDS,LIGHT_QUESTIONS,validateLightPack} from '../app/book-light-validation.mjs';
import {bookLightContent} from '../scripts/book-light-index.mjs';
import {GLOSSARY,WHY_QUESTIONS} from '../app/learning-data.ts';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),pack=read('app/book-light-content.json');

test('all14 light explanations share verified content, real published links and distinct current identities',()=>{
 assert.deepEqual(bookLightContent(true),pack);
 const bytes=fs.readFileSync('app/book-light-content.json'),integrity=read('app/book-light-integrity.json');assert.equal(bytes.length,integrity.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),integrity.sha256);
 const words=GLOSSARY.map(([term,short,more])=>({term,short,more})),why=WHY_QUESTIONS.map(([question,answer])=>({question,answer})),topics=read('app/world-index.json'),links=read('app/book-light-topic-index.json');
 assert.equal(links.length,12);assert.equal(new Set(words.map(w=>w.term)).size,words.length);assert.equal(new Set(why.map(w=>w.question)).size,why.length);
 for(const term of LIGHT_WORDS){const row=words.find(w=>w.term===term),item=pack.learning[term];assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert.deepEqual(links.find(l=>l.term===term),{term,topic:item.topic,connection:item.benefit});}
 for(const question of LIGHT_QUESTIONS){const row=why.find(w=>w.question===question);assert.deepEqual([row.question,row.answer],pack.why[question]);}
 for(const item of[...Object.values(pack.learning),...Object.values(pack.whyLearning)]){assert(topics.some(t=>t.id===item.topic));for(const link of item.relatedWords??[])assert(words.some(w=>w.term===link.term));for(const link of item.relatedQuestions??[])assert(why.some(w=>w.question===link.question));}
});

test('existing words gain only actual incoming relationships from the same light source',()=>{
 const incoming=read('app/book-light-word-link-index.json');assert.deepEqual(Object.keys(incoming).sort(),['Meter','Sekunde','Vollmond','Wärmestrahlung'].sort());
 for(const [old,links]of Object.entries(incoming))for(const link of links){assert(!Object.hasOwn(pack.words,old));assert.deepEqual(pack.learning[link.term].relatedWords.find(e=>e.term===old),{term:old,reason:link.reason});}
});

test('incomplete or tampered light explanations, unsupported models and unsafe reference data fail closed',()=>{
 assert.equal(validateLightPack(pack),pack);
 for(const mutate of[
  d=>{delete d.words.Photon;},d=>{delete d.learning.Reflexion;},d=>{delete d.why[LIGHT_QUESTIONS[0]];},d=>{delete d.whyLearning[LIGHT_QUESTIONS[1]];},
  d=>{d.learning.Brechung.question.correct=99;},d=>{d.learning.Reflexion.question.answers[1]=d.learning.Reflexion.question.answers[0];},
  d=>{d.learning.Energie.question.wrongReasons[0]='';},d=>{d.learning.Infrarot.sources[0].url='javascript:alert(1)';},
  d=>{d.learning.Absorption.sources[0].checkedOn='2026-10-27';},d=>{d.sourceReadOn='2026-02-30';},
  d=>{d.learning.Infrarot.figure='actual-body-temperature';},d=>{d.learning.Frequenz.relatedWords[0].term='Unpublished';},
  d=>{d.whyLearning[LIGHT_QUESTIONS[0]].topic='missing';},d=>{d.words.Strahlung[0]='Alias';}
 ]){const broken=structuredClone(pack);mutate(broken);assert.throws(()=>validateLightPack(broken),/Incomplete light/);}
});
