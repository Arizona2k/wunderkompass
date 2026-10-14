const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!/[<>\u0000-\u0008]/u.test(value);
const day=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
const hosts=new Set(['www.nist.gov','www.itl.nist.gov','csrc.nist.gov','www.usgs.gov','pubs.usgs.gov','volcanoes.usgs.gov','oceanservice.noaa.gov','www.noaa.gov','www.weather.gov','www.ncei.noaa.gov','science.nasa.gov','spaceplace.nasa.gov','cosmicopia.gsfc.nasa.gov','www1.grc.nasa.gov','www.genome.gov','www.energy.gov','bsesc.energy.gov','www.nps.gov','www.nca.gov.au','www.un.org','www.unesco.org','nsidc.org','animals.sandiegozoo.org','www.antarctica.gov.au','www.exploratorium.edu','annex.exploratorium.edu','spark.iop.org','www.science.clemson.edu','nrich.maths.org','maths.dur.ac.uk','plus.maths.org']);
function source(s){if(!s||![s.title,s.anchor].every(text)||!day(s.checkedOn)||!(s.updatedOn===null||day(s.updatedOn)))return false;try{const url=new URL(s.url);return url.protocol==='https:'&&hosts.has(url.hostname)&&!url.username&&!url.password&&!url.port&&!url.hash;}catch{return false;}}
export function validateWhyLearning(data,{questions,words,topics,labs}){
 if(!data||Array.isArray(data)||typeof data!=='object'||JSON.stringify(Object.keys(data))!==JSON.stringify(questions))throw Error('Unvollständige Warum-Vertiefungen');
 for(const [question,l] of Object.entries(data)){
  if(!text(question)||!l||!['starter','deeper','observe','benefit','connection'].every(k=>text(l[k])))throw Error('Beschädigte Warum-Erklärung');
  const world=l.topic!==undefined,lab=l.lab!==undefined,word=l.word!==undefined;if(Number(world)+Number(lab)+Number(word)!==1||world&&!topics.includes(l.topic)||lab&&!labs.includes(l.lab)||word&&!words.includes(l.word))throw Error('Unbekanntes Warum-Ziel');
  if(!Array.isArray(l.sources)||!l.sources.length||l.sources.length>8||!l.sources.every(source)||new Set(l.sources.map(s=>s.url)).size!==l.sources.length)throw Error('Unvollständige Warum-Quellen');
  if(!Array.isArray(l.relatedWords)||l.relatedWords.length>8||new Set(l.relatedWords.map(r=>r?.term)).size!==l.relatedWords.length||!l.relatedWords.every(r=>words.includes(r?.term)&&text(r.reason)))throw Error('Beschädigte Warum-Wortverbindung');
  if(l.sourceCoverage!==undefined&&!text(l.sourceCoverage))throw Error('Unklarer Warum-Prüfstand');
 }
 return data;
}
