'use client';
import {useEffect,useRef,useSyncExternalStore} from 'react';
const EVENT='wunder-route';
const read=()=>window.location.hash.slice(1)||'globe';
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
 if(Array.isArray(state?.wunderOpen))for(const el of document.querySelectorAll<HTMLDetailsElement>('details[data-history-disclosure]'))el.open=state.wunderOpen.includes(el.dataset.historyDisclosure);
 window.scrollTo({top:typeof state?.wunderScroll==='number'?state.wunderScroll:0,behavior:'instant'});
 if(!focus)return;
 const opener=Array.from(document.querySelectorAll<HTMLElement>('[data-route-focus]')).find(el=>el.dataset.routeFocus===state?.wunderFocus&&el.getClientRects().length);
 if(opener){opener.focus({preventScroll:true});const r=opener.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)opener.scrollIntoView({block:'nearest',behavior:'instant'});return;}
 if(path==='updates')document.getElementById('updates-title')?.focus({preventScroll:true});
 else if(path.startsWith('world/topic/'))document.getElementById('world-topic-title')?.focus({preventScroll:true});
 else focusLearningMain();
}
export function useHashRoute(){const first=useRef(true);const path=useSyncExternalStore(subscribe,read,()=> 'globe');useEffect(()=>{const initial=first.current;first.current=false;const frame=requestAnimationFrame(()=>restoreRouteView(path,!initial));return()=>cancelAnimationFrame(frame);},[path]);return path;}
