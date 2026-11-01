export type BookView={route:string;tab:string;query:string;category:string;letter:string;wordLimit:number;natureLimit:number;limit:number};
export function bookLookup(route:string){
 const [,tab,...parts]=route.split('/');
 if(!['words','why'].includes(tab)||!parts.length)return;
 try{return {tab,term:decodeURIComponent(parts.join('/'))};}catch{return;}
}
export function initialBookView(route:string,saved?:BookView):BookView{
 const lookup=bookLookup(route),view={route,tab:lookup?.tab??'words',query:lookup?.tab==='words'?lookup.term:'',category:'Alle',letter:'Alle',wordLimit:24,natureLimit:24,limit:24};
 if(saved?.route!==route||!['words','why','notes','nature','atlas'].includes(saved.tab))return view;
 for(const key of ['query','category','letter'] as const)if(typeof saved[key]!=='string')return view;
 for(const key of ['wordLimit','natureLimit','limit'] as const)if(!Number.isSafeInteger(saved[key])||saved[key]<24)return view;
 return {...view,...saved};
}
