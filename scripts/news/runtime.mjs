import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {dailyNewsTick,recoverNewsLock} from './schedule.mjs';
import {prepareAutomaticEdition} from './automatic.mjs';
import {publishEdition,readEdition,restoreHistory} from './lane.mjs';
import {fetchEdition,feedURL,readBoundedJSON} from '../../app/news-feed-client.mjs';
import {berlinDay,dailyTarget} from './engine.mjs';

/** A runnable data-only production job. No git push, merge or app deployment. */
export async function runNewsJob({policy,runtime,content,topicIds,directory,privateKey,now=new Date(),fetchImpl=fetch,repository=process.env.GITHUB_REPOSITORY,wait}){
 if(runtime.mode==='disabled'||!policy.schedulerEnabled)return {status:'inactive',publication:'deactivated'};
 if(now.getTime()<Date.parse(dailyTarget(berlinDay(now),policy.localTime)))return {status:'not-due',publication:'unchanged'};
 if(runtime.maxExternalAICost!==0||policy.externalAIEnabled)throw Error('Kein freigegebenes KI-Kostenbudget');
 if(runtime.mode!=='isolated'){
  if(runtime.mode!=='pages'||runtime.allowedBranch!=='news-content'||!runtime.allowedRepository||repository!==runtime.allowedRepository||repository==='Arizona2k/wunderkompass')throw Error('Kein freigegebenes separates News-Repository');
  feedURL(runtime.endpoint);
 }
 if(!privateKey||!runtime.keyId||!runtime.keys[runtime.keyId])throw Error('Signier- oder öffentlicher Prüfschlüssel fehlt');
 const publication=path.join(directory,'publication');await mkdir(publication,{recursive:true});
 let previous=await readEdition(publication,{keys:runtime.keys,policy,topicIds,now});
 if(!previous&&runtime.mode==='pages'){
  // The very first bootstrap requires an explicit reviewed empty-lane choice.
  try{previous=await fetchEdition(feedURL(runtime.endpoint),{keys:runtime.keys,policy,topicIds,now},{fetchImpl});await writeFile(path.join(publication,'latest.json'),JSON.stringify(previous));}
  catch(error){if(!runtime.bootstrapEmptyLane||error.status!==404)throw Error('Letzte signierte Ausgabe konnte nicht wiederhergestellt werden');}
  if(previous){
   const response=await fetchImpl(new URL('history.json',runtime.endpoint).href,{redirect:'error',signal:AbortSignal.timeout(8000)});
   if(!response.ok||!/^application\/json\b/i.test(response.headers.get('content-type')??'')||Number(response.headers.get('content-length'))>7340032)throw Error('Rückfallverlauf nicht erreichbar');
   await restoreHistory(publication,await readBoundedJSON(response,7340032),{keys:runtime.keys,policy,topicIds,now});
  }
 }
 const previousContent=previous?.payload??content;
 if(previous?.day===berlinDay(now)&&previous.status.state!=='degraded')return {status:'already-ran',publication:'unchanged'};
 await recoverNewsLock(directory);
 const result=await dailyNewsTick({policy:{...policy,maxDailyAttempts:runtime.maxDailyAttempts},now,directory,previousAttempts:previous?.day===berlinDay(now)?previous.status.attempts:0,run:async({attempt})=>{
  const prepared=await prepareAutomaticEdition({policy,content:previousContent,topicIds,directory:path.join(directory,'draft'),now,fetchImpl,wait});
  const state=prepared.report.issues.length?'degraded':prepared.report.selected.length?'ok':'no-new-items';
  const published=await publishEdition({directory:publication,payload:prepared.payload,policy,keys:runtime.keys,privateKey,keyId:runtime.keyId,topicIds,now,state,quarantined:prepared.report.issues.length,attempts:attempt,expectedPrevious:previous?.fingerprint??null});
  return {...prepared,published};
 }});
 return {...result,publication:result.result?.published.status??'unchanged',directory:publication};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const json=async file=>JSON.parse(await readFile(new URL('../../'+file,import.meta.url),'utf8'));
 const policy=await json('content/news-source-policy.json'),runtime=await json('content/news-runtime.json'),content=await json('app/news-content.json'),topics=await json('app/world-index.json');
 let privateKey;if(runtime.mode!=='disabled'&&process.env.NEWS_SIGNING_JWK){try{privateKey=await crypto.subtle.importKey('jwk',JSON.parse(process.env.NEWS_SIGNING_JWK),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);}catch{throw Error('Signierschlüssel ungültig; Schlüsselinhalt wird nicht protokolliert');}}
 const result=await runNewsJob({policy,runtime,content,topicIds:topics.map(t=>t.id),directory:path.resolve('work/news-runtime'),privateKey});
 await mkdir('work/news-runtime',{recursive:true});await writeFile('work/news-runtime/job-status.json',JSON.stringify({status:result.status,publish:result.publication==='published'}));
 console.log(JSON.stringify({status:result.status,publication:result.publication,day:result.day,fingerprint:result.result?.fingerprint,selected:result.result?.report.selected,issues:result.result?.report.issues},null,2));
 if(['degraded','retry-budget-exhausted'].includes(result.status))console.warn('::warning::Keine neue vollständig geeignete Ausgabe; letzter geprüfter Nachrichtenstand bleibt erhalten.');
}
