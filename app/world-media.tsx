'use client';
import {useEffect,useRef,useState} from 'react';
import type {WorldPhotoData as Photo} from './world-types';
import PHOTOS from './world-photo-core.json';
import ids from './world-photo-ids.json';
import dataURL from './world-photos.json?url&no-inline';
import integrity from './world-photo-integrity.json';
import {fetchLimitedBytes,verifiedContentJSON} from './verified-content.mjs';

// The four gateway pictures and two journey pictures keep their full immediate credits.
export const WORLD_PHOTOS=PHOTOS as Record<string,Photo>;
let saved:Record<string,Photo>|null=null,pending:Promise<Record<string,Photo>>|null=null;
function load(){
 if(saved)return Promise.resolve(saved);
 if(!pending)pending=(async()=>{
  const bytes=await fetchLimitedBytes(dataURL,integrity.bytes,{signal:AbortSignal.timeout(15600)});
  const data=await verifiedContentJSON(bytes,integrity);
  if(!data||Array.isArray(data)||Object.keys(data).length!==ids.length||!ids.every(id=>data[id]?.id===id))throw Error('Unvollständige Bildnachweise');
  saved=data;return data as Record<string,Photo>;
 })().catch(error=>{pending=null;throw error;});
 return pending;
}
/** credit=false requires full attribution on this page, e.g. WorldGateways or DiscoveryIntro. */
export default function WorldPhoto(props:{id:string;compact?:boolean;credit?:boolean;eager?:boolean;creditDisclosure?:boolean;historyKey?:string;immediatePhoto?:Photo}){
 return ids.includes(props.id)?<PhotoContent key={props.id} {...props}/>:null;
}
function PhotoContent({id,compact=false,credit=true,eager=false,creditDisclosure=false,historyKey,immediatePhoto}:{id:string;compact?:boolean;credit?:boolean;eager?:boolean;creditDisclosure?:boolean;historyKey?:string;immediatePhoto?:Photo}){
 const [loaded,setLoaded]=useState<Photo|null>(saved?.[id]??null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0),[failed,setFailed]=useState(false);
 const immediate=immediatePhoto?.id===id?immediatePhoto:undefined;
 const p=immediate??WORLD_PHOTOS[id]??loaded,root=useRef<HTMLElement|null>(null),retryFocus=useRef(false);
 useEffect(()=>{if(p&&retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body){root.current?.setAttribute("tabindex","-1");root.current?.focus({preventScroll:true});}}},[p]);
 useEffect(()=>{if(immediate||WORLD_PHOTOS[id])return;let live=true;load().then(data=>{if(live){setLoaded(data[id]);setError(false);}}).catch(()=>{if(live)setError(true);});return()=>{live=false;};},[id,attempt,immediate]);
 if(!p)return <figure className={'world-photo '+(compact?'compact':'')} style={{position:'relative'}} ref={root}>
  <img alt="" aria-hidden="true" style={{visibility:'hidden'}}/>
  <div style={{position:'absolute',inset:8}} role="status">{error?<><p>Die Bildnachweise konnten nicht sicher geladen werden.</p>{compact?<span>Du kannst die Wissenskarte trotzdem öffnen.</span>:<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;setAttempt(n=>n+1);}}>Bild erneut laden</button>}</>:'Bildnachweise werden geladen …'}</div>
 </figure>;
 return <figure className={'world-photo '+(compact?'compact ':'')+(p.fit==='contain'?'media-contain':'')} ref={root}>
  {failed?<p className="photo-unavailable">Das Bild konnte gerade nicht geladen werden. Die Entdeckerkarte funktioniert trotzdem.</p>:<img src={p.src} alt={compact?'':p.alt_de} width={p.width} height={p.height} loading={eager?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)}/>}
  {credit&&(creditDisclosure?<figcaption className="photo-disclosure"><details data-history-disclosure={historyKey??"photo-"+id}><summary>{p.label??"Foto"} & Quelle</summary>{p.caption&&<p className="photo-caption">{p.caption}</p>}<p>{p.alt_de}</p><p>{p.author} · <a href={p.license_url} target="_blank" rel="noreferrer">{p.license}</a> · <a href={p.source_page_url} target="_blank" rel="noreferrer">Original und Rechte</a></p><p>{p.transformations_de}</p></details></figcaption>:compact?<figcaption className="compact-credit">{p.label==='Darstellung'&&'Spätere Darstellung · '}{p.author} · {p.license}</figcaption>:<figcaption>{p.caption&&<p className="photo-caption">{p.caption}</p>}{p.label??'Foto'}: {p.author} · <a href={p.license_url} target="_blank" rel="noreferrer">{p.license}</a><details><summary>Bildquelle & Bearbeitung</summary><a href={p.source_page_url} target="_blank" rel="noreferrer">Original und Rechte</a><p>{p.transformations_de}</p></details></figcaption>)}
 </figure>;
}
