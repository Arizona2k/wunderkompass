import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {measureBuild,violations,observedTrends} from '../scripts/performance-budget.mjs';
import {selectTests,changeImpact} from '../scripts/test-selection.mjs';
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
  fs.writeFileSync(path.join(dir,'assets','book-core-fixture.json'),'{}');fs.writeFileSync(path.join(dir,'assets','journey-content-fixture.json'),'{}');
  for(const category of ['animals','history','people','inventions','buildings','science'])fs.writeFileSync(path.join(dir,'assets','world-content-'+category+'-fixture.json'),'{}');
  fs.writeFileSync(path.join(dir,'assets','book-study-why-fixture.json'),'{}');const m=measureBuild(dir);assert.equal(m.worldTextBytes,12);assert.equal(violations(m,{worldTextGzipBytes:1})[0].metric,'worldTextGzipBytes');
  fs.unlinkSync(path.join(dir,'assets','world-content-science-fixture.json'));assert.throws(()=>measureBuild(dir),/All six current world/);fs.writeFileSync(path.join(dir,'assets','world-content-science-fixture.json'),'{}');assert.ok(m.journeyInquiryGzipBytes>0);assert.equal(violations(m,{journeyInquiryGzipBytes:1})[0].metric,'journeyInquiryGzipBytes');assert.equal(m.entryJsBytes,7);assert.equal(m.entryCssBytes,3);assert.equal(m.totalJsBytes,20);assert.equal(m.entryFiles.length,2);
  assert.deepEqual(violations(m,{entryJsBytes:7}),[]);assert.equal(violations(m,{entryJsBytes:6})[0].metric,'entryJsBytes');assert.equal(violations({}, {entryJsBytes:7}).length,1);
  assert.equal(m.learningTextBytes,6);assert.equal(violations(m,{learningTextGzipBytes:1})[0].metric,'learningTextGzipBytes');
  fs.writeFileSync(path.join(dir,'assets','book-study-aaaaaaaaaaaaaaaa-fixture.json'),'extra');fs.writeFileSync(path.join(dir,'assets','book-search-fixture.json'),'search');const split=measureBuild(dir);assert.equal(split.initialLearningTextBytes,4);assert.equal(split.bookStudyTextBytes,13);assert.equal(split.learningTextBytes,17,'deferred payloads remain measured in total transfer');assert.equal(split.largestBookStudyBytes,5);assert.equal(violations(split,{largestBookStudyBytes:4})[0].metric,'largestBookStudyBytes');assert.equal(violations(split,{initialLearningTextBytes:3})[0].metric,'initialLearningTextBytes');assert.equal(violations(split,{learningTextBytes:16})[0].metric,'learningTextBytes');
  fs.writeFileSync(path.join(dir,'assets','book-search-second-fixture.json'),'longer search');fs.writeFileSync(path.join(dir,'assets','book-study-index-fixture.json'),'metadata');const partitioned=measureBuild(dir);assert.equal(partitioned.bookSearchBytes,13);assert.equal(partitioned.totalBookSearchBytes,19);assert.equal(partitioned.largestBookStudyBytes,5,'metadata is not a word part');assert.equal(partitioned.bookStudyIndexBytes,8);assert.equal(violations(partitioned,{bookSearchBytes:12})[0].metric,'bookSearchBytes');assert.equal(violations(partitioned,{bookStudyIndexBytes:7})[0].metric,'bookStudyIndexBytes');
  assert.equal(partitioned.bookWhyBytes,2);assert.equal(violations(partitioned,{bookWhyBytes:1})[0].metric,'bookWhyBytes');fs.unlinkSync(path.join(dir,'assets','book-study-why-fixture.json'));assert.throws(()=>measureBuild(dir),/One current Why payload/);fs.writeFileSync(path.join(dir,'assets','book-study-why-fixture.json'),'{}');
  fs.unlinkSync(path.join(dir,'assets','book-core-fixture.json'));assert.throws(()=>measureBuild(dir),/Both current learning text payloads/);
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
 assert.ok(selectTests(['app/book-content.json']).browser.includes('book'),'actual book contents retain the independent viewport/native-zoom group in local selection');
 assert.ok(selectTests(['app/nature-content.json']).browser.includes('nature'),'unknown/shared selection must include the actual nature group');
});
test('change impact distinguishes explicit relationships, stale search entries and persistent-data risk without pretending semantic approval',()=>{
 const before=[{id:'a',title:'Old',category:'science',intro:'A',related:['b']},{id:'b',title:'B',category:'science',intro:'B',related:['a']}],catalog=structuredClone(before);catalog[0].title='Changed';
 const options={catalog,index:before,previous:before,exportIndex:{files:[{file:'world-topics.json',sources:['app/world-catalog.json']}]}};
 const r=changeImpact(['app/world-catalog.json'],options);assert.deepEqual(r.changedTopicIds,['a']);assert.deepEqual(r.relatedEditorialCandidates,['b']);assert.deepEqual(r.searchIndexMismatches,['a']);assert.deepEqual(r.generatedExports,['exports/content/world-topics.json']);assert.equal(r.offlineBuildReview,true);assert.equal(r.savedProgressReview,false);
 assert.equal(changeImpact(['app/progress-storage.ts']).savedProgressReview,true);
 assert.deepEqual(changeImpact(['content/invention-editorial-review.json']).changedTopicIds,[],'prepared manuscripts are not catalog additions');
 for(const broken of [[catalog[0],catalog[0]],[{...catalog[0],related:['missing']},catalog[1]]])assert.throws(()=>changeImpact(['app/world-catalog.json'],{...options,catalog:broken}));
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
 for(let i=0;i<full.length;i++){const a=index[i],b=full[i];for(const k of ['id','category','title','intro','aliases','locations','image','model'])assert.deepEqual(a[k],b[k],b.id+' '+k);assert.equal(a.group,b.animal?.group);assert.equal(a.habitat,b.animal?.habitat);assert.equal(a.date,b.history?.date??b.invention?.date);assert.equal(a.year,b.history?.year??b.invention?.year);assert.equal(a.field,b.person?.field);assert.equal(a.lifespan,b.person?.lifespan);assert.equal(a.sensitive,b.history?.sensitive);assert.equal(a.inventionModel,b.invention?.model);assert.equal(a.question,undefined);assert.equal(a.paragraphs,undefined);}
});

test('authorised total growth metrics remain visible without global caps; initial and individual safety budgets still fail closed',()=>{
 const config=JSON.parse(fs.readFileSync('performance-budgets.json','utf8'));
 for(const name of ['totalJsBytes','totalJsGzipBytes','journeyInquiryGzipBytes']){assert.equal(config.build[name],undefined);assert.ok(config.observeOnly.includes(name));}
 const enormous={totalJsBytes:100000000,totalJsGzipBytes:50000000,journeyInquiryBytes:20000000,journeyInquiryGzipBytes:10000000};
 assert.deepEqual(violations({...enormous,...config.build},config.build),[],'aggregate growth alone cannot reject a valid initial/individual build');
 const trends=observedTrends(enormous,config.observeOnly);assert.equal(trends.totalJsGzipBytes.current,50000000);assert.equal(trends.journeyInquiryGzipBytes.current,10000000);assert.ok(trends.totalJsGzipBytes.difference>0);
 assert.throws(()=>observedTrends({},config.observeOnly),/Missing observed/);
 for(const key of ['entryJsBytes','entryJsGzipBytes','entryCssBytes','largestBookStudyBytes','bookStudyIndexBytes','bookWhyBytes'])assert.ok(config.build[key]>0,key+' protection retained');
 const invalid={...config.build,entryJsGzipBytes:config.build.entryJsGzipBytes+1};assert.equal(violations(invalid,config.build)[0].metric,'entryJsGzipBytes');
});


test('conservative local browser selection retains every mandatory UI group after suite extraction',()=>{
 const required=REQUIRED_SUITES.filter(s=>s!=='news-feed');
 for(const file of ['app/book-content.json','app/invention-blueprint.tsx','app/world-topic.tsx','scripts/quality-evidence.mjs','unknown-runtime-input.js']){
  const plan=selectTests([file]);assert.deepEqual(new Set(plan.browser),new Set(required),file+' cannot lose a required extracted UI group');assert.equal(plan.fullRequiredBeforeReady,true);
 }
 // Deliberately narrow iteration and the isolated signed-feed lane remain
 // separate from mandatory full acceptance; this does not broaden every edit.
 assert.deepEqual(selectTests(['app/challenge-hints.json']).browser,['challenge','offline']);
 assert.deepEqual(selectTests(['scripts/news/engine.mjs']).browser,[]);
 assert.deepEqual(selectTests(['README.md']).browser,[]);
});

test('authorised aggregate growth stays measured while initial and individual budgets remain enforced',()=>{
 const c=JSON.parse(fs.readFileSync('performance-budgets.json','utf8'));
 for(const key of ['totalJsBytes','totalJsGzipBytes','journeyInquiryGzipBytes']){assert.equal(c.build[key],undefined);assert.ok(c.observeOnly.includes(key));}
 const large={totalJsBytes:100000000,totalJsGzipBytes:50000000,journeyInquiryBytes:20000000,journeyInquiryGzipBytes:10000000};
 assert.deepEqual(violations({...large,...c.build},c.build),[]);assert.equal(observedTrends(large,c.observeOnly).totalJsGzipBytes.current,50000000);assert.throws(()=>observedTrends({},c.observeOnly),/Missing observed/);
 for(const key of ['entryJsBytes','entryJsGzipBytes','entryCssBytes','entryCssGzipBytes','largestJsBytes','worldGeometryBytes']){assert.ok(c.build[key]>0);assert.equal(violations({...c.build,[key]:c.build[key]+1},c.build)[0].metric,key);}
});
