import legacy from './research-task-compatibility.json' with {type:'json'};

// Answer identity stays the canonical index. A stable ID-derived presentation
// varies positions without translating old selected indices or earned stamps.
/** @param {string} id @param {string} level @param {number} count */
export function researchAnswerOrder(id,level,count){
 const order=Array.from({length:count},(_,i)=>i);if(level!=='hard')return order;
 let hash=2166136261;for(const char of id){hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;}
 const offset=hash%count;return order.slice(offset).concat(order.slice(0,offset));
}

/** @param {string} id @param {string} level @param {unknown} answer @param {unknown} revision */
export function priorResearchSelection(id,level,answer,revision){
 if(level!=='hard'||revision!==0||typeof answer!=='number'||!Number.isInteger(answer)||answer<0||answer>2)return null;
 const old=/** @type {Record<string,{answers:string[],correct:number,why:string,feedback:string[]}>} */(legacy.entries)[id];
 if(!old)return null;
 return {answer:old.answers[answer],right:answer===old.correct,feedback:answer===old.correct?old.why:old.feedback[answer]};
}
