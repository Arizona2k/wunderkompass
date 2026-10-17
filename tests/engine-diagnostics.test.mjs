import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
import {preserveEngineDiagnostics} from './browser/engine-diagnostics.mjs';
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
