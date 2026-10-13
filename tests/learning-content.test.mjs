import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fingerprint} from '../scripts/content-inventory.mjs';
import book from '../app/book-content.json' with {type:'json'};
import wordIndex from '../app/book-word-index.json' with {type:'json'};
import content from '../app/journey-content.json' with {type:'json'};
import index from '../app/journey-index.json' with {type:'json'};
import {validateBookData} from '../app/book-validation.mjs';
import {validateJourneyContent} from '../app/journey-content-validation.mjs';
import {journeyIndex} from '../scripts/learning-index.mjs';
const baseline=JSON.parse(fs.readFileSync('tests/fixtures/learning.json','utf8'));
const frozen=JSON.parse(fs.readFileSync('content/excellence-baseline.json','utf8'));
test('lazy book payload retains every old term, answer and ordering; compact index is complete',()=>{
 assert.equal(validateBookData(book),book);assert.deepEqual(book.words,baseline.GLOSSARY);assert.deepEqual(book.why,baseline.WHY_QUESTIONS);assert.deepEqual(wordIndex,book.words.map(w=>w[0]));
 for(const mutate of [b=>b.words.push(b.words[0]),b=>b.why[0][1]='<script>',b=>b.words[0].pop(),b=>b.schemaVersion=2]){const broken=structuredClone(book);mutate(broken);assert.throws(()=>validateBookData(broken));}
});
test('80 full chapters preserve old identities and final gates, expose distinct editorial levels, and match lightweight metadata',()=>{
 assert.deepEqual(journeyIndex(content),index);const full=validateJourneyContent(content,index);assert.equal(full.length,16);
 const review=JSON.parse(fs.readFileSync('content/journey-editorial-review.json','utf8'));assert.equal(review.chapters.length,80);assert.equal(review.independentReview,false);
 for(const j of full){const old=baseline.JOURNEYS.find(x=>x.id===j.id);assert.ok(old);assert.deepEqual(j.question,old.question);assert.equal(j.steps.length,5);
  for(let i=0;i<5;i++){const s=j.steps[i],r=review.chapters.find(x=>x.id===j.id+':'+i);assert.equal(s.title,old.steps[i].title);const legacy={title:s.title,text:r.baselineText,fact:s.fact,...(s.tryIt?{tryIt:s.tryIt}:{}),journey:j.id,index:i};assert.equal(fingerprint(legacy),frozen.records.find(x=>x.id==='chapters:'+j.id+':'+i).dataHash,'actual frozen P3 chapter '+j.id+':'+i);assert.ok(s.text.startsWith(r.baselineText));assert.ok(s.text.includes(r.addedExplanation));assert.equal(s.starter,r.ages['6-8']);assert.equal(s.deeper,r.ages['12-14']);assert.notEqual(s.starter,s.deeper);assert.equal(s.observe,r.observation);}
 }
});
test('damaged, partial, renamed or duplicate journey payload never replaces a valid chapter set',()=>{
 for(const mutate of [d=>d.journeys.pop(),d=>d.journeys[1]=d.journeys[0],d=>d.journeys[0].steps[0].title='wrong',d=>delete d.journeys[0].steps[0].deeper,d=>d.journeys[0].steps[0].text='<script>',d=>d.journeys[0].steps[0].sourceIds=[]]){const broken=structuredClone(content);mutate(broken);assert.throws(()=>validateJourneyContent(broken,index));}
});
