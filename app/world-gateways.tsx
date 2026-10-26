import {ArrowRight} from 'lucide-react';
import {WORLD_CATEGORIES,WORLD_INDEX} from './world-index';
import {WORLD_ICONS} from './world-icons';
import WorldPhoto,{WORLD_PHOTOS} from './world-media';
import BicycleDrawing from './bicycle-drawing';
import PlanetSizeFigure,{COMPARISON_PLANETS} from './planet-size-figure';
import type {WorldCategory} from './world-types';

const GATEWAY_PHOTOS:Record<string,string>={animals:'african-elephant',history:'giza-pyramids',people:'marie-curie',buildings:'golden-gate-bridge'};
export const WORLD_QUESTIONS:Record<WorldCategory,string>={animals:'Was verrät der Körperbau über die Lebensweise?',history:'Wie finden wir heraus, was früher geschah?',people:'Wie entstehen Entdeckungen und neue Ideen?',inventions:'Wie überträgt eine Fahrradkette die Bewegung?',buildings:'Wie tragen Bauwerke ihr eigenes Gewicht?',science:'Wie groß ist Jupiter im Vergleich zur Erde?'};

export default function WorldGateways({compact=false,separateCredits=false,onCategory}:{compact?:boolean;separateCredits?:boolean;onCategory:(id:WorldCategory)=>void}){
 return <><div className={'world-choices'+(compact?' gateway-compact':'')}>{WORLD_CATEGORIES.map(c=>{
  const Icon=WORLD_ICONS[c.icon as keyof typeof WORLD_ICONS];
  const pic=GATEWAY_PHOTOS[c.id];
  return <button className={'world-choice world-'+c.id} key={c.id} data-route-focus={(compact?"home-world-":"world-category-")+c.id} aria-label={c.title} onClick={event=>{event.currentTarget.focus({preventScroll:true});onCategory(c.id);}}>
   {pic?<WorldPhoto compact credit={!separateCredits} id={pic}/>:<figure className="gateway-art"><>{c.id==='science'?<PlanetSizeFigure planet={COMPARISON_PLANETS[4]} className="discovery-visual"/>:<svg className="discovery-visual" viewBox="0 0 600 340" role="img" aria-label="Prinzipzeichnung eines Fahrrads mit Pedalen, Kette und Hinterrad"><BicycleDrawing/></svg>}{!separateCredits&&<figcaption>Eigene Modellvorschau · mit KI-Unterstützung</figcaption>}</></figure>}
   <div><span className="category-pill"><Icon size={16}/> {WORLD_INDEX.filter(t=>t.category===c.id).length} Karten</span><h3>{c.title}</h3><p className="gateway-question">{WORLD_QUESTIONS[c.id]}</p>{!compact&&<p>{c.intro}</p>}<span className="world-enter">Entdecken <ArrowRight size={17}/></span></div>
  </button>;
 })}</div>{separateCredits&&<details data-history-disclosure="home-credits" className="gateway-credits"><summary>Bildnachweise der Welten</summary><ul>{Object.values(GATEWAY_PHOTOS).map(id=>{const p=WORLD_PHOTOS[id];return <li key={id}><span>{p.alt_de}</span><span>{p.author} · <a href={p.license_url} target="_blank" rel="noreferrer">{p.license}</a> · <a href={p.source_page_url} target="_blank" rel="noreferrer">Original und Rechte</a></span><span>{p.transformations_de}</span></li>;})}<li>Eigene Modellvorschauen mit KI-Unterstützung: Fahrrad mit Kettenantrieb als Prinzipzeichnung; Erde und Jupiter im selben Durchmessermaßstab (1 : 11,21), der Abstand hat keine Bedeutung. Dieselben Zeichnungen werden in den jeweiligen Lernmodellen verwendet. <a href="#world/topic/invention-bicycle">Fahrrad erklären</a> · <a href="#world/topic/science-solar-system">Planeten vergleichen</a></li></ul></details>}</>;
}
