import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {finalLearningAssets,offlineAssetMetrics}from'../build/learning-assets.mjs';
test('offline uses the complete final output and rejects phantom, omitted, duplicate or unsafe paths',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wk-offline-final-'));try{fs.mkdirSync(path.join(dir,'assets'));fs.writeFileSync(path.join(dir,'assets/final.js'),'code');fs.writeFileSync(path.join(dir,'asset.webp'),'photo');fs.writeFileSync(path.join(dir,'data.json'),'{}');fs.writeFileSync(path.join(dir,'index.html'),'html');
 const assets=finalLearningAssets(dir);assert.deepEqual(assets,['/asset.webp','/assets/final.js','/data.json']);
 const set=list=>fs.writeFileSync(path.join(dir,'learning-worker.js'),'const ASSETS = '+JSON.stringify(list)+';');set(assets);const m=offlineAssetMetrics(dir);assert.equal(m.assetCount,3);assert.equal(m.rawAssetBytes,11);assert.deepEqual(finalLearningAssets(dir),assets,'worker excludes itself');
 for(const bad of [assets.slice(1),[...assets,assets[0]],['/../outside.json'],[...assets,'/assets/eliminated.js']]){set(bad);assert.throws(()=>offlineAssetMetrics(dir));}
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
