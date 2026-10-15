import {useEffect,useRef,useState} from 'react';
import {LearningDetails,LearningStatus} from './learning-components';
import {navigateHash,restoreRouteView} from './hash-route';
import {useNatureStudy,type NatureLearning} from './nature-study-data';
import {WORLD_INDEX} from './world-index';
import {LAB_SEARCH} from './research-catalog';
import NatureProcess from './nature-process';
const date=(value:string)=>new Date(value+'T12:00:00Z').toLocaleDateString('de-DE');
export default function NatureStudy({id,name,direct=false}:{id:string;name:string;direct?:boolean}){
 const root=useRef<HTMLDivElement|null>(null),retryFocus=useRef(false),[active,setActive]=useState(direct),{data,error,retry}=useNatureStudy(id,active);
 useEffect(()=>{if(direct){const details=root.current?.querySelector('details');if(details)details.open=true;}},[direct]);
 useEffect(()=>{if(!data)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)root.current?.querySelector('summary')?.focus({preventScroll:true});}else if(history.state?.wunderFocus)restoreRouteView(location.hash.slice(1));},[data]);
 return <div ref={root}><LearningDetails className="book-study nature-study" summary="Weiterforschen · freiwillig" data-nature-study={id} data-history-disclosure={'nature-study-'+id} onToggle={e=>{if(e.currentTarget.open)setActive(true);}}>{data?<NatureExplanation key={id} id={id} name={name} data={data}/>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;retry();}}>Naturerklärung erneut laden</button>:undefined}>{error?'Diese Naturerklärung konnte nicht sicher geladen werden. Der kurze Eintrag und dein Entdeckerpass bleiben erhalten.':'Deine freiwillige Naturerklärung wird geladen …'}</LearningStatus>}</LearningDetails></div>;
}
function NatureExplanation({id,name,data}:{id:string;name:string;data:NatureLearning}){
 const[answer,setAnswer]=useState<number|null>(null),q=data.question,c=data.connection,label=c.kind==='word'?c.target:c.kind==='topic'?WORLD_INDEX.find(t=>t.id===c.target)?.title:LAB_SEARCH.find(l=>l.id===c.target)?.name,href=c.kind==='word'?'book/words/'+encodeURIComponent(c.target):c.kind==='topic'?'world/topic/'+c.target:'labs/'+c.target;
 return <>
  <p className="nature-benefit"><strong>Warum hilft dir das?</strong> {data.benefit}</p>
  <LearningDetails summary="Ganz einfach · etwa 6–8 Jahre" data-history-disclosure={'nature-starter-'+id}><p>{data.starter}</p></LearningDetails>
  <LearningDetails summary="Noch genauer · etwa 12–14 Jahre" data-history-disclosure={'nature-deeper-'+id}><p>{data.deeper}</p></LearningDetails>
  <LearningDetails summary="Selbst beobachten und erklären · freiwillig" data-history-disclosure={'nature-observe-'+id}><p>{data.observe}</p></LearningDetails>
  <NatureProcess key={id} id={id}/>
  <section className="book-thinking" aria-label={'Denkfrage zu '+name}><h4>{q.prompt}</h4><LearningDetails summary="Ein Hinweis, wenn du möchtest"><p>{q.hint}</p></LearningDetails><div className="quiz-answers">{q.answers.map((choice,i)=><button className="quiz-answer" key={choice} aria-pressed={answer===i} onClick={()=>setAnswer(i)}>{choice}</button>)}</div>{answer!==null&&<p className="book-feedback" role="status">{answer===q.correct?q.why:q.wrongReasons[answer]}</p>}</section>
  <section className="nature-connection"><h4>Warum hängt das zusammen?</h4><p>{c.reason}</p><a className="book-topic-link" data-route-focus={'nature-link-'+id} href={'#'+href} onClick={e=>{e.preventDefault();navigateHash(href);}}>{label} weiterentdecken →</a></section>
  <LearningDetails summary="Quellen und Prüfstand" data-history-disclosure={'nature-sources-'+id}><p>Mit KI-Unterstützung erstellt. Codex hat ausgewählte Belegstellen mit der Erklärung abgeglichen. Eine unabhängige Fachabnahme steht noch aus. Die Quellengeber haben diese WunderKompass-Erklärung nicht geprüft oder freigegeben.</p><ul className="nature-source-list">{data.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a><p>Belegstelle: {s.anchor}. Abgleich am {date(s.checkedOn)}{s.updatedOn?' · Quellenstand '+date(s.updatedOn):''}.</p><p>{s.scope}</p></li>)}</ul>{data.mapPoint&&<p>Ortsmarker: <a href={data.mapPoint.source} target="_blank" rel="noreferrer">Wikidata, strukturierte Ortsangabe</a> · {data.mapPoint.license}. {data.mapPoint.scope}. Abgleich am {date(data.mapPoint.checkedOn)}.</p>}<p>Eigene Beispiele; Kartenpunkte sind Orientierungshilfen und keine vermessenen Grenzen oder sicheren Reisewege. Externe Quellen brauchen eine Internetverbindung.</p></LearningDetails>
 </>;
}
