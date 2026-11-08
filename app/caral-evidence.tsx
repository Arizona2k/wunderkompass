'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import './caral-evidence.css';

const levels=['Bauformen beobachten','Bezugsflächen vergleichen','Eine Datierung einordnen'];
const tasks=[
 'Wähle eine Bauform. Wo liegt sie im Schema im Vergleich zur Bodenlinie? Vergleiche anschließend die andere Form.',
 'Vergleiche die zwei Flächenangaben. Beschreiben die Quellen jeweils denselben Ausschnitt?',
 'Eine neue Untersuchung datiert eine Fundspur in der Nähe einer Mauer. Welche nächste Frage hilft dir, bevor du ein Baujahr für die Mauer annimmst?'
];
const choices=[
 {label:'Kann ich das Funddatum sofort als Baujahr der ganzen Stadt verwenden?',feedback:'Ein einzelner Fund datiert nicht die ganze Stadt. Erst seine Zuordnung und weitere Belege können zeigen, wofür die Zeitangabe gilt.'},
 {label:'Genügt die räumliche Nähe, um Fund und Mauer als gleich alt anzusehen?',feedback:'Nähe allein reicht nicht aus. Ein Fund kann vor oder nach einem Bauwerk an denselben Ort gelangt sein.'},
 {label:'Wie hängt die datierte Fundspur mit dem Bau der Mauer zusammen?',feedback:'Diese Frage prüft den Zusammenhang: Gehört die Spur tatsächlich zum Bau, zu einer späteren Nutzung oder zu einem anderen Vorgang? Erst danach lässt sich ihre Aussage für die Mauer beurteilen.'}
];

export default function CaralEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-caral',{level:0,variant:false,extra:false,compare:false,choice:0});const level=view.level,form=view.variant?'court':'platform',compare=view.compare,choice=(view.choice??0)===0?null:(view.choice??0)-1;
 return <section className="history-context history-evidence caral-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Bauform, Bezugsfläche und Datierung" data-caral-evidence data-history-evidence="history-caral">
  <h3>Was zeigt eine Spur, und was bleibt offen?</h3>
  <p className="small-note">Eigene Lernschemata mit KI-Unterstützung. Keine Fundzeichnung, maßstäbliche Karte oder Rekonstruktion der Stadt Caral.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{levels.map((label,i)=><button className="secondary-button" key={label} aria-pressed={level===i} onClick={()=>{setView(v=>({...v,level:i as 0|1|2,compare:false}));}}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[level]}</p>
  {level===0&&<>
   <div className="model-buttons" role="group" aria-label="Bauform im Schema"><button className="secondary-button" aria-pressed={form==='platform'} onClick={()=>setView(v=>({...v,variant:false,compare:false}))}>Plattform wählen</button><button className="secondary-button" aria-pressed={form==='court'} onClick={()=>setView(v=>({...v,variant:true,compare:false}))}>Abgesenkten Platz wählen</button></div>
   <figure className="topic-illustration caral-evidence-form">
    <svg viewBox="0 0 320 180" role="img" aria-label={form==='platform'?'Schematischer Schnitt: Eine Plattform ragt über die Bodenlinie.':'Schematischer Schnitt: Der Boden eines Platzes liegt unter der Bodenlinie. Der runde Grundriss ist im Schnitt nicht zu sehen.'}>
     <path d="M16 126H304" fill="none" stroke="#536b6b" strokeWidth="3" strokeDasharray="6 5"/>
     {form==='platform'?<path d="M42 126V94H85V62H235V94H278V126Z" fill="#ead7ba" stroke="#765635" strokeWidth="3"/>:<><path d="M16 126H64V153H256V126H304V172H16Z" fill="#ead7ba" stroke="#765635" strokeWidth="3"/><path d="M64 153H256" stroke="#246778" strokeWidth="5"/></>}
    </svg>
    <figcaption className="topic-diagram-label"><strong>{form==='platform'?'Plattform: erhöht.':'Abgesenkter Platz: vertieft.'}</strong> Die gestrichelte Linie zeigt die Umgebungshöhe im Schema. Du siehst einen gedachten Schnitt, keinen Grundriss.</figcaption>
   </figure>
   <p className="small-note">Ein runder Platz erscheint in einem Schnitt nicht als Kreis. Form und Lage allein erklären seine frühere Nutzung noch nicht.</p>
  </>}
  {level===1&&<div className="caral-evidence-areas" aria-label="Zwei Angaben mit unterschiedlichen Bezugsflächen">
   {[{name:'Zentrale Architekturzone',area:65,source:'Öffentliche Kurzfassung der Untersuchung von 2001',qualification:'65 Hektar'},{name:'Größere archäologische Stätte',area:626,source:'UNESCO Welterbebeschreibung',qualification:'rund 626 Hektar'}].map(row=><figure key={row.name}>
    <figcaption><strong>{row.name}: {row.qualification}</strong><span>{row.source}</span></figcaption>
    <div className="caral-evidence-bar" aria-hidden="true"><span style={{width:100*row.area/626+'%'}}/></div>
   </figure>)}
   <p className="small-note">Die Balken vergleichen die genannten Flächengrößen. Sie zeigen keine Lage, Form oder genauen Grenzen. Die zwei Fachbelege findest du bei den Quellen des Artikels.</p>
  </div>}
  {level===2&&<div className="caral-evidence-dating">
   <p><strong>Ein gedachter neuer Fundfall:</strong> Die Untersuchung nennt einen Zeitraum für die Fundspur. Die Zuordnung zum Mauerbau ist noch ungeklärt. Dies ist kein Bericht über einen wirklichen neuen Fund in Caral.</p>
   <div className="caral-evidence-questions" role="group" aria-label="Fragen zum gedachten Fundfall">{choices.map((entry,i)=><button className="secondary-button" key={entry.label} aria-pressed={choice===i} onClick={()=>setView(v=>({...v,choice:i+1}))}>{entry.label}</button>)}</div>
   {choice!==null&&<div className="model-result" role="status"><strong>Zur gewählten Frage</strong><p>{choices[choice].feedback}</p></div>}
  </div>}
  {level!==2&&<><button className="secondary-button" aria-expanded={compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{compare?'Vergleich schließen':'Meine Überlegung vergleichen'}</button>{compare&&<div className="model-result" role="status"><strong>Eine mögliche Überlegung</strong><p>{level===0?'Im Schema liegt die Plattform über, der Platzboden unter der Umgebungshöhe. Das ist eine Beobachtung der gezeichneten Form. Sie beweist kein bestimmtes Ritual und erklärt nicht allein, wie Menschen dort lebten.':'65 Hektar beziehen sich auf eine zentrale Architekturzone; rund 626 Hektar auf die größere archäologische Stätte. Verschiedene Bezugsflächen sind kein Widerspruch. Man darf daraus auch keine genauen Grenzverläufe ableiten.'}</p></div>}</>}
  <p className="small-note">Die freiwillige Untersuchung vergibt keinen Stempel und bewertet keine freie Erklärung. Vergleiche die Überlegungen und begründe deine eigene Schlussfolgerung.</p>
 </section>;
}
