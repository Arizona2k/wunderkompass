import {verifiedContentJSON} from './verified-content.mjs';
const text=v=>typeof v==='string'&&v.trim().length>0&&v.length<=20000&&!/[<>\u0000-\u0008]/u.test(v);
const day=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const https=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password&&!!u.hostname;}catch{return false;}};
export function validateNatureLearning(l,{words,topics,labs}){
 if(!l||!['starter','deeper','observe','benefit'].every(k=>text(l[k])))throw Error('Unvollständige Naturerklärung');
 const c=l.connection,known={word:words,topic:topics,lab:labs};
 if(!c||!known[c.kind]?.includes(c.target)||!text(c.reason))throw Error('Unbekannte Naturverbindung');
 const q=l.question;
 if(!q||!text(q.prompt)||!text(q.hint)||!text(q.why)||!Array.isArray(q.answers)||q.answers.length!==3||new Set(q.answers).size!==3||!q.answers.every(text)||!Number.isInteger(q.correct)||q.correct<0||q.correct>2||!Array.isArray(q.wrongReasons)||q.wrongReasons.length!==3||!q.wrongReasons.every((v,i)=>i===q.correct?v===null:text(v)))throw Error('Unvollständige Naturfrage');
 if(!Array.isArray(l.sources)||!l.sources.length||l.sources.length>8||!l.sources.every(s=>text(s.title)&&https(s.url)&&text(s.anchor)&&text(s.scope)&&day(s.checkedOn)&&(s.updatedOn===null||day(s.updatedOn))))throw Error('Fehlender Naturquellennachweis');
 if(l.mapPoint&&(!https(l.mapPoint.source)||!text(l.mapPoint.scope)||!text(l.mapPoint.license)||!day(l.mapPoint.checkedOn)))throw Error('Fehlender Ortsnachweis');
 return l;
}
export async function validateNaturePart(bytes,id,meta,known){const data=await verifiedContentJSON(bytes,meta);if(data?.schemaVersion!==1||data.id!==id)throw Error('Falscher Naturort');return validateNatureLearning(data.learning,known);}
export async function validateNatureIndex(bytes,expected,ids,files){
 const data=await verifiedContentJSON(bytes,expected);
 if(!data||Array.isArray(data)||JSON.stringify(Object.keys(data))!==JSON.stringify(ids)||new Set(Object.values(data).map(m=>m?.file)).size!==ids.length||!Object.values(data).every(m=>/^nature-study-[a-f0-9]{16}\.json$/.test(m?.file)&&files.includes(m.file)&&Number.isInteger(m.bytes)&&m.bytes>0&&m.bytes<=8000&&/^[a-f0-9]{64}$/.test(m.sha256)))throw Error('Beschädigter Naturkatalog');
 return data;
}
export async function validateNatureSearch(bytes,expected,ids){
 const data=await verifiedContentJSON(bytes,expected);
 if(!data||Array.isArray(data)||JSON.stringify(Object.keys(data))!==JSON.stringify(ids)||!Object.values(data).every(v=>text(v)))throw Error('Unvollständige Natursuche');
 return data;
}
