import {cellHistoryReference} from './cell-history-reference.mjs';
// Preserve the complete delivered M82 contract as a historical assertion.
// This does not qualify the new product's current UI: final verify still
// requires all ten new individual dossiers and a genuine current full binding.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/cell-mechanics-runtime-predecessor.json' with {type:'json'};
const sha=b=>createHash('sha256').update(b).digest('hex');
export function cellPredecessors(items){
 if(fs.existsSync(path.join(import.meta.dirname,'fixtures/editorial-before-cell-146.json'))){
  const current=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'fixtures/editorial-before-cell-146.json'),'utf8')),reference=cellHistoryReference(current,current.currentTemplate);reference.assertCurrentCellSharedUI(items);items=items.slice(0,146).map(reference.beforeCellUI);
 }
 assert.equal(items.length,146,'exact delivered146 historical records required after complete raw156 validation');
 assert.deepEqual(items.map(row=>({id:row.id,sha256:sha(JSON.stringify(row))})),fixture.whole146PredecessorDossiers,'every delivered whole record and nested history retained in order');
 return items;
}
export function mechanicsPreCellFingerprint(root){
 const current=new Map(learningInputs(root).map(p=>[path.relative(root,p),p]));
 const expected=new Set([...fixture.predecessorInputs,...fixture.addedInputs].map(r=>r.name));
 assert.deepEqual(new Set(current.keys()),expected,'no unenumerated new or missing runtime input');
 assert.equal(learningFingerprint(root),fixture.currentRuntimeBuild,'the actual current runtime matches the individually enumerated cell/history changes');
 const replaced=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 for(const row of fixture.predecessorInputs){
  const previous=replaced.get(row.name);assert.equal(sha(fs.readFileSync(current.get(row.name))),previous?.currentSHA256??row.sha256,row.name+' exact current input');
  if(previous){assert.equal(sha(previous.originalUTF8),row.sha256);assert.equal(previous.originalSHA256,row.sha256);}
 }
 for(const row of fixture.addedInputs)assert.equal(sha(fs.readFileSync(current.get(row.name))),row.sha256,row.name+' exact added input');
 const parent=path.join(root,'.qa-output');fs.mkdirSync(parent,{recursive:true});const temporary=fs.mkdtempSync(path.join(parent,'cell-delivered-runtime-'));
 try{
  for(const row of fixture.predecessorInputs){const target=path.join(temporary,row.name);fs.mkdirSync(path.dirname(target),{recursive:true});const previous=replaced.get(row.name);if(previous)fs.writeFileSync(target,previous.originalUTF8);else{try{fs.linkSync(current.get(row.name),target);}catch(error){if(error.code!=='EXDEV')throw error;fs.copyFileSync(current.get(row.name),target);}}}
  // Recompute through the original fingerprint implementation on actual
  // reconstructed bytes. Never return a fixture constant as if it were measured.
  const actual=learningFingerprint(temporary);assert.equal(actual,fixture.predecessorRuntimeBuild);return actual;
 }finally{fs.rmSync(temporary,{recursive:true,force:false});}
}
