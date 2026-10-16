import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import type {Plugin} from 'vite';
import {learningInputs,learningFingerprint} from './learning-fingerprint.mjs';
import {finalLearningAssets,offlineAssetMetrics,learningAssetMetadata} from './learning-assets.mjs';

// Enumerate the final files: Vite can eliminate chunks after generateBundle.
// No incomplete list or intermediate phantom chunk may mark a release offline-ready.
export function learningOffline():Plugin{
 const root=process.cwd(),version=learningFingerprint(root,learningInputs(root));let output=join(root,'dist');
 return {
  name:'learning-offline',
  config:(_,env)=>({define:{__EARTH_BUILD__:JSON.stringify(version),__EARTH_PRODUCTION__:JSON.stringify(env.command==='build')}}),
  configResolved(config){output=resolve(config.root,config.build.outDir);},
  writeBundle:{order:'post',handler(){
   if(this.environment.name!=='client')return;
   const assets=finalLearningAssets(output),template=readFileSync(join(root,'build/learning-worker.js'),'utf8');
   writeFileSync(join(output,'learning-worker.js'),template.replace('__BUILD__',JSON.stringify(version)).replace('__ASSETS__',JSON.stringify(assets)).replace('__ASSET_META__',JSON.stringify(learningAssetMetadata(output,assets))));
   offlineAssetMetrics(output);
  }},
 };
}
