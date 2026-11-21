import test from 'node:test';
import assert from 'node:assert/strict';
import {worldGameBank,restoreWorldGameOrders} from '../app/world-game-bank.ts';
import retained from './fixtures/retained-optical-game-banks.json' with {type:'json'};
const ids=['invention-camera','invention-telescope','invention-microscope'];
test('a pre-expansion order map preserves every old choice and unknown field while supplying only new defaults',()=>{
 const pool=worldGameBank('technology'),fallback=Object.fromEntries(pool.map(q=>[q.id,[...q.answers]])),saved={...Object.fromEntries(retained.technology.map(q=>[q.id,[...q.answers].reverse()])),futureQuestion:{opaque:'synthetic future value'}};
 const restored=restoreWorldGameOrders(saved,fallback,pool);for(const [id,value]of Object.entries(saved))assert.deepEqual(restored[id],value,id+' original field retained');for(const id of ids)assert.deepEqual(restored[id],fallback[id]);assert.deepEqual(saved.futureQuestion,{opaque:'synthetic future value'});
});
test('one malformed current order recovers without resetting other saved questions or unrelated fields',()=>{
 const pool=worldGameBank('technology'),fallback=Object.fromEntries(pool.map(q=>[q.id,[...q.answers]])),saved={...Object.fromEntries(retained.technology.map(q=>[q.id,[...q.answers].reverse()])),futureQuestion:{opaque:'kept'}};const broken=retained.technology[7].id;saved[broken]=[pool[7].answers[0],pool[7].answers[0],pool[7].answers[0]];const restored=restoreWorldGameOrders(saved,fallback,pool);assert.deepEqual(restored[broken],fallback[broken]);for(const [id,value]of Object.entries(saved))if(id!==broken)assert.deepEqual(restored[id],value);
});
