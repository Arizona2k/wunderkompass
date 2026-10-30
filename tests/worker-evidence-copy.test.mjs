import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {copyWorkerEvidence} from './browser/worker-evidence-copy.mjs';

async function fixture(run){
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'own-worker-evidence-'));
 try{await run(dir);}finally{await fs.rm(dir,{recursive:true,force:true});}
}
const identity=async file=>{const s=await fs.stat(file,{bigint:true});return{ino:s.ino,dev:s.dev,mode:s.mode,size:s.size,mtime:s.mtimeNs};};

test('new collected PNG aliases the completed worker original without changing its identity or time',()=>fixture(async dir=>{
 const original=path.join(dir,'worker.png'),collected=path.join(dir,'collected.png');
 await fs.writeFile(original,'own synthetic PNG-suffix fixture');await fs.utimes(original,1600000000,1600000000);
 const before=await identity(original);await copyWorkerEvidence(original,collected);
 assert.deepEqual(await identity(original),before);assert.deepEqual(await identity(collected),before);
 assert.deepEqual(await fs.readFile(collected),await fs.readFile(original));
}));
test('JSON reports retain independent copy semantics',()=>fixture(async dir=>{
 const original=path.join(dir,'worker.json'),collected=path.join(dir,'collected.json');
 await fs.writeFile(original,'{"status":"original"}');await fs.writeFile(collected,'{"status":"old target"}');
 await copyWorkerEvidence(original,collected);assert.deepEqual(await fs.readFile(collected),await fs.readFile(original));
 assert.notEqual((await identity(original)).ino,(await identity(collected)).ino);
 await fs.writeFile(collected,'{"status":"changed copy"}');assert.equal(await fs.readFile(original,'utf8'),'{"status":"original"}');
}));
test('an existing byte-identical PNG keeps its own inode and timestamp',()=>fixture(async dir=>{
 const original=path.join(dir,'worker.png'),collected=path.join(dir,'collected.png');
 await fs.writeFile(original,'same bytes');await fs.writeFile(collected,'same bytes');await fs.utimes(collected,1600000100,1600000100);
 const before=await identity(collected);await copyWorkerEvidence(original,collected);assert.deepEqual(await identity(collected),before);
}));
test('a conflicting existing PNG fails without overwriting either original',()=>fixture(async dir=>{
 const original=path.join(dir,'worker.png'),collected=path.join(dir,'collected.png');
 await fs.writeFile(original,'first actual image');await fs.writeFile(collected,'different actual image');
 const before=[await identity(original),await identity(collected)];
 await assert.rejects(copyWorkerEvidence(original,collected),{code:'ERR_WORKER_EVIDENCE_CONFLICT'});
 assert.deepEqual([await identity(original),await identity(collected)],before);
 assert.equal(await fs.readFile(original,'utf8'),'first actual image');assert.equal(await fs.readFile(collected,'utf8'),'different actual image');
}));
test('a missing worker original cannot create a collected PNG',()=>fixture(async dir=>{
 const original=path.join(dir,'missing.png'),collected=path.join(dir,'collected.png');
 await assert.rejects(copyWorkerEvidence(original,collected),{code:'ENOENT'});await assert.rejects(fs.stat(collected),{code:'ENOENT'});
}));
