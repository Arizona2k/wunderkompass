import test from 'node:test';import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type:'json'};
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
test('source-derived finite model limits distinguish damped continuous resonance from a sampled maximum and check the actual triangle origin',()=>{
 // Cline3.6 equations3.64/3.68–3.70: amplitude peak ratio sqrt(1-2*zeta²), zeta=.15.
 const peakRatio=Math.sqrt(1-2*.15**2);assert.ok(peakRatio<1);assert.ok(resonanceGain(peakRatio)>resonanceGain(1));
 // The actual UI passes y=166; the unused helper default y=150 is not a product clipping finding.
 for(const depth of [0,1,2,4]){const triangles=triangleParts(depth,20,166);assert.equal(triangles.length,3**depth);for(const points of triangles)for(let i=0;i<points.length;i+=2){assert.ok(points[i]>=0&&points[i]<=240);assert.ok(points[i+1]>=0&&points[i+1]<=180);}}
});

test('each science thinking entry has three distinct authored inquiry paths with complete answer-specific feedback and web source references',async()=>{
 const {default:thinking}=await import('../app/science-thinking.json',{with:{type:'json'}});
 assert.ok(thinking.entries.length>0);assert.equal(new Set(thinking.entries.map(e=>e.id)).size,thinking.entries.length);
 for(const entry of thinking.entries){
  const topic=catalog.find(t=>t.id===entry.id);assert.ok(topic,entry.id+' is a current topic');assert.equal(topic.category,'science',entry.id);
  // The article shows a model area exactly when the topic has an investigation or a world model.
  assert.equal(entry.interactive,!!(topic.investigation||topic.model),entry.id+' model wording matches the article');
  assert.ok(entry.sources.length);assert.equal(new Set(entry.sources).size,entry.sources.length);for(const url of entry.sources)assert.match(url,/^https:\/\/\S+$/,entry.id+' source reference');
  assert.deepEqual(entry.stages.map(t=>t.id),['observe','explain','transfer']);assert.equal(new Set(entry.stages.map(t=>t.prompt)).size,3);const correctPositions=[];
  for(const stage of entry.stages){assert.equal(stage.answers.length,3);assert.equal(new Set(stage.answers.map(a=>a.id)).size,3);assert.equal(new Set(stage.answers.map(a=>a.text)).size,3);const correct=stage.answers.find(a=>a.id===stage.correct);assert.ok(correct);correctPositions.push(stage.answers.indexOf(correct));assert.notEqual(stage.hint,correct.text);assert.ok(stage.goal&&stage.example&&stage.prompt&&stage.hint);assert.equal(new Set(stage.answers.map(a=>a.feedback)).size,3);for(const answer of stage.answers)assert.ok(answer.feedback.length>40);}
  assert.equal(new Set(correctPositions).size,3,'do not place every correct choice first in '+entry.id);
 }
 // Structural completeness is not evidence of three genuinely different reasoning
 // demands or scientific truth. Those require the recorded source/product review.
});
