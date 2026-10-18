// Exact compatibility alias for one reviewed grammatical correction.
// The correct answer and its position are deliberately outside this mapping.
export const RETAINED_ANSWER_WORDING=Object.freeze({topic:'animal-white-tailed-eagle',index:2,before:'Die Länge eines einzelnen Schwanzfeder.',after:'Die Länge einer einzelnen Schwanzfeder.'});
/** @param {string} topic @param {string} value @returns {string} */
export function restoreAnswerWording(topic,value){return topic===RETAINED_ANSWER_WORDING.topic&&value===RETAINED_ANSWER_WORDING.before?RETAINED_ANSWER_WORDING.after:value;}
export function isRetainedAnswerWordingCorrection(c){
 const a=RETAINED_ANSWER_WORDING,before=c.before?.answers,after=c.after?.answers;
 return c.topic===a.topic&&Array.isArray(before)&&Array.isArray(after)&&before.length===3&&after.length===before.length&&c.before.correct===c.after.correct&&c.before.correct!==a.index&&before[a.index]===a.before&&after[a.index]===a.after&&before.every((value,index)=>index===a.index||value===after[index]);
}
