import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {comparePair,binarySignal,byteGroup,shiftUppercase,toySum,accessCards,digestBits,shaExamples} from '../app/book-digital-models.ts';
import {validateDigitalPack,DIGITAL_WORDS,DIGITAL_QUESTIONS} from '../app/book-digital-validation.mjs';
import {bookDigitalContent} from '../scripts/book-digital-index.mjs';
import {digitalPredecessors,withStatisticsPreDigitalRuntime} from './digital-predecessor-reference.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {astronomyPredecessors,withDigitalPreAstronomyRuntime} from './astronomy-predecessor-reference.mjs';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const sha=value=>createHash('sha256').update(value).digest('hex'),whole=value=>sha(JSON.stringify(value));
const pack=read('app/book-digital-content.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');

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
test('twelve distinct Digital studies preserve every delivered150/47 tuple, order and nine whole old packs',()=>{
 assert.deepEqual(bookDigitalContent(true),pack);assert.equal(words.length,171);assert.equal(new Set(words.map(row=>row.term)).size,171);assert.equal(why.length,52);assert.equal(new Set(why.map(row=>row.question)).size,52);assert.equal(DIGITAL_WORDS.length,9);assert.equal(DIGITAL_QUESTIONS.length,3);assert.equal(read('exports/content/book-digital.json').length,12);
 const old=read('tests/fixtures/book-before-digital-150-hashes.json');assert.equal(Object.keys(old.words).length,150);assert.equal(Object.keys(old.why).length,47);assert.equal(Object.keys(old.packs).length,9);
 for(const[term,hash]of Object.entries(old.words))assert.equal(whole(words.find(row=>row.term===term)),hash,term);
 assert.deepEqual(why.slice(0,47).map(row=>row.question),old.whyOrder);
 for(const[question,hash]of Object.entries(old.why))assert.equal(whole(why.find(row=>row.question===question)),hash,question);
 for(const[file,hash]of Object.entries(old.packs))assert.equal(sha(fs.readFileSync(file)),hash,file);
});
test('every Digital target and peer exists; the old Median receives the same authored incoming edge',()=>{
 const incoming=read('app/book-digital-word-link-index.json'),topics=read('app/world-index.json');
 for(const[term,item]of Object.entries(pack.learning)){assert(topics.some(row=>row.id===item.topic));for(const link of item.relatedWords??[]){assert(words.some(row=>row.term===link.term));if(pack.learning[link.term])assert(pack.learning[link.term].relatedWords.some(row=>row.term===term),term+' reciprocal peer');else assert(incoming[link.term].some(row=>row.term===term&&row.reason===link.reason));}for(const link of item.relatedQuestions??[])assert(why.some(row=>row.question===link.question));}
 assert.deepEqual(Object.keys(incoming),['Median']);assert.equal(incoming.Median.length,1);assert.equal(incoming.Median[0].term,'Algorithmus');
});
test('missing feedback, unknown targets, unsupported figures and stale source dates are rejected',()=>{
 for(const mutate of[data=>delete data.learning.Bit.question,data=>data.learning.Byte.figure='unknown',data=>data.learning.Algorithmus.relatedWords.push({term:'unpublished',reason:'not available'}),data=>data.learning.Hashfunktion.sources[0].checkedOn='2030-01-01',data=>data.learning.Byte.question.wrongReasons[data.learning.Byte.question.correct===0?1:0]='',data=>data.whyLearning[DIGITAL_QUESTIONS[0]].question.answers.push(data.whyLearning[DIGITAL_QUESTIONS[0]].question.answers[0])]){const bad=structuredClone(pack);mutate(bad);assert.throws(()=>validateDigitalPack(bad));}
});
test('all177 whole M85 dossiers and the actual runtime survive; unknown or changed history cannot pass',()=>{
 const raw=read('content/editorial-reviews.json').dossiers,old=read('tests/fixtures/book-before-digital-150-hashes.json');assert.deepEqual(digitalPredecessors(raw).map(row=>({id:row.id,sha256:whole(row)})),old.whole177PredecessorDossiers);assert.equal(withStatisticsPreDigitalRuntime(process.cwd(),learningFingerprint),'089da9e206b54242');
 for(const mutate of[rows=>rows[0].explanation+=' unreviewed',rows=>delete rows[0].historicalUIBeforeStatistics20261031,rows=>rows[166].ui.build='invented',rows=>rows[177].dataHash='changed',rows=>rows[177].ui={build:'invented'},rows=>rows.reverse(),rows=>rows.pop()]){const bad=structuredClone(raw);mutate(bad);assert.throws(()=>digitalPredecessors(bad));}
});

// Apply only after actual complete current product/browser observations and current original visual review.
import {collectInventory,fingerprint} from '../scripts/content-inventory.mjs';
import {validateDossier} from '../scripts/editorial-contract.mjs';
const currentDigitalFixture=read('tests/fixtures/editorial-before-digital-177.json');
const currentDigitalInventory=collectInventory(),currentDigitalRecords=new Map(currentDigitalInventory.records.map(row=>[row.id,row])),currentDigitalKnownIds=new Set(currentDigitalRecords.keys());
function assertActualCurrent189(items){
 items=astronomyPredecessors(items);
 assert.equal(items.length,189);assert.equal(currentDigitalFixture.priorDossiers.length,177);assert.equal(currentDigitalFixture.addedDossiers.length,12);assert.equal(currentDigitalFixture.currentTemplate.build,withDigitalPreAstronomyRuntime(process.cwd(),learningFingerprint));
 const old=digitalPredecessors(items),baseline=read('tests/fixtures/book-before-digital-150-hashes.json');assert.deepEqual(old.map(row=>({id:row.id,sha256:whole(row)})),baseline.whole177PredecessorDossiers);
 const expectedIds=[...DIGITAL_WORDS.map(term=>'words:'+term),...DIGITAL_QUESTIONS.map(question=>'why:'+why.findIndex(row=>row.question===question))];assert.equal(new Set(expectedIds).size,12);assert.deepEqual(currentDigitalFixture.addedDossiers.map(row=>row.id),expectedIds);
 const teaching=read('exports/content/book-digital.json');
 for(const item of items){const record=currentDigitalRecords.get(item.id);assert(record,item.id);assert.equal(validateDossier(item,record,{build:currentDigitalFixture.currentTemplate.build,knownIds:currentDigitalKnownIds}).structurallyReady,true,item.id+' actual current technical contract');}
 for(const id of expectedIds){const dossier=items.find(row=>row.id===id),record=currentDigitalRecords.get(id);assert(dossier&&record);assert.equal(dossier.dataHash,record.dataHash);const word=record.family==='words',key=word?record.legacyId:why[record.sourceIndex].question,canonical=word?words.find(row=>row.term===key):why[record.sourceIndex];assert.equal(record.dataHash,fingerprint(canonical));const lesson=teaching.find(row=>row.kind===(word?'word':'why')&&(word?row.term:row.whyQuestion)===key);assert(lesson);assert.equal(dossier.teachingDataHash,fingerprint(lesson));assert.deepEqual(dossier.sources.map(row=>row.url),(word?pack.learning:pack.whyLearning)[key].sources.map(row=>row.url));assert.equal(dossier.ui.route,record.route);}
}
test('all189 current UI contracts preserve the177 entire M85 predecessors and twelve individually authored Digital studies',()=>assertActualCurrent189(read('content/editorial-reviews.json').dossiers));
test('current189 UI rejects stale state, lost nested histories, wrong teaching, unknown or reordered identities and lost prior whole UI',()=>{
 for(const mutate of[rows=>rows[177].ui.build='stale',rows=>rows[177].ui.offline=false,rows=>rows[177].teachingDataHash='0'.repeat(64),rows=>rows[177].dataHash='0'.repeat(64),rows=>rows[0].explanation+=' unreviewed',rows=>delete rows[0].historicalUIBeforeDigital20261101,rows=>delete rows[0].historicalUIBeforeStatistics20261031,rows=>delete rows[0].historicalUIBeforeGene20261031,rows=>delete rows[0].historicalUIBeforeCell20261031,rows=>rows[166].historicalUIBeforeDigital20261101.build='invented',rows=>rows[188].ui.route='book/words/unpublished',rows=>rows.reverse(),rows=>rows.pop()]){const changed=structuredClone(read('content/editorial-reviews.json').dossiers);mutate(changed);assert.throws(()=>assertActualCurrent189(changed));}
});
