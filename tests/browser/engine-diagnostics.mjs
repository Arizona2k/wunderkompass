import fs from 'node:fs/promises';
import path from 'node:path';

// Keep failed-search evidence in the existing engine namespace the curator reads.
// Move original bytes; never edit images, hide failures or rebind another snapshot.
// Early and full checks keep separate originals in the same existing namespace.
export async function preserveEngineDiagnostics(directory,engine,{phase='full'}={}){
 if(!['chromium','firefox','webkit'].includes(engine))throw Error('Unknown actual browser engine');
 if(!['early-search','full'].includes(phase))throw Error('Unknown evidence phase');
 const moved=[],prefix='journey-engine-'+engine+'-';
 for(const name of (await fs.readdir(directory)).sort()){
  const animal=/^animal-.*\.(png|json)$/.test(name),prefixed=name.startsWith(prefix)&&!name.startsWith(prefix+'early-')&&/\.(png|json)$/.test(name);
  if(!animal&&!(phase==='early-search'&&prefixed))continue;
  const suffix=animal?name:name.slice(prefix.length),target=prefix+(phase==='early-search'?'early-':'')+suffix;
  try{await fs.lstat(path.join(directory,target));throw Error('Existing engine evidence cannot be overwritten: '+name+' -> '+target);}catch(error){if(error.code!=='ENOENT')throw error;}
  await fs.rename(path.join(directory,name),path.join(directory,target));moved.push(target);
 }
 return moved;
}
