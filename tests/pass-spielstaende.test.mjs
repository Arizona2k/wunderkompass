import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSave, restoreSave, SAVE_KEY, LEGACY_KEY } from '../app/progress-storage.ts';
import { createProgressStore } from '../app/local-progress-store.ts';
import { mergeSaves, mergeDatabaseSave } from '../app/progress-sync.ts';
import catalog from '../app/world-catalog.json' with {type:'json'};
import gameIndex from '../app/game-index.json' with {type:'json'};
import journeyIndex from '../app/journey-index.json' with {type:'json'};

// Eigene Datei: Der Neulade-Test braucht eine frische Datenbank-Verbindung (progress-storage merkt sich die erste).
const base=()=>({...createSave(),epoch:'legacy-v3',epochAt:0,revision:0});
const edit=(save,patch)=>({...save,progress:{...save.progress,...patch}});
// BACKLOG 18: Wer jede Karte, jedes Spiel, jede Reise und jedes Labor öffnet, hat mehr als 256 Spielstände.
// Keiner davon darf beim Laden, Importieren, Exportieren, Neuladen oder Abgleich mit einem zweiten Tab verloren gehen.
const LABS=['depth','volcano','quake','weather','water','seasons','plates','moon','clocks','tides','solar'];
const everySession=()=>Object.fromEntries([
 ...catalog.map(t=>'topic:'+t.id),
 ...gameIndex.map(g=>g.family==='world'?'world:'+g.id:g.id),
 ...journeyIndex.map(j=>'journey:'+j.id),
 ...LABS.map(id=>'lab:'+id),
].map((id,i)=>[id,{topicAnswer:'Antwort '+i,model:{step:i%5},consent:i%2===0}]));
const withSessions=sessions=>{const save=edit(base(),{gameSessions:sessions,discoveries:Object.keys(sessions).filter(id=>id.startsWith('topic:')).map(id=>id.slice(6))});return save;};
test('alle Spielstände eines vollen Passes bleiben beim Laden, Import, Export und Altpass (mehr als 256)',()=>{
 const sessions=everySession(),save=withSessions(sessions);
 assert.ok(Object.keys(sessions).length>256,'der ausgedachte Pass hat mehr als 256 Spielstände: '+Object.keys(sessions).length);
 const loaded=restoreSave(structuredClone(save));
 assert.deepEqual(loaded.progress.gameSessions,sessions,'Laden');
 const imported=restoreSave(JSON.parse(JSON.stringify(save)),true);
 assert.deepEqual(imported.progress.gameSessions,sessions,'Import');
 const exported=restoreSave(JSON.parse(JSON.stringify(imported)),true);
 assert.deepEqual(exported.progress.gameSessions,sessions,'Export und erneuter Import');
 // Altpass ohne Schema-Angabe (Stand vor Schema 3): gleiche Spielstände.
 const legacy={discoveries:save.progress.discoveries,chapters:{},journeys:[],gameSessions:structuredClone(sessions)};
 assert.deepEqual(restoreSave(legacy,true).progress.gameSessions,sessions,'Altpass');
});
test('Abgleich mit einem zweiten Tab behält alle Spielstände über 256',()=>{
 const sessions=everySession(),b=withSessions(sessions);
 const a=edit(b,{gameSessions:{...sessions,memory:{open:[1]}}}),c=edit(b,{favorites:['topic:animal-elephant']});
 const merged=mergeSaves(b,a,c).progress;
 assert.deepEqual(merged.gameSessions,{...sessions,memory:{open:[1]}});
 assert.deepEqual(merged.favorites,['topic:animal-elephant']);
 assert.deepEqual(mergeDatabaseSave(a,a,b).progress.gameSessions,a.progress.gameSessions);
});
test('nach dem Neuladen sind alle Spielstände über 256 noch da',async()=>{
 const keys=['localStorage','window','document','BroadcastChannel','indexedDB'],original=new Map(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)])),data=new Map();let persisted;
 const db={objectStoreNames:{contains:()=>true},transaction:()=>{const tx={objectStore:()=>({get:()=>{const r={};queueMicrotask(()=>{r.result=persisted;r.onsuccess?.();queueMicrotask(()=>tx.oncomplete?.());});return r;},put:value=>{persisted=structuredClone(value);}})};return tx;},close(){}};
 const fake={localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},window:{addEventListener(){}},document:{addEventListener(){}},BroadcastChannel:undefined,indexedDB:{open:()=>{const r={result:db};queueMicrotask(()=>r.onsuccess?.());return r;}}};
 const sessions=everySession();
 try{
  for(const [key,value] of Object.entries(fake))Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
  // Erster Start mit einem Altpass (Schlüssel v2, ohne Schema-Angabe), wie ihn ein Kind vor Schema 3 hatte.
  data.set(LEGACY_KEY,JSON.stringify({discoveries:Object.keys(sessions).filter(id=>id.startsWith('topic:')).map(id=>id.slice(6)),chapters:{},journeys:[],gameSessions:sessions}));
  const store=createProgressStore();await store.start();
  assert.deepEqual(store.getSnapshot().save.progress.gameSessions,sessions,'erster Start mit Altpass');
  store.update(p=>({...p,gameSessions:{...p.gameSessions,'topic:animal-elephant':{topicAnswer:'neu'}}}));await store.flush();
  const expected={...sessions,'topic:animal-elephant':{topicAnswer:'neu'}};
  assert.deepEqual(JSON.parse(data.get(SAVE_KEY)).progress.gameSessions,expected,'gespeichert');
  data.delete(SAVE_KEY);
  const reloaded=createProgressStore();await reloaded.start();
  assert.deepEqual(reloaded.getSnapshot().save.progress.gameSessions,expected,'neu geladen aus IndexedDB');
  await reloaded.flush();
  const again=createProgressStore();await again.start();
  assert.deepEqual(again.getSnapshot().save.progress.gameSessions,expected,'neu geladen aus dem Browser-Speicher');
  await again.flush();
 }finally{for(const [key,descriptor] of original)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
});
test('Fehlerfall: Import mit kaputtem Spielstand wird abgelehnt, beim Laden fallen nur kaputte Spielstände weg',()=>{
 const sessions=everySession(),save=withSessions({...sessions,'kaputt-text':'kein Objekt','kaputt-liste':[1,2],'':{a:1}});
 assert.throws(()=>restoreSave(JSON.parse(JSON.stringify(save)),true),/beschädigt oder unvollständig/);
 assert.deepEqual(restoreSave(JSON.parse(JSON.stringify(save))).progress.gameSessions,sessions);
 const flood=Object.fromEntries(Array.from({length:5000},(_,i)=>['flut-'+i,{i}]));
 assert.equal(Object.keys(restoreSave(edit(base(),{gameSessions:flood})).progress.gameSessions).length,2000);
});
