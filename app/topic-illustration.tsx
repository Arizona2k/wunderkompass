import {useId} from 'react';

export const hasTopicIllustration=(id:string)=>['science-moon-phases','science-tides','science-currents'].includes(id);
/** Original explanatory drawings; no external media or source artwork. */
export default function TopicIllustration({id,compact=false}:{id:string;compact?:boolean}){
 const uid=useId().replaceAll(':','');
 const moon=id==='science-moon-phases',tides=id==='science-tides';
 const label=moon?'Vier ausgewählte Mondphasen: Neumond, zunehmender Halbmond, Vollmond und abnehmender Halbmond.':tides?'Dieselbe schematische Küste bei niedrigem und hohem Wasserstand.':'Drei Antriebe für Meeresströmungen: Wind, Gezeiten und Dichteunterschiede.';
 return <figure className={'topic-illustration '+(compact?'compact':'')}>
  <svg viewBox="0 0 640 280" role={compact?undefined:'img'} aria-label={compact?undefined:label} aria-hidden={compact||undefined} focusable="false">
   <defs><linearGradient id={uid+'sea'} x2="0" y2="1"><stop stopColor="#256c78"/><stop offset="1" stopColor="#142e48"/></linearGradient></defs>
   <rect width="640" height="280" fill={moon?'#152c46':'url(#'+uid+'sea)'}/>
   {moon?<>
    <g fill="#b7d6d5" opacity=".6">{[[38,49],[115,30],[205,52],[295,35],[387,57],[480,28],[605,52],[580,224],[59,214]].map(([x,y])=><circle key={x} cx={x} cy={y} r="2"/>)}</g>
    {[90,245,400,555].map((x,i)=><g key={x}><circle cx={x} cy="128" r="42" fill="#294858" stroke="#8ab8bb" strokeWidth="1.5"/>{i===2&&<circle cx={x} cy="128" r="42" fill="#f2dbad"/>}{i===1&&<path d={`M${x} 86a42 42 0 0 1 0 84z`} fill="#f2dbad"/>}{i===3&&<path d={`M${x} 86a42 42 0 0 0 0 84z`} fill="#f2dbad"/>}<text x={x} y="204" textAnchor="middle" fill="#f5ead6" fontSize="20">{['Neumond','Zunehmend','Vollmond','Abnehmend'][i]}</text></g>)}
   </>:tides?<>
    {[0,1].map(i=><g key={i} transform={`translate(${i*320} 0)`}><rect x="22" y="52" width="276" height="164" rx="12" fill="#b6d8d8"/><path d="M22 178Q112 150 178 146L298 116V216H22Z" fill="#dfbe87"/><path d={i===0?'M22 165H116L178 178L298 198V216H22Z':'M22 115H284L298 124V216H22Z'} fill="#2e738b"/><path d={i===0?'M34 186h62m-28 15h68':'M34 134h110m-72 16h134'} stroke="#addddd" strokeWidth="3"/><path d="M263 92v110" stroke="#203d4c" strokeWidth="4"/><text x="160" y="249" textAnchor="middle" fill="#f5ead6" fontSize="21">{i===0?'Niedrigwasser':'Hochwasser'}</text></g>)}
   </>:<>
    <path d="M0 180Q100 150 210 178T430 178T640 178V280H0Z" fill="#15374d"/>
    {[0,1,2].map(i=><g key={i} transform={`translate(${i*200+40} 0)`}><circle cx="80" cy="111" r="42" fill="#346f7b" stroke="#88bebd"/><path d={i===0?'M48 100h65m-12-12 12 12-12 12M48 125h45':i===1?'M60 110v-25m-8 8 8-8 8 8M100 100v30m-8-8 8 8 8-8':'M80 84v54m-12-12 12 12 12-12'} stroke="#f2dbad" strokeWidth="4" fill="none" strokeLinecap="round"/><text x="80" y="215" textAnchor="middle" fill="#f5ead6" fontSize="21">{['Wind','Gezeiten','Dichte'][i]}</text></g>)}
   </>}
  </svg>
  <figcaption>{moon?'Eigene Zeichnung · vier Phasen, Nordhalbkugel-Orientierung; keine maßstäbliche Bahn.':tides?'Eigene Zeichnung · schematischer Küstenvergleich; keine örtliche Vorhersage.':'Eigene Zeichnung · Antriebe im Überblick; keine Karte tatsächlicher Strömungen.'}</figcaption>
 </figure>;
}
