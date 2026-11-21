import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {WATER_WORDS,WATER_RETAINED_WORDS,WATER_QUESTIONS,validateWaterPack} from '../app/book-water-validation.mjs';
import {bookWaterContent} from '../scripts/book-water-index.mjs';
import {GLOSSARY,WHY_QUESTIONS} from '../app/learning-data.ts';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),pack=read('app/book-water-content.json');

test('water studies add four concepts and three Why questions with canonical Dichte, source integrity and real connections',()=>{
 assert.deepEqual(bookWaterContent(true),pack);assert.deepEqual(WATER_RETAINED_WORDS,['Dichte']);
 const bytes=fs.readFileSync('app/book-water-content.json'),integrity=read('app/book-water-integrity.json');assert.equal(bytes.length,integrity.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),integrity.sha256);
 const words=GLOSSARY.map(([term,short,more])=>({term,short,more})),why=WHY_QUESTIONS.map(([question,answer])=>({question,answer})),projection=read('app/book-water-index.json'),topics=read('app/world-index.json'),links=read('app/book-water-topic-index.json');
 assert.equal(links.length,5);assert.equal(new Set(words.map(w=>w.term)).size,words.length);assert.equal(new Set(why.map(w=>w.question)).size,why.length);assert.equal(projection.words.length,4);assert(!projection.words.some(row=>row[0]==='Dichte'));assert.equal(words.filter(w=>w.term==='Dichte').length,1);
 for(const term of WATER_WORDS){const row=words.find(w=>w.term===term),item=pack.learning[term];assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert.deepEqual(links.find(l=>l.term===term),{term,topic:item.topic,connection:item.benefit});}
 for(const question of WATER_QUESTIONS){const row=why.find(w=>w.question===question);assert.deepEqual([row.question,row.answer],pack.why[question]);}
 for(const item of [...Object.values(pack.learning),...Object.values(pack.whyLearning)]){assert(topics.some(t=>t.id===item.topic));for(const link of item.relatedWords??[])assert(words.some(w=>w.term===link.term));for(const link of item.relatedQuestions??[])assert(why.some(w=>w.question===link.question));}
 const incoming=read('app/book-water-word-link-index.json');assert.deepEqual(incoming,{Kilogramm:[{term:'Dichte',reason:pack.learning.Dichte.relatedWords.find(l=>l.term==='Kilogramm').reason}]});
});

test('unsafe, incomplete or stale water models, feedback and links fail closed',()=>{
 assert.equal(validateWaterPack(pack),pack);
 for(const mutate of [d=>{delete d.words.Dichte;},d=>{delete d.learning.Kohäsion;},d=>{delete d.why[WATER_QUESTIONS[0]];},d=>{delete d.whyLearning[WATER_QUESTIONS[1]];},d=>{d.learning.Dichte.question.correct=7;}]){const broken=structuredClone(pack);mutate(broken);assert.throws(()=>validateWaterPack(broken),/Incomplete water/);}
 for(const mutate of [d=>{d.learning.Dichte.question.answers[1]=d.learning.Dichte.question.answers[0];},d=>{d.learning.Dichte.question.wrongReasons[1]='';},d=>{d.learning.Dichte.sources[0].url='javascript:alert(1)';},d=>{d.sourceReadOn='2026-02-30';},d=>{d.learning.Kapillarwirkung.sources[0].checkedOn='2026-10-27';},d=>{d.learning.Kapillarwirkung.figure='unlimited-tree-pump';},d=>{d.learning.Kohäsion.relatedWords[0].term='Unknown';},d=>{d.learning.Dichte.topic='science-water-cycle';}]){const broken=structuredClone(pack);mutate(broken);assert.throws(()=>validateWaterPack(broken),/Incomplete water/);}
});
