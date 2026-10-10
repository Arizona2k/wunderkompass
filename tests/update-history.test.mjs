import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {UPDATE_HISTORY,PREPARED_UPDATES,HISTORY_EVIDENCE,publicUpdates,updateDate,berlinDay} from '../app/update-history.ts';

test('public chronicle excludes unpublished work and preserves the complete confirmed publication history',()=>{
 const entries=publicUpdates([...PREPARED_UPDATES,...UPDATE_HISTORY]);
 assert.equal(entries.length,UPDATE_HISTORY.length);
 for(const number of [1,2,3,4,5,7,8,9,10,11,12,13,14])assert.ok(entries.some(e=>e.id==='site-v'+number),'retain published version '+number);
 assert.ok(!entries.some(e=>e.id==='site-v6'),'saved-only version must not appear as published');
 assert.equal(new Set([...UPDATE_HISTORY,...PREPARED_UPDATES].map(e=>e.id)).size,UPDATE_HISTORY.length+PREPARED_UPDATES.length);
 for(let i=1;i<entries.length;i++)assert.ok((entries[i-1].publishedOn??entries[i-1].confirmedOn)>=(entries[i].publishedOn??entries[i].confirmedOn),'newest publication first');
 assert.ok(PREPARED_UPDATES.every(e=>e.status==='prepared'&&e.publishedOn===null));
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
  for(const link of entry.links)assert.ok(['globe','world','labs','games','journeys','book'].includes(link.hash));
 }
 assert.equal(HISTORY_EVIDENCE.versions.find(v=>v.number===6).publication,null);
 assert.equal(berlinDay(HISTORY_EVIDENCE.site.createdAt),'2026-10-06','project began after Berlin midnight');
 assert.equal(berlinDay('2026-10-05T23:57:32.505039+00:00'),'2026-10-06','publication UTC day differs from German day');
 assert.equal(updateDate(UPDATE_HISTORY.find(e=>e.id==='site-v1')),'6. Oktober 2026');
 assert.equal(updateDate({...UPDATE_HISTORY[0],publishedOn:null,confirmedOn:'2026-10-10'}),'10. Oktober 2026','unknown publication day remains an observation');
 const v12=HISTORY_EVIDENCE.versions.find(v=>v.number===12),v13=HISTORY_EVIDENCE.versions.find(v=>v.number===13);
 assert.equal(v12.sourceReview.topicCount,90);assert.equal(v13.sourceReview.topicCount,108);assert.equal(v13.sourceReview.addedTopicIds.length,18);
 assert.equal(HISTORY_EVIDENCE.versions.find(v=>v.number===7).archiveHash,HISTORY_EVIDENCE.versions.find(v=>v.number===8).archiveHash,'repeat publication added no learner features');
});
