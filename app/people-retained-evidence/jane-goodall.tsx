// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleToolPreparationFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 return <>
  <h4>Ein Zweig wird vorbereitet</h4>
  <p>Goodall beschrieb Schimpansen, die Blätter von einem Zweig entfernten, bevor sie ihn als Werkzeug für Termiten benutzten. Unsere eigene Zeichnung vergleicht nur den Zweig vor und nach dem Entfernen der Blätter.</p>
  <svg viewBox="0 0 320 220" role="img" aria-label={`Eigene schematische Zweigzeichnung ${selected===0?'mit vier gezeichneten Blättern':'ohne die gezeichneten Blätter'}. Der Zweig bleibt an derselben Stelle und gleich lang. Keine Originalaufnahme oder Messung.`}>
   <path data-tool-stem="true" d="M35 135Q160 120 285 135" stroke="#8e6545" strokeWidth="7" strokeLinecap="round" fill="none"/>
   {selected===0&&[80,125,175,220].map((x,index)=><g key={x} data-tool-leaf={index}><path d={index%2===0?`M${x} 130Q${x-30} 75 ${x+10} 66Q${x+37} 98 ${x} 130`:`M${x} 130Q${x-27} 175 ${x+13} 190Q${x+37} 156 ${x} 130`} fill="#679a71" stroke="#356b4c" strokeWidth="2"/></g>)}
  </svg>
  <div className="people-evidence-legend"><span>Braun: derselbe Zweig.</span><span>Grün: Blätter in der ersten Ansicht.</span></div>
  <div className="visual-choice" role="group" aria-label="Zweig vor oder nach der Vorbereitung"><button aria-pressed={selected===0} onClick={()=>onSelect(0)}>Mit Blättern</button><button aria-pressed={selected===1} onClick={()=>onSelect(1)}>Blätter entfernt</button></div>
  <p className="people-evidence-observation" role="status">{selected===0?'An dem gezeichneten Zweig sind vier Blätter zu sehen.':'Die vier gezeichneten Blätter sind entfernt; der Zweig bleibt erhalten.'} Eine Veränderung des Gegenstands ist etwas anderes als seine anschließende Benutzung. Beide Handlungen müssen bei einer wirklichen Beobachtung getrennt erkannt werden.</p>
  <p className="small-note">Eigene Modellzeichnung mit KI-Unterstützung, keine genaue Pflanzenbestimmung, Originalnotiz oder Aufnahme aus Gombe. Die vier Blätter sind frei gewählt. Das Bild zeigt weder einen Schimpansen noch Termitenfang und beweist keine Absicht oder allgemeine Regel für alle Tiere. Wildtiere aus Abstand beobachten, nicht berühren, füttern oder zu Handlungen bringen.</p>
 </>;
}
