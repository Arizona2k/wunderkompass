// Separate authoring only. Frozen Nature34 application does not import this source.
type Props={selected:number;onSelect:(value:number)=>void};
const INK='#234e58',BLUE='#467889',ORANGE='#b7572f';
function Choice({labels,name,selected,onSelect}:{labels:[string,string];name:string}&Props){return <div className="visual-choice" role="group" aria-label={name}>{labels.map((label,i)=><button key={label} aria-pressed={selected===i} onClick={()=>onSelect(i)}>{label}</button>)}</div>;}
export function PrintRegistrationEvidenceFigure({selected,onSelect}:Props){return <>
 <h4>Wie passen zwei Druckschichten zusammen?</h4>
 <p>Erfundenes Lehrbeispiel: Eine Kontur und eine Farbfläche bilden gemeinsam ein einfaches Bild. Der Schalter verändert nur die seitliche Lage der Farbfläche.</p>
 <svg viewBox="0 0 300 190" role="img" aria-label={'Eigene gedachte Druckschichten: '+(selected?'Farbfläche seitlich verschoben und nicht mehr passend zur Kontur':'Farbfläche passend innerhalb der Kontur')} data-print-registration={selected?'offset':'aligned'}>
  <rect x="15" y="16" width="270" height="158" rx="6" fill="#fff" stroke="#94b4b5" strokeWidth="2"/>
  <g transform={selected?'translate(22 0)':undefined}><path d="M82 144L145 49L226 144Z" fill={BLUE}/><circle cx="209" cy="52" r="14" fill={ORANGE}/></g>
  <path d="M70 151L145 35L240 151Z" fill="none" stroke={INK} strokeWidth="4"/><circle cx="209" cy="52" r="19" fill="none" stroke={INK} strokeWidth="4"/>
 </svg>
 <div className="people-evidence-legend"><span>Kontur: die dunklen Außenlinien</span><span>Zweite Schicht: die gefüllten Formen</span></div>
 <Choice {...{selected,onSelect}} name="Ausrichtung der erfundenen Druckschichten vergleichen" labels={['Schichten passend ausrichten','Farbfläche seitlich verschieben']}/>
 <p className="people-evidence-observation" role="status">{selected?'Die Fläche ragt nun neben die Kontur. Derselbe Entwurf kann durch veränderte Ausrichtung anders aussehen. Das Beispiel ändert nicht das gezeichnete Motiv.':'Die gefüllten Formen liegen innerhalb ihrer Konturen. Für ein beabsichtigtes Ergebnis müssen verschiedene Druckschritte zueinander passen.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene erfundene Erklärzeichnung, kein Hokusai-Druckblock oder historischer Abzug. Die geometrischen Formen und der Versatz sind frei gewählt. Das Schema erklärt nur die Ausrichtung; Farbstoffmischung, Druckreihenfolge, Papierverformung und die Herstellung der Großen Welle werden nicht vollständig simuliert.</p>
 </>;}
export function NarrativeTransmissionEvidenceFigure({selected,onSelect}:Props){return <>
 <h4>Dasselbe Ereignis, ein anderer Blickwinkel</h4>
 <p>Heute erfunden: Eine Person wartet links auf eine Nachricht. Die andere bringt sie von rechts später als erwartet. Der Blickwinkel wechselt, das vorgegebene Ereignis bleibt gleich.</p>
 <svg viewBox="0 0 300 170" role="img" aria-label={'Eigene erfundene Nachrichtenszene: '+(selected?'Blickwinkel der überbringenden Person rechts':'Blickwinkel der wartenden Person links')+'. Die Nachricht kommt in beiden Fällen später als erwartet.'} data-narrative-perspective={selected?'messenger':'waiting'}>
  <rect x={selected?204:24} y="18" width="72" height="133" rx="30" fill="#fff" stroke={ORANGE} strokeWidth="4"/>
  {[60,240].map(x=><g key={x}><circle cx={x} cy="56" r="17" fill="#d6e5e4" stroke={INK} strokeWidth="3"/><path d={'M'+(x-23)+' 132V106Q'+x+' 76 '+(x+23)+' 106V132Z'} fill={BLUE} stroke={INK} strokeWidth="3"/></g>)}
  <path d="M197 112H102M102 112L113 104M102 112L113 120" fill="none" stroke={INK} strokeWidth="3"/>
  <rect x="126" y="68" width="48" height="32" rx="3" fill="#fff" stroke={INK} strokeWidth="3"/><path d="M127 70L150 86L173 70" fill="none" stroke={INK} strokeWidth="2"/>
 </svg>
 <div className="people-evidence-legend"><span>Links: die wartende Person</span><span>Rechts: die überbringende Person</span></div>
 <Choice {...{selected,onSelect}} name="Blickwinkel in der erfundenen Erzählung wechseln" labels={['Vom Warten erzählen','Vom Weg erzählen']}/>
 <p className="people-evidence-example"><strong>Unser erfundener Text:</strong> {selected?'Ich bin noch auf dem Weg. Heute komme ich langsamer voran als erwartet. Die Nachricht ist noch bei mir.':'Ich warte vor der Tür. Die Nachricht ist noch nicht angekommen. Mir kommt die Wartezeit sehr lang vor.'}</p>
 <p className="people-evidence-observation" role="status">{selected?'Jetzt erfahren wir etwas vom Weg der überbringenden Figur. Ihre Gedanken waren aus dem ersten Blickwinkel nicht vollständig bekannt.':'Der erste Blickwinkel erzählt von der wartenden Figur. Er verrät nicht automatisch, warum die andere Person später kommt.'} Die späte Ankunft ist in beiden Versionen vorgegeben.</p>
 <div className="people-evidence-legend"><span>Historischer Text: frühes 11. Jahrhundert</span><span>Besprochenes späteres Bild im Seattle Art Museum: 17. Jahrhundert</span></div>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene erfundene Figuren und Sätze, keine Übersetzung aus dem Genji Monogatari, historische Kleidung oder authentischen Porträts. Die Szene erklärt Erzählperspektive; sie stellt keine reale Begebenheit aus Murasakis Leben nach. Eine spätere Illustration des alten Werks braucht zusätzlich ihre eigene Datierung. Eine freiwillige eigene Erklärung wird nicht automatisch bewertet.</p>
 </>;}
