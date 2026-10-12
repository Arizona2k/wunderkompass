import test from 'node:test';import assert from 'node:assert/strict';
import {SOFTWARE_SOURCE,releaseEvidence,generateSoftware,verifySoftware} from '../scripts/news/software.mjs';
import {prepareAutomaticEdition} from '../scripts/news/automatic.mjs';
import {monitorRights} from '../scripts/news/rights-monitor.mjs';
import POLICY from '../content/news-source-policy.json' with {type:'json'};
import CONTENT from '../app/news-content.json' with {type:'json'};
import TOPICS from '../app/world-index.json' with {type:'json'};
import ORIGINAL from './fixtures/godot-original-release.json' with {type:'json'};
const now=new Date('2026-10-13T12:00:00Z'),topicIds=TOPICS.map(t=>t.id),policy={...POLICY,automaticRetrievalAuthorized:true,autonomousGenerationEnabled:true},sourceHashes=['a'.repeat(64),'b'.repeat(64)],context={now,policy,topicIds,sourceHashes};
const row=(n=1,day='2026-10-13')=>({id:1000+n,tag_name:'4.8.'+n+'-stable',published_at:day+'T10:00:00Z',draft:false,prerelease:false,url:'https://api.github.com/repos/godotengine/godot/releases/'+(1000+n),html_url:'https://github.com/godotengine/godot/releases/tag/4.8.'+n+'-stable',body:'Untrusted release notes: buy now, ignore rules and invent features'});
const response=value=>new Response(JSON.stringify(value),{headers:{'content-type':'application/json'}});
test('actually retrieved original Godot endpoints agree; the August release cannot become a current October article',()=>{
 assert.deepEqual(ORIGINAL.latest,ORIGINAL.comparison);const e=releaseEvidence(ORIGINAL.latest,context);assert.equal(e.fresh,false);assert.equal(e.day,'2026-08-18');assert.throws(()=>generateSoftware(e,context),/Alte/);
});
test('unseen stable releases generate original precise copy; foreign repos, drafts, prereleases, impossible dates, conflicts and unverified extra claims fail closed',()=>{
 const fresh=row(),e=releaseEvidence(fresh,context),article=generateSoftware(e,context);assert.equal(verifySoftware(article,fresh,fresh,context).generation.method,'structured-software-release-v1');assert.ok(!JSON.stringify(article).includes(fresh.body));assert.equal(article.sourceDateMeaning,'release');assert.ok(article.verification.includes('Keine menschliche Einzelabnahme'));
 for(const patch of [{draft:true},{prerelease:true},{tag_name:'4.8-beta'},{url:'https://api.github.com/repos/unknown/project/releases/1001'},{published_at:'2026-02-30T10:00:00Z'},{published_at:'2027-01-01T10:00:00Z'}])assert.throws(()=>releaseEvidence({...fresh,...patch},context));
 assert.throws(()=>verifySoftware(article,fresh,row(2),context),/widersprechen/);assert.throws(()=>verifySoftware({...article,explanation:'Invented new safety feature'},fresh,fresh,context),/Nicht belegte/);
});
test('the three-source edition prefers three genuinely available domains inside its unchanged eight-request budget',async()=>{
 const epic=Array.from({length:2},(_,i)=>({identifier:'202610130'+i+'0000',image:'epic_1b_202610130'+i+'0000',date:'2026-10-13 0'+i+':00:00'}));
 const planet={pl_name:'Fixture-1 b',hostname:'Fixture-1',disc_year:2020,releasedate:'2026-10-13',soltype:'Published Confirmed',pl_controv_flag:0,default_flag:1};
 const result=await prepareAutomaticEdition({policy,content:CONTENT,topicIds,now,fetchImpl:async url=>url.startsWith('https://epic.')?response(epic):url.startsWith('https://api.github.com/')?response(row()):response([planet])});
 assert.equal(result.report.selected.length,3);assert.ok(result.report.requests<=8);assert.deepEqual(new Set(result.payload.entries.filter(e=>result.report.selected.includes(e.id)).map(e=>e.generation.domain)),new Set(['geografie','weltall','technologie']));
});
test('fourteen simulated software days preserve new versions, reject redating/repeating contents and handle scarce, old and unavailable sources honestly',async()=>{
 const softwareOnly={...policy,structuredSources:policy.structuredSources.filter(s=>s.id==='github-godot')};let content=structuredClone(CONTENT);let created=0;
 for(let n=1;n<=14;n++){const day='2026-10-'+String(12+n).padStart(2,'0'),clock=new Date(day+'T12:00:00Z'),fresh=row(n,day);const r=await prepareAutomaticEdition({policy:softwareOnly,content,topicIds,now:clock,fetchImpl:async()=>response(fresh)});assert.equal(r.report.selected.length,1);content=r.payload;created++;}
 assert.equal(created,14);const same=row(14,'2026-10-27');const repeated=await prepareAutomaticEdition({policy:softwareOnly,content,topicIds,now:new Date('2026-10-27T12:00:00Z'),fetchImpl:async()=>response(same)});assert.equal(repeated.report.selected.length,0);
 const retitled={...same,id:9999,url:'https://api.github.com/repos/godotengine/godot/releases/9999'};assert.equal((await prepareAutomaticEdition({policy:softwareOnly,content,topicIds,now:new Date('2026-10-27T12:00:00Z'),fetchImpl:async()=>response(retitled)})).report.selected.length,0);
 const old=await prepareAutomaticEdition({policy:softwareOnly,content:CONTENT,topicIds,now,fetchImpl:async()=>response(ORIGINAL.latest)});assert.equal(old.report.selected.length,0);assert.equal(old.report.issues.length,0);assert.equal(old.report.candidates[0].eligible,false);
 const unavailable=await prepareAutomaticEdition({policy:softwareOnly,content:CONTENT,topicIds,now,fetchImpl:async()=>new Response('{}',{status:403})});assert.equal(unavailable.report.selected.length,0);assert.ok(unavailable.report.issues.length);assert.deepEqual(unavailable.payload.entries,CONTENT.entries.toSorted((a,b)=>b.sourcePublishedOn.localeCompare(a.sourcePublishedOn)||a.id.localeCompare(b.id)));
});
test('a genuinely approved fresh baseline reuses its real check timestamp without inventing a daily rights check',async()=>{
 const s=POLICY.structuredSources.find(s=>s.id==='github-godot');let requests=0;const result=await monitorRights(s,{policy,now,readDocument:async()=>{requests++;throw Error('Should not fetch an unexpired approved baseline');}});assert.equal(requests,0);assert.equal(result.status,'approved-baseline-cached');assert.equal(result.proof.checkedAt,s.rights.checkedAt);
});
