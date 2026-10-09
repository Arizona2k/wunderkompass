import {ArrowRight} from 'lucide-react';
import {WORLD_CATEGORIES,WORLD_INDEX} from './world-index';
import {WORLD_ICONS} from './world-icons';
import WorldPhoto from './world-media';
import DiscoveryVisual from './discovery-visual';
import type {WorldCategory} from './world-types';

export default function WorldGateways({compact=false,onCategory}:{compact?:boolean;onCategory:(id:WorldCategory)=>void}){
 return <div className={'world-choices'+(compact?' gateway-compact':'')}>{WORLD_CATEGORIES.map(c=>{
  const Icon=WORLD_ICONS[c.icon as keyof typeof WORLD_ICONS];
  const pic=({animals:'african-elephant',history:'giza-pyramids',people:'marie-curie',buildings:'golden-gate-bridge'} as Record<string,string>)[c.id];
  return <button className={'world-choice world-'+c.id} key={c.id} aria-label={c.title} onClick={()=>onCategory(c.id)}>
   {pic?<WorldPhoto compact id={pic}/>:<figure className="gateway-art"><DiscoveryVisual variant={c.id==='science'?'space':'invention'}/><figcaption>Künstlerische Illustration · nicht maßstabsgetreu</figcaption></figure>}
   <div><span className="category-pill"><Icon size={16}/> {WORLD_INDEX.filter(t=>t.category===c.id).length} Karten</span><h3>{c.title}</h3>{!compact&&<p>{c.intro}</p>}<span className="world-enter">Entdecken <ArrowRight size={17}/></span></div>
  </button>;
 })}</div>;
}
