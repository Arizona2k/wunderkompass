import {publicUpdates} from '../app/update-history.ts';
import {historyViewsComplete,nativeHistoryComplete} from '../scripts/handoff.mjs';
const captures=()=>[100,31000].map(scrollY=>({cssWidth:640,cssHeight:450,scale:2,pixelWidth:1280,pixelHeight:900,sampledColors:10,scrollY}));
const historyView=width=>({width,entries:publicUpdates().map(e=>e.id),expanded:true,largeText:true,keyboard:true,axe:true,passPreserved:true});
import test from 'node:test';import assert from 'node:assert/strict';
import {aggregateQuality,REQUIRED_SUITES} from '../scripts/quality-evidence.mjs';
function proof(name,suites){return {name,suites,code:0,report:{...(suites.includes('journeys')?{nativeHistory:{percent:200,scale:2,blankCaptureRejected:true,captures:captures(),...historyView(640)},nativeZoom:{percent:200,cssWidth:640,scale:2,largeTextAlsoChecked:true},speechAvailability:{germanVoices:0,audibleTestPerformed:false}}:{}),selectedSuites:suites,status:'passed',build:'actual-build',browser:'actual-browser',seconds:1,checks:['tested '+name],views:[],timings:suites.flatMap(s=>s==='foundation'?['performance','components']:[s]).map(suite=>({suite,seconds:1})),errors:[],consoleErrors:[],failedRequests:[],ownHttpErrors:[],externalRequests:[]}};}
test('full quality aggregation rejects missing, red, duplicate, mixed-build, malformed and error evidence without skips',()=>{
 const all=[proof('foundation',['foundation']),proof('navigation',['home','core','offline']),proof('learning',['research','journeys','playground','backup','challenge']),proof('signed-news',['news-feed'])];
 assert.deepEqual(aggregateQuality(all).selectedSuites,REQUIRED_SUITES);assert.equal(aggregateQuality(all).checks.length,4);
 assert.throws(()=>aggregateQuality(all.slice(0,2)),/Incomplete/);assert.throws(()=>aggregateQuality([...all,all[0]]),/Duplicate/);
 for(const mutate of [a=>{delete a[2].report.nativeZoom;},a=>{a[2].report.nativeZoom.scale=1;},a=>{a[1].code=1;},a=>{a[1].report.status='failed';},a=>{a[1].report.build='different';},a=>{a[1].report.browser='different';},a=>{delete a[1].report.consoleErrors;},a=>{a[1].report.timings=[];},a=>{a[1].report.errors=['failure'];},a=>{a[1].report.externalRequests=['unexpected'];},a=>{a[1].report.checks=[];}]){const bad=structuredClone(all);mutate(bad);assert.throws(()=>aggregateQuality(bad));}
});

 test('history evidence rejects missing, repeated, old and incomplete entries or unmeasured native zoom',()=>{
 const valid=[320,390,768,1440].map(historyView);assert.ok(historyViewsComplete(valid,[320,390,768,1440]));
 for(const mutate of [v=>v.pop(),v=>v[0].entries.pop(),v=>v[0].entries.push(v[0].entries[0]),v=>v[1].width=320,v=>v[0].keyboard=false,v=>v[0].axe=false,v=>v[0].passPreserved=false]){const broken=structuredClone(valid);mutate(broken);assert.equal(historyViewsComplete(broken,[320,390,768,1440]),false);}
 const z={percent:200,scale:2,blankCaptureRejected:true,captures:captures(),...historyView(640)};assert.ok(nativeHistoryComplete(z));for(const mutate of [v=>v.blankCaptureRejected=false,v=>v.captures.pop(),v=>v.captures[1].scrollY=100,v=>v.captures[1].sampledColors=1,v=>v.captures[1].pixelWidth=640]){const bad=structuredClone(z);mutate(bad);assert.equal(nativeHistoryComplete(bad),false);}assert.equal(nativeHistoryComplete({...z,scale:1}),false);assert.equal(nativeHistoryComplete({...z,width:1280}),false);
 });
