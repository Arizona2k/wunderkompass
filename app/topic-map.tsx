import type {WorldEntry} from './world-types';
import type {CSSProperties} from 'react';
import {topicMapGroups} from './topic-map-layout.mjs';
import './topic-map.css';
export default function TopicMap({entry,onPlace,compact=false}:{entry:WorldEntry|(Pick<WorldEntry,'title'|'locations'>&Partial<Pick<WorldEntry,'category'>>);onPlace:(index:number)=>void;compact?:boolean}){
 if(!entry.locations.length)return null;
 const groups=topicMapGroups(entry.locations),grouped=groups.some(g=>g.members.length>1);
 return <figure className="topic-map"><svg viewBox="0 0 800 450" role="img" aria-label={'Übersichtskarte mit ungefähren Beispielorten zu '+entry.title+'. '+groups.map(g=>(compact?'Ort':('Markierung '+g.label))+': '+g.members.map(p=>p.label).join('; ')).join('. ')}><image href="/maps/world-context.svg" width="800" height="450"/>{groups.map(g=><g key={g.label} className={'topic-map-marker'+(!compact&&g.members.length>1?' grouped':'')} transform={'translate('+g.x+' '+g.y+')'} data-map-members={g.members.map(p=>p.index).join(',')}>
  {!compact&&g.members.length>1?<rect x={-Math.max(68,g.label.length*14+16)/2} y={-19} width={Math.max(68,g.label.length*14+16)} height={38} rx={12} style={{'--map-group-width':Math.max(104,g.label.length*25+24)+'px'} as CSSProperties} fill="#a64b24" stroke="#fff" strokeWidth={4}/>:<circle r={19} fill="#a64b24" stroke="#fff" strokeWidth={4}/>}
  {!compact&&<text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontWeight={800}>{g.label}</text>}
 </g>)}</svg>{!compact&&<div className="map-legend">{entry.locations.map((p,i)=><button key={p.label} className="secondary-button" onClick={()=>onPlace(i)}>{i+1} · {p.label}</button>)}</div>}<figcaption>Eigene Übersicht nach Natural Earth. {entry.category==='animals'?'Beispielregionen, keine vollständige Tierverbreitung.':entry.category==='history'?'Ungefähre Orte an heutigen Küsten, keine historischen Grenzen.':'Punkte zeigen ungefähre Orte, keine Gebietsgrenzen.'}{grouped&&' Nahe Orte teilen eine Markierung.'}{!compact&&' Die Liste öffnet die Weltkugel.'}</figcaption></figure>;
}
