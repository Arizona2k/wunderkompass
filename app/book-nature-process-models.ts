// Original conceptual process geometry. No surveyed profiles, dates, rates or forecasts.
export const NATURE_PROCESS_FIGURES = ['river-valley-and-later-glacial-widening', 'raised-lake-shore-and-relative-level', 'lava-surface-crust-draining-tube', 'spring-water-mineral-transport-and-terrace-deposit'] as const;
export type NatureProcessFigureKind = typeof NATURE_PROCESS_FIGURES[number];
export type ProcessPoint = {x: number; y: number};
function stage(index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2) throw new RangeError('Unknown process comparison stage');
}
const riverProfile: ProcessPoint[] = [{x: 20, y: 50}, {x: 80, y: 55}, {x: 120, y: 140}, {x: 180, y: 210}, {x: 240, y: 140}, {x: 280, y: 55}, {x: 340, y: 50}];
const glacialProfile: ProcessPoint[] = [{x: 20, y: 50}, {x: 95, y: 55}, {x: 110, y: 100}, {x: 120, y: 160}, {x: 145, y: 205}, {x: 215, y: 205}, {x: 240, y: 160}, {x: 250, y: 100}, {x: 265, y: 55}, {x: 340, y: 50}];
export function valleyProcess(index: number) {
  stage(index);
  return {index, profile: (index === 0 ? riverProfile : glacialProfile).map(p => ({...p})),
    glacier: index === 1 ? [{x: 110, y: 100}, {x: 250, y: 100}, {x: 240, y: 160}, {x: 215, y: 205}, {x: 145, y: 205}, {x: 120, y: 160}] : [],
    carriedClasts: index === 1 ? [{x: 158, y: 200}, {x: 180, y: 200}, {x: 202, y: 200}] : [],
    flowOutOfSection: index === 1 ? {x: 180, y: 130} : null,
    scratchSegments: index === 1 ? [[{x: 153, y: 203}, {x: 166, y: 203}], [{x: 191, y: 203}, {x: 204, y: 203}]] : [],
    sameUnderlyingRock: true,
  };
}
const shoreProfile: ProcessPoint[] = [{x: 20, y: 90}, {x: 125, y: 90}, {x: 125, y: 125}, {x: 180, y: 125}, {x: 230, y: 185}, {x: 340, y: 220}];
export function relativeLakeShore(index: number) {
  stage(index);
  return {index, comparison: index === 2, profile: shoreProfile.map(p => ({...p})),
    currentWater: [{x: 230, y: 185}, {x: 340, y: 185}, {x: 340, y: 220}],
    oldStrand: index > 0 ? [{x: 125, y: 125}, {x: 180, y: 125}] : [],
    formerRelativeWaterLine: index > 0 ? [{x: 180, y: 125}, {x: 340, y: 125}] : [],
    sandstoneLayers: [190, 204, 218], looseMaterial: [{x: 142, y: 120}, {x: 151, y: 120}, {x: 160, y: 120}],
    thoughtComparisons: index === 2 ? [
      {kind: 'lower-water', oldWaterY: 100, waterY: 160, oldLandMarkerY: 100, landMarkerY: 100},
      {kind: 'higher-land', oldWaterY: 160, waterY: 160, oldLandMarkerY: 160, landMarkerY: 100},
    ] as const : [],
  };
}
export function lavaTubeProcess(index: number) {
  stage(index);
  return {index, surfaceSolid: index > 0,
    outerRock: index === 0 ? 'M25 180H335V212H25Z' : 'M25 212V110Q25 82 65 82H295Q335 82 335 110V212Z',
    innerRegion: 'M52 180V128Q52 110 72 110H288Q308 110 308 128V180Z',
    lavaPresent: index < 2,
    flowArrows: index < 2 ? [[{x: 78, y: 149}, {x: 133, y: 149}], [{x: 196, y: 149}, {x: 260, y: 149}]] : [],
    crustBottomY: index > 0 ? 110 : null,
    cavityAfterDrainage: index === 2,
    laterCarbonateDecorationNotModelled: true,
  };
}
const steps: ProcessPoint[] = [{x: 20, y: 95}, {x: 120, y: 95}, {x: 120, y: 135}, {x: 220, y: 135}, {x: 220, y: 175}, {x: 340, y: 175}];
const route: ProcessPoint[] = [{x: 28, y: 85}, {x: 120, y: 85}, {x: 130, y: 95}, {x: 130, y: 125}, {x: 220, y: 125}, {x: 230, y: 135}, {x: 230, y: 165}, {x: 332, y: 165}];
export function mineralTerraces(index: number) {
  stage(index);
  return {index, steps: steps.map(p => ({...p})), waterRoute: route.map(p => ({...p})),
    dissolvedSymbols: index > 0 ? [{x: 50, y: 85}, {x: 85, y: 85}, {x: 130, y: 111}, {x: 167, y: 125}, {x: 200, y: 125}, {x: 230, y: 151}, {x: 270, y: 165}] : [],
    fixedDepositBands: index === 2 ? [[{x: 80, y: 92}, {x: 118, y: 92}], [{x: 185, y: 132}, {x: 218, y: 132}], [{x: 285, y: 172}, {x: 332, y: 172}]] : [],
    continuingWaterEnd: {x: 332, y: 165},
  };
}
