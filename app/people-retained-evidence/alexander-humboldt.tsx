// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleHeightTemperatureFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const heights=[500,1500,2500],temperatures=selected===0?[18,12,6]:[22,16,10],xs=[48,167,286];
 const points=temperatures.map((temperature,i)=>({x:xs[i],y:206-temperature/24*180,temperature,height:heights[i]}));
 const name=selected===0?'A':'B',colour=selected===0?'#286a7b':'#b9552b';
 return <>
  <h4>Zwei gedachte Notizen vergleichen</h4>
  <p>Unsere frei erfundenen Notizen ordnen drei Höhen jeweils eine Temperatur zu. Wechsle die Notiz und vergleiche dieselben Höhen. Die Achsen und ihre Einteilung bleiben gleich.</p>
  <svg viewBox="0 0 320 240" role="img" aria-label={`Eigene erfundene Notiz ${name}: ${points.map(p=>`${p.height} Meter Höhe, ${p.temperature} Grad Celsius`).join('; ')}. Gleiche Achsen in beiden Ansichten. Keine historischen Messdaten oder Wettervorhersage.`}>
   <path d="M48 26V206H286" fill="none" stroke="#6e8b93" strokeWidth="2"/>
   <path d="M48 26H286M48 116H286" fill="none" stroke="#567579" strokeWidth="1.5" strokeDasharray="4 5"/>
   <path data-humboldt-series="true" d={points.map((p,i)=>`${i===0?'M':'L'}${p.x} ${p.y}`).join('')} fill="none" stroke={colour} strokeWidth="3"/>
   {points.map(p=><circle key={p.height} data-humboldt-height={p.height} data-humboldt-temperature={p.temperature} cx={p.x} cy={p.y} r="7" fill={colour} stroke="white" strokeWidth="2"/>)}
  </svg>
  <p>Waagerecht: Höhe von 500 bis 2500 Metern. Senkrecht: Temperatur von 0 bis 24 Grad Celsius.</p>
  <div className="people-evidence-legend" style={{display:'grid',gridTemplateColumns:'1fr'}}>{points.map(p=><span key={p.height} data-height-temperature-note={p.height}>{p.height} m Höhe: {p.temperature} °C</span>)}</div>
  <div className="visual-choice" role="group" aria-label="Gedachte Höhennotiz wählen"><button aria-pressed={selected===0} onClick={()=>onSelect(0)}>Notiz A</button><button aria-pressed={selected===1} onClick={()=>onSelect(1)}>Notiz B</button></div>
  <p className="people-evidence-observation" role="status">Angezeigt ist die erfundene Notiz {name}. Die drei Höhenangaben gelten für beide Notizen; die jeweils zugeordneten Temperaturen stehen in der Liste.</p>
  <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Alle sechs Temperaturen sind erfunden, keine Werte von Humboldts Reise. Die gezeichneten Linien verbinden nur die drei Beispielpunkte; sie sind keine allgemeine Temperaturregel. Wetter, Jahreszeit, Lage und Boden werden nicht berechnet. Aus diesen Notizen lässt sich weder eine Pflanzenart noch das Klima eines wirklichen Ortes bestimmen.</p>
 </>;
}
