// Synthetic contract examples for negative unit tests, never browser evidence.
import {requiredBuildingEntries} from '../../scripts/handoff.mjs';
export const buildingProofCases=widths=>requiredBuildingEntries.flatMap(t=>widths.map(width=>({id:t.id,width,kind:t.buildingKind??'retained',steps:t.buildingKind?[0,1,2]:[],variants:t.buildingKind==='aqueduct'?[0,1]:['corbel','shells'].includes(t.buildingKind)?[0,1,2]:[],effectsVerified:true})));
