import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import{createHash}from'node:crypto';import{location,locationCases,repetitionCases,ratioLength,sampleCircles,selections}from'../app/book-statistics-models.ts';import{validateStatisticsPack,STATISTICS_WORDS,STATISTICS_QUESTIONS}from'../app/book-statistics-validation.mjs';import{bookStatisticsContent}from'../scripts/book-statistics-index.mjs';import{statisticsPredecessors,withGenePreStatisticsRuntime}from'./statistics-predecessor-reference.mjs';import{learningFingerprint}from'../build/learning-fingerprint.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex'),fp=x=>sha(JSON.stringify(x)),pack=read('app/book-statistics-content.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');
test('mean and median distinguish a large outlier, an even middle pair and unchanged source order',()=>{
 const before=structuredClone(locationCases);assert.deepEqual(locationCases.map(v=>{const s=location(v);return[s.mean,s.median,s.range];}),[[5,4,7],[10,4,22],[6,5.5,11],[13/3,2,7]]);assert.deepEqual(locationCases,before);assert.deepEqual(location([9,2,4]),location([2,4,9]));assert.equal(location([1,2,30]).mean,11);assert.equal(location([1,2,30]).median,2);for(const input of[[],[Infinity],[NaN]])assert.throws(()=>location(input));
});
test('zero observed range can coexist with a common offset and the selected sample is not the whole collection',()=>{
 assert.deepEqual(repetitionCases.map(v=>{const s=location(v);return[s.mean,s.range,s.mean-120];}),[[120,2,0],[125,2,5],[125,0,5]]);assert.deepEqual(selections.map(sampleCircles),[{circles:4,total:4},{circles:1,total:4},{circles:4,total:12}]);for(const input of[[],[0,0],[-1],[12],[.5]])assert.throws(()=>sampleCircles(input));
});
test('scale ratios preserve the same real length and reject invalid denominators',()=>{
 assert.deepEqual([50,100,200].map(s=>ratioLength(200,s)),[4,2,1]);assert.equal(ratioLength(200,100)*100,200);for(const n of[0,-1,Infinity,NaN])assert.throws(()=>ratioLength(200,n));assert.throws(()=>ratioLength(-1,100));
});
test('eleven distinct canonical studies retain all delivered142/44 values and eight whole earlier teaching packs',()=>{
 assert.deepEqual(bookStatisticsContent(true),pack);assert.equal(words.length,150);assert.equal(why.length,47);assert.equal(new Set(words.map(x=>x.term)).size,150);assert.equal(new Set(why.map(x=>x.question)).size,47);assert.equal(STATISTICS_WORDS.length,8);assert.equal(STATISTICS_QUESTIONS.length,3);assert.equal(read('exports/content/book-statistics.json').length,11);
 const old=read('tests/fixtures/book-before-statistics-142-hashes.json');assert.equal(Object.keys(old.words).length,142);assert.equal(Object.keys(old.why).length,44);for(const[term,hash]of Object.entries(old.words))assert.equal(fp(words.find(x=>x.term===term)),hash,term);for(const[q,hash]of Object.entries(old.why))assert.equal(fp(why.find(x=>x.question===q)),hash,q);assert.equal(Object.keys(old.packs).length,8);for(const[file,hash]of Object.entries(old.packs))assert.equal(sha(fs.readFileSync(file)),hash,file);
 const base=read('content/excellence-baseline.json');assert.equal(base.families.find(x=>x.id==='words').count,90);assert.equal(base.families.find(x=>x.id==='why').count,30);
});
test('all statistics targets exist and old incoming edges come from the same authored relationships',()=>{
 const incoming=read('app/book-statistics-word-link-index.json'),topics=read('app/world-index.json');for(const[term,item]of Object.entries(pack.learning)){assert(topics.some(x=>x.id===item.topic));for(const l of item.relatedWords??[]){assert(words.some(x=>x.term===l.term));if(pack.learning[l.term])assert(pack.learning[l.term].relatedWords.some(x=>x.term===term),term+' reciprocal peer');else assert(incoming[l.term].some(x=>x.term===term&&x.reason===l.reason));}for(const l of item.relatedQuestions??[])assert(why.some(x=>x.question===l.question));}
 assert.deepEqual(Object.keys(incoming),['Meter','Meeresspiegel']);assert.equal(Object.values(incoming).flat().length,3);assert(!JSON.stringify(pack).includes('Warum kann ein Papierplan eine echte Bauprüfung nicht ersetzen?'));
});
test('missing answers, unknown unpublished targets and stale source dates are rejected',()=>{
 for(const mutate of[p=>delete p.whyLearning[STATISTICS_QUESTIONS[0]].question,p=>p.learning.Skala.relatedWords.push({term:'unpublished',reason:'unknown'}),p=>p.learning.Median.figure='unknown',p=>p.learning.Messwert.sources[0].checkedOn='2030-01-01',p=>p.whyLearning[STATISTICS_QUESTIONS[1]].question.wrongReasons[1]='']){const b=structuredClone(pack);mutate(b);assert.throws(()=>validateStatisticsPack(b));}
});
test('the statistics layer preserves every whole M84 dossier and recomputes the exact delivered runtime',()=>{
 const items=read('content/editorial-reviews.json').dossiers,old=read('tests/fixtures/book-before-statistics-142-hashes.json');assert.deepEqual(statisticsPredecessors(items).map(x=>({id:x.id,sha256:fp(x)})),old.whole166PredecessorDossiers);assert.equal(withGenePreStatisticsRuntime(process.cwd(),learningFingerprint),'0592871075a190bb');
 for(const mutate of[a=>a[0].explanation+=' unreviewed',a=>delete a[0].historicalUIBeforeGene20261031,a=>a[166].dataHash='wrong',a=>a[166].ui={build:'invented'},a=>a.reverse(),a=>a.pop()]){const b=structuredClone(items);mutate(b);assert.throws(()=>statisticsPredecessors(b));}
});

// Added only after genuine full qualification and actual original visual review.
import {collectInventory,fingerprint} from '../scripts/content-inventory.mjs';
import {validateDossier} from '../scripts/editorial-contract.mjs';
import {statisticsHistoryReference} from './statistics-history-reference.mjs';
const currentUIFixture=read('tests/fixtures/editorial-before-statistics-166.json'),currentUIReference=statisticsHistoryReference(currentUIFixture,currentUIFixture.currentTemplate),currentInventory=collectInventory(),currentRecords=new Map(currentInventory.records.map(row=>[row.id,row])),currentKnownIds=new Set(currentRecords.keys()),statisticsTeaching=read('exports/content/book-statistics.json');
function assertActualCurrent177(items){
 assert.equal(items.length,177);assert.equal(currentUIFixture.priorDossiers.length,166);assert.equal(currentUIFixture.addedDossiers.length,11);assert.equal(currentUIFixture.currentTemplate.build,learningFingerprint(process.cwd()));currentUIReference.assertCurrentStatisticsSharedUI(items);
 const expectedIds=[...STATISTICS_WORDS.map(term=>'words:'+term),...STATISTICS_QUESTIONS.map(question=>'why:'+why.findIndex(row=>row.question===question))];assert.equal(new Set(expectedIds).size,11);assert.deepEqual(new Set(currentUIFixture.addedDossiers.map(row=>row.id)),new Set(expectedIds));
 for(const id of expectedIds){
  const dossier=items.find(row=>row.id===id),record=currentRecords.get(id);assert(dossier&&record);assert.equal(dossier.dataHash,record.dataHash,id+' canonical inventory hash');
  const word=record.family==='words',key=word?record.legacyId:why[record.sourceIndex].question,canonical=word?words.find(row=>row.term===key):why[record.sourceIndex];assert.equal(record.dataHash,fingerprint(canonical));
  const lesson=statisticsTeaching.find(row=>row.kind===(word?'word':'why')&&(word?row.term:row.whyQuestion)===key);assert(lesson);assert.equal(statisticsTeaching.filter(row=>row.kind===lesson.kind&&(word?row.term:row.whyQuestion)===key).length,1);assert.equal(dossier.teachingDataHash,fingerprint(lesson));assert.equal(lesson.sourceReadOn,pack.sourceReadOn);assert.deepEqual(dossier.sources.map(row=>row.url),(word?pack.learning:pack.whyLearning)[key].sources.map(row=>row.url));assert.equal(validateDossier(dossier,record,{build:currentUIFixture.currentTemplate.build,knownIds:currentKnownIds}).structurallyReady,true);
 }
 assert.deepEqual(items.slice(0,166).map(currentUIReference.beforeStatisticsUI).map(fingerprint),currentUIFixture.priorDossiers.map(row=>row.wholeSHA256));
}
test('all raw177 current dossiers retain166 whole delivered predecessors and eleven real canonical statistics UI contracts',()=>assertActualCurrent177(read('content/editorial-reviews.json').dossiers));
test('current177UI rejects stale binding, mismatched teaching, changed old facts, reordered IDs and lost nested histories',()=>{
 for(const mutate of[rows=>rows[166].ui.build='stale',rows=>rows[166].teachingDataHash='0'.repeat(64),rows=>rows[166].dataHash='0'.repeat(64),rows=>rows[0].explanation+=' Unreviewed.',rows=>delete rows[0].historicalUIBeforeStatistics20261031,rows=>delete rows[0].historicalUIBeforeGene20261031,rows=>delete rows[0].historicalUIBeforeCell20261031,rows=>rows.reverse(),rows=>rows.pop()]){const changed=structuredClone(read('content/editorial-reviews.json').dossiers);mutate(changed);assert.throws(()=>assertActualCurrent177(changed));}
});
