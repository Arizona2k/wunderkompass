import {useEffect,useState} from 'react';
import dataURL from './book-digital-content.json?url&no-inline';
import integrity from './book-digital-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';
import {DIGITAL_WORDS,DIGITAL_QUESTIONS,validateDigitalPack} from './book-digital-validation.mjs';
import type {BookLearning} from './book-study';
import type {DigitalFigureKind} from './book-digital-figure';

export type DigitalLearning=BookLearning&{figure:DigitalFigureKind};
type Pack={schemaVersion:1;sourceReadOn:string;words:Record<string,[string,string,string]>;learning:Record<string,DigitalLearning>;why:Record<string,[string,string]>;whyLearning:Record<string,DigitalLearning>};
let loaded:Pack|null=null,pending:Promise<Pack>|null=null;
export const hasBookDigital=(term:string)=>DIGITAL_WORDS.includes(term)||DIGITAL_QUESTIONS.includes(term);
function load(){
 if(loaded)return Promise.resolve(loaded);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(12000)});
  const pack=validateDigitalPack(await verifiedContentJSON(bytes,integrity))as Pack;
  loaded=pack;return pack;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookDigital(term:string,active:boolean){
 const [generation,setGeneration]=useState(0),[result,setResult]=useState<{term:string;learning:DigitalLearning|null;error:boolean;sourceReadOn:string|null}|null>(null);
 useEffect(()=>{
  if(!active||!hasBookDigital(term))return;
  let live=true;
  // Closing one card never cancels another reader's immutable content request.
  load().then(pack=>{if(live)setResult({term,learning:pack.learning[term]??pack.whyLearning[term],error:false,sourceReadOn:pack.sourceReadOn});}).catch(()=>{if(live)setResult({term,learning:null,error:true,sourceReadOn:null});});
  return()=>{live=false;};
 },[term,active,generation]);
 const current=result?.term===term?result:null;
 return{learning:current?.learning??null,sourceReadOn:current?.sourceReadOn??null,error:current?.error??false,retry:()=>{setResult(null);setGeneration(n=>n+1);}};
}
