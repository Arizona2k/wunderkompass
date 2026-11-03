import test from 'node:test';import assert from 'node:assert/strict';
import {NATURE_PROCESS_FIGURES,valleyProcess,relativeLakeShore,lavaTubeProcess,mineralTerraces}from'../app/book-nature-process-models.ts';
test('valley sequence distinguishes old material, a carried-ice example and later wider floor',()=>{
 const a=valleyProcess(0),b=valleyProcess(1),c=valleyProcess(2);assert.equal(a.profile.filter(p=>p.y===210).length,1);assert.equal(c.profile.filter(p=>p.y===205).length,2);assert.deepEqual(b.profile,c.profile);assert.equal(b.glacier.length,6);assert.deepEqual(b.carriedClasts.map(p=>p.x),[158,180,202]);assert(b.carriedClasts.every(p=>p.y+3<205));assert(b.flowOutOfSection&&b.flowOutOfSection.y<200);assert.equal(c.glacier.length,0);assert([a,b,c].every(v=>v.sameUnderlyingRock));
});
test('a relative shoreline does not identify one unique changing quantity',()=>{
 const a=relativeLakeShore(0),b=relativeLakeShore(1),c=relativeLakeShore(2);assert.equal(a.oldStrand.length,0);assert.equal(b.oldStrand[0].y,125);assert.equal(b.currentWater[0].y,185);assert.equal(c.thoughtComparisons.length,2);const [water,land]=c.thoughtComparisons;assert.equal(water.waterY-water.landMarkerY,60);assert.equal(land.waterY-land.landMarkerY,60);assert.equal(water.oldLandMarkerY,water.landMarkerY);assert.equal(land.oldWaterY,land.waterY);assert.notEqual(water.oldWaterY,water.waterY);assert.notEqual(land.oldLandMarkerY,land.landMarkerY);
});
test('a lava tube needs cooled roof and drainage; roof is not liquid material',()=>{
 const a=lavaTubeProcess(0),b=lavaTubeProcess(1),c=lavaTubeProcess(2);assert.equal(a.surfaceSolid,false);assert.equal(a.crustBottomY,null);assert(b.surfaceSolid&&b.lavaPresent&&!b.cavityAfterDrainage);assert.equal(b.flowArrows.length,2);assert(b.flowArrows.flat().every(p=>p.y>b.crustBottomY));assert(c.surfaceSolid&&!c.lavaPresent&&c.cavityAfterDrainage);assert.equal(c.flowArrows.length,0);assert.equal(b.outerRock,c.outerRock);assert.equal(b.innerRegion,c.innerRegion);assert.equal(c.laterCarbonateDecorationNotModelled,true);
});
test('spring water stays outside the rock steps and continues after local deposition',()=>{
 const [a,b,c]=[0,1,2].map(mineralTerraces);const outside=p=>p.y<(p.x<=120?95:p.x<=220?135:175);for(let i=1;i<c.waterRoute.length;i++){const start=c.waterRoute[i-1],end=c.waterRoute[i];for(let j=0;j<=16;j++){const t=j/16;assert(outside({x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t}));}}assert.equal(outside({x:110,y:110}),false,'a path through the terrace must be detected');assert.equal(a.dissolvedSymbols.length,0);assert.equal(b.fixedDepositBands.length,0);assert.equal(c.fixedDepositBands.length,3);assert.deepEqual(a.waterRoute,c.waterRoute);assert.deepEqual(c.continuingWaterEnd,c.waterRoute.at(-1));assert(c.fixedDepositBands.flat().every(p=>p.y!==c.continuingWaterEnd.y));
});
test('four distinct process kinds reject undeclared interpolation or invalid stages',()=>{
 assert.equal(new Set(NATURE_PROCESS_FIGURES).size,4);for(const f of[valleyProcess,relativeLakeShore,lavaTubeProcess,mineralTerraces])for(const x of[-1,3,0.5,NaN])assert.throws(()=>f(x),RangeError);
});
