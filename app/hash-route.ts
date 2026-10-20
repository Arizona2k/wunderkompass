'use client';
import {useEffect,useRef,useSyncExternalStore} from 'react';
const EVENT='wunder-route';
const read=()=>window.location.hash.slice(1)||'globe';
// Pin a legacy resume alias to its actual chapter without adding a history entry.
export function replaceHash(path:string){if(read()===path)return;history.replaceState(history.state,'','#'+path);window.dispatchEvent(new Event(EVENT));}
function subscribe(fn:()=>void){window.addEventListener('hashchange',fn);window.addEventListener('popstate',fn);window.addEventListener(EVENT,fn);return()=>{window.removeEventListener('hashchange',fn);window.removeEventListener('popstate',fn);window.removeEventListener(EVENT,fn);};}
// Browser-entry UI state only; learning progress stays in the central pass.
export function navigateHash(path:string){if(read()===path)return;try{
 const active=document.activeElement as HTMLElement|null;
 const open=Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-history-disclosure][open]')).map(el=>el.dataset.historyDisclosure);
 const trail=document.querySelector<HTMLElement>('[data-discovery-trail][aria-pressed=true]')?.dataset.discoveryTrail;
 history.replaceState({...history.state,wunderScroll:scrollY,wunderFocus:active?.dataset.routeFocus,wunderOpen:open,wunderTrail:trail},'',location.href);
 history.pushState({wunderRoute:true},'','#'+path);window.dispatchEvent(new Event(EVENT));
}catch{location.hash=path;}}
export function focusLearningMain(){
 const main=document.getElementById('learning-main'),heading=document.getElementById('discovery-title');
 const r=heading?.getBoundingClientRect();
 if(main)main.dataset.focusAtHeading=String(!!r&&r.top>=0&&r.bottom<=innerHeight);
 main?.focus({preventScroll:true});
}
export function restoreRouteView(path:string,focus=true){
 const state=history.state;
 if((path==='globe'||path==='updates'||path.startsWith('world/topic/'))&&Array.isArray(state?.wunderOpen))for(const el of document.querySelectorAll<HTMLDetailsElement>('details[data-history-disclosure]'))el.open=state.wunderOpen.includes(el.dataset.historyDisclosure);
 window.scrollTo({top:typeof state?.wunderScroll==='number'?state.wunderScroll:0,behavior:'instant'});
 if(!focus)return;
 const opener=Array.from(document.querySelectorAll<HTMLElement>('[data-route-focus]')).find(el=>el.dataset.routeFocus===state?.wunderFocus&&el.getClientRects().length);
 if(opener){opener.focus({preventScroll:true});const r=opener.getBoundingClientRect();if(r.top<8||r.bottom>innerHeight-8)opener.scrollIntoView({block:'center',behavior:'instant'});return;}
 if(path.startsWith('labs/'))document.getElementById('lab-heading')?.focus({preventScroll:true});
 else if(path==='journeys'||path.startsWith('journeys/')){const heading=document.getElementById('journey-title')??document.getElementById('journey-hub-title');if(heading){heading.focus({preventScroll:true});const r=heading.getBoundingClientRect();if(r.top<8||r.bottom>innerHeight-8)heading.scrollIntoView({block:'center',behavior:'instant'});}}
 else if(path==='updates')document.getElementById('updates-title')?.focus({preventScroll:true});
 else if(path==='world'||path.startsWith('world/')){
  const heading=document.getElementById('world-topic-title')??document.getElementById('world-category-title');
  if(heading){heading.focus({preventScroll:true});const r=heading.getBoundingClientRect();if(r.top<8||r.bottom>innerHeight-8)heading.scrollIntoView({block:'center',behavior:'instant'});}
  else focusLearningMain(); // Completed routes have a finish view rather than an article.
 }
 else focusLearningMain();
}
// A user can already be operating the new view before its deferred navigation
// frame runs. Never steal that focus or scroll position after fresh input.
export function scheduleRouteRestore(path:string,focus=true){
 let pending=true;
 const detach=()=>{window.removeEventListener('keydown',interact,true);window.removeEventListener('pointerdown',interact,true);};
 const cancel=()=>{if(!pending)return;pending=false;cancelAnimationFrame(frame);detach();};
 const interact=(event:Event)=>{if(event.isTrusted)cancel();};
 const frame=requestAnimationFrame(()=>{if(!pending)return;pending=false;detach();restoreRouteView(path,focus);});
 window.addEventListener('keydown',interact,true);window.addEventListener('pointerdown',interact,true);
 return cancel;
}
export function useHashRoute(restore=true){const first=useRef(true);const path=useSyncExternalStore(subscribe,read,()=> 'globe');useEffect(()=>{if(/^news(?:\/|$)/.test(path)){replaceHash('globe');return;}const initial=first.current;first.current=false;if(!restore||path==='globe'||path==='updates')return;return scheduleRouteRestore(path,!initial||!!history.state?.wunderRoute);},[path,restore]);return path;}
