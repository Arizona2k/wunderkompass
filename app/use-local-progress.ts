"use client";

import { localId } from "./local-id";
import {useCallback,useEffect,useState,useSyncExternalStore} from 'react';
import type {Place} from './earth-data';
import {createProgressStore,serverSnapshot} from './local-progress-store';
import {type Settings,type QuizSession,type Activity} from './progress-storage';
export type {LocalProgress,Review} from './progress-storage';
export function useLocalProgress(){
 const [store]=useState(createProgressStore);
 const state=useSyncExternalStore(store.subscribe,store.getSnapshot,()=>serverSnapshot);
 const {save,ready,available,storage,notice,restoreRevision}=state;
 useEffect(()=>{void store.start();},[store]);
 const {update,flush,reset,backup,importSave}=store;
 const add=useCallback((field:'discoveries'|'journeys'|'games'|'labs'|'favorites',id:string)=>update(p=>p[field].includes(id)?p:{...p,[field]:[...p[field],id]}),[update]);
 const markMission=useCallback((id:number)=>update(p=>p.missions.includes(id)?p:{...p,missions:[...p.missions,id]}),[update]);
 const favorite=useCallback((id:string,place?:Place)=>update(p=>({...p,favorites:p.favorites.includes(id)?p.favorites.filter(x=>x!==id):[...p.favorites,id],favoritePlaces:place?{...p.favoritePlaces,[id]:place}:p.favoritePlaces})),[update]);
 const chapter=useCallback((id:string,n:number,completed?:number)=>update(p=>({...p,chapters:{...p.chapters,[id]:n},completedChapters:completed==null?p.completedChapters:{...p.completedChapters,[id]:[...new Set([...(p.completedChapters[id]??[]),completed])]},lastActivity:{type:'journey',id}})),[update]);
 const review=useCallback((id:string,correct:boolean)=>update(p=>{const seen=(p.review[id]?.seen??0)+1,date=new Date();date.setDate(date.getDate()+(correct?Math.min(7,seen*2):0));return {...p,review:{...p.review,[id]:{correct,seen,due:date.toISOString().slice(0,10)}}};}),[update]);
 const settings=useCallback((patch:Partial<Settings>)=>update(p=>({...p,settings:{...p.settings,...patch}})),[update]);
 const activity=useCallback((a:Activity)=>update(p=>p.lastActivity?.type===a.type&&p.lastActivity.id===a.id&&p.lastActivity.family===a.family?p:{...p,lastActivity:a}),[update]);
 const quiz=useCallback((q:QuizSession)=>update(p=>({...p,quizSession:q,lastActivity:{type:'quiz',id:q.id},quizResults:q.finished&&!p.quizResults.some(r=>r.id===q.id)?[...p.quizResults,{id:q.id,at:new Date().toISOString(),category:q.category,score:q.score,total:q.ids.length}].slice(-50):p.quizResults})),[update]);
 const game=useCallback((id:string,field:string,value:unknown,family:'classic'|'extra'|'world')=>update(p=>({...p,gameSessions:{...p.gameSessions,[id]:{...p.gameSessions[id],[field]:value}},lastActivity:{type:'game',id,family}})),[update]);
 // Restoring an already saved field is not a new learning action. In particular,
 // another open tab must not replace the imported resume target on remount.
 const worldState=useCallback((id:string,field:string,value:unknown,activity:Activity)=>update(p=>Object.hasOwn(p.gameSessions[id]??{},field)&&JSON.stringify(p.gameSessions[id][field])===JSON.stringify(value)?p:({...p,gameSessions:{...p.gameSessions,[id]:{...p.gameSessions[id],[field]:value}},lastActivity:activity})),[update]);
 const clearGame=useCallback((id:string)=>update(p=>{const sessions={...p.gameSessions};delete sessions[id];return {...p,gameSessions:sessions};}),[update]);
 const lab=useCallback((id:string,field:string,value:unknown)=>update(p=>({...p,gameSessions:{...p.gameSessions,[id]:{...p.gameSessions[id],[field]:value}},lastActivity:{type:'lab',id:id.replace(/^lab:/,'')}})),[update]);
 const experiment=useCallback((id:string)=>update(p=>({...p,experiments:p.experiments.includes(id)?p.experiments.filter(x=>x!==id):[...p.experiments,id]})),[update]);
 const note=useCallback((text:string,id?:string)=>update(p=>!text.trim()?p:({...p,notes:id?p.notes.map(n=>n.id===id?{...n,text:text.trim().slice(0,1000)}:n):[...p.notes,{id:localId(),text:text.trim().slice(0,1000),at:new Date().toISOString()}].slice(-100)})),[update]);
 const removeNote=useCallback((id:string)=>update(p=>({...p,notes:p.notes.filter(n=>n.id!==id)})),[update]);
 return {progress:save.progress,restoreRevision,ready,available,storage,notice,reset,add,markMission,favorite,chapter,review,settings,activity,quiz,game,worldState,clearGame,lab,experiment,note,removeNote,backup,importSave,flush};
}
