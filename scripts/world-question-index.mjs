import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export function challengeIndex(catalog,hints){return catalog.filter(t=>!t.history?.sensitive).flatMap(t=>[{...t.question,id:t.id+':mini',topic:t.id,topicTitle:t.title,difficulty:'easy'},...(t.challenges??[]).map(q=>({...q,topic:t.id,topicTitle:t.title}))]).map(q=>({...q,hints:hints[q.id]?.steps??[]}));}
export function worldQuestionIndex(check=false){const data=challengeIndex(JSON.parse(fs.readFileSync('app/world-catalog.json','utf8')),JSON.parse(fs.readFileSync('app/challenge-hints.json','utf8'))),file='app/world-question-index.json';if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data))throw Error('Stale world-question index');}else fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');return data;}
export function worldOverview(catalog){return catalog.map(t=>({id:t.id,category:t.category,title:t.title,intro:t.intro,aliases:t.aliases,locations:t.locations,...(t.image!==undefined?{image:t.image}:{}),...(t.model!==undefined?{model:t.model}:{}),...(t.animal?{group:t.animal.group,habitat:t.animal.habitat,continent:t.animal.continent}:{}),...(t.history?{year:t.history.year,era:t.history.era,date:t.history.date,sensitive:t.history.sensitive}:t.invention?{year:t.invention.year,date:t.invention.date,...(t.invention.model?{inventionModel:t.invention.model}:{})}:{}),...(t.person?{field:t.person.field,lifespan:t.person.lifespan}:{})}));}
export function worldParts(check=false){
 const catalog=JSON.parse(fs.readFileSync('app/world-catalog.json','utf8'));
 const overview=worldOverview(catalog),overviewFile='app/world-index.json';if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(overviewFile,'utf8')))!==JSON.stringify(overview))throw Error('Stale compact world overview');}else fs.writeFileSync(overviewFile,JSON.stringify(overview,null,2)+'\n');
 const dir='app/world-content-parts';if(!check)fs.mkdirSync(dir,{recursive:true});
 const categories=['animals','history','people','inventions','buildings','science'];
 for(const category of categories){const data=catalog.filter(t=>t.category===category),file=path.join(dir,'world-content-'+category+'.json');
  if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data))throw Error('Stale world-content part: '+category);}
  else fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 }
 if(catalog.some(t=>!categories.includes(t.category)))throw Error('Unknown world category');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){worldQuestionIndex(process.argv.includes('--check'));worldParts(process.argv.includes('--check'));}
