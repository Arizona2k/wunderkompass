import fs from 'node:fs/promises';
import path from 'node:path';

// Keep failed-search evidence in the existing engine namespace the curator reads.
// Move original bytes; never edit images, hide failures or rebind another snapshot.
export async function preserveEngineDiagnostics(directory,engine){
 if(!['chromium','firefox','webkit'].includes(engine))throw Error('Unknown actual browser engine');
 const moved=[];
 for(const name of (await fs.readdir(directory)).sort()){
  if(!/^animal-.*\.(png|json)$/.test(name))continue;
  const target='journey-engine-'+engine+'-'+name;
  try{await fs.lstat(path.join(directory,target));throw Error('Existing engine evidence cannot be overwritten');}catch(error){if(error.code!=='ENOENT')throw error;}
  await fs.rename(path.join(directory,name),path.join(directory,target));moved.push(target);
 }
 return moved;
}

// Read-only failure context. Missing host/cgroup information never replaces the
// original browser failure, and these counters do not identify its cause alone.
export async function readEngineResources(){
 const os=await import('node:os');const memory={};
 for(const name of ['memory.current','memory.max','memory.peak','memory.events']){
  try{memory[name]=(await fs.readFile('/sys/fs/cgroup/'+name,'utf8')).trim();}catch(error){memory[name]={unavailable:error.code??'read-failed'};}
 }
 return{hostFreeBytes:os.freemem(),hostTotalBytes:os.totalmem(),nodeMemory:process.memoryUsage(),cgroup:memory};
}
export async function observeEngineLifecycle(browser,context,page,position,{readResources=readEngineResources}={}){
 const events=[],initialResources=await readResources().catch(error=>({unavailable:error.code??'read-failed'}));let stopped=false;
 const registrations=[[page,'crash','page-crash'],[page,'close','page-close'],[context,'close','context-close'],[browser,'disconnected','browser-disconnected']];
 const listeners=registrations.map(([emitter,event,kind])=>{const listener=()=>{if(!stopped){events.push({kind,at:new Date().toISOString(),...position()});if(events.length>24)events.shift();}};emitter.on(event,listener);return[emitter,event,listener];});
 return{
  async snapshot(){return{events:[...events],lastKnownUrl:page.url(),pageClosed:page.isClosed(),browserConnected:browser.isConnected(),initialResources,resourcesAtFailure:await readResources().catch(error=>({unavailable:error.code??'read-failed'})),meaning:'Observed lifecycle and resource counters only; no automatic product/infrastructure/root-cause classification.'};},
  stop(){stopped=true;for(const [emitter,event,listener]of listeners)emitter.off(event,listener);}
 };
}
