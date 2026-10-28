'use client';

import {useLearningStrip} from './learning-strip';
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
 const {listRef,previousRef,nextRef,reveal,scroll}=useLearningStrip(area);
 return <div className="learning-navigation">
  <button className="area-scroll" ref={previousRef} aria-label="Vorherige Lernbereiche anzeigen" onClick={()=>scroll(-1)}><ChevronLeft size={20} aria-hidden="true"/></button>
  <TabsList ref={listRef} className="mode-tabs" aria-label="Lernbereiche" onFocusCapture={event=>{const tab=(event.target as HTMLElement).closest<HTMLElement>('[role=tab]');if(tab)reveal(tab);}}>{AREAS.map(({id,label,icon:Icon})=><TabsTrigger key={id} value={id} data-route-focus={'home-nav-'+id} className="nav-tab" onClick={()=>onNavigate(id==='explore'?'home':id)}><Icon size={19} aria-hidden="true"/><span>{label}</span></TabsTrigger>)}</TabsList>
  <button className="area-scroll" ref={nextRef} aria-label="Weitere Lernbereiche anzeigen" onClick={()=>scroll(1)}><ChevronRight size={20} aria-hidden="true"/></button>
 </div>;
}
