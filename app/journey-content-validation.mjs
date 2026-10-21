export function validateJourneyContent(data,index,sources){
 const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!/[<>\u0000-\u0008]/u.test(value);
 const headers=j=>Object.fromEntries(Object.entries(j).filter(([key])=>key!=='steps'));
 if(data?.schemaVersion!==1||!Array.isArray(data.journeys)||data.journeys.length!==index.length)throw Error('Ungültige Reiseinhalte');
 const ids=new Set();
 for(const j of data.journeys){
  const meta=index.find(m=>m.id===j?.id);
  if(!meta||ids.has(j.id)||!Array.isArray(j.steps)||j.steps.length!==meta.steps.length||JSON.stringify(headers(j))!==JSON.stringify(headers(meta)))throw Error('Reiseidentität geändert');
  ids.add(j.id);
  for(let i=0;i<j.steps.length;i++){
   const s=j.steps[i],m=meta.steps[i];
   if(!s||s.title!==m.title||![s.title,s.text,s.fact].every(text)||s.tryIt!==m.tryIt)throw Error('Unvollständiger Kapiteltext');
   for(const key of ['starter','deeper','whyItMatters','observe'])if((m.textFields??[]).includes(key)!==Object.hasOwn(s,key)||Object.hasOwn(s,key)&&!text(s[key]))throw Error('Kapitelvertiefung geändert');
   if(JSON.stringify(s.sourceIds)!==JSON.stringify(m.sourceIds)||s.sourceIds&&(!Array.isArray(s.sourceIds)||!s.sourceIds.length||new Set(s.sourceIds).size!==s.sourceIds.length||!s.sourceIds.every(id=>typeof id==='string'&&/^[a-z][a-z0-9-]{1,70}$/.test(id)&&Object.hasOwn(sources??{},id))))throw Error('Kapitelquelle geändert');
  }
 }
 return data.journeys;
}
