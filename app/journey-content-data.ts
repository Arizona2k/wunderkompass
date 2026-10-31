import dataURL from './journey-content.json?url';
import {validateJourneyContent} from './journey-content-validation.mjs';
import {JOURNEYS,type Journey} from './learning-overview';
import SOURCES from './journey-sources.json';
let saved:Journey[]|null=null,pending:Promise<Journey[]>|null=null;
export const currentJourneyContent=()=>saved;
export function loadJourneyContent():Promise<Journey[]>{
 if(saved)return Promise.resolve(saved);
 if(!pending)pending=(async()=>{const response=await fetch(dataURL,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Reisetexte nicht erreichbar');const next=validateJourneyContent(await response.json(),JOURNEYS,SOURCES) as Journey[];saved=next;return next;})().catch(error=>{pending=null;throw error;});
 return pending;
}
