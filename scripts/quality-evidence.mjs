import {newsRemovalComplete} from './news-removal-evidence.mjs';
import {animalCoverageComplete,animalNativeComplete,animalOfflineComplete,solarCoverageComplete,solarNativeComplete,solarOfflineComplete} from './article-learning-evidence.mjs';
import {journeySupportComplete,nativeHistoryComplete,offlineComplete,retentionComplete} from './handoff.mjs';
export const REQUIRED_SUITES=['foundation','home','core','playground','backup','challenge','research','journeys','offline','no-news'];
export function aggregateQuality(outcomes){
 const seen=new Set(),result={scope:'complete mandatory regression',status:'passed',selectedSuites:REQUIRED_SUITES,workers:[],checks:[],views:[],timings:[],errors:[],consoleErrors:[],failedRequests:[],ownHttpErrors:[],externalRequests:[]};let build,browser;
 for(const worker of outcomes){
  const report=worker.report;if(worker.code!==0||report?.status!=='passed')throw Error('Missing or failed browser worker '+worker.name);
  for(const key of ['checks','timings','views','errors','consoleErrors','failedRequests','ownHttpErrors','externalRequests'])if(!Array.isArray(report[key]))throw Error('Missing evidence field '+key);
  if(!report.checks.length||!Number.isFinite(report.seconds)||report.seconds<=0)throw Error('Empty worker proof');
  if(!report.build||!report.browser)throw Error('Missing build/browser proof');if(build&&build!==report.build||browser&&browser!==report.browser)throw Error('Mixed build/browser proof');build=report.build;browser=report.browser;
  for(const suite of worker.suites){if(seen.has(suite)||!REQUIRED_SUITES.includes(suite)||!report.selectedSuites.includes(suite))throw Error('Duplicate, unknown or missing suite '+suite);seen.add(suite);for(const phase of suite==='foundation'?['performance','components']:[suite])if(!report.timings.some(t=>t.suite===phase&&Number.isFinite(t.seconds)&&t.seconds>0))throw Error('Missing phase timing '+phase);}
  if(worker.suites.includes('no-news')&&!newsRemovalComplete(report.newsRemoval))throw Error('Missing complete news removal proof');
  if(report.selectedSuites.length!==worker.suites.length)throw Error('Worker scope mismatch');
  if(worker.suites.includes('foundation')){if(!retentionComplete(report.offlineRetention)||!offlineComplete(report.offlineResilience,'chromium'))throw Error('Missing complete offline failure/recovery/retention proof');const cases=report.pendingRouteFocus?.cases,expected=[320,1440].flatMap(w=>['keyboard','pointer'].map(input=>w+':'+input));if(!Array.isArray(cases)||cases.length!==expected.length||new Set(cases.map(c=>c.width+':'+c.input)).size!==expected.length||!expected.every(key=>cases.some(c=>c.width+':'+c.input===key))||cases.some(c=>!(c.pendingFrames>0)||c.trustedInput!==true||c.focused!==true||c.closed!==true||c.scrollKept!==true))throw Error('Missing pending navigation focus regression proof');}
  if(worker.suites.includes('core')&&(!animalCoverageComplete(report.animalCoverage,[320,360,390,768,1024,1440,1920])||!animalNativeComplete(report.animalNativeZoom)||!solarCoverageComplete(report.solarCaptionCoverage,[320,360,390,402,768,1024,1440,1920])||!solarNativeComplete(report.solarNativeCoverage)))throw Error('Missing complete animal workshop/solar label browser evidence');
  if(worker.suites.includes('offline')&&(!animalOfflineComplete(report.animalOffline)||!solarOfflineComplete(report.solarOffline)))throw Error('Missing cold offline animal workshop/solar label evidence');
  if(worker.suites.includes('journeys')){if(!journeySupportComplete(report.journeySupport,[320,360,390,768,1024,1440,1920]))throw Error('Missing journey hint/diagram proof');if(!offlineComplete(report.offlineNative,'chromium',{native:true}))throw Error('Missing native offline progress proof');if(!nativeHistoryComplete(report.nativeHistory))throw Error('Missing complete native history zoom proof');const z=report.nativeZoom;if(z?.percent!==200||z.cssWidth!==640||z.scale!==2||z.largeTextAlsoChecked!==true)throw Error('Missing actual native journey zoom proof');}
  result.workers.push({name:worker.name,suites:worker.suites,seconds:report.seconds,report:worker.name+'/portable-report.json',...(report.fixtureConfiguration?{fixtureConfiguration:true}:{} )});
  for(const [key,value] of Object.entries(report)){
   if(['scope','status','selectedSuites','seconds','build','browser','failure','fixtureConfiguration'].includes(key))continue;
   if(Array.isArray(value))result[key]=[...(result[key]??[]),...value];else if(value!==undefined){if(result[key]!==undefined)throw Error('Conflicting evidence field '+key);result[key]=value;}
  }
 }
 if(REQUIRED_SUITES.some(s=>!seen.has(s)))throw Error('Incomplete mandatory browser coverage');
 for(const key of ['errors','consoleErrors','failedRequests','ownHttpErrors','externalRequests'])if(result[key].length)throw Error('Browser error evidence '+key);
 result.build=build;result.browser=browser;return result;
}
