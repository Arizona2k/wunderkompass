// Own retained-topic teaching figure; invented examples and limits are explicit.
type Props={selected:number;onSelect:(value:number)=>void};
const sources=['ADDIERE 2 3','ADD 2 3'];
export function PeopleInstructionMeaningFigure({selected,onSelect}:Props){const input=sources[selected===1?1:0];const[word,a,b]=input.split(' ');const numbers=[Number(a),Number(b)];const operation=({ADDIERE:'plus',ADD:'plus'}as Record<string,string>)[word];const result=operation==='plus'?numbers[0]+numbers[1]:null;return <>
 <h4>Andere Wörter, dieselbe Rechenanweisung</h4>
 <p>Unsere eigene Mini-Regel ordnet nur den beiden Wörtern ADDIERE und ADD die Addition zu. Wähle die Schreibweise und vergleiche die Bedeutung.</p>
 <div className="people-evidence-comparison is-comparing" data-instruction-meaning={operation}>
  <figure><figcaption><strong>1 · Eingabe</strong><code>{input}</code><span>{selected===1?'Englisches Wort':'Deutsches Wort'} für Addition, danach die beiden Zahlen.</span></figcaption></figure>
  <figure><figcaption><strong>2 · Unsere Zuordnung</strong><code>{operation}({a}, {b})</code><span>Beide Wörter werden derselben eigenen Operationsbezeichnung zugeordnet.</span></figcaption></figure>
  <figure><figcaption><strong>3 · Kleine Probe</strong><span>{a} + {b} = {result}</span><span>Dieselben Zahlen und dieselbe Rechenart ergeben dieselbe Summe.</span></figcaption></figure>
 </div>
 <div className="visual-choice" role="group" aria-label="Zwei eigene gleichbedeutende Schreibweisen vergleichen">{['Mit ADDIERE','Mit ADD'].map((label,index)=><button key={label} aria-pressed={selected===index} onClick={()=>onSelect(index)}>{label}</button>)}</div>
 <p className="people-evidence-observation" role="status">{input} wird in unserer Mini-Regel zu {operation}({a}, {b}). Das Wort ändert sich; Addition, Zahlen und Ergebnis {result} bleiben gleich.</p>
 <p className="small-note">Eigenes Gedankenbeispiel mit KI-Unterstützung, kein historischer FLOW-MATIC- oder COBOL-Code. „plus(2, 3)“ ist eine eigene Zwischenbeschreibung und keine echte Maschinenanweisung. Diese kleine festgelegte Zuordnung zeigt nur einen Teilgedanken der Sprachübersetzung; sie ist kein vollständiger Compiler. Allgemeine Sprache, weitere Befehle, Fehlerbehandlung, Computerhardware und reale Programme werden nicht simuliert. Richtig zu übersetzen ersetzt nicht die Prüfung, ob der ursprüngliche Rechenplan die gewünschte Aufgabe löst.</p>
 </>;}
