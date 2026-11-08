import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/history-evidence-M94-predecessor.json' with {type:'json'};
const sha=body=>createHash('sha256').update(body).digest('hex');
export function assertCurrentHistoryEvidenceRuntime(root){
 assert.equal(fixture.acceptedMerge,'b53f75f72f1be726b03ec602016931c41f4cfda4');assert.equal(fixture.previousInputs.length,679);assert.equal(fixture.addedInputs.length,62);assert.equal(fixture.currentInputs.length,741);
 const current=new Map(learningInputs(root).map(file=>[path.relative(root,file),file]));assert.deepEqual(new Set(current.keys()),new Set(fixture.currentInputs.map(r=>r.file)),'every741 actual input, including all previous media and storage helpers');
 for(const row of fixture.currentInputs){const b=fs.readFileSync(current.get(row.file));assert.equal(b.length,row.bytes,row.file+' whole current size');assert.equal(sha(b),row.sha256,row.file+' whole current bytes');}
 assert.equal(learningFingerprint(root),fixture.currentRuntimeBuild);return current;
}
export function withHistoryEvidencePredecessorRuntime(root,inspect){
 if(learningFingerprint(root)!==fixture.currentRuntimeBuild)return inspect(root);
 const current=assertCurrentHistoryEvidenceRuntime(root),changes=new Map(fixture.replacedInputs.map(row=>[row.file,row])),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'wk-history-whole-M94-'));
 try{for(const row of fixture.previousInputs){const dest=path.join(temporary,row.file);fs.mkdirSync(path.dirname(dest),{recursive:true});const changed=changes.get(row.file);if(changed){const body=Buffer.from(changed.originalUTF8);assert.equal(body.length,row.bytes);assert.equal(sha(body),row.sha256);fs.writeFileSync(dest,body);}else{try{fs.linkSync(current.get(row.file),dest);}catch(e){if(e.code!=='EXDEV')throw e;fs.copyFileSync(current.get(row.file),dest);}}}assert.equal(learningInputs(temporary).length,679);assert.equal(learningFingerprint(temporary),fixture.previousRuntimeBuild,'whole actual accepted M94 runtime restored before older assertions');return inspect(temporary);}
 finally{fs.rmSync(temporary,{recursive:true,force:false});}
}
