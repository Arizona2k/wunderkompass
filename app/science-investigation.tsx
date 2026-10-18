import {useSavedGame,useSavedModel} from './saved-games';
import {pressure,balancingForce,buoyancy,pendulumPeriod,resonanceGain,checksum,shiftWord,angleEndpoint,triangleParts,diceSeries} from './concept-math.mjs';
export const INVESTIGATION_IDS=['pressure','buoyancy','lever','probability','angle','checksum','pendulum','resonance','fractals','encryption'] as const;
export type InvestigationId=typeof INVESTIGATION_IDS[number];
const config={
 pressure:{title:'Kraft auf mehr Fläche verteilen',label:'Kontaktfläche in m²',min:1,max:6,start:3,step:1,limits:'Ideales Zahlenmodell: 12 N wirken gleichmäßig und senkrecht. Kein Körperdruck- oder Belastungstest.'},
 buoyancy:{title:'Gleiche Masse, anderes Volumen',label:'Körpervolumen in Litern',min:1,max:6,start:2,step:1,limits:'Starrer Körper mit 3 kg Gesamtmasse, ruhendes Süßwasser mit rund 1 kg je Liter. Keine Wellen-, Leck- oder Stabilitätsberechnung.'},
 lever:{title:'Gleichgewicht am Hebel',label:'Kraftarm in Metern',min:1,max:6,start:2,step:1,limits:'Waagerechter idealer Hebel, senkrechte Kräfte, Last 12 N und Lastarm 1 m. Armlängen haben denselben Maßstab; Pfeillängen zeigen keine Kraftgrößen. Eigengewicht und Reibung fehlen.'},
 probability:{title:'Kurze und lange Würfelserien',label:'Würfe je Versuch',min:6,max:120,start:12,step:6,limits:'Simulierte unabhängige gleich wahrscheinliche Seiten. Zufallsserien sind keine Vorhersage und kein Glücksspiel.'},
 angle:{title:'Eine Öffnung verändern',label:'Winkel in Grad',min:0,max:180,start:90,step:15,limits:'Der kleinere Winkel zwischen zwei Strahlen; gezeichnete Schenkellängen sind kein Winkelmaß.'},
 checksum:{title:'Verschiedene Daten, gleiche Summe?',label:'Erste Zahl',min:0,max:9,start:1,step:1,limits:'Nur die einfache Summe zweier Ziffern. Nicht kryptografisch, keine Signatur und keine Wahrheitsprüfung.'},
 pendulum:{title:'Eine Länge, eine Schwingungszeit',label:'Fadenlänge in Metern',min:.5,max:3,start:1,step:.5,limits:'Standbild eines idealen Fadenpendels in Ruhelage. Die Zeit gilt für kleine Auslenkungen bei g = 9,81 m/s². Fadenlänge bis zur Kugelmitte; Kugelgröße ohne Maßstab. Ohne Luftwiderstand; keine laufende Schwingung oder echte Uhrmessung.'},
 resonance:{title:'Den Antriebstakt vergleichen',label:'Antriebsfrequenz / Eigenfrequenz',min:.5,max:1.5,start:.5,step:.1,limits:'Stationäre Antwort eines linearen gedämpften Oszillators. Dämpfungswert fest gewählt; kein Bauwerks- oder Erdbebenmodell.'},
 fractals:{title:'Eine Regel wiederholen',label:'Wiederholungsschritte',min:0,max:4,start:0,step:1,limits:'Endliche eigene Zeichnung eines Sierpiński-Dreiecks. Maximal vier Schritte; Naturformen werden nicht als exakt gleich ausgegeben.'},
 encryption:{title:'Ein Alphabet verschieben',label:'Buchstabenverschiebung',min:0,max:25,start:3,step:1,limits:'Caesar-Alphabet für WELT. Leicht zu knacken; keine echte private Nachricht oder sichere Verschlüsselung.'}
};
const number=(n:number)=>n.toLocaleString('de-DE',{maximumFractionDigits:2});
export default function ScienceInvestigation({kind}:{kind:InvestigationId}){
 const c=config[kind],[rawValue,setValue]=useSavedModel<number>('investigationValue',c.start,{min:c.min,max:c.max,integer:c.step>=1}),[second,setSecond]=useSavedModel<number>('investigationSecond',2,{min:0,max:9}),[rolls,setRolls]=useSavedGame<number[]>('investigationRolls',[]);
 const value=Math.round((rawValue-c.min)/c.step)*c.step+c.min;
 const validRolls=Array.isArray(rolls)&&rolls.length<=120&&rolls.every(n=>Number.isInteger(n)&&n>=1&&n<=6)?rolls:[];
 const water=buoyancy(kind==='buoyancy'?value:2,3),end=angleEndpoint(kind==='angle'?value:90),gain=resonanceGain(kind==='resonance'?value:.5);
 let result='';
 if(kind==='pressure')result='12 N / '+number(value)+' m² = '+number(pressure(12,value))+' Pa';
 if(kind==='lever')result='Gleichgewicht: '+number(balancingForce(12,1,value))+' N am Kraftarm, Last 12 N am Lastarm 1 m.';
 if(kind==='buoyancy')result='Gewichtskraft '+number(water.weightNewtons)+' N; maximaler Auftrieb bei voller Verdrängung '+number(water.maximumNewtons)+' N. '+(water.floats?'Schwimmen ist im idealen Vergleich möglich.':'Die maximale Auftriebskraft reicht hier nicht zum Schwimmen.');
 if(kind==='pendulum')result='Zeit für eine volle Schwingung: etwa '+number(pendulumPeriod(value))+' Sekunden.';
 if(kind==='resonance')result='Relative stationäre Auslenkung im Zahlenmodell: '+number(gain)+'. Der Antrieb liefert Energie; die Dämpfung begrenzt die Antwort.';
 if(kind==='angle')result=number(value)+'° · '+(value===90?'rechter Winkel':value===0?'keine Öffnung':value===180?'halbe Drehung':value<90?'spitzer Winkel':'stumpfer Winkel');
 if(kind==='checksum')result='Folge '+value+', '+second+' → Summe '+checksum([value,second])+'. Umgekehrt: '+second+', '+value+' → Summe '+checksum([second,value])+'. '+(value===second?'Wähle unterschiedliche Zahlen für den Vergleich.':'Andere Reihenfolge, gleicher Prüfwert: eine Kollision.');
 if(kind==='encryption')result='WELT → '+shiftWord('WELT',value)+' · Mit Verschiebung '+((26-value)%26)+' kommst du im Alphabetspiel zurück.';
 if(kind==='fractals')result=triangleParts(value).length+' gefüllte Teil-Dreiecke nach '+value+' Schritten. Jede neue Stufe halbiert die Seitenlänge der Teile.';
 if(kind==='probability')result=validRolls.length?validRolls.length+' simulierte Würfe; davon '+validRolls.filter(n=>n===6).length+' Sechsen. Erwarteter Anteil: 1/6, keine Garantie für diese Serie.':'Vermute zuerst einen möglichen Anteil. Starte dann einen Versuch; jede Seite hat im Modell die gleiche Einzelchance.';
 return <section className="science-investigation" data-investigation={kind}><h3>{c.title}</h3><p>Vermute zuerst, was sich verändert. Prüfe danach und erkläre einen Unterschied.</p><label>{c.label}: <strong>{number(value)}</strong><input type="range" min={c.min} max={c.max} step={c.step} value={value} onChange={e=>setValue(Number(e.target.value))}/></label>
 {kind==='checksum'&&<label>Zweite Zahl: <strong>{second}</strong><input type="range" min={0} max={9} step={1} value={second} onChange={e=>setSecond(Number(e.target.value))}/></label>}
 {kind==='probability'&&<button className="secondary-button" onClick={()=>setRolls(diceSeries(value))}>Neue Würfelserie untersuchen</button>}
 <svg viewBox="0 0 240 180" role="img" aria-label={'Eigenes vereinfachtes Schema: '+c.title}>
  {kind==='pressure'&&<><rect x={40} y={90} width={value*25} height={55} rx={4} fill="#bfdbe9" stroke="#245d70"/><path d="M90 25 V75 M82 65 L90 75 L98 65" fill="none" stroke="#8b463d" strokeWidth={4}/></>}
  {kind==='lever'&&<><path d="M25 100H225 M65 100L50 135H80Z" fill="none" stroke="#245d70" strokeWidth={4}/><rect x={27.5} y={75} width={25} height={25} fill="#c28b58"/><path d={'M'+(65+value*25)+' 30V100 M'+(59+value*25)+' 90L'+(65+value*25)+' 100L'+(71+value*25)+' 90'} fill="none" stroke="#8b463d" strokeWidth={4}/></>}
  {kind==='buoyancy'&&<><rect x={15} y={75} width={210} height={90} fill="#bfdbe9"/><rect x={75} y={water.floats?75-60*(1-water.submergedFraction):100} width={90} height={60} rx={4} fill="#ecd0a3" stroke="#245d70"/><path d="M20 75H220" stroke="#245d70" strokeWidth={2}/></>}
  {kind==='angle'&&<><path d={'M'+end.x+' '+end.y+'L110 125H195'} stroke="#245d70" strokeWidth={4} fill="none"/><circle cx={110} cy={125} r={5} fill="#8b463d"/></>}
  {kind==='pendulum'&&<><path d={'M120 20V'+(20+value*40)} stroke="#245d70" strokeWidth={3}/><circle cx={120} cy={20+value*40} r={13} fill="#c28b58"/><path d="M80 20H160" stroke="#245d70" strokeWidth={5}/></>}
  {kind==='resonance'&&<><path d={'M15 100 '+Array.from({length:61},(_,i)=>'L'+(15+i*3.5)+' '+(100-Math.sin(i/60*Math.PI*6)*Math.min(55,gain*15))).join(' ')} stroke="#245d70" strokeWidth={3} fill="none"/></>}
  {kind==='fractals'&&triangleParts(value,20,166).map((points:number[],i:number)=><polygon key={i} points={points.join(' ')} fill="#245d70"/>)}
  {kind==='probability'&&Array.from({length:6},(_,i)=><rect key={i} x={20+i*34} y={150-(validRolls.length?validRolls.filter(n=>n===i+1).length/validRolls.length*100:0)} width={24} height={validRolls.length?validRolls.filter(n=>n===i+1).length/validRolls.length*100:0} fill="#245d70"/>)}
  {(kind==='checksum'||kind==='encryption')&&<><rect x={20} y={50} width={70} height={70} rx={10} fill="#bfdbe9"/><path d="M105 85H135 M125 75L135 85L125 95" fill="none" stroke="#245d70" strokeWidth={4}/><rect x={150} y={50} width={70} height={70} rx={10} fill="#ecd0a3"/></>}
 </svg>{kind==='probability'&&<ol className="science-dice-labels" aria-label="Gezählte Würfelseiten">{Array.from({length:6},(_,i)=><li key={i}>Seite {i+1}: {validRolls.filter(n=>n===i+1).length}</li>)}</ol>}
 <p className="lab-feedback" role="status" aria-live="polite">{result}</p><p className="small-note">Modellgrenze: {c.limits} Eigene WunderKompass-Zeichnung, mit KI-Unterstützung programmiert; keine fremden Bilder.</p></section>;
}
