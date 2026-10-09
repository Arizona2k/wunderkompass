const { execFileSync } = require('node:child_process');

// No application checkout, build, branch push, release, or hosting API.
function probe({ cwd, runId, remote = 'origin' }) {
  if (!/^\d+-\d+$/.test(runId)) throw Error('Invalid probe identifier');
  const prefix = `refs/tags/wk-permission-probe/${runId}/`;
  const refs = [prefix + 'backup', prefix + 'target'];
  const env = { ...process.env, GIT_AUTHOR_NAME: 'Permission probe',
    GIT_AUTHOR_EMAIL: 'probe@example.invalid', GIT_COMMITTER_NAME: 'Permission probe',
    GIT_COMMITTER_EMAIL: 'probe@example.invalid', GIT_TERMINAL_PROMPT: '0' };
  const git = (...args) => {
    try { return execFileSync('git', args, { cwd, env, stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 20000 }).toString().trim(); }
    catch { throw Error('Git operation failed (credential and remote output suppressed)'); }
  };
  const read = ref => git('ls-remote', '--refs', remote, ref).split(/\s/)[0];
  const branches = () => git('ls-remote', '--refs', remote,
    'refs/heads/main', 'refs/heads/test-live');
  const before = branches();
  if (refs.some(ref => read(ref))) throw Error('Probe namespace already exists; no writes attempted');
  const tree = git('mktree'); // Empty tree: no learning content or user data.
  const first = git('commit-tree', tree, '-m', 'Synthetic permission probe');
  const second = git('commit-tree', tree, '-p', first, '-m', 'Synthetic probe successor');
  const receipt = { runId, prefix, created: false, advanced: false,
    cleanup: false, protectedBranchesUnchanged: false };
  let failure;
  try {
    git('push', `--force-with-lease=${refs[0]}:`, remote, `${first}:${refs[0]}`);
    git('push', `--force-with-lease=${refs[1]}:`, remote, `${first}:${refs[1]}`);
    if (refs.some(ref => read(ref) !== first)) throw Error('Creation not confirmed');
    receipt.created = true;
    git('push', `--force-with-lease=${refs[1]}:${first}`, remote, `${second}:${refs[1]}`);
    if (read(refs[1]) !== second || read(refs[0]) !== first) throw Error('Update not confirmed');
    receipt.advanced = true;
  } catch (error) { failure = error; }
  finally {
    // Inspect after ambiguous transport failure too; never delete a foreign SHA.
    for (const ref of refs.slice().reverse()) {
      try {
        const current = read(ref);
        if (!current) continue;
        if (![first, second].includes(current)) throw Error('Foreign probe ref requires manual review');
        git('push', `--force-with-lease=${ref}:${current}`, remote, `:${ref}`);
      } catch (error) { failure ||= error; }
    }
    try {
      receipt.cleanup = refs.every(ref => !read(ref));
      receipt.protectedBranchesUnchanged = branches() === before;
      if (!receipt.cleanup || !receipt.protectedBranchesUnchanged) throw Error('Cleanup or branch verification failed');
    } catch (error) { failure ||= error; }
  }
  if (failure) { failure.receipt = receipt; throw failure; }
  return receipt;
}
module.exports = { probe };
