// Own conceptual geometry for four already retained, individually sourced topics.
// View choices select emphasis, not measured time, rates, species or forecasts.
export const NATURE_HABITAT_FIGURES = ['ice-surface-subglacial-heat-water-path', 'coast-mountain-drier-west-forest-comparison', 'standing-and-fallen-deadwood-habitat', 'tidal-root-obstacles-and-sediment-settling'] as const;
export type NatureHabitatFigureKind = typeof NATURE_HABITAT_FIGURES[number];
export type HabitatPoint = {x: number; y: number};
function view(index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2) throw new RangeError('Unknown habitat comparison view');
}
export function iceHeatWater(index: number) {
  view(index);
  return {
    index, iceBaseY: 165, groundTopY: 185,
    ice: 'M30 165Q60 82 145 62Q235 56 285 165Z',
    iceSurface: 'M30 165Q60 82 145 62Q235 56 285 165',
    heat: {x: 165, y: 214, rx: 38, ry: 16},
    water: [{x: 166, y: 171}, {x: 214, y: 173}, {x: 267, y: 175}, {x: 326, y: 184}] as HabitatPoint[],
    emphasis: {ice: index === 0, heat: index === 1, water: index === 2},
  };
}
export function forestSites(index: number) {
  view(index);
  return {
    index,
    sites: [
      {id: 'lowland', label: 'Tiefland', x: 4, width: 108, treeHeight: 100, trees: [25, 56, 87], active: index === 0},
      {id: 'mountain', label: 'Bergstandort', x: 126, width: 108, treeHeight: 45, trees: [147, 178, 209], active: index === 1},
      {id: 'drier-west', label: 'Trockenere Westseite', x: 248, width: 108, treeHeight: 78, trees: [269, 335], active: index === 2},
    ],
    baselineY: 204,
  };
}
export function deadwoodHabitats(index: number) {
  view(index);
  return {
    index,
    standing: {x: 66, y: 63, width: 36, height: 142, active: index !== 1},
    fallen: {x: 172, y: 176, width: 152, height: 29, active: index !== 0},
    exampleFungi: [{x: 102, y: 153}, {x: 218, y: 175}],
    exampleInvertebrates: [{x: 83, y: 119}, {x: 273, y: 188}],
  };
}
export function tidalRoots(index: number) {
  view(index);
  const polylines: HabitatPoint[][] = [
    [{x: 104, y: 68}, {x: 104, y: 130}, {x: 73, y: 212}],
    [{x: 104, y: 130}, {x: 135, y: 212}],
    [{x: 255, y: 68}, {x: 255, y: 128}, {x: 219, y: 212}],
    [{x: 255, y: 128}, {x: 291, y: 212}],
  ];
  return {
    index, waterTopY: 100, bedY: 212,
    roots: polylines.map(points => points.map((p, n) => (n === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join('')),
    rootSegments: polylines.flatMap(points => points.slice(1).map((p, n) => ({from: {...points[n]}, to: {...p}}))),
    waterArrows: [
      {from: {x: 22, y: 145}, to: {x: 76, y: 145}},
      {from: {x: 160, y: 145}, to: {x: 208, y: 145}},
      {from: {x: 310, y: 145}, to: {x: 332, y: 145}},
    ],
    sediment: [{x: 89, y: 208}, {x: 118, y: 208}, {x: 150, y: 208}, {x: 203, y: 208}, {x: 238, y: 208}, {x: 274, y: 208}],
    sedimentRadius: 4,
    emphasis: {water: index !== 1, sediment: index !== 0},
  };
}
