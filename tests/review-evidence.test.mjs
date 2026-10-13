import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
import {retainScreenshot,requiredScreenshots,prepareReview} from '../scripts/review-evidence.mjs';
test('critical states are always retained while interchangeable intermediate binaries can be reproduced',()=>{
 assert.ok(requiredScreenshots.every(retainScreenshot));
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
