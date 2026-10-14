import {validateBookData} from './book-validation.mjs';

export async function verifiedBookJSON(bytes,expected){
 if(!expected||bytes.byteLength!==expected.bytes)throw Error('Unvollständige Wortvertiefung');
 const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
 if(digest!==expected.sha256)throw Error('Veränderte Wortvertiefung');
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export async function validateBookPart(bytes,term,expected,topics){
 const data=await verifiedBookJSON(bytes,expected);
 if(data?.schemaVersion!==1||data.term!==term)throw Error('Falsche Wortvertiefung');
 validateBookData({schemaVersion:1,words:[[term,'Vertiefung','Geprüfte Identität']],why:[['Identität','Geprüft']],learning:{[term]:data.learning}},{words:[term],why:['Identität'],learning:[term],topics});
 return data.learning;
}
export async function readBookBytes(response,maxBytes){
 if(!response.ok||!response.body)throw Error('Wissensdaten nicht erreichbar');
 const reader=response.body.getReader(),chunks=[];let length=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>maxBytes)throw Error('Wissensdaten zu groß');chunks.push(value);}}finally{await reader.cancel();}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return bytes;
}
