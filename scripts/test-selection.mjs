import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import {REQUIRED_SUITES} from './quality-evidence.mjs';

const root=process.cwd();
function resolve(from,specifier){
 if(specifier.startsWith('@/'))specifier=path.join(root,specifier.slice(2));
 else if(specifier.startsWith('.'))specifier=path.resolve(path.dirname(from),specifier);
 else if(/^(app|components|scripts|tests|build)\//.test(specifier))specifier=path.join(root,specifier);
 else return null;
 for(const suffix of ['', '.ts','.tsx','.mjs','.json','/index.ts','/index.tsx']){const f=specifier+suffix;if(fs.existsSync(f)&&fs.statSync(f).isFile())return f;}
 return null;
}
export function dependencies(entry,seen=new Set(),graph=new Map()){
 const file=path.resolve(entry);if(seen.has(file))return seen;seen.add(file);
 if(!/\.(mjs|cjs|ts|tsx|js)$/.test(file))return seen;
 // Share parsed edges during one selection, never stale file data across calls.
 if(!graph.has(file)){
  const edges=new Set(),source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
  function walk(node){if(ts.isStringLiteralLike(node)){const next=resolve(file,node.text);if(next)edges.add(next);}ts.forEachChild(node,walk);}
  walk(source);graph.set(file,edges);
 }
 for(const next of graph.get(file))dependencies(next,seen,graph);return seen;
}
// Parse changed native Node modules before starting expensive existing checks.
// This catches duplicated imports introduced by merges; TS/lint do not cover
// every browser harness module. No module code is executed by --check.
export function checkSyntaxFiles(files){
 const started=performance.now(),checked=[];
 for(const file of files){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.error)throw result.error;if(result.status!==0)throw Error('Node syntax check failed: '+file+'\n'+(result.stderr??result.stdout));checked.push(file);}
 return {checked,seconds:(performance.now()-started)/1000};
}
export function selectTests(changed){
 const files=[...new Set(changed.map(f=>f.replaceAll('\\','/')))];
 const runtime=files.filter(f=>!/^work\/|^\.qa-output\//.test(f)&&!/\.md$/.test(f));
 // Only this known non-runtime dossier registry is metadata. If a future
 // application import reaches it, it must return to the broad UI path.
 const metadata=new Set();
 if(runtime.includes('content/editorial-reviews.json')&&fs.existsSync('content/editorial-reviews.json')&&!dependencies('migration/main.tsx').has(path.resolve('content/editorial-reviews.json')))metadata.add('content/editorial-reviews.json');
 const syntaxFiles=runtime.filter(f=>/\.(?:mjs|cjs|js)$/.test(f)&&fs.existsSync(f)&&fs.statSync(f).isFile()).sort();
 const infrastructure=runtime.some(f=>/^(package\.json|pnpm-lock|qa\/|vite\.|tsconfig|eslint|build\/|scripts\/|\.github\/|performance-budgets)/.test(f));
 const unknown=runtime.some(f=>!metadata.has(f)&&! /^(app\/|components\/|hooks\/|lib\/|migration\/|public\/|exports\/|tests\/)/.test(f));
 // A deleted dependency cannot be resolved by the current graph: fail broad.
 const deleted=runtime.some(f=>!fs.existsSync(f));
 const allUnits=fs.readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f);
 const absolute=new Set(runtime.map(f=>path.resolve(f)));
 const graph=new Map();
 const unitTests=infrastructure||unknown||deleted?allUnits:allUnits.filter(f=>[...dependencies(f,new Set(),graph)].some(d=>absolute.has(d))||runtime.includes(f));
 let browser=[];
 if(runtime.length){
  if(runtime.every(f=>metadata.has(f)))browser=[];
  else if(!infrastructure&&!unknown&&runtime.every(f=>/^(app\/challenge-hints\.json|tests\/challenge\.test\.mjs|exports\/content\/challenge-hints\.json)$/.test(f)))browser=['challenge','offline'];
  else if(!infrastructure&&!unknown&&runtime.every(f=>/^(app\/update-history|tests\/update-history\.test\.mjs)/.test(f)))browser=['home','offline'];
  else if(!infrastructure&&!unknown&&runtime.every(f=>/^(app\/journey-inquir|tests\/journeys\.test\.mjs|exports\/content\/journey-inquiries\.json)/.test(f)))browser=['journeys','backup','offline'];
  else if(runtime.every(f=>/^tests\/.*\.test\.mjs$/.test(f)))browser=[];
  else browser=[...REQUIRED_SUITES];
 }
 return {scope:'local iteration only',fullRequiredBeforeReady:true,changed:files,syntaxFiles,unitTests,release:infrastructure||unknown||runtime.some(f=>f.startsWith('tests/release/')),browser,staticContent:browser.length>0||metadata.size>0,reason:infrastructure||unknown||deleted?'Unknown/shared/deleted input: conservative full selection':metadata.size&&runtime.every(f=>metadata.has(f))?'Known dossier registry outside application dependencies: static content/reference integrity and actual transitive units; final full checks remain mandatory':'Transitive unit dependencies and explicit browser-risk mapping; unknown UI changes select the full browser path'};
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
  console.log('Changed Node module syntax',JSON.stringify(checkSyntaxFiles(plan.syntaxFiles)));
  const run=(command,argv,env=process.env)=>{const result=spawnSync(command,argv,{stdio:'inherit',env});if(result.status!==0)process.exit(result.status??1);};
  run('corepack',['pnpm','run','typecheck:fast']);run('corepack',['pnpm','run','lint:fast']);
  if(plan.unitTests.length)run(process.execPath,['--import','./scripts/test-runtime.mjs','--test',...plan.unitTests]);
  if(plan.release)run(process.execPath,['--test',...fs.readdirSync('tests/release').filter(f=>f.endsWith('.test.cjs')).map(f=>'tests/release/'+f)]);
  if(plan.staticContent)run(process.execPath,['scripts/verify-content.mjs','--static-only']);
  if(plan.browser.length){run('corepack',['pnpm','run','build']);run('corepack',['pnpm','run','test:browser'],{...process.env,QA_SUITE:plan.browser.join(',')});}
  console.log('Local selected checks passed; this is not the mandatory complete Ready/Quality check.');
 }
}
