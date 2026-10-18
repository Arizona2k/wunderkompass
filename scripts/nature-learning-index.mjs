import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import{fileURLToPath}from'node:url';import ts from 'typescript';
import {validateNatureLearning} from '../app/nature-validation.mjs';
import {LAB_SEARCH} from '../app/research-catalog.ts';
const sha=b=>createHash('sha256').update(b).digest('hex'),json=v=>JSON.stringify(v,null,2)+'\n';
export function natureIndexes(check=false){
 const source=JSON.parse(fs.readFileSync('app/nature-content.json','utf8')),syntax=ts.createSourceFile('nature-data.ts',fs.readFileSync('app/nature-data.ts','utf8'),ts.ScriptTarget.Latest,true);let rows;
 for(const statement of syntax.statements)if(ts.isVariableStatement(statement))for(const d of statement.declarationList.declarations)if(d.name.getText()==='entries'&&ts.isArrayLiteralExpression(d.initializer))rows=d.initializer.elements.map(row=>({id:row.elements[0].text,name:row.elements[1].text,category:row.elements[2].text}));
 if(!rows)throw Error('Missing canonical nature places');
 const eligible=rows.filter(r=>r.category!=='animals'),known={words:JSON.parse(fs.readFileSync('app/book-word-index.json','utf8')),topics:JSON.parse(fs.readFileSync('app/world-index.json','utf8')).map(t=>t.id),labs:LAB_SEARCH.map(l=>l.id)};
 if(source.schemaVersion!==1||!Array.isArray(source.entries)||source.entries.length!==eligible.length||new Set(source.entries.map(e=>e.id)).size!==eligible.length||!eligible.every(r=>source.entries.some(e=>e.id===r.id&&e.name===r.name)))throw Error('Incomplete canonical nature studies');
 const ids=eligible.map(r=>r.id),index={},links={word:{},topic:{},lab:{}},generated={},search={};
 for(const id of ids){const entry=source.entries.find(e=>e.id===id);validateNatureLearning(entry.learning,known);const content=JSON.stringify({schemaVersion:1,id,learning:entry.learning})+'\n',bytes=Buffer.byteLength(content),file='nature-study-'+sha(id).slice(0,16)+'.json';if(bytes>8000)throw Error('Individual nature request exceeds8000bytes: '+id);generated['nature-studies/'+file]=content;index[id]={file,bytes,sha256:sha(content)};const c=entry.learning.connection;(links[c.kind][c.target]??=[]).push({id,name:entry.name,reason:c.reason});}
 for(const id of ids){const e=source.entries.find(e=>e.id===id),l=e.learning;search[id]=[e.name,l.starter,l.deeper,l.observe,l.benefit,l.connection.reason,l.question.prompt].join(' ');}
 generated['nature-search.json']=JSON.stringify(search)+'\n';
 if(Buffer.byteLength(generated['nature-search.json'])>200000)throw Error('Split individual nature search requests before exceeding200000bytes');
 generated['nature-search-integrity.json']=json({bytes:Buffer.byteLength(generated['nature-search.json']),sha256:sha(generated['nature-search.json'])});
 generated['nature-entry-ids.json']=json(ids);generated['nature-study-index.json']=json(index);generated['nature-study-index-integrity.json']=json({bytes:Buffer.byteLength(generated['nature-study-index.json']),sha256:sha(generated['nature-study-index.json'])});generated['nature-connections.json']=json(links);
 for(const[name,data]of Object.entries(generated)){const file=path.join('app',name);if(check){if(fs.readFileSync(file,'utf8')!==data)throw Error('Stale nature projection '+file);}else{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);}}
 for(const name of fs.readdirSync('app/nature-studies'))if(!Object.hasOwn(generated,'nature-studies/'+name)){if(check||!/^nature-study-[a-f0-9]{16}\.json$/.test(name))throw Error('Unexpected nature part '+name);fs.unlinkSync('app/nature-studies/'+name);}
 return {entries:ids.length,largestPartBytes:Math.max(...Object.values(index).map(m=>m.bytes)),totalPartBytes:Object.values(index).reduce((n,m)=>n+m.bytes,0)};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(natureIndexes(process.argv.includes('--check'))));
