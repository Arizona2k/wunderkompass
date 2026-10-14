export function validateBookData(data,index){
 const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!/[<>\u0000-\u0008]/u.test(value);
 if(data?.schemaVersion!==1||!Array.isArray(data.words)||!Array.isArray(data.why)||data.words.length<1||data.words.length>10000||data.why.length<1||data.why.length>10000)throw Error('Ungültiges Wissensbuch');
 for(const [entries,size] of [[data.words,3],[data.why,2]]){
  const keys=new Set();for(const item of entries){if(!Array.isArray(item)||item.length!==size||!item.every(text)||keys.has(item[0]))throw Error('Beschädigter oder doppelter Wissenseintrag');keys.add(item[0]);}
 }
 if(data.learning!==undefined){
  if(!data.learning||typeof data.learning!=='object'||Array.isArray(data.learning))throw Error('Ungültige Wortvertiefungen');
  for(const [term,l] of Object.entries(data.learning)){
   if(!data.words.some(w=>w[0]===term)||!['starter','deeper','observe','benefit','topic','connection'].every(k=>text(l?.[k]))||(index?.topics&&!index.topics.includes(l.topic)))throw Error('Unbekannte oder unvollständige Wortvertiefung');
   if(['symbol','quantity'].some(k=>l[k]!==undefined&&!text(l[k])))throw Error('Ungültige optionale Einheitsangabe');
   if(l.relatedWords!==undefined&&(!Array.isArray(l.relatedWords)||l.relatedWords.length>8||new Set(l.relatedWords.map(r=>r.term)).size!==l.relatedWords.length||!l.relatedWords.every(r=>text(r?.reason)&&(index?.knownWords??data.words.map(w=>w[0])).includes(r.term)&&r.term!==term)))throw Error('Ungültige Wortverbindung');
   if(l.model!==undefined&&!['length','duration','temperature'].includes(l.model))throw Error('Unbekanntes Messmodell');
   if(l.illustration!==undefined&&l.illustration!=='entities')throw Error('Unbekannte Zählskizze');
   const q=l.question;if(!text(q?.prompt)||!Array.isArray(q.answers)||q.answers.length!==3||!q.answers.every(text)||new Set(q.answers).size!==3||!Number.isInteger(q.correct)||q.correct<0||q.correct>2||![q.hint,q.why].every(text)||!Array.isArray(q.wrongReasons)||q.wrongReasons.length!==3||!q.wrongReasons.every((r,i)=>i===q.correct?r==='':text(r)))throw Error('Beschädigte Wort-Denkfrage');
   const day=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
   if(!Array.isArray(l.sources)||!l.sources.length||!l.sources.every(s=>text(s?.title)&&text(s?.anchor)&&typeof s.url==='string'&&/^https:\/\/(?:www\.nist\.gov\/|www\.usgs\.gov\/(?:faqs\/|science\/science-explorer\/)|www\.nps\.gov\/(?:teachers\/classrooms\/|subjects\/biodiversity\/|common\/uploads\/teachers\/lessonplans\/)|oceanservice\.noaa\.gov\/facts\/|csrc\.nist\.gov\/glossary\/term\/|www1\.grc\.nasa\.gov\/beginners-guide-to-aeronautics\/|science\.nasa\.gov\/ems\/|science\.nasa\.gov\/learn\/basics-of-space-flight\/|www\.itl\.nist\.gov\/div898\/handbook\/|xlinux\.nist\.gov\/dads\/HTML\/|spaceplace\.nasa\.gov\/review\/science-fair\/|www\.genome\.gov\/genetics-glossary\/|www\.energy\.gov\/science\/|physics\.nist\.gov\/cuu\/Constants\/Table\/allascii\.txt$)/.test(s.url)&&day(s.checkedOn)&&(s.updatedOn===null||day(s.updatedOn))))throw Error('Fehlender Wortquellennachweis');
  }
 }
 if(index){for(const key of ['words','why']){const titles=data[key].map(item=>item[0]);if(!Array.isArray(index[key])||JSON.stringify(titles)!==JSON.stringify(index[key]))throw Error('Unvollständige oder geänderte Wissensbuch-Identitäten');}}
 if(index?.learning&&JSON.stringify(Object.keys(data.learning??{}))!==JSON.stringify(index.learning))throw Error('Unvollständige Wortvertiefungs-Identitäten');
 return data;
}
