'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import {LearningFeedback} from './learning-motion';
import './catalhoyuk-house-evidence.css';
const levels=['Den Dachzugang verfolgen','Hausphasen unterscheiden','Erhalten und ergänzt'];
const questions=['Du bist in unserem gedachten Beispiel bereits auf dem Dach. Wo führt der Zugang ins Haus?','Was ist älter, was wurde später darüber angelegt?','Welche Linien zeigen im Lernbild den erhalten gedachten Rest, welche nur einen möglichen Aufbau?'];
const reflections=[
 'Der markierte Weg führt durch die Dachöffnung und entlang der gezeichneten Leiter nach unten. Das Schema beginnt bereits auf Dachhöhe; es zeigt nicht sämtliche Wege durch die Siedlung und keine Anleitung für den Aufbau eines echten Hauses.',
 'Der unten gezeichnete Rest gehört in unserem ungestörten Beispiel zur älteren Phase. Der darüber ergänzte Aufbau ist später. Die Zeichnung zeigt eine gewählte Reihenfolge, nicht zwei gleichzeitig bewohnte Stockwerke und keine gemessene historische Schichtdicke.',
 'Die dunkle durchgezogene Linie bleibt beim Wechsel erhalten, die gestrichelte obere Ergänzung ändert sich. Ein niedriger Rest legt den gesamten verschwundenen Aufbau nicht allein fest. Die beiden erfundenen Möglichkeiten sind keine gleich gut bestätigten Rekonstruktionen eines bestimmten Hauses; dafür wären weitere Befunde nötig.'
];
function RoofHouse({marked}:{marked:boolean}){
 return <svg viewBox="0 0 360 260" role="img" aria-label={'Eigener schematischer Hausschnitt mit Dachöffnung, Innenraum und Leiter.'+(marked?' Ein Pfeil führt von Dachhöhe durch die Öffnung ins Innere.':' Der Zugangspfeil ist ausgeblendet.')} data-catalhoyuk-roof-path={marked}>
  <path d="M80 80V224H280V80M80 80H176M222 80H280" fill="#eddfc5" stroke="#60533f" strokeWidth="7"/>
  <path d="M186 84L233 214M200 84L247 214M190 104H207M196 124H214M204 145H222M211 165H229M218 186H236M225 205H243" fill="none" stroke="#665139" strokeWidth="4"/>
  {marked&&<path d="M30 39H200V71M200 71L218 117M211 109l7 8 1-11" fill="none" stroke="#145f6e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>}
 </svg>;
}
function HousePhases({later}:{later:boolean}){
 return <svg viewBox="0 0 360 260" role="img" aria-label={'Eigene ungestörte Zeitfolge: Ein älterer Hausrest liegt unten und ist mit Material aufgefüllt.'+(later?' Darüber ist die spätere Hausphase ergänzt.':' Die spätere Hausphase ist ausgeblendet.')} data-catalhoyuk-later-phase={later}>
  <rect x="50" y="158" width="260" height="77" fill="#dfcdb1"/>
  <path d="M50 186V235H310V186" fill="none" stroke="#665139" strokeWidth="8"/>
  {later&&<path d="M50 63V154H310V63M50 63H310" fill="#eef1eb" stroke="#145f6e" strokeWidth="7"/>}
 </svg>;
}
function PartialHouse({higher}:{higher:boolean}){
 const roof=higher?42:94;
 return <svg viewBox="0 0 360 260" role="img" aria-label={'Eigene Darstellung: Ein durchgezogen gezeichneter niedriger Hausrest bleibt gleich. Eine gestrichelte, ausdrücklich vermutete Ergänzung ist '+(higher?'höher.':'niedriger.')} data-catalhoyuk-hypothetical-height={higher?'higher':'lower'}>
  <path d="M70 189V230H290V189" fill="none" stroke="#60533f" strokeWidth="8"/>
  <path d={'M70 183V'+roof+'H290V183'} fill="none" stroke="#145f6e" strokeWidth="5" strokeDasharray="10 8"/>
 </svg>;
}
export default function CatalhoyukHouseEvidence(){
 const[view,setView]=useHistoryEvidenceView('history-catalhoyuk',{level:0,variant:false,extra:false,compare:false});
 return <section className="history-context history-evidence catalhoyuk-house-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Hauszugang und Hausphasen" data-history-evidence="history-catalhoyuk" data-catalhoyuk-house-evidence>
  <h3>Ein Haus, mehrere Zeitspuren</h3>
  <p className="small-note">Eigene, mit KI-Unterstützung erstellte heutige Lernzeichnung. Alle drei Schnitte sind erfundene Schemata, keine vermessenen Grabungspläne oder bestätigten Rekonstruktionen eines bestimmten Hauses.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{levels.map((label,i)=><button key={label} className="secondary-button" aria-pressed={view.level===i} onClick={()=>setView(v=>({...v,level:i as 0|1|2,variant:false,extra:false,compare:false}))}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{questions[view.level]}</p>
  <figure className="catalhoyuk-house-figure">
   {view.level===0?<RoofHouse marked={view.variant}/>:view.level===1?<HousePhases later={view.variant}/>:<PartialHouse higher={view.extra}/>}
   <figcaption>{view.level===0?'Dachöffnung oben, Innenraum darunter, Leiter dazwischen. Der Vergleich beginnt bereits auf Dachhöhe.':view.level===1?'Brauner Rest unten: ältere Phase. Hellbraun: Auffüllung im älteren Haus und darüber. Ergänzter petrolfarbener Aufbau: spätere Phase. Ohne Zeitmaßstab.':'Durchgezogene dunkle Linie: erhalten gedachter Rest. Gestrichelte Linie: ausdrücklich vermutete Ergänzung. Keine gemessenen Raumhöhen.'}</figcaption>
  </figure>
  <div className="model-buttons">{view.level===0?<button className="secondary-button" aria-pressed={view.variant} onClick={()=>setView(v=>({...v,variant:!v.variant,compare:false}))}>{view.variant?'Zugangsweg ausblenden':'Zugangsweg markieren'}</button>:view.level===1?<button className="secondary-button" aria-pressed={view.variant} onClick={()=>setView(v=>({...v,variant:!v.variant,compare:false}))}>{view.variant?'Spätere Hausphase ausblenden':'Spätere Hausphase ergänzen'}</button>:<button className="secondary-button" aria-pressed={view.extra} onClick={()=>setView(v=>({...v,extra:!v.extra,compare:false}))}>Vermuteten Aufbau wechseln</button>}</div>
  <button className="secondary-button" aria-expanded={view.compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{view.compare?'Überlegung schließen':'Meine Überlegung vergleichen'}</button>
  <LearningFeedback active={view.compare} className="model-result"><strong>Eine mögliche Überlegung</strong><p>{reflections[view.level]}</p></LearningFeedback>
  <p className="small-note">Die freiwillige Beobachtung vergibt keinen Stempel und bewertet keine freie Erklärung. Eine gezeichnete Reihenfolge ist keine absolute Datierung. Das Modell berechnet weder Tragfähigkeit noch die Sicherheit eines Dachwegs.</p>
 </section>;
}
