import {lazy,Suspense,useRef,useState} from 'react';
import {LearningDetails,LearningStatus} from './learning-components';
import LearningBoundary from './learning-boundary';
import {useBookStudyReturn} from './book-study-return';
import ids from './nature-place-link-ids.json';
const ConnectionsBody=lazy(()=>import('./nature-connections-body'));
export function NatureConnections({id}:{id:string}){
 const [active,setActive]=useState(false),[ready,setReady]=useState(false),details=useRef<HTMLDetailsElement|null>(null);
 useBookStudyReturn(ready,active,details);
 if(!ids.includes(id))return null;
 return <LearningDetails className="nature-connections" summary="An einem anderen Naturort weiterdenken" data-history-disclosure={'nature-incoming-'+id} onToggle={event=>{details.current=event.currentTarget;if(event.currentTarget.open)setActive(true);}}>
  {active&&<LearningBoundary name="Diese Verbindungen"><Suspense fallback={<LearningStatus>Die Verbindungen werden geladen …</LearningStatus>}><ConnectionsBody id={id} onReady={setReady}/></Suspense></LearningBoundary>}
 </LearningDetails>;
}
