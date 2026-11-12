'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import {LearningFeedback} from './learning-motion';
import './rosetta-comparison-evidence.css';

const levels=['Aussagen vergleichen','Einen Namen verfolgen','Mit einer Lücke umgehen'];
const questions=['Welche Aussage bleibt erhalten, obwohl die Wörter andere Plätze haben?','Welche Hinweise liefert ein wiederkehrender Name – und was erklärt er noch nicht?','Was kann eine zweite Fassung über die beschädigte Stelle sagen, und was bleibt offen?'];
const reflections=[
 'Beide heutigen Sätze nennen Mira als gebende Person, Korn als Gabe und die Stadt als Empfängerin. Die gleiche Aussage braucht hier nicht dieselbe Wortreihenfolge. Bei alten Schriftfassungen müssen die tatsächlichen Gemeinsamkeiten erst untersucht werden.',
 'Mira kommt in beiden eigenen Beispielen vor. Trotzdem sagen die Sätze nicht dasselbe: Mira gibt einmal Korn und erhält es im anderen Satz. Der wiederkehrende Name allein entscheidet weder die Handlung noch den gesamten Inhalt. Ein überprüfbarer Hinweis ist noch keine vollständige Entzifferung.',
 'Die Vergleichsfassung nennt eine Gabe von Korn an die Stadt. Sie liefert einen möglichen Zusammenhang für das beschädigte Beispiel. Welche Wörter auf der fehlenden Stelle tatsächlich standen, ist damit nicht sicher bewiesen. Ein sinngleicher Satz könnte anders formuliert gewesen sein; eine Ergänzung braucht weitere Belege und eine Kennzeichnung.'
];

export default function RosettaComparisonEvidence(){
 const[view,setView]=useHistoryEvidenceView('history-rosetta',{level:0,variant:false,extra:false,compare:false});
 const choose=(level:0|1|2)=>setView(v=>({...v,level,variant:false,extra:false,compare:false}));
 return <section className="history-context history-evidence rosetta-comparison-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Textfassungen als Hinweise" data-history-evidence="history-rosetta" data-rosetta-comparison-evidence>
  <h3>Gleiche Aussage, andere Wörter?</h3>
  <p className="small-note">Eigener, mit KI-Unterstützung erstellter heutiger Textvergleich. Die erfundene Person Mira und die deutschen Sätze stammen nicht vom Stein von Rosette. Es werden keine ägyptischen Zeichen übersetzt.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{levels.map((label,i)=><button key={label} className="secondary-button" aria-pressed={view.level===i} onClick={()=>choose(i as 0|1|2)}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{questions[view.level]}</p>
  <div className="rosetta-text-comparison" data-rosetta-level={view.level}>
   <figure><figcaption>Eigenes heutiges Beispiel A</figcaption><blockquote>{view.level===2?<><span>Mira</span> <span className="rosetta-gap" aria-label="Beschädigte Stelle, Wörter unbekannt">[Text fehlt]</span> <span>Stadt.</span></>:<>Mira gibt der Stadt Korn.</>}</blockquote></figure>
   <button className="secondary-button" aria-expanded={view.variant} onClick={()=>setView(v=>({...v,variant:!v.variant,compare:false}))}>{view.variant?'Vergleichsfassung schließen':'Vergleichsfassung ansehen'}</button>
   {view.variant&&<figure data-rosetta-comparison><figcaption>Eigenes heutiges Beispiel B</figcaption><blockquote>{view.level===1?'Mira erhält von der Stadt Korn.':'Die Stadt erhält Korn von Mira.'}</blockquote></figure>}
  </div>
  {view.level===1&&<div className="model-buttons"><button className="secondary-button" aria-pressed={view.extra} onClick={()=>setView(v=>({...v,extra:!v.extra}))}>{view.extra?'Namenshinweis schließen':'Den Namenshinweis ansehen'}</button>{view.extra&&<p className="rosetta-name-clue">In beiden Beispielen steht derselbe heutige Name: <strong>Mira</strong>. Vergleiche zusätzlich, wer etwas gibt und wer etwas erhält.</p>}</div>}
  {view.level===2&&<p className="small-note">Die eckige Klammer bezeichnet hier eine ausgedachte Textlücke. Sie ist kein auf dem Stein erhaltenes Zeichen. Die Vergleichsfassung ist keine automatisch gesicherte Ergänzung.</p>}
  <button className="secondary-button" aria-expanded={view.compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{view.compare?'Überlegung schließen':'Meine Überlegung vergleichen'}</button>
  <LearningFeedback active={view.compare} className="model-result"><strong>Eine mögliche Überlegung</strong><p>{reflections[view.level]}</p></LearningFeedback>
  <p className="small-note">Die freiwillige Beobachtung vergibt keinen Stempel und bewertet keine freie Erklärung. Die einfachen deutschen Beispiele zeigen Vergleich und Unsicherheit; sie bilden weder die altägyptische Grammatik noch den gesamten Forschungsweg nach.</p>
 </section>;
}
