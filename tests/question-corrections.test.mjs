import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import questions from '../app/world-question-index.json' with {type:'json'};
import registry from '../content/editorial-reviews.json' with {type:'json'};
import dossier from '../content/invention-editorial-review.json' with {type:'json'};
import {historicalQuestionBank} from '../scripts/world-question-index.mjs';
const corrections=registry.questionCorrections;
const changedHistory=['fire','writing','pyramids','paper','zero','medieval_cities','printing','voyages1492','steam','electric_light','ww1','berlin_wall_build','apollo11','web','berlin_wall_fall','reunification','iss','september11'].map(id=>'history-'+id);
const old=JSON.parse(fs.readFileSync('tests/fixtures/retained-challenge-bank.json','utf8'));
test('only named invention prompts and individually documented Einstein/history explanations and one wrong-answer grammar alias have question exceptions',()=>{
 assert.deepEqual(corrections.map(c=>c.topic).sort(),['light','car','railway','airplane','phone','computer','internet','compass','printing','rocket','satellite','smartphone'].map(id=>'invention-'+id).concat('person-albert_einstein','animal-white-tailed-eagle',changedHistory).sort());
 for(const c of corrections){assert.deepEqual(c.changedFields,[c.topic==='animal-white-tailed-eagle'?'answers':c.topic.startsWith('invention-')?'prompt':'why']);const prior=old.questions.find(q=>q.id===c.id);if(prior)assert.deepEqual(c.before,Object.fromEntries(Object.keys(c.before).map(k=>[k,prior[k]])));else assert.equal(catalog.find(t=>t.id===c.topic).history?.sensitive,true,'only sensitive historical cards are absent from the game bank');}
 const historical=historicalQuestionBank(questions,corrections);for(const prior of old.questions)assert.deepEqual(historical.find(q=>q.id===prior.id),prior);
});
test('historical comparison rejects undocumented current edits and solution/choice/order changes',()=>{
 const q=questions.find(q=>q.id==='invention-internet:mini');
 for(const mutate of [q=>q.prompt+=' x',q=>q.why+=' x',q=>q.answers.reverse(),q=>q.correct=1,q=>q.topic='invention-light']){const broken=structuredClone(q);mutate(broken);assert.throws(()=>historicalQuestionBank([broken],corrections));}
 for(const mutate of [c=>c.changedFields.push('correct'),c=>c.after.answers.reverse(),c=>c.after.correct=1,c=>c.changedFields=[],c=>c.before.why+=' x']){const broken=structuredClone(corrections);mutate(broken[0]);assert.throws(()=>historicalQuestionBank(questions,broken));}
});
test('the reported Internet content error is corrected in the served data and current dossier, with its original retained',()=>{
 const t=catalog.find(t=>t.id==='invention-internet'),d=dossier.topics.find(t=>t.id==='invention-internet');
 assert.equal(t.question.answers[2],'Unterwegs wollten Menschen telefonieren und gleichzeitig Informationen bearbeiten.');
 assert.equal(t.questionFeedback.wrongReasons[2],'Das beschreibt Aufgaben eines Smartphones. Es kann dafür Internetdienste nutzen. Die Frage zielt auf das Verbinden von Computernetzen, nicht auf die Kombination von Funktionen in einem einzelnen Gerät.');
 assert.deepEqual(d.answerSpecificFeedback,t.questionFeedback);assert.deepEqual(d.questionCurrent,t.question);assert.match(d.beforeCorrection20261018.answerSpecificFeedback.wrongReasons[2],/Elektrisches Licht/);
 const e=catalog.find(t=>t.id==='person-albert_einstein');assert.equal(e.question.why,'Einstein untersuchte, wie Raum und Zeit zusammenhängen und welche Rolle Licht dabei spielt. Seine Relativitätstheorien gehören zu diesen Arbeiten.');
});
