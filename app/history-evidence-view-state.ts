'use client';
import {useLayoutEffect,useState} from 'react';
export type HistoryEvidenceView={level:0|1|2;variant:boolean;extra:boolean;compare:boolean;choice?:number};
const slot='wunderHistoryEvidence';
export function historyEvidenceViewFromState(state:unknown,id:string,fallback:HistoryEvidenceView):HistoryEvidenceView{
 const stored=state&&typeof state==='object'?(state as Record<string,unknown>)[slot]:null;
 if(!stored||typeof stored!=='object')return {...fallback};
 const v=stored as Record<string,unknown>;
 if(v.id!==id||![0,1,2].includes(v.level as number)||typeof v.variant!=='boolean'||typeof v.extra!=='boolean'||typeof v.compare!=='boolean')return {...fallback};
 const maximum=id==='history-polynesia'?3:id==='history-angkor'?6:id==='history-caral'?3:id==='history-nalanda'?1:id==='history-khipu'?35:id==='history-hattusha'?2:id==='history-paper'?2:id==='history-writing'?2:id==='history-printing'?3:-1;
 if(fallback.choice!==undefined&&(!Number.isInteger(v.choice)||typeof v.choice!=='number'||v.choice<0||v.choice>maximum))return {...fallback};
 return {level:v.level as 0|1|2,variant:v.variant,extra:v.extra,compare:v.compare,...(fallback.choice!==undefined?{choice:v.choice as number}:{})};
}
export function historyEvidenceStateWithView(state:unknown,id:string,view:HistoryEvidenceView){
 return {...(state&&typeof state==='object'?state:{}),[slot]:{id,...view}};
}
// Existing browser history is reading context, never learning progress or settings.
// One topic per history entry; no global cache, localStorage or extra save format.
export function useHistoryEvidenceView(id:string,fallback:HistoryEvidenceView){
 const [view,setView]=useState<HistoryEvidenceView>(()=>historyEvidenceViewFromState(typeof window==='undefined'?null:window.history.state,id,fallback));
 useLayoutEffect(()=>{
  if(window.location.hash!=='#world/topic/'+id)return;
  try{window.history.replaceState(historyEvidenceStateWithView(window.history.state,id,view),'',window.location.href);}catch{/* Optional reading context; local controls and the pass remain usable. */}
 },[id,view]);
 return [view,setView] as const;
}
