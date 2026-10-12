"use client";
import { useMemo, useState } from 'react';
import { geoArea, geoEqualEarth, geoPath } from 'd3-geo';
import { CONTINENTS, CONTINENT_MEMBERSHIPS, LAYERS, type Country } from './earth-data';

// Small explanatory diagrams, rather than decorative pictures on text chapters.
export default function JourneyVisual({ id, countries = [] }: { id: string; countries?: Country[] }) {
  const [choice, setChoice] = useState(0);
  if (id === 'inside') return <figure className="journey-visual"><svg viewBox="0 0 600 250" role="img" aria-label="Vier Schichten im Querschnitt; die Kruste ist vergrößert"><g transform="translate(145 122)">{LAYERS.map((l, i) => <circle key={l.id} r={[108, 102, 60, 28][i]} fill={l.color}/>)}</g>{LAYERS.map((l, i) => <g key={l.id}><circle cx="295" cy={44 + i * 48} r="7" fill={l.color}/><text x="314" y={50 + i * 48} fontSize="19" fill="#203c47">{l.name}</text></g>)}</svg><ul className="journey-diagram-labels" aria-label="Erdschichten von außen nach innen">{LAYERS.map(l=><li key={l.id}><span aria-hidden="true" style={{background:l.color}}/>{l.name}</li>)}</ul><figcaption>Ein Schnitt durch die Erde. Die Kruste ist viel dünner, als sie hier aussieht.</figcaption></figure>;
  if (id === 'water') {
    const names = ['Eis · fest', 'Wasser · flüssig', 'Wasserdampf · gasförmig'];
    const explanations = ['Die Teilchen bleiben an festen Plätzen und bewegen sich dort.', 'Die Teilchen bleiben dicht zusammen, können aber aneinander vorbeigleiten.', 'Die Teilchen sind weiter voneinander entfernt und bewegen sich durch den Raum. Wasserdampf ist unsichtbar.'];
    return <figure className="journey-visual"><div className="visual-choice" role="group" aria-label="Wasserform vergleichen">{names.map((name, i) => <button className="secondary-button" key={name} aria-pressed={choice === i} onClick={() => setChoice(i)}>{name}</button>)}</div><svg viewBox="0 0 600 180" role="img" aria-label={'Teilchenmodell: ' + names[choice]}><rect x="35" y="15" width="530" height="150" rx="14" fill="white" stroke="#b9d8e1"/>{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={choice === 0 ? 190 + (i % 6) * 34 : choice === 1 ? 160 + (i * 57) % 280 : 62 + (i * 71) % 474} cy={choice === 0 ? 43 + Math.floor(i / 6) * 30 : choice === 1 ? 80 + (i * 23) % 66 : 31 + (i * 39) % 115} r="8" fill="#428ba5"/>)}</svg><p role="status">{explanations[choice]}</p><figcaption>Die Punkte stehen für winzige Teilchen. Größen und Abstände sind stark vereinfacht.</figcaption></figure>;
  }
  if (id === 'navigation' || id === 'climate' || id === 'seasons') {
    const climate = id === 'climate', seasons = id === 'seasons';
    return <figure className="journey-visual"><svg viewBox="0 0 600 255" role="img" aria-label={climate ? 'Vereinfachte Klimagürtel: warm am Äquator, kalt an den Polen' : seasons ? 'Die gedachte Erdachse ist ungefähr 23,4 Grad geneigt' : 'Der Äquator trennt die Nordhalbkugel von der Südhalbkugel'}><defs><clipPath id={'journey-sphere-' + id}><circle cx="170" cy="126" r="93"/></clipPath></defs><g transform={seasons ? 'rotate(-23.4 170 126)' : undefined}><circle cx="170" cy="126" r="93" fill="#a9dcd9"/><g clipPath={'url(#journey-sphere-' + id + ')'}>{climate ? <><rect x="60" y="32" width="220" height="42" fill="#dcecf5"/><rect x="60" y="74" width="220" height="38" fill="#8bc8a3"/><rect x="60" y="112" width="220" height="30" fill="#ffd38a"/><rect x="60" y="142" width="220" height="38" fill="#8bc8a3"/><rect x="60" y="180" width="220" height="42" fill="#dcecf5"/></> : <rect x="60" y="126" width="220" height="100" fill="#6cb6c6"/>}</g><path d="M170 17V235" stroke="#355c6d" strokeWidth="3" strokeDasharray="7 5"/><path d="M77 126H263" stroke="#b55019" strokeWidth="3"/></g><text x="300" y="67" fontSize="19" fill="#203c47">{climate ? 'Polarzone' : 'Nordhalbkugel'}</text><text x="300" y="133" fontSize="19" fill="#8b3d16">{'Äquator · 0°'}</text><text x="300" y="200" fontSize="19" fill="#203c47">{climate ? 'Polarzone' : 'Südhalbkugel'}</text></svg><ul className="journey-diagram-labels" aria-label="Beschriftung des Modells">{(climate?['Polarregionen im Norden und Süden','Tropen rund um den Äquator','Weitere Klimagürtel dazwischen']:seasons?['Erdachse: etwa 23,4 Grad geneigt','Äquator: 0 Grad geografische Breite','Nord- und Südhalbkugel']:['Nordhalbkugel','Äquator: 0 Grad geografische Breite','Südhalbkugel']).map(label=><li key={label}>{label}</li>)}</ul><figcaption>{climate ? 'Nur ein Überblick: Höhe, Meer, Winde und Landschaft beeinflussen das Klima ebenfalls.' : seasons ? 'Während des Umlaufs bleibt die Achse ungefähr in dieselbe Richtung geneigt.' : 'Gedachte Linien zur Orientierung. Sie sind keine aufgemalten Linien auf der echten Erde.'}</figcaption></figure>;
  }
  if ((id === 'continents' || id === 'countries') && countries.length) {
    return <ContinentVisual countries={countries}/>;
  }
  return null;
}

// This small overview does not need coastline detail finer than half a pixel.
// The original geometry remains unchanged for globe picking and country views.
function overviewRing(ring:number[][]){
  if(ring.length<=5)return ring;
  const points=[ring[0]];let previous=ring[0];
  for(let i=1;i<ring.length-1;i++){const p=ring[i];if((p[0]-previous[0])**2+(p[1]-previous[1])**2>=0.25**2){points.push(p);previous=p;}}
  points.push(ring[ring.length-1]);if(points.length<4)return ring;
  const originalArea=geoArea({type:'Polygon',coordinates:[ring]});
  const simplifiedArea=geoArea({type:'Polygon',coordinates:[points]});
  return (originalArea>2*Math.PI)!==(simplifiedArea>2*Math.PI)?ring:points;
}
function ContinentVisual({countries}:{countries:Country[]}){
  const [choice,setChoice]=useState(0),active=CONTINENTS[choice];
  const map=useMemo(()=>{
    const path=geoPath(geoEqualEarth().fitExtent([[10,10],[590,290]],{type:'Sphere'})).digits(1);
    return {sphere:path({type:'Sphere'})??'',countries:countries.map(c=>{
      const simplified=c.geometry.type==='Polygon'?{type:'Polygon' as const,coordinates:c.geometry.coordinates.map(overviewRing)}:{type:'MultiPolygon' as const,coordinates:c.geometry.coordinates.map(p=>p.map(overviewRing))};
      // A collapsed island ring must never become a world-sized filled polygon.
      const geometry=geoArea(simplified)>2*Math.PI?c.geometry:simplified;
      return {id:c.properties.id,continents:CONTINENT_MEMBERSHIPS[c.properties.iso]??[c.properties.continent],path:path({...c,geometry})??''};
    })};
  },[countries]);
  return <figure className="journey-visual"><svg viewBox="0 0 600 300" role="img" aria-label={'Weltkarte. Hervorgehoben: '+active.name}><defs><pattern id="journey-shared-continent" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)"><rect width="8" height="8" fill="#cbdeda"/><rect width="4" height="8" fill={active.color}/></pattern></defs><path d={map.sphere} fill="#e2f1f7"/>{map.countries.map(c=><path key={c.id} d={c.path} fill={c.continents.includes(active.id)?c.continents.length>1?'url(#journey-shared-continent)':active.color??'#69b799':'#cbdeda'} stroke="white" strokeWidth=".5"/>)}</svg><div className="visual-choice" role="group" aria-label="Kontinent auf der Karte hervorheben">{CONTINENTS.map((c,i)=><button className="secondary-button" key={c.id} aria-pressed={choice===i} onClick={()=>setChoice(i)}>{c.name}</button>)}</div><p role="status">{active.name}: {active.text}</p><figcaption>Vereinfachte Karte nach Natural Earth. Gestreifte Länder reichen in mehrere Kontinente. Ländergrenzen sind keine Kontinentgrenzen.</figcaption></figure>;
}
