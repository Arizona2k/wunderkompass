import QUESTIONS from './classic-questions.json' with {type:'json'};
import {shuffle} from './earth-data';
import {isRecord} from './game-state';
import type {Review} from './progress-storage';
import {EXPERTEN_JE_RUNDE,waehleAufgaben} from './kern/auswahl';
import {istStufe,type Stufe} from './kern/stufe';
export type ClassicLevel='easy'|'medium'|'hard';
export type ReasonGame='habitats'|'detective';
export type ClassicQuestion={id:string;game:ReasonGame;level:ClassicLevel;stufe?:Stufe;ruht?:true;prompt:string;answers:string[];correct:string;wrongReasons:Record<string,string>;why:string;hints:string[];topic:string};
export const CLASSIC_QUESTIONS=QUESTIONS as unknown as ClassicQuestion[];
export const CLASSIC_LEVELS=[{id:'easy',label:'Leicht',description:'Grundlagen erkennen und eindeutige Hinweise nutzen.'},{id:'medium',label:'Mittel',description:'Merkmale vergleichen und Zusammenhänge erklären.'},{id:'hard',label:'Schwer',description:'Wissen auf veränderte Situationen übertragen.'}] as const;
// Runden seit Teil B, Aufgabe 9 folgen der gemeinsamen Stufe (`stufe`, `level: null`); ältere Runden mit Leicht/Mittel/Schwer
// (`level`) laufen so zu Ende. Zähler wie „… davon beim ersten Versuch“ gibt es nicht mehr (E13); alte Felder (`missed`,
// `firstCorrect`, `repeat`) werden beim Laden ignoriert.
export type ReasonRound={level:ClassicLevel|null;stufe?:Stufe;ids:string[];orders:Record<string,string[]>;index:number;answer:string|null;done:boolean};
export const emptyReasonRound=():ReasonRound=>({level:null,ids:[],orders:{},index:0,answer:null,done:false});
// Stufe einer Frage: eingestuft (`stufe`) oder aus der alten Einteilung, Leicht = Entdecker, Mittel und Schwer = Profi
// (Stufen-Prüfung „Stimmt das wirklich?“, 24.11.2026: keine der schweren Fragen ist eine echte Experten-Frage).
export const klassikStufe=(q:ClassicQuestion):Stufe=>q.stufe??(q.level==='easy'?'entdecker':'profi');
export const KLASSIK_RUNDE=4;
const vorratDer=(game:ReasonGame,stufe:Stufe)=>CLASSIC_QUESTIONS.filter(q=>q.game===game&&!q.ruht&&klassikStufe(q)===stufe).map(q=>q.id);
// Experte gibt es nur mit mindestens vier echten Experten-Fragen (E3, Entscheidung C1); sonst spielt Experte Profi.
export const hatExperte=(game:ReasonGame)=>vorratDer(game,'experte').length>=4;
export const klassikSpielStufe=(game:ReasonGame,stufe:Stufe):Stufe=>stufe==='experte'&&!hatExperte(game)?'profi':stufe;
// Die Stufe, die eine Runde spielt; alte Runden: Leicht = Entdecker, sonst Profi.
export const rundenStufe=(r:ReasonRound):Stufe=>r.stufe??(r.level==='easy'?'entdecker':'profi');
function mischen<T>(items:readonly T[],zufall:()=>number){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(zufall()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
// Neue Runde mit dem gemeinsamen Auswahl-Helfer (E7): falsch und fällig, ungesehen, fällig, Rest; die vorige Runde zuletzt.
// Experte zieht zuerst höchstens EXPERTEN_JE_RUNDE Experten-Fragen und füllt mit Profi auf.
export function neueKlassikRunde(game:ReasonGame,stufe:Stufe,review:Review={},vorige:readonly string[]=[],zufall:()=>number=Math.random,heute?:string):ReasonRound{
 const gespielt=klassikSpielStufe(game,stufe),schluessel=(id:string)=>'classic:'+game+':'+id;
 const waehle=(vorrat:string[],anzahl:number)=>waehleAufgaben({vorrat,review,schluessel,anzahl,vorige,zufall,heute});
 const zuerst=gespielt==='experte'?waehle(vorratDer(game,'experte'),EXPERTEN_JE_RUNDE):[];
 const ids=[...zuerst,...waehle(vorratDer(game,gespielt==='experte'?'profi':gespielt),KLASSIK_RUNDE-zuerst.length)];
 return {level:null,stufe:gespielt,ids,orders:Object.fromEntries(ids.map(id=>[id,mischen(CLASSIC_QUESTIONS.find(q=>q.id===id)!.answers,zufall)])),index:0,answer:null,done:false};
}
export function restoreReasonRound(game:ReasonGame,value:unknown):ReasonRound{
 if(!isRecord(value)||!Array.isArray(value.ids)||!value.ids.length||value.ids.length>20||new Set(value.ids).size!==value.ids.length||!isRecord(value.orders))return emptyReasonRound();
 const neu=value.stufe!==undefined;
 if(neu?!istStufe(value.stufe)||value.level!=null:!CLASSIC_LEVELS.some(l=>l.id===value.level))return emptyReasonRound();
 const stufe=value.stufe as Stufe,erlaubt=stufe==='experte'?['experte','profi']:[stufe];
 const passt=(q:ClassicQuestion)=>q.game===game&&(neu?erlaubt.includes(klassikStufe(q)):q.level===value.level);
 if(!value.ids.every(id=>CLASSIC_QUESTIONS.some(q=>q.id===id&&passt(q))))return emptyReasonRound();
 const ids=value.ids as string[],orders:Record<string,string[]>={};
 // Eine ungültige Reihenfolge wird neu gemischt; sonst stünde die richtige Antwort oft oben (Stufen-Prüfung, Befund 8).
 for(const id of ids){const q=CLASSIC_QUESTIONS.find(q=>q.id===id)!,a=value.orders[id];orders[id]=Array.isArray(a)&&a.length===q.answers.length&&new Set(a).size===a.length&&a.every(c=>q.answers.includes(c))?a as string[]:shuffle(q.answers);}
 const index=typeof value.index==='number'&&Number.isInteger(value.index)?Math.max(0,Math.min(ids.length-1,value.index)):0,q=CLASSIC_QUESTIONS.find(q=>q.id===ids[index])!;
 const runde={ids,orders,index,answer:typeof value.answer==='string'&&q.answers.includes(value.answer)?value.answer:null,done:value.done===true&&index===ids.length-1&&value.answer===q.correct};
 return neu?{level:null,stufe,...runde}:{level:value.level as ClassicLevel,...runde};
}
export function answerReasonRound(round:ReasonRound,answer:string):ReasonRound{
 const q=CLASSIC_QUESTIONS.find(q=>q.id===round.ids[round.index]);if(!q||round.done||round.answer===q.correct||!q.answers.includes(answer))return round;
 return {...round,answer};
}
