import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type:'json'};
import inquiries from '../app/people-inquiries.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import legacy from './fixtures/legacy-people18-before-two-biographies.json' with {type:'json'};
import {worldGameBank,validWorldGameOrder,restoreWorldGameOrders} from '../app/world-game-bank.ts';

test('two prepared biographies retain all18 real old people clues and explain both reciprocal connections',()=>{
 const current=worldGameBank('people').filter(q=>!['person-maria_sibylla_merian','person-inge_lehmann'].includes(q.id));assert.equal(current.length,20);assert.equal(legacy.bank.length,18);
 for(const old of legacy.bank){const now=current.find(q=>q.id===old.id);assert.ok(now);assert.equal(now.prompt,old.prompt);assert.equal(now.answers[now.correct],old.answers[old.correct]);assert.equal(now.why,old.why);}
 for(const [id,target] of [['person-mary_anning','person-charles_darwin'],['person-ibn_al_haytham','invention-camera']]){
  const person=catalog.find(t=>t.id===id),related=catalog.find(t=>t.id===target);
  assert.equal(person.category,'people');assert.ok(person.related.includes(target));assert.ok(related.related.includes(id));
  const edge=graph.connections.filter(c=>c.fromId===id&&c.toId===target||c.fromId===target&&c.toId===id);assert.equal(edge.length,1);assert.ok(edge[0].why.length>80);
  assert.equal(person.sources.length,2);assert.ok(person.sources.every(s=>s.url.startsWith('https://')));
 }
 assert.equal(catalog.find(t=>t.id==='person-ibn_al_haytham').person.lifespan,'etwa 965–1040');
});

test('the actual old18 choice words and saved five-question people round survive the20-person bank',()=>{
 const pool=worldGameBank('people'),fallback=Object.fromEntries(pool.map(q=>[q.id,q.answers]));
 const old=structuredClone(legacy.round),orders={...old.orders,'unknown-future-question':['Unberührter alter Wert']};
 const restored=restoreWorldGameOrders(orders,fallback,pool,'people');
 for(const q of legacy.bank){assert.equal(validWorldGameOrder(old.orders[q.id],pool.find(x=>x.id===q.id),pool,'people'),true);assert.deepEqual(restored[q.id],old.orders[q.id]);}
 assert.deepEqual(restored['unknown-future-question'],orders['unknown-future-question']);
 assert.deepEqual(old,legacy.round);assert.ok(old.items.every(id=>pool.some(q=>q.id===id)));
 const selected=pool.find(q=>q.id===old.items[old.index]);assert.ok(restored[selected.id].includes(old.roundAnswer));assert.notEqual(old.roundAnswer,selected.answers[selected.correct]);
 for(const bad of [['Erfundene unbekannte Person',selected.answers[selected.correct],selected.answers[1]],[selected.answers[0],selected.answers[0],selected.answers[1]],selected.answers.filter((_,i)=>i!==selected.correct)])assert.equal(validWorldGameOrder(bad,selected,pool,'people'),false);
});

test('six distinct voluntary reasoning levels retain scoped examples, specific feedback and qualified examples',()=>{
 assert.equal(inquiries.schemaVersion,1);const original=inquiries.entries.filter(e=>['person-mary_anning','person-ibn_al_haytham'].includes(e.id));assert.equal(original.length,2);
 const goals=[];
 for(const entry of original){
  assert.ok(catalog.some(t=>t.id===entry.id));assert.ok(['fossil-evidence','light-to-eye'].includes(entry.figure));
  assert.deepEqual(entry.tasks.map(t=>t.age),['6-8','9-11','12-14']);
  for(const t of entry.tasks){
   goals.push(t.goal);assert.equal(t.answers.length,3);assert.equal(new Set(t.answers).size,3);assert.ok(Number.isInteger(t.correct)&&t.correct>=0&&t.correct<3);
   for(const key of ['goal','example','prompt','hint','why'])assert.ok(typeof t[key]==='string'&&t[key].trim().length>0);
   assert.equal(t.wrongReasons.length,3);assert.equal(t.wrongReasons[t.correct],null);
   for(let i=0;i<3;i++)if(i!==t.correct)assert.ok(typeof t.wrongReasons[i]==='string'&&t.wrongReasons[i].trim().length>0&&t.wrongReasons[i]!==t.why);
  }
 }
 assert.equal(new Set(goals).size,6);
});
