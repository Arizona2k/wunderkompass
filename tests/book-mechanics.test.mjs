import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {MECHANICS_WORDS,MECHANICS_QUESTIONS,validateMechanicsPack} from '../app/book-mechanics-validation.mjs';
import {bookMechanicsContent} from '../scripts/book-mechanics-index.mjs';
import {forceStep,straightSamples,torqueMagnitude,elasticSketch} from '../app/book-mechanics-models.ts';

const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const sha=raw=>createHash('sha256').update(raw).digest('hex');
const digest=value=>sha(JSON.stringify(value));
const pack=read('app/book-mechanics-content.json');

test('four mechanics concepts and three Why explanations share exact canonical teaching, source and projection payloads',()=>{
 assert.deepEqual(bookMechanicsContent(true),pack);
 assert.equal(MECHANICS_WORDS.length,4);assert.equal(MECHANICS_QUESTIONS.length,3);
 const raw=fs.readFileSync('app/book-mechanics-content.json'),integrity=read('app/book-mechanics-integrity.json');
 assert.equal(raw.length,integrity.bytes);assert.equal(sha(raw),integrity.sha256);
 const words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json'),teaching=read('exports/content/book-mechanics.json');
 assert.equal(words.length,134);assert.equal(why.length,42);assert.equal(teaching.length,7);
 for(const term of MECHANICS_WORDS){
  const row=words.find(item=>item.term===term);assert(row);assert.deepEqual([row.term,row.short,row.more],pack.words[term]);
  assert.deepEqual(teaching.find(item=>item.kind==='word'&&item.term===term),{kind:'word',term,definition:row.more,...pack.learning[term],sourceReadOn:pack.sourceReadOn});
 }
 for(const whyQuestion of MECHANICS_QUESTIONS){
  const row=why.find(item=>item.question===whyQuestion);assert(row);assert.deepEqual([row.question,row.answer],pack.why[whyQuestion]);
  const actual=teaching.find(item=>item.kind==='why'&&item.whyQuestion===whyQuestion);
  assert.deepEqual(actual,{kind:'why',whyQuestion,definition:row.answer,...pack.whyLearning[whyQuestion],sourceReadOn:pack.sourceReadOn});
  assert.equal(typeof actual.whyQuestion,'string');assert.equal(typeof actual.question.prompt,'string','canonical Why identity stays separate from its assessment');
 }
 const index=read('exports/content/index.json');
 for(const name of ['knowledge-words.json','why-questions.json'])assert(index.files.find(row=>row.file===name).sources.includes('app/book-mechanics-index.json'));
 assert(index.files.find(row=>row.file==='book-mechanics.json').sources.includes('app/book-mechanics-content.json'));
});

test('all122 earlier complete word payloads,37 Why payloads at stable indices and five earlier teaching packs remain unchanged',()=>{
 const old=read('tests/fixtures/book-before-mechanics-122-hashes.json');
 assert.equal(old.sourcePublicHead,'68d4dce86bed80438f9b90e92b9194bfe5973811');
 assert.equal(old.words.length,122);assert.equal(old.why.length,37);assert.equal(Object.keys(old.packs).length,5);
 const words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');
 assert.equal(new Set(words.map(row=>row.term)).size,134);assert.equal(new Set(why.map(row=>row.question)).size,42);
 for(const row of old.words)assert.equal(digest(words.find(item=>item.term===row.term)),row.sha256,row.term+' entire previous word');
 for(const [index,row]of old.why.entries()){assert.equal(why[index].question,row.question);assert.equal(digest(why[index]),row.sha256,row.question+' whole payload and saved index');}
 for(const [file,hash]of Object.entries(old.packs))assert.equal(sha(fs.readFileSync(file)),hash,file);
});

test('existing kilogram, metre and second words receive only explained incoming mechanics links from the canonical source',()=>{
 const incoming=read('app/book-mechanics-word-link-index.json'),topicLinks=read('app/book-mechanics-topic-index.json'),topics=read('app/world-index.json');
 assert.deepEqual(Object.keys(incoming).sort(),['Kilogramm','Meter','Sekunde']);assert.equal(topicLinks.length,7);
 for(const [term,links]of Object.entries(incoming)){
  assert(!Object.hasOwn(pack.words,term));assert(links.length>0);
  for(const link of links)assert.deepEqual(pack.learning[link.term].relatedWords.find(row=>row.term===term),{term,reason:link.reason});
 }
 for(const [kind,rows]of [['word',pack.learning],['why',pack.whyLearning]])for(const [term,item]of Object.entries(rows)){
  assert(topics.some(row=>row.id===item.topic));
  assert.deepEqual(topicLinks.find(row=>row.kind===kind&&row.term===term),{kind,term,topic:item.topic,connection:item.benefit});
 }
});

test('missing, unsafe or inconsistent mechanics explanations and answer feedback fail closed',()=>{
 assert.equal(validateMechanicsPack(pack),pack);
 for(const mutate of [
  d=>{delete d.words.Kraft;},d=>{delete d.learning.Trägheit;},d=>{delete d.why[MECHANICS_QUESTIONS[0]];},d=>{delete d.whyLearning[MECHANICS_QUESTIONS[1]];},
  d=>{d.learning.Kraft.question.correct=99;},d=>{d.learning.Geschwindigkeit.question.answers[1]=d.learning.Geschwindigkeit.question.answers[0];},
  d=>{const q=d.learning.Beschleunigung.question;q.wrongReasons[(q.correct+1)%q.answers.length]='';},
  d=>{d.learning.Kraft.sources[0].url='javascript:alert(1)';},d=>{d.learning.Kraft.sources[0].checkedOn='2026-02-30';},d=>{d.sourceReadOn='2026-02-30';},
  d=>{d.learning.Kraft.figure='force-always-reverses-motion';},d=>{d.learning.Kraft.topic='unpublished-topic';},
  d=>{d.learning.Kraft.relatedWords[0].term='unpublished-word';},d=>{d.words.Trägheit[0]='Kraft';}
 ]){const invalid=structuredClone(pack);mutate(invalid);assert.throws(()=>validateMechanicsPack(invalid),/Incomplete mechanics/);}
});

test('balanced forces preserve signed motion and opposing net force can slow motion without instantly reversing it',()=>{
 assert.deepEqual(forceStep(2,2,2,2),{net:0,acceleration:0,velocityAfter:2});
 assert.deepEqual(forceStep(2,2,2,-2),{net:0,acceleration:0,velocityAfter:-2});
 assert.deepEqual(forceStep(2,0,2,3),{net:-2,acceleration:-1,velocityAfter:2});
 assert.deepEqual(forceStep(0,2,2,-3),{net:2,acceleration:1,velocityAfter:-2});
 assert.equal(forceStep(0,4,4,0).velocityAfter,1);assert.equal(forceStep(0,4,2,0).velocityAfter,2);
 for(const args of [[0,4,0,0],[0,4,2,0,-1],[NaN,4,2,0]])assert.throws(()=>forceStep(...args),/Invalid/);
});

test('equal-time positions preserve direction and stationary samples coincide',()=>{
 assert.deepEqual(straightSamples(-2).map(row=>row.position),[0,-2,-4,-6]);
 assert.deepEqual(straightSamples(2).map(row=>row.position),[0,2,4,6]);
 assert(straightSamples(0).every(row=>row.position===0));
});

test('doubling the perpendicular lever arm doubles moment while a force through the pivot has zero moment',()=>{
 assert.deepEqual(torqueMagnitude(2,1,90),{perpendicularArm:1,moment:2});
 assert.deepEqual(torqueMagnitude(2,2,90),{perpendicularArm:2,moment:4});
 assert.deepEqual(torqueMagnitude(2,2,0),{perpendicularArm:0,moment:0});
 assert.deepEqual(torqueMagnitude(2,2,180),{perpendicularArm:0,moment:0});
 assert(Math.abs(torqueMagnitude(2,2,45).moment-2*Math.sqrt(2))<1e-12);
});

test('nonlinear reversible deformation remains distinct from permanent change in the invented drawing model',()=>{
 assert.deepEqual([1,2].map(load=>elasticSketch('linear',load,false)),[20,40]);
 assert.deepEqual([1,2].map(load=>elasticSketch('nonlinear',load,false)),[15,40]);
 assert.equal(elasticSketch('linear',0,true),0);assert.equal(elasticSketch('nonlinear',0,true),0);
 assert.equal(elasticSketch('permanent',0,false),0);assert.equal(elasticSketch('permanent',0,true),12);
 assert.throws(()=>elasticSketch('linear',3,false),/Invalid/);
});
