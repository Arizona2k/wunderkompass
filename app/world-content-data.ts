import {useEffect,useState} from 'react';
import animalsURL from './world-content-parts/world-content-animals.json?url';
import historyURL from './world-content-parts/world-content-history.json?url';
import peopleURL from './world-content-parts/world-content-people.json?url';
import inventionsURL from './world-content-parts/world-content-inventions.json?url';
import buildingsURL from './world-content-parts/world-content-buildings.json?url';
import scienceURL from './world-content-parts/world-content-science.json?url';
import {WORLD_INDEX} from './world-index';
import {validateWorldContent} from './world-content-validation.mjs';
import type {WorldCategory,WorldTopic} from './world-types';
const urls={animals:animalsURL,history:historyURL,people:peopleURL,inventions:inventionsURL,buildings:buildingsURL,science:scienceURL};
const saved=new Map<WorldCategory,WorldTopic[]>(),pending=new Map<WorldCategory,Promise<WorldTopic[]>>();
function loadPart(category:WorldCategory):Promise<WorldTopic[]>{
 const cached=saved.get(category);if(cached)return Promise.resolve(cached);
 const running=pending.get(category);if(running)return running;
 const request=(async()=>{const response=await fetch(urls[category],{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Wissenskarten nicht erreichbar');const next=validateWorldContent(await response.json(),WORLD_INDEX.filter(t=>t.category===category),WORLD_INDEX) as WorldTopic[];saved.set(category,next);return next;})().finally(()=>pending.delete(category));
 pending.set(category,request);return request;
}
export async function loadWorldContent(categories:WorldCategory[]):Promise<WorldTopic[]>{
 const parts=await Promise.all([...new Set(categories)].map(loadPart));
 const topics=new Map(parts.flat().map(t=>[t.id,t]));
 return WORLD_INDEX.flatMap(t=>topics.has(t.id)?[topics.get(t.id)!]:[]);
}
export function useWorldContent(categories:WorldCategory[]){
 const key=[...new Set(categories)].sort().join(',');
 const [state,setState]=useState<{key:string;data:WorldTopic[]|null;error:boolean}>({key:'',data:null,error:false}),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;loadWorldContent(key.split(',').filter(Boolean) as WorldCategory[]).then(data=>{if(active)setState({key,data,error:false});}).catch(()=>{if(active)setState({key,data:null,error:true});});return()=>{active=false;};},[key,attempt]);
 return {data:state.key===key?state.data:null,error:state.key===key&&state.error,retry:()=>setAttempt(n=>n+1)};
}
