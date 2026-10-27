export const MEASUREMENT_TERMS=['Meter','Kilogramm','Sekunde','Ampere','Kelvin','Mol','Candela'];
const symbols=['m','kg','s','A','K','mol','cd'];
const text=value=>typeof value==='string'&&value.trim().length>0;
const record=value=>value&&typeof value==='object'&&!Array.isArray(value);
const day=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
export function validateMeasurementPack(data){
 const fail=()=>{throw Error('Incomplete measurement explanations');};
 if(!record(data)||data.schemaVersion!==1||!day(data.sourceReadOn)||!record(data.words)||!record(data.learning))fail();
 if(![data.words,data.learning].every(group=>Object.keys(group).length===MEASUREMENT_TERMS.length&&MEASUREMENT_TERMS.every(term=>Object.hasOwn(group,term))))fail();
 for(const [index,term] of MEASUREMENT_TERMS.entries()){
  const word=data.words[term],item=data.learning[term];
  if(!Array.isArray(word)||word.length!==3||word[0]!==term||!word.every(text)||!record(item)||item.symbol!==symbols[index])fail();
  if(!['quantity','starter','deeper','observe','benefit','topic','connection'].every(key=>text(item[key])))fail();
  if(item.model!==undefined&&!['length','duration','temperature'].includes(item.model))fail();
  if(item.illustration!==undefined&&item.illustration!=='entities')fail();
  const q=item.question;
  if(!record(q)||!['prompt','hint','why'].every(key=>text(q[key]))||!Array.isArray(q.answers)||q.answers.length<2||!q.answers.every(text)||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.answers.length)fail();
  if(!Array.isArray(q.wrongReasons)||q.wrongReasons.length!==q.answers.length||q.wrongReasons.some((reason,i)=>i!==q.correct&&!text(reason)))fail();
  if(!Array.isArray(item.sources)||!item.sources.length||item.sources.some(source=>!record(source)||!['url','title','anchor'].every(key=>text(source[key]))||!source.url.startsWith('https://')||/\s/.test(source.url)||!day(source.checkedOn)||(source.updatedOn!==null&&!day(source.updatedOn))))fail();
  for(const [key,target] of [['relatedWords','term'],['relatedQuestions','question']])if(item[key]!==undefined&&(!Array.isArray(item[key])||item[key].some(link=>!record(link)||!text(link[target])||!text(link.reason))))fail();
 }
 return data;
}
