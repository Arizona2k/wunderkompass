// Actual HTML destinations and explicitly downloaded complete PDF originals. No source filter.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {activatedPDFEvidence} from './activated-pdf-source-evidence.mjs';
import {assertHistorySourceMaterial} from './history-source-material.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const next=JSON.parse(await fs.readFile(new URL('../../app/people-inquiries.json',import.meta.url),'utf8')).entries.slice(4,18);
const saveKey='erde-entdecken:save:v3';

// Native230/231 recorded the same HTTP2 REFUSED_STREAM across configured
// archive HTML sources, before any HTTP response. One ordinary same-tab GET
// may recover it; complete real HTTP/body/anchors remain the caller's duty.
const observedRefusedStreamSources=new Set(catalog.flatMap(topic=>topic.sources??[])
 .map(source=>{const u=new URL(source.url);u.hash='';return u;})
 .filter(u=>u.origin==='https://web.archive.org'&&u.pathname.startsWith('/web/')&&!u.pathname.toLowerCase().endsWith('.pdf'))
 .map(u=>u.href));
export async function recoverObservedHTTP2RefusedStream({popup,row,sourceURL,navigationFailures,activationStarted,recordedNavigationResponses,now=()=>performance.now(),pause=ms=>new Promise(resolve=>setTimeout(resolve,ms))}){
 const withoutFragment=value=>{const u=new URL(value);u.hash='';return u.href;};
 const failure=navigationFailures[0],remainingActivationMs=Math.floor(30000-(now()-activationStarted));
 if(row.transientNavigationRecovery||!observedRefusedStreamSources.has(withoutFragment(sourceURL))||navigationFailures.length!==1||
  failure.errorText!=='net::ERR_HTTP2_SERVER_REFUSED_STREAM'||withoutFragment(failure.url)!==withoutFragment(sourceURL)||
  withoutFragment(failure.activatedSourceRoot)!==withoutFragment(sourceURL)||recordedNavigationResponses().length!==0||
  popup.url()!=='chrome-error://chromewebdata/'||!Number.isFinite(remainingActivationMs)||remainingActivationMs<=0||remainingActivationMs>30000)return;
 row.originalNavigationFailures=navigationFailures.map(item=>({...item}));
 row.transientNavigationRecovery={initialURL:popup.url(),initialHTTP:null,initialError:failure.errorText,additionalRequestsMaximum:1,remainingActivationMs,originalActivationBudgetMs:30000,noTimeoutExtension:true,normalBackoffMs:2000};
 if(remainingActivationMs<=2000){row.transientNavigationRecovery.recoveryNotStarted='insufficient original budget for normal backoff';return;}
 await pause(2000);
 const afterBackoff=Math.floor(30000-(now()-activationStarted));
 row.transientNavigationRecovery.remainingActivationMsAfterBackoff=afterBackoff;
 if(afterBackoff<=0){row.transientNavigationRecovery.recoveryNotStarted='original activation budget exhausted';return;}
 await popup.goto(sourceURL,{waitUntil:'domcontentloaded',timeout:afterBackoff});
 row.mainResponses=recordedNavigationResponses();row.actualURL=popup.url();row.actualTitle=await popup.title();
 row.transientNavigationRecovery.finalHTTP=row.mainResponses.at(-1)?.status;
}

// Recover only the four actually observed Cloud-proxy HTML transport messages. This function does not qualify
// a source: the caller still checks real final HTTP, body, opener and progress.
export async function recoverKnownHTMLConnectionTimeout({popup,row,sourceURL,activationStarted,recordedNavigationResponses,now=()=>performance.now(),pause=ms=>new Promise(resolve=>setTimeout(resolve,ms))}){
  let text=await popup.locator('body').innerText();
  const initial=row.mainResponses.at(-1),remainingActivationMs=Math.floor(30000-(now()-activationStarted));
  const sameDocument=initial&&new URL(initial.url).href.split('#')[0]===new URL(popup.url()).href.split('#')[0];
  if(!row.transientNavigationRecovery&&initial?.status===503&&sameDocument&&['upstream connect error or disconnect/reset before headers. reset reason: connection timeout','upstream connect error or disconnect/reset before headers. reset reason: remote connection failure','upstream connect error or disconnect/reset before headers. reset reason: connection termination','upstream connect error or disconnect/reset before headers. reset reason: remote refused stream reset'].includes(text.trim())&&!new URL(sourceURL).pathname.toLowerCase().endsWith('.pdf')&&remainingActivationMs>0){
    row.transientNavigationRecovery={initialHTTP:503,initialURL:row.actualURL,initialBody:text,initialBodySHA256:createHash('sha256').update(text).digest('hex'),additionalRequestsMaximum:1,remainingActivationMs,originalActivationBudgetMs:30000,noTimeoutExtension:true};
    // The observed refused-stream response can persist on an immediate reload.
    // Spend a short normal backoff inside the same original activation budget;
    // never add requests, extend the deadline or accept the transport response.
    row.transientNavigationRecovery.normalBackoffMs=2000;
    if(remainingActivationMs<=2000){row.transientNavigationRecovery.recoveryNotStarted='insufficient original budget for normal backoff';return text;}
    await pause(2000);
    const afterBackoff=Math.floor(30000-(now()-activationStarted));
    row.transientNavigationRecovery.remainingActivationMsAfterBackoff=afterBackoff;
    if(afterBackoff<=0){row.transientNavigationRecovery.recoveryNotStarted='original activation budget exhausted';return text;}
    await popup.reload({waitUntil:'domcontentloaded',timeout:afterBackoff});
    row.mainResponses=recordedNavigationResponses();row.actualURL=popup.url();row.actualTitle=await popup.title();
    text=await popup.locator('body').innerText();row.transientNavigationRecovery.finalHTTP=row.mainResponses.at(-1)?.status;
  }
  return text;
}

// Exact observed LOC document only: full visible article material may precede DOMContentLoaded.
// This does not accept HTTP alone, arbitrary HTML, other sources, PDFs or extra time/requests.
export function observedLeavittMaterialReady(x){
 if(!x||typeof x!=='object')return false;
 const source='https://blogs.loc.gov/inside_adams/2019/12/henriettaleavitt/';
 const normalize=s=>typeof s==='string'?s.replace(/[‘’]/g,"'"):'';
 return x.sourceURL===source&&x.actualURL===source&&x.responseURL===source&&x.httpStatus===200&&x.readyState==='loading'&&
  Number.isFinite(x.elapsedMs)&&x.elapsedMs>=0&&x.elapsedMs<30000&&
  normalize(x.title)==="Henrietta Leavitt, How She Loved the 'Clouds' | Inside Adams"&&
  typeof x.body==='string'&&x.body.length>1000&&normalize(x.body).includes("Henrietta Leavitt, How She Loved the 'Clouds'")&&
  ['Magellanic Clouds','period-luminosity relationship','Periods of 25 Variable Stars','1912'].every(part=>x.body.includes(part));
}
// Exact observed complete BnF Curie article only, not a generic readiness shortcut.
export function observedCurieBnFMaterialReady(x){
 if(!x||typeof x!=='object')return false;
 const source='https://heritage.bnf.fr/france-pologne/maria-sklodowska-curie-1867-1934';
 return x.sourceURL===source&&x.actualURL===source&&x.responseURL===source&&x.httpStatus===200&&x.readyState==='loading'&&
  Number.isFinite(x.elapsedMs)&&x.elapsedMs>=0&&x.elapsedMs<30000&&
  x.title==='Maria Skłodowska-Curie (1867-1934) | Patrimoines Partagés - France Pologne'&&
  typeof x.body==='string'&&x.body.length>5000&&
  ['Maria Skłodowska-Curie (1867-1934)','Janine Trotereau, journaliste','Un parcours scientifique','1903','1911','La Pologne au cœur','Publié en août 2017'].every(part=>x.body.includes(part));
}
// Exact observed UNESCO archive description only; complete main HTML and all
// six relevant factual anchors remain required inside the same30second budget.
export function observedHattushaUNESCOMaterialReady(x){
 if(!x||typeof x!=='object')return false;
 const source='https://www.unesco.org/en/memory-world/hittite-cuneiform-tablets-bogazkoy';
 return x.sourceURL===source&&x.actualURL===source&&x.responseURL===source&&x.httpStatus===200&&x.mainBodyComplete===true&&x.readyState==='loading'&&
  Number.isFinite(x.elapsedMs)&&x.elapsedMs>=0&&x.elapsedMs<30000&&
  x.title==='The Hittite cuneiform tablets from Bogazköy - Memory of the World'&&
  typeof x.body==='string'&&x.body.length>2000&&
  ['cuneiform clay tablets','Hittites','Treaty of Quadesh','religious','literary works'].every(part=>x.body.includes(part))&&/Registration Year:\s*2001/.test(x.body);
}

// Only the two actually observed WHO articles: the complete main HTML, exact
// title/date and all relevant visible material are required before a delayed DOM event.
const WHO_MATERIAL={
 'https://www.who.int/news-room/questions-and-answers/item/traditional-medicine':{
  title:'Traditional medicine',minimumBodyLength:9000,
  anchors:['28 November 2025 | Questions and answers','What is traditional medicine?','position on traditional medicine?','latest scientific evidence','avoid patient harm','establishing efficacy and safety through rigorous scientific validation','Are TCIM products and practices subjected to same scrutiny as modern pharmaceuticals?','pharmacovigilance systems']
 },
 'https://www.who.int/news/item/10-10-2019-the-use-of-non-pharmaceutical-forms-of-artemisia':{
  title:'The use of non-pharmaceutical forms of Artemisia',minimumBodyLength:1800,
  anchors:['10 October 2019','artemisinin-based combination therapies (ACTs)','pure artemisinin compound','WHO position','WHO does not support the promotion or use of','plant material in any form for the prevention or treatment of malaria','hasten the development and spread of artemisinin resistance','Artemisinin in any form does not work well as prevention against malaria.']
 }
};
export function observedWHOMaterialReady(x){
 if(!x||typeof x!=='object')return false;const expected=WHO_MATERIAL[x.sourceURL];
 return !!expected&&x.actualURL===x.sourceURL&&x.responseURL===x.sourceURL&&x.httpStatus===200&&x.mainBodyComplete===true&&x.readyState==='loading'&&
  typeof x.contentType==='string'&&x.contentType.split(';')[0].trim().toLowerCase()==='text/html'&&
  Number.isFinite(x.elapsedMs)&&x.elapsedMs>=0&&x.elapsedMs<30000&&x.title===expected.title&&
  typeof x.body==='string'&&x.body.length>expected.minimumBodyLength&&expected.anchors.every(part=>x.body.includes(part));
}

// Exact two actually observed UNESCO Gutenberg/Jikji documents only. Their
// complete main HTML and all visible factual material were observed while the
// document remained loading. A DOM event alone is not the source-reading goal.
const GUTENBERG_UNESCO_MATERIAL={
 'https://www.unesco.org/en/memory-world/baegun-hwasang-chorok-buljo-jikji-simche-yojeol-volii-second-volume-anthology-great-buddhist-priests?hub=915':{
  title:`Baegun hwasang chorok buljo jikji simche yojeol (vol.II), the second volume of "Anthology of Great Buddhist Priests' Zen Teachings" - Memory of the World`,minimumBodyLength:1400,submissionYear:'2000',
  anchors:['Also known as Jikji','essentials of Zen Buddhism','Heungdeok-sa temple in Cheongju city','using movable metal types in July 1377','some earlier metal type printings were mentioned',"world's oldest movable metal type printing evidence available",'Submitted by: Republic of Korea']
 },
 'https://www.unesco.org/en/memory-world/42-line-gutenberg-bible-printed-vellum-and-its-contemporary-documentary-background':{
  title:'42-line Gutenberg Bible, printed on vellum, and its contemporary documentary background - Memory of the World',minimumBodyLength:1800,submissionYear:'2001',
  anchors:['first book printed in Europe with movable types','From Mainz','unique contemporary documentary context','Goettingen Model Book','Notarial Instrument of Ulrich Helmasperger','Goettingen vellum copy of the Gutenberg Bible','Submitted by: Germany']
 }
};
export function observedGutenbergUNESCOMaterialReady(x){
 if(!x||typeof x!=='object'||!Object.hasOwn(GUTENBERG_UNESCO_MATERIAL,x.sourceURL))return false;
 const expected=GUTENBERG_UNESCO_MATERIAL[x.sourceURL];
 return x.actualURL===x.sourceURL&&x.responseURL===x.sourceURL&&x.httpStatus===200&&x.mainBodyComplete===true&&x.readyState==='loading'&&
  typeof x.contentType==='string'&&x.contentType.split(';')[0].trim().toLowerCase()==='text/html'&&
  Number.isFinite(x.elapsedMs)&&x.elapsedMs>=0&&x.elapsedMs<30000&&x.title===expected.title&&
  typeof x.body==='string'&&x.body.length>expected.minimumBodyLength&&expected.anchors.every(part=>x.body.includes(part))&&
  /Registration Year:\s*2001/.test(x.body)&&new RegExp('Submission Year:\\s*'+expected.submissionYear).test(x.body);
}

async function observedKnownMaterialBeforeDOMContentLoaded({opened,row,sourceURL,activationStarted,recordedNavigationResponses}){
 const pending=()=>new Promise(()=>{});
 if(!['https://blogs.loc.gov/inside_adams/2019/12/henriettaleavitt/','https://heritage.bnf.fr/france-pologne/maria-sklodowska-curie-1867-1934','https://www.unesco.org/en/memory-world/hittite-cuneiform-tablets-bogazkoy',...Object.keys(WHO_MATERIAL),...Object.keys(GUTENBERG_UNESCO_MATERIAL)].includes(sourceURL))return pending();
 try{
  const remaining=Math.floor(30000-(performance.now()-activationStarted));if(remaining<=0)return pending();
  await opened.waitForURL(url=>url.href!==''&&url.href!=='about:blank',{waitUntil:'commit',timeout:remaining});
  while(!opened.isClosed()&&performance.now()-activationStarted<30000){
   const sample=await opened.evaluate(()=>({actualURL:location.href,readyState:document.readyState,title:document.title,body:document.body?.innerText??''}));
   const last=recordedNavigationResponses().at(-1),elapsedMs=performance.now()-activationStarted;
   const actual={...sample,sourceURL,responseURL:last?.url,httpStatus:last?.status,mainBodyComplete:last?.actualMainHTMLResponseCompleted===true,contentType:last?.contentType,elapsedMs};
   if(observedLeavittMaterialReady(actual)||observedCurieBnFMaterialReady(actual)||observedHattushaUNESCOMaterialReady(actual)||observedWHOMaterialReady(actual)||observedGutenbergUNESCOMaterialReady(actual)){
    const unesco=observedHattushaUNESCOMaterialReady(actual),who=observedWHOMaterialReady(actual),gutenberg=observedGutenbergUNESCOMaterialReady(actual);
    row.observedMaterialReadiness={kind:gutenberg?'exact known complete visible UNESCO Gutenberg/Jikji material before DOMContentLoaded':observedLeavittMaterialReady(actual)?'exact known visible LOC article material before DOMContentLoaded':unesco?'exact known visible UNESCO Hattusha archive material before DOMContentLoaded':who?'exact known visible WHO article material before DOMContentLoaded':'exact known visible BnF Curie article material before DOMContentLoaded',actualURL:actual.actualURL,responseURL:actual.responseURL,httpStatus:actual.httpStatus,title:actual.title,documentReadyState:actual.readyState,elapsedMs,actualBodyLength:actual.body.length,actualBodySHA256:createHash('sha256').update(actual.body).digest('hex'),...(gutenberg?{allActualGutenbergUNESCOFactualAnchorsPresent:true,actualMainHTMLResponseCompleted:true,sourceApprovalClaimed:false}:observedLeavittMaterialReady(actual)?{allFourActualFactualAnchorsPresent:true}:unesco?{allSixActualUNESCOFactualAnchorsPresent:true,actualMainHTMLResponseCompleted:true}:who?{allEightActualWHOFactualAnchorsPresent:true,actualMainHTMLResponseCompleted:true}:{allSevenActualBnFArticleAnchorsPresent:true}),domContentLoadedNotClaimed:true,originalActivationBudgetMs:30000,noTimeoutExtension:true,noAdditionalRequests:true};
    return {popup:opened};
   }
   await new Promise(resolve=>setTimeout(resolve,200));
  }
 }catch(error){if(!opened.isClosed())row.observedMaterialReadinessDeficit=error.message;}
 return pending();
}

// Actual public source tab and close/return, not an href-only source check.
// A blocked external destination is retained as an access deficit, never green.
export async function actualPeopleSourceActivation(page,{ids=next.map(e=>e.id),pdfOutputDirectory,observations=[]}={}) {
  const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,saveKey);
  const initial=await page.evaluate(()=>location.hash);
  for(const id of ids) {
    const topic=catalog.find(t=>t.id===id);assert(topic?.sources?.length);
    await page.evaluate(id=>location.hash='world/topic/'+id,id);
    const article=page.locator('.world-article');await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();
    const disclosure=article.locator('.world-sources');if(!await disclosure.evaluate(e=>e.open))await disclosure.locator(':scope > summary').click();
    for(const source of topic.sources) {
      const link=disclosure.getByRole('link',{name:source.label,exact:true});await link.scrollIntoViewIfNeeded();await link.focus();
      assert.equal(await link.getAttribute('href'),source.url);
      assert.equal(await link.getAttribute('target'),'_blank');
      assert((await link.getAttribute('rel')??'').split(/\s+/).includes('noreferrer'),'external source does not disclose the local app route');
      const parentBefore=await page.evaluate(()=>({hash:location.hash,scrollY}));
      // The first popup response can precede creation of its Frame. Retain the
      // actual navigation Response/Request first, then associate it with the
      // opened tab through its frame or exact activated redirect-chain root.
      const navigationResponses=[],observe=response=>{const request=response.request();if(request.isNavigationRequest()){const item={response,request,url:response.url(),status:response.status()};navigationResponses.push(item);if(item.url==='https://www.unesco.org/en/memory-world/hittite-cuneiform-tablets-bogazkoy'||Object.hasOwn(WHO_MATERIAL,item.url)||Object.hasOwn(GUTENBERG_UNESCO_MATERIAL,item.url))response.finished().then(error=>{item.actualMainHTMLResponseCompleted=error==null;},()=>{item.actualMainHTMLResponseCompleted=false;});}};
      const row={id,label:source.label,requested:source.url,status:'external access not yet qualified',mainResponses:[]};observations.push(row);
      let popup,timer;
      const withoutFragment=value=>{const u=new URL(value);u.hash='';return u.href;};
      // Keep the original transport reason when a failed source navigation
      // reaches chrome-error before any HTTP response exists. Recording does
      // not qualify a failed load or alter its existing deadline/assertions.
      const navigationFailures=[],observeNavigationFailure=request=>{
        if(!request.isNavigationRequest())return;
        let root=request;while(root.redirectedFrom())root=root.redirectedFrom();
        if(withoutFragment(root.url())===withoutFragment(source.url))navigationFailures.push({url:request.url(),activatedSourceRoot:root.url(),errorText:request.failure()?.errorText??null});
      };
      // Preserve already observed HTTP responses even if DOM readiness later
      // times out. A response alone never establishes a successful source load.
      const recordedNavigationResponses=()=>navigationResponses.flatMap(({response,request,url,status,actualMainHTMLResponseCompleted})=>{
        let association;
        try{const frame=response.frame();if(frame.page()===popup&&frame.parentFrame()===null)association='actual popup main frame';}catch{/* Native download navigation may have no retained Frame. */}
        if(!association){let root=request;while(root.redirectedFrom())root=root.redirectedFrom();if(withoutFragment(root.url())===withoutFragment(source.url))association='actual exact activated source navigation redirect chain';}
        return association?[{url,status,association,contentType:response.headers()['content-type']??null,contentLength:response.headers()['content-length']??null,contentEncoding:response.headers()['content-encoding']??null,...(actualMainHTMLResponseCompleted===undefined?{}:{actualMainHTMLResponseCompleted})}]:[];
      });
      const openedPages=[],downloadPages=new Set();
      let resolveDownload,resolvePopup;
      const normalDownload=new Promise(resolve=>{resolveDownload=resolve;});
      const firstPopup=new Promise(resolve=>{resolvePopup=resolve;});
      const observeDownload=download=>resolveDownload(download);
      const watchDownload=opened=>{if(!downloadPages.has(opened)){downloadPages.add(opened);opened.on('download',observeDownload);}};
      const observePage=opened=>{openedPages.push(opened);watchDownload(opened);};
      const observePopup=opened=>{popup=opened;resolvePopup(opened);};
      watchDownload(page);page.context().on('page',observePage);page.on('popup',observePopup);
      page.context().on('response',observe);
      page.context().on('requestfailed',observeNavigationFailure);
      try {
        // Headless Chromium normally downloads PDFs and leaves a blank popup.
        // Observe the real Enter action's download before it can precede popup
        // creation; retain the same30s bound and the ordinary viewer path.
        const downloaded=normalDownload.then(download=>({download}));
        const activationStarted=performance.now();
        const destination=Promise.race([downloaded,firstPopup.then(opened=>Promise.race([downloaded,opened.waitForURL(url=>url.href!==''&&url.href!=='about:blank',{waitUntil:'domcontentloaded'}).then(()=>({popup:opened})),observedKnownMaterialBeforeDOMContentLoaded({opened,row,sourceURL:source.url,activationStarted,recordedNavigationResponses})]))]);
        await page.keyboard.press('Enter');
        const activated=await Promise.race([destination,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Actual source popup or native download did not complete in30s')),30000);})]);clearTimeout(timer);
        if(!activated.download)await recoverObservedHTTP2RefusedStream({popup,row,sourceURL:source.url,navigationFailures,activationStarted,recordedNavigationResponses});
        row.mainResponses=recordedNavigationResponses();row.actualURL=activated.download?activated.download.url():popup.url();row.actualTitle=activated.download?activated.download.suggestedFilename():await popup.title();
        const sourceResponse=row.mainResponses.at(-1);
        if(activated.download)assert.equal(sourceResponse?.contentType?.split(';')[0].trim().toLowerCase(),'application/pdf','native download requires its actual PDF navigation response');
        if(sourceResponse?.contentType?.split(';')[0].trim().toLowerCase()==='application/pdf'){
          assert(sourceResponse.status>=200&&sourceResponse.status<300&&sourceResponse.status!==206,'complete actual source response');
          assert(pdfOutputDirectory,'Explicit original-PDF evidence directory required');
          if(!activated.download){await popup.close();popup=null;}await page.bringToFront();
          if(!activated.download){const returned=await page.evaluate(()=>({hash:location.hash,scrollY}));assert.equal(returned.hash,parentBefore.hash);assert(Math.abs(returned.scrollY-parentBefore.scrollY)<=2);assert.equal(await link.evaluate(e=>document.activeElement===e),true,'normal PDF viewer returns to exact source opener');}
          await fs.mkdir(pdfOutputDirectory,{recursive:true});const file=path.join(pdfOutputDirectory,id+'-'+createHash('sha256').update(source.url).digest('hex').slice(0,12)+'.pdf');const reserved=await fs.open(file,'wx');await reserved.close();
          let download=activated.download;
          if(!download){const pendingDownload=page.waitForEvent('download');await link.click({modifiers:['Alt']});download=await pendingDownload;}await download.saveAs(file);
          const body=await fs.readFile(file);row.actualPDF={...activatedPDFEvidence({requested:source.url,actualURL:row.actualURL,httpStatus:sourceResponse.status,contentType:sourceResponse.contentType,contentLength:sourceResponse.contentLength,contentEncoding:sourceResponse.contentEncoding,downloadURL:download.url(),downloadFailure:await download.failure(),body,activationMode:activated.download?'native-download':'viewer',actualAnchorDownloadObserved:!!activated.download,activationHTTPResponseURL:sourceResponse.url}),file,downloadURL:download.url(),suggestedFilename:download.suggestedFilename(),normalPDFViewerReturnChecked:!activated.download};
          row.status='actual source destination loaded; passage review remains separate';
        }else{
        let text=await recoverKnownHTMLConnectionTimeout({popup,row,sourceURL:source.url,activationStarted,recordedNavigationResponses});
        const initialHTTP=row.mainResponses.at(-1)?.status;
        if(text.length<=200&&initialHTTP>=200&&initialHTTP<300){
          await popup.waitForFunction(()=>document.body?.innerText.length>200);
          text=await popup.locator('body').innerText();row.actualURL=popup.url();row.actualTitle=await popup.title();
        }
        row.actualBodyLength=text.length;row.actualBodySHA256=createHash('sha256').update(text).digest('hex');row.actualBodyBeginning=text.trim().slice(0,180);
        const last=row.mainResponses.at(-1);row.status=!last||withoutFragment(last.url)!==withoutFragment(row.actualURL)?'final source HTTP response not established':last.status>=400?'blocked external HTTP '+last.status:last.status<200||last.status>=300?'unexpected final source HTTP '+last.status:/^(?:access denied|forbidden|just a moment|attention required)/i.test(row.actualTitle.trim())?'external challenge page':text.length>200?'actual source destination loaded; passage review remains separate':'insufficient source body';
        row.actualNamedHistoryMaterial=assertHistorySourceMaterial({requested:source.url,actualURL:row.actualURL,responseURL:last?.url,httpStatus:last?.status,contentType:last?.contentType,title:row.actualTitle,body:text});
        }
      } catch(error) {row.mainResponses=recordedNavigationResponses();row.actualURL=popup?.url()??row.actualURL??null;row.status='external navigation/load deficit';row.failure=error.message;row.originalNavigationFailures=[...navigationFailures];}
      finally {
        clearTimeout(timer);page.context().off('response',observe);page.context().off('requestfailed',observeNavigationFailure);page.context().off('page',observePage);page.off('popup',observePopup);for(const opened of downloadPages)opened.off('download',observeDownload);
        for(const opened of new Set([...openedPages,...(popup?[popup]:[])]))if(!opened.isClosed())await opened.close();await page.bringToFront();await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();
        const actual=await page.evaluate(()=>({hash:location.hash,scrollY}));assert.equal(actual.hash,parentBefore.hash);assert(Math.abs(actual.scrollY-parentBefore.scrollY)<=2,'closing source preserves actual reading position');
        assert.equal(await link.evaluate(e=>e===document.activeElement),true,'closing actual source returns to its exact opener');row.actualSourceOpenerAndReadingPositionPreserved=true;
      }
    }
  }
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,saveKey),before,'actual external source activation preserves the entire imported progress');
  await page.evaluate(hash=>location.hash=hash,initial);
  return {status:observations.every(r=>r.status==='actual source destination loaded; passage review remains separate')?'actual destinations loaded, separate factual passages retained':'external access deficits remain explicit',observations};
}
