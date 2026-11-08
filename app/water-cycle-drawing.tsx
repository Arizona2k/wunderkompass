'use client';
import {useId} from 'react';

const NAMES=['Verdunsten','Kondensieren','Niederschlag','Abfließen und Versickern'];

/** Own qualitative drawing: arrows are paths, never visible gaseous droplets. */
export default function WaterCycleDrawing({step}:{step:number}){
 const marker=useId().replaceAll(':','')+'water-arrow';
 const active=(i:number)=>step===i?'#14645c':'#46646c';
 return <svg className="water-cycle-drawing" viewBox="0 0 480 300" style={{width:'100%',height:'auto',maxHeight:320}} role="img" aria-label={'Eigene schematische Wasserlandschaft mit Meer, Wolke, Hang und Bodenporen. Hervorgehoben: '+NAMES[step]+'. Pfeile zeigen mögliche Wege, keine berechneten Mengen oder Zeiten.'}>
  <defs><marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="context-stroke"/></marker></defs>
  <rect x="2" y="2" width="476" height="296" rx="20" fill="#edf5f4"/>
  <circle cx="66" cy="53" r="25" fill="#e5af49"/>
  <g stroke="#b67a24" strokeWidth="3" strokeLinecap="round"><path d="M66 15V8M66 98V91M28 53H21M111 53H104M39 26L34 21M93 80L98 85M93 26L98 21M39 80L34 85"/></g>
  <path d="M172 203L239 166L292 147L345 163L404 124L478 182V298H172Z" fill="#b5c9a5"/>
  <path d="M2 200Q47 191 85 202T172 202V298H22Q2 298 2 277Z" fill="#a8d4e0"/>
  <path d="M14 219Q44 212 74 219T134 219M24 249Q54 242 84 249T144 249M15 277Q45 270 75 277T135 277" fill="none" stroke="#438ca4" strokeWidth="3" strokeLinecap="round"/>
  <path d="M181 225L238 193L297 188L348 200L409 168L478 215V278Q478 298 458 298H181Z" fill="#e5d3b9"/>
  <g fill="#d4bc9b" stroke="#80613d" strokeWidth="2">{[[211,236],[253,217],[294,228],[337,234],[382,211],[430,220],[463,245],[229,277],[277,263],[322,280],[369,265],[414,280]].map(([x,y])=><ellipse key={x+':'+y} cx={x} cy={y} rx="12" ry="7"/>)}</g>
  <g fill="#226a83">{[[218,254],[251,242],[305,256],[349,259],[395,244],[450,273]].map(([x,y])=><path key={x+':'+y} d={`M${x} ${y-5}q-7 8 0 9q7-1 0-9Z`}/>)}</g>
  <path d="M208 93C188 93 186 65 204 61C201 36 237 28 247 49C267 33 292 49 286 67C312 66 316 95 292 98H214Z" fill={step===1?'#d8ebe8':'#ffffff'} stroke={active(1)} strokeWidth={step===1?5:3}/>
  <path d="M113 182C102 146 127 135 137 112M145 188C136 163 159 141 170 122" fill="none" stroke={active(0)} strokeWidth={step===0?6:3} strokeDasharray="7 6" markerEnd={'url(#'+marker+')'}/>
  <path d="M185 103Q197 86 211 88" fill="none" stroke={active(1)} strokeWidth={step===1?5:2} markerEnd={'url(#'+marker+')'}/>
  <g fill={step===2?'#176d91':'#3d748a'} stroke={step===2?'#174c65':'none'} strokeWidth={step===2?2:0}>{[[245,121],[281,131],[316,116]].map(([x,y])=><path key={x} d={`M${x} ${y-9}q-13 16 0 18q13-2 0-18Z`}/>)}</g>
  {['M319 151Q290 157 263 175T183 207','M355 183Q365 211 356 241'].map(d=><path key={d} d={d} fill="none" stroke={active(3)} strokeWidth={step===3?6:3} markerEnd={'url(#'+marker+')'}/>)}
  <g fill="#4b7859"><path d="M427 164V125" stroke="#705b3a" strokeWidth="6"/><circle cx="424" cy="112" r="18"/><circle cx="439" cy="127" r="15"/><circle cx="414" cy="132" r="16"/></g>
 </svg>;
}
