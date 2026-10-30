import {gameBeforeLearningAudit} from './learning-audit-reference.mjs';
// Only named field revisions are projected for these historical comparisons;
// raw current fields and all190topics/sevenbanks have separate strict guards.
import {beforePeopleMethods,beforePeopleMethodQuestions,beforePeopleMethodGraph} from './people-methods-reference.mjs';
import {topicAtHistoricalMediaReference} from './retained-topic-reference.mjs';
import scienceBaseline from './fixtures/retained-before-science-originals.json' with {type:'json'};
const scienceIds=scienceBaseline.newIds;
import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import currentCatalog from '../app/world-catalog.json' with {type:'json'};import currentGraph from '../app/world-connections.json' with {type:'json'};import baseline from './fixtures/retained-before-building-originals.json' with {type:'json'};import {CHALLENGE_BANK as currentChallengeBank,restoreChallenge} from '../app/knowledge-challenge.ts';import {worldGameBank} from '../app/world-game-bank.ts';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex'),ids=baseline.newIds;
test('eight preserved building originals retain every preceding156 topic field and every old connection except14 explicit reciprocal links',()=>{
 assert.equal(baseline.sourceCommit,'475e4cbfbe45ab524cf4b3f62316ca0c02a74694');assert.deepEqual(ids,['building-pont-du-gard','building-great-zimbabwe','building-horyu-ji','building-djenne-mosque','building-lalibela','building-angkor-wat','building-palenque','building-sydney-opera']);assert.equal(catalog.length,188);assert.equal(catalog.filter(t=>t.category==='buildings').length,16);
 const old=catalog.filter(t=>!['history-bronze',...ids,...scienceIds].includes(t.id)).map(topicAtHistoricalMediaReference).map(t=>({...t,related:t.related.filter(id=>!['history-bronze',...ids,...scienceIds].includes(id))}));assert.equal(old.length,baseline.oldCatalog.count);assert.equal(hash(old),baseline.oldCatalog.sha256);const retainedEdges=graph.connections.filter(e=>!['history-bronze',...ids,...scienceIds].includes(e.fromId)&&!['history-bronze',...ids,...scienceIds].includes(e.toId));assert.equal(retainedEdges.length,baseline.oldGraph.count);assert.equal(hash(retainedEdges),baseline.oldGraph.sha256);
 const edges=graph.connections.filter(e=>(ids.includes(e.fromId)||ids.includes(e.toId))&&!scienceIds.includes(e.fromId)&&!scienceIds.includes(e.toId));assert.equal(edges.length,14);assert.equal(new Set(edges.map(e=>[e.fromId,e.toId].sort().join('|'))).size,14);for(const edge of edges){assert.ok(edge.why.length>70);for(const [a,b]of [[edge.fromId,edge.toId],[edge.toId,edge.fromId]])assert.ok(catalog.find(t=>t.id===a).related.includes(b));}
 for(const id of ids){const t=catalog.find(t=>t.id===id),original=baseline.originalCorrectAnswers[id];assert.equal(t.question.correct,original.correct);assert.equal(t.question.answers[t.question.correct],original.answer);assert.equal(new Set(t.question.answers).size,3);assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);assert.equal(t.building.exploration.steps.length,3);assert.equal(t.image,undefined);}
});
test('all186 old challenge records and all seven saved world-game banks remain exact after the building additions',()=>{
 const retained=CHALLENGE_BANK.filter(q=>!['history-bronze',...ids,...scienceIds].includes(q.topic));assert.equal(retained.length,baseline.oldChallenges.count);assert.equal(hash(retained),baseline.oldChallenges.sha256);assert.equal(CHALLENGE_BANK.length,220);for(const [id,old]of Object.entries(baseline.oldGameBanks)){const pool=worldGameBank(id).map(gameBeforeLearningAudit).filter(q=>!['person-maria_sibylla_merian','person-inge_lehmann'].includes(q.topic));assert.equal(pool.length,old.count);assert.equal(hash(pool),old.sha256,id+' old questions, answers and orders');}
 for(const topic of ['invention-refrigerator','invention-elevator','invention-3d-printing']){const first=retained.find(q=>q.topic===topic),other=retained.filter(q=>q.difficulty===first.difficulty&&q.id!==first.id).slice(0,5),questions=[first,...other],old={difficulty:first.difficulty,ids:questions.map(q=>q.id),orders:Object.fromEntries(questions.map(q=>[q.id,[...q.answers].reverse()])),index:0,answer:first.answers[first.correct],done:false};assert.deepEqual(restoreChallenge(structuredClone(old),{invalid:true}),old);}
});

// Historical assertions retain their original release boundary; new additions are covered in people-methods.test.mjs.
const catalog=beforePeopleMethods(currentCatalog);
const CHALLENGE_BANK=beforePeopleMethodQuestions(currentChallengeBank);
const graph=beforePeopleMethodGraph(currentGraph);
