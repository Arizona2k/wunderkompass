import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {captureNativeViewport} from './native-screenshot.mjs';
const incoming=JSON.parse(await fs.readFile(new URL('../../app/book-light-word-link-index.json',import.meta.url),'utf8'));
const words=JSON.parse(await fs.readFile(new URL('../../exports/content/knowledge-words.json',import.meta.url),'utf8'));

export async function bookRelatedWordView(page,report,width,{large=false,native=false,offline=false,shots=null,engine='chromium',captureSession=null}={}){
 const rows=[];
 for(const [term,links]of Object.entries(incoming)){
  await page.evaluate(term=>location.hash='book/words/'+encodeURIComponent(term),term);await page.waitForFunction(term=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value===term,term);
  const card=page.locator('.word-card').filter({has:page.getByRole('heading',{name:term,exact:true})});await card.getByText(words.find(w=>w.term===term).more,{exact:true}).waitFor();
  const related=card.locator('[data-book-related-words]'),summary=related.locator(':scope>summary');await related.waitFor();if(!await related.evaluate(e=>e.open)){await summary.focus();await page.keyboard.press('Enter');}
  assert.deepEqual(await related.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),links.map(l=>'#book/words/'+encodeURIComponent(l.term)));
  for(const link of links){
   await related.getByText(link.reason,{exact:true}).waitFor();const target=related.locator('a[href="#book/words/'+encodeURIComponent(link.term)+'"]');await target.focus();assert(await target.evaluate(e=>e.matches(':focus-visible')));
   const bounds=await target.evaluate(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,height:r.height,width:r.width};});assert(bounds.left>=-2&&bounds.right<=width+2&&bounds.width>=44&&bounds.height>=44,'old word reverse link reflows with a44px keyboard target');
   if(shots&&(!offline||native)){const file=path.join(shots,`journey-engine-${engine}-book-related-${Object.keys(incoming).indexOf(term)}-${native?'native200-':''}${offline?'cold':'online'}-${width}.png`);await related.scrollIntoViewIfNeeded();if(native)await captureNativeViewport(page,file,{cdp:captureSession});else await related.screenshot({path:file,animations:'disabled'});}
   await page.keyboard.press('Enter');await page.waitForFunction(term=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value===term,link.term);await page.locator('.word-card h3').filter({hasText:link.term}).waitFor();
   await page.goBack();await card.waitFor();await page.waitForFunction(({term,target})=>document.querySelector('[data-book-related-words="'+term+'"]')?.open&&document.activeElement?.dataset.routeFocus==='book-word-related-'+term+'-'+target,{term,target:link.term});assert(await target.evaluate(e=>e.matches(':focus-visible')),'Back restores the actual original keyboard link without test refocusing');
   rows.push({term,target:link.term,width,large,native,offline,canonicalForwardRelation:true,actualKeyboardNavigationAndBackFocus:true,oldDefinitionPreserved:true});
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
 }
 assert.equal(rows.length,4);(report.bookRelatedWords??=[]).push(...rows);return rows;
}
