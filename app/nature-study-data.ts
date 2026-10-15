import {useEffect,useState} from 'react';
import indexURL from './nature-study-index.json?url&no-inline';
import integrity from './nature-study-index-integrity.json';
import ids from './nature-entry-ids.json';
import words from './book-word-index.json';
import {WORLD_INDEX} from './world-index';
import {LAB_SEARCH} from './research-catalog';
import {readLimitedBytes} from './verified-content.mjs';
import {validateNaturePart,validateNatureIndex} from './nature-validation.mjs';
export type NatureLearning={starter:string;deeper:string;observe:string;benefit:string;connection:{kind:'word'|'topic'|'lab';target:string;reason:string};question:{prompt:string;answers:string[];correct:number;hint:string;why:string;wrongReasons:(string|null)[]};sources:{url:string;title:string;anchor:string;scope:string;checkedOn:string;updatedOn:string|null}[];mapPoint?:{source:string;scope:string;license:string;checkedOn:string}};
type Index=Record<string,{file:string;bytes:number;sha256:string}>;
const parts=import.meta.glob('./nature-studies/*.json',{eager:true,query:'?url&no-inline',import:'default'}) as unknown as Record<string,string>;
let index:Index|null=null,indexPending:Promise<Index>|null=null;
async function loadIndex():Promise<Index>{if(index)return index;if(!indexPending)indexPending=(async()=>{const response=await fetch(indexURL,{signal:AbortSignal.timeout(12000)});const data=await validateNatureIndex(await readLimitedBytes(response,integrity.bytes),integrity,ids,Object.keys(parts).map(p=>p.split('/').at(-1))) as Index;index=data;return data;})().catch(error=>{indexPending=null;throw error;});return indexPending;}
const saved=new Map<string,NatureLearning>(),pending=new Map<string,Promise<NatureLearning>>();
export const hasNatureStudy=(id:string)=>ids.includes(id);
export function loadNatureStudy(id:string):Promise<NatureLearning>{
 if(saved.has(id))return Promise.resolve(saved.get(id)!);if(pending.has(id))return pending.get(id)!;
 const request=(async()=>{if(!hasNatureStudy(id))throw Error('Unbekannter Naturort');const catalog=await loadIndex(),meta=catalog[id],url=meta&&parts['./nature-studies/'+meta.file];if(!url||!meta)throw Error('Unbekannte Naturvertiefung');const response=await fetch(url,{signal:AbortSignal.timeout(12000)});const data=await validateNaturePart(await readLimitedBytes(response,meta.bytes),id,meta,{words,topics:WORLD_INDEX.map(t=>t.id),labs:LAB_SEARCH.map(l=>l.id)}) as NatureLearning;saved.set(id,data);return data;})().finally(()=>pending.delete(id));pending.set(id,request);return request;
}
export function useNatureStudy(id:string,active:boolean){const[data,setData]=useState<NatureLearning|null>(saved.get(id)??null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);useEffect(()=>{if(!active)return;let live=true;loadNatureStudy(id).then(v=>{if(live){setData(v);setError(false);}}).catch(()=>{if(live)setError(true);});return()=>{live=false;};},[id,active,attempt]);return{data,error,retry:()=>setAttempt(n=>n+1)};}
