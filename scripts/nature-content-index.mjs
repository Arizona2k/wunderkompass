import fs from 'node:fs';

export function validateNatureLearning(pack,{places,words,modelControls}){
 const knownPlaces=new Map(places.map(p=>[p.id,p])),knownWords=new Set(words.map(row=>row[0]));
 const text=value=>typeof value==='string'&&value.trim().length>0;
 const assert=(value,message)=>{if(!value)throw Error('Nature learning: '+message);};
 const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
 assert(pack&&typeof pack==='object'&&!Array.isArray(pack),'expected keyed content');
 const kinds=new Set();
 for(const[id,item]of Object.entries(pack)){
  assert(item.id===id&&knownPlaces.get(id)?.name===item.name,'unknown or mismatched place '+id);
  assert(['water','geoscience','geology','habitats','landforms','coast','process','final-six'].includes(item.family),'unknown family '+id);
  const l=item.learning,q=l?.question,f=l?.figure;
  for(const field of ['learningGoal','starter','deeper','observe','benefit'])assert(text(l?.[field]),'missing '+field+' '+id);
  assert(text(f?.kind)&&!kinds.has(f.kind),'missing or repeated model '+id);kinds.add(f.kind);
  assert(f.controls.length===3&&f.controls.every(text)&&new Set(f.controls).size===3&&text(f.limits),'incomplete model controls or limits '+id);
  if(modelControls?.[item.family])assert(JSON.stringify(f.controls)===JSON.stringify(modelControls[item.family][f.kind]?.controls),'controls differ from actual model '+id);
  assert(text(q?.prompt)&&text(q?.hint)&&text(q?.why)&&q.answers.length===3&&q.answers.every(text)&&new Set(q.answers).size===3,'incomplete question '+id);
  assert(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.answers.length,'invalid correct answer '+id);
  assert(q.wrongReasons.length===q.answers.length&&q.wrongReasons.every((reason,n)=>n===q.correct||text(reason)),'missing specific feedback '+id);
  assert(l.sources.length>0&&l.claims.length>0,'missing sources or claims '+id);
  for(const s of l.sources){assert(new URL(s.url).protocol==='https:'&&text(s.title)&&text(s.anchor)&&date(s.checkedOn),'incomplete source '+id);assert(!('actualReadEvidence'in s)&&!('actualResponseSHA256'in s),'private evidence in public source '+id);}
  for(const c of l.claims)assert(text(c.claim)&&Number.isInteger(c.sourceIndex)&&c.sourceIndex>=0&&c.sourceIndex<l.sources.length,'unbound claim '+id);
  assert(l.relatedWords.length>0&&l.relatedNature.length>0,'missing authored connections '+id);
  for(const c of l.relatedWords)assert(knownWords.has(c.term)&&text(c.reason),'unknown word '+c.term+' in '+id);
  for(const c of l.relatedNature)assert(c.id!==id&&knownPlaces.has(c.id)&&text(c.reason),'unknown or self-related place '+c.id+' in '+id);
 }
 return pack;
}

export function natureContent(check,{places,words,modelControls}){
 const pack=validateNatureLearning(JSON.parse(fs.readFileSync('app/nature-learning-content.json','utf8')),{places,words,modelControls});
 const wordLinks={},placeLinks={},index={};
 for(const[id,item]of Object.entries(pack)){
  index[id]={family:item.family,kind:item.learning.figure.kind};
  for(const link of item.learning.relatedWords)(wordLinks[link.term]??=[]).push({id,name:item.name,reason:link.reason});
  for(const link of item.learning.relatedNature){
   // A reciprocal authored edge is already displayed by its own study.
   if(pack[link.id]?.learning.relatedNature.some(edge=>edge.id===id))continue;
   (placeLinks[link.id]??=[]).push({id,name:item.name,reason:link.reason});
  }
 }
 for(const[file,value]of Object.entries({'app/nature-learning-index.json':index,'app/nature-word-links.json':wordLinks,'app/nature-place-links.json':placeLinks,'app/nature-place-link-ids.json':Object.keys(placeLinks)})){
  const bytes=JSON.stringify(value,null,2)+'\n';
  if(check){if(fs.readFileSync(file,'utf8')!==bytes)throw Error('Stale Nature projection '+file);}else fs.writeFileSync(file,bytes);
 }
 return pack;
}
