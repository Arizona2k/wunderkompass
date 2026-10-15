import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {sourceDigest} from './handoff.mjs';
export const REVIEW_LIMIT=48*1024*1024;
export const requiredScreenshots=[...['320','360','390','768','1024','1440','1920'].flatMap(w=>['quality-foundation-foundation-labs-'+w+'.png','quality-learning-journey-links-'+w+'.png']),...['320','1440'].flatMap(w=>['quality-news-feed-signed-news-rejected-'+w+'.png','quality-navigation-updates-all-details-'+w+'-full.png'])];
requiredScreenshots.push(...[320,1440].map(width=>'quality-learning-nature-model-grand-canyon-phase-3-'+width+'.png'));
requiredScreenshots.push(...['source-5-320','source-25-320','starter-30-320','starter-35-320','starter-48-320','starter-59-320','59-1440','native-200-large','overview-320'].map(key=>'quality-book-why-'+key+'.png'));
export function retainScreenshot(name){
 // All120 full Why cards are captured and hashed. Retain readable evidence of
 // partial sources, four new domains, desktop, native zoom and the mobile overview.
 if(/quality-book-why-/.test(name))return /why-(?:(?:source-(?:5|25)|starter-(?:30|35|48|59))-320|59-1440|native-200-large|overview-320)\.png$/.test(name);
 // Full open word cards remain captured/hashed; retain readable model close-ups
 // and native combined zoom instead of seven very long cards at both widths.
 if(/quality-(?:learning|book)-book-/.test(name))return /book-(?:model-(?:length|duration|temperature)-(?:320|1440)|temperature-large-320|native-200-large)\.png$/.test(name);
 if(/quality-(?:learning|research)-science-/.test(name))return /science-(?:native-200-large|(?:surface-tension|encryption)-large-320)\.png$/.test(name)||/science-(pressure|diffusion|fractals|cell|fusion|comet|exoplanet)-(hero|model)-(320|1440)\.png$/.test(name);
 // Engine tests still capture/measure four widths; upload mobile+desktop originals.
 if(name.startsWith('journey-engine-'))return /-(320|1440)\.png$/.test(name);
 if(name.startsWith('quality-foundation-')||name.startsWith('quality-news-feed-'))return true;
 if(/quality-learning-journey-large-focus-/.test(name))return /-(320|1440)\.png$/.test(name);
 // Repeated desktop long overviews are represented by mobile full histories and
 // desktop keyboard/large-text/component evidence. All captured originals stay hashed.
 if(/^quality-navigation-home-(?:return-(?:320|1440)|first-1440)-top\.png$/.test(name)||name==='quality-learning-playground-selection-full-1440.png')return false;
 // Full expanded-history Pflichtbilder already contain these archive-only rows.
 if(/quality-navigation-updates-archive-/.test(name))return false;
 if(/quality-learning-(journey-links-|journey-large-focus-|journey-native|journey-[a-z]+-390\.png)/.test(name))return true;
 // Full long-history and zoom/failure screenshots are useful, not interchangeable thumbnails.
 if(/(?:200|zoom|offline|error|failure)/.test(name))return true;
 if(/(?:all-details|archive)/.test(name))return /-(320|1440)(?:-full)?\.png$/.test(name);
 // Keep mobile and desktop views. Intermediate widths are still measured and recorded.
 return /-(320|1440)(?:-full|-model|-top)?\.png$/.test(name)&&!/-full\.png$/.test(name);
}
export async function prepareReview(directory='.qa-output'){
 const started=performance.now();
 const files=(await fs.readdir(directory)).sort(),destination=path.join(directory,'review');await fs.rm(destination,{recursive:true,force:true});await fs.mkdir(destination,{recursive:true});
 let report=null,handoff=null;
 try{report=JSON.parse(await fs.readFile(path.join(directory,'portable-report.json'),'utf8'));handoff=JSON.parse(await fs.readFile(path.join(directory,'handoff.json'),'utf8'));}catch{/* Diagnostic artifacts are still required on failed runs. */}
 const complete=report?.status==='passed'&&report.scope==='complete mandatory regression';
 const screenshots=[],copied=[];let generatedBytes=0,retainedBytes=0;
 let previous=null;
 try{const candidate=JSON.parse(await fs.readFile(path.join(directory,'review-manifest.json'),'utf8'));if(complete&&candidate.status==='passed'&&candidate.build===report.build&&candidate.sourceDigest===handoff?.sourceDigest){
  if(!Array.isArray(candidate.screenshots)||new Set(candidate.screenshots.map(s=>s.file)).size!==candidate.screenshots.length||!candidate.screenshots.every(s=>typeof s.file==='string'&&s.file===path.basename(s.file)&&/^(quality-|journey-engine-).*\.png$/.test(s.file)&&Number.isInteger(s.bytes)&&s.bytes>=24&&Number.isInteger(s.width)&&s.width>0&&Number.isInteger(s.height)&&s.height>0&&/^[a-f0-9]{64}$/.test(s.sha256)&&typeof s.retained==='boolean'))throw Error('Invalid sealed capture ledger');
  previous=candidate;
 }}catch(error){if(error.code!=='ENOENT')throw error;}
 const prior=new Map((previous?.screenshots??[]).map(s=>[s.file,s]));
 // Preserve failure reports even if a damaged PNG aborts curation.
 for(const name of files.filter(f=>/\.(json|xml)$/.test(f))){await fs.copyFile(path.join(directory,name),path.join(destination,name));copied.push(name);}
 for(const name of files.filter(f=>/^(quality-|journey-engine-).*\.png$/.test(f))){
  const data=await fs.readFile(path.join(directory,name));if(data.length<24||data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid screenshot '+name);
  const inputHash=createHash('sha256').update(data).digest('hex'),old=prior.get(name);
  if(old&&inputHash!==(old.storedSha256??old.sha256))throw Error('Changed sealed screenshot '+name);
  const retained=!complete||retainScreenshot(name);
  const capture=old??{file:name,bytes:data.length,width:data.readUInt32BE(16),height:data.readUInt32BE(20),sha256:inputHash};
  screenshots.push({...capture,retained});generatedBytes+=capture.bytes;prior.delete(name);
  if(retained){await fs.writeFile(path.join(destination,name),data);retainedBytes+=data.length;}
 }
 // The collector receives curated PNGs. Preserve the same-snapshot capture ledger
 // of omitted originals instead of replacing1491 hashes with only uploaded files.
 for(const capture of prior.values()){if(capture.retained)throw Error('Missing sealed screenshot '+capture.file);screenshots.push(capture);generatedBytes+=capture.bytes;}
 screenshots.sort((a,b)=>a.file.localeCompare(b.file));

 const errors=[];
 if(complete){
  if(!handoff||handoff.sourceDigest!==await sourceDigest()||handoff.build!==report.build)errors.push('Current handoff/code/build proof required');
  for(const name of requiredScreenshots)if(!screenshots.some(s=>s.file===name&&s.retained))errors.push('Missing required critical image '+name);
  if(retainedBytes>REVIEW_LIMIT)errors.push('Review screenshot budget exceeded; revise coverage explicitly instead of dropping required evidence');
 }
 const manifest={schemaVersion:1,status:complete&&!errors.length?'passed':'diagnostic',errors,build:report?.build??null,sourceDigest:handoff?.sourceDigest??null,generatedBytes,retainedBytes,limit:REVIEW_LIMIT,seconds:(performance.now()-started)/1000,screenshots,reports:copied,meaning:'Every captured original PNG is hashed, including the same-snapshot collector ledger of omitted originals. Required and representative originals plus all reports are uploaded unchanged. Omitted originals are reproducible with the full browser suite. Failed runs keep every current image. No automatic visual approval.'};
 await fs.writeFile(path.join(destination,'review-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({status:manifest.status,generatedBytes,retainedBytes,images:screenshots.length,retained:screenshots.filter(s=>s.retained).length,largestRetained:screenshots.filter(s=>s.retained).sort((a,b)=>b.bytes-a.bytes).slice(0,8).map(({file,bytes})=>({file,bytes})),errors}));
 if(errors.length)throw Error(errors.join('\n'));return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await prepareReview();
