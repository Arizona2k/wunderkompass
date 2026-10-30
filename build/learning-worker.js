/* Generated with the exact public files from this release. */
const VERSION = __BUILD__;
const ASSETS = __ASSETS__;
const ASSET_META = __ASSET_META__;
const METRICS = '/__learning_offline_metrics__';
const PREFIX = 'earth-learning-';
const CACHE = PREFIX + VERSION;
const MARKER = '/__learning_offline_ready__';
const assetPaths = new Set(ASSETS);
const preparation={verified:0,total:ASSETS.length,phase:'files'};
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
            preparation.verified++;
          }catch(error){failed=error;throw error;}
        }
      }));
      if(failed||outcomes.some(o=>o.status==='rejected'))throw failed??Error('Incomplete offline preparation');
      if(metrics.reused+metrics.downloaded!==ASSETS.length)throw Error('Incomplete offline manifest');
      preparation.phase='checking';
      const html=await fetch('/',{cache:'reload',credentials:'omit',redirect:'error'});
      if(!html.ok||!compatibleHTML(await html.clone().text()))throw Error('Release changed while preparing');
      await cache.put('/',html);
      metrics.seconds=(performance.now()-started)/1000;
      metrics.completedAt=Date.now();
      await cache.put(METRICS,new Response(JSON.stringify(metrics),{headers:{'Content-Type':'application/json'}}));
      await cache.put(MARKER,new Response(VERSION));
      preparation.phase='complete';
    } catch (error) {
      preparation.phase='failed';
      await caches.delete(CACHE);
      throw error;
    }
  })());
});

async function completeRelease(name){
  const cache=await caches.open(name),marker=await cache.match(MARKER),html=await cache.match('/');
  const version=name.slice(PREFIX.length);
  if(!marker||(await marker.text())!==version||!html||!(await html.text()).includes('name="learning-build" content="'+version+'"'))return null;
  const record=await cache.match(METRICS);let metrics=null;
  if(record){try{metrics=await record.json();}catch{return null;}
    const assetCount=(await cache.keys()).filter(r=>![MARKER,METRICS,'/'].includes(new URL(r.url).pathname)).length;
    if(!Number.isInteger(metrics.assets)||metrics.assets<1||assetCount<metrics.assets)return null;
  }
  return {name,version,completedAt:Number.isFinite(metrics?.completedAt)?metrics.completedAt:0};
}

function clientRelease(client){
  return new Promise(resolve=>{
    const channel=new MessageChannel();let done=false;
    const finish=value=>{if(done)return;done=true;clearTimeout(timer);channel.port1.close();channel.port2.close();resolve(typeof value==='string'&&/^[a-zA-Z0-9-]+$/.test(value)?value:null);};
    const timer=setTimeout(()=>finish(null),1300);
    channel.port1.onmessage=event=>finish(event.data?.version);
    try{client.postMessage({type:'LEARNING_QUERY_VERSION'},[channel.port2]);}catch{finish(null);}
  });
}

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Creation order alone can retain an unfinished install and delete rollback.
    // Keep the newest complete fallback AND every known open-tab release.
    // Old tabs without the handshake conservatively protect all complete releases.
    if(!(await completeRelease(CACHE)))throw Error('Cannot activate an incomplete learning release');
    const names = (await caches.keys()).filter(n => n.startsWith(PREFIX) && n !== CACHE);
    const releases=(await Promise.all(names.map(completeRelease))).filter(Boolean);
    const versions=await Promise.all((await self.clients.matchAll({type:'window',includeUncontrolled:true})).map(clientRelease));
    const newest=[...releases].sort((a,b)=>a.completedAt-b.completedAt).at(-1);
    const keep=new Set(releases.filter(r=>versions.includes(null)||versions.includes(r.version)||r.name===newest?.name).map(r=>r.name));
    await Promise.all(names.filter(n=>!keep.has(n)).map(n=>caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if(event.data?.type==='LEARNING_PROGRESS')event.ports[0]?.postMessage({...preparation});
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
