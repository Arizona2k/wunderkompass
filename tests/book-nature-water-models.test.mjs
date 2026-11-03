import test from 'node:test';
import assert from 'node:assert/strict';
import {segment,inlandDeltaWaterPaths,riftLakeSection,connectedWaterLevels,riverDeltaToSea} from '../app/book-nature-water-models.ts';

test('inland delta expands one inflow into example branches and soil/air pathways without inventing a marine outlet or quantities',()=>{
 for(const[index,branchCount,transferCount]of[[0,0,0],[1,3,0],[2,3,2]]){
  const row=inlandDeltaWaterPaths(index);assert.equal(row.branches.length,branchCount);assert.equal(row.transfers.length,transferCount);assert.equal(row.seaOutlet,false);assert.equal(row.realMap,false);assert.equal(row.measuredFractions,null);assert.equal(row.timeSimulation,false);
  assert(row.inflow.from.x<row.inflow.to.x);
  for(const branch of row.branches)assert(branch.from.x<branch.to.x);
  if(index===2){assert(row.transfers[0].to.y<row.transfers[0].from.y);assert(row.transfers[1].to.y>row.transfers[1].from.y);}
 }
});
test('rift water has a level surface and actually intersects both selected bank lines above the basin floor',()=>{
 for(const index of[0,1,2]){
  const row=riftLakeSection(index),[left,right,bottomRight,bottomLeft]=row.water;assert.equal(left.y,right.y);assert.equal(left.y,row.surfaceY);assert(left.x<right.x);assert(left.y<bottomLeft.y&&right.y<bottomRight.y);
  const onLine=(p,a,b)=>Math.abs((p.x-a.x)*(b.y-a.y)-(p.y-a.y)*(b.x-a.x))<1e-9;
  assert(onLine(left,row.leftBank,row.leftBottom));assert(onLine(right,row.rightBank,row.rightBottom));assert(row.leftBottom.y>row.rightBottom.y,'own section is an asymmetric example, not a supposed regular symmetric real basin');
  assert.equal(row.faults.length,index===2?2:0);assert.equal(row.actualDepth,null);assert.equal(row.actualFaultLocations,false);assert.equal(row.politicalBoundaries,false);assert.equal(row.crustMovementCalculated,false);
 }
});
test('connected surfaces reverse the actual arrow with the head difference and make no immediate natural stop or discharge prediction',()=>{
 for(const[index,direction]of[[0,'mekong-to-lake'],[1,'lake-to-mekong'],[2,null]]){
  const row=connectedWaterLevels(index);assert.equal(row.direction,direction);assert.equal(row.actualGaugeMeasurements,false);assert.equal(row.flowRate,null);assert.equal(row.calendarPrediction,false);assert.equal(row.instantRealWorldStopClaim,false);
  if(index===2){assert.equal(row.arrow,null);assert.equal(row.mekong.surfaceY,row.lake.surfaceY);}
  else{assert(row.arrow.to.y>row.arrow.from.y,'drawn motion is downhill on the actually compared surfaces');assert(index===0?row.arrow.to.x>row.arrow.from.x:row.arrow.to.x<row.arrow.from.x);}
 }
 assert.deepEqual([0,1,2].map(i=>{const r=connectedWaterLevels(i);return[r.mekong.heightStage,r.lake.heightStage]}),[[4,2],[1,3],[2,2]]);
});
test('every displayed marine delta branch reaches the same actual sea field without claiming a real branch count or uniform growth',()=>{
 for(const index of[0,1,2]){
  const row=riverDeltaToSea(index);assert.equal(row.branches.length,index===0?1:3);assert.equal(row.seaOutlet,true);assert.equal(row.actualMap,false);assert.equal(row.actualBranchCount,null);assert.equal(row.sedimentQuantity,null);assert.equal(row.allDeltaPartsGrowing,false);assert.equal(row.currentCoastline,false);
  for(const branch of row.branches){assert.deepEqual(branch.from,row.split);assert(branch.to.x>row.sea.x&&branch.to.x<row.sea.x+row.sea.width&&branch.to.y>row.sea.y&&branch.to.y<row.sea.y+row.sea.height);}
  assert.equal(row.wetlandPatches.length,index===2?2:0);assert.equal(row.sedimentMarkers.length,index===2?8:0);
 }
});
test('geometry clips an arrow to the intended endpoints and rejects impossible or nonfinite paths',()=>{
 const row=segment({x:0,y:0},{x:30,y:40},10,15);assert.deepEqual(row,{from:{x:6,y:8},to:{x:21,y:28}});
 for(const args of[[{x:0,y:0},{x:0,y:0}],[{x:NaN,y:0},{x:5,y:6}],[{x:0,y:0},{x:3,y:4},-1],[{x:0,y:0},{x:3,y:4},3,2]])assert.throws(()=>segment(...args));
});
test('every model rejects missing, fractional, string and out-of-range selections',()=>{
 for(const fn of[inlandDeltaWaterPaths,riftLakeSection,connectedWaterLevels,riverDeltaToSea])for(const index of[-1,3,.5,NaN,Infinity,undefined,'1'])assert.throws(()=>fn(index));
});
