import {CoreHypothesisDrawing,INSECT_STAGES,InsectStageDrawing} from './people-observation-drawings';

export function InsectObservationFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const stages=selected===0?[3]:[0,1,2,3];
 return <>
  <h4>Was ergänzt eine Beobachtungsfolge?</h4>
  <p>Erfundenes Beispiel: Ein Schmetterling wird vom Ei bis zum erwachsenen Falter beobachtet. Die Karten ordnen seine notierten Entwicklungsstadien.</p>
  <div className={'people-evidence-comparison '+(selected===1?'is-comparing':'')}>
   {stages.map(stage=><figure key={stage} data-observation-card={stage}><InsectStageDrawing stage={stage}/><figcaption><strong>{INSECT_STAGES[stage]}</strong><span>{selected===1?'Beobachtung '+(stage+1)+' der gedachten Folge':'Ein ausgewähltes Bild'}</span></figcaption></figure>)}
  </div>
  <div className="visual-choice" role="group" aria-label="Einzelbild und Beobachtungsfolge vergleichen">{['Ein Falterbild','Vier Beobachtungen'].map((label,i)=><button key={label} aria-pressed={selected===i} onClick={()=>onSelect(i)}>{label}</button>)}</div>
  <p className="people-evidence-observation" role="status">{selected===0?'Das einzelne Bild zeigt den erwachsenen Falter. Die vorherigen Stadien sind darin nicht beobachtbar.':'Die Folge hält Veränderungen desselben gedachten Tiers fest. Ein erwachsener Falter wird nicht wieder zum Ei; neue Eier gehören zur nächsten Generation.'}</p>
  <p className="small-note">Eigene Erklärzeichnungen mit KI-Unterstützung. Kein Originalblatt von Merian und keine echten Beobachtungsdaten. Formen, Größen und Abstände sind vereinfacht; die Karten zeigen keine Entwicklungsdauer. Nicht alle Insekten entwickeln sich wie Schmetterlinge.</p>
 </>;
}
export function InnerCoreEvidenceFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 return <>
  <h4>Messung und Erklärung auseinanderhalten</h4>
  <p data-core-observation><strong>Beschriebene Beobachtung:</strong> Schwache Erdbebenwellensignale wurden auch in einem Bereich aufgezeichnet, in dem das zuvor benutzte einfachere Kernmodell sie nicht erklärte.</p>
  <div className="people-evidence-comparison"><figure><CoreHypothesisDrawing inner={selected===1}/><figcaption><strong>{selected===0?'Modell A: ohne inneren Kern':'Modell B: mit innerem Kern'}</strong><span>Blaugrau: übrige Erde. Orange: äußerer Kern. {selected===1?'Hell: zusätzlicher innerer Kern.':'Ein innerer Kern ist nicht berücksichtigt.'}</span></figcaption></figure></div>
  <div className="visual-choice" role="group" aria-label="Zwei Erklärungen des Erdkerns vergleichen">{['Modell A betrachten','Modell B betrachten'].map((label,i)=><button key={label} aria-pressed={selected===i} onClick={()=>onSelect(i)}>{label}</button>)}</div>
  <p className="people-evidence-observation" role="status">{selected===0?'Die beschriebene Beobachtung passt nicht zur bisherigen Erklärung. Messung und Modell müssen geprüft werden.':'Ein zusätzlicher innerer Kern hilft, die unerwarteten Signale zu erklären. Ob eine Erklärung passt, wird mit Messungen und Berechnungen geprüft, nicht mit der Bildfarbe.'}</p>
  <p>Heute wird zwischen flüssigem äußerem und festem innerem Kern unterschieden. Lehmanns Erklärung von 1936 und die später genauer bestimmten Eigenschaften sind verschiedene Forschungsschritte.</p>
  <p className="small-note">Eigene qualitative Schnittzeichnung mit KI-Unterstützung, ohne Maßstab. Kein Foto, originales Seismogramm oder berechneter Wellenverlauf; keine Laufzeiten oder Temperaturwerte. Der Schalter wechselt die betrachtete Erklärung, nicht den wirklichen Aufbau der Erde. Die beschriebene Beobachtung bleibt gleich.</p>
 </>;
}
