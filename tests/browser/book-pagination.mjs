// Canonical finite pagination proof shared by existing lazy-study network checks.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const words=JSON.parse(await fs.readFile(new URL('../../exports/content/knowledge-words.json',import.meta.url),'utf8')).map(row=>row.term);
export async function revealBookWords(page,requested){
 assert(words.length>0);assert.equal(new Set(words).size,words.length);
 assert(requested.length>0);assert.equal(new Set(requested).size,requested.length);
 for(const term of requested)assert(words.includes(term),'requested pagination target is canonical: '+term);
 const headings=page.locator('.word-card h3'),button=page.getByRole('button',{name:/^Weitere Wörter entdecken/}),counts=[];
 let visible=Math.min(24,words.length),clicks=0;
 await page.waitForFunction(expected=>document.querySelectorAll('.word-card h3').length===expected,visible);
 assert.deepEqual(await headings.allTextContents(),words.slice(0,visible),'initial unfiltered canonical24-word page');counts.push(visible);
 while(!requested.every(term=>words.slice(0,visible).includes(term))){
  assert(clicks<Math.ceil((words.length-24)/24),'finite canonical word pagination bound');
  assert.equal(await button.innerText(),'Weitere Wörter entdecken ('+(words.length-visible)+')');
  await button.click();visible=Math.min(visible+24,words.length);clicks++;
  await page.waitForFunction(expected=>document.querySelectorAll('.word-card h3').length===expected,visible);
  assert.deepEqual(await headings.allTextContents(),words.slice(0,visible),'each real click exposes the exact next24 canonical words');counts.push(visible);
 }
 for(const term of requested)assert.equal(await page.locator('.word-card').filter({has:page.getByRole('heading',{name:term,exact:true})}).count(),1,'requested canonical card is actually visible');
 if(visible===words.length)assert.equal(await button.count(),0,'no further-page button after complete actual collection');
 return{canonicalWords:words.length,requested,visibleCounts:counts,actualClicks:clicks,exactOrderedCanonicalPrefixes:true};
}
