import {useEffect,useLayoutEffect,useState,type SetStateAction} from 'react';
import {scheduleRouteRestore} from './hash-route';

import {initialBookView,bookLookup,bookLookupFocus,type BookView} from './book-location';
export {bookLookup} from './book-location';
const initialView=(route:string,restore=true)=>initialBookView(route,restore?history.state?.wunderBook:undefined);
// Per-history-entry reading context only. No notes or learning progress live here.
// Resolve the route during render so its actual filtered DOM precedes focus restore.
export function useBookView(route:string){
 const [view,setView]=useState(()=>initialView(route)),[intent,setIntent]=useState(0);
 if(route.startsWith('book')&&view.route!==route)setView(initialView(route));
 useEffect(()=>{
  const command=(event:Event)=>{const path=location.hash.slice(1),lookup=bookLookup(path);if(!lookup)return;
   const open=Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-history-disclosure][open]')).map(el=>el.dataset.historyDisclosure);
   const next=initialView(path,false);
   const selected={wunderBook:next,wunderFocus:bookLookupFocus(lookup),wunderScroll:0,wunderOpen:open};
   // Native lookup navigation derives the untouched view from its URL.
   // Re-selecting the current address can still deliberately reset its view.
   if(!(event as CustomEvent<{bookLookup?:boolean}>).detail?.bookLookup&&Object.entries(selected).some(([key,value])=>JSON.stringify(history.state?.[key])!==JSON.stringify(value)))history.replaceState({...history.state,...selected},'',location.href);
   setView(next);setIntent(n=>n+1);
  };window.addEventListener('wunder-route',command);return()=>window.removeEventListener('wunder-route',command);
 },[]);
 useLayoutEffect(()=>{
  // Explicit selection already saved this view. Back also restores its saved
  // entry; writing the same fields again needlessly consumes browser quota.
  const saved=history.state?.wunderBook,defaults=initialBookView(route);
  // The URL already preserves an untouched lookup. Save actual filter/limit
  // edits, and clearing a previously saved view, rather than rewriting defaults.
  if(route.startsWith('book')&&view.route===route&&(saved||Object.entries(view).some(([key,value])=>defaults[key as keyof BookView]!==value))&&Object.entries(view).some(([key,value])=>saved?.[key]!==value))history.replaceState({...history.state,wunderBook:view},'',location.href);
 },[route,view]);
 useLayoutEffect(()=>{
  if(route.startsWith('book'))return scheduleRouteRestore(route,intent>0||!!history.state?.wunderRoute);
 },[route,intent]);
 function set<K extends keyof BookView>(key:K,value:SetStateAction<BookView[K]>){setView(previous=>({...previous,[key]:typeof value==='function'?(value as (old:BookView[K])=>BookView[K])(previous[key]):value}));}
 return {view,set,setView,intent};
}
