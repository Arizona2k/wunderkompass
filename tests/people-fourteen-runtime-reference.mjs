import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/people-fourteen-runtime-predecessor.json' with {type:'json'};
const sha=body=>createHash('sha256').update(body).digest('hex');

export function assertCurrentFourteenRuntime(root){
 const current=new Map(learningInputs(root).map(file=>[path.relative(root,file),file]));
 const replacements=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 assert.equal(fixture.previousInputs.length,623);assert.equal(fixture.addedInputs.length,36);assert.equal(fixture.replacedInputs.length,20);for(const name of ['app/update-history.ts','app/update-history-test-evidence.json'])assert(replacements.has(name),'two explicitly reconciled chronology inputs');
 const all=[...fixture.previousInputs,...fixture.addedInputs];
 assert.equal(new Set(all.map(row=>row.name)).size,659);
 assert.deepEqual(new Set(current.keys()),new Set(all.map(row=>row.name)),'every659 current input enumerated, including future unknown files');
 for(const row of all){
  const change=replacements.get(row.name),body=fs.readFileSync(current.get(row.name));
  assert.equal(body.length,change?.currentBytes??row.bytes,row.name+' actual current bytes');
  assert.equal(sha(body),change?.currentSHA256??row.sha256,row.name+' whole current body');
  if(change){assert.equal(Buffer.byteLength(change.originalUTF8),row.bytes);assert.equal(sha(change.originalUTF8),row.sha256);assert.equal(change.originalSHA256,row.sha256);}
 }
 assert.equal(learningFingerprint(root),fixture.currentRuntimeBuild,'actual current complete fingerprint');
 return current;
}

// Exact release boundary: every current runtime body and the entire previous
// corrected623-input runtime must match the independently pinned fixture.
// Unknown sources are never rewritten into a known historical source.
export function withFourteenPredecessorRuntime(root,inspect){
 if(learningFingerprint(root)!==fixture.currentRuntimeBuild)return inspect(root);
 const current=assertCurrentFourteenRuntime(root),changes=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wk-next14-whole-corrective-predecessor-'));
 try{
  for(const row of fixture.previousInputs){
   const target=path.join(temp,row.name);fs.mkdirSync(path.dirname(target),{recursive:true});const change=changes.get(row.name);
   if(change)fs.writeFileSync(target,change.originalUTF8);
   else{try{fs.linkSync(current.get(row.name),target);}catch(error){if(error.code!=='EXDEV')throw error;fs.copyFileSync(current.get(row.name),target);}}
  }
  assert.equal(learningInputs(temp).length,623);
  assert.equal(learningFingerprint(temp),fixture.previousRuntimeBuild,'actual whole corrected camera runtime restored, before its own existing historical inverse');
  return inspect(temp);
 }finally{fs.rmSync(temp,{recursive:true,force:false});}
}
