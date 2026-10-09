export function isRecord(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==='object'&&!Array.isArray(v);}
export function compatible(value:unknown,sample:unknown,depth=0):boolean{
 if(depth>15)return false;
 if(sample===null)return value===null||['string','boolean','number'].includes(typeof value);
 if(Array.isArray(sample)){
  if(!Array.isArray(value)||value.length>10000)return false;
  if(!sample.length)return value.every(v=>typeof v==='string'||(typeof v==='number'&&Number.isFinite(v)));
  const tuple=new Set(sample.map(v=>typeof v)).size>1;
  return tuple?value.length===sample.length&&value.every((v,i)=>compatible(v,sample[i],depth+1)):value.length>0&&value.every(v=>compatible(v,sample[0],depth+1));
 }
 if(isRecord(sample))return isRecord(value)&&Object.keys(sample).every(k=>compatible(value[k],sample[k],depth+1));
 return typeof value===typeof sample&&(typeof value!=='number'||Number.isFinite(value));
}
export type SavedQuestion={q:string;choices:string[];correct:string;why:string;iso?:string;photo?:string;countryIso?:string};
export function restoreQuestions(value:unknown,fallback:SavedQuestion[]):SavedQuestion[]{
 if(!Array.isArray(value)||!value.length||value.length>100)return fallback;
 const out:SavedQuestion[]=[];
 for(const v of value){
  if(!isRecord(v)||typeof v.q!=='string'||typeof v.correct!=='string'||typeof v.why!=='string'||!Array.isArray(v.choices)||v.choices.length<2||v.choices.length>8||!v.choices.every(x=>typeof x==='string')||!v.choices.includes(v.correct)||new Set(v.choices).size!==v.choices.length)return fallback;
  const countryIso=typeof v.countryIso==='string'?v.countryIso:isRecord(v.country)&&isRecord(v.country.properties)&&typeof v.country.properties.iso==='string'?v.country.properties.iso:undefined;
  if(fallback.some(q=>q.countryIso)&&(!countryIso||!fallback.some(q=>q.countryIso===countryIso)||!/^[A-Z]{2}$/.test(countryIso))){
   // The fallback is random, so validate against the full stable country set instead.
   if(!countryIso||!/^[A-Z]{2}$/.test(countryIso))return fallback;
  }
  out.push({q:v.q,correct:v.correct,why:v.why,choices:v.choices as string[],...(typeof v.iso==='string'?{iso:v.iso}:{}),...(typeof v.photo==='string'?{photo:v.photo}:{}),...(countryIso?{countryIso}: {})});
 }
 return out;
}
export function sanitizeMemorySession(raw:Record<string,unknown>):{snapshot:Record<string,unknown>;recovered:boolean}{
 if(raw.cards===undefined)return {snapshot:raw,recovered:false};
 const cards=raw.cards;
 if(!Array.isArray(cards)||cards.length!==12||!cards.every(c=>isRecord(c)&&Number.isInteger(c.id)&&Number.isInteger(c.pair)&&Number(c.id)>=0&&Number(c.id)<12&&Number(c.pair)>=0&&Number(c.pair)<6&&(typeof c.label==='string'||typeof c.text==='string'))||new Set(cards.map(c=>c.id)).size!==12||Array.from({length:6},(_,i)=>cards.filter(c=>c.pair===i).length).some(n=>n!==2))return {snapshot:{},recovered:true};
 const allowed=new Set(cards.map(c=>c.id));
 const clean=(v:unknown,max:number,ids:Set<number>)=>Array.isArray(v)?[...new Set(v.filter((n):n is number=>typeof n==='number'&&Number.isInteger(n)&&ids.has(n)))].slice(0,max):[];
 const snapshot={...raw,open:clean(raw.open,2,allowed)};
 const pairs=new Set(cards.map(c=>c.pair));
 for(const field of ['matched','found'])if(field in raw)(snapshot as Record<string,unknown>)[field]=clean(raw[field],6,pairs);
 return {snapshot,recovered:JSON.stringify(snapshot)!==JSON.stringify(raw)};
}
