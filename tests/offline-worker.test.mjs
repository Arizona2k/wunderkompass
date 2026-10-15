import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {createHash,webcrypto}from'node:crypto';
const template=fs.readFileSync('build/learning-worker.js','utf8'),origin='https://offline.example',marker='/__learning_offline_ready__',prefix='earth-learning-';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function fixture({failure=null,old=true}={}){
 const bodies={'/assets/shared.js':'same original','/assets/changed.js':'changed fresh','/new.json':'new explanation'},assets=Object.keys(bodies),meta=Object.fromEntries(assets.map(p=>[p,{bytes:Buffer.byteLength(bodies[p]),sha256:hash(bodies[p])}])),stores=new Map(),listeners=new Map(),requests=[];let active=0,peak=0,puts=0;
 const oldName=prefix+'old',newName=prefix+'new';const key=p=>new URL(typeof p==='string'?p:p.url,origin).href;
 const cache=name=>({async match(p){return stores.get(name)?.get(key(p))?.clone();},async put(p,response){if(name===newName&&failure==='quota'&&++puts===2)throw new DOMException('Synthetic disk quota failure','QuotaExceededError');stores.get(name).set(key(p),response.clone());},async keys(){return [...stores.get(name).keys()].map(p=>new Request(p));}});
 const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());return cache(name);},async keys(){return [...stores.keys()];},async delete(name){return stores.delete(name);}};
 if(old){const c=await caches.open(oldName);await c.put('/assets/shared.js',new Response(bodies['/assets/shared.js']));await c.put('/assets/changed.js',new Response('old different'));await c.put('/assets/old-hash.js',new Response('old tab chunk'));await c.put('/',new Response('<meta name="learning-build" content="old">'));await c.put(marker,new Response('old'));}
 const fetch=async request=>{const p=new URL(typeof request==='string'?request:request.url,origin).pathname;requests.push({path:p,redirect:typeof request==='string'?null:request.redirect});active++;peak=Math.max(peak,active);try{await new Promise(r=>setTimeout(r,2));if(p==='/')return new Response('<meta name="learning-build" content="'+(failure==='html'?'other':'new')+'">');let body=bodies[p];if(p==='/new.json'){if(failure==='network')throw Error('Synthetic offline');if(failure==='http')return new Response('Unavailable',{status:503});if(failure==='tamper')body='x'.repeat(body.length);if(failure==='oversize')body+='!';if(failure==='short')body=body.slice(1);}return new Response(body,{headers:{'Content-Type':'application/json','Content-Length':String(meta[p].bytes)}});}finally{active--;}};
 class RelativeRequest extends Request{constructor(input,options){super(typeof input==='string'?new URL(input,origin):input,options);}}
 const self={location:{origin},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(type,callback)=>listeners.set(type,callback)};
 const source=template.replace('__BUILD__',JSON.stringify('new')).replace('__ASSETS__',JSON.stringify(assets)).replace('__ASSET_META__',JSON.stringify(meta));
 vm.runInNewContext(source,{self,caches,fetch,crypto:webcrypto,Request:RelativeRequest,Response,Headers,URL,performance,console});
 const install=()=>{let promise;listeners.get('install')({waitUntil:p=>promise=p});return promise;};
 const status=async()=>{let promise,result;listeners.get('message')({data:{type:'LEARNING_STATUS'},ports:[{postMessage:r=>result=r}],waitUntil:p=>promise=p});await promise;return result;};
 return {install,status,stores,requests,assets,oldName,newName,get peak(){return peak;},async oldTabChunk(){let response;listeners.get('fetch')({request:new Request(origin+'/assets/old-hash.js'),respondWith:p=>response=p});return(await response).text();}};
}
test('incremental worker verifies and reuses only identical cached bodies; all assets remain complete and old tab chunks survive',async()=>{
 const f=await fixture();await f.install();const status=await f.status();assert.equal(status.ready,true);assert.equal(status.metrics.assets,3);assert.equal(status.metrics.reused,1);assert.equal(status.metrics.downloaded,2);assert.ok(status.metrics.reusedBytes>0);assert.deepEqual(f.requests.map(r=>r.path).sort(),['/','/assets/changed.js','/new.json']);assert.ok(f.requests.filter(r=>r.path!=='/').every(r=>r.redirect==='error'));assert.ok(f.peak<=6);assert.ok(f.stores.has(f.oldName));assert.equal(await f.oldTabChunk(),'old tab chunk');
 f.stores.get(f.newName).delete(origin+'/assets/shared.js');assert.equal((await f.status()).ready,false,'a leftover marker cannot hide an incomplete cache');
});
test('first preparation fetches every declared asset and only marks ready after exact bytes/hash verification',async()=>{
 const f=await fixture({old:false});await f.install();const status=await f.status();assert.equal(status.ready,true);assert.equal(status.metrics.reused,0);assert.equal(status.metrics.downloaded,f.assets.length);assert.equal(f.requests.length,f.assets.length+1);
});
for(const failure of ['network','http','tamper','oversize','short','quota','html'])test('failed offline '+failure+' drains writes, removes only the partial new release and keeps the old complete cache',async()=>{
 const f=await fixture({failure});const before=[...f.stores.get(f.oldName).keys()];await assert.rejects(f.install());assert.equal(f.stores.has(f.newName),false);assert.deepEqual([...f.stores.get(f.oldName).keys()],before);await new Promise(r=>setTimeout(r,8));assert.equal(f.stores.has(f.newName),false,'no late worker recreates a false ready release');assert.equal(await f.oldTabChunk(),'old tab chunk');
});
