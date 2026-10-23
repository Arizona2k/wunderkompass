import test from 'node:test';import assert from 'node:assert/strict';
import {pressure,balancingForce,buoyancy,pendulumPeriod,resonanceGain,checksum,shiftWord,angleEndpoint,triangleParts,diceSeries} from '../app/concept-math.mjs';
test('teaching models preserve units, forces and their explicitly bounded assumptions',()=>{
 assert.equal(pressure(12,3),4);assert.equal(pressure(12,6),2);assert.equal(balancingForce(12,1,3),4);
 assert.equal(buoyancy(2,3).floats,false);assert.equal(buoyancy(6,3).submergedFraction,.5);assert.equal(buoyancy(3,3).maximumNewtons,buoyancy(3,3).weightNewtons);
 assert.ok(Math.abs(pendulumPeriod(4)/pendulumPeriod(1)-2)<1e-12);assert.ok(resonanceGain(1)>resonanceGain(.5));assert.ok(resonanceGain(1)>resonanceGain(1.5));
 for(const operation of [()=>pressure(12,0),()=>balancingForce(12,1,0),()=>pendulumPeriod(-1),()=>buoyancy(2,NaN),()=>resonanceGain(Infinity)])assert.throws(operation);
});
test('finite mathematics and computing models expose collisions, round trips and exact drawing structure',()=>{
 assert.equal(checksum([1,2]),checksum([2,1]));assert.notDeepEqual([1,2],[2,1]);assert.throws(()=>checksum([NaN]));assert.equal(shiftWord(shiftWord('WELT',7),19),'WELT');assert.throws(()=>shiftWord('private@example.com',3));
 const right=angleEndpoint(90);assert.ok(Math.abs(right.x-110)<1e-12);assert.equal(right.y,40);
 for(let d=0;d<=4;d++){const parts=triangleParts(d);assert.equal(parts.length,3**d);assert.ok(parts.every(p=>p.length===6&&p.every(Number.isFinite)));}assert.throws(()=>triangleParts(5));assert.throws(()=>triangleParts(1.1));
 const series=diceSeries(6,()=>.999);assert.deepEqual(series,[6,6,6,6,6,6]);assert.throws(()=>diceSeries(121));assert.throws(()=>diceSeries(6,()=>1));assert.throws(()=>diceSeries(6,()=>NaN));
});
