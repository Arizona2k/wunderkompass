import {verifiedContentJSON as verifiedBookJSON} from './verified-content.mjs';
export {verifiedContentJSON as verifiedBookJSON,readLimitedBytes as readBookBytes} from './verified-content.mjs';
import WHY_QUESTIONS from './book-why-index.json' with {type:'json'};
import {validateBookData} from './book-validation.mjs';

export async function validateBookPart(bytes,term,expected,topics,knownWords=[]){
 const data=await verifiedBookJSON(bytes,expected);
 if(data?.schemaVersion!==1||data.term!==term)throw Error('Falsche Wortvertiefung');
 validateBookData({schemaVersion:1,words:[[term,'Vertiefung','Geprüfte Identität']],why:[['Identität','Geprüft']],learning:{[term]:data.learning}},{words:[term],why:['Identität'],learning:[term],topics,knownWords,knownQuestions:WHY_QUESTIONS});
 return data.learning;
}
export async function validateBookTopicPayload(bytes,topic,expected,knownWords){
 const data=await verifiedBookJSON(bytes,expected);
 const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!/[<>\u0000-\u0008]/u.test(value);
 if(data?.schemaVersion!==1||data.topic!==topic||!Number.isInteger(expected.wordCount)||!Number.isInteger(expected.questionCount)||expected.wordCount<0||expected.questionCount<0||expected.wordCount+expected.questionCount<1||!Array.isArray(data.links)||data.links.length!==expected.wordCount||data.links.length>1000||new Set(data.links.map(l=>l?.term)).size!==data.links.length||!data.links.every(l=>knownWords.includes(l?.term)&&text(l?.reason))||!Array.isArray(data.questions)||data.questions.length!==expected.questionCount||data.questions.length>1000||new Set(data.questions.map(l=>l?.question)).size!==data.questions.length||!data.questions.every(l=>WHY_QUESTIONS.includes(l?.question)&&text(l?.reason)))throw Error('Beschädigte Buchverbindung');
 return {links:data.links,questions:data.questions};
}
export async function validateBookTopicPart(bytes,topic,expected,knownWords){return (await validateBookTopicPayload(bytes,topic,expected,knownWords)).links;}
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
