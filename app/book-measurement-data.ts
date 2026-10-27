import {useEffect,useState} from 'react';
import dataURL from './book-measurement-content.json?url&no-inline';
import integrity from './book-measurement-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';
import {MEASUREMENT_TERMS,validateMeasurementPack} from './book-measurement-validation.mjs';

export type MeasurementLearning={
 symbol:string;quantity:string;starter:string;deeper:string;observe:string;benefit:string;connection:string;topic:string;
 model?:'length'|'duration'|'temperature';illustration?:'entities';
 question:{prompt:string;answers:string[];correct:number;hint:string;why:string;wrongReasons:string[]};
 sources:{url:string;title:string;anchor:string;updatedOn:string|null;checkedOn:string}[];
 relatedWords?:{term:string;reason:string}[];relatedQuestions?:{question:string;reason:string}[];
};
type Pack={schemaVersion:1;sourceReadOn:string;words:Record<string,[string,string,string]>;learning:Record<string,MeasurementLearning>};
let loaded:Pack|null=null,pending:Promise<Pack>|null=null;
export const hasBookMeasurement=(term:string)=>MEASUREMENT_TERMS.includes(term);
function load(){
 if(loaded)return Promise.resolve(loaded);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(12000)});
  const pack=validateMeasurementPack(await verifiedContentJSON(bytes,integrity)) as Pack;
  loaded=pack;return pack;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookMeasurement(term:string,active:boolean){
 const [generation,setGeneration]=useState(0),[result,setResult]=useState<{term:string;learning:MeasurementLearning|null;error:boolean;sourceReadOn:string|null}|null>(null);
 useEffect(()=>{
  if(!active||!hasBookMeasurement(term))return;
  let live=true;
  // A shared immutable asset may finish after its card closes; closing never
  // cancels another card's request or changes any personal learning data.
  load().then(pack=>{if(live)setResult({term,learning:pack.learning[term],error:false,sourceReadOn:pack.sourceReadOn});}).catch(()=>{if(live)setResult({term,learning:null,error:true,sourceReadOn:null});});
  return()=>{live=false;};
 },[term,active,generation]);
 const current=result?.term===term?result:null;
 return {learning:current?.learning??null,sourceReadOn:current?.sourceReadOn??null,error:current?.error??false,retry:()=>{setResult(null);setGeneration(value=>value+1);}};
}
