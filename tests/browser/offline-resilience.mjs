import {bookCellView} from './book-cell-view.mjs';
import {bookMechanicsView} from './book-mechanics-view.mjs';
import {bookWaterView} from './book-water.mjs';
import {bookParticleView} from './book-particle.mjs';
import {insideDiagramViews} from './inside-diagrams.mjs';
import {bookLightView} from './book-light.mjs';
import {bookHeatView} from './book-heat.mjs';
import {bookMeasurementView} from './book-measurements.mjs';
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
import {planetDiagramViews} from './planet-diagrams.mjs';
import {prepareAxe} from './axe-loader.mjs';
import {stopTestServer} from './stop-test-server.mjs';
import {BROWSER_ERROR_FIELDS,browserErrorArrays,browserErrorsComplete,monitorBrowserErrors} from '../../scripts/browser-errors.mjs';

// The preceding progress matrix ends wide. A filename is no viewport evidence.
export async function assertOfflineCaptureViewport(page,{native=false}={}){
 const measured=await page.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));
 assert.equal(measured.cssWidth,320,'offline 320 capture uses the actual narrow CSS viewport');
 assert.equal(measured.scale,native?2:1,'offline capture records the actual browser zoom');
 const panel=page.locator('.offline-learning'),bounds=await panel.boundingBox();
 assert.ok(bounds&&bounds.width>0&&bounds.width<=320,'offline panel fits the measured narrow viewport');
 const overflow=await page.evaluate(()=>{
  const width=innerWidth,scrollWidth=document.documentElement.scrollWidth,failed=scrollWidth>width+2;
  if(!failed)return{failed,width,scrollWidth};
  // Preserve the first failing measurement. Later layout reads must not turn
  // a transient or persistent overflow into a successful retry.
  return{failed,width,scrollWidth,clientWidth:document.documentElement.clientWidth,bodyScrollWidth:document.body.scrollWidth,scrollX,scrollY,scale:devicePixelRatio,fonts:document.fonts.status,elements:[...document.querySelectorAll('body *')].map(el=>{const b=el.getBoundingClientRect(),s=getComputedStyle(el);return{tag:el.tagName,cls:String(el.className?.baseVal??el.className).slice(0,100),text:el.textContent?.slice(0,100),x:b.x,right:b.right,width:b.width,height:b.height,position:s.position,transform:s.transform,overflowX:s.overflowX,minWidth:s.minWidth};}).filter(b=>b.width>0&&(b.right>width+2||b.x< -2)).slice(0,24)};
 });
 if(overflow.failed)console.error('OFFLINE_CAPTURE_OVERFLOW '+JSON.stringify(overflow));
 assert.equal(overflow.failed,false,'offline capture has no horizontal overflow: '+JSON.stringify(overflow));
 return{...measured,panelWidth:bounds.width};
}
async function captureOfflinePanel(page,file,{native=false}={}){
 const measured=await assertOfflineCaptureViewport(page,{native});
 if(!file)return measured;
 const panel=page.locator('.offline-learning');await panel.scrollIntoViewIfNeeded();
 if(native)return{...measured,...await captureNativeViewport(page,file)};
 const png=await panel.screenshot({path:file,animations:'disabled'}),pixelWidth=png.readUInt32BE(16),pixelHeight=png.readUInt32BE(20);
 assert.ok(pixelWidth>0&&pixelWidth<=320&&pixelHeight>0,'offline panel PNG matches the actual narrow capture');
 return{...measured,pixelWidth,pixelHeight};
}

// Isolated real-app server: only this fixture can fail an asset or emulate quota.
export async function offlineResilience(browser,{port=4776,shots,kind=browser.browserType().name(),context:providedContext=null,native=false}={}){
 const shotName=native?'offline-resilience-native':kind==='chromium'?'offline-resilience-'+kind:'journey-engine-'+kind+'-offline-resilience';
 const worker=await fs.readFile('dist/learning-worker.js','utf8'),assets=JSON.parse(worker.match(/const ASSETS = (\[[^;]+\]);/)[1]);const guardedAsset=assets.find(p=>/^\/assets\/journey-inquiries-.*\.json$/.test(p));assert.ok(guardedAsset,'required actual journey asset');let fail=true,failedRequests=0,hold=false,releaseHold;const held=new Promise(resolve=>releaseHold=resolve);
 const photoAsset=assets.find(p=>/^\/assets\/world-photos-.*\.json$/.test(p));assert.ok(photoAsset,'actual deferred photo metadata');let releasePhoto,photoHeld=false;const photoBody=new Promise(resolve=>releasePhoto=resolve);
 const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname);if(name.includes('..')||url.search)throw Error('Invalid fixture URL');if(fail&&name===guardedAsset){failedRequests++;res.writeHead(503).end('Synthetic source failure');return;}if(hold&&name===guardedAsset)await held;const file=path.resolve('dist',name==='/'?'index.html':'.'+name);if(!file.startsWith(path.resolve('dist')+path.sep))throw Error('Invalid fixture path');const data=await fs.readFile(file),type=file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.webp')?'image/webp':'application/octet-stream';res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','Content-Length':data.length});if(native&&!photoHeld&&name===photoAsset&&req.headers.referer===base+'/'){photoHeld=true;res.flushHeaders();await photoBody;}if(!res.destroyed)res.end(data);}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));const base='http://127.0.0.1:'+port,context=providedContext??await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(20000);let cdp;const report={kind,networkRecovery:false,quotaRecovery:null,completeAssets:false,offlineReload:false,passPreserved:false,assetCount:assets.length};
 let verifiedWorkerURL=null;const workerURL=base+'/learning-worker.js';
 report.browserErrors=browserErrorArrays();monitorBrowserErrors(page,base,report.browserErrors,{engine:kind,expectedHTTP503:{url:base+guardedAsset,active:()=>fail,reason:'Exact required asset deliberately returns503 during the isolated initial source-failure phase.'},expectedOfflineWorkerUpdate:{url:workerURL,active:()=>report.serverStopped===true&&report.completeAssets===true&&verifiedWorkerURL===workerURL,reason:'The isolated fixture verified every cached asset and the active controller, then deliberately stopped this origin. Only the exact registered worker update connection refusal is expected.'}});
 const assertBrowserErrors=stage=>assert.equal(browserErrorsComplete(report.browserErrors),true,'actual offline-app browser errors remain blocking at '+stage+': '+JSON.stringify(Object.fromEntries(BROWSER_ERROR_FIELDS.map(key=>[key,{count:report.browserErrors[key].length,first:report.browserErrors[key].slice(0,3)}]))));
 const snapshot=()=>page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress;return p;});
 const noPartial=async()=>assert.deepEqual(await page.evaluate(async()=>(await caches.keys()).filter(n=>n.startsWith('earth-learning-'))),[],'no partial release survives');
 try{
  await page.setViewportSize({width:320*(native?2:1),height:900});
  await page.goto(base+'/#world/topic/animal-polar-bear');await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await page.getByRole('button',{name:'Das interessiert mich!',exact:true}).click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites.includes('topic:animal-polar-bear'));const saved=await snapshot();
  await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await page.locator('.offline-message').filter({hasText:/nicht|geklappt/}).waitFor();report.sourceErrorView=await captureOfflinePanel(page,shots?shots+'/'+shotName+'-source-error-320.png':null,{native});assert.ok(failedRequests>0,'actual service-worker asset request failed');await noPartial();assert.deepEqual(await snapshot(),saved);
  fail=false;
  if(kind==='chromium'){
   cdp=await context.newCDPSession(page);await cdp.send('Storage.overrideQuotaForOrigin',{origin:base,quotaSize:1024*1024});await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await page.locator('.offline-message').filter({hasText:/nicht|geklappt/}).waitFor();await noPartial();assert.deepEqual(await snapshot(),saved);report.quotaErrorView=await captureOfflinePanel(page,shots?shots+'/'+shotName+'-quota-error-320.png':null,{native});report.quotaRecovery=true;await cdp.send('Storage.overrideQuotaForOrigin',{origin:base});
  }
  hold=true;await page.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();const progress=page.getByRole('progressbar',{name:'Sicher gespeicherte Lernwelt-Dateien',exact:true});await progress.waitFor();await page.waitForFunction(()=>{const el=document.querySelector('progress[aria-label="Sicher gespeicherte Lernwelt-Dateien"]');return el&&el.value>0&&el.value<el.max;});const counts=await progress.evaluate(el=>({verified:el.value,total:el.max}));assert.equal(counts.total,assets.length);assert.ok(counts.verified>0&&counts.verified<counts.total,'held required asset cannot be reported as verified');assert.equal(await page.getByText('Deine Lernwelt ist offline vorbereitet.',{exact:true}).count(),0);report.progressViews=[];
  for(const width of (native?[640]:[320,360,390,768,1024,1440,1920])){
   await page.setViewportSize({width:width*(native?2:1),height:900});await page.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));
   // Measure the rendered responsive state, as in the other existing audits.
   // The original next-task read can still contain the wide header padding.
   await prepareAxe(page);
   const measured=await page.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));assert.equal(measured.cssWidth,width);if(native)assert.equal(measured.scale,2);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'offline progress has no horizontal overflow '+width);
   const aside=page.locator('.offline-learning');assert.ok(await aside.isVisible());assert.ok(await aside.getByRole('progressbar',{name:'Sicher gespeicherte Lernwelt-Dateien',exact:true}).isVisible());
   const value=await progress.evaluate(e=>({verified:e.value,total:e.max}));assert.ok(value.verified>0&&value.verified<value.total);assert.equal(value.total,assets.length);
   assert.deepEqual(await page.evaluate(async()=>(await window.axe.run('.offline-learning',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
   let screenshot=null;if(shots){if(native){await progress.scrollIntoViewIfNeeded();screenshot=await captureNativeViewport(page,path.join(shots,shotName+'-progress-'+width+'.png'));}else await aside.screenshot({path:shots+'/'+shotName+'-progress-'+width+'.png'});}
   report.progressViews.push({width,...measured,largeText:true,axe:true,verified:value.verified,total:value.total,...(screenshot?{screenshot}:{})});
  }
  releaseHold();hold=false;report.realProgress=true;
  await page.getByText('Deine Lernwelt ist offline vorbereitet.',{exact:true}).waitFor({timeout:58500});await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const cached=await page.evaluate(async()=>{const name=(await caches.keys()).find(n=>n.startsWith('earth-learning-')),c=await caches.open(name);return{paths:(await c.keys()).map(r=>new URL(r.url).pathname),metrics:await(await c.match('/__learning_offline_metrics__')).json()};});
  for(const asset of assets)assert.ok(cached.paths.includes(asset),'every offline asset '+asset);assert.equal(cached.metrics.downloaded+cached.metrics.reused,assets.length);report.networkRecovery=true;report.completeAssets=true;report.metrics=cached.metrics;
  assert.deepEqual(await snapshot(),saved);report.passPreserved=true;
  const registration=await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return{active:r?.active?.scriptURL,state:r?.active?.state,controller:navigator.serviceWorker.controller?.scriptURL};});
  assert.deepEqual(registration,{active:workerURL,state:'activated',controller:workerURL},'the already active cached worker is verified before the origin is stopped');verifiedWorkerURL=registration.active;report.registeredWorkerBeforeShutdown=registration;
  assertBrowserErrors('before deliberate origin shutdown');
  await page.setViewportSize({width:320*(native?2:1),height:900});
  await prepareAxe(page);
  await assertOfflineCaptureViewport(page,{native});
  if(native){
   assert.equal(photoHeld,true,'the initial frame-owned photo response crosses the controlled preparation phases');releasePhoto();
   const image=page.locator('.world-article .world-photo img[src]').first();await image.waitFor({state:'attached'});await image.scrollIntoViewIfNeeded();
   await page.waitForFunction(el=>el.complete&&el.naturalWidth>0,await image.elementHandle());await image.evaluate(el=>el.decode());
   const credit=image.locator('..').locator('figcaption');await credit.waitFor();assert.ok((await credit.innerText()).trim());
   report.deferredPhotoTransport={heldAcrossPreparation:true,src:await image.getAttribute('src'),credit:await credit.innerText()};
   assertBrowserErrors('after delayed native photo transport completion');
  }
  await stopTestServer(server);
  await assert.rejects(fetch(base+'/',{signal:AbortSignal.timeout(2600)}),'fixture server is really unreachable before the offline reload');report.serverStopped=true;
  await page.reload();await page.locator('.world-mini-question').waitFor();await page.getByRole('button',{name:'In deinem Forscherbuch',exact:true}).waitFor();report.offlineReload=true;
  assertBrowserErrors('after confirmed-origin-down reload');
  report.offlineReadyView=await captureOfflinePanel(page,shots?shots+'/'+shotName+'-320.png':null,{native});
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
  assert.equal(report.historySourceDiscovery.length,native?6:12,'all three source activities at every required cached-app width');
  const afterLearning=await snapshot();for(const key of ['favorites','notes'])assert.deepEqual(afterLearning[key],saved[key]);for(const [key,value]of Object.entries(saved.gameSessions))assert.deepEqual(afterLearning.gameSessions[key],value,'old saved game remains after cached source exploration '+key);
  report.worldGameSemantics=await worldGameOfflineSemantics(page,{shots:shots??'.qa-output',kind,native});
  report.bookLearning={checks:[]};
  for(const width of[320,1440]){
   await page.setViewportSize({width:width*(native?2:1),height:950});assert.equal(await page.evaluate(()=>innerWidth),width);
   await bookNormalizationView(page,report.bookLearning,width,{measurement:true,shots,engine:kind,native});
  }
  assert.equal(report.bookLearning.bookNormalization.length,8);
  assert.equal(report.bookLearning.bookMechanics.length,14,'all seven mechanics entries at the two existing cold widths');
  if(native){const previousViewport=page.viewportSize();await page.setViewportSize({width:1280,height:950});assert.equal(await page.evaluate(()=>innerWidth),640);assert.equal(await page.evaluate(()=>devicePixelRatio),2);await bookMeasurementView(page,report.bookLearning,640,{shots,engine:kind,large:true,native:true,offline:true});await bookHeatView(page,report.bookLearning,640,{shots,engine:kind,large:true,native:true,offline:true});await bookLightView(page,report.bookLearning,640,{shots,engine:kind,large:true,native:true,offline:true});await bookWaterView(page,report.bookLearning,640,{shots,engine:kind,large:true,native:true,offline:true});await bookParticleView(page,report.bookLearning,640,{shots,engine:kind,large:true,native:true,offline:true});await bookMechanicsView(page,report.bookLearning,640,{shots,engine:kind,large:true,native:true,offline:true});await bookCellView(page,report.bookLearning,640,{shots,engine:kind,large:true,native:true,offline:true});await page.setViewportSize(previousViewport);}
  assert.equal(report.bookLearning.bookMeasurements.length,native?21:14,'all seven SI words in every retained cached book layout and the additional required native640 layout');
  assert.equal(new Set(report.bookLearning.bookMeasurements.map(row=>row.term+':'+row.width)).size,native?21:14,'every cached SI term/width identity is distinct');
  assert.equal(report.bookLearning.bookMechanics.length,native?21:14,'all seven mechanics entries in every actual cold layout including native640');
  assert.equal(new Set(report.bookLearning.bookMechanics.map(row=>row.kind+':'+row.term+':'+row.width)).size,native?21:14,'every mechanics cold identity is distinct');
  assert.equal(report.bookLearning.bookCell.length,native?30:20,'all ten cell entries in every actual cold layout including native640');
  assert.equal(new Set(report.bookLearning.bookCell.map(row=>row.kind+':'+row.term+':'+row.width)).size,native?30:20,'every cell cold identity is distinct');
  assert.equal(report.bookLearning.bookParticle.length,native?15:10,'all five particle words in each actual cold layout including native640');
  assert.equal(new Set(report.bookLearning.bookParticle.map(row=>row.term+':'+row.width)).size,native?15:10,'all particle cold identities distinct');
  assert.equal(report.bookLearning.bookWater.length,native?24:16,'all8 water entries in every cached layout including native640');
  assert.equal(new Set(report.bookLearning.bookWater.map(row=>row.term+':'+row.width)).size,native?24:16,'every cached water identity is distinct');
  assert.equal(report.bookLearning.bookLight.length,native?42:28,'all14 light entries in every cached layout including native640');
  assert.equal(new Set(report.bookLearning.bookLight.map(row=>row.term+':'+row.width)).size,native?42:28,'every cached light term/width identity is distinct');
  assert.equal(report.bookLearning.bookHeat.length,native?18:12,'all six heat views in every cached layout including native640');
  assert.equal(new Set(report.bookLearning.bookHeat.map(row=>row.term+':'+row.width)).size,native?18:12,'every cached heat term/width identity is distinct');
  report.planetDiagrams=[];for(const width of(native?[320,640]:[320,1440])){await page.setViewportSize({width:width*(native?2:1),height:950});report.planetDiagrams.push(...await planetDiagramViews(page,{width,large:true,native,offline:true,networkOffline:false,serverStopped:report.serverStopped,shots:shots??'.qa-output',engine:kind}));}assert.equal(report.planetDiagrams.length,18);
  report.insideDiagrams=[];for(const width of(native?[320,640]:[320,1440])){await page.setViewportSize({width:width*(native?2:1),height:950});report.insideDiagrams.push(...await insideDiagramViews(page,{width,large:true,native,offline:true,networkOffline:false,serverStopped:report.serverStopped,shots:shots??'.qa-output',engine:kind}));}assert.equal(report.insideDiagrams.length,16);
  report.learningTaskSemantics=await learningTaskOfflineSemantics(page,{shots:shots??'.qa-output',kind,native});
  assertBrowserErrors('after complete cached learning matrix');
  return report;
 }catch(error){
  if(shots){await fs.writeFile(path.join(shots,shotName+'-failure.json'),JSON.stringify({...report,status:'failed',failure:error.stack},null,2));await page.screenshot({path:path.join(shots,shotName+'-failure-320.png'),animations:'disabled',timeout:6500}).catch(()=>{});}
  throw error;
 }finally{releaseHold();releasePhoto();if(cdp)await cdp.detach();if(providedContext)await page.close();else await context.close();await stopTestServer(server);}
}
