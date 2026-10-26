'use client';
import {useId} from 'react';
import MEDIA from './people-illustrations.json';
import './people-evidence.css';
import {CoreHypothesisDrawing,InsectSequenceDrawing} from './people-observation-drawings';
const bone='M57 75C43 55 29 69 37 83C23 94 42 108 56 94L178 94C194 109 211 95 200 83C213 67 192 55 178 75Z';
export const hasPeopleIllustration=(id:string)=>MEDIA.entries.some(e=>e.id===id);
export default function PeopleIllustration({id,compact=false}:{id:string;compact?:boolean}){
 const media=MEDIA.entries.find(e=>e.id===id);
 if(!media)return null;
 return <figure className={'topic-illustration people-illustration '+(compact?'compact':'')}>
  {media.kind==='fossil-evidence'?<FossilDrawing label={media.alt}/>:media.kind==='light-to-eye'?<><LightDrawing label={media.alt}/>{!compact&&<div className="people-evidence-legend"><span>Lichtquelle</span><span>Gegenstand</span><span>Auge</span></div>}</>:media.kind==='insect-observation-series'?<InsectSequenceDrawing label={media.alt}/>:media.kind==='inner-core-evidence-comparison'?<CoreHypothesisDrawing label={media.alt}/>:null}
  <figcaption>{media.caption}</figcaption>
 </figure>;
}
export function FossilDrawing({color,label='Eigener erfundener Knochenumriss, kein Foto eines echten Fossils'}:{color?:string;label?:string}){
 return <svg viewBox="0 0 240 180" role="img" aria-label={label}>
  {color?<path data-reconstruction-skin d="M21 83L9 51L54 72Q98 37 166 65L223 59L215 78L185 87Q185 119 146 127L130 154L102 154L109 125Q68 120 47 99L13 120Z" fill={color} stroke="#275862" strokeWidth="3"/>:<rect x="15" y="25" width="210" height="120" rx="18" fill="#e1e7e4"/>}
  <path data-bone-outline d={bone} fill="#f5ead2" stroke="#275862" strokeWidth="3"/>
 </svg>;
}
export function LightDrawing({blocked=false,label}:{blocked?:boolean;label?:string}){
 const marker='people-light-'+useId().replaceAll(':','');
 return <svg className="people-evidence-light" viewBox="0 0 560 240" role="img" aria-label={label??(blocked?'Eigener Lichtweg: Quelle zum Gegenstand; der dargestellte Weg zum Auge endet am undurchlässigen Schirm':'Eigener Lichtweg: Quelle zum Gegenstand und vom Gegenstand zum Auge')}>
  <defs><marker id={marker} markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L9 4.5L0 9Z" fill="#b3542d"/></marker></defs>
  <circle cx="50" cy="120" r="25" fill="#e8bd68" stroke="#275862" strokeWidth="3"/><rect x="190" y="87" width="40" height="66" rx="7" fill="#6496a0" stroke="#275862" strokeWidth="3"/>
  <path data-light-path="to-object" d="M82 120H181" fill="none" stroke="#b3542d" strokeWidth="5" markerEnd={'url(#'+marker+')'}/>
  <path data-light-path={blocked?'to-screen':'to-eye'} d={blocked?'M240 120H308':'M240 120H426'} fill="none" stroke="#b3542d" strokeWidth="5" markerEnd={'url(#'+marker+')'}/>
  {blocked&&<rect data-blocking-screen x="316" y="48" width="14" height="144" rx="4" fill="#275862"/>}
  <path d="M434 120Q472 79 519 120Q472 161 434 120Z" fill="#fff" stroke="#275862" strokeWidth="4"/><circle cx="475" cy="120" r="15" fill="#438da8"/><circle cx="475" cy="120" r="7" fill="#183c45"/>
 </svg>;
}
