import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {fetchSource,runNews,saveDraft,observeClaims,discoverArticles} from './engine.mjs';
const json=async file=>JSON.parse(await readFile(new URL('../../'+file,import.meta.url),'utf8'));
const policy=await json('content/news-source-policy.json'),content=await json('app/news-content.json'),topics=await json('app/world-index.json');
const now=new Date();
const result=await runNews({policy,briefs:content.entries,previous:content.entries,topicIds:topics.map(t=>t.id),now,loadDiscovery:async source=>{const fetched=await fetchSource(source.url,policy);return discoverArticles(fetched.document,policy,source.url);},loadObservation:async(source,brief)=>{
 const fetched=await fetchSource(source.url,policy);
 // Future discoveries have no fabricated editorial claims. They stay pending
 // until a reviewer creates a sourced brief and verifies each supported claim.
 return observeClaims(fetched,source,brief);
}});
const fingerprint=await saveDraft(fileURLToPath(new URL('../../work/news-dry-run/',import.meta.url)),result);
console.log(JSON.stringify({day:result.report.day,targetUTC:result.report.targetUTC,mode:result.report.mode,newlyChecked:result.report.selected.length,retained:result.report.retained.length,issues:result.report.issues,fingerprint,publication:'deactivated'},null,2));
