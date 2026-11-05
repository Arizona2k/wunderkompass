// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleOrderedOperationsFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const first=(value:number)=>selected===0?value+3:value*2;
 const second=(value:number)=>selected===0?value*2:value+3;
 const start=2,middle=first(start),end=second(middle),operations=selected===0?['+ 3','× 2']:['× 2','+ 3'];
 const values=[start,middle,end];
 return <>
  <h4>Dieselben Schritte, eine andere Reihenfolge</h4>
  <p>Wir beginnen immer bei zwei. Wähle, ob zuerst drei addiert oder zuerst verdoppelt wird. Der zweite Schritt arbeitet jeweils mit dem entstandenen Zwischenwert.</p>
  <svg viewBox="0 0 320 230" role="img" aria-label={`Eigener Rechenweg: Start ${start}, dann ${operations[0]} ergibt ${middle}, dann ${operations[1]} ergibt ${end}. Kein historischer Maschinenlauf.`}>
   {values.map((value,i)=><g key={i} data-operation-stage={i} data-value={value}><rect x={15+i*110} y="90" width="70" height="70" rx="6" fill="#d6e5e5" stroke="#234e58" strokeWidth="2"/><text x={50+i*110} y="136" textAnchor="middle" fontSize="34" fill="#234e58">{value}</text></g>)}
   {operations.map((operation,i)=><g key={i} data-operation-label={operation}><text x={105+i*110} y="70" textAnchor="middle" fontSize="28" fill="#234e58">{operation}</text><path d={`M${88+i*110} 125H${121+i*110}m-8-8 8 8-8 8`} fill="none" stroke="#b7572f" strokeWidth="3"/></g>)}
  </svg>
  <ol className="people-evidence-legend"><li>Startwert: {start}.</li><li>Erster Schritt {operations[0]}: Zwischenwert {middle}.</li><li>Zweiter Schritt {operations[1]}: Endwert {end}.</li></ol>
  <div className="visual-choice" role="group" aria-label="Reihenfolge der Rechenschritte"><button aria-pressed={selected===0} onClick={()=>onSelect(0)}>Erst plus drei, dann mal zwei</button><button aria-pressed={selected===1} onClick={()=>onSelect(1)}>Erst mal zwei, dann plus drei</button></div>
  <p className="people-evidence-observation" role="status">{selected===0?'Aus zwei wird erst fünf und danach zehn: (2 + 3) × 2 = 10.':'Aus zwei wird erst vier und danach sieben: (2 × 2) + 3 = 7.'} Gleicher Start und dieselben zwei Operationen ergeben hier bei vertauschter Reihenfolge verschiedene Endwerte.</p>
  <p className="small-note">Eigene Modellzeichnung mit KI-Unterstützung. Heutiges erfundenes Zweischritt-Beispiel, keine Bernoulli-Rechnung Lovelaces, historische Lochkarte, Musikaufführung oder Simulation der Analytical Engine. Ein nachvollziehbarer Rechenplan und der tatsächliche Bau einer historischen Maschine brauchen unterschiedliche Nachweise. Das Beispiel behauptet nicht, dass jede beliebige Vertauschung von Rechenschritten das Ergebnis ändern muss.</p>
 </>;
}
