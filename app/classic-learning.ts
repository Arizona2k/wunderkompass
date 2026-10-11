import QUESTIONS from './classic-questions.json' with {type:'json'};
import {shuffle} from './earth-data';
import {isRecord} from './game-state';
export type ClassicLevel='easy'|'medium'|'hard';
export type ReasonGame='habitats'|'detective';
export type ClassicQuestion={id:string;game:ReasonGame;level:ClassicLevel;prompt:string;answers:string[];correct:string;wrongReasons:Record<string,string>;why:string;hints:string[];topic:string};
export const CLASSIC_QUESTIONS=QUESTIONS as unknown as ClassicQuestion[];
export const CLASSIC_LEVELS=[{id:'easy',label:'Leicht',description:'Grundlagen erkennen und eindeutige Hinweise nutzen.'},{id:'medium',label:'Mittel',description:'Merkmale vergleichen und Zusammenhänge erklären.'},{id:'hard',label:'Schwer',description:'Wissen auf veränderte Situationen übertragen.'}] as const;
export type ReasonRound={level:ClassicLevel|null;ids:string[];orders:Record<string,string[]>;index:number;answer:string|null;done:boolean;missed:string[];firstCorrect:number;repeat:boolean};
export const emptyReasonRound=():ReasonRound=>({level:null,ids:[],orders:{},index:0,answer:null,done:false,missed:[],firstCorrect:0,repeat:false});
export function createReasonRound(game:ReasonGame,level:ClassicLevel,repeatIds?:string[]):ReasonRound{
 const pool=CLASSIC_QUESTIONS.filter(q=>q.game===game&&q.level===level&&(!repeatIds||repeatIds.includes(q.id)));
 const ids=shuffle(pool.map(q=>q.id));return {level,ids,orders:Object.fromEntries(pool.map(q=>[q.id,shuffle(q.answers)])),index:0,answer:null,done:false,missed:[],firstCorrect:0,repeat:!!repeatIds};
}
export function restoreReasonRound(game:ReasonGame,value:unknown):ReasonRound{
 if(!isRecord(value)||!CLASSIC_LEVELS.some(l=>l.id===value.level)||!Array.isArray(value.ids)||!value.ids.length||value.ids.length>20||new Set(value.ids).size!==value.ids.length||!value.ids.every(id=>CLASSIC_QUESTIONS.some(q=>q.id===id&&q.game===game&&q.level===value.level))||!isRecord(value.orders))return emptyReasonRound();
 const ids=value.ids as string[],orders:Record<string,string[]>={};
 for(const id of ids){const q=CLASSIC_QUESTIONS.find(q=>q.id===id)!,a=value.orders[id];orders[id]=Array.isArray(a)&&a.length===q.answers.length&&new Set(a).size===a.length&&a.every(c=>q.answers.includes(c))?a as string[]:[...q.answers];}
 const index=typeof value.index==='number'&&Number.isInteger(value.index)?Math.max(0,Math.min(ids.length-1,value.index)):0,q=CLASSIC_QUESTIONS.find(q=>q.id===ids[index])!;
 return {level:value.level as ClassicLevel,ids,orders,index,answer:typeof value.answer==='string'&&q.answers.includes(value.answer)?value.answer:null,done:value.done===true&&index===ids.length-1&&value.answer===q.correct,missed:Array.isArray(value.missed)?[...new Set(value.missed.filter((id):id is string=>typeof id==='string'&&ids.includes(id)))]:[],firstCorrect:typeof value.firstCorrect==='number'&&Number.isFinite(value.firstCorrect)?Math.max(0,Math.min(ids.length,Math.floor(value.firstCorrect))):0,repeat:value.repeat===true};
}
export function answerReasonRound(round:ReasonRound,answer:string):ReasonRound{
 const q=CLASSIC_QUESTIONS.find(q=>q.id===round.ids[round.index]);if(!q||round.done||round.answer===q.correct||!q.answers.includes(answer))return round;
 const right=answer===q.correct,missed=!right&&!round.missed.includes(q.id)?[...round.missed,q.id]:round.missed;
 return {...round,answer,missed,firstCorrect:round.firstCorrect+(right&&round.answer===null&&!missed.includes(q.id)?1:0)};
}
