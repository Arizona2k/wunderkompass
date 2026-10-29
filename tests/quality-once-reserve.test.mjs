import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {critical} from '../scripts/release/test-live-readiness.cjs';
const file='.github/workflows/quality.yml',source=fs.readFileSync(file,'utf8'),before=fs.readFileSync('tests/fixtures/quality-combined-before-one-reserve.yml','utf8');
const originalTimeout="    # Existing combined browser job: user-authorised 55-minute ceiling, all steps retained.\n    timeout-minutes: 55";
const approvedTimeout="    # User26Oct: measured bootstrap repair and a finite65min reserve.\n    # Quality176 spent46min installing dependencies; every test/gate stays.\n    # Quality195 reached65min during complete engines; finite70min reserve.\n    timeout-minutes: 70";
const originalInstaller="      - name: Install Chromium and system dependencies\n        run: pnpm --dir qa exec playwright install --with-deps chromium\n      - name: Install additional browser engines\n        run: pnpm --dir qa exec playwright install --with-deps firefox webkit\n";
const approvedInstaller="      - name: Install all browsers and shared system dependencies\n        run: |\n          # Same signed Ubuntu repositories; prefer the existing official mirror.\n          # Quality176 downloaded Azure packages at43–47kB/s for45min22s.\n          sudo sed -i \\\n            -e '\\|^http://azure\\.archive\\.ubuntu\\.com/ubuntu/|s/priority:1/priority:2/' \\\n            -e '\\|^https://archive\\.ubuntu\\.com/ubuntu/|s/priority:2/priority:1/' \\\n            /etc/apt/apt-mirrors.txt\n          cat /etc/apt/apt-mirrors.txt\n          pnpm --dir qa exec playwright install --with-deps chromium firefox webkit\n";
test('user-authorised finite70min and causal installer repair preserve the entire original workflow and native release guards',()=>{
 assert.equal(source.split(approvedTimeout).length,2);assert.equal(source.split(approvedInstaller).length,2);
 assert.equal(source.replace(approvedTimeout,originalTimeout).replace(approvedInstaller,originalInstaller),before,'entire original workflow except exactly the authorised time/mirror/shared-install changes');
 assert.equal(critical(file),true,'workflow remains protected and requires concrete manual review');
 assert.equal(createHash('sha256').update(before).digest('hex'),'fa0c0d6b54997a490572b18e0f164bfd28d07c16f8e007f379dfa25287f7ce5d','unchanged actual92f3591 workflow baseline');
 assert.deepEqual([...source.matchAll(/^    timeout-minutes: (.+)$/gm)].map(m=>m[1]),['70'],'one finite ceiling, no hidden unbounded or context-specific exception');
});
test('actual installer shell reprioritises existing official Ubuntu mirrors without changing repositories, security fallback or package trust',()=>{
 // Exact stock file from the actually used runner image ubuntu24/20261012.334:
 // actions/runner-images/images/ubuntu/scripts/build/configure-apt-sources.sh.
 const initial='http://azure.archive.ubuntu.com/ubuntu/\tpriority:1\nhttps://archive.ubuntu.com/ubuntu/\tpriority:2\nhttps://security.ubuntu.com/ubuntu/\tpriority:3\n';
 const expected='http://azure.archive.ubuntu.com/ubuntu/\tpriority:2\nhttps://archive.ubuntu.com/ubuntu/\tpriority:1\nhttps://security.ubuntu.com/ubuntu/\tpriority:3\n';
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'wk-apt-priority-')),fixture=path.join(root,'apt-mirrors.txt');
 try{
  fs.writeFileSync(fixture,initial);
  const actual=approvedInstaller.slice(approvedInstaller.indexOf('sudo sed -i'),approvedInstaller.indexOf('cat /etc/apt/apt-mirrors.txt'));
  assert.equal(actual.split('sudo').length,2);
  const local=actual.replace('sudo sed','sed').replace('/etc/apt/apt-mirrors.txt','"$WK_APT_FIXTURE"');
  execFileSync('bash',['-e','-c',local],{env:{...process.env,WK_APT_FIXTURE:fixture}});
  assert.equal(fs.readFileSync(fixture,'utf8'),expected,'same three URIs and priorities; only first and second exchanged');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
