import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {PARTICLE_WORDS,PARTICLE_QUESTIONS,validateParticlePack} from '../app/book-particle-validation.mjs';
import {bookParticleContent} from '../scripts/book-particle-index.mjs';
import {GLOSSARY,WHY_QUESTIONS} from '../app/learning-data.ts';
const read=n=>JSON.parse(fs.readFileSync(n,'utf8')),pack=read('app/book-particle-content.json');

test('five particle words use canonical source integrity, existing topics and generated Mol/Ampere incoming links',()=>{
 assert.deepEqual(bookParticleContent(true),pack);assert.equal(PARTICLE_WORDS.length,5);assert.deepEqual(PARTICLE_QUESTIONS,[]);
 const raw=fs.readFileSync('app/book-particle-content.json'),integrity=read('app/book-particle-integrity.json');assert.equal(raw.length,integrity.bytes);assert.equal(createHash('sha256').update(raw).digest('hex'),integrity.sha256);
 const words=GLOSSARY.map(([term,short,more])=>({term,short,more})),why=WHY_QUESTIONS.map(([question,answer])=>({question,answer})),links=read('app/book-particle-topic-index.json'),topics=read('app/world-index.json');
 assert.equal(links.length,5);assert.equal(new Set(words.map(w=>w.term)).size,words.length);assert.equal(new Set(why.map(w=>w.question)).size,why.length);
 for(const term of PARTICLE_WORDS){const row=words.find(w=>w.term===term),item=pack.learning[term];assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert.deepEqual(links.find(l=>l.term===term),{term,topic:item.topic,connection:item.benefit});assert(topics.some(t=>t.id===item.topic));for(const l of item.relatedWords??[])assert(words.some(w=>w.term===l.term));}
 const incoming=read('app/book-particle-word-link-index.json');assert.deepEqual(Object.keys(incoming),['Mol','Ampere']);assert.deepEqual(incoming.Mol,[{term:'Atom',reason:pack.learning.Atom.relatedWords.find(l=>l.term==='Mol').reason}]);assert.deepEqual(incoming.Ampere,[{term:'Elektron',reason:pack.learning.Elektron.relatedWords.find(l=>l.term==='Ampere').reason}]);
});

test('incomplete, unsafe or physically misleading particle packs fail closed',()=>{
 assert.equal(validateParticlePack(pack),pack);
 for(const mutate of[d=>{delete d.words.Atom;},d=>{delete d.learning.Neutron;},d=>{d.learning.Proton.question.correct=7;},d=>{d.learning.Isotop.figure='planetary-orbits';},d=>{d.learning.Elektron.topic='unknown';},d=>{d.learning.Atom.relatedWords[0].term='unknown';},d=>{d.learning.Proton.question.answers[1]=d.learning.Proton.question.answers[0];},d=>{d.learning.Proton.question.wrongReasons[0]='';},d=>{d.learning.Elektron.sources[0].url='javascript:bad';},d=>{d.sourceReadOn='2026-02-30';},d=>{d.learning.Neutron.sources[0].checkedOn='2026-10-28';},d=>{d.why.unreviewed=['unreviewed','unexpected Why'];}]){const invalid=structuredClone(pack);mutate(invalid);assert.throws(()=>validateParticlePack(invalid),/Incomplete particle/);}
});
