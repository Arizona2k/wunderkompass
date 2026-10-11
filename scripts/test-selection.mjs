import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const root=process.cwd();
function resolve(from,specifier){
 if(specifier.startsWith('@/'))specifier=path.join(root,specifier.slice(2));
 else if(specifier.startsWith('.'))specifier=path.resolve(path.dirname(from),specifier);
 else if(/^(app|components|scripts|tests|build)\//.test(specifier))specifier=path.join(root,specifier);
 else return null;
 for(const suffix of ['', '.ts','.tsx','.mjs','.json','/index.ts','/index.tsx']){const f=specifier+suffix;if(fs.existsSync(f)&&fs.statSync(f).isFile())return f;}
 return null;
}
export function dependencies(entry,seen=new Set()){
 const file=path.resolve(entry);if(seen.has(file))return seen;seen.add(file);
 if(!/\.(mjs|ts|tsx|js)$/.test(file))return seen;
 const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
 function walk(node){if(ts.isStringLiteralLike(node)){const next=resolve(file,node.text);if(next)dependencies(next,seen);}ts.forEachChild(node,walk);}
 walk(source);return seen;
}
export function selectTests(changed){
 const files=[...new Set(changed.map(f=>f.replaceAll('\\','/')))];
 const runtime=files.filter(f=>!/^work\/|^\.qa-output\//.test(f)&&!/\.md$/.test(f));
 const infrastructure=runtime.some(f=>/^(package\.json|pnpm-lock|qa\/|vite\.|tsconfig|eslint|build\/|scripts\/|\.github\/|performance-budgets)/.test(f));
 const unknown=runtime.some(f=>! /^(app\/|components\/|hooks\/|lib\/|migration\/|public\/|exports\/|tests\/)/.test(f));
 const allUnits=fs.readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f);
 const absolute=new Set(runtime.map(f=>path.resolve(f)));
 const unitTests=infrastructure||unknown?allUnits:allUnits.filter(f=>[...dependencies(f)].some(d=>absolute.has(d)));
 let browser=[];
 if(runtime.length){
  if(!infrastructure&&!unknown&&runtime.every(f=>/^(app\/challenge-hints\.json|tests\/challenge\.test\.mjs|exports\/content\/challenge-hints\.json)$/.test(f)))browser=['challenge','offline'];
  else if(!infrastructure&&!unknown&&runtime.every(f=>/^(app\/update-history|tests\/update-history\.test\.mjs)/.test(f)))browser=['home','offline'];
  else if(runtime.every(f=>/^tests\/.*\.test\.mjs$/.test(f)))browser=[];
  else browser=['foundation','home','core','playground','backup','challenge','offline'];
 }
 return {scope:'local iteration only',fullRequiredBeforeReady:true,changed:files,unitTests,release:infrastructure||unknown||runtime.some(f=>f.startsWith('tests/release/')),browser,reason:infrastructure||unknown?'Unknown/shared infrastructure: conservative full selection':'Transitive unit dependencies and explicit browser-risk mapping; unknown UI changes select the full browser path'};
}
function changedFiles(base){
 const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim().split('\n').filter(Boolean);
 const ancestor=git('merge-base','HEAD',base)[0];
 return [...git('diff','--name-only',ancestor),...git('ls-files','--others','--exclude-standard')];
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),provided=args.indexOf('--files'),base=args.indexOf('--base');
 const plan=selectTests(provided>=0?args[provided+1].split(','):changedFiles(base>=0?args[base+1]:'origin/test-live'));
 console.log(JSON.stringify(plan,null,2));
 if(args.includes('--run')){
  const run=(command,argv,env=process.env)=>{const result=spawnSync(command,argv,{stdio:'inherit',env});if(result.status!==0)process.exit(result.status??1);};
  run('corepack',['pnpm','run','typecheck:fast']);run('corepack',['pnpm','run','lint:fast']);
  if(plan.unitTests.length)run(process.execPath,['--import','./scripts/test-runtime.mjs','--test',...plan.unitTests]);
  if(plan.release)run(process.execPath,['--test',...fs.readdirSync('tests/release').filter(f=>f.endsWith('.test.cjs')).map(f=>'tests/release/'+f)]);
  if(plan.browser.length){run('corepack',['pnpm','run','build']);run('corepack',['pnpm','run','verify']);run('corepack',['pnpm','run','test:browser'],{...process.env,QA_SUITE:plan.browser.join(',')});}
  console.log('Local selected checks passed; this is not the mandatory complete Ready/Quality check.');
 }
}
