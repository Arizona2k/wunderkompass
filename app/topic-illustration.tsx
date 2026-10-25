import ScienceDiagram,{hasScienceDiagram} from './science-diagram';
import AnimalIllustration,{hasAnimalIllustration} from './animal-illustration';
import PeopleIllustration,{hasPeopleIllustration} from './people-illustration';
import DeviceIllustration,{hasDeviceIllustration} from './device-illustration';
export const hasTopicIllustration=(id:string)=>((id!=='science-photosynthesis')&&hasScienceDiagram(id))||hasAnimalIllustration(id)||hasPeopleIllustration(id)||hasDeviceIllustration(id)||['science-moon-phases','science-tides','science-currents'].includes(id);
/** Original explanatory drawings; HTML labels retain their size on small screens. */
export default function TopicIllustration({id,compact=false}:{id:string;compact?:boolean}){
 if(id!=='science-photosynthesis'&&hasScienceDiagram(id))return <ScienceDiagram id={id} compact={compact}/>;
 if(hasAnimalIllustration(id))return <AnimalIllustration id={id} compact={compact}/>;
 if(hasPeopleIllustration(id))return <PeopleIllustration id={id} compact={compact}/>;
 if(hasDeviceIllustration(id))return <DeviceIllustration id={id} compact={compact}/>;
 const moon=id==='science-moon-phases',tides=id==='science-tides';
 const label=moon?'Vier ausgewählte Mondphasen: Neumond, zunehmender Halbmond, Vollmond und abnehmender Halbmond.':tides?'Dieselbe schematische Küste bei niedrigem und hohem Wasserstand.':'Drei Antriebe für Meeresströmungen: Wind, Gezeiten und Dichteunterschiede.';
 const labels=moon?['Neumond','Zunehmender Halbmond','Vollmond','Abnehmender Halbmond']:tides?['Niedrigwasser','Hochwasser']:['Wind','Gezeiten','Dichte'];
 return <figure className={'topic-illustration '+(compact?'compact':'')}>
  <div className={'topic-diagram '+(moon?'moon-diagram':tides?'tides-diagram':'currents-diagram')} role={compact?undefined:'img'} aria-label={compact?undefined:label} aria-hidden={compact||undefined}>
   {labels.map((text,i)=><div className="topic-diagram-panel" key={text}>
    <svg viewBox={moon?'0 0 160 180':tides?'0 0 320 230':'0 0 160 180'} aria-hidden="true" focusable="false">
     {moon?<>
      <g fill="#b7d6d5" opacity=".6"><circle cx="25" cy="32" r="2"/><circle cx="135" cy="43" r="2"/><circle cx="120" cy="156" r="2"/></g>
      <circle cx="80" cy="90" r="42" fill="#294858" stroke="#8ab8bb" strokeWidth="1.5"/>
      {i===2&&<circle cx="80" cy="90" r="42" fill="#f2dbad"/>}
      {i===1&&<path d="M80 48a42 42 0 0 1 0 84z" fill="#f2dbad"/>}
      {i===3&&<path d="M80 48a42 42 0 0 0 0 84z" fill="#f2dbad"/>}
     </>:tides?<>
      <rect x="22" y="52" width="276" height="164" rx="12" fill="#b6d8d8"/><path d="M22 178Q112 150 178 146L298 116V216H22Z" fill="#dfbe87"/>
      <path d={i===0?'M22 165H116L178 178L298 198V216H22Z':'M22 115H284L298 124V216H22Z'} fill="#2e738b"/>
      <path d={i===0?'M34 186h62m-28 15h68':'M34 134h110m-72 16h134'} stroke="#addddd" strokeWidth="3"/><path d="M263 92v110" stroke="#203d4c" strokeWidth="4"/>
     </>:<>
      <circle cx="80" cy="90" r="42" fill="#346f7b" stroke="#88bebd"/>
      <path d={i===0?'M48 79h65m-12-12 12 12-12 12M48 104h45':i===1?'M60 89v-25m-8 8 8-8 8 8M100 79v30m-8-8 8 8 8-8':'M80 63v54m-12-12 12 12 12-12'} stroke="#f2dbad" strokeWidth="4" fill="none" strokeLinecap="round"/>
     </>}
    </svg>
    <p className="topic-diagram-label">{text}</p>
   </div>)}
  </div>
  <figcaption>{moon?'Eigene Zeichnung · vier Phasen, Nordhalbkugel-Orientierung; keine maßstäbliche Bahn.':tides?'Eigene Zeichnung · schematischer Küstenvergleich; keine örtliche Vorhersage.':'Eigene Zeichnung · Antriebe im Überblick; keine Karte tatsächlicher Strömungen.'}</figcaption>
 </figure>;
}
