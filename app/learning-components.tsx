"use client";

import {useEffect,useState,type ComponentPropsWithoutRef,type ReactNode} from 'react';

// Retain a loaded panel after first use: closing a dialog must still run its
// existing focus-return lifecycle, and background requests must not be aborted.
export function useActivated(active:boolean){
 const [activated,setActivated]=useState(active);
 // eslint-disable-next-line react-hooks/set-state-in-effect -- Remember an explicit external navigation or visibility event, not derived presentation.
 useEffect(()=>{if(active)setActivated(true);},[active]);
 return active||activated;
}
export function DeferredContent({active,children}:{active:boolean;children:ReactNode}){
 return useActivated(active)?children:null;
}
export function LearningGrid({className='',children,...props}:ComponentPropsWithoutRef<'div'>){
 return <div {...props} className={'learning-grid '+className} data-learning-component="grid">{children}</div>;
}
export function LearningDetails({summary,className='',children,...props}:ComponentPropsWithoutRef<'details'>&{summary:ReactNode}){
 return <details {...props} className={'learning-details '+className} data-learning-component="details"><summary>{summary}</summary>{children}</details>;
}
export function LearningStatus({children,title,action,tone='loading',className=''}:{children:ReactNode;title?:string;action?:ReactNode;tone?:'loading'|'empty'|'error';className?:string}){
 return <section className={'learning-status '+className} data-learning-component="status" data-tone={tone} role={tone==='error'?'alert':'status'} aria-live={tone==='error'?'assertive':'polite'}>{title&&<h3>{title}</h3>}<p>{children}</p>{action}</section>;
}
