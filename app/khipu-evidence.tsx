'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import './khipu-evidence.css';

const levels=['Mengen beobachten','Eine Bedeutung vereinbaren','Grenzen der Aussage prüfen'];
const tasks=[
 'Wähle zwei Mengen. Beobachte, wie viele Zeichen jede Schnur erhält. Beschreibe einen Unterschied.',
 'Wofür soll ein Zeichen in unserem Beispiel stehen? Wähle eine Vereinbarung und prüfe, ob sich dadurch die gezeichneten Mengen ändern.',
 'Blende die Bedeutung aus. Was kannst du noch vergleichen, und welche Information fehlt dir jetzt?'
];
const amounts=[1,2,3,4,5,6];
export default function KhipuEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-khipu',{level:0,variant:false,extra:false,compare:false,choice:16});
 const index=view.choice??16,first=Math.floor(index/6)+1,second=index%6+1,legend=!view.variant,meaning=view.extra?'Personen':'Körbe';
 const explanations=[
  `Auf der ersten Schnur stehen ${first}, auf der zweiten ${second} Zeichen. ${first===second?'Beide Mengen sind gleich groß.':first>second?'Die erste Menge ist größer.':'Die zweite Menge ist größer.'} Was gezählt wird, ist damit noch nicht erklärt.`,
  `Unsere Vereinbarung zählt ${meaning}. Die gezeichneten Mengen bleiben ${first} und ${second}, wenn du die Bedeutung wechselst. Eine gleich große Zahl kann unterschiedliche Dinge zählen. Die Vereinbarung ist von uns erfunden und keine Entschlüsselung eines Fundstücks.`,
  `Auch ohne Beschriftung kannst du die Mengen ${first} und ${second} zählen und vergleichen. Ob sie etwa Körbe, Personen oder etwas anderes bezeichnen, folgt aus unseren Zeichen allein nicht. Für historische Khipus braucht man passende Regeln, Zusammenhang und weitere Belege.`
 ];
 return <section className="history-context history-evidence khipu-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Zahl und Bedeutung unterscheiden" data-history-evidence="history-khipu" data-khipu-evidence>
  <h3>Knoten lesen braucht eine gemeinsame Regel</h3>
  <p className="small-note">Eigenes erfundenes Zählschnur-Lernbild mit KI-Unterstützung. Die Zeichen sind keine historischen Knotenformen. Das Foto des Museumsstücks und dieses Übungsbild haben unterschiedliche Aufgaben.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{levels.map((label,i)=><button className="secondary-button" key={label} aria-pressed={view.level===i} onClick={()=>setView(v=>({...v,level:i as 0|1|2,compare:false}))}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[view.level]}</p>
  <div className="model-buttons khipu-evidence-amounts">
   <label>Erste Menge<select className="secondary-button" aria-label="Erste Menge" value={first} onChange={e=>setView(v=>({...v,choice:(Number(e.target.value)-1)*6+(v.choice??16)%6,compare:false}))}>{amounts.map(n=><option key={n} value={n}>{n}</option>)}</select></label>
   <label>Zweite Menge<select className="secondary-button" aria-label="Zweite Menge" value={second} onChange={e=>setView(v=>({...v,choice:Math.floor((v.choice??16)/6)*6+Number(e.target.value)-1,compare:false}))}>{amounts.map(n=><option key={n} value={n}>{n}</option>)}</select></label>
  </div>
  <figure className="topic-illustration khipu-evidence-schematic">
   <svg viewBox="0 0 360 155" role="img" aria-label={`Erfundene Zählschnüre: erste Menge ${first}, zweite Menge ${second}. ${legend?`Unsere Vereinbarung zählt ${meaning}.`:'Die Bedeutung ist ausgeblendet.'}`}>
    <path d="M28 24H332M110 24V139M250 24V139" stroke="#536b6b" strokeWidth="4" fill="none"/>
    {[first,second].map((n,i)=>Array.from({length:n},(_,j)=><circle key={i+':'+j} cx={110+i*140} cy={43+j*16} r="6" fill="#ae753c" stroke="#183b46" strokeWidth="2"/>))}
   </svg>
   <figcaption className="topic-diagram-label"><strong>Erste Menge: {first} · Zweite Menge: {second}</strong><span>{legend?`Unsere erfundene Vereinbarung: Ein Zeichen steht für ${view.extra?'eine Person':'einen Korb'}.`:'Die Bedeutung der gezählten Dinge ist ausgeblendet.'}</span></figcaption>
  </figure>
  {view.level===1&&<label className="khipu-evidence-meaning">Wofür steht ein Zeichen in unserem Beispiel?<select className="secondary-button" aria-label="Bedeutung eines Zeichens" value={view.extra?'people':'baskets'} onChange={e=>setView(v=>({...v,extra:e.target.value==='people',variant:false,compare:false}))}><option value="baskets">Ein Korb</option><option value="people">Eine Person</option></select></label>}
  <div className="model-buttons"><button className="secondary-button" aria-pressed={!legend} onClick={()=>setView(v=>({...v,variant:!v.variant,compare:false}))}>{legend?'Bedeutung ausblenden':'Unsere Vereinbarung zeigen'}</button><button className="secondary-button" aria-expanded={view.compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{view.compare?'Vergleich schließen':'Meine Überlegung vergleichen'}</button></div>
  {view.compare&&<div className="model-result" role="status"><strong>Eine mögliche Überlegung</strong><p>{explanations[view.level]}</p></div>}
  <p className="small-note">Historische Khipus nutzten weitere Merkmale und vielfach Zehnerstellen. Unser Übungsbild zeigt dieses Verfahren nicht. Die freiwillige Beobachtung vergibt keinen Stempel und bewertet keine freie Erklärung.</p>
 </section>;
}
