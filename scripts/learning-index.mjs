import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export function journeyIndex(data){return data.journeys.map(j=>({...j,steps:j.steps.map(s=>({title:s.title,text:s.text.split(/\.\s/u)[0]+'.',...(s.tryIt?{tryIt:s.tryIt}:{} )}))}));}
export function learningIndexes(check=false){
 const book=JSON.parse(fs.readFileSync('app/book-content.json','utf8')),journeys=JSON.parse(fs.readFileSync('app/journey-content.json','utf8'));
 const outputs={'app/book-word-index.json':book.words.map(w=>w[0]),'app/journey-index.json':journeyIndex(journeys)};
 for(const [file,data] of Object.entries(outputs)){
  if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data))throw Error('Stale public learning index: '+file);}
  else fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 }
 return outputs;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))learningIndexes(process.argv.includes('--check'));
