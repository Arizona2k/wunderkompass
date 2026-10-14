import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateBookData} from '../app/book-validation.mjs';
import {validateJourneyContent} from '../app/journey-content-validation.mjs';
export function journeyIndex(data){return data.journeys.map(j=>({...j,steps:j.steps.map(s=>({title:s.title,text:s.text.split(/\.\s/u)[0]+'.',...(s.tryIt?{tryIt:s.tryIt}:{} )}))}));}
export function learningIndexes(check=false){
 const book=JSON.parse(fs.readFileSync('app/book-content.json','utf8')),journeys=JSON.parse(fs.readFileSync('app/journey-content.json','utf8'));
 validateBookData(book);validateJourneyContent(journeys,journeyIndex(journeys),JSON.parse(fs.readFileSync('app/journey-sources.json','utf8')));
 const studies={},outputs={'app/book-word-index.json':book.words.map(w=>w[0]),'app/book-why-index.json':book.why.map(w=>w[0]),'app/book-learning-index.json':Object.keys(book.learning??{}),'app/journey-index.json':journeyIndex(journeys),'app/book-core.json':{schemaVersion:book.schemaVersion,words:book.words,why:book.why},'app/book-search.json':Object.fromEntries(Object.entries(book.learning??{}).map(([term,l])=>[term,[l.symbol,l.quantity,l.starter,l.deeper,l.observe,l.benefit,l.connection,l.question.prompt,l.question.hint,l.question.why].filter(Boolean).join(' ')]))};
 for(const [term,learning] of Object.entries(book.learning??{})){
  const file='book-study-'+createHash('sha256').update(term).digest('hex').slice(0,16)+'.json',payload={schemaVersion:1,term,learning},bytes=JSON.stringify(payload,null,2)+'\n';
  studies[term]={file,bytes:Buffer.byteLength(bytes),sha256:createHash('sha256').update(bytes).digest('hex')};outputs['app/book-studies/'+file]=payload;
 }
 outputs['app/book-study-index.json']=studies;
 const searchBytes=JSON.stringify(outputs['app/book-search.json'],null,2)+'\n';outputs['app/book-search-integrity.json']={bytes:Buffer.byteLength(searchBytes),sha256:createHash('sha256').update(searchBytes).digest('hex')};
 for(const [file,data] of Object.entries(outputs)){
  if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data)||(file.startsWith('app/book-studies/')||file==='app/book-search.json')&&fs.readFileSync(file,'utf8')!==JSON.stringify(data,null,2)+'\n')throw Error('Stale public learning index: '+file);}
  else{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');}
 }
 const expected=Object.values(studies).map(s=>s.file).sort(),actual=fs.readdirSync('app/book-studies').filter(f=>f.endsWith('.json')).sort();
 if(check&&JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Stale public book study parts');
 if(!check)for(const file of actual)if(!expected.includes(file))fs.unlinkSync('app/book-studies/'+file);
 return outputs;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))learningIndexes(process.argv.includes('--check'));
