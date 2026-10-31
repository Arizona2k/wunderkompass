import dataURL from './journey-inquiries.json?url';
import {validateJourneyInquiries} from './journey-inquiry-validation.mjs';
import {JOURNEYS} from './learning-overview';
export type JourneyTask={prompt:string;answers:string[];correct:number;hint:string;why:string;wrong:string[]};
export type ChapterInquiry={id:string;journeyId:string;index:number;goal:string;scene:string;tasks:JourneyTask[];sequence?:string[]};
let finalHints:Record<string,string>={};
export const journeyFinalHint=(id:string)=>finalHints[id];
let saved:ChapterInquiry[]|null=null,pending:Promise<ChapterInquiry[]>|null=null;
export function currentJourneyInquiries(){return saved;}
export function loadJourneyInquiries(){
 if(saved)return Promise.resolve(saved);
 if(!pending)pending=(async()=>{
  const response=await fetch(dataURL,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Kapitelaufgaben nicht erreichbar.');
  const data=await response.json();saved=validateJourneyInquiries(data,JOURNEYS) as ChapterInquiry[];finalHints=data.finalHints;return saved;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
