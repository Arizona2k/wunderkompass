import {useEffect,useState} from 'react';
import dataURL from './book-water-content.json?url&no-inline';
import integrity from './book-water-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';
import {WATER_WORDS,WATER_QUESTIONS,validateWaterPack} from './book-water-validation.mjs';
import type {BookLearning} from './book-study';
import type {WaterFigureKind} from './book-water-figure';

export type WaterLearning=BookLearning&{figure:WaterFigureKind};
type Pack={schemaVersion:1;sourceReadOn:string;words:Record<string,[string,string,string]>;learning:Record<string,WaterLearning>;why:Record<string,[string,string]>;whyLearning:Record<string,WaterLearning>};
let loaded:Pack|null=null,pending:Promise<Pack>|null=null;
export const hasBookWater=(term:string)=>WATER_WORDS.includes(term)||WATER_QUESTIONS.includes(term);
function load(){
 if(loaded)return Promise.resolve(loaded);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(15600)});
  const pack=validateWaterPack(await verifiedContentJSON(bytes,integrity))as Pack;
  loaded=pack;return pack;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookWater(term:string,active:boolean){
 const [generation,setGeneration]=useState(0),[result,setResult]=useState<{term:string;learning:WaterLearning|null;error:boolean;sourceReadOn:string|null}|null>(null);
 useEffect(()=>{
  if(!active||!hasBookWater(term))return;
  let live=true;
  // Closing one card never cancels another reader's immutable content request.
  load().then(pack=>{if(live)setResult({term,learning:pack.learning[term]??pack.whyLearning[term],error:false,sourceReadOn:pack.sourceReadOn});}).catch(()=>{if(live)setResult({term,learning:null,error:true,sourceReadOn:null});});
  return()=>{live=false;};
 },[term,active,generation]);
 const current=result?.term===term?result:null;
 return{learning:current?.learning??null,sourceReadOn:current?.sourceReadOn??null,error:current?.error??false,retry:()=>{setResult(null);setGeneration(n=>n+1);}};
}
