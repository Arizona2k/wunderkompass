import {useId} from 'react';

export type HeatFigureKind='net-transfer'|'material-path'|'moving-fluid'|'radiative-exchange'|'equal-temperature-materials';

// Own qualitative sketches. Text remains normal HTML at the reader's font size.
export function BookHeatFigure({kind}:{kind:HeatFigureKind}){
 const id=useId().replace(/:/g,''),arrow=id+'-arrow';
 const descriptions:Record<HeatFigureKind,{title:string;key:string[];limit:string}>={
  'net-transfer':{title:'Temperatur und Energieübertragung unterscheiden',key:['Links: ein gedachter Körper mit 30 °C.','Rechts: ein gedachter Körper mit 20 °C.','Der Pfeil zeigt die Richtung der von selbst erfolgenden Netto-Energieübertragung.'],limit:'Die beiden Zahlen sind Beispieltemperaturen. Die Skizze berechnet weder übertragene Energie noch die Zeit bis zum Temperaturausgleich.'},
  'material-path':{title:'Ein Energiepfad durch Material',key:['Links: das wärmere Ende eines gedachten festen Stabs.','Rechts: das kühlere Ende desselben Stabs.','Der Pfeil zeigt einen Energiepfad im Material; der Stab strömt dabei nicht als Ganzes mit.'],limit:'Eine eigene Skizze zur Wärmeleitung, keine Teilchenaufnahme und keine Berechnung einer Erwärmungszeit. Auch Flüssigkeiten und Gase können Wärme leiten.'},
  'moving-fluid':{title:'Strömung führt Stoff und Energie mit',key:['Die blaue Bahn zeigt einen gedachten Luft- oder Wasserstrom.','Die orangefarbene Markierung steht für mitgeführte Energie.','Stoff und Energie sind verschiedene Dinge, die in diesem Beispiel gemeinsam einen Weg zurücklegen.'],limit:'Die Strömung kann etwa durch Dichteunterschiede oder durch eine Pumpe beziehungsweise einen Lüfter angetrieben werden. Das Bild zeigt keinen gemessenen Wind und keine allgemeine Regel „Wärme steigt nach oben“.'},
  'radiative-exchange':{title:'Zwei Flächen senden Strahlung aus',key:['Beide getrennten Flächen senden thermische Strahlung aus und können Strahlung aufnehmen.','Die beiden Pfeile zeigen Wege in entgegengesetzte Richtungen.','Für diesen Weg müssen sich die Flächen nicht berühren.'],limit:'Gleiche Pfeilbreiten bedeuten hier keine gleichen Energiemengen. Der Netto-Austausch hängt unter anderem von Temperatur, Oberfläche und Anordnung ab. Sichtbares Glühen ist nicht erforderlich.'},
  'equal-temperature-materials':{title:'Gleiche Materialtemperatur, unterschiedlicher Austausch',key:['Oben: zwei gleich warme gedachte Hautflächen, beide wärmer als die berührten Materialien.','Unten links: Holz. Unten rechts: Metall. Beide Flächen haben dieselbe Temperatur.','Die Pfeile stellen einen möglichen unterschiedlich schnellen Energieaustausch unter angenommenen Kontaktbedingungen dar.'],limit:'Die Pfeile sind qualitative Annahmen, keine Messwerte oder universellen Materialkonstanten. Gefühl allein ersetzt keine Temperaturmessung. Nur ein Gedankenvergleich, keine Aufforderung zum Anfassen heißer, sehr kalter oder unbekannter Oberflächen.'}
 },d=descriptions[kind];
 return <figure className="book-heat-figure" data-book-heat-figure={kind}>
  <h4><strong>{d.title}</strong></h4>
  <svg viewBox="0 0 320 160" role="img" aria-label={d.title+'. Beschreibung direkt darunter.'} style={{display:'block',width:'100%',height:'auto',maxWidth:520}}>
   <defs><marker id={arrow} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#245d70"/></marker></defs>
   {kind==='net-transfer'&&<><rect x={20} y={40} width={85} height={80} rx={16} fill="#f9e4ce" stroke="#8b463d" strokeWidth={2}/><rect x={215} y={40} width={85} height={80} rx={16} fill="#d9eaf1" stroke="#245d70" strokeWidth={2}/><path d="M120 80H198" stroke="#8b463d" strokeWidth={5} markerEnd={'url(#'+arrow+')'}/></>}
   {kind==='material-path'&&<><rect x={20} y={55} width={280} height={50} rx={8} fill="#eef2f1" stroke="#245d70" strokeWidth={2}/><path d="M24 60V100" stroke="#8b463d" strokeWidth={7}/><path d="M296 60V100" stroke="#245d70" strokeWidth={7}/><path d="M60 80H258" stroke="#8b463d" strokeWidth={4} markerEnd={'url(#'+arrow+')'}/></>}
   {kind==='moving-fluid'&&<><path d="M30 115C80 115 90 45 150 45S240 100 285 100" fill="none" stroke="#245d70" strokeWidth={9} markerEnd={'url(#'+arrow+')'}/>{[0,1,2].map(i=><circle key={i} cx={122+i*19} cy={45} r={5} fill="#b6541f" stroke="#fff" strokeWidth={1}/>)}</>}
   {kind==='radiative-exchange'&&<><path d="M35 25V135M285 25V135" stroke="#245d70" strokeWidth={9}/><path d="M55 60H260" stroke="#8b463d" strokeWidth={4} markerEnd={'url(#'+arrow+')'}/><path d="M265 105H60" stroke="#245d70" strokeWidth={4} markerEnd={'url(#'+arrow+')'}/></>}
   {kind==='equal-temperature-materials'&&<><rect x={20} y={20} width={120} height={55} rx={6} fill="#f9e4ce" stroke="#8b463d" strokeWidth={2}/><rect x={180} y={20} width={120} height={55} rx={6} fill="#f9e4ce" stroke="#8b463d" strokeWidth={2}/><rect x={20} y={75} width={120} height={55} rx={4} fill="#e9dbc9" stroke="#245d70" strokeWidth={2}/><rect x={180} y={75} width={120} height={55} rx={4} fill="#d9eaf1" stroke="#245d70" strokeWidth={2}/><path d="M80 42V110" stroke="#8b463d" strokeWidth={3} markerEnd={'url(#'+arrow+')'}/><path d="M240 42V110" stroke="#8b463d" strokeWidth={6} markerEnd={'url(#'+arrow+')'}/></>}
  </svg>
  <ol className="book-model-key">{d.key.map(line=><li key={line}>{line}</li>)}</ol>
  <figcaption className="book-figure-limit">Eigene qualitative Zeichnung mit KI-Unterstützung. {d.limit}</figcaption>
 </figure>;
}
