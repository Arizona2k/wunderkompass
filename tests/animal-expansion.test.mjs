import questions from '../app/world-question-index.json' with {type:'json'};
import inquiries from '../app/animal-inquiries.json' with {type:'json'};
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import metadata from '../app/animal-illustrations.json' with {type:'json'};
import review from '../content/animal-expansion-review.json' with {type:'json'};
import original from '../content/animal-editorial-review.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import {validateWorldContent} from '../app/world-content-validation.mjs';
import index from '../app/world-index.json' with {type:'json'};
const digest=data=>createHash('sha256').update(JSON.stringify(data)).digest('hex');
test('new voluntary hints do not copy the answer and wrong feedback does not just repeat the correct explanation',()=>{
 for(const entry of review.entries){
  const inquiry=inquiries.entries.find(e=>e.id===entry.id);
  for(const level of ['reason','transfer']){
   const task=inquiry[level],label=entry.id+':'+level;
   assert.notEqual(task.hint.trim(),task.answers[task.correct].trim(),label+' hint leaves the choice to the learner');
   assert.equal(task.feedback[1-task.correct].trim().endsWith(task.feedback[task.correct].trim()),false,label+' wrong feedback explains the specific misconception');
  }
 }
});
test('exactly24 additional distinct species retain all original24 and individually bind their authored runtime content',()=>{
 const animals=catalog.filter(t=>t.category==='animals');assert.equal(animals.length,48);assert.equal(review.entries.length,24);
 assert.equal(review.runtimeNewSpecies,24);assert.equal(review.acceptedNew,0);assert.equal(review.independentReview,false);
 for(const old of original.entries)assert.ok(animals.some(t=>t.id===old.id));
 for(const entry of review.entries){const topic=animals.find(t=>t.id===entry.id);assert.ok(topic);assert.ok(!original.entries.some(e=>e.id===entry.id));assert.equal(digest(topic),entry.articleSHA256,entry.id+' exact final article');assert.ok(topic.aliases.includes(entry.taxon));assert.deepEqual(topic.paragraphs,entry.runtimeArticleParagraphs);assert.ok(topic.learning.observe.length>35);assert.equal(topic.animal.protection.scope,'source_description_not_global_assessment');assert.ok(topic.sourceNote.includes('keine eigene weltweite Gefährdungseinstufung'));}
});
test('24 own small external-free diagrams have matching integrity, HTML labels and explicit scientific limits',()=>{
 assert.equal(metadata.entries.length,24);assert.deepEqual(new Set(metadata.entries.map(e=>e.id)),new Set(review.entries.map(e=>e.id)));
 for(const entry of metadata.entries){const manuscript=review.entries.find(e=>e.id===entry.id),file='public'+entry.src,bytes=fs.readFileSync(file),svg=bytes.toString('utf8');assert.equal(createHash('sha256').update(bytes).digest('hex'),manuscript.media.sha256);assert.equal(entry.alt,manuscript.media.alt);assert.ok(entry.caption.includes('nicht maßstabsgetreu'));assert.equal(entry.labels.length,2);assert.ok(entry.labels.every(l=>l.length>4));assert.doesNotMatch(svg,/<(?:script|foreignObject|image|text)\b|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);assert.match(svg,/viewBox="0 0 360 220"/);assert.ok(svg.includes(entry.alt));assert.ok(bytes.length<5000);}
});
test('new semantic upper/typical bounds and grams remain valid but corrupted comparison metadata fails closed',()=>{
 const animals=catalog.filter(t=>t.category==='animals'),animalIndex=index.filter(t=>t.category==='animals');assert.equal(validateWorldContent(animals,animalIndex,index),animals);
 assert.equal(animals.find(t=>t.id==='animal-common-chameleon').animal.size.unit,'g');
 assert.equal(animals.find(t=>t.id==='animal-garden-snail').animal.size.measurement_de,'Gehäusebreite, nicht Länge des ausgestreckten Tiers');
 for(const mutate of [s=>s.unit='unknown',s=>s.kind='invented',s=>{s.kind='upper-bound';s.min=1;s.max=2;},s=>s.max=NaN,s=>s.min=-1]){const invalid=structuredClone(animals);mutate(invalid.at(-1).animal.size);assert.throws(()=>validateWorldContent(invalid,animalIndex,index),/Tiervergleich/);}
});
test('each addition has an explained reciprocal edge without unfinished external dependencies or duplicate pairs',()=>{
 assert.equal(review.newConnections.length,23);const pairs=new Set();
 for(const edge of review.newConnections){assert.ok(edge.why.length>35);assert.ok(graph.connections.some(c=>c.id===edge.id&&c.why===edge.why));const pair=[edge.fromId,edge.toId].sort().join('|');assert.ok(!pairs.has(pair));pairs.add(pair);for(const [from,to] of [[edge.fromId,edge.toId],[edge.toId,edge.fromId]])assert.ok(catalog.find(t=>t.id===from).related.includes(to));}
 for(const entry of review.entries)assert.ok(review.newConnections.some(c=>c.fromId===entry.id||c.toId===entry.id));
 assert.ok(!review.newConnections.some(e=>[e.fromId,e.toId].includes('science-heat-transfer')));
 const eel=review.entries.find(e=>e.id==='animal-european-eel');assert.ok(eel.previousSourceAccessLimit.includes('blocked'));assert.equal(eel.primarySourceRead.access,'relevant-primary-passages-read');assert.equal(eel.primarySourceRead.independentReview,false);assert.match(eel.primarySourceRead.url,/^https:\/\/backend\.orbit\.dtu\.dk\//);assert.ok(eel.primarySourceRead.correction.doi);
});

test('all185 preceding questions and hints survive the24 additions without changing their identities or content',()=>{
 const old=review.retainedQuestionBank;assert.equal(old.count,185);assert.equal(questions.length,old.count+24+6);assert.equal(digest(questions.slice(0,old.count)),old.sha256);
 for(const e of review.entries){const t=catalog.find(t=>t.id===e.id);assert.equal(t.questionFeedback.wrongReasons.length,3);assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);assert.equal(t.image,undefined);assert.ok(t.questionFeedback.hint.length>=45);}
});
