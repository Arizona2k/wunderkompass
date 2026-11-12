import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import {beforeAccessiblePeopleSourceDossiers,beforeMetRecordSourceUIDossiers,accessiblePeopleSourceCorrection as correction} from './people-accessible-sources-reference.mjs';
import {beforeFourteenDossiers} from './people-fourteen-dossier-reference.mjs';
import {beforeRetainedPeopleDossiers,beforeRetainedPeople} from './retained-people-reference.mjs';
import {observedHattushaUNESCOMaterialReady,observedWHOMaterialReady,observedGutenbergUNESCOMaterialReady} from './browser/people-source-activation.mjs';

test('only the exact complete visible UNESCO archive description and inscription year may precede its delayed DOM event inside the original budget',()=>{
 const url='https://www.unesco.org/en/memory-world/hittite-cuneiform-tablets-bogazkoy';
 const anchors=['cuneiform clay tablets','Hittites','Treaty of Quadesh','religious','literary works','Registration Year: 2001'];
 const good={sourceURL:url,actualURL:url,responseURL:url,httpStatus:200,mainBodyComplete:true,readyState:'loading',elapsedMs:1400,title:'The Hittite cuneiform tablets from Bogazköy - Memory of the World',body:anchors.join(' ')+' '.repeat(2100)};
 assert.equal(observedHattushaUNESCOMaterialReady(good),true);
 for(const bad of [null,{},...['sourceURL','actualURL','responseURL'].map(key=>({...good,[key]:'https://example.org/unrelated'})),...[403,429,503,206].map(httpStatus=>({...good,httpStatus})),{...good,mainBodyComplete:false},{...good,mainBodyComplete:undefined},{...good,readyState:'interactive'},{...good,elapsedMs:30000},{...good,elapsedMs:-1},{...good,elapsedMs:NaN},{...good,title:'Just a moment...'},{...good,body:'archive navigation only'},...anchors.map(part=>({...good,body:good.body.replace(part,'absent')}))])assert.equal(observedHattushaUNESCOMaterialReady(bad),false);
});

test('eight reviewed alternatives retain all35 public source actions and exact prior dossier facts, media and histories',()=>{
 const rows=beforeRetainedPeopleDossiers(JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers);
 assert.equal(rows.length,268);assert.equal(correction.dossiers.length,6);
 const restored=beforeAccessiblePeopleSourceDossiers(rows);
 for(const change of correction.dossiers)assert.deepEqual(restored.find(row=>row.id===change.id),change.original);
 assert.equal(beforeFourteenDossiers(rows).length,254);
 const inquiries=beforeRetainedPeople(JSON.parse(fs.readFileSync('app/people-inquiries.json','utf8')).entries);
 const next=new Set(inquiries.slice(4).map(row=>row.id));
 assert.equal(catalog.filter(row=>next.has(row.id)).reduce((sum,row)=>sum+row.sources.length,0),35);
 // Arbitrary new data or stale current source/body claims cannot hide behind
 // reconstruction of a known historically reviewed object.
 for(const change of correction.dossiers){
  for(const mutate of [row=>row.sources[0].url='https://invalid.example/unreviewed',row=>row.explanation+=' unreviewed',row=>row.claims[0].anchor='unreviewed',row=>row.ui.build='invented',row=>row.ui.route='world/topic/unreviewed-route',row=>row[correction.native218SourceUIQualification.historyField].build='invented',row=>row[correction.native218SourceUIQualification.historyField].route='world/topic/unreviewed-route',row=>row[correction.native218SourceUIQualification.historyField].report+=' unreviewed',row=>delete row[correction.native218SourceUIQualification.historyField],row=>row.mediaDecision='unreviewed']){
   const bad=structuredClone(rows);mutate(bad.find(row=>row.id===change.id));
   assert.throws(()=>beforeFourteenDossiers(bad),change.id);
  }
 }
});

test('one public museum object record replaces a blocked presentation link while whole topic facts, recognition answers and previous dossier histories remain exact',()=>{
 const latest=correction.native219MetRecordCorrection;
 assert.equal(latest.beforeBuild,'a4159aa2baedb03e');assert.equal(latest.currentBuild,correction.currentBuild);
 const topic=catalog.find(t=>t.id==='person-murasaki_shikibu');
 const source=topic.sources[1];assert.equal(source.url,'https://collectionapi.metmuseum.org/public/collection/v1/objects/76463');assert.match(source.label,/\(JSON\)$/);
 assert.equal(topic.sources.length,3);
 const restored=structuredClone(topic);restored.sources[1]=latest.beforeTopic.sources[1];restored.revision=latest.beforeTopic.revision;assert.deepEqual(restored,latest.beforeTopic,'only the named source and revision change; no removed facts, tasks, answers, media or links');
 const rows=JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers;
 const current=beforeMetRecordSourceUIDossiers(rows).find(d=>d.id==='topics-people:person-murasaki_shikibu');
 const inverse=structuredClone(current);inverse.sources[1]=latest.beforeDossier.sources[1];inverse.claims[2]=latest.beforeDossier.claims[2];inverse.dataHash=latest.beforeDossier.dataHash;
 assert.deepEqual(inverse,latest.beforeDossier,'complete preceding a415 dossier, including every nested UI history');
 for(const mutate of [r=>r.sources[1].url='https://invalid.example/object',r=>r.claims[2].anchor='unreviewed',r=>r.media[0].license='unreviewed',r=>r.ui.report+=' unreviewed',r=>r[latest.uiQualification.historyField].build='invented',r=>r[latest.uiQualification.historyField].route='world/topic/unreviewed-route',r=>r[latest.uiQualification.historyField].report+=' unreviewed',r=>delete r[latest.uiQualification.historyField]]){
  const bad=structuredClone(rows);mutate(bad.find(r=>r.id===current.id));assert.throws(()=>beforeFourteenDossiers(bad),'unknown source, claim, rights or evidence mutation is rejected');
 }
});

// Regression for the observed transport failure; actual popup contexts are checked separately.
import {createHash} from 'node:crypto';
import {recoverKnownHTMLConnectionTimeout,recoverObservedHTTP2RefusedStream,observedLeavittMaterialReady,observedCurieBnFMaterialReady} from './browser/people-source-activation.mjs';

const observedArchive='https://web.archive.org/web/20260814065154/https://www.loc.gov/exhibits/mali/mali-exhibit.html#obj11';
function refusedStreamTab({sourceURL=observedArchive,failureURL=sourceURL.split('#')[0],rootURL=failureURL,errorText='net::ERR_HTTP2_SERVER_REFUSED_STREAM',failures=1,elapsed=5000,currentURL='chrome-error://chromewebdata/',responses=[],afterStatus=200,afterBody='Actual source body still requires normal HTTP and factual qualification.',gotoError,pauseElapsed=2000}={}){
 const row={status:'external access not yet qualified',mainResponses:[...responses]},calls=[],delays=[],navigationFailures=Array.from({length:failures},()=>({url:failureURL,activatedSourceRoot:rootURL,errorText}));
 let text='';
 const popup={url:()=>currentURL,title:async()=>'Actual destination',locator:()=>({innerText:async()=>text}),goto:async(url,options)=>{
  calls.push({url,options});if(gotoError)throw gotoError;
  currentURL=url;row.mainResponses.push({url,status:afterStatus});text=afterBody;
 },reload:async()=>{throw new Error('A second recovery request is forbidden');}};
 const args={popup,row,sourceURL,navigationFailures,activationStarted:1000,now:()=>1000+elapsed,pause:async ms=>{delays.push(ms);elapsed+=pauseElapsed;},recordedNavigationResponses:()=>row.mainResponses};
 return {args,row,calls,delays,navigationFailures,run:()=>recoverObservedHTTP2RefusedStream(args)};
}

test('the observed HTTP2 refusal permits one same-source GET inside the original deadline, retaining its failed original without qualification',async()=>{
 for(const sourceURL of[observedArchive,'https://web.archive.org/web/20261107000304/https://whc.unesco.org/en/list/668','https://web.archive.org/web/20260421020316/https://www.metmuseum.org/art/collection/search/329081']){
  const x=refusedStreamTab({sourceURL});await x.run();
  assert.deepEqual(x.calls,[{url:sourceURL,options:{waitUntil:'domcontentloaded',timeout:23000}}]);assert.deepEqual(x.delays,[2000]);
  assert.deepEqual(x.row.originalNavigationFailures,x.navigationFailures);assert.notEqual(x.row.originalNavigationFailures,x.navigationFailures);
  assert.equal(x.row.transientNavigationRecovery.initialError,'net::ERR_HTTP2_SERVER_REFUSED_STREAM');assert.equal(x.row.transientNavigationRecovery.initialHTTP,null);
  assert.equal(x.row.transientNavigationRecovery.additionalRequestsMaximum,1);assert.equal(x.row.transientNavigationRecovery.noTimeoutExtension,true);assert.equal(x.row.transientNavigationRecovery.finalHTTP,200);
  assert.equal(x.row.status,'external access not yet qualified');await x.run();assert.equal(x.calls.length,1);
 }
});

test('unknown failures, other documents, any HTTP response, PDF and expired or invalid budgets cannot trigger refused-stream recovery',async()=>{
 for(const options of[{sourceURL:'https://unrelated.example/article'},{sourceURL:'https://web.archive.org/web/20260814065154/https://www.loc.gov/exhibits/mali/other.html'},{sourceURL:'https://source.example/whole.pdf'},...['net::ERR_CONNECTION_RESET','net::ERR_CERT_AUTHORITY_INVALID','net::ERR_HTTP2_PROTOCOL_ERROR',null,'net::ERR_HTTP2_SERVER_REFUSED_STREAM unknown'].map(errorText=>({errorText})),{failureURL:'https://unrelated.example/'},{rootURL:'https://unrelated.example/'},{failures:0},{failures:2},{currentURL:observedArchive},...[200,206,403,429,503].map(status=>({responses:[{url:observedArchive,status}]})),...[30000,30001,-1,NaN,Infinity].map(elapsed=>({elapsed}))]){
  const x=refusedStreamTab(options);await x.run();assert.deepEqual(x.calls,[],JSON.stringify(options));assert.deepEqual(x.delays,[]);assert.equal(x.row.transientNavigationRecovery,undefined);
 }
});

test('refused-stream backoff cannot extend an exhausted original budget or start a request without its reserve',async()=>{
 for(const options of[{elapsed:29000},{elapsed:28000},{elapsed:27000,pauseElapsed:3000}]){
  const x=refusedStreamTab(options);await x.run();assert.deepEqual(x.calls,[]);assert.equal(x.row.transientNavigationRecovery.noTimeoutExtension,true);assert.equal(x.row.status,'external access not yet qualified');
  assert.match(x.row.transientNavigationRecovery.recoveryNotStarted,/insufficient original budget|original activation budget exhausted/);
 }
});

test('a refused-stream recovery that fails preserves the original error and cannot start a second request',async()=>{
 const error=new Error('second ordinary navigation failed'),x=refusedStreamTab({gotoError:error});
 await assert.rejects(x.run(),e=>e===error);assert.deepEqual(x.row.originalNavigationFailures,x.navigationFailures);assert.equal(x.calls.length,1);assert.equal(x.row.status,'external access not yet qualified');
 await x.run();assert.equal(x.calls.length,1);
});

test('refused-stream and existing503recovery share one total additional request; subsequent HTTP failures remain unqualified',async()=>{
 const body='upstream connect error or disconnect/reset before headers. reset reason: connection timeout';
 for(const afterStatus of[200,403,429,503]){
  const x=refusedStreamTab({afterStatus,afterBody:body});await x.run();
  assert.equal(await recoverKnownHTMLConnectionTimeout(x.args),body);assert.equal(x.calls.length,1);assert.equal(x.row.status,'external access not yet qualified');assert.equal(x.row.transientNavigationRecovery.finalHTTP,afterStatus);
 }
 const x=refusedStreamTab();x.row.transientNavigationRecovery={initialHTTP:503,additionalRequestsMaximum:1};await x.run();assert.deepEqual(x.calls,[]);
});

const connectionTimeoutBody='upstream connect error or disconnect/reset before headers. reset reason: connection timeout';
function sourceTab({status=503,body=connectionTimeoutBody,afterStatus=200,afterBody='A real destination body still requires the caller to qualify its HTTP response and content.',elapsed=5000,sourceURL='https://source.example/article',responseURL=sourceURL,reloadError}={}){
 const row={status:'external access not yet qualified',actualURL:sourceURL,mainResponses:[{url:responseURL,status}]},calls=[];
 let currentBody=body;
 const popup={url:()=>sourceURL,title:async()=>'Destination',locator:selector=>{
  assert.equal(selector,'body');return {innerText:async()=>currentBody};
 },reload:async options=>{
  calls.push(options);if(reloadError)throw reloadError;
  row.mainResponses.push({url:sourceURL,status:afterStatus});currentBody=afterBody;
 }};
 const delays=[];
 return {row,calls,delays,run:()=>recoverKnownHTMLConnectionTimeout({popup,row,sourceURL,activationStarted:1000,now:()=>1000+elapsed,pause:async ms=>{delays.push(ms);elapsed+=ms;},recordedNavigationResponses:()=>row.mainResponses})};
}

test('one observed HTML connection timeout can reload within the original budget without qualifying the source',async()=>{
 const actual=sourceTab();const body=await actual.run();
 assert.equal(body,'A real destination body still requires the caller to qualify its HTTP response and content.');
 assert.deepEqual(actual.calls,[{waitUntil:'domcontentloaded',timeout:23000}]);
 assert.deepEqual(actual.row.mainResponses.map(r=>r.status),[503,200]);
 assert.equal(actual.row.transientNavigationRecovery.initialBody,connectionTimeoutBody);
 assert.equal(actual.row.transientNavigationRecovery.initialBodySHA256,createHash('sha256').update(connectionTimeoutBody).digest('hex'));
 assert.equal(actual.row.transientNavigationRecovery.finalHTTP,200);
 assert.equal(actual.row.status,'external access not yet qualified','Only the actual source caller can qualify HTTP/body/opener/progress');
});

test('a persistent transport failure remains a failure after one request and preserves its initial response',async()=>{
 const actual=sourceTab({afterStatus:503,afterBody:connectionTimeoutBody});
 assert.equal(await actual.run(),connectionTimeoutBody);assert.equal(actual.calls.length,1);
 assert.deepEqual(actual.row.mainResponses.map(r=>r.status),[503,503]);
 assert.equal(actual.row.transientNavigationRecovery.finalHTTP,503);
 assert.equal(actual.row.status,'external access not yet qualified');
});

test('forbidden, missing, maintenance and already successful destinations are not transport-retried',async()=>{
 for(const options of [{status:403},{status:404},{status:200},{body:'Service temporarily unavailable for maintenance'}]){
  const actual=sourceTab(options);await actual.run();assert.deepEqual(actual.calls,[],JSON.stringify(options));
  assert.equal(actual.row.transientNavigationRecovery,undefined);assert.equal(actual.row.status,'external access not yet qualified');
 }
});

test('expired budgets, PDF originals and unassociated response URLs cannot trigger HTML recovery',async()=>{
 for(const options of [{elapsed:30000},{elapsed:30001},{sourceURL:'https://source.example/complete.PDF'},{responseURL:'https://unrelated.example/article'}]){
  const actual=sourceTab(options);await actual.run();assert.deepEqual(actual.calls,[],JSON.stringify(options));
  assert.equal(actual.row.transientNavigationRecovery,undefined);
 }
});

test('a failed ordinary reload propagates its error while retaining the original timeout and unqualified status',async()=>{
 const failure=new Error('reload connection failed'),actual=sourceTab({reloadError:failure});
 await assert.rejects(actual.run(),error=>error===failure);assert.equal(actual.calls.length,1);
 assert.equal(actual.row.transientNavigationRecovery.initialBody,connectionTimeoutBody);
 assert.equal(actual.row.transientNavigationRecovery.finalHTTP,undefined);
 assert.equal(actual.row.status,'external access not yet qualified');
});

const remoteConnectionFailureBody='upstream connect error or disconnect/reset before headers. reset reason: remote connection failure';
test('actual archived LOC remote-refused-stream503 is narrowly recoverable once without certifying HTTP or factual material',async()=>{
 const body='upstream connect error or disconnect/reset before headers. reset reason: remote refused stream reset';
 assert.equal(createHash('sha256').update(body).digest('hex'),'4dc259c6b598cc194255ee5bd4566fa85fcce887296d64b64a7e549522cbc108');
 const actual=sourceTab({body,elapsed:4000});await actual.run();assert.deepEqual(actual.calls,[{waitUntil:'domcontentloaded',timeout:24000}]);assert.deepEqual(actual.delays,[2000]);assert.equal(actual.row.transientNavigationRecovery.remainingActivationMsAfterBackoff,24000);assert.deepEqual(actual.row.mainResponses.map(r=>r.status),[503,200]);assert.equal(actual.row.status,'external access not yet qualified');assert.equal(actual.row.transientNavigationRecovery.additionalRequestsMaximum,1);assert.equal(actual.row.transientNavigationRecovery.noTimeoutExtension,true);
 const persistent=sourceTab({body,afterStatus:503,afterBody:body});assert.equal(await persistent.run(),body);assert.equal(persistent.calls.length,1);assert.equal(persistent.row.transientNavigationRecovery.finalHTTP,503);assert.equal(persistent.row.status,'external access not yet qualified');
 for(const options of[{status:403},{status:429},{status:200},{status:206},{elapsed:29000},{elapsed:30000},{elapsed:30001},{sourceURL:'https://source.example/whole.PDF'},{responseURL:'https://unrelated.example/article'},{body:'remote refused stream reset'},{body:body+' with unknown suffix'}]){const bad=sourceTab({body,...options});await bad.run();assert.deepEqual(bad.calls,[]);if(options.elapsed===29000){assert.equal(bad.row.transientNavigationRecovery.recoveryNotStarted,'insufficient original budget for normal backoff');assert.deepEqual(bad.delays,[]);}else assert.equal(bad.row.transientNavigationRecovery,undefined);}
});
test('the observed exact HTML remote connection failure gets one ordinary reload within the unchanged30s budget',async()=>{
 const actual=sourceTab({body:remoteConnectionFailureBody,elapsed:7000});await actual.run();assert.deepEqual(actual.calls,[{waitUntil:'domcontentloaded',timeout:21000}]);assert.deepEqual(actual.row.mainResponses.map(r=>r.status),[503,200]);assert.equal(actual.row.transientNavigationRecovery.initialBody,remoteConnectionFailureBody);assert.equal(actual.row.transientNavigationRecovery.initialBodySHA256,createHash('sha256').update(remoteConnectionFailureBody).digest('hex'));assert.equal(actual.row.transientNavigationRecovery.additionalRequestsMaximum,1);assert.equal(actual.row.transientNavigationRecovery.originalActivationBudgetMs,30000);assert.equal(actual.row.transientNavigationRecovery.noTimeoutExtension,true);assert.equal(actual.row.status,'external access not yet qualified');
});
test('the exact remote reset still stays unqualified and limited to one reload when it persists',async()=>{
 const actual=sourceTab({body:remoteConnectionFailureBody,afterStatus:503,afterBody:remoteConnectionFailureBody});assert.equal(await actual.run(),remoteConnectionFailureBody);assert.equal(actual.calls.length,1);assert.equal(actual.row.transientNavigationRecovery.finalHTTP,503);assert.equal(actual.row.status,'external access not yet qualified');
});
test('recognising the reset message cannot retry forbidden or partial responses, expired budgets, PDF originals or another document',async()=>{
 for(const options of [{status:403},{status:404},{status:200},{status:206},{elapsed:30000},{elapsed:30001},{sourceURL:'https://source.example/complete.PDF'},{responseURL:'https://unrelated.example/article'},{body:'remote connection failure without the observed proxy envelope'},{body:'upstream connect error or disconnect/reset before headers. reset reason: maintenance'}]){
  const actual=sourceTab({body:remoteConnectionFailureBody,...options});await actual.run();assert.deepEqual(actual.calls,[],JSON.stringify(options));assert.equal(actual.row.transientNavigationRecovery,undefined);assert.equal(actual.row.status,'external access not yet qualified');
 }
});


test('only the observed complete visible LOC article material can precede DOMContentLoaded within the unchanged activation budget',()=>{
 const source='https://blogs.loc.gov/inside_adams/2019/12/henriettaleavitt/';
 const body=["Henrietta Leavitt, How She Loved the 'Clouds'",'Magellanic Clouds','period-luminosity relationship','Periods of 25 Variable Stars','1912',...Array(30).fill('Eigener synthetischer Testtext, kein kopierter Fachartikel und kein tatsächlicher Browsernachweis.')].join('\n');
 const actual={sourceURL:source,actualURL:source,responseURL:source,httpStatus:200,readyState:'loading',elapsedMs:25000,title:"Henrietta Leavitt, How She Loved the 'Clouds' | Inside Adams",body};
 assert.equal(observedLeavittMaterialReady(actual),true);
 for(const value of[null,undefined,{},...[-1,30000,Infinity,NaN].map(elapsedMs=>({...actual,elapsedMs})),...[206,304,403,429,503].map(httpStatus=>({...actual,httpStatus})),...['sourceURL','actualURL','responseURL'].map(key=>({...actual,[key]:'https://unrelated.example/'})),{...actual,readyState:'complete'},{...actual,title:'Just a moment'},{...actual,body:'Access denied'},{...actual,body:'Access denied '.repeat(150)},...['Magellanic Clouds','period-luminosity relationship','Periods of 25 Variable Stars','1912'].map(part=>({...actual,body:body.split(part).join('omitted')}))])assert.equal(observedLeavittMaterialReady(value),false);
});


test('the exact observed proxy connection termination gets one bounded ordinary reload and cannot certify a destination',async()=>{
 const body='upstream connect error or disconnect/reset before headers. reset reason: connection termination';
 const current=sourceTab({body,elapsed:9000});await current.run();assert.deepEqual(current.calls,[{waitUntil:'domcontentloaded',timeout:19000}]);assert.deepEqual(current.row.mainResponses.map(r=>r.status),[503,200]);assert.equal(current.row.transientNavigationRecovery.initialBodySHA256,createHash('sha256').update(body).digest('hex'));assert.equal(current.row.status,'external access not yet qualified');
 const persistent=sourceTab({body,afterStatus:503,afterBody:body});assert.equal(await persistent.run(),body);assert.equal(persistent.calls.length,1);assert.equal(persistent.row.status,'external access not yet qualified');
 for(const options of [{status:403},{status:200},{status:206},{elapsed:30000},{elapsed:30001},{sourceURL:'https://source.example/original.PDF'},{responseURL:'https://unrelated.example/article'},{body:'connection termination'},{body:'upstream connect error or disconnect/reset before headers. reset reason: maintenance'}]){
  const bad=sourceTab({body,...options});await bad.run();assert.deepEqual(bad.calls,[]);assert.equal(bad.row.transientNavigationRecovery,undefined);
 }
});

test('only the observed complete BnF Curie article may be read before its delayed load event within the unchanged30s',()=>{
 const source='https://heritage.bnf.fr/france-pologne/maria-sklodowska-curie-1867-1934';
 const anchors=['Maria Skłodowska-Curie (1867-1934)','Janine Trotereau, journaliste','Un parcours scientifique','1903','1911','La Pologne au cœur','Publié en août 2017'];
 const body=[...anchors,...Array(65).fill('Eigener synthetischer Gegenfalltext; weder fremder Fachartikel noch tatsächlicher Browsernachweis.')].join('\n');
 const actual={sourceURL:source,actualURL:source,responseURL:source,httpStatus:200,readyState:'loading',elapsedMs:20000,title:'Maria Skłodowska-Curie (1867-1934) | Patrimoines Partagés - France Pologne',body};assert.equal(observedCurieBnFMaterialReady(actual),true);
 for(const value of [null,undefined,{},...[-1,30000,Infinity,NaN].map(elapsedMs=>({...actual,elapsedMs})),...[206,304,403,429,503].map(httpStatus=>({...actual,httpStatus})),...['sourceURL','actualURL','responseURL'].map(key=>({...actual,[key]:'https://unrelated.example/'})),{...actual,readyState:'complete'},{...actual,title:'Just a moment'},{...actual,body:'Access denied '.repeat(600)},...anchors.map(part=>({...actual,body:body.split(part).join('omitted')}))])assert.equal(observedCurieBnFMaterialReady(value),false);
 assert.equal(observedLeavittMaterialReady(actual),false,'BnF is not relabelled as prior LOC observation');
});


// The real WHO complete-HTML/loading observations are retained privately. These
// synthetic countercases check the exact same complete-article/budget contract.
const whoReadinessCases=[
 {url:'https://www.who.int/news-room/questions-and-answers/item/traditional-medicine',title:'Traditional medicine',padding:9100,anchors:['28 November 2025 | Questions and answers','What is traditional medicine?','position on traditional medicine?','latest scientific evidence','avoid patient harm','establishing efficacy and safety through rigorous scientific validation','Are TCIM products and practices subjected to same scrutiny as modern pharmaceuticals?','pharmacovigilance systems']},
 {url:'https://www.who.int/news/item/10-10-2019-the-use-of-non-pharmaceutical-forms-of-artemisia',title:'The use of non-pharmaceutical forms of Artemisia',padding:1900,anchors:['10 October 2019','artemisinin-based combination therapies (ACTs)','pure artemisinin compound','WHO position','WHO does not support the promotion or use of','plant material in any form for the prevention or treatment of malaria','hasten the development and spread of artemisinin resistance','Artemisinin in any form does not work well as prevention against malaria.']}
];
for(const sample of whoReadinessCases)test('only the exact complete WHO article '+sample.title+' can precede a delayed DOM event inside the original30seconds',()=>{
 const good={sourceURL:sample.url,actualURL:sample.url,responseURL:sample.url,httpStatus:200,contentType:'text/html; charset=utf-8',mainBodyComplete:true,readyState:'loading',elapsedMs:900,title:sample.title,body:sample.anchors.join(' ')+' '.repeat(sample.padding)};
 assert.equal(observedWHOMaterialReady(good),true);
 for(const bad of [null,undefined,{},...['sourceURL','actualURL','responseURL'].map(key=>({...good,[key]:'https://example.org/unrelated'})),...[206,304,403,429,503].map(httpStatus=>({...good,httpStatus})),...[false,undefined].map(mainBodyComplete=>({...good,mainBodyComplete})),...['application/pdf','application/json',undefined].map(contentType=>({...good,contentType})),...['interactive','complete'].map(readyState=>({...good,readyState})),...[-1,30000,Infinity,NaN].map(elapsedMs=>({...good,elapsedMs})),{...good,title:'Just a moment...'},{...good,body:'Access denied '.repeat(1000)},...sample.anchors.map(part=>({...good,body:good.body.replace(part,'absent')}))])assert.equal(observedWHOMaterialReady(bad),false);
 assert.equal(observedHattushaUNESCOMaterialReady(good),false,'WHO is never relabelled as UNESCO');
});

// Actual complete-HTML/loading observations are private original evidence.
// These synthetic countercases retain HTTP, complete body, visible facts and30s.
const gutenbergUNESCOCases=[
  {
    "url": "https://www.unesco.org/en/memory-world/baegun-hwasang-chorok-buljo-jikji-simche-yojeol-volii-second-volume-anthology-great-buddhist-priests?hub=915",
    "title": "Baegun hwasang chorok buljo jikji simche yojeol (vol.II), the second volume of \"Anthology of Great Buddhist Priests' Zen Teachings\" - Memory of the World",
    "padding": 1500,
    "anchors": [
      "Also known as Jikji",
      "essentials of Zen Buddhism",
      "Heungdeok-sa temple in Cheongju city",
      "using movable metal types in July 1377",
      "some earlier metal type printings were mentioned",
      "world's oldest movable metal type printing evidence available",
      "Submitted by: Republic of Korea"
    ],
    "submissionYear": "2000"
  },
  {
    "url": "https://www.unesco.org/en/memory-world/42-line-gutenberg-bible-printed-vellum-and-its-contemporary-documentary-background",
    "title": "42-line Gutenberg Bible, printed on vellum, and its contemporary documentary background - Memory of the World",
    "padding": 1900,
    "anchors": [
      "first book printed in Europe with movable types",
      "From Mainz",
      "unique contemporary documentary context",
      "Goettingen Model Book",
      "Notarial Instrument of Ulrich Helmasperger",
      "Goettingen vellum copy of the Gutenberg Bible",
      "Submitted by: Germany"
    ],
    "submissionYear": "2001"
  }
];
for(const sample of gutenbergUNESCOCases)test('only the exact complete UNESCO document '+sample.title+' may precede its DOM event inside the unchanged30seconds',()=>{
 const good={sourceURL:sample.url,actualURL:sample.url,responseURL:sample.url,httpStatus:200,contentType:'text/html; charset=utf-8',mainBodyComplete:true,readyState:'loading',elapsedMs:900,title:sample.title,body:sample.anchors.join(' ')+' Registration Year: 2001 Submission Year: '+sample.submissionYear+' '.repeat(sample.padding)};
 assert.equal(observedGutenbergUNESCOMaterialReady(good),true);
 for(const bad of [null,undefined,{},...['sourceURL','actualURL','responseURL'].map(key=>({...good,[key]:'https://example.org/unrelated'})),...['__proto__','toString'].map(sourceURL=>({...good,sourceURL})),...[206,304,403,429,503].map(httpStatus=>({...good,httpStatus})),...[false,undefined].map(mainBodyComplete=>({...good,mainBodyComplete})),...['application/pdf','application/json',undefined].map(contentType=>({...good,contentType})),...['interactive','complete'].map(readyState=>({...good,readyState})),...[-1,30000,Infinity,NaN].map(elapsedMs=>({...good,elapsedMs})),{...good,title:'Just a moment...'},{...good,body:'Access denied '.repeat(1000)},...sample.anchors.map(part=>({...good,body:good.body.replace(part,'absent')})),{...good,body:good.body.replace('Registration Year: 2001','Registration Year: 2002')},{...good,body:good.body.replace('Submission Year: '+sample.submissionYear,'Submission Year: 1999')}])assert.equal(observedGutenbergUNESCOMaterialReady(bad),false);
 assert.equal(observedHattushaUNESCOMaterialReady(good),false,'Gutenberg/Jikji never relabelled as Hattusha');assert.equal(observedWHOMaterialReady(good),false);
});
