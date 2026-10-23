import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
import {REVIEW_LIMIT,reviewStorage,retainScreenshot,requiredScreenshots,prepareReview} from '../scripts/review-evidence.mjs';
test('critical states are always retained while interchangeable intermediate binaries can be reproduced',()=>{
 assert.ok(requiredScreenshots.every(retainScreenshot));
 for(const f of ['journey-engine-webkit-390.png','quality-learning-journey-native-zoom-200.png','quality-navigation-offline-start.png','quality-navigation-updates-archive-320-full.png','quality-learning-journey-water-390.png'])assert.equal(retainScreenshot(f),true,f);
 assert.equal(retainScreenshot('quality-navigation-home-first-360-full.png'),false);
});
test('failed runs retain every actual image; corrupted image evidence fails closed',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-evidence-'));try{
  const png=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(png);png.writeUInt32BE(320,16);png.writeUInt32BE(844,20);
  await fs.writeFile(path.join(dir,'quality-navigation-home-first-360-full.png'),png);
  await fs.writeFile(path.join(dir,'portable-report.json'),JSON.stringify({status:'failed',scope:'complete mandatory regression'}));
  const report=await prepareReview(dir);assert.equal(report.status,'diagnostic');assert.equal(report.screenshots[0].retained,true);assert.equal(report.screenshots[0].width,320);
  await fs.writeFile(path.join(dir,'quality-broken.png'),'not a screenshot');await assert.rejects(prepareReview(dir),/Invalid screenshot/);assert.equal(JSON.parse(await fs.readFile(path.join(dir,'review/portable-report.json'),'utf8')).status,'failed','diagnostic report survives damaged image');
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('a successful browser report without current handoff or critical images cannot pass upload acceptance',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-evidence-'));try{await fs.writeFile(path.join(dir,'portable-report.json'),JSON.stringify({status:'passed',scope:'complete mandatory regression',build:'synthetic'}));await assert.rejects(prepareReview(dir),/handoff/);}finally{await fs.rm(dir,{recursive:true,force:true});}
});

test('interrupted isolated engines preserve separate partial originals and damaged partial PNGs fail closed',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-partial-engine-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));
 const png=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(png);png.writeUInt32BE(390,16);png.writeUInt32BE(844,20);
 const originals=[];
 for(const [index,engine]of ['firefox','webkit'].entries()){
  const worker=path.join(dir,'journey-engine-work',engine);await fs.mkdir(worker,{recursive:true});const bytes=Buffer.concat([png,Buffer.from('synthetic fixture '+index)]);await fs.writeFile(path.join(worker,'same.png'),bytes);await fs.writeFile(path.join(worker,'failure.json'),JSON.stringify({synthetic:engine,status:'interrupted'}));originals.push({engine,worker,bytes});
 }
 await fs.writeFile(path.join(dir,'portable-report.json'),JSON.stringify({status:'failed',scope:'complete mandatory regression'}));const result=await prepareReview(dir);assert.equal(result.status,'diagnostic');assert.equal(result.screenshots.length,2);
 for(const {engine,worker,bytes}of originals){const name='journey-engine-'+engine+'-partial-same.png',entry=result.screenshots.find(s=>s.file===name);assert.equal(entry.retained,true);assert.equal(entry.sourceFile,path.join('journey-engine-work',engine,'same.png'));assert.deepEqual(await fs.readFile(path.join(dir,'review',name)),bytes);assert.deepEqual(await fs.readFile(path.join(worker,'same.png')),bytes);assert.equal(JSON.parse(await fs.readFile(path.join(dir,'review','journey-engine-'+engine+'-partial-failure.json'),'utf8')).synthetic,engine);}
 await fs.writeFile(path.join(originals[0].worker,'damaged.png'),'unfinished image');await assert.rejects(prepareReview(dir),/Invalid screenshot journey-engine-firefox-partial-damaged.png/);assert.equal(JSON.parse(await fs.readFile(path.join(dir,'review','journey-engine-firefox-partial-failure.json'),'utf8')).status,'interrupted');
});

 test('review budget is exactly 150 decimal MB and storage accounting never deletes identical evidence',()=>{
 assert.equal(REVIEW_LIMIT,150_000_000);const a={file:'focus-320.png',bytes:100,sha256:'same',retained:true},b={...a,file:'focus-390.png'},c={...a,file:'already-omitted.png',retained:false};
 const r=reviewStorage([a,b,c],200);assert.equal(r.retainedImages,2);assert.equal(r.reserveBytes,149_999_800);assert.equal(r.exactDuplicates.retainedExtraBytes,100);assert.equal(r.exactDuplicates.alreadyOmittedCopiesWithRetainedOriginal,1);assert.equal(r.exactDuplicates.automaticDuplicateRemovals,0);
 assert.equal(reviewStorage([],150_000_000).withinBudget,true);assert.equal(reviewStorage([],150_000_001).withinBudget,false);
 for(const invalid of [-1,NaN,Infinity,0.1])assert.equal(reviewStorage([],invalid).withinBudget,false);
 });
