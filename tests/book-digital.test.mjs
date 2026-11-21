import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {comparePair,binarySignal,byteGroup,shiftUppercase,toySum,accessCards,digestBits,shaExamples} from '../app/book-digital-models.ts';
import {validateDigitalPack,DIGITAL_QUESTIONS} from '../app/book-digital-validation.mjs';
import {GLOSSARY,WHY_QUESTIONS} from '../app/learning-data.ts';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const sha=value=>createHash('sha256').update(value).digest('hex');
const pack=read('app/book-digital-content.json'),words=GLOSSARY.map(row=>({term:row[0]})),why=WHY_QUESTIONS.map(row=>({question:row[0]}));


test('comparison handles equal and negative values without changing its input; a light convention is explicit',()=>{
 const pair=[9,-2];assert.deepEqual(comparePair(pair),{before:[9,-2],after:[-2,9],swapped:true});assert.deepEqual(pair,[9,-2]);assert.equal(comparePair([4,4]).swapped,false);
 assert.deepEqual([binarySignal(true,1).value,binarySignal(false,1).value,binarySignal(true,0).value,binarySignal(false,0).value],[1,0,0,1]);
 for(const input of[[],[1],[1,2,3],[NaN,2],[Infinity,1]])assert.throws(()=>comparePair(input));
 assert.throws(()=>binarySignal('true',1));assert.throws(()=>binarySignal(true,2));
});
test('all256 byte values round-trip with eight independently weighted places',()=>{
 for(let value=0;value<256;value++){const result=byteGroup(value.toString(2).padStart(8,'0'));assert.equal(result.value,value);assert.equal(result.bits.length,8);assert.deepEqual(result.weights,[128,64,32,16,8,4,2,1]);}
 for(const input of['','000000001','1111111','0000000x',' 00000001'])assert.throws(()=>byteGroup(input));
});
test('the toy alphabet rule reverses while two different inputs share the toy checksum',()=>{
 for(const shift of[-53,-26,-1,0,1,2,25,26,53]){const coded=shiftUppercase('HUTAZ',shift);assert.equal(shiftUppercase(coded,-shift),'HUTAZ');}
 assert.equal(shiftUppercase('HUT',1),'IVU');assert.equal(toySum([1,2]).sum,toySum([0,3]).sum);assert.notEqual(toySum([1,2]).sum,toySum([1,3]).sum);
 for(const input of[['Ä',1],['hut',1],['HUT',.5],['HUT',NaN]])assert.throws(()=>shiftUppercase(...input));
 for(const input of[[],[1],[1,2,3],[-1,2],[1.5,2],[10,0]])assert.throws(()=>toySum(input));
});
test('queue, stack and ordered list keep distinct access rules through every removal and reset',()=>{
 for(const[mode,expected]of[['queue',['Fuchs','Reh','Amsel']],['stack',['Amsel','Reh','Fuchs']],['alphabet-list',['Amsel','Fuchs','Reh']]]){
  for(let taken=0;taken<=3;taken++){const result=accessCards(mode,taken);assert.deepEqual(result.removed,expected.slice(0,taken));assert.deepEqual(result.remaining,expected.slice(taken));assert.equal(result.next,expected[taken]??null);assert.equal(result.computerRuntimeMeasured,false);}
  assert.deepEqual(accessCards(mode).remaining,expected);
 }
 for(const[mode,taken]of[['unknown',0],['queue',-1],['queue',4],['queue',.5]])assert.throws(()=>accessCards(mode,taken));
});
test('all displayed SHA-256 examples match independent UTF-8 cryptography and all256 bits',()=>{
 for(const row of shaExamples){const bytes=Buffer.from(row.input,'utf8'),hex=sha(bytes);assert.deepEqual([...bytes],[...row.bytes]);assert.equal(row.hex,hex);const bits=digestBits(hex);assert.equal(bits.length,256);assert.equal(bits.map(String).join(''),[...Buffer.from(hex,'hex')].map(byte=>byte.toString(2).padStart(8,'0')).join(''));}
 for(const input of['','a'.repeat(63),'g'.repeat(64),'A'.repeat(64)])assert.throws(()=>digestBits(input));
});
test('every Digital target and peer exists; the old Median receives the same authored incoming edge',()=>{
 const incoming=read('app/book-digital-word-link-index.json'),topics=read('app/world-index.json');
 for(const[term,item]of Object.entries(pack.learning)){assert(topics.some(row=>row.id===item.topic));for(const link of item.relatedWords??[]){assert(words.some(row=>row.term===link.term));if(pack.learning[link.term])assert(pack.learning[link.term].relatedWords.some(row=>row.term===term),term+' reciprocal peer');else assert(incoming[link.term].some(row=>row.term===term&&row.reason===link.reason));}for(const link of item.relatedQuestions??[])assert(why.some(row=>row.question===link.question));}
 assert.deepEqual(Object.keys(incoming),['Median']);assert.equal(incoming.Median.length,1);assert.equal(incoming.Median[0].term,'Algorithmus');
});
test('missing feedback, unknown targets, unsupported figures and stale source dates are rejected',()=>{
 for(const mutate of[data=>delete data.learning.Bit.question,data=>data.learning.Byte.figure='unknown',data=>data.learning.Algorithmus.relatedWords.push({term:'unpublished',reason:'not available'}),data=>data.learning.Hashfunktion.sources[0].checkedOn='2030-01-01',data=>data.learning.Byte.question.wrongReasons[data.learning.Byte.question.correct===0?1:0]='',data=>data.whyLearning[DIGITAL_QUESTIONS[0]].question.answers.push(data.whyLearning[DIGITAL_QUESTIONS[0]].question.answers[0])]){const bad=structuredClone(pack);mutate(bad);assert.throws(()=>validateDigitalPack(bad));}
});
