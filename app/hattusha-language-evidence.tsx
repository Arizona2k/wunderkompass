'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import './hattusha-language-evidence.css';

const pairs=[
 {first:'Guten Tag',second:'Good day'},
 {first:'Wasser',second:'Water'},
 {first:'Buch',second:'Book'},
];
const stages=['Schrift vergleichen','Sprache unterscheiden','Material und Aussage trennen'];
const tasks=[
 'Vergleiche die beiden heutigen Ausdrücke. Welche Buchstaben erkennst du? Beweist dieselbe Schrift schon dieselbe Sprache?',
 'Blende die Sprachnamen aus. Welche Wörter kennst du selbst? Was müsste man bei einem unbekannten historischen Text zusätzlich untersuchen?',
 'Wechsle zwischen Papier und Bildschirm. Ändert sich dadurch die Sprache der Wörter? Erkläre dann, warum Ton allein keine Sprache bestimmt.',
];
export default function HattushaLanguageEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-hattusha',{level:0,variant:false,extra:false,compare:false,choice:0});
 const pair=pairs[view.choice??0],namesVisible=!view.variant,medium=view.extra?'Bildschirm':'Papier';
 const comparisons=[
  'Beide Ausdrücke verwenden hier lateinische Buchstaben. Der erste ist deutsch, der zweite englisch. Die Schrift ist ein Merkmal; die Sprache ist ein anderes. Dieser heutige Vergleich ist keine hethitische Inschrift.',
  namesVisible?'Blende zunächst die Sprachnamen aus. Prüfe, ob du die Wörter aus eigenem Sprachwissen erkennst. Bei unbekannten historischen Texten reicht der Blick auf eine ähnliche Zeichenform nicht aus.':'Vielleicht erkennst du die heutigen Wörter aus deinem Sprachwissen. Für historische Texte braucht man passende Kenntnisse der Zeichen, der Sprache und ihres Zusammenhangs. Unser heutiges Beispiel entschlüsselt keine Tontafel.',
  'Die Ausdrücke bleiben dieselben, wenn du Papier und Bildschirm wechselst. Du änderst hier den dargestellten Träger, nicht die Sprache. Ebenso ist Ton ein Material und kein Sprachname. Welche Aussage ein historischer Text trägt, muss an diesem Text geprüft werden.',
 ];
 return <section className="history-context history-evidence hattusha-language-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Schrift, Sprache und Material unterscheiden" data-history-evidence="history-hattusha" data-hattusha-language-evidence>
  <h3>Gleiche Schrift, andere Sprache</h3>
  <p className="small-note">Heutige deutsche und englische Vergleichswörter. Keine hethitischen Originalzeichen, kein Abbild einer Tontafel und keine Übersetzung eines historischen Fundes.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{stages.map((label,i)=><button key={label} className="secondary-button" aria-pressed={view.level===i} onClick={()=>setView(v=>({...v,level:i as 0|1|2,compare:false}))}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[view.level]}</p>
  <label className="hattusha-language-choice">Heutiges Wortpaar<select className="secondary-button" aria-label="Heutiges Wortpaar" value={view.choice??0} onChange={e=>setView(v=>({...v,choice:Number(e.target.value),compare:false}))}>{pairs.map((p,i)=><option key={p.first} value={i}>{p.first} / {p.second}</option>)}</select></label>
  <div className={'hattusha-language-board '+(view.extra?'is-screen':'is-paper')} role="group" aria-label={'Zwei heutige Ausdrücke auf '+medium} data-hattusha-medium={view.extra?'screen':'paper'}>
   <p className="hattusha-language-medium">Dargestellter Träger: {medium}</p>
   <div className="hattusha-language-examples">{[{word:pair.first,language:'Deutsch',lang:'de'},{word:pair.second,language:'Englisch',lang:'en'}].map(row=><div className="hattusha-language-example" key={row.lang}><p className="hattusha-language-word" lang={row.lang}>{row.word}</p><p>{namesVisible?<>Sprache: <strong>{row.language}</strong></>:<>Sprachname ausgeblendet</>}</p><p>Schrift: lateinisch</p></div>)}</div>
  </div>
  <div className="model-buttons">
   <button className="secondary-button" aria-pressed={!namesVisible} onClick={()=>setView(v=>({...v,variant:!v.variant,compare:false}))}>{namesVisible?'Sprachnamen ausblenden':'Sprachnamen zeigen'}</button>
   <button className="secondary-button" aria-pressed={view.extra} onClick={()=>setView(v=>({...v,extra:!v.extra,compare:false}))}>{view.extra?'Auf Papier zeigen':'Auf Bildschirm zeigen'}</button>
   <button className="secondary-button" aria-expanded={view.compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{view.compare?'Vergleich schließen':'Meine Überlegung vergleichen'}</button>
  </div>
  {view.compare&&<div className="model-result" role="status"><strong>Eine mögliche Überlegung</strong><p>{comparisons[view.level]}</p></div>}
  <p className="small-note">Du untersuchst einen ausdrücklich heutigen Vergleich. Er belegt keine bestimmte Lesung oder Verbreitung einer Sprache im alten Hattuscha. Die freiwillige Überlegung vergibt keinen Stempel und bewertet keine freie Erklärung.</p>
 </section>;
}
