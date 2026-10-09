const {execFileSync} = require('node:child_process');
const {randomUUID} = require('node:crypto');
const ref='refs/tags/wunderkompass-development-lock';
function commands(cwd) {return (...args)=>execFileSync('git',args,{cwd,stdio:'pipe'}).toString().trim();}
function claim(cwd, runId, remote='origin') {
 if (!/^[a-zA-Z0-9_-]{1,100}$/.test(runId || '')) throw Error('Invalid run identifier');
 const git=commands(cwd),local=`wk-lock-${randomUUID()}`;
 try {
  git('-c','user.name=Codex reservation','-c','user.email=codex@example.invalid','tag','-a',local,'HEAD','-m',`Development reservation: ${runId}`);
  const owner=git('rev-parse',`refs/tags/${local}`);
  // Creation must fail if the shared ref already exists (even for the same base).
  git('push',`--force-with-lease=${ref}:`,remote,`${owner}:${ref}`);
  return owner;
 } finally {git('tag','-d',local);}
}
function release(cwd, owner, remote='origin') {
 if (!/^[a-f0-9]{40}$/.test(owner || '')) throw Error('Invalid reservation owner');
 const git=commands(cwd);
 if(git('ls-remote',remote,ref).split(/\s/)[0]!==owner) throw Error('Reservation belongs to another run');
 git('push',`--force-with-lease=${ref}:${owner}`,remote,`:${ref}`);
}
module.exports={claim,release,ref};
if(require.main===module) {
 const [mode,value]=process.argv.slice(2);
 if(mode==='claim') console.log(claim(process.cwd(),value));
 else if(mode==='release') release(process.cwd(),value);
 else throw Error('Use claim RUN_ID or release OWNER_SHA');
}
