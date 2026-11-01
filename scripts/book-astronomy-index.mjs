import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {validateAstronomyPack,ASTRONOMY_RETAINED_WORDS} from '../app/book-astronomy-validation.mjs';

export function bookAstronomyContent(check=false){
 const bytes=fs.readFileSync('app/book-astronomy-content.json'),pack=validateAstronomyPack(JSON.parse(bytes));
 // Existing words receive reverse links from the same authored relationships.
 // No second editorial graph or modification of delivered definitions.
 const incoming={};
 for(const [term,item]of Object.entries(pack.learning))for(const link of item.relatedWords??[])if(!Object.hasOwn(pack.words,link.term))(incoming[link.term]??=[]).push({term,reason:link.reason});
 const projections={
  'app/book-astronomy-index.json':{words:Object.values(pack.words).filter(row=>!ASTRONOMY_RETAINED_WORDS.includes(row[0])),why:Object.values(pack.why)},
  'app/book-astronomy-topic-index.json':[...Object.entries(pack.learning).map(([term,item])=>({kind:'word',term,topic:item.topic,connection:item.connection})),...Object.entries(pack.whyLearning).map(([term,item])=>({kind:'why',term,topic:item.topic,connection:item.connection}))],
  'app/book-astronomy-word-link-index.json':incoming,
  'app/book-astronomy-integrity.json':{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}
 };
 for(const [file,data]of Object.entries(projections)){
  const text=JSON.stringify(data,null,2)+'\n';
  // Keep readable German text in canonical projections and check exact bytes.
  if(check){if(fs.readFileSync(file,'utf8')!==text)throw Error('Stale astronomy projection '+file);}
  else fs.writeFileSync(file,text);
 }
 return pack;
}
