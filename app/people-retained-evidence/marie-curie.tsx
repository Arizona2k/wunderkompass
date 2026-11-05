// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleMeasurementHypothesisFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const baseline=230,unit=30,values=[{id:'A',value:2,x:95},{id:'B',value:5,x:205}];
 return <>
  <h4>Ein Befund bleibt – eine Vermutung kommt hinzu</h4>
  <p>Unser erfundenes Zahlenbild zeigt zwei Vergleichswerte auf derselben Skala von null bis sechs. Der Schalter verändert die zusätzliche Erklärung, nicht die gezeichneten Werte.</p>
  <svg viewBox="0 0 320 280" role="img" aria-label="Eigene erfundene Vergleichswerte: A gleich zwei und B gleich fünf auf gemeinsamer Skala von null bis sechs. Keine realen Strahlungsmessungen.">
   <path d="M55 40V230H290" fill="none" stroke="#234e58" strokeWidth="2"/>
   {[0,3,6].map(n=><g key={n}><path d={`M49 ${baseline-n*unit}H55`} stroke="#234e58"/><text x="42" y={baseline-n*unit+9} textAnchor="end" fontSize="28" fill="#234e58">{n}</text></g>)}
   {values.map(({id,value,x})=><g key={id} data-observation-bar={id} data-value={value}>
    <rect x={x} y={baseline-value*unit} width="48" height={value*unit} rx="3" fill="#467889"/>
    {Array.from({length:value},(_,i)=><circle key={i} cx={x+24} cy={baseline-15-i*unit} r="4" fill="white"/>)}
    <text x={x+24} y={baseline-value*unit-12} textAnchor="middle" fontSize="28" fill="#234e58">{value}</text>
    <text x={x+24} y="268" textAnchor="middle" fontSize="28" fill="#234e58">{id}</text>
   </g>)}
  </svg>
  <ol className="people-evidence-legend"><li>A: zwei erfundene Vergleichseinheiten.</li><li>B: fünf erfundene Vergleichseinheiten.</li><li>Beide Balken beginnen bei null und verwenden dieselbe Skala. Die Punkte helfen beim Zählen.</li></ol>
  <div className="visual-choice" role="group" aria-label="Daten und Deutung unterscheiden"><button aria-pressed={selected===0} onClick={()=>onSelect(0)}>Nur Werte betrachten</button><button aria-pressed={selected===1} onClick={()=>onSelect(1)}>Vermutung ergänzen</button></div>
  <p className="people-evidence-observation" role="status">{selected===0?'B ist in unserem Zahlenbild größer als A. Das beschreibt den vorgegebenen Vergleich.':'Vermutung: Ein zusätzlicher Einfluss könnte den Unterschied erklären. Welche Ursache tatsächlich vorliegt, braucht weitere geeignete Untersuchungen. Die Werte bleiben zwei und fünf.'}</p>
  <p className="small-note">Eigene Modellzeichnung mit KI-Unterstützung. Die Zahlen sind erfunden, ohne physikalische Einheit. Keine historischen Messdaten, Strahlendosis, Stoffprobe, Elementbestimmung oder Laboranleitung. Der Schalter zeigt eine prüfbare Vermutung; er erzeugt keinen neuen Messwert und beweist keine Ursache.</p>
 </>;
}
