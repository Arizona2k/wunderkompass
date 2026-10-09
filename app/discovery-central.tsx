import {useState} from 'react';
import {ArrowRight,Compass,Gamepad2,Globe2,Lightbulb,Search,Sparkles} from 'lucide-react';
import DiscoveryVisual from './discovery-visual';
import WorldGateways from './world-gateways';
import {WORLD_INDEX,WORLD_ROUTES} from './world-index';
import {KNOWLEDGE_CONNECTIONS} from './knowledge-connections';
import {DISCOVERY_CONNECTIONS} from './discovery-data';
import type {WorldCategory} from './world-types';

export function DiscoveryIntro({onSearch,onGlobe}:{onSearch:()=>void;onGlobe:()=>void}){
 return <section className="discovery-hero" aria-labelledby="discovery-title">
  <div className="discovery-hero-copy"><p className="eyebrow"><Compass size={16}/> DEINE ENTDECKERZENTRALE</p><h1 id="discovery-title">Die Welt steckt<br/>voller <span>Wunder.</span></h1><p>Vom Meer bis zum Mond. Von wilden Tieren bis zu großen Ideen. Folge deiner Neugier – und finde heraus, wie alles zusammenhängt.</p>
   <button className="discovery-search" onClick={onSearch}><Search size={22}/><span>Was möchtest du entdecken?</span><ArrowRight size={19}/></button>
   <button className="discovery-globe-link" onClick={onGlobe}><Globe2 size={18}/> Direkt zur interaktiven Weltkugel <ArrowRight size={16}/></button>
  </div>
  <figure className="discovery-hero-art"><DiscoveryVisual/><figcaption>Künstlerische Abenteuerlandschaft · nicht maßstabsgetreu</figcaption><span className="field-label"><Sparkles size={15}/> Beobachten. Fragen. Ausprobieren.</span></figure>
 </section>;
}

export function DiscoveryWorlds({onCategory,onAll}:{onCategory:(id:WorldCategory)=>void;onAll:()=>void}){
 return <section className="discovery-worlds" aria-labelledby="discovery-worlds-title"><div className="discovery-section-heading"><div><p className="eyebrow">WOHIN ZIEHT ES DICH?</p><h2 id="discovery-worlds-title">Dein nächstes Abenteuer</h2></div><button className="discovery-text-link" onClick={onAll}>Alle Welten & Lernrouten <ArrowRight size={16}/></button></div><WorldGateways compact onCategory={onCategory}/></section>;
}

export function DiscoveryConnections({onTopic,onRoute,onGame}:{onTopic:(id:string)=>void;onRoute:(id:string)=>void;onGame:()=>void}){
 const [selected,setSelected]=useState(0);
 const pick=DISCOVERY_CONNECTIONS[selected],connection=KNOWLEDGE_CONNECTIONS.find(c=>c.id===pick.id)!;
 const from=WORLD_INDEX.find(t=>t.id===connection.fromId)!,to=WORLD_INDEX.find(t=>t.id===connection.toId)!,route=WORLD_ROUTES.find(r=>r.id===pick.routeId)!;
 return <section className="discovery-pathways" aria-label="Wissen verbinden und ausprobieren">
  <div className="discovery-network"><p className="eyebrow"><Compass size={16}/> ALLES HÄNGT ZUSAMMEN</p><h2>Eine Frage. Zwei Welten.</h2><p className="discovery-intro">Wähle eine Spur und entdecke die Verbindung.</p>
   <div className="discovery-trail-options" role="group" aria-label="Wissensspur auswählen">{DISCOVERY_CONNECTIONS.map((c,i)=><button key={c.id} aria-pressed={i===selected} onClick={()=>setSelected(i)}>{c.label}</button>)}</div>
   <div className="discovery-pair"><button onClick={()=>onTopic(from.id)}>{from.title}<ArrowRight size={17}/></button><span aria-hidden="true">↔</span><button onClick={()=>onTopic(to.id)}>{to.title}<ArrowRight size={17}/></button></div>
   <p className="discovery-connection-why" role="status">{connection.why}</p><button className="discovery-text-link" onClick={()=>onRoute(route.id)}>Lernroute: {route.title} <ArrowRight size={17}/></button><p className="discovery-source-note">Erklärungen und Fachquellen findest du auf den beiden Wissenskarten.</p>
  </div>
  <div className="discovery-play"><span className="discovery-play-icon"><Gamepad2 size={34}/></span><p className="eyebrow">DEIN WISSEN IN AKTION</p><h2>Erkennen.<br/>Verknüpfen.<br/>Weiterdenken.</h2><p>Sechs Aufgaben, kein Zeitdruck. Du wählst leicht, mittel oder schwer. Wenn du möchtest, helfen dir passende Denkhinweise.</p><button className="primary-button" onClick={onGame}>Wissens-Challenge öffnen <ArrowRight size={18}/></button><span className="discovery-play-note"><Lightbulb size={16}/> Du entscheidest, wie knifflig es wird.</span></div>
 </section>;
}
