import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import actualHistoryCatalog from '../app/world-catalog.json' with {type:'json'};
import {beforeHistoryEvidence} from './history-evidence-reference.mjs';
import {dossiersBeforeHistoryEvidence} from './history-individual-dossiers-reference.mjs';
const catalog=beforeHistoryEvidence(actualHistoryCatalog);
import thinking from '../app/science-thinking.json' with {type:'json'};
import {CHALLENGE_BANK as actualHistoryBank,challengeQuestionForOrder,restoreChallenge,emptyChallenge} from '../app/knowledge-challenge.ts';
import {createSave,restoreSave,emptyProgress} from '../app/progress-storage.ts';
import {retainedChallengeChoiceVariant} from '../app/retained-answer-wording.mjs';
import {beforeWaterPhotosynthesis,thinkingBeforeWaterPhotosynthesis,dossiersBeforeWaterPhotosynthesis,wholeWaterReference,waterPhotosynthesisBoundary as boundary} from './water-photosynthesis-reference.mjs';
import {assertCurrentWaterPhotosynthesisRuntime,withWaterPhotosynthesisPredecessorRuntime} from './water-photosynthesis-runtime-reference.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {collectInventory} from '../scripts/content-inventory.mjs';
import {validateDossierContent,validateDossier} from '../scripts/editorial-contract.mjs';
import {beforeRetainedPeople,retainedPeopleBoundary} from './retained-people-reference.mjs';

const CHALLENGE_BANK=beforeHistoryEvidence(actualHistoryBank);
import {withHistoryEvidencePredecessorRuntime} from './history-evidence-runtime-reference.mjs';
const permutations=([a,b,c])=>[[a,b,c],[a,c,b],[b,a,c],[b,c,a],[c,a,b],[c,b,a]];

test('composed historical inverses retain the exact whole M92 result while changed or reordered M92 objects remain rejected',()=>{
 const once=beforeRetainedPeople(catalog);assert.equal(wholeWaterReference(once),retainedPeopleBoundary.priorCatalogSHA256);assert.deepEqual(beforeRetainedPeople(once),once);
 for(const mutate of[rows=>rows[0].intro+=' unreviewed',rows=>[rows[0],rows[1]]=[rows[1],rows[0]],rows=>rows.find(r=>r.id==='science-water-cycle').paragraphs.push('unreviewed')]){const bad=structuredClone(once);mutate(bad);assert.throws(()=>beforeRetainedPeople(bad));}
});

test('all679 whole runtime inputs reconstruct exact accepted M93 while unknown, missing and altered media or semantic inputs fail closed',()=>{
 return withHistoryEvidencePredecessorRuntime(process.cwd(),historicalRoot=>{
 const root=historicalRoot,current=assertCurrentWaterPhotosynthesisRuntime(root);assert.equal(current.size,679);assert.equal(withWaterPhotosynthesisPredecessorRuntime(root,learningFingerprint),'3f74b9133f70e0af');
 for(const [name,mutate]of[
  ['unknown input',p=>fs.writeFileSync(path.join(p,'app/unknown-water-input.ts'),'export const unreviewed=true;\n')],
  ['missing old input',p=>fs.unlinkSync(path.join(p,'app/progress-sync.ts'))],
  ['altered explanation',p=>{const f=path.join(p,'app/world-catalog.json'),body=fs.readFileSync(f);fs.unlinkSync(f);fs.writeFileSync(f,Buffer.concat([body,Buffer.from(' ')]));}],
  ['altered drawing',p=>{const f=path.join(p,'app/water-cycle-drawing.tsx'),body=fs.readFileSync(f);fs.unlinkSync(f);fs.writeFileSync(f,Buffer.concat([body,Buffer.from('// unreviewed\n')]));}],
 ]){
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'wk-water-whole-negative-'));
  try{for(const [relative,file]of current){const dest=path.join(temporary,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.linkSync(file,dest);}assertCurrentWaterPhotosynthesisRuntime(temporary);mutate(temporary);assert.throws(()=>assertCurrentWaterPhotosynthesisRuntime(temporary),name);let inspected;const value=withWaterPhotosynthesisPredecessorRuntime(temporary,p=>{inspected=p;return learningFingerprint(p);});assert.equal(inspected,temporary,'unknown input is not projected to an accepted predecessor');assert.equal(value,learningFingerprint(temporary));}
  finally{fs.rmSync(temporary,{recursive:true,force:false});}
 }
 assertCurrentWaterPhotosynthesisRuntime(root);
 });
});

test('two individually sourced qualified UI dossiers preserve all286 whole M93 source and UI dossiers with exact inverse',()=>{
 const rows=dossiersBeforeHistoryEvidence(JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers),inventory=collectInventory(),knownIds=new Set(inventory.records.map(r=>r.id));assert.equal(rows.length,288);assert.equal(dossiersBeforeWaterPhotosynthesis(rows).length,286);
 for(const row of rows.slice(286)){const currentRecord=inventory.records.find(r=>r.id===row.id),record={...currentRecord,dataHash:wholeWaterReference(catalog.find(t=>'topics-'+t.category+':'+t.id===row.id))};assert.equal(validateDossierContent(row,record,{knownIds}).contentReady,true);const actualUILayer=boundary.sourceEndpointCorrection.qualifiedUILayer??boundary.qualifiedUILayer;const currentBuild=withHistoryEvidencePredecessorRuntime(process.cwd(),learningFingerprint),ready=validateDossier(row,record,{knownIds,build:currentBuild}).structurallyReady;if(currentBuild===actualUILayer.build)assert.equal(ready,true);else{assert.equal(currentBuild,boundary.sourceEndpointCorrection.pendingCurrentUIBuild);assert.equal(ready,false,'earlier valid UI must not count as current source-corrected acceptance');}assert.deepEqual(row.ui,{...actualUILayer.currentTemplate,route:record.route});}
 for(const mutate of[r=>r[0].goal+=' unreviewed',r=>r[286].claims[0].statement+=' unreviewed',r=>r[287].ui={build:'invented',visible:true,search:true,back:true,offline:true},r=>r.push(structuredClone(r[287]))]){const bad=structuredClone(rows);mutate(bad);assert.throws(()=>dossiersBeforeWaterPhotosynthesis(bad));}
});
function round(row,order,{done=false,answer=order[0]}={}){
 const other=CHALLENGE_BANK.filter(q=>q.difficulty===row.after.difficulty&&!boundary.bankChanges.some(r=>r.id===q.id)).slice(0,5);
 assert.equal(other.length,5);
 const questions=done?[...other,row.after]:[row.after,...other];
 return {difficulty:row.after.difficulty,ids:questions.map(q=>q.id),orders:Object.fromEntries(questions.map(q=>[q.id,q.id===row.id?order:[...q.answers].reverse()])),index:done?5:0,answer,done};
}

test('water and photosynthesis revise two existing whole articles while all202 unrelated articles, original23 inquiries and all other challenge questions remain exact M93',()=>{
 assert.equal(catalog.length,204);assert.equal(CHALLENGE_BANK.length,240);
 assert.equal(wholeWaterReference(catalog),boundary.currentCatalogSHA256);
 assert.equal(wholeWaterReference(beforeWaterPhotosynthesis(catalog)),boundary.previousCatalogSHA256);
 assert.equal(wholeWaterReference(CHALLENGE_BANK),boundary.currentBankSHA256);
 assert.equal(wholeWaterReference(beforeWaterPhotosynthesis(CHALLENGE_BANK)),boundary.previousBankSHA256);
 assert.equal(wholeWaterReference(thinkingBeforeWaterPhotosynthesis(thinking)),wholeWaterReference(boundary.previousThinking));
 assert.deepEqual(thinking.entries.slice(0,23),boundary.previousThinking.entries);
 assert.deepEqual(thinking.entries.slice(23).map(e=>e.id),['science-water-cycle','science-photosynthesis']);
 for(const row of boundary.topics){
  const topic=catalog.find(t=>t.id===row.id);assert.deepEqual(topic,row.after);
  for(const field of ['id','category','title','locations','related'])assert.deepEqual(topic[field],row.before[field]);
  assert.equal(topic.paragraphs.length,6);assert.equal(topic.more.length,4);
  assert.equal(topic.checkedAt,'2026-11-06');assert.equal(topic.revision,2);
  const entry=thinking.entries.find(e=>e.id===topic.id);assert(entry);
  assert.deepEqual(entry.sources,topic.sources.map(s=>s.url));assert.deepEqual(entry.stages.map(s=>s.id),['observe','explain','transfer']);
  assert.equal(new Set(entry.stages.map(s=>s.prompt)).size,3);
  assert.equal(new Set(entry.stages.map(s=>s.answers.findIndex(a=>a.id===s.correct))).size,3);
  for(const stage of entry.stages){assert.equal(stage.answers.length,3);assert.equal(new Set(stage.answers.map(a=>a.text)).size,3);assert.equal(new Set(stage.answers.map(a=>a.feedback)).size,3);assert(stage.answers.every(a=>a.feedback.length>40));assert.notEqual(stage.hint,stage.answers.find(a=>a.id===stage.correct).text);}
 }
 assert.equal(catalog.find(t=>t.id==='science-water-cycle').sources.length,5);
 assert.equal(catalog.find(t=>t.id==='science-photosynthesis').sources.length,4);
 for(const mutate of[rows=>rows[0].intro+=' unreviewed',rows=>rows.pop(),rows=>[rows[0],rows[1]]=[rows[1],rows[0]],rows=>rows.find(t=>t.id==='science-photosynthesis').question.answers.reverse()]){const bad=structuredClone(catalog);mutate(bad);assert.throws(()=>beforeWaterPhotosynthesis(bad));}
 const bad=structuredClone(thinking);bad.entries[0].stages[0].hint+=' unreviewed';assert.throws(()=>thinkingBeforeWaterPhotosynthesis(bad));
});

test('nine exact legacy answer sets preserve all six permutations, literal wrong selections, unfinished and legitimately completed rounds through schema3 export/import',()=>{
 assert.equal(boundary.bankChanges.length,9);
 for(const row of boundary.bankChanges){
  for(const key of ['id','topic','difficulty','prompt','correct','why'])assert.deepEqual(row.after[key],row.before[key],row.id+' '+key);
  assert.equal(row.after.answers[row.after.correct],row.before.answers[row.before.correct]);
  for(const oldOrder of permutations(row.before.answers)){
   const interpreted=challengeQuestionForOrder(row.id,oldOrder);assert(interpreted);assert.equal(interpreted.retainedAnswerOrder,true);assert.deepEqual(interpreted.answers,row.before.answers);
   for(const answer of [null,...row.before.answers]){
    const previous=round(row,oldOrder,{answer}),original=structuredClone(previous);
    assert.deepEqual(restoreChallenge(previous,emptyChallenge()),original);assert.deepEqual(previous,original);
    const progress=emptyProgress();progress.settings.readVoice='';progress.notes=[{id:'synthetic-note',text:'Nur synthetischer Prüftext',at:'2026-11-07T00:00:00.000Z'}];progress.favorites=['topic:animal-lion'];progress.gameSessions={'world:knowledge-challenge':{challenge:previous}};
    const save=createSave(progress),restored=restoreSave(JSON.parse(JSON.stringify(save)),true);
    assert.deepEqual(restored.progress,save.progress);assert.deepEqual(restoreChallenge(restored.progress.gameSessions['world:knowledge-challenge'].challenge,emptyChallenge()),original);
   }
   const completed=round(row,oldOrder,{done:true,answer:row.before.answers[row.before.correct]});assert.deepEqual(restoreChallenge(completed,emptyChallenge()),completed);
   const falseCompletion=round(row,oldOrder,{done:true,answer:row.before.answers[(row.before.correct+1)%3]});assert.deepEqual(restoreChallenge(falseCompletion,emptyChallenge()),emptyChallenge());
  }
  for(const order of permutations(row.after.answers)){assert.equal(challengeQuestionForOrder(row.id,order).retainedAnswerOrder,false);assert.deepEqual(restoreChallenge(round(row,order),emptyChallenge()),round(row,order));}
 }
});

test('retained choice interpretation rejects unknown, duplicate and mixed answers, altered meaning and cross-topic use without modifying any wrong answer into a correct one',()=>{
 for(const row of boundary.bankChanges){
  for(const order of [[...row.before.answers.slice(0,2),'unknown'],[row.before.answers[0],row.before.answers[0],row.before.answers[2]],[row.before.answers[0],row.before.answers[1],row.after.answers[2]]]){
   if(new Set(order).size!==3||!permutations(row.before.answers).some(p=>JSON.stringify(p)===JSON.stringify(order))){assert.equal(retainedChallengeChoiceVariant(row.after,order),null);assert.deepEqual(restoreChallenge(round(row,order),emptyChallenge()),emptyChallenge());}
  }
  for(const mutate of[q=>q.prompt+='?',q=>q.why+=' unreviewed',q=>q.correct=1,q=>q.id+='-unknown',q=>q.topic='science-moon-phases',q=>q.answers[1]+=' unknown']){const bad=structuredClone(row.after);mutate(bad);assert.equal(retainedChallengeChoiceVariant(bad,row.before.answers),null);}
  for(const wrong of row.before.answers.filter((_,i)=>i!==row.before.correct)){const session=round(row,row.before.answers,{answer:wrong}),actual=restoreChallenge(session,emptyChallenge());assert.equal(actual.answer,wrong);assert.notEqual(actual.answer,row.after.answers[row.after.correct]);assert.equal(actual.done,false);}
 }
});

// Meaningful qualified-UI inverse positive and failure cases; synthetic values are never product acceptance.
function synthetic(run){
 const keys=['previousDossiers','newContentDossiers','qualifiedUILayer'];
 const original=Object.fromEntries(keys.map(key=>[key,{present:Object.hasOwn(boundary,key),value:boundary[key]}]));
 const previousTemplate={build:'synthetic-old',visible:true,report:'synthetic previous metadata only'},currentTemplate={build:'synthetic-current',visible:true,report:'synthetic proposed metadata only'};
 const old=Array.from({length:286},(_,i)=>({id:'synthetic-old-'+i,goal:'retained source fact '+i,history:{unchanged:true},ui:{...previousTemplate,route:'#synthetic/'+i}}));
 const added=[{id:'synthetic-new-A',goal:'new content only'},{id:'synthetic-new-B',goal:'new content only'}];
 const pending=[...old,...added],routes=pending.map((row,i)=>({id:row.id,route:'#synthetic/'+i}));
 const layer={build:currentTemplate.build,previousTemplate,currentTemplate,routes,meaning:'explicit synthetic unit fixture; no executed product acceptance'};
 boundary.previousDossiers=old.map(row=>({id:row.id,sha256:wholeWaterReference(row)}));
 boundary.newContentDossiers=added.map(row=>({id:row.id,sha256:wholeWaterReference(row)}));
 delete boundary.qualifiedUILayer;
 const current=pending.map((row,i)=>({...structuredClone(row),ui:{...currentTemplate,route:routes[i].route}}));
 try{return run({old,pending,current,layer});}
 finally{for(const key of keys){if(original[key].present)boundary[key]=original[key].value;else delete boundary[key];}}
}

test('exact pending dossiers remain valid while a complete UI layer needs an explicit known inverse',()=>synthetic(({old,pending,current,layer})=>{
 assert.deepEqual(dossiersBeforeWaterPhotosynthesis(pending),old);
 assert.throws(()=>dossiersBeforeWaterPhotosynthesis(current));
 boundary.qualifiedUILayer=layer;
 assert.deepEqual(dossiersBeforeWaterPhotosynthesis(current),old);
 assert.deepEqual(dossiersBeforeWaterPhotosynthesis(pending),old);
 assert.equal(Object.hasOwn(pending[286],'ui'),false);
 assert.equal(current[286].ui.build,'synthetic-current');
}));

test('partial UI, wrong routes, wrong builds and changed qualification fields remain rejected',()=>synthetic(({pending,current,layer})=>{
 boundary.qualifiedUILayer=layer;
 for(const mutate of [
  rows=>rows[0].ui=structuredClone(pending[0].ui),
  rows=>delete rows[287].ui,
  rows=>rows[287].ui.route='#invented-route',
  rows=>rows[0].ui.build='invented-build',
  rows=>rows[0].ui.visible=false,
  rows=>rows[286].ui.report='unreviewed replacement',
 ]){const bad=structuredClone(current);mutate(bad);assert.throws(()=>dossiersBeforeWaterPhotosynthesis(bad));}
}));

test('restoration cannot hide changed source facts, nested history, reordered identities or extra dossiers',()=>synthetic(({current,layer})=>{
 boundary.qualifiedUILayer=layer;
 for(const mutate of [
  rows=>rows[0].goal+=' unreviewed',
  rows=>rows[0].history.unchanged=false,
  rows=>rows[286].goal+=' unreviewed',
  rows=>[rows[0],rows[1]]=[rows[1],rows[0]],
  rows=>[rows[286],rows[287]]=[rows[287],rows[286]],
  rows=>rows.push(structuredClone(rows[287])),
 ]){const bad=structuredClone(current);mutate(bad);assert.throws(()=>dossiersBeforeWaterPhotosynthesis(bad));}
}));
