import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateMeasurementPack} from '../app/book-measurement-validation.mjs';

/** Both small UI indexes are projections of the one reviewed source pack. */
export function bookMeasurementContent(check=false){
 const root=process.cwd(),raw=fs.readFileSync(path.join(root,'app/book-measurement-content.json'));
 const integrity=JSON.parse(fs.readFileSync(path.join(root,'app/book-measurement-integrity.json'),'utf8'));
 if(raw.length!==integrity.bytes||createHash('sha256').update(raw).digest('hex')!==integrity.sha256)throw Error('Stale measurement integrity');
 const pack=validateMeasurementPack(JSON.parse(raw)),topics=JSON.parse(fs.readFileSync(path.join(root,'app/world-index.json'),'utf8'));
 const words=Object.values(pack.words),links=Object.entries(pack.learning).map(([term,study])=>({term,topic:study.topic,connection:study.connection}));
 if(links.some(link=>!topics.some(topic=>topic.id===link.topic)))throw Error('Unpublished measurement topic link');
 for(const [file,data] of [['book-measurement-word-index.json',words],['book-measurement-topic-index.json',links]]){
  const target=path.join(root,'app',file),text=JSON.stringify(data,null,2)+'\n';
  if(check){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==text)throw Error('Stale '+file);}
  else if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==text)fs.writeFileSync(target,text);
 }
 return pack;
}
