import {withHistoryEvidencePredecessorRuntime} from './history-evidence-runtime-reference.mjs';
import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/water-photosynthesis-M93-runtime-predecessor.json' with {type:'json'};
const sha=body=>createHash('sha256').update(body).digest('hex');
export function assertCurrentWaterPhotosynthesisRuntime(root){
 assert.equal(fixture.acceptedMerge,'0bd0af71aa558a475122cc2fa6e56ab27da4bc03');assert.equal(fixture.previousInputs.length,677);assert.equal(fixture.addedInputs.length,2);assert.equal(fixture.replacedInputs.length,13);
 const current=new Map(learningInputs(root).map(file=>[path.relative(root,file),file])),changed=new Map(fixture.replacedInputs.map(row=>[row.name,row])),all=[...fixture.previousInputs,...fixture.addedInputs];
 assert.equal(all.length,679);assert.equal(new Set(all.map(row=>row.name)).size,679);assert.deepEqual(new Set(current.keys()),new Set(all.map(row=>row.name)),'every679 actual runtime input, including all unrelated media and UI');
 for(const row of all){const change=changed.get(row.name),body=fs.readFileSync(current.get(row.name));assert.equal(body.length,change?.currentBytes??row.bytes,row.name+' whole current size');assert.equal(sha(body),change?.currentSHA256??row.sha256,row.name+' whole current body');if(change){assert.equal(Buffer.byteLength(change.originalUTF8),row.bytes);assert.equal(sha(change.originalUTF8),row.sha256,'whole actually confirmed M93 predecessor: '+row.name);}}
 assert.equal(learningFingerprint(root),fixture.currentRuntimeBuild);return current;
}
function withWaterPhotosynthesisAtM94(root,inspect){
 if(learningFingerprint(root)!==fixture.currentRuntimeBuild)return inspect(root);
 const current=assertCurrentWaterPhotosynthesisRuntime(root),changed=new Map(fixture.replacedInputs.map(row=>[row.name,row])),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'wk-water-photo-whole-M93-'));
 try{
  for(const row of fixture.previousInputs){const dest=path.join(temporary,row.name);fs.mkdirSync(path.dirname(dest),{recursive:true});const change=changed.get(row.name);if(change)fs.writeFileSync(dest,change.originalUTF8);else{try{fs.linkSync(current.get(row.name),dest);}catch(error){if(error.code!=='EXDEV')throw error;fs.copyFileSync(current.get(row.name),dest);}}}
  assert.equal(learningInputs(temporary).length,677);assert.equal(learningFingerprint(temporary),fixture.previousRuntimeBuild,'entire actually accepted M93 runtime, not selected old predicates');return inspect(temporary);
 }finally{fs.rmSync(temporary,{recursive:true,force:false});}
}

export const withWaterPhotosynthesisPredecessorRuntime=(root,inspect)=>withHistoryEvidencePredecessorRuntime(root,prior=>withWaterPhotosynthesisAtM94(prior,inspect));
