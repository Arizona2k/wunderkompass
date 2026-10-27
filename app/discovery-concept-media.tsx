/** Small explanatory views of the existing article's concepts; never interactive-model captures. */
export const hasDiscoveryConceptMedia=(id:string)=>['science-fungi','science-foodweb','science-atmosphere'].includes(id);
export default function DiscoveryConceptMedia({id,historyKey}:{id:string;historyKey:string}){
 if(!hasDiscoveryConceptMedia(id))return null;
 const fungi=id==='science-fungi',air=id==='science-atmosphere';
 const labels=fungi?['Fruchtkörper über dem Boden','Pilzfäden bilden das Myzel']:air?['Exosphäre','Thermosphäre','Mesosphäre','Stratosphäre','Troposphäre']:['Sonne','Phytoplankton','Krill','Blauwal'];
 const limit=fungi?'Schema eines hutbildenden Pilzes, kein Größenmaßstab. Nicht alle Pilze bilden Hüte.':air?'Reihenfolge nach oben: von der Troposphäre zur Exosphäre. Schichtdicken sind nicht maßstabsgetreu; die Atmosphäre hat keine feste Decke.':'Eine ausgewählte Nahrungskette im Meer. Die Pfeile zeigen den Weg der Energie, kein vollständiges Nahrungsnetz.';
 return <figure className={'discovery-concept discovery-concept-'+(fungi?'fungi':air?'air':'food')}>
  {fungi?<><svg viewBox="0 0 400 220" role="img" aria-label="Ein Fruchtkörper über dem Boden und verzweigte Pilzfäden darunter"><path d="M18 105H382" stroke="#8d9e8b" strokeWidth="2"/><path d="M190 100V67H210V100" fill="#d2c2a8" stroke="#705c43" strokeWidth="3"/><path d="M155 68Q200 5 245 68Z" fill="#b77850" stroke="#705c43" strokeWidth="3"/><g stroke="#5a7766" strokeWidth="3" fill="none"><path d="M200 104V143L135 178L76 184M200 143L265 176L325 188M200 125L125 137L64 120M200 125L277 139L340 120M135 178L132 211M135 178L89 158M265 176L267 211M265 176L313 157M125 137L91 148M277 139L309 150M200 143V205"/></g></svg><ul>{labels.map(t=><li key={t}>{t}</li>)}</ul></>:air?<ol aria-label="Luftschichten, oben außen und unten am Boden">{labels.map((t,i)=><li key={t} style={{background:['#dbe8ee','#d3e6ee','#c8e1ec','#bad9e6','#a9cfdc'][i]}}>{t}</li>)}</ol>:<ol aria-label="Weg der Energie in einer ausgewählten Nahrungskette">{labels.map((t,i)=><li key={t}>{i>0&&<span aria-hidden="true">↓</span>}<strong>{t}</strong></li>)}</ol>}
  <figcaption><details data-history-disclosure={historyKey}><summary>Darstellung & Modellgrenzen</summary><p>{limit} Eigene Erklärungsgrafik mit KI-Unterstützung; Fachquellen auf der Entdeckerkarte.</p></details></figcaption>
 </figure>;
}
