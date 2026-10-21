import legacy from './journey-task-compatibility.json' with {type:'json'};
const entries=/** @type {Record<string,{answers:string[],correct:number,why:string,wrong:string[]}>} */(legacy.entries);
/** @param {string} chapter @param {number} level */
export function revisedJourneyTask(chapter,level){return Object.hasOwn(entries,chapter+':'+level);}
/** @param {string} chapter @param {number} level @param {unknown} choice @param {unknown} revision */
export function priorJourneySelection(chapter,level,choice,revision){
 if(revision!==undefined&&revision!==0||typeof choice!=='number'||!Number.isInteger(choice)||choice<0||choice>2)return null;
 const old=entries[chapter+':'+level];return old?{answer:old.answers[choice],feedback:choice===old.correct?old.why:old.wrong[choice]}:null;
}
