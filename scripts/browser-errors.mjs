export const BROWSER_ERROR_FIELDS=['errors','consoleErrors','failedRequests','ownHttpErrors','externalRequests'];
export const browserErrorArrays=()=>Object.fromEntries(BROWSER_ERROR_FIELDS.map(key=>[key,[]]));
export const browserErrorsComplete=proof=>BROWSER_ERROR_FIELDS.every(key=>Array.isArray(proof?.[key])&&proof[key].length===0);

// Shared by actual Chromium/Firefox/WebKit pages. The one optional exception is
// the isolated fixture's exact required-asset503 while that failure is active.
export function monitorBrowserErrors(page,base,proof,{engine,expectedHTTP503}={}){
 if(!BROWSER_ERROR_FIELDS.every(key=>Array.isArray(proof[key])))throw Error('Missing browser error evidence arrays');
 const origin=new URL(base).origin,tag=engine?'['+engine+'] ':'';
 if(expectedHTTP503&&(new URL(expectedHTTP503.url).origin!==origin||typeof expectedHTTP503.active!=='function'||!expectedHTTP503.reason?.trim()))throw Error('Invalid exact synthetic HTTP503 exception');
 const expected=(url,status)=>expectedHTTP503&&url===expectedHTTP503.url&&status===503&&expectedHTTP503.active()===true;
 const recordExpected=(kind,url)=>{(proof.expectedSyntheticErrors??=[]).push({kind,url,status:503,phase:'source-failure',reason:expectedHTTP503.reason});};
 const own=url=>{try{return new URL(url).origin===origin;}catch{return false;}};
 page.on('console',message=>{if(message.type()!=='error')return;const url=message.location?.().url,text=message.text();if(url&&expected(url,503)&&/(?:status of 503|503 \(Service Unavailable\))/.test(text)){recordExpected('consoleErrors',url);return;}proof.consoleErrors.push(tag+text);});
 page.on('requestfailed',request=>proof.failedRequests.push({url:request.url(),error:request.failure()?.errorText,...(engine?{engine}:{})}));
 page.on('pageerror',error=>proof.errors.push(tag+error.message));
 page.on('response',response=>{const url=response.url(),status=response.status();if(!own(url)||status<400)return;if(expected(url,status)){recordExpected('ownHttpErrors',url);return;}const parsed=new URL(url);proof.ownHttpErrors.push({path:parsed.pathname+parsed.search,status,...(engine?{engine}:{})});});
 page.on('request',request=>{const url=request.url();if(!own(url)&&!url.startsWith('data:')&&!url.startsWith('blob:'))proof.externalRequests.push(tag+url);});
}
