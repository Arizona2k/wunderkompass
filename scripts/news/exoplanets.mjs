import {calendarDay,berlinDay} from '../../app/news-validation.mjs';
import {validateNews} from './engine.mjs';
import {createHash} from 'node:crypto';
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const columns='pl_name,hostname,disc_year,releasedate,soltype,pl_controv_flag,default_flag';
export function planetURL({day,name}={}){
 const query=name?`select top 1 ${columns} from ps where default_flag=1 and pl_controv_flag=0 and soltype='Published Confirmed' and pl_name='${safeName(name)}' order by releasedate desc`:`select top 10 ${columns} from ps where default_flag=1 and pl_controv_flag=0 and soltype='Published Confirmed' and releasedate<='${day}' order by releasedate desc`;
 return 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query='+encodeURIComponent(query)+'&format=json';
}
function safeName(value){assert(typeof value==='string'&&value.length<=50&&/^[A-Za-z0-9][A-Za-z0-9 .+()_-]*$/.test(value),'Unbekannte Planeten-/Sternbezeichnung');return value;}
export function planetEvidence(row,{now,policy}){
 const name=safeName(row.pl_name),host=safeName(row.hostname),day=row.releasedate;
 assert(calendarDay(day),'Öffentliches Freigabedatum fehlt');const age=(Date.parse(berlinDay(now))-Date.parse(day))/86400000;assert(age>=0&&age<=policy.maxAgeDays,'Planeten-Datensatz ist zukünftig oder überaltert');
 assert(row.soltype==='Published Confirmed'&&row.default_flag===1&&row.pl_controv_flag===0,'Unbestätigter oder kontroverser Planet');
 assert(Number.isSafeInteger(row.disc_year)&&row.disc_year>=1900&&row.disc_year<=Number(berlinDay(now).slice(0,4)),'Entdeckungsjahr ungültig');
 return {name,host,day,discoveryYear:row.disc_year};
}
export function generatePlanet(evidence,{now,sourceURLs,sourceHashes}){
 const {name,host,day,discoveryYear}=evidence,checkedAt=now.toISOString(),display=day.split('-').reverse().join('.');
 const eventKey='planet:'+name+':'+day,id='exoplanet-'+createHash('sha256').update(eventKey).digest('hex').slice(0,16);
 return {id,title:`Ein Datenblick auf ${name}`,section:'Wissenschaft',sourcePublishedOn:day,eventOn:null,eventUntil:null,checkedAt,
  summary:`Das NASA-Exoplanetenarchiv hat am ${display} einen Datensatz zu ${name} freigegeben. Der Planet gehört zum Stern ${host}.`,
  explanation:`Der Planet wurde ${discoveryYear} entdeckt. Das Freigabedatum beschreibt diesen Datensatz und bedeutet keine neue Entdeckung heute. Ein Exoplanet ist ein Planet außerhalb unseres Sonnensystems.`,
  why:'Forschende halten Beobachtungen in Datenbanken fest. Dabei kann auch zu einem schon bekannten Planeten ein neuer Datensatz erscheinen.',
  background:'Der Archiveintrag führt den Planeten als bestätigt und nicht kontrovers. Daraus folgen keine Aussagen über Leben, Bewohnbarkeit oder Gefahren.',
  question:'Warum ist das Datum eines Datensatzes nicht immer das Entdeckungsjahr?',topicId:'science-solar-system',connectionWhy:'Die Planetenkarte erklärt unser Sonnensystem. Exoplaneten gehören zu anderen Sternsystemen.',
  verification:'Namen, Stern, Entdeckungsjahr und Freigabedatum wurden automatisch mit einem gezielt abgefragten Archiveintrag verglichen. Beide Abrufe sind dieselbe Quelle, keine unabhängige Bestätigung. Es gab keine menschliche Einzelprüfung.',
  editorial:{status:'approved',reviewer:'Automatische Sachregel Exoplaneten v1 · keine menschliche Einzelabnahme',reviewedAt:checkedAt},
  sources:sourceURLs.map((url,i)=>({name:i?'NASA Exoplanet Archive · gezielter Datensatz':'NASA Exoplanet Archive · jüngste freigegebene Datensätze',organization:'NASA Exoplanet Archive / Caltech',url,publishedOn:day,checkedAt,role:'primary',access:'reviewed',rights:'Öffentliche dokumentierte TAP-Datenabfrage. Eigene Erklärung, keine Artikel oder Medien.',...(i===0?{acknowledgment:'This research has made use of the NASA Exoplanet Archive, which is operated by the California Institute of Technology, under contract with the National Aeronautics and Space Administration under the Exoplanet Exploration Program.'}:{}),sha256:sourceHashes[i]})),
  claims:[['planet',name],['host-star',host],['release-date',day],['discovery-year',String(discoveryYear)]].map(([key,value])=>({key,value,sourceIndexes:[0,1]})),
  generation:{method:'structured-exoplanet-v1',ruleVersion:1,eventKey,evidence,sourceHashes},
 };
}
export function verifyPlanet(entry,row,comparison,{now,policy,topicIds,sourceURLs,sourceHashes}){
 const first=planetEvidence(row,{now,policy}),second=planetEvidence(comparison,{now,policy});assert(JSON.stringify(first)===JSON.stringify(second),'Planetenquellen widersprechen sich');
 assert(JSON.stringify(entry)===JSON.stringify(generatePlanet(first,{now,sourceURLs,sourceHashes})),'Planetenmeldung enthält eine nicht geprüfte Aussage');validateNews(entry,{policy,now,topicIds});return entry;
}
