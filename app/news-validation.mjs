export const calendarDay=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
export function berlinDay(now){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function approvedURL(value,policy){const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port||!policy.hosts.includes(u.hostname))throw Error('Quelle außerhalb der freigegebenen HTTPS-Hosts');return u.href;}
const fail=message=>{throw new Error(message);};
export function validateNews(entry,{policy,now,topicIds}){
 const required=['id','title','section','summary','explanation','why','background','question','verification','topicId','connectionWhy','checkedAt','sourcePublishedOn'];
 for(const key of required)if(typeof entry[key]!=='string'||!entry[key].trim())fail('Fehlendes Feld '+key);
 if(!/^[a-z0-9-]+$/.test(entry.id)||!topicIds.includes(entry.topicId))fail('Ungültige Nachrichten-/Wissens-ID');
 if(entry.title.length>100||entry.summary.length>350||entry.explanation.length>900)fail('Nachricht zu lang');
 if(['section','why','background','question','verification','connectionWhy'].some(k=>entry[k].length>1200))fail('Nachrichtenfeld zu lang');
 if(entry.sourceDateMeaning!==undefined&&!['observation','data-update'].includes(entry.sourceDateMeaning))fail('Unbekannte Bedeutung des Quellenstands');
 if(required.some(k=>/<[^>]*>|https?:\/\//i.test(entry[k])))fail('HTML oder fremde URL im Redaktionstext');
 const copy=['title','summary','explanation','why','background','question'].map(k=>entry[k]).join(' ');
 if(/schock!|blutbad|kaufe jetzt|jetzt abonnieren|du musst sofort|garantiert ungefährlich/i.test(copy))fail('Ungeeignete Angst-, Werbe- oder Sicherheitsformulierung');
 if(copy.split(/[.!?]/).some(sentence=>sentence.trim().split(/\s+/).length>35))fail('Sätze zu lang für die kurze Kindernachricht');
 const date=entry.sourcePublishedOn;if(!calendarDay(date))fail('Fehlendes oder ungültiges Quelldatum');
 if(entry.eventOn!==null&&entry.eventOn!==undefined&&!calendarDay(entry.eventOn))fail('Ungültiges Ereignisdatum');
 const age=(Date.parse(berlinDay(now)+'T12:00:00Z')-Date.parse(date+'T12:00:00Z'))/86400000;
 if(age<0)fail('Quelldatum liegt in der Zukunft');
 const checked=Date.parse(entry.checkedAt);if(!Number.isFinite(checked)||checked>now.getTime()||berlinDay(new Date(checked))<date)fail('Ungültiger Prüfzeitpunkt');
 if(!Array.isArray(entry.sources)||entry.sources.length<1||entry.sources.length>5)fail('Quellen fehlen');
 for(const source of entry.sources){approvedURL(source.url,policy);if(!source.organization||source.access!=='reviewed')fail('Quelle ungeprüft');const at=Date.parse(source.checkedAt);if(!Number.isFinite(at)||at>now.getTime())fail('Ungültiger Quellenprüfzeitpunkt');if(source.publishedOn!==null&&(!calendarDay(source.publishedOn)||source.publishedOn>berlinDay(now)))fail('Ungültiges Quellenveröffentlichungsdatum');}
 if(new Set(entry.sources.map(s=>s.url)).size!==entry.sources.length)fail('Doppelte Quellen');
 if(entry.editorial?.status!=='approved'||!entry.editorial.reviewer||!entry.editorial.reviewedAt)fail('Redaktionelle Freigabe fehlt');
 const reviewed=Date.parse(entry.editorial.reviewedAt);if(!Number.isFinite(reviewed)||reviewed>now.getTime())fail('Ungültiger redaktioneller Prüfzeitpunkt');
 if(!Array.isArray(entry.claims)||!entry.claims.length)fail('Prüfbare Kernaussagen fehlen');
 for(const claim of entry.claims){if(!claim.key||!claim.value||!Array.isArray(claim.sourceIndexes)||!claim.sourceIndexes.length||claim.sourceIndexes.some(i=>!Number.isInteger(i)||!entry.sources[i]))fail('Kernaussage ohne Nachweis');}
 return {age,archived:age>policy.maxAgeDays};
}
