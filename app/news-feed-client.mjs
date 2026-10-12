import {verifyEnvelope} from './news-wire.mjs';

export async function fetchEdition(endpoint,validation,{fetchImpl=fetch,maxBytes=1048576,timeoutMs=8000}={}){
 const response=await fetchImpl(endpoint,{redirect:'error',credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(timeoutMs),headers:{Accept:'application/json'}});
 if(!response.ok){const error=Error('Nachrichtenausgabe nicht erreichbar');error.status=response.status;throw error;}
 if(!/^application\/json\b/i.test(response.headers.get('content-type')??''))throw Error('Nachrichtenausgabe nicht erreichbar');
 if(response.url&&response.url!==endpoint)throw Error('News-Feed wurde umgeleitet');
 return verifyEnvelope(await readBoundedJSON(response,maxBytes),validation);
}
export async function readBoundedJSON(response,maxBytes){
 if(Number(response.headers.get('content-length'))>maxBytes)throw Error('News-Feed zu groß');
 let bytes=0,text='';const decoder=new TextDecoder(),reader=response.body.getReader();
 try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>maxBytes)throw Error('News-Feed zu groß');text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
 return JSON.parse(text);
}
export function feedURL(endpoint){
 const url=new URL(endpoint);if(url.protocol!=='https:'||url.username||url.password||url.port||!/^[a-z0-9-]+\.github\.io$/.test(url.hostname)||!url.pathname.endsWith('/latest.json')||url.search||url.hash)throw Error('Kein freigegebener statischer News-Feed');return url.href;
}
