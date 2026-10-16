import {buildingProofCases} from './fixtures/building-proof.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import {assertSnapshot,validateCollectedProofs}from'../scripts/quality-artifacts.mjs';
const snapshot={runId:'1234',attempt:'1',testedCommit:'a'.repeat(40),sourceDigest:'b'.repeat(64),build:'c'.repeat(16)};
const proofs=()=>['chromium','firefox','webkit'].map(kind=>({kind,status:'passed',...snapshot,seconds:10,files:[{file:'actual.json',bytes:1,sha256:'d'.repeat(64)},...(kind==='chromium'?[]:[320,390,768,1440].map(width=>({file:'journey-engine-'+kind+'-'+width+'.png',bytes:1,sha256:'e'.repeat(64)})))]}));
test('separate runner evidence cannot pass with a missing/failed job, mixed commit/build/digest, duplicate kind or empty proof',()=>{
 assert.doesNotThrow(()=>validateCollectedProofs(proofs(),snapshot));
 for(const change of [p=>{p[1].runId='1233';},p=>{p[2].attempt='2';},p=>p.pop(),p=>{p[0].kind='firefox';},p=>{p[1].testedCommit='e'.repeat(40);},p=>{p[2].sourceDigest='e'.repeat(64);},p=>{p[0].build='e'.repeat(16);},p=>{p[1].status='running';},p=>{p[1].seconds=0;},p=>{p[0].files=[];},p=>{delete p[2].sourceDigest;}]){const p=proofs();change(p);assert.throws(()=>validateCollectedProofs(p,snapshot));}
 assert.throws(()=>assertSnapshot({testedCommit:'same',sourceDigest:'same',build:'same',runId:'local',attempt:'1'},{testedCommit:'same',sourceDigest:'same',build:'same',runId:'local',attempt:'1'}),/Malformed/);
 for(const kind of ['firefox','webkit'])for(const width of [320,390,768,1440]){const p=proofs();p.find(p=>p.kind===kind).files=p.find(p=>p.kind===kind).files.filter(f=>f.file!=='journey-engine-'+kind+'-'+width+'.png');assert.throws(()=>validateCollectedProofs(p,snapshot),/Missing required engine image/);}
});

test('final image budget accounts for every actually uploaded PNG once, including intermediate engine widths',()=>{
 const p=proofs(),review={storage:{retainedImages:8},retainedBytes:8};assert.doesNotThrow(()=>validateCollectedProofs(p,snapshot,review));
 for(const changed of [{...review,retainedBytes:7},{...review,storage:{retainedImages:7}}])assert.throws(()=>validateCollectedProofs(p,snapshot,changed),/Uploaded screenshot accounting/);
 const duplicate=proofs();duplicate[0].files.push({...duplicate[1].files[1]});assert.throws(()=>validateCollectedProofs(duplicate,snapshot,{storage:{retainedImages:9},retainedBytes:9}),/Uploaded screenshot accounting/);
});

import {engineComplete,scheduleComplete,requiredInventionModels}from'../scripts/handoff.mjs';
test('balanced workers start after all isolated samples, foundation and news without adding a fourth worker',()=>{
 const schedule={mode:'balanced-three-workers',performanceSamples:21,performanceCompletedSeconds:30,bookStartedSeconds:140.1,foundationCompletedSeconds:110,newsCompletedSeconds:140,peakWorkers:3};assert.equal(scheduleComplete(schedule),true);
 for(const change of [s=>{delete s.mode;},s=>{s.performanceSamples=20;},s=>{s.bookStartedSeconds=29;},s=>{s.foundationCompletedSeconds=29;},s=>{s.newsCompletedSeconds=100;},s=>{s.peakWorkers=4;},s=>{s.peakWorkers=0;},s=>{s.foundationCompletedSeconds=NaN;},s=>{s.performanceCompletedSeconds=-1;}]){const s={...schedule};change(s);assert.equal(scheduleComplete(s),false);}
 assert.equal(scheduleComplete(null),false);
});
import journeys from'../app/journey-index.json' with{type:'json'};
import terms from'../app/book-learning-index.json' with{type:'json'};
import natureIds from '../app/nature-entry-ids.json' with{type:'json'};
import questions from'../app/book-why-index.json' with{type:'json'};
import worldIndex from '../app/world-index.json' with{type:'json'};
const inventionIds=worldIndex.filter(t=>t.category==='inventions').map(t=>t.id);
import {INVENTION_EXPERIMENTS} from '../app/invention-experiment-contract.mjs';
test('actual engines require every original chapter, book/Why viewport case and complete offline recovery',()=>{
 const widths=[320,390,768,1440],engine={buildingObserved:buildingProofCases([320,390,768,1440]),inventionModelObserved:requiredInventionModels.flatMap(t=>[320,390,768,1440].map(width=>({id:t.id,kind:t.inventionModel,width,states:[...INVENTION_EXPERIMENTS[t.inventionModel].states],effectsVerified:true}))),inventionIds,inventionObserved:inventionIds.flatMap(id=>widths.map(width=>({id,width}))),phaseSeconds:{inventions:1,buildings:1},offlineRetention:{multipleTabs:true,partialNeverReplacesFallback:true,unknownLegacyProtected:true,orphanCleanup:true,stoppedServerOldChunk:true,canaryPreserved:true},natureIds,natureObserved:natureIds.flatMap(id=>[320,390,768,1440].map(width=>({id,width}))),version:'actual engine',chapters:journeys.map(j=>j.id+':0'),widths,bookTerms:terms,bookObserved:terms.flatMap(name=>widths.map(width=>({name,width}))),whyQuestions:questions,whyObserved:questions.flatMap(question=>widths.map(width=>({question,width}))),offlineResilience:{realProgress:true,networkRecovery:true,completeAssets:true,offlineReload:true,serverStopped:true,passPreserved:true}};
 assert.equal(!!engineComplete(engine),true);
 for(const change of [e=>{delete e.buildingObserved;},e=>e.buildingObserved.pop(),e=>{delete e.phaseSeconds.buildings;},e=>{delete e.inventionModelObserved;},e=>e.inventionModelObserved.pop(),e=>e.inventionModelObserved[0].states.pop(),e=>{e.inventionModelObserved[0].effectsVerified=false;},e=>{delete e.inventionObserved;},e=>{e.inventionObserved.pop();},e=>{e.inventionObserved[0]=e.inventionObserved[1];},e=>{e.inventionIds[0]='not-existing';},e=>{delete e.phaseSeconds.inventions;},e=>{delete e.offlineRetention;},e=>{e.offlineRetention.multipleTabs=false;},e=>{delete e.natureObserved;},e=>{e.natureObserved.pop();},e=>{e.natureObserved[0]=e.natureObserved[1];},e=>{delete e.offlineResilience.serverStopped;},e=>{e.chapters[0]='invented:0';},e=>{e.bookObserved.pop();},e=>{e.whyObserved[0]=e.whyObserved[1];},e=>{delete e.offlineResilience;},e=>{e.offlineResilience.passPreserved=false;}]){const e=structuredClone(engine);change(e);assert.equal(!!engineComplete(e),false);}
});
