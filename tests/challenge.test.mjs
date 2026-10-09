import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHALLENGE_BANK,createChallenge,emptyChallenge,restoreChallenge} from '../app/knowledge-challenge.ts';
import {KNOWLEDGE_CONNECTIONS,connectionsFor} from '../app/knowledge-connections.ts';
const topics=JSON.parse(fs.readFileSync('app/world-catalog.json','utf8'));
test('challenge banks are unambiguous and sufficiently varied at every difficulty',()=>{
 assert.equal(new Set(CHALLENGE_BANK.map(q=>q.id)).size,CHALLENGE_BANK.length);
 for(const d of ['easy','medium','hard'])assert.ok(CHALLENGE_BANK.filter(q=>q.difficulty===d).length>=12);
 for(const q of CHALLENGE_BANK){assert.equal(new Set(q.answers).size,q.answers.length);assert.ok(q.answers[q.correct]);assert.ok(q.why.length>30);assert.ok(topics.some(t=>t.id===q.topic));}
});
test('new rounds avoid the immediately previous six questions and survive serialization',()=>{
 for(const d of ['easy','medium','hard']){
  const first=createChallenge(d,[],()=>.37),next=createChallenge(d,first.ids,()=>.72);
  assert.equal(next.ids.some(id=>first.ids.includes(id)),false);
  assert.deepEqual(restoreChallenge(JSON.parse(JSON.stringify(first)),emptyChallenge()),first);
 }
});
test('corrupt or outdated sessions cannot show invalid choices or a fabricated finish',()=>{
 const s=createChallenge('hard',[],()=>.5),fallback=emptyChallenge();
 for(const broken of [{...s,ids:[s.ids[0],...s.ids.slice(0,5)]},{...s,index:99},{...s,answer:'invalid'},{...s,done:true},{...s,orders:{}},{...s,difficulty:'unknown'},null])assert.deepEqual(restoreChallenge(broken,fallback),fallback);
 const q=CHALLENGE_BANK.find(q=>q.id===s.ids[5]);
 const completed={...s,index:5,answer:q.answers[q.correct],done:true};
 assert.deepEqual(restoreChallenge(completed,fallback),completed);
});
test('explained relationships are unique, reciprocal and point to retained topic IDs',()=>{
 assert.equal(new Set(KNOWLEDGE_CONNECTIONS.map(c=>c.id)).size,KNOWLEDGE_CONNECTIONS.length);
 for(const c of KNOWLEDGE_CONNECTIONS){
  const from=topics.find(t=>t.id===c.fromId),to=topics.find(t=>t.id===c.toId);
  assert.ok(from&&to);assert.ok(from.related.includes(to.id));assert.ok(to.related.includes(from.id));
  assert.ok(c.why.length>50);assert.ok(connectionsFor(to.id).some(r=>r.topic===from.id));
 }
});
import {createSave,restoreSave,emptyProgress} from '../app/progress-storage.ts';
test('schema-3 export/import keeps the new round alongside existing progress',()=>{
 const progress=emptyProgress(),session=createChallenge('medium',[],()=>.44);
 progress.favorites=['topic:animal-polar-bear'];progress.journeys=['ocean'];
 progress.gameSessions={'world:knowledge-challenge':{challenge:session},memory:{open:[0],matched:[]}};
 progress.lastActivity={type:'game',id:'world:knowledge-challenge',family:'world'};
 const imported=restoreSave(JSON.parse(JSON.stringify(createSave(progress))),true).progress;
 assert.deepEqual(imported.favorites,progress.favorites);assert.deepEqual(imported.journeys,progress.journeys);
 assert.deepEqual(imported.gameSessions,progress.gameSessions);assert.deepEqual(imported.lastActivity,progress.lastActivity);
 assert.deepEqual(restoreChallenge(imported.gameSessions['world:knowledge-challenge'].challenge,emptyChallenge()),session);
});
