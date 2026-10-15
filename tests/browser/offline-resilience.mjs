import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';

// Isolated real-app server: only this fixture can fail an asset or emulate quota.
export async function offlineResilience(browser,{port=4776,shots,kind=browser.browserType().name()}={}){
 const shotName=kind==='chromium'?'offline-resilience-'+kind:'journey-engine-'+kind+'-offline-resilience';
 const worker=await fs.readFile('dist/learning-worker.js','utf8'),assets=JSON.parse(worker.match(/const ASSETS = (\[[^;]+\]);/)[1]);let fail=true,failedRequests=0;
 const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname);if(name.includes('..')||url.search)throw Error('Invalid fixture URL');if(fail&&/book-study-why-.*\.json$/.test(name)){failedRequests++;res.writeHead(503).end('Synthetic source failure');return;}const file=path.resolve('dist',name==='/'?'index.html':'.'+name);if(!file.startsWith(path.resolve('dist')+path.sep))throw Error('Invalid fixture path');const data=await fs.readFile(file),type=file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.webp')?'image/webp':'application/octet-stream';res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','Content-Length':data.length}).end(data);}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));const base='http://127.0.0.1:'+port,context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(20000);let cdp;const report={kind,networkRecovery:false,quotaRecovery:null,completeAssets:false,offlineReload:false,passPreserved:false,assetCount:assets.length};
 const snapshot=()=>page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress;return{favorites:p.favorites,settings:p.settings,gameSessions:p.gameSessions};});
 const noPartial=async()=>assert.deepEqual(await page.evaluate(async()=>(await caches.keys()).filter(n=>n.startsWith('earth-learning-'))),[],'no partial release survives');
 try{
  await page.goto(base+'/#world/topic/animal-polar-bear');await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await page.getByRole('button',{name:'Das interessiert mich!',exact:true}).click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites.includes('topic:animal-polar-bear'));const saved=await snapshot();
  await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await page.locator('.offline-message').filter({hasText:/nicht|geklappt/}).waitFor();if(shots)await page.locator('.offline-learning').screenshot({path:shots+'/'+shotName+'-source-error-320.png'});assert.ok(failedRequests>0,'actual service-worker asset request failed');await noPartial();assert.deepEqual(await snapshot(),saved);
  fail=false;
  if(kind==='chromium'){
   cdp=await context.newCDPSession(page);await cdp.send('Storage.overrideQuotaForOrigin',{origin:base,quotaSize:1024*1024});await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await page.locator('.offline-message').filter({hasText:/nicht|geklappt/}).waitFor();await noPartial();assert.deepEqual(await snapshot(),saved);if(shots)await page.locator('.offline-learning').screenshot({path:shots+'/'+shotName+'-quota-error-320.png'});report.quotaRecovery=true;await cdp.send('Storage.overrideQuotaForOrigin',{origin:base});
  }
  await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await page.getByText('Deine Lernwelt ist offline vorbereitet.',{exact:true}).waitFor({timeout:45000});await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const cached=await page.evaluate(async()=>{const name=(await caches.keys()).find(n=>n.startsWith('earth-learning-')),c=await caches.open(name);return{paths:(await c.keys()).map(r=>new URL(r.url).pathname),metrics:await(await c.match('/__learning_offline_metrics__')).json()};});
  for(const asset of assets)assert.ok(cached.paths.includes(asset),'every offline asset '+asset);assert.equal(cached.metrics.downloaded+cached.metrics.reused,assets.length);report.networkRecovery=true;report.completeAssets=true;report.metrics=cached.metrics;
  assert.deepEqual(await snapshot(),saved);report.passPreserved=true;
  await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
  await assert.rejects(fetch(base+'/',{signal:AbortSignal.timeout(2000)}),'fixture server is really unreachable before the offline reload');report.serverStopped=true;
  await page.reload();await page.locator('.world-mini-question').waitFor();await page.getByRole('button',{name:'In deinem Forscherbuch',exact:true}).waitFor();report.offlineReload=true;
  if(shots)await page.locator('.offline-learning').screenshot({path:shots+'/'+shotName+'-320.png'});
  return report;
 }catch(error){
  if(shots){await fs.writeFile(path.join(shots,shotName+'-failure.json'),JSON.stringify({...report,status:'failed',failure:error.stack},null,2));await page.screenshot({path:path.join(shots,shotName+'-failure-320.png'),animations:'disabled',timeout:5000}).catch(()=>{});}
  throw error;
 }finally{if(cdp)await cdp.detach();await context.close();await new Promise(resolve=>server.close(resolve));}
}
