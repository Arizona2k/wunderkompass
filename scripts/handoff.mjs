import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';

export async function sourceDigest(root=process.cwd()){
 const files=[];
 async function walk(directory){for(const entry of await fs.readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isSymbolicLink())throw Error('Unexpected source symlink');if(entry.isDirectory())await walk(file);else if(!file.endsWith(".md"))files.push(file);}}
 for(const name of ['app','build','components','hooks','migration','lib','scripts','tests','content','public','.github'])await walk(path.join(root,name));
 for(const name of ['package.json','pnpm-lock.yaml','pnpm-workspace.yaml','vite.config.ts','tsconfig.json','eslint.config.mjs','performance-budgets.json','vercel.json','qa/package.json','qa/pnpm-lock.yaml','qa/pnpm-workspace.yaml'])files.push(path.join(root,name));
 const hash=createHash('sha256');for(const file of files.sort())hash.update(path.relative(root,file)).update('\0').update(await fs.readFile(file)).update('\0');return hash.digest('hex');
}
export async function createHandoff(report,directory='.qa-output'){
 if(report.status!=='passed'||report.scope!=='complete mandatory regression'||report.build!==learningFingerprint(process.cwd()))throw Error('Handoff lacks a complete current production-build proof');
 const unit=JSON.parse(await fs.readFile(path.join(directory,'unit-proof.json'),'utf8'));if(unit.status!=='passed'||unit.sourceDigest!==await sourceDigest())throw Error('Unit proof is missing or belongs to different code');
 const backlog=await fs.readFile('BACKLOG.md','utf8'),requirements=[];
 for(const line of backlog.split('\n').filter(l=>/^\| (?:A[1-6]|B[1-8]|B9|C) \|/.test(l))){
  const columns=line.split('|').map(c=>c.trim()),id=columns[1],files=[...line.matchAll(/\]\((?!https?:)([^)]+)\)/g)].map(m=>m[1]);
  const sources=[];for(const file of files){const resolved=path.resolve(file);if(!resolved.startsWith(process.cwd()+path.sep))throw Error('Invalid evidence path');const data=await fs.readFile(resolved);sources.push({file,sha256:createHash('sha256').update(data).digest('hex')});}
  requirements.push({id,requirements:columns[2],sources,remaining:columns.at(-2)});
 }
 if(requirements.length!==16)throw Error('Incomplete existing-backlog requirement mapping');
 const screenshots=[];for(const file of (await fs.readdir(directory)).filter(f=>/^quality-.*\.png$/.test(f)).sort()){const data=await fs.readFile(path.join(directory,file));if(data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Broken screenshot');screenshots.push({file,width:data.readUInt32BE(16),height:data.readUInt32BE(20),sha256:createHash('sha256').update(data).digest('hex')});}
 if(!screenshots.length)throw Error('Missing actual screenshots');
 let pr=null;if(process.env.GITHUB_EVENT_PATH){const event=JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH,'utf8'));if(event.pull_request)pr={number:event.pull_request.number,head:event.pull_request.head.sha,base:event.pull_request.base.sha};}
 const output={schemaVersion:1,meaning:'Technical evidence and explicit deficits; no automatic scientific/pedagogical approval or merge authorization',createdAt:new Date().toISOString(),sourceDigest:unit.sourceDigest,head:unit.head,ci:process.env.GITHUB_RUN_ID?{run:process.env.GITHUB_RUN_ID,testedCommit:process.env.GITHUB_SHA,pr}:null,build:report.build,browser:report.browser,coverage:report.selectedSuites,seconds:report.seconds,unit,requirements,screenshots};
 await fs.writeFile(path.join(directory,'handoff.json'),JSON.stringify(output,null,2));return output;
}
