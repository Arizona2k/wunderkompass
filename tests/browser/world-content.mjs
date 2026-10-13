import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
export async function worldContentFlow(browser,base,ready,monitor,report,shots){
 for(const fault of ['identity','partial']){
  const context=await browser.newContext({viewport:{width:320,height:720},serviceWorkers:'block',reducedMotion:'reduce'}),p=await context.newPage();monitor(p);const requested=[];let calls=0;
  p.on('request',r=>{if(/world-content-.*\.json$/.test(r.url()))requested.push(r.url());});
  await p.route('**/world-content-science-*.json',async route=>{calls++;if(calls===1){const data=structuredClone(catalog.filter(t=>t.category==='science'));if(fault==='identity')data[0].title='Ungeprüfte falsche Karte';else data.pop();await route.fulfill({contentType:'application/json',body:JSON.stringify(data)});}else await route.continue();});
  try{
   await p.goto(base+'#world/topic/science-tides');await ready(p);
   await p.getByText('Die Wissenskarten sind gerade nicht erreichbar. Dein Fortschritt bleibt erhalten.',{exact:true}).waitFor();
   assert.equal(await p.locator('.article-atlas').count(),0,'invalid category never renders');assert.equal(calls,1,'failure does not create a request loop');
   await p.screenshot({path:shots+'/world-content-'+fault+'-320.png'});
   await p.getByRole('button',{name:'Wissenskarten erneut laden',exact:true}).click();await p.locator('.tide-comparison').waitFor();assert.equal(calls,2);
   await p.evaluate(()=>location.hash='world/topic/science-moon-phases');await p.locator('.moon-diagram').waitFor();assert.equal(calls,2,'same validated category reused');
   assert.ok(requested.every(url=>/world-content-science-/.test(url)),'no unrelated categories fetched');
   await p.evaluate(()=>location.hash='world/topic/animal-polar-bear');await p.getByRole('heading',{name:'Eisbär',exact:true}).waitFor();assert.equal(await p.locator('.moon-diagram').count(),0,'previous category is not shown during a category change');
   assert.equal(requested.filter(url=>/world-content-animals-/.test(url)).length,1);
   await p.goBack();await p.locator('.moon-diagram').waitFor();assert.equal(calls,2,'Back reuses the checked category');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
  }finally{await context.close();}
 }
 report.checks.push('Demand-loaded category content: no unrelated article data, exact identity/partial-payload rejection, bounded explicit retry, validated reuse, category changes and Back at 320px');
}
