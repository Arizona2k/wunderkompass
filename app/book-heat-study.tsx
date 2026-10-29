import {useEffect,useRef,useState} from 'react';
import {useBookHeat} from './book-heat-data';
import {LearningDetails,LearningStatus} from './learning-components';
import {BookStudyBody,useBookStudyReturn} from './book-study';
import {BookHeatFigure} from './book-heat-figure';

export function BookHeat({term,onTopic}:{term:string;onTopic?:(id:string)=>void}){
 const details=useRef<HTMLDetailsElement|null>(null),retryFocus=useRef(false);
 const [active,setActive]=useState(false),{learning,error,retry,sourceReadOn}=useBookHeat(term,active);
 useBookStudyReturn(learning!==null,active,details);
 useEffect(()=>{if(!learning)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)details.current?.querySelector('summary')?.focus({preventScroll:true});}},[learning,term]);
 return <LearningDetails className="book-study" summary="Weiterforschen · freiwillig" data-book-heat-study={term} data-history-disclosure={'book-heat-study-'+term} onToggle={e=>{details.current=e.currentTarget;if(e.currentTarget.open)setActive(true);}}>
  {learning&&sourceReadOn?<BookStudyBody key={term} term={term} learning={learning} sourceReadOn={sourceReadOn} onTopic={onTopic}><BookHeatFigure kind={learning.figure}/></BookStudyBody>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;retry();}}>Vertiefung erneut laden</button>:undefined}>{error?'Diese Vertiefung konnte nicht sicher geladen werden. Erklärung, Pass und Notizen bleiben erhalten.':'Deine freiwillige Vertiefung wird geladen …'}</LearningStatus>}
 </LearningDetails>;
}
