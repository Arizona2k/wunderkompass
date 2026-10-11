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
const project=fileURLToPath(new URL('../..',import.meta.url)),shots=path.join(project,'.qa-output'),port=process.env.QA_PORT??'4182',base='http://127.0.0.1:'+port;
const {chromium}=await import(process.env.QA_PLAYWRIGHT_MODULE??new URL('../../qa/node_modules/playwright/index.mjs',import.meta.url).href);
const pack=process.env.QA_CHROMIUM_MODULE?(await import(process.env.QA_CHROMIUM_MODULE)).default:null;
const options={headless:true,...(process.env.QA_BROWSER_EXECUTABLE?{executablePath:process.env.QA_BROWSER_EXECUTABLE}:{}),env:{...process.env,...(process.env.QA_BROWSER_LIB_PATH?{LD_LIBRARY_PATH:process.env.QA_BROWSER_LIB_PATH,FONTCONFIG_PATH:path.join(process.env.QA_BROWSER_LIB_PATH,'fonts')}:{})},args:[...(pack?pack.args.filter(a=>a!=='--single-process'&&!a.includes('incognito')):[]),'--enable-unsafe-swiftshader'],timeout:20000};
const availableSuites=['foundation','home','core','playground','backup','challenge','offline'];const selectedSuites=process.env.QA_SUITE?process.env.QA_SUITE.split(','):availableSuites;if(selectedSuites.some(s=>!availableSuites.includes(s)))throw Error('Unknown local browser suite');const runSuite=s=>selectedSuites.includes(s);
const report={scope:process.env.QA_SUITE?'partial local iteration':'complete mandatory regression',selectedSuites,browser:'',checks:[],errors:[],consoleErrors:[],failedRequests:[],ownHttpErrors:[],externalRequests:[],views:[]};let browser;
await fs.mkdir(shots,{recursive:true});const server=spawn(process.execPath,['tests/browser/preview-server.mjs'],{cwd:project,stdio:['ignore','pipe','pipe']});let serverLog='';server.stdout.on('data',b=>serverLog+=b);server.stderr.on('data',b=>serverLog+=b);process.on('exit',()=>server.kill('SIGTERM'));
try {
// A stale preview on the same port must not satisfy readiness while our own
// child exits with EADDRINUSE. Require the child's explicit listening signal.
let online=false;for(let i=0;i<35;i++){if(server.exitCode!==null)throw Error('Preview process exited: '+serverLog);if(serverLog.includes('WK_PREVIEW_READY '+port)){try{if((await fetch(base+'/world.json',{signal:AbortSignal.timeout(1000)})).ok){online=true;break;}}catch{}}await new Promise(r=>setTimeout(r,300));}if(!online)throw Error('Preview failed: '+serverLog);
const ready=p=>p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor({timeout:20000});
const monitor=p=>{p.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});p.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)report.ownHttpErrors.push({path:r.url().replace(base,''),status:r.status()});});p.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))report.externalRequests.push(r.url());});};
browser=await chromium.launch(options);report.browser=browser.version();
try{
 if(runSuite('foundation')){await performanceFlow(browser,base,ready,monitor,report);await componentFlow(browser,base,ready,monitor,report,shots);}
if(runSuite('home'))await homepageOverview(browser,base,ready,monitor,report,shots);
 if(runSuite('core'))for(const [width,height] of [[1440,900],[768,1024],[390,844],[360,800]]){
  const c=await browser.newContext({viewport:{width,height},isMobile:width<=390,hasTouch:width<=390,reducedMotion:'reduce',acceptDownloads:true}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);await p.goto(base);await ready(p);await p.locator('#globe-observatory').scrollIntoViewIfNeeded();await p.locator('canvas').waitFor();assert.equal(await p.title(),'WunderKompass · Die große Abenteuerwelt des Wissens');
  const inspect=async name=>{assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,name);for(const im of await p.locator('.world-article img').all())await im.evaluate(async im=>{await im.decode();if(!im.naturalWidth)throw Error('Undecoded image');});report.views.push({width,height,name});};await inspect('home');console.log('Browser viewport',width,height);await articleAtlas(p,ready,report,width,shots);await passDesign(p,report,width,shots);await discoveryCentral(p,ready,report,width,shots);await searchAndHistory(p,report);
  for(const id of ['animal-polar-bear','history-maya','person-grace_hopper','invention-car','building-taj-mahal','science-energy']){await p.evaluate(id=>location.hash='world/topic/'+id,id);await p.locator('.world-mini-question').waitFor();await inspect(id);}
  if(width===1440){await p.evaluate(()=>location.hash='world/topic/animal-polar-bear');await p.locator('.world-mini-question').waitFor();await p.getByRole('button',{name:'Das interessiert mich!',exact:true}).click();await p.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3'))?.progress.favorites.includes('topic:animal-polar-bear'));await p.reload();await ready(p);assert.ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites.includes('topic:animal-polar-bear')));report.checks.push('Favorite survives reload');for(const [name,sel] of [['Lernreisen','.journey-tile'],['Spielplatz','.game-tile'],['Forscherlabor','.research-grid'],['Wissensbuch','.word-card']]){await p.getByRole('tab',{name,exact:true}).click();await p.locator(sel).first().waitFor();}report.checks.push('Four original learning hubs open');await memoryRound(p,ready,report);}
  await connectedDiscoveries(p,ready,report,width);
  await p.evaluate(()=>location.hash='world/topic/science-energy');await p.locator('.model-energy').waitFor();await p.screenshot({path:path.join(shots,'portable-'+width+'.png')});await c.close();
 }
 if(runSuite('core')){const small=await browser.newContext({viewport:{width:320,height:568},hasTouch:true,reducedMotion:'reduce'}),smallPage=await small.newPage();monitor(smallPage);await smallPage.goto(base);await ready(smallPage);await articleAtlas(smallPage,ready,report,320,shots);await passDesign(smallPage,report,320,shots);await small.close();}
 if(runSuite('playground'))await playgroundFlow(browser,base,ready,monitor,report,shots);
 if(runSuite('backup'))await backupFlow(browser,base,ready,monitor,report,shots);
 if(runSuite('challenge'))await challengeHints(browser,base,ready,monitor,report,shots);
}finally{await browser.close();browser=null;}
if(runSuite('offline')){
const profile=path.join(shots,'portable-offline-profile');await fs.rm(profile,{recursive:true,force:true});let c=await chromium.launchPersistentContext(profile,{...options,viewport:{width:1280,height:900},reducedMotion:'reduce'}),p=c.pages()[0]??await c.newPage();monitor(p);p.setDefaultTimeout(20000);
let savedPlayground;
try{await p.goto(base);await ready(p);savedPlayground=await prepareOfflinePlayground(p);await p.getByRole('button',{name:'Für offline vorbereiten',exact:true}).click();await p.getByText('Deine Lernwelt ist offline vorbereitet.',{exact:true}).waitFor({timeout:45000});await p.waitForFunction(()=>!!navigator.serviceWorker.controller);report.offlineCache=await p.evaluate(async()=>{const a=[];for(const name of await caches.keys()){const ca=await caches.open(name);a.push({name,assets:(await ca.keys()).length,complete:!!await ca.match('/__learning_offline_ready__')});}return a;});assert.ok(report.offlineCache.some(x=>x.complete&&x.assets>100));report.checks.push('Actual offline preparation completed');}finally{await c.close();}
server.kill('SIGTERM');
await new Promise(resolve=>server.exitCode!==null?resolve():server.once('exit',resolve));
await assert.rejects(fetch(base,{signal:AbortSignal.timeout(2000)}));
c=await chromium.launchPersistentContext(profile,{...options,viewport:{width:1280,height:900},reducedMotion:'reduce'});await c.setOffline(true);p=c.pages()[0]??await c.newPage();monitor(p);p.setDefaultTimeout(20000);
try{await p.goto(base);await p.screenshot({path:path.join(shots,'offline-start.png')});await ready(p);report.offlineNavigatorOnline=await p.evaluate(()=>navigator.onLine);await p.evaluate(()=>location.hash='world/topic/animal-whale-shark');await p.locator('.world-photo img').first().waitFor();await p.locator('.world-photo img').first().evaluate(async im=>{await im.decode();if(!im.naturalWidth)throw Error('Offline image missing');});await p.evaluate(()=>location.hash='world/topic/science-energy');await p.locator('.model-energy').waitFor();await p.getByRole('button',{name:'Einen Zeitschritt testen',exact:true}).click();report.checks.push('Closed browser and cold offline restart with preview server stopped; unopened animal photo and energy model work');await offlineArticleAtlas(p,report);await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('button',{name:'Pass sichern',exact:true}).click();await p.getByRole('heading',{name:'Sichern & mitnehmen',exact:true}).waitFor();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();report.checks.push('New pass shell and direct backup access work after actual cold offline restart');await offlineChallengeHints(p,report);await offlineDiscoveryCentral(p,report);await offlinePlayground(p,report,savedPlayground);}finally{await c.close();server.kill('SIGTERM');}
}
assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);assert.deepEqual(report.ownHttpErrors,[]);assert.deepEqual(report.externalRequests,[]);report.externalRequests=[...new Set(report.externalRequests)];await fs.writeFile(path.join(shots,'portable-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

report.status='passed';
} catch(error) { report.status='failed';report.failure=error.stack;throw error; }
finally {
 if(browser)await browser.close().catch(()=>{});
 server.kill('SIGTERM');
 await fs.writeFile(path.join(shots,'portable-report.json'),JSON.stringify(report,null,2)+'\n');
}
