import {useEffect,useLayoutEffect,useState,type SetStateAction} from 'react';
import {scheduleRouteRestore} from './hash-route';

type BookView={route:string;tab:string;query:string;category:string;letter:string;wordLimit:number;natureLimit:number;limit:number};
export function bookLookup(route:string){
 const [,tab,...parts]=route.split('/');
 if(!['words','why'].includes(tab)||!parts.length)return;
 try{return {tab,term:decodeURIComponent(parts.join('/'))};}catch{return;}
}
function initialView(route:string,restore=true):BookView{
 const lookup=bookLookup(route),view={route,tab:lookup?.tab??'words',query:lookup?.tab==='words'?lookup.term:'',category:'Alle',letter:'Alle',wordLimit:24,natureLimit:24,limit:24};
 const saved=restore?history.state?.wunderBook:undefined;
 if(saved?.route!==route||!['words','why','notes','nature','atlas'].includes(saved.tab))return view;
 for(const key of ['query','category','letter'] as const)if(typeof saved[key]!=='string')return view;
 for(const key of ['wordLimit','natureLimit','limit'] as const)if(!Number.isSafeInteger(saved[key])||saved[key]<24)return view;
 return {...view,...saved};
}
// Per-history-entry reading context only. No notes or learning progress live here.
// Resolve the route during render so its actual filtered DOM precedes focus restore.
export function useBookView(route:string){
 const [view,setView]=useState(()=>initialView(route)),[intent,setIntent]=useState(0);
 if(route.startsWith('book')&&view.route!==route)setView(initialView(route));
 useEffect(()=>{
  const command=()=>{const path=location.hash.slice(1),lookup=bookLookup(path);if(!lookup)return;
   const open=Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-history-disclosure][open]')).map(el=>el.dataset.historyDisclosure);
   history.replaceState({...history.state,wunderFocus:(lookup.tab==='words'?'book-word-target-':'book-why-target-')+lookup.term,wunderScroll:0,wunderOpen:open},'',location.href);
   setView(initialView(path,false));setIntent(n=>n+1);
  };window.addEventListener('wunder-route',command);return()=>window.removeEventListener('wunder-route',command);
 },[]);
 useLayoutEffect(()=>{
  if(route.startsWith('book')&&view.route===route)history.replaceState({...history.state,wunderBook:view},'',location.href);
 },[route,view]);
 useLayoutEffect(()=>{
  if(route.startsWith('book'))return scheduleRouteRestore(route,intent>0||!!history.state?.wunderRoute);
 },[route,intent]);
 function set<K extends keyof BookView>(key:K,value:SetStateAction<BookView[K]>){setView(previous=>({...previous,[key]:typeof value==='function'?(value as (old:BookView[K])=>BookView[K])(previous[key]):value}));}
 return {view,set,setView,intent};
}
