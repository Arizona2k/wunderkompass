// Own qualitative teaching diagrams; no historical plate, measured trace or portrait.
export const INSECT_STAGES=['Ei','Raupe','Puppe','Erwachsener Falter'] as const;
export function InsectStageDrawing({stage}:{stage:number}){
 return <svg viewBox="0 0 160 120" role="img" aria-label={'Eigene gedachte Darstellung: '+INSECT_STAGES[stage]} data-insect-stage={stage}>
  <InsectShape stage={stage}/>
 </svg>;
}
function InsectShape({stage}:{stage:number}){
 if(stage===0)return <><path d="M20 95Q47 22 140 40Q117 104 20 95Z" fill="#90ad83" stroke="#275862" strokeWidth="3"/><ellipse cx="83" cy="63" rx="10" ry="14" fill="#f5ead2" stroke="#275862" strokeWidth="3"/></>;
 if(stage===1)return <><path d="M17 95H144" stroke="#75886c" strokeWidth="5"/>{[35,54,73,92,111].map((x,i)=><g key={x}><circle cx={x} cy={78-i*3} r="14" fill="#92aa76" stroke="#275862" strokeWidth="3"/><path d={'M'+x+' '+(91-i*3)+'v7'} stroke="#275862" strokeWidth="3"/></g>)}<circle cx="117" cy="60" r="3" fill="#183c45"/></>;
 if(stage===2)return <><path d="M28 20H130M80 20V39" stroke="#75886c" strokeWidth="5"/><path d="M80 37Q112 58 91 94L80 107L67 94Q46 59 80 37Z" fill="#a99b70" stroke="#275862" strokeWidth="3"/><path d="M62 67L98 73M64 82L91 89" fill="none" stroke="#786e4b" strokeWidth="3"/></>;
 return <g data-adult-outline><path d="M80 65Q19 9 17 43Q10 72 71 77Q24 85 43 107Q63 120 80 78Q98 120 117 107Q137 86 89 77Q151 70 143 43Q140 10 80 65Z" fill="#cc884c" stroke="#275862" strokeWidth="4"/><path d="M80 51V88M80 56L70 39M80 56L90 39" fill="none" stroke="#275862" strokeWidth="4"/></g>;
}
export function InsectSequenceDrawing({label}:{label:string}){
 return <svg viewBox="0 0 640 120" role="img" aria-label={label}>{INSECT_STAGES.map((_,stage)=><g key={stage} transform={'translate('+stage*160+' 0)'}><InsectShape stage={stage}/></g>)}</svg>;
}
export function CoreHypothesisDrawing({inner=true,label}:{inner?:boolean;label?:string}){
 return <svg viewBox="0 0 240 220" role="img" aria-label={label??('Eigenes qualitatives Erdschnittmodell '+(inner?'mit':'ohne')+' innerem Kern, nicht maßstabsgetreu')} data-core-hypothesis={inner?'with-inner':'without-inner'}>
  <circle cx="120" cy="110" r="96" fill="#94afb1" stroke="#275862" strokeWidth="4"/>
  <circle cx="120" cy="110" r="61" fill="#d39a60" stroke="#275862" strokeWidth="3"/>
  {inner&&<circle data-inner-core cx="120" cy="110" r="27" fill="#f2d59c" stroke="#275862" strokeWidth="3"/>}
 </svg>;
}
