// Read-only eligibility decision, executed from the manually approved target.
// NOT a substitute for GitHub's enforced rules. No git push, merge or API writes.
const {isDeepStrictEqual} = require('node:util');
const permit = require('./test-live-permit.json');
const critical = name => typeof name !== 'string' || !name || name.startsWith('/') || name.split('/').includes('..') || /[\0\r\n\\]/.test(name) ||
  /^(\.github\/|scripts\/release\/|build\/|qa\/|content\/excellence-baseline\.json$)/.test(name) ||
  /^(AGENTS\.md|QUALITY\.md|VISION\.md|TEST-LIVE\.md|package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|performance-budgets\.json|vite\.config\.ts|vercel\.json|tsconfig\.json|eslint\.config\.mjs|\.npmrc|\.gitattributes)$/.test(name) ||
  /^scripts\/(quality-|handoff|review-evidence|test-command|test-selection|test-runtime|performance-budget|verify-content|export-integrity|editorial-contract|inventory-provenance)/.test(name) ||
  /^tests\/(release\/|browser\/(quality-runner|portable-smoke|journey-engines)\.mjs|quality-artifacts\.test\.mjs)/.test(name);
function readiness(f, now = new Date(), config = permit) {
  // No queued merges; reserve five minutes for the bounded immediate API operation.
  if (!Number.isFinite(+now) || !Number.isFinite(+new Date(config.validBefore)) || +now + 300000 >= +new Date(config.validBefore)) throw Error('Pro operating window expired; cancel any pending auto-merges');
  if (!config.setupHeadRef || !Number.isSafeInteger(f.setup?.number) || f.setup.number < 1 ||
      f.setup.head?.ref !== config.setupHeadRef || f.setup.head.repo?.full_name !== config.repository ||
      f.setup.merged !== true || f.setup.base?.ref !== 'test-live' || f.setup.base.repo?.full_name !== config.repository ||
      !/^[a-f0-9]{40}$/.test(f.setup.merge_commit_sha || '') ||
      f.setup.merged_by?.login !== 'Arizona2k' || f.setupIncluded !== true) throw Error('Manually approved setup not present in target');
  const pr = f.pr, q = f.quality, c = f.check, receipt = f.receipt;
  if (f.repository?.full_name !== config.repository || f.repository.permissions?.push !== true ||
      pr?.state !== 'open' || pr.draft !== false || !Number.isSafeInteger(pr.number) || pr.number < 1 || pr.number === 27 ||
      pr.base?.ref !== config.target || pr.base?.repo?.full_name !== config.repository ||
      pr.head?.repo?.full_name !== config.repository || pr.user?.login !== 'Arizona2k' ||
      !pr.head?.ref?.startsWith('codex/') || pr.mergeable !== true || pr.mergeable_state !== 'clean' ||
      !/^[a-f0-9]{40}$/.test(pr.head.sha) || !/^[a-f0-9]{40}$/.test(pr.base.sha || '') ||
      !/^[a-f0-9]{40}$/.test(pr.merge_commit_sha || '') || pr.base.sha !== f.targetSha) throw Error('Not a current, mergeable routine test PR');
  if (!Array.isArray(f.files) || !f.files.length || f.files.length !== pr.changed_files ||
      new Set(f.files.map(file=>file.filename)).size !== f.files.length ||
      f.files.some(file => !['added','removed','modified','renamed','copied','changed'].includes(file.status) ||
        (file.status === 'renamed' && (typeof file.previous_filename !== 'string' || !file.previous_filename)) ||
        critical(file.filename) || (file.previous_filename !== undefined && critical(file.previous_filename)))) throw Error('Release/security foundations require manual approval or diff is incomplete');
  if (f.changesRequested !== false || f.productReview?.complete !== true || f.productReview.head !== pr.head.sha ||
      f.productReview.base !== pr.base.sha || f.productReview.noGateWeakening !== true || f.deploymentHealthy !== true ||
      f.otherActiveRelease !== false || f.foreignReservation !== false) throw Error('Review, deployment or shared-work safety is unresolved');
  if (f.rules?.enforcement !== 'active' || f.rules.bypass_actors?.length !== 0 ||
      !isDeepStrictEqual(f.rules.conditions?.ref_name?.include, ['refs/heads/test-live']) ||
      f.rules.conditions.ref_name.exclude?.length !== 0 ||
      !f.rules.rules?.some(r => r.type === 'pull_request') ||
      !f.rules.rules.some(r => r.type === 'required_status_checks' && r.parameters?.strict_required_status_checks_policy === true &&
        r.parameters.required_status_checks?.some(s => s.context === 'Required quality checks' && s.integration_id === config.qualityAppId))) throw Error('Enforced, strict test-live Required quality checks unavailable');
  if (!Number.isSafeInteger(q?.id) || q.id < 1 || !Number.isSafeInteger(q.run_attempt) || q.run_attempt < 1 ||
      !Number.isSafeInteger(c?.id) || c.id < 1 || q?.workflow_id !== config.qualityWorkflowId || q.path !== '.github/workflows/quality.yml' ||
      q.repository?.full_name !== config.repository || q.head_sha !== pr.head.sha || q.event !== 'pull_request' ||
      q.status !== 'completed' || q.conclusion !== 'success' || q.id !== f.latestQualityRun ||
      c?.name !== 'Required quality checks' || c.status !== 'completed' || c.conclusion !== 'success' ||
      c.app?.id !== config.qualityAppId || c.head_sha !== pr.head.sha ||
      c.details_url !== `https://github.com/${config.repository}/actions/runs/${q.id}/job/${c.id}` ||
      receipt?.repository !== config.repository || receipt.event !== 'pull_request' || receipt.automatic !== true ||
      receipt.pr !== pr.number || receipt.head !== pr.head.sha || receipt.base !== pr.base.sha ||
      receipt.target !== config.target || receipt.testedCommit !== pr.merge_commit_sha || receipt.workflowSha !== pr.merge_commit_sha ||
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
