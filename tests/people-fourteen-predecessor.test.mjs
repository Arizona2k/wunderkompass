import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import {beforeFourteenDossiers} from './people-fourteen-dossier-reference.mjs';
import {assertCurrentFourteenRuntime,withFourteenPredecessorRuntime} from './people-fourteen-runtime-reference.mjs';
import {withNaturePreRetainedRuntime,naturePredecessors} from './nature-predecessor-reference.mjs';
import runtime from './fixtures/people-fourteen-runtime-predecessor.json' with {type:'json'};
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));

test('fourteen-person release boundary preserves all268 whole dossiers and rejects source, fact, history, missing, duplicate and premature UI changes',()=>{
 const rows=read('content/editorial-reviews.json').dossiers,body=JSON.stringify(rows);
 assert.equal(rows.length,268);const prior=beforeFourteenDossiers(rows);
 assert.equal(prior.length,254);assert.equal(naturePredecessors(prior).length,220);
 for(const [name,mutate] of [
  ['missing new person',r=>r.pop()],
  ['reordered previous dossiers',r=>[r[0],r[1]]=[r[1],r[0]]],
  ['changed previous scientific explanation',r=>r[0].explanation+=' changed'],
  ['changed nested previous UI history',r=>r[0].ui.report+=' changed'],
  ['changed preserved related-data history',r=>{const row=r.find(x=>x.historicalDataHashBeforePeopleFourteenBacklinks20261104);row.historicalDataHashBeforePeopleFourteenBacklinks20261104='0'.repeat(64);}],
  ['changed current related-data identity',r=>{const row=r.find(x=>x.historicalDataHashBeforePeopleFourteenBacklinks20261104);row.dataHash='0'.repeat(64);}],
  ['changed new anchored source',r=>r[254].sources[0].url='https://invalid.example/unreviewed'],
  ['changed new explanation',r=>r[267].explanation+=' changed'],
  ['unqualified new UI',r=>r[254].ui={build:'invented',visible:true}],
  ['unqualified previous UI history',r=>r[0].historicalUIBeforePeopleFourteen20261104={build:'invented'}],
  ['unknown additional dossier',r=>r.push({...r[267],id:'topics-people:invented'})],
 ]){const bad=structuredClone(rows);mutate(bad);assert.throws(()=>beforeFourteenDossiers(bad),name);}
 assert.equal(JSON.stringify(rows),body);
});

test('fourteen-person runtime boundary verifies every659 input, reconstructs the exact corrected623 predecessor and never masks unknown or changed inputs',()=>{
 const root=process.cwd(),original=learningFingerprint(root);assertCurrentFourteenRuntime(root);
 const prior=withFourteenPredecessorRuntime(root,p=>({build:learningFingerprint(p),inputs:learningInputs(p).length}));
 assert.deepEqual(prior,{build:runtime.previousRuntimeBuild,inputs:623});
 const older=withNaturePreRetainedRuntime(root,p=>({build:learningFingerprint(p),inputs:learningInputs(p).length}));
 assert.deepEqual(older,{build:'378594e764fac3f0',inputs:578});
 const rewrite=(file,change)=>{const before=fs.readFileSync(file);fs.unlinkSync(file);fs.writeFileSync(file,change(before));};
 for(const [name,mutate]of [
  ['unknown future runtime file',p=>fs.writeFileSync(path.join(p,'app/unreviewed-next14-countercase.ts'),'export const unreviewed=true;\n')],
  ['changed corrected camera',p=>rewrite(path.join(p,'app/globe.tsx'),b=>Buffer.concat([b,Buffer.from('\n// unreviewed\n')]))],
  ['missing new actual photo',p=>fs.unlinkSync(path.join(p,'public/world/people/henrietta-swan-leavitt-960.webp'))],
  ['changed named new source',p=>rewrite(path.join(p,'app/world-catalog.json'),b=>{const data=JSON.parse(b);data.find(t=>t.id==='person-henrietta_swan_leavitt').sources[0].url='https://invalid.example/unreviewed';return Buffer.from(JSON.stringify(data,null,2)+'\n');})],
 ]){
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'wk-next14-actual-runtime-countercase-'));
  try{
   for(const file of learningInputs(root)){const target=path.join(temporary,path.relative(root,file));fs.mkdirSync(path.dirname(target),{recursive:true});fs.linkSync(file,target);}
   mutate(temporary);assert.throws(()=>assertCurrentFourteenRuntime(temporary),name);
   let inspected;const actual=withFourteenPredecessorRuntime(temporary,p=>{inspected=p;return learningFingerprint(p);});
   assert.equal(inspected,temporary,'unknown whole source reaches the unchanged inner checks');
   assert.notEqual(actual,runtime.currentRuntimeBuild);assert.notEqual(actual,runtime.previousRuntimeBuild);
  }finally{fs.rmSync(temporary,{recursive:true,force:false});}
 }
 assert.equal(learningFingerprint(root),original);assertCurrentFourteenRuntime(root);
});
