// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleTestConditionsFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const journey=selected===1,rows=[{label:'Antrieb am selben Platz',observed:true},{label:'Steigung unterwegs',observed:journey},{label:'Versorgung unterwegs',observed:journey}];
 return <>
  <h4>Welche Bedingungen wurden untersucht?</h4>
  <p>Zwei eigene Gedankenbeispiele unterscheiden einen Test am selben Platz von einer zusätzlichen Teststrecke. Die Angaben zeigen nur, welche Bedingungen im Beispiel untersucht wurden. Sie sind keine historischen Messdaten.</p>
  <div className="people-test-condition-list" style={{display:'grid',gap:'.75rem'}}>{rows.map(row=><div key={row.label} data-test-condition={row.label} data-observed-condition={row.observed?'observed':'not-examined'} style={{display:'grid',gap:'.25rem',paddingBottom:'.75rem',borderBottom:'1px solid #cedbdc'}}><strong>{row.label}</strong><span>{row.observed?'Im Gedankenbeispiel untersucht':'In dieser Notiz noch nicht untersucht'}</span></div>)}</div>
  <div className="visual-choice" role="group" aria-label="Gedachte Testnotiz wählen"><button aria-pressed={!journey} onClick={()=>onSelect(0)}>Test am selben Platz</button><button aria-pressed={journey} onClick={()=>onSelect(1)}>Zusätzliche Teststrecke</button></div>
  <p className="people-evidence-observation" role="status">{journey?'Die zweite Notiz umfasst zusätzlich eine Steigung und die Versorgung unterwegs.':'Die erste Notiz beschreibt nur eine Untersuchung am selben Platz.'} „Untersucht“ benennt eine Beobachtungssituation, noch kein erfolgreiches Ergebnis.</p>
  <p className="small-note">Eigenes erfundenes Vergleichsmodell mit KI-Unterstützung. Keine Nachstellung von Bertha Benz’ genauer Route, keine Reparaturanleitung und keine gemessene Fahrzeugleistung. Eine zusätzliche Teststrecke erfasst weitere Bedingungen, aber nicht automatisch alle möglichen Fahrten. Aus den Angaben folgt weder eine Sicherheitsfreigabe noch eine heutige Zulassung.</p>
 </>;
}
