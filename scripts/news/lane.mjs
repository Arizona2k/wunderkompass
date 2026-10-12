import {mkdir,readFile,writeFile,rename,open,unlink,readdir} from 'node:fs/promises';
import path from 'node:path';
import {hostname} from 'node:os';import {randomUUID} from 'node:crypto';
import {recoverNewsLock} from './schedule.mjs';
import {signEnvelope,verifyEnvelope,fingerprint,validatePayload} from '../../app/news-wire.mjs';

const options=({keys,policy,topicIds,now})=>({keys,policy,topicIds,now});
export async function readEdition(directory,validation){
 try{return await verifyEnvelope(JSON.parse(await readFile(path.join(directory,'latest.json'),'utf8')),validation);}catch(error){if(error.code==='ENOENT')return null;throw error;}
}
export async function restoreHistory(directory,history,validation){
 if(!Array.isArray(history)||history.length>7)throw Error('Ungültiger Rückfallverlauf');
 await mkdir(path.join(directory,'versions'),{recursive:true});
 for(const envelope of history){await verifyEnvelope(envelope,validation);await writeFile(path.join(directory,'versions',`${envelope.sequence}-${envelope.fingerprint}.json`),JSON.stringify(envelope));}
 await writeFile(path.join(directory,'history.json'),JSON.stringify(history));
}
/** Only generated JSON in one data directory; no Git/website/code write token.
 * The future Pages deployment receives this directory as its sole artifact.
 */
export async function publishEdition({directory,payload,policy,keys,privateKey,keyId,topicIds,now=new Date(),state='ok',quarantined=0,attempts=1,expectedPrevious}){
 if(!policy.publicationEnabled||!policy.schedulerEnabled)throw Error('News-Content-Bereitstellung deaktiviert');
 validatePayload(payload,{policy,topicIds,now});await mkdir(directory,{recursive:true});
 await recoverNewsLock(directory,{filename:'publisher.lock'});
 const lock=path.join(directory,'publisher.lock'),handle=await open(lock,'wx');
 const owner=randomUUID();await handle.writeFile(JSON.stringify({owner,pid:process.pid,host:hostname(),createdAt:now.toISOString()}));
 try{
  const previous=await readEdition(directory,options({keys,policy,topicIds,now}));
  if(expectedPrevious!==undefined&&expectedPrevious!==(previous?.fingerprint??null))throw Error('Content-Lane wurde inzwischen geändert');
  const digest=await fingerprint(payload);
  if(previous?.fingerprint===digest&&previous.status.state===state&&previous.status.attempts===attempts)return {envelope:previous,status:'unchanged'};
  const envelope=await signEnvelope({payload,keyId,privateKey,sequence:(previous?.sequence??0)+1,previous:previous?.fingerprint??null,now,state,quarantined,attempts});
  await verifyEnvelope(envelope,options({keys,policy,topicIds,now}));
  const version=`${envelope.sequence}-${envelope.fingerprint}.json`,text=JSON.stringify(envelope,null,2)+'\n';
  await mkdir(path.join(directory,'versions'),{recursive:true});
  await writeFile(path.join(directory,'versions',version),text,{flag:'wx'});
  let history=[];try{history=JSON.parse(await readFile(path.join(directory,'history.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  for(const old of history)await verifyEnvelope(old,options({keys,policy,topicIds,now}));
  history=[...history.filter(e=>e.sequence!==envelope.sequence),envelope].slice(-7);
  const retained=new Set(history.map(e=>`${e.sequence}-${e.fingerprint}.json`));
  for(const old of await readdir(path.join(directory,'versions')))if(/^\d+-[a-f0-9]{64}\.json$/.test(old)&&!retained.has(old))await unlink(path.join(directory,'versions',old));
  await writeFile(path.join(directory,'history.tmp'),JSON.stringify(history));await rename(path.join(directory,'history.tmp'),path.join(directory,'history.json'));
  await writeFile(path.join(directory,'latest.tmp'),text);await rename(path.join(directory,'latest.tmp'),path.join(directory,'latest.json'));
  return {envelope,status:'published',version};
 }finally{await handle.close();if(JSON.parse(await readFile(lock,'utf8')).owner!==owner)throw Error('Publisher-Reservierung wurde ersetzt');await unlink(lock);}
}
export async function rollbackEdition({version,...config}){
 if(!/^\d+-[a-f0-9]{64}\.json$/.test(version))throw Error('Ungültige Rückfallversion');
 const old=await verifyEnvelope(JSON.parse(await readFile(path.join(config.directory,'versions',version),'utf8')),options(config));
 return publishEdition({...config,payload:old.payload,state:'rollback',quarantined:0});
}
