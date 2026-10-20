import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join,relative} from 'node:path';

export function learningInputs(root){
 const files=[];
 function walk(dir){if(!existsSync(dir))return;for(const item of readdirSync(dir,{withFileTypes:true})){const p=join(dir,item.name);if(item.isDirectory())walk(p);else files.push(p);}}
 for(const dir of ['app','components','public','migration','hooks','lib'])walk(join(root,dir));
 // Active build inputs, including the entry adapter and config-only changes.
 for(const name of ['index.html','tsconfig.json','vite.config.ts','postcss.config.mjs','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','build/learning-offline.ts','build/learning-worker.js','build/learning-fingerprint.mjs']){const p=join(root,name);if(existsSync(p))files.push(p);}
 return files.sort();
}
export function learningFingerprint(root,files=learningInputs(root)){
 const hash=createHash('sha256');for(const p of files)hash.update(relative(root,p)).update('\0').update(readFileSync(p)).update('\0');return hash.digest('hex').slice(0,16);
}
