import {useEffect,useRef,useState} from 'react';
import {useBookWater} from './book-water-data';
import {restoreRouteView} from './hash-route';
import {LearningDetails,LearningStatus} from './learning-components';
import {BookStudyBody} from './book-study';
import {BookWaterFigure} from './book-water-figure';

export function BookWater({term,onTopic}:{term:string;onTopic?:(id:string)=>void}){
 const details=useRef<HTMLDetailsElement|null>(null),retryFocus=useRef(false);
 const [active,setActive]=useState(false),{learning,error,retry,sourceReadOn}=useBookWater(term,active);
 useEffect(()=>{if(!learning)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)details.current?.querySelector('summary')?.focus({preventScroll:true});}else if(history.state?.wunderFocus)restoreRouteView(location.hash.slice(1));},[learning]);
 return <LearningDetails className="book-study" summary="Weiterforschen · freiwillig" data-book-water-study={term} data-history-disclosure={'book-water-study-'+term} onToggle={e=>{details.current=e.currentTarget;if(e.currentTarget.open)setActive(true);}}>
  {learning&&sourceReadOn?<BookStudyBody key={term} term={term} learning={learning} sourceReadOn={sourceReadOn} onTopic={onTopic}><BookWaterFigure kind={learning.figure} term={term}/></BookStudyBody>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;retry();}}>Vertiefung erneut laden</button>:undefined}>{error?'Diese Vertiefung konnte nicht sicher geladen werden. Erklärung, Pass und Notizen bleiben erhalten.':'Deine freiwillige Vertiefung wird geladen …'}</LearningStatus>}
 </LearningDetails>;
}
