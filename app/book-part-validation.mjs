import {validateBookData} from './book-validation.mjs';

export async function verifiedBookJSON(bytes,expected){
 if(!expected||bytes.byteLength!==expected.bytes)throw Error('Unvollständige Wortvertiefung');
 const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
 if(digest!==expected.sha256)throw Error('Veränderte Wortvertiefung');
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export async function validateBookPart(bytes,term,expected,topics,knownWords=[]){
 const data=await verifiedBookJSON(bytes,expected);
 if(data?.schemaVersion!==1||data.term!==term)throw Error('Falsche Wortvertiefung');
 validateBookData({schemaVersion:1,words:[[term,'Vertiefung','Geprüfte Identität']],why:[['Identität','Geprüft']],learning:{[term]:data.learning}},{words:[term],why:['Identität'],learning:[term],topics,knownWords});
 return data.learning;
}
export async function validateBookTopicPart(bytes,topic,expected,knownWords){
 const data=await verifiedBookJSON(bytes,expected);
 const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!/[<>\u0000-\u0008]/u.test(value);
 if(data?.schemaVersion!==1||data.topic!==topic||!Array.isArray(data.links)||!data.links.length||data.links.length>1000||new Set(data.links.map(l=>l?.term)).size!==data.links.length||!data.links.every(l=>knownWords.includes(l?.term)&&text(l?.reason)))throw Error('Beschädigte Buchverbindung');
 return data.links;
}
export async function readBookBytes(response,maxBytes){
 if(!response.ok||!response.body)throw Error('Wissensdaten nicht erreichbar');
 const reader=response.body.getReader(),chunks=[];let length=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>maxBytes)throw Error('Wissensdaten zu groß');chunks.push(value);}}finally{await reader.cancel();}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return bytes;
}

export async function validateBookStudyIndex(bytes,expected,terms,allowedFiles){
 const data=await verifiedBookJSON(bytes,expected);
 if(!data||Array.isArray(data)||JSON.stringify(Object.keys(data))!==JSON.stringify(terms)||new Set(Object.values(data).map(m=>m?.file)).size!==terms.length||!Object.values(data).every(m=>/^book-study-[a-f0-9]{16}\.json$/.test(m?.file)&&allowedFiles.includes(m.file)&&Number.isInteger(m.bytes)&&m.bytes>0&&m.bytes<=8000&&/^[a-f0-9]{64}$/.test(m.sha256)))throw Error('Beschädigter Wortkatalog');
 return data;
}
export async function validateBookSearchPart(bytes,expected){
 const data=await verifiedBookJSON(bytes,expected);
 if(!data||Array.isArray(data)||JSON.stringify(Object.keys(data))!==JSON.stringify(expected.terms)||!Object.values(data).every(s=>typeof s==='string'&&s.length<=100000&&!/[<>\u0000-\u0008]/u.test(s)))throw Error('Unvollständiger Wortsuchteil');
 return data;
}
