import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {sourceDigest} from './handoff.mjs';
import worldIndex from '../app/world-index.json' with {type:'json'};
// Decimal MB, exclusively retained review PNGs; no production/offline budget.
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
requiredScreenshots.push('quality-navigation-solar-caption-negative-320.png');
requiredScreenshots.push(...[320,360,390,402,768,1024,1440,1920].flatMap(w=>['normal','large'].flatMap(state=>['diameters','distances'].map(mode=>'quality-navigation-solar-caption-'+mode+'-'+state+'-'+w+'.png'))),...['diameters','distances'].map(mode=>'quality-navigation-solar-caption-'+mode+'-large-640.png'));
requiredScreenshots.push(...[320,360,390,768,1024,1440,1920].flatMap(w=>[...[0,1,2].flatMap(level=>['normal','large'].map(state=>'quality-navigation-animal-workshop-'+state+'-'+level+'-'+w+'.png')),'quality-navigation-animal-workshop-focus-'+w+'.png']),'quality-navigation-animal-native-200-large-640.png');
requiredScreenshots.push(...[320,1440].map(width=>'quality-learning-nature-model-grand-canyon-phase-3-'+width+'.png'));
requiredScreenshots.push(...['source-5-320','source-25-320','starter-30-320','starter-35-320','starter-48-320','starter-59-320','59-1440','native-200-large','overview-320'].map(key=>'quality-book-why-'+key+'.png'));
requiredScreenshots.push(...[320,1440].flatMap(width=>worldIndex.filter(t=>t.category==='inventions').map(t=>'quality-navigation-invention-model-'+t.id+'-'+width+'.png')),'quality-navigation-invention-native-200-large.png','quality-navigation-invention-steps-large-320.png','quality-navigation-invention-labels-fridge-768.png');
requiredScreenshots.push(...[320,1440].flatMap(width=>['keyboard','pointer'].map(input=>'quality-foundation-foundation-route-focus-'+input+'-'+width+'.png')));
requiredScreenshots.push(...worldIndex.filter(t=>t.inventionModel).flatMap(t=>[...([320,1440].map(width=>'quality-navigation-invention-experiment-'+t.id+'-'+width+'.png')),'quality-navigation-invention-experiment-native-'+t.id+'.png']));
requiredScreenshots.push(...worldIndex.filter(t=>t.buildingKind).flatMap(t=>[320,1440].map(w=>'quality-navigation-building-model-'+t.id+'-'+w+'.png')),'quality-navigation-building-native-200-large.png','quality-navigation-building-large-320.png');

requiredScreenshots.push('quality-foundation-offline-resilience-chromium-source-error-320.png','quality-foundation-offline-resilience-chromium-quota-error-320.png','quality-learning-offline-resilience-native-progress-640.png',...[320,360,390,768,1024,1440,1920].map(w=>'quality-foundation-offline-resilience-chromium-progress-'+w+'.png'));
requiredScreenshots.push(...[320,1440].flatMap(w=>['moon-1','moon-2','water-2','inside-2','countries-3'].map(id=>'quality-learning-journey-engine-chromium-support-'+id+'-'+w+'.png')));
requiredScreenshots.push('quality-navigation-animal-search-delayed-390.png');
export function retainScreenshot(name){
 if(requiredScreenshots.includes(name))return true;
 // Each individual plan and distinct functional model has review value.
 // Keep mobile/desktop and actual native model states; never fill the budget.
 if(/^quality-navigation-invention-/.test(name))return /invention-(?:(?:model|experiment)-invention-[a-z0-9-]+-(?:320|1440)|experiment-native-invention-[a-z0-9-]+|native-200-large|steps-large-320|labels-fridge-768)\.png$/.test(name);
 // All120 full Why cards are captured and hashed. Retain readable evidence of
 // partial sources, four new domains, desktop, native zoom and the mobile overview.
 if(/quality-book-why-/.test(name))return /why-(?:(?:source-(?:5|25)|starter-(?:30|35|48|59))-320|59-1440|native-200-large|overview-320)\.png$/.test(name);
 // Full open word cards remain captured/hashed; retain readable model close-ups
 // and native combined zoom instead of seven very long cards at both widths.
 if(/quality-(?:learning|book)-book-/.test(name))return /book-(?:model-(?:length|duration|temperature)-(?:320|1440)|temperature-large-320|native-200-large|steps-large-320|labels-fridge-768)\.png$/.test(name);
 if(/quality-(?:learning|research)-science-/.test(name))return /science-(?:native-200-large|(?:surface-tension|encryption)-large-320)\.png$/.test(name)||/science-(pressure|diffusion|fractals|cell|fusion|comet|exoplanet)-(hero|model)-(320|1440)\.png$/.test(name);
 // Engine jobs already upload their four-width originals. Count every actually
 // stored PNG in the final budget as well, rather than hiding390/768 there.
 if(name.startsWith('journey-engine-'))return true;
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
export async function prepareReview(directory='.qa-output',{sealedCaptureLedger=null,previousStorageReport=null}={}){
 const started=performance.now();
 const files=(await fs.readdir(directory)).sort(),destination=path.join(directory,'review');await fs.rm(destination,{recursive:true,force:true});await fs.mkdir(destination,{recursive:true});
 let report=null,handoff=null;
 try{report=JSON.parse(await fs.readFile(path.join(directory,'portable-report.json'),'utf8'));handoff=JSON.parse(await fs.readFile(path.join(directory,'handoff.json'),'utf8'));}catch{/* Diagnostic artifacts are still required on failed runs. */}
 const complete=report?.status==='passed'&&report.scope==='complete mandatory regression';
 const screenshots=[],copied=[];let generatedBytes=0,retainedBytes=0;
 let previous=null;
 if(sealedCaptureLedger){
  const candidate=sealedCaptureLedger;
  if(!complete||candidate.status!=='passed'||candidate.build!==report.build||candidate.sourceDigest!==handoff?.sourceDigest)throw Error('Mixed sealed capture snapshot');
  if(!Array.isArray(candidate.screenshots)||new Set(candidate.screenshots.map(s=>s.file)).size!==candidate.screenshots.length||!candidate.screenshots.every(s=>typeof s.file==='string'&&s.file===path.basename(s.file)&&/^(quality-|journey-engine-).*\.png$/.test(s.file)&&Number.isInteger(s.bytes)&&s.bytes>=24&&Number.isInteger(s.width)&&s.width>0&&Number.isInteger(s.height)&&s.height>0&&/^[a-f0-9]{64}$/.test(s.sha256)&&typeof s.retained==='boolean'))throw Error('Invalid sealed capture ledger');
  previous=candidate;
 }
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

 const storage=reviewStorage(screenshots,retainedBytes,{previous:previousStorageReport}),errors=[];
 if(complete){
  if(!handoff||handoff.sourceDigest!==await sourceDigest()||handoff.build!==report.build)errors.push('Current handoff/code/build proof required');
  for(const name of requiredScreenshots)if(!screenshots.some(s=>s.file===name&&s.retained))errors.push('Missing required critical image '+name);
  if(!storage.withinBudget)errors.push('Review screenshot budget exceeded; revise coverage explicitly instead of dropping required evidence');
 }
 const manifest={schemaVersion:1,status:complete&&!errors.length?'passed':'diagnostic',errors,build:report?.build??null,sourceDigest:handoff?.sourceDigest??null,generatedBytes,retainedBytes,limit:REVIEW_LIMIT,storage,seconds:(performance.now()-started)/1000,screenshots,reports:copied,meaning:'Every captured original PNG is hashed, including the same-snapshot collector ledger of omitted originals. Required and representative originals plus all reports are uploaded unchanged. Omitted originals are reproducible with the full browser suite. Failed runs keep every current image. No automatic visual approval.'};
 await fs.writeFile(path.join(destination,'review-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({status:manifest.status,generatedBytes,retainedBytes,images:storage.generatedImages,retained:storage.retainedImages,reserveBytes:storage.reserveBytes,exactDuplicateExtraCaptures:storage.exactDuplicates.extraCaptures,alreadyOmittedIdenticalCopies:storage.exactDuplicates.alreadyOmittedCopiesWithRetainedOriginal,automaticDuplicateRemovals:0,comparison:storage.comparison,largestRetained:screenshots.filter(s=>s.retained).sort((a,b)=>b.bytes-a.bytes).slice(0,8).map(({file,bytes})=>({file,bytes})),errors}));
 if(errors.length)throw Error(errors.join('\n'));return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await prepareReview();
