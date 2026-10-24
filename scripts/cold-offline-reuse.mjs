import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {browserErrorsComplete} from './browser-errors.mjs';
import {animalOfflineComplete,solarOfflineComplete} from './article-learning-evidence.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const fields=['QA_BROWSER_EXECUTABLE','QA_BROWSER_LIB_PATH','QA_PLAYWRIGHT_MODULE','QA_CHROMIUM_MODULE','QA_DIST'];
export const coldBrowserEnvironment=(env=process.env)=>Object.fromEntries(fields.map(key=>[key,env[key]??null]));
export async function fileSnapshot(directory){
 const files=[];
 async function walk(relative=''){
  for(const entry of await fs.readdir(path.join(directory,relative),{withFileTypes:true})){
   const name=path.join(relative,entry.name);
   if(entry.isSymbolicLink())throw Error('Unexpected proof/build symlink');
   if(entry.isDirectory())await walk(name);
   else if(entry.isFile()){const bytes=await fs.readFile(path.join(directory,name));files.push({file:name,bytes:bytes.length,sha256:sha(bytes)});}
   else throw Error('Unexpected proof/build file');
  }
 }
 await walk();return files.sort((a,b)=>a.file.localeCompare(b.file));
}
async function proofSnapshot(directory){
 const files=[];
 // Match the existing worker collector: evidence is at the worker root. Never
 // read or copy its persistent browser profile, caches or arbitrary directories.
 for(const entry of await fs.readdir(directory,{withFileTypes:true})){
  if(!/\.(png|json|xml)$/.test(entry.name))continue;
  if(!entry.isFile())throw Error('Unexpected original evidence entry');
  const bytes=await fs.readFile(path.join(directory,entry.name));files.push({file:entry.name,bytes:bytes.length,sha256:sha(bytes)});
 }
 return files.sort((a,b)=>a.file.localeCompare(b.file));
}
function validIdentity(identity){
 const c=identity.context;
 assert.ok(c&&c.event==='pull_request'&&/^\d+$/.test(c.runId)&&/^[1-9]\d*$/.test(c.attempt)&&Number.isSafeInteger(c.pr)&&c.pr>0,'Exact PR Quality context required');
 for(const field of ['head','base','testedCommit','workflowSha'])assert.match(c[field],/^[a-f0-9]{40}$/);
 assert.equal(c.workflowSha,c.testedCommit);assert.equal(c.repository,'Arizona2k/wunderkompass');assert.ok(['main','test-live'].includes(c.target));assert.equal(c.workflowRef,`${c.repository}/.github/workflows/quality.yml@refs/pull/${c.pr}/merge`);
 assert.match(identity.sourceDigest,/^[a-f0-9]{64}$/);assert.match(identity.build,/^[a-f0-9]{16}$/);assert.deepEqual(Object.keys(identity.environment).sort(),fields.toSorted());assert.ok(Array.isArray(identity.dist)&&identity.dist.length>0);
}
function validReport(report,build){
 assert.equal(report.status,'passed');assert.equal(report.scope,'partial local iteration');assert.deepEqual(report.selectedSuites,['offline']);assert.equal(report.build,build);assert.ok(typeof report.browser==='string'&&report.browser.length>0);assert.ok(Number.isFinite(report.seconds)&&report.seconds>0);assert.ok(report.checks.length>0);assert.deepEqual(report.views,[]);assert.equal(report.timings.length,1);assert.equal(report.timings[0].suite,'offline');assert.ok(report.timings[0].seconds>0);assert.ok(browserErrorsComplete(report));assert.ok(animalOfflineComplete(report.animalOffline));assert.ok(solarOfflineComplete(report.solarOffline));assert.equal(report.offlineNavigatorOnline,false);
}
// The caller obtains identity from the unchanged Quality context reader, current
// source digest, build inputs and actual dist before/after the producer. No
// local/manual report becomes an automatic CI proof through this module.
export async function sealColdOffline(directory,sealFile,identity){
 validIdentity(identity);const report=JSON.parse(await fs.readFile(path.join(directory,'portable-report.json'),'utf8'));validReport(report,identity.build);
 const originals=await proofSnapshot(directory);assert.ok(originals.some(f=>f.file==='portable-report.json'));assert.ok(originals.some(f=>f.file==='offline-start.png'));assert.ok(originals.some(f=>f.file.endsWith('.png')));
 const seal={schemaVersion:1,meaning:'Original successful early cold group, reusable exactly once in this identical PR/run/attempt/source/build/browser environment; original bytes remain unchanged.',identity,browser:report.browser,originals};await fs.writeFile(sealFile,JSON.stringify(seal,null,2)+'\n',{flag:'wx'});return seal;
}
export async function restoreColdOffline(directory,sealFile,destination,identity){
 validIdentity(identity);const bytes=await fs.readFile(sealFile),seal=JSON.parse(bytes);assert.equal(seal.schemaVersion,1);assert.deepEqual(seal.identity,identity,'Cold proof PR/run/attempt/source/build/environment changed');assert.ok(Array.isArray(seal.originals)&&seal.originals.length>0);
 const actual=await proofSnapshot(directory);assert.deepEqual(actual,seal.originals,'Cold original files changed or disappeared');const report=JSON.parse(await fs.readFile(path.join(directory,'portable-report.json'),'utf8'));validReport(report,identity.build);assert.equal(report.browser,seal.browser);
 await fs.mkdir(destination,{recursive:false});for(const original of seal.originals){const target=path.join(destination,original.file);await fs.mkdir(path.dirname(target),{recursive:true});await fs.copyFile(path.join(directory,original.file),target);assert.equal(sha(await fs.readFile(target)),original.sha256);}
 await fs.writeFile(path.join(destination,'early-cold-provenance.json'),JSON.stringify({sealSHA256:sha(bytes),...seal},null,2)+'\n',{flag:'wx'});return {name:path.basename(destination),suites:['offline'],code:0,report,provenance:{sealSHA256:sha(bytes),context:identity.context,sourceDigest:identity.sourceDigest,build:identity.build,browser:seal.browser,originalFileCount:seal.originals.length,originalSeconds:report.seconds}};
}
