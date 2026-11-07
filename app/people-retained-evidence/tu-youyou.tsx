// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleEvidenceScopeFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const separated=selected===1;
 const evidence=[
  ['Historischer Hinweis','Ein Text berichtet über die Verwendung einer Pflanze.',true],
  ['Untersuchter Stoff','Ein Stoff wurde abgetrennt und chemisch untersucht.',separated],
  ['Behandlung bei Menschen','Klinische Daten zu Wirksamkeit und Sicherheit einer Behandlung.',false],
 ] as const;
 return <>
  <h4>Welche Aussage trägt ein Beleg?</h4>
  <p>Vergleiche zwei erfundene Forschungsnotizen. Zum historischen Hinweis kommt in der zweiten eine Stoffuntersuchung hinzu. Klinische Behandlungsergebnisse fehlen in beiden.</p>
  <div className="visual-choice" role="group" aria-label="Erfundene Forschungsnotiz auswählen"><button aria-pressed={!separated} onClick={()=>onSelect(0)}>Nur Textfund</button><button aria-pressed={separated} onClick={()=>onSelect(1)}>Textfund + Stoffanalyse</button></div>
  <ol aria-label="Welche Belege die gewählte Notiz enthält">
   {evidence.map(([title,description,present],index)=><li className="people-evidence-example" key={title} data-evidence-level={index} data-evidence-present={String(present)}><strong>{title}</strong><p>{description}</p><span>{present?'In dieser Notiz vorhanden':'In dieser Notiz nicht belegt'}</span></li>)}
  </ol>
  <p className="people-evidence-observation" role="status">{separated?'Die zweite Notiz enthält zusätzlich eine Stoffanalyse. Sie beschreibt damit mehr als den historischen Textfund. Eine wirksame und sichere Behandlung bei Menschen ist damit allein weiterhin nicht nachgewiesen.':'Der Textfund liefert eine Spur für die Forschung. Er zeigt allein weder, welcher einzelne Stoff beteiligt ist, noch ob eine Behandlung bei Menschen wirksam und sicher ist.'}</p>
  <p className="small-note">Eigene Darstellung mit KI-Unterstützung, keine Unterlagen aus Tu Youyous Forschung. Die drei Belegarten zeigen keinen vollständigen Entwicklungs- oder Zulassungsweg. Pflanzen oder Arzneien nicht selbst als Experiment ausprobieren.</p>
 </>;
}
