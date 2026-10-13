import {useEffect,useState} from 'react';
import dataURL from './book-content.json?url';
import {validateBookData} from './book-validation.mjs';
export type BookData={schemaVersion:1;words:[string,string,string][];why:[string,string][]};
let saved:BookData|null=null,pending:Promise<BookData>|null=null;
export function loadBookData():Promise<BookData>{
 if(saved)return Promise.resolve(saved);
 if(!pending)pending=(async()=>{const response=await fetch(dataURL,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Wissensbuch nicht erreichbar');const candidate=validateBookData(await response.json()) as BookData;saved=candidate;return candidate;})().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookData(){
 const [data,setData]=useState<BookData|null>(saved),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;loadBookData().then(value=>{if(active){setData(value);setError(false);}}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[attempt]);
 return {data,error,retry:()=>setAttempt(n=>n+1)};
}
