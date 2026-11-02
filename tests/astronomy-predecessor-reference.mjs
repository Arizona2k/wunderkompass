import {withEcologyPreRetainedRuntime} from './retained-predecessor-reference.mjs';
import {ecologyPredecessors,withAstronomyPreEcologyRuntime,ECOLOGY_CURRENT_RUNTIME} from './ecology-predecessor-reference.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/astronomy-digital-runtime-predecessor.json' with {type:'json'};

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const whole=value=>sha(JSON.stringify(value));
const history='historicalUIBeforeAstronomy20261101';
export const ASTRONOMY_CURRENT_RUNTIME=fixture.currentRuntimeBuild;

// Restore an entire actual delivered predecessor. The optional current UI
// fixture may only be written after genuine complete browser/visual evidence.
export function astronomyPredecessors(items){
 if(items.length>=198)items=ecologyPredecessors(items);
 if(items.length===189){
  assert.deepEqual(items.map(row=>({id:row.id,sha256:whole(row)})),fixture.whole189PredecessorDossiers.map(({ui,...row})=>row),'all189 whole actual M86 dossiers');
  return items;
 }
 const expected=[...fixture.whole189PredecessorDossiers,...fixture.newEightContentOnlyBeforeActualUI];
 assert.equal(items.length,197);assert.equal(new Set(items.map(row=>row.id)).size,197);
 assert.deepEqual(items.map(row=>row.id),expected.map(row=>row.id),'all197 exact identities and order');
 const file=new URL('./fixtures/editorial-before-astronomy-189.json',import.meta.url);
 const qualified=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
 const restored=items.map((row,index)=>{
  const original=structuredClone(row);
  if(qualified){
   assert.deepEqual(row.ui,{...qualified.currentTemplate,route:expected[index].ui?.route??qualified.addedDossiers[index-189]?.route});
   if(index<189){assert.deepEqual(row[history],expected[index].ui);original.ui=original[history];delete original[history];}
   else{assert(!Object.hasOwn(row,history));delete original.ui;}
  }else{
   assert(!Object.hasOwn(row,history),'no premature astronomy history');
   if(index>=189)assert(!Object.hasOwn(row,'ui'),'no invented full astronomy UI');
  }
  assert.equal(whole(original),expected[index].sha256,'every complete predecessor/content-only dossier stays exact '+row.id);
  return original;
 });
 return restored.slice(0,189);
}

export function withDigitalPreAstronomyRuntime(root,inspect){return withEcologyPreRetainedRuntime(root,prior=>originalwithDigitalPreAstronomyRuntime(prior,inspect));}
function originalwithDigitalPreAstronomyRuntime(root,inspect){
 if(learningFingerprint(root)===ECOLOGY_CURRENT_RUNTIME)return withAstronomyPreEcologyRuntime(root,prior=>withDigitalPreAstronomyRuntime(prior,inspect));
 const current=new Map(learningInputs(root).map(file=>[path.relative(root,file),file]));
 const build=learningFingerprint(root);
 if(build===fixture.predecessorRuntimeBuild){
  assert.deepEqual(new Set(current.keys()),new Set(fixture.predecessorInputs.map(row=>row.name)));
  for(const row of fixture.predecessorInputs)assert.equal(sha(fs.readFileSync(current.get(row.name))),row.sha256,row.name);
  return inspect(root);
 }
 assert.equal(build,fixture.currentRuntimeBuild,'unreviewed astronomy runtime');
 assert.deepEqual(new Set(current.keys()),new Set([...fixture.predecessorInputs,...fixture.addedInputs].map(row=>row.name)),'all current astronomy runtime inputs enumerated');
 const replaced=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 for(const row of fixture.predecessorInputs){const replacement=replaced.get(row.name);assert.equal(sha(fs.readFileSync(current.get(row.name))),replacement?.currentSHA256??row.sha256,row.name);if(replacement){assert.equal(sha(replacement.originalUTF8),row.sha256);assert.equal(replacement.originalSHA256,row.sha256);}}
 for(const row of fixture.addedInputs)assert.equal(sha(fs.readFileSync(current.get(row.name))),row.sha256,row.name);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wk-astronomy-delivered-digital-'));
 try{
  for(const row of fixture.predecessorInputs){const to=path.join(temp,row.name);fs.mkdirSync(path.dirname(to),{recursive:true});const prior=replaced.get(row.name);if(prior)fs.writeFileSync(to,prior.originalUTF8);else{try{fs.linkSync(current.get(row.name),to);}catch(error){if(error.code!=='EXDEV')throw error;fs.copyFileSync(current.get(row.name),to);}}}
  assert.equal(learningFingerprint(temp),fixture.predecessorRuntimeBuild,'actual delivered M86 recomputed from all original541 inputs');
  return inspect(temp);
 }finally{fs.rmSync(temp,{recursive:true,force:false});}
}
