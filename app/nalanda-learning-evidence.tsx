'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import './nalanda-learning-evidence.css';

const stages=['Wohnen und Lernen','Zeiträume unterscheiden','Altes erhalten'];
const tasks=[
 'Wechsle die Funktion in unserer Skizze. Welche zwei Aufgaben gehören zu einem Wohn- und Lehrgebäude?',
 'Blende die ältere Fundspur ein. Bezeichnet sie automatisch den Beginn der Lehranstalt?',
 'Zeige eine später ergänzte Schutzlage. Was bleibt im Schema alt, und welche Information brauchst du bei einem wirklichen Bauwerk?'
];
export default function NalandaLearningEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-nalanda',{level:0,variant:false,extra:false,compare:false,choice:0});const stage=view.level,functionView=view.variant?'learning':'living',older=view.extra,cap=view.choice===1,compare=view.compare;
 const explanations=[
  'Viharas verbanden Wohnen und Lehre. Die zwei Felder veranschaulichen diese Funktionen; ihre gezeichnete Lage ist frei gewählt. Für die tatsächliche Raumnutzung braucht man historische Belege.',
  'Die ältere Spur gehört zur Geschichte des Geländes. Den Kloster- und Lehrbetrieb ordnet die UNESCO später ein. Alter einer Spur und Beginn einer bestimmten Nutzung dürfen nicht gleichgesetzt werden.',
  'Die markierte Lage wurde in unserer Skizze zum Schutz ergänzt. Die darunter gezeichneten Teile bleiben älter. Bei echten Mauern braucht man dokumentierte Erhaltungsarbeiten, um ursprüngliche Teile und spätere Ergänzungen nachvollziehbar zu unterscheiden.'
 ];
 return <section className="history-context history-evidence nalanda-learning-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Lernen und historische Spuren in Nalanda" data-nalanda-learning-evidence data-history-evidence="history-nalanda">
  <h3>Was verraten Gebäude und ihre Spuren?</h3>
  <p className="small-note">Eigene Lernschemata mit KI-Unterstützung. Die Skizzen zeigen frei gewählte Beispiele, keinen Originalplan und keine Rekonstruktion eines bestimmten Raums in Nalanda.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{stages.map((label,i)=><button className="secondary-button" key={label} aria-pressed={stage===i} onClick={()=>{setView(v=>({...v,level:i as 0|1|2,compare:false}));}}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[stage]}</p>
  {stage===0&&<>
   <div className="model-buttons" role="group" aria-label="Funktion im erfundenen Gebäudeschema"><button className="secondary-button" aria-pressed={functionView==='living'} onClick={()=>setView(v=>({...v,variant:false,compare:false}))}>Wohnen zeigen</button><button className="secondary-button" aria-pressed={functionView==='learning'} onClick={()=>setView(v=>({...v,variant:true,compare:false}))}>Lernen zeigen</button></div>
   <figure className="topic-illustration nalanda-evidence-figure">
    <svg viewBox="0 0 320 170" role="img" aria-label={functionView==='living'?'Erfundenes Schema mit zwei Feldern: Die Funktion Wohnen ist hervorgehoben.':'Erfundenes Schema mit zwei Feldern: Die Funktion Lernen ist hervorgehoben.'}>
     <rect x="24" y="22" width="272" height="126" rx="3" fill="#faf7f1" stroke="#795b43" strokeWidth="3"/>
     <rect x="33" y="31" width="119" height="108" fill={functionView==='living'?'#ead3af':'#faf7f1'} stroke={functionView==='living'?'#795b43':'#bac7c5'} strokeWidth="2"/>
     <rect x="168" y="31" width="119" height="108" fill={functionView==='learning'?'#d9ebed':'#faf7f1'} stroke={functionView==='learning'?'#246778':'#bac7c5'} strokeWidth="2"/>
     {functionView==='living'?<path d="M51 103V76H128V112M51 103H128M62 76V62H82V76" fill="none" stroke="#795b43" strokeWidth="4"/>:<><path d="M192 63Q210 55 227 64Q246 55 265 63V111Q246 103 227 112Q210 103 192 111Z" fill="none" stroke="#246778" strokeWidth="4"/><path d="M227 64V112" stroke="#246778" strokeWidth="3"/></>}
    </svg>
    <figcaption className="topic-diagram-label"><strong>{functionView==='living'?'Gewählte Funktion: Wohnen.':'Gewählte Funktion: Lernen.'}</strong> Bett- und Buchzeichen sind moderne Symbole für die Funktionen. Sie bilden keine historischen Möbel oder ein bestimmtes Lehrbuch ab.</figcaption>
   </figure>
  </>}
  {stage===1&&<>
   <button className="secondary-button" aria-pressed={older} onClick={()=>setView(v=>({...v,extra:!v.extra,compare:false}))}>{older?'Ältere Fundspur ausblenden':'Ältere Fundspur einblenden'}</button>
   <ol className="nalanda-evidence-periods" aria-label="Zwei unterschiedlich eingeordnete Spuren">
    {older&&<li><strong>Ältere Spuren auf dem Gelände</strong><p>Nach UNESCO ungefähr ab dem 3. Jahrhundert vor Christus.</p></li>}
    <li><strong>Kloster- und Lehrbetrieb</strong><p>Nach UNESCO vom 5. bis ins 13. Jahrhundert nach Christus.</p></li>
   </ol>
   <p className="small-note">Ein Jahrhundert umfasst 100 Jahre. Die Angaben ordnen unterschiedliche Sachverhalte ein; sie belegen keinen gemeinsamen genauen Gründungstag.</p>
  </>}
  {stage===2&&<>
   <button className="secondary-button" aria-pressed={cap} onClick={()=>setView(v=>({...v,choice:v.choice===1?0:1,compare:false}))}>{cap?'Schutzlage im Schema ausblenden':'Spätere Schutzlage im Schema zeigen'}</button>
   <figure className="topic-illustration nalanda-evidence-figure">
    <svg viewBox="0 0 320 180" role="img" aria-label={cap?'Erfundener Mauerschnitt: Zwei ältere Ziegellagen, darüber eine hell markierte spätere Schutzlage mit Schrägstrichen.':'Erfundener Mauerschnitt: Zwei ältere Ziegellagen. Eine spätere Schutzlage ist ausgeblendet.'}>
     {[0,1].flatMap(row=>[0,1,2,3].map(column=><rect key={row+':'+column} x={24+column*68} y={84+row*31} width="65" height="28" fill="#b8835b" stroke="#78553b" strokeWidth="2"/>))}
     {cap&&<><rect x="24" y="50" width="269" height="29" fill="#e6eff0" stroke="#246778" strokeWidth="3"/>{[0,1,2,3,4,5,6,7].map(i=><path key={i} d={`M${35+i*33} 74l15-19`} stroke="#246778" strokeWidth="2"/>)}</>}
    </svg>
    <figcaption className="topic-diagram-label"><strong>Ältere Teile: zwei braune Lagen.</strong> {cap?'Spätere Ergänzung: die helle Lage mit Schrägstrichen.':'Die spätere Ergänzung ist im Modell ausgeblendet.'} Farben und Form sind für das Lernbild gewählt.</figcaption>
   </figure>
   <p className="small-note">Bei einem Foto ohne solche Kennzeichnung kann man die Zuordnung nicht einfach aus der Farbe übernehmen. Dafür braucht es die Dokumentation der Arbeiten.</p>
  </>}
  <button className="secondary-button" aria-expanded={compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{compare?'Vergleich schließen':'Meine Überlegung vergleichen'}</button>
  {compare&&<div className="model-result" role="status"><strong>Eine mögliche Überlegung</strong><p>{explanations[stage]}</p></div>}
  <p className="small-note">Die freiwillige Untersuchung vergibt keinen Stempel und bewertet keine freie Erklärung. Nutze den Vergleich für deine eigene Begründung.</p>
 </section>;
}
