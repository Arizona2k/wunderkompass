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
