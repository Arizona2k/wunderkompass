import {isRetainedAnswerWordingCorrection} from '../app/retained-answer-wording.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export function challengeIndex(catalog,hints){return catalog.filter(t=>!t.history?.sensitive).flatMap(t=>[{...t.question,id:t.id+':mini',topic:t.id,topicTitle:t.title,difficulty:'easy'},...(t.challenges??[]).map(q=>({...q,topic:t.id,topicTitle:t.title}))]).map(q=>({...q,hints:hints[q.id]?.steps??[]}));}
// Reconstruct only explicitly reviewed prompt/explanation corrections when
// checking an immutable historical bank. Validate the current text first;
// One exact wrong-answer grammar alias is additionally reviewed and migrated;
// solutions, answer positions and every unrecorded value remain protected.
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
export function worldQuestionIndex(check=false){const data=challengeIndex(JSON.parse(fs.readFileSync('app/world-catalog.json','utf8')),JSON.parse(fs.readFileSync('app/challenge-hints.json','utf8'))),file='app/world-question-index.json';if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data))throw Error('Stale world-question index');}else fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');return data;}
export function worldOverview(catalog){return catalog.map(t=>({id:t.id,category:t.category,title:t.title,intro:t.intro,aliases:t.aliases,locations:t.locations,...(t.image!==undefined?{image:t.image}:{}),...(t.model!==undefined?{model:t.model}:{}),...(t.building?.exploration?{buildingKind:t.building.exploration.kind}:{}),...(t.animal?{group:t.animal.group,habitat:t.animal.habitat,continent:t.animal.continent}:{}),...(t.history?{year:t.history.year,era:t.history.era,date:t.history.date,sensitive:t.history.sensitive}:t.invention?{year:t.invention.year,date:t.invention.date,...(t.invention.model?{inventionModel:t.invention.model}:{})}:{}),...(t.person?{field:t.person.field,lifespan:t.person.lifespan}:{})}));}
// Compact wire projections; the canonical catalog remains readable. All fields
// are reconstructed and validated identically, including complete offline assets.
export function worldParts(check=false){
 const catalog=JSON.parse(fs.readFileSync('app/world-catalog.json','utf8'));
 const overview=worldOverview(catalog),overviewFile='app/world-index.json';if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(overviewFile,'utf8')))!==JSON.stringify(overview))throw Error('Stale compact world overview');}else fs.writeFileSync(overviewFile,JSON.stringify(overview,null,2)+'\n');
 const dir='app/world-content-parts';if(!check)fs.mkdirSync(dir,{recursive:true});
 const categories=['animals','history','people','inventions','buildings','science'];
 for(const category of categories){const data=catalog.filter(t=>t.category===category),file=path.join(dir,'world-content-'+category+'.json');
  if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data))throw Error('Stale world-content part: '+category);}
  else fs.writeFileSync(file,JSON.stringify(data)+'\n');
 }
 if(catalog.some(t=>!categories.includes(t.category)))throw Error('Unknown world category');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){worldQuestionIndex(process.argv.includes('--check'));worldParts(process.argv.includes('--check'));}
