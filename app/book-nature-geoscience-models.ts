import {waterOverProfile} from './nature-water-profile.mjs';
export {waterOverProfile} from './nature-water-profile.mjs';
// Distinct retained Grand Canyon, Mammoth Cave, geyser and Wadden explanations.
// All coordinates are chosen thought examples, never surveyed data or rates.
export const NATURE_GEOSCIENCE_FIGURES = ['rock-layers-and-later-incision', 'limestone-solution-passages', 'geyser-water-heat-and-constriction', 'tidal-exposure-versus-sediment-change'] as const;
export type NatureGeoscienceFigureKind = typeof NATURE_GEOSCIENCE_FIGURES[number];
export type GeosciencePoint = {x: number; y: number};
function view(index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2) throw new RangeError('Unknown geoscience comparison view');
}
const canyonProfile: GeosciencePoint[] = [{x: 20, y: 65}, {x: 100, y: 65}, {x: 120, y: 100}, {x: 140, y: 150}, {x: 170, y: 210}, {x: 190, y: 210}, {x: 220, y: 150}, {x: 240, y: 100}, {x: 260, y: 65}, {x: 340, y: 65}];
export function rockLayersAndIncision(index: number) {
  view(index);
  return {index, profile: (index === 0 ? [{x: 20, y: 65}, {x: 340, y: 65}] : canyonProfile).map(p => ({...p})),
    layers: [{top: 65, bottom: 110}, {top: 110, bottom: 160}, {top: 160, bottom: 240}],
    selectedLayer: index === 2 ? 1 : null,
    riverSymbol: index > 0 ? {x: 180, y: 204, radius: 3} : null,
    rockCreatedBySwitching: false,
  };
}
export function solutionPassages(index: number) {
  view(index);
  const upper = {from: {x: 45, y: 100}, to: {x: 315, y: 100}, width: index === 0 ? 8 : 36};
  const lower = index === 2 ? {from: {x: 45, y: 180}, to: {x: 315, y: 180}, width: 16} : null;
  return {index, rock: {x: 20, y: 40, width: 320, height: 190}, layerYs: [75, 135, 205], upper, lower,
    upperDry: index === 2,
    water: index === 2 ? {from: {x: 45, y: 180}, to: {x: 315, y: 180}, width: 4} : {from: {x: 45, y: 100}, to: {x: 315, y: 100}, width: 4},
    dissolvedSymbols: index > 0 ? [80, 160, 240].map(x => ({x, y: index === 2 ? 180 : 100, radius: 2})) : [],
    actualPassagePlan: false,
  };
}
export function geyserRoles(index: number) {
  view(index);
  return {index, ground: {x: 20, y: 45, width: 320, height: 160},
    heatBand: {x: 45, y: 216, width: 270, height: 12},
    geyserWater: 'M92 45H108V121Q135 134 135 160Q135 190 100 190Q65 190 65 160Q65 134 92 121Z',
    openSpringWater: 'M246 45H294V125Q305 134 305 160Q305 190 270 190Q235 190 235 160Q235 134 246 125Z',
    geyserNeck: {left: 92, right: 108, top: 70, bottom: 115},
    openSpringNeck: {left: 246, right: 294, top: 70, bottom: 115},
    bubbles: index === 2 ? [{x: 100, y: 80, radius: 3}, {x: 100, y: 103, radius: 3}, {x: 100, y: 143, radius: 4}] : [],
    openCirculationArrows: [[{x: 264, y: 147}, {x: 264, y: 67}], [{x: 280, y: 67}, {x: 280, y: 147}]],
    emphasize: {heat: index === 0, water: index === 1, neckAndGas: index === 2},
    eruptionClock: false,
    magmaFlowsInWaterPassages: false,
  };
}
const tidalBed: GeosciencePoint[] = [{x: 20, y: 170}, {x: 80, y: 140}, {x: 140, y: 160}, {x: 200, y: 120}, {x: 260, y: 155}, {x: 340, y: 180}];
export function tidalExposure(index: number) {
  view(index);
  const profile = tidalBed.map((p, n) => ({...p, y: index === 2 && n === 2 ? 140 : index === 2 && n === 3 ? 140 : p.y}));
  const waterY = index === 0 ? 100 : 165;
  return {index, profile, waterY, water: waterOverProfile(profile, waterY), marker: {x: 200, y: profile[3].y},
    previousProfile: index === 2 ? tidalBed.map(p => ({...p})) : [],
    sameBedInFirstTwoViews: true, materialRedistributionExampleOnly: index === 2,
    actualTideOrSafeRoutePrediction: false,
  };
}
