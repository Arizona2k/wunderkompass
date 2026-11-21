import test from 'node:test';
import assert from 'node:assert/strict';
import DATA from '../app/animal-inquiries.json' with {type:'json'};
import catalog from '../app/world-catalog.json' with {type:'json'};
import {createSave,restoreSave} from '../app/progress-storage.ts';

test('every animal card has its own inquiry whose evidence and sources come from that card, with two-answer tasks and specific feedback',()=>{
 const animals=catalog.filter(t=>t.category==='animals');
 assert.equal(new Set(DATA.entries.map(e=>e.id)).size,DATA.entries.length);
 assert.deepEqual(new Set(DATA.entries.map(e=>e.id)),new Set(animals.map(t=>t.id)));
 for(const t of animals){
  const entry=DATA.entries.find(e=>e.id===t.id);
  assert.deepEqual(entry.evidence.map(e=>e.text),t.paragraphs,t.id+' evidence quotes are the card paragraphs');
  assert.deepEqual(entry.sourceUrls,t.sources.map(s=>s.url),t.id+' sources are the card sources');
  for(const task of [entry.reason,entry.transfer]){
   assert.equal(task.answers.length,2);assert.equal(new Set(task.answers).size,2);
   assert.ok(task.correct===0||task.correct===1);
   assert.equal(task.feedback.length,2);assert.ok(task.feedback.every(text=>text.length>30));
   assert.ok(task.hint.length>25);
  }
 }
 const prompts=DATA.entries.flatMap(e=>[e.reason.prompt,e.transfer.prompt]);
 assert.equal(new Set(prompts).size,prompts.length,'individual reasoning instead of one generic question');
});

test('existing schema3 backup keeps every old topic/game field together with the optional workshop state',()=>{
 const pass=createSave();pass.progress.gameSessions['world:animal-detective']={items:['animal-polar-bear','animal-lion'],index:1,roundAnswer:'alte Antwort'};pass.progress.favorites=['topic:animal-polar-bear'];
 for(const e of DATA.entries){const t=catalog.find(t=>t.id===e.id);pass.progress.gameSessions['topic:'+e.id]={items:[...t.question.answers].reverse(),topicAnswer:t.question.answers[t.question.correct],compareAnimal:true,animalInquiryLevel:2,animalInquiryEvidence:[0,1],'animalInquiryAnswer:1':e.reason.answers[e.reason.correct],'animalInquiryAnswer:2':e.transfer.answers[e.transfer.correct]};}
 const restored=restoreSave(JSON.parse(JSON.stringify(pass)),true);assert.deepEqual(restored.progress.gameSessions,pass.progress.gameSessions);assert.deepEqual(restored.progress.favorites,pass.progress.favorites);
});
