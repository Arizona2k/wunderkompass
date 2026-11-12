import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {assertHistorySourceMaterial} from './browser/history-source-material.mjs';
import {assertCurrentHistoryEvidenceRuntime} from './history-evidence-runtime-reference.mjs';
import {native228SourceRepair as repair,catalogBeforeNative228,dossiersBeforeNative228,registryBeforeNative228,runtimeBeforeNative228,materialBeforeNative228} from './history-native228-two-source-reference.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');

test('two source access corrections preserve the entire qualified3d080 registry and both immutable earlier boundaries',()=>{
 const catalog=read('app/world-catalog.json'),registry=read('content/editorial-reviews.json'),old=catalogBeforeNative228(catalog),before=registryBeforeNative228(registry);
 assert.equal(catalog.length,212);assert.equal(registry.dossiers.length,300);assert.equal(repair.topicChanges.length,2);assert.equal(repair.dossierChanges.length,2);
 assert.equal(sha(JSON.stringify(old,null,2)+'\n'),repair.previousCatalogBytesSHA256);assert.equal(sha(JSON.stringify(before,null,2)+'\n'),repair.previousRegistryBytesSHA256);
 assert.equal(sha(fs.readFileSync('tests/fixtures/history-native226-source-predecessor.json')),repair.previousNative226BoundarySHA256);assert.equal(sha(fs.readFileSync('tests/fixtures/history-native227-timbuktu-source-predecessor.json')),repair.previousNative227BoundarySHA256);
 assert.deepEqual(dossiersBeforeNative228(registry.dossiers),before.dossiers);
 for(const change of repair.topicChanges){
  const now=catalog.find(t=>t.id===change.id),previous=old.find(t=>t.id===change.id);assert.deepEqual(now,change.after);assert.deepEqual(previous,change.before);
  for(const key of Object.keys(previous))if(!['sources','sourceNote','revision'].includes(key))assert.deepEqual(now[key],previous[key]);
  const dossier=registry.dossiers.find(d=>d.id==='topics-history:'+change.id),prior=before.dossiers.find(d=>d.id===dossier.id);
  assert.equal(dossier.reviewedOn,prior.reviewedOn);assert.equal(dossier.aiSelfReview.reviewedOn,prior.aiSelfReview.reviewedOn);assert.deepEqual(dossier.media,prior.media);assert.deepEqual(dossier.claims,prior.claims);assert.deepEqual(dossier.links,prior.links);
  assert.equal(dossier.dataHash,sha(JSON.stringify(now)));assert.equal(dossier.aiSelfReview.dataHash,dossier.dataHash);assert.deepEqual(dossier.sources.map(s=>s.url),now.sources.map(s=>s.url));
  if(!repair.qualifiedUILayer)assert.deepEqual(dossier.ui,prior.ui,'source checks alone never invent current UI acceptance');
 }
 assert.equal(catalog.find(t=>t.id==='history-timbuktu').sources[2].url,'https://web.archive.org/web/20260814065154/https://www.loc.gov/exhibits/mali/mali-exhibit.html#obj11');
 assert.equal(catalog.find(t=>t.id==='history-catalhoyuk').sources[0].url,'https://web.archive.org/web/20261102144915/https://catalhoyuk.com/site/architecture');
});

test('the whole741-input current runtime retains the exact earlier bb2 source boundary',()=>{
 assert.equal(assertCurrentHistoryEvidenceRuntime(process.cwd()).size,741);assert.equal(learningFingerprint(process.cwd()),repair.currentBuild);
 const old=runtimeBeforeNative228(read('tests/fixtures/history-evidence-M94-predecessor.json'));
 assert.equal(old.currentRuntimeBuild,'bb2ac7e734d6a6a2');assert.equal(sha(JSON.stringify(old,null,2)+'\n'),repair.previousRuntimeBoundarySHA256);
 for(const mutate of[x=>{x.currentInputs[0].sha256='0'.repeat(64);},x=>{x.newTopics.find(t=>t.id==='history-catalhoyuk').paragraphs[0]+=' unknown';}]){const bad=read('tests/fixtures/history-evidence-M94-predecessor.json');mutate(bad);assert.throws(()=>runtimeBeforeNative228(bad));}
});

test('mixed source changes, changed facts, false review dates, partial UI and changed registry history fail closed',()=>{
 for(const mutate of[x=>x.reverse(),x=>{x.find(t=>t.id==='history-timbuktu').sources.reverse();},x=>{x.find(t=>t.id==='history-catalhoyuk').paragraphs[0]+=' unknown';}]){const bad=read('app/world-catalog.json');mutate(bad);assert.throws(()=>catalogBeforeNative228(bad));}
 for(const mutate of[x=>x.pop(),x=>x.reverse(),x=>{x.find(d=>d.id==='topics-history:history-catalhoyuk').reviewedOn='invented';},x=>{x[0].ui.report+=' unknown';},x=>{delete x.find(d=>d.id==='topics-history:history-timbuktu')[repair.dossierChanges[0].historyField];}]){const bad=read('content/editorial-reviews.json').dossiers;mutate(bad);assert.throws(()=>dossiersBeforeNative228(bad));}
 const registry=read('content/editorial-reviews.json');registry.historyEvidenceAfterNative227TechnicalUIProof20261112.meaning='changed earlier history';assert.throws(()=>registryBeforeNative228(registry));
 const material=read('tests/fixtures/history-native226-source-material.json');material.previousTimbuktuDirectSource20261112.checkedOn='invented';assert.throws(()=>materialBeforeNative228(material));
});

test('both new archive documents and both earlier LOC addresses require exact substantive material and real200 responses',()=>{
 const material=read('tests/fixtures/history-native226-source-material.json'),old=materialBeforeNative228(material);assert.equal(material.sources.length,26);assert.equal(old.sources.length,25);assert.equal(sha(JSON.stringify(old,null,2)+'\n'),repair.previousMaterialSHA256);
 const sources=[material.sources[10],material.sources[25],material.previousTimbuktuDirectSource20261112,material.previousTimbuktuArchivedSource20261112];
 for(const source of sources){
  const sample={requested:source.url,actualURL:source.url,responseURL:source.url,httpStatus:200,contentType:'text/html',title:source.titleTerms.join(' '),body:source.bodyAnchors.join(' ')+' '.repeat(250)};
  assert.equal(assertHistorySourceMaterial(sample).case,source.case);
  for(const patch of[{httpStatus:429},{httpStatus:503},{title:'Access denied'},{actualURL:'chrome-error://chromewebdata/'},{responseURL:undefined},{body:'Archive navigation without the factual document '.repeat(20)},{body:sample.body.replace(source.bodyAnchors[0],'absent')},{contentType:'application/json'}])assert.throws(()=>assertHistorySourceMaterial({...sample,...patch}));
 }
});
