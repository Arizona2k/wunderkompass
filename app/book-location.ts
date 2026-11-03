export type BookView={route:string;tab:string;query:string;category:string;letter:string;wordLimit:number;natureLimit:number;limit:number};
export function bookLookup(route:string){
 const [area,tab,...parts]=route.split('/');
 if(area!=='book'||!['words','why','nature'].includes(tab)||(!parts.length&&tab!=='nature'))return;
 try{return {tab,term:decodeURIComponent(parts.join('/'))};}catch{return;}
}
export function bookLookupFocus(lookup:{tab:string;term:string}){const prefix:{[tab:string]:string}={words:'book-word-target-',why:'book-why-target-',nature:'book-nature-target-'};return lookup.term&&prefix[lookup.tab]?prefix[lookup.tab]+lookup.term:undefined;}
export function initialBookView(route:string,saved?:BookView):BookView{
 const lookup=bookLookup(route),view={route,tab:lookup?.tab??'words',query:lookup?.tab==='words'?lookup.term:'',category:'Alle',letter:'Alle',wordLimit:24,natureLimit:24,limit:24};
 if(saved?.route!==route||!['words','why','notes','nature','atlas'].includes(saved.tab))return view;
 for(const key of ['query','category','letter'] as const)if(typeof saved[key]!=='string')return view;
 for(const key of ['wordLimit','natureLimit','limit'] as const)if(!Number.isSafeInteger(saved[key])||saved[key]<24)return view;
 return {...view,...saved};
}
