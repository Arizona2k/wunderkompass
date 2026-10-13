import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export function challengeIndex(catalog,hints){return catalog.filter(t=>!t.history?.sensitive).flatMap(t=>[{...t.question,id:t.id+':mini',topic:t.id,topicTitle:t.title,difficulty:'easy'},...(t.challenges??[]).map(q=>({...q,topic:t.id,topicTitle:t.title}))]).map(q=>({...q,hints:hints[q.id]?.steps??[]}));}
export function worldQuestionIndex(check=false){const data=challengeIndex(JSON.parse(fs.readFileSync('app/world-catalog.json','utf8')),JSON.parse(fs.readFileSync('app/challenge-hints.json','utf8'))),file='app/world-question-index.json';if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data))throw Error('Stale world-question index');}else fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');return data;}
export function worldParts(check=false){
 const catalog=JSON.parse(fs.readFileSync('app/world-catalog.json','utf8'));
 const dir='app/world-content-parts';if(!check)fs.mkdirSync(dir,{recursive:true});
 const categories=['animals','history','people','inventions','buildings','science'];
 for(const category of categories){const data=catalog.filter(t=>t.category===category),file=path.join(dir,'world-content-'+category+'.json');
  if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data))throw Error('Stale world-content part: '+category);}
  else fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 }
 if(catalog.some(t=>!categories.includes(t.category)))throw Error('Unknown world category');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){worldQuestionIndex(process.argv.includes('--check'));worldParts(process.argv.includes('--check'));}
