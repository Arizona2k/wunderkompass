import {useLayoutEffect,useState} from 'react';
import {ArrowRight,Compass,FlaskConical,Gamepad2,Globe2,Lightbulb,Search} from 'lucide-react';
import {navigateHash,restoreRouteView} from './hash-route';
import DiscoveryVisual from './discovery-visual';
import WorldGateways from './world-gateways';
import {WORLD_INDEX,WORLD_ROUTES} from './world-index';
import DISCOVERY_CONNECTION_INDEX from './discovery-connections.json';
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
 useLayoutEffect(()=>{restoreRouteView('home',!!history.state?.wunderRoute||!!history.state?.wunderFocus);},[]);
 return <section className="discovery-hero" aria-labelledby="discovery-title">
  <div className="discovery-hero-copy"><p className="eyebrow"><Compass size={16}/> DEINE NEUGIER FÜHRT WEITER</p><h1 id="discovery-title">Was möchtest du <span>heute verstehen?</span></h1><p>Erkunde Zusammenhänge, probiere Modelle aus und folge deinen Fragen. Allein oder gemeinsam, in deinem Tempo.</p>
   <div className="discovery-start"><button className="discovery-search" aria-label="WunderKompass durchsuchen" aria-describedby="home-search-examples" data-route-focus="home-search" onClick={onSearch}><Search size={22}/><span><strong>WunderKompass durchsuchen</strong><small id="home-search-examples">Zum Beispiel: Mond, Elefant, Vulkan …</small></span><ArrowRight size={20}/></button></div>
   <div className="discovery-quiet-links"><button className="discovery-globe-link" data-route-focus="home-globe" onClick={onGlobe}><Globe2 size={18}/> Direkt zur Weltkugel</button><button className="discovery-mobile-help" onClick={onHelp}>So geht’s</button><a data-route-focus="home-updates" href="#updates" onClick={e=>{e.preventDefault();navigateHash('updates');}}>Was ist neu?</a></div>
  </div>
  <figure className="discovery-hero-art"><DiscoveryVisual/><figcaption>Mit KI-Unterstützung erstellte eigene Illustration · nicht maßstabsgetreu</figcaption></figure>
 </section>;
}

export function DiscoveryActivities({onNavigate}:{onNavigate:(mode:string)=>void}){
 return <section className="discovery-activities" aria-labelledby="discovery-activities-title"><div className="discovery-section-heading"><div><p className="eyebrow">WIE MÖCHTEST DU ENTDECKEN?</p><h2 id="discovery-activities-title">Spielen, untersuchen, weiterreisen</h2></div></div><div className="next-adventures">
  <button data-route-focus="home-playground" onClick={()=>onNavigate('games')}><Gamepad2 size={27}/><span><strong>Spielplatz</strong><small>Mit Aufgaben und Rätseln Wissen anwenden. Hinweise helfen beim Weiterdenken.</small></span><ArrowRight size={19}/></button>
  <button data-route-focus="home-laboratory" onClick={()=>onNavigate('labs')}><FlaskConical size={27}/><span><strong>Forscherlabor</strong><small>Etwas verändern, beobachten und deine Erklärung festhalten.</small></span><ArrowRight size={19}/></button>
  <button data-route-focus="home-journeys" onClick={()=>onNavigate('journeys')}><Compass size={27}/><span><strong>Lernreisen</strong><small>Einem Thema Schritt für Schritt folgen und später weitermachen.</small></span><ArrowRight size={19}/></button>
 </div></section>;
}

export function DiscoveryWorlds({onCategory,onAll}:{onCategory:(id:WorldCategory)=>void;onAll:()=>void}){
 return <section className="discovery-worlds" aria-labelledby="discovery-worlds-title"><div className="discovery-section-heading"><div><p className="eyebrow">WOHIN ZIEHT ES DICH?</p><h2 id="discovery-worlds-title">Sechs Welten. Deine Neugier.</h2></div><button className="discovery-text-link" data-route-focus="home-worlds" onClick={onAll}>Alle Welten & Lernrouten <ArrowRight size={16}/></button></div><WorldGateways compact separateCredits onCategory={onCategory}/></section>;
}

export function DiscoveryConnections({onTopic,onRoute,onGame}:{onTopic:(id:string)=>void;onRoute:(id:string)=>void;onGame:()=>void}){
 const [selected,setSelected]=useState(initialTrail);
 const activity=DISCOVERY_ACTIVITIES[selected];
 const select=(i:number)=>{setSelected(i);rememberTrail(DISCOVERY_CONNECTIONS[i].id);};
 const pick=DISCOVERY_CONNECTIONS[selected],connection=DISCOVERY_CONNECTION_INDEX.find(c=>c.id===pick.id)!;
 const from=WORLD_INDEX.find(t=>t.id===connection.fromId)!,to=WORLD_INDEX.find(t=>t.id===connection.toId)!,route=WORLD_ROUTES.find(r=>r.id===pick.routeId)!;
 return <section className="discovery-pathways" aria-label="Wissen verbinden und ausprobieren">
  <div className="discovery-network"><p className="eyebrow"><Compass size={16}/> ALLES HÄNGT ZUSAMMEN</p><h2>Eine Frage. Zwei Welten.</h2><p className="discovery-intro">Wähle eine Spur und entdecke die Verbindung.</p>
   <div className="discovery-trail-options" role="group" aria-label="Wissensspur auswählen">{DISCOVERY_CONNECTIONS.map((c,i)=><button key={c.id} data-discovery-trail={c.id} aria-pressed={i===selected} onClick={()=>select(i)}>{c.label}</button>)}</div>
   <h3 className="discovery-question">{pick.question}</h3>
   <div className="discovery-pair"><button data-route-focus={"home-topic-"+from.id} onClick={()=>onTopic(from.id)}>{from.title}<ArrowRight size={17}/></button><span aria-hidden="true">↔</span><button data-route-focus={"home-topic-"+to.id} onClick={()=>onTopic(to.id)}>{to.title}<ArrowRight size={17}/></button></div>
   <p className="discovery-connection-why" role="status">{connection.why}</p><button className="discovery-text-link" data-route-focus={"home-route-"+route.id} onClick={()=>onRoute(route.id)}>Lernroute: {route.title} <ArrowRight size={17}/></button><p className="discovery-source-note">Erklärungen und Fachquellen findest du auf den beiden Wissenskarten.</p>
  </div>
  <div className="discovery-play"><p className="eyebrow">HEUTE AUSPROBIEREN</p><h2>{activity.title}</h2><p>{activity.text}</p><a className="primary-button" data-route-focus="home-activity" href={'#'+activity.hash} onClick={e=>{e.preventDefault();if(activity.hash==='games')onGame();else navigateHash(activity.hash);}}><Gamepad2 size={19}/>{activity.label}<ArrowRight size={18}/></a><span className="discovery-play-note"><Lightbulb size={16}/> Freiwillige Hinweise helfen beim Weiterdenken.</span></div>
 </section>;
}
