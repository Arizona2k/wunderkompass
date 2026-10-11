import {open,readFile,writeFile,unlink,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {berlinDay,dailyTarget} from './engine.mjs';
/** Callable, tested scheduler adapter. Nothing registers a timer or workflow. */
export async function dailyNewsTick({policy,now=new Date(),directory,run}){
 if(!policy.schedulerEnabled)return {status:'inactive'};
 const day=berlinDay(now),target=dailyTarget(day,policy.localTime);
 if(now.getTime()<Date.parse(target))return {status:'not-due',target};
 await mkdir(directory,{recursive:true});const lock=path.join(directory,'daily.lock');let handle;
 try{handle=await open(lock,'wx');}catch(error){if(error.code==='EEXIST')return {status:'reserved'};throw error;}
 try{
  const stateFile=path.join(directory,'last-run.json');let previous;try{previous=JSON.parse(await readFile(stateFile,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  if(previous?.day===day)return {status:'already-ran'};
  const result=await run();
  await writeFile(stateFile,JSON.stringify({day,completedAt:now.toISOString(),fingerprint:result.fingerprint}));
  return {status:'checked',day,target,result};
 }finally{await handle.close();await unlink(lock);}
}
