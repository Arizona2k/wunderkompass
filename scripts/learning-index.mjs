import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateBookData} from '../app/book-validation.mjs';
import {validateWhyLearning} from '../app/why-learning-validation.mjs';
import {LAB_SEARCH} from '../app/research-catalog.ts';
import {validateJourneyContent} from '../app/journey-content-validation.mjs';
export function journeyIndex(data){return data.journeys.map(j=>({...j,steps:j.steps.map(s=>({title:s.title,text:s.text.split(/\.\s/u)[0]+'.',...(s.tryIt?{tryIt:s.tryIt}:{} )}))}));}
export function learningIndexes(check=false){
 const book=JSON.parse(fs.readFileSync('app/book-content.json','utf8')),journeys=JSON.parse(fs.readFileSync('app/journey-content.json','utf8'));
 validateBookData(book,{words:book.words.map(w=>w[0]),why:book.why.map(w=>w[0]),learning:Object.keys(book.learning??{}),topics:JSON.parse(fs.readFileSync('app/world-catalog.json','utf8')).map(t=>t.id)});validateJourneyContent(journeys,journeyIndex(journeys),JSON.parse(fs.readFileSync('app/journey-sources.json','utf8')));
 validateWhyLearning(book.whyLearning,{questions:book.why.map(q=>q[0]),words:book.words.map(w=>w[0]),topics:JSON.parse(fs.readFileSync('app/world-catalog.json','utf8')).map(t=>t.id),labs:LAB_SEARCH.map(l=>l.id)});
 const studies={},outputs={'app/book-word-index.json':book.words.map(w=>w[0]),'app/book-why-index.json':book.why.map(w=>w[0]),'app/book-learning-index.json':Object.keys(book.learning??{}),'app/journey-index.json':journeyIndex(journeys),'app/book-core.json':{schemaVersion:book.schemaVersion,words:book.words,why:book.why},'app/book-search.json':Object.fromEntries(Object.entries(book.learning??{}).map(([term,l])=>[term,[l.symbol,l.quantity,l.starter,l.deeper,l.observe,l.benefit,l.connection,l.question.prompt,l.question.hint,l.question.why].filter(Boolean).join(' ')]))};
 for(const [term,learning] of Object.entries(book.learning??{})){
  const file='book-study-'+createHash('sha256').update(term).digest('hex').slice(0,16)+'.json',payload={schemaVersion:1,term,learning},bytes=JSON.stringify(payload,null,2)+'\n';
  studies[term]={file,bytes:Buffer.byteLength(bytes),sha256:createHash('sha256').update(bytes).digest('hex')};outputs['app/book-studies/'+file]=payload;
 }
 const wordGroups=Object.groupBy(Object.entries(book.learning??{}),([,l])=>l.topic??'lab-'+l.lab),whyGroups=Object.groupBy(Object.entries(book.whyLearning??{}).filter(([,l])=>!l.word),([,l])=>l.topic??'lab-'+l.lab),topicParts={};
 for(const topic of new Set([...Object.keys(wordGroups),...Object.keys(whyGroups)])){
  if(!/^[a-z][a-z0-9_-]*$/.test(topic))throw Error('Unsafe book-topic identity');const links=wordGroups[topic]??[],questions=whyGroups[topic]??[],file='book-topic-'+topic+'.json',payload={schemaVersion:1,topic,links:links.map(([term,l])=>({term,reason:l.connection})),questions:questions.map(([question,l])=>({question,reason:l.connection}))},bytes=JSON.stringify(payload,null,2)+'\n';outputs['app/book-topic-parts/'+file]=payload;topicParts[topic]={file,bytes:Buffer.byteLength(bytes),sha256:createHash('sha256').update(bytes).digest('hex'),wordCount:links.length,questionCount:questions.length};
 }
 outputs['app/book-study-why.json']=book.whyLearning;const whyBytes=JSON.stringify(book.whyLearning,null,2)+'\n';outputs['app/book-why-integrity.json']={bytes:Buffer.byteLength(whyBytes),sha256:createHash('sha256').update(whyBytes).digest('hex')};
 outputs['app/book-topic-index.json']=topicParts;
 outputs['app/book-study-index.json']=studies;
 const studyIndexBytes=JSON.stringify(studies,null,2)+'\n';outputs['app/book-study-index-integrity.json']={bytes:Buffer.byteLength(studyIndexBytes),sha256:createHash('sha256').update(studyIndexBytes).digest('hex')};
 const searchParts=[],searchEntries=Object.entries(outputs['app/book-search.json']);for(let offset=0;offset<searchEntries.length;offset+=48){const entries=searchEntries.slice(offset,offset+48),file='book-search-part-'+(offset/48)+'.json',payload=Object.fromEntries(entries),bytes=JSON.stringify(payload,null,2)+'\n';outputs['app/book-search-parts/'+file]=payload;searchParts.push({file,terms:entries.map(([term])=>term),bytes:Buffer.byteLength(bytes),sha256:createHash('sha256').update(bytes).digest('hex')});}
 const searchBytes=JSON.stringify(outputs['app/book-search.json'],null,2)+'\n';outputs['app/book-search-integrity.json']={bytes:Buffer.byteLength(searchBytes),sha256:createHash('sha256').update(searchBytes).digest('hex'),parts:searchParts};
 for(const [file,data] of Object.entries(outputs)){
  if(check){if(JSON.stringify(JSON.parse(fs.readFileSync(file,'utf8')))!==JSON.stringify(data)||(file.startsWith('app/book-studies/')||file.startsWith('app/book-topic-parts/')||file.startsWith('app/book-search-parts/')||file==='app/book-search.json'||file==='app/book-study-index.json')&&fs.readFileSync(file,'utf8')!==JSON.stringify(data,null,2)+'\n')throw Error('Stale public learning index: '+file);}
  else{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');}
 }
 const expected=Object.values(studies).map(s=>s.file).sort(),actual=fs.readdirSync('app/book-studies').filter(f=>f.endsWith('.json')).sort();
 if(check&&JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Stale public book study parts');
 if(!check)for(const file of actual)if(!expected.includes(file))fs.unlinkSync('app/book-studies/'+file);
 const topicExpected=Object.values(topicParts).map(p=>p.file).sort(),topicActual=fs.existsSync('app/book-topic-parts')?fs.readdirSync('app/book-topic-parts').filter(f=>f.endsWith('.json')).sort():[];
 if(check&&JSON.stringify(topicActual)!==JSON.stringify(topicExpected))throw Error('Stale public book topic parts');
 if(!check)for(const file of topicActual)if(!topicExpected.includes(file))fs.unlinkSync('app/book-topic-parts/'+file);
 const searchExpected=searchParts.map(p=>p.file).sort(),searchActual=fs.existsSync('app/book-search-parts')?fs.readdirSync('app/book-search-parts').filter(f=>f.endsWith('.json')).sort():[];
 if(check&&JSON.stringify(searchActual)!==JSON.stringify(searchExpected))throw Error('Stale public book search parts');
 if(!check)for(const file of searchActual)if(!searchExpected.includes(file))fs.unlinkSync('app/book-search-parts/'+file);
 return outputs;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))learningIndexes(process.argv.includes('--check'));
