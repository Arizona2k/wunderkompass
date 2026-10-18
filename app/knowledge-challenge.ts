import {restoreAnswerWording} from './retained-answer-wording.mjs';
import QUESTIONS from './world-question-index.json' with {type:'json'};
import type {WorldQuestion} from './world-types';
export type Difficulty='easy'|'medium'|'hard';
export type ChallengeQuestion=WorldQuestion & {id:string;topic:string;topicTitle:string;difficulty:Difficulty;hints:readonly string[]};
export const DIFFICULTIES: {id:Difficulty;label:string;description:string}[]=[
 {id:'easy',label:'Leicht',description:'Kurzfragen aus allen Wissenswelten. Erkennen und erinnern.'},
 {id:'medium',label:'Mittel',description:'Natur, Erde und Weltall: Beobachtungen erklären.'},
 {id:'hard',label:'Schwer',description:'Zusammenhänge übertragen und Behauptungen prüfen.'}
];
export const CHALLENGE_BANK=QUESTIONS as ChallengeQuestion[];
export type ChallengeSession={difficulty:Difficulty|null;ids:string[];orders:Record<string,string[]>;index:number;answer:string|null;done:boolean};
export const emptyChallenge=():ChallengeSession=>({difficulty:null,ids:[],orders:{},index:0,answer:null,done:false});
function shuffle<T>(items:T[],random:()=>number){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createChallenge(difficulty:Difficulty,previous:string[]=[],random:()=>number=Math.random):ChallengeSession{
 const pool=CHALLENGE_BANK.filter(q=>q.difficulty===difficulty),fresh=shuffle(pool.filter(q=>!previous.includes(q.id)),random),old=shuffle(pool.filter(q=>previous.includes(q.id)),random);
 const selected=[...fresh,...old].slice(0,6);
 return {difficulty,ids:selected.map(q=>q.id),orders:Object.fromEntries(selected.map(q=>[q.id,shuffle(q.answers,random)])),index:0,answer:null,done:false};
}
export function restoreChallenge(value:unknown,fallback:ChallengeSession):ChallengeSession{
 if(!value||typeof value!=='object')return fallback;
 const s=value as ChallengeSession;
 if(s.difficulty===null)return emptyChallenge();
 if(!DIFFICULTIES.some(d=>d.id===s.difficulty)||!Array.isArray(s.ids)||s.ids.length!==6||new Set(s.ids).size!==s.ids.length||!Number.isInteger(s.index)||s.index<0||s.index>=s.ids.length||typeof s.done!=='boolean'||!s.orders||typeof s.orders!=='object')return fallback;
 const orders:Record<string,string[]>={};for(const id of s.ids){const q=CHALLENGE_BANK.find(q=>q.id===id&&q.difficulty===s.difficulty),raw=s.orders[id];if(!q||!Array.isArray(raw))return fallback;const order=raw.map(value=>restoreAnswerWording(q.topic,value));if(order.length!==q.answers.length||new Set(order).size!==order.length||!order.every(a=>q.answers.includes(a)))return fallback;orders[id]=order;}
 const q=CHALLENGE_BANK.find(q=>q.id===s.ids[s.index])!,answer=s.answer===null?null:restoreAnswerWording(q.topic,s.answer);
 if(answer!==null&&!q.answers.includes(answer))return fallback;
 if(s.done&&(s.index!==s.ids.length-1||answer!==q.answers[q.correct]))return fallback;
 return {difficulty:s.difficulty,ids:s.ids,orders,index:s.index,answer,done:s.done};
}
