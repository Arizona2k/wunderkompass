import {isRetainedAnswerWordingCorrection} from '../app/retained-answer-wording.mjs';
export function historicalQuestionBank(questions,corrections){
 const records=new Map();
 for(const c of corrections){
  if(records.has(c.id)||c.id!==c.topic+':mini'||!c.reason||!c.authority||!c.reviewedOn||!Array.isArray(c.changedFields)||!c.changedFields.length||new Set(c.changedFields).size!==c.changedFields.length||c.changedFields.some(k=>!['prompt','why','answers'].includes(k)))throw Error('Invalid documented question correction');
  const keys=['prompt','answers','correct','why'];
  if([c.before,c.after].some(q=>!q||Object.keys(q).sort().join()!==[...keys].sort().join())||(JSON.stringify(c.before.answers)!==JSON.stringify(c.after.answers)&&!isRetainedAnswerWordingCorrection(c))||c.before.correct!==c.after.correct||keys.filter(k=>JSON.stringify(c.before[k])!==JSON.stringify(c.after[k])).sort().join()!==[...c.changedFields].sort().join())throw Error('Correction changes protected answers or undocumented fields');
  records.set(c.id,c);
 }
 return questions.map(q=>{
  const c=records.get(q.id);if(!c)return q;
  if(q.topic!==c.topic||Object.keys(c.after).some(k=>JSON.stringify(q[k])!==JSON.stringify(c.after[k])))throw Error('Current question differs from documented correction '+q.id);
  return {...q,...c.before};
 });
}
