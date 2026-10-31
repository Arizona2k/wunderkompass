import {mechanicsPredecessors} from './current-mechanics-reference.mjs';
import {dossierBeforeLearningAudit} from './learning-audit-reference.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {PARTICLE_WORDS,PARTICLE_QUESTIONS,validateParticlePack} from '../app/book-particle-validation.mjs';
import {bookParticleContent} from '../scripts/book-particle-index.mjs';
const read=n=>JSON.parse(fs.readFileSync(n,'utf8')),pack=read('app/book-particle-content.json'),digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('five particle words use canonical source integrity, existing topics and generated Mol/Ampere incoming links',()=>{
 assert.deepEqual(bookParticleContent(true),pack);assert.equal(PARTICLE_WORDS.length,5);assert.deepEqual(PARTICLE_QUESTIONS,[]);
 const raw=fs.readFileSync('app/book-particle-content.json'),integrity=read('app/book-particle-integrity.json');assert.equal(raw.length,integrity.bytes);assert.equal(createHash('sha256').update(raw).digest('hex'),integrity.sha256);
 const words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json'),exported=read('exports/content/book-particle.json'),links=read('app/book-particle-topic-index.json'),topics=read('app/world-index.json');
 assert.equal(words.length,126);assert.equal(why.length,40);assert.equal(exported.length,5);assert.equal(links.length,5);
 for(const term of PARTICLE_WORDS){const row=words.find(w=>w.term===term),item=pack.learning[term];assert.deepEqual([row.term,row.short,row.more],pack.words[term]);assert.deepEqual(exported.find(e=>e.term===term),{kind:'word',term,definition:row.more,...item,sourceReadOn:pack.sourceReadOn});assert.deepEqual(links.find(l=>l.term===term),{term,topic:item.topic,connection:item.benefit});assert(topics.some(t=>t.id===item.topic));for(const l of item.relatedWords??[])assert(words.some(w=>w.term===l.term));}
 const incoming=read('app/book-particle-word-link-index.json');assert.deepEqual(Object.keys(incoming),['Mol','Ampere']);assert.deepEqual(incoming.Mol,[{term:'Atom',reason:pack.learning.Atom.relatedWords.find(l=>l.term==='Mol').reason}]);assert.deepEqual(incoming.Ampere,[{term:'Elektron',reason:pack.learning.Elektron.relatedWords.find(l=>l.term==='Ampere').reason}]);
});

test('all117 M77word and37 Why payloads plus entire SI/heat/light/water packs remain unchanged',()=>{
 const old=read('tests/fixtures/book-before-particle-117-hashes.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');assert.equal(old.sourceCommit,'631f54f390f8e78d650103c8c981c4547d49bf8c');assert.equal(Object.keys(old.words).length,117);assert.equal(Object.keys(old.why).length,37);assert.equal(new Set(words.map(w=>w.term)).size,126);assert.equal(new Set(why.map(w=>w.question)).size,40);
 for(const [term,sha]of Object.entries(old.words))assert.equal(digest(words.find(w=>w.term===term)),sha,term+' entire old word retained');for(const [question,sha]of Object.entries(old.why))assert.equal(digest(why.find(w=>w.question===question)),sha,question+' entire old Why retained');
 assert.equal(Object.keys(old.packs).length,4);for(const [file,sha]of Object.entries(old.packs))assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),sha,file);
 const baseline=read('content/excellence-baseline.json');assert.equal(baseline.families.find(f=>f.id==='words').count,90);assert.equal(baseline.families.find(f=>f.id==='why').count,30);
});

test('five particle dossiers retain every earlier134 complete dossier and factual/UI history',()=>{
 const old=read('tests/fixtures/editorial-before-particle-134-hashes.json'),current=mechanicsPredecessors(read('content/editorial-reviews.json').dossiers).map(dossierBeforeLearningAudit);assert.equal(old.sourceCommit,'631f54f390f8e78d650103c8c981c4547d49bf8c');assert.equal(old.dossiers.length,134);assert.equal(current.length,139);
 for(const d of old.dossiers){const now=current.find(n=>n.id===d.id);assert(now);const original={...now};if(now.historicalUIBeforeAuditUiCurrentFull20261029){original.ui=now.historicalUIBeforeAuditUiCurrentFull20261029;delete original.historicalUIBeforeAuditUiCurrentFull20261029;}delete original.historicalUIBeforeParticleCurrentFull20261029;if(now.historicalUIBeforeParticleCurrentFull20261029)original.ui=now.historicalUIBeforeParticleCurrentFull20261029;assert.equal(digest(original),d.sha256,d.id+' whole prior dossier retained');}
});

test('incomplete, unsafe or physically misleading particle packs fail closed',()=>{
 assert.equal(validateParticlePack(pack),pack);
 for(const mutate of[d=>{delete d.words.Atom;},d=>{delete d.learning.Neutron;},d=>{d.learning.Proton.question.correct=7;},d=>{d.learning.Isotop.figure='planetary-orbits';},d=>{d.learning.Elektron.topic='unknown';},d=>{d.learning.Atom.relatedWords[0].term='unknown';},d=>{d.learning.Proton.question.answers[1]=d.learning.Proton.question.answers[0];},d=>{d.learning.Proton.question.wrongReasons[0]='';},d=>{d.learning.Elektron.sources[0].url='javascript:bad';},d=>{d.sourceReadOn='2026-02-30';},d=>{d.learning.Neutron.sources[0].checkedOn='2026-10-28';},d=>{d.why.unreviewed=['unreviewed','unexpected Why'];}]){const invalid=structuredClone(pack);mutate(invalid);assert.throws(()=>validateParticlePack(invalid),/Incomplete particle/);}
});
