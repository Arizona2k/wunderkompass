"use client";
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {useSavedModel} from './saved-games';

// Mean distances and approximate periods: NASA planetary facts, consulted 2026-10-07.
export const PLANETS=[
 {id:'mercury',name:'Merkur',au:.387,days:88,color:'#939aa3',type:'Gesteinsplanet',fact:'Merkur ist der kleinste Planet und der Sonne am nächsten.'},
 {id:'venus',name:'Venus',au:.723,days:225,color:'#c49a57',type:'Gesteinsplanet',fact:'Die Venus hat eine dichte Atmosphäre. Unter ihren Wolken ist es sehr heiß.'},
 {id:'earth',name:'Erde',au:1,days:365.25,color:'#388ca6',type:'Gesteinsplanet',fact:'Unser Zuhause ist der dritte Planet von der Sonne. Ein Umlauf dauert etwa ein Jahr.'},
 {id:'mars',name:'Mars',au:1.524,days:687,color:'#bb6144',type:'Gesteinsplanet',fact:'Mars ist der vierte Planet. Seine Atmosphäre ist viel dünner als die der Erde.'},
 {id:'jupiter',name:'Jupiter',au:5.2,days:4333,color:'#c39270',type:'Gasriese',fact:'Jupiter ist der größte Planet. Er hat keine feste Oberfläche wie die Erde.'},
 {id:'saturn',name:'Saturn',au:9.58,days:10756,color:'#b49d62',type:'Gasriese',fact:'Saturns auffällige Ringe bestehen aus vielen einzelnen Teilchen.'},
 {id:'uranus',name:'Uranus',au:19.2,days:30687,color:'#5aa5b2',type:'Eisriese',fact:'Uranus ist der siebte Planet. Seine Drehachse ist stark zur Seite geneigt.'},
 {id:'neptune',name:'Neptun',au:30.05,days:60190,color:'#5866b7',type:'Eisriese',fact:'Neptun ist der äußerste der acht Planeten. Ein Umlauf dauert etwa 165 Erdjahre.'},
] as const;
export default function SolarLab(){
 const [id,setId]=useSavedModel<string>('planet','earth',PLANETS.map(p=>p.id));
 const [days,setDays]=useSavedModel<number>('days',0,{min:0,max:3653});
 const [compare,setCompare]=useSavedModel<boolean>('compare',false);
 const active=PLANETS.find(p=>p.id===id)!;
 const years=active.days/365.25;
 return <div className="model-content solar-lab"><h2>Unsere Erde im Sonnensystem</h2><p>Acht Planeten umkreisen die Sonne. Verschiebe die Zeit: Wer kommt schneller einmal herum?</p>
  <div className="model-chip-row" aria-label="Planeten auswählen">{PLANETS.map(p=><button className={`secondary-button ${p.id===id?'active':''}`} key={p.id} aria-pressed={p.id===id} onClick={()=>setId(p.id)}>{p.name}</button>)}</div>
  <svg className="science-figure solar-orbits" viewBox="0 0 620 580" role="img" aria-label={`Vereinfachte Umlaufbahnen. ${days} Erdtage nach dem Modellstart. Ausgewählt: ${active.name}.`}><circle cx="310" cy="280" r="22" fill="#ffbd45"/><text x="310" y="318" textAnchor="middle" fontSize="17" fill="#29434f">Sonne</text>{PLANETS.map((p,i)=>{const radius=52+i*29,angle=(i*.73+days/p.days*2*Math.PI),x=310+radius*Math.cos(angle),y=280-radius*Math.sin(angle);return <g key={p.id}><circle cx="310" cy="280" r={radius} fill="none" stroke={p.id===id?'#386b80':'#ccdbe1'} strokeWidth={p.id===id?2:1}/><circle cx={x} cy={y} r={p.id===id?9:6} fill={p.color} stroke={p.id===id?'#183f50':'white'} strokeWidth="2"/><title>{p.name}</title>{p.id===id&&<text x={x} y={y-17} fontSize="17" textAnchor="middle" fill="#203c47">{p.name}</text>}</g>;})}</svg>
  <label id="solar-time">Zeit im Modell: {days.toLocaleString('de')} Erdtage · etwa {(days/365.25).toLocaleString('de',{maximumFractionDigits:1})} Erdjahre</label><Slider min={0} max={3653} step={1} value={[days]} onValueChange={v=>setDays(v[0])} aria-labelledby="solar-time"/>
  <div className="model-chip-row"><button className="secondary-button" disabled={days>=3653} onClick={()=>setDays(n=>Math.min(3653,n+365))}>Ein Erdjahr weiter</button><button className="secondary-button" onClick={()=>setDays(0)}>Modellstart</button></div>
  <div className="lab-feedback" role="status"><strong>{active.name} · {active.type}</strong><p>{active.fact}</p><p>Ein Umlauf: ca. {years<2?Math.round(active.days).toLocaleString('de')+' Erdtage':years.toLocaleString('de',{maximumFractionDigits:1})+' Erdjahre'}. Durchschnittlicher Abstand zur Sonne: ca. {active.au.toLocaleString('de',{maximumFractionDigits:2})} Mal der Abstand Erde–Sonne.</p></div>
  <label className="tilt-switch"><Switch checked={compare} onCheckedChange={setCompare} aria-label="Sonnenabstände vergleichen"/><span>Sonnenabstände vergleichen</span></label>
  {compare&&<div className="planet-distances" aria-label="Mittlere Sonnenabstände, gemeinsame lineare Skala">{PLANETS.map(p=><div key={p.id}><span>{p.name}</span><div><span style={{width:`${p.au/30.05*100}%`,background:p.color}}/></div><strong>{p.au.toLocaleString('de',{maximumFractionDigits:2})}</strong></div>)}<p>1 bedeutet den mittleren Abstand Erde–Sonne: ca. 150 Millionen Kilometer. Alle Balken verwenden dieselbe Skala.</p></div>}
  <details className="answer-review"><summary>Ein Stern, Planeten und Monde</summary><p>Die Sonne ist ein Stern: Sie erzeugt Licht. Planeten umkreisen sie und reflektieren Sonnenlicht. Monde umkreisen Planeten. Pluto gehört zu den Zwergplaneten.</p></details>
  <p className="small-note">Die Bahnen sind vereinfachte Kreise. Größen und Bahnabstände im Kreisbild stimmen nicht; die Balken vergleichen mittlere Abstände. Die Startstellungen sind frei gewählt, keine heutigen Himmelspositionen.</p>
  <p className="small-note">Wissen: <a href="https://science.nasa.gov/solar-system/planets/" target="_blank" rel="noreferrer">NASA · Planeten</a> und <a href="https://science.nasa.gov/neptune/neptune-facts/" target="_blank" rel="noreferrer">NASA · Umlaufzeiten</a>.</p>
 </div>;
}
