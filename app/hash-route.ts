'use client';
import {useEffect,useSyncExternalStore} from 'react';
const EVENT='wunder-route';
const read=()=>window.location.hash.slice(1)||'globe';
function subscribe(fn:()=>void){window.addEventListener('hashchange',fn);window.addEventListener('popstate',fn);window.addEventListener(EVENT,fn);return()=>{window.removeEventListener('hashchange',fn);window.removeEventListener('popstate',fn);window.removeEventListener(EVENT,fn);};}
export function navigateHash(path:string){if(read()===path)return;try{history.replaceState({...history.state,wunderScroll:scrollY},'',location.href);history.pushState({wunderRoute:true},'','#'+path);window.dispatchEvent(new Event(EVENT));}catch{location.hash=path;}}
export function useHashRoute(){const path=useSyncExternalStore(subscribe,read,()=> 'globe');useEffect(()=>{let frame=0;frame=requestAnimationFrame(()=>{const y=history.state?.wunderScroll??0;window.scrollTo({top:y,behavior:'instant'});const target=document.getElementById(path.startsWith('world/topic/')?'world-topic-title':'learning-main');target?.focus({preventScroll:true});});return()=>cancelAnimationFrame(frame);},[path]);return path;}
