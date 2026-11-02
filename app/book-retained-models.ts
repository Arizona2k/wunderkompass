// Own bounded models for scientific reasoning, maps and geometry.
export const FINAL_NINE_FIGURES=['testable-collection','contour-levels','reference-versus-terrain','ordered-grid-point','projection-patch-area','nuclear-symbol-comparison','fixed-angle-length','rectangle-reflection','position-example-radius'] as const;
export type FinalNineFigureKind=typeof FINAL_NINE_FIGURES[number];
function choice<T>(values:readonly T[],index:number):T{if(!Number.isInteger(index)||index<0||index>=values.length)throw new RangeError('Unknown model choice');return values[index];}
export function finalNineState(kind:FinalNineFigureKind,index:number){
 if(!FINAL_NINE_FIGURES.includes(kind))throw new TypeError('Unknown retained model');
 if(kind==='testable-collection'){
  const revealed=choice([3,6,8] as const,index),corners=[4,4,4,4,3,4,3,4],counterexamples=corners.slice(0,revealed).filter(n=>n!==4).length;
  return{kind:'testable-collection' as const,index,revealed,total:8,unknown:8-revealed,counterexamples,hypothesisRefuted:counterexamples>0,generalClaimProved:false,observations:corners.map((n,i)=>({corners:i<revealed?n:null,x:70+i%4*80,y:70+Math.floor(i/4)*95})),realExperiment:false};
 }
 if(kind==='contour-levels'){
  const highlighted=choice([[10],[20],[10,20]] as const,index);
  return{kind:'contour-levels' as const,index,highlighted,contours:[{heightMeters:10,cx:200,cy:130,r:100},{heightMeters:20,cx:200,cy:130,r:55}],points:[{name:'A',x:100,y:130,heightMeters:10},{name:'B',x:300,y:130,heightMeters:10},{name:'C',x:255,y:130,heightMeters:20}],sameReference:true,actualMeasuredHeights:false,fictionalTopography:true,inferredTerrainFromOnlyThreePoints:false,realGeographicPlace:false};
 }
 if(kind==='reference-versus-terrain'){
  const selected=choice(['terrain','geoid','ellipsoid'] as const,index);
  return{kind:'reference-versus-terrain' as const,index,selected,paths:{terrain:'M20 105L65 80L100 110L145 55L195 115L240 85L280 120L330 65L380 100',geoid:'M20 175C100 152 125 180 200 170S300 155 380 172',ellipsoid:'M20 180H380'},actualMeasuredHeights:false,trueScale:false,actualGeoidComputed:false,localSmoothReferenceDrawnStraight:true};
 }
 if(kind==='ordered-grid-point'){
  const pair=choice([[2,3],[3,2],[2,2]] as const,index);
  return{kind:'ordered-grid-point' as const,index,pair,order:'first right, then up',origin:{x:65,y:215},step:45,point:{x:65+pair[0]*45,y:215-pair[1]*45},ticks:[0,1,2,3,4],realGeographicCoordinates:false,privateLocationCollected:false};
 }
 if(kind==='projection-patch-area'){
  const latitudeDegrees=choice([0,30,60] as const,index),toRadians=Math.PI/180,low=(latitudeDegrees-5)*toRadians,high=(latitudeDegrees+5)*toRadians,longitudeWidth=20*toRadians,deltaSin=Math.sin(high)-Math.sin(low),deltaMercator=Math.log(Math.tan(Math.PI/4+high/2))-Math.log(Math.tan(Math.PI/4+low/2)),scale=120/longitudeWidth,spherePatchArea=longitudeWidth*deltaSin;
  return{kind:'projection-patch-area' as const,index,latitudeDegrees,latitudeWidthDegrees:10,longitudeWidthDegrees:20,unitSphere:true,spherePatchArea,equalAreaProjectedArea:spherePatchArea,mercatorProjectedArea:longitudeWidth*deltaMercator,equalAreaRelativeArea:1,mercatorRelativeArea:deltaMercator/deltaSin,drawnWidth:120,equalAreaDrawnHeight:scale*deltaSin,mercatorDrawnHeight:scale*deltaMercator,realCountry:false,actualEarthEllipsoid:false,projectionPreservesEverything:false};
 }
 if(kind==='nuclear-symbol-comparison'){
  const mode=choice(['fusion','fission','both'] as const,index);
  return{kind:'nuclear-symbol-comparison' as const,index,mode,showFusion:mode!=='fission',showFission:mode!=='fusion',fusion:{inputNuclearSymbols:2,outputNuclearSymbols:1},fission:{inputNuclearSymbols:1,outputNuclearSymbols:2},completeReactionEquation:false,symbolSizeEncodesNucleonCount:false,energyCalculated:false,realReaction:false};
 }
 if(kind==='fixed-angle-length'){
  const length=choice([60,120,180] as const,index),angleRadians=Math.PI/3,origin={x:100,y:180},unit={x:Math.cos(angleRadians),y:-Math.sin(angleRadians)};
  return{kind:'fixed-angle-length' as const,index,length,angleDegrees:60,origin,baselineEnd:{x:300,y:180},end:{x:origin.x+length*unit.x,y:origin.y+length*unit.y},arcRadius:45,arcEnd:{x:origin.x+45*unit.x,y:origin.y+45*unit.y},actualPhysicalDistance:false};
 }
 if(kind==='rectangle-reflection'){
  const axis=choice(['vertical','horizontal','diagonal'] as const,index),vertices=[{x:-2,y:-1},{x:2,y:-1},{x:2,y:1},{x:-2,y:1}],reflect=(p:{x:number;y:number})=>axis==='vertical'?{x:-p.x,y:p.y}:axis==='horizontal'?{x:p.x,y:-p.y}:{x:(3*p.x+4*p.y)/5,y:(4*p.x-3*p.y)/5};
  return{kind:'rectangle-reflection' as const,index,axis,vertices,reflected:vertices.map(reflect),counterpoint:{before:vertices[1],after:reflect(vertices[1])},mapsWholeRectangleToItself:axis!=='diagonal',diagonalDirection:{x:2,y:1},physicalDrawingPrecisionClaim:false};
 }
 const radiusMeters=choice([1,3,6] as const,index);
 return{kind:'position-example-radius' as const,index,estimatedPoint:{x:200,y:130},radiusMeters,drawnRadius:radiusMeters*15,realGPSMeasurement:false,privateLocationCollected:false,confidenceLevel:null,guaranteedErrorBound:false,satelliteSignalsSimulated:false};
}
