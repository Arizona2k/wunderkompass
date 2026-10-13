export function validateJourneyContent(data,index){
 const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!/[<>\u0000-\u0008]/u.test(value);
 if(data?.schemaVersion!==1||!Array.isArray(data.journeys)||data.journeys.length!==index.length)throw Error('Ungültige Reiseinhalte');
 const ids=new Set();for(const j of data.journeys){const meta=index.find(m=>m.id===j.id);if(!meta||ids.has(j.id)||j.title!==meta.title||j.steps?.length!==meta.steps.length)throw Error('Reiseidentität geändert');ids.add(j.id);
  for(let i=0;i<j.steps.length;i++){const s=j.steps[i];if(s.title!==meta.steps[i].title||![s.text,s.fact,s.starter,s.deeper,s.whyItMatters,s.observe].every(text)||!Array.isArray(s.sourceIds)||!s.sourceIds.length||new Set(s.sourceIds).size!==s.sourceIds.length)throw Error('Unvollständiger Kapiteltext');}
 }
 return data.journeys;
}
