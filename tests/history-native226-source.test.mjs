import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {assertCurrentHistoryEvidenceRuntime} from './history-evidence-runtime-reference.mjs';
import {dossiersBeforeHistoryEvidence} from './history-individual-dossiers-reference.mjs';
import {native226SourceBoundary as boundary,catalogBeforeNative226,dossiersBeforeNative226,wholeNative226,runtimeBodyBeforeNative226,boundaryBeforeHattushaSourceReplacement,catalogBeforeHattushaSourceReplacement,dossiersBeforeHattushaSourceReplacement,boundaryBeforeCaralSourceReplacement,catalogBeforeCaralSourceReplacement,dossiersBeforeCaralSourceReplacement,runtimeBoundaryBeforeCaralSourceReplacement,boundaryBeforeKewSourceReplacement,catalogBeforeKewSourceReplacement,dossiersBeforeKewSourceReplacement,runtimeBoundaryBeforeKewSourceReplacement,thinkingBeforeKewSourceReplacement,boundaryBeforeHumboldtSourceReplacement,catalogBeforeHumboldtSourceReplacement,dossiersBeforeHumboldtSourceReplacement,runtimeBoundaryBeforeHumboldtSourceReplacement} from './history-native226-source-reference.mjs';
import {assertHistorySourceMaterial} from './browser/history-source-material.mjs';
import currentMaterial from './fixtures/history-native226-source-material.json' with {type:'json'};
import {materialBeforeNative228} from './history-native228-two-source-reference.mjs';
const material=materialBeforeNative228(currentMaterial);
import priorQualifiedNative226 from './fixtures/history-native226-source-predecessor.json' with {type:'json'};
import {assertNative227SourceUI,materialBeforeNative227Timbuktu} from './history-native227-timbuktu-source-reference.mjs';
const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const catalog=read('app/world-catalog.json'),registry=read('content/editorial-reviews.json').dossiers;

// Source checks keep the exact previous UI; only the separately admitted technical
// layer may replace it, with its whole prior route/UI still checked explicitly.
function assertSourceUI(actual,previous,layer=boundary.qualifiedUILayer){
 assertNative227SourceUI(actual,previous,layer,priorQualifiedNative226.qualifiedUILayer,boundary.currentBuild);
}

test('the named23 access repairs and attributed Khipu dates preserve every old whole topic and300/288 dossiers',()=>{
 assert.equal(boundary.topicChanges.length,15);assert.equal(boundary.topicChanges.filter(r=>r.id.startsWith('history-')).length,13);assert.equal(material.sources.length,25);
 const old=catalogBeforeNative226(catalog);assert.equal(wholeNative226(old),boundary.previousCatalogSHA256);
 assert.equal(JSON.stringify(old,null,2)+'\n',boundary.previousCatalogOriginalUTF8);
 const prior=dossiersBeforeNative226(registry);assert.equal(wholeNative226(prior),boundary.previousWholeDossiersSHA256);assert.equal(dossiersBeforeHistoryEvidence(registry).length,288);
 for(const change of boundary.topicChanges.filter(r=>r.id.startsWith('history-'))){
  const current=catalog.find(t=>t.id===change.id);assert.deepEqual(current,change.after);
  for(const key of Object.keys(change.before))if(!['sources','sourceNote','revision',...(change.id==='history-khipu'?['paragraphs','facts']:[])].includes(key))assert.deepEqual(current[key],change.before[key],change.id+' '+key);
  const dossier=registry.find(r=>r.id==='topics-history:'+change.id),previous=prior.find(r=>r.id===dossier.id);
  assert.equal(dossier.dataHash,wholeNative226(current));assert.equal(dossier.aiSelfReview.dataHash,dossier.dataHash);
  assert.equal(dossier.reviewedOn,previous.reviewedOn);assertSourceUI(dossier,previous);
  assert.deepEqual(dossier.sources.map(s=>s.url),current.sources.map(s=>s.url));assert.deepEqual(dossier.media,previous.media);
 }
 const khipu=catalog.find(t=>t.id==='history-khipu');assert(khipu.paragraphs[2].includes('1425–1532'));assert(khipu.paragraphs[2].includes('1450–1532'));assert(khipu.paragraphs[2].includes('14/3866'));
 for(const mutate of[x=>x.pop(),x=>x.reverse(),x=>{x[0].intro+=' unknown';},x=>{x.find(t=>t.id==='history-khipu').sources.reverse();}]){const bad=structuredClone(catalog);mutate(bad);assert.throws(()=>catalogBeforeNative226(bad));}
 for(const mutate of[x=>x.pop(),x=>x.reverse(),x=>{x[0].goal+=' unknown';},x=>{const r=x.find(r=>r.id==='topics-history:history-khipu');r[boundary.historyField].reviewedOn='2026-11-10';},x=>{x[299].ui.build='invented';}]){const bad=structuredClone(registry);mutate(bad);assert.throws(()=>dossiersBeforeNative226(bad));}
});
test('all741 actual preceding runtime files reconstruct exact8352; a mixed repaired catalog cannot impersonate it',()=>{
 const current=assertCurrentHistoryEvidenceRuntime(process.cwd()),out=fs.mkdtempSync(path.join(os.tmpdir(),'wk-source226-prior-'));
 try{
  for(const row of boundary.previousInputs){const target=path.join(out,row.file);fs.mkdirSync(path.dirname(target),{recursive:true});if(row.file==='app/world-catalog.json')fs.writeFileSync(target,boundary.previousCatalogOriginalUTF8);else if(boundary.additionalRuntimeRepairs20261110.some(repair=>repair.file===row.file))fs.writeFileSync(target,runtimeBodyBeforeNative226(row.file,fs.readFileSync(current.get(row.file))));else{try{fs.linkSync(current.get(row.file),target);}catch(e){if(e.code!=='EXDEV')throw e;fs.copyFileSync(current.get(row.file),target);}}const body=fs.readFileSync(target);assert.equal(body.length,row.bytes);assert.equal(createHash('sha256').update(body).digest('hex'),row.sha256);}
  assert.equal(learningFingerprint(out),boundary.previousBuild);assert.equal(boundary.previousBuild,'8352ded76fa6da24');assert.throws(()=>assertCurrentHistoryEvidenceRuntime(out));
  fs.writeFileSync(path.join(out,'app/world-catalog.json'),JSON.stringify(catalogBeforeHattushaSourceReplacement(catalog),null,2)+'\n');assert.equal(learningFingerprint(out),boundary.beforeHomeRepairCurrentBuild);assert.equal(boundary.beforeHomeRepairCurrentBuild,'8431b823fec1df47');assert.notEqual(learningFingerprint(out),boundary.previousBuild);fs.writeFileSync(path.join(out,'app/discovery.css'),boundary.additionalRuntimeRepairs20261110[0].afterUTF8);assert.equal(learningFingerprint(out),boundaryBeforeHattushaSourceReplacement().currentBuild);fs.writeFileSync(path.join(out,'app/world-catalog.json'),JSON.stringify(catalog,null,2)+'\n');assert.notEqual(learningFingerprint(out),boundary.currentBuild,'new catalog with historical inquiry is a mixed revision');fs.writeFileSync(path.join(out,'app/science-thinking.json'),fs.readFileSync('app/science-thinking.json'));assert.equal(learningFingerprint(out),boundary.currentBuild);
 }finally{fs.rmSync(out,{recursive:true,force:false});}
});
test('HTTP200 archive banners, unrelated pages, missing factual passages and wrong JSON studies fail closed',()=>{
 for(const source of material.sources.filter(s=>s.kind!=='json')){
  const sample={requested:source.url,actualURL:source.url,responseURL:source.url,httpStatus:200,contentType:'text/html',title:source.titleTerms.join(' '),body:source.bodyAnchors.join(' ')+' '.repeat(250)};
  assert.equal(assertHistorySourceMaterial(sample).case,source.case);
  for(const patch of[{httpStatus:403},{title:'Just a moment...'},{actualURL:'https://example.com/unrelated'},{responseURL:'https://example.com/unrelated'},{body:'Wayback Machine archived page navigation '.repeat(20)},{body:sample.body.replace(source.bodyAnchors[0],'absent')},{contentType:'application/json'}])assert.throws(()=>assertHistorySourceMaterial({...sample,...patch}));
 }
 assert.throws(()=>assertHistorySourceMaterial({requested:'https://web.archive.org/web/20200101000000/https://example.com/unread'}));
 const source=material.previousCaralJSONSource20261111,body=JSON.stringify({resultList:{result:[{id:'11326098',source:'MED',doi:'10.1126/science.1059519',abstractText:'The central zone comprises65 hectares and dates2627–1977 BC. '+'.'.repeat(220)}]}}),sample={requested:source.url,actualURL:source.url,responseURL:source.url,httpStatus:200,contentType:'application/json',title:'',body};
 assert.equal(assertHistorySourceMaterial(sample).case,17);
 for(const text of[body.replace('11326098','12345678'),body.replace('65 hectares','other area'),body.replace('"MED"','"PMC"')])assert.throws(()=>assertHistorySourceMaterial({...sample,body:text}));
});

test('the confirmed home wrap keeps exact prior source boundary, whole CSS and741-input identity; unknown CSS cannot borrow either history',()=>{
 const homeBoundary=boundaryBeforeHattushaSourceReplacement();const repairs=homeBoundary.additionalRuntimeRepairs20261110;assert.equal(repairs.length,1);const repair=repairs[0];assert.equal(repair.file,'app/discovery.css');
 assert.equal(runtimeBodyBeforeNative226(repair.file,Buffer.from(repair.afterUTF8)).toString(),repair.beforeUTF8);
 for(const body of[repair.afterUTF8+'/* unknown */',repair.beforeUTF8+'/* unknown */'])assert.throws(()=>runtimeBodyBeforeNative226(repair.file,Buffer.from(body)));
 const prior=structuredClone(homeBoundary);prior.currentBuild=prior.beforeHomeRepairCurrentBuild;prior.currentInputs=prior.currentInputs.map(row=>row.file===repair.file?{file:repair.file,bytes:repair.beforeBytes,sha256:repair.beforeSHA256}:row);assert.equal(wholeNative226(prior.currentInputs),homeBoundary.beforeHomeRepairCurrentInputsSHA256);
 for(const key of['beforeHomeRepairCurrentBuild','beforeHomeRepairCurrentInputsSHA256','beforeHomeRepairBoundarySHA256','additionalRuntimeRepairs20261110','qualifiedUILayer'])delete prior[key];
 assert.equal(createHash('sha256').update(JSON.stringify(prior,null,2)+'\n').digest('hex'),homeBoundary.beforeHomeRepairBoundarySHA256,'the complete original8431source-boundary file, including whole previous topic/dossier histories');
});

test('the equivalent Hattusha primary source preserves every whole intermediate topic/dossier and prior boundary',()=>{
 const previous=boundaryBeforeHattushaSourceReplacement(),old=catalogBeforeHattushaSourceReplacement(catalog),prior=dossiersBeforeHattushaSourceReplacement(registry);
 assert.equal(wholeNative226(old),previous.currentCatalogSHA256);assert.equal(prior.length,300);
 const current=catalog.find(t=>t.id==='history-hattusha'),before=old.find(t=>t.id===current.id);
 for(const key of Object.keys(before))if(!['sources','sourceNote','revision'].includes(key))assert.deepEqual(current[key],before[key]);
 assert.equal(current.sources[2].url,'https://www.uni-wuerzburg.de/aktuelles/pressemitteilungen/single/news/neue-indogermanische-sprache/');assert.equal(material.sources.at(-1).case,25);
 const record=registry.find(d=>d.id==='topics-history:history-hattusha'),earlier=prior.find(d=>d.id===record.id);assert.equal(record.reviewedOn,earlier.reviewedOn);assert.deepEqual(record.media,earlier.media);
 for(const mutate of [x=>x.reverse(),x=>{x[0].intro+=' unknown';},x=>{x.find(t=>t.id==='history-hattusha').sources.reverse();}]){const bad=structuredClone(catalog);mutate(bad);assert.throws(()=>catalogBeforeHattushaSourceReplacement(bad));}
 for(const mutate of [x=>x.pop(),x=>x.reverse(),x=>{x.find(d=>d.id==='topics-history:history-hattusha').individualDossierBeforeHattushaSourceReplacement20261111.reviewedOn='invented';}]){const bad=structuredClone(registry);mutate(bad);assert.throws(()=>dossiersBeforeHattushaSourceReplacement(bad));}
});

test('the current741 runtime boundary preserves its complete preceding Native/Home file',()=>{
 const previous=boundaryBeforeHattushaSourceReplacement(),runtime=read('tests/fixtures/history-evidence-M94-predecessor.json');
 assert.equal(runtime.currentRuntimeBuild,boundary.currentBuild);assert.deepEqual(runtime.currentInputs,boundary.currentInputs);
 const old=runtimeBoundaryBeforeCaralSourceReplacement(runtime);old.currentRuntimeBuild=previous.currentBuild;old.currentInputs=structuredClone(previous.currentInputs);
 const values=boundary.additionalSourceRepair20261111.previousRuntimeBoundaryValues;assert.deepEqual(values.map(x=>x.path),[["currentCatalogSHA256"],["newTopics",4],["replacedInputs",14,"currentBytes"],["replacedInputs",14,"currentSHA256"]]);
 for(const item of values){let parent=old;for(const key of item.path.slice(0,-1))parent=parent[key];parent[item.path.at(-1)]=structuredClone(item.value);}
 assert.equal(createHash('sha256').update(JSON.stringify(old,null,2)+'\n').digest('hex'),'4daaa5298712f4d8bff6728720e847b5390745be4b9af152244150a1f2ad471d');assert.equal(boundary.additionalSourceRepair20261111.previousRuntimeBoundarySHA256,'4daaa5298712f4d8bff6728720e847b5390745be4b9af152244150a1f2ad471d');
});

test('the readable Caral abstract retains the entire preceding JMU boundary, original whole topic/dossier and741runtime boundary',()=>{
 const before=boundaryBeforeCaralSourceReplacement(),old=catalogBeforeCaralSourceReplacement(catalog),records=dossiersBeforeCaralSourceReplacement(registry);assert.equal(wholeNative226(old),before.currentCatalogSHA256);assert.deepEqual(records.map(r=>({id:r.id,sha256:wholeNative226(r)})),before.currentContentDossiers);
 const now=catalog.find(r=>r.id==='history-caral'),prior=old.find(r=>r.id===now.id);for(const key of Object.keys(prior))if(!['sources','sourceNote','revision'].includes(key))assert.deepEqual(now[key],prior[key]);assert.equal(now.sources[1].url,'https://bibbase.org/network/publication/shadysolis-haas-creamer-datingcaralapreceramicsiteinthesupevalleyonthecentralcoastofperu-2001');assert.equal(records.find(r=>r.id==='topics-history:history-caral').reviewedOn,registry.find(r=>r.id==='topics-history:history-caral').reviewedOn);
 assert.equal(runtimeBoundaryBeforeCaralSourceReplacement(read('tests/fixtures/history-evidence-M94-predecessor.json')).currentRuntimeBuild,'56d6a5055fc2ac50');const damagedRuntime=read('tests/fixtures/history-evidence-M94-predecessor.json');damagedRuntime.currentRuntimeBuild='invented';assert.throws(()=>runtimeBoundaryBeforeCaralSourceReplacement(damagedRuntime));
 for(const mutate of[x=>x.reverse(),x=>{x.find(r=>r.id==='history-caral').intro+=' unknown';}]){const bad=structuredClone(catalog);mutate(bad);assert.throws(()=>catalogBeforeCaralSourceReplacement(bad));}
 const bad=structuredClone(registry);bad.find(r=>r.id==='topics-history:history-caral').individualDossierBeforeCaralSourceReplacement20261111.reviewedOn='invented';assert.throws(()=>dossiersBeforeCaralSourceReplacement(bad));
});

test('all25 previous source-material records and strict legacyJSON evidence remain exactly recoverable after the human-readable Caral replacement',()=>{
 assert.equal(material.sources.length,25);const prior=structuredClone(materialBeforeNative227Timbuktu(material));delete prior.previousCaralJSONSource20261111;prior.sources[16]=structuredClone(material.previousCaralJSONSource20261111);assert.equal(createHash('sha256').update(JSON.stringify(prior,null,2)+'\n').digest('hex'),boundary.caralSourceRepair20261111.previousMaterialSHA256);
 const source=material.sources.find(s=>s.case===17),body=source.bodyAnchors.join(' ')+' '.repeat(250),sample={requested:source.url,actualURL:source.url,responseURL:source.url,httpStatus:200,contentType:'text/html',title:source.titleTerms.join(' '),body};assert.equal(assertHistorySourceMaterial(sample).case,17);assert.throws(()=>assertHistorySourceMaterial({...sample,body:body.replace('10.1126/science.1059519','10.0000/unrelated')}));
});

test('one blocked Kew reference is replaced at both actual locations while preserving the whole6615 and M94 states',()=>{
 const before=boundaryBeforeKewSourceReplacement(),old=catalogBeforeKewSourceReplacement(catalog),records=dossiersBeforeKewSourceReplacement(registry),runtime=read('tests/fixtures/history-evidence-M94-predecessor.json');assert.equal(before.currentBuild,'6615d36ec4bb3d3c');assert.equal(wholeNative226(old),before.currentCatalogSHA256);assert.deepEqual(records.map(r=>({id:r.id,sha256:wholeNative226(r)})),before.currentContentDossiers);assert.equal(runtimeBoundaryBeforeKewSourceReplacement(runtime).currentRuntimeBuild,'6615d36ec4bb3d3c');
 const now=catalog.find(r=>r.id==='science-photosynthesis'),prior=old.find(r=>r.id==='science-photosynthesis');for(const k of Object.keys(prior))if(!['sources','sourceNote','revision'].includes(k))assert.deepEqual(now[k],prior[k]);assert.equal(now.sources.length,4);assert.equal(now.sources[0].url,'https://www.rhs.org.uk/advice/understanding-plants/how-plants-use-light-to-grow');const thinking=read('app/science-thinking.json').entries.find(r=>r.id==='science-photosynthesis');assert.deepEqual(thinking.sources,now.sources.map(r=>r.url));
 const repaired=registry.find(r=>r.id==='topics-science:science-photosynthesis'),earlier=records.find(r=>r.id===repaired.id);assert.equal(repaired.reviewedOn,earlier.reviewedOn);assertSourceUI(repaired,earlier);assert.deepEqual(repaired.media,earlier.media);assert.equal(repaired.dataHash,wholeNative226(now));assert.equal(repaired.sources[0].checkedOn,'2026-11-11');assert.deepEqual(repaired.sources.slice(1),earlier.sources.slice(1));
 const repair=boundary.additionalRuntimeRepairs20261110.find(r=>r.file==='app/science-thinking.json'),current=fs.readFileSync(repair.file),previous=runtimeBodyBeforeNative226(repair.file,current);assert.equal(previous.toString(),repair.beforeUTF8);const oldThinking=JSON.parse(previous).entries.find(r=>r.id==='science-photosynthesis');assert.deepEqual(thinking.stages,oldThinking.stages);assert.deepEqual(thinkingBeforeKewSourceReplacement(read('app/science-thinking.json')),JSON.parse(previous));for(const mutate of[x=>x.entries.reverse(),x=>{x.entries[0].id='invented';},x=>{x.entries.find(r=>r.id==='science-photosynthesis').stages[0].goal+=' unknown';}]){const bad=read('app/science-thinking.json');mutate(bad);assert.throws(()=>thinkingBeforeKewSourceReplacement(bad));}for(const body of [Buffer.concat([current,Buffer.from(' ')]),Buffer.concat([previous,Buffer.from(' ')])])assert.throws(()=>runtimeBodyBeforeNative226(repair.file,body));
 const bad=structuredClone(runtime);bad.currentRuntimeBuild='invented';assert.throws(()=>runtimeBoundaryBeforeKewSourceReplacement(bad));const changed=structuredClone(catalog);changed.find(r=>r.id==='science-photosynthesis').question.answers.reverse();assert.throws(()=>catalogBeforeKewSourceReplacement(changed));const wrong=structuredClone(registry);wrong.find(r=>r.id==='topics-science:science-photosynthesis').individualDossierBeforeKewSourceReplacement20261111.reviewedOn='invented';assert.throws(()=>dossiersBeforeKewSourceReplacement(wrong));
});

test('the two Humboldt access replacements preserve whole578c and every older source/runtime/dossier state',()=>{
 const before=boundaryBeforeHumboldtSourceReplacement(),old=catalogBeforeHumboldtSourceReplacement(catalog),records=dossiersBeforeHumboldtSourceReplacement(registry),runtime=read('tests/fixtures/history-evidence-M94-predecessor.json');assert.equal(before.currentBuild,'578c870fbf2148cc');assert.equal(wholeNative226(old),before.currentCatalogSHA256);assert.deepEqual(records.map(r=>({id:r.id,sha256:wholeNative226(r)})),before.currentContentDossiers);assert.equal(runtimeBoundaryBeforeHumboldtSourceReplacement(runtime).currentRuntimeBuild,'578c870fbf2148cc');
 const now=catalog.find(r=>r.id==='person-alexander_humboldt'),prior=old.find(r=>r.id==='person-alexander_humboldt');for(const key of Object.keys(prior))if(!['sources','sourceNote','revision'].includes(key))assert.deepEqual(now[key],prior[key]);assert.equal(now.sources.length,5);assert.equal(now.sources[1].url,'https://www.humboldt-foundation.de/entdecken/alexander-von-humboldt');assert.equal(now.sources[2].url,'https://idw-online.de/de/attachmentdata85663');assert.deepEqual([now.sources[0],now.sources[3],now.sources[4]],[prior.sources[0],prior.sources[3],prior.sources[4]]);
 const row=registry.find(r=>r.id==='topics-people:person-alexander_humboldt'),earlier=records.find(r=>r.id===row.id);assert.deepEqual(row.individualDossierBeforeHumboldtSourceReplacement20261111,earlier);assert.equal(row.reviewedOn,earlier.reviewedOn);assert.deepEqual(row.media,earlier.media);assertSourceUI(row,earlier);assert.equal(row.dataHash,wholeNative226(now));assert(row.sources.filter((_,i)=>[1,2].includes(i)).every(r=>r.checkedOn==='2026-11-11'));assert.deepEqual(row.sources.filter((_,i)=>![1,2].includes(i)),earlier.sources.filter((_,i)=>![1,2].includes(i)));
 for(const mutate of[x=>x.reverse(),x=>{x.find(r=>r.id==='person-alexander_humboldt').question.answers.reverse();},x=>{x.find(r=>r.id==='person-alexander_humboldt').sources[2].url='https://example.org/unrelated.pdf';}]){const bad=structuredClone(catalog);mutate(bad);assert.throws(()=>catalogBeforeHumboldtSourceReplacement(bad));}
 for(const mutate of[x=>x.pop(),x=>{x.find(r=>r.id==='topics-people:person-alexander_humboldt').individualDossierBeforeHumboldtSourceReplacement20261111.reviewedOn='invented';},x=>{x.find(r=>r.id==='topics-people:person-alexander_humboldt').ui.build='invented';}]){const bad=structuredClone(registry);mutate(bad);assert.throws(()=>dossiersBeforeHumboldtSourceReplacement(bad));}const badRuntime=structuredClone(runtime);badRuntime.changedTopics.at(-1).after.question.answers.reverse();assert.throws(()=>runtimeBoundaryBeforeHumboldtSourceReplacement(badRuntime));
});

test('the two exact source UI checks accept the admitted whole current layer and reject invented routes or lost prior UI',()=>{
 const routes=registry.map(row=>({id:row.id,route:row.ui.route,previousUI:structuredClone(row.ui)}));
 const template={...registry[0].ui,build:boundary.currentBuild};delete template.route;
 const layer={currentTemplate:template,routes};
 for(const id of ['topics-people:person-alexander_humboldt','topics-science:science-photosynthesis']){
  const previous=registry.find(r=>r.id===id),actual={...previous,ui:{...template,route:previous.ui.route}};
  assertSourceUI(previous,previous,null);assertSourceUI(actual,previous,layer);
  for(const mutate of[x=>{x.ui.build='invented';},x=>{x.ui.route='#world/topic/unrelated';}]){const bad=structuredClone(actual);mutate(bad);assert.throws(()=>assertSourceUI(bad,previous,layer));}
  const damaged=structuredClone(layer);damaged.routes.find(r=>r.id===id).previousUI.build='invented';assert.throws(()=>assertSourceUI(actual,previous,damaged));
 }
});
