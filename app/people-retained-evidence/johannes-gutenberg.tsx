// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleReusableLettersFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const letters=selected===0?['T','O','R']:['O','R','T'];
 return <>
  <h4>Dieselben drei Buchstaben, eine neue Folge</h4>
  <p>Unser eigenes Kartenbild verwendet genau ein T, ein O und ein R. Der Schalter ordnet dieselben drei Karten neu. Lies sie jeweils von links nach rechts.</p>
  <svg viewBox="0 0 320 190" role="img" aria-label={`Eigene lesbare Buchstabenkarten in der Folge ${letters.join('–')}. Dieselben drei Karten, keine historische Druckform.`}>
   {letters.map((letter,index)=><g key={letter} data-reusable-letter={letter} data-position={index}><rect x={15+index*105} y="45" width="80" height="100" rx="5" fill="#d6e5e5" stroke="#234e58" strokeWidth="2"/><text x={55+index*105} y="113" textAnchor="middle" fontSize="48" fill="#234e58">{letter}</text></g>)}
  </svg>
  <div className="people-evidence-legend"><span>Vorrat bleibt gleich: ein T, ein O und ein R.</span><span>Gelesene Folge: <strong>{letters.join('')}</strong>.</span></div>
  <div className="visual-choice" role="group" aria-label="Reihenfolge derselben Buchstabenkarten"><button aria-pressed={selected===0} onClick={()=>onSelect(0)}>T – O – R legen</button><button aria-pressed={selected===1} onClick={()=>onSelect(1)}>O – R – T legen</button></div>
  <p className="people-evidence-observation" role="status">{selected===0?'Die Karten bilden TOR.':'Die Karten bilden ORT.'} Keine Karte kommt hinzu und keine verschwindet. Die neue Anordnung verändert hier die gelesene Folge.</p>
  <p className="small-note">Eigene Modellzeichnung mit KI-Unterstützung. Neu erfundene lesbare Buchstabenkarten, keine Originallettern, historische Schrift oder Druckerpresse. Die Karten sind ausdrücklich nicht seitenverkehrt; wirkliche Druckformen verwenden spiegelverkehrte Zeichen. Das Bild zeigt nur Anordnung und Wiederverwendung, nicht Guss, Farbe, Druck, Papierverbrauch oder die ganze Geschichte des Druckens.</p>
 </>;
}
