import test from 'node:test';import assert from 'node:assert/strict';
import {NATURE_GEOSCIENCE_FIGURES,rockLayersAndIncision,solutionPassages,geyserRoles,waterOverProfile,tidalExposure} from '../app/book-nature-geoscience-models.ts';
test('canyon exposes older unchanged layers rather than creating them at incision',()=>{
 const a=rockLayersAndIncision(0),b=rockLayersAndIncision(1),c=rockLayersAndIncision(2);assert.deepEqual(a.layers,b.layers);assert.deepEqual(b.layers,c.layers);assert.equal(a.profile.length,2);assert.deepEqual(b.profile,c.profile);assert.equal(c.selectedLayer,1);assert.equal(a.riverSymbol,null);assert(b.riverSymbol.y+b.riverSymbol.radius<210);assert.deepEqual(b.profile.filter(p=>p.y===210).map(p=>p.x),[170,190]);assert.equal(c.rockCreatedBySwitching,false);
});
test('solution enlarges a water route; an older dry route is distinct from lower moving water',()=>{
 const a=solutionPassages(0),b=solutionPassages(1),c=solutionPassages(2);assert(a.upper.width<b.upper.width);assert.deepEqual(b.upper,c.upper);assert.equal(c.upperDry,true);assert(c.lower&&c.water.from.y===c.lower.from.y);assert(c.water.from.y>c.upper.from.y);for(const s of[a,b,c]){const passage=s.index===2?s.lower:s.upper;assert(s.water.width<passage.width);assert(s.water.from.x>=passage.from.x&&s.water.to.x<=passage.to.x);assert(s.dissolvedSymbols.every(p=>p.y===s.water.from.y&&p.radius<s.water.width));}
});
test('geyser example separates heat, water and narrow plumbing without lava in water or an eruption timer',()=>{
 const states=[0,1,2].map(geyserRoles);for(const s of states){assert(s.geyserNeck.right-s.geyserNeck.left<s.openSpringNeck.right-s.openSpringNeck.left);assert(s.heatBand.y>190);assert.equal(s.magmaFlowsInWaterPassages,false);assert.equal(s.eruptionClock,false);assert.equal(s.openCirculationArrows.length,2);}assert.equal(states[0].bubbles.length,0);assert.equal(states[2].bubbles.length,3);assert(states[2].bubbles.every(p=>p.x===100&&p.y+p.radius<190));assert.deepEqual(states[1].emphasize,{heat:false,water:true,neckAndGas:false});
});
test('tidal exposure changes water first; later illustrative redistribution changes shape with unchanged section area',()=>{
 const high=tidalExposure(0),low=tidalExposure(1),moved=tidalExposure(2);assert.deepEqual(high.profile,low.profile);assert.deepEqual(high.marker,low.marker);assert(high.marker.y>high.waterY);assert(low.marker.y<low.waterY);assert(low.water.length>0,'a deeper channel stays wet in this low-water example');assert.notDeepEqual(low.profile,moved.profile);assert.equal(low.waterY,moved.waterY);const area=ps=>ps.slice(1).reduce((sum,p,n)=>sum+(p.x-ps[n].x)*(p.y+ps[n].y)/2,0);assert.equal(area(low.profile),area(moved.profile));assert.deepEqual(moved.previousProfile,low.profile);assert.equal(moved.marker.y,140);assert.equal(high.actualTideOrSafeRoutePrediction,false);
});
test('clipped water lies above the fixed bed and preserves both separate deeper wet pockets',()=>{
 const low=tidalExposure(1);assert.equal(low.water.length,2);for(const polygon of low.water){assert.equal(polygon[0].y,165);assert.equal(polygon.at(-1).y,165);assert(polygon.every(p=>p.y>=165));}assert.deepEqual(waterOverProfile([{x:0,y:20},{x:10,y:0},{x:20,y:20}],10),[[{x:0,y:10},{x:0,y:20},{x:5,y:10},{x:5,y:10}],[{x:15,y:10},{x:15,y:10},{x:20,y:20},{x:20,y:10}]]);assert.throws(()=>waterOverProfile([{x:1,y:2},{x:1,y:3}],2),RangeError);
});
test('all four distinct source-backed mechanisms reject invalid comparison states',()=>{
 assert.equal(new Set(NATURE_GEOSCIENCE_FIGURES).size,4);for(const f of[rockLayersAndIncision,solutionPassages,geyserRoles,tidalExposure])for(const n of[-1,3,0.2,NaN])assert.throws(()=>f(n),RangeError);
});
