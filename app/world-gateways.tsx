import {ArrowRight} from 'lucide-react';
import {WORLD_CATEGORIES,WORLD_INDEX} from './world-index';
import {WORLD_ICONS} from './world-icons';
import WorldPhoto,{WORLD_PHOTOS} from './world-media';
import DiscoveryVisual from './discovery-visual';
import type {WorldCategory} from './world-types';

const GATEWAY_PHOTOS:Record<string,string>={animals:'african-elephant',history:'giza-pyramids',people:'marie-curie',buildings:'golden-gate-bridge'};

export default function WorldGateways({compact=false,separateCredits=false,onCategory}:{compact?:boolean;separateCredits?:boolean;onCategory:(id:WorldCategory)=>void}){
 return <><div className={'world-choices'+(compact?' gateway-compact':'')}>{WORLD_CATEGORIES.map(c=>{
  const Icon=WORLD_ICONS[c.icon as keyof typeof WORLD_ICONS];
  const pic=GATEWAY_PHOTOS[c.id];
  return <button className={'world-choice world-'+c.id} key={c.id} data-route-focus={(compact?"home-world-":"world-category-")+c.id} aria-label={c.title} onClick={()=>onCategory(c.id)}>
   {pic?<WorldPhoto compact credit={!separateCredits} id={pic}/>:<figure className="gateway-art"><DiscoveryVisual variant={c.id==='science'?'space':'invention'}/>{!separateCredits&&<figcaption>Künstlerische Illustration · nicht maßstabsgetreu</figcaption>}</figure>}
   <div><span className="category-pill"><Icon size={16}/> {WORLD_INDEX.filter(t=>t.category===c.id).length} Karten</span><h3>{c.title}</h3>{!compact&&<p>{c.intro}</p>}<span className="world-enter">Entdecken <ArrowRight size={17}/></span></div>
  </button>;
 })}</div>{separateCredits&&<details data-history-disclosure="home-credits" className="gateway-credits"><summary>Bildnachweise der Welten</summary><ul>{Object.values(GATEWAY_PHOTOS).map(id=>{const p=WORLD_PHOTOS[id];return <li key={id}><span>{p.alt_de}</span><span>{p.author} · <a href={p.license_url} target="_blank" rel="noreferrer">{p.license}</a> · <a href={p.source_page_url} target="_blank" rel="noreferrer">Original und Rechte</a></span><span>{p.transformations_de}</span></li>;})}<li>Erfindungen und Wissenschaft & Weltall: eigene künstlerische Illustrationen, nicht maßstabsgetreu.</li></ul></details>}</>;
}
