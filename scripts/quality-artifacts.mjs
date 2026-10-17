import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {sourceDigest,createHandoff,engineComplete} from './handoff.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {prepareReview} from './review-evidence.mjs';
import qualityContext from './release/quality-context.cjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const head=()=>execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
async function snapshot(){const commit=head();if(process.env.GITHUB_SHA&&process.env.GITHUB_SHA!==commit)throw Error('Checkout differs from tested CI commit');return {context:qualityContext.currentContext(),testedCommit:commit,runId:process.env.GITHUB_RUN_ID??'local',attempt:process.env.GITHUB_RUN_ATTEMPT??'1',sourceDigest:await sourceDigest(),build:learningFingerprint(process.cwd())};}
export function assertSnapshot(actual,expected){
 if(expected.context)qualityContext.assertContext(actual?.context,expected.context);
 for(const key of ['testedCommit','sourceDigest','build','runId','attempt'])if(typeof actual?.[key]!=='string'||actual[key]!==expected[key])throw Error('Mixed or missing quality snapshot '+key);
 if(!/^(?:local|[0-9]+)$/.test(actual.runId)||!/^[0-9]+$/.test(actual.attempt))throw Error('Malformed quality run identity');
 if(!/^[a-f0-9]{40}$/.test(actual.testedCommit)||!/^[a-f0-9]{64}$/.test(actual.sourceDigest)||!/^[a-f0-9]{16}$/.test(actual.build))throw Error('Malformed quality snapshot');
}
export function validateCollectedProofs(proofs,expected,review=null){
 if(!Array.isArray(proofs)||proofs.length!==3||new Set(proofs.map(p=>p.kind)).size!==3)throw Error('All three independent browser jobs required');
 for(const kind of ['chromium','firefox','webkit']){const proof=proofs.find(p=>p.kind===kind);assertSnapshot(proof,expected);if(proof.status!=='passed'||!Number.isFinite(proof.seconds)||proof.seconds<=0||!Array.isArray(proof.files)||!proof.files.length)throw Error('Missing or failed browser job '+kind);}
 for(const kind of ['firefox','webkit'])for(const width of [320,390,768,1440])if(!proofs.find(p=>p.kind===kind).files.some(f=>f.file==='journey-engine-'+kind+'-'+width+'.png'))throw Error('Missing required engine image '+kind+' '+width);
 if(review){const images=proofs.flatMap(p=>p.files).filter(f=>f.file.endsWith('.png'));if(new Set(images.map(f=>f.file)).size!==images.length||images.length!==review.storage?.retainedImages||images.reduce((sum,f)=>sum+f.bytes,0)!==review.retainedBytes)throw Error('Uploaded screenshot accounting differs from retained review images');}
}
async function copy(from,to){await fs.mkdir(path.dirname(to),{recursive:true});await fs.copyFile(from,to);}
async function pack(){
 const expected=await snapshot(),unit=await read('.qa-output/unit-proof.json'),metrics=await read('.qa-output/performance-build.json');
 if(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim())throw Error('Commit source changes before packaging evidence');
 if(unit.head!==expected.testedCommit||unit.status!=='passed'||unit.sourceDigest!==expected.sourceDigest||metrics.status!=='passed')throw Error('Current standard checks required before packaging');
 const directory='work/quality-build';await fs.rm(directory,{recursive:true,force:true});await fs.mkdir(directory,{recursive:true});
 execFileSync('tar',['-czf',directory+'/build.tar.gz','dist']);
 const proof={schemaVersion:1,...expected,archive:{sha256:sha(await fs.readFile(directory+'/build.tar.gz'))},files:[]};
 for(const name of ['unit-proof.json','unit-tests.xml','performance-build.json','content-inventory.json','editorial-report.json','source-manifest.json']){const data=await fs.readFile('.qa-output/'+name);await fs.writeFile(directory+'/'+name,data);proof.files.push({file:name,bytes:data.length,sha256:sha(data)});}
 await fs.writeFile(directory+'/build-proof.json',JSON.stringify(proof,null,2));console.log(JSON.stringify({stage:'build-pack',...expected,archiveBytes:(await fs.stat(directory+'/build.tar.gz')).size}));
}
async function restore(){
 const directory='work/quality-build',proof=await read(directory+'/build-proof.json');assertSnapshot(proof,await snapshot());
 if(sha(await fs.readFile(directory+'/build.tar.gz'))!==proof.archive.sha256)throw Error('Damaged build artifact');
 const paths=execFileSync('tar',['-tzf',directory+'/build.tar.gz'],{encoding:'utf8'}).trim().split('\n');if(paths.some(p=>!p.startsWith('dist/')||p.split('/').includes('..')))throw Error('Unsafe build archive path');
 await fs.rm('dist',{recursive:true,force:true});execFileSync('tar',['-xzf',directory+'/build.tar.gz']);
 if(!(await fs.readFile('dist/index.html','utf8')).includes('content="'+proof.build+'"'))throw Error('Build artifact fingerprint differs');
 for(const f of proof.files){const data=await fs.readFile(directory+'/'+f.file);if(data.length!==f.bytes||sha(data)!==f.sha256||f.file!==path.basename(f.file))throw Error('Damaged standard proof '+f.file);await copy(directory+'/'+f.file,'.qa-output/'+f.file);}
 console.log(JSON.stringify({stage:'verified-build-restore',...await snapshot()}));
}
async function job(kind){
 if(!['chromium','firefox','webkit'].includes(kind))throw Error('Unknown quality job');
 const expected=await snapshot(),directory='work/quality-'+kind;await fs.rm(directory,{recursive:true,force:true});await fs.mkdir(directory,{recursive:true});
 const report=await read('.qa-output/'+(kind==='chromium'?'portable-report.json':'engine-report.json'));
 if(report.status!=='passed'||report.build!==expected.build)throw Error('Browser report is incomplete');
 if(kind==='chromium'){if(report.scope!=='complete mandatory regression')throw Error('Partial Chromium cannot pass');await prepareReview();}
 else if(report.sourceDigest!==expected.sourceDigest||report.testedCommit!==expected.testedCommit||report.engines.length!==1||report.engines[0].name!==kind||!engineComplete(report.engines[0])||report.errors.length)throw Error('Incomplete actual engine '+kind);
 const source=kind==='chromium'?'.qa-output/review':'.qa-output',files=[];
 for(const name of (await fs.readdir(source)).sort()){if(kind!=='chromium'&&!/^journey-engine-.*\.(png|json)$|^engine-report\.json$/.test(name))continue;if(!/\.(png|json|xml)$/.test(name))continue;const data=await fs.readFile(source+'/'+name);await fs.writeFile(directory+'/'+name,data);files.push({file:name,bytes:data.length,sha256:sha(data)});}
 await fs.writeFile(directory+'/job-proof.json',JSON.stringify({schemaVersion:1,kind,status:'passed',...expected,seconds:report.seconds,files},null,2));
 console.log(JSON.stringify({stage:'browser-job-proof',kind,...expected,seconds:report.seconds,bytes:files.reduce((n,f)=>n+f.bytes,0)}));
}
async function collect(){
 const expected=await snapshot(),proofs=[];await restore();
 for(const kind of ['chromium','firefox','webkit']){const directory='work/quality-'+kind,proof=await read(directory+'/job-proof.json');proofs.push(proof);for(const f of proof.files){if(f.file!==path.basename(f.file))throw Error('Invalid evidence filename');const data=await fs.readFile(directory+'/'+f.file);if(data.length!==f.bytes||sha(data)!==f.sha256)throw Error('Damaged browser evidence '+f.file);if(kind==='chromium'||f.file.endsWith('.png')||/^journey-engine-.*\.json$/.test(f.file))await copy(directory+'/'+f.file,'.qa-output/'+f.file);}}
 validateCollectedProofs(proofs,expected);
 const reports=await Promise.all(['firefox','webkit'].map(kind=>read('work/quality-'+kind+'/engine-report.json')));
 const combined={...expected,status:'passed',scope:'firefox+webkit from isolated same-snapshot jobs',engines:reports.flatMap(r=>r.engines),errors:[],seconds:reports.reduce((n,r)=>n+r.seconds,0),wallSeconds:Math.max(...reports.map(r=>r.seconds))};
 await fs.writeFile('.qa-output/engine-report.json',JSON.stringify(combined,null,2));
 await createHandoff(await read('.qa-output/portable-report.json'),'.qa-output',{requiredEngines:['firefox','webkit']});
 await fs.writeFile('.qa-output/ci-cost-observations.json',JSON.stringify({meaning:'Measured browser execution sum; full runner setup/upload minutes must also be read from GitHub job timestamps. No zero-cost or total improvement guarantee.',...expected,browserSeconds:proofs.reduce((n,p)=>n+p.seconds,0),browserWallSeconds:Math.max(...proofs.map(p=>p.seconds)),jobs:proofs.map(({kind,seconds})=>({kind,seconds})),maximumConcurrentBrowserJobs:3},null,2));
 // Only reuse the capture ledger whose bytes were sealed by this run's validated Chromium job.
 const review=await prepareReview('.qa-output',{sealedCaptureLedger:await read('work/quality-chromium/review-manifest.json')});validateCollectedProofs(proofs,expected,review);console.log(JSON.stringify({stage:'actual-uploaded-review-images',images:review.storage.retainedImages,bytes:review.retainedBytes,reserveBytes:review.storage.reserveBytes}));console.log('All required same-commit browser and engine evidence accepted. No merge or release authorization.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [action,kind]=process.argv.slice(2);if(action==='pack')await pack();else if(action==='restore')await restore();else if(action==='job')await job(kind);else if(action==='collect')await collect();else throw Error('Use pack, restore, job KIND or collect');
}
