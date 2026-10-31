export const STATISTICS_WORDS=["Mittelwert", "Median", "Messwert", "Messunsicherheit", "Stichprobe", "Wahrscheinlichkeit", "Skala", "Maßstab"];
export const STATISTICS_RETAINED_WORDS=[];
export const STATISTICS_QUESTIONS=["Warum muss nach mehreren gleichen Zufallsergebnissen kein Ausgleich kommen?", "Warum kann ein einzelner sehr großer Wert einen Durchschnitt verschieben?", "Warum machen zusätzliche Nachkommastellen eine Messung nicht automatisch genauer?"];
const text=v=>typeof v==='string'&&v.trim().length>0;
const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
const day=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
const exact=(group,terms)=>record(group)&&Object.keys(group).length===terms.length&&terms.every(term=>Object.hasOwn(group,term));
const figures=["independent-trials", "mean-and-median", "numbered-intervals", "plan-scale", "repeat-and-offset", "ruler-offset", "sample-selection"];
const topics=["invention-compass", "science-pendulum", "science-probability"];
export function validateStatisticsPack(data){
 const fail=()=>{throw Error('Incomplete statistics explanations');};
 if(!record(data)||data.schemaVersion!==1||!day(data.sourceReadOn)||!exact(data.words,STATISTICS_WORDS)||!exact(data.learning,STATISTICS_WORDS)||!exact(data.why,STATISTICS_QUESTIONS)||!exact(data.whyLearning,STATISTICS_QUESTIONS))fail();
 for(const [terms,definitions,learning,tupleLength]of[[STATISTICS_WORDS,data.words,data.learning,3],[STATISTICS_QUESTIONS,data.why,data.whyLearning,2]])for(const term of terms){
  const definition=definitions[term],item=learning[term];
  if(!Array.isArray(definition)||definition.length!==tupleLength||definition[0]!==term||!definition.every(text)||!record(item))fail();
  if(!['starter','deeper','observe','benefit','connection'].every(key=>text(item[key]))||!topics.includes(item.topic)||!figures.includes(item.figure))fail();
  const q=item.question;
  if(!record(q))fail();
  if(q!==undefined){
   if(!record(q)||!['prompt','hint','why'].every(key=>text(q[key]))||!Array.isArray(q.answers)||q.answers.length<2||!q.answers.every(text)||new Set(q.answers).size!==q.answers.length||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.answers.length)fail();
   if(!Array.isArray(q.wrongReasons)||q.wrongReasons.length!==q.answers.length||q.wrongReasons.some((reason,i)=>i!==q.correct&&!text(reason)))fail();
  }
  if(!Array.isArray(item.sources)||!item.sources.length||item.sources.some(s=>!record(s)||!['url','title','anchor'].every(key=>text(s[key]))||!s.url.startsWith('https://')||/\s/.test(s.url)||!day(s.checkedOn)||s.checkedOn!==data.sourceReadOn||(s.updatedOn!==null&&!day(s.updatedOn))))fail();
  for(const [key,target,allowed]of[['relatedWords','term',["Maßstab", "Median", "Meeresspiegel", "Messunsicherheit", "Messwert", "Meter", "Mittelwert", "Skala", "Stichprobe", "Wahrscheinlichkeit"]],['relatedQuestions','question',STATISTICS_QUESTIONS]])if(item[key]!==undefined&&(!Array.isArray(item[key])||item[key].some(link=>!record(link)||!allowed.includes(link[target])||!text(link.reason))||new Set(item[key].map(link=>link[target])).size!==item[key].length))fail();
 }
 return data;
}
