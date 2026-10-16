import {Children,cloneElement,isValidElement,type ReactElement,type ReactNode,type SVGProps} from 'react';

// SVG words shrink with viewBox scaling. Preserve each original description as
// normal HTML; retain only readable numeric pointers in the drawing itself.
export function readableDiagram(node:ReactNode){
 const labels:string[]=[];
 const walk=(value:ReactNode):ReactNode=>{
  if(!isValidElement<{children?:ReactNode}>(value))return value;
  if(value.type==='text'){
   const label=Children.toArray(value.props.children).filter(x=>typeof x==='string'||typeof x==='number').join('').trim();
   if(/^\d+$/.test(label))return cloneElement(value as ReactElement<SVGProps<SVGTextElement>>,{style:{fontSize:56,fontWeight:700},'aria-hidden':true});
   if(label&&!labels.includes(label))labels.push(label);
   return null;
  }
  return value.props.children===undefined?value:cloneElement(value,{},Children.map(value.props.children,walk));
 };
 return {drawing:Children.map(node,walk),labels};
}

export function DiagramLabels({labels}:{labels:string[]}){
 return labels.length?<div className="chapter-diagram-key" aria-label="Beschriftungen der Zeichnung">{labels.map(label=><span key={label}>{label}</span>)}</div>:null;
}
