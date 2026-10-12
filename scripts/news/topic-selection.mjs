import {createHash} from 'node:crypto';
import {calendarDay,berlinDay} from '../../app/news-validation.mjs';
export const NEWS_DOMAINS=['natur-tiere','wissenschaft','weltall','geschichte','geografie','erfindungen','technologie','umwelt','kultur','gesellschaft','sport'];
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const dayAge=(day,now)=>(Date.parse(berlinDay(now))-Date.parse(day))/86400000;
/** Claims were already verified by their source-specific generator. Rotation
 * never upgrades an unverified, unsafe, old or unlicensed story to fill a slot.
 */
export function selectTopics(candidates,{history=[],previous=[],now=new Date(),maxItems=3,windowDays=14,subjectCooldownDays=7,maxDomainPerWeek=3}={}){
 if(!Number.isInteger(maxItems)||maxItems<1||maxItems>3)throw Error('Ungültiges Ausgabeziel');
 const recent=history.filter(h=>calendarDay(h.day)&&dayAge(h.day,now)>=0&&dayAge(h.day,now)<windowDays),selected=[],held=[],seen=new Set();
 const domainCount=domain=>recent.reduce((n,h)=>n+h.items.filter(i=>i.domain===domain).length,0);
 const weekCount=domain=>recent.filter(h=>dayAge(h.day,now)<7).reduce((n,h)=>n+h.items.filter(i=>i.domain===domain).length,0);
 const priorMeanings=new Set(previous.map(entry=>entry.generation?.meaningKey).filter(Boolean));
 const ranked=[];
 for(const candidate of candidates){
  const {entry,domain,subjectKey,eventKey,family,verified,rightsConfirmed,risk,priority=0,priorityEvidence=false}=candidate;
  let reason=null;
  const meaningKey=candidate.meaningKey??hash(entry.claims.filter(c=>!['observation-day','release-date'].includes(c.key)).map(c=>[c.key,c.value]).sort());
  if(!verified||!rightsConfirmed||risk!=='routine')reason='Quellen-/Sicherheitsprüfung fehlt';
  else if(!NEWS_DOMAINS.includes(domain)||!subjectKey||!eventKey||!family)reason='Themenzuordnung fehlt';
  else if(!calendarDay(entry.sourcePublishedOn)||dayAge(entry.sourcePublishedOn,now)<0||dayAge(entry.sourcePublishedOn,now)>14)reason='Keine aktuelle belegte Meldung';
  else if(seen.has(eventKey)||priorMeanings.has(meaningKey)||ranked.some(c=>c.meaningKey===meaningKey))reason='Inhaltliche Doppelmeldung';
  const important=Number.isFinite(priority)&&priority>=80&&priority<=100&&priorityEvidence===true;
  if(!reason&&!important&&recent.some(h=>dayAge(h.day,now)<subjectCooldownDays&&h.items.some(i=>i.subjectKey===subjectKey)))reason='Thema kürzlich behandelt';
  if(!reason&&!important&&weekCount(domain)>=maxDomainPerWeek)reason='Themengebiet diese Woche ausreichend vertreten';
  if(!reason&&!important&&recent.filter(h=>dayAge(h.day,now)<7).reduce((n,h)=>n+h.items.filter(i=>i.family===family).length,0)>=3)reason='Ähnliche Meldungsart kürzlich mehrfach vertreten';
  if(reason){held.push({id:entry.id,reason});continue;}
  seen.add(eventKey);ranked.push({...candidate,meaningKey,important,score:(important?1000+priority:0)+Math.max(0,14-dayAge(entry.sourcePublishedOn,now))*2-domainCount(domain)*12});
 }
 while(selected.length<maxItems&&ranked.length){
  ranked.sort((a,b)=>{const penalty=c=>selected.filter(s=>s.domain===c.domain).length*100+selected.filter(s=>s.family===c.family).length*35;return (b.score-penalty(b))-(a.score-penalty(a))||a.entry.id.localeCompare(b.entry.id);});
  const next=ranked.shift();const sameDomain=selected.filter(s=>s.domain===next.domain).length;
  if(!next.important&&(sameDomain>=2||weekCount(next.domain)+sameDomain>=maxDomainPerWeek)){held.push({id:next.entry.id,reason:'Ausgabe-/Wochenvielfalt hat Vorrang'});continue;}
  selected.push(next);
 }
 held.push(...ranked.map(c=>({id:c.entry.id,reason:'Ausgabeziel erreicht'})));
 const day=berlinDay(now),items=selected.map(c=>({id:c.entry.id,domain:c.domain,subjectKey:c.subjectKey,eventKey:c.eventKey,meaningKey:c.meaningKey,family:c.family}));
 const nextHistory=[...recent.filter(h=>h.day!==day),{day,items}].sort((a,b)=>a.day.localeCompare(b.day)).slice(-14);
 return {selected,held,history:nextHistory,availableDomains:[...new Set(candidates.filter(c=>c.verified&&c.rightsConfirmed&&c.risk==='routine').map(c=>c.domain))]};
}
