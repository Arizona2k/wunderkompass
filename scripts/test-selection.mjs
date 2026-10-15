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
export function changeImpact(changed,{base='HEAD',catalog,index,previous,exportIndex}={}){
 const files=new Set(changed),load=file=>JSON.parse(fs.readFileSync(file,'utf8'));
 const worldChanged=files.has('app/world-catalog.json');
 const result={meaning:'Explicit technical dependencies and editorial candidates, not automatic scientific or complete semantic analysis',comparisonBase:base,changedTopicIds:[],relatedEditorialCandidates:[],withoutExplicitTopicLinks:[],searchIndexMismatches:[],generatedExports:(exportIndex??load('exports/content/index.json')).files.filter(e=>e.sources.some(s=>files.has(s))).map(e=>'exports/content/'+e.file),offlineBuildReview:changed.some(f=>/^(app\/|public\/|migration\/|build\/|index\.html$|vite\.config|package\.json$|pnpm-lock)/.test(f)),savedProgressReview:changed.some(f=>/progress-storage|saved-games|saved-model|hash-route|backup|migration\//.test(f))};
 if(worldChanged){
  catalog??=load('app/world-catalog.json');index??=load('app/world-index.json');
  const ids=new Set(catalog.map(t=>t.id));if(ids.size!==catalog.length)throw Error('Duplicate content identity in impact analysis');
  for(const t of catalog)if(!Array.isArray(t.related)||t.related.some(id=>!ids.has(id)))throw Error('Invalid explicit topic reference: '+t.id);
  if(previous===undefined){try{previous=JSON.parse(execFileSync('git',['show',base+':app/world-catalog.json'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}));}catch{previous=null;}}
  const before=new Map((previous??[]).map(t=>[t.id,JSON.stringify(t)]));
  result.changedTopicIds=catalog.filter(t=>before.get(t.id)!==JSON.stringify(t)).map(t=>t.id);
  result.removedTopicIds=(previous??[]).filter(t=>!ids.has(t.id)).map(t=>t.id);
  result.comparisonAvailable=previous!==null;
  const touched=new Set([...result.changedTopicIds,...result.removedTopicIds]),neighbors=new Set();
  for(const t of catalog){if(touched.has(t.id))for(const id of t.related)neighbors.add(id);else if(t.related.some(id=>touched.has(id)))neighbors.add(t.id);}
  result.relatedEditorialCandidates=[...neighbors].filter(id=>!touched.has(id));
  result.withoutExplicitTopicLinks=catalog.filter(t=>touched.has(t.id)&&!t.related.length).map(t=>t.id);
  result.searchIndexMismatches=catalog.filter(t=>{const entry=index.find(e=>e.id===t.id);return !entry||['title','category','intro'].some(k=>entry[k]!==t[k]);}).map(t=>t.id);
  result.generatedIndices=['app/world-index.json','app/world-question-index.json','app/world-content-parts/'];
  result.editorialReview='Check real related articles, words, maps, journeys, games, labs and missions; unrecorded semantic connections need human editorial judgment. Old IDs/correct answers/saves must be preserved.';
 }
 return result;
}
export function selectTests(changed,{base='HEAD'}={}){
 const files=[...new Set(changed.map(f=>f.replaceAll('\\','/')))];
 const runtime=files.filter(f=>!/^work\/|^\.qa-output\//.test(f)&&!/\.md$/.test(f));
 const newsOnly=runtime.length>0&&runtime.every(f=>/^(scripts\/news\/|tests\/news.*\.test\.mjs$|content\/news-source-policy\.json$)/.test(f));
 const infrastructure=!newsOnly&&runtime.some(f=>/^(package\.json|pnpm-lock|qa\/|vite\.|tsconfig|eslint|build\/|scripts\/|\.github\/|performance-budgets)/.test(f));
 const unknown=!newsOnly&&runtime.some(f=>! /^(app\/|components\/|hooks\/|lib\/|migration\/|public\/|exports\/|tests\/)/.test(f));
 // A deleted dependency cannot be resolved by the current graph: fail broad.
 const deleted=runtime.some(f=>!fs.existsSync(f));
 const allUnits=fs.readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f);
 const absolute=new Set(runtime.map(f=>path.resolve(f)));
 const graph=new Map();
 const unitTests=infrastructure||unknown||deleted?allUnits:allUnits.filter(f=>[...dependencies(f,new Set(),graph)].some(d=>absolute.has(d))||runtime.includes(f));
 let browser=[];
 if(runtime.length){
  if(newsOnly&&!deleted)browser=[];
  else if(!infrastructure&&!unknown&&runtime.every(f=>/^(app\/challenge-hints\.json|tests\/challenge\.test\.mjs|exports\/content\/challenge-hints\.json)$/.test(f)))browser=['challenge','offline'];
  else if(!infrastructure&&!unknown&&runtime.every(f=>/^(app\/update-history|tests\/update-history\.test\.mjs)/.test(f)))browser=['home','offline'];
  else if(!infrastructure&&!unknown&&runtime.every(f=>/^(app\/journey-inquir|tests\/journeys\.test\.mjs|exports\/content\/journey-inquiries\.json)/.test(f)))browser=['journeys','backup','offline'];
  else if(runtime.every(f=>/^tests\/.*\.test\.mjs$/.test(f)))browser=[];
  else browser=['foundation','home','core','playground','backup','challenge','research','journeys','book','nature','offline'];
 }
 return {scope:'local iteration only',fullRequiredBeforeReady:true,changed:files,impact:changeImpact(files,{base}),unitTests,release:infrastructure||unknown||runtime.some(f=>f.startsWith('tests/release/')),browser,reason:infrastructure||unknown||deleted?'Unknown/shared/deleted input: conservative full selection':newsOnly?'News preparation server code only; no browser content changed':'Transitive unit dependencies and explicit browser-risk mapping; unknown UI changes select the full browser path'};
}
function changedFiles(base){
 const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim().split('\n').filter(Boolean);
 const ancestor=git('merge-base','HEAD',base)[0];
 return [...git('diff','--name-only',ancestor),...git('ls-files','--others','--exclude-standard')];
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),provided=args.indexOf('--files'),base=args.indexOf('--base');
 const comparison=base>=0?execFileSync('git',['merge-base','HEAD',args[base+1]],{encoding:'utf8'}).trim():provided>=0?'HEAD':execFileSync('git',['merge-base','HEAD','origin/test-live'],{encoding:'utf8'}).trim();
 const plan=selectTests(provided>=0?args[provided+1].split(','):changedFiles(comparison),{base:comparison});
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
