import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import {beforeAccessiblePeopleSourceDossiers,beforeMetRecordSourceUIDossiers,accessiblePeopleSourceCorrection as correction} from './people-accessible-sources-reference.mjs';
import {beforeFourteenDossiers} from './people-fourteen-dossier-reference.mjs';
import {beforeRetainedPeopleDossiers,beforeRetainedPeople} from './retained-people-reference.mjs';

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
import {recoverKnownHTMLConnectionTimeout,observedLeavittMaterialReady,observedCurieBnFMaterialReady} from './browser/people-source-activation.mjs';

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
 return {row,calls,run:()=>recoverKnownHTMLConnectionTimeout({popup,row,sourceURL,activationStarted:1000,now:()=>1000+elapsed,recordedNavigationResponses:()=>row.mainResponses})};
}

test('one observed HTML connection timeout can reload within the original budget without qualifying the source',async()=>{
 const actual=sourceTab();const body=await actual.run();
 assert.equal(body,'A real destination body still requires the caller to qualify its HTTP response and content.');
 assert.deepEqual(actual.calls,[{waitUntil:'domcontentloaded',timeout:25000}]);
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
test('the observed exact HTML remote connection failure gets one ordinary reload within the unchanged30s budget',async()=>{
 const actual=sourceTab({body:remoteConnectionFailureBody,elapsed:7000});await actual.run();assert.deepEqual(actual.calls,[{waitUntil:'domcontentloaded',timeout:23000}]);assert.deepEqual(actual.row.mainResponses.map(r=>r.status),[503,200]);assert.equal(actual.row.transientNavigationRecovery.initialBody,remoteConnectionFailureBody);assert.equal(actual.row.transientNavigationRecovery.initialBodySHA256,createHash('sha256').update(remoteConnectionFailureBody).digest('hex'));assert.equal(actual.row.transientNavigationRecovery.additionalRequestsMaximum,1);assert.equal(actual.row.transientNavigationRecovery.originalActivationBudgetMs,30000);assert.equal(actual.row.transientNavigationRecovery.noTimeoutExtension,true);assert.equal(actual.row.status,'external access not yet qualified');
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
 const current=sourceTab({body,elapsed:9000});await current.run();assert.deepEqual(current.calls,[{waitUntil:'domcontentloaded',timeout:21000}]);assert.deepEqual(current.row.mainResponses.map(r=>r.status),[503,200]);assert.equal(current.row.transientNavigationRecovery.initialBodySHA256,createHash('sha256').update(body).digest('hex'));assert.equal(current.row.status,'external access not yet qualified');
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
