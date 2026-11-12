import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {native227TimbuktuRepair as repair,catalogBeforeNative227Timbuktu,dossiersBeforeNative227Timbuktu,runtimeBeforeNative227Timbuktu,materialBeforeNative227Timbuktu} from './history-native227-timbuktu-source-reference.mjs';
import {assertHistorySourceMaterial} from './browser/history-source-material.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
test('one direct LOC source preserves the entire published12b catalog, qualified300 registry and runtime boundary',()=>{
 const catalog=read('app/world-catalog.json'),registry=read('content/editorial-reviews.json'),prior=catalogBeforeNative227Timbuktu(catalog),dossiers=dossiersBeforeNative227Timbuktu(registry.dossiers);
 assert.equal(sha(fs.readFileSync('tests/fixtures/history-native226-source-predecessor.json')),repair.previousNative226BoundarySHA256);
 assert.equal(sha(JSON.stringify(prior,null,2)+'\n'),repair.previousCatalogBytesSHA256);
 const inverse=structuredClone(registry);inverse.dossiers=dossiers;if(repair.qualifiedUILayer)delete inverse.historyEvidenceAfterNative227TechnicalUIProof20261112;
 assert.equal(sha(JSON.stringify(inverse,null,2)+'\n'),repair.previousRegistryBytesSHA256);
 const now=catalog.find(r=>r.id==='history-timbuktu'),before=prior.find(r=>r.id===now.id);
 for(const key of Object.keys(before))if(!['sources','sourceNote','revision'].includes(key))assert.deepEqual(now[key],before[key]);
 assert.equal(now.sources[2].url,'https://www.loc.gov/exhibits/mali/mali-exhibit.html#obj11');assert.deepEqual(now.sources.slice(0,2),before.sources.slice(0,2));
 const current=registry.dossiers.find(r=>r.id===repair.dossierAfter.id),old=dossiers.find(r=>r.id===current.id);assert.equal(current.reviewedOn,old.reviewedOn);assert.deepEqual(current.media,old.media);assert.deepEqual(current.sources.slice(0,2),old.sources.slice(0,2));
 assert.equal(runtimeBeforeNative227Timbuktu(read('tests/fixtures/history-evidence-M94-predecessor.json')).currentRuntimeBuild,'82c443babfbb64ef');
});
test('damaged order, facts, prior approvals and runtime inputs cannot borrow the exact one-source inverse',()=>{
 for(const mutate of[x=>x.reverse(),x=>{x.find(r=>r.id==='history-timbuktu').paragraphs[0]+=' unknown';},x=>{x.find(r=>r.id==='history-timbuktu').sources.reverse();}]){const bad=read('app/world-catalog.json');mutate(bad);assert.throws(()=>catalogBeforeNative227Timbuktu(bad));}
 for(const mutate of[x=>x.pop(),x=>x.reverse(),x=>{x.find(r=>r.id===repair.dossierAfter.id).reviewedOn='invented';},x=>{x[0].ui.build='invented';}]){const bad=read('content/editorial-reviews.json').dossiers;mutate(bad);assert.throws(()=>dossiersBeforeNative227Timbuktu(bad));}
 const runtime=read('tests/fixtures/history-evidence-M94-predecessor.json');runtime.currentInputs[0].sha256='0'.repeat(64);assert.throws(()=>runtimeBeforeNative227Timbuktu(runtime));
});
test('the same precise Arithmetic Primer material stays mandatory at both original and historical URLs',()=>{
 const m=read('tests/fixtures/history-native226-source-material.json');materialBeforeNative227Timbuktu(m);
 for(const source of[m.sources[10],m.previousTimbuktuArchivedSource20261112]){
  const sample={requested:source.url,actualURL:source.url,responseURL:source.url,httpStatus:200,contentType:'text/html',title:source.titleTerms.join(' '),body:source.bodyAnchors.join(' ')+' '.repeat(250)};
  assert.equal(assertHistorySourceMaterial(sample).case,11);
  for(const change of[{httpStatus:503},{actualURL:'chrome-error://chromewebdata/'},{responseURL:undefined},{title:'Just a moment...'},{body:'Archive navigation banner '.repeat(30)},{body:sample.body.replace('al-Rasmuki','unrelated')},{contentType:'application/json'}])assert.throws(()=>assertHistorySourceMaterial({...sample,...change}));
 }
 const damaged=structuredClone(m);damaged.previousTimbuktuArchivedSource20261112.checkedOn='invented';assert.throws(()=>materialBeforeNative227Timbuktu(damaged));
});
