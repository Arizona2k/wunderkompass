// Own qualitative models with normal HTML legends and explicit model limits.
import {useState} from 'react';

export type WaterFigureKind='molecule-pairs'|'surface-support'|'limited-capillary'|'mass-volume'|'ship-displacement';
const ink='#245d70',accent='#b6541f',water='#d9eaf1',material='#efd7bd';
const descriptions:Record<WaterFigureKind,{title:string;key:string[];limit:string}>={
 'molecule-pairs':{title:'Welche beiden Stoffe wirken aufeinander?',key:['Blaue Kreise stehen für gedachte Wasserteilchen; rechts ist ein anderes Wandmaterial.','Die markierten Linien zeigen je nach Auswahl Wasser–Wasser oder Wasser–Wand. Die sechs Wassersymbole und das Material bleiben gleich.'],limit:'Eigene Zuordnungsskizze, keine Molekülgeometrie, Bindungsaufnahme oder Kraftmessung. Benetzung hängt von Flüssigkeit und Material ab.'},
 'surface-support':{title:'Kontakt mit der Wasseroberfläche vergleichen',key:['Das orange Gedankenobjekt hat in beiden Ansichten dieselbe Form.','An der Grenzfläche berührt es Wasser und Luft; darunter fehlt derselbe Grenzflächenkontakt.','Die dünne Wasserlinie bezeichnet eine Grenzfläche, keine feste Folie.'],limit:'Qualitative gedachte Lagen, keine Vorhersage einer Tragfähigkeit oder eines Kräftegleichgewichts. Form, Benetzung und Gewicht spielen mit. Keine Anleitung für einen Nadelversuch.'},
 'limited-capillary':{title:'Enges und breiteres benetzbares Röhrchen',key:['Beide Röhrchen stehen im selben gedachten Wasserbehälter. Material und Flüssigkeit bleiben gleich.','Links ist das Röhrchen enger, rechts breiter. Unter diesen benetzbaren Modellbedingungen liegt der Stand links höher.','Beide Wasserstände bleiben begrenzt; die Kurven zeigen schematisch benetzte Wände.'],limit:'Qualitativer Vergleich ohne Längen- oder Zeitskala. Keine echte Steighöhe und keine vollständige Erklärung des Wassertransports in hohen Pflanzen.'},
 'mass-volume':{title:'Masse und Volumen zusammen vergleichen',key:['Links steht Körper A, rechts Körper B. Jedes gezeichnete Feld zählt eine gedachte Volumeneinheit.','Die Massenzahlen stehen darunter und werden nicht durch Teilchenzahlen dargestellt.','Teile jeweils die Masse durch das Volumen. Die Zeichnung behauptet keine Eigenschaften eines wirklichen Stoffes.'],limit:'Erfundene Zahlenbeispiele mit denselben Masseneinheiten und denselben Volumeneinheiten für A und B. Die Felder sind eine Zählhilfe, kein räumliches Körpermodell oder Schwimmversuch.'},
 'ship-displacement':{title:'Festes Material und ganze Rumpfform unterscheiden',key:['Links ist eine kompakte Form, rechts eine Form mit Innenraum. Dieselbe Farbe kennzeichnet nur dieselbe gedachte Materialart.','Beim Rumpf gehört der Innenraum zur Betrachtung der ganzen Form. Er ist nicht zusätzliches festes Material.','Zum Schwimmvergleich brauchst du Masse und mögliche Wasserverdrängung der ganzen Form sowie die Bedingungen für Lage und Wassereintritt.'],limit:'Zwei Formideen ohne Massenzahlen, Maßstab, Wasserstand oder zugesicherte Schwimmlage. Gleiche Farbe und gezeichnete Flächen beweisen weder gleiche Masse noch gleiche Tragfähigkeit. Keine Bau- oder Sicherheitsfreigabe.'}
};
const densityPairs=[
 {label:'Gleiches Volumen',a:{mass:2,volume:2},b:{mass:4,volume:2}},
 {label:'Gleiche Masse',a:{mass:4,volume:2},b:{mass:4,volume:4}},
 {label:'Beides verändert',a:{mass:4,volume:2},b:{mass:6,volume:6}}
];

export function BookWaterFigure({kind,term}:{kind:WaterFigureKind;term:string}){
 const [choice,setChoice]=useState(()=>kind==='molecule-pairs'&&term==='Adhäsion'?1:0),d=descriptions[kind];
 const controls:Partial<Record<WaterFigureKind,string[]>>={'molecule-pairs':['Wasser–Wasser','Wasser–Wand'],'surface-support':['An der Grenzfläche','Vollständig darunter'],'mass-volume':densityPairs.map(p=>p.label)};
 const pair=densityPairs[choice]??densityPairs[0];
 return <figure className="book-heat-figure book-light-figure book-water-figure" data-book-water-figure={kind}>
  <h4><strong>{d.title}</strong></h4>
  <svg viewBox={kind==='mass-volume'?'0 28 320 115':kind==='ship-displacement'?'0 25 320 130':'0 0 320 180'} role="img" aria-label={d.title+'. Beschreibung und Modellgrenzen direkt darunter.'} style={{display:'block',width:'100%',height:'auto',maxWidth:640}}>
   {kind==='molecule-pairs'&&<>
    <rect data-water-wall="true" x={267} y={20} width={20} height={140} rx={3} fill={material} stroke={ink} strokeWidth={2}/>
    {choice===0?[60,120].flatMap(y=>[85,140].map(x=><path data-water-pair="water-water" key={x+'-'+y} d={`M${x} ${y}H${x+55}`} stroke={accent} strokeWidth={4}/>)):[60,120].map(y=><path data-water-pair="water-wall" key={y} d={`M195 ${y}H267`} stroke={accent} strokeWidth={4}/>)}
    {[60,120].flatMap(y=>[85,140,195].map(x=><circle data-water-symbol="true" key={x+'-'+y} cx={x} cy={y} r={15} fill={water} stroke={ink} strokeWidth={2}/>))}
   </>}
   {kind==='surface-support'&&<>
    <path d={choice===0?'M20 60H100Q110 60 122 70H198Q210 60 220 60H300V165H20Z':'M20 60H300V165H20Z'} fill={water}/>
    <path data-water-interface="true" d={choice===0?'M20 60H100Q110 60 122 70M198 70Q210 60 220 60H300':'M20 60H300'} fill="none" stroke={ink} strokeWidth={2}/>
    <ellipse data-water-thought-object={choice===0?'surface':'submerged'} cx={160} cy={choice===0?70:120} rx={38} ry={5} fill={accent} stroke={ink} strokeWidth={2}/>
   </>}
   {kind==='limited-capillary'&&<>
    <path d="M20 115H300V165H20Z" fill={water}/>
    <path d="M20 115H300" fill="none" stroke={ink} strokeWidth={2} strokeDasharray="5 4"/>
    <path data-water-capillary="narrow" d="M74 40Q80 47 86 40V165H74Z" fill={water}/>
    <path data-water-capillary="wide" d="M208 77.5Q220 84.5 232 77.5V165H208Z" fill={water}/>
    <path d="M72 20V165M88 20V165M206 20V165M234 20V165" fill="none" stroke={ink} strokeWidth={2}/>
    <path d="M74 40Q80 47 86 40M208 77.5Q220 84.5 232 77.5" fill="none" stroke={accent} strokeWidth={2}/>
   </>}
   {kind==='mass-volume'&&[pair.a,pair.b].map((body,column)=><g key={column} data-water-density-body={column===0?'A':'B'} data-mass={body.mass} data-volume={body.volume}>
    {Array.from({length:body.volume},(_,i)=><rect data-water-volume-unit="true" key={i} x={35+column*160+(i%3)*33} y={52+Math.floor(i/3)*38} width={28} height={32} rx={3} fill={column===0?water:material} stroke={ink} strokeWidth={2}/>)}
   </g>)}
   {kind==='ship-displacement'&&<>
    <rect data-water-shape="compact" x={30} y={62} width={55} height={65} rx={3} fill={material} stroke={ink} strokeWidth={3}/>
    <path data-water-shape="hull" d="M155 45H165V126H285V45H295V139H155Z" fill={material} stroke={ink} strokeWidth={3} strokeLinejoin="round"/>
    <path data-water-interior="true" d="M177 57H273V113H177Z" fill="none" stroke={ink} strokeWidth={2} strokeDasharray="5 5"/>
   </>}
  </svg>
  {controls[kind]&&<div className="visual-choice" role="group" aria-label={d.title}>{controls[kind]!.map((label,i)=><button className="secondary-button" key={label} aria-pressed={choice===i} onClick={()=>setChoice(i)}>{label}</button>)}</div>}
  {kind==='molecule-pairs'&&<p role="status">Markiert: {choice===0?'Wasser–Wasser. Die Paarung gehört hier zur Kohäsion.':'Wasser–Wand. Die Paarung veranschaulicht hier Adhäsion.'}</p>}
  {kind==='surface-support'&&<p role="status">{choice===0?'Das Gedankenobjekt hat Kontakt mit der Wasser-Luft-Grenzfläche.':'Das unveränderte Gedankenobjekt liegt vollständig unterhalb dieser Grenzfläche.'}</p>}
  {kind==='mass-volume'&&<p role="status">A: {pair.a.mass} Masseneinheiten in {pair.a.volume} Volumeneinheiten → {pair.a.mass/pair.a.volume} pro Volumeneinheit. B: {pair.b.mass} in {pair.b.volume} → {pair.b.mass/pair.b.volume} pro Volumeneinheit.</p>}
  <ol className="book-model-key">{d.key.map(line=><li key={line}>{line}</li>)}</ol>
  <figcaption className="book-figure-limit">Eigene Zeichnung mit KI-Unterstützung. {d.limit}</figcaption>
 </figure>;
}
