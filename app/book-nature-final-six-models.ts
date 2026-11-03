// Chosen explanatory geometry, never surveyed dimensions, rates or quantities.
import {waterOverProfile} from './nature-water-profile.mjs';
export type NatureFinalPoint = {x: number; y: number};
export const NATURE_FINAL_SIX_FIGURES = ['closed-basin-water-evaporation-salt-residue', 'lake-water-paths-inflow-outlet-evaporation', 'river-fall-retreat-and-left-behind-gorge', 'branching-waterfall-cascades-island-spray', 'limestone-hollow-lower-sea-and-later-flooding', 'deeper-water-upwelling-nutrients-sunlit-layer'] as const;
export type NatureFinalSixFigureKind = typeof NATURE_FINAL_SIX_FIGURES[number];
function view(index: number) {if (!Number.isInteger(index) || index < 0 || index > 2) throw new RangeError('Unknown final Nature comparison view');}
export function closedSaltBasin(index: number) {
  view(index);
  const profile = [{x: 20, y: 90}, {x: 100, y: 180}, {x: 260, y: 180}, {x: 340, y: 90}];
  const waterY = index === 1 ? null : index === 0 ? 140 : 115;
  return {index, profile, waterY, water: waterY === null ? [] : waterOverProfile(profile, waterY),
    dissolvedSymbols: index === 1 ? [] : [140, 180, 220].map(x => ({x, y: 160})),
    solidSymbols: index === 1 ? [140, 180, 220].map(x => ({x, y: 176})) : [],
    incoming: index === 0 ? [{x: 35, y: 45}, {x: 90, y: 105}] : [],
    vapor: index === 1 ? [{x: 180, y: 140}, {x: 180, y: 45}] : [],
  };
}
export function lakeWaterRoutes(index: number) {
  view(index);
  return {index, lake: {cx: 180, cy: 130, rx: 90, ry: 64},
    inflows: [[{x: 45, y: 50}, {x: 110, y: 100}], [{x: 180, y: 25}, {x: 180, y: 70}], [{x: 315, y: 50}, {x: 250, y: 100}]],
    outlet: [{x: 180, y: 194}, {x: 180, y: 230}],
    vapor: [[{x: 150, y: 115}, {x: 150, y: 40}], [{x: 210, y: 115}, {x: 210, y: 40}]],
    emphasize: ['inflows', 'outlet', 'vapor'][index],
  };
}
export function retreatingFall(index: number) {
  view(index);
  const edgeX = index === 0 ? 250 : 120;
  const profile = [{x: 20, y: 100}, {x: edgeX, y: 100}, {x: edgeX, y: 195}, {x: 340, y: 195}];
  return {index, edgeX, profile, formerEdgeX: index === 2 ? 250 : null,
    water: [[{x: 20, y: 88}, {x: edgeX, y: 88}, {x: edgeX + 7, y: 100}, {x: edgeX + 7, y: 182}, {x: 340, y: 182}, {x: 340, y: 195}, {x: edgeX, y: 195}, {x: edgeX, y: 100}, {x: 20, y: 100}]],
    flowArrows: [[{x: 35, y: 80}, {x: 95, y: 80}], [{x: edgeX + 4, y: 120}, {x: edgeX + 4, y: 165}], [{x: 275, y: 185}, {x: 325, y: 185}]],
    retreatArrow: index === 2 ? [{x: 245, y: 45}, {x: 125, y: 45}] : [],
    remainingGorge: {left: edgeX, right: 340},
  };
}
export function islandCascades(index: number) {
  view(index);
  return {index, water: {x: 25, y: 30, width: 310, height: 185}, island: {cx: 180, cy: 100, rx: 45, ry: 50},
    routes: [[{x: 115, y: 42}, {x: 95, y: 100}, {x: 110, y: 195}], [{x: 245, y: 42}, {x: 265, y: 100}, {x: 250, y: 195}]],
    falls: [[{x: 75, y: 165}, {x: 135, y: 165}], [{x: 225, y: 165}, {x: 285, y: 165}]],
    spray: index === 2 ? [{x: 125, y: 150, r: 31}, {x: 235, y: 150, r: 31}] : [],
    emphasize: index === 0 ? 'routes' : index === 1 ? 'falls' : 'spray',
  };
}
export function hollowAndFlood(index: number) {
  view(index);
  const profile = [{x: 20, y: 105}, {x: 120, y: 105}, {x: 130, y: 200}, {x: 230, y: 200}, {x: 240, y: 105}, {x: 340, y: 105}];
  return {index, panels: (index === 2 ? [false, true] : [index === 1]).map(flooded => ({flooded, profile: profile.map(p => ({...p})), water: flooded ? waterOverProfile(profile, 75) : [], waterY: flooded ? 75 : null})),
    lowerSeaOutsideDrawing: true,
  };
}
export function nutrientUpwelling(index: number) {
  view(index);
  return {index, water: {x: 20, y: 40, width: 320, height: 175}, sunlit: {x: 20, y: 40, width: 320, height: 60},
    route: index > 0 ? [{x: 80, y: 180}, {x: 145, y: 180}, {x: 220, y: 80}] : [],
    nutrients: index === 2 ? [{x: 212, y: 80}, {x: 238, y: 80}] : [{x: 70, y: 180}, {x: 95, y: 180}],
    lightRays: index === 2 ? [110, 180, 250].map(x => [{x, y: 10}, {x, y: 32}]) : [],
    numericalQuantity: false,
  };
}
