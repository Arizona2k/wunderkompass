import {createHash} from 'node:crypto';
import {calendarDay,berlinDay} from '../../app/news-validation.mjs';
export const NEWS_DOMAINS=['natur-tiere','wissenschaft','weltall','geschichte','geografie','erfindungen','technologie','umwelt','kultur','gesellschaft','sport'];
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const dayAge=(day,now)=>(Date.parse(berlinDay(now))-Date.parse(day))/86400000;
/** Claims were already verified by their source-specific generator. Rotation
 * never upgrades an unverified, unsafe, old or unlicensed story to fill a slot.
 */
export function selectTopics(candidates,{history=[],previous=[],now=new Date(),maxItems=3,windowDays=14,subjectCooldownDays=7}={}){
 if(!Number.isInteger(maxItems)||maxItems<1||maxItems>3)throw Error('Ungültiges Ausgabeziel');
 const recent=history.filter(h=>calendarDay(h.day)&&dayAge(h.day,now)>=0&&dayAge(h.day,now)<windowDays),selected=[],held=[],seen=new Set();
 const domainCount=domain=>recent.reduce((n,h)=>n+h.items.filter(i=>i.domain===domain).length,0);
 const weekCount=domain=>recent.filter(h=>dayAge(h.day,now)<7).reduce((n,h)=>n+h.items.filter(i=>i.domain===domain).length,0);
 const priorMeanings=new Set([...previous.map(entry=>entry.generation?.meaningKey),...recent.flatMap(h=>h.items.map(i=>i.meaningKey))].filter(Boolean));
 const priorEvents=new Set([...previous.map(entry=>entry.generation?.eventKey),...recent.flatMap(h=>h.items.map(i=>i.eventKey))].filter(Boolean));
 const ranked=[],availableDomains=new Set();
 for(const candidate of candidates){
  const {entry,domain,subjectKey,eventKey,family,verified,rightsConfirmed,risk,priority=0,priorityEvidence=false}=candidate;
  let reason=null;
  const meaningKey=candidate.meaningKey??hash(entry.claims.filter(c=>!['observation-day','release-date'].includes(c.key)).map(c=>[c.key,c.value]).sort());
  if(!verified||!rightsConfirmed||risk!=='routine')reason='Quellen-/Sicherheitsprüfung fehlt';
  else if(!NEWS_DOMAINS.includes(domain)||!subjectKey||!eventKey||!family)reason='Themenzuordnung fehlt';
  else if(!calendarDay(entry.sourcePublishedOn)||dayAge(entry.sourcePublishedOn,now)<0||dayAge(entry.sourcePublishedOn,now)>14)reason='Keine aktuelle belegte Meldung';
  if(!reason){availableDomains.add(domain);if(seen.has(eventKey)||priorEvents.has(eventKey)||priorMeanings.has(meaningKey)||ranked.some(c=>c.meaningKey===meaningKey))reason='Inhaltliche Doppelmeldung';}
  const important=Number.isFinite(priority)&&priority>=80&&priority<=100&&priorityEvidence===true;
  // Only a repetitive observation series has a hard cooldown. Independent
  // verified events compete by diversity score, never by a domain quota.
  if(!reason&&candidate.recurring===true&&!important&&recent.some(h=>dayAge(h.day,now)<subjectCooldownDays&&h.items.some(i=>i.subjectKey===subjectKey)))reason='Beobachtungsserie kürzlich behandelt';
  if(reason){held.push({id:entry.id,reason});continue;}
  const subjectCount=recent.reduce((n,h)=>n+h.items.filter(i=>i.subjectKey===subjectKey).length,0);
  const familyCount=recent.filter(h=>dayAge(h.day,now)<7).reduce((n,h)=>n+h.items.filter(i=>i.family===family).length,0);
  seen.add(eventKey);ranked.push({...candidate,meaningKey,important,score:(important?1000+priority:0)+Math.max(0,14-dayAge(entry.sourcePublishedOn,now))*2-domainCount(domain)*12-weekCount(domain)*8-familyCount*6-subjectCount*10});
 }
 while(selected.length<maxItems&&ranked.length){
  ranked.sort((a,b)=>{const penalty=c=>selected.filter(s=>s.domain===c.domain).length*100+selected.filter(s=>s.family===c.family).length*35;return (b.score-penalty(b))-(a.score-penalty(a))||a.entry.id.localeCompare(b.entry.id);});
  selected.push(ranked.shift());
 }
 held.push(...ranked.map(c=>({id:c.entry.id,reason:'Ausgabeziel erreicht'})));
 const day=berlinDay(now),items=selected.map(c=>({id:c.entry.id,domain:c.domain,subjectKey:c.subjectKey,eventKey:c.eventKey,meaningKey:c.meaningKey,family:c.family}));
 const nextHistory=[...recent.filter(h=>h.day!==day),{day,items}].sort((a,b)=>a.day.localeCompare(b.day)).slice(-14);
 return {selected,held,history:nextHistory,availableDomains:[...availableDomains]};
}
