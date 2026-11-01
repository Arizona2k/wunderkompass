// Controlled examples for digital learning; no private inputs or live file hashing.
export type DigitalFigureKind='compare-and-swap'|'binary-choice'|'byte-groups'|'alphabet-shift'|'sum-collision'|'fixed-digest'|'list-and-queue';
export const sortCases=[[9,2],[2,9],[4,4]] as const;
export function comparePair(pair:readonly number[]){if(pair.length!==2||!pair.every(Number.isFinite))throw Error('Two finite values required');const swapped=pair[0]>pair[1];return{before:[...pair],after:swapped?[pair[1],pair[0]]:[...pair],swapped};}
export const signalCases=[{light:true,lightMeans:1},{light:false,lightMeans:1},{light:true,lightMeans:0},{light:false,lightMeans:0}] as const;
export function binarySignal(light:boolean,lightMeans:0|1){if(typeof light!=='boolean'||![0,1].includes(lightMeans))throw Error('Binary signal and explicit interpretation required');return{light,lightMeans,value:light?lightMeans:1-lightMeans};}
export const byteCases=['00000001','00001000','10000000','11111111'] as const;
export function byteGroup(value:string){if(!/^[01]{8}$/.test(value))throw Error('Exactly eight binary places required');const bits=[...value].map(Number),weights=[128,64,32,16,8,4,2,1];return{bits,weights,count:8,value:bits.reduce((sum,b,i)=>sum+b*weights[i],0)};}
export const shiftCases=[1,2,25] as const;
export function shiftUppercase(text:string,amount:number){if(!/^[A-Z]*$/.test(text)||!Number.isInteger(amount))throw Error('Uppercase A-Z and a whole shift required');const shift=((amount%26)+26)%26;return[...text].map(c=>String.fromCharCode(65+(c.charCodeAt(0)-65+shift)%26)).join('');}
export const sumCases=[[1,2],[0,3],[1,3]] as const;
export function toySum(pair:readonly number[]){if(pair.length!==2||!pair.every(n=>Number.isInteger(n)&&n>=0&&n<=9))throw Error('Two single nonnegative digits required');return{values:[...pair],sum:pair[0]+pair[1]};}
export const arrivals=['Fuchs','Reh','Amsel'] as const;
export const accessModes=['queue','stack','alphabet-list'] as const;
export type AccessMode=typeof accessModes[number];
export function accessCards(mode:AccessMode,taken=0){if(!accessModes.includes(mode)||!Number.isInteger(taken)||taken<0||taken>arrivals.length)throw Error('Known access rule and whole removal count0..3 required');const order=mode==='stack'?[...arrivals].reverse():mode==='alphabet-list'?[...arrivals].sort((a,b)=>a.localeCompare(b,'de')):[...arrivals];return{mode,arrival:[...arrivals],removed:order.slice(0,taken),remaining:order.slice(taken),next:order[taken]??null,computerRuntimeMeasured:false};}
// Actual precomputed SHA-256 examples; no claim that the UI computes live hashes.
export const shaExamples=[{"input":"HUT","bytes":[72,85,84],"hex":"8e46c8570a874c62c1c1e70c6d7f7acde69b6787a351a61839219b7f48f908a3"},{"input":"HUU","bytes":[72,85,85],"hex":"7f8a17fd57abebf0299cd7c8bfebde9641b02bbd7e4ac699af678329eb18a25c"},{"input":"","bytes":[],"hex":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}] as const;
export function digestBits(hex:string){if(!/^[0-9a-f]{64}$/.test(hex))throw Error('A complete SHA-256 hexadecimal example is required');return[...hex].flatMap(c=>[...parseInt(c,16).toString(2).padStart(4,'0')].map(Number));}
