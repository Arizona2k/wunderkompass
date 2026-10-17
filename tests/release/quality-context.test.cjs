const test = require('node:test');
const assert = require('node:assert/strict');
const {context, assertContext, validateLive} = require('../../scripts/release/quality-context.cjs');
const A='a'.repeat(40), B='b'.repeat(40), M='c'.repeat(40), repo='Arizona2k/wunderkompass';
function fixture() {
  const env={GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1',GITHUB_REPOSITORY:repo,GITHUB_SHA:M,
    GITHUB_EVENT_NAME:'pull_request',GITHUB_REF:'refs/pull/34/merge',
    GITHUB_WORKFLOW_REF:repo+'/.github/workflows/quality.yml@refs/pull/34/merge',GITHUB_WORKFLOW_SHA:M};
  const pr={number:34,state:'open',draft:false,head:{sha:B,repo:{full_name:repo}},
    base:{sha:A,ref:'test-live',repo:{full_name:repo}},merge_commit_sha:M};
  const run={id:123,run_attempt:1,event:'pull_request',path:'.github/workflows/quality.yml',head_sha:B,repository:{full_name:repo}};
  return {env,event:{number:34,pull_request:pr},parents:[A,B],pr,run};
}
test('Quality receipt binds exact PR, base, synthetic integration, run and workflow; manual/local cannot auto-release',()=>{
  const f=fixture(), saved=context(f.env,f.event,M,f.parents);
  assert.equal(saved.automatic,true);assert.equal(saved.head,B);assert.equal(saved.base,A);
  assert.equal(validateLive(saved,f.pr,f.run),true);assertContext(saved,structuredClone(saved));
  assert.deepEqual(context({}, {}, '', []),{event:'local',automatic:false});
  f.env.GITHUB_EVENT_NAME='workflow_dispatch';assert.equal(context(f.env,{},M,[]).automatic,false);
});
for (const [name,change] of [
  ['foreign repository',f=>{f.env.GITHUB_REPOSITORY='other/repo';}],
  ['wrong workflow',f=>{f.env.GITHUB_WORKFLOW_REF=f.env.GITHUB_WORKFLOW_REF.replace('quality.yml','spoof.yml');}],
  ['missing workflow commit',f=>{delete f.env.GITHUB_WORKFLOW_SHA;}],
  ['different workflow commit',f=>{f.env.GITHUB_WORKFLOW_SHA=A;}],
  ['missing run attempt',f=>{delete f.env.GITHUB_RUN_ATTEMPT;}],
  ['wrong event',f=>{f.env.GITHUB_EVENT_NAME='pull_request_target';}],
  ['head checkout instead of integration',f=>{f.env.GITHUB_SHA=B;}],
  ['missing merge parent',f=>{f.parents.pop();}],
  ['different merge base',f=>{f.parents[0]=B;}],
  ['reversed parents',f=>{f.parents.reverse();}],
  ['wrong PR ref',f=>{f.env.GITHUB_REF='refs/pull/35/merge';}],
  ['missing target',f=>{delete f.pr.base.sha;}],
]) test('rejects '+name,()=>{const f=fixture();change(f);assert.throws(()=>context(f.env,f.event,M,f.parents));});
for (const [name,change] of [
  ['pushed head',f=>{f.pr.head.sha=A;}],['advanced target',f=>{f.pr.base.sha=B;}],
  ['new integration',f=>{f.pr.merge_commit_sha=A;}],['closed PR',f=>{f.pr.state='closed';}],
  ['another PR',f=>{f.pr.number=35;}],['another target',f=>{f.pr.base.ref='main';}],
  ['another run',f=>{f.run.id=124;}],['another attempt',f=>{f.run.run_attempt=2;}],
  ['manual run',f=>{f.run.event='workflow_dispatch';}],['spoof workflow',f=>{f.run.path='.github/workflows/other.yml';}],
  ['other run head',f=>{f.run.head_sha=A;}],['foreign run',f=>{f.run.repository.full_name='other/repo';}],
]) test('live check rejects '+name,()=>{const f=fixture(),saved=context(f.env,f.event,M,f.parents);change(f);assert.throws(()=>validateLive(saved,f.pr,f.run));});
test('mixed or absent workflow context cannot join a same-build proof',()=>{
  const f=fixture(),saved=context(f.env,f.event,M,f.parents);
  for(const key of Object.keys(saved)){const next=structuredClone(saved);delete next[key];assert.throws(()=>assertContext(next,saved));}
  assert.throws(()=>assertContext(null,saved));
});
test('actual depth-1 checkout retains integration parents through raw commit headers',t=>{
  const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'wk-context-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const source=path.join(root,'source'),shallow=path.join(root,'shallow');fs.mkdirSync(source);
  const git=(...args)=>execFileSync('git',args,{cwd:source,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init');git('config','user.name','Synthetic QA');git('config','user.email','qa@example.invalid');
  fs.writeFileSync(path.join(source,'file'),'base');git('add','.');git('commit','-m','base');const base=git('rev-parse','HEAD');
  fs.writeFileSync(path.join(source,'file'),'head');git('commit','-am','head');const head=git('rev-parse','HEAD');
  const merge=git('commit-tree','HEAD^{tree}','-p',base,'-p',head,'-m','synthetic integration');git('update-ref','refs/heads/integration',merge);
  execFileSync('git',['clone','--depth=1','--branch=integration','file://'+source,shallow],{stdio:'pipe'});
  assert.equal(fs.existsSync(path.join(shallow,'.git/shallow')),true);
  const f=fixture();f.env.GITHUB_SHA=merge;f.env.GITHUB_WORKFLOW_SHA=merge;f.pr.head.sha=head;f.pr.base.sha=base;
  const eventFile=path.join(root,'event.json');fs.writeFileSync(eventFile,JSON.stringify(f.event));
  const modulePath=path.resolve(__dirname,'../../scripts/release/quality-context.cjs');
  const output=execFileSync(process.execPath,['-e',`console.log(JSON.stringify(require(${JSON.stringify(modulePath)}).currentContext()))`],{
    cwd:shallow,encoding:'utf8',env:{...process.env,...f.env,GITHUB_EVENT_PATH:eventFile}});
  const result=JSON.parse(output);assert.equal(result.testedCommit,merge);assert.equal(result.base,base);assert.equal(result.head,head);
  f.pr.merge_commit_sha=merge;f.run.head_sha=head;
  const program=`
    const assert=require('node:assert/strict');
    const {currentContext,verifyLive}=require(${JSON.stringify(modulePath)});
    const saved=currentContext(),pr=${JSON.stringify(f.pr)},run=${JSON.stringify(f.run)};
    (async()=>{
      for(const mode of ['valid','forbidden','unavailable','changed-base']){
        const calls=[];
        const request=async(url,options)=>{
          calls.push(url);assert.equal(options.redirect,'error');assert.ok(options.signal);
          assert.equal(options.method,undefined); // fetch defaults to GET, no mutation.
          assert.ok(url.startsWith('https://api.github.com/repos/Arizona2k/wunderkompass/'));
          if(mode==='unavailable')throw Error('synthetic network failure');
          if(mode==='forbidden')return {ok:false,status:403};
          return {ok:true,json:async()=>url.includes('/pulls/')?{...pr,...(mode==='changed-base'?{base:{...pr.base,sha:pr.head.sha}}:{})}:run};
        };
        if(mode==='valid'){await verifyLive(saved,process.env,request);assert.equal(calls.length,2);}
        else await assert.rejects(verifyLive(saved,process.env,request));
      }
      await assert.rejects(verifyLive(saved,{...process.env,GITHUB_TOKEN:''}),/token required/);
      console.log('actual shallow context and read-only API recovery/denial guards passed');
    })().catch(e=>{console.error(e.message);process.exitCode=1;});`;
  const apiOutput=execFileSync(process.execPath,['-e',program],{cwd:shallow,encoding:'utf8',env:{...process.env,...f.env,GITHUB_EVENT_PATH:eventFile,GITHUB_TOKEN:'synthetic-qa-token'}});
  assert.match(apiOutput,/guards passed/);
});

test('draft QA receipt records eligible source/target; fresh readiness still excludes drafts',()=>{
 const f=fixture();f.pr.draft=true;assert.equal(context(f.env,f.event,M,f.parents).automatic,true);
});
