import {withAstronomyPreEcologyRuntime,ECOLOGY_CURRENT_RUNTIME} from './ecology-predecessor-reference.mjs';
import assert from'node:assert/strict';import fs from'node:fs';import path from'node:path';import os from'node:os';import{createHash}from'node:crypto';import{learningInputs,learningFingerprint}from'../build/learning-fingerprint.mjs';import fixture from'./fixtures/statistics-gene-runtime-predecessor.json'with{type:'json'};
import{digitalPredecessors,withStatisticsPreDigitalRuntime}from'./digital-predecessor-reference.mjs';import digitalFixture from'./fixtures/digital-statistics-runtime-predecessor.json'with{type:'json'};
import{statisticsHistoryReference}from'./statistics-history-reference.mjs';
import {withDigitalPreAstronomyRuntime,ASTRONOMY_CURRENT_RUNTIME} from './astronomy-predecessor-reference.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex'),fp=x=>sha(JSON.stringify(x)),history='historicalUIBeforeStatistics20261031';
export function statisticsPredecessors(items){
 if(items.length>=178)items=digitalPredecessors(items);
 if(items.length===166){assert.deepEqual(items.map(x=>({id:x.id,sha256:fp(x)})),fixture.whole166PredecessorDossiers.map(({ui,...x})=>x),'already reconstructed M84 input must still be every exact whole old dossier');return items;}
 assert.equal(items.length,177);assert.equal(new Set(items.map(x=>x.id)).size,177);assert.deepEqual(items.map(x=>x.id),[...fixture.whole166PredecessorDossiers,...fixture.newElevenContentOnlyBeforeActualUI].map(x=>x.id));
 const qualified='tests/fixtures/editorial-before-statistics-166.json',actual=fs.existsSync(qualified)?JSON.parse(fs.readFileSync(qualified,'utf8')):null;
 const historyReference=actual?statisticsHistoryReference(actual,actual.currentTemplate):null;
 const beforeRevisions=x=>historyReference?historyReference.beforeAllUIRevisions(x):structuredClone(x);
 const prior=items.slice(0,166).map((x,i)=>{
  const p=fixture.whole166PredecessorDossiers[i];assert.equal(x.id,p.id);const original=beforeRevisions(x);

  if(actual){assert.deepEqual(x[history],p.ui);assert.deepEqual(x.ui,{...actual.currentTemplate,route:p.ui.route});original.ui=original[history];delete original[history];}else assert(!Object.hasOwn(x,history),'no premature statistics UI history');
  assert.equal(fp(original),p.sha256,'every entire old M84 dossier and nested history stays exact: '+p.id);return original;
 });
 for(const[x,i]of items.slice(166).map((x,i)=>[x,i])){assert(!Object.hasOwn(x,history));const original=beforeRevisions(x);if(actual){assert.deepEqual(x.ui,{...actual.currentTemplate,route:actual.addedDossiers[i].route});delete original.ui;}else assert(!Object.hasOwn(x,'ui'),'no invented full UI before genuine full');assert.equal(fp(original),fixture.newElevenContentOnlyBeforeActualUI[i].sha256,'whole new individual content-only dossier stays exact');}
 return prior;
}
export function withGenePreStatisticsRuntime(root,inspect){
 if(learningFingerprint(root)===ECOLOGY_CURRENT_RUNTIME)return withAstronomyPreEcologyRuntime(root,prior=>withGenePreStatisticsRuntime(prior,inspect));
 if(learningFingerprint(root)===ASTRONOMY_CURRENT_RUNTIME)return withDigitalPreAstronomyRuntime(root,prior=>withGenePreStatisticsRuntime(prior,inspect));
 if(learningFingerprint(root)===digitalFixture.currentRuntimeBuild)return withStatisticsPreDigitalRuntime(root,prior=>withGenePreStatisticsRuntime(prior,inspect));
 if(learningFingerprint(root)===fixture.predecessorRuntimeBuild){const actual=new Map(learningInputs(root).map(p=>[path.relative(root,p),p]));assert.deepEqual(new Set(actual.keys()),new Set(fixture.predecessorInputs.map(x=>x.name)));for(const x of fixture.predecessorInputs)assert.equal(sha(fs.readFileSync(actual.get(x.name))),x.sha256);return inspect(root);}

 const current=new Map(learningInputs(root).map(p=>[path.relative(root,p),p])),expected=new Set([...fixture.predecessorInputs,...fixture.addedInputs].map(x=>x.name));assert.deepEqual(new Set(current.keys()),expected);assert.equal(learningFingerprint(root),fixture.currentRuntimeBuild);
 const changed=new Map(fixture.replacedInputs.map(x=>[x.name,x]));for(const x of fixture.predecessorInputs){const v=changed.get(x.name);assert.equal(sha(fs.readFileSync(current.get(x.name))),v?.currentSHA256??x.sha256);if(v)assert.equal(sha(v.originalUTF8),x.sha256);}for(const x of fixture.addedInputs)assert.equal(sha(fs.readFileSync(current.get(x.name))),x.sha256);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wk-statistics-delivered-gene-'));try{for(const x of fixture.predecessorInputs){const to=path.join(temp,x.name);fs.mkdirSync(path.dirname(to),{recursive:true});const prior=changed.get(x.name);if(prior)fs.writeFileSync(to,prior.originalUTF8);else fs.copyFileSync(current.get(x.name),to);}assert.equal(learningFingerprint(temp),fixture.predecessorRuntimeBuild,'genuine M84 fingerprint recomputed from exact prior bytes');return inspect(temp);}finally{fs.rmSync(temp,{recursive:true,force:false});}
}
