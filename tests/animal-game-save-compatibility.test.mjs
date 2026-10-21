import test from 'node:test';
import assert from 'node:assert/strict';
import {worldGameBank,restoreWorldGameOrders,validWorldGameOrder} from '../app/world-game-bank.ts';
import retained from './fixtures/retained-animal-game-before-expansion.json' with {type:'json'};

test('real pre-expansion animal orders keep every old choice, selected wrong answer and unrelated field',()=>{
 assert.equal(retained.sourceCommit,'0e5e4d4ece35d4a80dc79764c690c1633b2e0988');
 assert.equal(retained.animalDetective.length,24);
 const pool=worldGameBank('animal-detective');assert.equal(pool.length,48);
 const fallback=Object.fromEntries(pool.map(q=>[q.id,[...q.answers]]));
 const saved={...Object.fromEntries(retained.animalDetective.map(q=>[q.id,[...q.answers].reverse()])),futureField:{opaque:'preserve'}};
 const restored=restoreWorldGameOrders(saved,fallback,pool,'animal-detective');
 const changed=[];
 for(const before of retained.animalDetective){
  const current=pool.find(q=>q.id===before.id),oldOrder=saved[before.id],oldWrong=before.answers.find((_,i)=>i!==before.correct);
  assert.equal(current.answers[current.correct],before.answers[before.correct]);
  if(!before.answers.every(a=>current.answers.includes(a)))changed.push(before.id);
  assert.deepEqual(restored[before.id],oldOrder);
  assert.equal(validWorldGameOrder(restored[before.id],current,pool,'animal-detective'),true);
  assert.ok(restored[before.id].includes(oldWrong),'old selected wrong answer remains visible');
  assert.notEqual(oldWrong,current.answers[current.correct]);
 }
 assert.deepEqual(changed,['animal-red-kangaroo','animal-koala','animal-jaguar','animal-honey-bee','animal-axolotl','animal-whale-shark','animal-garden-cross-spider','animal-dromedary','animal-white-tailed-eagle']);
 assert.deepEqual(restored.futureField,saved.futureField);
 for(const q of pool.filter(q=>!retained.animalDetective.some(old=>old.id===q.id)))assert.deepEqual(restored[q.id],fallback[q.id]);
});

test('recognition compatibility rejects unknown names, missing correct answers, duplicates and malformed values',()=>{
 const pool=worldGameBank('animal-detective'),current=pool.find(q=>q.id==='animal-koala'),answer=current.answers[current.correct];
 const other=pool.filter(q=>q.id!==current.id).slice(0,3).map(q=>q.answers[q.correct]);
 const fallback=Object.fromEntries(pool.map(q=>[q.id,[...q.answers]]));
 for(const invalid of [[answer,other[0],'Invented animal'],other,[answer,answer,other[0]],[answer,other[0]],[answer,other[0],3],null,{0:answer}]){
  assert.equal(validWorldGameOrder(invalid,current,pool,'animal-detective'),false);
  assert.deepEqual(restoreWorldGameOrders({[current.id]:invalid},fallback,pool,'animal-detective')[current.id],fallback[current.id]);
 }
 const saved={...fallback,[current.id]:[answer,other[0],other[1]]};
 assert.equal(validWorldGameOrder(saved[current.id],current,pool,'animal-detective'),true);
 assert.deepEqual(restoreWorldGameOrders(saved,fallback,pool,'animal-detective')[current.id],saved[current.id]);
});

test('factual games keep current canonical answer validation and cannot inherit recognition distractors',()=>{
 for(const id of ['habitats','food','records','then-now']){
  const pool=worldGameBank(id),current=pool[0],answer=current.answers[current.correct];
  assert.equal(validWorldGameOrder([...current.answers].reverse(),current,pool,id),true);
  const outside=pool.map(q=>q.answers[q.correct]).find(x=>!current.answers.includes(x))??'Kein belegter Auswahlwert';
  const invalid=[answer,current.answers.find(x=>x!==answer),outside];
  assert.equal(validWorldGameOrder(invalid,current,pool,id),false,id+' remains canonical');
 }
});

test('recognition compatibility is bounded to the current game family and needs explicit context',()=>{
 const pool=worldGameBank('animal-detective'),current=pool.find(q=>q.id==='animal-koala');
 const old=retained.animalDetective.find(q=>q.id===current.id).answers;
 assert.equal(validWorldGameOrder(old,current,pool),false);
 assert.equal(validWorldGameOrder(old,current,pool,'habitats'),false);
 const foreignName=worldGameBank('technology')[0].answers[0];
 assert.equal(validWorldGameOrder([current.answers[0],old[1],foreignName],current,pool,'animal-detective'),false);
});
