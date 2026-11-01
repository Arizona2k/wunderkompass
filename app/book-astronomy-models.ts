// Own controlled astronomy model values and explicit limits.
export type AstronomyFigureKind='asteroid-locations'|'comet-material-directions'|'transit-projection'|'galaxy-membership'|'lightyear-distance-unit';
function choice(index:number,count:number){if(!Number.isInteger(index)||index<0||index>=count)throw Error('Known whole example index required');return index;}
export const asteroidExamples=['Im Hauptgürtel','Weiter innen','Auf einer Planetenbahn']as const;
export function asteroidLocation(index:number){
 const selected=choice(index,3),radius=[80,40,105][selected],angle=-Math.PI/3;
 return{selected,label:asteroidExamples[selected],sun:{x:200,y:120},marsRadius:60,jupiterRadius:105,beltInnerRadius:76,beltOuterRadius:84,radius,point:{x:200+radius*Math.cos(angle),y:120+radius*Math.sin(angle)},relation:['between-mars-and-jupiter','inside-mars','on-jupiter-orbit'][selected],realOrbitCalculated:false,realObjectCount:null};
}
export const cometExamples=['Rechts von der Sonne','Schräg oberhalb','Schräg unterhalb']as const;
export function cometDirections(index:number){
 const selected=choice(index,3),sun={x:120,y:130},[x,y]=[[230,130],[190,85],[190,170]][selected],dx=x-sun.x,dy=y-sun.y,distance=Math.hypot(dx,dy),away={x:dx/distance,y:dy/distance},tip={x:x+away.x*80,y:y+away.y*80};
 return{selected,label:cometExamples[selected],sun,nucleus:{x,y},away,tip,movement:{x:0,y:-55},nucleusRadius:7,comaRadius:17,realTailShapeCalculated:false,realOrbitCalculated:false};
}
export const transitExamples=['Mittig davor','Seitlich davor','Daneben']as const;
export function projectedTransit(index:number){
 const selected=choice(index,3),starRadius=70,planetRadius=7,offset=[0,45,90][selected],fullyInside=offset+planetRadius<=starRadius,separate=offset>=starRadius+planetRadius;
 if(!fullyInside&&!separate)throw Error('This limited diagram has no partial-overlap case');
 const blockedFraction=fullyInside?(planetRadius*planetRadius)/(starRadius*starRadius):0;
 return{selected,label:transitExamples[selected],star:{x:200,y:95,radius:starRadius},foregroundPlanet:{x:200,y:95+offset,radius:planetRadius},fullyInside,separate,blockedFraction,remainingFraction:1-blockedFraction,uniformStellarBrightness:true,realStellarMeasurement:false,planetConfirmed:false};
}
export const membershipLevels=[{name:'Erde',kind:'Planet',memberOf:'Sonnensystem'},{name:'Sonnensystem',kind:'Planetensystem',memberOf:'Milchstraße'},{name:'Milchstraße',kind:'Galaxie',memberOf:null}]as const;
export function galaxyMembership(index:number){const selected=choice(index,3);return{selected,...membershipLevels[selected],allLevels:membershipLevels,actualScale:null,actualStarCount:null};}
export const lightyearCases=[1,2,4]as const;
export function lightyearDistance(index:number){
 const selected=choice(index,3),years=lightyearCases[selected],secondsPerJulianYear=BigInt('31557600'),c=BigInt('299792458'),metresPerLightyear=c*secondsPerJulianYear,metres=metresPerLightyear*BigInt(years),kilometresWhole=metres/BigInt('1000'),remainder=metres%BigInt('1000');
 const fraction=remainder.toString().padStart(3,'0').replace(/0+$/,'');
 const hundredthsOfBillionKm=(metres+BigInt('5000000000000'))/BigInt('10000000000000');
 return{selected,years,lightyears:years,secondsPerJulianYear:secondsPerJulianYear.toString(),lightSpeedMetresPerSecond:c.toString(),metresPerLightyear:metresPerLightyear.toString(),metres:metres.toString(),kilometresDecimal:kilometresWhole.toString()+(fraction?'.'+fraction:''),approximatelyGermanBillionKm:(hundredthsOfBillionKm/BigInt('100')).toString()+','+(hundredthsOfBillionKm%BigInt('100')).toString().padStart(2,'0'),barFraction:years/4,vacuum:true,fixedDistanceModel:true,realStarDistanceMeasured:false};
}
