import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {sourceDigest} from './handoff.mjs';
export const REVIEW_LIMIT=48*1024*1024;
export const requiredScreenshots=[...['320','360','390','768','1024','1440','1920'].flatMap(w=>['quality-foundation-foundation-labs-'+w+'.png','quality-learning-journey-links-'+w+'.png']),...['320','1440'].flatMap(w=>['quality-news-feed-signed-news-rejected-'+w+'.png','quality-navigation-updates-all-details-'+w+'-full.png'])];
export function retainScreenshot(name){
 if(name.startsWith('journey-engine-')||name.startsWith('quality-foundation-')||name.startsWith('quality-news-feed-'))return true;
 if(/quality-learning-(journey-links-|journey-large-focus-|journey-native|journey-[a-z]+-390\.png)/.test(name))return true;
 // Full long-history and zoom/failure screenshots are useful, not interchangeable thumbnails.
 if(/(?:200|zoom|offline|error|failure)/.test(name))return true;
 if(/(?:all-details|archive)/.test(name))return /-(320|1440)(?:-full)?\.png$/.test(name);
 // Keep mobile and desktop views. Intermediate widths are still measured and recorded.
 return /-(320|1440)(?:-full|-model|-top)?\.png$/.test(name)&&!/-full\.png$/.test(name);
}
export async function prepareReview(directory='.qa-output'){
 const files=(await fs.readdir(directory)).sort(),destination=path.join(directory,'review');await fs.rm(destination,{recursive:true,force:true});await fs.mkdir(destination,{recursive:true});
 let report=null,handoff=null;
 try{report=JSON.parse(await fs.readFile(path.join(directory,'portable-report.json'),'utf8'));handoff=JSON.parse(await fs.readFile(path.join(directory,'handoff.json'),'utf8'));}catch{/* Diagnostic artifacts are still required on failed runs. */}
 const complete=report?.status==='passed'&&report.scope==='complete mandatory regression';
 const screenshots=[],copied=[];let generatedBytes=0,retainedBytes=0;
 // Preserve failure reports even if a damaged PNG aborts curation.
 for(const name of files.filter(f=>/\.(json|xml)$/.test(f))){await fs.copyFile(path.join(directory,name),path.join(destination,name));copied.push(name);}
 for(const name of files.filter(f=>/^(quality-|journey-engine-).*\.png$/.test(f))){
  const data=await fs.readFile(path.join(directory,name));if(data.length<24||data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid screenshot '+name);
  const retained=!complete||retainScreenshot(name);screenshots.push({file:name,bytes:data.length,width:data.readUInt32BE(16),height:data.readUInt32BE(20),sha256:createHash('sha256').update(data).digest('hex'),retained});generatedBytes+=data.length;
  if(retained){await fs.writeFile(path.join(destination,name),data);retainedBytes+=data.length;}
 }

 const errors=[];
 if(complete){
  if(!handoff||handoff.sourceDigest!==await sourceDigest()||handoff.build!==report.build)errors.push('Current handoff/code/build proof required');
  for(const name of requiredScreenshots)if(!screenshots.some(s=>s.file===name&&s.retained))errors.push('Missing required critical image '+name);
  if(retainedBytes>REVIEW_LIMIT)errors.push('Review screenshot budget exceeded; revise coverage explicitly instead of dropping required evidence');
 }
 const manifest={schemaVersion:1,status:complete&&!errors.length?'passed':'diagnostic',errors,build:report?.build??null,sourceDigest:handoff?.sourceDigest??null,generatedBytes,retainedBytes,limit:REVIEW_LIMIT,screenshots,reports:copied,meaning:'Every current captured PNG is hashed. Required and representative originals plus all reports are uploaded; omitted originals can be reproduced with the unchanged full browser suite. Failed runs keep every current image. No automatic visual approval.'};
 await fs.writeFile(path.join(destination,'review-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({status:manifest.status,generatedBytes,retainedBytes,images:screenshots.length,retained:screenshots.filter(s=>s.retained).length,errors}));
 if(errors.length)throw Error(errors.join('\n'));return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await prepareReview();
