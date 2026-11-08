// Actual HTML destinations and explicitly downloaded complete PDF originals. No source filter.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {activatedPDFEvidence} from './activated-pdf-source-evidence.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const next=JSON.parse(await fs.readFile(new URL('../../app/people-inquiries.json',import.meta.url),'utf8')).entries.slice(4,18);
const saveKey='erde-entdecken:save:v3';

// Recover only the two actually observed Cloud-proxy HTML transport messages. This function does not qualify
// a source: the caller still checks real final HTTP, body, opener and progress.
export async function recoverKnownHTMLConnectionTimeout({popup,row,sourceURL,activationStarted,recordedNavigationResponses,now=()=>performance.now()}){
  let text=await popup.locator('body').innerText();
  const initial=row.mainResponses.at(-1),remainingActivationMs=Math.floor(30000-(now()-activationStarted));
  const sameDocument=initial&&new URL(initial.url).href.split('#')[0]===new URL(popup.url()).href.split('#')[0];
  if(initial?.status===503&&sameDocument&&['upstream connect error or disconnect/reset before headers. reset reason: connection timeout','upstream connect error or disconnect/reset before headers. reset reason: remote connection failure'].includes(text.trim())&&!new URL(sourceURL).pathname.toLowerCase().endsWith('.pdf')&&remainingActivationMs>0){
    row.transientNavigationRecovery={initialHTTP:503,initialURL:row.actualURL,initialBody:text,initialBodySHA256:createHash('sha256').update(text).digest('hex'),additionalRequestsMaximum:1,remainingActivationMs,originalActivationBudgetMs:30000,noTimeoutExtension:true};
    await popup.reload({waitUntil:'domcontentloaded',timeout:remainingActivationMs});
    row.mainResponses=recordedNavigationResponses();row.actualURL=popup.url();row.actualTitle=await popup.title();
    text=await popup.locator('body').innerText();row.transientNavigationRecovery.finalHTTP=row.mainResponses.at(-1)?.status;
  }
  return text;
}

// Actual public source tab and close/return, not an href-only source check.
// A blocked external destination is retained as an access deficit, never green.
export async function actualPeopleSourceActivation(page,{ids=next.map(e=>e.id),pdfOutputDirectory}={}) {
  const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,saveKey);
  const initial=await page.evaluate(()=>location.hash),observations=[];
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
      const navigationResponses=[],observe=response=>{const request=response.request();if(request.isNavigationRequest())navigationResponses.push({response,request,url:response.url(),status:response.status()});};
      const row={id,label:source.label,requested:source.url,status:'external access not yet qualified',mainResponses:[]};observations.push(row);
      let popup,timer;
      const withoutFragment=value=>{const u=new URL(value);u.hash='';return u.href;};
      // Preserve already observed HTTP responses even if DOM readiness later
      // times out. A response alone never establishes a successful source load.
      const recordedNavigationResponses=()=>navigationResponses.flatMap(({response,request,url,status})=>{
        let association;
        try{const frame=response.frame();if(frame.page()===popup&&frame.parentFrame()===null)association='actual popup main frame';}catch{/* Native download navigation may have no retained Frame. */}
        if(!association){let root=request;while(root.redirectedFrom())root=root.redirectedFrom();if(withoutFragment(root.url())===withoutFragment(source.url))association='actual exact activated source navigation redirect chain';}
        return association?[{url,status,association,contentType:response.headers()['content-type']??null,contentLength:response.headers()['content-length']??null,contentEncoding:response.headers()['content-encoding']??null}]:[];
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
      try {
        // Headless Chromium normally downloads PDFs and leaves a blank popup.
        // Observe the real Enter action's download before it can precede popup
        // creation; retain the same30s bound and the ordinary viewer path.
        const downloaded=normalDownload.then(download=>({download}));
        const destination=Promise.race([downloaded,firstPopup.then(opened=>Promise.race([downloaded,opened.waitForURL(url=>url.href!==''&&url.href!=='about:blank',{waitUntil:'domcontentloaded'}).then(()=>({popup:opened}))]))]);
        const activationStarted=performance.now();
        await page.keyboard.press('Enter');
        const activated=await Promise.race([destination,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Actual source popup or native download did not complete in30s')),30000);})]);clearTimeout(timer);
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
        }
      } catch(error) {row.mainResponses=recordedNavigationResponses();row.actualURL=popup?.url()??row.actualURL??null;row.status='external navigation/load deficit';row.failure=error.message;}
      finally {
        clearTimeout(timer);page.context().off('response',observe);page.context().off('page',observePage);page.off('popup',observePopup);for(const opened of downloadPages)opened.off('download',observeDownload);
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
