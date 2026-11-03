import test from 'node:test';
import assert from 'node:assert/strict';
import {iceHeatWater, forestSites, deadwoodHabitats, tidalRoots} from '../app/book-nature-habitats-models.ts';

test('a chosen explanation never invents an out-of-range habitat view', () => {
  for (const model of [iceHeatWater, forestSites, deadwoodHabitats, tidalRoots]) {
    for (const state of [-1, 3, 0.5, NaN, Infinity]) assert.throws(() => model(state), RangeError);
  }
});
test('ice, heat and meltwater occupy distinct, consistent parts of the cross section', () => {
  const original = iceHeatWater(0);
  for (let state = 0; state < 3; state++) {
    const s = iceHeatWater(state);
    assert(s.heat.y - s.heat.ry > s.groundTopY, 'the hypothetical heat source lies below the ground surface');
    assert(s.water.every(p => p.y > s.iceBaseY && p.y < s.groundTopY), 'the meltwater example is beneath the ice rather than drawn on its upper surface or through deep ground');
    assert(s.water.at(-1).x > 285, 'the water path actually reaches beyond the ice margin');
    assert.deepEqual(s.water, original.water);assert.equal(s.ice, original.ice);assert.deepEqual(s.heat, original.heat);
    assert.equal(Object.values(s.emphasis).filter(Boolean).length, 1, 'each choice highlights one spatial subject without changing the landscape');
  }
});
test('separate forest examples carry the stated height and openness comparisons', () => {
  const s = forestSites(0), [lowland, mountain, west] = s.sites;
  assert(lowland.treeHeight > mountain.treeHeight);
  const gap = site => (site.trees.at(-1) - site.trees[0]) / (site.trees.length - 1);
  assert(gap(west) > gap(lowland), 'the open example actually leaves more space between its tree symbols');
  for (const site of s.sites) for (const x of site.trees) {
    assert(x - 13 >= site.x && x + 13 <= site.x + site.width, 'tree crowns stay inside their separate comparison panel');
  }
  for (let state = 0; state < 3; state++) {
    const v = forestSites(state);assert.equal(v.sites.filter(p => p.active).length, 1);
    assert.deepEqual(v.sites.map(({active, ...site}) => site), s.sites.map(({active, ...site}) => site), 'changing the selected example does not simulate ecological change');
  }
});
test('standing and fallen wood preserve their different orientations while comparison highlights both', () => {
  const first = deadwoodHabitats(0);
  assert(first.standing.height > first.standing.width);
  assert(first.fallen.width > first.fallen.height);
  for (let state = 0; state < 3; state++) {
    const s = deadwoodHabitats(state);
    assert.deepEqual(s.exampleFungi, first.exampleFungi);assert.deepEqual(s.exampleInvertebrates, first.exampleInvertebrates);
  }
  assert(deadwoodHabitats(2).standing.active && deadwoodHabitats(2).fallen.active);
});
test('symbolic sediment rests at the bed rather than floating above or disappearing into it', () => {
  const initial = tidalRoots(0);
  for (let state = 0; state < 3; state++) {
    const s = tidalRoots(state);
    for (const p of s.sediment) {assert.equal(p.y + s.sedimentRadius, s.bedY);assert(p.y - s.sedimentRadius > s.waterTopY);}
    assert.deepEqual(s.roots, initial.roots);assert.deepEqual(s.sediment, initial.sediment);assert.deepEqual(s.waterArrows, initial.waterArrows, 'a view choice must not pretend to be a computed time step');
  }
  assert(tidalRoots(2).emphasis.water && tidalRoots(2).emphasis.sediment);
});
test('local water arrows and sediment symbols leave the actual root strokes clear', () => {
  function distance(p, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
  }
  for (let state = 0; state < 3; state++) {
    const s = tidalRoots(state);
    for (const arrow of s.waterArrows) {
      assert(arrow.from.x < arrow.to.x && arrow.from.y === arrow.to.y);
      assert(arrow.from.y > s.waterTopY && arrow.from.y < s.bedY);
      for (const root of s.rootSegments) {
        const [a, b] = [root.from, root.to];
        if (arrow.from.y >= Math.min(a.y, b.y) && arrow.from.y <= Math.max(a.y, b.y)) {
          const crossingX = a.x + (b.x - a.x) * (arrow.from.y - a.y) / (b.y - a.y);
          assert(crossingX < arrow.from.x || crossingX > arrow.to.x, 'a drawn motion arrow must not pass through a solid root');
        }
        assert(distance(arrow.from, a, b) > 6 && distance(arrow.to, a, b) > 6, 'the visible arrow stroke retains clearance from root strokes');
      }
    }
    for (const p of s.sediment) for (const root of s.rootSegments) assert(distance(p, root.from, root.to) > s.sedimentRadius + 1 + 3.5, 'particle and root stroke borders must not overlap');
  }
});
