import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import {useBookRetained} from './book-retained-data';
import './book-retained-investigations.css';
import {LearningDetails,LearningStatus} from './learning-components';
import {BookStudyBody,useBookStudyReturn} from './book-study';
const BookRetainedFigure=lazy(()=>import('./book-retained-figure'));
const BookStatisticsFigure=lazy(()=>import('./book-statistics-figure'));
const ScienceInvestigation=lazy(()=>import('./science-investigation'));
const BookMixingFigure=lazy(()=>import('./book-mixing-figure'));

export function BookRetained({term,onTopic}:{term:string;onTopic?:(id:string)=>void}){
 const details=useRef<HTMLDetailsElement|null>(null),retryFocus=useRef(false);
 const [active,setActive]=useState(false),{learning,error,retry,sourceReadOn}=useBookRetained(term,active);
 useBookStudyReturn(learning!==null,active,details);
 useEffect(()=>{if(!learning)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)details.current?.querySelector('summary')?.focus({preventScroll:true});}},[learning,term]);
 return <LearningDetails className="book-study" summary="Weiterforschen · freiwillig" data-book-retained-study={term} data-history-disclosure={'book-retained-study-'+term} onToggle={e=>{details.current=e.currentTarget;if(e.currentTarget.open)setActive(true);}}>
  {learning&&sourceReadOn?<BookStudyBody key={term} term={term} learning={learning} sourceReadOn={sourceReadOn} onTopic={onTopic}><Suspense fallback={<LearningStatus tone="loading">Die eigene Zeichnung wird geladen …</LearningStatus>}>{learning.figure==='individual-motion-and-flow'||learning.figure==='three-illustrative-pigments'?<BookMixingFigure kind={learning.figure}/>:learning.figure==='pendulum-length-period-ratio'?<div data-book-retained-investigation="pendulum"><ScienceInvestigation kind="pendulum"/></div>:learning.figure==='normalized-driven-response'?<div data-book-retained-investigation="resonance"><ScienceInvestigation kind="resonance"/><p className="measurement-limit">Die gezeichnete Wellenlinie ist nur ein Höhenvergleich ohne Zeitachse. Ihre fest gezeichneten Bögen sind keine Messung einer Frequenz oder eines tatsächlichen zeitlichen Verlaufs. Im Faktor 0,3 · r bleibt 0,3 bei allen Vergleichen fest; r ist das Verhältnis der Antriebsfrequenz zur Eigenfrequenz.</p></div>:learning.figure==='plan-scale'?<BookStatisticsFigure kind="plan-scale"/>:<BookRetainedFigure kind={learning.figure}/>}</Suspense></BookStudyBody>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;retry();}}>Vertiefung erneut laden</button>:undefined}>{error?'Diese Vertiefung konnte nicht sicher geladen werden. Erklärung, Pass und Notizen bleiben erhalten.':'Deine freiwillige Vertiefung wird geladen …'}</LearningStatus>}
 </LearningDetails>;
}
