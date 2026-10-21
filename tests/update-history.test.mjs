import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {UPDATE_HISTORY,PREPARED_UPDATES,HISTORY_EVIDENCE,TEST_HISTORY_EVIDENCE,JOURNEY_SUPPORT_COPY,confirmedTestDeployment,testUpdate,publicUpdates,updateDate,updateLabel,berlinDay,formatHistoryInstant} from '../app/update-history.ts';

test('actual deployed PR38 lab feedback retains its historical time once and stays confirmed',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===38);
 const entries=publicUpdates(),entry=entries.find(e=>e.id==='lab-feedback-3-5');
 assert.ok(record);assert.ok(entry);assert.equal(entries[9].id,entry.id);assert.equal(entries[5].id,'optics-learning-3-5');
 assert.equal(entry.evidence.revision,'0e5e4d4ece35d4a80dc79764c690c1633b2e0988');
 assert.equal(entry.status,'test-available');assert.equal(entry.availableOn,'2026-10-18');
 assert.equal(entry.occurredAt,'2026-10-17T22:20:23Z');assert.equal(entry.publishedOn,null);
 assert.equal(entries.filter(e=>e.id===entry.id).length,1);
 assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));
 assert.ok(entry.links.some(l=>l.hash==='labs'));
 const missing=structuredClone(record);missing.deploymentStatuses=[];
 const pending=testUpdate(missing,entry);assert.equal(pending.status,'prepared');
 assert.equal(pending.availableOn,null);assert.deepEqual(pending.links,[]);
 assert.equal(publicUpdates([pending]).length,0);
 const unrelated={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(x=>x!==record.mergeCommit)};
 assert.equal(confirmedTestDeployment(record,unrelated),null);
});

test('public chronicle excludes unpublished work and preserves the complete confirmed publication history',()=>{
 const entries=publicUpdates([...PREPARED_UPDATES,...UPDATE_HISTORY]);
 assert.equal(entries.length,UPDATE_HISTORY.length);
 for(const number of [1,2,3,4,5,7,8,9,10,11,12,13,14])assert.ok(entries.some(e=>e.id==='site-v'+number),'retain published version '+number);
 assert.ok(!entries.some(e=>e.id==='site-v6'),'saved-only version must not appear as published');
 assert.equal(new Set([...UPDATE_HISTORY,...PREPARED_UPDATES].map(e=>e.id)).size,UPDATE_HISTORY.length+PREPARED_UPDATES.length);
 for(let i=1;i<entries.length;i++)assert.ok((entries[i-1].availableOn??entries[i-1].publishedOn??entries[i-1].confirmedOn)>=(entries[i].availableOn??entries[i].publishedOn??entries[i].confirmedOn),'newest confirmed event first');
 for(let i=1;i<entries.length;i++)assert.ok(Date.parse(entries[i-1].occurredAt)>=Date.parse(entries[i].occurredAt),'same-day updates retain their actual event order');
 assert.ok(PREPARED_UPDATES.every(e=>e.status==='prepared'&&e.publishedOn===null&&e.availableOn===null));
 const sample=UPDATE_HISTORY.find(e=>e.id==='site-v14');
 assert.equal(publicUpdates([{...sample,id:'future-draft',status:'prepared',publishedOn:'2027-01-01'}]).length,0,'a date must not accidentally publish a draft');
 assert.equal(publicUpdates([{...sample,id:'old-rechecked',publishedOn:'2026-10-06',confirmedOn:'2027-01-01'},sample])[0].id,sample.id,'a late observation must not reorder an old publication');
});

test('publication entries match successful deployments, source provenance and Berlin calendar dates',()=>{
 for(const entry of UPDATE_HISTORY){
  const evidence=fs.readFileSync(new URL('../'+entry.evidence.file,import.meta.url),'utf8');assert.ok(evidence.includes(entry.evidence.quote),entry.id+' recorded source');
  assert.match(entry.evidence.revision,/^[a-f0-9]{7,40}$/);
  if(entry.evidence.publicationVersion!==undefined){
   const source=HISTORY_EVIDENCE.versions.find(v=>v.number===entry.evidence.publicationVersion);assert.equal(source.publication.status,'succeeded');assert.equal(source.publication.type,'publish');assert.equal(source.sourceCommit,entry.evidence.revision);assert.equal(entry.publishedOn,berlinDay(source.publication.completedAt));
  }
  for(const link of entry.links)assert.ok(['globe','world','labs','games','journeys','book','world/topic/science-moon-phases','world/animals','updates'].includes(link.hash));
 }
 assert.equal(HISTORY_EVIDENCE.versions.find(v=>v.number===6).publication,null);
 assert.equal(berlinDay(HISTORY_EVIDENCE.site.createdAt),'2026-10-06','project began after Berlin midnight');
 assert.equal(berlinDay('2026-10-05T23:57:32.505039+00:00'),'2026-10-06','publication UTC day differs from German day');
 assert.match(updateDate(UPDATE_HISTORY.find(e=>e.id==='site-v1')),/^6\. Oktober 2026 um \d{2}:\d{2}:\d{2} MESZ$/);
 assert.equal(updateDate({...UPDATE_HISTORY[0],publishedOn:null,availableOn:null,occurredAt:null,confirmedOn:'2026-10-10'}),'10. Oktober 2026','unknown publication day remains an observation');
 const v12=HISTORY_EVIDENCE.versions.find(v=>v.number===12),v13=HISTORY_EVIDENCE.versions.find(v=>v.number===13);
 assert.equal(v12.sourceReview.topicCount,90);assert.equal(v13.sourceReview.topicCount,108);assert.equal(v13.sourceReview.addedTopicIds.length,18);
 assert.equal(HISTORY_EVIDENCE.versions.find(v=>v.number===7).archiveHash,HISTORY_EVIDENCE.versions.find(v=>v.number===8).archiveHash,'repeat publication added no learner features');
});

test('test website chronology retains the merged and deployed product rounds, with truthful channel dates',()=>{
 const entries=publicUpdates(),testEntries=entries.filter(e=>e.channel==='vercel-test');
 assert.deepEqual(testEntries.map(e=>e.evidence.pullRequest),[50,49,48,47,46,45,44,43,39,38,36,35,33,32,30,29,26,25,23,22,21,20,19,18,17,16,15,14,12,11,10,9,3]);
 assert.equal(entries.length,46);assert.equal(entries.filter(e=>e.channel==='sites').length,13);
 assert.ok(testEntries.every(e=>e.status==='test-available'&&e.publishedOn===null&&e.availableOn));
 assert.ok(!PREPARED_UPDATES.some(e=>e.id==='foundation-2a'));
 assert.ok(UPDATE_HISTORY.some(e=>e.evidence.pullRequest===22));
 assert.equal(updateLabel(testEntries[0]),'Testversion · verfügbar');assert.equal(updateLabel(entries.find(e=>e.id==='site-v14')),'Frühere Website · Version 14');
 for(const entry of testEntries){
  const record=TEST_HISTORY_EVIDENCE.pullRequests.find(p=>p.number===entry.evidence.pullRequest),deployment=confirmedTestDeployment(record);
  assert.ok(deployment);assert.equal(entry.evidence.revision,record.mergeCommit);assert.equal(entry.availableOn,berlinDay(deployment.createdAt));assert.equal(entry.occurredAt,deployment.createdAt);
  assert.ok(Date.parse(deployment.createdAt)>=Date.parse(record.mergedAt));assert.ok(TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.includes(record.mergeCommit));
 }
 // Confirmation date differs from observation date and from the merge instant.
 assert.equal(updateDate(testEntries.find(e=>e.evidence.pullRequest===35)),'17. Oktober 2026 um 17:59:46 MESZ');assert.equal(updateDate(testEntries.find(e=>e.evidence.pullRequest===39)),'20. Oktober 2026 um 11:39:23 MESZ');assert.equal(testEntries.find(e=>e.evidence.pullRequest===39).confirmedOn,TEST_HISTORY_EVIDENCE.checkedOn);
 const foundation=testEntries.find(e=>e.evidence.pullRequest===26);assert.equal(updateDate(foundation),'13. Oktober 2026 um 10:55:40 MESZ');
 assert.equal(testEntries.find(e=>e.evidence.pullRequest===35).occurredAt,'2026-10-17T15:59:46Z');assert.equal(testEntries.find(e=>e.evidence.pullRequest===39).occurredAt,'2026-10-20T09:39:23Z');
 assert.equal(testEntries.find(e=>e.evidence.pullRequest===39).id,'animal-new-species-3-5','latest actual PR39 receipt promotes the same prepared animal identity');assert.equal(testEntries.find(e=>e.evidence.pullRequest===38).id,'lab-feedback-3-5','historical laboratory identity retained');assert.equal(testEntries.find(e=>e.evidence.pullRequest===35).id,'journey-readable-sources-3-5','PR35 stable identity retained');assert.equal(testEntries.find(e=>e.evidence.pullRequest===32).id,'journey-reading-support-3-5','PR32 identity retained');assert.equal(testEntries.find(e=>e.evidence.pullRequest===30).id,'offline-learning-3-5');assert.equal(testEntries.find(e=>e.evidence.pullRequest===29).id,'clear-update-chronicle');assert.equal(testEntries.find(e=>e.evidence.pullRequest===29).occurredAt,'2026-10-16T19:33:21Z');assert.equal(foundation.id,'excellence-foundation-3-5');
 assert.equal(testEntries.find(e=>e.evidence.pullRequest===17).occurredAt,'2026-10-10T11:40:50Z','old availability remains unchanged');
 assert.ok(!testEntries.some(e=>[4,13].includes(e.evidence.pullRequest)),'internal workflow-only PRs excluded');
});

test('an update requires the latest trusted Vercel success on a merge included in test-live',()=>{
 const source=TEST_HISTORY_EVIDENCE.pullRequests.find(p=>p.number===17),copy=UPDATE_HISTORY.find(e=>e.id==='history-polish');
 const clone=()=>structuredClone(source);
 for(const mutate of [
  r=>{r.mergedAt=null;},r=>{r.mergeCommit=null;},r=>{r.base='main';},
  r=>{r.deploymentStatuses=[];},r=>{r.statusesUrl=r.statusesUrl.replace(source.mergeCommit,'0'.repeat(40));},
  r=>{r.deploymentStatuses[0].state='failure';},r=>{r.deploymentStatuses[0].state='pending';},
  r=>{r.deploymentStatuses[0].creator='untrusted-user';},r=>{r.deploymentStatuses[0].targetUrl='https://vercel.com/another-team/another-site/Unrelated';},
  r=>{r.deploymentStatuses[0].createdAt='2026-10-09T00:00:00Z';},r=>{r.deploymentStatuses[0].createdAt='invalid';},
  r=>{r.deploymentStatuses.push({...r.deploymentStatuses[0],id:56048030717,state:'failure',createdAt:'2026-10-10T11:41:00Z'});}
 ]){const record=clone();mutate(record);assert.equal(confirmedTestDeployment(record),null);assert.equal(testUpdate(record,copy).status,'prepared');}
 assert.equal(confirmedTestDeployment(source,{...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:[]}),null,'success on an unrelated preview is insufficient');
});

test('a prepared package advances only after a separately confirmed merge and deployment, retaining its stable entry ID',()=>{
 const record=structuredClone(TEST_HISTORY_EVIDENCE.pullRequests.find(p=>p.number===19)),copy=UPDATE_HISTORY.find(e=>e.id==='history-polish');
 record.mergedAt=null;record.mergeCommit=null;record.deploymentStatuses=[];
 assert.equal(testUpdate(record,copy).status,'prepared');
 // Synthetic future proof exercises promotion; it is never stored as real evidence.
 const commit='a'.repeat(40);record.mergeCommit=commit;record.mergedAt='2026-10-11T12:00:00Z';record.statusesUrl=`https://api.github.com/repos/Arizona2k/wunderkompass/commits/${commit}/statuses`;
 const baseline={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:[...TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits,commit]};
 assert.equal(testUpdate(record,copy,baseline).status,'prepared','merge alone must not advance the prepared package');
 record.deploymentStatuses=[{id:1,context:'Vercel',state:'success',creator:'vercel[bot]',description:'Deployment has completed',createdAt:'2026-10-11T12:01:00Z',updatedAt:'2026-10-11T12:01:00Z',targetUrl:'https://vercel.com/interaktive-wissens-und-lernplattform/wunderkompass/SyntheticTestFixture'}];
 const available=testUpdate(record,copy,baseline);assert.equal(available.status,'test-available');assert.equal(available.id,copy.id);assert.equal(available.publishedOn,null);assert.equal(available.availableOn,'2026-10-11');assert.ok(!available.details.some(t=>t.includes('noch geprüft')));
});

test('reader-facing entries provide concrete optional changes and a family benefit without padding repeat deployments',()=>{
 for(const entry of [...UPDATE_HISTORY,...PREPARED_UPDATES]){
  assert.ok(entry.title.trim()&&entry.summary.trim()&&entry.benefit.trim(),entry.id+' complete editorial fields');
  assert.ok(entry.details.length>=1&&entry.details.length<=5,entry.id+' bounded optional details');
  assert.equal(new Set(entry.details).size,entry.details.length,entry.id+' no duplicated filler');
  assert.ok(entry.details.every(detail=>detail.trim().length>0),entry.id+' readable changes');
 }
 assert.equal(UPDATE_HISTORY.find(e=>e.id==='site-v8').details.length,1,'identical source archives cannot justify three new features');
 assert.equal(UPDATE_HISTORY.find(e=>e.id==='test-website').details.length,1,'first proven test deployment is not a new learning package');
 assert.equal(UPDATE_HISTORY.find(e=>e.id==='site-v9').details.length,2,'photo update stays within the proven scope');
 assert.ok(UPDATE_HISTORY.filter(e=>!['site-v8','site-v9','test-website'].includes(e.id)).every(e=>e.details.length>=3));
});

test('unconfirmed product work stays unavailable even if an observation date is mistaken for publication',()=>{
 const record=structuredClone(TEST_HISTORY_EVIDENCE.pullRequests.find(p=>p.number===20));record.mergedAt=null;record.mergeCommit=null;record.deploymentStatuses=[];
 const prepared=testUpdate(record,UPDATE_HISTORY.find(e=>e.id==='clear-main-navigation'));
 assert.equal(prepared.status,'prepared');assert.deepEqual(prepared.links,[]);
 assert.equal(publicUpdates([prepared]).length,0);
 assert.equal(publicUpdates([{...prepared,publishedOn:prepared.confirmedOn,availableOn:prepared.confirmedOn}]).length,0);
 for(const pending of PREPARED_UPDATES){assert.equal(UPDATE_HISTORY.some(e=>e.id===pending.id),false);assert.deepEqual(pending.links,[]);}
});

 test('known timestamps use actual Berlin DST; missing times remain date-only',()=>{assert.equal(formatHistoryInstant('2026-10-25T00:30:00Z'),'25. Oktober 2026 um 02:30:00 MESZ');assert.equal(formatHistoryInstant('2026-10-25T01:30:00Z'),'25. Oktober 2026 um 02:30:00 MEZ');assert.equal(updateDate({...UPDATE_HISTORY[0],occurredAt:null,publishedOn:'2026-10-11',availableOn:null}),'11. Oktober 2026');});

test('actual PR 23 appears only with its exact merged and deployed receipt; earlier missing proof stays prepared',()=>{
 const entry=UPDATE_HISTORY.find(e=>e.id==='research-2b');assert.ok(entry);assert.equal(entry.evidence.pullRequest,23);assert.equal(entry.status,'test-available');assert.equal(entry.occurredAt,'2026-10-12T08:15:03Z');assert.equal(entry.evidence.revision,'9f2328ab73c9a142bd023668046310f1661958e9');assert.equal(entry.details.length,5);assert.ok(entry.links.some(l=>l.hash==='labs'));assert.ok(entry.links.every(l=>!l.hash.startsWith('news')),'retired news links must not be offered in historical rows');
 const record=structuredClone(TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===23));record.mergedAt=null;record.mergeCommit=null;record.deploymentStatuses=[];const prepared=testUpdate(record,entry);assert.equal(prepared.status,'prepared');assert.deepEqual(prepared.links,[]);assert.equal(publicUpdates([prepared]).length,0);
});

test('PR25 and PR26 require their exact real deployment receipts',()=>{const entry=UPDATE_HISTORY.find(e=>e.id==='journeys-3');assert.equal(entry.evidence.pullRequest,25);assert.equal(entry.evidence.revision,'d0dc9a35857e896d45d35c7474640a58087b0ec5');assert.equal(entry.occurredAt,'2026-10-12T23:52:52Z');const record=structuredClone(TEST_HISTORY_EVIDENCE.pullRequests.find(p=>p.number===25));record.deploymentStatuses=[];assert.equal(testUpdate(record,entry).status,'prepared');const available=UPDATE_HISTORY.find(e=>e.id==='excellence-foundation-3-5');assert.equal(available.occurredAt,'2026-10-13T08:55:40Z');const missing=structuredClone(TEST_HISTORY_EVIDENCE.pullRequests.find(p=>p.number===26));missing.deploymentStatuses=[];const pending=testUpdate(missing,available);assert.equal(pending.status,'prepared');assert.equal(pending.occurredAt,null);assert.deepEqual(pending.links,[]);assert.equal(publicUpdates([pending]).length,0);assert.equal(publicUpdates().some(e=>e.id===available.id),true);});




test('every old and new update has a concise reader category, with technical handoff details kept outside its main copy',()=>{
 const categories=['Neue Inhalte','Spielen und Lernen','Einfachere Bedienung','Fehler behoben','Anschaulicher erklärt','Bereitstellung'];
 for(const entry of [...UPDATE_HISTORY,...PREPARED_UPDATES]){
  assert.ok(categories.includes(entry.category),entry.id+' explicit editorial category');
  assert.doesNotMatch([entry.category,entry.title,entry.summary,...entry.details,...entry.links.map(l=>l.label)].join(' '),/Nachrichten|Kindernachrichten/,entry.id+' removed feature is not advertised in the chronicle');
  assert.ok(entry.summary.length<=400,entry.id+' short readable summary');
  for(const text of [entry.title,entry.summary,...entry.details])assert.doesNotMatch(text,/\b(?:Commit|SHA|CI|Schema.?3|PR #|test-live|Unit|axe|Runner|Paket [234])\b|[a-f0-9]{40}/,entry.id+' visitor copy does not expose developer handoff terms');
 }
 assert.equal(publicUpdates().find(e=>e.id==='clear-update-chronicle').status,'test-available');
 assert.equal(PREPARED_UPDATES.some(e=>e.id==='clear-update-chronicle'),false);
});

// Actual publication evidence must advance the reader UI, not just append unused metadata.
test('PR30 ancestry and actual PR33 receipt preserve historical availability without promoting missing evidence',()=>{
 const receipt=TEST_HISTORY_EVIDENCE.pullRequests.find(p=>p.number===30),entry=UPDATE_HISTORY.find(p=>p.id==='offline-learning-3-5');
 assert.ok(entry);assert.equal(entry.status,'test-available');assert.equal(entry.occurredAt,'2026-10-16T21:23:51Z');assert.ok(TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.includes(receipt.mergeCommit));
 assert.equal(confirmedTestDeployment(receipt,{...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(s=>s!==receipt.mergeCommit)}),null);
 const available=UPDATE_HISTORY.find(e=>e.id==='animal-evidence-solar-labels-3-5');assert.ok(available);assert.equal(available.occurredAt,'2026-10-17T09:48:59Z');assert.equal(available.evidence.revision,'8d05beb0bc9930cd18e6128477c090c9d97caf9a');const absent=structuredClone(TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===33));absent.deploymentStatuses=[];const pending=testUpdate(absent,available);assert.equal(pending.evidence.pullRequest,33);assert.equal(pending.status,'prepared');assert.equal(pending.occurredAt,null);assert.equal(pending.availableOn,null);assert.deepEqual(pending.links,[]);assert.deepEqual(publicUpdates([pending]),[]);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));
});

test('actual PR30 receipt promotes the existing offline identity only with current merge ancestry and successful Vercel evidence',()=>{const receipt=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===30),entry=UPDATE_HISTORY.find(e=>e.id==='offline-learning-3-5');assert.equal(entry.occurredAt,'2026-10-16T21:23:51Z');assert.equal(entry.status,'test-available');assert.equal(entry.evidence.revision,'71255ec55833fa1c4056a5c95310fa4fb78b8a30');const unrelated={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(x=>x!==receipt.mergeCommit)};assert.equal(confirmedTestDeployment(receipt,unrelated),null);const missing=structuredClone(receipt);missing.deploymentStatuses=[];assert.equal(confirmedTestDeployment(missing),null);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));assert.ok(!publicUpdates().some(e=>e.evidence.pullRequest===27));assert.equal(publicUpdates().filter(e=>e.id===entry.id).length,1);});

test('unconfirmed journey reading support still has no availability date or function link',()=>{
 const record=structuredClone(TEST_HISTORY_EVIDENCE.pullRequests.find(e=>e.number===32));record.mergedAt=null;record.mergeCommit=null;record.deploymentStatuses=[];
 const pending=testUpdate(record,JOURNEY_SUPPORT_COPY);assert.equal(pending.status,'prepared');assert.equal(pending.evidence.pullRequest,32);assert.equal(pending.occurredAt,null);assert.equal(pending.publishedOn,null);assert.equal(pending.availableOn,null);assert.deepEqual(pending.links,[]);assert.equal(publicUpdates([pending]).length,0);
});

test('actual PR32 receipt promotes its stable identity once and keeps the open Master unpublished',()=>{
 const receipt=TEST_HISTORY_EVIDENCE.pullRequests.find(e=>e.number===32),entry=UPDATE_HISTORY.find(e=>e.id===JOURNEY_SUPPORT_COPY.id);
 assert.equal(receipt.mergedAt,'2026-10-16T23:51:12Z');assert.equal(entry.evidence.revision,'0c0ebcb55fc9e81bbe55ae9aa100100df098c0a5');assert.equal(entry.occurredAt,'2026-10-16T23:51:27Z');assert.equal(entry.availableOn,'2026-10-17');assert.equal(entry.publishedOn,null);assert.equal(entry.status,'test-available');assert.equal(publicUpdates().filter(e=>e.id===entry.id).length,1);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));assert.ok(!publicUpdates().some(e=>e.evidence.pullRequest===27));
 const unrelated={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(c=>c!==receipt.mergeCommit)};assert.equal(confirmedTestDeployment(receipt,unrelated),null);
 const missing=structuredClone(receipt);missing.deploymentStatuses=[];assert.equal(confirmedTestDeployment(missing),null);
});

test('the explicitly removed former News release24 has no active chronicle entry or runtime receipt',()=>{assert.equal(UPDATE_HISTORY.some(e=>e.evidence.pullRequest===24),false);assert.equal(PREPARED_UPDATES.some(e=>e.evidence.pullRequest===24),false);assert.equal(TEST_HISTORY_EVIDENCE.pullRequests.some(e=>e.number===24),false);});

test('runtime chronology evidence contains no removed-feature title while retained learning release25 remains visible',()=>{assert.doesNotMatch(JSON.stringify(TEST_HISTORY_EVIDENCE),/nachrichten|news-engineering/i);assert.equal(UPDATE_HISTORY.find(e=>e.evidence.pullRequest===25).id,'journeys-3');assert.equal(UPDATE_HISTORY.find(e=>e.evidence.pullRequest===23).id,'research-2b');});


test('actual PR39 promotes the existing animal identity once with its exact merge and Vercel timestamp',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===39),entry=publicUpdates()[8];
 assert.ok(record);assert.equal(record.mergedAt,'2026-10-20T09:39:04Z');
 assert.equal(record.mergeCommit,'6ed2ecfde4680789123905de476bc59b45824857');
 assert.equal(entry.id,'animal-new-species-3-5');assert.equal(entry.evidence.pullRequest,39);
 assert.equal(entry.evidence.revision,record.mergeCommit);assert.equal(entry.status,'test-available');
 assert.equal(entry.occurredAt,'2026-10-20T09:39:23Z');assert.equal(entry.availableOn,'2026-10-20');assert.equal(entry.publishedOn,null);
 assert.equal(publicUpdates().filter(e=>e.id===entry.id).length,1);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));
 assert.deepEqual(entry.links,[{label:'Tierwelt',hash:'world/animals'}]);
 const missing=structuredClone(record);missing.deploymentStatuses=[];const pending=testUpdate(missing,entry);
 assert.equal(pending.status,'prepared');assert.equal(pending.availableOn,null);assert.equal(pending.occurredAt,null);assert.deepEqual(pending.links,[]);assert.deepEqual(publicUpdates([pending]),[]);
 const unrelated={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(c=>c!==record.mergeCommit)};
 assert.equal(confirmedTestDeployment(record,unrelated),null);
 for(const mutate of [r=>{r.deploymentStatuses[0].state='pending';},r=>{r.deploymentStatuses[0].state='failure';},r=>{r.deploymentStatuses[0].creator='untrusted-user';}]){
  const wrong=structuredClone(record);mutate(wrong);assert.equal(confirmedTestDeployment(wrong),null);
 }
});

 test('PR36 search improvement appears once only with its real Vercel receipt',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===36),entry=publicUpdates().find(e=>e.id==='prepared-search-3-5');
 assert.ok(record);assert.ok(entry);assert.equal(record.mergeCommit,'68cb0bd9e2d5de329c64e6f8c18da0b3e6f8bc90');
 assert.equal(entry.evidence.pullRequest,36);assert.equal(entry.occurredAt,'2026-10-17T19:58:35Z');assert.equal(entry.status,'test-available');
 assert.equal(publicUpdates().filter(e=>e.id===entry.id).length,1);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));
 const missing=structuredClone(record);missing.deploymentStatuses=[];assert.equal(testUpdate(missing,entry).status,'prepared');
 const unrelated={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(x=>x!==record.mergeCommit)};assert.equal(confirmedTestDeployment(record,unrelated),null);
 });


test('actual PR43 diagram release appears once only with its exact merge and trusted deployment',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===43),entries=publicUpdates(),entry=entries.find(e=>e.id==='journey-diagram-clarity-3-5');assert.ok(record);assert.ok(entry);assert.equal(entries[7].id,entry.id);assert.equal(entries.filter(e=>e.id===entry.id).length,1);assert.equal(entry.evidence.revision,'762a18332e9e05b3e87d554e2219d257ea2ee33c');assert.equal(entry.occurredAt,'2026-10-20T15:32:32Z');assert.equal(entry.availableOn,'2026-10-20');assert.equal(entry.status,'test-available');assert.equal(entry.publishedOn,null);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));assert.ok(entry.links.some(l=>l.hash==='journeys'));
 const missing=structuredClone(record);missing.deploymentStatuses=[];assert.equal(testUpdate(missing,entry).status,'prepared');const pending=structuredClone(record);pending.deploymentStatuses=pending.deploymentStatuses.filter(s=>s.state==='pending');assert.equal(confirmedTestDeployment(pending),null);const excluded={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(s=>s!==record.mergeCommit)};assert.equal(confirmedTestDeployment(record,excluded),null);
});

test('actual PR44 source discovery retains exact merge and Vercel evidence after optical delivery',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===44),entries=publicUpdates(),entry=entries[6];
 assert.equal(entry.id,'historical-source-discovery-3-5');assert.equal(entry.evidence.pullRequest,44);assert.equal(entry.evidence.revision,'64d45a3c0e73b5fba79e0746b91089f741aae457');assert.equal(entry.occurredAt,'2026-10-20T18:05:44Z');assert.equal(entry.status,'test-available');assert.equal(entry.publishedOn,null);assert.equal(entries.filter(e=>e.id===entry.id).length,1);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));
 const changed=structuredClone(record);changed.deploymentStatuses=changed.deploymentStatuses.filter(s=>s.state!=='success');assert.equal(confirmedTestDeployment(changed),null);assert.equal(testUpdate(changed,entry).status,'prepared');
});

test('actual PR45 optical delivery remains confirmed with exact merged ancestry and trusted Vercel success',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===45),entries=publicUpdates(),entry=entries[5];assert.ok(record);assert.equal(entries.length,46);assert.equal(entry.id,'optics-learning-3-5');assert.equal(entry.evidence.pullRequest,45);assert.equal(entry.availableOn,'2026-10-21');assert.equal(entry.confirmedOn,'2026-10-21');assert.equal(entry.evidence.revision,"9560760e114d9398f871c0f4033832df85df55df");assert.equal(entry.occurredAt,"2026-10-20T22:39:14Z");assert.equal(entry.status,'test-available');assert.equal(entry.publishedOn,null);assert.equal(entries.filter(e=>e.id===entry.id).length,1);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));assert.ok(entry.links.some(l=>l.hash==='world'));
 const missing=structuredClone(record);missing.deploymentStatuses=[];assert.equal(confirmedTestDeployment(missing),null);assert.equal(testUpdate(missing,entry).status,'prepared');const pending=structuredClone(record);pending.deploymentStatuses=pending.deploymentStatuses.filter(s=>s.state==='pending');assert.equal(confirmedTestDeployment(pending),null);const excluded={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(s=>s!==record.mergeCommit)};assert.equal(confirmedTestDeployment(record,excluded),null);
});


test('actual PR46 saved-round repair remains confirmed with its real merge and Vercel evidence',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===46),entries=publicUpdates(),entry=entries[4];
 assert.ok(record);assert.equal(entries.length,46);assert.equal(entry.id,'animal-saved-rounds-3-5');assert.equal(entry.evidence.pullRequest,46);
 assert.equal(record.mergeCommit,'3bd78b4b803a235791b045732abe423d2f8820eb');assert.equal(entry.evidence.revision,record.mergeCommit);
 assert.equal(entry.occurredAt,'2026-10-21T06:37:35Z');assert.equal(entry.availableOn,'2026-10-21');assert.equal(entry.status,'test-available');assert.equal(entry.publishedOn,null);
 assert.equal(entries.filter(e=>e.id===entry.id).length,1);assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));assert.ok(entry.links.some(l=>l.hash==='games'));
 assert.equal(updateDate(entry),'21. Oktober 2026 um 08:37:35 MESZ');
 const missing=structuredClone(record);missing.deploymentStatuses=[];const pending=testUpdate(missing,entry);assert.equal(pending.status,'prepared');assert.equal(pending.occurredAt,null);assert.equal(pending.availableOn,null);assert.deepEqual(pending.links,[]);
 const unrelated={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(c=>c!==record.mergeCommit)};assert.equal(confirmedTestDeployment(record,unrelated),null);
});


test('actual PR47 geography delivery is newest only with trusted success and exact target ancestry',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===47),entries=publicUpdates(),entry=entries[3];assert.ok(record);assert.equal(entries.length,46);assert.equal(entry.id,'geography-country-facts-3-5');assert.equal(entry.evidence.pullRequest,47);assert.equal(record.mergeCommit,'0b7bd3b7cf787e154e917343caa7f9be9ecff666');assert.equal(entry.evidence.revision,record.mergeCommit);assert.equal(entry.occurredAt,'2026-10-21T08:56:30Z');assert.equal(updateDate(entry),'21. Oktober 2026 um 10:56:30 MESZ');assert.equal(entry.status,'test-available');assert.equal(entry.publishedOn,null);assert.ok(entry.links.some(l=>l.hash==='globe'));assert.ok(entry.links.some(l=>l.hash==='book'));assert.equal(entries.filter(e=>e.id===entry.id).length,1);
 const missing=structuredClone(record);missing.deploymentStatuses=[];const pending=testUpdate(missing,entry);assert.equal(pending.status,'prepared');assert.equal(pending.occurredAt,null);assert.deepEqual(pending.links,[]);assert.equal(publicUpdates([pending]).length,0);
 const forged=structuredClone(record);forged.deploymentStatuses[0].creator='untrusted';assert.equal(confirmedTestDeployment(forged),null);const unrelated={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(c=>c!==record.mergeCommit)};assert.equal(confirmedTestDeployment(record,unrelated),null);
});


test('actual water-weather48 receipt retains every old update and rejects unconfirmed delivery',()=>{
 const entries=publicUpdates(),record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===48),entry=entries[2];
 assert.ok(record);assert.equal(entries.length,46);assert.equal(entry.id,'water-weather-chapter-depth-3-5');assert.equal(entry.evidence.pullRequest,48);assert.equal(record.mergeCommit,'bca35334954676078d3fa45b1563979507c4f2c4');assert.equal(entry.evidence.revision,record.mergeCommit);assert.equal(entry.occurredAt,'2026-10-21T10:35:41Z');assert.equal(updateDate(entry),'21. Oktober 2026 um 12:35:41 MESZ');assert.equal(entry.status,'test-available');assert.equal(entry.publishedOn,null);assert.equal(entries.filter(e=>e.id===entry.id).length,1);assert.ok(entry.links.some(l=>l.hash==='journeys'));assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));
 for(const mutate of [r=>{r.mergedAt=null;},r=>{r.deploymentStatuses=[];},r=>{r.deploymentStatuses[0].state='pending';},r=>{r.deploymentStatuses[0].creator='untrusted-user';}]){const changed=structuredClone(record);mutate(changed);assert.equal(confirmedTestDeployment(changed),null);const unavailable=testUpdate(changed,entry);assert.equal(unavailable.status,'prepared');assert.deepEqual(unavailable.links,[]);}
});


test('actual PR49 seasons-ocean delivery preserves all prior updates and rejects incomplete evidence',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===49),entries=publicUpdates(),entry=entries[1];assert.ok(record);assert.equal(entries.length,46);assert.equal(entry.id,'seasons-ocean-chapter-depth-3-5');assert.equal(entry.evidence.pullRequest,49);assert.equal(record.mergeCommit,'a67e52390c7ef6cfac3857bdd1cfa954e968cd3a');assert.equal(entry.evidence.revision,record.mergeCommit);assert.equal(entry.occurredAt,'2026-10-21T12:18:38Z');assert.equal(updateDate(entry),'21. Oktober 2026 um 14:18:38 MESZ');assert.equal(entry.status,'test-available');assert.equal(entry.publishedOn,null);assert.equal(entries.filter(e=>e.id===entry.id).length,1);assert.ok(entry.links.some(l=>l.hash==='journeys'));assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));
 for(const mutate of[r=>{r.mergedAt=null;},r=>{r.deploymentStatuses=[];},r=>{r.deploymentStatuses[0].state='pending';},r=>{r.deploymentStatuses[0].creator='untrusted-user';}]){const changed=structuredClone(record);mutate(changed);assert.equal(confirmedTestDeployment(changed),null);const unavailable=testUpdate(changed,entry);assert.equal(unavailable.status,'prepared');assert.deepEqual(unavailable.links,[]);}
});


test('actual PR50 nature-protect delivery is latest only with its complete trusted deployment evidence',()=>{
 const record=TEST_HISTORY_EVIDENCE.pullRequests.find(r=>r.number===50),entries=publicUpdates(),entry=entries[0];assert.ok(record);assert.equal(entries.length,46);assert.equal(entry.id,'nature-protect-chapter-depth-3-5');assert.equal(entry.evidence.pullRequest,50);assert.equal(record.mergeCommit,'73e1a265d02cc7c5b0e4b02d4f8ab68d34d69a3e');assert.equal(entry.evidence.revision,record.mergeCommit);assert.equal(entry.occurredAt,'2026-10-21T13:27:21Z');assert.equal(updateDate(entry),'21. Oktober 2026 um 15:27:21 MESZ');assert.equal(entry.status,'test-available');assert.equal(entry.publishedOn,null);assert.equal(entries.filter(e=>e.id===entry.id).length,1);assert.ok(entry.links.some(l=>l.hash==='journeys'));assert.ok(!PREPARED_UPDATES.some(e=>e.id===entry.id));
 for(const mutate of[r=>{r.mergedAt=null;},r=>{r.deploymentStatuses=[];},r=>{r.deploymentStatuses[0].state='pending';},r=>{r.deploymentStatuses[0].creator='untrusted-user';}]){const changed=structuredClone(record);mutate(changed);assert.equal(confirmedTestDeployment(changed),null);const unavailable=testUpdate(changed,entry);assert.equal(unavailable.status,'prepared');assert.deepEqual(unavailable.links,[]);}
 const unrelated={...TEST_HISTORY_EVIDENCE.testLive,includedMergeCommits:TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.filter(c=>c!==record.mergeCommit)};assert.equal(confirmedTestDeployment(record,unrelated),null);
});
