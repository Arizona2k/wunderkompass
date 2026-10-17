// Shared by the existing combined and split Quality workflows. Read-only.
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {isDeepStrictEqual} = require('node:util');
const SHA = /^[a-f0-9]{40}$/;
const REPO = 'Arizona2k/wunderkompass';
function context(env, event, commit, parents) {
  if (!env.GITHUB_RUN_ID) return {event: 'local', automatic: false};
  if (env.GITHUB_REPOSITORY !== REPO || !SHA.test(commit) || env.GITHUB_SHA !== commit ||
      !/^\d+$/.test(env.GITHUB_RUN_ID) || !/^[1-9]\d*$/.test(env.GITHUB_RUN_ATTEMPT || '') ||
      env.GITHUB_WORKFLOW_REF !== `${REPO}/.github/workflows/quality.yml@${env.GITHUB_REF}` ||
      !SHA.test(env.GITHUB_WORKFLOW_SHA || '')) throw Error('Unexpected Quality workflow origin');
  const common = {event: env.GITHUB_EVENT_NAME, repository: REPO, runId: env.GITHUB_RUN_ID,
    attempt: env.GITHUB_RUN_ATTEMPT, testedCommit: commit, workflowRef: env.GITHUB_WORKFLOW_REF,
    workflowSha: env.GITHUB_WORKFLOW_SHA};
  if (env.GITHUB_EVENT_NAME === 'workflow_dispatch') return {...common, automatic: false};
  const pr = event.pull_request;
  if (env.GITHUB_EVENT_NAME !== 'pull_request' || !Number.isSafeInteger(pr?.number) ||
      event.number !== pr.number || env.GITHUB_REF !== `refs/pull/${pr.number}/merge` ||
      !['test-live', 'main'].includes(pr.base?.ref) || pr.base.repo?.full_name !== REPO ||
      !SHA.test(pr.head?.sha || '') || !SHA.test(pr.base?.sha || '') ||
      !isDeepStrictEqual(parents, [pr.base.sha, pr.head.sha])) throw Error('PR integration context missing or mismatched');
  return {...common, pr: pr.number, head: pr.head.sha, base: pr.base.sha, target: pr.base.ref,
    automatic: pr.base.ref === 'test-live' && pr.head.repo?.full_name === REPO && !pr.draft};
}
function currentContext(env = process.env) {
  if (!env.GITHUB_RUN_ID) return {event: 'local', automatic: false};
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
  // Raw commit headers also work in checkout's depth-1 shallow repository.
  const parents = execFileSync('git', ['cat-file', '-p', 'HEAD'], {encoding:'utf8'}).split('\n\n')[0]
    .split('\n').filter(line => line.startsWith('parent ')).map(line => line.slice(7));
  return context(env, JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8')), commit, parents);
}
function assertContext(actual, expected) {
  if (!actual || !isDeepStrictEqual(actual, expected)) throw Error('Quality PR/base/workflow context changed');
}
function validateLive(saved, pr, run) {
  if (pr.number !== saved.pr || pr.state !== 'open' || pr.head?.sha !== saved.head ||
      pr.base?.sha !== saved.base || pr.base?.ref !== saved.target || pr.base?.repo?.full_name !== REPO ||
      pr.merge_commit_sha !== saved.testedCommit || run.id !== Number(saved.runId) ||
      run.run_attempt !== Number(saved.attempt) || run.event !== 'pull_request' ||
      run.path !== '.github/workflows/quality.yml' || run.head_sha !== saved.head ||
      run.repository?.full_name !== REPO) throw Error('Current PR/base or expected Quality run no longer matches');
  return true;
}
async function verifyLive(saved, env = process.env, request = fetch) {
  assertContext(saved, currentContext(env));
  if (saved.event !== 'pull_request') return; // Local/manual QA is never an automatic release receipt.
  if (!env.GITHUB_TOKEN) throw Error('Read-only GitHub token required for current PR verification');
  async function get(resource) {
    const response = await request(`https://api.github.com/repos/${REPO}/${resource}`, {
      headers:{Accept:'application/vnd.github+json', Authorization:`Bearer ${env.GITHUB_TOKEN}`},
      signal:AbortSignal.timeout(15000), redirect:'error'});
    if (!response.ok) throw Error(`Cannot verify current Quality context (HTTP ${response.status})`);
    return response.json();
  }
  const [pr, run] = await Promise.all([get(`pulls/${saved.pr}`), get(`actions/runs/${saved.runId}`)]);
  validateLive(saved, pr, run);
}
module.exports = {context, currentContext, assertContext, validateLive, verifyLive};
if (require.main === module) (async () => {
  const file = '.qa-output/ci-context.json', mode = process.argv[2];
  if (mode === 'capture') {fs.mkdirSync('.qa-output', {recursive:true}); fs.writeFileSync(file, JSON.stringify(currentContext(), null, 2)+'\n');}
  else if (mode === 'verify') {await verifyLive(JSON.parse(fs.readFileSync(file, 'utf8'))); console.log('Current PR, target base, integration commit and expected Quality workflow verified.');}
  else throw Error('Use capture or verify');
})().catch(error => {console.error(error.message); process.exitCode = 1;});
