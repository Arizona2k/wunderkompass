import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {GENE_WORDS,GENE_QUESTIONS,validateGenePack} from '../app/book-gene-validation.mjs';
import {bookGeneContent} from '../scripts/book-gene-index.mjs';
import {GLOSSARY,WHY_QUESTIONS} from '../app/learning-data.ts';
const read=name=>JSON.parse(fs.readFileSync(name,'utf8')),pack=read('app/book-gene-content.json'),words=GLOSSARY.map(([term,short,more])=>({term,short,more})),why=WHY_QUESTIONS.map(([question,answer])=>({question,answer}));
test('eight distinct genetics words and two Why studies match the checked pack, its integrity record and the actual glossary',()=>{
 assert.deepEqual(bookGeneContent(true),pack);assert.deepEqual(validateGenePack(structuredClone(pack)),pack);
 assert.equal(new Set(words.map(row=>row.term)).size,words.length);assert.equal(new Set(why.map(row=>row.question)).size,why.length);
 const raw=fs.readFileSync('app/book-gene-content.json');assert.deepEqual(read('app/book-gene-integrity.json'),{bytes:raw.length,sha256:createHash('sha256').update(raw).digest('hex')});
 for(const term of GENE_WORDS){const row=words.find(w=>w.term===term);assert(row);assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert(pack.learning[term]);}
 for(const question of GENE_QUESTIONS){const row=why.find(w=>w.question===question);assert(row);assert.deepEqual([row.question,row.answer],pack.why[question]);assert(pack.whyLearning[question]);}
});
test('genetics has real existing article targets, ten generated old-word returns and reciprocal peer connections',()=>{
 const incoming=read('app/book-gene-word-link-index.json'),links=read('app/book-gene-topic-index.json'),topics=read('app/world-index.json');
 assert.deepEqual(Object.keys(incoming),['DNA','Genom','Zellkern','Prokaryot']);assert.equal(Object.values(incoming).flat().length,10);assert.equal(links.length,10);
 for(const row of links)assert(topics.some(topic=>topic.id===row.topic),row.topic+' actual existing article');
 for(const[term,item]of Object.entries(pack.learning))for(const link of item.relatedWords??[]){assert(words.some(w=>w.term===link.term));if(Object.hasOwn(pack.learning,link.term))assert(pack.learning[link.term].relatedWords?.some(l=>l.term===term),term+' reciprocal peer');else assert(incoming[link.term].some(l=>l.term===term&&l.reason===link.reason),term+' generated actual return');}
});
