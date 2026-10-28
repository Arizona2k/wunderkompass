'use client';

import {useEffect,useRef} from 'react';

/** Scroll only the tab strip; preserve the page's article/model scroll position. */
export function useLearningStrip(value:string){
 const listRef=useRef<HTMLDivElement>(null),previousRef=useRef<HTMLButtonElement>(null),nextRef=useRef<HTMLButtonElement>(null);
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
   if(list.parentElement)list.parentElement.dataset.stripOverflow=String(list.scrollWidth>list.clientWidth+1);
  };
  const align=()=>{const active=list.querySelector<HTMLElement>('[data-state=active]');if(active)reveal(active);update();};
  const observer=new ResizeObserver(align);observer.observe(list);list.addEventListener('scroll',update,{passive:true});align();
  return()=>{observer.disconnect();list.removeEventListener('scroll',update);};
 },[value]);
 const scroll=(direction:number)=>{const list=listRef.current;if(list)list.scrollBy({left:direction*Math.max(100,list.clientWidth*.8),behavior:'instant'});};
 return {listRef,previousRef,nextRef,reveal,scroll};
}
