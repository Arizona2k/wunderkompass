import type { Place } from './earth-data';
export const SAVE_KEY='erde-entdecken:save:v3';
export const LEGACY_KEY='erde-entdecken:forscherpass:v2';
export const SAVE_VERSION=3;
export type Review=Record<string,{correct:boolean;seen:number;due:string}>;
export type Difficulty='easy'|'normal'|'tricky';
export type Settings={sound:boolean;readRate:number;readVoice?:string;largeText:boolean;reducedMotion:boolean;difficulty:Difficulty};
export type Activity={type:'journey'|'game'|'quiz'|'place'|'lab'|'topic'|'route';id:string;family?:'classic'|'extra'|'world'};
export type QuizSession={id:string;ids:string[];index:number;answer:number|null;score:number;finished:boolean;category:string;difficulty:Difficulty};
export type LocalProgress={discoveries:string[];journeys:string[];games:string[];missions:number[];labs:string[];experiments:string[];favorites:string[];favoritePlaces:Record<string,Place>;chapters:Record<string,number>;completedChapters:Record<string,number[]>;review:Review;notes:{id:string;text:string;at:string}[];settings:Settings;quizResults:{id:string;at:string;category:string;score:number;total:number}[];quizSession:QuizSession|null;gameSessions:Record<string,Record<string,unknown>>;lastActivity:Activity|null};
export type Save={app:'earth-explorer';schemaVersion:3;createdAt:string;updatedAt:string;progress:LocalProgress;epoch?:string;epochAt?:number;revision?:number};
export const defaults:Settings={sound:false,readRate:.9,largeText:false,reducedMotion:false,difficulty:'normal'};
const modes=['journey','game','quiz','place','lab','topic','route'];
const own=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const key=(v:unknown):v is string=>typeof v==='string'&&v.length>0&&v.length<=160&&!['__proto__','prototype','constructor'].includes(v);
const text=(v:unknown,max=6000)=>typeof v==='string'?v.slice(0,max):'';
const count=(v:unknown,max:number,fallback=0)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):fallback;
const date=(v:unknown,fallback=new Date().toISOString())=>typeof v==='string'&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():fallback;
const strings=(v:unknown)=>Array.isArray(v)?[...new Set(v.filter(key))].slice(0,2000):[];
export function emptyProgress():LocalProgress{return {discoveries:[],journeys:[],games:[],missions:[],labs:[],experiments:[],favorites:[],favoritePlaces:{},chapters:{},completedChapters:{},review:{},notes:[],settings:{...defaults},quizResults:[],quizSession:null,gameSessions:{},lastActivity:null};}
function safeJSON(v:unknown,depth=0):unknown{
 if(depth>12)return undefined;
 if(v===null||typeof v==='boolean')return v;
 if(typeof v==='number')return Number.isFinite(v)?v:undefined;
 if(typeof v==='string')return v.slice(0,6000);
 if(Array.isArray(v))return v.slice(0,10000).map(x=>safeJSON(x,depth+1));
 if(own(v)){const out:Record<string,unknown>={};for(const [k,x] of Object.entries(v).slice(0,200)){if(key(k))out[k]=safeJSON(x,depth+1);}return out;}
 return undefined;
}
export function restoreProgress(value:unknown):LocalProgress{
 const v=own(value)?value:{},out=emptyProgress();
 for(const field of ['discoveries','journeys','games','labs','experiments','favorites'] as const)out[field]=strings(v[field]);
 out.missions=Array.isArray(v.missions)?[...new Set(v.missions.filter((n:unknown)=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<100))] as number[]:[];
 if(own(v.favoritePlaces))for(const [id,p] of Object.entries(v.favoritePlaces).slice(0,1000)){if(key(id)&&own(p)&&p.id===id&&typeof p.name==='string'&&typeof p.text==='string'&&typeof p.fact==='string'&&typeof p.lat==='number'&&Number.isFinite(p.lat)&&Math.abs(p.lat)<=90&&typeof p.lon==='number'&&Number.isFinite(p.lon)&&Math.abs(p.lon)<=180&&typeof p.kind==='string'&&['country','continent','ocean','line','nature'].includes(p.kind)){const place:Place & {continent?:string;category?:string}={id,kind:p.kind as Place['kind'],name:text(p.name,200),text:text(p.text),fact:text(p.fact),lat:p.lat,lon:p.lon};
for(const field of ['label','capital','continent','color'] as const)if(typeof p[field]==='string')place[field]=text(p[field],200);
if(typeof p.iso==='string'&&/^[A-Z]{2}$/.test(p.iso))place.iso=p.iso;
for(const field of ['population','area'] as const)if(typeof p[field]==='number'&&Number.isFinite(p[field])&&p[field]>=0)place[field]=p[field];
for(const field of ['populationYear','areaYear'] as const)if(typeof p[field]==='number'&&p[field]>=1900&&p[field]<=2100)place[field]=Math.floor(p[field]);
place.languages=strings(p.languages).filter(s=>/^[a-zA-Z_-]{2,20}$/.test(s)).slice(0,12);place.currencies=strings(p.currencies).filter(s=>/^[A-Z]{3}$/.test(s)).slice(0,6);place.isState=p.isState===true;
if(typeof p.category==='string'&&['mountains','rivers','lakes','deserts','forests','volcanoes','animals','records','climate','vegetation','plates','orientation','timezones','capitals'].includes(p.category))place.category=p.category;
out.favoritePlaces[id]=place;}}
 if(own(v.chapters))for(const [id,n] of Object.entries(v.chapters)){if(key(id)&&typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<30)out.chapters[id]=n;}
 if(own(v.completedChapters))for(const [id,ns] of Object.entries(v.completedChapters)){if(key(id)&&Array.isArray(ns))out.completedChapters[id]=[...new Set(ns.filter(n=>Number.isInteger(n)&&n>=0&&n<30))];}
 // Earlier saves recorded the next chapter; retain those completed chapters during migration.
 if(!v.completedChapters)for(const [id,n] of Object.entries(out.chapters))out.completedChapters[id]=Array.from({length:n},(_,i)=>i);
 if(own(v.review))for(const [id,r] of Object.entries(v.review).slice(0,2000)){if(key(id)&&own(r)&&typeof r.correct==='boolean'&&typeof r.due==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.due)&&Number.isFinite(Date.parse(r.due)))out.review[id]={correct:r.correct,seen:count(r.seen,1000),due:r.due};}
 if(Array.isArray(v.notes))out.notes=v.notes.filter(n=>own(n)&&key(n.id)&&typeof n.text==='string').slice(0,100).map(n=>({id:n.id,text:text(n.text,1000),at:date(n.at)}));
 if(own(v.settings))out.settings={readVoice:typeof v.settings.readVoice==='string'?v.settings.readVoice.slice(0,300):'',sound:v.settings.sound===true,readRate:typeof v.settings.readRate==='number'&&Number.isFinite(v.settings.readRate)?Math.min(1.15,Math.max(.7,v.settings.readRate)):.9,largeText:v.settings.largeText===true,reducedMotion:v.settings.reducedMotion===true,difficulty:typeof v.settings.difficulty==='string'&&['easy','normal','tricky'].includes(v.settings.difficulty)?v.settings.difficulty as Difficulty:'normal'};
 if(Array.isArray(v.quizResults))out.quizResults=v.quizResults.filter(r=>own(r)&&key(r.id)&&typeof r.score==='number'&&typeof r.total==='number'&&r.total>0&&r.total<=76).slice(-50).map(r=>({id:r.id,at:date(r.at),category:text(r.category,100),total:count(r.total,76),score:count(r.score,r.total)}));
 if(own(v.quizSession)&&key(v.quizSession.id)){const q=v.quizSession,ids=strings(q.ids).slice(0,76);if(ids.length)out.quizSession={id:String(q.id),ids,index:count(q.index,ids.length-1),answer:typeof q.answer==='number'&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<=2?q.answer:null,score:count(q.score,ids.length),finished:q.finished===true,category:text(q.category,100),difficulty:typeof q.difficulty==='string'&&['easy','normal','tricky'].includes(q.difficulty)?q.difficulty as Difficulty:'normal'};}
 // Retain all 240 previously valid sessions plus the 16 optional journey notebooks.
 if(own(v.gameSessions))for(const [id,s] of Object.entries(v.gameSessions).slice(0,256)){if(key(id)&&own(s)&&JSON.stringify(s).length<=400000)out.gameSessions[id]=safeJSON(s) as Record<string,unknown>;}
 if(own(v.lastActivity)&&typeof v.lastActivity.type==='string'&&modes.includes(v.lastActivity.type)&&key(v.lastActivity.id))out.lastActivity={type:v.lastActivity.type as Activity['type'],id:v.lastActivity.id,...(typeof v.lastActivity.family==='string'&&['classic','extra','world'].includes(v.lastActivity.family)?{family:v.lastActivity.family as 'classic'|'extra'|'world'}: {})};
 return out;
}
export function restoreSave(value:unknown,strict=false):Save{
 if(!own(value))throw new Error('Die Datei enthält keinen Entdeckerpass.');
 if(value.schemaVersion!=null&&(!Number.isInteger(value.schemaVersion)||typeof value.schemaVersion!=='number'||value.schemaVersion<1))throw new Error('Die Versionsangabe der Sicherung ist ungültig.');
 if(typeof value.schemaVersion==='number'&&value.schemaVersion>SAVE_VERSION)throw new Error('Dieser Pass stammt aus einer neueren Version. Bitte bewahre die Datei auf.');
 if(strict&&value.app!=='earth-explorer'&&!['discoveries','chapters','journeys'].some(k=>Array.isArray(value[k])||own(value[k])))throw new Error('Diese Datei gehört nicht zu einem Entdeckerpass.');
 if(value.app&&value.app!=='earth-explorer')throw new Error('Diese Datei gehört nicht zu einem Entdeckerpass.');
 const now=new Date().toISOString();return {app:'earth-explorer',schemaVersion:3,createdAt:date(value.createdAt,now),updatedAt:date(value.updatedAt,now),progress:restoreProgress(own(value.progress)?value.progress:value),epoch:key(value.epoch)?value.epoch:'legacy-v3',epochAt:count(value.epochAt,Number.MAX_SAFE_INTEGER),revision:count(value.revision,Number.MAX_SAFE_INTEGER)};
}
export function createSave(progress=emptyProgress()):Save{const at=new Date().toISOString();return {app:'earth-explorer',schemaVersion:3,createdAt:at,updatedAt:at,progress};}
let connection:Promise<IDBDatabase>|null=null;
export function database():Promise<IDBDatabase>{
 if(connection)return connection;
 connection=new Promise<IDBDatabase>((resolve,reject)=>{if(typeof indexedDB==='undefined'){reject(new Error('IndexedDB unavailable'));return;}const request=indexedDB.open('earth-explorer',1);let settled=false;const timer=setTimeout(()=>{settled=true;reject(new Error('Database blocked'));},2500);
 request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('saves'))request.result.createObjectStore('saves');};
 request.onerror=()=>{clearTimeout(timer);settled=true;reject(request.error);};
 request.onsuccess=()=>{clearTimeout(timer);if(settled){request.result.close();return;}const db=request.result;db.onversionchange=()=>{db.close();connection=null;};resolve(db);};
 }).catch(e=>{connection=null;throw e;});return connection!;
}
export async function readDatabase():Promise<unknown>{const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('saves','readonly');const request=tx.objectStore('saves').get('main');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);tx.onabort=()=>reject(tx.error);});}
export async function writeDatabase(save:Save):Promise<void>{const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(save,'main');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
