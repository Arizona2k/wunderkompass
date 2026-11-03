// Selected conceptual views for four already retained Nature entries.
// No measured process rates, true cross sections or future-event predictions.
import {waterOverProfile as submergedProfile} from './nature-water-profile.mjs';
export type LandscapePoint={x:number;y:number};
export const NATURE_GEOLOGY_FIGURES=['hoodoos-weathering-and-transport','sandstone-fin-opening-arch','caldera-basin-and-water-balance','dissolved-gypsum-crystals-and-grains'] as const;
export type NatureGeologyFigureKind=typeof NATURE_GEOLOGY_FIGURES[number];
export type GeologyArrow={name:string;from:LandscapePoint;to:LandscapePoint};
function selection(index:number){if(!Number.isInteger(index)||index<0||index>2)throw new RangeError('Unknown geology view');}
export function hoodooWeathering(index:number){
 selection(index);const fragmentShift=index===2?105:0;
 return{index,crackWidth:index===0?12:28,waterInCrack:index===0,iceContribution:index===1,fragments:index===0?[]:[{x:172+fragmentShift,y:214},{x:190+fragmentShift,y:220},{x:206+fragmentShift,y:209}],transport:index===2?{name:'Abtransport',from:{x:210,y:239},to:{x:325,y:239}}:null,actualFrostForce:null,actualRate:null,completeFormationTimeline:false};
}
export function sandstoneOpening(index:number){
 selection(index);
 return{index,rockBoundary:'M65 220V55H335V220Z',opening:index===2?'M130 220V154Q130 102 200 102Q270 102 270 154V220Z':null,waterPath:index===1?'M201 58L194 93L203 125L193 165':null,cracks:index<2?['M195 55L188 90L200 125L190 165L196 215']:[],actualArch:null,collapseDate:null,allCracksBecomeArches:false,masonry:false};
}
const calderaProfile:readonly LandscapePoint[]=[{x:20,y:45},{x:70,y:65},{x:105,y:135},{x:145,y:205},{x:255,y:205},{x:295,y:135},{x:330,y:65},{x:380,y:45}];
export function calderaWaterPaths(index:number){
 selection(index);const inputs:GeologyArrow[]=[{name:'Regen',from:{x:180,y:35},to:{x:180,y:155}},{name:'Schmelzwasser',from:{x:75,y:50},to:{x:150,y:170}}];
 const outputs:GeologyArrow[]=[{name:'Verdunstung',from:{x:245,y:160},to:{x:245,y:60}},{name:'Versickerung',from:{x:205,y:190},to:{x:205,y:245}}];
 return{index,profile:calderaProfile.map(p=>({...p})),surfaceY:index===0?null:130,water:index===0?[]:submergedProfile(calderaProfile,130),inputs:index===0?[]:inputs,outputs:index===2?outputs:[],volumetricBalanceCalculated:false,equalFluxes:false,constantLakeLevelProved:false,realBasinDepth:null,eruptionSimulated:false};
}
export function gypsumStates(index:number){
 selection(index);
 return{index,waterVisible:index===0,soluteSymbols:index===0?[{x:125,y:145},{x:190,y:170},{x:255,y:150}]:[],crystals:index===0?[]:[[{x:80,y:208},{x:100,y:125},{x:115,y:208}],[{x:115,y:208},{x:145,y:150},{x:158,y:208}]],grains:index===2?[{x:270,y:178},{x:300,y:170},{x:330,y:184}]:[],wind:index===2?{name:'Wind',from:{x:210,y:85},to:{x:355,y:85}}:null,evaporation:index===1?{name:'Verdunstung',from:{x:240,y:145},to:{x:240,y:65}}:null,actualConcentration:null,actualSizes:null,actualTime:null,waterTurnsIntoMineral:false,colorIdentifiesMineral:false,allSandIsGypsum:false};
}
