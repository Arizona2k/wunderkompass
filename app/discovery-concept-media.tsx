/** Small explanatory views of the existing article's concepts; never interactive-model captures. */
export const hasDiscoveryConceptMedia=(id:string)=>['science-fungi','science-foodweb','science-atmosphere','history-iss'].includes(id);
export default function DiscoveryConceptMedia({id,historyKey}:{id:string;historyKey:string}){
 if(!hasDiscoveryConceptMedia(id))return null;
 if(id==='history-iss')return <figure className="discovery-concept discovery-concept-station" data-station-context="orbital-laboratory">
  <svg viewBox="0 0 320 220" role="img" aria-label="Schema: Die Erde steht im gefüllten Kreis, ein Rechteck auf der umgebenden Linie für die Raumstation ISS. Größen und Abstände sind nicht maßstabsgetreu.">
   <circle data-station-context-orbit="true" cx="145" cy="110" r="80" fill="none" stroke="#789396" strokeWidth="2" strokeDasharray="6 5"/>
   <circle data-station-context-earth="true" cx="145" cy="110" r="42" fill="#286171"/>
   <path d="M103 110H187M145 68C120 88 120 132 145 152M145 68C170 88 170 132 145 152" fill="none" stroke="#e3f1ee" strokeWidth="2"/>
   <rect data-station-context-laboratory="true" x="209" y="102" width="32" height="16" rx="4" fill="#b65d32" stroke="#6d432e" strokeWidth="2"/>
  </svg>
  <ul><li>Gefüllter Kreis: Erde.</li><li>Rechteck auf der Linie: Raumstation.</li></ul>
  <figcaption><details data-history-disclosure={historyKey}><summary>Darstellung &amp; Modellgrenzen</summary><p>Eigene Erklärungsgrafik mit KI-Unterstützung: ein Forschungslabor in der Erdumlaufbahn. Größen und Abstände sind frei gewählt; kein Maßstab, Bauplan oder historisches Stationsfoto. Die Linie ist eine schematische Einordnung, keine Bahnberechnung. Fachquellen auf der Entdeckerkarte.</p></details></figcaption>
 </figure>;
 const fungi=id==='science-fungi',air=id==='science-atmosphere';
 const labels=fungi?['Fruchtkörper über dem Boden','Pilzfäden bilden das Myzel']:air?['Exosphäre','Thermosphäre','Mesosphäre','Stratosphäre','Troposphäre']:['Sonne','Phytoplankton','Krill','Blauwal'];
 const limit=fungi?'Schema eines hutbildenden Pilzes, kein Größenmaßstab. Nicht alle Pilze bilden Hüte.':air?'Reihenfolge nach oben: von der Troposphäre zur Exosphäre. Schichtdicken sind nicht maßstabsgetreu; die Atmosphäre hat keine feste Decke.':'Eine ausgewählte Nahrungskette im Meer. Die Pfeile zeigen den Weg der Energie, kein vollständiges Nahrungsnetz.';
 return <figure className={'discovery-concept discovery-concept-'+(fungi?'fungi':air?'air':'food')}>
  {fungi?<><svg viewBox="0 0 400 220" role="img" aria-label="Ein Fruchtkörper über dem Boden und verzweigte Pilzfäden darunter"><path d="M18 105H382" stroke="#8d9e8b" strokeWidth="2"/><path d="M190 100V67H210V100" fill="#d2c2a8" stroke="#705c43" strokeWidth="3"/><path d="M155 68Q200 5 245 68Z" fill="#b77850" stroke="#705c43" strokeWidth="3"/><g stroke="#5a7766" strokeWidth="3" fill="none"><path d="M200 104V143L135 178L76 184M200 143L265 176L325 188M200 125L125 137L64 120M200 125L277 139L340 120M135 178L132 211M135 178L89 158M265 176L267 211M265 176L313 157M125 137L91 148M277 139L309 150M200 143V205"/></g></svg><ul>{labels.map(t=><li key={t}>{t}</li>)}</ul></>:air?<ol aria-label="Luftschichten, oben außen und unten am Boden">{labels.map((t,i)=><li key={t} style={{background:['#dbe8ee','#d3e6ee','#c8e1ec','#bad9e6','#a9cfdc'][i]}}>{t}</li>)}</ol>:<ol aria-label="Weg der Energie in einer ausgewählten Nahrungskette">{labels.map((t,i)=><li key={t}>{i>0&&<span aria-hidden="true">↓</span>}<strong>{t}</strong></li>)}</ol>}
  <figcaption><details data-history-disclosure={historyKey}><summary>Darstellung & Modellgrenzen</summary><p>{limit} Eigene Erklärungsgrafik mit KI-Unterstützung; Fachquellen auf der Entdeckerkarte.</p></details></figcaption>
 </figure>;
}
