// Own retained-topic teaching figure; invented examples and limits are explicit.
type Props={selected:number;onSelect:(value:number)=>void};
export function PeopleEqualStepsFigure({selected,onSelect}:Props){const after=selected===1;return <>
 <h4>Was bleibt gleich, wenn wir beide Seiten verändern?</h4>
 <p>Eine unbekannte Zahl plus drei ergibt acht. Das Kästchen steht für diese eine unbekannte Zahl. Jeder Punkt bedeutet eine Einheit. Entferne auf beiden Seiten drei Einheiten.</p>
 <svg viewBox="0 0 320 270" role="img" aria-label={after?'Eigene Gleichungszeichnung nach dem Abziehen von drei auf beiden Seiten: dasselbe unbekannte Kästchen ist gleich fünf Einheiten.':'Eigene Gleichungszeichnung vor dem Rechenschritt: ein unbekanntes Kästchen plus drei Einheiten ist gleich acht Einheiten.'} data-equal-step={after?'both-minus-three':'before'}>
  <rect x="8" y="38" width="129" height="175" rx="5" fill="#fff" stroke="#467889" strokeWidth="2"/><rect x="183" y="38" width="129" height="175" rx="5" fill="#fff" stroke="#467889" strokeWidth="2"/>
  <rect x="43" y="62" width="59" height="53" rx="3" fill="#edf4f4" stroke="#234e58" strokeWidth="2"/><text x="73" y="100" textAnchor="middle" fontSize="32" fill="#234e58">?</text><text x="160" y="139" textAnchor="middle" fontSize="32" fill="#234e58">=</text>
  {!after&&<><text x="73" y="151" textAnchor="middle" fontSize="28" fill="#234e58">+</text>{[0,1,2].map(i=><circle key={i} cx={44+i*28} cy="185" r="7" fill="#b7572f"/>)}</>}
  {Array.from({length:after?5:8},(_,i)=><circle key={i} cx={211+(i%3)*35} cy={78+Math.floor(i/3)*46} r="8" fill="#234e58"/>)}
  <text x="73" y="249" textAnchor="middle" fontSize="24" fill="#234e58">{after?'?':'? + 3'}</text><text x="247" y="249" textAnchor="middle" fontSize="24" fill="#234e58">{after?'5':'8'}</text>
 </svg>
 <ul className="people-evidence-legend"><li>Kästchen: in beiden Ansichten dieselbe unbekannte Zahl.</li><li>Punkt: eine Einheit. Gleichheitszeichen: beide Seiten haben denselben Wert.</li><li>{after?'Links wurden die drei zusätzlichen Einheiten entfernt; rechts drei der acht. Fünf bleiben.':'Links kommen drei Einheiten zur unbekannten Zahl hinzu. Rechts stehen acht Einheiten.'}</li></ul>
 <div className="visual-choice" role="group" aria-label="Denselben Rechenschritt auf beiden Seiten ansehen">{['Vor dem Rechenschritt','Auf beiden Seiten drei abziehen'].map((label,index)=><button key={label} aria-pressed={selected===index} onClick={()=>onSelect(index)}>{label}</button>)}</div>
 <p className="people-evidence-observation" role="status">{after?'Die unbekannte Zahl ist fünf. Probe: fünf plus drei ergibt acht. Das Kästchen hat seinen Wert beim Rechenschritt nicht geändert.':'Die Gleichung beschreibt zwei gleiche Werte. Entfernst du nur rechts drei, erhältst du eine andere Aussage: ? + 3 = 5.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung und frei gewähltem Zahlenbeispiel. Moderne Kästchen und Zeichen erklären einen einfachen Rechenschritt; sie sind keine Abschrift von al-Chwarizmis Buch. Seine Algebra wurde in Worten beschrieben. Die Flächen zeigen weder Gewichte noch eine wirkliche Waage. Das Modell behandelt dieses eine Beispiel und keine allgemeine Algebra- oder Lösungsmaschine.</p>
 </>;}
