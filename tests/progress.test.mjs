import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSave, restoreSave } from '../app/progress-storage.ts';
import { mergeSaves, mergeDatabaseSave } from '../app/progress-sync.ts';
import { compatible, restoreQuestions, sanitizeMemorySession } from '../app/game-state.ts';

const base=()=>({...createSave(),epoch:'legacy-v3',epochAt:0,revision:0});
const edit=(save,patch)=>({...save,progress:{...save.progress,...patch}});
test('independent tab favorites and completed journeys both survive',()=>{
 const b=base(); const a=edit(b,{favorites:['bear'],journeys:['water']});const c=edit(b,{favorites:['bee'],games:['memory']});
 const result=mergeSaves(b,a,c).progress;assert.deepEqual(new Set(result.favorites),new Set(['bear','bee']));assert.deepEqual(result.journeys,['water']);assert.deepEqual(result.games,['memory']);
});
test('removal survives an unrelated stale tab addition',()=>{
 const b=edit(base(),{favorites:['bear']});const a=edit(b,{favorites:[]});const c=edit(b,{favorites:['bear','bee']});assert.deepEqual(mergeSaves(b,a,c).progress.favorites,['bee']);
});
test('independent per-round fields, settings, and completed chapters merge',()=>{
 const b=base(),a=edit(b,{gameSessions:{memory:{open:[1]}},settings:{...b.progress.settings,sound:true},completedChapters:{water:[0]}}),c=edit(b,{gameSessions:{silhouettes:{index:1}},settings:{...b.progress.settings,largeText:true},completedChapters:{water:[1]}});
 const r=mergeSaves(b,a,c).progress;assert.deepEqual(r.gameSessions,{silhouettes:{index:1},memory:{open:[1]}});assert.equal(r.settings.sound,true);assert.equal(r.settings.largeText,true);assert.deepEqual(new Set(r.completedChapters.water),new Set([0,1]));
});
test('explicit clearing of round survives unrelated stale progress',()=>{
 const b=edit(base(),{gameSessions:{memory:{open:[1]}}});const a=edit(b,{gameSessions:{}}),c=edit(b,{favorites:['bee']});assert.deepEqual(mergeSaves(b,a,c).progress.gameSessions,{});
});
test('reset epoch cannot resurrect old progress',()=>{
 const b=edit(base(),{favorites:['bear']});const reset={...base(),epoch:'reset',epochAt:100};assert.deepEqual(mergeSaves(b,edit(b,{favorites:['bear','bee']}),reset).progress.favorites,[]);
});
test('journal round at equal revision survives reload and delayed database commit',()=>{
 const persisted=base();const journal=edit(persisted,{gameSessions:{silhouettes:{items:[{countryIso:'DE',choices:['Deutschland','Japan'] }],index:1}},lastActivity:{type:'game',id:'silhouettes',family:'extra'}});
 const result=mergeDatabaseSave(journal,journal,persisted);assert.deepEqual(result.progress.gameSessions,journal.progress.gameSessions);assert.deepEqual(result.progress.lastActivity,journal.progress.lastActivity);
});
test('a newer explicit database deletion is respected',()=>{
 const b=edit(base(),{gameSessions:{memory:{open:[1]}}});const local=edit(b,{favorites:['bee']});const remote={...edit(b,{gameSessions:{}}),revision:2};assert.deepEqual(mergeDatabaseSave(b,local,remote).progress.gameSessions,{});
});
test('schema 2 migration retains completed chapters and rejects newer passes',()=>{
 assert.deepEqual(restoreSave({schemaVersion:2,chapters:{water:2},favorites:['bear']}).progress.completedChapters.water,[0,1]);assert.throws(()=>restoreSave({schemaVersion:4}),/neueren Version/);
});
test('mixed detective tuple remains stable',()=>{
 assert.equal(compatible(['Die Erde dreht sich.',true,'Darum gibt es Tag und Nacht.'],['Eine andere Aussage.',false,'Erklärung']),true);
});
test('silhouette migration preserves country and choice order without GeoJSON',()=>{
 const old=[{q:'Welche Form?',choices:['Japan','Deutschland','Italien'],correct:'Deutschland',why:'Erklärung',country:{properties:{iso:'DE'},geometry:{type:'MultiPolygon'}}}];
 const fallback=[{q:'Welche Form?',choices:['China','Indien','Japan'],correct:'Japan',why:'Erklärung',countryIso:'JP'}];
 const r=restoreQuestions(old,fallback);assert.equal(r[0].countryIso,'DE');assert.deepEqual(r[0].choices,old[0].choices);assert.equal('country' in r[0],false);
});
test('invalid memory selection is removed while valid cards and pairs survive',()=>{
 const cards=Array.from({length:12},(_,id)=>({id,pair:Math.floor(id/2),label:'Karte'+id,type:id%2?'Hauptstadt':'Land'}));const raw={cards,open:[999],matched:[0],turns:2};const result=sanitizeMemorySession(raw);assert.equal(result.recovered,true);assert.deepEqual(result.snapshot.open,[]);assert.deepEqual(result.snapshot.matched,[0]);assert.deepEqual(result.snapshot.cards,cards);
});
test('invalid pair composition resets only that round',()=>{
 const cards=Array.from({length:12},(_,id)=>({id,pair:0,label:'Karte'+id}));assert.deepEqual(sanitizeMemorySession({cards,open:[0]}).snapshot,{});
});
