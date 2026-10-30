import {useEffect,useState} from 'react';
import dataURL from './book-light-content.json?url&no-inline';
import integrity from './book-light-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';
import {LIGHT_WORDS,LIGHT_QUESTIONS,validateLightPack} from './book-light-validation.mjs';
import type {BookLearning} from './book-study';
import type {LightFigureKind} from './book-light-figure';

export type LightLearning=BookLearning&{figure:LightFigureKind};
type Pack={schemaVersion:1;sourceReadOn:string;words:Record<string,[string,string,string]>;learning:Record<string,LightLearning>;why:Record<string,[string,string]>;whyLearning:Record<string,LightLearning>};
let loaded:Pack|null=null,pending:Promise<Pack>|null=null;
export const hasBookLight=(term:string)=>LIGHT_WORDS.includes(term)||LIGHT_QUESTIONS.includes(term);
function load(){
 if(loaded)return Promise.resolve(loaded);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(15600)});
  const pack=validateLightPack(await verifiedContentJSON(bytes,integrity))as Pack;
  loaded=pack;return pack;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookLight(term:string,active:boolean){
 const [generation,setGeneration]=useState(0),[result,setResult]=useState<{term:string;learning:LightLearning|null;error:boolean;sourceReadOn:string|null}|null>(null);
 useEffect(()=>{
  if(!active||!hasBookLight(term))return;
  let live=true;
  // Closing one card never cancels another reader's immutable content request.
  load().then(pack=>{if(live)setResult({term,learning:pack.learning[term]??pack.whyLearning[term],error:false,sourceReadOn:pack.sourceReadOn});}).catch(()=>{if(live)setResult({term,learning:null,error:true,sourceReadOn:null});});
  return()=>{live=false;};
 },[term,active,generation]);
 const current=result?.term===term?result:null;
 return{learning:current?.learning??null,sourceReadOn:current?.sourceReadOn??null,error:current?.error??false,retry:()=>{setResult(null);setGeneration(n=>n+1);}};
}
