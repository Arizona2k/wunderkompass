import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash}from'node:crypto';
import {worldPhotoIndex,corePhotoIds} from '../scripts/world-photo-index.mjs';import {verifiedContentJSON,readLimitedBytes} from '../app/verified-content.mjs';
const bytes=fs.readFileSync('app/world-photos.json'),photos=JSON.parse(bytes),integrity=JSON.parse(fs.readFileSync('app/world-photo-integrity.json'));
test('photo projections preserve every canonical immediate credit and all49 identities',()=>{
 worldPhotoIndex(true);const core=JSON.parse(fs.readFileSync('app/world-photo-core.json'));
 assert.deepEqual(Object.keys(core),corePhotoIds);for(const id of corePhotoIds)assert.deepEqual(core[id],photos[id]);
 assert.deepEqual(JSON.parse(fs.readFileSync('app/world-photo-ids.json')),Object.keys(photos));assert.equal(Object.keys(photos).length,49);
 assert.equal(integrity.bytes,bytes.length);assert.equal(integrity.sha256,createHash('sha256').update(bytes).digest('hex'));
});
test('shared bounded byte reader verifies exact photo payload and rejects altered, short, oversized and unsuccessful data',async()=>{
 assert.deepEqual(await verifiedContentJSON(await readLimitedBytes(new Response(bytes),integrity.bytes),integrity),photos);
 const altered=Buffer.from(bytes);altered[20]^=1;await assert.rejects(verifiedContentJSON(altered,integrity),/Veränderte/);
 await assert.rejects(verifiedContentJSON(bytes.subarray(0,-1),integrity),/Unvollständige/);
 await assert.rejects(readLimitedBytes(new Response(Buffer.concat([bytes,Buffer.from('x')])),integrity.bytes),/zu groß/);
 await assert.rejects(readLimitedBytes(new Response('',{status:503}),integrity.bytes),/nicht erreichbar/);
});
