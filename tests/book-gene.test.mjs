import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {GENE_WORDS,GENE_QUESTIONS,validateGenePack} from '../app/book-gene-validation.mjs';
import {bookGeneContent} from '../scripts/book-gene-index.mjs';
const read=name=>JSON.parse(fs.readFileSync(name,'utf8')),pack=read('app/book-gene-content.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json'),digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('eight distinct genetics words and two Why studies have exact complete canonical, teaching and source-integrity payloads',()=>{
 assert.deepEqual(bookGeneContent(true),pack);assert.deepEqual(validateGenePack(structuredClone(pack)),pack);
 assert.equal(words.length,142);assert.equal(new Set(words.map(row=>row.term)).size,142);assert.equal(why.length,44);assert.equal(new Set(why.map(row=>row.question)).size,44);
 const raw=fs.readFileSync('app/book-gene-content.json');assert.deepEqual(read('app/book-gene-integrity.json'),{bytes:raw.length,sha256:createHash('sha256').update(raw).digest('hex')});
 const teaching=read('exports/content/book-gene.json');assert.equal(teaching.length,10);
 for(const term of GENE_WORDS){const row=words.find(w=>w.term===term);assert(row);assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert.deepEqual(teaching.find(e=>e.kind==='word'&&e.term===term),{kind:'word',term,definition:row.more,...pack.learning[term],sourceReadOn:pack.sourceReadOn});}
 for(const question of GENE_QUESTIONS){const row=why.find(w=>w.question===question);assert(row);assert.deepEqual([row.question,row.answer],pack.why[question]);assert.deepEqual(teaching.find(e=>e.kind==='why'&&e.whyQuestion===question),{kind:'why',whyQuestion:question,definition:row.answer,...pack.whyLearning[question],sourceReadOn:pack.sourceReadOn});}
});
test('all134 complete delivered word payloads,42 stable Why identities and seven earlier teaching packs remain exact',()=>{
 const old=read('tests/fixtures/book-before-gene-134-hashes.json');assert.equal(old.sourceCommit,'2b6bd4f679186cfe7de7284feb07e7bbe1ee54a9');assert.equal(Object.keys(old.words).length,134);assert.equal(Object.keys(old.why).length,42);
 for(const[term,hash]of Object.entries(old.words))assert.equal(digest(words.find(row=>row.term===term)),hash,term);
 for(const[question,hash]of Object.entries(old.why))assert.equal(digest(why.find(row=>row.question===question)),hash,question);
 assert.equal(Object.keys(old.packs).length,7);for(const[file,hash]of Object.entries(old.packs))assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,file);
 const baseline=read('content/excellence-baseline.json');assert.equal(baseline.families.find(f=>f.id==='words').count,90);assert.equal(baseline.families.find(f=>f.id==='why').count,30);
});
test('genetics has real existing article targets, ten generated old-word returns and reciprocal peer connections',()=>{
 const incoming=read('app/book-gene-word-link-index.json'),links=read('app/book-gene-topic-index.json'),topics=read('app/world-index.json');
 assert.deepEqual(Object.keys(incoming),['DNA','Genom','Zellkern','Prokaryot']);assert.equal(Object.values(incoming).flat().length,10);assert.equal(links.length,10);
 for(const row of links)assert(topics.some(topic=>topic.id===row.topic),row.topic+' actual existing article');
 for(const[term,item]of Object.entries(pack.learning))for(const link of item.relatedWords??[]){assert(words.some(w=>w.term===link.term));if(Object.hasOwn(pack.learning,link.term))assert(pack.learning[link.term].relatedWords?.some(l=>l.term===term),term+' reciprocal peer');else assert(incoming[link.term].some(l=>l.term===term&&l.reason===link.reason),term+' generated actual return');}
});
