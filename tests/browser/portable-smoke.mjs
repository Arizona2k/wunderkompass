import {solarFlow,offlineSolar} from './solar-comparison.mjs';
import {animalFlow,animalNativeZoom,offlineAnimals} from './animal-learning.mjs';
import {buildingsFlow,buildingsNativeZoom,offlineBuildings} from './building-learning.mjs';
import {inventionsFlow,inventionsNativeZoom,offlineInventions} from './inventions-learning.mjs';
import {offlineResilience} from './offline-resilience.mjs';
import {offlineRetention} from './offline-retention.mjs';
import {natureFlow,offlineNature,natureNativeZoom} from './nature-learning.mjs';
import {worldPhotoFlow,offlineWorldPhotos} from './world-photos.mjs';
import {whyFlow,offlineWhy} from './why-learning.mjs';
import {bookExcellenceFlow,bookNavigationSuite} from './book-excellence.mjs';
import {nativeJourneyZoom} from './journey-zoom.mjs';
import {prepareOfflineBook,offlineBook} from './book-excellence.mjs';
import {journeysFlow,prepareOfflineJourneys,offlineJourneys} from './journeys.mjs';
import {scienceExcellenceFlow,offlineScienceExcellence} from './science-excellence.mjs';
import {worldContentFlow} from './world-content.mjs';
import {offlineHistoryLearning} from './history-learning.mjs';
import {researchNewsFlow,offlineResearchNews} from './research-news.mjs';
import {performanceFlow,componentFlow} from './foundation.mjs';
import {playgroundFlow,prepareOfflinePlayground,offlinePlayground} from './playground.mjs';
import {passDesign} from './pass-atlas.mjs';
import {backupFlow} from './backup.mjs';
import {articleAtlas,offlineArticleAtlas} from './article-atlas.mjs';
import {discoveryCentral,offlineDiscoveryCentral,homepageOverview} from './discovery-central.mjs';
import {connectedDiscoveries} from './connected-discoveries.mjs';
import {challengeHints,offlineChallengeHints} from './challenge-hints.mjs';
import {searchAndHistory, memoryRound} from './portable-flows.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {fileURLToPath} from 'node:url';
const project=fileURLToPath(new URL('../..',import.meta.url)),shots=path.resolve(project,process.env.QA_OUTPUT_DIR??'.qa-output'),port=process.env.QA_PORT??'4182',base='http://127.0.0.1:'+port;
const qaRoot=path.join(project,'.qa-output');
if(shots!==qaRoot&&!shots.startsWith(qaRoot+path.sep))throw Error('Browser evidence must remain in the ignored QA directory');
const {chromium}=await import(process.env.QA_PLAYWRIGHT_MODULE??new URL('../../qa/node_modules/playwright/index.mjs',import.meta.url).href);
const pack=process.env.QA_CHROMIUM_MODULE?(await import(process.env.QA_CHROMIUM_MODULE)).default:null;
const options={headless:true,...(process.env.QA_BROWSER_EXECUTABLE?{executablePath:process.env.QA_BROWSER_EXECUTABLE}:{}),env:{...process.env,...(process.env.QA_BROWSER_LIB_PATH?{LD_LIBRARY_PATH:process.env.QA_BROWSER_LIB_PATH,FONTCONFIG_PATH:path.join(process.env.QA_BROWSER_LIB_PATH,'fonts')}:{})},args:[...(pack?pack.args.filter(a=>a!=='--single-process'&&!a.includes('incognito')):[]),'--enable-unsafe-swiftshader'],timeout:20000};
const availableSuites=['foundation','home','core','playground','backup','challenge','research','journeys','book','why','inventions','nature','offline'];const selectedSuites=process.env.QA_SUITE?process.env.QA_SUITE.split(','):availableSuites;if(selectedSuites.some(s=>!availableSuites.includes(s)))throw Error('Unknown local browser suite');const runSuite=s=>selectedSuites.includes(s);
const browserStarted=performance.now();
const report={timings:[],scope:process.env.QA_SUITE?'partial local iteration':'complete mandatory regression',selectedSuites,build:(await fs.readFile(path.resolve(project,process.env.QA_DIST??'dist','index.html'),'utf8')).match(/name="learning-build" content="([^"]+)"/)?.[1],browser:'',checks:[],errors:[],consoleErrors:[],failedRequests:[],ownHttpErrors:[],externalRequests:[],views:[]};let browser;
async function timed(name,run){const start=performance.now();try{return await run();}finally{const timing={suite:name,seconds:(performance.now()-start)/1000};report.timings.push(timing);console.log('QUALITY_PHASE',JSON.stringify(timing));}}
await fs.mkdir(shots,{recursive:true});const server=spawn(process.execPath,['tests/browser/preview-server.mjs'],{cwd:project,stdio:['ignore','pipe','pipe']});let serverLog='';server.stdout.on('data',b=>serverLog+=b);server.stderr.on('data',b=>serverLog+=b);process.on('exit',()=>server.kill('SIGTERM'));
process.once('SIGTERM',()=>{server.kill('SIGTERM');void browser?.close().finally(()=>process.exit(143));if(!browser)process.exit(143);});
try {
// A stale preview on the same port must not satisfy readiness while our own
// child exits with EADDRINUSE. Require the child's explicit listening signal.
let online=false;for(let i=0;i<35;i++){if(server.exitCode!==null)throw Error('Preview process exited: '+serverLog);if(serverLog.includes('WK_PREVIEW_READY '+port)){try{if((await fetch(base+'/world.json',{signal:AbortSignal.timeout(1000)})).ok){online=true;break;}}catch{}}await new Promise(r=>setTimeout(r,300));}if(!online)throw Error('Preview failed: '+serverLog);
const ready=p=>p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor({timeout:20000});
const monitor=p=>{p.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});p.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)report.ownHttpErrors.push({path:r.url().replace(base,''),status:r.status()});});p.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))report.externalRequests.push(r.url());});};
browser=await chromium.launch(options);report.browser=browser.version();
try{
 if(runSuite('foundation')){await timed('performance',()=>performanceFlow(browser,base,ready,monitor,report));process.send?.({type:'quality-performance-complete',samples:report.performance.samples.length});await timed('components',()=>componentFlow(browser,base,ready,monitor,report,shots));await worldContentFlow(browser,base,ready,monitor,report,shots);await worldPhotoFlow(browser,base,ready,monitor,report,shots);report.offlineResilience=await offlineResilience(browser,{port:Number(port)+1,shots});report.offlineRetention=await offlineRetention(browser,{shots});}
if(runSuite('research'))await timed('research',async()=>{await researchNewsFlow(browser,base,ready,monitor,report,shots);await scienceExcellenceFlow(browser,base,ready,monitor,report,shots,{chromium,options,includeBook:process.env.QA_BOOK_INLINE==='true'});});
if(runSuite('journeys'))await timed('journeys',()=>journeysFlow(browser,base,ready,monitor,report,shots,{chromium,options,includeBook:process.env.QA_BOOK_INLINE==='true'}));
if(runSuite('book'))await timed('book',async()=>{await bookExcellenceFlow(browser,base,ready,monitor,report,shots);await nativeJourneyZoom(chromium,options,base,report,shots,{bookOnly:true,includeWhy:false});});
if(runSuite('why'))await timed('why',async()=>{await whyFlow(browser,base,ready,monitor,report,shots);await nativeJourneyZoom(chromium,options,base,report,shots,{bookOnly:true,includeBook:false,includeWhy:true});});
if(runSuite('nature'))await timed('nature',async()=>{await natureFlow(browser,base,ready,monitor,report,shots);await natureNativeZoom(chromium,options,base,report,shots);});
if(runSuite('home'))await timed('home',()=>homepageOverview(browser,base,ready,monitor,report,shots));
 const coreStarted=performance.now();
 if(runSuite('core'))for(const [width,height] of [[1440,900],[768,1024],[390,844],[360,800]]){
  const c=await browser.newContext({viewport:{width,height},isMobile:width<=390,hasTouch:width<=390,reducedMotion:'reduce',acceptDownloads:true}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);await p.goto(base);await ready(p);await p.locator('#globe-observatory').scrollIntoViewIfNeeded();await p.locator('canvas').waitFor();assert.equal(await p.title(),'WunderKompass · Die große Abenteuerwelt des Wissens');
  const inspect=async name=>{assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,name);for(const im of await p.locator('.world-article img').all())await im.evaluate(async im=>{await im.decode();if(!im.naturalWidth)throw Error('Undecoded image');});report.views.push({width,height,name});};await inspect('home');console.log('Browser viewport',width,height);await articleAtlas(p,ready,report,width,shots);await passDesign(p,report,width,shots);await discoveryCentral(p,ready,report,width,shots);await searchAndHistory(p,report);
  for(const id of ['animal-polar-bear','history-maya','person-grace_hopper','invention-car','building-taj-mahal','science-energy']){await p.evaluate(id=>location.hash='world/topic/'+id,id);await p.locator('.world-mini-question').waitFor();await inspect(id);}
  if(width===1440){await p.evaluate(()=>location.hash='world/topic/animal-polar-bear');await p.locator('.world-mini-question').waitFor();await p.getByRole('button',{name:'Das interessiert mich!',exact:true}).click();await p.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3'))?.progress.favorites.includes('topic:animal-polar-bear'));await p.reload();await ready(p);assert.ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites.includes('topic:animal-polar-bear')));report.checks.push('Favorite survives reload');for(const [name,sel] of [['Lernreisen','.journey-tile'],['Spielplatz','.game-tile'],['Forscherlabor','.research-grid'],['Wissensbuch','.word-card']]){await p.getByRole('tab',{name,exact:true}).click();await p.locator(sel).first().waitFor();}report.checks.push('Four original learning hubs open');await memoryRound(p,ready,report);}
  await connectedDiscoveries(p,ready,report,width);
  await p.evaluate(()=>location.hash='world/topic/science-energy');await p.locator('.model-energy').waitFor();await p.screenshot({path:path.join(shots,'portable-'+width+'.png')});await c.close();
 }
 if(runSuite('core')){const small=await browser.newContext({viewport:{width:320,height:568},hasTouch:true,reducedMotion:'reduce'}),smallPage=await small.newPage();monitor(smallPage);await smallPage.goto(base);await ready(smallPage);await articleAtlas(smallPage,ready,report,320,shots);await passDesign(smallPage,report,320,shots);await small.close();}
 if(runSuite('core'))report.timings.push({suite:'core',seconds:(performance.now()-coreStarted)/1000});
 if(runSuite('core'))await timed('solar-labels',()=>solarFlow(browser,base,ready,monitor,report,shots));
 if(runSuite('core'))await timed('animals',async()=>{await animalFlow(browser,base,ready,monitor,report,shots);await animalNativeZoom(chromium,options,base,report,shots);});
 if(runSuite('core'))await timed('buildings',async()=>{await buildingsFlow(browser,base,ready,monitor,report,shots);await buildingsNativeZoom(chromium,options,base,report,shots);});
 if(runSuite('core'))await timed('book-navigation',()=>bookNavigationSuite(browser,base,ready,monitor,report,shots));
 if(runSuite('inventions'))await timed('inventions',async()=>{await inventionsFlow(browser,base,ready,monitor,report,shots);await inventionsNativeZoom(chromium,options,base,report,shots);});
 if(runSuite('playground'))await timed('playground',()=>playgroundFlow(browser,base,ready,monitor,report,shots));
 if(runSuite('backup'))await timed('backup',()=>backupFlow(browser,base,ready,monitor,report,shots));
 if(runSuite('challenge'))await timed('challenge',()=>challengeHints(browser,base,ready,monitor,report,shots));
}catch(error){
 // Preserve the actual failed page before closing its browser, without hiding
 // the original assertion if a crashed page cannot provide an image.
 for(const [i,page]of browser.contexts().flatMap(c=>c.pages()).entries())if(!page.isClosed())await page.screenshot({path:path.join(shots,'portable-failure-'+i+'.png'),animations:'disabled',timeout:5000}).catch(()=>{});
 throw error;
}finally{await browser.close();browser=null;}
if(runSuite('offline')){
const offlineStarted=performance.now();let offlineMark=offlineStarted;report.offlinePhaseSeconds={};const offlinePhase=phase=>{const now=performance.now();report.offlinePhaseSeconds[phase]=(now-offlineMark)/1000;offlineMark=now;console.log('OFFLINE_PHASE '+JSON.stringify({phase,seconds:report.offlinePhaseSeconds[phase],totalSeconds:(now-offlineStarted)/1000}));};
report.offlineTimings=[];const offlineStep=async(name,run)=>{const start=performance.now();try{return await run();}finally{const entry={name,seconds:(performance.now()-start)/1000};report.offlineTimings.push(entry);console.log('OFFLINE_STEP',JSON.stringify(entry));}};
const profile=path.join(shots,'portable-offline-profile');await fs.rm(profile,{recursive:true,force:true});let c=await chromium.launchPersistentContext(profile,{...options,viewport:{width:1280,height:900},reducedMotion:'reduce'}),p=c.pages()[0]??await c.newPage();monitor(p);p.setDefaultTimeout(20000);
let savedPlayground;
try{await p.bringToFront();await p.goto(base);await ready(p);savedPlayground=await prepareOfflinePlayground(p);await prepareOfflineJourneys(p);await prepareOfflineBook(p);await p.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await p.getByText('Deine Lernwelt ist offline vorbereitet.',{exact:true}).waitFor({timeout:45000});await p.waitForFunction(()=>!!navigator.serviceWorker.controller);report.offlineCache=await p.evaluate(async()=>{const a=[];for(const name of await caches.keys()){const ca=await caches.open(name);a.push({name,assets:(await ca.keys()).length,complete:!!await ca.match('/__learning_offline_ready__')});}return a;});assert.ok(report.offlineCache.some(x=>x.complete&&x.assets>100));report.checks.push('Actual offline preparation completed');offlinePhase('prepare-complete');}finally{await c.close();offlinePhase('prepared-browser-closed');}
server.kill('SIGTERM');
await new Promise(resolve=>server.exitCode!==null?resolve():server.once('exit',resolve));
await assert.rejects(fetch(base,{signal:AbortSignal.timeout(2000)}));offlinePhase('preview-stopped-and-refused');
c=await chromium.launchPersistentContext(profile,{...options,viewport:{width:1280,height:900},reducedMotion:'reduce'});await c.setOffline(true);p=c.pages()[0]??await c.newPage();monitor(p);p.setDefaultTimeout(20000);offlinePhase('cold-context-launched');
try{await p.bringToFront();await p.goto(base);await p.screenshot({path:path.join(shots,'offline-start.png')});await ready(p);report.offlineNavigatorOnline=await p.evaluate(()=>navigator.onLine);await p.evaluate(()=>location.hash='world/topic/animal-whale-shark');await p.locator('.world-photo img').first().waitFor();await p.locator('.world-photo img').first().evaluate(async im=>{await im.decode();if(!im.naturalWidth)throw Error('Offline image missing');});await p.evaluate(()=>location.hash='world/topic/science-energy');await p.locator('.model-energy').waitFor();await p.getByRole('button',{name:'Einen Zeitschritt testen',exact:true}).click();report.checks.push('Closed browser and cold offline restart with preview server stopped; unopened animal photo and energy model work');await offlineStep('offlineSolarCaptions',()=>offlineSolar(p,report));await offlineStep('offlineAnimals',()=>offlineAnimals(p,report));await offlineStep('offlineWorldPhotos',()=>offlineWorldPhotos(p,report));await offlineStep('offlineArticleAtlas',()=>offlineArticleAtlas(p,report));await offlineStep('offlineHistoryLearning',()=>offlineHistoryLearning(p,report));await offlineStep('offlineInventions',()=>offlineInventions(p,report));await offlineStep('offlineBuildings',()=>offlineBuildings(p,report));await offlineStep('offlineScienceExcellence',()=>offlineScienceExcellence(p,report));await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('button',{name:'Pass sichern',exact:true}).click();await p.getByRole('heading',{name:'Sichern & mitnehmen',exact:true}).waitFor();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();report.checks.push('New pass shell and direct backup access work after actual cold offline restart');await offlineStep('offlineChallengeHints',()=>offlineChallengeHints(p,report));await offlineStep('offlineDiscoveryCentral',()=>offlineDiscoveryCentral(p,report));await offlineStep('offlineResearchNews',()=>offlineResearchNews(p,report));await offlineStep('offlineJourneys',()=>offlineJourneys(p,report));await offlineStep('offlineBook',()=>offlineBook(p,report));await offlineStep('offlineWhy',()=>offlineWhy(p,report));await offlineStep('offlineNature',()=>offlineNature(p,report));await offlinePlayground(p,report,savedPlayground);offlinePhase('cold-learning-complete');}finally{await c.close();server.kill('SIGTERM');offlinePhase('cold-browser-closed');}
report.timings.push({suite:'offline',seconds:(performance.now()-offlineStarted)/1000});
}
assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);assert.deepEqual(report.ownHttpErrors,[]);assert.deepEqual(report.externalRequests,[]);report.externalRequests=[...new Set(report.externalRequests)];await fs.writeFile(path.join(shots,'portable-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

report.status='passed';
} catch(error) { report.status='failed';report.failure=error.stack;throw error; }
finally {
 report.seconds=(performance.now()-browserStarted)/1000;
 if(browser)await browser.close().catch(()=>{});
 server.kill('SIGTERM');
 await fs.writeFile(path.join(shots,'portable-report.json'),JSON.stringify(report,null,2)+'\n');
}
