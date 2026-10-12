export function validateJourneyInquiries(data,journeys){
 if(!data||data.schemaVersion!==1||!Array.isArray(data.chapters)||data.chapters.length!==80)throw Error('Die Kapitelaufgaben sind unvollständig.');
 const ids=new Set(),text=s=>typeof s==='string'&&s.trim().length>0&&s.length<=700&&!/<[^>]*>/.test(s);
 for(const c of data.chapters){
  const journey=journeys.find(j=>j.id===c.journeyId);
  if(!journey||!Number.isInteger(c.index)||!journey.steps[c.index]||c.id!==c.journeyId+':'+c.index||ids.has(c.id))throw Error('Kapitelidentität ungültig.');ids.add(c.id);
  if(!text(c.goal)||!text(c.scene)||!Array.isArray(c.tasks)||c.tasks.length!==3)throw Error('Lernziel oder Denkstufen fehlen.');
  for(const q of c.tasks)if(!text(q.prompt)||!text(q.hint)||!text(q.why)||!Array.isArray(q.answers)||q.answers.length!==3||new Set(q.answers).size!==3||!q.answers.every(text)||!Number.isInteger(q.correct)||q.correct<0||q.correct>2||!Array.isArray(q.wrong)||q.wrong.length!==3||!q.wrong.every(text))throw Error('Aufgabe oder Rückmeldung ungültig.');
  if(c.sequence&&(!Array.isArray(c.sequence)||c.sequence.length<3||c.sequence.length>4||new Set(c.sequence).size!==c.sequence.length||!c.sequence.every(text)))throw Error('Reihenfolgeaufgabe ungültig.');
 }
 for(const j of journeys)for(let index=0;index<j.steps.length;index++)if(!ids.has(j.id+':'+index))throw Error('Kapitelprüfung fehlt.');
 return data.chapters;
}
