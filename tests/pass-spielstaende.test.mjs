import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSave, restoreSave, SAVE_KEY, LEGACY_KEY } from '../app/progress-storage.ts';
import { createProgressStore } from '../app/local-progress-store.ts';
import { mergeSaves, mergeDatabaseSave } from '../app/progress-sync.ts';
import catalog from '../app/world-catalog.json' with {type:'json'};
import gameIndex from '../app/game-index.json' with {type:'json'};
import journeyIndex from '../app/journey-index.json' with {type:'json'};
import { STUFE_SCHLUESSEL, leseStufe, mitStufe } from '../app/kern/stufe.ts';

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
  // Seine alte Quiz-Stufe „Knifflig“ wird zur gemeinsamen Stufe Profi (Teilschritt 3, E1).
  data.set(LEGACY_KEY,JSON.stringify({discoveries:Object.keys(sessions).filter(id=>id.startsWith('topic:')).map(id=>id.slice(6)),chapters:{},journeys:[],gameSessions:sessions,settings:{difficulty:'tricky'}}));
  const store=createProgressStore();await store.start();
  assert.deepEqual(store.getSnapshot().save.progress.gameSessions,sessions,'erster Start mit Altpass');
  assert.equal(leseStufe(store.getSnapshot().save.progress),'profi','Altpass mit Knifflig startet auf Profi');
  store.update(p=>mitStufe({...p,gameSessions:{...p.gameSessions,'topic:animal-elephant':{topicAnswer:'neu'}}},'experte',new Date('2026-11-23T10:00:00Z')));await store.flush();
  const expected={...sessions,'topic:animal-elephant':{topicAnswer:'neu'},[STUFE_SCHLUESSEL]:{stufe:'experte',seit:'2026-11-23'}};
  assert.deepEqual(JSON.parse(data.get(SAVE_KEY)).progress.gameSessions,expected,'gespeichert');
  data.delete(SAVE_KEY);
  const reloaded=createProgressStore();await reloaded.start();
  assert.deepEqual(reloaded.getSnapshot().save.progress.gameSessions,expected,'neu geladen aus IndexedDB');
  assert.equal(leseStufe(reloaded.getSnapshot().save.progress),'experte','Stufe nach dem Neuladen');
  await reloaded.flush();
  const again=createProgressStore();await again.start();
  assert.deepEqual(again.getSnapshot().save.progress.gameSessions,expected,'neu geladen aus dem Browser-Speicher');
  assert.equal(again.getSnapshot().save.progress.settings.difficulty,'tricky','die alte Quiz-Stufe bleibt im Pass');
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

// Teilschritt 3, E1: die gemeinsame Stufe im Pass (gameSessions['kern:stufe']).
const stufenPass=(stufe,patch={})=>edit(base(),{...patch,gameSessions:{...(patch.gameSessions??{}),[STUFE_SCHLUESSEL]:{stufe,seit:'2026-11-23'}}});
test('Stufe übersteht Sicherung, Einlesen und erneutes Einlesen',()=>{
 const save=stufenPass('experte',{favorites:['animal-elephant']});
 const imported=restoreSave(JSON.parse(JSON.stringify(save)),true);
 assert.equal(leseStufe(imported.progress),'experte','Einlesen');
 const exported=restoreSave(JSON.parse(JSON.stringify(imported)),true);
 assert.equal(leseStufe(exported.progress),'experte','Sicherung der eingelesenen Datei');
 assert.deepEqual(exported.progress.gameSessions[STUFE_SCHLUESSEL],{stufe:'experte',seit:'2026-11-23'});
 assert.deepEqual(exported.progress.favorites,['animal-elephant']);
});
test('Altpass und alte Sicherung ohne Stufe: Knifflig wird Profi, sonst Entdecker',()=>{
 const legacy=difficulty=>({discoveries:['animal-elephant'],chapters:{},journeys:[],settings:{difficulty}});
 assert.equal(leseStufe(restoreSave(legacy('tricky'),true).progress),'profi');
 assert.equal(leseStufe(restoreSave(legacy('easy'),true).progress),'entdecker');
 assert.equal(leseStufe(restoreSave(legacy('normal'),true).progress),'entdecker');
 const v3=edit(base(),{settings:{...base().progress.settings,difficulty:'tricky'}});
 assert.equal(leseStufe(restoreSave(JSON.parse(JSON.stringify(v3)),true).progress),'profi','Schema-3-Sicherung von vor Teilschritt 3');
});
test('zweiter Tab: Stufe und andere Änderungen gehen beim Abgleich nicht verloren',()=>{
 const b=withSessions(everySession());
 const a={...b,progress:mitStufe(b.progress,'profi',new Date('2026-11-23T10:00:00Z'))};
 const c=edit(b,{favorites:['topic:animal-elephant']});
 const merged=mergeSaves(b,a,c).progress;
 assert.equal(leseStufe(merged),'profi');
 assert.deepEqual(merged.favorites,['topic:animal-elephant']);
 assert.equal(leseStufe(mergeSaves(b,c,a).progress),'profi','auch wenn der andere Tab später speichert');
});
test('Fehlerfall: kaputter Stufen-Eintrag gilt als Entdecker, der übrige Pass bleibt',()=>{
 const sessions=everySession();
 for(const kaputt of [{stufe:'meister'},{stufe:3},{}]){
  const save=withSessions({...sessions,[STUFE_SCHLUESSEL]:kaputt});
  const loaded=restoreSave(JSON.parse(JSON.stringify(save)),true).progress;
  assert.equal(leseStufe(loaded),'entdecker',JSON.stringify(kaputt));
  for(const id of Object.keys(sessions))assert.deepEqual(loaded.gameSessions[id],sessions[id],id);
 }
 // Ein Eintrag, der gar kein Objekt ist, macht eine Datei ungültig (wie jeder kaputte Spielstand);
 // beim Laden aus dem Browser fällt nur er weg.
 const kaputt=withSessions({...sessions,[STUFE_SCHLUESSEL]:'profi'});
 assert.throws(()=>restoreSave(JSON.parse(JSON.stringify(kaputt)),true),/beschädigt oder unvollständig/);
 const loaded=restoreSave(JSON.parse(JSON.stringify(kaputt))).progress;
 assert.equal(leseStufe(loaded),'entdecker');
 assert.deepEqual(loaded.gameSessions,sessions);
});
test('Pass mit 2000 Spielständen behält die Stufe beim Laden',()=>{
 const voll=Object.fromEntries(Array.from({length:2000},(_,i)=>['topic:test-'+i,{i}]));
 const save=edit(base(),{gameSessions:voll});
 const mit={...save,progress:mitStufe(save.progress,'experte',new Date('2026-11-23T10:00:00Z'))};
 const loaded=restoreSave(JSON.parse(JSON.stringify(mit))).progress;
 assert.equal(leseStufe(loaded),'experte','Laden');
 assert.equal(Object.keys(loaded.gameSessions).length,2000,'die Grenze bleibt');
 assert.equal(leseStufe(restoreSave(JSON.parse(JSON.stringify(mit)),true).progress),'experte','Einlesen');
});
