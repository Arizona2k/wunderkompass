// Own qualitative particle models with readable HTML legends and explicit limits.
import {useState} from 'react';
export type ParticleFigureKind='atom-regions'|'isotope-counts'|'element-identity'|'ion-charge';
const ink='#245d70',accent='#b6541f',envelope='#d9eaf1',neutral='#e3e5e2';
const carbon=[{label:'Kohlenstoff-12',p:6,n:6,e:6},{label:'Kohlenstoff-13',p:6,n:7,e:6}];
const hydrogen=[{label:'Wasserstoff-1',p:1,n:0,e:1},{label:'Wasserstoff-2',p:1,n:1,e:1},{label:'Wasserstoff-3',p:1,n:2,e:1}];
const identity=[{label:'Ausgangsbeispiel',p:6,n:6,e:6},{label:'Ein Neutron mehr',p:6,n:7,e:6},{label:'Ein Elektron weniger',p:6,n:6,e:5},{label:'Ein Proton mehr',p:7,n:6,e:6}];
const ions=[{label:'Sechs Protonen, sechs Elektronen',p:6,n:6,e:6},{label:'Ein Elektron entfernt',p:6,n:6,e:5}];
const titles:Record<ParticleFigureKind,string>={'atom-regions':'Kern und Hülle als Bereiche unterscheiden','isotope-counts':'Gleiche Protonenzahl, andere Neutronenzahl','element-identity':'Welche Änderung betrifft das Element?','ion-charge':'Positive und negative Ladungen zählen'};
export function BookParticleFigure({kind,term}:{kind:ParticleFigureKind;term:string}){
 const [choice,setChoice]=useState(0),options=kind==='isotope-counts'?(term==='Neutron'?hydrogen:carbon):kind==='element-identity'?identity:kind==='ion-charge'?ions:[],selected=options[choice]??options[0],charge=selected?selected.p-selected.e:0;
 const rows=selected?[{name:'p',count:selected.p,y:35},{name:'n',count:selected.n,y:95},...(kind==='isotope-counts'?[]:[{name:'e',count:selected.e,y:155}])]:[];
 return <figure className="book-heat-figure book-light-figure" data-book-particle-figure={kind}>
  <h4><strong>{titles[kind]}</strong></h4>
  <svg viewBox={kind==='atom-regions'?'0 0 320 180':kind==='isotope-counts'?'0 0 320 135':'0 0 320 195'} role="img" aria-label={titles[kind]+'. Erklärung und Grenzen direkt darunter.'} style={{display:'block',width:'100%',height:'auto',maxWidth:640}}>
   {kind==='atom-regions'?<>
    <path data-particle-region="envelope" d="M40 70C50 20 135 10 185 25C250 20 295 70 275 120C250 165 155 170 90 145C45 135 25 105 40 70Z" fill={envelope} stroke={ink} strokeWidth={2}/>
    <circle data-particle-region="nucleus" cx={160} cy={90} r={12} fill="#efd7bd" stroke={accent} strokeWidth={3}/>
   </>:rows.map(row=><g key={row.name} data-particle-row={row.name} data-count={row.count}>
    {Array.from({length:row.count},(_,i)=>{const x=160+(i-(row.count-1)/2)*40;return <g key={i} data-particle-symbol={row.name}>
     {row.name==='n'?<path d={`M${x} ${row.y-12}L${x+12} ${row.y}L${x} ${row.y+12}L${x-12} ${row.y}Z`} fill={neutral} stroke={ink} strokeWidth={2}/>:<circle cx={x} cy={row.y} r={12} fill={row.name==='p'?'#efd7bd':envelope} stroke={row.name==='p'?accent:ink} strokeWidth={2}/>}
     {row.name!=='n'&&<path d={`M${x-6} ${row.y}H${x+6}${row.name==='p'?`M${x} ${row.y-6}V${row.y+6}`:''}`} fill="none" stroke={ink} strokeWidth={2}/>} 
    </g>;})}
   </g>)}
  </svg>
  {options.length>0&&<div className="visual-choice" role="group" aria-label={titles[kind]}>{options.map((option,i)=><button key={option.label} className="secondary-button" aria-pressed={choice===i} onClick={()=>setChoice(i)}>{option.label}</button>)}</div>}

  <ol className="book-model-key">
  {selected&&<li><span role="status">{selected.p} {selected.p===1?'Proton':'Protonen'} und {selected.n} {selected.n===1?'Neutron':'Neutronen'} im gedachten Kern.{kind==='isotope-counts'?` Die Summe ist ${selected.p+selected.n}; sie heißt hier Massenzahl.`:` Dazu ${selected.e} Elektronen: ${charge===0?'Die positiven und negativen Ladungen gleichen sich aus.':`Es bleibt ${charge} positive Elementarladung übrig; das gedachte Atom ist positiv geladen.`}`}</span></li>}
   {kind==='atom-regions'?<>
    <li>Die kleine orange Fläche bezeichnet den Kern, die größere blaue Fläche den Hüllenbereich eines Atoms.</li>
    <li>Der Hüllenbereich ist keine feste Schale. Es sind keine Kreisbahnen oder einzelnen Elektronenpositionen eingezeichnet.</li>
    <li>Kern und Hülle sind Teile eines Atoms. Eine biologische Zelle gehört zu einer anderen Aufbau-Ebene.</li>
   </>:<>
    <li>Oben stehen orange Kreise mit Plus für Protonen. Darunter zählen graue Rauten Neutronen ohne elektrische Gesamtladung.</li>
    {kind==='isotope-counts'?<li>Die Protonenzahl bleibt gleich, die Neutronenzahl ändert sich. Die Summe zählt Kernteilchen; sie ist keine Masse in Kilogramm oder mittlere Atommasse des Elements.</li>:<li>In der dritten Zeile stehen blaue Kreise mit Minus für Elektronen. Die Zeilen helfen beim Zählen; sie zeigen keine räumliche Anordnung oder Bewegung.</li>}
    {kind==='element-identity'&&<li>Ein anderes Element bedeutet eine andere Protonenzahl. Ein Neutron mehr und ein Elektron weniger ändern andere Eigenschaften.</li>}
    {kind==='ion-charge'&&<li>Der Kern bleibt in beiden Beispielen unverändert. Ein Elektron weniger ändert die Gesamtladung, nicht die Elementzuordnung.</li>}
   </>}
  </ol>
  <figcaption className="book-figure-limit">Eigene Zeichnung mit KI-Unterstützung. {kind==='atom-regions'?'Qualitative Gliederung ohne Größenmaßstab, Atombild oder berechnete Aufenthaltswahrscheinlichkeit. Die wirklichen Größenverhältnisse sind nicht dargestellt.':'Gedankliches Zählmodell, keine Teilchenaufnahme, Kernform, Größen- oder Bewegungsskala. Die Zeichen sagen nichts über Stabilität, Reaktionsablauf oder eine Versuchsdurchführung aus.'}</figcaption>
 </figure>;
}
