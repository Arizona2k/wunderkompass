import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fingerprint} from '../scripts/content-inventory.mjs';
import book from '../app/book-content.json' with {type:'json'};
import wordIndex from '../app/book-word-index.json' with {type:'json'};
import whyIndex from '../app/book-why-index.json' with {type:'json'};
import learningIndex from '../app/book-learning-index.json' with {type:'json'};
import worldIndex from '../app/world-index.json' with {type:'json'};
import {lengthUnits,timeInterval,temperatureUnits} from '../app/book-measure-math.mjs';
import content from '../app/journey-content.json' with {type:'json'};
import index from '../app/journey-index.json' with {type:'json'};
import sources from '../app/journey-sources.json' with {type:'json'};
import {validateBookData} from '../app/book-validation.mjs';
import {validateJourneyContent} from '../app/journey-content-validation.mjs';
import {journeyIndex} from '../scripts/learning-index.mjs';
const baseline=JSON.parse(fs.readFileSync('tests/fixtures/learning.json','utf8'));
const frozen=JSON.parse(fs.readFileSync('content/excellence-baseline.json','utf8'));
test('lazy book payload retains every old term, answer and ordering; compact index is complete',()=>{
 assert.equal(validateBookData(book),book);assert.deepEqual(book.words.slice(0,baseline.GLOSSARY.length),baseline.GLOSSARY);assert.deepEqual(book.why,baseline.WHY_QUESTIONS);assert.deepEqual(wordIndex,book.words.map(w=>w[0]));
 for(const mutate of [b=>b.words.push(b.words[0]),b=>b.why[0][1]='<script>',b=>b.words[0].pop(),b=>b.schemaVersion=2]){const broken=structuredClone(book);mutate(broken);assert.throws(()=>validateBookData(broken));}
});
test('80 full chapters preserve old identities and final gates, expose distinct editorial levels, and match lightweight metadata',()=>{
 assert.deepEqual(journeyIndex(content),index);const full=validateJourneyContent(content,index,sources);assert.equal(full.length,16);
 const review=JSON.parse(fs.readFileSync('content/journey-editorial-review.json','utf8'));assert.equal(review.chapters.length,80);assert.equal(review.independentReview,false);
 for(const j of full){const old=baseline.JOURNEYS.find(x=>x.id===j.id);assert.ok(old);assert.deepEqual(j.question,old.question);assert.equal(j.steps.length,5);
  for(let i=0;i<5;i++){const s=j.steps[i],r=review.chapters.find(x=>x.id===j.id+':'+i);assert.equal(s.title,old.steps[i].title);const legacy={title:s.title,text:r.baselineText,fact:s.fact,...(s.tryIt?{tryIt:s.tryIt}:{}),journey:j.id,index:i};assert.equal(fingerprint(legacy),frozen.records.find(x=>x.id==='chapters:'+j.id+':'+i).dataHash,'actual frozen P3 chapter '+j.id+':'+i);assert.ok(s.text.startsWith(r.baselineText));assert.ok(s.text.includes(r.addedExplanation));assert.equal(s.starter,r.ages['6-8']);assert.equal(s.deeper,r.ages['12-14']);assert.notEqual(s.starter,s.deeper);assert.equal(s.observe,r.observation);for(const id of s.sourceIds){assert.ok(sources[id]);assert.match(sources[id].url,/^https:\/\//);}}
 }
});
test('damaged, partial, renamed or duplicate journey payload never replaces a valid chapter set',()=>{
 for(const mutate of [d=>d.journeys.pop(),d=>d.journeys[1]=d.journeys[0],d=>d.journeys[0].steps[0].title='wrong',d=>delete d.journeys[0].steps[0].deeper,d=>d.journeys[0].steps[0].text='<script>',d=>d.journeys[0].steps[0].sourceIds=[],d=>d.journeys[0].question.correct=99,d=>d.journeys[0].steps[0].sourceIds=['unknown-source']]){const broken=structuredClone(content);mutate(broken);assert.throws(()=>validateJourneyContent(broken,index,sources));}
});

test('well-formed but partial, renamed or reordered books are withheld against generated identity indexes',()=>{
 const expected={words:wordIndex,why:whyIndex,learning:learningIndex};assert.equal(validateBookData(book,expected),book);assert.deepEqual(whyIndex,book.why.map(q=>q[0]));
 for(const mutate of [b=>b.words.shift(),b=>b.why.pop(),b=>b.words.reverse(),b=>b.why.reverse(),b=>b.words[0][0]='Unbekannter Begriff',b=>b.why[0][0]='Unbekannte Frage']){const broken=structuredClone(book);mutate(broken);assert.equal(validateBookData(broken),broken,'shape alone is insufficient');assert.throws(()=>validateBookData(broken,expected),/Identitäten/);}
});
test('distinct measurement and biological explanations have checked references, voluntary learning, plausible feedback and real links; damaged enrichment fails closed',()=>{
 const expected={words:wordIndex,why:whyIndex,learning:learningIndex,topics:worldIndex.map(t=>t.id)};
 assert.equal(book.words.length,127);assert.equal(learningIndex.length,40);assert.equal(new Set(Object.values(book.learning).filter(l=>l.quantity).map(l=>l.quantity)).size,7);
 const review=JSON.parse(fs.readFileSync('content/book-editorial-review.json','utf8'));assert.equal(review.independentReview,false);assert.equal(review.entries.length,40);
 for(const [name,l] of Object.entries(book.learning)){const r=review.entries.find(x=>x.id==='words:'+name);assert.equal(fingerprint([book.words.find(w=>w[0]===name),l]),r.contentHash);assert.ok(!r.acceptedForDoubling);assert.notEqual(l.starter,l.deeper);assert.ok(l.benefit.length>50);assert.ok(l.observe.length>70);assert.equal(l.question.wrongReasons[l.question.correct],'');assert.equal(new Set(l.question.wrongReasons.filter(Boolean)).size,2);assert.ok(l.connection.length>50);assert.ok(expected.topics.includes(l.topic));}
 for(const mutate of [b=>delete b.learning,b=>delete b.learning.Meter,b=>b.learning.Meter.topic='unknown',b=>b.learning.Kelvin.sources=[],b=>b.learning.Sekunde.sources[0].url='http://example.com',b=>b.learning.Mol.sources[0].checkedOn='never',b=>b.learning.Kelvin.sources[0].checkedOn='2026-02-30',b=>b.learning.Ampere.question.correct=3,b=>b.learning.Candela.question.wrongReasons[0]='',b=>b.learning.Meter.model='unknown',b=>b.learning.Mol.illustration='unknown',b=>b.learning.Meter.starter='<script>']){const broken=structuredClone(book);mutate(broken);assert.throws(()=>validateBookData(broken,expected));}
});
test('measurement models keep physical examples consistent across units, shifted starts and different temperature zero points',()=>{
 assert.deepEqual(lengthUnits(50),{centimetres:50,metres:.5});assert.equal(lengthUnits(200).metres,2);
 assert.deepEqual(timeInterval(20,4),{start:20,end:24,duration:4});assert.equal(timeInterval(10,4).duration,timeInterval(20,4).duration);
 assert.deepEqual(temperatureUnits(0),{celsius:0,kelvin:273.15});assert.ok(Math.abs(temperatureUnits(40).kelvin-temperatureUnits(-20).kelvin-60)<1e-10);
 for(const invalid of [NaN,Infinity,-1,0,201])assert.throws(()=>lengthUnits(invalid));
 for(const invalid of [NaN,Infinity,0,11,1.5])assert.throws(()=>timeInterval(20,invalid));assert.throws(()=>timeInterval(15,4));
 for(const invalid of [NaN,Infinity,-21,41])assert.throws(()=>temperatureUnits(invalid));
});
