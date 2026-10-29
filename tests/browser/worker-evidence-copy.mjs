import fs from 'node:fs/promises';

// Called only after the producing worker has exited. Its PNG is the original;
// the new root path is a derived collection alias, not another capture.
// Existing originals are never replaced and keep their modification times.
export async function copyWorkerEvidence(source,target){
 if(!source.endsWith('.png'))return fs.copyFile(source,target);
 try{await fs.link(source,target);}
 catch(error){
  if(error.code!=='EEXIST')throw error;
  const [original,existing]=await Promise.all([fs.readFile(source),fs.readFile(target)]);
  if(!original.equals(existing)){
   const conflict=new Error('Collected worker image already contains different bytes: '+target,{cause:error});
   conflict.code='ERR_WORKER_EVIDENCE_CONFLICT';throw conflict;
  }
 }
}
