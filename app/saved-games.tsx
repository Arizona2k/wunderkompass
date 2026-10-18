"use client";
import {createContext,useContext,useCallback,useEffect,useRef,useState,type ReactNode,type Dispatch,type SetStateAction} from 'react';
import {compatible,sanitizeMemorySession} from './game-state';
type GameContext={id:string;family:'classic'|'extra'|'world';snapshot:Record<string,unknown>;save:(id:string,key:string,value:unknown,family:'classic'|'extra'|'world')=>void};
const Context=createContext<GameContext|null>(null);
export function SavedGame({id,family,sessions,onSave,children}:{id:string;family:'classic'|'extra'|'world';sessions:Record<string,Record<string,unknown>>;onSave:GameContext['save'];children:ReactNode}){
 const raw=sessions[id]??{};
 const normalized=['memory','flag-memory'].includes(id)?sanitizeMemorySession(raw):{snapshot:raw,recovered:false};
 const [recovered]=useState(normalized.recovered);
 return <Context.Provider value={{id,family,snapshot:normalized.snapshot,save:onSave}}>{recovered&&<p className="gentle-note" role="status">Ein Teil dieser Runde war nicht lesbar. Wir haben die Runde sicher repariert. Dein übriger Entdeckerpass bleibt erhalten. Mit „Neue Runde“ kannst du frisch beginnen.</p>}{children}</Context.Provider>;
}
export function useGameSnapshot(){return useContext(Context)?.snapshot??{};}
export function useSavedGame<T>(key:string,initial:T|(()=>T),restore?:(value:unknown,fallback:T)=>T):[T,Dispatch<SetStateAction<T>>]{
 const context=useContext(Context);const current=useRef(context);useEffect(()=>{current.current=context;},[context]);
 const [state,setState]=useState<T>(()=>{const fallback=typeof initial==='function'?(initial as ()=>T)():initial,value=context?.snapshot[key];if(value===undefined)return fallback;if(restore)return restore(value,fallback);if(!compatible(value,fallback))return fallback;
  if(typeof value==='number'&&['index','step'].includes(key)){const length=Array.isArray(context?.snapshot.items)?context.snapshot.items.length:context?.id==='worldtour'?7:context?.id==='ocean-find'?5:1;return Math.max(0,Math.min(length-1,Math.floor(value))) as T;}
  if(typeof value==='number')return Math.max(0,Math.min(key==='score'&&Array.isArray(context?.snapshot.items)?context.snapshot.items.length:100000,context?.id.startsWith('lab:')?value:Math.floor(value))) as T;
  return value as T;
 });
 const ref=useRef(state);useEffect(()=>{ref.current=state;},[state]);
 const set=useCallback<Dispatch<SetStateAction<T>>>((value)=>{const next=typeof value==='function'?(value as (s:T)=>T)(ref.current):value;ref.current=next;setState(next);const c=current.current;if(c)c.save(c.id,key,next,c.family);},[key]);
 // Initial random cards/questions are needed too; remember them when play begins.
 useEffect(()=>{const c=current.current;if(c)c.save(c.id,key,ref.current,c.family);},[key]);
 return [state,set];
}
export function useSavedModel<T extends string|number|boolean>(key:string,initial:T,limits?:readonly T[]|{min:number;max:number;integer?:boolean}):[T,Dispatch<SetStateAction<T>>]{
 const fractional=typeof initial==='number'&&limits&&!Array.isArray(limits)&&(limits as {integer?:boolean}).integer===false;
 const [value,set]=useSavedGame(key,initial,fractional?(value,fallback)=>compatible(value,fallback)?value as T:fallback:undefined);
 const normalize=(v:T):T=>{if(Array.isArray(limits))return limits.includes(v)?v:initial;if(limits&&typeof v==='number'){const range=limits as {min:number;max:number;integer?:boolean};return Math.max(range.min,Math.min(range.max,range.integer===false?v:Math.round(v))) as T;}return v;};
 const current=normalize(value);
 return [current,next=>set(normalize(typeof next==='function'?(next as (v:T)=>T)(current):next))];
}
