'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
const labels=['Inhalte vergleichen','Ein Datum einordnen','Die Aussage begrenzen'];
const tasks=[
 'Vergleiche die beiden kurzen Rechenzeilen. Ändere Abschrift B. Was beobachtest du am Inhalt?',
 'Betrachte die beiden angegebenen Abschriftjahre. Sagen sie auch, wann die Rechnung zum ersten Mal aufgeschrieben wurde? Blende die Jahre zum Vergleich aus.',
 'Stell dir zwei wirkliche Handschriften mit solchen Rechenbeispielen vor. Was könnten sie über Lehrinhalte zeigen, und was noch nicht über die Kenntnisse aller Menschen einer Stadt?'
];
export default function TimbuktuManuscriptEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-timbuktu',{level:0,variant:false,extra:true,compare:false});
 const {level,variant:changed,extra:dates,compare}=view;
 const setLevel=(level:number)=>setView(v=>({...v,level:level as 0|1|2,compare:false}));
 const setCompare=(compare:boolean)=>setView(v=>({...v,compare}));
 const explanations=[
  changed?'A nennt 3 + 4 = 7, B jetzt 3 + 4 = 8. Die zweite Zeile ist verschieden und rechnerisch falsch. Das ist eine absichtlich veränderte Lernkarte, kein wirklicher Fehlerbeleg aus Timbuktu.':'Beide Lernkarten enthalten 3 + 4 = 7. Gleicher Text kann in verschiedenen Abschriften stehen. Unser Beispiel belegt keine wirkliche historische Überlieferung.',
  '1690 und 1760 sind hier erfundene Jahre der jeweiligen Abschrift. Sie nennen nicht automatisch das erste Entstehen des Textes oder der Rechenregel. Ohne diese Angaben lässt sich das Alter auch nicht aus den Zahlen der Rechnung ablesen.',
  'Ein wirkliches Rechenlehrwerk könnte zeigen, welche Verfahren es erklärt. Zwei Stücke würden aber nicht beweisen, dass alle Menschen der Stadt lesen und rechnen konnten. Unsere Lernkarten ersetzen keine solchen Originalquellen.'
 ];
 return <section className="history-context history-evidence timbuktu-manuscript-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Abschrift und Text" data-timbuktu-manuscript-evidence>
  <h3>Gleicher Text, verschiedene Abschriften</h3>
  <p className="small-note">Eigene mit KI-Unterstützung erstellte Lernkarten mit modernen Ziffern. Keine Originalhandschriften, historischen Schriftproben oder echten Datierungen.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{labels.map((label,i)=><button className="secondary-button" key={label} aria-pressed={level===i} onClick={()=>{setLevel(i);setCompare(false);}}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[level]}</p>
  <div className="bronze-evidence-cards timbuktu-copy-cards">
   {[{id:'A',year:1690,text:'3 + 4 = 7'},{id:'B',year:1760,text:changed?'3 + 4 = 8':'3 + 4 = 7'}].map(card=><div key={card.id} className="bronze-evidence-card" data-timbuktu-copy={card.id}>
    <h4>Erfundene Abschrift {card.id}</h4><p><strong>Unser Rechenbeispiel:</strong> <span data-copy-content>{card.text}</span></p>
    <p><strong>Abschriftjahr im Lernbild:</strong> {dates?card.year:'ausgeblendet'}</p>
   </div>)}
  </div>
  <div className="model-buttons"><button className="secondary-button" aria-pressed={changed} onClick={()=>setView(v=>({...v,variant:!v.variant}))}>{changed?'Abschrift B zurückändern':'Abschrift B ändern'}</button><button className="secondary-button" aria-pressed={!dates} onClick={()=>setView(v=>({...v,extra:!v.extra}))}>{dates?'Abschriftjahre ausblenden':'Erfundene Abschriftjahre zeigen'}</button></div>
  <button className="secondary-button" aria-expanded={compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{compare?'Vergleich schließen':'Meine Überlegung vergleichen'}</button>
  {compare&&<div className="model-result" role="status"><strong>Eine mögliche Überlegung</strong><p>{explanations[level]}</p></div>}
  <p className="small-note">Die freiwillige Untersuchung vergibt keinen Stempel. Du vergleichst deine Überlegung; eine freie Erklärung wird hier nicht automatisch bewertet.</p>
 </section>;
}
