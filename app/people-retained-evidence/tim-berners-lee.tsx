// Own retained-topic teaching figure; invented examples and limits are explicit.
type Props={selected:number;onSelect:(value:number)=>void};
const notes=[{id:'B',text:'Heute malen wir einen Kreis.'},{id:'C',text:'Heute zeichnen wir ein Dreieck.'}];
export function PeopleWebLinksFigure({selected,onSelect}:Props){const note=notes[selected===1?1:0];return <>
 <h4>Welche Notiz zeigt der Verweis?</h4>
 <p>Unsere erfundene Ausgangsnotiz A enthält Verweise auf B und C. Wähle ein Ziel. Alle drei Notizen bleiben vorhanden; unten wird nur die ausgewählte Zielnotiz gezeigt.</p>
 <svg viewBox="0 0 320 270" role="img" aria-label={'Eigene drei erfundene Notizen A, B und C. Zwei mögliche Verweise führen von A zu B oder C. Hervorgehoben: A nach '+note.id+'. Die Pfeile stellen keine Datenkabel dar.'} data-web-note-target={note.id}>
  {[{id:'B',y:65},{id:'C',y:205}].map(target=><path key={target.id} d={'M100 135L200 '+target.y+'M'+(target.id==='B'?'183 67L200 65L192 81':'192 189L200 205L183 203')} fill="none" stroke={target.id===note.id?'#b7572f':'#688f98'} strokeWidth={target.id===note.id?4:2} strokeDasharray={target.id===note.id?undefined:'5 4'}/>)}
  {[{id:'A',x:30,y:93},{id:'B',x:205,y:23},{id:'C',x:205,y:163}].map(item=><g key={item.id}><rect x={item.x} y={item.y} width="72" height="88" rx="5" fill="#fff" stroke={item.id===note.id?'#b7572f':'#234e58'} strokeWidth={item.id===note.id?4:2}/><path d={'M'+(item.x+13)+' '+(item.y+19)+'h46M'+(item.x+13)+' '+(item.y+30)+'h36'} stroke="#467889" strokeWidth="3"/><text x={item.x+36} y={item.y+68} textAnchor="middle" fontSize="27" fill="#234e58">{item.id}</text></g>)}
 </svg>
 <ul className="people-evidence-legend"><li>A: unsere feste Ausgangsnotiz.</li><li>B und C: zwei feste mögliche Zielnotizen.</li><li>Pfeil: ein Verweis zwischen Notizen.</li></ul>
 <div className="visual-choice" role="group" aria-label="Ziel einer erfundenen Verknüpfung auswählen">{notes.map((item,index)=><button key={item.id} aria-pressed={selected===index} onClick={()=>onSelect(index)}>Notiz {item.id} anzeigen</button>)}</div>
 <div className="people-evidence-observation" role="status"><strong>Ausgewählte Zielnotiz {note.id}:</strong><p>{note.text}</p></div>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Notizen, Sätze und Anordnung sind frei erfunden, keine Rekonstruktion der ersten Website. Der Schalter wählt zwischen bereits hinterlegten Inhalten. Die Pfeile zeigen logische Verweise und weder physische Leitungen noch tatsächlich übertragene Daten. Server, Internetprotokolle, Suchmaschine, Ladezeiten und Speicher werden nicht simuliert. Ein echter Verweis kann ein nicht mehr verfügbares Ziel haben; hier bleiben beide eigenen Zielnotizen ausdrücklich vorhanden.</p>
 </>;}
