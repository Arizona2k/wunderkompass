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

test('interrupted known native journey-help files retain exact originals and source paths',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-partial-journey-help-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));const png=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(png);png.writeUInt32BE(320,16);png.writeUInt32BE(900,20);
 for(const engine of ['firefox','webkit']){const help=path.join(dir,'journey-engine-work',engine,'journey-help-'+engine);await fs.mkdir(help,{recursive:true});await fs.writeFile(path.join(help,'same.png'),png);await fs.writeFile(path.join(help,'transfer.json'),JSON.stringify({synthetic:engine}));}
 const result=await prepareReview(dir);assert.equal(result.status,'diagnostic');assert.equal(result.screenshots.length,2);
 for(const engine of ['firefox','webkit']){const name='journey-engine-'+engine+'-partial-journey-help-'+engine+'-same.png',entry=result.screenshots.find(s=>s.file===name);assert.equal(entry.retained,true);assert.equal(entry.sourceFile,path.join('journey-engine-work',engine,'journey-help-'+engine,'same.png'));assert.deepEqual(await fs.readFile(path.join(dir,'review',name)),png);assert.deepEqual(await fs.readFile(path.join(dir,entry.sourceFile)),png);assert.equal(JSON.parse(await fs.readFile(path.join(dir,'review','journey-engine-'+engine+'-partial-journey-help-'+engine+'-transfer.json'),'utf8')).synthetic,engine);}
 await fs.writeFile(path.join(dir,'journey-engine-work','webkit','journey-help-webkit','damaged.png'),'unfinished image');await assert.rejects(prepareReview(dir),/Invalid screenshot journey-engine-webkit-partial-journey-help-webkit-damaged.png/);assert.equal(JSON.parse(await fs.readFile(path.join(dir,'review','journey-engine-webkit-partial-journey-help-webkit-transfer.json'),'utf8')).synthetic,'webkit');
});

 test('review budget is exactly 150 decimal MB and storage accounting never deletes identical evidence',()=>{
 assert.equal(REVIEW_LIMIT,150_000_000);const a={file:'focus-320.png',bytes:100,sha256:'same',retained:true},b={...a,file:'focus-390.png'},c={...a,file:'already-omitted.png',retained:false};
 const r=reviewStorage([a,b,c],200);assert.equal(r.retainedImages,2);assert.equal(r.reserveBytes,149_999_800);assert.equal(r.exactDuplicates.retainedExtraBytes,100);assert.equal(r.exactDuplicates.alreadyOmittedCopiesWithRetainedOriginal,1);assert.equal(r.exactDuplicates.automaticDuplicateRemovals,0);
 assert.equal(reviewStorage([],150_000_000).withinBudget,true);assert.equal(reviewStorage([],150_000_001).withinBudget,false);
 for(const invalid of [-1,NaN,Infinity,0.1])assert.equal(reviewStorage([],invalid).withinBudget,false);
 });


test('same-run cold worker original reports are uploaded byte for byte without reading profiles; nonregular report entries block',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-cold-original-reports-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));const worker=path.join(dir,'quality-early-offline');await fs.mkdir(path.join(worker,'profile'),{recursive:true});await fs.writeFile(path.join(worker,'profile','private.json'),'never copy a browser profile');
 const originals=new Map([['portable-report.json',Buffer.from('{"status":"passed","scope":"synthetic offline original"}\r\n')],['early-cold-provenance.json',Buffer.from('{"synthetic":"original seal sidecar"}\n')],['offline.xml',Buffer.from('<synthetic-original/>\n')]]);for(const [name,bytes]of originals)await fs.writeFile(path.join(worker,name),bytes);
 const result=await prepareReview(dir);assert.equal(result.status,'diagnostic');for(const [name,bytes]of originals){const alias='quality-early-offline-original-'+name;assert.ok(result.reports.includes(alias));assert.deepEqual(await fs.readFile(path.join(dir,'review',alias)),bytes);assert.deepEqual(await fs.readFile(path.join(worker,name)),bytes);}assert.equal((await fs.readdir(path.join(dir,'review'))).some(name=>/profile|private/.test(name)),false);
 await fs.symlink(path.join(worker,'portable-report.json'),path.join(worker,'linked.json'));await assert.rejects(prepareReview(dir),/Unexpected cold original report entry/);assert.deepEqual(await fs.readFile(path.join(worker,'portable-report.json')),originals.get('portable-report.json'));
});

test('early native source report and exact flat engine originals survive main-run namespace cleanup without profiles',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'wk-early-native-originals-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));const root=path.join(dir,'early-native-navigation'),engine=path.join(root,'firefox');await fs.mkdir(path.join(engine,'profile'),{recursive:true});await fs.writeFile(path.join(engine,'profile','private.json'),'never scan a profile');const source=Buffer.from('{"meaning":"synthetic original early report"}\r\n'),proof=Buffer.from('{"actualSource":"synthetic original common proof"}\n'),png=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(png);png.writeUInt32BE(320,16);png.writeUInt32BE(900,20);await fs.writeFile(path.join(root,'original-report.json'),source);await fs.writeFile(path.join(engine,'common.json'),proof);await fs.writeFile(path.join(engine,'source.png'),png);
 const curated=await prepareReview(dir);assert.equal(curated.status,'diagnostic');assert.deepEqual(await fs.readFile(path.join(dir,'review','early-native-navigation-original-report.json')),source);assert.deepEqual(await fs.readFile(path.join(dir,'review','journey-engine-firefox-early-original-common.json')),proof);assert.deepEqual(await fs.readFile(path.join(dir,'review','journey-engine-firefox-early-original-source.png')),png);assert.equal(curated.screenshots.find(e=>e.file==='journey-engine-firefox-early-original-source.png').sourceFile,path.join('early-native-navigation','firefox','source.png'));assert.equal((await fs.readdir(path.join(dir,'review'))).some(name=>/profile|private/.test(name)),false);await fs.symlink(path.join(engine,'common.json'),path.join(engine,'linked.json'));await assert.rejects(prepareReview(dir),/Unexpected early native original entry/);assert.deepEqual(await fs.readFile(path.join(root,'original-report.json')),source);
});
