import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {measureBuild,violations} from '../scripts/performance-budget.mjs';
import {selectTests} from '../scripts/test-selection.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';

test('bundle budget includes transitive shared chunks once, excludes deferred readers, and fails oversize/missing metrics',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wk-budget-'));
 try{
  fs.mkdirSync(path.join(dir,'.vite'));fs.mkdirSync(path.join(dir,'assets'));
  const manifest={'index.html':{isEntry:true,file:'assets/main.js',css:['assets/main.css'],imports:['shared'],dynamicImports:['reader']},shared:{file:'assets/shared.js',imports:['index.html']},reader:{file:'assets/reader.js'}};
  fs.writeFileSync(path.join(dir,'.vite/manifest.json'),JSON.stringify(manifest));
  for(const [name,text] of [['main.js','123'],['shared.js','4567'],['reader.js','large article'],['main.css','css']])fs.writeFileSync(path.join(dir,'assets',name),text);fs.writeFileSync(path.join(dir,'world.json'),'{}');
  const m=measureBuild(dir);assert.equal(m.entryJsBytes,7);assert.equal(m.entryCssBytes,3);assert.equal(m.totalJsBytes,20);assert.equal(m.entryFiles.length,2);
  assert.deepEqual(violations(m,{entryJsBytes:7}),[]);assert.equal(violations(m,{entryJsBytes:6})[0].metric,'entryJsBytes');assert.equal(violations({}, {entryJsBytes:7}).length,1);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('local selection follows real transitive unit dependencies and retains conservative browser/CI boundaries',()=>{
 const hints=selectTests(['app/challenge-hints.json']);assert.ok(hints.unitTests.includes('tests/challenge.test.mjs'));assert.deepEqual(hints.browser,['challenge','offline']);assert.equal(hints.fullRequiredBeforeReady,true);
 const stored=selectTests(['app/progress-storage.ts']);assert.ok(stored.unitTests.includes('tests/progress.test.mjs'));assert.ok(stored.unitTests.includes('tests/playground.test.mjs'));assert.ok(stored.browser.includes('backup'));assert.ok(stored.browser.includes('offline'));
 for(const file of ['vite.config.ts','app/foundation.css','app/world-reader.tsx','unknown-runtime.js']){const p=selectTests([file]);assert.ok(p.browser.includes('foundation'),file);assert.ok(p.browser.includes('core'),file);}
 assert.deepEqual(selectTests(['README.md']).browser,[]);assert.deepEqual(selectTests(['README.md']).unitTests,[]);
 assert.equal(selectTests(['scripts/release/policy.cjs']).release,true);assert.ok(selectTests(['package.json']).unitTests.includes('tests/playground.test.mjs'));
});
test('offline fingerprint covers entry/config/package changes, ignores local evidence and is content-based',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'wk-inputs-'));
 try{fs.mkdirSync(path.join(root,'app'));fs.mkdirSync(path.join(root,'migration'));fs.mkdirSync(path.join(root,'work'));fs.writeFileSync(path.join(root,'app/a.ts'),'old');fs.writeFileSync(path.join(root,'vite.config.ts'),'before');fs.writeFileSync(path.join(root,'migration/main.tsx'),'entry');fs.writeFileSync(path.join(root,'index.html'),'html');fs.writeFileSync(path.join(root,'tsconfig.json'),'{}');
 const initial=learningFingerprint(root);fs.writeFileSync(path.join(root,'work/proof.json'),'not runtime');assert.equal(learningFingerprint(root),initial);
 fs.writeFileSync(path.join(root,'vite.config.ts'),'after');const config=learningFingerprint(root);assert.notEqual(config,initial);assert.equal(learningFingerprint(root),config);
 fs.writeFileSync(path.join(root,'migration/main.tsx'),'other');assert.notEqual(learningFingerprint(root),config);for(const file of ['index.html','tsconfig.json']){const before=learningFingerprint(root);fs.writeFileSync(path.join(root,file),'changed');assert.notEqual(learningFingerprint(root),before,file+' must invalidate the offline version');}
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('compact world index preserves every catalog identity and all overview/timeline fields without embedding full articles',()=>{
 const index=JSON.parse(fs.readFileSync('app/world-index.json','utf8')),full=JSON.parse(fs.readFileSync('app/world-catalog.json','utf8'));
 assert.deepEqual(index.map(t=>t.id),full.map(t=>t.id));
 for(let i=0;i<full.length;i++){const a=index[i],b=full[i];for(const k of ['id','category','title','intro','aliases','locations','image','model'])assert.deepEqual(a[k],b[k],b.id+' '+k);assert.equal(a.group,b.animal?.group);assert.equal(a.habitat,b.animal?.habitat);assert.equal(a.date,b.history?.date??b.invention?.date);assert.equal(a.year,b.history?.year??b.invention?.year);assert.equal(a.field,b.person?.field);assert.equal(a.lifespan,b.person?.lifespan);assert.equal(a.sensitive,b.history?.sensitive);assert.equal(a.question,undefined);assert.equal(a.paragraphs,undefined);}
});
