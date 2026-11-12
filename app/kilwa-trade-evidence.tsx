'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';

const levels=['Angaben lesen','Mögliche Wege vergleichen','Einen Beleg prüfen'];
const tasks=[
 'Lies die zwei Angaben zu unserer gedachten Schale. Welche Information fehlt zwischen Herstellungsort und Fundort?',
 'Zeige einen möglichen Zwischenhalt und blende ihn wieder aus. Bleiben Anfang und Ende gleich? Beweist eine Zeichnung, welcher Weg tatsächlich genommen wurde?',
 'Öffne die zusätzliche erfundene Notiz. Welche Angaben müsstest du prüfen, bevor du sie mit unserer Schale verbindest?'
];
const comparisons=[
 'Die beiden Angaben nennen Anfang und Ende. Der Weg dazwischen und die beteiligten Menschen sind damit noch nicht vollständig bekannt.',
 'Beide gezeichneten Möglichkeiten haben denselben Anfang und dasselbe Ende. Ein Bild kann eine Vermutung zeigen, ohne sie zu beweisen.',
 'Prüfe Ort, Datierung und die Zuordnung zum Gegenstand. Selbst eine passende Notiz könnte zunächst nur eine Etappe stützen. Alle Karten und Notizen hier sind erfunden.'
];

export default function KilwaTradeEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-kilwa',{level:0,variant:false,extra:false,compare:false});
 const {level,variant:via,extra:note,compare}=view;
 const setLevel=(level:number)=>setView(v=>({...v,level:level as 0|1|2,compare:false}));
 const setCompare=(compare:boolean)=>setView(v=>({...v,compare}));
 return <section className="history-context history-evidence kilwa-trade-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: mögliche Handelswege" data-kilwa-trade-evidence>
  <h3>Zwei Endpunkte, mehr als ein möglicher Weg</h3>
  <p className="small-note">Erfundene Lernkarten zu einer gedachten Schale. Keine echten Fundangaben, Ortsnamen oder historischen Handelsrouten.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{levels.map((label,i)=><button className="secondary-button" key={label} aria-pressed={level===i} onClick={()=>{setLevel(i);setCompare(false);}}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[level]}</p>
  <ol className="kilwa-evidence-route" aria-label="Ein möglicher Weg der gedachten Schale">
   <li><strong>Ort A · Herstellungsort</strong><p>Hier wurde die gedachte Schale hergestellt.</p></li>
   {via&&<li className="kilwa-evidence-hypothesis"><strong>Ort B · möglicher Zwischenhalt</strong><p>Eine zusätzliche Möglichkeit. Durch die Zeichnung noch nicht belegt.</p></li>}
   <li><strong>Ort C · Fundort</strong><p>Hier wird die gedachte Schale später gefunden.</p></li>
  </ol>
  <p className="small-note" data-kilwa-route-summary>{via?'Gezeigt: A → B → C.':'Gezeigt: A → C.'} Die Pfeile ordnen nur unsere gedachte Möglichkeit. Sie bilden keine Karte, Entfernung, Dauer oder gesicherte Reise ab.</p>
  <div className="model-buttons"><button className="secondary-button" aria-pressed={via} onClick={()=>setView(v=>({...v,variant:!v.variant}))}>{via?'Möglichkeit ohne Zwischenhalt zeigen':'Möglichen Zwischenhalt zeigen'}</button><button className="secondary-button" aria-expanded={note} onClick={()=>setView(v=>({...v,extra:!v.extra}))}>{note?'Erfundene Zusatznotiz schließen':'Erfundene Zusatznotiz öffnen'}</button></div>
  {note&&<div className="kilwa-evidence-note"><strong>Eine weitere erfundene Karte</strong><p>In Ort B gibt es eine datierte Notiz über eine Schale. Ob es dieselbe Schale ist und ob der Zeitpunkt passt, ist noch ungeklärt.</p></div>}
  <button className="secondary-button" aria-expanded={compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{compare?'Vergleich schließen':'Meine Überlegung vergleichen'}</button>
  {compare&&<div className="model-result" role="status"><strong>Eine mögliche Überlegung</strong><p>{comparisons[level]}</p></div>}
  <p className="small-note">Die freiwillige Untersuchung vergibt keinen Stempel und bewertet keine freie Erklärung. Historische Aussagen zu Kilwa und ihre Quellen stehen im Artikel.</p>
 </section>;
}
