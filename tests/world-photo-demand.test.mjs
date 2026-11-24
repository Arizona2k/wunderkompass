import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import http from 'node:http';import {createHash}from'node:crypto';
import {worldPhotoIndex,corePhotoIds} from '../scripts/world-photo-index.mjs';import {verifiedContentJSON,fetchLimitedBytes} from '../app/verified-content.mjs';
const bytes=fs.readFileSync('app/world-photos.json'),photos=JSON.parse(bytes),integrity=JSON.parse(fs.readFileSync('app/world-photo-integrity.json'));
// Pixel size from the first WebP chunk (lossy VP8, lossless VP8L or extended VP8X).
function webpSize(body){
 const chunk=body.toString('ascii',12,16);
 if(chunk==='VP8X')return [1+body.readUIntLE(24,3),1+body.readUIntLE(27,3)];
 if(chunk==='VP8 ')return [body.readUInt16LE(26)&0x3fff,body.readUInt16LE(28)&0x3fff];
 if(chunk==='VP8L'){const bits=body.readUInt32LE(21);return [(bits&0x3fff)+1,((bits>>14)&0x3fff)+1];}
 throw Error('Unknown WebP chunk '+chunk);
}
test('photo projections preserve every canonical immediate credit and the integrity record matches the photo data',()=>{
 worldPhotoIndex(true);const core=JSON.parse(fs.readFileSync('app/world-photo-core.json'));
 assert.deepEqual(Object.keys(core),corePhotoIds);for(const id of corePhotoIds)assert.deepEqual(core[id],photos[id]);
 assert.equal(integrity.bytes,bytes.length);assert.equal(integrity.sha256,createHash('sha256').update(bytes).digest('hex'));
});
// Variantensätze: 320, 640 und 960 px; ein schmaleres Original (Bilder-Strang, mindestbreite_ok) endet bei seiner Breite.
test('every photo is a complete local WebP with credit and true pixel size; every variant set is 320, 640 and up to 960',()=>{
 assert(Object.keys(photos).length>0);
 for(const[id,record]of Object.entries(photos)){
  assert.equal(record.id,id);assert(record.author.trim(),id);assert(record.license.trim(),id);assert(record.alt_de.trim(),id);
  assert.equal(new URL(record.license_url).protocol,'https:');assert.equal(new URL(record.source_page_url).protocol,'https:');
  if(record.variants){
   const widths=record.variants.map(v=>v.width);
   assert.deepEqual(widths.slice(0,2),[320,640],id);assert(widths.length===2||(widths.length===3&&widths[2]>640&&widths[2]<=960),id+' '+widths);
   assert.equal(record.src,record.variants.at(-1).src,id);assert.equal(record.width,record.variants.at(-1).width,id);
  }
  if(record.focus!==undefined)assert.match(record.focus,/^\d{1,3}% \d{1,3}%$/,id);
  for(const{src,width,height}of[record,...(record.variants??[])]){
   assert(src.endsWith('.webp'),src);
   const body=fs.readFileSync('public'+src);
   assert.equal(body.toString('ascii',0,4),'RIFF',src);assert.equal(body.toString('ascii',8,12),'WEBP',src);assert.equal(body.readUInt32LE(4)+8,body.length,'complete RIFF payload '+src);
   const[actualWidth,actualHeight]=webpSize(body);assert.equal(actualWidth,width,src);if(height!==undefined)assert.equal(actualHeight,height,src);
  }
 }
});
test('exact photo integrity rejects changed and incomplete bytes',async()=>{
 assert.deepEqual(await verifiedContentJSON(bytes,integrity),photos);
 const altered=Buffer.from(bytes);altered[20]^=1;await assert.rejects(verifiedContentJSON(altered,integrity),/Veränderte/);
 await assert.rejects(verifiedContentJSON(bytes.subarray(0,-1),integrity),/Unvollständige/);
});
test('bounded native fetch completes chunked responses and stops oversized or broken transports',async()=>{
 let streamingClosed,streamingBytes=0;const closed=new Promise(resolve=>streamingClosed=resolve);
 const server=http.createServer((request,response)=>{
  if(request.url==='/unavailable'){response.writeHead(503).end();return;}
  if(request.url==='/broken'){response.writeHead(200,{'Content-Length':10});response.write('abc');setImmediate(()=>response.destroy());return;}
  response.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
  if(request.url==='/streaming'){
   const timer=setInterval(()=>{streamingBytes+=1024;response.write(Buffer.alloc(1024));},5);
   response.on('close',()=>{clearInterval(timer);streamingClosed();});return;
  }
  if(request.url==='/oversized'){response.write(bytes);response.end('x');return;}
  response.write(bytes.subarray(0,13));setImmediate(()=>response.end(bytes.subarray(13)));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 try{
  assert.deepEqual(await verifiedContentJSON(await fetchLimitedBytes(base+'/',integrity.bytes),integrity),photos);
  await assert.rejects(fetchLimitedBytes(base+'/unavailable',integrity.bytes),/nicht erreichbar/);
  await assert.rejects(fetchLimitedBytes(base+'/oversized',integrity.bytes),/zu groß/);
  await assert.rejects(fetchLimitedBytes(base+'/broken',integrity.bytes));
  await assert.rejects(fetchLimitedBytes(base+'/streaming',1024),/zu groß/);
  await closed;assert.ok(streamingBytes<64*1024,'overflow aborts the actual server transport instead of continuing to download');
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
test('an externally aborted photo fetch cannot return partial data',async()=>{
 let started;const begin=new Promise(resolve=>started=resolve),server=http.createServer((request,response)=>{response.writeHead(200);response.write('a');started();});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const controller=new AbortController(),reason=new Error('synthetic caller cancellation');
 try{
  const pending=fetchLimitedBytes('http://127.0.0.1:'+server.address().port,100,{signal:controller.signal});
  const rejected=assert.rejects(pending);await begin;controller.abort(reason);await rejected;
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
