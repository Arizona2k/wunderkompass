import {readFile,readdir,lstat} from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {verifyEnvelope} from '../../app/news-wire.mjs';
/** Publisher artifact cannot contain scripts, symlinks, arbitrary files or bad signatures. */
export async function verifyPublication(directory,validation){
 let total=0,files=0;const visit=async folder=>{for(const name of await readdir(folder)){const file=path.join(folder,name),stat=await lstat(file);if(stat.isSymbolicLink())throw Error('Symlink im News-Artefakt');if(stat.isDirectory()){if(folder!==directory||name!=='versions')throw Error('Unbekannter News-Ordner');await visit(file);continue;}if(!stat.isFile()||!((folder===directory&&['latest.json','history.json'].includes(name))||(folder===path.join(directory,'versions')&&/^\d+-[a-f0-9]{64}\.json$/.test(name))))throw Error('Nicht erlaubte Datei im News-Artefakt');total+=stat.size;files++;if(stat.size>7340032||total>16777216||files>10)throw Error('News-Artefakt überschreitet Budget');const value=JSON.parse(await readFile(file,'utf8'));if(name==='history.json'){if(!Array.isArray(value)||value.length>7)throw Error('Ungültiger Verlauf');for(const entry of value)await verifyEnvelope(entry,validation);}else await verifyEnvelope(value,validation);}};
 await visit(directory);const latest=await verifyEnvelope(JSON.parse(await readFile(path.join(directory,'latest.json'),'utf8')),validation);return {files,bytes:total,sequence:latest.sequence,fingerprint:latest.fingerprint};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const json=async file=>JSON.parse(await readFile(new URL('../../'+file,import.meta.url),'utf8'));const policy=await json('content/news-source-policy.json'),runtime=await json('content/news-runtime.json'),topics=await json('app/world-index.json');
 console.log(JSON.stringify(await verifyPublication(path.resolve('work/news-runtime/publication'),{keys:runtime.keys,policy,topicIds:topics.map(t=>t.id),now:new Date()})));
}
