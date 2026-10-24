export const BROWSER_ERROR_FIELDS=['errors','consoleErrors','failedRequests','ownHttpErrors','externalRequests'];
export const browserErrorArrays=()=>Object.fromEntries(BROWSER_ERROR_FIELDS.map(key=>[key,[]]));
export const browserErrorsComplete=proof=>BROWSER_ERROR_FIELDS.every(key=>Array.isArray(proof?.[key])&&proof[key].length===0);

// Shared by actual Chromium/Firefox/WebKit pages. Controlled fixtures may name
// an exact initial asset503, or the confirmed stopped origin's registered worker
// update. Neither exception applies to ordinary app resources or real origins.
export function monitorBrowserErrors(page,base,proof,{engine,expectedHTTP503,expectedOfflineWorkerUpdate}={}){
 if(!BROWSER_ERROR_FIELDS.every(key=>Array.isArray(proof[key])))throw Error('Missing browser error evidence arrays');
 const origin=new URL(base).origin,tag=engine?'['+engine+'] ':'';
 if(expectedHTTP503&&(new URL(expectedHTTP503.url).origin!==origin||typeof expectedHTTP503.active!=='function'||!expectedHTTP503.reason?.trim()))throw Error('Invalid exact synthetic HTTP503 exception');
 const parsedOrigin=new URL(origin),workerURL=new URL('/learning-worker.js',origin).href;
 if(expectedOfflineWorkerUpdate&&(parsedOrigin.protocol!=='http:'||!['127.0.0.1','localhost'].includes(parsedOrigin.hostname)||!parsedOrigin.port||expectedOfflineWorkerUpdate.url!==workerURL||typeof expectedOfflineWorkerUpdate.active!=='function'||!expectedOfflineWorkerUpdate.reason?.trim()||expectedHTTP503?.url===workerURL))throw Error('Invalid exact verified offline worker-update exception');
 const refused='Could not connect to '+parsedOrigin.hostname+': Connection refused',workerFailures=[];let workerSequence=0;
 const expectedWorker=()=>engine==='webkit'&&expectedOfflineWorkerUpdate?.active()===true;
 const recordWorker=(kind,detail)=>{(proof.expectedSyntheticErrors??=[]).push({kind,...detail,phase:'confirmed-origin-stopped-worker-update',reason:expectedOfflineWorkerUpdate.reason});};
 const expected=(url,status)=>expectedHTTP503&&url===expectedHTTP503.url&&status===503&&expectedHTTP503.active()===true;
 const recordExpected=(kind,url)=>{(proof.expectedSyntheticErrors??=[]).push({kind,url,status:503,phase:'source-failure',reason:expectedHTTP503.reason});};
 const own=url=>{try{return new URL(url).origin===origin;}catch{return false;}};
 page.on('console',message=>{if(message.type()!=='error')return;const url=message.location?.().url,text=message.text();if(url&&expected(url,503)&&/(?:status of 503|503 \(Service Unavailable\))/.test(text)){recordExpected('consoleErrors',url);return;}if(url===workerURL&&text==='Failed to load resource: '+refused&&expectedWorker()&&workerFailures.length){const paired=workerFailures.shift();recordWorker('consoleErrors',{url,message:text,pair:paired});return;}proof.consoleErrors.push(tag+text);});
 page.on('requestfailed',request=>{const url=request.url(),error=request.failure()?.errorText;if(url===workerURL&&error===refused&&expectedWorker()&&request.resourceType?.()==='xhr'&&request.isNavigationRequest?.()===false){const pair=++workerSequence;workerFailures.push(pair);recordWorker('failedRequests',{url,error,pair,resourceType:'xhr',isNavigationRequest:false});return;}proof.failedRequests.push({url,error,...(engine?{engine}:{})});});
 page.on('pageerror',error=>proof.errors.push(tag+error.message));
 page.on('response',response=>{const url=response.url(),status=response.status();if(!own(url)||status<400)return;if(expected(url,status)){recordExpected('ownHttpErrors',url);return;}const parsed=new URL(url);proof.ownHttpErrors.push({path:parsed.pathname+parsed.search,status,...(engine?{engine}:{})});});
 page.on('request',request=>{const url=request.url();if(!own(url)&&!url.startsWith('data:')&&!url.startsWith('blob:'))proof.externalRequests.push(tag+url);});
}
