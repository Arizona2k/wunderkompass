export const REQUIRED_SUITES=['foundation','home','core','playground','backup','challenge','research','journeys','offline','news-feed'];
export function aggregateQuality(outcomes){
 const seen=new Set(),result={scope:'complete mandatory regression',status:'passed',selectedSuites:REQUIRED_SUITES,workers:[],checks:[],views:[],timings:[],errors:[],consoleErrors:[],failedRequests:[],ownHttpErrors:[],externalRequests:[]};let build,browser;
 for(const worker of outcomes){
  const report=worker.report;if(worker.code!==0||report?.status!=='passed')throw Error('Missing or failed browser worker '+worker.name);
  for(const key of ['checks','timings','views','errors','consoleErrors','failedRequests','ownHttpErrors','externalRequests'])if(!Array.isArray(report[key]))throw Error('Missing evidence field '+key);
  if(!report.checks.length||!Number.isFinite(report.seconds)||report.seconds<=0)throw Error('Empty worker proof');
  if(!report.build||!report.browser)throw Error('Missing build/browser proof');if(build&&build!==report.build||browser&&browser!==report.browser)throw Error('Mixed build/browser proof');build=report.build;browser=report.browser;
  for(const suite of worker.suites){if(seen.has(suite)||!REQUIRED_SUITES.includes(suite)||!report.selectedSuites.includes(suite))throw Error('Duplicate, unknown or missing suite '+suite);seen.add(suite);for(const phase of suite==='foundation'?['performance','components']:[suite])if(!report.timings.some(t=>t.suite===phase&&Number.isFinite(t.seconds)&&t.seconds>0))throw Error('Missing phase timing '+phase);}
  if(report.selectedSuites.length!==worker.suites.length)throw Error('Worker scope mismatch');
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
