import {useEffect,useState} from 'react';
import dataURL from './book-core.json?url';
import wordIndex from './book-word-index.json' with {type:'json'};
import whyIndex from './book-why-index.json' with {type:'json'};
import {WORLD_INDEX} from './world-index';
import {validateBookData} from './book-validation.mjs';
export type BookSource={url:string;title:string;anchor:string;updatedOn:string|null;checkedOn:string};
export type BookLearning={symbol:string;quantity:string;starter:string;deeper:string;observe:string;benefit:string;topic:string;connection:string;model?:'length'|'duration'|'temperature';illustration?:'entities';sources:BookSource[];question:{prompt:string;answers:string[];correct:number;hint:string;why:string;wrongReasons:string[]}};
export type BookData={schemaVersion:1;words:[string,string,string][];why:[string,string][];learning?:Record<string,BookLearning>};
let saved:BookData|null=null,pending:Promise<BookData>|null=null;
export function loadBookData():Promise<BookData>{
 if(saved)return Promise.resolve(saved);
 if(!pending)pending=(async()=>{const response=await fetch(dataURL,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Wissensbuch nicht erreichbar');const candidate=validateBookData(await response.json(),{words:wordIndex,why:whyIndex,learning:[],topics:WORLD_INDEX.map(t=>t.id)}) as BookData;saved=candidate;return candidate;})().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookData(){
 const [data,setData]=useState<BookData|null>(saved),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;loadBookData().then(value=>{if(active){setData(value);setError(false);}}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[attempt]);
 return {data,error,retry:()=>setAttempt(n=>n+1)};
}
