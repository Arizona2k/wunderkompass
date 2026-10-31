import {useEffect,useState} from 'react';
import dataURL from './book-mechanics-content.json?url&no-inline';
import integrity from './book-mechanics-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';
import {MECHANICS_WORDS,MECHANICS_QUESTIONS,validateMechanicsPack} from './book-mechanics-validation.mjs';
import type {BookLearning} from './book-study';
import type {MechanicsFigureKind} from './book-mechanics-figure';

export type MechanicsLearning=BookLearning&{figure:MechanicsFigureKind};
type Pack={schemaVersion:1;sourceReadOn:string;words:Record<string,[string,string,string]>;learning:Record<string,MechanicsLearning>;why:Record<string,[string,string]>;whyLearning:Record<string,MechanicsLearning>};
let loaded:Pack|null=null,pending:Promise<Pack>|null=null;
export const hasBookMechanics=(term:string)=>MECHANICS_WORDS.includes(term)||MECHANICS_QUESTIONS.includes(term);
function load(){
 if(loaded)return Promise.resolve(loaded);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(12000)});
  const pack=validateMechanicsPack(await verifiedContentJSON(bytes,integrity))as Pack;
  loaded=pack;return pack;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookMechanics(term:string,active:boolean){
 const [generation,setGeneration]=useState(0),[result,setResult]=useState<{term:string;learning:MechanicsLearning|null;error:boolean;sourceReadOn:string|null}|null>(null);
 useEffect(()=>{
  if(!active||!hasBookMechanics(term))return;
  let live=true;
  // Closing one card never cancels another reader's immutable content request.
  load().then(pack=>{if(live)setResult({term,learning:pack.learning[term]??pack.whyLearning[term],error:false,sourceReadOn:pack.sourceReadOn});}).catch(()=>{if(live)setResult({term,learning:null,error:true,sourceReadOn:null});});
  return()=>{live=false;};
 },[term,active,generation]);
 const current=result?.term===term?result:null;
 return{learning:current?.learning??null,sourceReadOn:current?.sourceReadOn??null,error:current?.error??false,retry:()=>{setResult(null);setGeneration(n=>n+1);}};
}
