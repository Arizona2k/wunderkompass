import {useEffect,useState} from 'react';
import url from './nature-search.json?url&no-inline';
import integrity from './nature-search-integrity.json';
import ids from './nature-entry-ids.json';
import {readLimitedBytes} from './verified-content.mjs';
import {validateNatureSearch} from './nature-validation.mjs';
let saved:Record<string,string>|null=null,pending:Promise<Record<string,string>>|null=null;
export function useNatureSearch(active:boolean){
 const[data,setData]=useState(saved),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{if(!active)return;let live=true;
  if(!saved&&!pending)pending=(async()=>{const response=await fetch(url,{signal:AbortSignal.timeout(12000)});const result=await validateNatureSearch(await readLimitedBytes(response,integrity.bytes),integrity,ids) as Record<string,string>;saved=result;return result;})().catch(e=>{pending=null;throw e;});
  (saved?Promise.resolve(saved):pending!).then(next=>{if(live){setData(next);setError(false);}}).catch(()=>{if(live)setError(true);});return()=>{live=false;};
 },[active,attempt]);
 return{data,error,retry:()=>setAttempt(n=>n+1)};
}
