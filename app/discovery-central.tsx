import {useLayoutEffect,useState} from 'react';
import {ArrowRight,Compass,Gamepad2,Globe2,Lightbulb,Search} from 'lucide-react';
import {navigateHash,restoreRouteView} from './hash-route';
import DiscoveryVisual from './discovery-visual';
import WorldGateways from './world-gateways';
import {WORLD_INDEX,WORLD_ROUTES} from './world-index';
import {KNOWLEDGE_CONNECTIONS} from './knowledge-connections';
import {DISCOVERY_CONNECTIONS,DISCOVERY_ACTIVITIES} from './discovery-data';
import type {WorldCategory} from './world-types';
function rememberTrail(id:string){try{sessionStorage.setItem('wunderkompass-discovery-trail',id);}catch{}}
function initialTrail(){
 if(typeof window==='undefined')return 0;
 let saved=history.state?.wunderTrail;try{saved??=sessionStorage.getItem('wunderkompass-discovery-trail');}catch{}
 const index=DISCOVERY_CONNECTIONS.findIndex(c=>c.id===saved),initial=index<0?Math.floor(Math.random()*DISCOVERY_CONNECTIONS.length):index;
 rememberTrail(DISCOVERY_CONNECTIONS[initial].id);return initial;
}

export function DiscoveryIntro({onSearch,onGlobe,onHelp}:{onSearch:()=>void;onGlobe:()=>void;onHelp:()=>void}){
 useLayoutEffect(()=>{restoreRouteView('globe',!!history.state?.wunderRoute||!!history.state?.wunderFocus);},[]);
 return <section className="discovery-hero" aria-labelledby="discovery-title">
  <div className="discovery-hero-copy"><p className="eyebrow"><Compass size={16}/> WISSEN WIRD EIN ABENTEUER</p><h1 id="discovery-title">Was macht <span>die Welt spannend?</span></h1><p>Tiere, Geschichte, Erfindungen und Weltall: Folge deiner Neugier, spiele mit Wissen und forsche selbst. Für 6–14, ohne Zeitdruck.</p>
   <div className="discovery-start"><button className="discovery-start-button" onClick={onGlobe}><Globe2 size={20}/> Mit der Weltkugel starten <ArrowRight size={18}/></button><button className="discovery-search" onClick={onSearch}><Search size={19}/><span>Was möchtest du entdecken?</span></button></div>
   <div className="discovery-quiet-links"><a data-route-focus="home-updates" href="#updates" onClick={e=>{e.preventDefault();navigateHash('updates');}}>✨ Was ist neu?</a><button className="discovery-mobile-help" onClick={onHelp}>So geht’s</button><span>Ohne Konto. Ohne Zeitdruck.</span></div>
  </div>
  <figure className="discovery-hero-art"><DiscoveryVisual/><figcaption>Künstlerische Abenteuerlandschaft · nicht maßstabsgetreu</figcaption></figure>
 </section>;
}

export function DiscoveryWorlds({onCategory,onAll}:{onCategory:(id:WorldCategory)=>void;onAll:()=>void}){
 return <section className="discovery-worlds" aria-labelledby="discovery-worlds-title"><div className="discovery-section-heading"><div><p className="eyebrow">WOHIN ZIEHT ES DICH?</p><h2 id="discovery-worlds-title">Sechs Welten. Deine Neugier.</h2></div><button className="discovery-text-link" data-route-focus="home-worlds" onClick={onAll}>Alle Welten & Lernrouten <ArrowRight size={16}/></button></div><WorldGateways compact separateCredits onCategory={onCategory}/></section>;
}

export function DiscoveryConnections({onTopic,onRoute,onGame}:{onTopic:(id:string)=>void;onRoute:(id:string)=>void;onGame:()=>void}){
 const [selected,setSelected]=useState(initialTrail);
 const activity=DISCOVERY_ACTIVITIES[selected];
 const select=(i:number)=>{setSelected(i);rememberTrail(DISCOVERY_CONNECTIONS[i].id);};
 const pick=DISCOVERY_CONNECTIONS[selected],connection=KNOWLEDGE_CONNECTIONS.find(c=>c.id===pick.id)!;
 const from=WORLD_INDEX.find(t=>t.id===connection.fromId)!,to=WORLD_INDEX.find(t=>t.id===connection.toId)!,route=WORLD_ROUTES.find(r=>r.id===pick.routeId)!;
 return <section className="discovery-pathways" aria-label="Wissen verbinden und ausprobieren">
  <div className="discovery-network"><p className="eyebrow"><Compass size={16}/> ALLES HÄNGT ZUSAMMEN</p><h2>Eine Frage. Zwei Welten.</h2><p className="discovery-intro">Wähle eine Spur und entdecke die Verbindung.</p>
   <div className="discovery-trail-options" role="group" aria-label="Wissensspur auswählen">{DISCOVERY_CONNECTIONS.map((c,i)=><button key={c.id} data-discovery-trail={c.id} aria-pressed={i===selected} onClick={()=>select(i)}>{c.label}</button>)}</div>
   <div className="discovery-pair"><button data-route-focus={"home-topic-"+from.id} onClick={()=>onTopic(from.id)}>{from.title}<ArrowRight size={17}/></button><span aria-hidden="true">↔</span><button data-route-focus={"home-topic-"+to.id} onClick={()=>onTopic(to.id)}>{to.title}<ArrowRight size={17}/></button></div>
   <p className="discovery-connection-why" role="status">{connection.why}</p><button className="discovery-text-link" data-route-focus={"home-route-"+route.id} onClick={()=>onRoute(route.id)}>Lernroute: {route.title} <ArrowRight size={17}/></button><p className="discovery-source-note">Erklärungen und Fachquellen findest du auf den beiden Wissenskarten.</p>
  </div>
  <div className="discovery-play"><p className="eyebrow">HEUTE AUSPROBIEREN</p><h2>{activity.title}</h2><p>{activity.text}</p><a className="primary-button" data-route-focus="home-activity" href={'#'+activity.hash} onClick={e=>{e.preventDefault();if(activity.hash==='games')onGame();else navigateHash(activity.hash);}}><Gamepad2 size={19}/>{activity.label}<ArrowRight size={18}/></a><span className="discovery-play-note"><Lightbulb size={16}/> Freiwillige Hinweise helfen beim Weiterdenken.</span></div>
 </section>;
}
