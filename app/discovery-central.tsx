import {lazy,Suspense,useLayoutEffect} from 'react';
const DiscoveryTopicMedia=lazy(()=>import('./discovery-topic-media'));
import {ArrowRight,Compass,FlaskConical,Gamepad2,Globe2,Lightbulb,Search} from 'lucide-react';
import {navigateHash,scheduleRouteRestore} from './hash-route';
import WorldPhoto from './world-media';
import WorldGateways from './world-gateways';
import {WORLD_INDEX,WORLD_ROUTES} from './world-index';
import DISCOVERY_CONNECTION_INDEX from './discovery-connections.json';
import {DISCOVERY_CONNECTIONS as CURATED_CONNECTIONS,DISCOVERY_ACTIVITIES} from './discovery-data';
import type {WorldCategory} from './world-types';
export function DiscoveryIntro({heroId,onChange,onSearch,onGlobe,onHelp}:{heroId:string;onChange:()=>void;onSearch:()=>void;onGlobe:()=>void;onHelp:()=>void}){
 useLayoutEffect(()=>scheduleRouteRestore('home',!!history.state?.wunderRoute||!!history.state?.wunderFocus),[]);
 const topic=WORLD_INDEX.find(t=>t.id===heroId)!;
 return <section className="discovery-hero" data-discovery-hero={heroId} aria-labelledby="discovery-title">
  <div className="discovery-hero-copy"><h1 id="discovery-title">Was möchtest du <span>heute verstehen?</span></h1>
   <div className="discovery-start"><button className="discovery-search" aria-label="WunderKompass durchsuchen" aria-describedby="home-search-examples" data-route-focus="home-search" onClick={onSearch}><Search size={22}/><span><strong>Suche nach Themen</strong><small id="home-search-examples">Zum Beispiel: Mond oder Elefant</small></span><ArrowRight size={20}/></button></div>
   <div className="discovery-quiet-links"><button className="discovery-globe-link" data-route-focus="home-globe" onClick={onGlobe}><Globe2 size={18}/> Direkt zur Weltkugel</button><button className="discovery-mobile-help" onClick={onHelp}>So geht’s</button></div>
  </div>
  <div className="discovery-hero-art"><WorldPhoto id={topic.image!} historyKey="home-hero-credit" creditDisclosure eager/>
   <div className="discovery-feature"><a aria-live="polite" aria-atomic="true" href={'#world/topic/'+topic.id} data-route-focus={topic.id==='animal-honey-bee'?'home-bee':'home-motif-'+topic.id} onClick={event=>{event.preventDefault();navigateHash('world/topic/'+topic.id);}}>{topic.homeQuestion}<ArrowRight size={20} aria-hidden="true"/></a>
    <button className="discovery-text-link discovery-change" aria-label="Anderes Einstiegsmotiv" onClick={onChange}>Andere Frage entdecken <ArrowRight size={16} aria-hidden="true"/></button>
   </div>
  </div>
 </section>;
}

export const DiscoveryActivities=lazy(()=>import('./discovery-activities'));
const DiscoveryActivityPreview=lazy(()=>import('./discovery-activity-preview'));

export function DiscoveryWorlds({onCategory,onAll}:{onCategory:(id:WorldCategory)=>void;onAll:()=>void}){
 return <section className="discovery-worlds" aria-labelledby="discovery-worlds-title"><div className="discovery-section-heading"><h2 id="discovery-worlds-title">Sechs Welten entdecken</h2></div><WorldGateways compact separateCredits onCategory={onCategory}/><button className="discovery-text-link" data-route-focus="home-worlds" onClick={onAll}>Alle Welten & Lernrouten <ArrowRight size={16}/></button></section>;
}

export function DiscoveryConnections({trailId,onChange,onTopic,onRoute,onGame}:{trailId:string;onChange:(id:string)=>void;onTopic:(id:string)=>void;onRoute:(id:string)=>void;onGame:()=>void}){
 const pick=DISCOVERY_CONNECTION_INDEX.find(c=>c.id===trailId)??DISCOVERY_CONNECTION_INDEX[0],connection=pick;
 const curatedIndex=CURATED_CONNECTIONS.findIndex(c=>c.id===pick.id);
 const from=WORLD_INDEX.find(t=>t.id===connection.fromId)!,to=WORLD_INDEX.find(t=>t.id===connection.toId)!,route=WORLD_ROUTES.find(r=>r.id===pick.routeId)!;
 const ActivityIcon=curatedIndex>=0&&DISCOVERY_ACTIVITIES[curatedIndex].hash.startsWith('labs/')?FlaskConical:curatedIndex>=0&&DISCOVERY_ACTIVITIES[curatedIndex].hash==='games'?Gamepad2:Compass;
 const activity=curatedIndex>=0?DISCOVERY_ACTIVITIES[curatedIndex]:{title:route.title,text:route.intro,hash:'world/route/'+route.id,label:'Verbindung auf Lernroute verfolgen'};
 return <section data-discovery-trail-current={pick.id} className="discovery-pathways" aria-label="Wissen verbinden und ausprobieren">
  <div className="discovery-network"><p className="eyebrow"><Compass size={16}/> ALLES HÄNGT ZUSAMMEN</p><h2>Eine Frage. Zwei Welten.</h2><p className="discovery-intro">Wähle eine Spur und entdecke die Verbindung.</p>
   <details className="discovery-trail-picker" data-history-disclosure="home-trails"><summary>Andere Wissensspur wählen</summary><div className="discovery-trail-options" role="group" aria-label="Bekannte Wissensspuren">{CURATED_CONNECTIONS.map(c=><button key={c.id} data-discovery-trail={c.id} aria-pressed={c.id===pick.id} onClick={()=>onChange(c.id)}>{c.label}</button>)}</div><label>Alle passenden Verbindungen <select aria-label="Wissensspur auswählen" value={pick.id} onChange={e=>onChange(e.target.value)}>{DISCOVERY_CONNECTION_INDEX.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label></details>
   <h3 className="discovery-question">{pick.question}</h3>
   <div className="discovery-pair"><article><Suspense fallback={null}><DiscoveryTopicMedia topic={from}/></Suspense><button data-route-focus={"home-topic-"+from.id} onClick={()=>onTopic(from.id)}>{from.title}<ArrowRight size={17}/></button></article><span aria-hidden="true">↔</span><article><Suspense fallback={null}><DiscoveryTopicMedia topic={to}/></Suspense><button data-route-focus={"home-topic-"+to.id} onClick={()=>onTopic(to.id)}>{to.title}<ArrowRight size={17}/></button></article></div>
   <p className="discovery-connection-why" role="status">{connection.why}</p><button className="discovery-text-link" data-route-focus={"home-route-"+route.id} onClick={()=>onRoute(route.id)}>Lernroute: {route.title} <ArrowRight size={17}/></button><p className="discovery-source-note">Erklärungen und Fachquellen findest du auf den beiden Wissenskarten.</p>
  </div>
  <div className="discovery-play"><p className="eyebrow">HEUTE AUSPROBIEREN</p><h2>{activity.title}</h2><p>{activity.text}</p><Suspense fallback={null}><DiscoveryActivityPreview hash={activity.hash}/></Suspense><a className="primary-button" data-route-focus="home-activity" href={'#'+activity.hash} onClick={e=>{e.preventDefault();if(activity.hash==='games')onGame();else navigateHash(activity.hash);}}><ActivityIcon size={19}/>{activity.label}<ArrowRight size={18}/></a><span className="discovery-play-note"><Lightbulb size={16}/> Freiwillige Hinweise helfen beim Weiterdenken.</span></div>
 </section>;
}
