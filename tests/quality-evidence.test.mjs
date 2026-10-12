import test from 'node:test';import assert from 'node:assert/strict';
import {aggregateQuality,REQUIRED_SUITES} from '../scripts/quality-evidence.mjs';
function proof(name,suites){return {name,suites,code:0,report:{selectedSuites:suites,status:'passed',build:'actual-build',browser:'actual-browser',seconds:1,checks:['tested '+name],views:[],timings:suites.flatMap(s=>s==='foundation'?['performance','components']:[s]).map(suite=>({suite,seconds:1})),errors:[],consoleErrors:[],failedRequests:[],ownHttpErrors:[],externalRequests:[]}};}
test('full quality aggregation rejects missing, red, duplicate, mixed-build, malformed and error evidence without skips',()=>{
 const all=[proof('foundation',['foundation']),proof('navigation',['home','core','offline']),proof('learning',['research','playground','backup','challenge']),proof('signed-news',['news-feed'])];
 assert.deepEqual(aggregateQuality(all).selectedSuites,REQUIRED_SUITES);assert.equal(aggregateQuality(all).checks.length,4);
 assert.throws(()=>aggregateQuality(all.slice(0,2)),/Incomplete/);assert.throws(()=>aggregateQuality([...all,all[0]]),/Duplicate/);
 for(const mutate of [a=>{a[1].code=1;},a=>{a[1].report.status='failed';},a=>{a[1].report.build='different';},a=>{a[1].report.browser='different';},a=>{delete a[1].report.consoleErrors;},a=>{a[1].report.timings=[];},a=>{a[1].report.errors=['failure'];},a=>{a[1].report.externalRequests=['unexpected'];},a=>{a[1].report.checks=[];}]){const bad=structuredClone(all);mutate(bad);assert.throws(()=>aggregateQuality(bad));}
});
