import {fetchEdition,feedURL} from './news-feed-client.mjs';
import {verifyEnvelope} from './news-wire.mjs';

/** This cache contains public signed news, never a child's learning progress. */
export async function loadNewsFeed({trust,policy,topicIds,now=new Date(),cacheStorage=globalThis.caches,fetchImpl=fetch,previousEnvelope=null}){
 const endpoint=feedURL(trust.endpoint),validation={keys:trust.keys,policy,topicIds,now};
 let cache=null,previous=null,previousSource='memory';
 try{if(previousEnvelope)previous=await verifyEnvelope(previousEnvelope,validation);}catch{/* Never trust an unvalidated memory anchor. */}
 try{cache=await cacheStorage?.open('wunderkompass-public-news-v1');const saved=await cache?.match(endpoint);if(saved){const cached=await verifyEnvelope(await saved.json(),{...validation,floor:previous?.sequence??0,knownFingerprint:previous?.fingerprint??null});previous=cached;previousSource='cache';}}catch{/* A corrupt/older cache cannot replace a validated session anchor. */}
 try{
  const envelope=await fetchEdition(endpoint,{...validation,floor:previous?.sequence??0,knownFingerprint:previous?.fingerprint??null},{fetchImpl,maxBytes:trust.maxBytes,timeoutMs:trust.timeoutMs});
  try{await cache?.put(endpoint,new Response(JSON.stringify(envelope),{headers:{'Content-Type':'application/json'}}));}catch{/* Reading works when public cache storage is unavailable. */}
  const stale=now.getTime()-Date.parse(envelope.issuedAt)>36*3600000;
  return {envelope,source:'network',warning:stale?'Seit mehr als einem Tag fehlt eine neue bestätigte Ausgabe. Die Beiträge behalten ihren ursprünglichen Stand.':envelope.status.state==='degraded'?'Ein Teil der Quellen konnte nicht geprüft werden.':envelope.status.state==='no-new-items'?'Heute gab es keine neue geeignete Meldung. Die bisherigen Erklärungen bleiben erhalten.':null};
 }catch{
  if(previous)return {envelope:previous,source:previousSource,warning:'Die neue Ausgabe konnte nicht sicher geladen werden. Du siehst den letzten geprüften Stand.'};
  return {envelope:null,source:'bundled',warning:'Die aktuelle Ausgabe konnte nicht sicher geladen werden. Die bisherigen geprüften Erklärungen bleiben erhalten.'};
 }
}
