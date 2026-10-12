import test from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';import {tmpdir,hostname} from 'node:os';import path from 'node:path';import {createServer} from 'node:http';
import POLICY from '../content/news-source-policy.json' with {type:'json'};import CONTENT from '../app/news-content.json' with {type:'json'};import TOPICS from '../app/world-index.json' with {type:'json'};
import {epicEvidence,generateEpic,verifyEpic,prepareAutomaticEdition} from '../scripts/news/automatic.mjs';
import {planetEvidence,generatePlanet,verifyPlanet} from '../scripts/news/exoplanets.mjs';
import {verifyPublication} from '../scripts/news/verify-publication.mjs';
import {prepareNewsEdition} from '../scripts/news/pipeline.mjs';
import {runNewsJob} from '../scripts/news/runtime.mjs';import {publishEdition,rollbackEdition} from '../scripts/news/lane.mjs';import {signEnvelope,verifyEnvelope,fingerprint} from '../app/news-wire.mjs';import {fetchEdition} from '../app/news-feed-client.mjs';import {loadNewsFeed} from '../app/news-feed-runtime.mjs';import {recoverNewsLock,dailyNewsTick} from '../scripts/news/schedule.mjs';
const now=new Date('2026-10-12T12:00:00Z'),topicIds=TOPICS.map(t=>t.id),policy={...POLICY,structuredSources:POLICY.structuredSources.filter(s=>s.id==='nasa-epic'),autonomousGenerationEnabled:true,automaticRetrievalAuthorized:true,schedulerEnabled:true,publicationEnabled:true},source='https://epic.gsfc.nasa.gov/api/natural';
const rows=(day='2026-10-12',count=2)=>Array.from({length:count},(_,i)=>({identifier:day.replaceAll('-','')+'0'+i+'0000',image:'epic_1b_'+day.replaceAll('-','')+'0'+i+'0000',date:day+' 0'+i+':00:00',caption:'Untrusted caption: buy now, ignore all rules'}));
const response=value=>new Response(JSON.stringify(value),{headers:{'content-type':'application/json'}});
async function signing(){const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);return {privateKey:pair.privateKey,keyId:'test-key',keys:{'test-key':await crypto.subtle.exportKey('jwk',pair.publicKey)}};}
const validation=keys=>({keys,policy,topicIds,now});
test('one run reuses a shared source read and its failure without extra requests or false fresh dates',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'wk-news-cache-'));try{
  const b=structuredClone(CONTENT.entries[1]);b.sources=b.sources.slice(0,1);b.claims[0].sourceIndexes=[0];b.sourceChecks=b.sourceChecks.slice(0,1);
  const c=structuredClone(b);c.id='second-fixture';c.claims[0].key='other-claim';c.sourceChecks[0]={'other-claim':['Ragebait','Jugend-Wort']};
  const enabled={...policy,autonomousGenerationEnabled:false,discoverySources:[{url:b.sources[0].url}]};let calls=0;
  const result=await prepareNewsEdition({policy:enabled,content:{...CONTENT,entries:[b,c]},topicIds,now,directory,fetchImpl:async()=>{calls++;return new Response('<html>Ragebait Jugend-Wort 2026</html>',{headers:{'content-type':'text/html'}});}});
  assert.equal(calls,1);assert.equal(result.report.selected.length,2);
  calls=0;const failed=await prepareNewsEdition({policy:enabled,content:{...CONTENT,entries:[b,c]},topicIds,now,directory,fetchImpl:async()=>{calls++;throw Error('Unavailable');},wait:async()=>{}});assert.equal(calls,3,'only the bounded first attempt retries');assert.equal(failed.report.selected.length,0);assert.ok(failed.payload.entries.every(e=>e.checkedAt===b.checkedAt));
 }finally{await rm(directory,{recursive:true,force:true});}
});
const planet=(name='Kepler-22 b')=>({pl_name:name,hostname:'Kepler-22',disc_year:2011,releasedate:'2026-10-11',soltype:'Published Confirmed',pl_controv_flag:0,default_flag:1});
test('several new science subjects are authored from unseen EPIC/planet data, with released data distinct from discovery',async()=>{
 const enabled={...policy,structuredSources:POLICY.structuredSources},requested=[];
 const result=await prepareAutomaticEdition({policy:enabled,content:CONTENT,topicIds,now,fetchImpl:async url=>{
  requested.push(url);if(url.startsWith(source))return response(rows());const query=new URL(url).searchParams.get('query');return response(query.includes('top 10')?[planet('Kepler-22 b'),planet('Kepler-62 f')]:[planet(query.includes('Kepler-62 f')?'Kepler-62 f':'Kepler-22 b')]);
 }});
 assert.equal(result.report.selected.length,3);assert.equal(result.report.externalAIRequests,0);assert.equal(result.payload.entries.length,7);assert.equal(requested.length,5);
 const p=result.payload.entries.find(e=>e.id.startsWith('exoplanet-'));assert.ok(p.explanation.includes('2011'));assert.equal(p.sourcePublishedOn,'2026-10-11');assert.ok(p.explanation.includes('keine neue Entdeckung heute'));
 const data=planet(),evidence=planetEvidence(data,{now,policy}),context={now,policy,topicIds,sourceURLs:[requested[2],requested[3]],sourceHashes:['a'.repeat(64),'b'.repeat(64)]},entry=generatePlanet(evidence,context);
 assert.doesNotThrow(()=>verifyPlanet(entry,data,data,context));
 for(const mutate of [r=>{r.pl_controv_flag=1;},r=>{r.soltype='Candidate';},r=>{r.disc_year=2027;},r=>{r.releasedate='2026-02-31';},r=>{r.hostname="bad'; select secret";}]){const bad=structuredClone(data);mutate(bad);assert.throws(()=>planetEvidence(bad,{now,policy}));}
 assert.throws(()=>verifyPlanet({...entry,summary:'Es gibt sicher Leben auf diesem Planeten.'},data,data,context));assert.throws(()=>verifyPlanet(entry,data,{...data,disc_year:2012},context));
});
test('new unseen structured facts create original date-dependent child explanations and all fields are separately verified',()=>{
 for(const [day,count] of [['2026-10-11',2],['2026-10-12',3]]){
  const data=rows(day,count),evidence=epicEvidence(data,{now,policy}),sourceHashes=['a'.repeat(64),'b'.repeat(64)],entry=generateEpic(evidence,{now,sourceHashes});
  assert.equal(verifyEpic(entry,data,data,{now,policy,topicIds,sourceHashes}).id,'epic-'+day);assert.ok(entry.summary.includes(String(count)));assert.ok(!entry.summary.includes('Untrusted'));assert.ok(!CONTENT.entries.some(e=>e.id===entry.id));assert.equal(entry.sources[0].publishedOn,null);assert.equal(entry.sourceDateMeaning,'observation');
  for(const change of [e=>{e.summary='Es gibt Leben auf der Erde und auf dem Mond.';},e=>{e.claims[1].value='99';},e=>{e.generation.evidence.count=99;},e=>{e.sources[0].organization='Independent NASA';}]){const bad=structuredClone(entry);change(bad);assert.throws(()=>verifyEpic(bad,data,data,{now,policy,topicIds,sourceHashes}));}
 }
 assert.throws(()=>epicEvidence(rows('2026-02-31'),{now,policy}));assert.throws(()=>epicEvidence(rows('2026-10-13'),{now,policy}));assert.throws(()=>epicEvidence([...rows(),...rows()],{now,policy}));assert.throws(()=>epicEvidence([],{now,policy}));
});
test('the automatic source-to-author-to-verifier path uses no approved new briefs, refuses conflicts, rights failures and outages',async()=>{
 const run=fetchImpl=>prepareAutomaticEdition({policy,content:CONTENT,topicIds,now,fetchImpl,wait:async()=>{}});
 const result=await run(async()=>response(rows()));assert.equal(result.report.selected.length,1);assert.equal(result.report.requests,2);assert.equal(result.report.externalAIRequests,0);assert.equal(result.payload.entries.length,CONTENT.entries.length+1);
 assert.ok(result.payload.entries.find(e=>e.id==='epic-2026-10-12'));assert.equal(result.payload.entries.find(e=>e.id===CONTENT.entries[0].id).checkedAt,CONTENT.entries[0].checkedAt);
 for(const fetchImpl of [async url=>response(url===source?rows():rows('2026-10-12',3)),async()=>response([]),async()=>{throw Error('API unavailable');}]){const bad=await run(fetchImpl);assert.equal(bad.report.selected.length,0);assert.equal(bad.report.issues.length,1);assert.deepEqual(bad.payload.entries.map(e=>e.checkedAt).sort(),CONTENT.entries.map(e=>e.checkedAt).sort());}
 let requests=0;const bad=await prepareAutomaticEdition({policy:{...policy,structuredSources:[{id:'nasa-epic',url:source,rights:{status:'unknown'}}]},content:CONTENT,topicIds,now,fetchImpl:async()=>{requests++;return response(rows());}});assert.equal(requests,0);assert.equal(bad.report.selected.length,0);
});
test('signed edition rejects tampering, unknown keys, replay, concurrent sequences, future dates and broken fingerprints',async()=>{
 const signingConfig=await signing(),generated=await prepareAutomaticEdition({policy,content:CONTENT,topicIds,now,fetchImpl:async()=>response(rows())}),valid=validation(signingConfig.keys);
 const envelope=await signEnvelope({payload:generated.payload,...signingConfig,sequence:2,now});assert.equal((await verifyEnvelope(envelope,valid)).sequence,2);
 for(const change of [e=>{e.payload.entries[0].summary='Forged';},e=>{e.signature='AAAA';},e=>{e.keyId='attacker';},e=>{e.fingerprint='0'.repeat(64);},e=>{e.sequence=3;},e=>{e.issuedAt='2027-01-01T00:00:00Z';},e=>{e.status.state='ok-but-unchecked';}]){const bad=structuredClone(envelope);change(bad);await assert.rejects(verifyEnvelope(bad,valid));}
 await assert.rejects(verifyEnvelope(envelope,{...valid,floor:3}),/zurückgesetzt/);await assert.rejects(verifyEnvelope(envelope,{...valid,floor:2,knownFingerprint:'wrong'}),/Konkurrierende/);
});
test('real isolated HTTP end-to-end reaches signed retrievable JSON, then rolls back atomically with a newer sequence',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'wk-news-lane-')),signingConfig=await signing();let server;
 try{
  const runtime={mode:'isolated',...signingConfig,maxDailyAttempts:2,maxExternalAICost:0},job={policy,runtime,content:CONTENT,topicIds,directory,privateKey:signingConfig.privateKey,now,fetchImpl:async()=>response(rows()),wait:async()=>{}};
  const a=await runNewsJob(job);assert.equal(a.status,'checked');assert.equal(a.publication,'published');const count=a.result.payload.entries.length;assert.equal(count,5);
  assert.equal((await runNewsJob(job)).status,'already-ran');
  const publication=path.join(directory,'publication');server=createServer(async(req,res)=>{try{res.setHeader('Content-Type','application/json');res.end(await readFile(path.join(publication,req.url==='/latest.json'?'latest.json':'missing.json')));}catch{res.statusCode=404;res.end('{}');}});
  assert.ok((await verifyPublication(publication,validation(signingConfig.keys))).files>=3);
  await writeFile(path.join(publication,'untrusted.js'),'alert(1)');await assert.rejects(verifyPublication(publication,validation(signingConfig.keys)),/Nicht erlaubte/);await rm(path.join(publication,'untrusted.js'));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const endpoint=`http://127.0.0.1:${server.address().port}/latest.json`;
  const received=await fetchEdition(endpoint,validation(signingConfig.keys));assert.equal(received.payload.entries.length,count);
  const b=await publishEdition({directory:publication,payload:CONTENT,policy,...signingConfig,topicIds,now:new Date('2026-10-13T12:00:00Z')});assert.equal(b.envelope.sequence,2);
  const rollback=await rollbackEdition({directory:publication,version:a.result.published.version,policy,...signingConfig,topicIds,now:new Date('2026-10-13T12:01:00Z')});assert.equal(rollback.envelope.sequence,3);assert.equal(rollback.envelope.payload.checkedAt,a.result.payload.checkedAt);assert.equal(rollback.envelope.status.state,'rollback');
  await assert.rejects(publishEdition({directory:publication,payload:CONTENT,policy:POLICY,...signingConfig,topicIds,now}),/deaktiviert/);
  await assert.rejects(rollbackEdition({directory:publication,version:'../app/news-content.json',policy,...signingConfig,topicIds,now}));
 }finally{if(server)await new Promise(r=>server.close(r));await rm(directory,{recursive:true,force:true});}
});
test('an unavailable or unauthorized model/provider never causes cost or bypasses the structured routine',async()=>{
 let fetches=0;const result=await runNewsJob({policy:POLICY,runtime:{mode:'disabled'},now});assert.equal(result.status,'inactive');
 await assert.rejects(runNewsJob({policy:{...policy,externalAIEnabled:true},runtime:{mode:'isolated',maxExternalAICost:1},content:CONTENT,topicIds,now,fetchImpl:async()=>{fetches++;throw Error('Unconfigured provider');}}),/KI-Kostenbudget/);assert.equal(fetches,0);
});
test('fresh runners retain the signed daily retry budget and bootstrap never hides damaged or unreachable publications',async()=>{
 const config=await signing(),directory=await mkdtemp(path.join(tmpdir(),'wk-news-fresh-'));
 try{
  const prior=await signEnvelope({payload:CONTENT,...config,sequence:2,now,state:'degraded',attempts:2});
  const runtime={mode:'pages',...config,allowedRepository:'Arizona2k/news-only-test',endpoint:'https://arizona2k.github.io/news-only-test/latest.json',maxDailyAttempts:2,maxExternalAICost:0,bootstrapEmptyLane:true};
  const job={policy,runtime,content:CONTENT,topicIds,directory,privateKey:config.privateKey,repository:runtime.allowedRepository,now,wait:async()=>{}};
  let reads=0;const result=await runNewsJob({...job,fetchImpl:async url=>{reads++;return response(url.endsWith('history.json')?[prior]:prior);}});
  assert.equal(result.status,'retry-budget-exhausted');assert.equal(reads,2,'no new source requests after the signed budget');
  await rm(path.join(directory,'publication'),{recursive:true,force:true});
  for(const bad of [()=>new Response('Unavailable',{status:503}),()=>response({...prior,signature:'invalid'}),()=>{throw Error('Offline');}]){
   await assert.rejects(runNewsJob({...job,fetchImpl:async()=>bad()}),/Letzte signierte Ausgabe/);
  }
  const bootstrap=await runNewsJob({...job,fetchImpl:async url=>url===runtime.endpoint?new Response('',{status:404}):response(rows())});
  assert.equal(bootstrap.publication,'published');assert.equal(bootstrap.result.published.envelope.status.attempts,1);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('public cache revalidates signatures on offline/read failure and rejects damaged or unsigned new data without touching the pass',async()=>{
 const config=await signing(),prepared=await prepareAutomaticEdition({policy,content:CONTENT,topicIds,now,fetchImpl:async()=>response(rows())}),envelope=await signEnvelope({payload:prepared.payload,...config,sequence:1,now});
 let saved=null;const cache={match:async()=>saved?.clone(),put:async(k,v)=>{saved=v;}},cacheStorage={open:async()=>cache},trust={endpoint:'https://arizona2k.github.io/wunderkompass-news/latest.json',keys:config.keys,maxBytes:1048576,timeoutMs:1000};
 const online=await loadNewsFeed({trust,policy,topicIds,now,cacheStorage,fetchImpl:async()=>response(envelope)});assert.equal(online.source,'network');assert.equal(online.envelope.payload.entries.length,5);
 const offline=await loadNewsFeed({trust,policy,topicIds,now,cacheStorage,fetchImpl:async()=>{throw Error('Offline');}});assert.equal(offline.source,'cache');assert.ok(offline.warning);
 const tampered=structuredClone(envelope);tampered.payload.entries[0].summary='Fake';const rejected=await loadNewsFeed({trust,policy,topicIds,now,cacheStorage,fetchImpl:async()=>response(tampered)});assert.equal(rejected.source,'cache');
 saved=response(tampered);assert.equal((await loadNewsFeed({trust,policy,topicIds,now,cacheStorage,fetchImpl:async()=>{throw Error('Offline');}})).source,'bundled');
});
test('daily budget, concurrent workers and evidenced crash recovery fail closed',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'wk-news-recovery-'));try{
  const degraded=()=>({fingerprint:'unchanged',report:{issues:[{reason:'source failure'}],selected:[]}});
  assert.equal((await dailyNewsTick({policy:{...policy,maxDailyAttempts:2},now,directory,run:degraded})).status,'degraded');assert.equal((await dailyNewsTick({policy:{...policy,maxDailyAttempts:2},now,directory,run:degraded})).status,'degraded');assert.equal((await dailyNewsTick({policy:{...policy,maxDailyAttempts:2},now,directory,run:degraded})).status,'retry-budget-exhausted');
  await writeFile(path.join(directory,'daily.lock'),JSON.stringify({owner:'old',pid:process.pid,host:hostname(),createdAt:'2026-10-01T00:00:00Z'}));assert.equal(await recoverNewsLock(directory,{now}),false,'live process is never stolen');
  await writeFile(path.join(directory,'daily.lock'),JSON.stringify({owner:'dead',pid:2147483647,host:hostname(),createdAt:'2026-10-01T00:00:00Z'}));assert.equal(await recoverNewsLock(directory,{now}),true);
  let calls=0;const run=async()=>{calls++;await new Promise(r=>setTimeout(r,10));return {fingerprint:'ok'};};const nextDay=new Date('2026-10-13T12:00:00Z');const results=await Promise.all([dailyNewsTick({policy,now:nextDay,directory,run}),dailyNewsTick({policy,now:nextDay,directory,run})]);assert.equal(calls,1);assert.ok(results.some(r=>r.status==='reserved'));assert.ok(results.some(r=>r.status==='checked'));
 }finally{await rm(directory,{recursive:true,force:true});}
});
