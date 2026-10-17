const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
// Vercel documents minimatch and that any matching true rule wins:
// https://vercel.com/docs/project-configuration/git-configuration
// A single codex/** false policy avoids editing release configuration for every
// routine product PR; main/test-live keep their documented unspecified default.
test('future codex previews are disabled without changing main/test-live deployment policy or allowing true overrides',()=>{
 const config=JSON.parse(fs.readFileSync(path.join(__dirname,'../../vercel.json'),'utf8'));
 const policy=config.git.deploymentEnabled;
 assert.equal(policy['codex/**'],false,'nested and future codex branches covered');
 for(const [branch,enabled]of Object.entries(policy)){assert.ok(branch.startsWith('codex/'),'no main/test-live/global deployment policy change');assert.equal(enabled,false,'no matching true rule may override the preview stop');}
 assert.equal(Object.hasOwn(policy,'main'),false);assert.equal(Object.hasOwn(policy,'test-live'),false);assert.equal(Object.hasOwn(policy,'*'),false);
});
