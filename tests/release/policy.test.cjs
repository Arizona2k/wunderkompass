const {test} = require('node:test');
const assert = require('node:assert/strict');
const {mkdtempSync, rmSync, writeFileSync} = require('node:fs');
const {tmpdir} = require('node:os');
const {join} = require('node:path');
const {execFileSync} = require('node:child_process');
const {validate, inspect, promote} = require('../../scripts/release/policy.cjs');
const A='a'.repeat(40), B='b'.repeat(40), C='c'.repeat(40);
function fixture() {
  const pr={number:3,changed_files:1,state:'open',draft:false,user:{login:'Arizona2k'},labels:[{name:'auto-test-live'}],base:{ref:'test-live',repo:{full_name:'Arizona2k/wunderkompass'}},head:{sha:B,ref:'codex/example',repo:{full_name:'Arizona2k/wunderkompass'}}};
  return {pr,peers:[pr],files:[{filename:'app/example.tsx'}],base:A,repository:'Arizona2k/wunderkompass',expectedHead:B,expectedBase:A};
}
test('eligible unchanged exact commit',()=>assert.deepEqual(validate(fixture()),{head:B,base:A}));
for (const [name,change] of [
  ['redraft',x=>x.pr.draft=true],['closed PR',x=>x.pr.state='closed'],['production target',x=>x.pr.base.ref='main'],
  ['foreign source',x=>x.pr.head.repo.full_name='other/repo'],['unexpected author',x=>x.pr.user.login='other'],
  ['release label removed',x=>x.pr.labels=[]],['changed head',x=>x.pr.head.sha=C],['changed base',x=>x.base=C],
  ['parallel development',x=>x.peers.push({...x.pr,number:4})],['workflow change',x=>x.files=[{filename:'.github/workflows/quality.yml'}]],
  ['test change',x=>x.files=[{filename:'tests/progress.test.mjs'}]],['build script change',x=>x.files=[{filename:'scripts/build.mjs'}]],
  ['dependency change',x=>x.files=[{filename:'pnpm-lock.yaml'}]],['policy change',x=>x.files=[{filename:'AGENTS.md'}]],
  ['rename from trusted configuration',x=>x.files=[{filename:'app/x.ts',previous_filename:'package.json'}]],
  ['malformed sha',x=>x.pr.head.sha='x; touch bad'],['empty diff',x=>x.files=[]],['truncated file list',x=>x.pr.changed_files=3001]
]) test(`blocks ${name}`,()=>{const f=fixture();change(f);assert.throws(()=>validate(f));});
test('API gate blocks diverged branch and requested changes',async()=>{
 const f=fixture(); let status='diverged', reviews=[];
 const github={rest:{pulls:{get:async()=>({data:f.pr}),list:'peers',listFiles:'files',listReviews:'reviews'},git:{getRef:async ({ref})=>{if(ref.startsWith('tags/')) throw Object.assign(Error('not found'),{status:404});return {data:{object:{sha:A}}};}},repos:{compareCommitsWithBasehead:async()=>({data:{status,merge_base_commit:{sha:A}}})}},paginate:async key=>({peers:f.peers,files:f.files,reviews}[key])};
 const context={repo:{owner:'Arizona2k',repo:'wunderkompass'},payload:{pull_request:{number:3,base:{sha:A}}}};
 await assert.rejects(inspect(github,context));
 status='ahead'; reviews=[{user:{login:'reviewer'},state:'CHANGES_REQUESTED'}];
 await assert.rejects(inspect(github,context));
 reviews.push({user:{login:'reviewer'},state:'APPROVED'});
 assert.deepEqual(await inspect(github,context),{head:B,base:A});
});
function repo(t) {
 const root=mkdtempSync(join(tmpdir(),'wk-release-')); t.after(()=>rmSync(root,{recursive:true,force:true}));
 const remote=join(root,'remote.git'),cwd=join(root,'checkout');
 const git=(...args)=>execFileSync('git',args,{cwd,stdio:'pipe'}).toString().trim();
 execFileSync('git',['init','--bare',remote],{stdio:'pipe'});
 execFileSync('git',['clone',remote,cwd],{stdio:'pipe'});
 git('config','user.email','test@example.invalid');git('config','user.name','Synthetic test');
 writeFileSync(join(cwd,'file'),'base');git('add','.');git('commit','-m','base');const base=git('rev-parse','HEAD');
 git('push','origin',`${base}:refs/heads/test-live`);git('push','origin',`${base}:refs/heads/main`);
 writeFileSync(join(cwd,'file'),'tested');git('commit','-am','candidate');const head=git('rev-parse','HEAD');git('push','origin',`${head}:refs/heads/codex/example`);
 return {cwd,remote,git,base,head};
}
test('real Git transfer publishes exact SHA, preserves rollback and main; duplicate rejected',t=>{
 const r=repo(t);const backup=promote({...r,runId:'12-1'});
 assert.equal(r.git('ls-remote','origin','refs/heads/test-live').split(/\s/)[0],r.head);
 assert.equal(r.git('ls-remote','origin',backup).split(/\s/)[0],r.base);
 assert.equal(r.git('ls-remote','origin','refs/heads/main').split(/\s/)[0],r.base);
 assert.throws(()=>promote({...r,runId:'12-2'}));
 // Rollback creates a forward commit with the prior tree, never rewrites history.
 const tree=r.git('rev-parse',`${r.base}^{tree}`);
 const rollback=r.git('commit-tree',tree,'-p',r.head,'-m','Restore previous tested tree');
 r.git('push',`--force-with-lease=refs/heads/test-live:${r.head}`,'origin',`${rollback}:refs/heads/test-live`);
 assert.equal(r.git('rev-parse',`${rollback}^{tree}`),tree);
 r.git('merge-base','--is-ancestor',r.head,rollback);
});
test('real Git refuses outdated target before publishing',t=>{
 const r=repo(t);r.git('push','origin',`${r.head}:refs/heads/test-live`);
 assert.throws(()=>promote({...r,runId:'13-1'}));
});
test('real Git refuses non-fast-forward candidate',t=>{
 const r=repo(t); r.git('checkout','--orphan','unrelated');r.git('commit','-am','unrelated');const unrelated=r.git('rev-parse','HEAD');
 r.git('push','origin',`${unrelated}:refs/heads/codex/unrelated`);
 assert.throws(()=>promote({...r,head:unrelated,runId:'14-1'}));
 assert.equal(r.git('ls-remote','origin','refs/heads/test-live').split(/\s/)[0],r.base);
});
test('server lease rejects a target change between last read and push',t=>{
 const r=repo(t);
 // The backup push causes a simultaneous writer to advance the target.
 writeFileSync(join(r.cwd,'file'),'other writer');r.git('commit','-am','other writer');
 const other=r.git('rev-parse','HEAD');r.git('push','origin',`${other}:refs/heads/codex/other`);
 writeFileSync(join(r.remote,'hooks','post-receive'),`#!/bin/sh\ngit update-ref refs/heads/test-live ${other}\n`,{mode:0o755});
 assert.throws(()=>promote({...r,runId:'15-1'}));
 assert.equal(r.git('ls-remote','origin','refs/heads/test-live').split(/\s/)[0],other);
 assert.equal(r.git('ls-remote','origin','refs/tags/test-live-backup/15-1').split(/\s/)[0],r.base);
});
test('backup failure prevents publication',t=>{
 const r=repo(t); r.git('push','origin',`${r.head}:refs/tags/test-live-backup/16-1`);
 assert.throws(()=>promote({...r,runId:'16-1'}));
 assert.equal(r.git('ls-remote','origin','refs/heads/test-live').split(/\s/)[0],r.base);
});
test('shared reservation is exclusive and only its owner can release it',t=>{
 const r=repo(t);const lock=require('../../scripts/release/development-lock.cjs');
 const owner=lock.claim(r.cwd,'first');
 assert.throws(()=>lock.claim(r.cwd,'second'));
 assert.throws(()=>lock.release(r.cwd,'a'.repeat(40)));
 assert.equal(r.git('ls-remote','origin',lock.ref).split(/\s/)[0],owner);
 lock.release(r.cwd,owner);
 assert.equal(r.git('ls-remote','origin',lock.ref),'');
 const next=lock.claim(r.cwd,'second');assert.notEqual(next,owner);lock.release(r.cwd,next);
});

test('active shared development reservation blocks publication',t=>{
 const r=repo(t),lock=require('../../scripts/release/development-lock.cjs');
 const owner=lock.claim(r.cwd,'active');
 assert.throws(()=>promote({...r,runId:'17-1'}));
 assert.equal(r.git('ls-remote','origin','refs/heads/test-live').split(/\s/)[0],r.base);
 lock.release(r.cwd,owner);
});
