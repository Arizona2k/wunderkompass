import test from 'node:test';
import {dossiersBeforeWaterPhotosynthesis} from './water-photosynthesis-reference.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import inquiries from '../app/people-inquiries.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import links from '../app/people-book-links.json' with {type:'json'};
import {worldGameBank} from '../app/world-game-bank.ts';
import {connectionsFor} from '../app/knowledge-connections.ts';
import {learningInputs,learningFingerprint} from '../build/learning-fingerprint.mjs';
import {beforeRetainedPeople,beforeRetainedPeopleGraph,beforeRetainedPeopleBookLinks,beforeRetainedPeopleDossiers,beforeNative221PeopleSourceDossiers,retainedPeopleBoundary as boundary} from './retained-people-reference.mjs';
import {assertCurrentRetainedPeopleRuntime,withRetainedPeoplePredecessorRuntime} from './retained-people-runtime-reference.mjs';
import {assertCurrentFourteenRuntime} from './people-fourteen-runtime-reference.mjs';
import {validateDossier} from '../scripts/editorial-contract.mjs';
const whole=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const named=new Set(boundary.ids);

test('source replacements retain whole earlier dossiers and all five original PDFs; stale UI cannot become current acceptance',()=>{
 const rows=dossiersBeforeWaterPhotosynthesis(JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers);
 for(const id of ['person-ada_lovelace','person-albert_einstein','person-bertha_benz','person-karl_benz','person-johannes_gutenberg']){
  const row=rows.find(r=>r.id==='topics-people:'+id),old=row.historicalSourceBeforeNative221Replacement20261106;
  assert(old?.sources?.length);assert.equal(old.teachingDataHash,row.teachingDataHash);
  assert.notEqual(old.dataHash,row.dataHash);assert.equal(old.ui.build,'9cdd986160a92e7a');
  const record={id:row.id,dataHash:row.dataHash,route:row.ui.route};
  const result=validateDossier({...row,ui:old.ui},record,{build:boundary.currentRuntimeBuild,knownIds:new Set(rows.map(r=>r.id))});
  assert.equal(result.structurallyReady,false);assert(result.errors.includes('current built UI/search/back/offline proof required'));
 }
 const johnson=rows.find(r=>r.id==='topics-people:person-katherine_johnson'),old=johnson.historicalSourceBeforeNASADirectPDF20261106;
 assert.equal(old.sources[1].url,'https://ntrs.nasa.gov/citations/19980227091');
 assert.equal(johnson.sources[1].url,'https://ntrs.nasa.gov/api/citations/19980227091/downloads/19980227091.pdf');
 assert.equal(old.teachingDataHash,johnson.teachingDataHash);if(johnson.ui.build===old.ui.build)assert.deepEqual(old.ui,johnson.ui);else assert.equal(johnson.ui.build,boundary.currentRuntimeBuild);
 assert.notEqual(old.dataHash,johnson.dataHash);assert.equal(old.ui.build,'9cdd986160a92e7a');
 const proof=validateDossier({...johnson,ui:old.ui},{id:johnson.id,dataHash:johnson.dataHash,route:johnson.ui.route},{build:boundary.currentRuntimeBuild,knownIds:new Set(rows.map(r=>r.id))});
 assert.equal(proof.structurallyReady,false);assert(proof.errors.includes('current built UI/search/back/offline proof required'));
 const pdfs=items=>items.filter(t=>t.person).flatMap(t=>t.sources.filter(s=>new URL(s.url).pathname.endsWith('.pdf')).map(s=>s.url));
 // These five originals belong to the retained18 revision before this NASA
 // link correction. The delivered M92 predecessor predates that revision.
 const previousPDFs=[
  'https://archive.computerhistory.org/resources/text/Oral_History/Hopper_Grace/102702026.05.01.pdf',
  'https://www.nobelprizemedicine.org/wp-content/uploads/2015/10/Press_ENG.pdf',
  'https://paper.gatech.edu/sites/default/files/2021-04/The%20Technology%20of%20Paper.pdf',
  'https://www.nasa.gov/wp-content/uploads/2019/09/jemison_mae.pdf',
  'https://www.bbaw.de/files-bbaw/presse/pressemitteilungen/pressemitteilungen-2021/PM-02_Geographie_der_Pflanzen/BBAW_PM_Humboldt.pdf',
 ],currentPDFs=pdfs(catalog);
 assert.equal(previousPDFs.length,5);assert.equal(currentPDFs.length,6);
 for(const url of previousPDFs)assert(currentPDFs.includes(url),'unchanged original primary PDF remains mandatory: '+url);
});

test('retained eighteen add54 individually scoped voluntary tasks without changing previous18 activities or counting new biographies',()=>{
 assert.equal(catalog.length,204);assert.equal(catalog.filter(t=>t.person).length,36);
 assert.equal(inquiries.entries.length,36);assert.equal(beforeRetainedPeople(inquiries.entries).length,18);
 assert.deepEqual(inquiries.entries.slice(18).map(e=>e.id),boundary.ids);assert.equal(new Set(inquiries.entries.map(e=>e.figure)).size,36);
 const additions=inquiries.entries.slice(18);assert.equal(additions.flatMap(e=>e.tasks).length,54);
 for(const entry of additions){
  assert(named.has(entry.id));const topic=catalog.find(t=>t.id===entry.id);assert(topic.person);assert(topic.sources.length>0);
  const dossier=dossiersBeforeWaterPhotosynthesis(JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers).find(row=>row.id==='topics-people:'+entry.id);
  assert(dossier.modelLimits.trim());const media=dossier.media.find(row=>row.path.startsWith('app/people-retained-evidence/'));assert(media&&fs.existsSync(media.path));for(const field of ['license','credit','alt','learningPurpose'])assert(media[field].trim());
  if(Object.hasOwn(entry,'ownMediaConcept'))assert(entry.ownMediaConcept.trim());
  assert.deepEqual(entry.tasks.map(t=>t.age),['6-8','9-11','12-14']);
  for(const task of entry.tasks){
   for(const field of ['goal','example','prompt','hint','why'])assert.equal(typeof task[field],'string');
   assert.equal(task.answers.length,3);assert.equal(new Set(task.answers).size,3);assert(Number.isInteger(task.correct)&&task.correct>=0&&task.correct<3);
   assert.equal(task.wrongReasons.length,3);assert.equal(task.wrongReasons[task.correct],null);
   for(const[index,reason]of task.wrongReasons.entries())if(index!==task.correct){assert.equal(typeof reason,'string');assert(reason.trim());assert.notEqual(reason,task.why);}
  }
 }
 assert.equal(whole(beforeRetainedPeople(catalog)),boundary.priorCatalogSHA256);
 for(const change of boundary.catalogChanges){const current=catalog.find(t=>t.id===change.id);for(const field of ['id','category','title','facts','locations','question','image'])assert.deepEqual(current[field],change.original[field],field+' retains real M92 identity: '+change.id);}
 for(const row of beforeRetainedPeople(worldGameBank('people')))if(named.has(row.id))assert.deepEqual(row,boundary.bankChanges.find(r=>r.id===row.id).original);
});

test('all45 word pairs and196 world connections retain their complete M92 prefixes and real reciprocal endpoints',()=>{
 assert.equal(links.length,45);assert.equal(beforeRetainedPeopleBookLinks(links).length,25);
 assert.equal(new Set(links.map(r=>[r.kind,r.term,r.topic].join('|'))).size,45);
 const wordIds=new Set(JSON.parse(fs.readFileSync('exports/content/knowledge-words.json','utf8')).map(r=>r.term));
 for(const pair of links.slice(25)){assert(named.has(pair.topic));assert.equal(pair.kind,'word');assert(wordIds.has(pair.term));assert(pair.connection.trim());}
 assert.equal(graph.connections.length,196);assert.equal(beforeRetainedPeopleGraph(graph).connections.length,181);assert.equal(new Set(graph.connections.map(e=>e.id)).size,196);
 for(const edge of graph.connections.slice(181)){assert(edge.why.trim());assert.notEqual(edge.fromId,edge.toId);const a=catalog.find(t=>t.id===edge.fromId),b=catalog.find(t=>t.id===edge.toId);assert(a&&b);for(const[from,to]of[[a,b],[b,a]])assert(connectionsFor(from.id).some(row=>row.id===edge.id&&row.topic===to.id&&row.why===edge.why),'actual existing bidirectional article resolver preserves the full explanation');}
 const changed=structuredClone(catalog);changed.find(t=>named.has(t.id)).sources[0].url='https://invalid.example/unreviewed';assert.throws(()=>beforeRetainedPeople(changed));
 const unrelated=structuredClone(catalog);unrelated.find(t=>!named.has(t.id)).facts.push('unreviewed');assert.throws(()=>beforeRetainedPeople(unrelated));
 const wrongLink=structuredClone(links);wrongLink[25].connection='unreviewed';assert.throws(()=>beforeRetainedPeopleBookLinks(wrongLink));
 const wrongGraph=structuredClone(graph);wrongGraph.connections[181].why='unreviewed';assert.throws(()=>beforeRetainedPeopleGraph(wrongGraph));
 const wrongTask=structuredClone(inquiries.entries);wrongTask[18].tasks[0].why='unreviewed';assert.throws(()=>beforeRetainedPeople(wrongTask));
});

test('whole286 dossier boundary keeps all268 M92 originals and rejects unknown content, histories, ordering and incomplete or invented current UI',()=>{
 const rows=dossiersBeforeWaterPhotosynthesis(JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers),original=JSON.stringify(rows);
 assert.equal(rows.length,286);assert.equal(beforeRetainedPeopleDossiers(rows).length,268);
 const tu=rows.find(r=>r.id==='topics-people:person-tu_youyou'),beforeTu=tu.historicalSourceBeforeTuBiographical20261106;
 assert.equal(tu.sources[2].url,'https://www.nobelprize.org/prizes/medicine/2015/tu/biographical/');
 assert.equal(beforeTu.sources[2].url,'https://www.jci.org/articles/view/60887');
 assert.equal(tu.teachingDataHash,beforeTu.teachingDataHash,'source replacement retains the actual lesson, model and old answer identities');
 for(const[name,mutate]of[
  ['missing old record',r=>r.splice(0,1)],['missing new record',r=>r.pop()],
  ['unknown new record',r=>r.push({...r[285],id:'topics-people:invented'})],
  ['duplicate new record',r=>r[285]=r[284]],['reordered originals',r=>[r[0],r[1]]=[r[1],r[0]]],
  ['altered old claim',r=>r[0].explanation+=' unreviewed'],
  ['altered nested history',r=>r[0].historicalUIBeforeMetRecordSourceCorrection20261105.report+=' unreviewed'],
  ['altered new source',r=>r[268].sources[0].url='https://invalid.example/unreviewed'],
  ['altered new explanation',r=>r[285].explanation+=' unreviewed'],
  ['altered preserved Tu source',r=>r.find(x=>x.id==='topics-people:person-tu_youyou').historicalSourceBeforeTuBiographical20261106.sources[2].url='https://invalid.example/unreviewed'],
  ['missing preserved Tu source',r=>delete r.find(x=>x.id==='topics-people:person-tu_youyou').historicalSourceBeforeTuBiographical20261106],
  ['missing preserved NASA citation',r=>delete r.find(x=>x.id==='topics-people:person-katherine_johnson').historicalSourceBeforeNASADirectPDF20261106],
  ['altered preserved NASA citation',r=>r.find(x=>x.id==='topics-people:person-katherine_johnson').historicalSourceBeforeNASADirectPDF20261106.sources[1].url='https://invalid.example/unreviewed'],
  ['premature current UI',r=>r[268].ui={build:boundary.currentRuntimeBuild,visible:true}],
  ['premature old UI history',r=>r[0].historicalUIBeforeRetainedPeople20261105={build:'invented'}],
  ['wrong bound current UI route',r=>r[268].ui.route='world/topic/invented'],
  ['missing whole previous UI',r=>delete r[0].historicalUIBeforeRetainedPeople20261105],
  ['altered whole previous UI',r=>r[0].historicalUIBeforeRetainedPeople20261105.offline=false],
  ['invented new-person old UI',r=>r[268].historicalUIBeforeRetainedPeople20261105=structuredClone(r[0].ui)],
 ]){const bad=structuredClone(rows);mutate(bad);assert.throws(()=>beforeRetainedPeopleDossiers(bad),name);}
 assert.equal(JSON.stringify(rows),original);
});

test('all677 actual runtime inputs reconstruct exact accepted659 M92 inputs and reject changed, missing and unknown sources',()=>{
 const root=process.cwd(),original=learningFingerprint(root);assertCurrentRetainedPeopleRuntime(root);
 const previous=withRetainedPeoplePredecessorRuntime(root,p=>{assertCurrentFourteenRuntime(p);return{build:learningFingerprint(p),inputs:learningInputs(p).length};});
 assert.deepEqual(previous,{build:'2288b4d5027887bf',inputs:659});
 const rewrite=(file,fn)=>{const b=fs.readFileSync(file);fs.unlinkSync(file);fs.writeFileSync(file,fn(b));};
 for(const[name,mutate]of[
  ['unknown added runtime',p=>fs.writeFileSync(path.join(p,'app/unreviewed-retained18.ts'),'export const unreviewed=true;\n')],
  ['missing existing input',p=>fs.unlinkSync(path.join(p,'app/globe.tsx'))],
  ['changed new actual model',p=>rewrite(path.join(p,'app/people-retained-evidence/albert-einstein.tsx'),b=>Buffer.concat([b,Buffer.from('\n// unreviewed\n')]))],
  ['unreviewed old source',p=>rewrite(path.join(p,'app/world-catalog.json'),b=>Buffer.concat([b,Buffer.from('\n')]))],
  ['unreviewed chapter-photo correction',p=>rewrite(path.join(p,'app/learning-journeys.tsx'),b=>Buffer.concat([b,Buffer.from('\n')]))],
 ]){
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'wk-retained18-runtime-countercase-'));
  try{
   for(const file of learningInputs(root)){const target=path.join(temporary,path.relative(root,file));fs.mkdirSync(path.dirname(target),{recursive:true});fs.linkSync(file,target);}
   assertCurrentRetainedPeopleRuntime(temporary);mutate(temporary);assert.throws(()=>assertCurrentRetainedPeopleRuntime(temporary),name);
   let inspected;const actual=withRetainedPeoplePredecessorRuntime(temporary,p=>{inspected=p;return learningFingerprint(p);});
   assert.equal(inspected,temporary,'unknown source remains unknown for the original checks');assert.notEqual(actual,original);assert.notEqual(actual,'2288b4d5027887bf');
  }finally{fs.rmSync(temporary,{recursive:true,force:false});}
 }
 assert.equal(learningFingerprint(root),original);
});

test('whole prior286 source and UI dossiers remain recoverable after native221 source correction and reject damaged historical layers',()=>{
 const rows=dossiersBeforeWaterPhotosynthesis(JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers);
 const qualified=JSON.parse(fs.readFileSync('tests/fixtures/editorial-before-retained-people-268.json','utf8'));
 const restored=beforeNative221PeopleSourceDossiers(rows,qualified);
 assert.equal(restored.length,286);
 assert.equal(whole(restored),'94f62eff7e7458c82fdeee08afb500942f91e6ae3fa5aa08003b1d7741f06a19');
 for(const id of ['person-ada_lovelace','person-albert_einstein','person-bertha_benz','person-karl_benz','person-johannes_gutenberg']){
  const current=rows.find(row=>row.id==='topics-people:'+id);
  assert.deepEqual(restored.find(row=>row.id===current.id),current.historicalSourceBeforeNative221Replacement20261106);
 }
 const johnson=rows.find(row=>row.id==='topics-people:person-katherine_johnson');
 assert.deepEqual(restored.find(row=>row.id===johnson.id),johnson.historicalSourceBeforeNASADirectPDF20261106);
 assert.equal(restored.find(row=>row.id===johnson.id).sources[1].url,'https://ntrs.nasa.gov/citations/19980227091');
 for(const[name,change]of[
  ['changed old UI report',q=>q.previousQualifiedUIBeforeNative221SourceCorrection.template.report+=' unreviewed'],
  ['changed old UI build',q=>q.previousQualifiedUIBeforeNative221SourceCorrection.template.build='invented'],
  ['missing whole previous UI field',q=>delete q.previousQualifiedUIBeforeNative221SourceCorrection.template.offline],
  ['changed original ordering',q=>q.previousQualifiedUIBeforeNative221SourceCorrection.keyOrder.reverse()],
  ['missing same-primary source history field',q=>delete q.previousQualifiedUIBeforeNative221SourceCorrection.samePrimarySourceHistoryField],
  ['unknown same-primary source history field',q=>q.previousQualifiedUIBeforeNative221SourceCorrection.samePrimarySourceHistoryField='invented'],
 ]){const bad=structuredClone(qualified);change(bad);assert.throws(()=>beforeNative221PeopleSourceDossiers(rows,bad),name);}
 const altered=structuredClone(rows);
 altered.find(row=>row.id==='topics-people:person-ada_lovelace').historicalSourceBeforeNative221Replacement20261106.explanation+=' unreviewed';
 assert.throws(()=>beforeNative221PeopleSourceDossiers(altered,qualified),'changed whole nested predecessor');
 const changedNASA=structuredClone(rows);
 changedNASA.find(row=>row.id==='topics-people:person-katherine_johnson').historicalSourceBeforeNASADirectPDF20261106.sources[1].url='https://invalid.example/unreviewed';
 assert.throws(()=>beforeNative221PeopleSourceDossiers(changedNASA,qualified),'changed whole original NASA predecessor');
});
