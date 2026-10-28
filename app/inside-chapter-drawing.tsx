const ink='#285664',sand='#f1cb82',melt='#eb793e';

/** Own qualitative cross-section. Selection changes emphasis, never material colour. */
export function insideVolcanoDrawing(selected:number){
 return <>
  <path data-inside-terrain="true" d="M40 250V230L320 70L600 230V250Z" fill={sand} stroke={ink} strokeWidth="3"/>
  <path data-inside-conduit="true" d="M320 204V70" fill="none" stroke={melt} strokeWidth="15"/>
  <path data-inside-magma="true" d="M261 218Q270 190 313 202Q359 184 380 218Q359 241 319 233Q280 245 261 218Z" fill={melt} stroke={selected===0?ink:melt} strokeWidth={selected===0?5:2}/>
  <path data-inside-surface-lava="true" d="M320 70L510 178.57142857142858" fill="none" stroke={ink} strokeWidth={selected===1?17:11}/>
  <path d="M320 70L510 178.57142857142858" fill="none" stroke={melt} strokeWidth="9"/>
  <path d="M286 51Q271 37 285 22M319 48Q304 33 318 15M350 52Q335 36 350 21" fill="none" stroke={selected===2?ink:'#647983'} strokeWidth={selected===2?5:3}/>
  {[[259,42],[371,33],[390,55]].map(([x,y])=><path key={x} d={`M${x} ${y}l6 -7l5 9Z`} fill={selected===2?ink:'#647983'}/>)}
  <text x="310" y="224">1</text><text x="474" y="144">2</text><text x="405" y="42">3</text>
  <text x="40" y="281">1 · Magma im Untergrund</text><text x="40" y="281">2 · Lava auf der Oberfläche</text><text x="40" y="281">3 · Zeichen für Gas und Fragmente</text>
 </>;
}

/** Two simultaneous profiles make the qualitative shape comparison explicit. */
export function volcanoFormDrawing(selected:number){
 return <>
  {[0,1].map(i=><g key={i} transform={`translate(${25+i*310} 20)`}>
   <path data-volcano-form={i===0?'shield':'composite'} d={i===0?'M10 224Q142 127 275 224Z':'M10 224L142 49L275 224Z'} fill={sand} stroke={ink} strokeWidth="3"/>
   <path data-volcano-form-emphasis={i} d="M10 242H275" fill="none" stroke={selected===i?melt:ink} strokeWidth={selected===i?7:2}/>
   <text x="132" y="24">{i+1}</text>
  </g>)}
  <text x="40" y="281">1 · Schildvulkan: breiter und flacher</text><text x="40" y="281">2 · Schichtvulkan: steiler</text>
 </>;
}
