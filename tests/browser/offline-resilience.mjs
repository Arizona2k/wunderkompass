import {scienceOriginalView} from './science-originals.mjs';
import {buildingOriginalSourceView} from './building-originals.mjs';
import {mechanicsSourceView} from './invention-mechanics.mjs';
import {peopleSourceView} from './people-learning.mjs';
import {worldGameOfflineSemantics} from './world-game-offline-semantics.mjs';
import {bookNormalizationView} from './book-normalization.mjs';
import {learningTaskOfflineSemantics} from './learning-task-offline.mjs';
import {electricalSourceView} from './invention-electrical.mjs';
import {opticsSourceView} from './invention-optics.mjs';
import {historySourceView} from './history-learning.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';
import {captureNativeViewport} from './native-screenshot.mjs';
import {stopTestServer} from './stop-test-server.mjs';

// Isolated real-app server: only this fixture can fail an asset or emulate quota.
export async function offlineResilience(browser,{port=4776,shots,kind=browser.browserType().name(),context:providedContext=null,native=false}={}){
 const shotName=native?'offline-resilience-native':kind==='chromium'?'offline-resilience-'+kind:'journey-engine-'+kind+'-offline-resilience';
 const worker=await fs.readFile('dist/learning-worker.js','utf8'),assets=JSON.parse(worker.match(/const ASSETS = (\[[^;]+\]);/)[1]);const guardedAsset=assets.find(p=>/^\/assets\/journey-inquiries-.*\.json$/.test(p));assert.ok(guardedAsset,'required actual journey asset');let fail=true,failedRequests=0,hold=false,releaseHold;const held=new Promise(resolve=>releaseHold=resolve);
 const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname);if(name.includes('..')||url.search)throw Error('Invalid fixture URL');if(fail&&name===guardedAsset){failedRequests++;res.writeHead(503).end('Synthetic source failure');return;}if(hold&&name===guardedAsset)await held;const file=path.resolve('dist',name==='/'?'index.html':'.'+name);if(!file.startsWith(path.resolve('dist')+path.sep))throw Error('Invalid fixture path');const data=await fs.readFile(file),type=file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.webp')?'image/webp':'application/octet-stream';res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','Content-Length':data.length}).end(data);}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));const base='http://127.0.0.1:'+port,context=providedContext??await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(20000);let cdp;const report={kind,networkRecovery:false,quotaRecovery:null,completeAssets:false,offlineReload:false,passPreserved:false,assetCount:assets.length};
 const snapshot=()=>page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress;return p;});
 const noPartial=async()=>assert.deepEqual(await page.evaluate(async()=>(await caches.keys()).filter(n=>n.startsWith('earth-learning-'))),[],'no partial release survives');
 try{
  await page.goto(base+'/#world/topic/animal-polar-bear');await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await page.getByRole('button',{name:'Das interessiert mich!',exact:true}).click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites.includes('topic:animal-polar-bear'));const saved=await snapshot();
  await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await page.locator('.offline-message').filter({hasText:/nicht|geklappt/}).waitFor();if(shots)await page.locator('.offline-learning').screenshot({path:shots+'/'+shotName+'-source-error-320.png'});assert.ok(failedRequests>0,'actual service-worker asset request failed');await noPartial();assert.deepEqual(await snapshot(),saved);
  fail=false;
  if(kind==='chromium'){
   cdp=await context.newCDPSession(page);await cdp.send('Storage.overrideQuotaForOrigin',{origin:base,quotaSize:1024*1024});await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await page.locator('.offline-message').filter({hasText:/nicht|geklappt/}).waitFor();await noPartial();assert.deepEqual(await snapshot(),saved);if(shots)await page.locator('.offline-learning').screenshot({path:shots+'/'+shotName+'-quota-error-320.png'});report.quotaRecovery=true;await cdp.send('Storage.overrideQuotaForOrigin',{origin:base});
  }
  hold=true;await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();const progress=page.getByRole('progressbar',{name:'Sicher gespeicherte Lernwelt-Dateien',exact:true});await progress.waitFor();await page.waitForFunction(()=>{const el=document.querySelector('progress[aria-label="Sicher gespeicherte Lernwelt-Dateien"]');return el&&el.value>0&&el.value<el.max;});const counts=await progress.evaluate(el=>({verified:el.value,total:el.max}));assert.equal(counts.total,assets.length);assert.ok(counts.verified>0&&counts.verified<counts.total,'held required asset cannot be reported as verified');assert.equal(await page.getByText('Deine Lernwelt ist offline vorbereitet.',{exact:true}).count(),0);report.progressViews=[];
  for(const width of (native?[640]:[320,360,390,768,1024,1440,1920])){
   await page.setViewportSize({width:width*(native?2:1),height:900});await page.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));
   const measured=await page.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));assert.equal(measured.cssWidth,width);if(native)assert.equal(measured.scale,2);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'offline progress has no horizontal overflow '+width);
   const aside=page.locator('.offline-learning');assert.ok(await aside.isVisible());assert.ok(await aside.getByRole('progressbar',{name:'Sicher gespeicherte Lernwelt-Dateien',exact:true}).isVisible());
   const value=await progress.evaluate(e=>({verified:e.value,total:e.max}));assert.ok(value.verified>0&&value.verified<value.total);assert.equal(value.total,assets.length);
   await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await page.evaluate(async()=>(await window.axe.run('.offline-learning',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
   let screenshot=null;if(shots){if(native){await progress.scrollIntoViewIfNeeded();screenshot=await captureNativeViewport(page,path.join(shots,shotName+'-progress-'+width+'.png'));}else await aside.screenshot({path:shots+'/'+shotName+'-progress-'+width+'.png'});}
   report.progressViews.push({width,...measured,largeText:true,axe:true,verified:value.verified,total:value.total,...(screenshot?{screenshot}:{})});
  }
  releaseHold();hold=false;report.realProgress=true;
  await page.getByText('Deine Lernwelt ist offline vorbereitet.',{exact:true}).waitFor({timeout:45000});await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const cached=await page.evaluate(async()=>{const name=(await caches.keys()).find(n=>n.startsWith('earth-learning-')),c=await caches.open(name);return{paths:(await c.keys()).map(r=>new URL(r.url).pathname),metrics:await(await c.match('/__learning_offline_metrics__')).json()};});
  for(const asset of assets)assert.ok(cached.paths.includes(asset),'every offline asset '+asset);assert.equal(cached.metrics.downloaded+cached.metrics.reused,assets.length);report.networkRecovery=true;report.completeAssets=true;report.metrics=cached.metrics;
  assert.deepEqual(await snapshot(),saved);report.passPreserved=true;
  await stopTestServer(server);
  await assert.rejects(fetch(base+'/',{signal:AbortSignal.timeout(2000)}),'fixture server is really unreachable before the offline reload');report.serverStopped=true;
  await page.reload();await page.locator('.world-mini-question').waitFor();await page.getByRole('button',{name:'In deinem Forscherbuch',exact:true}).waitFor();report.offlineReload=true;
  if(shots)await page.locator('.offline-learning').screenshot({path:shots+'/'+shotName+'-320.png'});
  // The real complete cached app must retain the new source-learning activities too.
  report.historySourceDiscovery=[];report.opticsDiscovery=[];report.electricalDiscovery=[];report.mechanicsDiscovery=[];report.scienceOriginalDiscovery=[];
  for(const width of (native?[640,320]:[320,390,768,1440])){
   await page.setViewportSize({width:width*(native?2:1),height:950});const measured=await page.evaluate(()=>({width:innerWidth,scale:devicePixelRatio}));assert.equal(measured.width,width);if(native)assert.equal(measured.scale,2);await page.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));(report.peopleSourceDiscovery??=[]).push(...await peopleSourceView(page,{width,shots,engine:kind+'-offline'+(native?'-native':''),native}));report.historySourceDiscovery.push(...await historySourceView(page,{width,shots,engine:kind+'-offline'+(native?'-native':''),native}));report.opticsDiscovery.push(...await opticsSourceView(page,{width,shots,engine:kind+'-offline'+(native?'-native':''),native}));report.electricalDiscovery.push(...await electricalSourceView(page,{width,shots,engine:kind+'-offline'+(native?'-native':''),native}));report.mechanicsDiscovery.push(...await mechanicsSourceView(page,{width,shots,engine:kind+'-offline'+(native?'-native':''),native}));(report.buildingOriginalDiscovery??=[]).push(...await buildingOriginalSourceView(page,{width,shots,engine:kind+'-offline'+(native?'-native':''),native}));
  }
  // Check the new complete science activities once at the narrow cached layout,
  // and at both existing native-zoom widths. Other established source matrices
  // above stay complete; no duplicate science screenshots are needed here.
  for(const width of (native?[640,320]:[320])){
   await page.setViewportSize({width:width*(native?2:1),height:950});assert.equal(await page.evaluate(()=>innerWidth),width);
   if(native)assert.equal(await page.evaluate(()=>devicePixelRatio),2);
   await page.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));
   report.scienceOriginalDiscovery.push(...await scienceOriginalView(page,{width,native,questions:false}));
  }
  assert.equal(report.scienceOriginalDiscovery.length,native?46:23,'all science originals and voluntary inquiries in the complete cached app');
  assert.equal(report.electricalDiscovery.length,native?6:12,'all three electrical activities at every required cached-app width');
  assert.equal(report.mechanicsDiscovery.length,native?12:24,'all six mechanical activities at every required cached-app width');
  assert.equal(report.opticsDiscovery.length,native?6:12,'all three optical activities at every required cached-app width');
  assert.equal(report.historySourceDiscovery.length,native?4:8,'both source activities at every required cached-app width');
  const afterLearning=await snapshot();for(const key of ['favorites','notes'])assert.deepEqual(afterLearning[key],saved[key]);for(const [key,value]of Object.entries(saved.gameSessions))assert.deepEqual(afterLearning.gameSessions[key],value,'old saved game remains after cached source exploration '+key);
  report.worldGameSemantics=await worldGameOfflineSemantics(page,{shots:shots??'.qa-output',kind,native});
  report.bookLearning={checks:[]};
  for(const width of[320,1440]){
   await page.setViewportSize({width:width*(native?2:1),height:950});assert.equal(await page.evaluate(()=>innerWidth),width);
   await bookNormalizationView(page,report.bookLearning,width);
  }
  assert.equal(report.bookLearning.bookNormalization.length,8);
  report.learningTaskSemantics=await learningTaskOfflineSemantics(page,{shots:shots??'.qa-output',kind,native});
  return report;
 }catch(error){
  if(shots){await fs.writeFile(path.join(shots,shotName+'-failure.json'),JSON.stringify({...report,status:'failed',failure:error.stack},null,2));await page.screenshot({path:path.join(shots,shotName+'-failure-320.png'),animations:'disabled',timeout:5000}).catch(()=>{});}
  throw error;
 }finally{releaseHold();if(cdp)await cdp.detach();if(providedContext)await page.close();else await context.close();await stopTestServer(server);}
}
