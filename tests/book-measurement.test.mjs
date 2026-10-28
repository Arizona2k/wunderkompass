import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {lengthUnits,timeInterval,temperatureUnits} from '../app/book-measure-math.mjs';
import {MEASUREMENT_TERMS,validateMeasurementPack} from '../app/book-measurement-validation.mjs';
import {bookMeasurementContent} from '../scripts/book-measurement-index.mjs';

const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const pack=read('app/book-measurement-content.json');

test('measurement examples distinguish length units, elapsed time and temperature scales at both bounds',()=>{
 assert.deepEqual(lengthUnits(10),{centimetres:10,metres:0.1});
 assert.deepEqual(lengthUnits(200),{centimetres:200,metres:2});
 assert.deepEqual(timeInterval(10,4),{start:10,end:14,duration:4});
 assert.deepEqual(timeInterval(20,4),{start:20,end:24,duration:4});
 assert.equal(timeInterval(20,10).end,30);
 assert.deepEqual(temperatureUnits(-20),{celsius:-20,kelvin:253.15});
 assert.deepEqual(temperatureUnits(40),{celsius:40,kelvin:313.15});
 assert.equal(temperatureUnits(5).kelvin-temperatureUnits(0).kelvin,5);
 for(const value of [-1,0,201,NaN,Infinity])assert.throws(()=>lengthUnits(value),/outside model/);
 for(const value of [-21,41,NaN,Infinity])assert.throws(()=>temperatureUnits(value),/outside model/);
 for(const [start,duration] of [[0,4],[30,1],[10,0],[10,11],[20,1.5],[20,NaN]])assert.throws(()=>timeInterval(start,duration),/outside model/);
});

test('partial, corrupt or malformed measurement explanations cannot be accepted as the complete pack',()=>{
 assert.equal(validateMeasurementPack(pack),pack);
 for(const mutate of [
  data=>{delete data.words.Meter;},
  data=>{delete data.learning.Mol;},
  data=>{data.learning.Ampere.symbol='V';},
  data=>{data.learning.Sekunde.question.correct=99;},
  data=>{const q=data.learning.Kelvin.question;q.wrongReasons[(q.correct+1)%q.answers.length]='';},
  data=>{data.learning.Meter.sources[0].url='http://example.invalid';},
  data=>{data.sourceReadOn='2026-02-30';},
  data=>{data.learning.Candela.sources[0].checkedOn='2026-02-30';},
  data=>{data.learning.Kilogramm.model='unbounded-instrument';}
 ]){const changed=structuredClone(pack);mutate(changed);assert.throws(()=>validateMeasurementPack(changed),/Incomplete measurement/);}
});

test('all90 delivered dictionary payloads remain exact while seven unique SI terms share one canonical export and reachable relationships',()=>{
 const previous=read('tests/fixtures/book-before-measurement-90-hashes.json'),words=read('exports/content/knowledge-words.json');
 assert.equal(Object.keys(previous.words).length,90);assert.equal(words.length,113);
 assert.equal(new Set(words.map(word=>word.term)).size,113);
 for(const [term,sha256] of Object.entries(previous.words)){
  const current=words.find(word=>word.term===term);assert.ok(current,term);
  assert.equal(createHash('sha256').update(JSON.stringify(current)).digest('hex'),sha256,term+' retains its delivered definition');
 }
 assert.deepEqual(bookMeasurementContent(true),pack);
 const exported=read('exports/content/book-measurements.json'),topics=read('app/world-index.json'),why=read('exports/content/why-questions.json');
 assert.equal(why.length,34);assert.deepEqual(exported.map(row=>row.term),MEASUREMENT_TERMS);
 const links=read('app/book-measurement-topic-index.json');
 for(const term of MEASUREMENT_TERMS){
  const word=words.find(word=>word.term===term),learning=pack.learning[term];
  assert.deepEqual([word.term,word.short,word.more],pack.words[term]);
  assert.deepEqual(exported.find(row=>row.term===term),{term,group:word.short,definition:word.more,...learning,sourceReadOn:pack.sourceReadOn});
  assert.ok(topics.some(topic=>topic.id===learning.topic),term+' has a published topic');
  assert.deepEqual(links.find(link=>link.term===term),{term,topic:learning.topic,connection:learning.connection});
  for(const link of learning.relatedWords??[])assert.ok(words.some(word=>word.term===link.term),term+' related word '+link.term);
  for(const link of learning.relatedQuestions??[])assert.ok(why.some(item=>item.question===link.question),term+' related question');
 }
});
