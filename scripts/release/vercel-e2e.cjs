const { execFileSync } = require('node:child_process');
const CANDIDATE = '4b73cdb4ab049bcfe227fd43f07c80e8ffe68b0f';
const REPOSITORY = 'Arizona2k/wunderkompass';
const PREFIX = 'wk-vercel-e2e-';
const EXPIRES = Date.parse('2026-10-16T00:00:00Z');

async function requireVercelBaseline({ github, owner, repo, candidate = CANDIDATE }) {
  // Combined statuses omit creator. Individual statuses include it and are
  // returned newest first, across pages. Select the context before validation:
  // a newer failure or untrusted creator must never expose an older success.
  const statuses = await github.paginate(github.rest.repos.listCommitStatusesForRef,
    { owner, repo, ref: candidate, per_page: 100 });
  const latest = statuses.find(s => s.context === 'Vercel');
  if (latest?.state !== 'success' || latest.creator?.login !== 'vercel[bot]')
    throw Error('No existing successful Vercel baseline');
  return latest;
}

function branchFor(runId) {
  if (!/^\d+-\d+$/.test(runId)) throw Error('Invalid run identifier');
  return PREFIX + runId;
}

// Push an existing object: no commit creation, author replacement or cherry-pick.
function transfer({ cwd, runId, candidate = CANDIDATE, expectedBranches, remote = 'origin' }) {
  if (!/^[a-f0-9]{40}$/.test(candidate)) throw Error('Invalid SHA');
  const branch = branchFor(runId), ref = 'refs/heads/' + branch;
  const git = (...args) => {
    try {
      return execFileSync('git', args, { cwd, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        stdio: ['pipe', 'pipe', 'pipe'], timeout: 20000 }).toString().trim();
    } catch { throw Error('Git operation failed; credential/remote output suppressed'); }
  };
  const branches = () => git('ls-remote', '--refs', remote, 'refs/heads/main', 'refs/heads/test-live');
  const before = branches();
  if (!before || before.split('\n').length !== 2 || before !== expectedBranches)
    throw Error('Protected branch snapshot mismatch; no push');
  if (git('ls-remote', '--refs', remote, ref)) throw Error('Target exists; no overwrite');
  git('fetch', '--no-tags', remote, candidate);
  if (git('rev-parse', `${candidate}^{commit}`) !== candidate) throw Error('Commit mismatch');
  const objectBefore = git('cat-file', 'commit', candidate);
  const receipt = { branch, candidate, pushed: false, protectedBranchesUnchanged: false };
  try {
    // Empty expected SHA means create-only, checked atomically by the Git server.
    git('push', `--force-with-lease=${ref}:`, remote, `${candidate}:${ref}`);
    if (git('ls-remote', '--refs', remote, ref).split(/\s/)[0] !== candidate)
      throw Error('Remote SHA mismatch');
    if (git('cat-file', 'commit', candidate) !== objectBefore) throw Error('Commit object changed');
    receipt.pushed = true;
  } catch (error) { error.receipt = receipt; throw error; }
  finally {
    receipt.protectedBranchesUnchanged = branches() === before;
    if (!receipt.protectedBranchesUnchanged) {
      const error = Error('Protected branch changed externally; stop and inspect, never restore blindly');
      error.receipt = receipt; throw error;
    }
  }
  return receipt;
}

// Combined commit status is deliberately insufficient: the SHA already deployed on test-live.
async function observe({ github, owner = 'Arizona2k', repo = 'wunderkompass', branch,
  candidate = CANDIDATE, since, attempts = 60, delay = () => new Promise(r => setTimeout(r, 10000)) }) {
  if (!/^wk-vercel-e2e-\d+-\d+$/.test(branch) || !Number.isFinite(Date.parse(since)))
    throw Error('Invalid observation scope');
  for (let i = 0; i < attempts; i++) {
    const deployments = await github.paginate(github.rest.repos.listDeployments,
      { owner, repo, sha: candidate, ref: branch, per_page: 100 });
    const current = deployments.filter(d => d.sha === candidate && d.ref === branch &&
      Date.parse(d.created_at) >= Date.parse(since) && d.creator?.login === 'vercel[bot]');
    current.sort((a, b) => b.id - a.id);
    if (current.length) {
      const d = current[0];
      if (d.production_environment !== false || !/preview/i.test(d.environment))
        throw Error('Unexpected production/non-preview deployment; stop');
      const { data: statuses } = await github.rest.repos.listDeploymentStatuses({ owner, repo, deployment_id: d.id, per_page: 100 });
      // GitHub returns newest status first; never fall back to an earlier success.
      const status = statuses[0];
      if (status && status.creator?.login !== 'vercel[bot]')
        throw Error('Untrusted deployment status creator; manual inspection required');
      if (status && ['error', 'failure', 'inactive'].includes(status.state))
        throw Error(`Preview deployment ${d.id} ended with ${status.state}`);
      if (status?.state === 'success') {
        const url = new URL(status.environment_url);
        if (url.protocol !== 'https:' || !url.hostname.endsWith('.vercel.app') ||
          url.username || url.password || url.search || url.hash)
          throw Error('Unexpected preview URL; manual inspection required');
        return { deploymentId: d.id, candidate, branch, previewUrl: url.href,
          githubDeploymentSuccess: true, browserAcceptance: 'PENDING',
          note: 'Confirm Vercel project, full SHA, READY/build logs and protection in dashboard; success is not browser acceptance.' };
      }
    }
    if (i + 1 < attempts) await delay();
  }
  throw Error('No fresh successful Vercel Preview record within deadline; no retry or promotion');
}
module.exports = { CANDIDATE, REPOSITORY, EXPIRES, requireVercelBaseline, branchFor, transfer, observe };
