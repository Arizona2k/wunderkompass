/* Generated with the exact public files from this release. */
const VERSION = __BUILD__;
const ASSETS = __ASSETS__;
const ASSET_META = __ASSET_META__;
const METRICS = '/__learning_offline_metrics__';
const PREFIX = 'earth-learning-';
const CACHE = PREFIX + VERSION;
const MARKER = '/__learning_offline_ready__';
const assetPaths = new Set(ASSETS);
const compatibleHTML = text => text.includes('name="learning-build"') && text.includes(VERSION);

async function verifiedBytes(response,expected){
  if(!response || response.status!==200 || !response.body || !expected)throw Error('Learning asset unavailable');
  const reader=response.body.getReader(),parts=[];let count=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;count+=value.byteLength;if(count>expected.bytes)throw Error('Learning asset exceeds exact size');parts.push(value);}}finally{await reader.cancel();}
  if(count!==expected.bytes)throw Error('Incomplete learning asset');
  const bytes=new Uint8Array(count);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
  if(digest!==expected.sha256)throw Error('Changed learning asset');
  const headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.delete('Transfer-Encoding');headers.set('Content-Length',String(count));
  return new Response(bytes,{status:200,headers});
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const started=performance.now(),metrics={assets:ASSETS.length,reused:0,reusedBytes:0,downloaded:0,downloadedBytes:0};
    try {
      const cache=await caches.open(CACHE),old=[];
      for(const name of(await caches.keys()).filter(n=>n.startsWith(PREFIX)&&n!==CACHE)){
        const candidate=await caches.open(name);if(await candidate.match(MARKER))old.push(candidate);
      }
      let next=0,failed=null;
      // Bound in-flight bodies and writes, not the size of the learning collection.
      // Drain every worker before cleanup so failed installs cannot become ready later.
      const outcomes=await Promise.allSettled(Array.from({length:6},async()=>{
        while(!failed&&next<ASSETS.length){const path=ASSETS[next++],expected=ASSET_META[path];
          try{
            let response=null;
            for(const previous of old){const hit=await previous.match(path);if(hit){try{response=await verifiedBytes(hit,expected);break;}catch{/* Changed or damaged old data must be fetched and verified again. */}}}
            if(response){metrics.reused++;metrics.reusedBytes+=expected.bytes;}
            else{response=await verifiedBytes(await fetch(new Request(path,{cache:'reload',credentials:'omit',redirect:'error'})),expected);metrics.downloaded++;metrics.downloadedBytes+=expected.bytes;}
            await cache.put(path,response);
          }catch(error){failed=error;throw error;}
        }
      }));
      if(failed||outcomes.some(o=>o.status==='rejected'))throw failed??Error('Incomplete offline preparation');
      if(metrics.reused+metrics.downloaded!==ASSETS.length)throw Error('Incomplete offline manifest');
      const html=await fetch('/',{cache:'reload',credentials:'omit',redirect:'error'});
      if(!html.ok||!compatibleHTML(await html.clone().text()))throw Error('Release changed while preparing');
      await cache.put('/',html);
      metrics.seconds=(performance.now()-started)/1000;
      await cache.put(METRICS,new Response(JSON.stringify(metrics),{headers:{'Content-Type':'application/json'}}));
      await cache.put(MARKER,new Response(VERSION));
    } catch (error) {
      await caches.delete(CACHE);
      throw error;
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Keep one previous release so another open tab can finish with its old chunks.
    const names = (await caches.keys()).filter(n => n.startsWith(PREFIX) && n !== CACHE);
    await Promise.all(names.slice(0, Math.max(0, names.length - 1)).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_LEARNING_RELEASE') void self.skipWaiting();
  if (event.data?.type === 'LEARNING_STATUS') event.waitUntil((async () => {
    const cache=await caches.open(CACHE),marker=await cache.match(MARKER),keys=new Set((await cache.keys()).map(request=>new URL(request.url).pathname));
    const ready=!!marker&&(await marker.text())===VERSION&&keys.has('/')&&ASSETS.every(path=>keys.has(path));
    const metrics=await cache.match(METRICS);
    event.ports[0]?.postMessage({version:VERSION,ready,metrics:metrics?await metrics.json():null});
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.search) return;
  if (request.mode === 'navigate' && url.pathname === '/') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        // Do not replace an old release's HTML with a new release's bootstrap.
        if (response.ok && compatibleHTML(await response.clone().text())) await cache.put('/', response.clone());
        if (response.ok) return response;
      } catch {}
      return (await cache.match('/')) ?? new Response('Bitte einmal online öffnen und für offline vorbereiten.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    })());
  } else if (assetPaths.has(url.pathname) || /^\/(assets\/|_next\/static\/).+\.(js|css|woff2?)$/.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE), hit = await cache.match(request);
      if (hit) return hit;
      // Hashed assets from a previously open tab may belong to the retained release.
      if (/^\/(assets\/|_next\/static\/)/.test(url.pathname)) {
        for (const name of (await caches.keys()).filter(n => n.startsWith(PREFIX) && n !== CACHE)) {
          const old = await (await caches.open(name)).match(request);
          if (old) return old;
        }
      }
      return fetch(request);
    })());
  }
});
