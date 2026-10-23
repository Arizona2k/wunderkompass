import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {critical} from '../scripts/release/test-live-readiness.cjs';
const file='.github/workflows/quality.yml',source=fs.readFileSync(file,'utf8'),before=fs.readFileSync('tests/fixtures/quality-combined-before-one-reserve.yml','utf8');
const original='    # Existing combined browser job: user-authorised 55-minute ceiling, all steps retained.\n    timeout-minutes: 55';
const exception="    # User23Oct: one reserve execution for PR58/Quality155/attempt1 only.\n    # Every other execution retains55min; all steps and gates stay unchanged.\n    timeout-minutes: ${{ github.event_name == 'pull_request' && github.event.pull_request.number == 58 && github.run_number == 155 && github.run_attempt == 1 && 65 || 55 }}";
test('the explicitly authorised one-execution reserve preserves every existing workflow step, permission and native release guard',()=>{
 assert.equal(source.split(exception).length,2);assert.equal(source.replace(exception,original),before,'entire original workflow except the one bounded time allowance');assert.equal(critical(file),true,'workflow remains protected; never claim normal routine eligibility');
 assert.match(before,/timeout-minutes: 55/);assert.equal(createHash('sha256').update(before).digest('hex'),'fa0c0d6b54997a490572b18e0f164bfd28d07c16f8e007f379dfa25287f7ce5d','unchanged actual92f3591 workflow baseline');
});
test('the actual supported conditional gives65 only to PR58 run155 attempt1 and55 everywhere else',()=>{
 const expression=source.match(/^    timeout-minutes: \$\{\{ (.+) \}\}$/m)?.[1];assert.ok(expression);
 // This expression uses only the shared ==, &&, || subset. Actual GitHub
 // execution still supplies the final workflow/context evidence.
 const value=new Function('github','return ('+expression+');');
 for(const event of ['pull_request','workflow_dispatch','push'])for(const pr of [27,58,59])for(const run of [154,155,156,'155'])for(const attempt of [1,2,'1','2']){
  const github={event_name:event,event:{pull_request:{number:pr}},run_number:run,run_attempt:attempt};const expected=event==='pull_request'&&pr===58&&Number(run)===155&&Number(attempt)===1?65:55;assert.equal(value(github),expected,JSON.stringify(github));
 }
 assert.equal(value({event_name:'workflow_dispatch',event:{},run_number:155,run_attempt:1}),55);
});
