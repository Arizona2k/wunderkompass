import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSave, restoreSave, SAVE_KEY } from '../app/progress-storage.ts';
import { createProgressStore } from '../app/local-progress-store.ts';
import { mergeSaves, mergeDatabaseSave } from '../app/progress-sync.ts';
import { compatible, restoreQuestions, sanitizeMemorySession } from '../app/game-state.ts';

const base=()=>({...createSave(),epoch:'legacy-v3',epochAt:0,revision:0});
const edit=(save,patch)=>({...save,progress:{...save.progress,...patch}});
test('edited notes preserve identity across independent two-tab edits, additions, deletion and import',()=>{
 const first={id:'note-one',text:'Ursprüngliche Frage',at:'2026-10-17T08:00:00.000Z'},second={id:'note-two',text:'Zweite Frage',at:first.at};
 const b=edit(base(),{notes:[first,second]}),a=edit(b,{notes:[{...first,text:'Genauere Frage'},second]});
 const c=edit(b,{notes:[first,{...second,text:'Andere genauere Frage'},{id:'note-new',text:'Neue Beobachtung',at:first.at}]});
 for(const result of [mergeSaves(b,a,c),mergeSaves(b,c,a),mergeDatabaseSave(b,a,{...c,revision:1})]){
  assert.deepEqual(result.progress.notes.find(n=>n.id===first.id),{...first,text:'Genauere Frage'});
  assert.deepEqual(result.progress.notes.find(n=>n.id===second.id),{...second,text:'Andere genauere Frage'});
  assert.equal(result.progress.notes.length,3);
  assert.deepEqual(restoreSave(JSON.parse(JSON.stringify(result)),true).progress.notes,result.progress.notes);
 }
 const removed=edit(b,{notes:[second]});assert.equal(mergeSaves(b,a,removed).progress.notes.some(n=>n.id===first.id),false,'a deliberately removed note is not resurrected');
});
test('rapid local settings undo and favorite removal survive their own synchronous journal before database flush',async()=>{
 const keys=['localStorage','window','document','BroadcastChannel','indexedDB'],original=new Map(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)])),data=new Map();let persisted;
 const db={objectStoreNames:{contains:()=>true},transaction:()=>{const tx={objectStore:()=>({get:()=>{const r={};queueMicrotask(()=>{r.result=persisted;r.onsuccess?.();queueMicrotask(()=>tx.oncomplete?.());});return r;},put:value=>{persisted=structuredClone(value);}})};return tx;},close(){}};
 const fake={localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},window:{addEventListener(){}},document:{addEventListener(){}},BroadcastChannel:undefined,indexedDB:{open:()=>{const r={result:db};queueMicrotask(()=>r.onsuccess?.());return r;}}};
 try{
  for(const [key,value] of Object.entries(fake))Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
  const store=createProgressStore();await store.start();
  for(const reducedMotion of [true,false,true,false]){
   store.update(p=>({...p,settings:{...p.settings,reducedMotion}}));
   assert.equal(store.getSnapshot().save.progress.settings.reducedMotion,reducedMotion);
   assert.equal(JSON.parse(data.get(SAVE_KEY)).progress.settings.reducedMotion,reducedMotion);
  }
  store.update(p=>({...p,favorites:['topic:science-energy']}));store.update(p=>({...p,favorites:[]}));
  assert.deepEqual(store.getSnapshot().save.progress.favorites,[]);assert.deepEqual(JSON.parse(data.get(SAVE_KEY)).progress.favorites,[]);
  await store.flush();const reloaded=createProgressStore();await reloaded.start();
  assert.equal(reloaded.getSnapshot().save.progress.settings.reducedMotion,false);assert.deepEqual(reloaded.getSnapshot().save.progress.favorites,[]);await reloaded.flush();
 }finally{for(const [key,descriptor] of original)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
});
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
