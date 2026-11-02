// Own bounded thought models; no real chemistry procedure or measurement.
export const MIXING_FIGURES=['individual-motion-and-flow','three-illustrative-pigments'] as const;
export type MixingFigureKind=typeof MIXING_FIGURES[number];
function choice<T>(values:readonly T[],index:number):T{if(!Number.isInteger(index)||index<0||index>=values.length)throw new RangeError('Unknown mixing choice');return values[index];}
export function mixingState(kind:MixingFigureKind,index:number){
 if(!MIXING_FIGURES.includes(kind))throw new TypeError('Unknown mixing figure');
 if(kind==='individual-motion-and-flow'){
  const mode=choice(['individual','flow','both'] as const,index),relative=[[-20,0],[20,0],[0,-20],[0,20],[-15,-15],[15,15],[-15,15],[15,-15]],flow={x:mode==='individual'?0:40,y:0};
  const particles=relative.map(([x,y],n)=>{const start={x:70+n%4*80,y:80+Math.floor(n/4)*90},individual={x:mode==='flow'?0:x,y:mode==='flow'?0:y};return{start,individual,flow:{...flow},end:{x:start.x+individual.x+flow.x,y:start.y+individual.y+flow.y}};});
  return{kind:'individual-motion-and-flow' as const,index,mode,particles,particleCount:8,purposefullyBalancedIllustrativePattern:true,randomSample:false,diffusionConstantCalculated:false,physicalTime:null,actualMeasuredSpeeds:false};
 }
 const frontY=choice([210,130,50] as const,index),baselineY=210,fractions=[.25,.5,.75];
 return{kind:'three-illustrative-pigments' as const,index,baselineY,frontY,frontTravel:baselineY-frontY,showSingleMixture:index===0,components:fractions.map((fraction,n)=>({label:['A','B','C'][n],shape:['circle','square','triangle'][n],fractionOfIllustratedFront:fraction,x:200,y:baselineY-(baselineY-frontY)*fraction,travel:(baselineY-frontY)*fraction})),actualInkAnalyzed:false,actualChemicalIdentitiesKnown:false,actualTimes:null,realChromatogram:false,numberOfComponentsGeneralizedToAllBlackInks:false};
}
