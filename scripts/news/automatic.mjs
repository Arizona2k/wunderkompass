import {fetchSource,validateNews,berlinDay,saveDraft} from './engine.mjs';
import {calendarDay} from '../../app/news-validation.mjs';
import {fingerprint} from '../../app/news-wire.mjs';
import {planetURL,planetEvidence,generatePlanet,verifyPlanet} from './exoplanets.mjs';
import {selectTopics} from './topic-selection.mjs';

const assert=(condition,message)=>{if(!condition)throw Error(message);};
const SOURCE='https://epic.gsfc.nasa.gov/api/natural';
const sourceDay=value=>{assert(typeof value==='string'&&/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value),'EPIC-Zeitstempel fehlt');const day=value.slice(0,10);assert(calendarDay(day),'EPIC-Kalendertag ungültig');const [h,m,s]=value.slice(11).split(':').map(Number);assert(h<24&&m<60&&s<60,'EPIC-Uhrzeit ungültig');return day;};
export function epicEvidence(rows,{now,policy}){
 assert(Array.isArray(rows)&&rows.length>0&&rows.length<=64,'EPIC liefert keine begrenzte Bildserie');
 const records=rows.map(row=>{
  const day=sourceDay(row.date);assert(/^\d{14}$/.test(row.identifier)&&/^epic_1b_\d{14}$/.test(row.image),'EPIC-Identität ungültig');
  assert(row.identifier.slice(0,8)===day.replaceAll('-','')&&row.image===`epic_1b_${row.identifier}`,'EPIC-Identität widerspricht dem Datum');
  return {identifier:row.identifier,date:row.date,image:row.image};
 });
 assert(new Set(records.map(r=>r.identifier)).size===records.length,'Doppelte EPIC-Beobachtung');
 assert(new Set(records.map(r=>r.date.slice(0,10))).size===1,'EPIC-Serie enthält mehrere Tage');
 const day=records[0].date.slice(0,10),age=(Date.parse(berlinDay(now)+'T12:00:00Z')-Date.parse(day+'T12:00:00Z'))/86400000;
 assert(age>=0&&age<=policy.maxAgeDays,'EPIC-Serie ist zukünftig oder überaltert');
 return {day,count:records.length,records:records.toSorted((a,b)=>a.identifier.localeCompare(b.identifier))};
}
/** New copy from newly fetched structured observations, never a stored brief.
 * Editorially reviewed rule scope: only date/count/instrument metadata.
 * No captions, weather interpretations, forecasts, safety or health claims.
 */
export function generateEpic(evidence,{now,sourceHashes}){
 const {day,count}=evidence,checkedAt=now.toISOString(),display=day.split('-').reverse().join('.');
 return {
  id:'epic-'+day,title:`Die Erde im Blick: Aufnahmen vom ${display}`,section:'Wissenschaft',
  sourcePublishedOn:day,sourceDateMeaning:'observation',eventOn:day,eventUntil:null,checkedAt,
  summary:`Die NASA-Kamera EPIC hat die Erde am ${display} aufgenommen. Die geprüfte Datenserie enthält ${count} ${count===1?'Aufnahme':'Aufnahmen'}.`,
  explanation:`Eine Kamera im All kann unsere Erde von außen beobachten. EPIC ist ein Instrument auf dem Satelliten DSCOVR. Die neue Erklärung beschreibt die datierte Bildserie; sie ist keine Wettervorhersage.`,
  why:'Beobachtungen aus dem All helfen uns, Fragen über die Erde zu stellen. Zuerst schauen wir, was eine Messung tatsächlich zeigt.',
  background:'Der Datenstand bezeichnet den Tag der Aufnahme. Er ist kein behauptetes Veröffentlichungsdatum. Die Erklärung verwendet keine fremden Bilder und deutet keine einzelnen Wolken oder Orte.',
  question:'Warum sollte man bei einer Beobachtung auch auf das Datum achten?',
  topicId:'invention-satellite',connectionWhy:'Die Satellitenkarte erklärt, wie Instrumente außerhalb der Erde Informationen sammeln.',
  verification:'Datum und Anzahl wurden automatisch mit der datierten NASA-Serie verglichen. NASA ist die einzige Quelle; die beiden Abrufe sind keine unabhängigen Bestätigungen. Es gab keine menschliche Einzelprüfung.',
  editorial:{status:'approved',reviewer:'Automatische Sachregel EPIC v1 · keine menschliche Einzelabnahme',reviewedAt:checkedAt},
  sources:[SOURCE,SOURCE+'/date/'+day].map((url,i)=>({name:i?'NASA EPIC · datierte Vergleichsserie':'NASA EPIC Team · aktuelle Metadaten',organization:'NASA EPIC Team',url,publishedOn:null,checkedAt,role:'primary',access:'reviewed',rights:'Öffentliche EPIC-API; Wiederverwendung mit Quellenangabe gemäß EPIC Image Use Policy. Keine fremden Bilder oder Bildunterschriften.',sha256:sourceHashes[i]})),
  claims:[{key:'observation-day',value:day,sourceIndexes:[0,1]},{key:'observation-count',value:String(count),sourceIndexes:[0,1]}],
  generation:{method:'structured-epic-v1',eventKey:'epic:'+day,ruleVersion:1,evidence,sourceHashes},
 };
}
export function verifyEpic(entry,observed,comparison,{now,policy,topicIds,sourceHashes}){
 const first=epicEvidence(observed,{now,policy}),second=epicEvidence(comparison,{now,policy});
 assert(JSON.stringify(first)===JSON.stringify(second),'EPIC-Quellen widersprechen sich');
 const expected=generateEpic(first,{now,sourceHashes});
 // Verify every generated field, not just occurrence of two keywords.
 assert(JSON.stringify(entry)===JSON.stringify(expected),'Text oder Aussage weicht vom geprüften Sachregelwerk ab');
 validateNews(entry,{policy,now,topicIds});return entry;
}
export async function prepareAutomaticEdition({policy,content,topicIds,directory,now=new Date(),fetchImpl=fetch,wait}){
 const report={schemaVersion:1,runAt:now.toISOString(),day:berlinDay(now),mode:'automatic-preparation',selected:[],retained:[],issues:[],candidates:[],requests:0,method:'structured-epic-v1',externalAIRequests:0};
 const entries=content.entries.map(e=>structuredClone(e)),verifiedCandidates=[];
 const propose=(entry,domain,subjectKey,family)=>{const existing=entries.find(e=>e.id===entry.id);if(existing&&JSON.stringify(existing.claims)===JSON.stringify(entry.claims))report.retained.push(existing.id);else verifiedCandidates.push({entry,domain,subjectKey,eventKey:entry.generation.eventKey,family,verified:true,rightsConfirmed:true,risk:'routine'});};
 const deadline=AbortSignal.timeout(120000);
 const read=async url=>{assert(!deadline.aborted,'Nachrichtenlaufzeit überschritten');assert(++report.requests<=8,'Quellenabrufbudget überschritten');return fetchSource(url,policy,{fetchImpl,json:true,signal:deadline,...(wait?{wait}:{})});};
 const rights=id=>{assert(policy.autonomousGenerationEnabled,'Autonome Erstellung ist deaktiviert');const source=policy.structuredSources?.find(s=>s.id===id);assert(source?.rights?.status==='confirmed'&&calendarDay(source.rights.checkedOn),'Quellenrechte nicht bestätigt');assert(Date.parse(berlinDay(now))-Date.parse(source.rights.checkedOn)<=180*86400000&&source.rights.checkedOn<=berlinDay(now),'Quellenrechteprüfung ist überaltert oder zukünftig');return source;};
 try{
  const source=rights('nasa-epic');
  assert(source.url===SOURCE,'EPIC-API stimmt nicht mit der geprüften Schnittstelle überein');
  const latest=await read(SOURCE),rows=JSON.parse(latest.document),evidence=epicEvidence(rows,{now,policy});
  report.candidates.push({organization:'NASA EPIC Team',location:'Satellit DSCOVR',eventOn:evidence.day,kind:'dated-observation',count:evidence.count});
  const fixed=await read(SOURCE+'/date/'+evidence.day),comparison=JSON.parse(fixed.document),sourceHashes=[latest.sha256,fixed.sha256];
  const entry=verifyEpic(generateEpic(evidence,{now,sourceHashes}),rows,comparison,{now,policy,topicIds,sourceHashes});
  propose(entry,'geografie','epic-earth-observations','earth-observation-series');
 }catch(error){report.issues.push({id:'nasa-epic',reason:error.message});}
 if(policy.structuredSources?.some(s=>s.id==='nasa-exoplanets'))try{
  rights('nasa-exoplanets');const url=planetURL({day:berlinDay(now)}),fetched=await read(url),rows=JSON.parse(fetched.document);
  assert(Array.isArray(rows)&&rows.length<=10,'Unbegrenzte Planetenliste');const seen=new Set();let comparisons=0;
  for(const row of rows){
   if(comparisons>=3)break;
   try{
    const evidence=planetEvidence(row,{now,policy});if(seen.has(evidence.name))continue;seen.add(evidence.name);
    report.candidates.push({organization:'NASA Exoplanet Archive / Caltech',location:evidence.host,eventOn:null,publishedOn:evidence.day,kind:'released-data-set',planet:evidence.name});
    const fixedURL=planetURL({name:evidence.name});comparisons++;const fixed=await read(fixedURL),comparison=JSON.parse(fixed.document);assert(Array.isArray(comparison)&&comparison.length===1,'Gezielter Datensatz fehlt oder ist mehrdeutig');
    const context={now,policy,topicIds,sourceURLs:[url,fixedURL],sourceHashes:[fetched.sha256,fixed.sha256]};
    propose(verifyPlanet(generatePlanet(evidence,context),row,comparison[0],context),'weltall','planet:'+evidence.name,'planet-data-releases');
   }catch(error){report.issues.push({id:String(row.pl_name??'nasa-exoplanets'),reason:error.message});}
  }
 }catch(error){report.issues.push({id:'nasa-exoplanets',reason:error.message});}
 const choice=selectTopics(verifiedCandidates,{history:content.selectionHistory??[],previous:content.entries,now,maxItems:policy.maxItems});
 report.rotation={windowDays:14,subjectCooldownDays:7,availableDomains:choice.availableDomains,held:choice.held};
 for(const candidate of choice.selected){const entry={...candidate.entry,generation:{...candidate.entry.generation,domain:candidate.domain,subjectKey:candidate.subjectKey,meaningKey:candidate.meaningKey,family:candidate.family}};const old=entries.findIndex(e=>e.id===entry.id);if(old>=0)entries.splice(old,1);entries.push(entry);report.selected.push(entry.id);}
 // Archive bounded by the browser contract; each original date remains intact.
 entries.sort((a,b)=>b.sourcePublishedOn.localeCompare(a.sourcePublishedOn)||a.id.localeCompare(b.id));
 const retainedManual=entries.filter(e=>!e.generation),recentAutomatic=entries.filter(e=>e.generation).slice(0,Math.max(0,128-retainedManual.length));
 const publishedEntries=[...retainedManual,...recentAutomatic].sort((a,b)=>b.sourcePublishedOn.localeCompare(a.sourcePublishedOn)||a.id.localeCompare(b.id));
 const payload={schemaVersion:1,checkedAt:publishedEntries.reduce((a,e)=>e.checkedAt>a?e.checkedAt:a,'1970-01-01T00:00:00Z'),automation:'automatic',selectionHistory:choice.history,entries:publishedEntries};
 for(const entry of payload.entries)validateNews(entry,{policy,now,topicIds});
 const result={payload,report,fingerprint:await fingerprint(payload)};
 if(directory)await saveDraft(directory,result);return result;
}
