import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync} from 'node:child_process';
import {verifyFreshExport} from '../scripts/export-integrity.mjs';
const expected=JSON.parse(fs.readFileSync('exports/content/index.json','utf8'));
test('actual complete without retired news exports extraction catches changed source despite an untouched internally consistent old export',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'wk-source-export-'));try{
  const sources=new Set(['scripts/export-content.mjs','scripts/world-photo-index.mjs','app/world-photos.json','app/world-photo-core.json','app/world-photo-ids.json','app/world-photo-integrity.json',...expected.files.flatMap(f=>f.sources)]);
  for(const file of sources){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
  // TypeScript is the same installed parser; this fixture is not another development checkout.
  fs.symlinkSync(path.resolve('node_modules'),path.join(root,'node_modules'),'dir');fs.writeFileSync(path.join(root,'package.json'),'{"type":"module"}');
  const extract=()=>{execFileSync(process.execPath,['scripts/export-content.mjs','--check'],{cwd:root,stdio:'pipe'});return JSON.parse(fs.readFileSync(path.join(root,'.qa-output/content-check/index.json'),'utf8'));};
  const original=extract();assert.equal(verifyFreshExport(expected,original),true);assert.equal(original.files.length,43);assert.ok(original.files.some(f=>f.file==='people-illustrations.json'&&f.sources.includes('app/people-illustrations.json')),'both authored people schemas and their rights/source evidence share the same checked export');assert.ok(original.files.some(f=>f.file==='people-inquiries.json'&&f.sources.includes('app/people-inquiries.json')),'all six optional people reasoning tasks participate in the same source/export integrity check');assert.ok(original.files.some(f=>f.file==='animal-inquiries.json'&&f.sources.includes('app/animal-inquiries.json')),'workshop data is part of the same checked export');
  assert.equal(original.files.some(f=>['children-news.json','news-source-policy.json'].includes(f.file)),false,'removed news must not be exported');
  assert.ok(original.files.some(f=>f.file==='research-feedback.json'&&f.sources.includes('app/research-feedback.json')),'all laboratory feedback is part of the same checked export');
  assert.ok(original.files.some(f=>f.file==='animal-illustrations.json'&&f.sources.includes('app/animal-illustrations.json')),'own animal media participates in the identical source/export integrity check');
  const photoCorePath=path.join(root,'app/world-photo-core.json'),photoCore=fs.readFileSync(photoCorePath,'utf8');fs.writeFileSync(photoCorePath,'{}');assert.throws(extract,/Stale photo metadata projection/);fs.writeFileSync(photoCorePath,photoCore);
  const feedbackPath=path.join(root,'app/research-feedback.json'),feedbackText=fs.readFileSync(feedbackPath,'utf8'),feedback=JSON.parse(feedbackText);feedback.depth.easy[0]='Synthetic wrong-feedback fixture only';fs.writeFileSync(feedbackPath,JSON.stringify(feedback));assert.throws(()=>verifyFreshExport(expected,extract()),/Source and checked export differ/);fs.writeFileSync(feedbackPath,feedbackText);
  const projectionPath=path.join(root,'app/discovery-connections.json'),projection=fs.readFileSync(projectionPath,'utf8');fs.writeFileSync(projectionPath,'[]');assert.throws(extract,/Stale discovery connection projection/);fs.writeFileSync(projectionPath,projection);
  const graphPath=path.join(root,'app/world-connections.json'),graphText=fs.readFileSync(graphPath,'utf8'),graph=JSON.parse(graphText),firstTrail=JSON.parse(projection)[0].id;graph.connections=graph.connections.filter(c=>c.id!==firstTrail);fs.writeFileSync(graphPath,JSON.stringify(graph));assert.throws(extract,/Missing or ambiguous discovery connection/);fs.writeFileSync(graphPath,graphText);
  const countryPath=path.join(root,'app/country-metadata.json'),countries=JSON.parse(fs.readFileSync(countryPath,'utf8')),first=Object.keys(countries)[0];countries[first].capital='Synthetic stale-source fixture only';fs.writeFileSync(countryPath,JSON.stringify(countries));
  const changed=extract();assert.throws(()=>verifyFreshExport(expected,changed),/Source and checked export differ/);
  assert.notEqual(changed.files.find(f=>f.file==='country-metadata.json').sha256,expected.files.find(f=>f.file==='country-metadata.json').sha256);
  assert.throws(()=>verifyFreshExport(expected,{...original,files:original.files.slice(1)}),/Source and checked export differ/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
