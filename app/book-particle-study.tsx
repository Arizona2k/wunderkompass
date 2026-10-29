import {useEffect,useRef,useState} from 'react';
import {useBookParticle} from './book-particle-data';
import {LearningDetails,LearningStatus} from './learning-components';
import {BookStudyBody,useBookStudyReturn} from './book-study';
import {BookParticleFigure} from './book-particle-figure';

export function BookParticle({term,onTopic}:{term:string;onTopic?:(id:string)=>void}){
 const details=useRef<HTMLDetailsElement|null>(null),retryFocus=useRef(false);
 const [active,setActive]=useState(false),{learning,error,retry,sourceReadOn}=useBookParticle(term,active);
 useBookStudyReturn(learning!==null,active,details);
 useEffect(()=>{if(!learning)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)details.current?.querySelector('summary')?.focus({preventScroll:true});}},[learning,term]);
 return <LearningDetails className="book-study" summary="Weiterforschen · freiwillig" data-book-particle-study={term} data-history-disclosure={'book-particle-study-'+term} onToggle={e=>{details.current=e.currentTarget;if(e.currentTarget.open)setActive(true);}}>
  {learning&&sourceReadOn?<BookStudyBody key={term} term={term} learning={learning} sourceReadOn={sourceReadOn} onTopic={onTopic}><BookParticleFigure kind={learning.figure} term={term}/></BookStudyBody>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;retry();}}>Vertiefung erneut laden</button>:undefined}>{error?'Diese Vertiefung konnte nicht sicher geladen werden. Erklärung, Pass und Notizen bleiben erhalten.':'Deine freiwillige Vertiefung wird geladen …'}</LearningStatus>}
 </LearningDetails>;
}
