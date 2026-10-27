import {PLANET_DISTANCE_AU} from './planet-distances';
export const COMPARISON_PLANETS=[
 {name:'Merkur',diameter:.383,distance:PLANET_DISTANCE_AU.mercury,color:'#847d76'},
 {name:'Venus',diameter:.949,distance:PLANET_DISTANCE_AU.venus,color:'#b59149'},
 {name:'Erde',diameter:1,distance:PLANET_DISTANCE_AU.earth,color:'#397da1'},
 {name:'Mars',diameter:.532,distance:PLANET_DISTANCE_AU.mars,color:'#af6549'},
 {name:'Jupiter',diameter:11.21,distance:PLANET_DISTANCE_AU.jupiter,color:'#ac886a'},
 {name:'Saturn',diameter:9.45,distance:PLANET_DISTANCE_AU.saturn,color:'#a79255'},
 {name:'Uranus',diameter:4.01,distance:PLANET_DISTANCE_AU.uranus,color:'#659ea4'},
 {name:'Neptun',diameter:3.88,distance:PLANET_DISTANCE_AU.neptune,color:'#486db0'}
];
export const comparisonNumber=(value:number)=>value.toLocaleString('de-DE',{maximumFractionDigits:3});
export default function PlanetSizeFigure({planet:p,className}:{planet:typeof COMPARISON_PLANETS[number];className?:string}){return <svg className={className} viewBox="0 0 600 320" role="img" aria-label={`Durchmesser im selben Maßstab: Erde 1, ${p.name} ${comparisonNumber(p.diameter)} Erddurchmesser. Abstand der Kreise ohne Bedeutung.`}><circle cx="150" cy="172" r="12" fill={COMPARISON_PLANETS[2].color}/><circle cx="450" cy="172" r={p.diameter*12} fill={p.color}/>{p.name==='Saturn'&&<ellipse cx="450" cy="172" rx="145" ry="23" fill="none" stroke="#b29b6d" strokeWidth="8"/>}</svg>;}
