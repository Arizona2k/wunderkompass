// Local presentation state only: no learning data, identifier or visit log.
export const DISCOVERY_IDLE_MS=30*60*1000;
const valid=(id,ids)=>typeof id==='string'&&ids.includes(id);
export function differentDiscovery(ids,previous,random=Math.random){
 if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'||!id))throw Error('Nonempty unique discovery IDs required');
 const choices=ids.length>1?ids.filter(id=>id!==previous):ids;
 const sample=Number(random()),bounded=Number.isFinite(sample)?Math.max(0,Math.min(1-Number.EPSILON,sample)):0;
 return choices[Math.floor(bounded*choices.length)];
}
export function localDiscoveryDay(date=new Date()){
 if(!Number.isFinite(date.getTime()))throw Error('Valid local calendar date required');
 const year=date.getFullYear(),month=date.getMonth(),day=date.getDate();
 return {key:year+'-'+String(month+1).padStart(2,'0')+'-'+String(day).padStart(2,'0'),ordinal:Math.floor(Date.UTC(year,month,day)/86400000)};
}
export function dailyDiscovery(day,stored,fallback,ids){
 if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Array.isArray(ids)||!ids.includes(fallback))throw Error('Local day and published daily fallback required');
 return {day,id:stored?.day===day&&valid(stored.id,ids)?stored.id:fallback};
}
export function discoveryVisit(state,event,{heroes,trails,random=Math.random}){
 if(!Number.isFinite(event.now))throw Error('Finite current time required');
 const previous=state??{};
 const last=Number.isFinite(previous.lastInputAt)?previous.lastInputAt:event.now;
 const due=previous.idleDue===true||event.now-last>=DISCOVERY_IDLE_MS;
 const rotate=event.type==='open'||event.type==='home'&&due;
 const next={heroId:rotate||!valid(previous.heroId,heroes)?differentDiscovery(heroes,rotate?previous.heroId:null,random):previous.heroId,trailId:rotate||!valid(previous.trailId,trails)?differentDiscovery(trails,rotate?previous.trailId:null,random):previous.trailId,lastInputAt:event.now,idleDue:rotate?false:due};
 switch(event.type){
  case 'open':
  case 'activity':
  case 'home':return next;
  case 'reload':
  case 'history':return {...next,heroId:valid(event.selection?.heroId,heroes)?event.selection.heroId:next.heroId,trailId:valid(event.selection?.trailId,trails)?event.selection.trailId:next.trailId};
  case 'hero':return {...next,heroId:valid(event.id,heroes)?event.id:differentDiscovery(heroes,next.heroId,random)};
  case 'trail':return {...next,trailId:valid(event.id,trails)?event.id:next.trailId};
  default:throw Error('Unknown discovery event');
 }
}
