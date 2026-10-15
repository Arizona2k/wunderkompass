import test from 'node:test';import assert from 'node:assert/strict';import {assertSnapshot,validateCollectedProofs}from'../scripts/quality-artifacts.mjs';
const snapshot={runId:'1234',attempt:'1',testedCommit:'a'.repeat(40),sourceDigest:'b'.repeat(64),build:'c'.repeat(16)};
const proofs=()=>['chromium','firefox','webkit'].map(kind=>({kind,status:'passed',...snapshot,seconds:10,files:[{file:'actual.json',bytes:1,sha256:'d'.repeat(64)}]}));
test('separate runner evidence cannot pass with a missing/failed job, mixed commit/build/digest, duplicate kind or empty proof',()=>{
 assert.doesNotThrow(()=>validateCollectedProofs(proofs(),snapshot));
 for(const change of [p=>{p[1].runId='1233';},p=>{p[2].attempt='2';},p=>p.pop(),p=>{p[0].kind='firefox';},p=>{p[1].testedCommit='e'.repeat(40);},p=>{p[2].sourceDigest='e'.repeat(64);},p=>{p[0].build='e'.repeat(16);},p=>{p[1].status='running';},p=>{p[1].seconds=0;},p=>{p[0].files=[];},p=>{delete p[2].sourceDigest;}]){const p=proofs();change(p);assert.throws(()=>validateCollectedProofs(p,snapshot));}
 assert.throws(()=>assertSnapshot({testedCommit:'same',sourceDigest:'same',build:'same',runId:'local',attempt:'1'},{testedCommit:'same',sourceDigest:'same',build:'same',runId:'local',attempt:'1'}),/Malformed/);
});

import {engineComplete}from'../scripts/handoff.mjs';
import journeys from'../app/journey-index.json' with{type:'json'};
import terms from'../app/book-learning-index.json' with{type:'json'};
import questions from'../app/book-why-index.json' with{type:'json'};
test('actual engines require every original chapter, book/Why viewport case and complete offline recovery',()=>{
 const widths=[320,390,768,1440],engine={version:'actual engine',chapters:journeys.map(j=>j.id+':0'),widths,bookTerms:terms,bookObserved:terms.flatMap(name=>widths.map(width=>({name,width}))),whyQuestions:questions,whyObserved:questions.flatMap(question=>widths.map(width=>({question,width}))),offlineResilience:{networkRecovery:true,completeAssets:true,offlineReload:true,passPreserved:true}};
 assert.equal(!!engineComplete(engine),true);
 for(const change of [e=>{e.chapters[0]='invented:0';},e=>{e.bookObserved.pop();},e=>{e.whyObserved[0]=e.whyObserved[1];},e=>{delete e.offlineResilience;},e=>{e.offlineResilience.passPreserved=false;}]){const e=structuredClone(engine);change(e);assert.equal(!!engineComplete(e),false);}
});
