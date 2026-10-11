'use client';

import {BookOpen, Compass, FlaskConical, Gamepad2, Globe2, Sparkles} from 'lucide-react';
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

export default function LearningNavigation({onNavigate}:{onNavigate:(mode:string)=>void}){
 return <TabsList className="mode-tabs" aria-label="Lernbereiche">{AREAS.map(({id,label,icon:Icon})=><TabsTrigger key={id} value={id} data-route-focus={'home-nav-'+id} className="nav-tab" onClick={()=>onNavigate(id==='explore'?'globe':id)}><Icon size={19} aria-hidden="true"/><span>{id==='world'?<>Wissens<wbr/>welten</>:id==='labs'?<>Forscher<wbr/>labor</>:id==='book'?<>Wissens<wbr/>buch</>:label}</span></TabsTrigger>)}</TabsList>;
}
