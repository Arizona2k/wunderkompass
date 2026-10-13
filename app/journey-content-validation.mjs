export function validateJourneyContent(data,index,sources){
 const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!/[<>\u0000-\u0008]/u.test(value);
 if(data?.schemaVersion!==1||!Array.isArray(data.journeys)||data.journeys.length!==index.length)throw Error('Ungültige Reiseinhalte');
 const ids=new Set();for(const j of data.journeys){const meta=index.find(m=>m.id===j.id);if(!meta||ids.has(j.id)||j.title!==meta.title||j.steps?.length!==meta.steps.length)throw Error('Reiseidentität geändert');ids.add(j.id);
  if(JSON.stringify(j.question)!==JSON.stringify(meta.question)||j.activity!==meta.activity||j.source!==meta.source)throw Error('Abschluss oder Quellenidentität geändert');
  for(let i=0;i<j.steps.length;i++){const s=j.steps[i];if(s.title!==meta.steps[i].title||![s.text,s.fact,s.starter,s.deeper,s.whyItMatters,s.observe].every(text)||!Array.isArray(s.sourceIds)||!s.sourceIds.length||!s.sourceIds.every(id=>typeof id==='string'&&/^[a-z][a-z0-9-]{1,70}$/.test(id)&&Object.hasOwn(sources??{},id))||new Set(s.sourceIds).size!==s.sourceIds.length)throw Error('Unvollständiger Kapiteltext');}
 }
 return data.journeys;
}
