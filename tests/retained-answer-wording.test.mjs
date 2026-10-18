import test from 'node:test';import assert from 'node:assert/strict';
import {RETAINED_ANSWER_WORDING as alias,restoreAnswerWording,isRetainedAnswerWordingCorrection} from '../app/retained-answer-wording.mjs';
import {CHALLENGE_BANK,restoreChallenge,emptyChallenge} from '../app/knowledge-challenge.ts';
import {createSave,restoreSave,emptyProgress} from '../app/progress-storage.ts';
import registry from '../content/editorial-reviews.json' with {type:'json'};
import {historicalQuestionBank} from '../scripts/world-question-index.mjs';
const correction=registry.questionCorrections.find(c=>c.topic===alias.topic),question=CHALLENGE_BANK.find(q=>q.topic===alias.topic);
function legacySession({finished=false}={}){
 const others=CHALLENGE_BANK.filter(q=>q.difficulty==='easy'&&q.id!==question.id).slice(0,5),qs=finished?[...others,question]:[question,...others];
 return {difficulty:'easy',ids:qs.map(q=>q.id),orders:Object.fromEntries(qs.map(q=>[q.id,[...q.answers].reverse().map(value=>q.id===question.id&&value===alias.after?alias.before:value)])),index:finished?5:0,answer:finished?question.answers[question.correct]:alias.before,done:finished};
}
test('only the exact reviewed wrong-answer grammar alias is accepted; solution and other words remain protected',()=>{
 assert.equal(restoreAnswerWording(alias.topic,alias.before),alias.after);assert.equal(restoreAnswerWording('animal-lion',alias.before),alias.before);assert.equal(restoreAnswerWording(alias.topic,'unbekannt'),'unbekannt');assert.equal(restoreAnswerWording(alias.topic,question.answers[question.correct]),question.answers[question.correct]);assert.ok(isRetainedAnswerWordingCorrection(correction));
 for(const mutate of [c=>c.after.answers[0]+=' x',c=>c.after.correct=2,c=>c.before.correct=2,c=>c.after.answers.reverse(),c=>c.after.answers[2]+=' x',c=>c.topic='animal-lion']){const invalid=structuredClone(correction);mutate(invalid);assert.equal(isRetainedAnswerWordingCorrection(invalid),false);assert.throws(()=>historicalQuestionBank([question],[invalid]));}
});
test('a real six-question legacy challenge preserves IDs, shuffled order, wrong selection and earned final state without mutating its source',()=>{
 for(const finished of [false,true]){const old=legacySession({finished}),untouched=structuredClone(old),current=restoreChallenge(old,emptyChallenge());assert.deepEqual(old,untouched);assert.deepEqual(current.ids,old.ids);assert.equal(current.index,old.index);assert.equal(current.done,old.done);assert.deepEqual(current.orders[question.id],[...question.answers].reverse());assert.equal(current.answer,finished?question.answers[question.correct]:alias.after);assert.equal(current.answer===question.answers[question.correct],finished);assert.deepEqual(restoreChallenge(current,emptyChallenge()),current);}
});
test('unknown/duplicate/cross-topic answers and a false completed wrong-answer round still fail closed',()=>{
 const wrongFinished=legacySession({finished:true});wrongFinished.answer=alias.before;assert.deepEqual(restoreChallenge(wrongFinished,emptyChallenge()),emptyChallenge());
 const old=legacySession();for(const mutate of [s=>s.answer='unbekannt',s=>s.done=true,s=>s.orders[question.id][1]=alias.before,s=>{const other=s.ids[1];s.orders[other][0]=alias.before;},s=>s.ids.reverse()]){const invalid=structuredClone(old);mutate(invalid);assert.deepEqual(restoreChallenge(invalid,emptyChallenge()),emptyChallenge());}
});
test('Schema3 backup retains unrelated progress and the original old words; only the runtime question interpretation migrates',()=>{
 const progress=emptyProgress();progress.favorites=['topic:animal-lion'];progress.games=['memory'];progress.gameSessions={'world:knowledge-challenge':{challenge:legacySession()},'world:animal-detective':{items:['animal-lion','animal-koala'],index:1,roundAnswer:'Koala',roundDone:false}};
 const pass=createSave(progress),restored=restoreSave(JSON.parse(JSON.stringify(pass)),true);assert.deepEqual(restored.progress.gameSessions,pass.progress.gameSessions);assert.deepEqual(restored.progress.favorites,progress.favorites);assert.deepEqual(restored.progress.games,progress.games);assert.equal(restoreChallenge(restored.progress.gameSessions['world:knowledge-challenge'].challenge,emptyChallenge()).answer,alias.after);
});
