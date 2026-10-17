const test=require('node:test'),assert=require('node:assert/strict');
const {readiness,critical}=require('../../scripts/release/test-live-readiness.cjs');
const A='a'.repeat(40),B='b'.repeat(40),M='c'.repeat(40),repo='Arizona2k/wunderkompass';
const config={repository:repo,target:'test-live',setupHeadRef:'codex/setup',qualityWorkflowId:379737085,qualityAppId:15368,validBefore:'2026-11-15T23:00:00.000Z'};
const now=new Date('2026-10-17T12:00:00Z');
function fixture(){return {
  setup:{number:34,head:{ref:'codex/setup',repo:{full_name:repo}},merged:true,merge_commit_sha:M,base:{ref:'test-live',repo:{full_name:repo}},merged_by:{login:'Arizona2k'}},setupIncluded:true,
  repository:{full_name:repo,permissions:{push:true}},targetSha:A,
  pr:{number:35,state:'open',draft:false,user:{login:'Arizona2k'},base:{sha:A,ref:'test-live',repo:{full_name:repo}},head:{sha:B,ref:'codex/animals',repo:{full_name:repo}},merge_commit_sha:M,mergeable:true,mergeable_state:'clean',changed_files:2},
  files:[{filename:'app/animals.tsx',status:'modified'},{filename:'tests/animals.test.mjs',status:'added'}],
  productReview:{complete:true,noGateWeakening:true,head:B,base:A},deploymentHealthy:true,changesRequested:false,otherActiveRelease:false,foreignReservation:false,
  rules:{enforcement:'active',bypass_actors:[],conditions:{ref_name:{include:['refs/heads/test-live'],exclude:[]}},rules:[{type:'pull_request'},{type:'required_status_checks',parameters:{strict_required_status_checks_policy:true,required_status_checks:[{context:'Required quality checks',integration_id:15368}]}}]},
  quality:{id:123,run_attempt:1,workflow_id:379737085,path:'.github/workflows/quality.yml',repository:{full_name:repo},head_sha:B,event:'pull_request',status:'completed',conclusion:'success'},latestQualityRun:123,
  check:{id:456,name:'Required quality checks',status:'completed',conclusion:'success',head_sha:B,app:{id:15368},details_url:`https://github.com/${repo}/actions/runs/123/job/456`},
  receipt:{repository:repo,event:'pull_request',automatic:true,pr:35,head:B,base:A,target:'test-live',testedCommit:M,workflowSha:M,runId:'123',attempt:'1',workflowRef:repo+'/.github/workflows/quality.yml@refs/pull/35/merge'}
};}
test('same-head complete routine PR may use regular protected merge; normal tests/docs need no new blanket approval',()=>{
  const f=fixture();assert.equal(readiness(f,now,config).eligible,true);assert.equal(readiness(f,now,config).automaticQueueAllowed,false);
  for(const path of ['tests/animal-search.test.mjs','tests/browser/animal-learning.mjs','BACKLOG.md','PROJECT_STATE.md','CHANGELOG.md'])assert.equal(critical(path),false);
});
for(const [name,change] of [
  ['missing base in all partially read facts',f=>{delete f.pr.base.sha;delete f.targetSha;delete f.receipt.base;delete f.productReview.base;}],
  ['missing draft state',f=>{delete f.pr.draft;}],['invalid PR number',f=>{f.pr.number='35';}],
  ['missing reported write access',f=>{delete f.repository.permissions;}],
  ['missing file status',f=>{delete f.files[0].status;}],
  ['unknown file status',f=>{f.files[0].status='unknown';}],
  ['renamed source missing',f=>{f.files[0].status='renamed';}],
  ['empty renamed source',f=>{f.files[0].status='renamed';f.files[0].previous_filename='';}],
  ['duplicate file list',f=>{f.files[1]={...f.files[0]};}],
  ['missing changes-requested observation',f=>{delete f.changesRequested;}],
  ['missing release-concurrency observation',f=>{delete f.otherActiveRelease;}],
  ['missing reservation observation',f=>{delete f.foreignReservation;}],
  ['unknown deployment',f=>{delete f.deploymentHealthy;}],
  ['string review approval',f=>{f.productReview.complete='false';}],
  ['string safety approval',f=>{f.productReview.noGateWeakening='false';}],
  ['string setup merge',f=>{f.setup.merged='false';}],
  ['missing setup merge commit',f=>{delete f.setup.merge_commit_sha;}],
  ['foreign setup target',f=>{f.setup.base.repo.full_name='other/repo';}],
  ['missing workflow source commit',f=>{delete f.receipt.workflowSha;}],
  ['different workflow source commit',f=>{f.receipt.workflowSha=A;}],
  ['missing run ID',f=>{delete f.quality.id;delete f.latestQualityRun;}],
  ['missing run attempt',f=>{delete f.quality.run_attempt;f.receipt.attempt='undefined';}],
  ['missing check ID',f=>{delete f.check.id;}],
  ['setup unmerged',f=>{f.setup.merged=false;}],['setup not owner-approved',f=>{f.setup.merged_by.login='bot';}],
  ['setup absent from target',f=>{f.setupIncluded=false;}],['master draft',f=>{f.pr.number=27;}],
  ['draft',f=>{f.pr.draft=true;}],['closed',f=>{f.pr.state='closed';}],['wrong target',f=>{f.pr.base.ref='main';}],
  ['fork',f=>{f.pr.head.repo.full_name='other/repo';}],['unresolved mergeability',f=>{f.pr.mergeable=null;}],
  ['stale base',f=>{f.targetSha=B;}],['truncated files',f=>{f.pr.changed_files=3;}],
  ['protected workflow',f=>{f.files[0].filename='.github/workflows/quality.yml';}],
  ['test loader foundation',f=>{f.files[0].filename='scripts/test-runtime.mjs';}],
  ['QA dependency foundation',f=>{f.files[0].filename='qa/pnpm-lock.yaml';}],
  ['typecheck foundation',f=>{f.files[0].filename='tsconfig.json';}],
  ['frozen subject baseline',f=>{f.files[0].filename='content/excellence-baseline.json';}],
  ['missing filename',f=>{delete f.files[0].filename;}],
  ['unsafe filename',f=>{f.files[0].filename='app/../AGENTS.md';}],
  ['renamed security file',f=>{f.files[0].previous_filename='scripts/release/policy.cjs';}],
  ['weakened quality gate',f=>{f.productReview.noGateWeakening=false;}],['old diff review',f=>{f.productReview.head=A;}],
  ['unconfirmed deployment',f=>{f.deploymentHealthy=false;}],['change request',f=>{f.changesRequested=true;}],
  ['another release',f=>{f.otherActiveRelease=true;}],['foreign lock',f=>{f.foreignReservation=true;}],
  ['disabled ruleset',f=>{f.rules.enforcement='disabled';}],['admin bypass',f=>{f.rules.bypass_actors=[{actor_type:'RepositoryRole',actor_id:5}];}],
  ['non-strict checks',f=>{f.rules.rules[1].parameters.strict_required_status_checks_policy=false;}],
  ['wrong source app',f=>{f.rules.rules[1].parameters.required_status_checks[0].integration_id=1;}],
  ['no pull-request rule',f=>{f.rules.rules.shift();}],['rules exclude target',f=>{f.rules.conditions.ref_name.exclude=['refs/heads/test-live'];}],
  ['wrong workflow ID',f=>{f.quality.workflow_id=1;}],['wrong workflow path',f=>{f.quality.path='spoof.yml';}],
  ['old head run',f=>{f.quality.head_sha=A;}],['manual run',f=>{f.quality.event='workflow_dispatch';}],
  ['incomplete run',f=>{f.quality.status='in_progress';}],['cancelled run',f=>{f.quality.conclusion='cancelled';}],
  ['newer Quality run',f=>{f.latestQualityRun=124;}],['foreign check app',f=>{f.check.app.id=1;}],
  ['spoofed same-name check',f=>{f.check.details_url=f.check.details_url.replace('/123/','/124/');}],
  ['skipped check',f=>{f.check.conclusion='skipped';}],['different check head',f=>{f.check.head_sha=A;}],
  ['old proof base',f=>{f.receipt.base=B;}],['missing receipt',f=>{delete f.receipt;}],
  ['old proof attempt',f=>{f.receipt.attempt='2';}],['wrong integration',f=>{f.receipt.testedCommit=A;}],
  ['local evidence',f=>{f.receipt.automatic=false;}],['another PR receipt',f=>{f.receipt.pr=36;}]
])test('blocks '+name,()=>{const f=fixture();change(f);assert.throws(()=>readiness(f,now,config));});
test('operating permit expires before Pro day begins; no silent extension or invalid date',()=>{
  assert.equal(readiness(fixture(),new Date('2026-11-15T22:54:59Z'),config).eligible,true);
  for(const time of ['2026-11-15T22:55:00Z','2026-11-15T23:00:00Z','2026-11-16T12:00:00Z','2027-01-01','invalid'])assert.throws(()=>readiness(fixture(),new Date(time),config),/expired/);
  assert.throws(()=>readiness(fixture(),now,{...config,setupHeadRef:null}),/setup/);
  assert.throws(()=>readiness(fixture(),now,{...config,validBefore:'unknown'}),/expired/);
});

test('a fully tested exact draft can become eligible after Ready without rerunning identical tests',()=>{
 const f=fixture();f.pr.draft=true;assert.throws(()=>readiness(f,now,config));
 f.pr.draft=false;assert.equal(readiness(f,now,config).eligible,true);
});
