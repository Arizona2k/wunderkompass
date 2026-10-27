import {ArrowRight,Compass,FlaskConical,Gamepad2} from 'lucide-react';
import PlaygroundPreview from './playground-preview';
import ResearchPreview from './research-preview';
import DiscoverySequencePreview from './discovery-sequence-preview';
export default function DiscoveryActivities({onNavigate}:{onNavigate:(mode:string)=>void}){
 return <section className="discovery-activities" aria-labelledby="discovery-activities-title"><div className="discovery-section-heading"><div><p className="eyebrow">WIE MÖCHTEST DU ENTDECKEN?</p><h2 id="discovery-activities-title">Spielen, untersuchen, weiterreisen</h2></div></div><div className="next-adventures">
  <article><div className="discovery-entry-preview"><PlaygroundPreview game="classic:hunt"/><p className="discovery-preview-note">Beispiel: Weltreise-Suche auf der tatsächlichen Weltkugel.</p></div><button data-route-focus="home-playground" onClick={()=>onNavigate('games')}><Gamepad2 size={25}/><span><strong>Spielplatz</strong><small>Mit Aufgaben und Rätseln Wissen anwenden. Hinweise helfen beim Weiterdenken.</small></span><ArrowRight size={19}/></button></article>
  <article><div className="discovery-entry-preview"><ResearchPreview id="tides"/></div><button data-route-focus="home-laboratory" onClick={()=>onNavigate('labs')}><FlaskConical size={25}/><span><strong>Forscherlabor</strong><small>Etwas verändern, beobachten und deine Erklärung festhalten.</small></span><ArrowRight size={19}/></button></article>
  <article><div className="discovery-entry-preview"><DiscoverySequencePreview journey="nature"/></div><button data-route-focus="home-journeys" onClick={()=>onNavigate('journeys')}><Compass size={25}/><span><strong>Lernreisen</strong><small>Einem Thema Schritt für Schritt folgen und später weitermachen.</small></span><ArrowRight size={19}/></button></article>
 </div></section>;
}
