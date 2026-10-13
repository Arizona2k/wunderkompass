function finite(value,min,max){if(!Number.isFinite(value)||value<min||value>max)throw Error('Outside teaching model');return value;}
export function pressure(force,area){return finite(force,0,1000)/finite(area,.01,1000);}
export function balancingForce(load,loadArm,effortArm){return finite(load,0,1000)*finite(loadArm,.01,100)/finite(effortArm,.01,100);}
export function buoyancy(volumeLitres,massKg){finite(volumeLitres,.01,1000);finite(massKg,.01,1000);return {maximumNewtons:volumeLitres*9.81,weightNewtons:massKg*9.81,floats:volumeLitres>=massKg,submergedFraction:Math.min(1,massKg/volumeLitres)};}
export function pendulumPeriod(length){return 2*Math.PI*Math.sqrt(finite(length,.01,100)/9.81);}
export function resonanceGain(frequency){const ratio=finite(frequency,.1,3);return 1/Math.sqrt((1-ratio*ratio)**2+(.3*ratio)**2);}
export function checksum(values){if(!Array.isArray(values)||values.length>30)throw Error('Invalid checksum exercise');return values.reduce((n,v)=>n+finite(v,0,9),0);}
export function shiftWord(word,shift){finite(shift,0,25);if(!Number.isInteger(shift)||!/^[A-Z ]{0,30}$/.test(word))throw Error('Alphabet exercise only');return [...word].map(c=>c===' '?c:String.fromCharCode(65+(c.charCodeAt(0)-65+shift)%26)).join('');}
export function angleEndpoint(degrees,length=85){finite(degrees,0,180);finite(length,1,100);return {x:110+length*Math.cos(degrees*Math.PI/180),y:125-length*Math.sin(degrees*Math.PI/180)};}
export function triangleParts(depth,x=20,y=150,size=180){finite(depth,0,4);if(!Number.isInteger(depth))throw Error('Whole steps required');if(depth===0)return [[x,y,x+size/2,y-size*Math.sqrt(3)/2,x+size,y]];const half=size/2;return [...triangleParts(depth-1,x,y,half),...triangleParts(depth-1,x+half,y,half),...triangleParts(depth-1,x+half/2,y-half*Math.sqrt(3)/2,half)];}
export function diceSeries(count,random=Math.random){finite(count,1,120);if(!Number.isInteger(count))throw Error('Whole throws required');return Array.from({length:count},()=>{const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw Error('Invalid random draw');return 1+Math.floor(r*6);});}
