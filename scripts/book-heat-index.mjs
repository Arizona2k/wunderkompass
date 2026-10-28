import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {validateHeatPack} from '../app/book-heat-validation.mjs';

export function bookHeatContent(check=false){
 const bytes=fs.readFileSync('app/book-heat-content.json'),pack=validateHeatPack(JSON.parse(bytes));
 const projections={
  'app/book-heat-index.json':{words:Object.values(pack.words),why:Object.values(pack.why)},
  'app/book-heat-topic-index.json':Object.entries(pack.learning).map(([term,item])=>({term,topic:item.topic,connection:item.benefit})),
  'app/book-heat-integrity.json':{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}
 };
 for(const [file,data]of Object.entries(projections)){
  const text=JSON.stringify(data,null,2)+'\n';
  // Keep readable German text in canonical projections and check exact bytes.
  if(check){if(fs.readFileSync(file,'utf8')!==text)throw Error('Stale heat projection '+file);}
  else fs.writeFileSync(file,text);
 }
 return pack;
}
