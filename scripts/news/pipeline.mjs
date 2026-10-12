import {fetchSource,discoverArticles,observeClaims,runNews,saveDraft} from './engine.mjs';
/** Connected daily preparation; never activates publishing or starts a timer. */
export async function prepareNewsEdition({policy,content,topicIds,directory,now=new Date(),fetchImpl=fetch,wait}){
 const fetchOptions={fetchImpl,...(wait?{wait}:{})};
 const result=await runNews({policy,briefs:content.entries,previous:content.entries,topicIds,now,
  loadDiscovery:async source=>{const fetched=await fetchSource(source.url,policy,fetchOptions);return discoverArticles(fetched.document,policy,source.url);},
  loadObservation:async(source,brief)=>observeClaims(await fetchSource(source.url,policy,fetchOptions),source,brief),
 });
 await saveDraft(directory,result);return result;
}
