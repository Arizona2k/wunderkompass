import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import catalog from '../app/world-catalog.json' with {type:'json'};import graph from '../app/world-connections.json' with {type:'json'};import {CHALLENGE_BANK} from '../app/knowledge-challenge.ts';
import {beforeHistoryEvidence,graphBeforeHistoryEvidence,topicBeforeHistoryEvidence,wholeHistoryEvidence,historyEvidenceBoundary as boundary} from './history-evidence-reference.mjs';
import {assertCurrentHistoryEvidenceRuntime,withHistoryEvidencePredecessorRuntime} from './history-evidence-runtime-reference.mjs';import {learningFingerprint} from '../build/learning-fingerprint.mjs';
test('all212 current topics/274 questions/224 edges reconstruct the exact whole accepted M94 predecessor without hiding unrelated, reordered or mixed changes',()=>{
 assert.equal(catalog.length,212);assert.equal(CHALLENGE_BANK.length,274);assert.equal(beforeHistoryEvidence(catalog).length,204);assert.equal(beforeHistoryEvidence(CHALLENGE_BANK).length,240);assert.equal(graphBeforeHistoryEvidence(graph).connections.length,196);
 assert.equal(wholeHistoryEvidence(beforeHistoryEvidence(catalog)),boundary.previousCatalogSHA256);
 for(const change of[rows=>rows[0].intro+=' unreviewed',rows=>rows.pop(),rows=>[rows[0],rows[1]]=[rows[1],rows[0]],rows=>rows.find(r=>r.id==='history-paper').sources.reverse(),rows=>rows.find(r=>r.id==='science-water-cycle').paragraphs[0]+=' unknown']){const bad=structuredClone(catalog);change(bad);assert.throws(()=>beforeHistoryEvidence(bad));}
 for(const change of[rows=>rows[0].why+=' unknown',rows=>rows.pop(),rows=>rows.find(r=>r.id==='history-kilwa:mini').answers.reverse()]){const bad=structuredClone(CHALLENGE_BANK);change(bad);assert.throws(()=>beforeHistoryEvidence(bad));}
 for(const row of boundary.changedTopics){const bad=structuredClone(row.after);bad.intro+=' unreviewed';assert.throws(()=>topicBeforeHistoryEvidence(bad));assert.deepEqual(topicBeforeHistoryEvidence(row.before),row.before);}
 const bad=structuredClone(graph);bad.connections[0].why+=' unknown';assert.throws(()=>graphBeforeHistoryEvidence(bad));
});
test('every741 real runtime input is held, all679 accepted M94 inputs reconstruct, and unknown/missing/altered files are rejected without projecting them into a qualified source',()=>{
 const root=process.cwd(),current=assertCurrentHistoryEvidenceRuntime(root);assert.equal(current.size,741);assert.equal(withHistoryEvidencePredecessorRuntime(root,learningFingerprint),'68f3b45724224e9f');
 for(const mutate of[p=>fs.writeFileSync(path.join(p,'app/unreviewed-history.ts'),'export const unknown=true;\n'),p=>fs.unlinkSync(path.join(p,'app/progress-sync.ts')),p=>{const f=path.join(p,'app/cahokia-earth-evidence.tsx'),b=fs.readFileSync(f);fs.unlinkSync(f);fs.writeFileSync(f,Buffer.concat([b,Buffer.from('// unknown\n')]));}]){
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'wk-history-negative-'));try{for(const[n,file]of current){const dest=path.join(out,n);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.linkSync(file,dest);}assertCurrentHistoryEvidenceRuntime(out);mutate(out);assert.throws(()=>assertCurrentHistoryEvidenceRuntime(out));let actual;const value=withHistoryEvidencePredecessorRuntime(out,p=>{actual=p;return learningFingerprint(p);});assert.equal(actual,out);assert.equal(value,learningFingerprint(out));}finally{fs.rmSync(out,{recursive:true,force:false});}
 }
 assertCurrentHistoryEvidenceRuntime(root);
});
