import test from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import path from 'node:path';
import POLICY from '../content/news-source-policy.json' with {type:'json'};
import CONTENT from '../app/news-content.json' with {type:'json'};
import WORLD_INDEX from '../app/world-index.json' with {type:'json'};
import {availableNews,newsAge,newsCheckDate} from '../app/news-data.ts';
import {dailyTarget,approvedURL,parseFeed,fetchSource,validateNews,formulate,observeClaims,discoverArticles,runNews,saveDraft,publishReviewed} from '../scripts/news/engine.mjs';
import {dailyNewsTick} from '../scripts/news/schedule.mjs';
import {prepareNewsEdition} from '../scripts/news/pipeline.mjs';
const now=new Date('2026-10-11T19:00:00Z'),topicIds=WORLD_INDEX.map(t=>t.id),policy={...POLICY,automaticRetrievalAuthorized:true,discoverySources:[]},brief=CONTENT.entries[1];
const observations=b=>b.sources.map((source,index)=>({url:source.url,claims:Object.fromEntries(b.claims.filter(c=>c.sourceIndexes.includes(index)).map(c=>[c.key,c.value]))}));
test('real own news explanations retain actual dates, original links, archive and primary-source independence labels',()=>{
 for(const b of CONTENT.entries)assert.doesNotThrow(()=>validateNews(b,{policy,now,topicIds}));
 assert.equal(availableNews(now).length,3);assert.equal(availableNews(new Date('2026-12-01T12:00:00Z')).length,0);
 assert.equal(brief.eventOn,null);assert.ok(CONTENT.entries[2].verification.includes('nicht als zwei unabhängige'));
 assert.equal(newsCheckDate('2026-10-10T23:30:00Z'),'11. Oktober 2026');assert.equal(newsAge(CONTENT.entries[0],now),0);assert.equal(newsAge(CONTENT.entries[2],now),10);
});
test('Berlin 12:30 has actual summer/winter UTC instants, including both DST transition dates',()=>{
 assert.equal(dailyTarget('2026-10-11'),'2026-10-11T10:30:00.000Z');assert.equal(dailyTarget('2026-10-25'),'2026-10-25T11:30:00.000Z');
 assert.equal(dailyTarget('2026-03-28'),'2026-03-28T11:30:00.000Z');assert.equal(dailyTarget('2026-03-29'),'2026-03-29T10:30:00.000Z');
 assert.throws(()=>dailyTarget('invalid'));assert.throws(()=>dailyTarget('2026-02-31'));assert.throws(()=>dailyTarget('2026-10-11','25:30'));
});
test('untrusted sources, feed entities and HTML never become valid child news',()=>{
 for(const url of ['http://www.nachrichtenleicht.de/a','https://evil.example/','https://user:pass@science.nasa.gov/a','https://science.nasa.gov:444/a','https://127.0.0.1/a'])assert.throws(()=>approvedURL(url,policy));
 const xml='<rss><item><title>Neue Meldung</title><link>https://science.nasa.gov/news/a</link><pubDate>Sun, 11 Oct 2026 10:00:00 GMT</pubDate></item><item><link>https://evil.example/a</link></item></rss>';
 assert.equal(parseFeed(xml,policy).length,1);assert.equal(discoverArticles(xml,policy).length,1);assert.throws(()=>parseFeed('<!DOCTYPE a>'+xml,policy));
 for(const mutate of [b=>{b.sourcePublishedOn='2026-12-01';},b=>{b.sourcePublishedOn='2026-02-31';},b=>{b.editorial.reviewedAt='tomorrow';},b=>{b.sources[0].checkedAt='tomorrow';},b=>{b.checkedAt='2027-01-01';},b=>{b.editorial.status='pending';},b=>{b.topicId='invented-topic';},b=>{b.summary='<script>bad()</script>';},b=>{b.title='Schock!';},b=>{b.sources[0].access='unread';},b=>{b.claims[0].sourceIndexes=[99];}]){const b=structuredClone(brief);mutate(b);assert.throws(()=>validateNews(b,{policy,now,topicIds}));}
});
test('source fetch enforces real retrieval permission, content/byte boundaries and bounded retries',async()=>{
 await assert.rejects(fetchSource(brief.sources[0].url,POLICY),/nicht freigegeben/);
 let calls=0;const fetchImpl=async()=>{calls++;if(calls<3)return new Response('busy',{status:503,headers:{'content-type':'text/html'}});return new Response('<html>Ragebait Jugend-Wort 2026</html>',{headers:{'content-type':'text/html'}});};
 const result=await fetchSource(brief.sources[0].url,policy,{fetchImpl,wait:async()=>{}});assert.equal(calls,3);assert.ok(result.sha256&&result.bytes>0);
 assert.equal(observeClaims(result,brief.sources[0],brief).claims.winner,brief.claims[0].value);
 assert.throws(()=>observeClaims({...result,text:'Eine andere Meldung'},brief.sources[0],brief));
 await assert.rejects(fetchSource(brief.sources[0].url,{...policy,maxBytes:5},{fetchImpl:async()=>new Response('123456',{headers:{'content-type':'text/html'}}),wait:async()=>{}}),/zu groß/);
 await assert.rejects(fetchSource(brief.sources[0].url,policy,{fetchImpl:async()=>new Response('image',{headers:{'content-type':'image/jpeg'}}),wait:async()=>{}}),/Quellentyp/);
});
test('conflicts and missing evidence retain the previous dated issue without inventing a fresh check',async()=>{
 assert.deepEqual(formulate(brief,observations(brief)),brief);const conflicting=observations(brief);conflicting[1].claims.winner='Different';assert.throws(()=>formulate(brief,conflicting),/widersprüchlich/);
 const result=await runNews({policy,briefs:[brief],previous:[brief],topicIds,now,loadObservation:async()=>{throw Error('Netzwerk ausgefallen');}});
 assert.equal(result.report.selected.length,0);assert.equal(result.report.issues.length,1);assert.equal(result.payload.entries[0].checkedAt,brief.checkedAt);assert.equal(result.payload.automation,'inactive');
});
test('the complete pipeline validates, deduplicates, atomically stages and separately checks an exact approved handoff',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'wk-news-'));try{
 const result=await runNews({policy:{...policy,discoverySources:[{url:'https://science.nasa.gov/'}]},briefs:[...CONTENT.entries,brief],previous:[],topicIds,now,loadDiscovery:async source=>{const xml='<rss><item><title>Original headline must not become product copy</title><link>https://science.nasa.gov/new-fixture</link><pubDate>Sun, 11 Oct 2026 10:00:00 GMT</pubDate></item></rss>';const fetched=await fetchSource(source.url,policy,{fetchImpl:async()=>new Response(xml,{headers:{'content-type':'application/rss+xml'}})});return discoverArticles(fetched.document,policy,source.url);},loadObservation:async(source,b)=>{const i=b.sources.findIndex(s=>s.url===source.url),text=Object.values(b.sourceChecks[i]).flat().join(' ');const fetched=await fetchSource(source.url,policy,{fetchImpl:async()=>new Response('<html>'+text+'</html>',{headers:{'content-type':'text/html'}}),wait:async()=>{}});return observeClaims(fetched,source,b);}});
 assert.equal(result.report.selected.length,3);assert.equal(result.payload.entries.length,4);assert.match(result.report.issues[0].reason,/Doppelte/);assert.equal(result.report.candidates[0].status,'awaiting-editorial');assert.ok(result.report.awaitingEditorial.includes('https://science.nasa.gov/new-fixture'));assert.ok(!JSON.stringify(result.payload).includes('Original headline'));
 await saveDraft(directory,result);const target=path.join(directory,'published.json');
 await assert.rejects(publishReviewed({policy:POLICY,directory,target,approvalFingerprint:result.fingerprint,topicIds,now}),/deaktiviert/);
 const enabled={...policy,publicationEnabled:true,schedulerEnabled:true};
 await assert.rejects(publishReviewed({policy:enabled,directory,target,approvalFingerprint:'wrong',topicIds,now}),/Freigabe/);
 await publishReviewed({policy:enabled,directory,target,approvalFingerprint:result.fingerprint,topicIds,now});assert.equal(JSON.parse(await readFile(target,'utf8')).entries.length,4);
 await writeFile(path.join(directory,'draft.json'),'{}');await assert.rejects(publishReviewed({policy:enabled,directory,target,approvalFingerprint:result.fingerprint,topicIds,now}),/Freigabe/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('inactive daily scheduler does nothing; due runs reserve once and failures remain retryable',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'wk-news-tick-'));try{let calls=0;const run=async()=>{calls++;return {fingerprint:'checked-fixture'};};
 assert.equal((await dailyNewsTick({policy:POLICY,directory,now,run})).status,'inactive');assert.equal(calls,0);
 const enabled={...policy,schedulerEnabled:true};assert.equal((await dailyNewsTick({policy:enabled,directory,now:new Date('2026-10-11T09:00:00Z'),run})).status,'not-due');
 const [a,b]=await Promise.all([dailyNewsTick({policy:enabled,directory,now,run}),dailyNewsTick({policy:enabled,directory,now,run})]);assert.ok([a.status,b.status].includes('checked'));assert.equal(calls,1);
 assert.equal((await dailyNewsTick({policy:enabled,directory,now,run})).status,'already-ran');
 await assert.rejects(dailyNewsTick({policy:enabled,directory,now:new Date('2026-10-12T15:00:00Z'),run:async()=>{throw Error('failure');}}));
 assert.equal((await dailyNewsTick({policy:enabled,directory,now:new Date('2026-10-12T15:00:00Z'),run})).status,'checked');
 }finally{await rm(directory,{recursive:true,force:true});}
});

test('connected selection handles duplicates, future and old candidates and never invents a brief',async()=>{
 const discoverySources=[{url:'https://science.nasa.gov/'}],source=brief.sources[0].url;
 const result=await runNews({policy:{...policy,maxItems:1,discoverySources},briefs:CONTENT.entries,topicIds,now,loadObservation:async(s,b)=>observations(b)[b.sources.indexOf(s)],loadDiscovery:async()=>[
 {url:source,publishedAt:'2026-10-10T10:00:00Z'},
 {url:source,publishedAt:'2026-10-10T10:00:00Z'},
 {url:'https://science.nasa.gov/future',publishedAt:'2026-12-01T10:00:00Z'},
 {url:'https://science.nasa.gov/old',publishedAt:'2026-01-01T10:00:00Z'},
 {url:'https://science.nasa.gov/unknown',publishedAt:null},
 {url:'https://science.nasa.gov/bad-date',publishedAt:'invalid'}]});
 assert.equal(result.report.selected.length,1);assert.equal(result.report.selected[0],CONTENT.entries[0].id);assert.equal(result.report.deferred.length,2);assert.equal(result.payload.entries.length,2);
 assert.deepEqual(result.report.candidates.map(c=>c.status),['known-brief','future-source','archive-candidate','awaiting-editorial','invalid-date']);
 assert.ok(result.report.awaitingEditorial.includes('https://science.nasa.gov/unknown'));
 assert.equal(discoverArticles('<a href="/new">Own source title</a><a href="https://evil.example/">Bad</a>',policy,'https://science.nasa.gov/').length,1);
});

test('daily adapter reaches the entire bounded HTTP-to-draft chain once and preserves the archive',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'wk-news-daily-full-'));try{const enabled={...policy,schedulerEnabled:true,discoverySources:[{url:'https://science.nasa.gov/'}]},requested=[];
 const fetchImpl=async url=>{requested.push(url);if(url==='https://science.nasa.gov/')return new Response('<a href="/unknown">Original title</a>',{headers:{'content-type':'text/html'}});const words=CONTENT.entries.flatMap(b=>b.sources.flatMap((source,i)=>source.url===url?Object.values(b.sourceChecks[i]).flat():[])).join(' ');return new Response('<html>'+words+'</html>',{headers:{'content-type':'text/html'}});};
 const run=()=>prepareNewsEdition({policy:enabled,content:CONTENT,topicIds,now,directory,fetchImpl,wait:async()=>{}});
 const first=await dailyNewsTick({policy:enabled,now,directory,run});assert.equal(first.status,'checked');assert.equal(first.result.report.selected.length,3);assert.equal(first.result.report.retained.length,1);assert.equal(first.result.report.candidates[0].status,'awaiting-editorial');
 const drafted=JSON.parse(await readFile(path.join(directory,'draft.json'),'utf8'));assert.equal(drafted.entries.length,4);assert.equal(drafted.automation,'inactive');assert.equal(drafted.entries.find(b=>b.id==='earth-phobos-2026').checkedAt,CONTENT.entries[3].checkedAt);
 const count=requested.length;assert.equal((await dailyNewsTick({policy:enabled,now,directory,run})).status,'already-ran');assert.equal(requested.length,count);
 await assert.rejects(publishReviewed({policy:POLICY,directory,target:path.join(directory,'not-published.json'),approvalFingerprint:first.result.fingerprint,topicIds,now}),/deaktiviert/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
