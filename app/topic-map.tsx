import {geoEqualEarth} from 'd3-geo';
import type {WorldEntry} from './world-types';
const projection=geoEqualEarth().fitExtent([[34,32],[766,365]],{type:'Sphere'});
export default function TopicMap({entry,onPlace,compact=false}:{entry:WorldEntry;onPlace:(index:number)=>void;compact?:boolean}){
 if(!entry.locations.length)return null;
 return <figure className="topic-map"><svg viewBox="0 0 800 450" role="img" aria-label={'Übersichtskarte mit Beispielorten zu '+entry.title}><image href="/journeys/continents.svg" width="800" height="450"/>{entry.locations.map((p,i)=>{const [x,y]=projection([p.lon,p.lat])!;return <g key={p.label}><circle cx={x} cy={y} r="19" fill="#a64b24" stroke="#fff" strokeWidth="4"/><text x={x} y={y+8} textAnchor="middle" fontWeight="800">{i+1}</text></g>})}</svg>{!compact&&<div className="map-legend">{entry.locations.map((p,i)=><button key={p.label} className="secondary-button" onClick={()=>onPlace(i)}>{i+1} · {p.label}</button>)}</div>}<figcaption>{entry.category==='animals'?'Die Punkte zeigen Beispielregionen, keine vollständige Tierverbreitung.':'Die Karte zeigt heutige Küsten und verbundene Orte, keine historischen Grenzen.'} Wähle einen Ort, um die Weltkugel dorthin zu drehen.</figcaption></figure>;
}
