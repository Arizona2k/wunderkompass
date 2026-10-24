import test from 'node:test';import assert from 'node:assert/strict';
import {createSave,emptyProgress,restoreSave} from '../app/progress-storage.ts';
const broken=/beschädigt|unvollständig/;
test('matching app marker cannot turn absent, wrong-kind or truncated current progress into an empty imported pass',()=>{
 for(const value of [{app:'earth-explorer',schemaVersion:3},{app:'earth-explorer',schemaVersion:3,progress:[]},{...createSave(),progress:{}},{...createSave(),progress:{notes:[]}}])assert.throws(()=>restoreSave(value,true),broken);
 const truncated=createSave();delete truncated.progress.gameSessions;assert.throws(()=>restoreSave(truncated,true),broken);
});
test('malformed current containers and entries are rejected before normalization can silently discard notes or sessions',()=>{
 for(const [field,value]of [['notes','beschädigt'],['notes',[{id:'note',text:123,at:'2026-10-24'}]],['favorites',{}],['favorites',[{}]],['settings',[]],['gameSessions',{'lab:seasons':[]}],['quizSession',[]],['chapters',{water:'2'}],['lastActivity',{type:'lab',id:7}],['review',{probe:{correct:true,seen:1,due:'2026-10-24T00:00:00Z'}}],['review',{probe:{correct:true,seen:1,due:'2026-02-30'}}],['quizResults',[{id:'probe',at:'2026-10-24',category:'all',score:0,total:0}]]]){
  const pass=createSave();pass.progress[field]=value;assert.throws(()=>restoreSave(pass,true),broken,field);
 }
 const invalidDate=createSave();invalidDate.updatedAt='not a timestamp';assert.throws(()=>restoreSave(invalidDate,true),broken);
});
test('intentionally empty current passes and complete historical schema-3 envelopes remain valid',()=>{
 const empty=createSave();assert.deepEqual(restoreSave(JSON.parse(JSON.stringify(empty)),true).progress,{...emptyProgress(),settings:{...emptyProgress().settings,readVoice:''}});
 const historical=createSave();historical.createdAt='2026-10-09T12:00:00Z';historical.updatedAt='2026-10-09T12:00:00Z';historical.progress.settings.readVoice='';historical.progress.gameSessions['lab:seasons']={latitude:-34};historical.progress.notes=[{id:'old-note',text:'Synthetische erhaltene Notiz',at:'2026-10-09T12:00:00.000Z'}];assert.deepEqual(restoreSave(historical,true).progress,historical.progress);
});
test('supported flat and wrapped legacy passes migrate without mistaking wrong containers for valid empty legacy data',()=>{
 for(const value of [{schemaVersion:2,chapters:{water:2},favorites:['bear']},{discoveries:[],journeys:[],chapters:{}},{app:'earth-explorer',schemaVersion:1,progress:{discoveries:['topic:science-sound'],notes:[{id:'note',text:'Synthetische alte Notiz'}]}}])assert.equal(restoreSave(value,true).schemaVersion,3);
 assert.deepEqual(restoreSave({schemaVersion:2,chapters:{water:2},favorites:['bear']},true).progress.completedChapters.water,[0,1]);
 for(const value of [{app:'earth-explorer'},{app:'earth-explorer',progress:[]},{schemaVersion:2,discoveries:{}},{app:'earth-explorer',progress:{notes:'beschädigt'}}])assert.throws(()=>restoreSave(value,true),broken);
 assert.throws(()=>restoreSave({app:'different-app',discoveries:[]},true),/gehört nicht/);
 assert.throws(()=>restoreSave({app:'earth-explorer',schemaVersion:4},true),/neueren Version/);
});
