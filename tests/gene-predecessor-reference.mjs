import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import {geneHistoryReference} from './gene-history-reference.mjs';
import fixture from './fixtures/gene-cell-runtime-predecessor.json' with {type:'json'};
const sha=b=>createHash('sha256').update(b).digest('hex');
// This strictly reconstructs the completed predecessor's historical contract.
// New content without UI remains unqualified by the final editorial verifier.
export function genePredecessors(items){
 const qualified=path.join(import.meta.dirname,'fixtures/editorial-before-gene-156.json');
 if(fs.existsSync(qualified)){
  const current=JSON.parse(fs.readFileSync(qualified,'utf8')),reference=geneHistoryReference(current,current.currentTemplate);
  reference.assertCurrentGeneSharedUI(items);items=items.slice(0,156).map(reference.beforeGeneUI);
 }else{
  assert.equal(items.length,166,'exact156 delivered records and ten individually unqualified drafts');
  const additions=items.slice(156);
  assert(additions.every(row=>!Object.hasOwn(row,'ui')),'no provisional UI can enter the pre-full historical projection');
  assert.deepEqual(additions.map(row=>({id:row.id,sha256:sha(JSON.stringify(row))})),fixture.newTenContentOnlyBeforeActualUI,'each complete content-only draft stays exact until genuine full UI binding');
  items=items.slice(0,156);
 }
 assert.deepEqual(items.map(row=>({id:row.id,sha256:sha(JSON.stringify(row))})),fixture.whole156PredecessorDossiers,'every whole delivered156 dossier and nested history retained in exact order');
 return items;
}
export function withCellPreGeneRuntime(root,inspect){
 const current=new Map(learningInputs(root).map(p=>[path.relative(root,p),p])),expected=new Set([...fixture.predecessorInputs,...fixture.addedInputs].map(r=>r.name));
 assert.deepEqual(new Set(current.keys()),expected,'no unenumerated new or missing genetics runtime input');
 assert.equal(learningFingerprint(root),fixture.currentRuntimeBuild,'actual measured genetics runtime required');
 const replaced=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 for(const row of fixture.predecessorInputs){const previous=replaced.get(row.name);assert.equal(sha(fs.readFileSync(current.get(row.name))),previous?.currentSHA256??row.sha256,row.name+' exact current bytes');if(previous){assert.equal(sha(previous.originalUTF8),row.sha256);assert.equal(previous.originalSHA256,row.sha256);}}
 for(const row of fixture.addedInputs)assert.equal(sha(fs.readFileSync(current.get(row.name))),row.sha256,row.name+' exact added bytes');
 const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'wk-gene-delivered-cell-'));
 try{
  for(const row of fixture.predecessorInputs){const target=path.join(temporary,row.name);fs.mkdirSync(path.dirname(target),{recursive:true});const previous=replaced.get(row.name);if(previous)fs.writeFileSync(target,previous.originalUTF8);else{try{fs.linkSync(current.get(row.name),target);}catch(error){if(error.code!=='EXDEV')throw error;fs.copyFileSync(current.get(row.name),target);}}}
  const actual=learningFingerprint(temporary);assert.equal(actual,fixture.predecessorRuntimeBuild,'genuine predecessor fingerprint recomputed from reconstructed bytes');return inspect(temporary);
 }finally{fs.rmSync(temporary,{recursive:true,force:false});}
}
