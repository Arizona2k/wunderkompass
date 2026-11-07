// Own retained-topic teaching figure; invented examples and limits are explicit.
type Props={selected:number;onSelect:(value:number)=>void};
const groups=[{id:'A',planted:10,survived:8},{id:'B',planted:20,survived:10}];
export function PeopleTreeFollowUpFigure({selected,onSelect}:Props){
 const followUp=selected===1;
 return <>
  <h4>Gepflanzt – und später noch lebend?</h4>
  <p>Zwei vollständig erfundene Gruppen: In A werden zehn, in B zwanzig Bäumchen gepflanzt. Vier gedachte Monate später sind laut Kontrollliste in A acht, in B zehn lebend. Die Zahlen sind keine Messdaten der Green-Belt-Bewegung.</p>
  <svg viewBox="0 0 320 265" role="img" aria-label={'Erfundenes Zählbild mit derselben Skala von null bis zwanzig. '+(followUp?'Nach vier gedachten Monaten: Gruppe A acht, Gruppe B zehn lebende Bäumchen.':'Bei der Pflanzung: Gruppe A zehn, Gruppe B zwanzig Bäumchen.')} data-tree-follow-up={followUp?'control-round':'planting'}>
   <path d="M43 28V210H299M36 50H43M36 210H43" fill="none" stroke="#234e58" strokeWidth="2"/>
   <text x="31" y="58" textAnchor="end" fontSize="24" fill="#234e58">20</text><text x="31" y="218" textAnchor="end" fontSize="24" fill="#234e58">0</text>
   {groups.map((group,index)=>{const count=followUp?group.survived:group.planted,x=84+index*135,y=210-count*8;return <g key={group.id}><rect x={x} y={y} width="66" height={count*8} fill={index?'#b7572f':'#467889'}/><text x={x+33} y={y-10} textAnchor="middle" fontSize="24" fill="#234e58">{count}</text><text x={x+33} y="247" textAnchor="middle" fontSize="26" fill="#234e58">{group.id}</text></g>;})}
  </svg>
  <ul className="people-evidence-legend"><li>A: anfangs zehn{followUp?', bei der Kontrollrunde acht lebend':''}.</li><li>B: anfangs zwanzig{followUp?', bei der Kontrollrunde zehn lebend':''}.</li><li>Senkrecht: Anzahl der Bäumchen; dieselbe Skala in beiden Ansichten.</li></ul>
  <div className="visual-choice" role="group" aria-label="Zeitpunkte der erfundenen Pflanzgruppen vergleichen">{['Bei der Pflanzung','Vier gedachte Monate später'].map((label,index)=><button key={label} aria-pressed={selected===index} onClick={()=>onSelect(index)}>{label}</button>)}</div>
  <p className="people-evidence-observation" role="status">{followUp?'B hat mehr lebende Bäumchen: zehn gegenüber acht. A hat den größeren Anteil an seiner eigenen Ausgangsgruppe: acht von zehn gegenüber zehn von zwanzig.':'Die Ausgangsgruppen sind verschieden groß. Die Pflanzzahl beschreibt diesen Anfang und noch keinen späteren Zustand.'}</p>
  <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Alle Zahlen und Gruppen sind erfunden. Die gedachte Viermonatskontrolle ist kein aktuelles oder historisches GBM-Ergebnis. Die Balken zeigen Anzahlen, keine Baumgrößen, Waldflächen, Artenvielfalt, Wassermengen oder Klimawirkung. Standort, Arten, Pflege und Bedingungen der Gruppen sind nicht vorgegeben. Der Vergleich belegt deshalb weder eine Ausfallursache noch, welches wirkliche Projekt insgesamt besser wäre. Er ersetzt keine längerfristige Nachkontrolle und ist keine Anleitung zum eigenständigen Pflanzen.</p>
 </>;
}
