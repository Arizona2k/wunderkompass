import natureIds from '../app/nature-entry-ids.json' with {type:'json'};
import journeyIndex from '../app/journey-index.json' with {type:'json'};
import whyIndex from '../app/book-why-index.json' with {type:'json'};
import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import bookLearningIndex from '../app/book-learning-index.json' with {type:'json'};

export async function sourceDigest(root=process.cwd()){
 const files=[];
 async function walk(directory){for(const entry of await fs.readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isSymbolicLink())throw Error('Unexpected source symlink');if(entry.isDirectory())await walk(file);else if(!file.endsWith(".md"))files.push(file);}}
 for(const name of ['app','build','components','hooks','migration','lib','scripts','tests','content','public','.github'])await walk(path.join(root,name));
 for(const name of ['package.json','pnpm-lock.yaml','pnpm-workspace.yaml','vite.config.ts','tsconfig.json','eslint.config.mjs','performance-budgets.json','vercel.json','qa/package.json','qa/pnpm-lock.yaml','qa/pnpm-workspace.yaml'])files.push(path.join(root,name));
 const hash=createHash('sha256');for(const file of files.sort())hash.update(path.relative(root,file)).update('\0').update(await fs.readFile(file)).update('\0');return hash.digest('hex');
}
export const retentionComplete=r=>['multipleTabs','partialNeverReplacesFallback','unknownLegacyProtected','orphanCleanup','stoppedServerOldChunk','canaryPreserved'].every(k=>r?.[k]===true);
export const scheduleComplete=s=>s?.mode==='performance-first-book-overlap'&&s.performanceSamples===21&&['performanceCompletedSeconds','bookStartedSeconds','foundationCompletedSeconds','newsCompletedSeconds'].every(k=>Number.isFinite(s[k])&&s[k]>=0)&&s.performanceCompletedSeconds<=s.bookStartedSeconds&&s.bookStartedSeconds<s.foundationCompletedSeconds&&s.foundationCompletedSeconds<=s.newsCompletedSeconds&&Number.isInteger(s.peakWorkers)&&s.peakWorkers>=1&&s.peakWorkers<=3;
export const bookNavigationComplete=r=>r?.width===390&&['search','reload','reciprocal','backFocus'].every(k=>r[k]===true)&&Array.isArray(r.terms)&&r.terms.length===bookLearningIndex.length&&new Set(r.terms).size===r.terms.length&&bookLearningIndex.every(term=>r.terms.includes(term));
import worldIndex from '../app/world-index.json' with {type:'json'};
const inventionIds=worldIndex.filter(t=>t.category==='inventions').map(t=>t.id),inventionWidths=[320,390,768,1440];
export const inventionEngineComplete=e=>Array.isArray(e.inventionIds)&&e.inventionIds.length===inventionIds.length&&new Set(e.inventionIds).size===inventionIds.length&&inventionIds.every(id=>e.inventionIds.includes(id))&&Array.isArray(e.inventionObserved)&&e.inventionObserved.length===inventionIds.length*inventionWidths.length&&new Set(e.inventionObserved.map(v=>v.id+':'+v.width)).size===e.inventionObserved.length&&inventionIds.every(id=>inventionWidths.every(width=>e.inventionObserved.some(v=>v.id===id&&v.width===width)))&&Number.isFinite(e.phaseSeconds?.inventions)&&e.phaseSeconds.inventions>0;
export const engineComplete=e=>inventionEngineComplete(e)&&retentionComplete(e.offlineRetention)&&Array.isArray(e.natureIds)&&e.natureIds.length===natureIds.length&&natureIds.every(id=>e.natureIds.includes(id))&&Array.isArray(e.natureObserved)&&e.natureObserved.length===natureIds.length*4&&new Set(e.natureObserved.map(v=>v.id+':'+v.width)).size===e.natureObserved.length&&natureIds.every(id=>[320,390,768,1440].every(width=>e.natureObserved.some(v=>v.id===id&&v.width===width)))&&e.offlineResilience?.realProgress===true&&e.offlineResilience?.networkRecovery===true&&e.offlineResilience?.completeAssets===true&&e.offlineResilience?.offlineReload===true&&e.offlineResilience?.serverStopped===true&&e.offlineResilience?.passPreserved===true&&e.version&&e.chapters.length===16&&new Set(e.chapters).size===16&&journeyIndex.every(j=>e.chapters.includes(j.id+':0'))&&e.widths.length===4&&[320,390,768,1440].every(w=>e.widths.includes(w))&&Array.isArray(e.bookTerms)&&e.bookTerms.length===bookLearningIndex.length&&bookLearningIndex.every(term=>e.bookTerms.includes(term))&&Array.isArray(e.bookObserved)&&e.bookObserved.length===bookLearningIndex.length*4&&new Set(e.bookObserved.map(v=>v.name+':'+v.width)).size===e.bookObserved.length&&bookLearningIndex.every(term=>[320,390,768,1440].every(width=>e.bookObserved.some(v=>v.name===term&&v.width===width)))&&Array.isArray(e.whyQuestions)&&e.whyQuestions.length===whyIndex.length&&whyIndex.every(q=>e.whyQuestions.includes(q))&&Array.isArray(e.whyObserved)&&e.whyObserved.length===whyIndex.length*4&&new Set(e.whyObserved.map(v=>v.question+':'+v.width)).size===e.whyObserved.length&&whyIndex.every(question=>[320,390,768,1440].every(width=>e.whyObserved.some(v=>v.question===question&&v.width===width)));
export async function createHandoff(report,directory='.qa-output',{requiredEngines=[]}={}){
 if(!bookNavigationComplete(report.bookNavigationCoverage))throw Error('Handoff lacks complete current book navigation proof');
 if(report.status!=='passed'||report.scope!=='complete mandatory regression'||report.build!==learningFingerprint(process.cwd()))throw Error('Handoff lacks a complete current production-build proof');
 if(!scheduleComplete(report.scheduling))throw Error('Handoff lacks isolated performance and bounded worker scheduling proof');
 const unit=JSON.parse(await fs.readFile(path.join(directory,'unit-proof.json'),'utf8'));if(unit.status!=='passed'||unit.sourceDigest!==await sourceDigest())throw Error('Unit proof is missing or belongs to different code');
 const backlog=await fs.readFile('BACKLOG.md','utf8'),requirements=[];
 for(const line of backlog.split('\n').filter(l=>/^\| (?:A[1-6]|B[1-8]|B9|C|P3[A-D]|P35[A-D]) \|/.test(l))){
  const columns=line.split('|').map(c=>c.trim()),id=columns[1],files=[...line.matchAll(/\]\((?!https?:)([^)]+)\)/g)].map(m=>m[1]);
  const sources=[];for(const file of files){const resolved=path.resolve(file);if(!resolved.startsWith(process.cwd()+path.sep))throw Error('Invalid evidence path');const data=await fs.readFile(resolved);sources.push({file,sha256:createHash('sha256').update(data).digest('hex')});}
  requirements.push({id,requirements:columns[2],sources,remaining:columns.at(-2)});
 }
 if(requirements.length!==24)throw Error('Incomplete existing-backlog requirement mapping');
 let engineProof=null;try{engineProof=JSON.parse(await fs.readFile(path.join(directory,'engine-report.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}

 if(requiredEngines.length&&(!engineProof||engineProof.build!==report.build||engineProof.sourceDigest!==unit.sourceDigest||engineProof.status!=='passed'||engineProof.errors.length||requiredEngines.some(name=>!engineProof.engines.some(e=>e.name===name&&engineComplete(e)))))throw Error('Actual required browser engine evidence missing');
 const screenshots=[];for(const file of (await fs.readdir(directory)).filter(f=>/^(?:quality-|journey-engine-).*\.png$/.test(f)).sort()){const data=await fs.readFile(path.join(directory,file));if(data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Broken screenshot');screenshots.push({file,width:data.readUInt32BE(16),height:data.readUInt32BE(20),sha256:createHash('sha256').update(data).digest('hex')});}
 if(!screenshots.length)throw Error('Missing actual screenshots');
 let pr=null;if(process.env.GITHUB_EVENT_PATH){const event=JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH,'utf8'));if(event.pull_request)pr={number:event.pull_request.number,head:event.pull_request.head.sha,base:event.pull_request.base.sha};}
 const output={schemaVersion:1,meaning:'Technical evidence and explicit deficits; no automatic scientific/pedagogical approval or merge authorization',createdAt:new Date().toISOString(),sourceDigest:unit.sourceDigest,head:unit.head,ci:process.env.GITHUB_RUN_ID?{run:process.env.GITHUB_RUN_ID,testedCommit:process.env.GITHUB_SHA,pr}:null,build:report.build,browser:report.browser,coverage:report.selectedSuites,seconds:report.seconds,unit,requirements,screenshots,engineProof};
 await fs.writeFile(path.join(directory,'handoff.json'),JSON.stringify(output,null,2));return output;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=JSON.parse(await fs.readFile('.qa-output/portable-report.json','utf8'));await createHandoff(report,'.qa-output',{requiredEngines:process.argv.includes('--require-engines')?['firefox','webkit']:[]});
}
