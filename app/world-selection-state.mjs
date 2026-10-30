/** Reading context belongs to one browser entry, never to the learning pass. */
export function worldSelectionCategory(route,categories){
 if(typeof route!=='string')return null;
 const parts=route.split('/');
 if(parts[0]!=='world'||!categories.some(category=>category.id===parts[1]))return null;
 return parts.length===2||(parts.length===4&&parts[2]==='page'&&/^[1-9]\d*$/.test(parts[3])&&Number.isSafeInteger(Number(parts[3])))?parts[1]:null;
}
export function resolveWorldSelection(route,previous,saved,categories){
 const fresh={route,query:'',group:'Alle',habitat:'Alle',timelineSelection:{era:'Alle',index:0}};
 const category=worldSelectionCategory(route,categories);
 if(!category)return fresh;
 if(saved?.route===route){
  if(!['query','group','habitat'].every(key=>typeof saved[key]==='string')||typeof saved.timelineSelection?.era!=='string'||!Number.isSafeInteger(saved.timelineSelection.index)||saved.timelineSelection.index<0)return fresh;
  return {route,query:saved.query,group:saved.group,habitat:saved.habitat,timelineSelection:{era:saved.timelineSelection.era,index:saved.timelineSelection.index}};
 }
 return previous&&worldSelectionCategory(previous.route,categories)===category?{...previous,route}:fresh;
}

/** Two authored wording variants denote the same selectable habitat group. */
export function habitatFilterLabel(value){
 if(value==='Wiesen & Gärten')return 'Wiesen und Gärten';
 if(value==='Flüsse & Seen')return 'Flüsse und Seen';
 return value;
}
