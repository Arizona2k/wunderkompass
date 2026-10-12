import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dailyNewsTick} from './schedule.mjs';
import {prepareNewsEdition} from './pipeline.mjs';
const json=async file=>JSON.parse(await readFile(new URL('../../'+file,import.meta.url),'utf8'));
const policy=await json('content/news-source-policy.json'),content=await json('app/news-content.json'),topics=await json('app/world-index.json');
const now=new Date(),directory=fileURLToPath(new URL('../../work/news-daily/',import.meta.url));
const result=await dailyNewsTick({policy,now,directory,run:()=>prepareNewsEdition({policy,content,topicIds:topics.map(t=>t.id),now,directory})});
console.log(JSON.stringify({status:result.status,day:result.day,target:result.target,fingerprint:result.result?.fingerprint,publication:'deactivated'},null,2));
