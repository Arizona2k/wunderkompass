import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync} from 'node:child_process';
import {verifyFreshExport} from '../scripts/export-integrity.mjs';
const expected=JSON.parse(fs.readFileSync('exports/content/index.json','utf8'));
test('actual forty-source extraction catches changed source despite an untouched internally consistent old export',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'wk-source-export-'));try{
  const sources=new Set(['scripts/export-content.mjs',...expected.files.flatMap(f=>f.sources)]);
  for(const file of sources){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
  // TypeScript is the same installed parser; this fixture is not another development checkout.
  fs.symlinkSync(path.resolve('node_modules'),path.join(root,'node_modules'),'dir');fs.writeFileSync(path.join(root,'package.json'),'{"type":"module"}');
  const extract=()=>{execFileSync(process.execPath,['scripts/export-content.mjs','--check'],{cwd:root,stdio:'pipe'});return JSON.parse(fs.readFileSync(path.join(root,'.qa-output/content-check/index.json'),'utf8'));};
  const original=extract();assert.equal(verifyFreshExport(expected,original),true);assert.equal(original.files.length,40);
  const countryPath=path.join(root,'app/country-metadata.json'),countries=JSON.parse(fs.readFileSync(countryPath,'utf8')),first=Object.keys(countries)[0];countries[first].capital='Synthetic stale-source fixture only';fs.writeFileSync(countryPath,JSON.stringify(countries));
  const changed=extract();assert.throws(()=>verifyFreshExport(expected,changed),/Source and checked export differ/);
  assert.notEqual(changed.files.find(f=>f.file==='country-metadata.json').sha256,expected.files.find(f=>f.file==='country-metadata.json').sha256);
  assert.throws(()=>verifyFreshExport(expected,{...original,files:original.files.slice(1)}),/Source and checked export differ/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
