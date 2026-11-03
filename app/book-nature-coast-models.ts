// Own conceptual coastal/ocean geometry, never measured maps or weather data.
export const NATURE_COAST_FIGURES = ['current-defined-open-sea-and-floating-habitat', 'grounded-to-floating-ice-and-ocean-underneath', 'coastal-fog-and-separate-rain-observation', 'cooling-joints-and-polygonal-basalt-columns'] as const;
export type NatureCoastFigureKind = typeof NATURE_COAST_FIGURES[number];
export type CoastPoint = {x: number; y: number};
function view(index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2) throw new RangeError('Unknown coastal comparison view');
}
export function openSeaCurrents(index: number) {
  view(index);
  return {index, currents: ['M92 52Q180 31 269 54', 'M306 80Q327 130 307 181', 'M269 211Q181 227 91 207', 'M53 182Q34 131 53 80'],
    algae: ['M141 152Q168 111 197 146Q211 163 225 139', 'M169 134Q160 113 147 116', 'M190 140Q204 115 215 121'],
    emphasize: {currents: index === 0, openWater: index === 1, floatingHabitat: index === 2},
  };
}
export function shelfIce(index: number) {
  view(index);
  return {index, waterY: 109, grounding: {x: 140, y: 140}, frontX: 300,
    ice: [{x: 20, y: 55}, {x: 140, y: 105}, {x: 300, y: 105}, {x: 300, y: 140}, {x: 140, y: 140}, {x: 20, y: 105}],
    bed: [{x: 20, y: 105}, {x: 140, y: 140}, {x: 180, y: 210}, {x: 344, y: 230}],
    groundedBase: [{x: 20, y: 105}, {x: 140, y: 140}],
    floatingBase: [{x: 140, y: 140}, {x: 300, y: 140}],
    possibleWaterPath: [{x: 331, y: 170}, {x: 210, y: 170}],
    emphasize: {grounded: index === 0, floating: index === 1, water: index === 2},
  };
}
export function fogRainComparison(index: number) {
  view(index);
  return {index, rainPanel: {x: 8, y: 45, width: 164, height: 182, active: index !== 1}, fogPanel: {x: 188, y: 45, width: 164, height: 182, active: index !== 0},
    collector: {x: 62, y: 137, width: 53, height: 66},
    localRainObservedInThoughtExample: false,
    rainSymbols: [] as CoastPoint[],
    fogBands: [{x: 203, y: 100, width: 134}, {x: 215, y: 125, width: 120}, {x: 203, y: 150, width: 130}],
  };
}
const basaltSections: CoastPoint[][] = [
  [{x: 25, y: 102}, {x: 55, y: 80}, {x: 95, y: 95}, {x: 105, y: 130}, {x: 55, y: 158}],
  [{x: 125, y: 105}, {x: 155, y: 85}, {x: 185, y: 105}, {x: 185, y: 145}, {x: 155, y: 165}, {x: 125, y: 145}],
  [{x: 215, y: 107}, {x: 240, y: 82}, {x: 275, y: 82}, {x: 305, y: 105}, {x: 315, y: 140}, {x: 275, y: 169}, {x: 235, y: 157}],
];
export function basaltColumns(index: number) {
  view(index);
  const heights = [100, 110, 90], fronts = [[3, 4, 0], [3, 4, 5], [4, 5, 6, 0]];
  return {index, sideView: index === 2, emphasizeJoints: index === 1,
    sections: basaltSections.map((original, n) => {
      const section = original.map(p => ({...p})), roof = section.map(p => ({x: p.x, y: p.y / 2 + 15}));
      const faces = fronts[n].slice(1).map((vertex, k) => {
        const a = roof[fronts[n][k]], b = roof[vertex];
        return [{...a}, {...b}, {x: b.x, y: b.y + heights[n]}, {x: a.x, y: a.y + heights[n]}];
      });
      return {section, roof, faces, height: heights[n]};
    }),
  };
}
