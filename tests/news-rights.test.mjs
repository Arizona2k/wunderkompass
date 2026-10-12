import test from 'node:test';import assert from 'node:assert/strict';
import {monitorRights} from '../scripts/news/rights-monitor.mjs';
import {validatePayload} from '../app/news-wire.mjs';
import POLICY from '../content/news-source-policy.json' with {type:'json'};
import CONTENT from '../app/news-content.json' with {type:'json'};
import TOPICS from '../app/world-index.json' with {type:'json'};
const url='https://epic.gsfc.nasa.gov/about',sha256='a'.repeat(64),now=new Date('2027-05-12T12:00:00Z');
const source={id:'nasa-epic',url:'https://epic.gsfc.nasa.gov/api/natural',rights:{status:'confirmed',checkedOn:'2026-10-12',urls:[url],documentFingerprints:[{url,sha256}]}};
test('only unchanged preapproved original documents renew rights after 180 days, with a bounded monthly reuse window',async()=>{
 let reads=0;const readDocument=async()=>{reads++;return {sha256};};
 const first=await monitorRights(source,{policy:POLICY,now,readDocument});assert.equal(first.effectiveCheckedOn,'2027-05-12');assert.equal(reads,1);
 const next=await monitorRights(source,{policy:POLICY,previous:first.proof,now:new Date('2027-05-13T12:00:00Z'),readDocument});assert.equal(next.status,'unchanged-cached');assert.equal(next.effectiveCheckedOn,'2027-05-12');assert.equal(reads,1);
 await monitorRights(source,{policy:POLICY,previous:first.proof,now:new Date('2027-06-12T12:00:00Z'),readDocument});assert.equal(reads,2);
});
test('changed terms, access errors, missing/unapproved pins, changed policy and forged future evidence never renew rights',async()=>{
 await assert.rejects(monitorRights(source,{policy:POLICY,now,readDocument:async()=>({sha256:'b'.repeat(64)})}),/geändert/);
 await assert.rejects(monitorRights(source,{policy:POLICY,now,readDocument:async()=>{throw Error('Unavailable terms');}}),/Unavailable/);
 const missing=structuredClone(source);delete missing.rights.documentFingerprints;await assert.rejects(monitorRights(missing,{policy:POLICY,now}),/überaltert/);
 const early=await monitorRights(missing,{policy:POLICY,now:new Date('2026-10-13T12:00:00Z')});assert.equal(early.status,'baseline-missing');assert.equal(early.proof,null);
 const bad=structuredClone(source);bad.rights.documentFingerprints[0].url='https://other.invalid';await assert.rejects(monitorRights(bad,{policy:POLICY,now}),/Ungültiger/);
 const checked=await monitorRights(source,{policy:POLICY,now,readDocument:async()=>({sha256})});
 const changed=structuredClone(source);changed.rights.basis='Different reviewed rule';let reads=0;await monitorRights(changed,{policy:POLICY,previous:checked.proof,now,readDocument:async()=>{reads++;return {sha256};}});assert.equal(reads,1);
 await monitorRights(source,{policy:POLICY,previous:{...checked.proof,checkedOn:'2028-01-01'},now,readDocument:async()=>{reads++;return {sha256};}});assert.equal(reads,2);
});
test('signed payload rejects malformed, future or unsafe rights-monitor metadata while preserving old schema-1 news',()=>{
 const options={policy:POLICY,topicIds:TOPICS.map(t=>t.id),now:new Date('2026-10-12T12:00:00Z')};assert.equal(validatePayload(CONTENT,options),CONTENT);
 const valid={...CONTENT,sourceRightsChecks:{'nasa-epic':{checkedOn:'2026-10-12',policyFingerprint:sha256,documents:[{url,sha256}]}}};assert.equal(validatePayload(valid,options),valid);
 for(const mutate of [d=>d.sourceRightsChecks['nasa-epic'].checkedOn='2028-01-01',d=>d.sourceRightsChecks['nasa-epic'].documents[0].url='http://epic.gsfc.nasa.gov/about',d=>d.sourceRightsChecks['nasa-epic'].documents[0].url='https://user@epic.gsfc.nasa.gov/about',d=>d.sourceRightsChecks['nasa-epic'].documents=[],d=>d.sourceRightsChecks['nasa-epic'].policyFingerprint='wrong']){const bad=structuredClone(valid);mutate(bad);assert.throws(()=>validatePayload(bad,options));}
});
