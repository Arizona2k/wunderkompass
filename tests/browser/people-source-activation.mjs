// Actual HTML destinations and explicitly downloaded complete PDF originals. No source filter.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {activatedPDFEvidence} from './activated-pdf-source-evidence.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const next=JSON.parse(await fs.readFile(new URL('../../app/people-inquiries.json',import.meta.url),'utf8')).entries.slice(4,18);
const saveKey='erde-entdecken:save:v3';

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
      let popup;
      page.context().on('response',observe);
      try {
        const popupPromise=page.waitForEvent('popup');await page.keyboard.press('Enter');popup=await popupPromise;
        await popup.waitForURL(url=>url.href!=='about:blank',{waitUntil:'domcontentloaded'});
        const withoutFragment=value=>{const u=new URL(value);u.hash='';return u.href;};
        row.mainResponses=navigationResponses.flatMap(({response,request,url,status})=>{
          try{const frame=response.frame();return frame.page()===popup&&frame.parentFrame()===null?[{url,status,association:'actual popup main frame',contentType:response.headers()['content-type']??null,contentLength:response.headers()['content-length']??null,contentEncoding:response.headers()['content-encoding']??null}]:[];}
          catch(error){
            if(!error.message.includes('issued before the frame is created'))return [];
            let root=request;while(root.redirectedFrom())root=root.redirectedFrom();
            return withoutFragment(root.url())===withoutFragment(source.url)?[{url,status,association:'actual initial navigation before Frame creation; exact activated source redirect chain',contentType:response.headers()['content-type']??null,contentLength:response.headers()['content-length']??null,contentEncoding:response.headers()['content-encoding']??null}]:[];
          }
        });row.actualURL=popup.url();row.actualTitle=await popup.title();
        const sourceResponse=row.mainResponses.at(-1);
        if(sourceResponse?.contentType?.split(';')[0].trim().toLowerCase()==='application/pdf'){
          assert(sourceResponse.status>=200&&sourceResponse.status<300&&sourceResponse.status!==206,'complete actual source response');
          assert(pdfOutputDirectory,'Explicit original-PDF evidence directory required');
          await popup.close();popup=null;await page.bringToFront();
          const returned=await page.evaluate(()=>({hash:location.hash,scrollY}));assert.equal(returned.hash,parentBefore.hash);assert(Math.abs(returned.scrollY-parentBefore.scrollY)<=2);assert.equal(await link.evaluate(e=>document.activeElement===e),true,'normal PDF viewer returns to exact source opener');
          await fs.mkdir(pdfOutputDirectory,{recursive:true});const file=path.join(pdfOutputDirectory,id+'-'+createHash('sha256').update(source.url).digest('hex').slice(0,12)+'.pdf');const reserved=await fs.open(file,'wx');await reserved.close();
          const pendingDownload=page.waitForEvent('download');await link.click({modifiers:['Alt']});const download=await pendingDownload;await download.saveAs(file);
          const body=await fs.readFile(file);row.actualPDF={...activatedPDFEvidence({requested:source.url,actualURL:row.actualURL,httpStatus:sourceResponse.status,contentType:sourceResponse.contentType,contentLength:sourceResponse.contentLength,contentEncoding:sourceResponse.contentEncoding,downloadURL:download.url(),downloadFailure:await download.failure(),body}),file,downloadURL:download.url(),suggestedFilename:download.suggestedFilename(),normalPDFViewerReturnChecked:true};
          row.status='actual source destination loaded; passage review remains separate';
        }else{
        let text=await popup.locator('body').innerText();
        const initialHTTP=row.mainResponses.at(-1)?.status;
        if(text.length<=200&&initialHTTP>=200&&initialHTTP<300){
          await popup.waitForFunction(()=>document.body?.innerText.length>200);
          text=await popup.locator('body').innerText();row.actualURL=popup.url();row.actualTitle=await popup.title();
        }
        row.actualBodyLength=text.length;row.actualBodySHA256=createHash('sha256').update(text).digest('hex');row.actualBodyBeginning=text.trim().slice(0,180);
        const last=row.mainResponses.at(-1);row.status=!last||withoutFragment(last.url)!==withoutFragment(row.actualURL)?'final source HTTP response not established':last.status>=400?'blocked external HTTP '+last.status:last.status<200||last.status>=300?'unexpected final source HTTP '+last.status:/^(?:access denied|forbidden|just a moment|attention required)/i.test(row.actualTitle.trim())?'external challenge page':text.length>200?'actual source destination loaded; passage review remains separate':'insufficient source body';
        }
      } catch(error) {row.actualURL=popup?.url()??row.actualURL??null;row.status='external navigation/load deficit';row.failure=error.message;}
      finally {
        page.context().off('response',observe);if(popup&&!popup.isClosed())await popup.close();await page.bringToFront();await article.getByRole('heading',{name:topic.title,exact:true}).waitFor();
        const actual=await page.evaluate(()=>({hash:location.hash,scrollY}));assert.equal(actual.hash,parentBefore.hash);assert(Math.abs(actual.scrollY-parentBefore.scrollY)<=2,'closing source preserves actual reading position');
        assert.equal(await link.evaluate(e=>e===document.activeElement),true,'closing actual source returns to its exact opener');row.actualSourceOpenerAndReadingPositionPreserved=true;
      }
    }
  }
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,saveKey),before,'actual external source activation preserves the entire imported progress');
  await page.evaluate(hash=>location.hash=hash,initial);
  return {status:observations.every(r=>r.status==='actual source destination loaded; passage review remains separate')?'actual destinations loaded, separate factual passages retained':'external access deficits remain explicit',observations};
}
