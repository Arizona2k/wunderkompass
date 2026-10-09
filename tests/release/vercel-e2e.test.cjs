const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {transfer, observe, branchFor, requireVercelBaseline, CANDIDATE} = require('../../scripts/release/vercel-e2e.cjs');

const baselineSuccess = {context:'Vercel',state:'success',creator:{login:'vercel[bot]'}};
function baselineApi(statuses) {
  const listCommitStatusesForRef = () => {};
  return {rest:{repos:{listCommitStatusesForRef}},paginate:async(method,params)=> {
    assert.equal(method,listCommitStatusesForRef);
    assert.deepEqual(params,{owner:'Arizona2k',repo:'wunderkompass',ref:CANDIDATE,per_page:100});
    return statuses;
  }};
}
const baselineOptions = {owner:'Arizona2k',repo:'wunderkompass'};
test('baseline uses paginated individual statuses and accepts genuine Vercel success',async()=> {
  const statuses = [...Array.from({length:100},()=>({context:'Other',state:'failure'})),baselineSuccess];
  assert.equal(await requireVercelBaseline({...baselineOptions,github:baselineApi(statuses)}),baselineSuccess);
});
test('baseline rejects missing/null creator including combined-status shape',async()=> {
  for(const creator of [undefined,null,{}])
    await assert.rejects(requireVercelBaseline({...baselineOptions,github:baselineApi([{...baselineSuccess,creator}])}),/No existing successful/);
});
test('baseline rejects wrong bots and unknown or empty contexts',async()=> {
  for(const statuses of [[],[{...baselineSuccess,context:'Other'}],
    [{...baselineSuccess,creator:{login:'github-actions[bot]'}}],
    [{...baselineSuccess,creator:{login:'vercel'}}]])
    await assert.rejects(requireVercelBaseline({...baselineOptions,github:baselineApi(statuses)}),/No existing successful/);
});
test('latest relevant status blocks older success on failure/error/pending or untrusted creator',async()=> {
  for(const change of [{state:'failure'},{state:'error'},{state:'pending'},
    {creator:undefined},{creator:{login:'someone'}}])
    await assert.rejects(requireVercelBaseline({...baselineOptions,github:baselineApi([
      {context:'Other',state:'success'},{...baselineSuccess,...change},baselineSuccess
    ])}),/No existing successful/);
});
test('latest Vercel success supersedes older failure',async()=> {
  assert.equal(await requireVercelBaseline({...baselineOptions,github:baselineApi([
    baselineSuccess,{...baselineSuccess,state:'failure'}
  ])}),baselineSuccess);
});
test('baseline API errors propagate without approval',async()=> {
  const github=baselineApi([]);
  github.paginate=async()=>{throw Error('API unavailable');};
  await assert.rejects(requireVercelBaseline({...baselineOptions,github}),/API unavailable/);
});
test('actual authorize workflow script checks baseline before emitting branch snapshots',async()=> {
  const workflow=fs.readFileSync(path.join(__dirname,'../../.github/workflows/vercel-e2e.yml'),'utf8');
  const script=workflow.split('          script: |\n')[1].split('\n  checks:')[0];
  const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
  const authorize=new AsyncFunction('require','github','context','core',script);
  for(const trusted of [true,false]) {
    const github=baselineApi([{...baselineSuccess,creator:trusted?{login:'vercel[bot]'}:undefined}]);
    github.rest.repos.getCommit=async()=>({data:{sha:CANDIDATE,author:{login:'Arizona2k'}}});
    github.rest.git={getRef:async()=>({data:{object:{sha:'synthetic-snapshot'}}})};
    const outputs=[];
    const run=()=>authorize(()=>({...require('../../scripts/release/vercel-e2e.cjs'),EXPIRES:Infinity}),
      github,{repo:baselineOptions},{setOutput:(...args)=>outputs.push(args)});
    if(trusted) {
      await run();
      assert.deepEqual(outputs,[['main','synthetic-snapshot'],['testlive','synthetic-snapshot']]);
    } else {
      await assert.rejects(run(),/No existing successful/);
      assert.deepEqual(outputs,[]);
    }
  }
});

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'wk-preview-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const remote = path.join(root, 'remote.git'), cwd = path.join(root, 'client');
  const env = {...process.env, GIT_AUTHOR_NAME:'Synthetic owner', GIT_AUTHOR_EMAIL:'owner@example.invalid',
    GIT_COMMITTER_NAME:'Synthetic owner', GIT_COMMITTER_EMAIL:'owner@example.invalid'};
  const git = (...args) => execFileSync('git',args,{cwd:root,env,stdio:['pipe','pipe','pipe']}).toString().trim();
  git('init','--bare',remote); git('init',cwd);
  git('-C',cwd,'remote','add','origin',remote);
  const tree = git('-C',cwd,'mktree');
  const candidate = git('-C',cwd,'commit-tree',tree,'-m','Already authorized synthetic commit');
  git('-C',cwd,'push','origin',candidate+':refs/heads/main',candidate+':refs/heads/test-live');
  const snapshot = () => git('-C',cwd,'ls-remote','--refs','origin','refs/heads/main','refs/heads/test-live');
  return {root, remote, cwd, candidate, git, snapshot};
}

test('existing commit and author copied byte-for-byte; prior branches preserved',t => {
  const f = fixture(t), before = f.snapshot();
  const object = f.git('-C',f.cwd,'cat-file','commit',f.candidate);
  const r = transfer({...f,runId:'123-1',expectedBranches:before,remote:'origin'});
  assert.equal(r.pushed,true); assert.equal(r.protectedBranchesUnchanged,true);
  assert.equal(f.git('--git-dir='+f.remote,'rev-parse','refs/heads/'+r.branch),f.candidate);
  assert.equal(f.git('--git-dir='+f.remote,'cat-file','commit',f.candidate),object);
  assert.equal(f.snapshot(),before);
});
test('existing run branch is never overwritten',t => {
  const f=fixture(t), args={...f,runId:'123-1',expectedBranches:f.snapshot(),remote:'origin'};
  transfer(args); assert.throws(()=>transfer(args),/Target exists/);
});
test('snapshot mismatch refuses all writes',t => {
  const f=fixture(t);
  assert.throws(()=>transfer({...f,runId:'123-1',expectedBranches:'outdated'}),/snapshot mismatch/);
  assert.equal(f.git('--git-dir='+f.remote,'for-each-ref','--format=%(refname)','refs/heads/wk-vercel-e2e-'),'');
});
test('server denies push; existing branches survive and no test ref appears',t => {
  const f=fixture(t), before=f.snapshot();
  fs.writeFileSync(path.join(f.remote,'hooks','pre-receive'),'#!/bin/sh\nexit 1\n',{mode:0o755});
  assert.throws(()=>transfer({...f,runId:'123-1',expectedBranches:before}),/Git operation failed/);
  assert.equal(f.snapshot(),before);
  assert.equal(f.git('--git-dir='+f.remote,'for-each-ref','--format=%(refname)','refs/heads/wk-vercel-e2e-'),'');
});
test('atomic create lease rejects a concurrent foreign branch',t => {
  const f=fixture(t), before=f.snapshot();
  // update hook inserts a competing ref after the client observed absence.
  const foreign=f.git('-C',f.cwd,'commit-tree',f.git('-C',f.cwd,'mktree'),'-m','Foreign commit');
  f.git('-C',f.cwd,'push','origin',foreign+':refs/tags/synthetic-foreign-object');
  fs.writeFileSync(path.join(f.remote,'hooks','update'),
    `#!/bin/sh\ngit update-ref "$1" ${foreign}\nexit 0\n`,{mode:0o755});
  assert.throws(()=>transfer({...f,runId:'123-1',expectedBranches:before}),/Git operation failed/);
  assert.equal(f.git('--git-dir='+f.remote,'rev-parse','refs/heads/wk-vercel-e2e-123-1'),foreign);
  assert.equal(f.snapshot(),before);
});
test('unsafe identifiers cannot target an existing branch',()=> {
  for(const id of ['main','test-live','1-1:main','../main','1;echo x']) assert.throws(()=>branchFor(id));
});
test('external main change is detected after push and never blindly restored',t => {
  const f=fixture(t), before=f.snapshot();
  const foreign=f.git('-C',f.cwd,'commit-tree',f.git('-C',f.cwd,'mktree'),'-m','External change');
  f.git('-C',f.cwd,'push','origin',foreign+':refs/tags/synthetic-external-object');
  fs.writeFileSync(path.join(f.remote,'hooks','update'),
    `#!/bin/sh\ngit update-ref refs/heads/main ${foreign}\nexit 0\n`,{mode:0o755});
  assert.throws(()=>transfer({...f,runId:'123-1',expectedBranches:before}),/changed externally/);
  assert.equal(f.git('--git-dir='+f.remote,'rev-parse','refs/heads/main'),foreign);
  assert.equal(f.git('--git-dir='+f.remote,'rev-parse','refs/heads/test-live'),f.candidate);
});

const candidate='a'.repeat(40), since='2026-10-09T18:00:00Z', branch='wk-vercel-e2e-123-1';
const deployment={id:9,sha:candidate,ref:branch,created_at:since,creator:{login:'vercel[bot]'},environment:'Preview',production_environment:false};
const success={state:'success',creator:{login:'vercel[bot]'},environment_url:'https://wunderkompass-unique.vercel.app'};
function api(deployments,statuses) {
  return {paginate:async()=>deployments,rest:{repos:{listDeployments(){},listDeploymentStatuses:async()=>({data:statuses})}}};
}
const options={branch,candidate,since,attempts:1,delay:async()=>{}};
test('new Preview record for exact branch/SHA is provisional, browser remains pending',async()=> {
  const r=await observe({...options,github:api([deployment],[success])});
  assert.equal(r.deploymentId,9); assert.equal(r.browserAcceptance,'PENDING');
});
test('stale, wrong branch/SHA and non-Vercel records never count',async()=> {
  for(const change of [{created_at:'2026-10-08T00:00:00Z'},{ref:'test-live'},{sha:'b'.repeat(40)},{creator:{login:'someone'}}])
    await assert.rejects(observe({...options,github:api([{...deployment,...change}],[success])}),/deadline/);
});
test('failure, error, inactive and production fail without falling back to older success',async()=> {
  for(const state of ['failure','error','inactive'])
    await assert.rejects(observe({...options,github:api([deployment],[{...success,state},success])}),/ended with/);
  await assert.rejects(observe({...options,github:api([{...deployment,production_environment:true}],[success])}),/production/);
});
test('pending and missing deployments time out; no successful outcome fabricated',async()=> {
  for(const deployments of [[],[deployment]])
    await assert.rejects(observe({...options,github:api(deployments,[{...success,state:'pending'}])}),/deadline/);
});
test('newest matching deployment cannot inherit an older deployment success',async()=> {
  const github=api([{...deployment,id:8},deployment],[]);
  github.rest.repos.listDeploymentStatuses=async({deployment_id})=>({data:deployment_id===8?[success]:[{...success,state:'pending'}]});
  await assert.rejects(observe({...options,github}),/deadline/);
});
test('URL with bypass secret or wrong host is rejected',async()=> {
  for(const url of ['http://foo.vercel.app','https://evil.example','https://foo.vercel.app?token=synthetic','https://user:synthetic@foo.vercel.app'])
    await assert.rejects(observe({...options,github:api([deployment],[{...success,environment_url:url}])}),/Unexpected preview URL/);
});
test('deployment status requires Vercel creator; no fallback to older trusted success',async()=> {
  for(const creator of [undefined,null,{login:'someone'}])
    await assert.rejects(observe({...options,github:api([deployment],[{...success,creator},success])}),/Untrusted deployment status/);
});
