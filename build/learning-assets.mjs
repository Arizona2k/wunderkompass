import {readdirSync,statSync,readFileSync} from 'node:fs';
import {join,relative} from 'node:path';
import {createHash} from 'node:crypto';
export function finalLearningAssets(directory){
 const files=[];
 function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isSymbolicLink())throw Error('Unexpected offline asset symlink');if(entry.isDirectory())walk(p);else if(/\.(js|css|woff2?|svg|png|jpe?g|webp|json|webmanifest)$/.test(entry.name)&&entry.name!=='learning-worker.js'&&!relative(directory,p).startsWith('.vite/'))files.push('/'+relative(directory,p).split('\\').join('/'));}}
 walk(directory);return files.sort();
}
export function offlineAssetMetrics(directory){
 const worker=readFileSync(join(directory,'learning-worker.js'),'utf8'),match=worker.match(/const ASSETS = (\[[^;]+\]);/);if(!match)throw Error('Missing offline asset list');
 const assets=JSON.parse(match[1]);if(!assets.length||new Set(assets).size!==assets.length||assets.some(p=>typeof p!=='string'||!p.startsWith('/')||p.includes('..')||p.includes('?')||p.includes('#')))throw Error('Invalid offline assets');
 const files=assets.map(p=>({path:p,bytes:statSync(join(directory,p.slice(1))).size}));
 if(JSON.stringify(assets)!==JSON.stringify(finalLearningAssets(directory)))throw Error('Offline list differs from final complete build');
 return {assetCount:files.length,rawAssetBytes:files.reduce((n,p)=>n+p.bytes,0),largestAssets:files.sort((a,b)=>b.bytes-a.bytes).slice(0,10),meaning:'All final learning assets; uncompressed file sizes, not measured HTTP compression or a storage limit.'};
}

export function learningAssetMetadata(directory,assets=finalLearningAssets(directory)){return Object.fromEntries(assets.map(p=>{const bytes=readFileSync(join(directory,p.slice(1)));return [p,{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}];}));}
