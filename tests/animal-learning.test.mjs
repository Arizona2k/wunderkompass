import {animalCasesComplete,animalCoverageComplete,animalNativeComplete,animalOfflineComplete,solarCoverageComplete,solarNativeComplete,solarOfflineComplete} from '../scripts/article-learning-evidence.mjs';
import {animalCases,animalProof,animalNativeProof,animalOfflineProof,solarProof,solarNativeProof,solarOfflineProof} from './fixtures/animal-proof.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import DATA from '../app/animal-inquiries.json' with {type:'json'};
import catalog from '../app/world-catalog.json' with {type:'json'};
import expansion from '../content/animal-expansion-review.json' with {type:'json'};
const baseline=JSON.parse(fs.readFileSync('content/animal-editorial-review.json','utf8')).entries;
import {createHash} from 'node:crypto';
import {createSave,restoreSave} from '../app/progress-storage.ts';

test('all24 original animal identities/answers remain unchanged and every new evidence quote is present in its own article',()=>{
 const animals=catalog.filter(t=>t.category==='animals');assert.equal(animals.length,48);assert.equal(DATA.entries.length,48);assert.equal(new Set(DATA.entries.map(e=>e.id)).size,48);assert.equal(baseline.length,24);assert.deepEqual(new Set(DATA.entries.map(e=>e.id)),new Set(animals.map(t=>t.id)));
 for(const t of animals){const old=baseline.find(e=>e.id===t.id),added=expansion.entries.find(e=>e.id===t.id),entry=DATA.entries.find(e=>e.id===t.id);assert.ok(old||added,t.id+' original or individually reviewed new identity');assert.deepEqual(entry.evidence.map(e=>e.text),t.paragraphs);assert.deepEqual(entry.sourceUrls,t.sources.map(s=>s.url));assert.equal(createHash('sha256').update(JSON.stringify(entry)).digest('hex'),old?.teachingContentSHA256??added.runtimeTeachingContentSHA256,t.id+' individually versioned teaching content');for(const task of [entry.reason,entry.transfer]){assert.equal(task.answers.length,2);assert.equal(new Set(task.answers).size,2);assert.ok(task.correct===0||task.correct===1);assert.equal(task.feedback.length,2);assert.ok(task.feedback.every(text=>text.length>30));assert.ok(task.hint.length>25);}}
 assert.equal(new Set(DATA.entries.flatMap(e=>[e.reason.prompt,e.transfer.prompt])).size,96,'individual reasoning instead of one generic question');
});

test('existing schema3 backup keeps every old topic/game field together with the optional workshop state',()=>{
 const pass=createSave();pass.progress.gameSessions['world:animal-detective']={items:['animal-polar-bear','animal-lion'],index:1,roundAnswer:'alte Antwort'};pass.progress.favorites=['topic:animal-polar-bear'];
 for(const e of DATA.entries){const t=catalog.find(t=>t.id===e.id);pass.progress.gameSessions['topic:'+e.id]={items:[...t.question.answers].reverse(),topicAnswer:t.question.answers[t.question.correct],compareAnimal:true,animalInquiryLevel:2,animalInquiryEvidence:[0,1],'animalInquiryAnswer:1':e.reason.answers[e.reason.correct],'animalInquiryAnswer:2':e.transfer.answers[e.transfer.correct]};}
 const restored=restoreSave(JSON.parse(JSON.stringify(pass)),true);assert.deepEqual(restored.progress.gameSessions,pass.progress.gameSessions);assert.deepEqual(restored.progress.favorites,pass.progress.favorites);
});

test('source biological article data and old related links are preserved while explained reciprocal links are appended',()=>{
 const review=JSON.parse(fs.readFileSync('content/animal-editorial-review.json','utf8'));assert.equal(review.independentReview,false);assert.equal(review.newSpecies,0);assert.equal(review.acceptedNew,0);assert.equal(review.entries.length,24);
 for(const e of review.entries){const current=catalog.find(t=>t.id===e.id);assert.deepEqual(current.related.slice(0,e.originalRelated.length),e.originalRelated,e.id+' old related links retained in order');const addition=e.sourceAddition20261018;if(addition){assert.deepEqual(current.sources,addition.after,e.id+' exact reviewed source addition');assert.deepEqual(addition.after.slice(0,addition.before.length),addition.before,e.id+' every original source retained');const count=({'animal-garden-cross-spider':2,'animal-white-tailed-eagle':3})[e.id]??1;assert.equal(addition.after.length,addition.before.length+count);if(addition.sourcesAddedWithEvidence){assert.equal(addition.sourcesAddedWithEvidence.length,count);assert.deepEqual(addition.sourcesAddedWithEvidence.map(row=>row.url),addition.after.slice(addition.before.length).map(row=>row.url));assert.ok(addition.sourcesAddedWithEvidence.every(row=>row.reason&&row.readAnchor));}assert.ok(addition.reason&&addition.readAnchor);}assert.equal(createHash('sha256').update(JSON.stringify({...current,related:e.originalRelated,...(addition?{sources:addition.before}:{})})).digest('hex'),e.originalArticleSHA256,e.id+' immutable original article; only exact documented source addition and additional related links');}
});

test('complete animal evidence rejects absent/duplicate widths, levels, large text, keyboard, saves and native/offline states',()=>{
 const widths=[320,360,390,768,1024,1440,1920];assert.equal(animalCoverageComplete(animalProof(),widths),true);
 for(const mutate of [p=>p.searchFocus.delayedModule=false,p=>p.searchFocus.keyboardQuery=false,p=>p.searchFocus.closedBeforeReady=false,p=>p.focusChecks.pop(),p=>p.focusChecks[0].visible=false,p=>p.focusChecks[0].outlineWidth=0,p=>p.focusChecks[0].tabNavigation=false,p=>p.observed.pop(),p=>p.observed.push(p.observed[0]),p=>p.observed[0].levels.pop(),p=>p.observed[1].state='normal',p=>p.observed[0].keyboard=false,p=>p.observed[0].geometry=false,p=>p.oldSessionsPreserved=false,p=>p.axe=false,p=>p.navigation=false,p=>p.independentAcceptance=true]){const proof=animalProof();mutate(proof);assert.equal(animalCoverageComplete(proof,widths),false);}
 assert.equal(animalCasesComplete(animalCases([320]),[320,390]),false);assert.equal(animalNativeComplete(animalNativeProof()),true);assert.equal(animalNativeComplete({...animalNativeProof(),scale:1}),false);assert.equal(animalNativeComplete({...animalNativeProof(),observed:[]}),false);assert.equal(animalOfflineComplete(animalOfflineProof()),true);assert.equal(animalOfflineComplete({...animalOfflineProof(),coldRestart:false}),false);
});

test('solar caption acceptance rejects hidden clipping, missing planets, modes, font states, keyboard and false native zoom',()=>{
 const widths=[320,360,390,402,768,1024,1440,1920];assert.ok(solarCoverageComplete(solarProof(),widths));for(const mutate of [p=>p.observed.pop(),p=>p.observed.push(p.observed[0]),p=>p.observed[0].readableHTML=false,p=>p.observed[0].geometry=false,p=>p.observed[0].originalScale=false,p=>p.observed[0].keyboard=false,p=>p.axe=false,p=>p.clippingGuard=false]){const p=solarProof();mutate(p);assert.equal(solarCoverageComplete(p,widths),false);}assert.equal(solarOfflineComplete(solarOfflineProof()),true);assert.equal(solarOfflineComplete({...solarOfflineProof(),coldRestart:false}),false);assert.equal(solarNativeComplete(solarNativeProof()),true);assert.equal(solarNativeComplete({...solarNativeProof(),scale:1}),false);
});

test('only the six individually counterread source gaps allow their precisely recorded citation additions',()=>{const review=JSON.parse(fs.readFileSync('content/animal-editorial-review.json','utf8'));assert.deepEqual(review.entries.filter(e=>e.sourceAddition20261018).map(e=>e.id).sort(),['animal-lion','animal-common-bottlenose-dolphin','animal-bornean-orangutan','animal-dromedary','animal-garden-cross-spider','animal-white-tailed-eagle'].sort());});
