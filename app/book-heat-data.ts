import {useEffect,useState} from 'react';
import dataURL from './book-heat-content.json?url&no-inline';
import integrity from './book-heat-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';
import {HEAT_WORDS,HEAT_QUESTIONS,validateHeatPack} from './book-heat-validation.mjs';
import type {BookLearning} from './book-study';
import type {HeatFigureKind} from './book-heat-figure';

export type HeatLearning=BookLearning&{figure:HeatFigureKind};
type Pack={schemaVersion:1;sourceReadOn:string;words:Record<string,[string,string,string]>;learning:Record<string,HeatLearning>;why:Record<string,[string,string]>;whyLearning:Record<string,HeatLearning>};
let loaded:Pack|null=null,pending:Promise<Pack>|null=null;
export const hasBookHeat=(term:string)=>HEAT_WORDS.includes(term)||HEAT_QUESTIONS.includes(term);
function load(){
 if(loaded)return Promise.resolve(loaded);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(12000)});
  const pack=validateHeatPack(await verifiedContentJSON(bytes,integrity))as Pack;
  loaded=pack;return pack;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookHeat(term:string,active:boolean){
 const [generation,setGeneration]=useState(0),[result,setResult]=useState<{term:string;learning:HeatLearning|null;error:boolean;sourceReadOn:string|null}|null>(null);
 useEffect(()=>{
  if(!active||!hasBookHeat(term))return;
  let live=true;
  // Closing one card never cancels another reader's immutable content request.
  load().then(pack=>{if(live)setResult({term,learning:pack.learning[term]??pack.whyLearning[term],error:false,sourceReadOn:pack.sourceReadOn});}).catch(()=>{if(live)setResult({term,learning:null,error:true,sourceReadOn:null});});
  return()=>{live=false;};
 },[term,active,generation]);
 const current=result?.term===term?result:null;
 return{learning:current?.learning??null,sourceReadOn:current?.sourceReadOn??null,error:current?.error??false,retry:()=>{setResult(null);setGeneration(n=>n+1);}};
}
