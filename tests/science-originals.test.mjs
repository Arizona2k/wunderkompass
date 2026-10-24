import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import catalog from '../app/world-catalog.json' with {type:'json'};
import graph from '../app/world-connections.json' with {type:'json'};
import original from '../content/science-originals-retained.json' with {type:'json'};
import review from '../content/science-originals-review.json' with {type:'json'};
import {CHALLENGE_BANK} from '../app/knowledge-challenge.ts';
import {resonanceGain,triangleParts,restoreInvestigationValue} from '../app/concept-math.mjs';

test('restored fractional investigation inputs retain scientific values while malformed or out-of-domain input stays bounded',()=>{
 const resonance={min:.5,max:1.5,step:.1},pendulum={min:.5,max:3,step:.5};
 for(const value of [.5,.8,1,1.3,1.5])assert.equal(restoreInvestigationValue(value,.5,resonance),value);
 for(const value of [.5,1,1.5,2.5,3])assert.equal(restoreInvestigationValue(value,1,pendulum),value);
 for(const value of [null,'0.8',{},NaN,Infinity])assert.equal(restoreInvestigationValue(value,.5,resonance),.5);
 assert.equal(restoreInvestigationValue(0,.5,resonance),.5);assert.equal(restoreInvestigationValue(9,.5,resonance),1.5);
 assert.equal(restoreInvestigationValue(.83,.5,resonance),.8);
 // A former truncated zero has no evidence of its original fractional value.
 // Bounding it repairs the current input; it does not recover lost history.
});
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('selective science integration retains all164 previous factual topic records and each old relationship',()=>{
 assert.equal(original.sourceBase,'ded1fb52972e3ab52adc60e44e641036e7654cd7');assert.equal(original.topics.length,164);assert.equal(catalog.length,187);assert.equal(catalog.filter(t=>t.category==='science').length,46);
 const ids=review.topics.map(e=>e.id);assert.equal(new Set(ids).size,23);
 for(const before of original.topics){const current=catalog.find(t=>t.id===before.id);assert.ok(current);const {related,...fields}=current;assert.equal(hash(fields),before.fieldsExceptRelatedSHA256,before.id+' every prior factual field');assert.deepEqual(related.filter(id=>!ids.includes(id)),before.related);for(const target of related.filter(id=>ids.includes(id)))assert.ok(graph.connections.some(e=>e.fromId===before.id&&e.toId===target||e.toId===before.id&&e.fromId===target));}
 assert.equal(CHALLENGE_BANK.length,217);assert.equal(new Set(CHALLENGE_BANK.map(q=>q.id)).size,217);
 for(const entry of review.topics){const current=catalog.find(t=>t.id===entry.id);assert.equal(current.question.answers[current.question.correct],entry.originalQuestion.answers[entry.originalQuestion.correct]);assert.equal(current.questionFeedback.wrongReasons[current.question.correct],null);assert.equal(new Set(current.question.answers).size,3);assert.ok(current.learning.observe.length>35);}
 const edges=graph.connections.filter(e=>ids.includes(e.fromId)||ids.includes(e.toId));assert.equal(edges.length,41);assert.equal(review.retainedExplainedConnections.connections.length,28);
 const addedPairs=['buoyancy|currents','surface-tension|water-cycle','capillarity|photosynthesis','diffusion|chromatography','heat-transfer|seasons','elasticity|resonance','resonance|sound','symmetry|patterns','cell|photosynthesis','comet|magnetism','exoplanet|solar-system','encryption|checksum','fusion|galaxy'].map(pair=>pair.split('|').map(id=>'science-'+id).sort().join('|'));
 const originalIds=new Set(review.retainedExplainedConnections.connections.map(e=>e.id));
 for(const before of review.retainedExplainedConnections.connections){const actual=edges.find(e=>e.id===before.id);assert.ok(actual);for(const field of ['fromId','toId','kind','why','checkedAt'])assert.equal(actual[field],field==='checkedAt'?before.sourceLinkExplanationReadOn:before[field],'retained reviewed edge '+before.id+' '+field);}
 assert.deepEqual(new Set(edges.filter(e=>!originalIds.has(e.id)).map(e=>[e.fromId,e.toId].sort().join('|'))),new Set(addedPairs),'only thirteen individually explained inherited relationships are added');
 for(const edge of edges)for(const [a,b]of [[edge.fromId,edge.toId],[edge.toId,edge.fromId]])assert.ok(catalog.find(t=>t.id===a).related.includes(b));
});
test('source-derived finite model limits distinguish damped continuous resonance from a sampled maximum and check the actual triangle origin',()=>{
 // Cline3.6 equations3.64/3.68–3.70: amplitude peak ratio sqrt(1-2*zeta²), zeta=.15.
 const peakRatio=Math.sqrt(1-2*.15**2);assert.ok(peakRatio<1);assert.ok(resonanceGain(peakRatio)>resonanceGain(1));
 // The actual UI passes y=166; the unused helper default y=150 is not a product clipping finding.
 for(const depth of [0,1,2,4]){const triangles=triangleParts(depth,20,166);assert.equal(triangles.length,3**depth);for(const points of triangles)for(let i=0;i<points.length;i+=2){assert.ok(points[i]>=0&&points[i]<=240);assert.ok(points[i+1]>=0&&points[i+1]<=180);}}
});

test('each retained science original has three distinct authored inquiry paths with complete answer-specific feedback and known source references',async()=>{
 const {default:thinking}=await import('../app/science-thinking.json',{with:{type:'json'}});
 assert.deepEqual(new Set(thinking.entries.map(e=>e.id)),new Set(review.topics.map(e=>e.id)));
 assert.equal(thinking.entries.length,23);assert.equal(thinking.entries.filter(e=>e.interactive).length,10);
 for(const entry of thinking.entries){
  const topic=catalog.find(t=>t.id===entry.id),record=review.topics.find(t=>t.id===entry.id),read=new Set(record.sourceReads.map(r=>r.url));if(entry.id==='science-lever')read.add(review.scienceThinkingPreparation20261023.additionalSourceRead.url);
  assert.equal(entry.interactive,!!topic.investigation);assert.ok(entry.sources.length);for(const url of entry.sources)assert.ok(read.has(url),entry.id+' additional reference requires an actual source-reading record');
  assert.deepEqual(entry.stages.map(t=>t.id),['observe','explain','transfer']);assert.equal(new Set(entry.stages.map(t=>t.prompt)).size,3);const correctPositions=[];
  for(const stage of entry.stages){assert.equal(stage.answers.length,3);assert.equal(new Set(stage.answers.map(a=>a.id)).size,3);assert.equal(new Set(stage.answers.map(a=>a.text)).size,3);const correct=stage.answers.find(a=>a.id===stage.correct);assert.ok(correct);correctPositions.push(stage.answers.indexOf(correct));assert.notEqual(stage.hint,correct.text);assert.ok(stage.goal&&stage.example&&stage.prompt&&stage.hint);assert.equal(new Set(stage.answers.map(a=>a.feedback)).size,3);for(const answer of stage.answers)assert.ok(answer.feedback.length>40);}
  assert.equal(new Set(correctPositions).size,3,'do not place every correct choice first in '+entry.id);
 }
 // Structural completeness is not evidence of three genuinely different reasoning
 // demands or scientific truth. Those require the recorded source/product review.
});
