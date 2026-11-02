import test from 'node:test';
import assert from 'node:assert/strict';
import {FINAL_NINE_FIGURES,finalNineState} from '../app/book-retained-models.ts';

test('a finite collection distinguishes compatible observations, an actual counterexample and unobserved members',()=>{
 const expected=[[3,5,0,false],[6,2,1,true],[8,0,2,true]];
 for(const [i,[seen,unknown,counterexamples,refuted]]of expected.entries()){
  const row=finalNineState('testable-collection',i),observed=row.observations.filter(p=>p.corners!==null);
  assert.equal(observed.length,seen);assert.equal(row.unknown,unknown);assert.equal(observed.filter(p=>p.corners!==4).length,counterexamples);assert.equal(row.hypothesisRefuted,refuted);assert.equal(row.generalClaimProved,false);assert.equal(row.realExperiment,false);
 }
});

test('height contours retain a common datum and ordered grid pairs give distinct actual positions',()=>{
 for(const i of[0,1,2]){
  const contour=finalNineState('contour-levels',i);
  for(const point of contour.points){const line=contour.contours.find(row=>row.heightMeters===point.heightMeters);assert(line);assert.equal(Math.hypot(point.x-line.cx,point.y-line.cy),line.r);}
  assert.equal(contour.points[0].heightMeters,contour.points[1].heightMeters);assert.equal(contour.inferredTerrainFromOnlyThreePoints,false);assert.equal(contour.realGeographicPlace,false);
 }
 assert.deepEqual([0,1,2].map(i=>finalNineState('ordered-grid-point',i).point),[{x:155,y:80},{x:200,y:125},{x:155,y:125}]);
});

// Numerical integration is independent of the production endpoint formulas.
function integrate(fn,lo,hi){const intervals=1000,h=(hi-lo)/intervals;let sum=fn(lo)+fn(hi);for(let i=1;i<intervals;i++)sum+=(i%2?4:2)*fn(lo+i*h);return sum*h/3;}
test('the whole latitude band agrees with independent sphere and Mercator surface integrals',()=>{
 let previous=0;
 for(const [i,latitude]of[0,30,60].entries()){
  const row=finalNineState('projection-patch-area',i),lo=(latitude-5)*Math.PI/180,hi=(latitude+5)*Math.PI/180;
  const spherical=20*Math.PI/180*integrate(x=>Math.cos(x),lo,hi),projected=20*Math.PI/180*integrate(x=>1/Math.cos(x),lo,hi);
  assert(Math.abs(row.spherePatchArea-spherical)<1e-12);assert(Math.abs(row.equalAreaProjectedArea-spherical)<1e-12);assert(Math.abs(row.mercatorProjectedArea-projected)<1e-12);
  assert(row.mercatorRelativeArea>previous);previous=row.mercatorRelativeArea;assert(Math.abs(row.mercatorRelativeArea-projected/spherical)<1e-11);
  assert.equal(row.unitSphere,true);assert.equal(row.realCountry,false);assert.equal(row.actualEarthEllipsoid,false);assert.equal(row.projectionPreservesEverything,false);
 }
});

test('extending a ray leaves the same angle and the same arc endpoints',()=>{
 const rows=[0,1,2].map(i=>finalNineState('fixed-angle-length',i));
 for(const row of rows){const dx=row.end.x-row.origin.x,dy=row.origin.y-row.end.y;assert(Math.abs(Math.atan2(dy,dx)*180/Math.PI-60)<1e-12);assert(Math.abs(Math.hypot(dx,dy)-row.length)<1e-12);assert.deepEqual(row.arcEnd,rows[0].arcEnd);}
 assert.deepEqual(rows.map(row=>row.length),[60,120,180]);
});

test('only the two midlines preserve the non-square rectangle; its diagonal reflection has an exact external counterpoint',()=>{
 const expected=[[[2,-1],[-2,-1],[-2,1],[2,1]],[[-2,1],[2,1],[2,-1],[-2,-1]],[[-2,-1],[2/5,11/5],[2,1],[-2/5,-11/5]]];
 for(const i of[0,1,2]){const row=finalNineState('rectangle-reflection',i);assert.deepEqual(row.reflected.map(p=>[p.x,p.y]),expected[i]);const original=new Set(row.vertices.map(p=>p.x+':'+p.y));assert.equal(row.reflected.every(p=>original.has(p.x+':'+p.y)),i<2);assert.equal(row.mapsWholeRectangleToItself,i<2);}
 const counter=finalNineState('rectangle-reflection',2).counterpoint;assert.deepEqual(counter,{before:{x:2,y:-1},after:{x:2/5,y:11/5}});assert(counter.after.y>1);
});

test('the reference surface, nuclear symbols and GPS circles retain their explicit physical limits',()=>{
 for(const i of[0,1,2]){
  const geoid=finalNineState('reference-versus-terrain',i);assert.equal(geoid.actualGeoidComputed,false);assert.equal(geoid.trueScale,false);
  const nuclei=finalNineState('nuclear-symbol-comparison',i);assert.equal(nuclei.completeReactionEquation,false);assert.equal(nuclei.energyCalculated,false);assert.equal(nuclei.symbolSizeEncodesNucleonCount,false);assert.equal(nuclei.showFusion,i!==1);assert.equal(nuclei.showFission,i!==0);
  const gps=finalNineState('position-example-radius',i);assert.equal(gps.guaranteedErrorBound,false);assert.equal(gps.confidenceLevel,null);assert.equal(gps.realGPSMeasurement,false);assert.equal(gps.privateLocationCollected,false);assert.deepEqual(gps.estimatedPoint,{x:200,y:130});
 }
});

test('all nine models reject unknown choices instead of silently selecting another scientific state',()=>{
 assert.equal(FINAL_NINE_FIGURES.length,9);assert.equal(new Set(FINAL_NINE_FIGURES).size,9);
 for(const kind of FINAL_NINE_FIGURES)for(const i of[-1,3,.5,NaN,Infinity,undefined,'1'])assert.throws(()=>finalNineState(kind,i));
 for(const kind of['',null,undefined,'unknown'])assert.throws(()=>finalNineState(kind,0));
});
