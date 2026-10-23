import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import baseline from './fixtures/retained-before-invention-mechanics.json' with {type:'json'};
import {CHALLENGE_BANK} from '../app/knowledge-challenge.ts';
import {worldGameBank,restoreWorldGameOrders} from '../app/world-game-bank.ts';
const ids=baseline.newIds,hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('six retained manuscripts keep the entire preceding150-topic source except nine named reciprocal backlinks',()=>{
 assert.equal(baseline.sourceCommit,'a6075b8542a3784cfbe3ef34ddc75863f692ec64');assert.equal(ids.length,6);assert.equal(catalog.length,156);assert.equal(catalog.filter(t=>t.category==='inventions').length,24);
 const retained=catalog.filter(t=>!ids.includes(t.id)).map(t=>({...t,related:t.related.filter(id=>!ids.includes(id))}));assert.equal(retained.length,150);assert.equal(hash(retained),baseline.oldCatalogSHA256);
 const edges=graph.connections.filter(e=>ids.includes(e.fromId)||ids.includes(e.toId));assert.equal(edges.length,9);assert.equal(new Set(edges.map(e=>[e.fromId,e.toId].sort().join('|'))).size,9);
 for(const edge of edges){assert.ok(edge.why.length>60);for(const [a,b]of [[edge.fromId,edge.toId],[edge.toId,edge.fromId]])assert.ok(catalog.find(t=>t.id===a).related.includes(b));}
 for(const id of ids){const t=catalog.find(t=>t.id===id),original=baseline.originalCorrectAnswers[id];assert.equal(t.question.correct,original.correct);assert.equal(t.question.answers[t.question.correct],original.answer);assert.equal(t.invention.walkthrough,true);assert.equal(t.invention.stages.length,6);assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);assert.equal(new Set(t.question.answers).size,3);}
});
test('the preceding180 challenge questions and18 technology tasks retain every old question and actual answer order',()=>{
 for(const [actual,expected]of [[CHALLENGE_BANK.filter(q=>!ids.includes(q.topic)),baseline.oldChallengeQuestions],[worldGameBank('technology').filter(q=>!ids.includes(q.id)),baseline.oldTechnologyTasks],[worldGameBank('then-now'),baseline.oldChronologyTasks]]){assert.equal(actual.length,expected.count);assert.equal(hash(actual),expected.sha256);}
 const pool=worldGameBank('technology'),before=pool.filter(q=>!ids.includes(q.id)),fallback=Object.fromEntries(pool.map(q=>[q.id,q.answers])),save=Object.fromEntries(before.map(q=>[q.id,[...q.answers].reverse()]));save.futureQuestion={opaque:'synthetic unchanged'};const restored=restoreWorldGameOrders(structuredClone(save),fallback,pool);for(const [id,value]of Object.entries(save))assert.deepEqual(restored[id],value);assert.equal(CHALLENGE_BANK.length,186);assert.equal(pool.length,24);
});
test('historical anchors and mechanism limits distinguish observations, object dates and invention claims',()=>{
 const [fridge,bike,lift,seismo,printing,sewing]=ids.map(id=>catalog.find(t=>t.id===id));assert.match(fridge.invention.date,/kein Erfindungsdatum/);assert.match(fridge.question.answers[fridge.question.correct],/Betriebsenergie/);assert.match(bike.more[0],/Vollgummireifen/);assert.match(lift.more[0],/1853.*1854.*1857/);assert.match(lift.paragraphs[0],/hydraulisch/);assert.match(seismo.invention.date,/Veröffentlichung.*kein gesicherter Bauzeitpunkt/);assert.match(seismo.more[0],/unsicher/);assert.equal(seismo.invention.model,'seismograph');assert.match(printing.more[0],/Stereolithografie.*1986/);assert.equal(printing.invention.model,'layers');assert.match(sewing.invention.date,/1846.*Patent/);assert.match(sewing.paragraphs[0],/kein Beweis.*alleinigen Erfinder/);
});
