'use client';

import {useEffect,useRef} from 'react';
import {BookOpen, ChevronLeft, ChevronRight, Compass, FlaskConical, Gamepad2, Globe2, Sparkles} from 'lucide-react';
import {TabsList, TabsTrigger} from '@/components/ui/tabs';

// Reuse the existing destinations, including all world/card/route deep links.
const AREAS = [
 {id:'explore',label:'Entdecken',icon:Globe2},
 {id:'world',label:'Wissenswelten',icon:Sparkles},
 {id:'games',label:'Spielplatz',icon:Gamepad2},
 {id:'labs',label:'Forscherlabor',icon:FlaskConical},
 {id:'journeys',label:'Lernreisen',icon:Compass},
 {id:'book',label:'Wissensbuch',icon:BookOpen},
] as const;

export default function LearningNavigation({area,onNavigate}:{area:string;onNavigate:(mode:string)=>void}){
 const listRef=useRef<HTMLDivElement>(null),previousRef=useRef<HTMLButtonElement>(null),nextRef=useRef<HTMLButtonElement>(null);
 // Scroll only this strip. Returning to a saved route must not move the page
 // away from its restored article, game or model position.
 const reveal=(tab:HTMLElement)=>{
  const list=listRef.current;if(!list)return;
  const box=list.getBoundingClientRect(),target=tab.getBoundingClientRect();
  if(target.left<box.left+5)list.scrollLeft-=box.left+5-target.left;
  else if(target.right>box.right-5)list.scrollLeft+=target.right-box.right+5;
 };
 useEffect(()=>{
  const list=listRef.current;if(!list)return;
  const update=()=>{
   if(previousRef.current)previousRef.current.disabled=list.scrollLeft<=1;
   if(nextRef.current)nextRef.current.disabled=list.scrollLeft+list.clientWidth>=list.scrollWidth-1;
  };
  const align=()=>{const active=list.querySelector<HTMLElement>('[data-state=active]');if(active)reveal(active);update();};
  const observer=new ResizeObserver(align);observer.observe(list);
  list.addEventListener('scroll',update,{passive:true});align();
  return()=>{observer.disconnect();list.removeEventListener('scroll',update);};
 },[area]);
 const scroll=(direction:number)=>{const list=listRef.current;if(list)list.scrollBy({left:direction*Math.max(100,list.clientWidth*.8),behavior:'instant'});};
 return <div className="learning-navigation">
  <button className="area-scroll" ref={previousRef} aria-label="Vorherige Lernbereiche anzeigen" onClick={()=>scroll(-1)}><ChevronLeft size={20} aria-hidden="true"/></button>
  <TabsList ref={listRef} className="mode-tabs" aria-label="Lernbereiche" onFocusCapture={event=>{const tab=(event.target as HTMLElement).closest<HTMLElement>('[role=tab]');if(tab)reveal(tab);}}>{AREAS.map(({id,label,icon:Icon})=><TabsTrigger key={id} value={id} data-route-focus={'home-nav-'+id} className="nav-tab" onClick={()=>onNavigate(id==='explore'?'home':id)}><Icon size={19} aria-hidden="true"/><span>{label}</span></TabsTrigger>)}</TabsList>
  <button className="area-scroll" ref={nextRef} aria-label="Weitere Lernbereiche anzeigen" onClick={()=>scroll(1)}><ChevronRight size={20} aria-hidden="true"/></button>
 </div>;
}
