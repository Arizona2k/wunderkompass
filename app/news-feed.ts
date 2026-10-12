import {useEffect,useSyncExternalStore} from 'react';
import DATA from './news-content.json' with {type:'json'};
import TRUST from './news-feed-trust.json' with {type:'json'};
import POLICY from '../content/news-source-policy.json' with {type:'json'};
import {WORLD_INDEX} from './world-index';
import type {NewsEntry} from './news-data';

type Snapshot={entries:NewsEntry[];checkedAt:string;source:'bundled'|'network'|'cache';warning:string|null;enabled:boolean};
let snapshot:Snapshot={entries:DATA.entries,checkedAt:DATA.checkedAt,source:'bundled',warning:null,enabled:TRUST.enabled};
const listeners=new Set<()=>void>();let started=false;
const subscribe=(fn:()=>void)=>{listeners.add(fn);return ()=>{listeners.delete(fn);};};
function start(){
 if(started||!TRUST.enabled)return;started=true;
 void import('./news-feed-runtime.mjs').then(runtime=>runtime.loadNewsFeed({trust:TRUST,policy:POLICY,topicIds:WORLD_INDEX.map(t=>t.id)})).then(result=>{
  const payload=result.envelope?.payload;
  snapshot={...snapshot,entries:payload?.entries??snapshot.entries,checkedAt:payload?.checkedAt??snapshot.checkedAt,source:result.source as Snapshot['source'],warning:result.warning};listeners.forEach(fn=>fn());
 }).catch(()=>{snapshot={...snapshot,warning:'Die aktuelle Ausgabe ist gerade nicht erreichbar. Die geprüften Erklärungen bleiben erhalten.'};listeners.forEach(fn=>fn());});
}
export function useNewsFeed(){useEffect(start,[]);return useSyncExternalStore(subscribe,()=>snapshot,()=>snapshot);}
