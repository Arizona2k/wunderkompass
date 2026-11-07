// Own retained-topic teaching figure; invented examples and limits are explicit.
export function PeoplePhotonEnergyFigure({selected,onSelect}:{selected:number;onSelect:(value:number)=>void}){
 const count=selected===0?1:4, energy=selected===2?2:1;
 return <>
  <h4>Mehr Lichtquanten oder mehr Energie pro Quant?</h4>
  <p>Vergleiche für dieselbe gedachte Fläche und Zeitspanne die Anzahl und die Energie pro Lichtquant. Ein Balken steht für ein Quant; seine Höhe zeigt dessen Energie in frei gewählten Vergleichseinheiten.</p>
  <svg viewBox="0 0 320 240" role="img" aria-label={`Eigene Vergleichsgrafik: ${count} Lichtquant${count===1?'':'en'}, je ${energy} Energieeinheit${energy===1?'':'en'}; zusammen ${count*energy} Vergleichseinheiten. Keine Aufnahme von Lichtteilchen.`}>
   <path d="M25 205H295" stroke="#245762" strokeWidth="2"/>
   <path d="M25 145H295M25 85H295" stroke="#567579" strokeDasharray="5 4"/>
   {Array.from({length:count},(_,index)=><rect key={index} data-photon-bar={index} x={40+index*65} y={205-60*energy} width="34" height={60*energy} rx="3" fill="#467889" stroke="#245762" strokeWidth="2"/>)}
  </svg>
  <div className="people-evidence-legend"><span>Untere Hilfslinie: eine Energieeinheit pro Quant.</span><span>Obere Hilfslinie: zwei Energieeinheiten pro Quant.</span></div>
  <div className="visual-choice" role="group" aria-label="Anzahl und Energie der Lichtquanten"><button aria-pressed={selected===0} onClick={()=>onSelect(0)}>Ein Quant, einfache Energie</button><button aria-pressed={selected===1} onClick={()=>onSelect(1)}>Vier Quanten, einfache Energie</button><button aria-pressed={selected===2} onClick={()=>onSelect(2)}>Vier Quanten, doppelte Energie</button></div>
  <p className="people-evidence-observation" role="status">{count} Lichtquant{count===1?'':'en'} mit je {energy} Energieeinheit{energy===1?'':'en'}: zusammen {count*energy} Vergleichseinheit{count*energy===1?'':'en'}. {selected===1?'Gegenüber einem Quant steigt die Gesamtenergie. Die Energie jedes einzelnen Quants bleibt gleich.':selected===2?'Bei gleicher Anzahl ist nun die Energie pro Quant verdoppelt. Dazu gehört eine doppelt so hohe Lichtfrequenz.':'Zähle zuerst die Balken. Vergleiche anschließend ihre Höhe.'}</p>
  <p className="small-note">Eigene Darstellung mit KI-Unterstützung. Die Balken sind keine Form, Größe oder Flugbahn wirklicher Photonen. Frei gewählte Einheiten, keine gemessene Lampe, Elektronenauslösung oder Einstein-Versuchsanlage. Für die Energie eines Lichtquants gilt E = h·f; h ist die Planck-Konstante und f die Frequenz. Anzahl und Energie pro Quant sind verschiedene Größen.</p>
 </>;
}
