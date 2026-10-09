import { localId } from './local-id';
import { SAVE_KEY, LEGACY_KEY, createSave, restoreSave, readDatabase, database, type Save, type LocalProgress } from './progress-storage';
import { mergeSaves, mergeDatabaseSave } from './progress-sync';

type Snapshot = { save: Save; ready: boolean; available: boolean; storage: 'database'|'browser'|'session'; notice: string; restoreRevision: number };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const future = (v: unknown): boolean => !!v && typeof v === 'object' && 'schemaVersion' in v && typeof v.schemaVersion === 'number' && v.schemaVersion > 3;
const newerNotice = 'Ein neuerer Pass ist gespeichert. Er bleibt unverändert erhalten; diese Version speichert nur für die aktuelle Sitzung.';
const serverSave: Save = { app:'earth-explorer', schemaVersion:3, createdAt:'2000-01-01T00:00:00.000Z', updatedAt:'2000-01-01T00:00:00.000Z', progress:createSave().progress };
export const serverSnapshot: Snapshot = { save:serverSave, ready:false, available:true, storage:'session', notice:'', restoreRevision:0 };

export function createProgressStore() {
  let state: Snapshot = serverSnapshot;
  let base = serverSave, dirty = false, readOnly = false, generation = 0;
  let timer: ReturnType<typeof setTimeout>|undefined, channel: BroadcastChannel|undefined;
  let flushing: Promise<void>|undefined, started = false;
  const listeners = new Set<() => void>();
  const emit = (patch: Partial<Snapshot>) => { state={...state,...patch}; listeners.forEach(fn=>fn()); };
  const protect = () => { if(!readOnly) generation++; readOnly=true; dirty=false; clearTimeout(timer); emit({available:false,notice:newerNotice,storage:'session'}); };
  const journal = (): Save|null => {
    try { const raw=localStorage.getItem(SAVE_KEY); if(!raw)return null; const value:unknown=JSON.parse(raw); if(future(value)){protect();return null;} return restoreSave(value); }
    catch { return null; }
  };
  const receive = (remote: Save) => {
    if(same(state.save,remote))return;
    if((remote.epochAt??0)<(state.save.epochAt??0))return;
    if((remote.epoch??'legacy-v3')===(base.epoch??'legacy-v3')&&(remote.revision??0)<(base.revision??0))return;
    const replaced=(remote.epoch??'legacy-v3')!==(state.save.epoch??'legacy-v3') && (remote.epochAt??0)>=(state.save.epochAt??0);
    const merged=dirty?mergeSaves(base,state.save,remote):mergeSaves(base,base,remote);
    if((merged.epochAt??0)<(state.save.epochAt??0))return;
    base=remote;
    if(replaced){generation++;dirty=false;}
    emit({save:merged,...(replaced?{restoreRevision:state.restoreRevision+1}: {})});
  };
  const writeJournal = () => {
    if(readOnly)return false;
    const incoming=journal(); if(readOnly)return false; if(incoming)receive(incoming);
    try { localStorage.setItem(SAVE_KEY,JSON.stringify(state.save)); channel?.postMessage(state.save); return true; } catch { return false; }
  };
  const schedule = () => { clearTimeout(timer); timer=setTimeout(()=>void flush(),200); };
  const flush = async (): Promise<void> => {
    if(flushing)return flushing;
    if(!dirty||readOnly||!state.ready)return;
    flushing=(async()=>{
      const localOK=writeJournal(); if(readOnly)return;
      const sent=state.save, baseline=base, tick=generation;
      try {
        const db=await database(); if(tick!==generation||readOnly)return;
        const persisted=await new Promise<Save>((resolve,reject)=>{
          const tx=db.transaction('saves','readwrite'); const store=tx.objectStore('saves'); const request=store.get('main'); let result:Save;
          request.onsuccess=()=>{
            if(future(request.result)){protect();tx.abort();return;}
            let previous=baseline; try { if(request.result)previous=restoreSave(request.result); } catch { /* repair only unreadable snapshot */ }
            if(tick!==generation||readOnly){tx.abort();return;}
            result=mergeDatabaseSave(baseline,sent,previous);store.put(result,'main');
          };
          tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error??new Error('Saving interrupted'));
        });
        if(tick!==generation||readOnly)return;
        const next=mergeSaves(sent,state.save,persisted);base=persisted;dirty=!same(next.progress,persisted.progress);
        emit({save:next,storage:'database',available:true});writeJournal();
      } catch {
        if(tick===generation&&!readOnly)emit({storage:localOK?'browser':'session',available:localOK});
      }
    })().finally(()=>{flushing=undefined;if(dirty&&!readOnly)schedule();});
    return flushing;
  };
  const update = (fn:(progress:LocalProgress)=>LocalProgress) => {
    const incoming=journal(); if(incoming&&!readOnly)receive(incoming);
    const progress=fn(state.save.progress); if(progress===state.save.progress||same(progress,state.save.progress))return;
    emit({save:{...state.save,progress,updatedAt:new Date().toISOString(),revision:(state.save.revision??0)+1}});
    if(readOnly)return;dirty=true;
    const ok=writeJournal(); if(!ok)emit({available:state.storage==='database'});schedule();
  };
  const replace = async (save:Save,notice:string,requireDurable:boolean) => {
    journal(); if(readOnly)throw new Error('Ein neuerer Pass ist geschützt. Öffne zuerst die neuere Version.');
    const next={...save,epoch:localId(),epochAt:Math.max(Date.now(),(state.save.epochAt??0)+1),revision:0,updatedAt:new Date().toISOString()};
    generation++;clearTimeout(timer);dirty=false;let stored=false;
    // Replacement is explicit, so publish its epoch before any delayed old write.
    try { localStorage.setItem(SAVE_KEY,JSON.stringify(next));stored=true; } catch { /* database fallback */ }
    try {
      const db=await database(); await new Promise<void>((resolve,reject)=>{const tx=db.transaction('saves','readwrite');const os=tx.objectStore('saves');const r=os.get('main');r.onsuccess=()=>{if(future(r.result)){protect();tx.abort();return;}os.put(next,'main');};tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(tx.error);}); stored=true;
    } catch { /* journal remains valid */ }
    if(readOnly)return;
    if(requireDurable&&!stored)throw new Error('Der Browser kann den Pass gerade nicht dauerhaft speichern. Bitte bewahre deine Sicherung auf.');
    base=next;emit({save:next,restoreRevision:state.restoreRevision+1,notice,available:stored});channel?.postMessage(next);
  };
  const start = async () => {
    if(started)return;started=true;
    const primary=journal();let legacy:Save|null=null;
    try { const raw=localStorage.getItem(LEGACY_KEY); if(raw)legacy=restoreSave(JSON.parse(raw)); } catch { emit({notice:'Ein Teil des alten Passes war nicht lesbar. Gültige Einträge bleiben erhalten.'}); }
    let initial=primary??legacy??{...createSave(),epoch:'legacy-v3',epochAt:0,revision:0};
    try { const raw=await readDatabase(); if(future(raw))protect();else if(raw){const persisted=restoreSave(raw);if(!primary||persisted.updatedAt>primary.updatedAt)initial=persisted;} if(!readOnly)emit({storage:'database'}); } catch { /* local journal */ }
    base=initial;emit({save:initial,ready:true});
    if(!readOnly){dirty=true;writeJournal();schedule();}
    if(typeof BroadcastChannel!=='undefined'){channel=new BroadcastChannel('earth-progress-v3');channel.onmessage=e=>{if(future(e.data)){protect();return;}try { const remote=restoreSave(e.data);if(!readOnly){receive(remote);if(dirty)schedule();}}catch{}};}
    const storage=(e:StorageEvent)=>{if(e.key!==SAVE_KEY||!e.newValue)return;try {const raw=JSON.parse(e.newValue);if(future(raw)){protect();return;}if(!readOnly){receive(restoreSave(raw));if(dirty)schedule();}}catch{}};
    window.addEventListener('storage',storage);
    window.addEventListener('pagehide',()=>void flush());
    document.addEventListener('visibilitychange',()=>{if(document.hidden)void flush();});
  };
  return { getSnapshot:()=>state, subscribe:(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};}, start, update, flush,
    reset:()=>replace(createSave(),'Dein Entdeckerpass beginnt neu.',false).then(()=>{try{localStorage.removeItem(LEGACY_KEY);}catch{}}),
    importSave:async(raw:string)=>{if(raw.length>2_000_000)throw new Error('Die Datei ist zu groß.');return replace(restoreSave(JSON.parse(raw),true),'Dein Entdeckerpass wurde wiederhergestellt.',true);},
    backup:()=>JSON.stringify(state.save,null,2) };
}
