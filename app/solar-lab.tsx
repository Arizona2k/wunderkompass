"use client";
import ResearchFigureLegend from "./research-figure-legend";
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {useSavedModel} from './saved-games';
import {PLANETS} from './solar-system-data';
import PlanetDistanceNotes from './planet-distance-notes';
import {MAX_PLANET_DISTANCE_AU,distanceNumber} from './planet-distances';

export default function SolarLab(){
 const [id,setId]=useSavedModel<string>('planet','earth',PLANETS.map(p=>p.id));
 const [days,setDays]=useSavedModel<number>('days',0,{min:0,max:3653});
 const [compare,setCompare]=useSavedModel<boolean>('compare',false);
 const active=PLANETS.find(p=>p.id===id)!;
 const years=active.days/365.25;
 return <div className="model-content solar-lab"><h2>Unsere Erde im Sonnensystem</h2><p>Acht Planeten umkreisen die Sonne. Verschiebe die Zeit: Wer kommt schneller einmal herum?</p>
  <div className="model-chip-row" aria-label="Planeten auswählen">{PLANETS.map(p=><button className={`secondary-button ${p.id===id?'active':''}`} key={p.id} aria-pressed={p.id===id} onClick={()=>setId(p.id)}>{p.name}</button>)}</div>
  <svg className="science-figure solar-orbits" viewBox="0 0 620 580" role="img" aria-label={`Vereinfachte Umlaufbahnen. ${days} Erdtage nach dem Modellstart. Ausgewählt: ${active.name}.`}><circle cx="310" cy="280" r="22" fill="#ffbd45"/><text x="310" y="318" textAnchor="middle" fontSize="17" fill="#29434f">Sonne</text>{PLANETS.map((p,i)=>{const radius=52+i*29,angle=(i*.73+days/p.days*2*Math.PI),x=310+radius*Math.cos(angle),y=280-radius*Math.sin(angle);return <g key={p.id}><circle cx="310" cy="280" r={radius} fill="none" stroke={p.id===id?'#386b80':'#ccdbe1'} strokeWidth={p.id===id?2:1}/><circle cx={x} cy={y} r={p.id===id?9:6} fill={p.color} stroke={p.id===id?'#183f50':'white'} strokeWidth="2"/><title>{p.name}</title>{p.id===id&&<text x={x} y={y-17} fontSize="17" textAnchor="middle" fill="#203c47">{p.name}</text>}</g>;})}</svg><ResearchFigureLegend id="solar"/>
  <label id="solar-time">Zeit im Modell: {days.toLocaleString('de')} Erdtage · etwa {(days/365.25).toLocaleString('de',{maximumFractionDigits:1})} Erdjahre</label><Slider min={0} max={3653} step={1} value={[days]} onValueChange={v=>setDays(v[0])} aria-labelledby="solar-time"/>
  <div className="model-chip-row"><button className="secondary-button" disabled={days>=3653} onClick={()=>setDays(n=>Math.min(3653,n+365))}>Ein Erdjahr weiter</button><button className="secondary-button" onClick={()=>setDays(0)}>Modellstart</button></div>
  <div className="lab-feedback" role="status"><strong>{active.name} · {active.type}</strong><p>{active.fact}</p><p>Ein Umlauf: ca. {years<2?Math.round(active.days).toLocaleString('de')+' Erdtage':years.toLocaleString('de',{maximumFractionDigits:1})+' Erdjahre'}. Mittlere Bahnentfernung zur Sonne: ca. {distanceNumber(active.au)} AE.</p></div>
  <label className="tilt-switch"><Switch checked={compare} onCheckedChange={setCompare} aria-label="Sonnenabstände vergleichen"/><span>Sonnenabstände vergleichen</span></label>
  {compare&&<div className="planet-distances" aria-label={"Ungefähre große Halbachsen, gemeinsame lineare Skala von null bis "+distanceNumber(MAX_PLANET_DISTANCE_AU)+" Astronomischen Einheiten"}>{PLANETS.map(p=><div key={p.id}><span>{p.name}</span><div><span style={{width:`${p.au/MAX_PLANET_DISTANCE_AU*100}%`,background:p.color}}/></div><strong>{distanceNumber(p.au)}</strong></div>)}<p>Einheit: AE (Astronomische Einheit). Alle Balken verwenden dieselbe lineare Skala: links die Sonne bei 0, rechts {distanceNumber(MAX_PLANET_DISTANCE_AU)} AE.</p></div>}
  <details className="answer-review"><summary>Ein Stern, Planeten und Monde</summary><p>Die Sonne ist ein Stern: Sie erzeugt Licht. Planeten umkreisen sie und reflektieren Sonnenlicht. Monde umkreisen Planeten. Pluto gehört zu den Zwergplaneten.</p></details>
  <p className="small-note">Die Bahnen sind vereinfachte Kreise. Größen und Bahnabstände im Kreisbild stimmen nicht; die Balken vergleichen mittlere Abstände. Die Startstellungen sind frei gewählt, keine heutigen Himmelspositionen.</p>
  <PlanetDistanceNotes/>
  <p className="small-note">Wissen: <a href="https://science.nasa.gov/solar-system/planets/" target="_blank" rel="noreferrer">NASA · Planeten</a> und <a href="https://science.nasa.gov/neptune/neptune-facts/" target="_blank" rel="noreferrer">NASA · Umlaufzeiten</a>.</p>
 </div>;
}
