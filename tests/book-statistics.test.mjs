import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {location,locationCases,repetitionCases,ratioLength,sampleCircles,selections} from '../app/book-statistics-models.ts';
import {validateStatisticsPack,STATISTICS_QUESTIONS} from '../app/book-statistics-validation.mjs';
import {GLOSSARY,WHY_QUESTIONS} from '../app/learning-data.ts';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const pack=read('app/book-statistics-content.json'),words=GLOSSARY.map(w=>({term:w[0]})),why=WHY_QUESTIONS.map(w=>({question:w[0]}));
test('mean and median distinguish a large outlier, an even middle pair and unchanged source order',()=>{
 const before=structuredClone(locationCases);assert.deepEqual(locationCases.map(v=>{const s=location(v);return[s.mean,s.median,s.range];}),[[5,4,7],[10,4,22],[6,5.5,11],[13/3,2,7]]);assert.deepEqual(locationCases,before);assert.deepEqual(location([9,2,4]),location([2,4,9]));assert.equal(location([1,2,30]).mean,11);assert.equal(location([1,2,30]).median,2);for(const input of[[],[Infinity],[NaN]])assert.throws(()=>location(input));
});
test('zero observed range can coexist with a common offset and the selected sample is not the whole collection',()=>{
 assert.deepEqual(repetitionCases.map(v=>{const s=location(v);return[s.mean,s.range,s.mean-120];}),[[120,2,0],[125,2,5],[125,0,5]]);assert.deepEqual(selections.map(sampleCircles),[{circles:4,total:4},{circles:1,total:4},{circles:4,total:12}]);for(const input of[[],[0,0],[-1],[12],[.5]])assert.throws(()=>sampleCircles(input));
});
test('scale ratios preserve the same real length and reject invalid denominators',()=>{
 assert.deepEqual([50,100,200].map(s=>ratioLength(200,s)),[4,2,1]);assert.equal(ratioLength(200,100)*100,200);for(const n of[0,-1,Infinity,NaN])assert.throws(()=>ratioLength(200,n));assert.throws(()=>ratioLength(-1,100));
});
test('all statistics targets exist and old incoming edges come from the same authored relationships',()=>{
 const incoming=read('app/book-statistics-word-link-index.json'),topics=read('app/world-index.json');for(const[term,item]of Object.entries(pack.learning)){assert(topics.some(x=>x.id===item.topic));for(const l of item.relatedWords??[]){assert(words.some(x=>x.term===l.term));if(pack.learning[l.term])assert(pack.learning[l.term].relatedWords.some(x=>x.term===term),term+' reciprocal peer');else assert(incoming[l.term].some(x=>x.term===term&&x.reason===l.reason));}for(const l of item.relatedQuestions??[])assert(why.some(x=>x.question===l.question));}
 assert.deepEqual(Object.keys(incoming),['Meter','Meeresspiegel']);assert.equal(Object.values(incoming).flat().length,3);
});
test('missing answers, unknown unpublished targets and stale source dates are rejected',()=>{
 for(const mutate of[p=>delete p.whyLearning[STATISTICS_QUESTIONS[0]].question,p=>p.learning.Skala.relatedWords.push({term:'unpublished',reason:'unknown'}),p=>p.learning.Median.figure='unknown',p=>p.learning.Messwert.sources[0].checkedOn='2030-01-01',p=>p.whyLearning[STATISTICS_QUESTIONS[1]].question.wrongReasons[1]='']){const b=structuredClone(pack);mutate(b);assert.throws(()=>validateStatisticsPack(b));}
});
