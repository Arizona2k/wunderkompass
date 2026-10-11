import DATA from './news-content.json' with {type:'json'};
export type NewsEntry=typeof DATA.entries[number];
export const NEWS_ENTRIES=DATA.entries;
export const NEWS_CHECKED_AT=DATA.checkedAt;
export function newsAge(entry:NewsEntry,now=new Date()){
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 return Math.floor((Date.parse(day+'T12:00:00Z')-Date.parse(entry.sourcePublishedOn+'T12:00:00Z'))/86400000);
}
export function availableNews(now=new Date()){
 return NEWS_ENTRIES.filter(e=>e.editorial.status==='approved'&&newsAge(e,now)>=0&&newsAge(e,now)<=14).toSorted((a,b)=>b.sourcePublishedOn.localeCompare(a.sourcePublishedOn));
}
export function newsDate(day:string){return new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(day+'T12:00:00Z'));}
