import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import {useBookEcology} from './book-ecology-data';
import {LearningDetails,LearningStatus} from './learning-components';
import {BookStudyBody,useBookStudyReturn} from './book-study';
const BookEcologyFigure=lazy(()=>import('./book-ecology-figure'));

export function BookEcology({term,onTopic}:{term:string;onTopic?:(id:string)=>void}){
 const details=useRef<HTMLDetailsElement|null>(null),retryFocus=useRef(false);
 const [active,setActive]=useState(false),{learning,error,retry,sourceReadOn}=useBookEcology(term,active);
 useBookStudyReturn(learning!==null,active,details);
 useEffect(()=>{if(!learning)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)details.current?.querySelector('summary')?.focus({preventScroll:true});}},[learning,term]);
 return <LearningDetails className="book-study" summary="Weiterforschen · freiwillig" data-book-ecology-study={term} data-history-disclosure={'book-ecology-study-'+term} onToggle={e=>{details.current=e.currentTarget;if(e.currentTarget.open)setActive(true);}}>
  {learning&&sourceReadOn?<BookStudyBody key={term} term={term} learning={learning} sourceReadOn={sourceReadOn} onTopic={onTopic}><Suspense fallback={<LearningStatus tone="loading">Die eigene Zeichnung wird geladen …</LearningStatus>}><BookEcologyFigure kind={learning.figure}/></Suspense></BookStudyBody>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;retry();}}>Vertiefung erneut laden</button>:undefined}>{error?'Diese Vertiefung konnte nicht sicher geladen werden. Erklärung, Pass und Notizen bleiben erhalten.':'Deine freiwillige Vertiefung wird geladen …'}</LearningStatus>}
 </LearningDetails>;
}
