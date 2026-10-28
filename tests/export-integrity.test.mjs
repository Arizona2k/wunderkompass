import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync} from 'node:child_process';
import {verifyFreshExport} from '../scripts/export-integrity.mjs';
import {DISCOVERY_CONNECTIONS} from '../app/discovery-data.ts';
const expected=JSON.parse(fs.readFileSync('exports/content/index.json','utf8'));
test('actual complete without retired news exports extraction catches changed source despite an untouched internally consistent old export',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'wk-source-export-'));try{
  const sources=new Set(['scripts/export-content.mjs','scripts/world-photo-index.mjs','app/world-photos.json','app/world-photo-core.json','app/world-photo-ids.json','app/world-photo-integrity.json',...expected.files.flatMap(f=>f.sources)]);
  for(const file of sources){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
  // TypeScript is the same installed parser; this fixture is not another development checkout.
  fs.symlinkSync(path.resolve('node_modules'),path.join(root,'node_modules'),'dir');fs.writeFileSync(path.join(root,'package.json'),'{"type":"module"}');
  const extract=()=>{execFileSync(process.execPath,['scripts/export-content.mjs','--check'],{cwd:root,stdio:'pipe'});return JSON.parse(fs.readFileSync(path.join(root,'.qa-output/content-check/index.json'),'utf8'));};
  const original=extract();assert.equal(verifyFreshExport(expected,original),true);assert.equal(original.files.length,47);assert.ok(original.files.some(f=>f.file==='book-light.json'&&f.entries===14&&f.sources.includes('app/book-light-content.json')&&f.sources.includes('app/book-light-word-link-index.json')),'all14light explanations and generated incoming links share the original complete source/export integrity path');assert.ok(original.files.some(f=>f.file==='book-heat.json'&&f.entries===6&&f.sources.includes('app/book-heat-content.json')),'six heat explanations share the existing checked source/export path');assert.equal(original.files.filter(f=>!['book-measurements.json','book-heat.json','book-light.json'].includes(f.file)).length,44,'all44 prior content exports remain alongside the seven-term measurement pack');assert.ok(original.files.some(f=>f.file==='book-measurements.json'&&f.entries===7&&f.sources.includes('app/book-measurement-content.json')),'the seven explanations share the same checked source/export integrity');assert.ok(original.files.some(f=>f.file==='device-illustrations.json'&&f.entries===3&&f.sources.includes('app/device-illustrations.json')),'all three device illustrations participate in the same checked source/export integrity');assert.ok(original.files.some(f=>f.file==='people-illustrations.json'&&f.sources.includes('app/people-illustrations.json')),'both authored people schemas and their rights/source evidence share the same checked export');assert.ok(original.files.some(f=>f.file==='people-inquiries.json'&&f.sources.includes('app/people-inquiries.json')),'all six optional people reasoning tasks participate in the same source/export integrity check');assert.ok(original.files.some(f=>f.file==='animal-inquiries.json'&&f.sources.includes('app/animal-inquiries.json')),'workshop data is part of the same checked export');
  assert.equal(original.files.some(f=>['children-news.json','news-source-policy.json'].includes(f.file)),false,'removed news must not be exported');
  assert.ok(original.files.some(f=>f.file==='research-feedback.json'&&f.sources.includes('app/research-feedback.json')),'all laboratory feedback is part of the same checked export');
  assert.ok(original.files.some(f=>f.file==='animal-illustrations.json'&&f.sources.includes('app/animal-illustrations.json')),'own animal media participates in the identical source/export integrity check');
  const devicePath=path.join(root,'app/device-illustrations.json'),deviceText=fs.readFileSync(devicePath,'utf8'),device=JSON.parse(deviceText);device.entries[0].caption='Synthetic falsely claimed photograph';fs.writeFileSync(devicePath,JSON.stringify(device));assert.throws(()=>verifyFreshExport(expected,extract()),/Source and checked export differ/,'an old export cannot hide changed device provenance');fs.writeFileSync(devicePath,deviceText);
  const photoCorePath=path.join(root,'app/world-photo-core.json'),photoCore=fs.readFileSync(photoCorePath,'utf8');fs.writeFileSync(photoCorePath,'{}');assert.throws(extract,/Stale photo metadata projection/);fs.writeFileSync(photoCorePath,photoCore);
  const feedbackPath=path.join(root,'app/research-feedback.json'),feedbackText=fs.readFileSync(feedbackPath,'utf8'),feedback=JSON.parse(feedbackText);feedback.depth.easy[0]='Synthetic wrong-feedback fixture only';fs.writeFileSync(feedbackPath,JSON.stringify(feedback));assert.throws(()=>verifyFreshExport(expected,extract()),/Source and checked export differ/);fs.writeFileSync(feedbackPath,feedbackText);
  const projectionPath=path.join(root,'app/discovery-connections.json'),projection=fs.readFileSync(projectionPath,'utf8');fs.writeFileSync(projectionPath,'[]');assert.throws(extract,/Stale discovery connection projection/);fs.writeFileSync(projectionPath,projection);
  const graphPath=path.join(root,'app/world-connections.json'),graphText=fs.readFileSync(graphPath,'utf8'),graph=JSON.parse(graphText),firstTrail=DISCOVERY_CONNECTIONS[0].id;graph.connections=graph.connections.filter(c=>c.id!==firstTrail);fs.writeFileSync(graphPath,JSON.stringify(graph));assert.throws(extract,/Missing or ambiguous discovery connection/);fs.writeFileSync(graphPath,graphText);
  const generatedTrail=JSON.parse(projection).find(c=>!DISCOVERY_CONNECTIONS.some(t=>t.id===c.id));assert.ok(generatedTrail,'expanded projection includes existing edges beyond curated trails');const withoutGenerated=JSON.parse(graphText);withoutGenerated.connections=withoutGenerated.connections.filter(c=>c.id!==generatedTrail.id);fs.writeFileSync(graphPath,JSON.stringify(withoutGenerated));assert.throws(extract,/Stale discovery connection projection/,'an old expanded projection cannot hide a removed generated edge');fs.writeFileSync(graphPath,graphText);
  const incomingPath=path.join(root,'app/book-light-word-link-index.json'),incomingOriginal=fs.readFileSync(incomingPath,'utf8');fs.writeFileSync(incomingPath,'{}');assert.throws(extract,/Stale light projection/,'generated reverse links cannot drift from their one canonical content source');fs.writeFileSync(incomingPath,incomingOriginal);
  const countryPath=path.join(root,'app/country-metadata.json'),countries=JSON.parse(fs.readFileSync(countryPath,'utf8')),first=Object.keys(countries)[0];countries[first].capital='Synthetic stale-source fixture only';fs.writeFileSync(countryPath,JSON.stringify(countries));
  const changed=extract();assert.throws(()=>verifyFreshExport(expected,changed),/Source and checked export differ/);
  assert.notEqual(changed.files.find(f=>f.file==='country-metadata.json').sha256,expected.files.find(f=>f.file==='country-metadata.json').sha256);
  assert.throws(()=>verifyFreshExport(expected,{...original,files:original.files.slice(1)}),/Source and checked export differ/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('actual early verifier accepts current static content before UI evidence exists, while final verification and stale-export gates stay closed',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'wk-early-content-'));
 try{
  for(const dir of ['app','build','components','hooks','lib','migration','public','content','exports','scripts','tests','.github'])fs.cpSync(dir,path.join(root,dir),{recursive:true});
  for(const file of ['package.json','tsconfig.json','vite.config.ts','pnpm-workspace.yaml'])fs.copyFileSync(file,path.join(root,file));
  fs.symlinkSync(path.resolve('node_modules'),path.join(root,'node_modules'),'dir');
  fs.mkdirSync(path.join(root,'dist'));fs.writeFileSync(path.join(root,'dist/index.html'),'<meta name="learning-build" content="synthetic-not-yet-UI-reviewed">');
  const reviews=JSON.parse(fs.readFileSync(path.join(root,'content/editorial-reviews.json'),'utf8'));for(const dossier of reviews.dossiers)delete dossier.ui;
  fs.writeFileSync(path.join(root,'content/editorial-reviews.json'),JSON.stringify(reviews));
  fs.mkdirSync(path.join(root,'.qa-output'));const final=path.join(root,'.qa-output/editorial-report.json');fs.writeFileSync(final,'untouched previous final report');
  const verify=(args=[])=>execFileSync(process.execPath,['scripts/verify-content.mjs',...args],{cwd:root,stdio:'pipe'});
  assert.throws(()=>verify(),/Invalid or stale individual dossier/,'original final-before-browser order blocks the not-yet-produced UI proof');
  verify(['--static-only']);const report=JSON.parse(fs.readFileSync(path.join(root,'.qa-output/editorial-static-report.json'),'utf8'));
  assert.ok(report.results.length>0&&report.results.every(r=>r.contentReady&&!Object.hasOwn(r,'structurallyReady')));assert.match(report.scope,/no current UI acceptance/);assert.equal(Object.hasOwn(report,'build'),false);
  assert.equal(fs.readFileSync(final,'utf8'),'untouched previous final report','an early report cannot replace a final UI acceptance file');
  fs.rmSync(path.join(root,'dist'),{recursive:true});verify(['--static-only']);assert.throws(()=>verify(),/ENOENT/,'full verification still requires a built product');
  assert.throws(()=>verify(['--skip-ui']),/Unknown verification argument/);
  const selection=()=>JSON.parse(execFileSync(process.execPath,['scripts/test-selection.mjs','--files','content/editorial-reviews.json'],{cwd:root,encoding:'utf8'}));
  assert.deepEqual(selection().browser,[]);
  const entry=path.join(root,'migration/main.tsx'),entrySource=fs.readFileSync(entry,'utf8');fs.appendFileSync(entry,'\nimport "../content/editorial-reviews.json";\n');
  assert.equal(selection().browser.length,10,'a newly introduced actual runtime dependency prevents the metadata-only selection');fs.writeFileSync(entry,entrySource);
  const file=path.join(root,'app/country-metadata.json'),countries=JSON.parse(fs.readFileSync(file,'utf8'));countries[Object.keys(countries)[0]].capital='Synthetic stale export only';fs.writeFileSync(file,JSON.stringify(countries));
  assert.throws(()=>verify(['--static-only']),/Source and checked export differ/,'early mode cannot bypass actual source/export integrity');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
