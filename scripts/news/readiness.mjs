import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fetchSource} from './engine.mjs';
import {prepareAutomaticEdition} from './automatic.mjs';
import {signEnvelope,verifyEnvelope} from '../../app/news-wire.mjs';

/** Read-only original-source proof, separate from operational activation.
 * Never changes production switches, persists a private key, or publishes.
 * An unavailable source is a recorded blocker, never a passing live test.
 */
export async function inspectReadiness({policy,runtime,content,topicIds,now=new Date(),fetchImpl=fetch}){
 const probePolicy={...policy,autonomousGenerationEnabled:true,automaticRetrievalAuthorized:true};
 const prepared=await prepareAutomaticEdition({policy:probePolicy,content,topicIds,now,fetchImpl});
 const rightsDocuments=[],rightsDeadline=AbortSignal.timeout(30000);let rightsRequests=0;
 for(const source of policy.structuredSources??[])for(const url of source.rights?.urls??[]){
  if(++rightsRequests>5||rightsDeadline.aborted){rightsDocuments.push({id:source.id,url,status:'blocked',reason:'Bounded original-document inspection budget exhausted'});continue;}
  try{const document=await fetchSource(url,probePolicy,{fetchImpl,signal:rightsDeadline,rightsDocument:true});rightsDocuments.push({id:source.id,url,status:'retrieved-not-auto-approved',sha256:document.sha256,bytes:document.bytes,excerpt:document.text.slice(0,900)});}catch(error){rightsDocuments.push({id:source.id,url,status:'blocked',reason:error.message});}
 }
 const blockers=prepared.report.issues.map(i=>({area:'source',id:i.id,reason:i.reason}));
 let originalGeneratedSigned=false;
 if(prepared.report.selected.length){
  const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
  const keyId='ephemeral-readiness-only',keys={[keyId]:await crypto.subtle.exportKey('jwk',pair.publicKey)};
  const signed=await signEnvelope({payload:prepared.payload,keyId,privateKey:pair.privateKey,sequence:1,previous:null,now,state:blockers.length?'degraded':'ok',quarantined:blockers.length,attempts:1});
  await verifyEnvelope(signed,{keys,policy:probePolicy,topicIds,now});originalGeneratedSigned=true;
 }
 if((policy.structuredSources??[]).some(s=>!s.rights?.documentFingerprints))blockers.push({area:'rights-monitoring',reason:'Tatsächlich freigegebene Dokumentfingerprints für automatische Rechtekontrolle fehlen.'});
 if(runtime.mode==='disabled'||!runtime.endpoint||!runtime.allowedRepository)blockers.push({area:'hosting',reason:'Kein nachgewiesenes separates freigegebenes HTTPS/CORS/JSON-Ziel konfiguriert.'});
 if(!runtime.keyId||!runtime.keys[runtime.keyId])blockers.push({area:'trust',reason:'Kein operativer öffentlicher Signaturprüfschlüssel konfiguriert; kurzlebiger Testschlüssel ersetzt ihn nicht.'});
 if(!policy.schedulerEnabled||!policy.publicationEnabled)blockers.push({area:'activation',reason:'Live-Scheduler und Veröffentlichung sind weiterhin deaktiviert.'});
 return {schemaVersion:1,checkedAt:now.toISOString(),kind:'read-only original-source readiness inspection',operativelyActive:false,rightsDocuments,originalSources:prepared.report,generatedEntries:prepared.payload.entries.filter(e=>prepared.report.selected.includes(e.id)),originalGeneratedSigned,status:blockers.length?'blocked':'requires-isolated-hosting-and-permissions-proof',blockers,costsAdded:0,externalAIRequests:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const json=async file=>JSON.parse(await readFile(new URL('../../'+file,import.meta.url),'utf8'));
 const policy=await json('content/news-source-policy.json'),runtime=await json('content/news-runtime.json'),content=await json('app/news-content.json'),topics=await json('app/world-index.json');
 const report=await inspectReadiness({policy,runtime,content,topicIds:topics.map(t=>t.id)});
 const destination=path.resolve(process.argv.includes('--ci-report')?'.qa-output/news-readiness.json':'work/news-readiness.json');await mkdir(path.dirname(destination),{recursive:true});await writeFile(destination,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,operativelyActive:report.operativelyActive,selected:report.originalSources.selected,originalGeneratedSigned:report.originalGeneratedSigned,blockers:report.blockers}));
 // Report mode is an inspection result, not a successful operations gate.
 // The actual readiness gate always fails closed until original+hosting proof.
 if(!process.argv.includes('--ci-report')&&report.status!=='ready')process.exitCode=2;
}
