'use client';
import './history-evidence.css';
import {useState} from 'react';
import BronzeEvidence from './bronze-evidence';

const ACTIVITIES={
 'history-khipu':{
  title:'Knoten lesen braucht eine gemeinsame Regel',
  labels:['Eine Schnur untersuchen','Mit einer Regel vergleichen','Grenzen der Aussage prüfen'],
  tasks:['Wähle zwei Mengen. Beobachte, wie viele Zeichen jede Schnur erhält.','Vereinbare: Jedes Zeichen bedeutet hier einen Korb. Vergleiche die beiden Mengen.','Blende die vereinbarte Bedeutung aus. Weißt du dann noch, was gezählt wurde? Begründe den Unterschied zwischen Zahl und Bedeutung.'],
  explanations:['Die Zahl der Zeichen kann eine Menge festhalten. Unser Übungsbild zeigt keine Originalknoten.','In diesem erfundenen Beispiel bezeichnet ein Zeichen einen Korb. Historische Khipus nutzten viel mehr Merkmale, unter anderem Knotenarten und Stellenwerte.','Ohne die vereinbarte Bedeutung kannst du die dargestellten Mengen vergleichen. Ob Menschen, Vorräte oder etwas anderes gemeint sind, folgt daraus allein nicht.'],
 },
 'history-mohenjo-daro':{
  title:'Was verrät ein Stadtplan?',
  labels:['Einen Weg verfolgen','Pläne vergleichen','Beleg und Vermutung trennen'],
  tasks:['Verfolge den blauen Weg vom Haus weg. Was zeigt der gezeichnete Plan direkt?','Wechsle zwischen den beiden erfundenen Plänen. Was ist am Wasserweg verschieden?','Kann ein gezeichneter Ablauf beweisen, dass alle Menschen gesund waren? Nenne eine zusätzliche Information, die du benötigen würdest.'],
  explanations:['Der blaue Weg zeigt einen eingezeichneten Ablauf. Das ist eine Beobachtung am Lernbild.','Im zweiten Plan endet der Weg vor dem Kanal. Du vergleichst einen sichtbaren Unterschied; die Bilder sind keine rekonstruierten Ausgrabungspläne.','Ein Ablauf ist ein Hinweis auf einen geplanten Wasserweg. Er allein beweist weder sauberes Wasser noch Gesundheit oder gleiche Lebensbedingungen aller Bewohner.'],
 },
};
export const hasHistoryEvidence=(id:string)=>id==='history-bronze'||Object.hasOwn(ACTIVITIES,id);
export default function HistoryEvidence({id}:{id:string}){
 return id==='history-bronze'?<BronzeEvidence/>:<LegacyHistoryEvidence id={id}/>;
}
function LegacyHistoryEvidence({id}:{id:string}){
 const [level,setLevel]=useState(0),[first,setFirst]=useState(3),[second,setSecond]=useState(5),[legend,setLegend]=useState(true),[connected,setConnected]=useState(true),[explain,setExplain]=useState(false);
 const data=ACTIVITIES[id as keyof typeof ACTIVITIES];if(!data)return null;
 const khipu=id==='history-khipu';
 return <section className="history-context history-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv">
  <h3>{data.title}</h3><p className="small-note">Eigenes erfundenes Lernbild. Keine Abbildung eines Fundstücks und kein historischer Originalplan.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{data.labels.map((label,i)=><button className="secondary-button" key={label} aria-pressed={level===i} onClick={()=>{setLevel(i);setExplain(false);}}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{data.tasks[level]}</p>
  {khipu?<>
   <div className="model-buttons">{[['Erste Menge',first,setFirst],['Zweite Menge',second,setSecond]].map(([label,value,set])=><label key={String(label)}>{String(label)}<select className="secondary-button" aria-label={String(label)} value={Number(value)} onChange={e=>(set as typeof setFirst)(Number(e.target.value))}>{[1,2,3,4,5,6].map(n=><option value={n} key={n}>{n}</option>)}</select></label>)}</div>
   <figure className="topic-illustration"><svg style={{display:"block",width:"100%",height:"auto"}} viewBox="0 0 360 130" role="img" aria-label={`Erfundene Zählschnüre: erste Menge ${first}, zweite Menge ${second}.`}><path d="M30 20H330M110 20V120M250 20V120" stroke="#6fbfa3" strokeWidth="5" fill="none"/>{[first,second].map((n,i)=>Array.from({length:n},(_,j)=><circle key={i+':'+j} cx={110+i*140} cy={35+j*14} r="5" fill="#aa6a32" stroke="#152c46" strokeWidth="2"/>))}</svg><figcaption className="topic-diagram-label">Erste Menge: {first} · Zweite Menge: {second}. {legend?'Unsere erfundene Vereinbarung: ein Zeichen steht für einen Korb.':'Die Bedeutung der gezählten Dinge ist ausgeblendet.'}</figcaption></figure>
  </>:<>
   <figure className="topic-illustration"><svg style={{display:"block",width:"100%",height:"auto"}} viewBox="0 0 360 150" role="img" aria-label={connected?'Erfundener Plan mit eingezeichnetem Ablauf vom Haus in den Kanal.':'Erfundener Vergleichsplan: Der Wasserweg endet vor dem Kanal.'}><rect x="30" y="24" width="110" height="80" rx="5" fill="#ebdfcc" stroke="#695b45" strokeWidth="3"/><path d="M160 15V135M190 15V135" stroke="#758d95" strokeWidth="5"/><path d={connected?'M80 80H175V130':'M80 80H145'} stroke="#2c83a6" strokeWidth="6" fill="none"/><path d={connected?'M165 118l10 12 10-12':'M133 70l12 10-12 10'} stroke="#2c83a6" strokeWidth="4" fill="none"/></svg><figcaption className="topic-diagram-label">Links: ein Haus. Rechts: ein Kanal. Blau: {connected?'ein verbundener Wasserweg.':'ein Weg, der vor dem Kanal endet.'} Nicht maßstäblich.</figcaption></figure>
  </>}
  <div className="model-buttons"><button className="secondary-button" aria-pressed={khipu?!legend:!connected} onClick={()=>khipu?setLegend(v=>!v):setConnected(v=>!v)}>{khipu?(legend?'Bedeutung ausblenden':'Unsere Vereinbarung zeigen'):(connected?'Vergleichsplan öffnen':'Plan mit Verbindung öffnen')}</button><button className="secondary-button" aria-expanded={explain} onClick={()=>setExplain(v=>!v)}>{explain?'Denkhilfe schließen':'Meine Überlegung vergleichen'}</button></div>
  {explain&&<p className="model-result" role="status">{data.explanations[level]}</p>}
  <p className="small-note">Diese freiwillige Beobachtung vergibt keinen Stempel. Die Mini-Frage und deine bisherigen Lernstände behalten ihre Funktion.</p>
 </section>;
}
