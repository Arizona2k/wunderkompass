import {restoreAnswerWording,retainedChallengeChoiceVariant} from './retained-answer-wording.mjs';
import HINTS from './challenge-hints.json' with {type:'json'};
import CATALOG from './world-catalog.json' with {type:'json'};
import type {WorldTopic, WorldQuestion} from './world-types';
import type {Review} from './progress-storage';
import {waehleAufgaben} from './kern/auswahl';
import {istStufe,type Stufe} from './kern/stufe';
export type Difficulty='easy'|'medium'|'hard';
export type ChallengeQuestion=WorldQuestion & {id:string;topic:string;topicTitle:string;difficulty:Difficulty;level?:Stufe;hints:readonly string[];ruht?:true};
export const DIFFICULTIES: {id:Difficulty;label:string;description:string}[]=[
 {id:'easy',label:'Leicht',description:'Kurzfragen aus allen Wissenswelten. Erkennen und erinnern.'},
 {id:'medium',label:'Mittel',description:'Natur, Erde und Weltall: Beobachtungen erklären.'},
 {id:'hard',label:'Schwer',description:'Zusammenhänge übertragen und Behauptungen prüfen.'}
];
const hintBank=HINTS as Record<string,{steps:string[]}>;
export const CHALLENGE_BANK:ChallengeQuestion[]=(CATALOG as WorldTopic[]).filter(t=>!t.history?.sensitive).flatMap(t=>[
 {...t.question,id:t.id+':mini',topic:t.id,topicTitle:t.title,difficulty:'easy' as const},
 ...(t.challenges??[]).map(q=>({...q,topic:t.id,topicTitle:t.title}))
]).map(q=>({...q,hints:hintBank[q.id]?.steps??[]}));
// Resolve the exact saved choice variant; prompts and correct meanings stay reviewed and unchanged.
export function challengeQuestionForOrder(id:string,order:unknown){
 const question=CHALLENGE_BANK.find(q=>q.id===id);if(!question)return null;
 const variant=retainedChallengeChoiceVariant(question,order);if(!variant)return null;
 // Eine alte Runde mit der ganzen früheren Frage (umformuliert in Teilschritt 3) zeigt keine Tipps: Die heutigen Tipps
 // gehören zur neuen Fassung und passen vielleicht nicht zur alten (Code-Prüfung Teil A, Befund 5). Solche Runden sind selten
 // und enden nach sechs Aufgaben; jede neue Runde hat ihre Tipps.
 const runde={...question,...variant};return runde.prompt!==question.prompt?{...runde,hints:[]}:runde;
}
// Runden seit Teil B haben eine `stufe` und `difficulty: null`; ältere Runden haben nur `difficulty` (Leicht/Mittel/Schwer) und laufen so weiter.
export type ChallengeSession={difficulty:Difficulty|null;stufe?:Stufe;ids:string[];orders:Record<string,string[]>;index:number;answer:string|null;done:boolean};
export const emptyChallenge=():ChallengeSession=>({difficulty:null,ids:[],orders:{},index:0,answer:null,done:false});
function shuffle<T>(items:T[],random:()=>number){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
// Auswahl mit dem gemeinsamen Helfer (Teil B, Aufgabe 7): falsch und fällig, ungesehen, fällig, Rest; die vorige Runde zuletzt.
export function createChallenge(difficulty:Difficulty,previous:readonly string[]=[],random:()=>number=Math.random,review:Review={},heute?:string):ChallengeSession{
 const pool=CHALLENGE_BANK.filter(q=>q.difficulty===difficulty&&!q.ruht);
 const ids=waehleAufgaben({vorrat:pool.map(q=>q.id),review,schluessel:id=>'challenge:'+id,anzahl:6,vorige:previous,zufall:random,heute});
 const selected=ids.map(id=>pool.find(q=>q.id===id)!);
 return {difficulty,ids,orders:Object.fromEntries(selected.map(q=>[q.id,shuffle(q.answers,random)])),index:0,answer:null,done:false};
}
// Kreuz und quer nach der gemeinsamen Stufe (Teil B, Aufgabe 9; Entscheidungsliste Teil B, Punkt 8): Hauptfragen der Karten sind
// Entdecker, Challenge-Fragen ohne Einstufung Profi. Experte bekommt erst die wenigen Experten-Fragen, dann Profi-Fragen.
export const stufeDerFrage=(q:ChallengeQuestion):Stufe=>q.difficulty==='easy'?'entdecker':q.level??'profi';
export const EXPERTEN_HINWEIS='Experten-Fragen gibt es hier erst wenige. Du bekommst sie zuerst, dann Profi-Fragen.';
const erlaubt=(stufe:Stufe):Stufe[]=>stufe==='experte'?['experte','profi']:[stufe];
const vorratDer=(stufe:Stufe)=>CHALLENGE_BANK.filter(q=>!q.ruht&&stufeDerFrage(q)===stufe).map(q=>q.id);
export function kreuzUndQuerRunde(stufe:Stufe,previous:readonly string[]=[],random:()=>number=Math.random,review:Review={},heute?:string):ChallengeSession{
 const waehle=(vorrat:string[],anzahl:number)=>waehleAufgaben({vorrat,review,schluessel:id=>'challenge:'+id,anzahl,vorige:previous,zufall:random,heute});
 const zuerst=stufe==='experte'?waehle(vorratDer('experte'),6):[],ids=[...zuerst,...waehle(vorratDer(stufe==='experte'?'profi':stufe),6-zuerst.length)];
 return {difficulty:null,stufe,ids,orders:Object.fromEntries(ids.map(id=>[id,shuffle(CHALLENGE_BANK.find(q=>q.id===id)!.answers,random)])),index:0,answer:null,done:false};
}
export function restoreChallenge(value:unknown,fallback:ChallengeSession):ChallengeSession{
 if(!value||typeof value!=='object')return fallback;
 const s=value as ChallengeSession,neu=s.stufe!==undefined;
 if(neu&&!istStufe(s.stufe))return fallback;
 if(!neu&&s.difficulty===null)return emptyChallenge();
 const passt=(q:ChallengeQuestion)=>neu?erlaubt(s.stufe!).includes(stufeDerFrage(q)):q.difficulty===s.difficulty;
 if(!neu&&!DIFFICULTIES.some(d=>d.id===s.difficulty)||!Array.isArray(s.ids)||s.ids.length!==6||new Set(s.ids).size!==s.ids.length||!Number.isInteger(s.index)||s.index<0||s.index>=s.ids.length||typeof s.done!=='boolean'||!s.orders||typeof s.orders!=='object')return fallback;
 const orders:Record<string,string[]>={};for(const id of s.ids){const q=CHALLENGE_BANK.find(q=>q.id===id&&passt(q)),raw=s.orders[id];if(!q||!Array.isArray(raw))return fallback;const order=raw.map(value=>restoreAnswerWording(q.topic,value));if(!challengeQuestionForOrder(id,order))return fallback;orders[id]=order;}
 const q=challengeQuestionForOrder(s.ids[s.index],orders[s.ids[s.index]])!,answer=s.answer===null?null:restoreAnswerWording(q.topic,s.answer);
 if(answer!==null&&!q.answers.includes(answer))return fallback;
 if(s.done&&(s.index!==s.ids.length-1||answer!==q.answers[q.correct]))return fallback;
 return neu?{difficulty:null,stufe:s.stufe,ids:s.ids,orders,index:s.index,answer,done:s.done}:{difficulty:s.difficulty,ids:s.ids,orders,index:s.index,answer,done:s.done};
}
