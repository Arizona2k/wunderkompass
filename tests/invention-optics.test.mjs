import {topicAtHistoricalMediaReference} from './retained-topic-reference.mjs';
import scienceBaseline from './fixtures/retained-before-science-originals.json' with {type:'json'};
const scienceIds=scienceBaseline.newIds;
import buildingBaseline from './fixtures/retained-before-building-originals.json' with {type:'json'};
const buildingIds=buildingBaseline.newIds;
import mechanicsBaseline from './fixtures/retained-before-invention-mechanics.json' with {type:'json'};
const mechanicsIds=mechanicsBaseline.newIds;
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import index from '../app/world-index.json' with {type:'json'};
import review from '../content/invention-editorial-review.json' with {type:'json'};
import {CHALLENGE_BANK,restoreChallenge} from '../app/knowledge-challenge.ts';
const ids=['invention-camera','invention-telescope','invention-microscope'];
const electricalIds=['invention-battery','invention-generator','invention-transistor'];
const peopleIds=['person-mary_anning','person-ibn_al_haytham'];
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('only three prepared optical concepts extend the exact public142 catalog and172-question bank',()=>{
 assert.deepEqual(review.integratedManuscriptIds,ids);assert.equal(catalog.length,188);assert.equal(catalog.filter(t=>t.category==='inventions').length,24);
 const retained=catalog.filter(t=>!['history-bronze',...ids,...peopleIds,...electricalIds,...mechanicsIds,...buildingIds,...scienceIds].includes(t.id)).map(topicAtHistoricalMediaReference).map(t=>({...t,related:t.related.filter(id=>!['history-bronze',...ids,...peopleIds,...electricalIds,...mechanicsIds,...buildingIds,...scienceIds].includes(id))}));
 assert.equal(retained.length,142);assert.equal(hash(retained),review.retainedPublicCatalogSha256,'every old field, source, answer, mechanic and ordering is retained');
 const oldQuestions=CHALLENGE_BANK.filter(q=>!['history-bronze',...ids,...peopleIds,...electricalIds,...mechanicsIds,...buildingIds,...scienceIds].includes(q.topic));assert.equal(oldQuestions.length,172);assert.equal(hash(oldQuestions),'6a2895a01766629b3d5961083cfaf45e32dcfc7a0dfe12ea0c1534a183e5e317');
 assert.equal(CHALLENGE_BANK.length,220);assert.equal(new Set(CHALLENGE_BANK.map(q=>q.id)).size,220);
 for(const id of ids){const t=catalog.find(t=>t.id===id),d=review.topics.find(d=>d.id===id);assert.equal(hash({...t,related:t.related.filter(id=>!['history-bronze',...peopleIds,...electricalIds].includes(id))}),d.contentHash);assert.equal(t.invention.stages.length,6);assert.equal(t.invention.walkthrough,true);assert.equal(t.invention.parts.length,3);assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);assert.equal(d.ageLevels['6-8'],t.learning.starter);assert.equal(d.ageLevels['9-11'],t.paragraphs[0]);assert.equal(d.ageLevels['12-14'],t.more[0]);assert.ok(index.some(x=>x.id===id));}
});
test('five explained optical relationships have both real targets and reciprocal old/new links',()=>{
 assert.equal(review.newConnections.length,5);assert.deepEqual(review.affectedExistingTopics,['invention-satellite','invention-smartphone','science-solar-system']);
 for(const edge of review.newConnections){const a=catalog.find(t=>t.id===edge.fromId),b=catalog.find(t=>t.id===edge.toId);assert.ok(a.related.includes(b.id));assert.ok(b.related.includes(a.id));assert.ok(edge.why.length>30);}
});
test('optical sources distinguish recording, historical evidence and magnification limits',()=>{
 const camera=catalog.find(t=>t.id===ids[0]),telescope=catalog.find(t=>t.id===ids[1]),microscope=catalog.find(t=>t.id===ids[2]);
 assert.match(camera.paragraphs[0],/speichert das Bild noch nicht/);assert.match(camera.invention.date,/vorläufer sind älter/i);
 assert.match(telescope.more[0],/Galileo erfand das Fernrohr nicht/);assert.match(telescope.learning.observe,/Niemals.*Sonne/);assert.equal(telescope.invention.model,'aperture');
 assert.match(microscope.more[0],/1920er-Jahren/);assert.match(microscope.sourceNote,/keine.*Auflösung|ohne.*Auflösung/);assert.equal(microscope.invention.model,'resolution');
 assert.equal(review.independentReview,false);assert.equal(review.retainedSourceCounterread.length,3);
});
test('old six-question rounds preserve actual saved shuffled answers and progress after three additions',()=>{
 for(const difficulty of ['easy','medium','hard']){const q=CHALLENGE_BANK.filter(q=>q.difficulty===difficulty&&!ids.includes(q.topic)).slice(0,6);assert.equal(q.length,6);const save={difficulty,ids:q.map(q=>q.id),orders:Object.fromEntries(q.map(q=>[q.id,[...q.answers].reverse()])),index:3,answer:q[3].answers[1],done:false};assert.deepEqual(restoreChallenge(JSON.parse(JSON.stringify(save)),{invalid:true}),save);}
});
