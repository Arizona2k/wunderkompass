import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import {collectInventory,compareBaseline} from './content-inventory.mjs';
import {editorialReport} from './editorial-contract.mjs';
import {sourceManifest,surfaceStates} from './inventory-provenance.mjs';
const dir=path.join(process.cwd(),'exports/content'),index=JSON.parse(fs.readFileSync(path.join(dir,'index.json'),'utf8'));
for(const f of index.files){const b=fs.readFileSync(path.join(dir,f.file));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),f.sha256,f.file);JSON.parse(b);}
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'world-topics.json'),'utf8')),JSON.parse(fs.readFileSync('app/world-catalog.json','utf8')));assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'challenge-hints.json'),'utf8')),JSON.parse(fs.readFileSync('app/challenge-hints.json','utf8')));assert.equal(index.topics,JSON.parse(fs.readFileSync('app/world-catalog.json','utf8')).length);assert.equal(index.journeys,16);assert.equal(index.chapters,80);assert.equal(index.personalProgressIncluded,false);console.log('VERIFIED',index.files.length,'content files.');

assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'journey-inquiries.json'),'utf8')),JSON.parse(fs.readFileSync('app/journey-inquiries.json','utf8')));
const inventory=collectInventory(),baseline=compareBaseline(inventory,JSON.parse(fs.readFileSync('content/excellence-baseline.json','utf8')));
const build=fs.readFileSync('dist/index.html','utf8').match(/name="learning-build" content="([^"]+)"/)?.[1];
assert.ok(build,'Current built learning metadata required');
const editorial=editorialReport(inventory,JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers,{build});
assert.ok(editorial.results.every(r=>r.structurallyReady),'Invalid or stale individual dossier');
fs.mkdirSync('.qa-output',{recursive:true});
fs.writeFileSync('.qa-output/content-inventory.json',JSON.stringify({...inventory,baseline},null,2)+'\n');
fs.writeFileSync('.qa-output/editorial-report.json',JSON.stringify({...editorial,build},null,2)+'\n');
fs.writeFileSync('.qa-output/source-manifest.json',JSON.stringify({...sourceManifest(),surfaceStates},null,2)+'\n');
console.log('INVENTORIED',inventory.records.length,'stable records; individually reviewed',editorial.results.length,'; scientific acceptance remains separate.');
