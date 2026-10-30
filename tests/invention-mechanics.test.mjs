import {gameBeforeLearningAudit} from './learning-audit-reference.mjs';
// Only named field revisions are projected for these historical comparisons;
// raw current fields and all190topics/sevenbanks have separate strict guards.
import {beforePeopleMethods,beforePeopleMethodQuestions,beforePeopleMethodGraph} from './people-methods-reference.mjs';
import {topicAtHistoricalMediaReference} from './retained-topic-reference.mjs';
import scienceBaseline from './fixtures/retained-before-science-originals.json' with {type:'json'};
const scienceIds=scienceBaseline.newIds;
import buildingBaseline from './fixtures/retained-before-building-originals.json' with {type:'json'};
const buildingIds=buildingBaseline.newIds;
import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import currentCatalog from '../app/world-catalog.json' with {type:'json'};
import currentGraph from '../app/world-connections.json' with {type:'json'};
import baseline from './fixtures/retained-before-invention-mechanics.json' with {type:'json'};
import {CHALLENGE_BANK as currentChallengeBank} from '../app/knowledge-challenge.ts';
import {worldGameBank,restoreWorldGameOrders} from '../app/world-game-bank.ts';
import fs from 'node:fs';
import deviceMedia from '../app/device-illustrations.json' with {type:'json'};
import originalReview from '../content/invention-originals-review.json' with {type:'json'};
const ids=baseline.newIds,hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('invented filament-printer illustration has exact local bytes, declared AI origin and a single-method limit',()=>{
 assert.deepEqual(deviceMedia.entries.map(e=>e.id),['invention-3d-printing','invention-seismograph','invention-sewing-machine']);const media=deviceMedia.entries[0],review=originalReview.topics.find(t=>t.id==='invention-3d-printing').media;assert.equal(media.id,'invention-3d-printing');assert.equal(media.kind,'ai-illustration');assert.equal(media.src,'/inventions/3d-printer-ai.webp');
 const bytes=fs.readFileSync('public'+media.src);assert.equal(bytes.length,27260);assert.equal(createHash('sha256').update(bytes).digest('hex'),review.sha256);assert.equal(review.sha256,'434396dbf4778a0827c0666369d737ea9affb142b9e88de956b79d6c097b8189');assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,16),'WEBPVP8 ');assert.equal(bytes.readUInt16LE(26)&0x3fff,800);assert.equal(bytes.readUInt16LE(28)&0x3fff,500);assert.equal(media.width,800);assert.equal(media.height,500);
 assert.match(media.alt,/Eigene KI-Illustration.*erfundenen Schmelzschichtdruckers/);assert.match(media.caption,/kein Foto und nicht maßstabsgetreu/);assert.match(media.caption,/Andere 3D-Druckverfahren arbeiten anders/);assert.match(media.caption,/kein bestimmtes historisches Gerät/);assert.deepEqual(media.labels,['Kunststofffaden von der Spule','Druckkopf mit Düse','Schichten auf der Bauplatte']);assert.equal(media.source.url,'https://www.nist.gov/additive-manufacturing/research-areas/technologies/material-extrusion');assert.equal(review.caption,media.caption);assert.equal(review.alt,media.alt);
});
test('six retained manuscripts keep the entire preceding150-topic source except nine named reciprocal backlinks',()=>{
 assert.equal(baseline.sourceCommit,'a6075b8542a3784cfbe3ef34ddc75863f692ec64');assert.equal(ids.length,6);assert.equal(catalog.length,188);assert.equal(catalog.filter(t=>t.category==='inventions').length,24);
 const retained=catalog.filter(t=>!['history-bronze',...ids,...buildingIds,...scienceIds].includes(t.id)).map(topicAtHistoricalMediaReference).map(t=>({...t,related:t.related.filter(id=>!['history-bronze',...ids,...buildingIds,...scienceIds].includes(id))}));assert.equal(retained.length,150);assert.equal(hash(retained),baseline.oldCatalogSHA256);
 const edges=graph.connections.filter(e=>(ids.includes(e.fromId)||ids.includes(e.toId))&&!['history-bronze',...buildingIds,...scienceIds].includes(e.fromId)&&!['history-bronze',...buildingIds,...scienceIds].includes(e.toId));assert.equal(edges.length,9);assert.equal(new Set(edges.map(e=>[e.fromId,e.toId].sort().join('|'))).size,9);
 for(const edge of edges){assert.ok(edge.why.length>60);for(const [a,b]of [[edge.fromId,edge.toId],[edge.toId,edge.fromId]])assert.ok(catalog.find(t=>t.id===a).related.includes(b));}
 for(const id of ids){const t=catalog.find(t=>t.id===id),original=baseline.originalCorrectAnswers[id];assert.equal(t.question.correct,original.correct);assert.equal(t.question.answers[t.question.correct],original.answer);assert.equal(t.invention.walkthrough,true);assert.equal(t.invention.stages.length,6);assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);assert.equal(new Set(t.question.answers).size,3);}
});
test('the preceding180 challenge questions and18 technology tasks retain every old question and actual answer order',()=>{
 for(const [actual,expected]of [[CHALLENGE_BANK.filter(q=>!['history-bronze',...ids,...buildingIds,...scienceIds].includes(q.topic)),baseline.oldChallengeQuestions],[worldGameBank('technology').map(gameBeforeLearningAudit).filter(q=>!ids.includes(q.id)),baseline.oldTechnologyTasks],[worldGameBank('then-now').map(gameBeforeLearningAudit),baseline.oldChronologyTasks]]){assert.equal(actual.length,expected.count);assert.equal(hash(actual),expected.sha256);}
 const pool=worldGameBank('technology'),before=pool.filter(q=>!ids.includes(q.id)),fallback=Object.fromEntries(pool.map(q=>[q.id,q.answers])),save=Object.fromEntries(before.map(q=>[q.id,[...q.answers].reverse()]));save.futureQuestion={opaque:'synthetic unchanged'};const restored=restoreWorldGameOrders(structuredClone(save),fallback,pool);for(const [id,value]of Object.entries(save))assert.deepEqual(restored[id],value);assert.equal(CHALLENGE_BANK.length,220);assert.equal(pool.length,24);
});
test('historical anchors and mechanism limits distinguish observations, object dates and invention claims',()=>{
 const [fridge,bike,lift,seismo,printing,sewing]=ids.map(id=>catalog.find(t=>t.id===id));assert.match(fridge.invention.date,/kein Erfindungsdatum/);assert.match(fridge.question.answers[fridge.question.correct],/Betriebsenergie/);assert.match(bike.more[0],/Vollgummireifen/);assert.match(lift.more[0],/1853.*1854.*1857/);assert.match(lift.paragraphs[0],/hydraulisch/);assert.match(seismo.invention.date,/Veröffentlichung.*kein gesicherter Bauzeitpunkt/);assert.match(seismo.more[0],/unsicher/);assert.equal(seismo.invention.model,'seismograph');assert.match(printing.more[0],/Stereolithografie.*1986/);assert.equal(printing.invention.model,'layers');assert.match(sewing.invention.date,/1846.*Patent/);assert.match(sewing.paragraphs[0],/kein Beweis.*alleinigen Erfinder/);
});

test('invented spring-seismograph illustration distinguishes vertical sensing, drawn line and horizontal screen model',()=>{
 const media=deviceMedia.entries.find(e=>e.id==='invention-seismograph'),review=originalReview.topics.find(t=>t.id===media.id).media,bytes=fs.readFileSync('public'+media.src);assert.equal(media.kind,'ai-illustration');assert.equal(media.src,'/inventions/seismograph-ai.webp');assert.equal(bytes.length,26398);assert.equal(createHash('sha256').update(bytes).digest('hex'),'3306f4617e59ca4197da4354432b46cb41a20c9e627e1c3baa60d5bfae9ae54e');assert.equal(review.sha256,createHash('sha256').update(bytes).digest('hex'));assert.equal(bytes.readUInt16LE(26)&0x3fff,800);assert.equal(bytes.readUInt16LE(28)&0x3fff,500);assert.match(media.alt,/Eigene KI-Illustration.*senkrechte Bodenbewegung/);assert.match(media.caption,/kein Foto und nicht maßstabsgetreu/);assert.match(media.caption,/Auf-und-ab-Bewegungen/);assert.match(media.caption,/nur gezeichnet, kein Messdatensatz/);assert.match(media.caption,/Modell darunter betrachtet seitliche Bewegung/);assert.match(media.caption,/rekonstruiert keinen historischen Entwurf/);assert.deepEqual(media.labels,['Feder mit Masse','Schreibspitze an der Masse','Papierwalze am Gestell']);assert.equal(media.source.url,'https://www.usgs.gov/programs/earthquake-hazards/seismographs-keeping-track-earthquakes');assert.equal(review.caption,media.caption);
});

// Historical assertions retain their original release boundary; new additions are covered in people-methods.test.mjs.
const catalog=beforePeopleMethods(currentCatalog);
const CHALLENGE_BANK=beforePeopleMethodQuestions(currentChallengeBank);
const graph=beforePeopleMethodGraph(currentGraph);
