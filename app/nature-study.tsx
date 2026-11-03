import {lazy,Suspense,useRef,useState} from 'react';
import {LearningDetails,LearningStatus} from './learning-components';
import LearningBoundary from './learning-boundary';
import {useBookStudyReturn} from './book-study-return';
import {hasNatureLearning} from './nature-data';
import './nature-study.css';
const NatureStudyBody=lazy(()=>import('./nature-study-body'));
export const hasNatureStudy=hasNatureLearning;
export function NatureStudy({id,headingLevel=3}:{id:string;headingLevel?:3|5}){
 const [active,setActive]=useState(false),[ready,setReady]=useState(false),details=useRef<HTMLDetailsElement|null>(null);
 useBookStudyReturn(ready,active,details);
 if(!hasNatureStudy(id))return null;
 return <LearningDetails summary="Mit Modell weiterforschen · freiwillig" className="nature-study" data-nature-study={id} data-history-disclosure={'nature-study-'+id} onToggle={event=>{details.current=event.currentTarget;if(event.currentTarget.open)setActive(true);}}>
  {active&&<LearningBoundary name="Diese Naturerklärung"><Suspense fallback={<LearningStatus>Die Naturerklärung wird geladen …</LearningStatus>}><NatureStudyBody key={id} id={id} headingLevel={headingLevel} onReady={setReady}/></Suspense></LearningBoundary>}
 </LearningDetails>;
}
