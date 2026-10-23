import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import original from '../content/science-originals-retained.json' with {type:'json'};
import review from '../content/science-originals-review.json' with {type:'json'};
import {CHALLENGE_BANK} from '../app/knowledge-challenge.ts';
import {resonanceGain,triangleParts} from '../app/concept-math.mjs';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('selective science integration retains all164 previous factual topic records and each old relationship',()=>{
 assert.equal(original.sourceBase,'ded1fb52972e3ab52adc60e44e641036e7654cd7');assert.equal(original.topics.length,164);assert.equal(catalog.length,187);assert.equal(catalog.filter(t=>t.category==='science').length,46);
 const ids=review.topics.map(e=>e.id);assert.equal(new Set(ids).size,23);
 for(const before of original.topics){const current=catalog.find(t=>t.id===before.id);assert.ok(current);const {related,...fields}=current;assert.equal(hash(fields),before.fieldsExceptRelatedSHA256,before.id+' every prior factual field');assert.deepEqual(related.filter(id=>!ids.includes(id)),before.related);for(const target of related.filter(id=>ids.includes(id)))assert.ok(graph.connections.some(e=>e.fromId===before.id&&e.toId===target||e.toId===before.id&&e.fromId===target));}
 assert.equal(CHALLENGE_BANK.length,217);assert.equal(new Set(CHALLENGE_BANK.map(q=>q.id)).size,217);
 for(const entry of review.topics){const current=catalog.find(t=>t.id===entry.id);assert.equal(current.question.answers[current.question.correct],entry.originalQuestion.answers[entry.originalQuestion.correct]);assert.equal(current.questionFeedback.wrongReasons[current.question.correct],null);assert.equal(new Set(current.question.answers).size,3);assert.ok(current.learning.observe.length>35);}
 const edges=graph.connections.filter(e=>ids.includes(e.fromId)||ids.includes(e.toId));assert.equal(edges.length,28);for(const edge of edges)for(const [a,b]of [[edge.fromId,edge.toId],[edge.toId,edge.fromId]])assert.ok(catalog.find(t=>t.id===a).related.includes(b));
});
test('source-derived finite model limits distinguish damped continuous resonance from a sampled maximum and check the actual triangle origin',()=>{
 // Cline3.6 equations3.64/3.68–3.70: amplitude peak ratio sqrt(1-2*zeta²), zeta=.15.
 const peakRatio=Math.sqrt(1-2*.15**2);assert.ok(peakRatio<1);assert.ok(resonanceGain(peakRatio)>resonanceGain(1));
 // The actual UI passes y=166; the unused helper default y=150 is not a product clipping finding.
 for(const depth of [0,1,2,4]){const triangles=triangleParts(depth,20,166);assert.equal(triangles.length,3**depth);for(const points of triangles)for(let i=0;i<points.length;i+=2){assert.ok(points[i]>=0&&points[i]<=240);assert.ok(points[i+1]>=0&&points[i+1]<=180);}}
});
