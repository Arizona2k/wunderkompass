import {LAB_SEARCH} from '../app/research-catalog.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import book from '../app/book-content.json' with {type:'json'};
import core from '../app/book-core.json' with {type:'json'};
import index from '../app/book-study-index.json' with {type:'json'};
import search from '../app/book-search.json' with {type:'json'};
import integrity from '../app/book-search-integrity.json' with {type:'json'};
import world from '../app/world-index.json' with {type:'json'};
import {validateBookPart,validateBookTopicPart,verifiedBookJSON,readBookBytes,validateBookStudyIndex,validateBookSearchPart} from '../app/book-part-validation.mjs';
import topicIndex from '../app/book-topic-index.json' with {type:'json'};
const topics=world.map(t=>t.id),digest=bytes=>({bytes:bytes.byteLength,sha256:createHash('sha256').update(bytes).digest('hex')});
test('demand parts reconstruct canonical definitions and every enrichment; search preserves deeper, easy, observation and hint text',async()=>{
 assert.deepEqual(core,{schemaVersion:book.schemaVersion,words:book.words,why:book.why});assert.deepEqual(Object.keys(index),Object.keys(book.learning));
 for(const [term,meta] of Object.entries(index)){
  const bytes=fs.readFileSync('app/book-studies/'+meta.file),learning=await validateBookPart(bytes,term,meta,topics,book.words.map(w=>w[0]));assert.deepEqual(learning,book.learning[term]);
  for(const text of [learning.deeper,learning.starter,learning.observe,learning.question.hint])assert.ok(search[term].includes(text));
 }
 assert.deepEqual(await verifiedBookJSON(fs.readFileSync('app/book-search.json'),integrity),search);
 assert.ok(fs.statSync('app/book-core.json').size<fs.statSync('app/book-content.json').size*.7,'actual same-content initial transfer reduction');
});
test('wrong, truncated, changed and structurally invalid word parts fail before display or validation cache',async()=>{
 const meta=index.Meter,bytes=fs.readFileSync('app/book-studies/'+meta.file);
 await assert.rejects(validateBookPart(bytes.subarray(1),'Meter',meta,topics),/Unvollständig/);
 const changed=Buffer.from(bytes);changed[50]^=1;await assert.rejects(validateBookPart(changed,'Meter',meta,topics),/Verändert/);
 await assert.rejects(validateBookPart(bytes,'Kelvin',meta,topics),/Falsche/);
 const partial=JSON.parse(bytes);delete partial.learning.question;const body=Buffer.from(JSON.stringify(partial));await assert.rejects(validateBookPart(body,'Meter',digest(body),topics,book.words.map(w=>w[0])),/Denkfrage/);
 const unknownWord=JSON.parse(bytes);unknownWord.learning.relatedWords[0].term='UnsupportedWord';const wrongTarget=Buffer.from(JSON.stringify(unknownWord));await assert.rejects(validateBookPart(wrongTarget,'Meter',digest(wrongTarget),topics,book.words.map(w=>w[0])),/Wortverbindung/);
 const unknown=JSON.parse(bytes);unknown.learning.topic='untrusted-topic';const bad=Buffer.from(JSON.stringify(unknown));await assert.rejects(validateBookPart(bad,'Meter',digest(bad),topics,book.words.map(w=>w[0])),/Unbekannte/);
});
test('stream reader limits actual bytes despite misleading headers; failures permit a fresh valid response',async()=>{
 const oversized=new Response(new Uint8Array(100),{headers:{'Content-Length':'1'}});await assert.rejects(readBookBytes(oversized,10),/zu groß/);
 await assert.rejects(readBookBytes(new Response('down',{status:503}),10),/nicht erreichbar/);
 assert.deepEqual(await readBookBytes(new Response(new Uint8Array([1,2,3])),3),new Uint8Array([1,2,3]));
});
test('world-to-book parts contain exactly the canonical reciprocal explanations and preserve every valid word pair',async()=>{
 const words=book.words.map(w=>w[0]);
 for(const [topic,meta] of Object.entries(topicIndex)){
  assert.ok(topics.includes(topic)||LAB_SEARCH.some(l=>'lab-'+l.id===topic));assert.match(meta.file,/^book-topic-[a-z][a-z0-9_-]*\.json$/);
  const expected=Object.entries(book.learning).filter(([,l])=>(l.topic??'lab-'+l.lab)===topic).map(([term,l])=>({term,reason:l.connection}));
  assert.deepEqual(await validateBookTopicPart(fs.readFileSync('app/book-topic-parts/'+meta.file),topic,meta,words),expected);
 }
 for(const [term,l] of Object.entries(book.learning))for(const pair of l.relatedWords??[])assert.deepEqual(book.learning[pair.term]?.relatedWords?.find(p=>p.term===term),{term,reason:pair.reason},term+' reciprocal explanation');
});
test('topic parts reject altered bytes, wrong identities, absent/duplicate/unknown words and unsafe explanations',async()=>{
 const [topic,meta]=Object.entries(topicIndex)[0],bytes=fs.readFileSync('app/book-topic-parts/'+meta.file),words=book.words.map(w=>w[0]);
 await assert.rejects(validateBookTopicPart(bytes.subarray(1),topic,meta,words),/Unvollständig/);
 const changed=Buffer.from(bytes);changed[50]^=1;await assert.rejects(validateBookTopicPart(changed,topic,meta,words),/Verändert/);
 for(const mutate of [d=>d.topic='other-topic',d=>d.links=[],d=>d.links.push(d.links[0]),d=>d.links[0].term='UnsupportedWord',d=>d.links[0].reason='<script>',d=>d.links[0].reason='   ',d=>d.links=[null]]){
  const broken=JSON.parse(bytes);mutate(broken);const body=Buffer.from(JSON.stringify(broken));await assert.rejects(validateBookTopicPart(body,topic,{...meta,...digest(body)},words),/Beschädigte/);
 }
});

test('word destinations accept real labs and reject absent, ambiguous or fabricated targets',async()=>{
 const meta=index.Epizentrum,bytes=fs.readFileSync('app/book-studies/'+meta.file),words=book.words.map(w=>w[0]);
 assert.equal((await validateBookPart(bytes,'Epizentrum',meta,topics,words)).lab,'quake');
 for(const mutate of [l=>l.lab='unknown-lab',l=>l.lab='../quake',l=>delete l.lab,l=>l.topic='science-cell']){
  const data=JSON.parse(bytes);mutate(data.learning);const body=Buffer.from(JSON.stringify(data));await assert.rejects(validateBookPart(body,'Epizentrum',digest(body),topics,words),/Wortziel/);
 }
});

test('optional metadata and search parts reproduce every canonical identity and searchable character',async()=>{
 const metadata=JSON.parse(fs.readFileSync('app/book-study-index-integrity.json','utf8')),terms=Object.keys(book.learning),files=Object.values(index).map(m=>m.file);
 assert.deepEqual(await validateBookStudyIndex(fs.readFileSync('app/book-study-index.json'),metadata,terms,files),index);
 const parts=await Promise.all(integrity.parts.map(meta=>validateBookSearchPart(fs.readFileSync('app/book-search-parts/'+meta.file),meta)));
 assert.deepEqual(Object.assign({},...parts),search);assert.deepEqual(integrity.parts.flatMap(p=>p.terms),terms);
 for(const meta of integrity.parts){const b=fs.readFileSync('app/book-search-parts/'+meta.file);assert.ok(meta.bytes<=200000);assert.ok((await import('node:zlib')).gzipSync(b).length<=50000);}
});
test('even correctly hashed incomplete manifests and search parts are rejected before caching',async()=>{
 const terms=Object.keys(book.learning),files=Object.values(index).map(m=>m.file);
 for(const mutate of [x=>delete x.Meter,x=>x.Unknown=x.Meter,x=>x.Meter.file='../escape.json',x=>x.Meter.bytes=8001,x=>x.Meter.sha256='untrusted',x=>x.Kelvin.file=x.Meter.file]){
  const broken=structuredClone(index);mutate(broken);const b=Buffer.from(JSON.stringify(broken));await assert.rejects(validateBookStudyIndex(b,digest(b),terms,files),/Wortkatalog/);
 }
 const meta=integrity.parts[0],original=JSON.parse(fs.readFileSync('app/book-search-parts/'+meta.file,'utf8'));
 for(const mutate of [x=>delete x[meta.terms[0]],x=>x.Unknown='replacement',x=>x[meta.terms[0]]='<script>',x=>x[meta.terms[0]]=null]){
  const broken=structuredClone(original);mutate(broken);const b=Buffer.from(JSON.stringify(broken));await assert.rejects(validateBookSearchPart(b,{...meta,...digest(b)}),/Wortsuchteil/);
 }
});
