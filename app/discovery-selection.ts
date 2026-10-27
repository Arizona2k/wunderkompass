import {useEffect,useRef,useState} from 'react';
import {dailyDiscovery,discoveryVisit,localDiscoveryDay} from './discovery-visit.mjs';
import {WORLD_INDEX,WORLD_CATEGORIES} from './world-index';
import {NATURE} from './nature-data';
import DISCOVERY_CONNECTIONS from './discovery-connections.json';

export const HOME_MOTIFS=WORLD_INDEX.filter(t=>!!t.homeQuestion&&!!t.image&&!t.sensitive);
const pools={heroes:HOME_MOTIFS.map(t=>t.id),trails:DISCOVERY_CONNECTIONS.map(t=>t.id)};
const SESSION='wunderkompass-discovery-visit',LAST='wunderkompass-discovery-last';
const DAILY='wunderkompass-discovery-day',dailyIds=[...WORLD_INDEX.map(t=>'world:'+t.id),...NATURE.map(p=>'nature:'+p.id)];
type Selection={heroId:string;trailId:string;lastInputAt:number;idleDue:boolean};
type Event={type:string;now:number;id?:string;selection?:{heroId?:string;trailId?:string}};
const home=()=>!location.hash||location.hash==='#home';
function read(storage:Storage,key:string){try{return JSON.parse(storage.getItem(key)??'null');}catch{return null;}}
function historySelection(){const trailId=history.state?.wunderTrail;return {heroId:history.state?.wunderHero??(pools.trails.includes(trailId)?'animal-honey-bee':undefined),trailId};}
function discoveryDay(day=localDiscoveryDay()){
 const bucket=day.ordinal%7,pool=bucket?WORLD_INDEX.filter(t=>t.category===WORLD_CATEGORIES[bucket-1].id):[];
 const fallback=pool.length?'world:'+pool[Math.floor(day.ordinal/7)%pool.length].id:'nature:'+NATURE[Math.floor(day.ordinal/7)%NATURE.length].id;
 let saved=null;try{saved=read(localStorage,DAILY);}catch{}
 return {...day,target:dailyDiscovery(day.key,saved,fallback,dailyIds).id};
}
function initial():Selection{
 if(typeof window==='undefined')return {heroId:pools.heroes[0],trailId:pools.trails[0],lastInputAt:0,idleDue:false};
 const navigation=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
 const restore=navigation?.type==='reload'||navigation?.type==='back_forward';
 let session=null,last=null;try{session=read(sessionStorage,SESSION);}catch{}try{last=read(localStorage,LAST);}catch{}
 let previous=restore?session??last:last??session;
 if(!previous)try{const trailId=sessionStorage.getItem('wunderkompass-discovery-trail');if(pools.trails.includes(trailId!))previous={heroId:'animal-honey-bee',trailId};}catch{}
 return discoveryVisit(previous,{type:restore?'reload':'open',now:Date.now(),selection:restore&&home()?historySelection():undefined},pools);
}
/** Only the current presentation choice and last input time; no identity or visit log. */
export function useDiscoverySelection(){
 const [selection,setSelection]=useState<Selection>(initial),current=useRef(selection);
 const [day,setDay]=useState(discoveryDay);
 useEffect(()=>{try{localStorage.setItem(DAILY,JSON.stringify({day:day.key,id:day.target}));}catch{}},[day]);
 const send=useRef<(event:Event)=>void>(()=>{});
 useEffect(()=>{
  let lastWrite=0;
  const calendar=()=>{const next=localDiscoveryDay();setDay(old=>old.key===next.key?old:discoveryDay(next));};
  const persist=(entry=false)=>{
   const value=current.current;
   try{sessionStorage.setItem(SESSION,JSON.stringify(value));localStorage.setItem(LAST,JSON.stringify({heroId:value.heroId,trailId:value.trailId}));}catch{}
   if(entry&&home())try{history.replaceState({...history.state,wunderHero:value.heroId,wunderTrail:value.trailId},'',location.href);}catch{}
   lastWrite=Date.now();
  };
  const apply=(event:Event)=>{
   const old=current.current,next=discoveryVisit(old,event,pools);current.current=next;
   const changed=old.heroId!==next.heroId||old.trailId!==next.trailId;
   if(changed)setSelection(next);
   if(event.type!=='activity'||Date.now()-lastWrite>=1000)persist(event.type!=='activity');
   calendar();
  };
  send.current=apply;
  const activity=(event:globalThis.Event)=>{if(event.isTrusted)apply({type:'activity',now:Date.now()});};
  const deliberate=()=>apply({type:'home',now:Date.now()});
  const route=(event:globalThis.Event)=>{
   if(!home())return;
   const saved=historySelection();
   if(saved.heroId||saved.trailId)apply({type:'history',now:Date.now(),selection:saved});
   else if(event.type==='hashchange')apply({type:'home',now:Date.now()});
   persist(true);
  };
  const flush=()=>persist(true);
  let midnight:ReturnType<typeof setTimeout>;
  const scheduleCalendar=()=>{clearTimeout(midnight);calendar();const now=new Date();midnight=setTimeout(scheduleCalendar,new Date(now.getFullYear(),now.getMonth(),now.getDate()+1).getTime()-now.getTime()+20);};
  const visible=()=>{if(!document.hidden)scheduleCalendar();};
  const events=['pointerdown','keydown','wheel','touchstart','scroll'];
  for(const type of events)window.addEventListener(type,activity,{capture:true,passive:true});
  window.addEventListener('wunder-home',deliberate);window.addEventListener('wunder-route',route);
  window.addEventListener('popstate',route);window.addEventListener('hashchange',route);
  window.addEventListener('pagehide',flush);document.addEventListener('visibilitychange',visible);
  // Calendar changes do not rotate the reading selection. No visit timer or automatic slide.
  scheduleCalendar();persist(true);
  return()=>{flush();clearTimeout(midnight);for(const type of events)window.removeEventListener(type,activity,true);window.removeEventListener('wunder-home',deliberate);window.removeEventListener('wunder-route',route);window.removeEventListener('popstate',route);window.removeEventListener('hashchange',route);window.removeEventListener('pagehide',flush);document.removeEventListener('visibilitychange',visible);};
 },[]);
 return {heroId:selection.heroId,trailId:selection.trailId,day,
  changeHero:()=>send.current({type:'hero',now:Date.now()}),
  changeTrail:(id:string)=>send.current({type:'trail',id,now:Date.now()})};
}
