import {withEcologyPreRetainedRuntime} from './retained-predecessor-reference.mjs';
import {withAstronomyPreEcologyRuntime,ECOLOGY_CURRENT_RUNTIME} from './ecology-predecessor-reference.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import fixture from './fixtures/digital-statistics-runtime-predecessor.json' with {type:'json'};
import {astronomyPredecessors,withDigitalPreAstronomyRuntime,ASTRONOMY_CURRENT_RUNTIME} from './astronomy-predecessor-reference.mjs';

const sha=value=>createHash('sha256').update(value).digest('hex');
const whole=value=>sha(JSON.stringify(value));
const history='historicalUIBeforeDigital20261101';

// A current UI fixture can only be created after genuine integrated full and
// visual qualification. Until then the twelve individual reviews are content-only.
export function digitalPredecessors(items){
 if(items.length>=190)items=astronomyPredecessors(items);
 assert.equal(items.length,189);
 const expected=[...fixture.whole177PredecessorDossiers,...fixture.newTwelveContentOnlyBeforeActualUI];
 assert.deepEqual(items.map(row=>row.id),expected.map(row=>row.id));
 assert.equal(new Set(items.map(row=>row.id)).size,189);
 const file=new URL('./fixtures/editorial-before-digital-177.json',import.meta.url);
 const qualified=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
 const restored=items.map((row,index)=>{
  const original=structuredClone(row);
  if(qualified){
   assert.deepEqual(row.ui,{...qualified.currentTemplate,route:expected[index].ui?.route??qualified.addedDossiers[index-177]?.route});
   if(index<177){assert.deepEqual(row[history],expected[index].ui);original.ui=original[history];delete original[history];}
   else{assert(!Object.hasOwn(row,history));delete original.ui;}
  }else{
   assert(!Object.hasOwn(row,history),'no premature Digital UI history');
   if(index>=177)assert(!Object.hasOwn(row,'ui'),'no invented Digital full UI proof');
  }
  assert.equal(whole(original),expected[index].sha256,'whole individually reviewed dossier unchanged: '+row.id);
  return original;
 });
 return restored.slice(0,177);
}

export function withStatisticsPreDigitalRuntime(root,inspect){return withEcologyPreRetainedRuntime(root,prior=>originalwithStatisticsPreDigitalRuntime(prior,inspect));}
function originalwithStatisticsPreDigitalRuntime(root,inspect){
 if(learningFingerprint(root)===ECOLOGY_CURRENT_RUNTIME)return withAstronomyPreEcologyRuntime(root,prior=>withStatisticsPreDigitalRuntime(prior,inspect));
 if(learningFingerprint(root)===ASTRONOMY_CURRENT_RUNTIME)return withDigitalPreAstronomyRuntime(root,prior=>withStatisticsPreDigitalRuntime(prior,inspect));
 const current=new Map(learningInputs(root).map(file=>[path.relative(root,file),file]));
 const build=learningFingerprint(root);
 if(build===fixture.predecessorRuntimeBuild){
  assert.deepEqual(new Set(current.keys()),new Set(fixture.predecessorInputs.map(row=>row.name)));
  for(const row of fixture.predecessorInputs)assert.equal(sha(fs.readFileSync(current.get(row.name))),row.sha256,row.name);
  return inspect(root);
 }
 assert.equal(build,fixture.currentRuntimeBuild,'unreviewed Digital runtime');
 assert.deepEqual(new Set(current.keys()),new Set([...fixture.predecessorInputs,...fixture.addedInputs].map(row=>row.name)),'all current runtime inputs enumerated');
 const replaced=new Map(fixture.replacedInputs.map(row=>[row.name,row]));
 for(const row of fixture.predecessorInputs){const replacement=replaced.get(row.name);assert.equal(sha(fs.readFileSync(current.get(row.name))),replacement?.currentSHA256??row.sha256,row.name);if(replacement){assert.equal(sha(replacement.originalUTF8),row.sha256);assert.equal(replacement.originalSHA256,row.sha256);}}
 for(const row of fixture.addedInputs)assert.equal(sha(fs.readFileSync(current.get(row.name))),row.sha256,row.name);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wk-digital-delivered-statistics-'));
 try{
  for(const row of fixture.predecessorInputs){const to=path.join(temp,row.name);fs.mkdirSync(path.dirname(to),{recursive:true});const old=replaced.get(row.name);if(old)fs.writeFileSync(to,old.originalUTF8);else fs.copyFileSync(current.get(row.name),to);}
  assert.equal(learningFingerprint(temp),fixture.predecessorRuntimeBuild,'actual M85 recomputed from all original bytes');
  return inspect(temp);
 }finally{fs.rmSync(temp,{recursive:true,force:false});}
}
