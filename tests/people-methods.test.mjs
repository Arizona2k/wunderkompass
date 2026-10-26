import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import inquiries from '../app/people-inquiries.json' with {type:'json'};
import media from '../app/people-illustrations.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import hints from '../app/challenge-hints.json' with {type:'json'};
import legacy from './fixtures/legacy-people20-before-merian-lehmann.json' with {type:'json'};
import {CHALLENGE_BANK,restoreChallenge} from '../app/knowledge-challenge.ts';
import {worldGameBank,restoreWorldGameOrders} from '../app/world-game-bank.ts';
import {PEOPLE_METHOD_IDS,beforePeopleMethods,beforePeopleMethodQuestions} from './people-methods-reference.mjs';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
test('the real preceding20-person topics, every clue/choice and all220 challenge records survive the two prepared additions',()=>{
 assert.equal(catalog.length,190);assert.equal(catalog.filter(t=>t.person).length,22);
 assert.deepEqual(beforePeopleMethods(catalog).filter(t=>t.person),legacy.peopleTopics);
 assert.deepEqual(worldGameBank('people').filter(t=>!PEOPLE_METHOD_IDS.includes(t.id)),legacy.peopleBank);
 const old=beforePeopleMethodQuestions(CHALLENGE_BANK);assert.equal(old.length,220);assert.equal(hash(old),legacy.previousChallengeSHA256);assert.equal(CHALLENGE_BANK.length,226);
 for(const difficulty of ['easy','medium','hard']){const pool=old.filter(q=>q.difficulty===difficulty).slice(0,6),round={difficulty,ids:pool.map(q=>q.id),orders:Object.fromEntries(pool.map(q=>[q.id,[...q.answers].reverse()])),index:2,answer:pool[2].answers[(pool[2].correct+1)%3],done:false};assert.deepEqual(restoreChallenge(structuredClone(round),{invalid:true}),round);}
 const pool=worldGameBank('people'),orders=Object.fromEntries(legacy.peopleBank.map(q=>[q.id,[...q.answers].reverse()]));assert.deepEqual(Object.fromEntries(Object.entries(restoreWorldGameOrders(orders,{},pool,'people')).filter(([id])=>id in orders)),orders);
});
test('new biographies connect observation to evidence with scoped tasks, specific wrong reasons and declared media limits',()=>{
 assert.equal(inquiries.entries.length,4);assert.equal(media.entries.length,4);assert.equal(inquiries.entries.flatMap(e=>e.tasks).length,12);
 for(const [index,id] of PEOPLE_METHOD_IDS.entries()){
  const topic=catalog.find(t=>t.id===id),entry=inquiries.entries.find(e=>e.id===id),image=media.entries.find(e=>e.id===id),target=index===0?'animal-monarch-butterfly':'invention-seismograph';
  assert.deepEqual(topic.related,[target]);assert.equal(catalog.find(t=>t.id===target).related.filter(x=>x===id).length,1);assert.equal(graph.connections.filter(e=>e.fromId===id&&e.toId===target||e.fromId===target&&e.toId===id).length,1);assert.equal(graph.connections.find(e=>e.fromId===id&&e.toId===target).kind,'evidence');
  assert.equal(topic.sources.length,3);assert.match(image.caption,/mit KI-Unterstützung/);assert.equal(image.notPhotograph,true);
  assert.deepEqual(entry.tasks.map(t=>t.age),['6-8','9-11','12-14']);assert.equal(new Set(entry.tasks.map(t=>t.correct)).size,3);
  for(const task of entry.tasks){assert.equal(task.wrongReasons[task.correct],null);for(const [i,reason] of task.wrongReasons.entries())if(i!==task.correct){assert.ok(reason.length>45);assert.notEqual(reason,task.why);}assert.ok(task.example.length>80);}
  const questions=CHALLENGE_BANK.filter(q=>q.topic===id);assert.deepEqual(questions.map(q=>q.difficulty),['easy','medium','hard']);for(const q of questions){assert.equal(q.hints.length,2);assert.equal(hints[q.id].wrongReasons[q.correct],null);assert.equal(hints[q.id].wrongReasons.filter(Boolean).length,2);}
 }
 const merian=catalog.find(t=>t.id===PEOPLE_METHOD_IDS[0]),lehmann=catalog.find(t=>t.id===PEOPLE_METHOD_IDS[1]);
 assert.match(merian.paragraphs.join(' '),/1699.*1701.*1705/);assert.match(merian.paragraphs.join(' '),/indigener und versklavter.*profitierte/);assert.match(graph.connections.find(e=>e.fromId===merian.id).why,/nicht behauptet/);
 assert.match(lehmann.more.join(' '),/feste und flüssige/);assert.match(lehmann.paragraphs.join(' '),/1936.*Heute.*flüssigen äußeren und einen festen inneren/);
});
