import test from 'node:test';import assert from 'node:assert/strict';
import legacy from '../app/research-task-compatibility.json' with {type:'json'};
import {RESEARCH_QUESTIONS} from '../app/research-catalog.ts';
import {researchAnswerOrder,priorResearchSelection} from '../app/research-task-answers.mjs';
import {createSave,restoreSave} from '../app/progress-storage.ts';

test('all eleven previous correct lab answers keep their canonical index and exact text',()=>{
 assert.equal(Object.keys(legacy.entries).length,11);
 for(const[id,old]of Object.entries(legacy.entries)){
  const q=RESEARCH_QUESTIONS[id].hard;assert.equal(q.correct,old.correct);assert.equal(q.answers[q.correct],old.answers[old.correct]);
  for(let choice=0;choice<3;choice++)assert.deepEqual(priorResearchSelection(id,'hard',choice,0),{answer:old.answers[choice],right:choice===old.correct,feedback:choice===old.correct?old.why:old.feedback[choice]});
 }
});
test('display order varies hard answer positions while canonical selected identities and other levels stay stable',()=>{
 const positions=[];
 for(const[id,row]of Object.entries(RESEARCH_QUESTIONS)){
  const order=researchAnswerOrder(id,'hard',3);assert.deepEqual([...order].sort(),[0,1,2]);assert.deepEqual(researchAnswerOrder(id,'hard',3),order);positions.push(order.indexOf(row.hard.correct));
  for(const level of['easy','medium'])assert.deepEqual(researchAnswerOrder(id,level,3),[0,1,2]);
 }
 assert.equal(new Set(positions).size,3);assert(positions.filter(i=>i===1).length<8,'the observed eight-of-eleven second-answer shortcut must not return');
});
test('bounded old-answer explanation never interprets current, future, malformed or unrelated saved answers',()=>{
 for(const revision of[1,2,-1,NaN,'0',null,undefined])assert.equal(priorResearchSelection('moon','hard',1,revision),null);
 for(const answer of[-1,3,.5,NaN,'1',null,{},[1]])assert.equal(priorResearchSelection('moon','hard',answer,0),null);
 assert.equal(priorResearchSelection('unknown','hard',1,0),null);assert.equal(priorResearchSelection('moon','medium',1,0),null);
});
test('old wrong and correct lab selections, stamps, journals and future fields survive schema3 backup unchanged',()=>{
 const pass=createSave();pass.progress.settings.readVoice='';pass.progress.labs=['moon'];pass.progress.favorites=['topic:science-tides'];pass.progress.notes=[{id:'synthetic-transfer-note',text:'Erhaltene synthetische Notiz.',at:'2026-10-18T00:00:00.000Z'}];
 for(const[id,old]of Object.entries(legacy.entries))pass.progress.gameSessions['lab:'+id]={researchLevel:'hard','researchAnswer-hard':id==='moon'?old.correct:(old.correct+1)%3,researchJournal:'Vorhandene Erklärung.',researchCompareA:'A',researchCompareB:'B',researchMission:7,future:{keep:true}};
 const restored=restoreSave(JSON.parse(JSON.stringify(pass)),true);assert.deepEqual(restored.progress,pass.progress);assert.deepEqual(restoreSave(JSON.parse(JSON.stringify(restored)),true).progress,pass.progress);
});
