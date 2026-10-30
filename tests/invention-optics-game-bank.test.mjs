import {gameBeforeLearningAudit} from './learning-audit-reference.mjs';
// Only named field revisions are projected for these historical comparisons;
// raw current fields and all190topics/sevenbanks have separate strict guards.
import mechanicsBaseline from './fixtures/retained-before-invention-mechanics.json' with {type:'json'};
const mechanicsIds=mechanicsBaseline.newIds;
import test from 'node:test';
import assert from 'node:assert/strict';
import {worldGameBank,restoreWorldGameOrders} from '../app/world-game-bank.ts';
import retained from './fixtures/retained-optical-game-banks.json' with {type:'json'};
import catalog from '../app/world-catalog.json' with {type:'json'};
const ids=['invention-camera','invention-telescope','invention-microscope'];
const electricalIds=['invention-battery','invention-generator','invention-transistor'];
test('actual production bank preserves all twelve original technology questions and answer sets exactly',()=>{
 assert.equal(retained.sourceCommit,'64d45a3c0e73b5fba79e0746b91089f741aae457');assert.equal(retained.technology.length,12);
 const actual=worldGameBank('technology');assert.equal(actual.length,24);assert.deepEqual(actual.filter(q=>![...ids,...electricalIds,...mechanicsIds].includes(q.id)),retained.technology);
 for(const before of retained.technology){const now=actual.find(q=>q.id===before.id),order=[...before.answers].reverse();assert.equal(order.length,3);assert.ok(order.every(answer=>now.answers.includes(answer)));assert.equal(now.answers[now.correct],before.answers[before.correct]);}
 const added=actual.filter(q=>ids.includes(q.id));assert.equal(added.length,3);for(const q of added){if(q.id==='invention-telescope')assert.equal(q.prompt,'Welche Erfindung passt zu dieser Beschreibung? Ein Gerät nutzt Linsen oder Spiegel, um Licht von weit entfernten Objekten zu sammeln.');else assert.match(q.prompt,/^Welche Erfindung passt zu dieser Forscherfrage\?/);assert.equal(new Set(q.answers).size,3);assert.equal(q.answers[q.correct],catalog.find(t=>t.id===q.id).title);}
});
test('actual chronological game retains all twenty-four original tasks and excludes principle walkthroughs',()=>{
 assert.equal(retained.thenNow.length,24);const actual=worldGameBank('then-now');assert.equal(actual.length,24);assert.deepEqual(actual.map(gameBeforeLearningAudit),retained.thenNow);assert.equal(actual.find(q=>q.id==='invention-compass-today').answers[0],'Früher und heute');
 assert.ok(actual.every(q=>!catalog.find(t=>t.id===q.topic).invention.walkthrough));assert.ok(!actual.some(q=>ids.includes(q.topic)),'scientific questions and model limits cannot become invented earlier/today facts');
});
test('a pre-expansion order map preserves every old choice and unknown field while supplying only new defaults',()=>{
 const pool=worldGameBank('technology'),fallback=Object.fromEntries(pool.map(q=>[q.id,[...q.answers]])),saved={...Object.fromEntries(retained.technology.map(q=>[q.id,[...q.answers].reverse()])),futureQuestion:{opaque:'synthetic future value'}};
 const restored=restoreWorldGameOrders(saved,fallback,pool);for(const [id,value]of Object.entries(saved))assert.deepEqual(restored[id],value,id+' original field retained');for(const id of ids)assert.deepEqual(restored[id],fallback[id]);assert.deepEqual(saved.futureQuestion,{opaque:'synthetic future value'});
});
test('one malformed current order recovers without resetting other saved questions or unrelated fields',()=>{
 const pool=worldGameBank('technology'),fallback=Object.fromEntries(pool.map(q=>[q.id,[...q.answers]])),saved={...Object.fromEntries(retained.technology.map(q=>[q.id,[...q.answers].reverse()])),futureQuestion:{opaque:'kept'}};const broken=retained.technology[7].id;saved[broken]=[pool[7].answers[0],pool[7].answers[0],pool[7].answers[0]];const restored=restoreWorldGameOrders(saved,fallback,pool);assert.deepEqual(restored[broken],fallback[broken]);for(const [id,value]of Object.entries(saved))if(id!==broken)assert.deepEqual(restored[id],value);
});
