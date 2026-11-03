// Own explanatory geometry for the retained Nature topics.
// Own geometry; actual read1Nov source claims and scope remain in the existing dossier.
export const NATURE_WATER_FIGURES=['inland-delta-water-paths','rift-lake-section','connected-water-levels','river-delta-to-sea'] as const;
export type NatureWaterFigureKind=typeof NATURE_WATER_FIGURES[number];
type Point={x:number;y:number};
function selected(index:number){if(!Number.isInteger(index)||index<0||index>2)throw new RangeError('Unknown nature model selection');return index;}
export function segment(from:Point,to:Point,startInset=0,endInset=0){
 const dx=to.x-from.x,dy=to.y-from.y,length=Math.hypot(dx,dy);
 if(![from.x,from.y,to.x,to.y,startInset,endInset].every(Number.isFinite)||startInset<0||endInset<0||length<=startInset+endInset)throw new RangeError('Invalid drawn connection');
 return{from:{x:from.x+dx/length*startInset,y:from.y+dy/length*startInset},to:{x:to.x-dx/length*endInset,y:to.y-dy/length*endInset}};
}
export function inlandDeltaWaterPaths(index:number){
 selected(index);const river={x:40,y:130},wetland={x:215,y:130},air={x:265,y:30},soil={x:265,y:230};
 const branches=index===0?[]:[{x:335,y:70},{x:345,y:130},{x:335,y:190}].map(to=>segment(wetland,to,22,0));
 const transfers=index===2?[{process:'Verdunstung und Pflanzenwasserabgabe',...segment(wetland,air,22,20)},{process:'Weg in den Boden',...segment(wetland,soil,22,20)}]:[];
 return{kind:'inland-delta-water-paths' as const,index,river,wetland,air,soil,inflow:segment(river,wetland,20,22),branches,transfers,seaOutlet:false,realMap:false,measuredFractions:null,timeSimulation:false};
}
export function riftLakeSection(index:number){
 selected(index);const surfaceY=110,leftBank={x:100,y:60},leftBottom={x:150,y:185},rightBottom={x:250,y:155},rightBank={x:330,y:60};
 const leftSurfaceX=leftBank.x+(surfaceY-leftBank.y)/(leftBottom.y-leftBank.y)*(leftBottom.x-leftBank.x);
 const rightSurfaceX=rightBank.x+(surfaceY-rightBank.y)/(rightBottom.y-rightBank.y)*(rightBottom.x-rightBank.x);
 return{kind:'rift-lake-section' as const,index,view:['surface','section','faults'][index],surfaceY,leftBank,leftBottom,rightBottom,rightBank,water:[{x:leftSurfaceX,y:surfaceY},{x:rightSurfaceX,y:surfaceY},rightBottom,leftBottom],faults:index===2?[[leftBank,{x:160,y:230}],[rightBank,{x:245,y:230}]]:[],surfaceOutline:{cx:200,cy:125,rx:45,ry:80},actualDepth:null,actualFaultLocations:false,politicalBoundaries:false,crustMovementCalculated:false};
}
export function connectedWaterLevels(index:number){
 selected(index);const levels=[[4,2],[1,3],[2,2]][index],baselineY=220,pixelsPerStage=36;
 const mekong={heightStage:levels[0],surfaceY:baselineY-levels[0]*pixelsPerStage},lake={heightStage:levels[1],surfaceY:baselineY-levels[1]*pixelsPerStage};
 const direction=levels[0]>levels[1]?'mekong-to-lake':levels[0]<levels[1]?'lake-to-mekong':null;
 const arrow=direction==='mekong-to-lake'?segment({x:150,y:mekong.surfaceY},{x:250,y:lake.surfaceY}):direction==='lake-to-mekong'?segment({x:250,y:lake.surfaceY},{x:150,y:mekong.surfaceY}):null;
 return{kind:'connected-water-levels' as const,index,mekong,lake,baselineY,pixelsPerStage,direction,arrow,actualGaugeMeasurements:false,flowRate:null,calendarPrediction:false,instantRealWorldStopClaim:false};
}
export function riverDeltaToSea(index:number){
 selected(index);const river={x:35,y:130},split={x:155,y:130},sea={x:300,y:25,width:80,height:210};
 const endpoints=index===0?[{x:340,y:130}]:[{x:340,y:55},{x:340,y:130},{x:340,y:205}];
 return{kind:'river-delta-to-sea' as const,index,river,split,sea,inflow:segment(river,split),branches:endpoints.map(to=>segment(split,to)),wetlandPatches:index===2?[{x:170,y:65,width:50,height:30},{x:175,y:170,width:55,height:30}]:[],sedimentMarkers:index===2?Array.from({length:8},(_,n)=>({x:280+n%4*15,y:118+Math.floor(n/4)*20})):[],seaOutlet:true,actualMap:false,actualBranchCount:null,sedimentQuantity:null,allDeltaPartsGrowing:false,currentCoastline:false};
}
