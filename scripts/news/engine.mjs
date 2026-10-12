import {calendarDay,berlinDay,approvedURL,validateNews} from '../../app/news-validation.mjs';
export {berlinDay,approvedURL,validateNews};
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fail=message=>{throw new Error(message);};
/** Convert the local target to UTC with the actual IANA rules, also over DST. */
export function dailyTarget(day,localTime='12:30'){
 if(!calendarDay(day)||!/^\d{2}:\d{2}$/.test(localTime))fail('Ungültiger Tagesplan');
 const [hour,minute]=localTime.split(':').map(Number);if(hour>23||minute>59)fail('Ungültige Uhrzeit');
 const utc=Date.parse(day+'T'+localTime+':00Z');if(!Number.isFinite(utc))fail('Ungültiges Datum');
 const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',hour:'numeric',minute:'numeric',hourCycle:'h23'});
 const parts=formatter.formatToParts(new Date(utc)),value=type=>Number(parts.find(p=>p.type===type).value);
 return new Date(utc-((value('hour')*60+value('minute'))-(hour*60+minute))*60000).toISOString();
}
const plain=text=>text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|quot|lt|gt);/g,' ').replace(/\s+/g,' ').trim();
/** Bounded RSS/Atom discovery only; original wording never becomes child copy. */
export function parseFeed(xml,policy){
 if(Buffer.byteLength(xml)>policy.maxBytes||/<!DOCTYPE|<!ENTITY/i.test(xml))fail('Unzulässiger Feed');
 const entries=[...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)].slice(0,100);
 return entries.flatMap(([, ,body])=>{
  const field=name=>body.match(new RegExp('<'+name+'[^>]*>([\\s\\S]*?)<\\/'+name+'>','i'))?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1');
  const url=field('link')??body.match(/<link\b[^>]*href=["']([^"']+)["']/i)?.[1];
  try{return [{url:approvedURL(url,policy),title:plain(field('title')??''),publishedAt:field('pubDate')??field('published')??field('updated')??null}];}catch{return [];}
 });
}
export async function fetchSource(url,policy,{fetchImpl=fetch,wait=ms=>new Promise(r=>setTimeout(r,ms)),json=false,signal}={}){
 const approved=approvedURL(url,policy);if(!policy.automaticRetrievalAuthorized)fail('Regelmäßiger Quellenabruf noch nicht freigegeben');
 let last;
 for(let attempt=0;attempt<Math.min(3,policy.attempts);attempt++){
  try{
   const response=await fetchImpl(approved,{redirect:'error',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(policy.timeoutMs)]):AbortSignal.timeout(policy.timeoutMs),headers:{Accept:json?'application/json':'text/html, application/rss+xml, application/atom+xml','User-Agent':'WunderKompass-Quellenpruefung/1.0'}});
   if(!response.ok){const error=new Error('Quellenstatus '+response.status);error.retry=response.status===429||response.status>=500;throw error;}
   if(response.url&&response.url!==approved)fail('Unerwartete Umleitung');
   const type=response.headers.get('content-type')??'';if(!(json?/application\/json/i.test(type):/text\/html|application\/(?:rss\+xml|atom\+xml|xml)|text\/xml/.test(type)))fail('Unpassender Quellentyp');
   if(Number(response.headers.get('content-length'))>policy.maxBytes)fail('Quelle zu groß');
   let bytes=0;const chunks=[];const reader=response.body.getReader();try{for(;;){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>policy.maxBytes)fail('Quelle zu groß');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
   const text=Buffer.concat(chunks).toString('utf8');if(!text.trim())fail('Leere Quelle');
   return {url:approved,sha256:createHash('sha256').update(text).digest('hex'),document:text,text:plain(text),bytes};
  }catch(error){last=error;if(signal?.aborted||error.retry===false||/Umleitung|Quellentyp|zu groß|Leere/.test(error.message))break;if(attempt+1<Math.min(3,policy.attempts))await wait(250*2**attempt);}
 }
 throw last;
}
/** Safe formulation: only approved original briefs, never copied RSS headlines. */
export function formulate(brief,observations){
 if(brief.editorial?.status!=='approved')fail('Neue Meldung braucht eine geprüfte eigene Formulierung');
 for(const claim of brief.claims){
  const values=claim.sourceIndexes.map(i=>observations[i]?.claims?.[claim.key]);
  if(values.some(value=>value!==claim.value))fail('Kernaussage widersprüchlich oder nicht gegenprüfbar: '+claim.key);
 }
 return structuredClone(brief);
}
export function observeClaims(fetched,source,brief){
 const index=brief.sources.findIndex(s=>s.url===source.url),checks=brief.sourceChecks?.[index];
 if(!checks||!Object.keys(checks).length)fail('Keine geprüften Aussagenanker für diese Quelle');
 const text=fetched.text.normalize('NFKC').toLowerCase(),claims={};
 for(const claim of brief.claims){if(!claim.sourceIndexes.includes(index))continue;
  const anchors=checks[claim.key];if(!Array.isArray(anchors)||anchors.length<2||anchors.some(a=>typeof a!=='string'||a.length<2||!text.includes(a.normalize('NFKC').toLowerCase())))fail('Aussagenanker fehlen oder Quelle wurde geändert');
  claims[claim.key]=claim.value;
 }
 return {url:fetched.url,sha256:fetched.sha256,claims};
}
export function discoverArticles(document,policy,baseURL){
 if(/<(rss|feed)\b/i.test(document))return parseFeed(document,policy);
 if(Buffer.byteLength(document)>policy.maxBytes)fail('Quellenübersicht zu groß');
 return [...document.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].flatMap(([,url,title])=>{try{const text=plain(title).slice(0,160);return text?[{url:approvedURL(new URL(url.replace(/&amp;/g,'&'),baseURL).href,policy),title:text,publishedAt:null}]:[];}catch{return [];}}).slice(0,100);
}
export async function runNews({policy,briefs,previous=[],topicIds,now=new Date(),loadObservation,loadDiscovery}){
 const report={schemaVersion:1,runAt:now.toISOString(),day:berlinDay(now),targetUTC:dailyTarget(berlinDay(now),policy.localTime),mode:'dry-run',steps:['Abruf','Auswahl','Gegenprüfung','eigene Formulierung','Qualität','Quellen','validierte Ausgabe'],issues:[],retained:[],selected:[],awaitingEditorial:[],candidates:[],deferred:[]};
 const candidateURLs=new Set(),knownURLs=new Set(briefs.flatMap(b=>b.sources.map(s=>s.url)));
 for(const source of policy.discoverySources??[]){
  try{
   if(!loadDiscovery)fail('Quellenentdeckung nicht verbunden');
   for(const candidate of await loadDiscovery(source)){
    const url=approvedURL(candidate.url,policy);if(candidateURLs.has(url))continue;candidateURLs.add(url);
    let status=knownURLs.has(url)?'known-brief':'awaiting-editorial';
    if(candidate.publishedAt){const time=Date.parse(candidate.publishedAt);if(!Number.isFinite(time))status='invalid-date';else{const age=(Date.parse(berlinDay(now)+'T12:00:00Z')-Date.parse(berlinDay(new Date(time))+'T12:00:00Z'))/86400000;if(age<0)status='future-source';else if(age>policy.maxAgeDays)status='archive-candidate';}}
    report.candidates.push({url,publishedAt:candidate.publishedAt??null,status});
    if(status==='awaiting-editorial')report.awaitingEditorial.push(url);
   }
  }catch(error){report.issues.push({id:source.url,reason:'Quellenentdeckung: '+error.message});}
 }
 const output=[],seen=new Set(),identities=new Set();
 for(const brief of [...briefs].sort((a,b)=>String(b.sourcePublishedOn).localeCompare(String(a.sourcePublishedOn)))){
  try{
   const status=validateNews(brief,{policy,now,topicIds}),identity=hash(brief.claims.map(c=>[c.key,c.value]));
   if(seen.has(brief.id)||identities.has(identity))fail('Doppelte Meldung');seen.add(brief.id);identities.add(identity);
   if(status.archived){output.push(structuredClone(brief));report.retained.push(brief.id);continue;}
   if(report.selected.length>=policy.maxItems){report.deferred.push(brief.id);continue;}
   const observations=[];for(const source of brief.sources)observations.push(await loadObservation(source,brief));
   const entry=formulate(brief,observations);entry.checkedAt=now.toISOString();
   validateNews(entry,{policy,now,topicIds});output.push(entry);report.selected.push(entry.id);
  }catch(error){report.issues.push({id:brief.id,reason:error.message});report.awaitingEditorial.push(brief.id);}
 }
 for(const entry of previous){if(output.some(n=>n.id===entry.id))continue;try{validateNews(entry,{policy,now,topicIds});output.push(structuredClone(entry));report.retained.push(entry.id);}catch(error){report.issues.push({id:entry.id,reason:'Alter Stand ungültig: '+error.message});}}
 output.sort((a,b)=>b.sourcePublishedOn.localeCompare(a.sourcePublishedOn)||a.id.localeCompare(b.id));
 const payload={schemaVersion:1,checkedAt:output.reduce((latest,n)=>n.checkedAt>latest?n.checkedAt:latest,'1970-01-01T00:00:00Z'),automation:'inactive',entries:output};
 return {payload,report,fingerprint:hash(payload)};
}
export async function saveDraft(directory,result){
 await mkdir(directory,{recursive:true});const payload=JSON.stringify(result.payload,null,2)+'\n';
 const tmp=path.join(directory,'draft.tmp');await writeFile(tmp,payload);await rename(tmp,path.join(directory,'draft.json'));await writeFile(path.join(directory,'report.json'),JSON.stringify({...result.report,fingerprint:result.fingerprint},null,2)+'\n');return result.fingerprint;
}
/** Separate reviewed handoff. Disabled production policy always wins. */
export async function publishReviewed({policy,directory,target,approvalFingerprint,topicIds=[],now=new Date()}){
 if(!policy.publicationEnabled||!policy.schedulerEnabled)fail('Produktive Nachrichtenbereitstellung ist deaktiviert');
 const payload=JSON.parse(await readFile(path.join(directory,'draft.json'),'utf8'));
 if(hash(payload)!==approvalFingerprint)fail('Freigabe passt nicht zum geprüften Entwurf');
 if(payload.schemaVersion!==1||!Array.isArray(payload.entries)||!payload.entries.length)fail('Ungültige Ausgabe');
 for(const entry of payload.entries)validateNews(entry,{policy,now,topicIds});
 const tmp=target+'.news-tmp';await writeFile(tmp,JSON.stringify(payload,null,2)+'\n');await rename(tmp,target);
 return hash(payload);
}
