import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
import {retainScreenshot,requiredScreenshots,prepareReview} from '../scripts/review-evidence.mjs';
import {sourceDigest} from '../scripts/handoff.mjs';
import {createHash} from 'node:crypto';
test('critical states are always retained while interchangeable intermediate binaries can be reproduced',()=>{
 assert.ok(requiredScreenshots.every(retainScreenshot));assert.equal(retainScreenshot('quality-book-why-59-1440.png'),true);assert.equal(retainScreenshot('quality-book-why-source-25-320.png'),true);assert.equal(retainScreenshot('quality-book-why-starter-35-320.png'),true);assert.equal(retainScreenshot('quality-book-why-0-320.png'),false,'full Why card remains captured/hashed; readable critical crops retained');
 for(const model of ['length','duration','temperature'])for(const width of [320,1440])assert.equal(retainScreenshot('quality-learning-book-model-'+model+'-'+width+'.png'),true);
 for(const prefix of ['quality-learning','quality-book']){for(const model of ['length','duration','temperature'])for(const width of [320,1440])assert.equal(retainScreenshot(prefix+'-book-model-'+model+'-'+width+'.png'),true);assert.equal(retainScreenshot(prefix+'-book-native-200-large.png'),true);assert.equal(retainScreenshot(prefix+'-book-photon-320.png'),false);}
 assert.equal(retainScreenshot('quality-learning-book-native-200-large.png'),true);assert.equal(retainScreenshot('quality-learning-book-temperature-large-320.png'),true);assert.equal(retainScreenshot('quality-learning-book-meter-320.png'),false,'long full word card remains captured/hashed, readable close-up retained');
 for(const f of ['quality-research-science-cell-hero-320.png','quality-research-science-native-200-large.png','quality-research-science-surface-tension-large-320.png','quality-research-science-encryption-large-320.png','journey-engine-webkit-320.png','quality-learning-journey-native-zoom-200.png','quality-navigation-offline-start.png','quality-navigation-updates-all-details-320-full.png','quality-learning-journey-water-390.png'])assert.equal(retainScreenshot(f),true,f);
 for(const f of ['journey-engine-webkit-390.png','journey-engine-firefox-768.png','quality-learning-journey-large-focus-768.png','quality-navigation-updates-archive-320-full.png','quality-navigation-home-first-360-full.png'])assert.equal(retainScreenshot(f),false,f);
 for(const engine of ['chromium','firefox','webkit'])for(const width of [320,1440])assert.equal(retainScreenshot('journey-engine-'+engine+'-'+width+'.png'),true);
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
test('final collection preserves hashes for every omitted original and rejects missing or changed sealed retained images',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-ledger-'));
 try{
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aYJkAAAAASUVORK5CYII=','base64'),sha=createHash('sha256').update(png).digest('hex'),digest=await sourceDigest();
  await fs.writeFile(path.join(dir,'portable-report.json'),JSON.stringify({status:'passed',scope:'complete mandatory regression',build:'same-build'}));await fs.writeFile(path.join(dir,'handoff.json'),JSON.stringify({sourceDigest:digest,build:'same-build'}));
  for(const name of requiredScreenshots)await fs.writeFile(path.join(dir,name),png);
  const omitted={file:'quality-book-why-0-320.png',bytes:9876,width:320,height:1400,sha256:'a'.repeat(64),retained:false};
  const ledger={status:'passed',build:'same-build',sourceDigest:digest,screenshots:[omitted,...requiredScreenshots.map(file=>({file,bytes:png.length,width:1,height:1,sha256:sha,retained:true}))]};await fs.writeFile(path.join(dir,'review-manifest.json'),JSON.stringify(ledger));
  const result=await prepareReview(dir,{sealedCaptureLedger:ledger});assert.equal(result.status,'passed');assert.deepEqual(result.screenshots.find(s=>s.file===omitted.file),omitted);assert.equal(result.screenshots.length,requiredScreenshots.length+1);assert.equal(result.generatedBytes,result.retainedBytes+9876);
  await fs.writeFile(path.join(dir,requiredScreenshots[0]),Buffer.concat([png,Buffer.from('changed')]));await assert.rejects(prepareReview(dir,{sealedCaptureLedger:ledger}),/Changed sealed screenshot/);
  await fs.unlink(path.join(dir,requiredScreenshots[0]));await assert.rejects(prepareReview(dir,{sealedCaptureLedger:ledger}),/Missing sealed screenshot/);
  await assert.rejects(prepareReview(dir,{sealedCaptureLedger:{...ledger,sourceDigest:'c'.repeat(64)}}),/Mixed sealed/);
  await assert.rejects(prepareReview(dir,{sealedCaptureLedger:{...ledger,screenshots:[...ledger.screenshots,ledger.screenshots[0]]}}),/Invalid sealed/);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
