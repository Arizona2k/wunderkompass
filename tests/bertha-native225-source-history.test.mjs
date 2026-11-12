import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {collectInventory} from '../scripts/content-inventory.mjs';
import {validateDossierContent} from '../scripts/editorial-contract.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {dossiersBeforeHistoryEvidence,wholeHistoryDossier} from './history-individual-dossiers-reference.mjs';
import {assertCurrentHistoryEvidenceRuntime} from './history-evidence-runtime-reference.mjs';
import {catalogBeforeNative226,dossiersBeforeNative226,runtimeBodyBeforeNative226} from './history-native226-source-reference.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const registry=dossiersBeforeNative226(read('content/editorial-reviews.json').dossiers),editorial=read('tests/fixtures/history-individual-dossiers-M94-predecessor.json'),boundary=read('tests/fixtures/history-evidence-M94-predecessor.json'),catalog=catalogBeforeNative226(read('app/world-catalog.json'));
test('native225 source correction keeps every whole previous300 qualified dossier and every earlier288 history',()=>{
 const layer=editorial.sourceAvailabilityAfterNative22520261109;assert(layer);assert.equal(layer.id,'topics-people:person-bertha_benz');assert.equal(layer.previousQualifiedUITemplate.build,'218265c24fb36c25');
 assert.equal(wholeHistoryDossier(editorial.qualifiedUILayer.routes),layer.unchangedQualifiedRoutesSHA256);
 const restore=rows=>{const result=rows.map((row,i)=>{const route=editorial.qualifiedUILayer.routes[i];assert.equal(row.id,route.id);const r=structuredClone(row);assert(r.ui);r.ui={...layer.previousQualifiedUITemplate,route:route.route};return r;});const index=result.findIndex(r=>r.id===layer.id);assert(index>=0);result[index]=structuredClone(layer.beforeQualifiedDossier);assert.equal(wholeHistoryDossier(result),layer.previousWholeQualifiedDossiersSHA256);return result;};
 const previous=restore(registry);assert.equal(previous.length,300);assert.equal(dossiersBeforeHistoryEvidence(registry).length,288);
 const current=registry.find(r=>r.id===layer.id),topic=catalog.find(t=>'topics-people:'+t.id===layer.id),inv=collectInventory(),record=inv.records.find(r=>r.id===layer.id),knownIds=new Set(inv.records.map(r=>r.id));
 assert.deepEqual(validateDossierContent(current,record,{knownIds}).errors,[]);assert.equal(current.dataHash,wholeHistoryDossier(topic));
 assert.deepEqual(current.sources.map(s=>s.url),topic.sources.map(s=>s.url));assert.equal(current.sources.length,3);
 assert(current.claims.some(c=>c.sourceId==='source-pforzheim-20261109'&&c.statement.includes('1849bis1944')));
 assert(current.claims.some(c=>c.sourceId==='source-qatar-20261109'&&c.statement.includes('finanziell')));
 assert(!current.sources.some(s=>s.url.includes('group.mercedes-benz.com')));assert(layer.beforeQualifiedDossier.sources.some(s=>s.url.includes('group.mercedes-benz.com')));
 for(const key of ['reviewedOn','teachingDataHash','goal','explanation','example','hint','feedback','modelLimits','ageLevels','media','historicalSourceBeforeNative221Replacement20261106'])assert.deepEqual(current[key],layer.beforeQualifiedDossier[key],key+' genuine prior review preserved');
 for(const mutate of[rows=>rows.pop(),rows=>rows.reverse(),rows=>{rows[0].goal+=' unknown';},rows=>{delete rows[0].ui;}]){const rows=structuredClone(registry);mutate(rows);assert.throws(()=>restore(rows));}
 const original=layer.beforeQualifiedDossier;try{layer.beforeQualifiedDossier={...original,reviewedOn:'2026-11-09'};assert.throws(()=>restore(registry));}finally{layer.beforeQualifiedDossier=original;}
});
test('one actual source/attribution change reconstructs all741 prior runtime bodies and exact2182 build without changing old answers or models',()=>{
 const layer=boundary.sourceAvailabilityAfterNative22520261109;assert(layer);assert.equal(layer.topicId,'person-bertha_benz');const current=catalog.find(t=>t.id===layer.topicId);assert.deepEqual(current,layer.afterTopic);
 for(const key of Object.keys(layer.beforeTopic))if(!['sources','more','sourceNote','revision'].includes(key))assert.deepEqual(current[key],layer.beforeTopic[key],key+' unaffected');assert.deepEqual(current.more.slice(1),layer.beforeTopic.more.slice(1));assert.equal(current.revision,layer.beforeTopic.revision+1);
 const previous=structuredClone(catalog);previous[previous.findIndex(t=>t.id===layer.topicId)]=structuredClone(layer.beforeTopic);const body=Buffer.from(JSON.stringify(previous,null,2)+'\n');assert.equal(body.length,layer.previousCurrentCatalogBytes);assert.equal(sha(body),layer.previousCurrentCatalogSHA256);
 const mapLayer=boundary.mapReadingReturnCorrection20261109;assert.equal(mapLayer.previousCurrentRuntimeBuild,'ab8dd03876b3985b');assert.deepEqual(mapLayer.replacedInputs.map(r=>r.file),['app/activity-view.mjs','app/hash-route.ts','app/topic-map.css','app/topic-map.tsx']);const mapOriginals=new Map(mapLayer.replacedInputs.map(r=>[r.file,Buffer.from(r.originalUTF8)]));const inputs=assertCurrentHistoryEvidenceRuntime(process.cwd());assert.equal(inputs.size,741);assert.equal(layer.previousCurrentInputs.length,741);const out=fs.mkdtempSync(path.join(os.tmpdir(),'wk-source225-exact-prior-'));
 try{for(const row of layer.previousCurrentInputs){const target=path.join(out,row.file);fs.mkdirSync(path.dirname(target),{recursive:true});if(row.file==='app/world-catalog.json')fs.writeFileSync(target,body);else if(mapOriginals.has(row.file))fs.writeFileSync(target,mapOriginals.get(row.file));else if(['app/discovery.css','app/science-thinking.json'].includes(row.file))fs.writeFileSync(target,runtimeBodyBeforeNative226(row.file,fs.readFileSync(inputs.get(row.file))));else fs.linkSync(inputs.get(row.file),target);const b=fs.readFileSync(target);assert.equal(b.length,row.bytes);assert.equal(sha(b),row.sha256);}
  assert.equal(learningFingerprint(out),layer.previousCurrentRuntimeBuild);assert.equal(layer.previousCurrentRuntimeBuild,'218265c24fb36c25');assert.throws(()=>assertCurrentHistoryEvidenceRuntime(out),'a whole historical build cannot pretend to be the corrected current runtime');
  const mixed=structuredClone(previous);mixed.find(t=>t.id===layer.topicId).sourceNote=current.sourceNote;assert.notEqual(sha(Buffer.from(JSON.stringify(mixed,null,2)+'\n')),layer.previousCurrentCatalogSHA256,'mixed source/attribution does not recover a prior original');
 }finally{fs.rmSync(out,{recursive:true,force:false});}
});
