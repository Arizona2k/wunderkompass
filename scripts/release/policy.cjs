// Loaded only from the trusted target branch by the privileged workflow.
const { execFileSync } = require('node:child_process');
const sha = value => /^[0-9a-f]{40}$/.test(value || '');
const allowed = path => /^(app|components|content|public|exports|hooks|lib|vendor)\//.test(path) || /^(BACKLOG|PROJECT_STATE|CHANGELOG)\.md$/.test(path);
function validate({pr, peers, files, base, repository, expectedHead, expectedBase}) {
  if (!sha(base) || !sha(pr.head.sha)) throw Error('Invalid commit');
  if (pr.state !== 'open' || pr.draft || pr.base.ref !== 'test-live') throw Error('PR is not eligible');
  if (pr.head.repo?.full_name !== repository || pr.base.repo?.full_name !== repository || !pr.head.ref.startsWith('codex/')) throw Error('Untrusted source');
  if (pr.user.login !== repository.split('/')[0]) throw Error('Source author needs manual review');
  if (!pr.labels.some(x => x.name === 'auto-test-live')) throw Error('Release label missing');
  if (peers.filter(x => x.head.ref.startsWith('codex/')).length !== 1 || !peers.some(x => x.number === pr.number)) throw Error('Concurrent development PR');
  if (expectedHead && pr.head.sha !== expectedHead) throw Error('Head changed after tests');
  if (expectedBase && base !== expectedBase) throw Error('Target changed after tests');
  if (!Number.isInteger(pr.changed_files) || files.length !== pr.changed_files) throw Error('Incomplete PR file list');
  if (!files.length || files.some(x => !allowed(x.filename) || (x.previous_filename && !allowed(x.previous_filename)))) throw Error('Automation or test configuration needs manual review');
  return {head: pr.head.sha, base};
}
async function inspect(github, context, expected = {}) {
  const args = {...context.repo};
  const number = context.payload.pull_request.number;
  const pr = (await github.rest.pulls.get({...args, pull_number:number})).data;
  const peers = await github.paginate(github.rest.pulls.list, {...args, state:'open', per_page:100});
  const base = (await github.rest.git.getRef({...args, ref:'heads/test-live'})).data.object.sha;
  try {
    await github.rest.git.getRef({...args, ref:'tags/wunderkompass-development-lock'});
    throw Error('Development reservation is active');
  } catch (error) { if (error.status !== 404) throw error; }
  if (!sha(base) || !sha(pr.head.sha)) throw Error('Invalid commit');
  // Inspect an immutable SHA-to-SHA diff, not a moving PR file listing.
  // GitHub caps comparison files at 300; the count check fails closed beyond that.
  const comparison = (await github.rest.repos.compareCommitsWithBasehead({...args, basehead:`${base}...${pr.head.sha}`})).data;
  const files = comparison.files || [];
  const result = validate({pr, peers, files, base, repository:`${args.owner}/${args.repo}`, expectedBase: context.payload.pull_request.base.sha, ...expected});
  if (comparison.status !== 'ahead' || comparison.merge_base_commit.sha !== base) throw Error('Development branch must descend from current test-live');
  const reviews = await github.paginate(github.rest.pulls.listReviews, {...args, pull_number:number, per_page:100});
  const latest = new Map();
  for (const review of reviews) if (['APPROVED','CHANGES_REQUESTED','DISMISSED'].includes(review.state)) latest.set(review.user.login,review.state);
  if ([...latest.values()].includes('CHANGES_REQUESTED')) throw Error('Review requests changes');
  return result;
}
function promote({cwd, head, base, runId, remote = 'origin'}) {
  if (!sha(head) || !sha(base) || !/^\d+-\d+$/.test(runId)) throw Error('Invalid publication parameters');
  const git = (...args) => execFileSync('git',args,{cwd,stdio:'pipe'}).toString().trim();
  // No candidate checkout or scripts; only immutable Git objects are fetched.
  git('fetch','--no-tags',remote,head,base);
  git('merge-base','--is-ancestor',base,head);
  const current = git('ls-remote',remote,'refs/heads/test-live').split(/\s/)[0];
  if (current !== base) throw Error('Target changed before push');
  if (git('ls-remote',remote,'refs/tags/wunderkompass-development-lock')) throw Error('Development reservation is active');
  const backup = `refs/tags/test-live-backup/${runId}`;
  // Preserve previous commit before touching test-live. Failure stops publication.
  git('push',remote,`${base}:${backup}`);
  // Lease is the server-side compare-and-swap. Ancestry was checked above.
  git('push',`--force-with-lease=refs/heads/test-live:${base}`,remote,`${head}:refs/heads/test-live`);
  return backup;
}
module.exports = {validate, inspect, promote};
