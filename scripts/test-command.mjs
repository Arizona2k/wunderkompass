import {spawn} from 'node:child_process';import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
import {sourceDigest} from './handoff.mjs';
const files=(await fs.readdir('tests')).filter(f=>f.endsWith('.test.mjs')).sort().map(f=>'tests/'+f),started=performance.now();
await fs.mkdir('.qa-output',{recursive:true});
const before=await sourceDigest();
const child=spawn(process.execPath,['--import','./scripts/test-runtime.mjs','--test','--test-reporter=spec','--test-reporter=junit','--test-reporter-destination=stdout','--test-reporter-destination=.qa-output/unit-tests.xml',...files],{stdio:'inherit'});
let code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
if(before!==await sourceDigest()){console.error('Source changed during unit tests; proof rejected.');code=1;}
const hashes=[];for(const file of files)hashes.push({file,sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex')});
let head=process.env.GITHUB_SHA??null;try{if(!head){const ref=(await fs.readFile('.git/HEAD','utf8')).trim();head=ref.startsWith('ref: ')?(await fs.readFile('.git/'+ref.slice(5),'utf8')).trim():ref;}}catch{/* A worktree may require the separate git-based handoff reader. */}
await fs.writeFile('.qa-output/unit-proof.json',JSON.stringify({status:code===0?'passed':'failed',scope:'all unit tests',seconds:(performance.now()-started)/1000,sourceDigest:before,head,files:hashes},null,2));process.exitCode=code??1;
