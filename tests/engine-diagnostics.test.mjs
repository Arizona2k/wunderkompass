import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
import {EventEmitter} from 'node:events';
import {preserveEngineDiagnostics,observeEngineLifecycle} from './browser/engine-diagnostics.mjs';
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
