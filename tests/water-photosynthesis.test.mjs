import test from 'node:test';
import assert from 'node:assert/strict';
import legacy from './fixtures/water-photosynthesis-legacy-answers.json' with {type:'json'};
import {CHALLENGE_BANK,challengeQuestionForOrder,restoreChallenge,emptyChallenge} from '../app/knowledge-challenge.ts';
import {createSave,restoreSave,emptyProgress} from '../app/progress-storage.ts';
import {retainedChallengeChoiceVariant} from '../app/retained-answer-wording.mjs';

// Each legacy question (before) is paired with the current challenge question of the same ID (after).
const rows=legacy.questions.map(before=>({id:before.id,before,after:CHALLENGE_BANK.find(q=>q.id===before.id)}));
const legacyIds=new Set(rows.map(row=>row.id));
// Alle Reihenfolgen, für drei oder (seit Teilschritt 3 auf Profi) vier Antworten.
const permutations=list=>list.length<=1?[list]:list.flatMap((x,i)=>permutations([...list.slice(0,i),...list.slice(i+1)]).map(rest=>[x,...rest]));

function round(row,order,{done=false,answer=order[0]}={}){
 const other=CHALLENGE_BANK.filter(q=>q.difficulty===row.after.difficulty&&!legacyIds.has(q.id)).slice(0,5);
 assert.equal(other.length,5);
 const questions=done?[...other,row.after]:[row.after,...other];
 return {difficulty:row.after.difficulty,ids:questions.map(q=>q.id),orders:Object.fromEntries(questions.map(q=>[q.id,q.id===row.id?order:[...q.answers].reverse()])),index:done?5:0,answer,done};
}

test('nine exact legacy answer sets preserve all six permutations, literal wrong selections, unfinished and legitimately completed rounds through schema3 export/import',()=>{
 assert.equal(rows.length,9);assert.equal(legacyIds.size,9);
 for(const row of rows){
  assert(row.after,row.id+' still exists in the current challenge bank');
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
 for(const row of rows){
  for(const order of [[...row.before.answers.slice(0,2),'unknown'],[row.before.answers[0],row.before.answers[0],row.before.answers[2]],[row.before.answers[0],row.before.answers[1],row.after.answers[2]]]){
   if(new Set(order).size!==3||!permutations(row.before.answers).some(p=>JSON.stringify(p)===JSON.stringify(order))){assert.equal(retainedChallengeChoiceVariant(row.after,order),null);assert.deepEqual(restoreChallenge(round(row,order),emptyChallenge()),emptyChallenge());}
  }
  for(const mutate of[q=>q.prompt+='?',q=>q.why+=' unreviewed',q=>q.correct=1,q=>q.id+='-unknown',q=>q.topic='science-moon-phases',q=>q.answers[1]+=' unknown']){const bad=structuredClone(row.after);mutate(bad);assert.equal(retainedChallengeChoiceVariant(bad,row.before.answers),null);}
  for(const wrong of row.before.answers.filter((_,i)=>i!==row.before.correct)){const session=round(row,row.before.answers,{answer:wrong}),actual=restoreChallenge(session,emptyChallenge());assert.equal(actual.answer,wrong);assert.notEqual(actual.answer,row.after.answers[row.after.correct]);assert.equal(actual.done,false);}
 }
});
