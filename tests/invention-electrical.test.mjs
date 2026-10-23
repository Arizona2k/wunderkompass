import mechanicsBaseline from './fixtures/retained-before-invention-mechanics.json' with {type:'json'};
const mechanicsIds=mechanicsBaseline.newIds;
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import {CHALLENGE_BANK,restoreChallenge} from '../app/knowledge-challenge.ts';
import {worldGameBank,restoreWorldGameOrders} from '../app/world-game-bank.ts';
const ids=['invention-battery','invention-generator','invention-transistor'];
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('three retained electrical originals preserve all147 delivered articles except nine explicit backlinks',()=>{
 assert.equal(catalog.length,156);assert.equal(catalog.filter(t=>t.category==='inventions').length,24);
 const retained=catalog.filter(t=>![...ids,...mechanicsIds].includes(t.id)).map(t=>({...t,related:t.related.filter(id=>![...ids,...mechanicsIds].includes(id))}));assert.equal(retained.length,147);assert.equal(hash(retained),'5f224cfcb56f921aa153de2ec456ff57b800cc85b21e406b9c288c314b00a92c');
 const links=graph.connections.filter(c=>ids.includes(c.fromId)||ids.includes(c.toId));assert.equal(links.length,9);assert.equal(new Set(links.map(c=>[c.fromId,c.toId].sort().join('|'))).size,9);
 for(const link of links){assert.ok(link.why.length>50);for(const [a,b]of [[link.fromId,link.toId],[link.toId,link.fromId]])assert.ok(catalog.find(t=>t.id===a).related.includes(b));}
 for(const id of ids){const t=catalog.find(t=>t.id===id);assert.equal(t.invention.walkthrough,true);assert.equal(t.invention.stages.length,6);assert.equal(t.questionFeedback.wrongReasons[t.question.correct],null);assert.ok(t.sources.length>=2);}
});
test('all177 delivered questions and all15 technology and24 historical game tasks stay byte-equivalent as data',()=>{
 const retained=CHALLENGE_BANK.filter(q=>![...ids,...mechanicsIds].includes(q.topic));assert.equal(retained.length,177);assert.equal(hash(retained),'e586265776b9e65af96f4b4bf5221964dd97e3c57d1823563cf1d2110cc0f478');assert.equal(CHALLENGE_BANK.length,186);
 const old=worldGameBank('technology').filter(q=>![...ids,...mechanicsIds].includes(q.id));assert.equal(old.length,15);assert.equal(hash(old),'2ff09a3c8ed3aa0d368cde7e48502fed1a38972e64eb59c0138cf3a5467c9ba5');assert.equal(worldGameBank('technology').length,24);
 assert.equal(worldGameBank('then-now').length,24);assert.equal(hash(worldGameBank('then-now')),'619c3f691d061b48018e73f1085878f16a026e4c2e32bef8aee338abaabc16cb');
 const pool=worldGameBank('technology'),fallback=Object.fromEntries(pool.map(q=>[q.id,q.answers])),saved=Object.fromEntries(old.map(q=>[q.id,[...q.answers].reverse()]));saved.futureQuestion={opaque:'synthetic'};const restored=restoreWorldGameOrders(saved,fallback,pool);for(const [id,value]of Object.entries(saved))assert.deepEqual(restored[id],value);
 for(const difficulty of ['easy','medium','hard']){const q=retained.filter(q=>q.difficulty===difficulty).slice(0,6),save={difficulty,ids:q.map(q=>q.id),orders:Object.fromEntries(q.map(q=>[q.id,[...q.answers].reverse()])),index:3,answer:q[3].answers[1],done:false};assert.deepEqual(restoreChallenge(structuredClone(save),{invalid:true}),save);}
});
test('the electrical explanations distinguish stored energy, induction and the supply for a controlled signal',()=>{
 const [battery,generator,transistor]=ids.map(id=>catalog.find(t=>t.id===id));assert.match(battery.paragraphs[0],/Elektronen außen/);assert.match(battery.paragraphs[0],/Innen.*Ionen/);assert.match(battery.more[0],/niemals ins Ladegerät/);assert.equal(battery.invention.parts.length,4);
 assert.equal(generator.invention.model,'generator');assert.match(generator.paragraphs[0],/Antrieb liefert die Energie/);assert.match(generator.invention.stages[5].text,/Momentaufnahme/);assert.equal(generator.question.answers[generator.question.correct],'Nein, das Magnetfeld durch die Spule muss sich ändern');
 assert.equal(transistor.invention.model,'transistor');assert.match(transistor.more[1],/Nur beide zusammen/);assert.equal(transistor.question.answers[transistor.question.correct],'Aus der Stromversorgung der Schaltung');assert.match(transistor.invention.date,/Punktkontakttransistor/);assert.ok(transistor.sources.some(s=>s.url==='https://wiki.analog.com/university/courses/electronics/text/chapter-9'));
});
