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
import {validateBookPart,verifiedBookJSON,readBookBytes} from '../app/book-part-validation.mjs';
const topics=world.map(t=>t.id),digest=bytes=>({bytes:bytes.byteLength,sha256:createHash('sha256').update(bytes).digest('hex')});
test('demand parts reconstruct canonical definitions and every enrichment; search preserves deeper, easy, observation and hint text',async()=>{
 assert.deepEqual(core,{schemaVersion:book.schemaVersion,words:book.words,why:book.why});assert.deepEqual(Object.keys(index),Object.keys(book.learning));
 for(const [term,meta] of Object.entries(index)){
  const bytes=fs.readFileSync('app/book-studies/'+meta.file),learning=await validateBookPart(bytes,term,meta,topics);assert.deepEqual(learning,book.learning[term]);
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
 const partial=JSON.parse(bytes);delete partial.learning.question;const body=Buffer.from(JSON.stringify(partial));await assert.rejects(validateBookPart(body,'Meter',digest(body),topics),/Denkfrage/);
 const unknown=JSON.parse(bytes);unknown.learning.topic='untrusted-topic';const bad=Buffer.from(JSON.stringify(unknown));await assert.rejects(validateBookPart(bad,'Meter',digest(bad),topics),/Unbekannte/);
});
test('stream reader limits actual bytes despite misleading headers; failures permit a fresh valid response',async()=>{
 const oversized=new Response(new Uint8Array(100),{headers:{'Content-Length':'1'}});await assert.rejects(readBookBytes(oversized,10),/zu groß/);
 await assert.rejects(readBookBytes(new Response('down',{status:503}),10),/nicht erreichbar/);
 assert.deepEqual(await readBookBytes(new Response(new Uint8Array([1,2,3])),3),new Uint8Array([1,2,3]));
});
