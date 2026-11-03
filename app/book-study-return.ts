import {useEffect,useRef} from 'react';
import {restoreRouteView} from './hash-route';

function restoreBookStudyView(details:HTMLDetailsElement|null){
 const path=location.hash.slice(1),state=history.state,active=document.activeElement as HTMLElement|null;
 if(!(path==='book'||path.startsWith('book/'))||!details?.open||!Array.isArray(state?.wunderOpen)||!state.wunderOpen.includes(details.dataset.historyDisclosure))return;
 if(active===document.body||active?.id==='learning-main'||(state.wunderFocus&&active?.dataset.routeFocus===state.wunderFocus))restoreRouteView(path);
}
// Defer only the saved reading view. Shared source fetches continue unchanged.
// Real interaction while loading supersedes the old pending return position.
export function useBookStudyReturn(ready:boolean,active:boolean,details:{current:HTMLDetailsElement|null}){
 const cancelled=useRef(false);
 useEffect(()=>{
  if(!active){cancelled.current=false;return;}
  if(ready){if(!cancelled.current)restoreBookStudyView(details.current);return;}
  const key=details.current?.dataset.historyDisclosure;
  if(!Array.isArray(history.state?.wunderOpen)||!history.state.wunderOpen.includes(key))return;
  const events=['keydown','pointerdown','wheel','touchmove'],cancel=(event:Event)=>{if(event.isTrusted)cancelled.current=true;};
  for(const type of events)window.addEventListener(type,cancel,{capture:true,passive:true});
  return()=>{for(const type of events)window.removeEventListener(type,cancel,true);};
 },[ready,active,details]);
}
