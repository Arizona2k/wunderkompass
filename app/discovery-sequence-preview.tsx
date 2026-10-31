import {JOURNEYS} from './learning-overview';
import {WORLD_INDEX,WORLD_ROUTES} from './world-index';
export default function DiscoverySequencePreview({journey,route,showTitle=true}:{journey?:string;route?:string;showTitle?:boolean}){
 const item=journey?JOURNEYS.find(j=>j.id===journey):WORLD_ROUTES.find(r=>r.id===route);if(!item)return null;
 const titles='steps'in item?item.steps.map(s=>s.title):item.topics.map(id=>WORLD_INDEX.find(t=>t.id===id)!.title);
 return <div className="discovery-sequence-preview">{showTitle&&<p>{item.title}</p>}<ol aria-label="Die ersten drei Stationen">{titles.slice(0,3).map((title,i)=><li key={title}><span aria-hidden="true">{i+1}</span>{title}</li>)}</ol><p>Die ersten drei von {titles.length} Stationen.</p></div>;
}
