import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
import {EventEmitter} from 'node:events';
import {preserveEngineDiagnostics,collectEngineEvidence,observeEngineLifecycle,readAnimalFailureView,captureAnimalFailureScreenshot} from './browser/engine-diagnostics.mjs';
test('unresponsive or lost renderer cannot hold the failure view observation open',async()=>{
 const url='http://127.0.0.1/#world/topic/animal-ring-tailed-lemur',page={url:()=>url,evaluate:()=>new Promise(()=>{})},started=performance.now();
 const actual=await readAnimalFailureView(page,{timeoutMs:25});assert.equal(actual.url,url);assert.match(actual.unavailable,/exceeded 25ms/);assert.ok(performance.now()-started<1000,'post-failure observation returns even if evaluate never settles');
 page.evaluate=async()=>{throw Error('Target closed');};assert.deepEqual(await readAnimalFailureView(page),{url,unavailable:'Target closed'});
});
test('failed screenshot records capture failure, preserves the primary error and cannot overwrite evidence',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-animal-capture-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));
 const original=Error('original strict Katta guard'),position={engine:'webkit',current:'animal-ring-tailed-lemur',stage:'large',width:390},primary=Buffer.from('unchanged original workshop failure');await fs.writeFile(path.join(dir,'animal-workshop-failure-390.json'),primary);
 const page={screenshot:async options=>{assert.equal(options.timeout,5000);assert.equal(options.fullPage,true);throw Error('Target page closed');}};
 await assert.rejects(async()=>{try{throw original;}catch(error){await captureAnimalFailureScreenshot(page,dir,position);throw error;}},error=>error===original);
 const receipt=path.join(dir,'animal-screenshot-failure-390.json'),bytes=await fs.readFile(receipt);assert.deepEqual(JSON.parse(bytes),{...position,screenshot:'animal-failure-390.png',error:'Target page closed'});assert.deepEqual(await fs.readFile(path.join(dir,'animal-workshop-failure-390.json')),primary);
 page.screenshot=async()=>{throw Error('different later capture failure');};await captureAnimalFailureScreenshot(page,dir,position);assert.deepEqual(await fs.readFile(receipt),bytes);
 const moved=await preserveEngineDiagnostics(dir,'webkit');assert.ok(moved.includes('journey-engine-webkit-animal-screenshot-failure-390.json'));assert.deepEqual(await fs.readFile(path.join(dir,'journey-engine-webkit-animal-screenshot-failure-390.json')),bytes);
});
test('failed engine diagnostics keep exact original bytes, existing other snapshots and curator-compatible names',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-engine-proof-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));
 const original=Buffer.from('synthetic evidence fixture, never a product screenshot'),hash=bytes=>createHash('sha256').update(bytes).digest('hex');
 for(const name of ['animal-search-failure-webkit.png','animal-search-failure-webkit.json','journey-engine-firefox-proof.png','unrelated.json'])await fs.writeFile(path.join(dir,name),original);
 const moved=await preserveEngineDiagnostics(dir,'webkit');assert.equal(moved.length,2);
 for(const name of moved){assert.match(name,/^journey-engine-webkit-animal-/);assert.equal(hash(await fs.readFile(path.join(dir,name))),hash(original));}
 assert.equal(hash(await fs.readFile(path.join(dir,'journey-engine-firefox-proof.png'))),hash(original));
 assert.deepEqual(await preserveEngineDiagnostics(dir,'webkit'),[]);
 await fs.writeFile(path.join(dir,'animal-search-failure-webkit.png'),Buffer.from('new run must not overwrite original'));
 await assert.rejects(preserveEngineDiagnostics(dir,'webkit'),/cannot be overwritten/);
 await assert.rejects(preserveEngineDiagnostics(dir,'../other'),/Unknown/);
 assert.equal(hash(await fs.readFile(path.join(dir,'journey-engine-webkit-animal-search-failure-webkit.png'))),hash(original));
});

test('unexpected page and browser loss preserves lifecycle order and resource snapshots even when the page cannot evaluate',async()=>{
 const page=new EventEmitter(),context=new EventEmitter(),browser=new EventEmitter();let stage='open search',reads=0;page.url=()=> 'http://127.0.0.1/#world/topic/animal-common-cuttlefish';page.isClosed=()=>true;browser.isConnected=()=>false;
 const probe=await observeEngineLifecycle(browser,context,page,()=>({current:'animal-common-cuttlefish',stage}),{readResources:async()=>({cgroup:{'memory.events':reads++?'oom_kill 1':'oom_kill 0'}})});
 page.emit('crash');page.emit('close');stage='failure capture';browser.emit('disconnected');const proof=await probe.snapshot();assert.deepEqual(proof.events.map(e=>e.kind),['page-crash','page-close','browser-disconnected']);assert.equal(proof.events[0].stage,'open search');assert.equal(proof.events[2].stage,'failure capture');assert.equal(proof.initialResources.cgroup['memory.events'],'oom_kill 0');assert.equal(proof.resourcesAtFailure.cgroup['memory.events'],'oom_kill 1');assert.equal(proof.pageClosed,true);assert.equal(proof.browserConnected,false);probe.stop();
});
test('diagnostics detach before normal teardown and missing resource files cannot mask the original browser state',async()=>{
 const page=new EventEmitter(),context=new EventEmitter(),browser=new EventEmitter();page.url=()=> 'http://127.0.0.1/';page.isClosed=()=>false;browser.isConnected=()=>true;const probe=await observeEngineLifecycle(browser,context,page,()=>({stage:'complete'}),{readResources:async()=>{throw Object.assign(new Error('synthetic unavailable resource'),{code:'ENOENT'});}});probe.stop();for(const emitter of [page,context,browser])assert.equal(emitter.eventNames().length,0);page.emit('close');context.emit('close');browser.emit('disconnected');const proof=await probe.snapshot();assert.deepEqual(proof.events,[]);assert.deepEqual(proof.initialResources,{unavailable:'ENOENT'});assert.deepEqual(proof.resourcesAtFailure,{unavailable:'ENOENT'});assert.equal(proof.browserConnected,true);
});

test('isolated engine evidence reaches the existing review namespace with exact original bytes',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'wk-engine-collection-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));
 const files=[['firefox','journey-engine-firefox-proof.png',Buffer.from('first original'),'journey-engine-firefox-proof.png'],['webkit','journey-engine-webkit-proof.png',Buffer.from('second original'),'journey-engine-webkit-proof.png'],['webkit','offline-webkit.json',Buffer.from('{"synthetic":true}'),'journey-engine-webkit-offline-webkit.json'],['firefox','shared.png',Buffer.from('first generic original'),'journey-engine-firefox-shared.png'],['webkit','shared.png',Buffer.from('second generic original'),'journey-engine-webkit-shared.png']];
 for(const [engine,file,bytes]of files){const directory=path.join(root,'journey-engine-work',engine);await fs.mkdir(directory,{recursive:true});await fs.writeFile(path.join(directory,file),bytes);}
 assert.deepEqual(await collectEngineEvidence(root,['firefox','webkit']),[]);
 for(const [engine,file,bytes,target]of files){assert.deepEqual(await fs.readFile(path.join(root,target)),bytes);await assert.rejects(fs.stat(path.join(root,'journey-engine-work',engine,file)),{code:'ENOENT'});}

});

test('conflicting engine evidence fails closed and preserves every colliding original',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'wk-engine-collision-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));
 const directory=path.join(root,'journey-engine-work','webkit');await fs.mkdir(directory,{recursive:true});const original=Buffer.from('existing independent proof'),conflict=Buffer.from('conflicting new proof');await fs.writeFile(path.join(root,'journey-engine-webkit-same.png'),original);await fs.writeFile(path.join(directory,'same.png'),conflict);await fs.writeFile(path.join(directory,'other.png'),Buffer.from('unrelated proof survives too'));
 const failures=await collectEngineEvidence(root,['webkit']);assert.equal(failures.length,1);assert.match(failures[0].error,/must not be overwritten/);assert.deepEqual(await fs.readFile(path.join(root,'journey-engine-webkit-same.png')),original);assert.deepEqual(await fs.readFile(path.join(directory,'same.png')),conflict);assert.equal(await fs.readFile(path.join(root,'journey-engine-webkit-other.png'),'utf8'),'unrelated proof survives too');await assert.rejects(collectEngineEvidence(root,['../outside']),/Invalid evidence worker names/);
});

test('existing native journey-help subdirectories preserve both engines and exact bytes',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'wk-engine-journey-help-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));const originals=[];
 for(const engine of ['firefox','webkit']){
  const directory=path.join(root,'journey-engine-work',engine,'journey-help-'+engine);await fs.mkdir(directory,{recursive:true});
  for(const [file,bytes]of [['same.png',Buffer.from('synthetic image '+engine)],['actual-transfer.json',Buffer.from(JSON.stringify({synthetic:engine}))]]){await fs.writeFile(path.join(directory,file),bytes);originals.push({engine,directory,file,bytes});}
 }
 assert.deepEqual(await collectEngineEvidence(root,['firefox','webkit']),[]);
 for(const {engine,directory,file,bytes}of originals){assert.deepEqual(await fs.readFile(path.join(root,'journey-engine-'+engine+'-journey-help-'+engine+'-'+file)),bytes);await assert.rejects(fs.stat(path.join(directory,file)),{code:'ENOENT'});}
 assert.deepEqual(await collectEngineEvidence(root,['firefox','webkit']),[],'empty known helper directories remain valid');
});

test('journey-help collection still rejects profiles, unexpected nesting and symbolic links',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'wk-engine-unsafe-help-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));const worker=path.join(root,'journey-engine-work','firefox'),help=path.join(worker,'journey-help-firefox');await fs.mkdir(path.join(help,'unexpected-profile'),{recursive:true});await fs.mkdir(path.join(worker,'browser-profile'));await fs.writeFile(path.join(help,'unexpected-profile','must-stay.txt'),'synthetic untouched profile');
 let failures=await collectEngineEvidence(root,['firefox']);assert.deepEqual(failures.map(f=>f.file).sort(),['browser-profile',path.join('journey-help-firefox','unexpected-profile')].sort());assert.equal(await fs.readFile(path.join(help,'unexpected-profile','must-stay.txt'),'utf8'),'synthetic untouched profile');
 const outside=path.join(root,'outside-fixture');await fs.mkdir(outside);await fs.writeFile(path.join(outside,'not-evidence.png'),'synthetic do not traverse');await fs.rename(help,path.join(root,'retained-help-fixture'));await fs.symlink(outside,help,'dir');failures=await collectEngineEvidence(root,['firefox']);assert.deepEqual(failures.map(f=>f.file).sort(),['browser-profile','journey-help-firefox']);await assert.rejects(fs.stat(path.join(root,'journey-engine-firefox-journey-help-firefox-not-evidence.png')),{code:'ENOENT'});assert.equal(await fs.readFile(path.join(outside,'not-evidence.png'),'utf8'),'synthetic do not traverse');
});
