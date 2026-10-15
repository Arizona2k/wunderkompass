/* Generated with the exact public files from this release. */
const VERSION = __BUILD__;
const ASSETS = __ASSETS__;
const PREFIX = 'earth-learning-';
const CACHE = PREFIX + VERSION;
const MARKER = '/__learning_offline_ready__';
const assetPaths = new Set(ASSETS);
const compatibleHTML = text => text.includes('name="learning-build"') && text.includes(VERSION);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE);
      // Atomic activation: every code chunk and learning asset must be available.
      // Failure leaves the previous active release untouched.
      await cache.addAll(ASSETS.map(path => new Request(path, { cache: 'reload', credentials: 'omit' })));
      const html = await fetch('/', { cache: 'reload', credentials: 'omit' });
      if (!html.ok || !compatibleHTML(await html.clone().text())) throw new Error('Release changed while preparing');
      await cache.put('/', html);
      await cache.put(MARKER, new Response(VERSION));
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
    const marker = await (await caches.open(CACHE)).match(MARKER);
    event.ports[0]?.postMessage({ version: VERSION, ready: !!marker });
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
