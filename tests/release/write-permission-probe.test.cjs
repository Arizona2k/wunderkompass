const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { probe } = require('../../scripts/release/write-permission-probe.cjs');

function setup(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'wk-probe-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const cwd = path.join(root, 'client');
  const remote = path.join(root, 'remote.git');
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'pipe' }).toString().trim();
  git('init', '--bare', remote);
  git('init', cwd);
  git('-C', cwd, 'config', 'user.name', 'Synthetic test');
  git('-C', cwd, 'config', 'user.email', 'test@example.invalid');
  const tree = git('-C', cwd, 'mktree');
  const sha = git('-C', cwd, 'commit-tree', tree, '-m', 'Synthetic baseline');
  git('-C', cwd, 'remote', 'add', 'origin', remote);
  git('-C', cwd, 'push', 'origin', `${sha}:refs/heads/main`, `${sha}:refs/heads/test-live`);
  const tags = () => git('--git-dir', remote, 'for-each-ref', '--format=%(refname)', 'refs/tags/');
  return { cwd, remote, git, sha, tags };
}

test('real local Git transport creates, advances and removes tags; branches unchanged', t => {
  const s = setup(t);
  assert.deepEqual(probe({ cwd: s.cwd, runId: '123-1' }), {
    runId: '123-1', prefix: 'refs/tags/wk-permission-probe/123-1/',
    created: true, advanced: true, cleanup: true, protectedBranchesUnchanged: true
  });
  assert.equal(s.tags(), '');
  for (const branch of ['main', 'test-live'])
    assert.equal(s.git('--git-dir', s.remote, 'rev-parse', branch), s.sha);
});

test('remote write rejection fails without a successful receipt or leftovers', t => {
  const s = setup(t);
  writeFileSync(path.join(s.remote, 'hooks', 'pre-receive'), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
  assert.throws(() => probe({ cwd: s.cwd, runId: '124-1' }), error => {
    assert.equal(error.receipt.created, false);
    assert.equal(error.receipt.advanced, false);
    assert.equal(error.receipt.cleanup, true);
    return true;
  });
  assert.equal(s.tags(), '');
});

test('existing namespace is preserved and fails before any write', t => {
  const s = setup(t);
  const ref = 'refs/tags/wk-permission-probe/125-1/target';
  s.git('-C', s.cwd, 'push', 'origin', `${s.sha}:${ref}`);
  assert.throws(() => probe({ cwd: s.cwd, runId: '125-1' }), /already exists/);
  assert.equal(s.tags(), ref);
});

test('concurrent foreign update is detected and never deleted by cleanup', t => {
  const s = setup(t);
  const ref = 'refs/tags/wk-permission-probe/126-1/target';
  // Server replaces the just-created target before the probe can advance it.
  writeFileSync(path.join(s.remote, 'hooks', 'post-receive'),
    `#!/bin/sh\nwhile read old new ref; do\n  if [ "$ref" = "${ref}" ]; then\n    git update-ref "$ref" ${s.sha}\n  fi\ndone\n`, { mode: 0o755 });
  assert.throws(() => probe({ cwd: s.cwd, runId: '126-1' }), error => {
    assert.equal(error.receipt.advanced, false);
    assert.equal(error.receipt.cleanup, false);
    return true;
  });
  assert.equal(s.git('--git-dir', s.remote, 'rev-parse', ref), s.sha);
  assert.equal(s.tags(), ref);
});

test('server rejects a stale exact lease without modifying the target', t => {
  const s = setup(t);
  const ref = 'refs/tags/wk-permission-probe/127-1/target';
  const tree = s.git('-C', s.cwd, 'mktree');
  const successor = s.git('-C', s.cwd, 'commit-tree', tree, '-p', s.sha, '-m', 'Successor');
  s.git('-C', s.cwd, 'push', 'origin', `${s.sha}:${ref}`);
  assert.throws(() => s.git('-C', s.cwd, 'push',
    `--force-with-lease=${ref}:${successor}`, 'origin', `${successor}:${ref}`));
  assert.equal(s.git('--git-dir', s.remote, 'rev-parse', ref), s.sha);
});
