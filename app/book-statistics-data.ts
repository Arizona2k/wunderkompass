import {useEffect,useState} from 'react';
import dataURL from './book-statistics-content.json?url&no-inline';
import integrity from './book-statistics-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';
import {STATISTICS_WORDS,STATISTICS_QUESTIONS,validateStatisticsPack} from './book-statistics-validation.mjs';
import type {BookLearning} from './book-study';
import type {StatisticsFigureKind} from './book-statistics-figure';

export type StatisticsLearning=BookLearning&{figure:StatisticsFigureKind};
type Pack={schemaVersion:1;sourceReadOn:string;words:Record<string,[string,string,string]>;learning:Record<string,StatisticsLearning>;why:Record<string,[string,string]>;whyLearning:Record<string,StatisticsLearning>};
let loaded:Pack|null=null,pending:Promise<Pack>|null=null;
export const hasBookStatistics=(term:string)=>STATISTICS_WORDS.includes(term)||STATISTICS_QUESTIONS.includes(term);
function load(){
 if(loaded)return Promise.resolve(loaded);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(12000)});
  const pack=validateStatisticsPack(await verifiedContentJSON(bytes,integrity))as Pack;
  loaded=pack;return pack;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
export function useBookStatistics(term:string,active:boolean){
 const [generation,setStatisticsration]=useState(0),[result,setResult]=useState<{term:string;learning:StatisticsLearning|null;error:boolean;sourceReadOn:string|null}|null>(null);
 useEffect(()=>{
  if(!active||!hasBookStatistics(term))return;
  let live=true;
  // Closing one card never cancels another reader's immutable content request.
  load().then(pack=>{if(live)setResult({term,learning:pack.learning[term]??pack.whyLearning[term],error:false,sourceReadOn:pack.sourceReadOn});}).catch(()=>{if(live)setResult({term,learning:null,error:true,sourceReadOn:null});});
  return()=>{live=false;};
 },[term,active,generation]);
 const current=result?.term===term?result:null;
 return{learning:current?.learning??null,sourceReadOn:current?.sourceReadOn??null,error:current?.error??false,retry:()=>{setResult(null);setStatisticsration(n=>n+1);}};
}
