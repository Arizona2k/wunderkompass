import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {prepareNewsEdition} from './pipeline.mjs';
const json=async file=>JSON.parse(await readFile(new URL('../../'+file,import.meta.url),'utf8'));
const policy=await json('content/news-source-policy.json'),content=await json('app/news-content.json'),topics=await json('app/world-index.json');
const result=await prepareNewsEdition({policy,content,topicIds:topics.map(t=>t.id),now:new Date(),directory:fileURLToPath(new URL('../../work/news-dry-run/',import.meta.url))});
console.log(JSON.stringify({day:result.report.day,targetUTC:result.report.targetUTC,mode:result.report.mode,newlyChecked:result.report.selected.length,retained:result.report.retained.length,candidates:result.report.candidates,awaitingEditorial:result.report.awaitingEditorial,issues:result.report.issues,fingerprint:result.fingerprint,publication:'deactivated'},null,2));
