// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleGenerationsFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const offspring=selected===1,count=offspring?16:8,aCount=offspring?12:4;
 return <>
  <h4>Andere Häufigkeiten in einer neuen Generation</h4>
  <p>Unser erfundenes Beispiel beginnt mit vier A- und vier B-Lebewesen. Wir nehmen an: Die Varianten werden vererbt, jedes A-Lebewesen hat drei Nachkommen und jedes B-Lebewesen einen. Die nächste Generation besteht aus anderen Individuen.</p>
  <svg viewBox="0 0 320 210" role="img" aria-label={`${offspring?'Neue Nachkommengeneration':'Elterngeneration'}: ${aCount} gestreifte A-Kreise und vier B-Kreise mit Kreuz. Keine Umwandlung eines einzelnen Lebewesens. Die Zahlen sind erfunden.`}>
   {Array.from({length:count},(_,i)=>{const a=i<aCount,x=52+(i%4)*72,y=28+Math.floor(i/4)*49;return <g key={`${offspring?'offspring':'parents'}-${i}`} data-generation-variant={a?'A':'B'} data-generation-position={i}><circle cx={x} cy={y} r="17" fill={a?'#e4eef0':'#fff1e6'} stroke={a?'#286a7b':'#a44923'} strokeWidth="2.5"/>{a?<path d={`M${x-8} ${y-7}H${x+8}M${x-8} ${y}H${x+8}M${x-8} ${y+7}H${x+8}`} fill="none" stroke="#286a7b" strokeWidth="2.5"/>:<path d={`M${x-7} ${y-7}L${x+7} ${y+7}M${x-7} ${y+7}L${x+7} ${y-7}`} fill="none" stroke="#a44923" strokeWidth="2.5"/>}</g>;})}
  </svg>
  <div className="people-evidence-legend" style={{display:'grid',gridTemplateColumns:'1fr'}}><span>A: gestreifter Kreis, hier {aCount} von {count}.</span><span>B: Kreis mit Kreuz, hier 4 von {count}.</span><span>Jeder Kreis steht für ein anderes Lebewesen.</span></div>
  <div className="visual-choice" role="group" aria-label="Generation im Gedankenbeispiel wählen"><button aria-pressed={!offspring} onClick={()=>onSelect(0)}>Elterngeneration</button><button aria-pressed={offspring} onClick={()=>onSelect(1)}>Neue Generation</button></div>
  <p className="people-evidence-observation" role="status">{offspring?'Die neue Generation hat zwölf A- und vier B-Lebewesen. Der A-Anteil beträgt drei Viertel.':'Die Elterngeneration hat vier A- und vier B-Lebewesen. Der A-Anteil beträgt die Hälfte.'} Nicht ein einzelnes Lebewesen wechselt seine Variante.</p>
  <p className="small-note">Eigenes Gedankenmodell mit KI-Unterstützung, keine historischen Messdaten oder wirkliche Tierpopulation. Vererbung und unterschiedliche Nachkommenzahlen sind hier ausdrücklich vorgegeben. Paarung, Gene, Zufall, Zu- und Abwanderung sowie Umweltwechsel werden nicht berechnet. Das Beispiel erklärt einen möglichen Zusammenhang natürlicher Selektion; aus einer bloßen Häufigkeitsänderung in der Natur wäre ihre Ursache noch nicht bewiesen. „Häufiger“ bedeutet weder allgemein besser noch ein festes Ziel der Evolution.</p>
 </>;
}
