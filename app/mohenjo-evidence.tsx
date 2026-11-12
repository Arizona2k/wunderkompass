'use client';
import {useId} from 'react';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import {LearningFeedback} from './learning-motion';
import './mohenjo-evidence.css';

const labels=['Einen Weg verfolgen','Pläne vergleichen','Beleg und Vermutung trennen'];
const tasks=['Verfolge den blauen Weg vom Haus weg. Was zeigt der gezeichnete Plan direkt?','Wechsle zwischen den beiden erfundenen Plänen. Was ist am Wasserweg verschieden?','Vergleiche die erfundenen Fundstellen. Was weißt du über eine untersuchte Stelle – und was bleibt offen? Begründe, welche weitere Information du benötigen würdest.'];
export default function MohenjoEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-mohenjo-daro',{level:0,variant:true,extra:false,compare:false});
 const {level,variant:connected,extra:moreObserved,compare:explain}=view;
 const setLevel=(level:number)=>setView(v=>({...v,level:level as 0|1|2,compare:false}));
 const setExplain=(compare:boolean)=>setView(v=>({...v,compare}));
 const legend=useId();
 const explanations=[
  'Der blaue Weg zeigt einen eingezeichneten Ablauf. Das ist eine Beobachtung am Lernbild.',
  'Im zweiten Plan endet der Weg vor dem Kanal. Du vergleichst einen sichtbaren Unterschied; die Bilder sind keine rekonstruierten Ausgrabungspläne.',
  moreObserved?'Im erfundenen Vergleich sind bei A und C Abläufe eingezeichnet. Bei D ist kein Ablauf beobachtet; B bleibt unbetrachtet. Das sind verschiedene Informationsstände. Auch mehrere solche Stellen beweisen nicht, wie alle Menschen lebten oder ob ihr Wasser keimfrei war. Deine eigene Begründung wird hier nicht automatisch bewertet.':'Ein Ablauf an A ist ein einzelner Hinweis. Über B, C und D fehlen in diesem Bild noch Beobachtungen. Fehlende Kenntnis ist kein Beleg, dass dort nie ein Ablauf existierte. Gesundheit oder gleiche Lebensbedingungen aller Menschen benötigen weitere Belege. Deine eigene Begründung wird hier nicht automatisch bewertet.'
 ];
 const observed=[{name:'A',known:true,drain:true},{name:'B',known:false,drain:false},{name:'C',known:moreObserved,drain:true},{name:'D',known:moreObserved,drain:false}];
 return <section className="history-context history-evidence mohenjo-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv" data-history-evidence="history-mohenjo-daro">
  <h3>Was verrät ein Stadtplan?</h3>
  <p className="small-note">Eigenes erfundenes Lernbild. Keine Abbildung eines Fundstücks und kein historischer Originalplan.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{labels.map((label,i)=><button className="secondary-button" key={label} aria-pressed={level===i} onClick={()=>{setLevel(i);setExplain(false);}}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[level]}</p>
  <figure className="topic-illustration mohenjo-path">
   <svg viewBox="0 0 360 150" role="img" aria-label={connected?'Erfundener Plan mit eingezeichnetem Ablauf vom Haus in den Kanal.':'Erfundener Vergleichsplan: Der Wasserweg endet vor dem Kanal.'}>
    <rect x="30" y="24" width="110" height="80" rx="5" fill="#ebdfcc" stroke="#695b45" strokeWidth="3"/>
    <path d="M160 15V135M190 15V135" stroke="#526e78" strokeWidth="5"/>
    <path d={connected?'M80 80H175V130':'M80 80H145'} stroke="#226c86" strokeWidth="6" fill="none"/>
    <path d={connected?'M165 118l10 12 10-12':'M133 70l12 10-12 10'} stroke="#226c86" strokeWidth="4" fill="none"/>
   </svg>
   <figcaption className="topic-diagram-label">Links: ein Haus. Rechts: ein Kanal. Blau: {connected?'ein verbundener Wasserweg.':'ein Weg, der vor dem Kanal endet.'} Nicht maßstäblich.</figcaption>
  </figure>
  <div className="model-buttons"><button className="secondary-button" aria-pressed={!connected} onClick={()=>{setView(v=>({...v,variant:!v.variant,compare:false}));}}>{connected?'Vergleichsplan öffnen':'Plan mit Verbindung öffnen'}</button></div>
  {level===2&&<div className="mohenjo-sample">
   <h4>Wie weit reicht dein Befund?</h4>
   <p id={legend}>Vier erfundene Vergleichsorte. „Nicht betrachtet“ und „kein Ablauf beobachtet“ bedeuten etwas Verschiedenes. Das Bild zeigt keine echte Verteilung von Ausgrabungen.</p>
   <ul className="mohenjo-sample-grid" aria-describedby={legend}>{observed.map(place=><li key={place.name} data-sample-place={place.name} data-sample-known={place.known} data-sample-drain={place.known?place.drain:'unknown'}>
    <strong>Stelle {place.name}</strong>
    <svg viewBox="0 0 100 70" aria-hidden="true" focusable="false"><rect x="12" y="12" width="76" height="46" fill={place.known?'#f3e7d5':'#f4f5f4'} stroke="#536870" strokeWidth="3" strokeDasharray={place.known?undefined:'5 4'}/>{place.known&&place.drain&&<path d="M40 40H93" stroke="#226c86" strokeWidth="5" fill="none"/>}</svg>
    <span>{!place.known?'Noch nicht betrachtet':place.drain?'Ablauf sichtbar':'Kein Ablauf beobachtet'}</span>
   </li>)}</ul>
   <button className="secondary-button" aria-pressed={moreObserved} onClick={()=>{setView(v=>({...v,extra:!v.extra,compare:false}));}}>{moreObserved?'Nur Stelle A betrachten':'Weitere Vergleichsstellen betrachten'}</button>
   <p className="small-note">Der Vergleich liefert erfundene Beobachtungen zum Nachdenken. Aus dem Bild folgt weder eine Aussage über alle Häuser noch eine Bewertung der Menschen, die dort lebten.</p>
  </div>}
  <div className="model-buttons"><button className="secondary-button" aria-expanded={explain} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{explain?'Denkhilfe schließen':'Meine Überlegung vergleichen'}</button></div>
  <LearningFeedback active={explain} className="model-result"><strong>Eine mögliche Einordnung</strong><p>{explanations[level]}</p></LearningFeedback>
  <p className="small-note">Diese freiwillige Beobachtung vergibt keinen Stempel. Die Mini-Frage und deine bisherigen Lernstände behalten ihre Funktion.</p>
 </section>;
}
