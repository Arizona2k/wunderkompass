import {useEffect,useRef,useState} from 'react';
import INDEX from './book-topic-index.json' with {type:'json'};
import WORDS from './book-word-index.json' with {type:'json'};
import {readBookBytes,validateBookTopicPart} from './book-part-validation.mjs';
import {LearningDetails,LearningStatus} from './learning-components';
import {navigateHash,restoreRouteView} from './hash-route';
import './book-study.css';
const files=import.meta.glob('./book-topic-parts/*.json',{eager:true,query:'?url&no-inline',import:'default'}) as unknown as Record<string,string>;
const index=INDEX as Record<string,{file:string;bytes:number;sha256:string}>;
type Links={term:string;reason:string}[];
const saved=new Map<string,Links>(),pending=new Map<string,Promise<Links>>();
async function load(topic:string){
 if(saved.has(topic))return saved.get(topic)!;
 if(pending.has(topic))return pending.get(topic)!;
 const request=(async()=>{
  const meta=index[topic],url=meta&&files['./book-topic-parts/'+meta.file];if(!url||!meta||meta.bytes>100000)throw Error('Unbekannte Buchverbindung');
  const response=await fetch(url,{signal:AbortSignal.timeout(12000)}),links=await validateBookTopicPart(await readBookBytes(response,meta.bytes),topic,meta,WORDS);
  saved.set(topic,links);return links as Links;
 })().finally(()=>pending.delete(topic));pending.set(topic,request);return request;
}
export default function BookTopicLinks({topic}:{topic:string}){return Object.hasOwn(index,topic)?<Connections key={topic} topic={topic}/>:null;}
function Connections({topic}:{topic:string}){
 const [active,setActive]=useState(false),[links,setLinks]=useState<Links|null>(saved.get(topic)??null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0),root=useRef<HTMLDetailsElement|null>(null),retryFocus=useRef(false);
 useEffect(()=>{if(!active)return;let live=true;load(topic).then(next=>{if(live){setLinks(next);setError(false);}}).catch(()=>{if(live)setError(true);});return()=>{live=false;};},[topic,active,attempt]);
 useEffect(()=>{if(!links)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)root.current?.querySelector('summary')?.focus({preventScroll:true});}else if(history.state?.wunderFocus)restoreRouteView(location.hash.slice(1));},[links]);
 return <LearningDetails className="book-world-links" summary="Dazu im Wissensbuch weiterdenken" data-history-disclosure={'topic-book-'+topic} onToggle={e=>{root.current=e.currentTarget;if(e.currentTarget.open)setActive(true);}}>
  {links?<ul>{links.map(link=><li key={link.term}><p>{link.reason}</p><a className="book-topic-link" href={'#book/words/'+encodeURIComponent(link.term)} data-route-focus={'topic-word-'+topic+'-'+link.term} onClick={e=>{e.preventDefault();navigateHash('book/words/'+encodeURIComponent(link.term));}}>„{link.term}“ im Wissensbuch öffnen →</a></li>)}</ul>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;setAttempt(n=>n+1);}}>Buchverbindungen erneut laden</button>:undefined}>{error?'Die Buchverbindungen konnten nicht sicher geladen werden. Die Wissenskarte bleibt verfügbar.':'Die passenden Wörter werden geladen …'}</LearningStatus>}
 </LearningDetails>;
}
