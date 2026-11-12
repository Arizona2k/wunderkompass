import {PaperFibreDrawing} from './paper-forming-evidence';
import './paper-origin-illustration.css';
/** Same drawing as the voluntary model; not a historical workshop image. */
export default function PaperOriginIllustration({compact=false}:{compact?:boolean}){
 return <figure className={'topic-illustration paper-origin-illustration'+(compact?' compact':'')} data-paper-origin-illustration>
  <PaperFibreDrawing step={1} label="Eigene vereinfachte Zeichnung: Eine Schicht vorhandener Pflanzenfasern liegt auf einem Sieb. Wasserzeichen unter dem Sieb zeigen einen möglichen Ablaufweg."/>
  <p className="paper-origin-label">Vorhandene Fasern formen eine Schicht</p>
  <figcaption>Eigene Erklärzeichnung · KI-unterstützt. Beim Schöpfen bleiben Fasern zurück; ein Teil des Wassers kann ablaufen. Keine Werkstattrekonstruktion.</figcaption>
 </figure>;
}
