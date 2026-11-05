// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleFibreDistributionFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const clustered=Array.from({length:8},(_,i)=>({x1:45,y1:35+i*10,x2:125,y2:35+i*10}));
 const distributed=[{x:85,y:75},{x:235,y:75},{x:85,y:185},{x:235,y:185}].flatMap(({x,y})=>[{x1:x-40,y1:y,x2:x+40,y2:y},{x1:x,y1:y-40,x2:x,y2:y+40}]);
 const fibres=selected===0?clustered:distributed;
 return <>
  <h4>Gleiche Fasermenge im Bild – anders verteilt</h4>
  <p>Acht gleich lange, erfundene Faserlinien bleiben erhalten. Vergleiche, ob sie nur in einem Feld liegen oder auf vier Felder verteilt sind. Das Bild untersucht zunächst nur die Anordnung.</p>
  <svg viewBox="0 0 320 260" role="img" aria-label={`Eigene schematische Zeichnung: acht gleich lange Faserlinien ${selected===0?'in einem':'auf vier'} Feldern. Keine Mikroskopaufnahme oder Festigkeitsmessung.`}>
   <rect x="20" y="20" width="280" height="220" rx="5" fill="#fff" stroke="#8baaad" strokeWidth="2"/>
   <path d="M160 20V240M20 130H300" fill="none" stroke="#bdced0" strokeWidth="2" strokeDasharray="5 5"/>
   {fibres.map((fibre,index)=><line key={index} data-paper-fibre={index} {...fibre} stroke="#467889" strokeWidth="5" strokeLinecap="round"/>)}
  </svg>
  <div className="people-evidence-legend"><span>Immer acht Linien mit gleicher Länge.</span><span>{selected===0?'Linien nur im oberen linken Feld.':'Linien in allen vier Feldern.'}</span></div>
  <div className="visual-choice" role="group" aria-label="Verteilung der acht Faserlinien"><button aria-pressed={selected===0} onClick={()=>onSelect(0)}>In einem Feld sammeln</button><button aria-pressed={selected===1} onClick={()=>onSelect(1)}>Auf vier Felder verteilen</button></div>
  <p className="people-evidence-observation" role="status">{selected===0?'Alle acht Linien liegen dicht beieinander im ersten Feld. Die anderen Felder bleiben leer.':'Je zwei Linien liegen nun in jedem der vier Felder. Ihre Gesamtzahl und die Länge jeder Linie bleiben gleich.'} Eine andere Verteilung ist hier keine zusätzliche Materialmenge.</p>
  <p className="small-note">Eigene Modellzeichnung mit KI-Unterstützung. Stark vereinfachte Linien und vier gedachte Vergleichsfelder, keine echten Fasern oder historische Papierprobe. Gleiche gezeichnete Länge ist keine gemessene reale Masse. Echtes Papier enthält sehr viele verbundene Pflanzenfasern; Trocknung, Faserart und Bindungen werden hier nicht berechnet. Aus der Zeichnung folgt keine bestimmte Reißfestigkeit oder Gleichmäßigkeit eines wirklichen Blattes.</p>
 </>;
}
