export function validateWorldContent(data,index,allIndex=index){
 const text=v=>typeof v==='string'&&v.trim().length>0&&v.length<=20000&&!/[<>\u0000-\u0008]/u.test(v);
 if(!Array.isArray(data)||data.length!==index.length)throw Error('Unvollständiger Wissenskatalog');
 const ids=new Set();for(const t of data){const m=index.find(e=>e.id===t.id);if(!m||ids.has(t.id)||t.title!==m.title||t.category!==m.category||t.intro!==m.intro)throw Error('Wissensidentität verändert');ids.add(t.id);
  if(!Array.isArray(t.paragraphs)||!t.paragraphs.length||!t.paragraphs.every(text)||!Array.isArray(t.more)||!t.more.every(text)||!text(t.surprise)||!Array.isArray(t.facts)||!t.facts.every(f=>text(f.label)&&text(f.text)))throw Error('Beschädigte Erklärung');
  const q=t.question;if(!text(q?.prompt)||!Array.isArray(q.answers)||q.answers.length<2||q.answers.length>8||!q.answers.every(text)||new Set(q.answers).size!==q.answers.length||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.answers.length||!text(q.why))throw Error('Beschädigte Frage');
  if(t.questionFeedback!==undefined){const f=t.questionFeedback;if(!f||!text(f.hint)||!Array.isArray(f.wrongReasons)||f.wrongReasons.length!==q.answers.length||!f.wrongReasons.every((reason,i)=>i===q.correct?reason===null:text(reason))||new Set(f.wrongReasons).size!==f.wrongReasons.length)throw Error('Beschädigte antwortbezogene Rückmeldung');}
  if(t.learning!==undefined&&(!t.learning||!['starter','observe','benefit'].every(k=>text(t.learning[k]))))throw Error('Beschädigte Lernhilfe');
  if(t.category==='science'&&(!t.learning||!['starter','observe','benefit'].every(k=>text(t.learning[k]))))throw Error('Unvollständige Lernstufen');
  if(t.investigation!==undefined&&!['pressure','buoyancy','lever','probability','angle','checksum','pendulum','resonance','fractals','encryption'].includes(t.investigation))throw Error('Unbekanntes Lernmodell');
  if(t.animal&&(!t.animal.size||!Number.isFinite(t.animal.size.min)||!Number.isFinite(t.animal.size.max)||t.animal.size.min<0||t.animal.size.max<t.animal.size.min||!['m','cm','mm','kg'].includes(t.animal.size.unit)||!['group','habitat','continent','diet','skill'].every(k=>text(t.animal[k]))))throw Error('Beschädigter Tiervergleich');
  if(t.challenges!==undefined&&(!Array.isArray(t.challenges)||!t.challenges.every(c=>text(c.id)&&['medium','hard'].includes(c.difficulty)&&text(c.prompt)&&Array.isArray(c.answers)&&c.answers.length>=2&&c.answers.every(text)&&new Set(c.answers).size===c.answers.length&&Number.isInteger(c.correct)&&c.correct>=0&&c.correct<c.answers.length&&text(c.why))))throw Error('Beschädigte Challenge');
  if(!Array.isArray(t.related)||!t.related.every(id=>allIndex.some(e=>e.id===id))||!Array.isArray(t.sources)||!t.sources.length||!t.sources.every(s=>text(s.label)&&typeof s.url==='string'&&/^https:\/\//.test(s.url)))throw Error('Fehlender Wissens- oder Quellenverweis');
 }
 return data;
}
