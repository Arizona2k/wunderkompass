import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {asteroidLocation,cometDirections,projectedTransit,galaxyMembership,lightyearDistance} from '../app/book-astronomy-models.ts';
import {validateAstronomyPack,ASTRONOMY_QUESTIONS} from '../app/book-astronomy-validation.mjs';
import {GLOSSARY,WHY_QUESTIONS} from '../app/learning-data.ts';
const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const pack=read('app/book-astronomy-content.json'),words=GLOSSARY.map(row=>({term:row[0]})),why=WHY_QUESTIONS.map(row=>({question:row[0]}));


test('asteroid examples locate the selected object relative to Mars, Jupiter and the belt without claiming real orbits',()=>{
 const cases=[asteroidLocation(0),asteroidLocation(1),asteroidLocation(2)];
 assert(cases[0].radius>cases[0].marsRadius&&cases[0].radius<cases[0].jupiterRadius);
 assert(cases[0].radius>=cases[0].beltInnerRadius&&cases[0].radius<=cases[0].beltOuterRadius);
 assert(cases[1].radius<cases[1].marsRadius);assert.equal(cases[2].radius,cases[2].jupiterRadius);
 for(const row of cases){assert(Math.abs(Math.hypot(row.point.x-row.sun.x,row.point.y-row.sun.y)-row.radius)<1e-10);assert.equal(row.realOrbitCalculated,false);assert.equal(row.realObjectCount,null);}
});
test('comet material points away from the Sun independently of its indicated motion',()=>{
 for(const index of[0,1,2]){
  const row=cometDirections(index),radial={x:row.nucleus.x-row.sun.x,y:row.nucleus.y-row.sun.y},tail={x:row.tip.x-row.nucleus.x,y:row.tip.y-row.nucleus.y};
  assert(Math.abs(radial.x*tail.y-radial.y*tail.x)<1e-9);assert(radial.x*tail.x+radial.y*tail.y>0);
  assert(Math.abs(Math.hypot(tail.x,tail.y)-80)<1e-10);assert(Math.abs(row.movement.x*tail.y-row.movement.y*tail.x)>1);
  assert.deepEqual(row.movement,{x:0,y:-55});assert.equal(row.realTailShapeCalculated,false);assert.equal(row.realOrbitCalculated,false);
 }
});
test('both entirely overlapping projections block one percent of area; the separate disk blocks none',()=>{
 for(const index of[0,1,2]){
  const row=projectedTransit(index),distance=Math.hypot(row.foregroundPlanet.x-row.star.x,row.foregroundPlanet.y-row.star.y),inside=distance+row.foregroundPlanet.radius<=row.star.radius;
  assert.equal(inside,index!==2);assert.equal(row.fullyInside,inside);assert.equal(row.separate,index===2);
  const independentlyBlocked=inside?Math.PI*row.foregroundPlanet.radius**2/(Math.PI*row.star.radius**2):0;
  assert(Math.abs(row.blockedFraction-independentlyBlocked)<1e-14);assert.equal(row.remainingFraction,index===2?1:.99);
  assert.equal(row.planetConfirmed,false);assert.equal(row.realStellarMeasurement,false);assert.equal(row.uniformStellarBrightness,true);
 }
});
test('galaxy membership distinguishes planet, planetary system and galaxy without a scale or count',()=>{
 assert.deepEqual([0,1,2].map(i=>{const r=galaxyMembership(i);assert.equal(r.actualScale,null);assert.equal(r.actualStarCount,null);return[r.name,r.kind,r.memberOf];}),[['Erde','Planet','Sonnensystem'],['Sonnensystem','Planetensystem','Milchstraße'],['Milchstraße','Galaxie',null]]);
});
test('light-year is an exact Julian-year vacuum distance with independently rounded displayed kilometres',()=>{
 const one=299792458n*36525n*864n;assert.equal(one,9460730472580800n);
 for(const[index,years,label]of[[0,1,'9,46'],[1,2,'18,92'],[2,4,'37,84']]){
  const row=lightyearDistance(index);assert.equal(BigInt(row.metres),one*BigInt(years));assert.equal(row.years,years);assert.equal(row.lightyears,years);assert.equal(row.kilometresDecimal,(one*BigInt(years)/1000n).toString()+'.'+(one*BigInt(years)%1000n).toString().padStart(3,'0').replace(/0+$/,''));
  assert.equal(row.approximatelyGermanBillionKm,label);assert.equal(row.barFraction,years/4);assert.equal(row.realStarDistanceMeasured,false);assert.equal(row.vacuum,true);
 }
});
test('all five bounded models reject fractional, missing and out-of-range selections',()=>{
 for(const model of[asteroidLocation,cometDirections,projectedTransit,galaxyMembership,lightyearDistance])for(const input of[-1,3,.5,NaN,Infinity,undefined,'1'])assert.throws(()=>model(input));
});
test('astronomy connections use actual canonical peers and the old Planet receives the authored Asteroid edge',()=>{
 const incoming=read('app/book-astronomy-word-link-index.json'),topics=read('app/world-index.json');
 for(const item of[...Object.values(pack.learning),...Object.values(pack.whyLearning)]){
  assert(topics.some(row=>row.id===item.topic));for(const link of item.relatedWords??[])assert(words.some(row=>row.term===link.term));for(const link of item.relatedQuestions??[])assert(why.some(row=>row.question===link.question));
 }
 assert.deepEqual(Object.keys(incoming),['Planet']);assert.equal(incoming.Planet.length,1);assert.equal(incoming.Planet[0].term,'Asteroid');assert.equal(incoming.Planet[0].reason,pack.learning.Asteroid.relatedWords.find(row=>row.term==='Planet').reason);
});
test('unreviewed figures, dates, references, missing feedback and duplicate answers are rejected',()=>{
 for(const mutate of[data=>delete data.learning.Komet.question,data=>data.learning.Transit.figure='unknown',data=>data.learning.Galaxie.relatedWords.push({term:'unpublished',reason:'unavailable'}),data=>data.learning.Exoplanet.sources[0].checkedOn='2030-01-01',data=>data.learning.Asteroid.question.wrongReasons[data.learning.Asteroid.question.correct===0?1:0]='',data=>data.whyLearning[ASTRONOMY_QUESTIONS[0]].question.answers.push(data.whyLearning[ASTRONOMY_QUESTIONS[0]].question.answers[0])]){const changed=structuredClone(pack);mutate(changed);assert.throws(()=>validateAstronomyPack(changed));}
});

test('Transit task explicitly selects the nonoverlapping projection before asking for its interpretation',()=>{
 const q=pack.learning.Transit.question;assert.equal(q.prompt,'Wähle im Modell „Daneben“. Was beschreibt die Ansicht bei dieser Auswahl?');
 const separate=projectedTransit(2),centred=projectedTransit(0);assert(separate.separate&&!separate.fullyInside);assert.equal(separate.blockedFraction,0);assert(centred.fullyInside&&!centred.separate);assert.equal(centred.blockedFraction,.01);
 assert.equal(q.answers[q.correct],'Aus dieser Blickrichtung gibt es keine Überdeckung der Scheiben.');
});
