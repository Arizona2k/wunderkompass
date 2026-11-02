import {useEffect,useState} from 'react';
import dataURL from './book-retained-content.json?url&no-inline';
import integrity from './book-retained-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';
import {RETAINED_WORDS,RETAINED_QUESTIONS,validateRetainedPack} from './book-retained-validation.mjs';
import type {BookLearning} from './book-study';
import type {FinalNineFigureKind} from './book-retained-models';
import type {MixingFigureKind} from './book-mixing-models';

export type RetainedLearning=BookLearning&{figure:FinalNineFigureKind|MixingFigureKind|'plan-scale'|'pendulum-length-period-ratio'|'normalized-driven-response';sourceReadOn:string};
type Pack={schemaVersion:1;words:Record<string,[string,string,string]>;learning:Record<string,RetainedLearning>;why:Record<string,[string,string]>;whyLearning:Record<string,RetainedLearning>};
let loaded:Pack|null=null,pending:Promise<Pack>|null=null;
export const hasBookRetained=(term:string)=>RETAINED_WORDS.includes(term)||RETAINED_QUESTIONS.includes(term);
function load(){
 if(loaded)return Promise.resolve(loaded);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(12000)});
  const pack=validateRetainedPack(await verifiedContentJSON(bytes,integrity))as Pack;
  loaded=pack;return pack;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookRetained(term:string,active:boolean){
 const [generation,setGeneration]=useState(0),[result,setResult]=useState<{term:string;learning:RetainedLearning|null;error:boolean;sourceReadOn:string|null}|null>(null);
 useEffect(()=>{
  if(!active||!hasBookRetained(term))return;
  let live=true;
  // Closing one card never cancels another reader's immutable content request.
  load().then(pack=>{if(live)setResult({term,learning:pack.learning[term]??pack.whyLearning[term],error:false,sourceReadOn:(pack.learning[term]??pack.whyLearning[term]).sourceReadOn});}).catch(()=>{if(live)setResult({term,learning:null,error:true,sourceReadOn:null});});
  return()=>{live=false;};
 },[term,active,generation]);
 const current=result?.term===term?result:null;
 return{learning:current?.learning??null,sourceReadOn:current?.sourceReadOn??null,error:current?.error??false,retry:()=>{setResult(null);setGeneration(n=>n+1);}};
}
