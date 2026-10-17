import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import questions from '../app/world-question-index.json' with {type:'json'};
import hints from '../app/challenge-hints.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import review from '../content/history-editorial-review.json' with {type:'json'};
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('two distinct historical topics retain the entire preceding209-question bank and exact original answer positions',()=>{
 const ids=review.newTopicIds;assert.deepEqual(ids,['history-khipu','history-mohenjo-daro']);
 const retained=questions.filter(q=>!ids.includes(q.topic));assert.equal(retained.length,209);assert.equal(digest(retained),review.retainedQuestionBank.sha256);
 assert.equal(catalog.filter(t=>t.category==='history').length,33);assert.equal(review.runtimeNewTopics,2);assert.equal(review.acceptedNew,0);assert.equal(review.independentReview,false);
 for(const entry of review.entries){const topic=catalog.find(t=>t.id===entry.id);assert.equal(digest(topic),entry.contentHash);assert.equal(topic.challenges.length,2);assert.deepEqual(topic.challenges.map(q=>q.difficulty),['medium','hard']);assert.equal(new Set([topic.questionFeedback.hint,...topic.challenges.map(q=>hints[q.id].steps[0])]).size,3);assert.equal(questions.filter(q=>q.topic===topic.id).length,3);
  for(const otherId of topic.related){assert.ok(catalog.find(t=>t.id===otherId).related.includes(topic.id));assert.ok(graph.connections.some(e=>e.fromId===topic.id&&e.toId===otherId||e.toId===topic.id&&e.fromId===otherId));}
 }
 for(const prior of Object.values(review.retained)){const current=catalog.find(t=>t.id===prior.id);assert.deepEqual(current.question,prior.question);assert.deepEqual(current.history,prior.history);assert.deepEqual(current.locations,prior.locations);}
});
test('archaeology distinguishes a material observation from an unsupported universal conclusion',()=>{
 const topic=catalog.find(t=>t.id==='history-mohenjo-daro');assert.match(topic.sourceNote,/unterschiedliche Ziegelangaben/);assert.ok(!topic.paragraphs.some(p=>/alle.*gebrannt|alle.*ungebrannt/.test(p)));
 assert.match(topic.challenges[0].why,/andere Belege/);assert.match(topic.challenges[1].why,/Ausschnitt/);
 const khipu=catalog.find(t=>t.id==='history-khipu');assert.deepEqual(khipu.locations,[],'no invented universal findspot');assert.match(khipu.more[0],/ersetzt dieses historische Verfahren nicht/);assert.match(khipu.more[1],/Forschungsfrage/);
});
