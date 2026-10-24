import {browserErrorArrays} from '../scripts/browser-errors.mjs';
import {NEWS_REMOVAL_WIDTHS,REMOVED_NEWS_ROUTES} from '../scripts/news-removal-evidence.mjs';
import {animalProof,animalNativeProof,animalOfflineProof,solarProof,solarNativeProof,solarOfflineProof} from './fixtures/animal-proof.mjs';
import JOURNEY_DATA from '../app/journey-inquiries.json' with {type:'json'};
import {publicUpdates} from '../app/update-history.ts';
import {journeySupportComplete,historyViewsComplete,nativeHistoryComplete,offlineComplete,retentionComplete} from '../scripts/handoff.mjs';
const captures=()=>[100,31000].map(scrollY=>({cssWidth:640,cssHeight:450,scale:2,pixelWidth:1280,pixelHeight:900,sampledColors:10,scrollY}));
const historyView=width=>({width,entries:publicUpdates().map(e=>e.id),expanded:true,largeText:true,keyboard:true,axe:true,passPreserved:true});
import test from 'node:test';import assert from 'node:assert/strict';
import {aggregateQuality,REQUIRED_SUITES} from '../scripts/quality-evidence.mjs';
const retention=()=>Object.fromEntries(['multipleTabs','partialNeverReplacesFallback','unknownLegacyProtected','orphanCleanup','stoppedServerOldChunk','canaryPreserved'].map(k=>[k,true]));
const offline=(kind='chromium',native=false)=>({kind,browserErrors:browserErrorArrays(),realProgress:true,networkRecovery:true,quotaRecovery:kind==='chromium'?true:null,completeAssets:true,offlineReload:true,serverStopped:true,passPreserved:true,assetCount:130,metrics:{assets:130,reused:0,downloaded:130},progressViews:(native?[640]:[320,360,390,768,1024,1440,1920]).map(width=>({width,cssWidth:width,scale:native?2:1,largeText:true,axe:true,verified:12,total:130,...(native?{screenshot:{pixelWidth:1280,sampledColors:2}}:{})}))});
const support=(widths=[320,360,390,768,1024,1440,1920])=>({hints:JOURNEY_DATA.chapters.flatMap(c=>c.tasks.map((_,n)=>c.id+':'+n)),widths,diagrams:JOURNEY_DATA.chapters.filter(c=>c.index>0).flatMap(c=>widths.map(width=>({id:c.id,width,states:3,readable:true,largeText:true,keyboard:true}))),seconds:1});
function proof(name,suites){return {name,suites,code:0,report:{...(suites.includes('no-news')?{newsRemoval:{noNewsRequests:true,observed:NEWS_REMOVAL_WIDTHS.flatMap(width=>[false,true].map(large=>({width,large,home:true,search:true,updates:true,routes:[...REMOVED_NEWS_ROUTES],reload:true,passPreserved:true})))}}:{}),...(suites.includes('core')?{animalCoverage:animalProof(),animalNativeZoom:animalNativeProof(),solarCaptionCoverage:solarProof(),solarNativeCoverage:solarNativeProof()}:{}),...(suites.includes('offline')?{animalOffline:animalOfflineProof(),solarOffline:solarOfflineProof()}:{}),...(suites.includes('foundation')?{offlineResilience:offline(),offlineRetention:retention(),pendingRouteFocus:{cases:[320,1440].flatMap(width=>['keyboard','pointer'].map(input=>({width,input,pendingFrames:1,trustedInput:true,focused:true,closed:true,scrollKept:true})))}}:{}),...(suites.includes('journeys')?{journeySupport:support(),offlineNative:offline('chromium',true),nativeHistory:{percent:200,scale:2,blankCaptureRejected:true,captures:captures(),...historyView(640)},nativeZoom:{percent:200,cssWidth:640,scale:2,largeTextAlsoChecked:true},speechAvailability:{germanVoices:0,audibleTestPerformed:false}}:{}),selectedSuites:suites,status:'passed',build:'actual-build',browser:'actual-browser',seconds:1,checks:['tested '+name],views:[],timings:suites.flatMap(s=>s==='foundation'?['performance','components']:[s]).map(suite=>({suite,seconds:1})),errors:[],consoleErrors:[],failedRequests:[],ownHttpErrors:[],externalRequests:[]}};}
test('full quality aggregation rejects missing, red, duplicate, mixed-build, malformed and error evidence without skips',()=>{
 const all=[proof('foundation',['foundation']),proof('navigation',['home','core','offline']),proof('learning',['research','journeys','playground','backup','challenge']),proof('news-removal',['no-news'])];
 assert.deepEqual(aggregateQuality(all).selectedSuites,REQUIRED_SUITES);assert.equal(aggregateQuality(all).checks.length,4);
 assert.throws(()=>aggregateQuality(all.slice(0,2)),/Incomplete/);assert.throws(()=>aggregateQuality([...all,all[0]]),/Duplicate/);
 for(const mutate of [a=>{delete a[1].report.animalCoverage;},a=>{a[1].report.animalCoverage.observed.pop();},a=>{delete a[1].report.animalNativeZoom;},a=>{delete a[1].report.animalOffline;},a=>{delete a[1].report.solarCaptionCoverage;},a=>{a[1].report.solarCaptionCoverage.clippingGuard=false;},a=>{delete a[1].report.solarNativeCoverage;},a=>{delete a[1].report.solarOffline;},a=>{delete a[0].report.pendingRouteFocus;},a=>{a[0].report.pendingRouteFocus.cases.pop();},a=>{a[0].report.pendingRouteFocus.cases[0].focused=false;},a=>{a[0].report.pendingRouteFocus.cases[0].trustedInput=false;},a=>{delete a[2].report.nativeZoom;},a=>{a[2].report.nativeZoom.scale=1;},a=>{a[1].code=1;},a=>{a[1].report.status='failed';},a=>{a[1].report.build='different';},a=>{a[1].report.browser='different';},a=>{delete a[1].report.consoleErrors;},a=>{a[1].report.timings=[];},a=>{a[1].report.errors=['failure'];},a=>{a[1].report.externalRequests=['unexpected'];},a=>{a[1].report.checks=[];}]){const bad=structuredClone(all);mutate(bad);assert.throws(()=>aggregateQuality(bad));}
});

 test('history evidence rejects missing, repeated, old and incomplete entries or unmeasured native zoom',()=>{
 const valid=[320,390,768,1440].map(historyView);assert.ok(historyViewsComplete(valid,[320,390,768,1440]));
 for(const mutate of [v=>v.pop(),v=>v[0].entries.pop(),v=>v[0].entries.push(v[0].entries[0]),v=>v[1].width=320,v=>v[0].keyboard=false,v=>v[0].axe=false,v=>v[0].passPreserved=false]){const broken=structuredClone(valid);mutate(broken);assert.equal(historyViewsComplete(broken,[320,390,768,1440]),false);}
 const z={percent:200,scale:2,blankCaptureRejected:true,captures:captures(),...historyView(640)};assert.ok(nativeHistoryComplete(z));for(const mutate of [v=>v.blankCaptureRejected=false,v=>v.captures.pop(),v=>v.captures[1].scrollY=100,v=>v.captures[1].sampledColors=1,v=>v.captures[1].pixelWidth=640]){const bad=structuredClone(z);mutate(bad);assert.equal(nativeHistoryComplete(bad),false);}assert.equal(nativeHistoryComplete({...z,scale:1}),false);assert.equal(nativeHistoryComplete({...z,width:1280}),false);
 });

test('offline handoff rejects missing, duplicated or invented progress, absent fallback and lost safety probes',()=>{
 for(const kind of ['chromium','firefox','webkit'])assert.ok(offlineComplete(offline(kind),kind));
 for(const mutate of [p=>p.realProgress=false,p=>delete p.browserErrors,p=>p.browserErrors.consoleErrors.push('actual native error'),p=>delete p.browserErrors.failedRequests,p=>p.quotaRecovery=false,p=>p.passPreserved=false,p=>p.serverStopped=false,p=>p.metrics.downloaded--,p=>p.progressViews.pop(),p=>p.progressViews[1].width=320,p=>p.progressViews[0].verified=130,p=>p.progressViews[0].axe=false]){const broken=offline();mutate(broken);assert.equal(offlineComplete(broken,'chromium'),false);}
 const n=offline('chromium',true);assert.ok(offlineComplete(n,'chromium',{native:true}));n.progressViews[0].screenshot.sampledColors=1;assert.equal(offlineComplete(n,'chromium',{native:true}),false);
 const r=retention();assert.ok(retentionComplete(r));delete r.unknownLegacyProtected;assert.equal(retentionComplete(r),false);
 const all=[proof('foundation',['foundation']),proof('navigation',['home','core','offline']),proof('learning',['research','journeys','playground','backup','challenge']),proof('news-removal',['no-news'])];delete all[0].report.offlineRetention;assert.throws(()=>aggregateQuality(all),/offline/);
});

test('journey support proof rejects missing widths, hints, diagrams, duplicate cases or false keyboard evidence',()=>{
 const widths=[320,390,768,1440];assert.equal(journeySupportComplete(support(widths),widths),true);
 for(const change of [p=>p.hints.pop(),p=>p.hints[1]=p.hints[0],p=>p.widths.pop(),p=>p.diagrams.pop(),p=>p.diagrams[0].keyboard=false,p=>p.diagrams[0].states=0,p=>p.seconds=0]){const p=support(widths);change(p);assert.equal(journeySupportComplete(p,widths),false);}
 assert.equal(journeySupportComplete(support([320,390]),widths),false);
});

 test('exact early offline worker aggregates once with later core, and mismatched browser or duplicate coverage blocks',()=>{
 const all=[proof('early-offline',['offline']),proof('foundation',['foundation']),proof('navigation',['core']),proof('learning',['home','research','journeys','playground','backup','challenge']),proof('news-removal',['no-news'])];
 assert.deepEqual(aggregateQuality(all).selectedSuites,REQUIRED_SUITES);assert.equal(aggregateQuality(all).workers.length,5);assert.equal(aggregateQuality(all).workers.filter(w=>w.suites.includes('offline')).length,1);assert.throws(()=>aggregateQuality([...all,proof('duplicate-cold',['offline'])]),/Duplicate/);const foreign=structuredClone(all);foreign[0].report.browser='different actual engine';assert.throws(()=>aggregateQuality(foreign),/Mixed build\/browser/);
 });
