import {useEffect,useRef,useState} from 'react';
import dataURL from './book-study-why.json?url&no-inline';
import integrity from './book-why-integrity.json' with {type:'json'};
import questions from './book-why-index.json' with {type:'json'};
import words from './book-word-index.json' with {type:'json'};
import {WORLD_INDEX} from './world-index';
import {LAB_SEARCH} from './research-catalog';
import {readBookBytes,verifiedBookJSON} from './book-part-validation.mjs';
import {validateWhyLearning} from './why-learning-validation.mjs';
import {LearningDetails,LearningStatus} from './learning-components';
import {navigateHash,restoreRouteView} from './hash-route';
import type {BookSource} from './book-data';
import './book-study.css';
type WhyLearning={starter:string;deeper:string;observe:string;benefit:string;connection:string;topic?:string;lab?:string;word?:string;relatedWords:{term:string;reason:string}[];sources:BookSource[];sourceCoverage?:string};
let saved:Record<string,WhyLearning>|null=null,pending:Promise<Record<string,WhyLearning>>|null=null;
async function load(){if(saved)return saved;if(!pending)pending=(async()=>{const response=await fetch(dataURL,{signal:AbortSignal.timeout(12000)});const data=validateWhyLearning(await verifiedBookJSON(await readBookBytes(response,integrity.bytes),integrity),{questions,words,topics:WORLD_INDEX.map(t=>t.id),labs:LAB_SEARCH.map(l=>l.id)}) as Record<string,WhyLearning>;saved=data;return data;})().catch(error=>{pending=null;throw error;});return pending;}
export default function WhyStudy({question}:{question:string}){
 const [active,setActive]=useState(false),[learning,setLearning]=useState<WhyLearning|null>(saved?.[question]??null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0),root=useRef<HTMLDetailsElement|null>(null),retryFocus=useRef(false);
 useEffect(()=>{if(!active)return;let live=true;load().then(data=>{if(live){setLearning(data[question]);setError(false);}}).catch(()=>{if(live)setError(true);});return()=>{live=false;};},[active,attempt,question]);
 useEffect(()=>{if(!learning)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)root.current?.querySelector('summary')?.focus({preventScroll:true});}else{const key=history.state?.wunderFocus;if(key==='why-context-'+question||typeof key==='string'&&key.startsWith('why-word-'+question+'-'))restoreRouteView(location.hash.slice(1));}},[learning,question]);
 const topic=WORLD_INDEX.find(t=>t.id===learning?.topic),lab=LAB_SEARCH.find(l=>l.id===learning?.lab),route=topic?'world/topic/'+topic.id:lab?'labs/'+lab.id:learning?.word?'book/words/'+encodeURIComponent(learning.word):null;
 return <LearningDetails className="book-study why-study" summary="Diese Frage weiter erforschen · freiwillig" data-history-disclosure={'why-study-'+question} onToggle={e=>{root.current=e.currentTarget;if(e.currentTarget.open)setActive(true);}}>{learning?<>
 <p>{learning.benefit}</p>
 <LearningDetails summary="Ganz einfach · etwa 6–8 Jahre" data-history-disclosure={'why-starter-'+question}><p>{learning.starter}</p></LearningDetails>
 <LearningDetails summary="Noch genauer · etwa 12–14 Jahre" data-history-disclosure={'why-deeper-'+question}><p>{learning.deeper}</p></LearningDetails>
 <LearningDetails summary="Selbst beobachten und erklären"><p>{learning.observe}</p></LearningDetails>
 {route&&<div className="book-connection"><p>{learning.connection}</p><a className="knowledge-link book-topic-link" data-route-focus={'why-context-'+question} href={'#'+route} onClick={e=>{e.preventDefault();navigateHash(route);}}>Mit „{topic?.title??lab?.name??learning.word}“ weiterforschen →</a></div>}
 {learning.relatedWords.length>0&&<LearningDetails summary="Passende Wörter nachlesen" data-history-disclosure={'why-related-'+question}><ul>{learning.relatedWords.map(link=><li key={link.term}><p>{link.reason}</p><a className="book-topic-link" href={'#book/words/'+encodeURIComponent(link.term)} data-route-focus={'why-word-'+question+'-'+link.term} onClick={e=>{e.preventDefault();navigateHash('book/words/'+encodeURIComponent(link.term));}}>„{link.term}“ im Wissensbuch öffnen →</a></li>)}</ul></LearningDetails>}
 <LearningDetails summary="Quellen und Prüfstand"><p>Mit KI-Unterstützung erstellt. Codex hat ausgewählte Belegstellen abgeglichen; eine unabhängige Fach- und Kinderprüfung steht noch aus. Die Quellengeber haben diese Erklärung nicht freigegeben.</p>{learning.sourceCoverage&&<p className="small-note">{learning.sourceCoverage}</p>}<ul>{learning.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a><span> · Belegstellenabgleich {new Date(s.checkedOn+'T12:00:00Z').toLocaleDateString('de-DE')}{s.updatedOn?' · Quellenstand '+new Date(s.updatedOn+'T12:00:00Z').toLocaleDateString('de-DE'):''}</span></li>)}</ul><p className="small-note">Eigene Erklärungen und Vergleiche. Keine übernommenen Fotos, Texte oder Versuchsanleitungen.</p></LearningDetails>
 </>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;setAttempt(n=>n+1);}}>Warum-Erklärung erneut laden</button>:undefined}>{error?'Diese Erklärung konnte nicht sicher geladen werden. Die kurze Antwort und dein Pass bleiben verfügbar.':'Deine freiwillige Erklärung wird geladen …'}</LearningStatus>}</LearningDetails>;
}
