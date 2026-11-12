'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import {LearningFeedback} from './learning-motion';
import './cahokia-earth-evidence.css';

const levels=['Oberfläche und Aufbau','Bauabschnitte unterscheiden','Eine Schätzung lesen'];
const questions=[
 'Siehst du eine heutige Oberfläche oder einen untersuchten Aufbau? Öffne unseren gedachten Schnitt und vergleiche.',
 'In unserem ungestörten Lernbeispiel liegt eine gedachte Erdschicht unten. Was verändert sich, wenn weitere Lagen hinzukommen?',
 'Die Fachseiten nennen ungefähr 10.000–20.000 Menschen. Was ändert das Markieren einer Zahl an der Unsicherheit der Schätzung?'
];
const comparisons=[
 'Gras kann sowohl einen natürlichen Hügel als auch ein menschliches Erdwerk bedecken. Die Fachbeschreibung nennt für Monks Mound aufgeschüttete Erde und mehrere Bauabschnitte. Unser frei gezeichneter Schnitt macht den Unterschied anschaulich; er ist kein Grabungsbeweis.',
 'Die untere gedachte Lage bleibt bestehen, weitere Lagen werden darüber ergänzt. Die drei Modelllagen zeigen eine Reihenfolge ohne Zeitmaßstab. Sie sind nicht die vierzehn für Monks Mound genannten Bauabschnitte, nicht deren Dicke und nicht vierzehn Jahre Bauzeit.',
 'Beide Zahlen gehören zu derselben ungefähren Schätzung. Das Markieren eines Endes macht daraus weder eine genaue Volkszählung noch eine Veränderung der historischen Bevölkerung. Die Bandbreite bleibt sichtbar; eine genaue Einzelzahl ist hier nicht belegt.'
];

export function CahokiaEarthDrawing({inside=false,allLayers=true}:{inside?:boolean;allLayers?:boolean}){
 return <svg viewBox="0 0 400 250" role="img" aria-label={inside?'Eigener gedachter Erdhügelschnitt: '+(allLayers?'Drei frei gewählte Lernlagen liegen übereinander.':'Nur die untere gedachte Lernlage ist gefüllt; ein gestrichelter Umriss zeigt die spätere Modellgrenze.'):'Eigener schematischer Hügel mit grüner Oberfläche. Sein Inneres ist nicht dargestellt.'} data-cahokia-cutaway={inside} data-cahokia-layers={inside?(allLayers?'three':'lower'):'hidden'}>
  <defs><clipPath id="cahokia-thought-mound"><path d="M42 218L118 89H282L358 218Z"/></clipPath></defs>
  {inside?<>
   <g clipPath="url(#cahokia-thought-mound)">
    <rect x="35" y="176" width="330" height="43" fill="#9e7652"/>
    {allLayers&&<><rect x="35" y="132" width="330" height="44" fill="#c5a47d"/><rect x="35" y="85" width="330" height="47" fill="#e3ceb0"/></>}
   </g>
   <path d="M42 218L118 89H282L358 218" fill="none" stroke="#60523f" strokeWidth="4" strokeDasharray={allLayers?undefined:'8 7'}/>
  </>:<path d="M42 218L118 89H282L358 218Z" fill="#d7dfc5" stroke="#436b51" strokeWidth="5"/>}
  <path d="M22 220H378" fill="none" stroke="#60523f" strokeWidth="4"/>
 </svg>;
}

export default function CahokiaEarthEvidence(){
 const[view,setView]=useHistoryEvidenceView('history-cahokia',{level:0,variant:false,extra:false,compare:false});
 return <section className="history-context history-evidence cahokia-earth-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Erdhügel, Bauabschnitte und Schätzungen" data-history-evidence="history-cahokia" data-cahokia-earth-evidence>
  <h3>Was zeigt der Hügel – und was schätzen wir?</h3>
  <p className="small-note">Eigene, mit KI-Unterstützung erstellte heutige Lernzeichnung. Der vereinfachte Hügel und die drei Lernlagen sind frei gezeichnet, kein vermessener Schnitt durch Monks Mound.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{levels.map((label,i)=><button className="secondary-button" key={label} aria-pressed={view.level===i} onClick={()=>setView(v=>({...v,level:i as 0|1|2,variant:false,extra:false,compare:false}))}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{questions[view.level]}</p>
  {view.level<2?<figure className="cahokia-earth-figure">
   <CahokiaEarthDrawing inside={view.level===1||view.variant} allLayers={view.level===0||view.variant}/>
   <figcaption>{view.level===0?(view.variant?'Braune Flächen: gedachte aufgeschüttete Erde im Lernbild. Die Fachbelege, nicht diese eigene Zeichnung, tragen die Aussage über den historischen Aufbau.':'Grün: eine heutige Oberfläche im Lernbild. Aus ihrem Aussehen allein folgt noch keine sichere Entstehungsgeschichte.'):view.variant?'Untere gedachte Lage und zwei spätere Ergänzungen. Drei Lernlagen ohne Zeit- oder Größenmaßstab.':'Braun unten: die erste gedachte Lage. Der gestrichelte Umriss zeigt nur die spätere Grenze unseres Lernbilds.'}</figcaption>
  </figure>:<figure className="cahokia-estimate-figure">
   <div className="cahokia-estimate-range" role="img" aria-label={'Dieselbe ungefähre Bevölkerungsschätzung von 10.000 bis 20.000 Menschen. Markiert ist '+(view.variant?'die obere':'die untere')+' Angabe; die gesamte Bandbreite bleibt erhalten.'}>
    <div className="cahokia-estimate-labels"><strong data-current={!view.variant||undefined}>10.000</strong><span>bis</span><strong data-current={view.variant||undefined}>20.000</strong></div>
    <div className="cahokia-estimate-band" aria-hidden="true"/>
   </div>
   <figcaption>Ungefähre Angabe zur Blütezeit um 1100. Keine genaue Volkszählung, keine zeitliche Wachstumskurve und kein berechnetes Vertrauensintervall.</figcaption>
  </figure>}
  <div className="model-buttons"><button className="secondary-button" aria-pressed={view.variant} onClick={()=>setView(v=>({...v,variant:!v.variant,compare:false}))}>{view.level===0?(view.variant?'Gedachten Schnitt schließen':'Gedachten Schnitt öffnen'):view.level===1?(view.variant?'Weitere Lernlagen ausblenden':'Weitere Lernlagen zeigen'):'Anderes Ende der Schätzung markieren'}</button></div>
  <button className="secondary-button" aria-expanded={view.compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{view.compare?'Überlegung schließen':'Meine Überlegung vergleichen'}</button>
  <LearningFeedback active={view.compare} className="model-result"><strong>Eine mögliche Überlegung</strong><p>{comparisons[view.level]}</p></LearningFeedback>
  <p className="small-note">Das Modell berechnet keine historische Arbeitszeit, Erdmenge oder Einwohnerzahl. Der freiwillige Vergleich vergibt keinen Stempel und bewertet keine freie Erklärung. Die tatsächlichen Quellen findest du auf der Entdeckerkarte.</p>
 </section>;
}
