import {topicAtHistoricalMediaReference,OKAPI_MEDIA_SOURCE_NOTE} from './retained-topic-reference.mjs';
import scienceBaseline from './fixtures/retained-before-science-originals.json' with {type:'json'};
const scienceIds=scienceBaseline.newIds;
import buildingBaseline from './fixtures/retained-before-building-originals.json' with {type:'json'};
const buildingIds=buildingBaseline.newIds;
import mechanicsBaseline from './fixtures/retained-before-invention-mechanics.json' with {type:'json'};
const mechanicsIds=mechanicsBaseline.newIds;
import {historicalQuestionBank} from '../scripts/world-question-index.mjs';
import corrections from '../content/editorial-reviews.json' with {type:'json'};
import {CHALLENGE_BANK as questions} from '../app/knowledge-challenge.ts';
import inquiries from '../app/animal-inquiries.json' with {type:'json'};
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import metadata from '../app/animal-illustrations.json' with {type:'json'};
import review from '../content/animal-expansion-review.json' with {type:'json'};
import original from '../content/animal-editorial-review.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
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
test('24 local own images retain exact integrity, explicit formats, HTML labels and scientific limits',()=>{
 assert.equal(metadata.entries.length,24);assert.deepEqual(new Set(metadata.entries.map(e=>e.id)),new Set(review.entries.map(e=>e.id)));
 let vectors=0,illustrations=0;
 for(const entry of metadata.entries){const manuscript=review.entries.find(e=>e.id===entry.id),file='public'+entry.src,bytes=fs.readFileSync(file);assert.match(entry.src,/^\/animals\/[a-z-]+\.(?:svg|webp)$/);assert.equal(createHash('sha256').update(bytes).digest('hex'),manuscript.media.sha256);assert.equal(entry.alt,manuscript.media.alt);assert.ok(entry.caption.includes('nicht maßstabsgetreu'));assert.equal(entry.caption,manuscript.media.limits);assert.equal(entry.labels.length,2);assert.ok(entry.labels.every(l=>l.length>4));
  if(entry.kind==='ai-illustration'){
   illustrations++;assert.equal(entry.id,'animal-okapi');assert.equal(entry.src,'/animals/okapi-ai.webp');assert.equal(manuscript.media.format,'webp');assert.equal(bytes.length,manuscript.media.bytes);assert.equal(bytes.length,20552,'the reviewed proportional image payload remains bounded to its accepted original');assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.readUInt32LE(4),bytes.length-8);assert.equal(bytes.toString('ascii',8,16),'WEBPVP8 ');assert.equal(bytes.subarray(23,26).toString('hex'),'9d012a');assert.equal(bytes.readUInt16LE(26)&0x3fff,800);assert.equal(bytes.readUInt16LE(28)&0x3fff,500);assert.equal(entry.width,800);assert.equal(entry.height,500);assert.match(entry.alt,/KI-Illustration/);assert.match(entry.caption,/KI-Illustration.*kein Foto/);assert.match(entry.caption,/weiblichen Okapis ohne Hörner/);assert.ok(manuscript.media.sourceOriginal.originalPreserved);assert.equal(manuscript.media.sourceOriginal.width,1586);assert.equal(manuscript.media.sourceOriginal.height,992);assert.equal(manuscript.mediaBeforeAITransparency20261024.sha256,'32bcba2e06694b47bc84e413a7913304c0679cec26e407b5e645072d96b49eb6');assert.ok(fs.existsSync(manuscript.mediaBeforeAITransparency20261024.file),'previous own SVG retained');
  }else{
   vectors++;assert.equal(entry.kind,undefined);const svg=bytes.toString('utf8');assert.match(entry.src,/\.svg$/);assert.doesNotMatch(svg,/<(?:script|foreignObject|image|text)\b|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);assert.match(svg,/viewBox="0 0 360 220"/);assert.ok(svg.includes(entry.alt));assert.ok(bytes.length<5000);assert.equal(manuscript.media.sha256,manuscript.mediaBeforeAITransparency20261024.sha256,'existing SVG bytes are preserved');assert.match(entry.caption,/mit KI-Unterstützung programmierte Merkmalszeichnung/);
  }
 }
 assert.equal(vectors,23);assert.equal(illustrations,1);
});
test('source-specific comparison units and range/typical/upper semantics remain explicit',()=>{
 const animals=catalog.filter(t=>t.category==='animals');
 for(const t of animals){const s=t.animal.size;assert.ok(Number.isFinite(s.min)&&Number.isFinite(s.max)&&s.min>=0&&s.max>=s.min,t.id);assert.ok(['m','cm','mm','kg','g'].includes(s.unit));if(s.kind&&s.kind!=='range'){assert.ok(['upper-bound','typical'].includes(s.kind));assert.equal(s.min,s.max,t.id+' single comparison value is not invented as a range');}assert.ok(s.measurement_de);}
 assert.equal(animals.find(t=>t.id==='animal-common-chameleon').animal.size.unit,'g');assert.equal(animals.find(t=>t.id==='animal-garden-snail').animal.size.measurement_de,'Gehäusebreite, nicht Länge des ausgestreckten Tiers');
});
test('each addition has an explained reciprocal edge without unfinished external dependencies or duplicate pairs',()=>{
 assert.equal(review.newConnections.length,23);const pairs=new Set();
 for(const edge of review.newConnections){assert.ok(edge.why.length>35);assert.ok(graph.connections.some(c=>c.id===edge.id&&c.why===edge.why));const pair=[edge.fromId,edge.toId].sort().join('|');assert.ok(!pairs.has(pair));pairs.add(pair);for(const [from,to] of [[edge.fromId,edge.toId],[edge.toId,edge.fromId]])assert.ok(catalog.find(t=>t.id===from).related.includes(to));}
 for(const entry of review.entries)assert.ok(review.newConnections.some(c=>c.fromId===entry.id||c.toId===entry.id));
 assert.ok(!review.newConnections.some(e=>[e.fromId,e.toId].includes('science-heat-transfer')));
 const eel=review.entries.find(e=>e.id==='animal-european-eel');assert.ok(eel.previousSourceAccessLimit.includes('blocked'));assert.equal(eel.primarySourceRead.access,'relevant-primary-passages-read');assert.equal(eel.primarySourceRead.independentReview,false);assert.match(eel.primarySourceRead.url,/^https:\/\/backend\.orbit\.dtu\.dk\//);assert.ok(eel.primarySourceRead.correction.doi);
});

test('the original142 target questions/hints remain exact except one explicitly compatible wrong-answer grammar alias;24 actual new species add24 questions',()=>{
 const old=JSON.parse(fs.readFileSync('tests/fixtures/retained-challenge-bank.json','utf8'));assert.equal(old.questions.length,142);assert.equal(questions.length,217);assert.equal(corrections.questionCorrections.length,2);assert.deepEqual(new Set(corrections.questionCorrections.map(c=>c.topic)),new Set(['animal-white-tailed-eagle','history-writing']));const animalReleaseBank=questions.filter(q=>![...buildingIds,...scienceIds,...mechanicsIds,'history-khipu','history-mohenjo-daro','invention-battery','invention-generator','invention-transistor','invention-camera','invention-telescope','invention-microscope','person-mary_anning','person-ibn_al_haytham'].includes(q.topic));assert.equal(animalReleaseBank.length,166);assert.deepEqual(historicalQuestionBank(animalReleaseBank.slice(0,142),corrections.questionCorrections),old.questions);assert.equal(review.retainedQuestionBank.count,185,'historic master bank retained under its original scope');
 for(const e of review.entries){const t=catalog.find(t=>t.id===e.id);assert.equal(t.questionFeedback.wrongReasons.length,3);assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);assert.equal(t.image,undefined);assert.ok(t.questionFeedback.hint.length>=45);}
});

test('reviewed Okapi media disclosure preserves all historical fields and rejects unrelated edits',()=>{
 const topic=catalog.find(t=>t.id==='animal-okapi');assert.equal(topic.sourceNote,OKAPI_MEDIA_SOURCE_NOTE.current,'current product must keep the reviewed AI/no-photo disclosure');
 const original=structuredClone(topic),reference=topicAtHistoricalMediaReference(topic);assert.notEqual(reference,topic);assert.deepEqual(topic,original,'historical comparison never mutates the live topic');assert.deepEqual(reference,{...topic,sourceNote:OKAPI_MEDIA_SOURCE_NOTE.previous});
 const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
 for(const edit of[t=>{t.question.correct=(t.question.correct+1)%t.question.answers.length;},t=>{t.sources[0].url='https://invalid.example/changed-source';},t=>{t.paragraphs[0]+=' Unbelegte Aussage.';}]){
  const changed=structuredClone(topic);edit(changed);assert.notEqual(hash(topicAtHistoricalMediaReference(changed)),hash(reference),'historical full-field comparison still detects changed answers, sources and facts');
 }
 for(const note of[OKAPI_MEDIA_SOURCE_NOTE.current+' geändert','Unbekannte künftige Bildherkunft']){const changed={...topic,sourceNote:note};assert.equal(topicAtHistoricalMediaReference(changed),changed,'unknown disclosure remains visible to the original hash assertion');}
 const other={...topic,id:'animal-meerkat'};assert.equal(topicAtHistoricalMediaReference(other),other,'no other topic gains an alias');
});
