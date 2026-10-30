import {dossierBeforeLearningAudit} from './learning-audit-reference.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {WATER_WORDS,WATER_RETAINED_WORDS,WATER_QUESTIONS,validateWaterPack} from '../app/book-water-validation.mjs';
import {bookWaterContent} from '../scripts/book-water-index.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),pack=read('app/book-water-content.json'),digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('water studies add four concepts and three Why questions with canonical Dichte, source integrity and real connections',()=>{
 assert.deepEqual(bookWaterContent(true),pack);assert.deepEqual(WATER_RETAINED_WORDS,['Dichte']);
 const bytes=fs.readFileSync('app/book-water-content.json'),integrity=read('app/book-water-integrity.json');assert.equal(bytes.length,integrity.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),integrity.sha256);
 const words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json'),exported=read('exports/content/book-water.json'),projection=read('app/book-water-index.json'),topics=read('app/world-index.json'),links=read('app/book-water-topic-index.json');
 assert.equal(words.length,122);assert.equal(why.length,37);assert.equal(exported.length,8);assert.equal(links.length,5);assert.equal(projection.words.length,4);assert(!projection.words.some(row=>row[0]==='Dichte'));assert.equal(words.filter(w=>w.term==='Dichte').length,1);
 for(const term of WATER_WORDS){const row=words.find(w=>w.term===term),item=pack.learning[term];assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert.deepEqual(exported.find(e=>e.kind==='word'&&e.term===term),{kind:'word',term,definition:row.more,...item,sourceReadOn:pack.sourceReadOn});assert.deepEqual(links.find(l=>l.term===term),{term,topic:item.topic,connection:item.benefit});}
 for(const question of WATER_QUESTIONS){const row=why.find(w=>w.question===question);assert.deepEqual([row.question,row.answer],pack.why[question]);}
 for(const item of [...Object.values(pack.learning),...Object.values(pack.whyLearning)]){assert(topics.some(t=>t.id===item.topic));for(const link of item.relatedWords??[])assert(words.some(w=>w.term===link.term));for(const link of item.relatedQuestions??[])assert(why.some(w=>w.question===link.question));}
 const incoming=read('app/book-water-word-link-index.json');assert.deepEqual(incoming,{Kilogramm:[{term:'Dichte',reason:pack.learning.Dichte.relatedWords.find(l=>l.term==='Kilogramm').reason}]});
});

test('all113 prior word payloads,34 Why payloads and entire SI, heat and light packs preserve actual M76 identities',()=>{
 const old=read('tests/fixtures/book-before-water-113-hashes.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');assert.equal(old.sourceCommit,'53418c2a3d527f8ccfcee1bfac01d03b9cc4aff8');assert.equal(Object.keys(old.words).length,113);assert.equal(Object.keys(old.why).length,34);
 assert.equal(new Set(words.map(w=>w.term)).size,122);assert.equal(new Set(why.map(w=>w.question)).size,37);
 for(const [term,sha]of Object.entries(old.words))assert.equal(digest(words.find(w=>w.term===term)),sha,term);
 for(const [question,sha]of Object.entries(old.why))assert.equal(digest(why.find(w=>w.question===question)),sha,question);
 for(const file of ['app/book-measurement-content.json','app/book-heat-content.json','app/book-light-content.json'])assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),old.packs[file]);
 const baseline=read('content/excellence-baseline.json');assert.equal(baseline.families.find(f=>f.id==='words').count,90);assert.equal(baseline.families.find(f=>f.id==='why').count,30);
});

test('water additions preserve all126 earlier complete individual dossiers',()=>{
 const old=read('tests/fixtures/editorial-before-water-126-hashes.json'),current=read('content/editorial-reviews.json').dossiers.map(dossierBeforeLearningAudit);assert.equal(old.dossiers.length,126);assert.equal(current.length,139);
 for(const d of old.dossiers){const now=current.find(e=>e.id===d.id);assert(now);const unchanged={...now};if(now.historicalUIBeforeAuditUiCurrentFull20261029){unchanged.ui=now.historicalUIBeforeAuditUiCurrentFull20261029;delete unchanged.historicalUIBeforeAuditUiCurrentFull20261029;}
  // Rewind the later particle UI layer before the older water layer. The
  // independent134-dossier fixture also binds that complete intermediate state.
  if(now.historicalUIBeforeParticleCurrentFull20261029){unchanged.ui=now.historicalUIBeforeParticleCurrentFull20261029;delete unchanged.historicalUIBeforeParticleCurrentFull20261029;}
  delete unchanged.historicalUIBeforeWaterCurrentFull20261029;const saved=now.historicalUIBeforeWaterCurrentFull20261029;if(saved)unchanged.ui=saved;assert.equal(digest(unchanged),d.sha256,d.id+' complete prior fields and UI history preserved');}
});

test('unsafe, incomplete or stale water models, feedback and links fail closed',()=>{
 assert.equal(validateWaterPack(pack),pack);
 for(const mutate of [d=>{delete d.words.Dichte;},d=>{delete d.learning.Kohäsion;},d=>{delete d.why[WATER_QUESTIONS[0]];},d=>{delete d.whyLearning[WATER_QUESTIONS[1]];},d=>{d.learning.Dichte.question.correct=7;}]){const broken=structuredClone(pack);mutate(broken);assert.throws(()=>validateWaterPack(broken),/Incomplete water/);}
 for(const mutate of [d=>{d.learning.Dichte.question.answers[1]=d.learning.Dichte.question.answers[0];},d=>{d.learning.Dichte.question.wrongReasons[1]='';},d=>{d.learning.Dichte.sources[0].url='javascript:alert(1)';},d=>{d.sourceReadOn='2026-02-30';},d=>{d.learning.Kapillarwirkung.sources[0].checkedOn='2026-10-27';},d=>{d.learning.Kapillarwirkung.figure='unlimited-tree-pump';},d=>{d.learning.Kohäsion.relatedWords[0].term='Unknown';},d=>{d.learning.Dichte.topic='science-water-cycle';}]){const broken=structuredClone(pack);mutate(broken);assert.throws(()=>validateWaterPack(broken),/Incomplete water/);}
});
