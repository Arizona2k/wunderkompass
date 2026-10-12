import {useEffect,useSyncExternalStore} from 'react';
import DATA from './news-content.json' with {type:'json'};
import TRUST from './news-feed-trust.json' with {type:'json'};
import {hosts,maxAgeDays} from '../content/news-source-policy.json' with {type:'json'};
const POLICY={hosts,maxAgeDays};
import {WORLD_INDEX} from './world-index';
import type {NewsEntry} from './news-data';
import {createNewsRefresh} from './news-refresh.mjs';

type Snapshot={entries:NewsEntry[];checkedAt:string;source:'bundled'|'network'|'cache'|'memory';warning:string|null;enabled:boolean};
let snapshot:Snapshot={entries:DATA.entries,checkedAt:DATA.checkedAt,source:'bundled',warning:null,enabled:TRUST.enabled};
const listeners=new Set<()=>void>();let users=0;
type FeedResult=Awaited<ReturnType<typeof import('./news-feed-runtime.mjs').loadNewsFeed>>;
let previousEnvelope:FeedResult['envelope']=null;
const subscribe=(fn:()=>void)=>{listeners.add(fn);return ()=>{listeners.delete(fn);};};
const refresh=createNewsRefresh({
 load:async()=>{const runtime=await import('./news-feed-runtime.mjs');return runtime.loadNewsFeed({trust:TRUST,policy:POLICY,topicIds:WORLD_INDEX.map(t=>t.id),previousEnvelope});},
 isVisible:()=>document.visibilityState==='visible',isOnline:()=>navigator.onLine,
 onResult:(result:FeedResult)=>{
  if(result.envelope)previousEnvelope=result.envelope;
  const payload=result.envelope?.payload;
  snapshot={...snapshot,entries:payload?.entries??snapshot.entries,checkedAt:payload?.checkedAt??snapshot.checkedAt,source:result.source as Snapshot['source'],warning:result.warning};listeners.forEach(fn=>fn());
 },onError:()=>{snapshot={...snapshot,warning:'Die aktuelle Ausgabe ist gerade nicht erreichbar. Die geprüften Erklärungen bleiben erhalten.'};listeners.forEach(fn=>fn());}
});
const wake=()=>refresh.wake();
const newsReturn=()=>{if(/^#news(?:\/|$)/.test(location.hash))wake();};
function start(){
 if(!TRUST.enabled)return;
 if(++users===1){document.addEventListener('visibilitychange',wake);window.addEventListener('online',wake);window.addEventListener('hashchange',newsReturn);refresh.start();}
 else newsReturn();
 return ()=>{if(--users===0){refresh.stop();document.removeEventListener('visibilitychange',wake);window.removeEventListener('online',wake);window.removeEventListener('hashchange',newsReturn);}};
}
export function useNewsFeed(){useEffect(start,[]);return useSyncExternalStore(subscribe,()=>snapshot,()=>snapshot);}
