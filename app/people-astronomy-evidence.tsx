// Private authoring only: not imported by the frozen canonical application.
// Controlled components fit the existing PeopleEvidence two-state saved control.
type Props={selected:number;onSelect:(value:number)=>void};
const INK='#234e58',ACCENT='#be633d';
function Choices({labels,selected,onSelect,name}:{labels:[string,string];name:string}&Props){return <div className="visual-choice" role="group" aria-label={name}>{labels.map((label,i)=><button key={label} aria-pressed={selected===i} onClick={()=>onSelect(i)}>{label}</button>)}</div>;}
function TimeAxis({ticks,labels}:{ticks:number[];labels:number[]}){return <g stroke={INK}><path d="M20 132H285M24 132V20" fill="none" strokeWidth="2"/>{ticks.map((x,i)=><g key={x}><path d={'M'+x+' 132v6'} strokeWidth="2"/><text x={x} y="165" textAnchor="middle" stroke="none" fill={INK} fontSize="24" fontFamily="sans-serif">{labels[i]}</text></g>)}</g>;}
function lightCurve(factor:number){return Array.from({length:261},(_,i)=>{const t=(i-30)/100;const light=(.6+.4*Math.cos(2*Math.PI*t))*factor;return(i?'L':'M')+(20+i)+' '+(127-85*light).toFixed(2);}).join('');}
export function CepheidEvidenceFigure({selected,onSelect}:Props){return <>
 <h4>Gleicher Rhythmus, anderer Beobachtungsabstand</h4>
 <p>Erfundener Vergleich: Derselbe Stern wird in derselben Phase betrachtet. Nur der Beobachtungsabstand ist im zweiten Bild größer; die abgegebene Lichtleistung und der Rhythmus werden gleich gehalten.</p>
 <svg viewBox="0 0 300 180" role="img" aria-label={'Eigene gedachte Lichtkurve: Spitzen bei Tag 2, 5 und 8; '+(selected?'weiter entfernt und schwächer beobachtet':'näher und heller beobachtet')} data-cepheid-observer={selected?'far':'near'}>
  <TimeAxis ticks={[50,150,250]} labels={[2,5,8]}/><path d={lightCurve(selected?.4:1)} fill="none" stroke={ACCENT} strokeWidth="4"/>
 </svg>
 <div className="people-evidence-legend"><span>Waagerecht: gedachte Tage</span><span>Senkrecht: scheinbare Helligkeit, ohne Messskala</span></div>
 <Choices {...{selected,onSelect}} name="Beobachtungsabstand im gedachten Sternvergleich" labels={['Näher betrachten','Weiter entfernt betrachten']}/>
 <p className="people-evidence-observation" role="status">{selected?'Die Kurve liegt tiefer, die Spitzen bleiben an denselben gedachten Tagen. Weniger ankommendes Licht bedeutet hier keine veränderte Periode.':'Die Spitzen liegen an Tag 2, 5 und 8: jeweils drei Tage Abstand. Die Höhe der Kurve und der Zeitabstand sind verschiedene Angaben.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene schematische Lernkurve, keine historische Aufnahme oder echte Messreihe. Die gewählte Abschwächung ist kein berechneter Entfernungswert; gleichartige Kurvenpunkte beziehen sich auf dieselbe Phase. Keine Lichtabschwächung durch Staub, kalibrierte Cepheidenrelation oder Entfernungsschätzung. Nicht jede veränderliche Lichtquelle ist ein Cepheid.</p>
 </>;}
export function SpectralEvidenceFigure({selected,onSelect}:Props){const strengths=selected?[.65,1,.75]:[1,.75,.9];return <>
 <h4>Ein Linienmuster braucht eine Erklärung</h4>
 <p>Gedachter Vergleich: Dieselben Stoffe bleiben vorhanden, nur ihre physikalischen Bedingungen unterscheiden sich. Die symbolischen Linien liegen weiterhin an denselben drei Positionen.</p>
 <svg viewBox="0 0 300 150" role="img" aria-label={'Eigene symbolische Spektrallinien 1, 2 und 3 unter gedachten Bedingungen '+(selected?'B':'A')} data-spectrum-condition={selected?'B':'A'}>
  <rect x="18" y="20" width="264" height="70" rx="4" fill="#fff" stroke={INK} strokeWidth="2"/>{[65,150,235].map((x,i)=><g key={x}><path d={'M'+x+' 26v58'} stroke={INK} strokeWidth="7" opacity={strengths[i]}/><text x={x} y="128" fontFamily="sans-serif" textAnchor="middle" fontSize="24" fill={INK}>{i+1}</text></g>)}
 </svg>
 <div className="people-evidence-legend"><span>1,2,3: symbolische Linienpositionen</span><span>Dunkelheit: nur ein Zeichen für unterschiedliche Linienstärke</span></div>
 <Choices {...{selected,onSelect}} name="Gedachte physikalische Bedingungen des Spektrums vergleichen" labels={['Bedingungen A','Bedingungen B']}/>
 <p className="people-evidence-observation" role="status">{selected?'Linie 2 ist jetzt kräftiger, obwohl die Stoffzusammensetzung im Beispiel gleich gehalten wurde. Aus der Strichstärke allein folgt deshalb kein genauer Stoffanteil.':'Die drei Linien sind unterschiedlich kräftig. Ihre Stärke muss zusammen mit den Bedingungen ihrer Entstehung untersucht werden.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene qualitative Schematik ohne reale Stoff-, Wellenlängen- oder Temperaturzuordnung. Kein echtes Sternspektrum, keine Saha-Rechnung oder Konzentrationsmessung. Die frei gewählten Stärken behaupten keinen bestimmten Temperaturverlauf eines wirklichen Elements. Temperatur, Anregung und Ionisation sind bei realer Auswertung zu berücksichtigen.</p>
 </>;}
export function DiffractionEvidenceFigure({selected,onSelect}:Props){return <>
 <h4>Messinformation und Strukturvorstellung trennen</h4>
 <p>Das linke Feld steht nur symbolisch für aufgezeichnete Messinformation. Mit dem zweiten Schritt kommt eine ausdrücklich gedachte Strukturvorstellung hinzu. Sie wird nicht allein aus diesen frei gezeichneten Punkten berechnet.</p>
 <div className="people-evidence-comparison is-comparing">
  <figure><svg viewBox="0 0 240 180" role="img" aria-label="Frei erfundenes Punktfeld als Symbol für Messinformation, kein historisches Beugungsbild"><rect x="12" y="12" width="216" height="156" rx="8" fill="#fff" stroke={INK} strokeWidth="2"/>{[[50,50],[110,45],[180,58],[70,98],[155,107],[103,139],[196,132]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%2?5:8} fill={INK}/>)}</svg><figcaption><strong>Symbol für Messinformation</strong><span>Die Punkte sind frei erfunden. Daraus darf keine wirkliche DNA-Struktur abgelesen werden.</span></figcaption></figure>
  {selected===1&&<figure><svg viewBox="0 0 240 180" role="img" aria-label="Eigene vereinfachte gedachte Doppelhelix als Strukturvorstellung, nicht aus dem benachbarten Punktfeld berechnet">{Array.from({length:9},(_,i)=>{const y=20+i*17.5,x=120+48*Math.sin(2*Math.PI*i/8);return <path key={i} d={'M'+x+' '+y+'H'+(240-x)} stroke="#467889" strokeWidth="3"/>;})}{[1,-1].map(sign=><path key={sign} d={Array.from({length:101},(_,i)=>(i?'L':'M')+(120+sign*48*Math.sin(2*Math.PI*i/100)).toFixed(2)+' '+(20+i*1.4).toFixed(2)).join('')} fill="none" stroke={INK} strokeWidth="5"/>)}</svg><figcaption><strong>Gedachtes Strukturmodell</strong><span>Eine erklärende Form ist eine andere Darstellung als ein aufgezeichnetes Messmuster.</span></figcaption></figure>}
 </div>
 <Choices {...{selected,onSelect}} name="Messinformation und Strukturmodell unterscheiden" labels={['Messinformation betrachten','Strukturvorstellung dazunehmen']}/>
 <p className="people-evidence-observation" role="status">{selected?'Ein Modell soll Messungen erklären. Die gezeichnete Form ist aber kein zusätzlich gemessener Befund und diese Gegenüberstellung kein Beweis für eine Doppelhelix.':'Ein aufgezeichnetes Muster liefert begrenzte Information. Die genaue Basenfolge ist in diesem Symbolfeld nicht enthalten.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene begriffliche Schematik mit ausdrücklich erfundenem Punktfeld, keine Photo51-Reproduktion, reale Beugungsmessung, historische Apparatur oder Beugungsrechnung. Form und Abstände sind nicht maßstabsgetreu. Die historische Messarbeit von Franklin und Gosling wird im Artikel erklärt; Strukturuntersuchung und Bestimmung der DNA-Buchstabenfolge bleiben verschiedene Fragen.</p>
 </>;}
function pulseTrace(y:number){let d='M20 '+y;for(const x of[50,115,180,245])d+='H'+(x-9)+'L'+x+' '+(y-45)+'L'+(x+9)+' '+y;return d+'H283';}
export function PulseEvidenceFigure({selected,onSelect}:Props){return <>
 <h4>Eine Spur erneut beobachten</h4>
 <p>Eine erfundene Messreihe zeigt ähnliche Spitzen bei 1, 3, 5 und 7 Zeiteinheiten. Eine zweite gedachte Beobachtung kann dazugenommen werden. Beide Reihen sind Lernbeispiele.</p>
 <svg viewBox="0 0 300 245" role="img" aria-label={'Eigene gedachte Radiospur mit Spitzen bei 1, 3, 5 und 7'+(selected?' und einer zweiten Vergleichsbeobachtung':'')} data-pulse-observations={selected?2:1}>
  <TimeAxis ticks={[50,115,180,245]} labels={[1,3,5,7]}/><path d={pulseTrace(115)} fill="none" stroke={INK} strokeWidth="4"/>{selected===1&&<path d={pulseTrace(228)} fill="none" stroke={ACCENT} strokeWidth="4"/>}
 </svg>
 <div className="people-evidence-legend"><span>Waagerecht: gedachte Zeiteinheiten</span><span>Oben: erste Beobachtung{selected?' · unten: zweite Beobachtung':''}</span></div>
 <Choices {...{selected,onSelect}} name="Eine oder zwei gedachte Radioaufzeichnungen vergleichen" labels={['Eine Beobachtung','Zweite Beobachtung dazu']}/>
 <p className="people-evidence-observation" role="status">{selected?'Die regelmäßigen Abstände treten in der zweiten gedachten Reihe wieder auf. Das stützt die Beschreibung des Musters; die Herkunft bleibt zusätzlich zu prüfen.':'Zwischen den Spitzen liegen jeweils zwei Zeiteinheiten. Diese Regelmäßigkeit allein identifiziert noch keinen Pulsar und schließt irdische Störungen nicht aus.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene erfundene Spuren, keine historische Bell-Burnell-Aufzeichnung, echte Pulsarperiode oder Tonaufnahme. Radio bezeichnet elektromagnetische Strahlung; die Grafik ist kein im Weltraum direkt gehörter Ton. Die zweite Reihe ist ein gedanklicher Vergleich, keine unabhängige reale Bestätigung.</p>
 </>;}
