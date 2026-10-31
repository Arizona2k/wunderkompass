import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {bookCellContent} from '../scripts/book-cell-index.mjs';
import {validateCellPack,CELL_WORDS,CELL_QUESTIONS} from '../app/book-cell-validation.mjs';
import {cellExample} from '../app/book-cell-comparison-model.ts';
import {compareDNASequences,inspectDNASequence} from '../app/book-cell-dna-model.ts';
import {membraneExample,mitochondrialExample,genomeCollection} from '../app/book-cell-process-model.ts';
const read=name=>JSON.parse(fs.readFileSync(name,'utf8')),pack=read('app/book-cell-content.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json'),digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('eight independently named cell concepts and two Why studies use one complete checked canonical export',()=>{
 assert.equal(CELL_WORDS.length,8);assert.equal(CELL_QUESTIONS.length,2);assert.deepEqual(bookCellContent(true),pack);assert.deepEqual(validateCellPack(structuredClone(pack)),pack);
 const bytes=fs.readFileSync('app/book-cell-content.json');assert.deepEqual(read('app/book-cell-integrity.json'),{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 assert.equal(words.length,142);assert.equal(why.length,44);const teaching=read('exports/content/book-cell.json');assert.equal(teaching.length,10);
 for(const term of CELL_WORDS){const row=words.find(w=>w.term===term);assert(row);assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert.deepEqual(teaching.find(e=>e.kind==='word'&&e.term===term),{kind:'word',term,definition:row.more,...pack.learning[term],sourceReadOn:pack.sourceReadOn});}
 for(const question of CELL_QUESTIONS){const row=why.find(w=>w.question===question);assert(row);assert.deepEqual([row.question,row.answer],pack.why[question]);assert.deepEqual(teaching.find(e=>e.kind==='why'&&e.whyQuestion===question),{kind:'why',whyQuestion:question,definition:row.answer,...pack.whyLearning[question],sourceReadOn:pack.sourceReadOn});}
});
test('all126 whole older word payloads,40 Why identities and six complete earlier teaching packs remain unchanged',()=>{
 const old=read('tests/fixtures/book-before-cell-126-hashes.json');assert.equal(old.sourceCommit,'3758bbb47618ab1bc09e3fed3c3386831036e675');assert.equal(Object.keys(old.words).length,126);assert.equal(Object.keys(old.why).length,40);
 for(const[term,hash]of Object.entries(old.words))assert.equal(digest(words.find(row=>row.term===term)),hash,term);
 for(const[question,hash]of Object.entries(old.why))assert.equal(digest(why.find(row=>row.question===question)),hash,question);
 assert.equal(Object.keys(old.packs).length,6);for(const[file,hash]of Object.entries(old.packs))assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,file);
 const baseline=read('content/excellence-baseline.json');assert.equal(baseline.families.find(f=>f.id==='words').count,90);assert.equal(baseline.families.find(f=>f.id==='why').count,30);
});
test('cell relationships are canonical and reciprocal, including generated oldAtom and Energie returns and both Why routes',()=>{
 const incoming=read('app/book-cell-word-link-index.json');assert.deepEqual(Object.keys(incoming),['Energie','Atom']);assert.equal(incoming.Atom[0].term,'DNA');assert.equal(incoming.Energie[0].term,'Mitochondrium');
 const links=read('app/book-cell-topic-index.json');assert.equal(links.length,10);assert(links.every(row=>row.topic==='science-cell'));assert.equal(links.filter(row=>row.kind==='word').length,8);assert.equal(links.filter(row=>row.kind==='why').length,2);
 for(const[term,item]of Object.entries(pack.learning)){
  for(const link of item.relatedWords??[]){assert(words.some(w=>w.term===link.term));if(Object.hasOwn(pack.learning,link.term))assert(pack.learning[link.term].relatedWords?.some(l=>l.term===term),term+' has a meaningful reciprocal peer relation');else assert(incoming[link.term].some(l=>l.term===term&&l.reason===link.reason));}
  for(const link of item.relatedQuestions??[])assert(pack.whyLearning[link.question]?.relatedWords?.some(l=>l.term===term));
 }
});
test('known specialized human red cell never becomes a prokaryote from a missing nucleus symbol',()=>{
 const typical=cellExample('nucleated-human'),bacterium=cellExample('bacterium'),red=cellExample('mature-human-red-cell');
 assert.deepEqual([typical.nucleus,typical.dna,typical.mitochondria,typical.organismGroup],[true,true,true,'Eukaryot']);assert.deepEqual([bacterium.nucleus,bacterium.dna,bacterium.mitochondria,bacterium.organismGroup],[false,true,false,'Prokaryot']);assert.deepEqual([red.nucleus,red.dna,red.mitochondria,red.organismGroup],[false,false,false,'Eukaryot']);assert.throws(()=>cellExample('unknown-cell'),TypeError);
});
test('equal DNA base counts retain their different order and complementary partners without trait claims',()=>{
 const compared=compareDNASequences('AATT','ATAT');assert(compared.sameCounts&&compared.sameLength&&!compared.sameOrder);assert.deepEqual(compared.differentPositions,[1,2]);assert.equal(compared.first.partner,'TTAA');assert.equal(compared.second.partner,'TATA');assert.equal(inspectDNASequence('ACGT').partner,'TGCA');
 for(const input of['','ACTX','aatt','A T',42,null])assert.throws(()=>inspectDNASequence(input),TypeError);
});
test('invented membrane, mitochondrial and genome switches distinguish the actual chosen meaning',()=>{
 assert.equal(membraneExample('unavailable').crosses,false);assert.equal(membraneExample('matching-protein').crosses,true);assert.throws(()=>membraneExample('everything-passes'),TypeError);
 assert.equal(mitochondrialExample('structure').showConversion,false);assert.equal(mitochondrialExample('conversion').showConversion,true);assert.throws(()=>mitochondrialExample('energy-from-nothing'),TypeError);
 const small=genomeCollection(0),large=genomeCollection(1);assert.equal(small.symbols,6);assert.equal(large.symbols,10);assert.deepEqual(small.mitochondrial,large.mitochondrial);assert.deepEqual(large.nuclear.slice(0,2),small.nuclear);for(const index of[-1,2,NaN,Infinity,.5])assert.throws(()=>genomeCollection(index),TypeError);
});
test('cell content validation rejects a missing explanation, broken identity, invalid date, source, feedback and unknown neighbor',()=>{
 for(const change of[
  p=>delete p.learning.Zelle,
  p=>p.words.DNA[0]='Alias',
  p=>p.sourceReadOn='2026-02-30',
  p=>p.learning.DNA.sources[0].url='http://unverified.invalid',
  p=>p.learning.Zelle.question.wrongReasons[0]='',
  p=>p.learning.Zelle.relatedWords.push({term:'Not-a-cell-concept',reason:'Unknown'}),
  p=>p.whyLearning[CELL_QUESTIONS[0]].figure='unknown-drawing'
 ]){const changed=structuredClone(pack);change(changed);assert.throws(()=>validateCellPack(changed),/Incomplete cell explanations/);}
});
