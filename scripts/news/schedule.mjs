import {open,readFile,writeFile,unlink,mkdir,rename} from 'node:fs/promises';
import {hostname} from 'node:os';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {berlinDay,dailyTarget} from './engine.mjs';
/** Callable, tested scheduler adapter. Nothing registers a timer or workflow. */
export async function dailyNewsTick({policy,now=new Date(),directory,run,previousAttempts=0}){
 if(!policy.schedulerEnabled)return {status:'inactive'};
 const day=berlinDay(now),target=dailyTarget(day,policy.localTime);
 if(now.getTime()<Date.parse(target))return {status:'not-due',target};
 await mkdir(directory,{recursive:true});const lock=path.join(directory,'daily.lock');let handle;
 try{handle=await open(lock,'wx');}catch(error){if(error.code==='EEXIST')return {status:'reserved'};throw error;}
 const owner=randomUUID();await handle.writeFile(JSON.stringify({owner,pid:process.pid,host:hostname(),createdAt:now.toISOString()}));
 try{
  const stateFile=path.join(directory,'last-run.json');let previous;try{previous=JSON.parse(await readFile(stateFile,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  if(previous?.day===day)return {status:'already-ran'};
  const attemptsFile=path.join(directory,'attempts.json');let attempts;try{attempts=JSON.parse(await readFile(attemptsFile,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  const count=Math.max(attempts?.day===day?attempts.count:0,previousAttempts);
  if(count>=(policy.maxDailyAttempts??3))return {status:'retry-budget-exhausted',day};
  await writeFile(attemptsFile+'.tmp',JSON.stringify({day,count:count+1}));await rename(attemptsFile+'.tmp',attemptsFile);
  const result=await run({attempt:count+1});
  if(result.report?.issues?.length&&!result.report?.selected?.length)return {status:'degraded',day,target,result};
  await writeFile(stateFile+'.tmp',JSON.stringify({day,completedAt:now.toISOString(),fingerprint:result.fingerprint}));await rename(stateFile+'.tmp',stateFile);
  return {status:'checked',day,target,result};
 }finally{await handle.close();const lease=JSON.parse(await readFile(lock,'utf8'));if(lease.owner!==owner)throw Error('Tagesreservierung wurde ersetzt');await unlink(lock);}
}

/** Recovery only after proof of a dead process on this host, never by age alone. */
export async function recoverNewsLock(directory,{now=new Date(),minimumAgeMs=120000,filename='daily.lock'}={}){
 if(!['daily.lock','publisher.lock'].includes(filename))throw Error('Unbekannte Reservierung');
 const recovery=path.join(directory,'recovery.lock');let guard;try{guard=await open(recovery,'wx');}catch(error){if(error.code==='EEXIST')return false;throw error;}
 try{
  const lock=path.join(directory,filename);let lease;try{lease=JSON.parse(await readFile(lock,'utf8'));}catch(error){if(error.code==='ENOENT')return false;throw error;}
  if(lease.host!==hostname()||!Number.isSafeInteger(lease.pid)||lease.pid<1||now-Date.parse(lease.createdAt)<minimumAgeMs)return false;
  try{process.kill(lease.pid,0);return false;}catch(error){if(error.code!=='ESRCH')return false;}
  const current=JSON.parse(await readFile(lock,'utf8'));if(current.owner!==lease.owner)return false;await unlink(lock);return true;
 }finally{await guard.close();await unlink(recovery);}
}
