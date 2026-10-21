import test from'node:test';import assert from'node:assert/strict';
import catalog from'../app/world-catalog.json'with{type:'json'};
import original from'./fixtures/legacy-habitat-three-actual-questions.json'with{type:'json'};
import{worldGameBank,validWorldGameOrder,restoreWorldGameOrders}from'../app/world-game-bank.ts';
import{habitatDistractors,worldGameAnswerCorrect}from'../app/world-game-habitats.mjs';
import{createSave,restoreSave}from'../app/progress-storage.ts';
test('walrus Arctic coasts cannot offer the Arctic as an incorrect alternative',()=>{
 const pool=worldGameBank('habitats'),q=pool.find(q=>q.id==='animal-walrus');assert.equal(q.answers[q.correct],'Arktische Küsten und Meere');assert(!q.answers.includes('Arktis'));assert(!q.answers.includes('Antarktis'));assert(worldGameAnswerCorrect('habitats',q,'Arktis'));assert(!worldGameAnswerCorrect('habitats',q,'Antarktis'));
 const old=original.questions.find(q=>q.id==='animal-walrus');assert(old.answers.includes('Arktis'));assert(!validWorldGameOrder(old.answers,q,pool,'habitats'));
});
test('all48 habitat IDs and correct descriptions remain; every new comparison is explicit and distinct',()=>{
 const pool=worldGameBank('habitats'),animals=catalog.filter(t=>t.animal);assert.equal(pool.length,48);assert.deepEqual(pool.map(q=>q.id),animals.map(t=>t.id));
 for(const q of pool){assert.equal(q.answers[q.correct],animals.find(t=>t.id===q.id).animal.habitat);assert.equal(new Set(q.answers).size,3);assert(q.answers.every(a=>typeof a==='string'&&a.trim().length>0));}
 assert.throws(()=>habitatDistractors('unreviewed-new-animal'));
});
test('only documented old habitat interpretations are accepted; no broad synonym or family exception',()=>{
 const pool=worldGameBank('habitats'),orca=pool.find(q=>q.id==='animal-orca'),blue=pool.find(q=>q.id==='animal-blue-whale'),walrus=pool.find(q=>q.id==='animal-walrus');
 for(const value of['Arktis','Antarktis'])assert(worldGameAnswerCorrect('habitats',orca,value));assert(worldGameAnswerCorrect('habitats',blue,'Antarktis'));assert(!worldGameAnswerCorrect('habitats',blue,'Arktis'));
 for(const value of['arctic','Arktis ','irgendein Meer',null,{},['Arktis']])assert(!worldGameAnswerCorrect('habitats',walrus,value));assert(!worldGameAnswerCorrect('food',walrus,'Arktis'));
});
test('old selected habitat answer, five-question round and earned progress survive import/reload; only invalid choice orders are repaired',()=>{
 const pass=createSave();const old=original.questions.find(q=>q.id==='animal-walrus');pass.progress.games=['world:habitats'];pass.progress.favorites=['topic:animal-walrus'];pass.progress.notes=[{id:'synthetic-note',text:'Vorhandene Notiz.',at:'2026-10-18T00:00:00.000Z'}];pass.progress.gameSessions['world:habitats']={items:['animal-walrus','animal-orca','animal-blue-whale','animal-koala','animal-lion'],index:0,roundAnswer:'Arktis',roundDone:false,orders:{'animal-walrus':old.answers,futureField:{keep:true}},unrelated:'preserve'};
 const restored=restoreSave(JSON.parse(JSON.stringify(pass)),true),again=restoreSave(JSON.parse(JSON.stringify(restored)),true);assert.deepEqual(again.progress,restored.progress);assert.deepEqual(restored.progress.gameSessions,pass.progress.gameSessions);assert.deepEqual(restored.progress.games,pass.progress.games);assert.deepEqual(restored.progress.notes,pass.progress.notes);assert.deepEqual(restored.progress.favorites,pass.progress.favorites);
 const pool=worldGameBank('habitats'),fallback=Object.fromEntries(pool.map(q=>[q.id,q.answers])),repaired=restoreWorldGameOrders(restored.progress.gameSessions['world:habitats'].orders,fallback,pool,'habitats');assert.deepEqual(repaired.futureField,{keep:true});assert.deepEqual(repaired['animal-walrus'],fallback['animal-walrus']);assert(worldGameAnswerCorrect('habitats',pool.find(q=>q.id==='animal-walrus'),restored.progress.gameSessions['world:habitats'].roundAnswer));
});
