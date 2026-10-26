import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import http from 'node:http';import {createHash}from'node:crypto';
import {worldPhotoIndex,corePhotoIds} from '../scripts/world-photo-index.mjs';import {verifiedContentJSON,fetchLimitedBytes} from '../app/verified-content.mjs';
const bytes=fs.readFileSync('app/world-photos.json'),photos=JSON.parse(bytes),integrity=JSON.parse(fs.readFileSync('app/world-photo-integrity.json'));
test('photo projections preserve every canonical immediate credit and all49 identities',()=>{
 worldPhotoIndex(true);const core=JSON.parse(fs.readFileSync('app/world-photo-core.json'));
 assert.deepEqual(Object.keys(core),corePhotoIds);for(const id of corePhotoIds)assert.deepEqual(core[id],photos[id]);
 assert.deepEqual(JSON.parse(fs.readFileSync('app/world-photo-ids.json')),Object.keys(photos));assert.equal(Object.keys(photos).length,49);
 assert.equal(integrity.bytes,bytes.length);assert.equal(integrity.sha256,createHash('sha256').update(bytes).digest('hex'));
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
