'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import {LearningFeedback} from './learning-motion';
import './polynesia-evidence.css';

const directions=['Norden','Osten','Süden','Westen'];
const stages=['Den Blick wechseln','Hinweise verbinden','Die Aussage begrenzen'];
export default function PolynesiaEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-polynesia',{level:0,variant:true,extra:false,compare:false,choice:0});const stage=view.level,heading=(view.choice??0)*90,swellKnown=view.variant,explain=view.compare;
 const relative=(90-heading+360)%360,relativeName=relative===0?'vorne':relative===90?'rechts':relative===180?'hinten':'links';
 const tasks=['Drehe das Bootssymbol. Der erfundene Referenzpunkt bleibt in diesem eingefrorenen Moment östlich. Wo liegt er aus Sicht des Boots?','Wolken verdecken den benutzten Stern. Vergleiche einen bereits geprüften Dünungshinweis mit einem inzwischen unklaren Wellenmuster.','Kann ein einzelner Richtungshinweis die genaue Position und den ganzen Weg beweisen? Begründe, was noch untersucht werden müsste.'];
 const explanations=[
  'Der Referenzpunkt bleibt im Lernbild östlich. Seine Lage relativ zum Boot verändert sich: Beim Blick nach Norden liegt er rechts, beim Blick nach Osten vorne. Welt-Richtung und Blickrichtung sind verschiedene Bezüge.',
  swellKnown?'Wenn die Dünungsrichtung bekannt und hinreichend beständig ist, kann sie ein weiterer Richtungshinweis sein. Diese Annahme muss beobachtet und überprüft werden.':'Wenn das Wellenmuster unklar geworden ist, ist die bisherige Annahme nicht einfach weiter gesichert. Eine veränderte Bootsbewegung beweist dann nicht allein eine Kursänderung.',
  'Ein Richtungshinweis ist Teil einer Einschätzung. Er bestimmt für sich allein weder die genaue Position noch den gesamten zurückgelegten Weg. Das Lernbild enthält keine Strömungs-, Wetter- oder Positionsrechnung. Deine eigene Begründung wird hier nicht automatisch bewertet.'
 ];
 return <section className="history-context history-evidence polynesia-evidence" tabIndex={-1} data-history-evidence="history-polynesia" aria-label="Richtungshinweise untersuchen">
  <h3>Wohin schaust du – und woher kommt dein Hinweis?</h3>
  <p className="small-note">Eigene schematische Draufsicht mit vier Richtungen und erfundenem Bootssymbol. Kein historischer Sternkompass, wirklicher Sternplan oder berechneter Seeweg.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{stages.map((label,index)=><button key={label} className="secondary-button" aria-pressed={stage===index} onClick={()=>{setView(v=>({...v,level:index as 0|1|2,compare:false}));}}>{index+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[stage]}</p>
  {stage===0?<>
   <figure className="polynesia-bearing-figure">
    <svg viewBox="0 0 360 360" role="img" aria-label={`Erfundene Draufsicht: Das Boot blickt nach ${directions[heading/90]}. Der östliche Referenzpunkt liegt aus seiner Sicht ${relativeName}.`}>
     <circle cx="180" cy="180" r="135" fill="#eef5f5" stroke="#6d8c92" strokeWidth="2"/>
     <path d="M180 31V48M180 312V329M31 180H48M312 180H329" stroke="#284c58" strokeWidth="4"/>
     <path d="M180 180H298" stroke="#9b692d" strokeWidth="3" strokeDasharray="7 5"/>
     <circle cx="308" cy="180" r="11" fill="#ffc676" stroke="#75431a" strokeWidth="3"/>
     <g transform={`rotate(${heading} 180 180)`}>
      <path d="M153 115Q134 171 153 240Q170 181 153 115ZM207 115Q188 171 207 240Q224 181 207 115Z" fill="#27778c" stroke="#173c49" strokeWidth="3"/>
      <path d="M151 157H209M151 206H209M180 105V152M169 118l11-13 11 13" fill="none" stroke="#173c49" strokeWidth="5"/>
     </g>
    </svg>
    <figcaption>Oben im Bild: Norden. Rechts: Osten. Unten: Süden. Links: Westen. Der orange Punkt ist ein erfundener, hier östlicher Referenzpunkt.</figcaption>
   </figure>
   <div className="model-buttons" role="group" aria-label="Blickrichtung des Bootssymbols">{directions.map((label,index)=><button className="secondary-button" key={label} aria-pressed={heading===index*90} onClick={()=>{setView(v=>({...v,choice:index,compare:false}));}}>Blick nach {label}</button>)}</div>
   <p className="model-result" role="status">Bootblick: {directions[heading/90]}. Derselbe östliche Referenzpunkt liegt aus Sicht des Boots {relativeName}.</p>
  </>:stage===1?<>
   <div className="model-buttons" role="group" aria-label="Annahme über die Dünung vergleichen"><button className="secondary-button" aria-pressed={swellKnown} onClick={()=>{setView(v=>({...v,variant:true,compare:false}));}}>Geprüfter Dünungshinweis</button><button className="secondary-button" aria-pressed={!swellKnown} onClick={()=>{setView(v=>({...v,variant:false,compare:false}));}}>Wellenmuster unklar</button></div>
   <p className="model-result" role="status">{swellKnown?'Gedachter Fall: Die Richtung der Dünung wurde mit einem bekannten Himmelszeichen verglichen und erscheint weiterhin beständig.':'Gedachter Vergleich: Mehrere Dünungen und örtliche Windwellen überlagern sich; die vorherige Richtung ist nicht mehr klar zu erkennen.'}</p>
  </>:<p className="model-result">Das Bild gibt vier feste Richtungen vor. Eine wirkliche Fahrt stellt weitere Fragen: Welche Hinweise sind gerade sichtbar? Wie haben sie sich verändert? Welche Annahmen gelten noch?</p>}
  <button className="secondary-button" aria-expanded={explain} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{explain?'Vergleich schließen':'Meine Überlegung vergleichen'}</button>
  <LearningFeedback active={explain} className="model-result"><strong>Eine mögliche Einordnung</strong><p>{explanations[stage]}</p></LearningFeedback>
  <p className="small-note">Die Beobachtung ist freiwillig und vergibt keinen neuen Stempel. Historische Navigation ist erlerntes Wissen mit unterschiedlichen Traditionen. Das einfache Bild ersetzt dieses Wissen nicht.</p>
 </section>;
}
