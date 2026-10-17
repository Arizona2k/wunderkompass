// Read-only eligibility decision, executed from the manually approved target.
// NOT a substitute for GitHub's enforced rules. No git push, merge or API writes.
const {isDeepStrictEqual} = require('node:util');
const permit = require('./test-live-permit.json');
const critical = name => /^(\.github\/|scripts\/release\/|build\/)/.test(name) ||
  /^(AGENTS\.md|QUALITY\.md|VISION\.md|TEST-LIVE\.md|package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|performance-budgets\.json|vite\.config\.ts|vercel\.json)$/.test(name) ||
  /^scripts\/(quality-|handoff|review-evidence|test-command|test-selection|performance-budget)/.test(name) ||
  /^tests\/(release\/|browser\/(quality-runner|portable-smoke|journey-engines)\.mjs|quality-artifacts\.test\.mjs)/.test(name);
function readiness(f, now = new Date(), config = permit) {
  if (!Number.isFinite(+now) || !Number.isFinite(+new Date(config.validBefore)) || +now >= +new Date(config.validBefore)) throw Error('Pro operating window expired; cancel any pending auto-merges');
  if (!config.setupHeadRef || !Number.isSafeInteger(f.setup?.number) || f.setup.number < 1 ||
      f.setup.head?.ref !== config.setupHeadRef || f.setup.head.repo?.full_name !== config.repository ||
      !f.setup.merged || f.setup.base?.ref !== 'test-live' ||
      f.setup.merged_by?.login !== 'Arizona2k' || !f.setupIncluded) throw Error('Manually approved setup not present in target');
  const pr = f.pr, q = f.quality, c = f.check, receipt = f.receipt;
  if (f.repository?.full_name !== config.repository || pr?.state !== 'open' || pr.draft || pr.number === 27 ||
      pr.base?.ref !== config.target || pr.base?.repo?.full_name !== config.repository ||
      pr.head?.repo?.full_name !== config.repository || pr.user?.login !== 'Arizona2k' ||
      !pr.head?.ref?.startsWith('codex/') || pr.mergeable !== true || pr.mergeable_state !== 'clean' ||
      !/^[a-f0-9]{40}$/.test(pr.head.sha) || !/^[a-f0-9]{40}$/.test(pr.merge_commit_sha || '') || pr.base.sha !== f.targetSha) throw Error('Not a current, mergeable routine test PR');
  if (!Array.isArray(f.files) || !f.files.length || f.files.length !== pr.changed_files ||
      f.files.some(file => critical(file.filename) || (file.previous_filename && critical(file.previous_filename)))) throw Error('Release/security foundations require manual approval or diff is incomplete');
  if (f.changesRequested || !f.productReview?.complete || f.productReview.head !== pr.head.sha ||
      f.productReview.base !== pr.base.sha || !f.productReview.noGateWeakening || !f.deploymentHealthy ||
      f.otherActiveRelease || f.foreignReservation) throw Error('Review, deployment or shared-work safety is unresolved');
  if (f.rules?.enforcement !== 'active' || f.rules.bypass_actors?.length !== 0 ||
      !isDeepStrictEqual(f.rules.conditions?.ref_name?.include, ['refs/heads/test-live']) ||
      f.rules.conditions.ref_name.exclude?.length !== 0 ||
      !f.rules.rules?.some(r => r.type === 'pull_request') ||
      !f.rules.rules.some(r => r.type === 'required_status_checks' && r.parameters?.strict_required_status_checks_policy === true &&
        r.parameters.required_status_checks?.some(s => s.context === 'Required quality checks' && s.integration_id === config.qualityAppId))) throw Error('Enforced, strict test-live Required quality checks unavailable');
  if (q?.workflow_id !== config.qualityWorkflowId || q.path !== '.github/workflows/quality.yml' ||
      q.repository?.full_name !== config.repository || q.head_sha !== pr.head.sha || q.event !== 'pull_request' ||
      q.status !== 'completed' || q.conclusion !== 'success' || q.id !== f.latestQualityRun ||
      c?.name !== 'Required quality checks' || c.status !== 'completed' || c.conclusion !== 'success' ||
      c.app?.id !== config.qualityAppId || c.head_sha !== pr.head.sha ||
      c.details_url !== `https://github.com/${config.repository}/actions/runs/${q.id}/job/${c.id}` ||
      receipt?.repository !== config.repository || receipt.event !== 'pull_request' || receipt.automatic !== true ||
      receipt.pr !== pr.number || receipt.head !== pr.head.sha || receipt.base !== pr.base.sha ||
      receipt.target !== config.target || receipt.testedCommit !== pr.merge_commit_sha ||
      receipt.runId !== String(q.id) || receipt.attempt !== String(q.run_attempt) ||
      receipt.workflowRef !== `${config.repository}/.github/workflows/quality.yml@refs/pull/${pr.number}/merge`) throw Error('Missing current complete Quality receipt or unexpected check origin');
  return {eligible:true, head:pr.head.sha, base:pr.base.sha, integration:pr.merge_commit_sha,
    validBefore:config.validBefore, automaticQueueAllowed:false,
    next:'Regular GitHub PR merge with expected head; strict native checks must still apply. Confirm identical tree and actual Vercel deployment before next release.'};
}
module.exports = {readiness, critical};
if (require.main === module) {
  try {const facts = JSON.parse(require('node:fs').readFileSync(process.argv[2], 'utf8')); console.log(JSON.stringify(readiness(facts),null,2));}
  catch (error) {console.error(error.message);process.exitCode=1;}
}
