import DATA from './news-content.json' with {type:'json'};
export type NewsEntry=Omit<typeof DATA.entries[number],'sources'>&{generation?:{method:string};sourceDateMeaning?:'observation'|'data-update'|'release';sources:Array<{name:string;organization:string;url:string;publishedOn:string|null;checkedAt:string;role:string;access:string;rights:string;acknowledgment?:string}>};
export const NEWS_ENTRIES=DATA.entries;
export const NEWS_CHECKED_AT=DATA.checkedAt;
export function newsReviewLabel(entry:NewsEntry){return entry.generation?'Automatisch mit Quelldaten abgeglichen':'Quellenbasierte Erklärung';}
export function newsAge(entry:NewsEntry,now=new Date()){
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 return Math.floor((Date.parse(day+'T12:00:00Z')-Date.parse(entry.sourcePublishedOn+'T12:00:00Z'))/86400000);
}
export function availableNews(now=new Date(),entries:NewsEntry[]=NEWS_ENTRIES){
 return entries.filter(e=>e.editorial.status==='approved'&&newsAge(e,now)>=0&&newsAge(e,now)<=14).toSorted((a,b)=>b.sourcePublishedOn.localeCompare(a.sourcePublishedOn));
}
export function newsDate(day:string){return new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(day+'T12:00:00Z'));}

export function newsCheckDate(instant:string){return new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(instant));}
