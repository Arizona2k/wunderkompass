import test from 'node:test';import assert from 'node:assert/strict';
import {NATURE_FINAL_SIX_FIGURES,closedSaltBasin,lakeWaterRoutes,retreatingFall,islandCascades,hollowAndFlood,nutrientUpwelling} from '../app/book-nature-final-six-models.ts';
test('evaporating basin retains solid residue, with water vapor separated from dissolved symbols',()=>{
 const [a,b,c]=[0,1,2].map(closedSaltBasin);assert.deepEqual(a.profile,b.profile);assert.deepEqual(a.profile,c.profile);assert(c.waterY<a.waterY);assert.equal(b.water.length,0);assert.equal(b.solidSymbols.length,3);assert.equal(b.dissolvedSymbols.length,0);assert(b.vapor[1].y<b.vapor[0].y);assert(b.solidSymbols.every(p=>p.y>b.vapor[0].y));for(const s of[a,c])assert(s.dissolvedSymbols.every(p=>p.y>s.waterY&&p.y<180));
});
test('lake distinguishes incoming ground routes, outgoing river and upward vapor without changing the lake',()=>{
 const states=[0,1,2].map(lakeWaterRoutes);for(const s of states){assert.deepEqual(s.lake,states[0].lake);assert.equal(s.inflows.length,3);assert.equal(s.outlet[0].y,s.lake.cy+s.lake.ry);assert(s.outlet[1].y>s.outlet[0].y);assert(s.vapor.every(ps=>ps[1].y<ps[0].y));}assert.deepEqual(states.map(s=>s.emphasize),['inflows','outlet','vapor']);
});
test('fall retreats upstream against continuing downstream water and leaves a longer gorge',()=>{
 const [a,b,c]=[0,1,2].map(retreatingFall);assert(b.edgeX<a.edgeX);assert.deepEqual(b.profile,c.profile);assert.equal(c.formerEdgeX,a.edgeX);assert(c.retreatArrow[1].x<c.retreatArrow[0].x);assert(a.flowArrows[0][1].x>a.flowArrows[0][0].x);assert(b.remainingGorge.right-b.remainingGorge.left>a.remainingGorge.right-a.remainingGorge.left);for(const s of[a,b,c]){assert(s.water[0].every(p=>p.y<=(p.x<s.edgeX?100:195)));assert.equal(s.profile[1].x,s.profile[2].x);assert(s.flowArrows[1][1].y>s.flowArrows[1][0].y);}
});
test('separate cascade arms bypass the island, spray highlights keep the same geometry',()=>{
 const states=[0,1,2].map(islandCascades);for(const s of states){assert.deepEqual(s.island,states[0].island);assert.deepEqual(s.falls,states[0].falls);assert.equal(s.routes.length,2);for(const p of s.routes.flat())assert(((p.x-s.island.cx)/s.island.rx)**2+((p.y-s.island.cy)/s.island.ry)**2>1);}assert.equal(states[0].spray.length,0);assert.equal(states[2].spray.length,2);assert(states[0].falls[0][1].x<states[0].falls[1][0].x);
});
test('later flooding covers the same earlier hollow and is clipped above its solid bed',()=>{
 const [a,b,c]=[0,1,2].map(hollowAndFlood);assert.equal(a.panels[0].water.length,0);assert.equal(b.panels[0].water.length,1);assert.deepEqual(a.panels[0].profile,b.panels[0].profile);assert.equal(c.panels.length,2);assert.deepEqual(c.panels.map(p=>p.flooded),[false,true]);assert.deepEqual(c.panels[0].profile,c.panels[1].profile);assert.equal(b.panels[0].water[0][0].y,75);assert(b.panels[0].water[0].some(p=>p.y===200));
});
test('nutrient symbols move upward into the light layer while the route remains inside water',()=>{
 const [a,b,c]=[0,1,2].map(nutrientUpwelling);assert.equal(a.route.length,0);assert(b.route[0].y>b.route.at(-1).y);assert.deepEqual(b.route,c.route);for(const p of c.nutrients)assert(p.y>=c.sunlit.y&&p.y<=c.sunlit.y+c.sunlit.height);for(const p of c.route)assert(p.x>=20&&p.x<=340&&p.y>=40&&p.y<=215);assert(c.lightRays.every(ps=>ps[1].y<40));assert.equal(c.numericalQuantity,false);
});
test('all six source-backed comparison mechanisms reject invalid view indices',()=>{
 assert.equal(new Set(NATURE_FINAL_SIX_FIGURES).size,6);for(const f of[closedSaltBasin,lakeWaterRoutes,retreatingFall,islandCascades,hollowAndFlood,nutrientUpwelling])for(const n of[-1,3,0.1,NaN,Infinity])assert.throws(()=>f(n),RangeError);
});
