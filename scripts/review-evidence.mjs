import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {sourceDigest} from './handoff.mjs';
// Review PNGs only; production and offline budgets are unchanged.
export const REVIEW_LIMIT=170_000_000;
// Capture identities are never deduplicated. Only their byte-identical payloads
// may share a file in a completed review. Diagnostics keep standalone originals.
export async function storeReviewScreenshot(directory,capture,data,payloads,{share=false}={}){
 if(data.length!==capture.bytes||createHash('sha256').update(data).digest('hex')!==capture.sha256)throw Error('Changed screenshot '+capture.file);
 const previous=share?payloads.get(capture.sha256):null;
 if(previous){
  const original=await fs.readFile(path.join(directory,previous));
  if(!original.equals(data))throw Error('Conflicting screenshot payload '+capture.file);
  capture.storedAs=previous;return 0;
 }
 await fs.writeFile(path.join(directory,capture.file),data);capture.storedAs=capture.file;
 if(share)payloads.set(capture.sha256,capture.file);
 return data.length;
}
export async function readReviewScreenshot(directory,capture){
 if(!capture.retained)throw Error('Screenshot was not retained '+capture.file);
 const name=capture.storedAs??capture.file;
 if(typeof name!=='string'||path.basename(name)!==name||/[\\/\0]/.test(name)||!name.endsWith('.png'))throw Error('Invalid stored screenshot path');
 const file=path.join(directory,name),entry=await fs.lstat(file);
 if(!entry.isFile()||entry.isSymbolicLink())throw Error('Nonregular stored screenshot '+name);
 const data=await fs.readFile(file);
 if(data.length!==capture.bytes||createHash('sha256').update(data).digest('hex')!==capture.sha256||data.readUInt32BE(16)!==capture.width||data.readUInt32BE(20)!==capture.height)throw Error('Changed stored screenshot '+capture.file);
 return data;
}
export function reviewStorage(screenshots,retainedBytes,{previous=null}={}){
 const groups=new Map();
 for(const capture of screenshots){const group=groups.get(capture.sha256)??[];group.push(capture);groups.set(capture.sha256,group);}
 const duplicateGroups=[...groups.values()].filter(group=>group.length>1);
 const retainedGroups=duplicateGroups.map(group=>group.filter(capture=>capture.retained)).filter(group=>group.length>1);
 const omittedCopies=duplicateGroups.filter(group=>group.some(capture=>capture.retained)).flatMap(group=>group.filter(capture=>!capture.retained));
 const matrix=items=>createHash('sha256').update(items.map(capture=>capture.file).sort().join('\n')).digest('hex');
 const currentMatrix=matrix(screenshots),comparable=previous?.status==='passed'&&Array.isArray(previous.screenshots)&&matrix(previous.screenshots)===currentMatrix&&Number.isSafeInteger(previous.retainedBytes)&&previous.retainedBytes>=0;
 return {generatedImages:screenshots.length,retainedImages:screenshots.filter(capture=>capture.retained).length,omittedImages:screenshots.filter(capture=>!capture.retained).length,
  retainedBytes,retainedCaptureBytes:screenshots.filter(capture=>capture.retained).reduce((sum,capture)=>sum+capture.bytes,0),storedImages:new Set(screenshots.filter(capture=>capture.retained).map(capture=>capture.storedAs??capture.file)).size,sharedPayloadCopies:screenshots.filter(capture=>capture.retained&&capture.storedAs&&capture.storedAs!==capture.file).length,limitBytes:REVIEW_LIMIT,reserveBytes:REVIEW_LIMIT-retainedBytes,withinBudget:Number.isSafeInteger(retainedBytes)&&retainedBytes>=0&&retainedBytes<=REVIEW_LIMIT,matrixSha256:currentMatrix,
  exactDuplicates:{groups:duplicateGroups.map(group=>({sha256:group[0].sha256,files:group.map(({file,retained})=>({file,retained}))})),extraCaptures:duplicateGroups.reduce((sum,group)=>sum+group.length-1,0),retainedExtraCopies:retainedGroups.reduce((sum,group)=>sum+group.length-1,0),retainedExtraBytes:retainedGroups.reduce((sum,group)=>sum+group.slice(1).reduce((bytes,capture)=>bytes+capture.bytes,0),0),alreadyOmittedCopiesWithRetainedOriginal:omittedCopies.length,alreadyOmittedBytesWithRetainedOriginal:omittedCopies.reduce((sum,capture)=>sum+capture.bytes,0),automaticDuplicateRemovals:0,meaning:'Byte identity alone never removes a distinct state, width, focus, failure or mandatory image. Omitted copies describe existing explicit curation, not new deduplication savings.'},
  comparison:comparable?{status:'same capture matrix; informational only',previousBuild:previous.build??null,previousSourceDigest:previous.sourceDigest??null,retainedImagesDelta:screenshots.filter(capture=>capture.retained).length-previous.screenshots.filter(capture=>capture.retained).length,retainedBytesDelta:retainedBytes-previous.retainedBytes}:{status:previous?'different or invalid matrix; no savings claim':'previous comparable run not supplied'},
 };
}
export const requiredScreenshots=['quality-learning-journey-engine-chromium-native-history-first-640.png','quality-learning-journey-engine-chromium-native-history-oldest-640.png',...['320','360','390','768','1024','1440','1920'].flatMap(w=>['quality-foundation-foundation-labs-'+w+'.png','quality-learning-journey-links-'+w+'.png']),...['320','1440'].flatMap(w=>['quality-no-news-news-removed-'+w+'.png','quality-navigation-updates-all-details-'+w+'-full.png'])];
requiredScreenshots.push(...[320,1440].flatMap(w=>['keyboard','pointer'].map(input=>'quality-foundation-foundation-route-focus-'+input+'-'+w+'.png')));
requiredScreenshots.push('quality-foundation-offline-resilience-chromium-source-error-320.png','quality-foundation-offline-resilience-chromium-quota-error-320.png','quality-learning-offline-resilience-native-progress-640.png',...[320,360,390,768,1024,1440,1920].map(w=>'quality-foundation-offline-resilience-chromium-progress-'+w+'.png'));
requiredScreenshots.push(...[320,1440].flatMap(w=>['moon-1','moon-2','water-2','inside-2','countries-3'].map(id=>'quality-learning-journey-engine-chromium-support-'+id+'-'+w+'.png')));
requiredScreenshots.push('quality-navigation-solar-caption-negative-320.png');
requiredScreenshots.push(...[320,360,390,402,768,1024,1440,1920].flatMap(w=>['normal','large'].flatMap(state=>['diameters','distances'].map(mode=>'quality-navigation-solar-caption-'+mode+'-'+state+'-'+w+'.png'))),...['diameters','distances'].map(mode=>'quality-navigation-solar-caption-'+mode+'-large-640.png'));
requiredScreenshots.push(...[320,360,390,768,1024,1440,1920].flatMap(w=>[...[0,1,2].flatMap(level=>['normal','large'].map(state=>'quality-navigation-animal-workshop-'+state+'-'+level+'-'+w+'.png')),'quality-navigation-animal-workshop-focus-'+w+'.png']),'quality-navigation-animal-native-200-large-640.png');
requiredScreenshots.push('quality-navigation-animal-search-delayed-390.png');
export function retainScreenshot(name,{available=null}={}){
 if(requiredScreenshots.includes(name))return true;
 // Only a fully bound completed review supplies this actual capture set.
 // Sample a repeated intermediate view only if both endpoint PNGs exist;
 // all required/diagnostic/offline/zoom/focus/unknown views keep prior rules.
 if(available instanceof Set&&!/(?:focus|error|failure|offline|zoom|200)/.test(name)&&/^journey-engine-(?:firefox|webkit)-(?:animal-new-[a-z-]+|animal-workshop-(?:normal|large)-[012]|solar-caption-(?:diameters|distances)-(?:normal|large)|history-(?:first|oldest))-(?:390|768)\.png$/.test(name)&&[320,1440].every(width=>available.has(name.replace(/-(?:390|768)\.png$/, '-'+width+'.png'))))return false;
 if(name.startsWith('journey-engine-')||name.startsWith('quality-foundation-')||name.startsWith('quality-no-news-'))return true;
 if(/quality-learning-(journey-links-|journey-large-focus-|journey-native|journey-[a-z]+-390\.png)/.test(name))return true;
 // Full long-history and zoom/failure screenshots are useful, not interchangeable thumbnails.
 if(/(?:200|zoom|offline|error|failure)/.test(name))return true;
 if(/(?:all-details|archive)/.test(name))return /-(320|1440)(?:-full)?\.png$/.test(name);
 // Keep mobile and desktop views. Intermediate widths are still measured and recorded.
 return /-(320|1440)(?:-full|-model|-top)?\.png$/.test(name)&&!/-full\.png$/.test(name);
}
export async function prepareReview(directory='.qa-output'){
 const files=(await fs.readdir(directory)).sort().map(name=>({name,source:path.join(directory,name)})),destination=path.join(directory,'review');await fs.rm(destination,{recursive:true,force:true});await fs.mkdir(destination,{recursive:true});
 // A runner timeout can interrupt an isolated engine before normal collection.
 // Preserve those actual partial files in the same review, clearly distinguished
 // from completed root evidence. No browser profile or recursive cache traversal.
 for(const engine of ['chromium','firefox','webkit']){
  const worker=path.join(directory,'journey-engine-work',engine);
  const names=(await fs.readdir(worker).catch(error=>{if(error.code==='ENOENT')return [];throw error;})).sort(),help='journey-help-'+engine;
  if(['firefox','webkit'].includes(engine)&&names.includes(help)&&(await fs.lstat(path.join(worker,help))).isDirectory())names.splice(names.indexOf(help),1,...(await fs.readdir(path.join(worker,help))).sort().map(name=>path.join(help,name)));
  for(const name of names){
   const source=path.join(worker,name);
   if(/\.(png|json|xml)$/.test(name)&&(await fs.lstat(source)).isFile())files.push({name:'journey-engine-'+engine+'-partial-'+name.replaceAll(path.sep,'-'),source,sourceFile:path.relative(directory,source)});
  }
 }
 // Keep original early engine evidence before the complete runner clears the
 // flat namespace. Only these exact flat engine directories; never profiles.
 const earlyRoot=path.join(directory,'early-native-navigation');
 try{const source=path.join(earlyRoot,'original-report.json');if(!(await fs.lstat(source)).isFile())throw Error('Unexpected original early native report');files.push({name:'early-native-navigation-original-report.json',source,sourceFile:path.relative(directory,source)});}catch(error){if(error.code!=='ENOENT')throw error;}
 for(const engine of ['chromium','firefox','webkit'])for(const name of (await fs.readdir(path.join(earlyRoot,engine)).catch(error=>{if(error.code==='ENOENT')return[];throw error;})).sort()){
  if(!/\.(png|json|xml)$/.test(name))continue;const source=path.join(earlyRoot,engine,name);if(!(await fs.lstat(source)).isFile())throw Error('Unexpected early native original entry');files.push({name:'journey-engine-'+engine+'-early-original-'+name,source,sourceFile:path.relative(directory,source)});
 }
 // The reused worker's JSON/XML are original evidence too. Keep their exact
 // bytes beside the existing flat PNG copies; never traverse profiles/caches.
 const coldWorker=path.join(directory,'quality-early-offline');
 for(const name of (await fs.readdir(coldWorker).catch(error=>{if(error.code==='ENOENT')return [];throw error;})).sort()){
  if(!/\.(json|xml)$/.test(name))continue;
  const source=path.join(coldWorker,name);if(!(await fs.lstat(source)).isFile())throw Error('Unexpected cold original report entry');
  files.push({name:'quality-early-offline-original-'+name,source,sourceFile:path.relative(directory,source)});
 }
 if(new Set(files.map(file=>file.name)).size!==files.length)throw Error('Conflicting review evidence names; originals retained');
 let report=null,handoff=null;
 try{report=JSON.parse(await fs.readFile(path.join(directory,'portable-report.json'),'utf8'));handoff=JSON.parse(await fs.readFile(path.join(directory,'handoff.json'),'utf8'));}catch{/* Diagnostic artifacts are still required on failed runs. */}
 const complete=report?.status==='passed'&&report.scope==='complete mandatory regression';
 const currentSource=complete?await sourceDigest():null;
 let engineReport=null,engineReadable=true;
 try{engineReport=JSON.parse(await fs.readFile(path.join(directory,'engine-report.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')engineReadable=false;}
 const shareComplete=complete&&handoff?.sourceDigest===currentSource&&handoff.build===report.build&&engineReadable&&(!engineReport||(engineReport.status==='passed'&&engineReport.sourceDigest===currentSource&&engineReport.build===report.build));
 const availableScreenshots=new Set(files.filter(file=>file.name.endsWith('.png')).map(file=>file.name));
 const screenshots=[],copied=[],payloads=new Map();let generatedBytes=0,retainedBytes=0;
 // Preserve failure reports even if a damaged PNG aborts curation.
 for(const file of files.filter(f=>/\.(json|xml)$/.test(f.name))){await fs.copyFile(file.source,path.join(destination,file.name));copied.push(file.name);}
 for(const file of files.filter(f=>/^(quality-|journey-engine-).*\.png$/.test(f.name))){
  const {name,source,sourceFile}=file,data=await fs.readFile(source);if(data.length<24||data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid screenshot '+name);
  const retained=!complete||retainScreenshot(name,{available:shareComplete?availableScreenshots:null}),capture={file:name,...(sourceFile?{sourceFile}:{}),bytes:data.length,width:data.readUInt32BE(16),height:data.readUInt32BE(20),sha256:createHash('sha256').update(data).digest('hex'),retained};screenshots.push(capture);generatedBytes+=data.length;
  // Required/focus/error originals keep their physical names as well. Other
  // captures retain every identity, dimension, hash and source via storedAs.
  if(retained)retainedBytes+=await storeReviewScreenshot(destination,capture,data,payloads,{share:shareComplete&&!requiredScreenshots.includes(name)&&!/(?:focus|error|failure)/.test(name)});
 }

 // Resolve every retained identity back to the exact original, including aliases.
 // Missing, altered or nonregular shared payloads fail before upload acceptance.
 for(const capture of screenshots.filter(capture=>capture.retained))await readReviewScreenshot(destination,capture);

 const storage=reviewStorage(screenshots,retainedBytes),errors=[];
 if(complete){
  if(!handoff||handoff.sourceDigest!==currentSource||handoff.build!==report.build)errors.push('Current handoff/code/build proof required');
  for(const name of requiredScreenshots)if(!screenshots.some(s=>s.file===name&&s.retained))errors.push('Missing required critical image '+name);
  if(!storage.withinBudget)errors.push('Review screenshot budget exceeded; revise coverage explicitly instead of dropping required evidence');
 }
 const manifest={schemaVersion:2,status:complete&&!errors.length?'passed':'diagnostic',errors,build:report?.build??null,sourceDigest:handoff?.sourceDigest??null,generatedBytes,retainedBytes,limit:REVIEW_LIMIT,storage,screenshots,reports:copied,meaning:'Every current capture keeps its identity, dimensions, hash, source and retention decision. Read retained bytes from storedAs (file for older manifests). Completed reviews share only byte-identical payloads; required/focus/error originals keep standalone names. retainedBytes counts actual PNG files; retainedCaptureBytes includes all retained identities. All reports and failed-run originals remain standalone. No automatic visual approval.'};
 await fs.writeFile(path.join(destination,'review-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({status:manifest.status,generatedBytes,retainedBytes,images:screenshots.length,retained:screenshots.filter(s=>s.retained).length,reserveBytes:storage.reserveBytes,exactDuplicateExtraCaptures:storage.exactDuplicates.extraCaptures,automaticDuplicateRemovals:0,errors}));
 if(errors.length)throw Error(errors.join('\n'));return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await prepareReview();
