import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import path from 'node:path';
import POLICY from '../content/news-source-policy.json' with {type:'json'};
import CONTENT from '../app/news-content.json' with {type:'json'};
import TOPICS from '../app/world-index.json' with {type:'json'};
import RUNTIME from '../content/news-runtime.json' with {type:'json'};
import {inspectReadiness} from '../scripts/news/readiness.mjs';
import {execFileSync} from 'node:child_process';
import {retainSignedJournal} from '../scripts/news/journal.mjs';
import {writeFile} from 'node:fs/promises';
import {publishEdition} from '../scripts/news/lane.mjs';
const now=new Date('2026-10-12T12:00:00Z'),topicIds=TOPICS.map(t=>t.id);
test('source inspection reports actual failed access separately from activation and never changes production flags',async()=>{
 const before=JSON.stringify(POLICY),r=await inspectReadiness({policy:POLICY,runtime:RUNTIME,content:CONTENT,topicIds,now,fetchImpl:async()=>{throw Error('Synthetic unreachable original host');}});
 assert.equal(r.status,'blocked');assert.equal(r.operativelyActive,false);assert.equal(r.originalGeneratedSigned,false);assert.equal(r.blockers.filter(b=>b.area==='source').length,3);assert.ok(r.blockers.some(b=>b.area==='hosting'));assert.equal(JSON.stringify(POLICY),before);
});
test('honest no-new daily status advances its signed day without changing old article dates; same day remains idempotent',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'wk-news-day-'));try{
  const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']),keyId='test-day',keys={[keyId]:await crypto.subtle.exportKey('jwk',pair.publicKey)};
  const config={directory,payload:CONTENT,policy:{...POLICY,publicationEnabled:true,schedulerEnabled:true},privateKey:pair.privateKey,keyId,keys,topicIds,state:'no-new-items',attempts:1};
  const first=await publishEdition({...config,now}),second=await publishEdition({...config,now:new Date('2026-10-13T12:00:00Z')});
  assert.equal(second.envelope.day,'2026-10-13');assert.equal(second.envelope.sequence,first.envelope.sequence+1);assert.equal(second.envelope.fingerprint,first.envelope.fingerprint);assert.deepEqual(second.envelope.payload.entries,first.envelope.payload.entries);
  assert.equal((await publishEdition({...config,now:new Date('2026-10-13T13:00:00Z')})).status,'unchanged');
 }finally{await rm(directory,{recursive:true,force:true});}
});

test('signed journal changes only JSON in its separate branch and refuses the application, dirty source tree and wrong branch',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'wk-news-git-')),directory=await mkdtemp(path.join(tmpdir(),'wk-news-publish-'));const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
 try{
  git('init','-b','news-content');git('remote','add','origin','https://github.com/synthetic/news-only.git');await writeFile(path.join(root,'runtime.txt'),'synthetic trusted runtime');git('add','runtime.txt');git('-c','user.name=Test','-c','user.email=test@example.invalid','commit','-m','baseline');
  const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']),keyId='test-journal',keys={[keyId]:await crypto.subtle.exportKey('jwk',pair.publicKey)},policy={...POLICY,publicationEnabled:true,schedulerEnabled:true};
  await publishEdition({directory,payload:CONTENT,policy,privateKey:pair.privateKey,keyId,keys,topicIds,now});
  const runtime={mode:'pages',allowedRepository:'synthetic/news-only',allowedBranch:'news-content',keys},config={root,directory,runtime,policy,topicIds,now,repository:'synthetic/news-only'};
  await assert.rejects(retainSignedJournal({...config,repository:'Arizona2k/wunderkompass'}),/separate/);
  const result=await retainSignedJournal(config);assert.equal(result.status,'retained');assert.ok(result.files.every(f=>f.startsWith('news-data/')));assert.equal(git('show','HEAD:runtime.txt'),'synthetic trusted runtime');assert.equal((await retainSignedJournal(config)).status,'unchanged');
  await writeFile(path.join(root,'runtime.txt'),'unreviewed change');await assert.rejects(retainSignedJournal(config),/sauberen/);git('restore','runtime.txt');git('checkout','-b','wrong');await assert.rejects(retainSignedJournal(config),/sauberen/);
 }finally{await rm(root,{recursive:true,force:true});await rm(directory,{recursive:true,force:true});}
});
