'use client';
import {useState} from 'react';
import './history-zero-evidence.css';

const LEVELS=[
 {label:'Nichts dazulegen',task:'Wähle eine Menge. Lege im Lernbild nichts dazu. Was verändert sich?',explanation:'Wenn nichts hinzukommt, bleibt die Menge gleich. Das gilt auch für eine andere Ausgangsmenge.'},
 {label:'Ziffernplätze vergleichen',task:'Vergleiche 205 und 25. Was ändert sich an der Bedeutung der 2, wenn die Null in der Mitte fehlt?',explanation:'In 205 steht die 2 für zwei Hunderter. In 25 steht sie für zwei Zehner. Die Null markiert in 205 die unbesetzte Zehnerstelle; sie ist kein nutzloses Zeichen.'},
 {label:'Rechentest und Geschichte',task:'Kann unser heutiger Rechentest allein beweisen, wann Menschen Regeln für die Null aufschrieben? Welchen weiteren Beleg brauchst du?',explanation:'Der Rechentest zeigt eine mathematische Regel. Die Zeitangabe stammt dagegen aus einer historischen Quelle über Brahmaguptas Werk. Ein heutiges Lernbild datiert kein altes Buch.'},
];

export default function ZeroHistoryEvidence(){
 const [level,setLevel]=useState(0),[amount,setAmount]=useState(8),[added,setAdded]=useState(false),[omitted,setOmitted]=useState(false),[source,setSource]=useState(false),[explain,setExplain]=useState(false);
 const data=LEVELS[level];
 return <section className="history-context history-evidence history-zero-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv">
  <h3>Die Null kann zwei verschiedene Aufgaben haben</h3>
  <p className="small-note">Eigenes Lernbild mit heutigen Ziffern. Keine Abbildung einer Handschrift aus dem Jahr 628.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{LEVELS.map((d,i)=><button className="secondary-button" key={d.label} aria-pressed={level===i} onClick={()=>{setLevel(i);setExplain(false);}}>{i+1} · {d.label}</button>)}</div>
  <p className="learning-goal">{data.task}</p>
  {level===0?<div className="history-zero-quantity">
   <div className="model-buttons"><label>Ausgangsmenge<select className="secondary-button" aria-label="Ausgangsmenge" value={amount} onChange={e=>{setAmount(Number(e.target.value));setAdded(false);}}>{[0,1,2,3,4,5,6,7,8,9].map(n=><option value={n} key={n}>{n}</option>)}</select></label></div>
   <div className="history-zero-dots" role="img" aria-label={'Dargestellte Menge: '+amount+' Punkte.'}>{Array.from({length:amount},(_,i)=><span key={i} aria-hidden="true"/>)}{amount===0&&<span className="history-zero-empty" aria-hidden="true">Keine Punkte</span>}</div>
   <p className="history-zero-equation" aria-live="polite">{added?amount+' + 0 = '+amount:amount+' Punkte'}</p>
   <div className="model-buttons"><button className="secondary-button" aria-pressed={added} onClick={()=>setAdded(v=>!v)}>{added?'Ausgangsmenge ansehen':'Nichts dazulegen'}</button></div>
   <p>Die Punkte sind Zählzeichen. Du kannst die Regel mit jeder hier wählbaren Menge ausprobieren.</p>
  </div>:level===1?<div className="history-zero-place-values">
   <p>H steht für Hunderter, Z für Zehner und E für Einer.</p><div className="history-zero-digits" data-places={omitted?2:3} role="group" aria-label={omitted?'Ziffernplätze der Zahl 25':'Ziffernplätze der Zahl 205'}>{(omitted?[['Zehner','2'],['Einer','5']]:[['Hunderter','2'],['Zehner','0'],['Einer','5']]).map(([place,digit])=><div key={place} role="group" aria-label={digit+' '+place}><span>{place==='Hunderter'?'H':place==='Zehner'?'Z':'E'}</span><strong>{digit}</strong></div>)}</div>
   <p className="history-zero-equation" aria-live="polite">{omitted?'25 = 2 Zehner + 5 Einer':'205 = 2 Hunderter + 0 Zehner + 5 Einer'}</p>
   <div className="model-buttons"><button className="secondary-button" aria-pressed={omitted} onClick={()=>setOmitted(v=>!v)}>{omitted?'Null wieder einsetzen':'Null weglassen'}</button></div>
   <p>Beide Zahlen enthalten eine 2 und eine 5. Die Ziffern stehen an unterschiedlichen Stellen.</p>
  </div>:<div className="history-zero-source">
   <p>Unser Lernbild: 8 + 0 = 8. Es zeigt, was beim Dazuzählen von nichts mit der Menge geschieht.</p>
   <div className="model-buttons"><button className="secondary-button" aria-expanded={source} onClick={()=>setSource(v=>!v)}>{source?'Zeitbeleg ausblenden':'Quelle zur Zeitangabe zeigen'}</button></div>
   {source&&<div className="history-zero-source-record"><h4>Ein anderer Beleg für eine andere Frage</h4><p>MacTutor beschreibt ein Werk von Brahmagupta aus dem Jahr 628. Der Text nennt Bhillamala, das heutige Bhinmal in Indien, als Ort der Niederschrift.</p><p>Diese historische Angabe folgt nicht aus den Punkten oder Ziffern unseres heutigen Lernbilds.</p></div>}
  </div>}
  <div className="model-buttons"><button className="secondary-button" aria-expanded={explain} onClick={()=>setExplain(v=>!v)}>{explain?'Denkhilfe schließen':'Meine Überlegung vergleichen'}</button></div>
  {explain&&<p className="model-result" role="status">{data.explanation}</p>}
  <p className="small-note">Die freiwillige Beobachtung vergibt keinen Stempel. Die Mini-Frage unten und deine bisherigen Lernstände behalten ihre Funktion.</p>
 </section>;
}
