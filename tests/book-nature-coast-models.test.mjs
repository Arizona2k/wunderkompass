import test from 'node:test';
import assert from 'node:assert/strict';
import {openSeaCurrents, shelfIce, fogRainComparison, basaltColumns} from '../app/book-nature-coast-models.ts';
test('coastal comparisons reject states outside their actual three controls', () => {
  for (const model of [openSeaCurrents, shelfIce, fogRainComparison, basaltColumns]) for (const n of [-1, 3, 0.5, NaN, Infinity]) assert.throws(() => model(n), RangeError);
});
test('four schematic boundary currents keep gaps and never create a solid closed coastline', () => {
  const first = openSeaCurrents(0);assert.equal(first.currents.length, 4);assert(first.currents.every(p => !/z/i.test(p)));
  for (let n = 0; n < 3; n++) {const s = openSeaCurrents(n);assert.deepEqual(s.currents, first.currents);assert.deepEqual(s.algae, first.algae);assert.equal(Object.values(s.emphasize).filter(Boolean).length, 1);}
});
test('grounded ice touches the bed while the mostly submerged floating shelf leaves actual ocean space underneath', () => {
  for (let n = 0; n < 3; n++) {
    const s = shelfIce(n);assert.deepEqual(s.groundedBase, s.bed.slice(0, 2));assert.deepEqual(s.grounding, s.floatingBase[0]);
    const thickness = s.floatingBase[0].y - s.ice[1].y, immersed = s.floatingBase[0].y - s.waterY;
    assert(immersed > thickness * 0.8 && immersed < thickness, 'floating ice must not look mostly suspended in air');
    for (let x = s.possibleWaterPath[1].x; x <= s.possibleWaterPath[0].x; x++) {
      const bedY = 210 + (x - 180) * 20 / 164;
      assert(s.possibleWaterPath[0].y > s.floatingBase[0].y && s.possibleWaterPath[0].y < bedY, 'an illustrative ocean path stays below ice and above solid ground');
    }
    assert.deepEqual(s.ice, shelfIce(0).ice);assert.deepEqual(s.bed, shelfIce(0).bed);
  }
});
test('rain and fog are independent comparison panels, not alternative steps in a fabricated weather record', () => {
  const a = fogRainComparison(0), b = fogRainComparison(1), both = fogRainComparison(2);
  assert(a.rainPanel.x + a.rainPanel.width < a.fogPanel.x);
  assert.equal(a.localRainObservedInThoughtExample, false);assert.equal(a.rainSymbols.length, 0, 'do not draw a local shower in the explicit no-shower thought example');
  assert(a.rainPanel.active && !a.fogPanel.active);assert(!b.rainPanel.active && b.fogPanel.active);assert(both.rainPanel.active && both.fogPanel.active);
  for (const s of [b, both]) {assert.deepEqual(s.rainSymbols, a.rainSymbols);assert.deepEqual(s.fogBands, a.fogBands);assert.deepEqual(s.collector, a.collector);}
});
test('basalt examples preserve five, six and seven sides and their column faces join without invented gaps', () => {
  const top = basaltColumns(0), joints = basaltColumns(1), side = basaltColumns(2);
  assert.deepEqual(top.sections.map(s => s.section.length), [5, 6, 7]);assert.deepEqual(joints.sections, top.sections);assert.deepEqual(side.sections, top.sections);
  for (const column of side.sections) {
    assert.equal(column.roof.length, column.section.length);
    for (const face of column.faces) for (const [upper, lower] of [[face[0], face[3]], [face[1], face[2]]]) {assert.equal(upper.x, lower.x);assert.equal(lower.y - upper.y, column.height);}
    for (let k = 1; k < column.faces.length; k++) {assert.deepEqual(column.faces[k - 1][1], column.faces[k][0]);assert.deepEqual(column.faces[k - 1][2], column.faces[k][3]);}
  }
});
