// Own separate authoring only. Active PR90 does not import these components.
type Props={selected:number;onSelect:(value:number)=>void};
const INK='#234e58',BLUE='#467889',ORANGE='#b7572f';
function Choice({labels,name,selected,onSelect}:{labels:[string,string];name:string}&Props){return <div className="visual-choice" role="group" aria-label={name}>{labels.map((label,i)=><button key={label} aria-pressed={selected===i} onClick={()=>onSelect(i)}>{label}</button>)}</div>;}
export function DirectionCountEvidenceFigure({selected,onSelect}:Props){const counts=selected===1?[6,2]:[4,4];return <>
 <h4>Gleiche Gesamtzahl, andere Verteilung</h4><p>Frei erfundene Markierungen: Vergleiche vier und vier mit sechs und zwei. Beide Ansichten enthalten zusammen acht.</p>
 <svg viewBox="0 0 320 220" role="img" aria-label={'Eigenes erfundenes Zählbild: links '+counts[0]+', rechts '+counts[1]+', zusammen acht. Keine Originalmessung Wus.'} data-direction-count={selected===1?'six-two':'four-four'}>
  <path d="M28 174H292" stroke={INK} strokeWidth="3"/>
  {counts.map((n,i)=><g key={i}><rect x={58+i*145} y={174-n*18} width="60" height={n*18} rx="4" fill={i?ORANGE:BLUE}/>{Array.from({length:n},(_,j)=><circle key={j} cx={88+i*145} cy={165-j*18} r="4.5" fill="#fff"/>)}<text x={88+i*145} y={160-n*18} textAnchor="middle" fill={INK} fontSize="27">{n}</text><text x={88+i*145} y="207" textAnchor="middle" fill={INK} fontSize="24">{i+1}</text></g>)}
 </svg>
 <ol className="people-evidence-legend"><li>Linke Seite: {counts[0]} erfundene Markierungen.</li><li>Rechte Seite: {counts[1]} erfundene Markierungen.</li></ol>
 <Choice {...{selected,onSelect}} name="Erfundene Seitenverteilungen vergleichen" labels={['Vier links, vier rechts','Sechs links, zwei rechts']}/>
 <p className="people-evidence-observation" role="status">{selected===1?'Die beiden Seiten sind unterschiedlich groß; die Summe bleibt acht.':'Die beiden Seiten sind gleich groß; die Summe ist acht.'} Für eine Erklärung eines echten Messunterschieds braucht man zusätzlich geeignete Vergleichsbedingungen und Kontrollen.</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene Zählgrafik, keine Originalwerte, Spinzeichnung oder Nachbildung des Cobalt-60-Experiments. Die bloße Ungleichheit dieser erfundenen Balken ist kein Nachweis einer Paritätsverletzung. Das Beispiel erklärt nur den Unterschied zwischen Gesamtzahl und Verteilung.</p>
 </>;}
export function FindingExplanationEvidenceFigure({selected,onSelect}:Props){const explain=selected===1;return <>
 <h4>Was wurde gefunden – was soll es erklären?</h4><p>Hahn und Straßmann wiesen Barium nach. Meitner und Frisch erklärten den Befund durch die Teilung eines schweren Atomkerns. Die eigenen Symbole unterscheiden Befund und Erklärung.</p>
 <svg viewBox="0 0 320 205" role="img" aria-label={explain?'Eigene schematische Erklärung: ein schwerer Kern links, Pfeil, zwei kleinere Kerne rechts. Keine realen Isotopenzahlen oder Maße.':'Eigenes Befundsymbol: Blatt mit drei neutralen Zeilen und Lupe. Der begleitende Text benennt den historischen chemischen Nachweis von Barium; kein originales Messblatt.'} data-finding-explanation={explain?'explanation':'finding'}>
  {explain?<><circle cx="65" cy="104" r="36" fill="#d6e5e4" stroke={INK} strokeWidth="3"/><path d="M116 104H180M168 95L180 104L168 113" fill="none" stroke={INK} strokeWidth="3"/><circle cx="240" cy="65" r="25" fill="#d6e5e4" stroke={INK} strokeWidth="3"/><circle cx="240" cy="141" r="25" fill="#d6e5e4" stroke={INK} strokeWidth="3"/><path d="M187 100L206 78M187 108L206 130" stroke={ORANGE} strokeWidth="3"/></>:<><path d="M67 22H219V169H67Z" fill="#fff" stroke={INK} strokeWidth="3"/><path d="M89 51H193M89 76H193M89 101H159" stroke={BLUE} strokeWidth="5"/><circle cx="203" cy="119" r="35" fill="#eaf1f1" stroke={ORANGE} strokeWidth="4"/><path d="M228 146L263 184" stroke={ORANGE} strokeWidth="9" strokeLinecap="round"/></>}
 </svg>
 <Choice {...{selected,onSelect}} name="Befund und Erklärung unterscheiden" labels={['Chemischen Befund betrachten','Physikalische Erklärung betrachten']}/>
 <p className="people-evidence-observation" role="status">{explain?'Die Zeichnung stellt den erklärenden Gedanken einer Kernteilung dar. Eine gewöhnliche chemische Bindungsänderung ist damit nicht gemeint.':'Das Blatt ist ein eigenes Zeichen für einen dokumentierten Befund. Es ist keine abgebildete historische Laboraufzeichnung.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene Symbole ohne Originaldaten. Die Kreise sind nicht maßstäblich und stehen nicht für bestimmte Isotope, berechnete Kernmassen oder Nukleonenzahlen. Das Schema zeigt weder eine Durchführung noch den ganzen Energie- oder Reaktionsverlauf. Historische Befunde und Erklärungsbeiträge bleiben getrennt benannt.</p>
 </>;}
function Arrow({a,b}:{a:[number,number];b:[number,number]}){const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),ux=dx/length,uy=dy/length,x=a[0]+dx*.62,y=a[1]+dy*.62;return <g fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d={'M'+a.join(' ')+'L'+b.join(' ')}/><path d={'M'+(x-ux*12-uy*7)+' '+(y-uy*12+ux*7)+'L'+x+' '+y+'L'+(x-ux*12+uy*7)+' '+(y-uy*12-ux*7)}/></g>;}
export function ExhibitionRouteEvidenceFigure({selected,onSelect}:Props){const second=selected===1,entry:[number,number]=[45,185],exit:[number,number]=[275,185],one:[number,number]=[85,66],two:[number,number]=[235,107],points=second?[entry,two,one,exit]:[entry,one,two,exit];return <>
 <h4>Dieselben Stationen – zwei Rundgänge</h4><p>Eigener erfundener Ausstellungsplan: Eingang, Ausgang und die Orte beider Stationen bleiben fest. Der Schalter ändert nur, welche Station zuerst besucht wird.</p>
 <svg viewBox="0 0 320 225" role="img" aria-label={'Eigener nicht maßstäblicher Plan: Eingang, Station'+(second?'2, dann Station 1':'1, dann Station 2')+', Ausgang. Beide Stationsorte bleiben gleich.'} data-exhibition-route={second?'two-one':'one-two'}>
  <path d="M28 185H16V18H304V185H293M62 185H258" fill="none" stroke={INK} strokeWidth="3"/>
  {points.slice(0,-1).map((a,i)=><Arrow key={i} a={a} b={points[i+1]}/>)}
  <circle cx="85" cy="66" r="22" fill={BLUE}/><path d="M235 81L261 107L235 133L209 107Z" fill={ORANGE}/>
  <text x="85" y="74" fill="#fff" textAnchor="middle" fontSize="24">1</text><text x="235" y="115" fill="#fff" textAnchor="middle" fontSize="24">2</text><text x="45" y="216" fill={INK} textAnchor="middle" fontSize="24">E</text><text x="275" y="216" fill={INK} textAnchor="middle" fontSize="24">A</text>
 </svg>
 <div className="people-evidence-legend"><span>E: Eingang · A: Ausgang</span><span>Station 1: Kreis · Station 2: Raute</span></div>
 <Choice {...{selected,onSelect}} name="Reihenfolge des erfundenen Rundgangs wechseln" labels={['Zuerst Station 1','Zuerst Station 2']}/>
 <p className="people-evidence-observation" role="status">{second?'Der Weg besucht zuerst Station 2 und dann Station 1.':'Der Weg besucht zuerst Station 1 und dann Station 2.'} Die beiden Stationsorte wurden nicht verschoben. Pfeile und Nummern ergänzen die Farben.</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigener Plan, kein Hadid-Grundriss und keine Bauanleitung. Die Umrandung, Wege und Symbole sind nicht maßstäblich. Maße, Höhen, Materialien und Lasten fehlen; das Bild belegt keine Tragfähigkeit, Brandsicherheit oder barrierefreie Nutzung eines echten Gebäudes. Mehrere begründete Rundgänge bleiben möglich.</p>
 </>;}
const OWN_LINE='M45 150C30 105 75 65 125 95C170 40 235 45 258 95C275 155 185 190 115 155C90 210 40 195 45 150';
export function InventedLineEvidenceFigure({selected,onSelect}:Props){const added=selected===1;return <>
 <h4>Welche Bildidee kann aus einer Linie entstehen?</h4><p>Unsere eigene freie Linie bleibt in beiden Ansichten gleich. Danach ergänzen wir einen Punkt und eine kurze Schnabellinie als eine mögliche Deutung.</p>
 <svg viewBox="0 0 320 230" role="img" aria-label={added?'Eigene unveränderte freie Grundlinie mit ergänztem Punkt und Schnabellinie. Diese Ergänzungen können eine Vogeldeutung unterstützen.':'Eigene freie geschlossene Linie mit mehreren Bögen, ohne den später ergänzten Punkt und Schnabel. Keine Tagore-Zeichnung.'} data-invented-line={added?'added':'base'}>
  <path d={OWN_LINE} fill="none" stroke={BLUE} strokeWidth="4" strokeLinejoin="round"/>
  {added&&<><circle cx="230" cy="92" r="5" fill={ORANGE}/><path d="M260 100L285 109L262 119" fill="none" stroke={ORANGE} strokeWidth="4" strokeLinejoin="round"/></>}
 </svg>
 <Choice {...{selected,onSelect}} name="Eigene Grundlinie und bewusste Ergänzungen vergleichen" labels={['Nur die eigene Grundlinie','Punkt und Schnabel ergänzen']}/>
 <p className="people-evidence-observation" role="status">{added?'Punkt und Schnabellinie können die Vorstellung eines Vogels stützen. Das ist eine mögliche begründete Bildidee, keine vorgeschriebene Fantasie.':'Die freie Linie kann unterschiedliche Vorstellungen anregen. Überlege, welches sichtbare Merkmal deine eigene Idee stützt.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Alle Formen sind neu erfunden und reproduzieren weder ein Bild noch eine Manuskriptseite Tagores. Der Schalter verändert nur die zusätzlichen Zeichen. Eine freie Deutung wird nicht automatisch als richtig oder falsch bewertet; die Auswahlaufgaben prüfen ausdrücklich benannte Bildmerkmale und Quellenangaben.</p>
 </>;}
export function TextTransmissionEvidenceFigure({selected,onSelect}:Props){const copy=selected===1,active=copy?2:0;return <>
 <h4>Ein älterer Text in einem späteren Buch</h4><p>Der Kanon der Medizin entstand zuerst auf Arabisch. Eine lateinische Übersetzung und das später hergestellte Winchester-Exemplar gehören zu anderen Zeitpunkten.</p>
 <svg viewBox="0 0 320 190" role="img" aria-label={'Eigenes geordnetes Zeitbild mit drei festen Stationen: früher arabischer Text im 11. Jahrhundert, lateinische Übersetzung im 12. Jahrhundert, Winchester-Abschrift im 15. Jahrhundert. Hervorgehoben: '+(copy?'das konkrete spätere Exemplar.':'die frühere Textentstehung.')} data-text-transmission={copy?'copy':'text'}>
  <path d="M97 92H123M114 85L123 92L114 99M197 92H223M214 85L223 92L214 99" fill="none" stroke={INK} strokeWidth="3"/>
  {[60,160,260].map((x,i)=><g key={i}><circle cx={x} cy="92" r="33" fill={active===i?'#fff':'#d6e5e4'} stroke={active===i?ORANGE:BLUE} strokeWidth={active===i?4:2}/><path d={'M'+(x-19)+' 78Q'+(x-9)+' 71 '+x+' 78Q'+(x+9)+' 71 '+(x+19)+' 78V108Q'+(x+9)+' 101 '+x+' 108Q'+(x-9)+' 101 '+(x-19)+' 108ZM'+x+' 78V108'} fill="none" stroke={INK} strokeWidth="2"/><text x={x} y="151" textAnchor="middle" fontSize="24" fill={INK}>{i+1}</text></g>)}
 </svg>
 <ol className="people-evidence-legend"><li>Frühes 11. Jahrhundert: arabischer Ausgangstext.</li><li>12. Jahrhundert: Übersetzung ins Lateinische.</li><li>15. Jahrhundert: konkrete lateinische Winchester-Abschrift.</li></ol>
 <Choice {...{selected,onSelect}} name="Textentstehung und konkrete Abschrift unterscheiden" labels={['Frühere Textentstehung','Späteres Winchester-Exemplar']}/>
 <p className="people-evidence-observation" role="status">{copy?'Die Datierung ins 15. Jahrhundert gehört zu diesem später hergestellten Exemplar. Sie ist nicht Ibn Sinas Lebenszeit oder die erste Entstehung des Textes.':'Die frühere Textentstehung ist von späteren Übersetzungen und einzelnen Buchobjekten zu unterscheiden. Der Autor lebte 980–1037.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene Buchsymbole und zeitliche Ordnung, keine historischen Buchseiten oder Unterschriften. Die Abstände sind nicht maßstäblich. Das gesondert beschriebene arabische British-Library-Exemplar von 1659 ist ein anderes Objekt und wird nicht mit der Winchester-Handschrift vermischt. Das Bild untersucht Überlieferung, nicht heutige Behandlungsgültigkeit.</p>
 </>;}
