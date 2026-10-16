import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {sourceDigest} from './handoff.mjs';
// Review PNGs only; production and offline budgets are unchanged.
export const REVIEW_LIMIT=150_000_000;
export function reviewStorage(screenshots,retainedBytes,{previous=null}={}){
 const groups=new Map();
 for(const capture of screenshots){const group=groups.get(capture.sha256)??[];group.push(capture);groups.set(capture.sha256,group);}
 const duplicateGroups=[...groups.values()].filter(group=>group.length>1);
 const retainedGroups=duplicateGroups.map(group=>group.filter(capture=>capture.retained)).filter(group=>group.length>1);
 const omittedCopies=duplicateGroups.filter(group=>group.some(capture=>capture.retained)).flatMap(group=>group.filter(capture=>!capture.retained));
 const matrix=items=>createHash('sha256').update(items.map(capture=>capture.file).sort().join('\n')).digest('hex');
 const currentMatrix=matrix(screenshots),comparable=previous?.status==='passed'&&Array.isArray(previous.screenshots)&&matrix(previous.screenshots)===currentMatrix&&Number.isSafeInteger(previous.retainedBytes)&&previous.retainedBytes>=0;
 return {generatedImages:screenshots.length,retainedImages:screenshots.filter(capture=>capture.retained).length,omittedImages:screenshots.filter(capture=>!capture.retained).length,
  retainedBytes,limitBytes:REVIEW_LIMIT,reserveBytes:REVIEW_LIMIT-retainedBytes,withinBudget:Number.isSafeInteger(retainedBytes)&&retainedBytes>=0&&retainedBytes<=REVIEW_LIMIT,matrixSha256:currentMatrix,
  exactDuplicates:{groups:duplicateGroups.map(group=>({sha256:group[0].sha256,files:group.map(({file,retained})=>({file,retained}))})),extraCaptures:duplicateGroups.reduce((sum,group)=>sum+group.length-1,0),retainedExtraCopies:retainedGroups.reduce((sum,group)=>sum+group.length-1,0),retainedExtraBytes:retainedGroups.reduce((sum,group)=>sum+group.slice(1).reduce((bytes,capture)=>bytes+capture.bytes,0),0),alreadyOmittedCopiesWithRetainedOriginal:omittedCopies.length,alreadyOmittedBytesWithRetainedOriginal:omittedCopies.reduce((sum,capture)=>sum+capture.bytes,0),automaticDuplicateRemovals:0,meaning:'Byte identity alone never removes a distinct state, width, focus, failure or mandatory image. Omitted copies describe existing explicit curation, not new deduplication savings.'},
  comparison:comparable?{status:'same capture matrix; informational only',previousBuild:previous.build??null,previousSourceDigest:previous.sourceDigest??null,retainedImagesDelta:screenshots.filter(capture=>capture.retained).length-previous.screenshots.filter(capture=>capture.retained).length,retainedBytesDelta:retainedBytes-previous.retainedBytes}:{status:previous?'different or invalid matrix; no savings claim':'previous comparable run not supplied'},
 };
}
export const requiredScreenshots=['quality-learning-journey-engine-chromium-native-history-first-640.png','quality-learning-journey-engine-chromium-native-history-oldest-640.png',...['320','360','390','768','1024','1440','1920'].flatMap(w=>['quality-foundation-foundation-labs-'+w+'.png','quality-learning-journey-links-'+w+'.png']),...['320','1440'].flatMap(w=>['quality-news-feed-signed-news-rejected-'+w+'.png','quality-navigation-updates-all-details-'+w+'-full.png'])];
requiredScreenshots.push(...[320,1440].flatMap(w=>['keyboard','pointer'].map(input=>'quality-foundation-foundation-route-focus-'+input+'-'+w+'.png')));
export function retainScreenshot(name){
 if(requiredScreenshots.includes(name))return true;
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

 const storage=reviewStorage(screenshots,retainedBytes),errors=[];
 if(complete){
  if(!handoff||handoff.sourceDigest!==await sourceDigest()||handoff.build!==report.build)errors.push('Current handoff/code/build proof required');
  for(const name of requiredScreenshots)if(!screenshots.some(s=>s.file===name&&s.retained))errors.push('Missing required critical image '+name);
  if(!storage.withinBudget)errors.push('Review screenshot budget exceeded; revise coverage explicitly instead of dropping required evidence');
 }
 const manifest={schemaVersion:1,status:complete&&!errors.length?'passed':'diagnostic',errors,build:report?.build??null,sourceDigest:handoff?.sourceDigest??null,generatedBytes,retainedBytes,limit:REVIEW_LIMIT,storage,screenshots,reports:copied,meaning:'Every current captured PNG is hashed. Required and representative originals plus all reports are uploaded; omitted originals can be reproduced with the unchanged full browser suite. Failed runs keep every current image. No automatic visual approval.'};
 await fs.writeFile(path.join(destination,'review-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({status:manifest.status,generatedBytes,retainedBytes,images:screenshots.length,retained:screenshots.filter(s=>s.retained).length,reserveBytes:storage.reserveBytes,exactDuplicateExtraCaptures:storage.exactDuplicates.extraCaptures,automaticDuplicateRemovals:0,errors}));
 if(errors.length)throw Error(errors.join('\n'));return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await prepareReview();
