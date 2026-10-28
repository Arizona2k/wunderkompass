import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {validateLightPack} from '../app/book-light-validation.mjs';

export function bookLightContent(check=false){
 const bytes=fs.readFileSync('app/book-light-content.json'),pack=validateLightPack(JSON.parse(bytes));
 // Existing words receive reverse links from the same authored relationships.
 // No second editorial graph or modification of delivered definitions.
 const incoming={};
 for(const [term,item]of Object.entries(pack.learning))for(const link of item.relatedWords??[])if(!Object.hasOwn(pack.words,link.term))(incoming[link.term]??=[]).push({term,reason:link.reason});
 const projections={
  'app/book-light-index.json':{words:Object.values(pack.words),why:Object.values(pack.why)},
  'app/book-light-topic-index.json':Object.entries(pack.learning).map(([term,item])=>({term,topic:item.topic,connection:item.benefit})),
  'app/book-light-word-link-index.json':incoming,
  'app/book-light-integrity.json':{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}
 };
 for(const [file,data]of Object.entries(projections)){
  const text=JSON.stringify(data,null,2)+'\n';
  // Keep readable German text in canonical projections and check exact bytes.
  if(check){if(fs.readFileSync(file,'utf8')!==text)throw Error('Stale light projection '+file);}
  else fs.writeFileSync(file,text);
 }
 return pack;
}
