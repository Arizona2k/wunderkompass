export async function verifiedContentJSON(bytes,expected){
 if(!expected||bytes.byteLength!==expected.bytes)throw Error('Unvollständige Lerndaten');
 const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
 if(digest!==expected.sha256)throw Error('Veränderte Lerndaten');
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export async function fetchLimitedBytes(url,maxBytes,{signal}={}){
 const controller=new AbortController();
 try{
  const response=await fetch(url,{signal:signal?AbortSignal.any([signal,controller.signal]):controller.signal});
  if(!response.ok||!response.body)throw Error('Wissensdaten nicht erreichbar');
  // Consume the original response natively. A separate bounded branch observes
  // every chunk and aborts both consumers before an oversized body can continue.
  const reader=response.clone().body.getReader(),body=response.arrayBuffer();
  void body.catch(()=>{});let length=0,complete=false;
  try{
   for(;;){const {done,value}=await reader.read();if(done){complete=true;break;}length+=value.byteLength;if(length>maxBytes)throw Error('Wissensdaten zu groß');}
   const bytes=new Uint8Array(await body);
   if(bytes.byteLength!==length)throw Error('Unvollständige Lerndaten');
   return bytes;
  }catch(error){controller.abort(error);throw error;}
  finally{if(!complete)void reader.cancel().catch(()=>{});reader.releaseLock();}
 }catch(error){controller.abort(error);throw error;}
}
