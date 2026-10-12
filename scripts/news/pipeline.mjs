import {fetchSource,discoverArticles,observeClaims,runNews,saveDraft} from './engine.mjs';
import {prepareAutomaticEdition} from './automatic.mjs';
/** Connected daily preparation; never activates publishing or starts a timer. */
export async function prepareNewsEdition({policy,content,topicIds,directory,now=new Date(),fetchImpl=fetch,wait}){
 if(policy.autonomousGenerationEnabled)return prepareAutomaticEdition({policy,content,topicIds,directory,now,fetchImpl,wait});
 const fetchOptions={fetchImpl,...(wait?{wait}:{})};
 // Reuse one bounded observation per URL in this run; failed reads stay failed.
 const reads=new Map();const read=url=>{if(!reads.has(url))reads.set(url,fetchSource(url,policy,fetchOptions));return reads.get(url);};
 const result=await runNews({policy,briefs:content.entries,previous:content.entries,topicIds,now,
  loadDiscovery:async source=>{const fetched=await read(source.url);return discoverArticles(fetched.document,policy,source.url);},
  loadObservation:async(source,brief)=>observeClaims(await read(source.url),source,brief),
 });
 await saveDraft(directory,result);return result;
}
