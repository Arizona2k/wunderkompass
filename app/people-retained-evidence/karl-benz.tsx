// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleDriveConnectionFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const joined=selected===0;
 return <>
  <h4>Ein Antriebsweg braucht Verbindungen</h4>
  <p>Unser erfundenes Schema verbindet einen Motor, eine Übertragung und ein Rad. Der Schalter verändert nur die markierte Verbindung. Die Zeichnung ist kein Bauplan eines historischen Motorwagens.</p>
  <svg viewBox="0 0 320 210" role="img" aria-label={`Eigene Verbindungsskizze von links nach rechts: Motor, Übertragung, Rad. Die mittlere Verbindung ist ${joined?'geschlossen':'unterbrochen'}. Die tatsächliche Bewegung des Rades wird nicht berechnet.`}>
   <rect x="12" y="57" width="84" height="78" rx="10" fill="#e4eef0" stroke="#326775" strokeWidth="3"/>
   <path d="M32 78H76M32 96H76M32 114H76" fill="none" stroke="#326775" strokeWidth="3"/>
   <path d="M96 96H140" fill="none" stroke="#286a7b" strokeWidth="4"/>
   <path d="M134 90L142 96L134 102" fill="none" stroke="#286a7b" strokeWidth="3"/>
   <path d="M146 74V118M176 74V118" fill="none" stroke="#66838b" strokeWidth="4"/>
   <path data-drive-link-state={joined?'joined':'open'} d={joined?'M146 96H176':'M146 96H151M171 96H176'} fill="none" stroke={joined?'#286a7b':'#b9552b'} strokeWidth="5"/>
   <path d="M176 96H232" fill="none" stroke={joined?'#286a7b':'#567579'} strokeWidth="4" strokeDasharray={joined?undefined:'5 5'}/>
   {joined&&<path d="M226 90L234 96L226 102" fill="none" stroke="#286a7b" strokeWidth="3"/>}
   <g data-drive-wheel="fixed-schematic"><circle cx="270" cy="96" r="34" fill="#f7faf9" stroke="#284b57" strokeWidth="5"/><path d="M270 62V130M236 96H304M246 72L294 120M246 120L294 72" fill="none" stroke="#557985" strokeWidth="3"/></g>
  </svg>
  <div className="people-evidence-legend" style={{display:'grid',gridTemplateColumns:'1fr'}}><span>Links: gedachter Motor.</span><span>Mitte: veränderbare Verbindung der Übertragung.</span><span>Rechts: dasselbe schematische Rad.</span></div>
  <div className="visual-choice" role="group" aria-label="Verbindung im gedachten Antriebsweg wählen"><button aria-pressed={joined} onClick={()=>onSelect(0)}>Verbindung geschlossen</button><button aria-pressed={!joined} onClick={()=>onSelect(1)}>Verbindung unterbrochen</button></div>
  <p className="people-evidence-observation" role="status">{joined?'Die markierte Verbindung ist geschlossen. Der eingezeichnete Weg reicht vom Motor bis zum Rad.':'In der markierten Verbindung liegt eine Lücke. Über diese Verbindung wird im Schema kein Antrieb weitergegeben.'}</p>
  <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Gezeigt wird nur ein Zusammenhang zwischen Bauteilen, kein historisches Getriebe oder berechneter Kraftfluss. Das Rad sieht in beiden Ansichten gleich aus. Ein schon rollender Wagen kann auch ohne Motorantrieb weiterrollen; Reibung, Bremsen und Gefälle werden hier nicht berechnet. Die Schaltung beweist deshalb weder Stillstand noch eine bestimmte Geschwindigkeit.</p>
 </>;
}
