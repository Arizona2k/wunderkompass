export const NEWS_REMOVAL_WIDTHS=[320,360,390,768,1024,1440,1920];
export const REMOVED_NEWS_ROUTES=['news','news/girl-day-2026','news/unknown'];
export function newsRemovalComplete(proof){
 const expected=NEWS_REMOVAL_WIDTHS.flatMap(width=>[false,true].map(large=>width+':'+large));
 return proof?.noNewsRequests===true&&Array.isArray(proof.observed)&&proof.observed.length===expected.length&&new Set(proof.observed.map(c=>c.width+':'+c.large)).size===expected.length&&expected.every(key=>proof.observed.some(c=>c.width+':'+c.large===key))&&proof.observed.every(c=>c.home===true&&c.search===true&&c.updates===true&&c.passPreserved===true&&c.reload===true&&Array.isArray(c.routes)&&c.routes.length===REMOVED_NEWS_ROUTES.length&&new Set(c.routes).size===REMOVED_NEWS_ROUTES.length&&REMOVED_NEWS_ROUTES.every(route=>c.routes.includes(route)));
}
