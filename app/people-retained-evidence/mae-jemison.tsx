// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeopleSharedFallFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const shift=selected===0?0:45;
 return <>
  <h4>Gemeinsam fallen – der Abstand bleibt</h4>
  <p>Ein Gedankenbild zeigt eine frei fallende Kabine und einen freien Ball darin. Vergleiche zwei Zeitpunkte von außen: Beide verschieben sich gleich weit erdwärts. Ihr Abstand zueinander bleibt im vereinfachten Bild gleich.</p>
  <svg viewBox="0 0 320 270" role="img" aria-label={`Eigene schematische Zeichnung: ${selected===0?'erster':'späterer'} Zeitpunkt. Kabine und Ball im gemeinsamen freien Fall. Gleicher Abstand zum Kabinenboden, Erdanziehung wirkt weiter.`}>
   <path d="M30 30H290M30 75H290M30 120H290M30 165H290M30 210H290M30 255H290" stroke="#567579" strokeDasharray="4 4" fill="none"/>
   <rect data-freefall-cabin="true" x="65" y={30+shift} width="160" height="140" rx="7" fill="#f3f9f7" stroke="#467889" strokeWidth="3"/>
   <path data-freefall-floor="true" d={`M65 ${170+shift}H225`} stroke="#245762" strokeWidth="6" fill="none"/>
   <circle data-freefall-ball="true" cx="145" cy={90+shift} r="16" fill="#b65d32" stroke="#773c25" strokeWidth="2"/>
   <path d="M265 90V180M253 168L265 180L277 168" stroke="#467889" strokeWidth="3" fill="none"/>
   <path d={`M190 ${90+shift}V${170+shift}M184 ${90+shift}H196M184 ${170+shift}H196`} stroke="#245762" strokeWidth="2" fill="none"/>
  </svg>
  <div className="people-evidence-legend"><span>Orange: freier Ball. Umriss: Kabine mit Boden.</span><span>Pfeil: erdwärts. Abstandslinie: Ballmitte bis Boden.</span></div>
  <div className="visual-choice" role="group" aria-label="Zeitpunkt des Gedankenbildes"><button aria-pressed={selected===0} onClick={()=>onSelect(0)}>Erster Zeitpunkt</button><button aria-pressed={selected===1} onClick={()=>onSelect(1)}>Späterer Zeitpunkt</button></div>
  <p className="people-evidence-observation" role="status">{selected===0?'Merke dir die Lage von Kabine und Ball an den gestrichelten Hilfslinien.':'Beide liegen jetzt tiefer. Die Ballmitte bleibt gleich weit vom Boden entfernt.'} Von innen wirkt der Ball deshalb schwebend. Das bedeutet nicht, dass die Erdanziehung verschwunden ist.</p>
  <p className="small-note">Eigene Modellzeichnung mit KI-Unterstützung, kein Nachbau der Endeavour und keine Messung von Mae Jemisons Mission. Idealisiert: gleiche Anfangsbewegung und gleiche Beschleunigung durch Schwerkraft; keine Berührung, Luftströmung oder Restbeschleunigung. Das gerade Gedankenbild berechnet keine Umlaufbahn, Fallzeit oder körperliche Wirkung. In einer Erdumlaufbahn gehört schnelle seitliche Bewegung dazu. Ein Gedankenvergleich, kein Versuch zum Nachmachen.</p>
 </>;
}
