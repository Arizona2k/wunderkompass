// Own schematic geometry for individually retained and sourced Nature topics.
// No measured topography, occurrence map, sea-level history or time simulation.
export const NATURE_LANDFORM_FIGURES = ['dune-hollow-rainfall-groundwater-lagoon', 'natural-range-versus-hypothetical-cultivation', 'limestone-karst-relief-and-seawater-visibility', 'glacial-valley-marine-inlet-and-fjord-branch'] as const;
export type NatureLandformFigureKind = typeof NATURE_LANDFORM_FIGURES[number];
export type LandformPoint = {x: number; y: number};
function view(index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2) throw new RangeError('Unknown landform comparison view');
}
// Binary-rational coordinates keep this thought profile identical in Node and all
// browser math libraries. It is an illustrative parabola, never surveyed dunes.
const duneSurface = () => Array.from({length: 65}, (_, n) => ({x: 20 + n * 5, y: 80 + 110 * (1 - ((n - 32) / 32) ** 2)}));
export function duneLagoon(index: number) {
  view(index);
  const surface = duneSurface(), lowerWaterY = 204, higherWaterY = 144;
  const waterY = index === 0 ? lowerWaterY : higherWaterY;
  return {index, surface, lowerWaterY, higherWaterY, waterY, showLowerComparison: index === 2,
    openWaterSurface: surface.filter(p => p.y > waterY),
    rain: index === 0 ? [] : [{x: 115, fromY: 30, toY: 67}, {x: 180, fromY: 30, toY: 67}, {x: 245, fromY: 30, toY: 67}],
  };
}
export function naturalRange(index: number) {
  view(index);
  return {index, island: 'M20 123Q44 82 83 85L115 65L165 97L181 127L152 153L89 174L47 157Z',
    naturalExample: {x: 95, y: 120}, hypotheticalExample: {x: 278, y: 125},
    thoughtPanel: {x: 218, y: 64, width: 120, height: 140},
    emphasizeNatural: index !== 1, emphasizeHypothetical: index !== 0,
  };
}
export function karstWaterline(index: number) {
  view(index);
  return {index, bedY: 220, lowerWaterY: 181, higherWaterY: 132,
    waterY: index === 0 ? null : index === 1 ? 181 : 132,
    towers: ['M37 220L47 103Q57 73 75 90L91 220Z', 'M126 220L140 65Q157 34 176 70L191 220Z', 'M236 220L247 113Q269 84 286 116L304 220Z'],
  };
}
export function fjordValley(index: number) {
  view(index);
  const profile = [{x: 26, y: 67}, {x: 68, y: 75}, {x: 98, y: 156}, {x: 132, y: 190}, {x: 180, y: 200}, {x: 228, y: 190}, {x: 262, y: 156}, {x: 292, y: 75}, {x: 334, y: 67}];
  const junction = {x: 143, y: 145};
  return {index, profile, waterY: index === 1 ? 122 : null, showSystem: index === 2,
    system: [{x: 29, y: 211}, {x: 91, y: 176}, junction, {x: 218, y: 118}, {x: 321, y: 52}],
    branch: [junction, {x: 122, y: 93}, {x: 93, y: 48}],
    otherBranch: [{x: 218, y: 118}, {x: 264, y: 163}, {x: 321, y: 181}],
  };
}
