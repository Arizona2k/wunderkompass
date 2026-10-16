import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {measureBuild,violations,observedTrends} from '../scripts/performance-budget.mjs';
import {selectTests,checkSyntaxFiles} from '../scripts/test-selection.mjs';
import {REQUIRED_SUITES} from '../scripts/quality-evidence.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';

test('bundle budget includes transitive shared chunks once, excludes deferred readers, and fails oversize/missing metrics',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wk-budget-'));
 try{
  fs.mkdirSync(path.join(dir,'.vite'));fs.mkdirSync(path.join(dir,'assets'));
  const manifest={'index.html':{isEntry:true,file:'assets/main.js',css:['assets/main.css'],imports:['shared'],dynamicImports:['reader']},shared:{file:'assets/shared.js',imports:['index.html']},reader:{file:'assets/reader.js'}};
  fs.writeFileSync(path.join(dir,'.vite/manifest.json'),JSON.stringify(manifest));
  for(const [name,text] of [['main.js','123'],['shared.js','4567'],['reader.js','large article'],['main.css','css']])fs.writeFileSync(path.join(dir,'assets',name),text);fs.writeFileSync(path.join(dir,'world.json'),'{}');
  fs.writeFileSync(path.join(dir,'assets','journey-inquiries-fixture.json'),JSON.stringify({text:'deferred inquiry content'}));
  const m=measureBuild(dir);assert.ok(m.journeyInquiryGzipBytes>0);assert.equal(violations(m,{journeyInquiryGzipBytes:1})[0].metric,'journeyInquiryGzipBytes');assert.equal(m.entryJsBytes,7);assert.equal(m.entryCssBytes,3);assert.equal(m.totalJsBytes,20);assert.equal(m.entryFiles.length,2);
  assert.deepEqual(violations(m,{entryJsBytes:7}),[]);assert.equal(violations(m,{entryJsBytes:6})[0].metric,'entryJsBytes');assert.equal(violations({}, {entryJsBytes:7}).length,1);fs.rmSync(path.join(dir,'assets','journey-inquiries-fixture.json'));assert.throws(()=>measureBuild(dir),/One current journey inquiry/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('local selection follows real transitive unit dependencies and retains conservative browser/CI boundaries',()=>{
 const hints=selectTests(['app/challenge-hints.json']);assert.ok(hints.unitTests.includes('tests/challenge.test.mjs'));assert.deepEqual(hints.browser,['challenge','offline']);assert.equal(hints.fullRequiredBeforeReady,true);
 const stored=selectTests(['app/progress-storage.ts']);assert.ok(stored.unitTests.includes('tests/progress.test.mjs'));assert.ok(stored.unitTests.includes('tests/playground.test.mjs'));assert.ok(stored.browser.includes('backup'));assert.ok(stored.browser.includes('offline'));
 for(const file of ['vite.config.ts','app/foundation.css','app/world-reader.tsx','unknown-runtime.js']){const p=selectTests([file]);assert.ok(p.browser.includes('foundation'),file);assert.ok(p.browser.includes('core'),file);}
 assert.deepEqual(selectTests(['README.md']).browser,[]);assert.deepEqual(selectTests(['README.md']).unitTests,[]);
 assert.equal(selectTests(['scripts/release/policy.cjs']).release,true);assert.ok(selectTests(['package.json']).unitTests.includes('tests/playground.test.mjs'));
 const news=selectTests(['scripts/news/engine.mjs']);assert.ok(news.unitTests.includes('tests/news.test.mjs'));assert.deepEqual(news.browser,[]);assert.equal(news.release,false);
 const removed=selectTests(['app/deleted-runtime-dependency.mjs']);assert.ok(removed.unitTests.includes('tests/progress.test.mjs'));assert.ok(removed.browser.includes('backup'));
 assert.ok(selectTests(['app/news-content.json']).browser.includes('research'),'published news is browser content');
});
test('offline fingerprint covers entry/config/package changes, ignores local evidence and is content-based',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'wk-inputs-'));
 try{fs.mkdirSync(path.join(root,'app'));fs.mkdirSync(path.join(root,'migration'));fs.mkdirSync(path.join(root,'work'));fs.writeFileSync(path.join(root,'app/a.ts'),'old');fs.writeFileSync(path.join(root,'vite.config.ts'),'before');fs.writeFileSync(path.join(root,'migration/main.tsx'),'entry');fs.writeFileSync(path.join(root,'index.html'),'html');fs.writeFileSync(path.join(root,'tsconfig.json'),'{}');
 const initial=learningFingerprint(root);fs.writeFileSync(path.join(root,'work/proof.json'),'not runtime');assert.equal(learningFingerprint(root),initial);
 fs.writeFileSync(path.join(root,'vite.config.ts'),'after');const config=learningFingerprint(root);assert.notEqual(config,initial);assert.equal(learningFingerprint(root),config);
 fs.writeFileSync(path.join(root,'migration/main.tsx'),'other');assert.notEqual(learningFingerprint(root),config);for(const file of ['index.html','tsconfig.json','pnpm-workspace.yaml']){const before=learningFingerprint(root);fs.writeFileSync(path.join(root,file),'changed');assert.notEqual(learningFingerprint(root),before,file+' must invalidate the offline version');}
 fs.mkdirSync(path.join(root,'content'));const before=learningFingerprint(root);fs.writeFileSync(path.join(root,'content/news-source-policy.json'),'{"hosts":[]}');assert.notEqual(learningFingerprint(root),before,'active news validation policy must renew offline build');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('compact world index preserves every catalog identity and all overview/timeline fields without embedding full articles',()=>{
 const index=JSON.parse(fs.readFileSync('app/world-index.json','utf8')),full=JSON.parse(fs.readFileSync('app/world-catalog.json','utf8'));
 assert.deepEqual(index.map(t=>t.id),full.map(t=>t.id));
 for(let i=0;i<full.length;i++){const a=index[i],b=full[i];for(const k of ['id','category','title','intro','aliases','locations','image','model'])assert.deepEqual(a[k],b[k],b.id+' '+k);assert.equal(a.group,b.animal?.group);assert.equal(a.habitat,b.animal?.habitat);assert.equal(a.date,b.history?.date??b.invention?.date);assert.equal(a.year,b.history?.year??b.invention?.year);assert.equal(a.field,b.person?.field);assert.equal(a.lifespan,b.person?.lifespan);assert.equal(a.sensitive,b.history?.sensitive);assert.equal(a.question,undefined);assert.equal(a.paragraphs,undefined);}
});

test('authorised aggregate growth stays measured while initial and individual budgets remain enforced',()=>{
 const c=JSON.parse(fs.readFileSync('performance-budgets.json','utf8'));
 for(const key of ['totalJsBytes','totalJsGzipBytes','journeyInquiryGzipBytes']){assert.equal(c.build[key],undefined);assert.ok(c.observeOnly.includes(key));}
 const large={totalJsBytes:100000000,totalJsGzipBytes:50000000,journeyInquiryBytes:20000000,journeyInquiryGzipBytes:10000000};
 assert.deepEqual(violations({...large,...c.build},c.build),[]);assert.equal(observedTrends(large,c.observeOnly).totalJsGzipBytes.current,50000000);assert.throws(()=>observedTrends({},c.observeOnly),/Missing observed/);
 for(const key of ['entryJsBytes','entryJsGzipBytes','entryCssBytes','entryCssGzipBytes','largestJsBytes','worldGeometryBytes']){assert.ok(c.build[key]>0);assert.equal(violations({...c.build,[key]:c.build[key]+1},c.build)[0].metric,key);}
});

test('local changed-module syntax rejects the actual duplicate-import failure before any browser execution',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wk-node-syntax-'));
 try{const file=path.join(dir,'browser-module.mjs');fs.writeFileSync(file,"import {createHash} from 'node:crypto';\nimport {createHash} from 'node:crypto';\n");assert.throws(()=>checkSyntaxFiles([file]),/Node syntax check failed/);fs.writeFileSync(file,"import {createHash} from 'node:crypto';\nexport const hash = createHash;\n");assert.deepEqual(checkSyntaxFiles([file]).checked,[file]);assert.ok(selectTests(['tests/browser/foundation.mjs']).syntaxFiles.includes('tests/browser/foundation.mjs'));assert.deepEqual(selectTests(['README.md']).syntaxFiles,[]);assert.deepEqual(selectTests(['app/deleted-runtime-dependency.mjs']).syntaxFiles,[]);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('local conservative selection uses the same required UI groups as full acceptance',()=>{for(const file of ['unknown-runtime-input.js','scripts/quality-evidence.mjs','app/learning-data.ts'])assert.deepEqual(new Set(selectTests([file]).browser),new Set(REQUIRED_SUITES.filter(s=>s!=='news-feed')));assert.deepEqual(selectTests(['app/challenge-hints.json']).browser,['challenge','offline']);});
