import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {validateRetainedPack,RETAINED_RETAINED_WORDS} from '../app/book-retained-validation.mjs';

export function bookRetainedContent(check=false){
 const bytes=fs.readFileSync('app/book-retained-content.json'),pack=validateRetainedPack(JSON.parse(bytes));
 // Existing words receive reverse links from the same authored relationships.
 // No second editorial graph or modification of delivered definitions.
 const incoming={};
 for(const [term,item]of Object.entries(pack.learning))for(const link of item.relatedWords??[])if(!Object.hasOwn(pack.words,link.term))(incoming[link.term]??=[]).push({term,reason:link.reason});
 for(const [term,item]of Object.entries(pack.whyLearning))for(const link of [...(item.relatedWords??[]),...(item.word?[{term:item.word,reason:item.connection}]:[])])(incoming[link.term]??=[]).push({term,reason:link.reason,kind:'why'});
 const projections={
  'app/book-retained-index.json':{words:Object.values(pack.words).filter(row=>!RETAINED_RETAINED_WORDS.includes(row[0])),why:Object.values(pack.why)},
  'app/book-retained-topic-index.json':[...Object.entries(pack.learning).filter(([,item])=>item.topic).map(([term,item])=>({kind:'word',term,topic:item.topic,connection:item.connection})),...Object.entries(pack.whyLearning).filter(([,item])=>item.topic).map(([term,item])=>({kind:'why',term,topic:item.topic,connection:item.connection}))],
  'app/book-retained-word-link-index.json':incoming,
  'app/book-retained-integrity.json':{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}
 };
 for(const [file,data]of Object.entries(projections)){
  const text=JSON.stringify(data,null,2)+'\n';
  // Keep readable German text in canonical projections and check exact bytes.
  if(check){if(fs.readFileSync(file,'utf8')!==text)throw Error('Stale retained projection '+file);}
  else fs.writeFileSync(file,text);
 }
 return pack;
}
