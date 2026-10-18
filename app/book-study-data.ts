import {useEffect,useState} from 'react';
import indexURL from './book-study-index.json?url&no-inline';
import integrity from './book-study-index-integrity.json' with {type:'json'};
import LEARNING from './book-learning-index.json' with {type:'json'};
import WORDS from './book-word-index.json' with {type:'json'};
import {WORLD_INDEX} from './world-index';
import {validateBookPart,validateBookStudyIndex,readBookBytes} from './book-part-validation.mjs';
import type {BookLearning} from './book-data';
const parts=import.meta.glob('./book-studies/*.json',{eager:true,query:'?url&no-inline',import:'default'}) as unknown as Record<string,string>;
type StudyIndex=Record<string,{file:string;bytes:number;sha256:string}>;
let index:StudyIndex|null=null,indexPending:Promise<StudyIndex>|null=null;
async function loadIndex():Promise<StudyIndex>{
 if(index)return index;if(!indexPending)indexPending=(async()=>{const response=await fetch(indexURL,{signal:AbortSignal.timeout(12000)});const next=await validateBookStudyIndex(await readBookBytes(response,integrity.bytes),integrity,LEARNING,Object.keys(parts).map(p=>p.split('/').at(-1))) as StudyIndex;index=next;return next;})().catch(e=>{indexPending=null;throw e;});return indexPending;
}
const saved=new Map<string,BookLearning>(),pending=new Map<string,Promise<BookLearning>>();
export const hasBookStudy=(term:string)=>LEARNING.includes(term);
export function loadBookStudy(term:string):Promise<BookLearning>{
 if(saved.has(term))return Promise.resolve(saved.get(term)!);
 if(pending.has(term))return pending.get(term)!;
 const request=(async()=>{
  if(!hasBookStudy(term))throw Error('Unbekannte Wortvertiefung');
  const catalog=await loadIndex(),meta=catalog[term],url=meta&&parts['./book-studies/'+meta.file];
  if(!url||!meta||meta.bytes>1048576)throw Error('Unbekannte Wortvertiefung');
  const response=await fetch(url,{signal:AbortSignal.timeout(12000)});
  const bytes=await readBookBytes(response,meta.bytes);
  const learning=await validateBookPart(bytes,term,meta,WORLD_INDEX.map(t=>t.id),WORDS) as BookLearning;
  saved.set(term,learning);return learning;
 })().finally(()=>pending.delete(term));pending.set(term,request);return request;
}
export function useBookStudy(term:string,active:boolean){
 const [learning,setLearning]=useState<BookLearning|null>(saved.get(term)??null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{if(!active)return;let live=true;loadBookStudy(term).then(data=>{if(live){setLearning(data);setError(false);}}).catch(()=>{if(live)setError(true);});return()=>{live=false;};},[term,active,attempt]);
 return {learning,error,retry:()=>setAttempt(n=>n+1)};
}
