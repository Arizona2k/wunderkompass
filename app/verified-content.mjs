export async function verifiedContentJSON(bytes,expected){
 if(!expected||bytes.byteLength!==expected.bytes)throw Error('Unvollständige Lerndaten');
 const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
 if(digest!==expected.sha256)throw Error('Veränderte Lerndaten');
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export async function readLimitedBytes(response,maxBytes){
 if(!response.ok||!response.body)throw Error('Wissensdaten nicht erreichbar');
 const reader=response.body.getReader(),chunks=[];let length=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>maxBytes)throw Error('Wissensdaten zu groß');chunks.push(value);}}finally{await reader.cancel();}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return bytes;
}
