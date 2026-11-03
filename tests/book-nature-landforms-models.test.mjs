import test from 'node:test';
import assert from 'node:assert/strict';
import {duneLagoon, naturalRange, karstWaterline, fjordValley} from '../app/book-nature-landforms-models.ts';
test('comparison controls reject invalid states rather than inventing landscape history', () => {
  for (const model of [duneLagoon, naturalRange, karstWaterline, fjordValley]) for (const n of [-1, 3, 0.5, NaN, Infinity]) assert.throws(() => model(n), RangeError);
});
test('a higher water table reaches the unchanged dune hollow while the lower example stays below it', () => {
  const low = duneLagoon(0), high = duneLagoon(1), both = duneLagoon(2);
  assert.deepEqual(high.surface, low.surface);assert.deepEqual(both.surface, low.surface);
  assert.equal(low.openWaterSurface.length, 0);assert(high.openWaterSurface.length > 0);
  assert(high.waterY < Math.max(...high.surface.map(p => p.y)) && high.waterY > high.surface[0].y);
  assert(high.openWaterSurface.every(p => p.x > high.surface[0].x && p.x < high.surface.at(-1).x));
  assert.deepEqual(high.openWaterSurface, both.openWaterSurface);assert(both.showLowerComparison);
  assert(high.rain.every(p => p.toY < Math.min(...high.surface.map(p => p.y))), 'rain arrows stop above the sand and lagoon rather than passing through material');
});
test('a hypothetical planted tree stays outside the natural-region example and never changes its boundary', () => {
  const first = naturalRange(0);
  for (let n = 0; n < 3; n++) {
    const s = naturalRange(n);assert.equal(s.island, first.island);assert.deepEqual(s.naturalExample, first.naturalExample);
    assert(s.naturalExample.x < s.thoughtPanel.x);assert(s.hypotheticalExample.x > s.thoughtPanel.x && s.hypotheticalExample.x < s.thoughtPanel.x + s.thoughtPanel.width);
  }
  assert(naturalRange(2).emphasizeNatural && naturalRange(2).emphasizeHypothetical);
});
test('rising conceptual seawater covers more of the same karst towers without rebuilding them', () => {
  const dry = karstWaterline(0), low = karstWaterline(1), high = karstWaterline(2);
  assert.equal(dry.waterY, null);assert.deepEqual(dry.towers, low.towers);assert.deepEqual(low.towers, high.towers);
  assert(high.waterY < low.waterY && low.waterY < low.bedY);
});
test('the fjord inlet keeps the same valley and its highlighted arm is actually joined to the larger schematic system', () => {
  const dry = fjordValley(0), wet = fjordValley(1), plan = fjordValley(2);
  assert.deepEqual(wet.profile, dry.profile);assert.deepEqual(plan.profile, dry.profile);
  assert(wet.waterY > wet.profile[0].y && wet.waterY < Math.max(...wet.profile.map(p => p.y)));
  assert(plan.showSystem);assert(plan.system.some(p => p.x === plan.branch[0].x && p.y === plan.branch[0].y));
  assert(plan.system.some(p => p.x === plan.otherBranch[0].x && p.y === plan.otherBranch[0].y));
  assert.notDeepEqual(plan.branch, plan.system, 'a selected arm is a proper part, never the entire system');
});
