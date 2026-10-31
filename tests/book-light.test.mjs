import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {LIGHT_WORDS,LIGHT_QUESTIONS,validateLightPack} from '../app/book-light-validation.mjs';
import {bookLightContent} from '../scripts/book-light-index.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),pack=read('app/book-light-content.json'),digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('all14 light explanations share verified content, real published links and distinct current identities',()=>{
 assert.deepEqual(bookLightContent(true),pack);
 const bytes=fs.readFileSync('app/book-light-content.json'),integrity=read('app/book-light-integrity.json');assert.equal(bytes.length,integrity.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),integrity.sha256);
 const words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json'),exported=read('exports/content/book-light.json'),topics=read('app/world-index.json'),links=read('app/book-light-topic-index.json');
 assert.equal(exported.length,14);assert.equal(links.length,12);assert.equal(words.length,126);assert.equal(why.length,40);
 for(const term of LIGHT_WORDS){const row=words.find(w=>w.term===term),item=pack.learning[term];assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert.deepEqual(exported.find(e=>e.kind==='word'&&e.term===term),{kind:'word',term,definition:row.more,...item,sourceReadOn:pack.sourceReadOn});assert.deepEqual(links.find(l=>l.term===term),{term,topic:item.topic,connection:item.benefit});}
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

test('all101 prior word payloads,32 Why payloads and complete SI/heat content retain their actual M75 identities',()=>{
 const old=read('tests/fixtures/book-before-light-101-hashes.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');assert.equal(old.sourceCommit,'74ef5116d24a07a0efffaf323666f4ac554e8949');assert.equal(Object.keys(old.words).length,101);assert.equal(Object.keys(old.why).length,32);
 assert.equal(new Set(words.map(w=>w.term)).size,126);assert.equal(new Set(why.map(w=>w.question)).size,40);
 for(const [term,sha]of Object.entries(old.words))assert.equal(digest(words.find(w=>w.term===term)),sha,term);
 for(const [question,sha]of Object.entries(old.why))assert.equal(digest(why.find(w=>w.question===question)),sha,question);
 for(const [file,key]of[['app/book-heat-content.json','heatPackSHA256'],['app/book-measurement-content.json','measurementPackSHA256']])assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),old[key]);
 const baseline=read('content/excellence-baseline.json');assert.equal(baseline.families.find(f=>f.id==='words').count,90);assert.equal(baseline.families.find(f=>f.id==='why').count,30);
});

test('first inside revision preserves all14 earlier compatibility payloads and the exact original three selections',()=>{
 const before=read('tests/fixtures/journey-compatibility-before-inside-m75.json'),current=read('app/journey-task-compatibility.json');assert.equal(Object.keys(before.entries).length,14);assert.equal(Object.keys(current.entries).length,15);
 for(const [id,value]of Object.entries(before.entries))assert.deepEqual(current.entries[id],value,id);
 assert.deepEqual(current.entries['inside:4:1'].answers,['Die Uhrzeit des Tages','Der Ort unter oder an der Oberfläche','Die Farbe einer Landkarte']);assert.equal(current.entries['inside:4:1'].correct,1);
});
