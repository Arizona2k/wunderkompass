import test from'node:test';import assert from'node:assert/strict';
import data from'../app/journey-inquiries.json'with{type:'json'};
import legacy from'../app/journey-task-compatibility.json'with{type:'json'};
import{revisedJourneyTask,priorJourneySelection}from'../app/journey-task-answers.mjs';
import{createSave,restoreSave}from'../app/progress-storage.ts';
test('only fourteen named existing hard tasks have a compatibility interpretation, all original correct identities remain',()=>{
 assert.deepEqual(Object.keys(legacy.entries).sort(),['climate:0:2','climate:1:2','climate:2:2','climate:3:2','climate:4:2','continents:0:2','countries:4:2','landscapes:0:2','landscapes:1:2','landscapes:2:2','landscapes:3:2','landscapes:4:2','nature:0:2','seasons:2:2']);
 for(const[key,old]of Object.entries(legacy.entries)){
  const i=key.lastIndexOf(':'),id=key.slice(0,i),level=Number(key.slice(i+1)),q=data.chapters.find(c=>c.id===id).tasks[level];
  assert(revisedJourneyTask(id,level));assert.equal(q.correct,old.correct);assert.equal(q.answers[q.correct],old.answers[old.correct]);
  for(let choice=0;choice<3;choice++)assert.deepEqual(priorJourneySelection(id,level,choice,undefined),{answer:old.answers[choice],feedback:choice===old.correct?old.why:old.wrong[choice]});
 }
 assert(!revisedJourneyTask('seasons:2',1));assert(!revisedJourneyTask('unknown',2));
});
test('current or unknown future task revisions and malformed choices are never translated as old answers',()=>{
 for(const revision of[1,2,-1,null,'0',NaN])assert.equal(priorJourneySelection('seasons:2',2,0,revision),null);
 for(const choice of[-1,3,.5,'0',NaN,null,{},[0]])assert.equal(priorJourneySelection('seasons:2',2,choice,undefined),null);
 assert.equal(priorJourneySelection('seasons:2',0,0,undefined),null);
});
test('fourteen old selected indices, private notes and already earned journeys roundtrip without a new migration',()=>{
 const save=createSave();save.progress.settings.readVoice='';save.progress.journeys=['ocean'];save.progress.games=['memory'];save.progress.gameSessions.memory={matched:[0]};
 for(const[key,q]of Object.entries(legacy.entries)){
  const[chapter,index,level]=key.split(':');save.progress.gameSessions['journey:'+chapter]??={};Object.assign(save.progress.gameSessions['journey:'+chapter],{['chapter:'+index+':level']:Number(level),['chapter:'+index+':answer:'+level]:(q.correct+1)%3,['chapter:'+index+':note']:'Private synthetische Notiz.',future:{keep:true}});
 }
 assert.deepEqual(restoreSave(JSON.parse(JSON.stringify(save)),true).progress,save.progress);
});
