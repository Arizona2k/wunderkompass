import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {UPDATE_HISTORY,PREPARED_UPDATES,HISTORY_EVIDENCE,TEST_HISTORY_EVIDENCE,confirmedTestDeployment,testUpdate,publicUpdates,updateDate,updateLabel,berlinDay,formatHistoryInstant} from '../app/update-history.ts';

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
  for(const link of entry.links)assert.ok(['globe','world','labs','games','journeys','book','world/topic/science-moon-phases'].includes(link.hash));
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
 assert.deepEqual(testEntries.map(e=>e.evidence.pullRequest),[22,21,20,19,18,17,16,15,14,12,11,10,9,3]);
 assert.equal(entries.length,27);assert.equal(entries.filter(e=>e.channel==='sites').length,13);
 assert.ok(testEntries.every(e=>e.status==='test-available'&&e.publishedOn===null&&e.availableOn));
 assert.ok(!PREPARED_UPDATES.some(e=>e.id==='foundation-2a'));
 assert.ok(UPDATE_HISTORY.some(e=>e.evidence.pullRequest===22));
 assert.equal(updateLabel(testEntries[0]),'Testwebsite · verfügbar');assert.equal(updateLabel(entries.find(e=>e.id==='site-v14')),'Sites · Version 14');
 for(const entry of testEntries){
  const record=TEST_HISTORY_EVIDENCE.pullRequests.find(p=>p.number===entry.evidence.pullRequest),deployment=confirmedTestDeployment(record);
  assert.ok(deployment);assert.equal(entry.evidence.revision,record.mergeCommit);assert.equal(entry.availableOn,berlinDay(deployment.createdAt));assert.equal(entry.occurredAt,deployment.createdAt);
  assert.ok(Date.parse(deployment.createdAt)>=Date.parse(record.mergedAt));assert.ok(TEST_HISTORY_EVIDENCE.testLive.includedMergeCommits.includes(record.mergeCommit));
 }
 // Confirmation date differs from observation date and from the merge instant.
 assert.equal(updateDate(testEntries[0]),'11. Oktober 2026 um 20:19:13 MESZ');assert.equal(testEntries[0].confirmedOn,'2026-10-11');
 assert.equal(testEntries[0].occurredAt,'2026-10-11T18:19:13Z');
 assert.equal(testEntries[0].id,'foundation-2a','receipt promotes the existing PR 22 entry, without replacing its ID');
 assert.equal(testEntries[5].occurredAt,'2026-10-10T11:40:50Z','old availability remains unchanged');
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

test('actual PR 23 keeps complete editorial copy separate until verified merge and deployment',()=>{const prepared=PREPARED_UPDATES.find(e=>e.id==='research-2b');assert.ok(prepared);assert.equal(prepared.evidence.pullRequest,23);assert.equal(prepared.status,'prepared');assert.equal(prepared.occurredAt,null);assert.equal(prepared.availableOn,null);assert.deepEqual(prepared.links,[]);assert.equal(publicUpdates().some(e=>e.id===prepared.id),false);assert.equal(prepared.details.length,5);});
