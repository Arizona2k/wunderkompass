import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/nature-retained-runtime-predecessor.json' with {type:'json'};
const sha=b=>createHash('sha256').update(b).digest('hex'),whole=row=>sha(JSON.stringify(row)),history=fixture.historyField;
export function naturePredecessors(items){
 if(items.length<220)return items; // Older exact layers keep all their predicates.
 const expected=[...fixture.whole220PredecessorDossiers,...fixture.new34ContentOnlyBeforeActualUI];
 if(items.length===220){assert.deepEqual(items.map(row=>({id:row.id,sha256:whole(row)})),fixture.whole220PredecessorDossiers.map(({ui,...row})=>row));return items;}
 assert.equal(items.length,254);assert.deepEqual(items.map(row=>row.id),expected.map(row=>row.id));assert.equal(new Set(items.map(row=>row.id)).size,254);
 const currentFile=new URL('./fixtures/editorial-before-nature-220.json',import.meta.url),qualified=fs.existsSync(currentFile)?JSON.parse(fs.readFileSync(currentFile,'utf8')):null;
 const restored=items.map((row,index)=>{
  const original=structuredClone(row);
  if(qualified){assert.deepEqual(row.ui,{...qualified.currentTemplate,route:index<220?expected[index].ui.route:expected[index].route});if(index<220){assert.deepEqual(row[history],expected[index].ui);original.ui=original[history];delete original[history];}else{assert(!Object.hasOwn(row,history));delete original.ui;}}
  else{assert(!Object.hasOwn(row,history),'no premature Nature UI history');if(index>=220)assert(!Object.hasOwn(row,'ui'),'no unproved current Nature UI');}
  assert.equal(whole(original),expected[index].sha256,'entire previous dossier/content-only Nature retained: '+row.id);return original;
 });return restored.slice(0,220);
}
export function withNaturePreRetainedRuntime(root,inspect){
 const actual=learningFingerprint(root);if(actual!==fixture.currentRuntimeBuild)return inspect(root);
 const current=new Map(learningInputs(root).map(file=>[path.relative(root,file),file])),expected=[...fixture.predecessorInputs,...fixture.addedInputs],replaced=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 assert.deepEqual(new Set(current.keys()),new Set(expected.map(row=>row.name)),'all623 runtime inputs enumerated, no selective inverse');
 for(const row of fixture.predecessorInputs){const change=replaced.get(row.name);assert.equal(sha(fs.readFileSync(current.get(row.name))),change?.currentSHA256??row.sha256,row.name);if(change){assert.equal(sha(change.originalUTF8),row.sha256);assert.equal(change.originalSHA256,row.sha256);}}
 for(const row of fixture.addedInputs)assert.equal(sha(fs.readFileSync(current.get(row.name))),row.sha256,row.name);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wk-nature-whole-retained-'));
 try{for(const row of fixture.predecessorInputs){const target=path.join(temp,row.name);fs.mkdirSync(path.dirname(target),{recursive:true});const change=replaced.get(row.name);if(change)fs.writeFileSync(target,change.originalUTF8);else{try{fs.linkSync(current.get(row.name),target);}catch(error){if(error.code!=='EXDEV')throw error;fs.copyFileSync(current.get(row.name),target);}}}assert.equal(learningFingerprint(temp),fixture.predecessorRuntimeBuild,'whole actual M89 recomputed from all578 original inputs');return inspect(temp);}
 finally{fs.rmSync(temp,{recursive:true,force:false});}
}
