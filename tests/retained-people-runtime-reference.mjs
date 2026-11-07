import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/retained-people-runtime-predecessor.json' with {type:'json'};
const sha=b=>createHash('sha256').update(b).digest('hex');
export function assertCurrentRetainedPeopleRuntime(root){
 const current=new Map(learningInputs(root).map(file=>[path.relative(root,file),file]));
 const changes=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 assert.equal(fixture.acceptedMerge,'40698293cc7fbc3ce9751b0620eebb164ea031cb');
 assert.equal(fixture.previousInputs.length,659);assert.equal(fixture.addedInputs.length,18);assert.equal(changes.size,15);
 assert(changes.has('app/book-mechanics-figure.tsx'),'the independently verified M92 renderer has one explicitly named reference-color replacement');
 assert(changes.has('app/learning-journeys.tsx'),'the confirmed Firefox chapter-photo mount correction has one explicitly named whole M92 predecessor');
 const all=[...fixture.previousInputs,...fixture.addedInputs];assert.equal(new Set(all.map(row=>row.name)).size,677);
 assert.deepEqual(new Set(current.keys()),new Set(all.map(row=>row.name)),'every677 runtime input enumerated, unknown and missing inputs rejected');
 for(const row of all){
  const change=changes.get(row.name),body=fs.readFileSync(current.get(row.name));
  assert.equal(body.length,change?.currentBytes??row.bytes,row.name+' actual current whole size');
  assert.equal(sha(body),change?.currentSHA256??row.sha256,row.name+' actual current whole body');
  if(change){assert.equal(Buffer.byteLength(change.originalUTF8),row.bytes);assert.equal(sha(change.originalUTF8),row.sha256,'whole accepted M92 original: '+row.name);}
 }
 assert.equal(learningFingerprint(root),fixture.currentRuntimeBuild);return current;
}
export function withRetainedPeoplePredecessorRuntime(root,inspect){
 // Historical runtimes still reach their original strict predicates unchanged.
 // Unknown current bodies are not selectively normalised into a known source.
 if(learningFingerprint(root)!==fixture.currentRuntimeBuild)return inspect(root);
 const current=assertCurrentRetainedPeopleRuntime(root),changes=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'wk-retained18-whole-M92-'));
 try{
  for(const row of fixture.previousInputs){const target=path.join(temporary,row.name);fs.mkdirSync(path.dirname(target),{recursive:true});const change=changes.get(row.name);
   if(change)fs.writeFileSync(target,change.originalUTF8);
   else{try{fs.linkSync(current.get(row.name),target);}catch(e){if(e.code!=='EXDEV')throw e;fs.copyFileSync(current.get(row.name),target);}}
  }
  assert.equal(learningInputs(temporary).length,659);assert.equal(learningFingerprint(temporary),fixture.previousRuntimeBuild,'entire actually accepted M92 runtime restored');
  return inspect(temporary);
 }finally{fs.rmSync(temporary,{recursive:true,force:false});}
}
