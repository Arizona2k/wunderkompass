import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import review from '../content/history-editorial-review.json' with {type:'json'};
import registry from '../content/editorial-reviews.json' with {type:'json'};
import {CHALLENGE_BANK,restoreChallenge} from '../app/knowledge-challenge.ts';
import {historicalQuestionBank} from '../scripts/world-question-index.mjs';
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('two prepared historical concepts preserve the complete actual public166-question bank and existing old histories',()=>{
 assert.deepEqual(review.newTopicIds,['history-khipu','history-mohenjo-daro']);assert.equal(catalog.length,145);assert.equal(catalog.filter(t=>t.category==='history').length,33);
 const retained=historicalQuestionBank(CHALLENGE_BANK,registry.questionCorrections).filter(q=>![...review.newTopicIds,'invention-camera','invention-telescope','invention-microscope'].includes(q.topic));assert.equal(retained.length,166);assert.equal(digest(retained),review.retainedQuestionBank.sha256);assert.equal(review.retainedQuestionBank.sourceCommit,'762a18332e9e05b3e87d554e2219d257ea2ee33c');
 assert.equal(CHALLENGE_BANK.length,175);assert.equal(new Set(CHALLENGE_BANK.map(q=>q.id)).size,175);
 for(const entry of review.entries){const t=catalog.find(t=>t.id===entry.id);assert.equal(digest(t),entry.contentHash);assert.equal(t.challenges.length,2);assert.deepEqual(t.challenges.map(q=>q.difficulty),['medium','hard']);const questions=CHALLENGE_BANK.filter(q=>q.topic===t.id);assert.equal(questions.length,3);assert.ok(questions.every(q=>q.hints.length>0));assert.equal(new Set(questions.map(q=>q.hints[0])).size,3);for(const id of t.related){assert.ok(catalog.find(x=>x.id===id).related.includes(t.id));assert.ok(graph.connections.some(c=>c.fromId===t.id&&c.toId===id||c.toId===t.id&&c.fromId===id));}}
 for(const [id,before]of Object.entries(review.retained)){const current=catalog.find(t=>t.id===id);assert.deepEqual(current.question.answers,before.question.answers);assert.equal(current.question.correct,before.question.correct);assert.deepEqual(current.history,before.history);assert.deepEqual(current.locations,before.locations);if(id!=='history-writing')assert.deepEqual({...current,related:before.related},before);}
 const writing=catalog.find(t=>t.id==='history-writing');assert.equal(digest(writing),review.currentWritingContentHash);assert.deepEqual(historicalQuestionBank([{...writing.question,id:'history-writing:mini',topic:'history-writing'}],registry.questionCorrections)[0],{...review.retained['history-writing'].question,id:'history-writing:mini',topic:'history-writing'});
});
test('historical sources distinguish quantity, meaning and limited archaeological observations',()=>{
 const khipu=catalog.find(t=>t.id==='history-khipu'),city=catalog.find(t=>t.id==='history-mohenjo-daro');assert.deepEqual(khipu.locations,[]);assert.match(khipu.more[0],/ersetzt dieses historische Verfahren nicht/);assert.match(khipu.more[1],/Forschungsfrage/);assert.match(city.sourceNote,/unterschiedliche Ziegelangaben/);assert.ok(!city.paragraphs.some(p=>/alle.*gebrannt|alle.*ungebrannt/.test(p)));assert.match(city.challenges[0].why,/andere Belege/);assert.match(city.challenges[1].why,/Ausschnitt/);assert.equal(review.independentReview,false);assert.equal(review.runtimeNewTopics,2);
});
test('old six-question rounds keep their saved answer order and result after these two additions',()=>{
 for(const difficulty of ['easy','medium','hard']){const pool=CHALLENGE_BANK.filter(q=>q.difficulty===difficulty&&![...review.newTopicIds,'invention-camera','invention-telescope','invention-microscope'].includes(q.topic)).slice(0,6),old={difficulty,ids:pool.map(q=>q.id),orders:Object.fromEntries(pool.map(q=>[q.id,[...q.answers].reverse()])),index:2,answer:pool[2].answers[pool[2].correct],done:false};assert.equal(pool.length,6);assert.deepEqual(restoreChallenge(JSON.parse(JSON.stringify(old)),{invalid:true}),old);}
});
