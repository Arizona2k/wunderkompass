export const ECOLOGY_FIGURES=['generation-frequency','microstructure-examples','ecosystem-relationships','decomposition-transfer','carbon-labelled-paths','rain-count-versus-amount'] as const;
export type EcologyFigureKind=typeof ECOLOGY_FIGURES[number];
function choice<T>(rows:readonly T[],index:number):T{if(!Number.isInteger(index)||index<0||index>=rows.length)throw new RangeError('Unknown model choice');return rows[index];}
export function ecologyState(kind:EcologyFigureKind,index:number){
 if(!ECOLOGY_FIGURES.includes(kind))throw new TypeError('Unknown ecology model');
 if(kind==='generation-frequency'){
  const marked=choice([2,4,3] as const,index),total=8;
  return{kind:'generation-frequency' as const,index,generation:index+1,marked,total,percentage:marked/total*100,causeKnown:false,individualIdentityAcrossGenerations:false,individuals:Array.from({length:total},(_,n)=>({marked:n<marked,x:70+(n%4)*80,y:60+Math.floor(n/4)*75}))};
 }
 if(kind==='microstructure-examples'){
  const show=choice([['bacterium'],['septate-fungus'],['bacterium','septate-fungus']] as const,index);
  return{kind:'microstructure-examples' as const,index,show,cellCounts:{bacterium:1,'septate-fungus':6},trueSizeComparison:false,realMicrograph:false,speciesIdentification:false};
 }
 if(kind==='ecosystem-relationships'){
  const stage=choice(['living-only','environment','relationships'] as const,index),living=['plant','animal','fungus'] as const,nonliving=['light','water','soil'] as const;
  const nodes:ReadonlyArray<typeof living[number]|typeof nonliving[number]|'dead-material'>=stage==='living-only'?living:stage==='environment'?[...living,...nonliving]:[...living,...nonliving,'dead-material'];
  const edges=stage==='relationships'?[{from:'light',to:'plant',process:'Fotosynthese'},{from:'plant',to:'animal',process:'Nahrung'},{from:'dead-material',to:'fungus',process:'Abbau'}] as const:[];
  return{kind:'ecosystem-relationships' as const,index,stage,living,nonliving,nodes,edges,completeEcosystem:false};
 }
 if(kind==='decomposition-transfer'){
  const remaining=choice([12,8,5] as const,index),total=12,transferred=total-remaining;
  return{kind:'decomposition-transfer' as const,index,total,remaining,transferred,conserved:remaining+transferred===total,realAtomCounts:false,elapsedDays:null,realMassMeasurement:false};
 }
 if(kind==='carbon-labelled-paths'){
  const selected=choice([{from:'air',to:'plant',process:'Fotosynthese'},{from:'plant',to:'air',process:'Zellatmung'},{from:'dead-material',to:'air',process:'Zersetzung'}] as const,index);
  return{kind:'carbon-labelled-paths' as const,index,...selected,nodes:['air','plant','dead-material'] as const,massRate:null,reservoirAmounts:null,completeCycle:false};
 }
 const mode=choice(['A','B','both'] as const,index),a=[10,0,10,0],b=[1,0,1,0];
 const series=(id:string,amounts:number[])=>({id,amounts,totalMillimeters:amounts.reduce((sum,v)=>sum+v,0),wetDays:amounts.filter(v=>v>0).length,days:amounts.length});
 return{kind:'rain-count-versus-amount' as const,index,mode,series:mode==='A'?[series('A',a)]:mode==='B'?[series('B',b)]:[series('A',a),series('B',b)],realObservations:false,localDroughtDiagnosis:false};
}
