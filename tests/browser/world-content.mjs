import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
await import('../../scripts/test-runtime.mjs');
const {createSave,SAVE_KEY}=await import('../../app/progress-storage.ts');
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
 await gameContentFlow(browser,base,ready,monitor,report,shots);
}

async function gameContentFlow(browser,base,ready,monitor,report,shots){
 const games=[['knowledge-challenge',null],['animal-detective','animals'],['habitats','animals'],['food','animals'],['records','animals'],['chronology','history'],['people','people'],['technology','inventions'],['then-now','inventions']];
 for(const width of [320,1440]){
  const c=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);const requests=[];
  const pass=createSave(),items=catalog.filter(t=>t.animal).slice(0,5).map(t=>t.id);pass.progress.favorites=['topic:science-pressure'];pass.progress.gameSessions['world:animal-detective']={items,index:2};
  await c.addInitScript(({pass,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));},{pass,key:SAVE_KEY});
  p.on('request',r=>{const category=r.url().match(/world-content-([a-z]+)-.*\.json$/)?.[1];if(category)requests.push(category);});
  let animalAttempts=0;await p.route('**/world-content-animals-*.json',async route=>{animalAttempts++;if(animalAttempts===1)await route.fulfill({json:catalog.filter(t=>t.animal).slice(1)});else await route.continue();});
  try{
   await p.goto(base+'#games');await ready(p);await p.locator('.playground-grid').waitFor();assert.deepEqual(requests,[],'catalog view needs no card texts');
   const loaded=new Set();for(const [id,category] of games){const before=requests.length;await p.locator('[data-game-key="world:'+id+'"]').click();
    if(id==='animal-detective'){
     await p.getByText('Das Spielwissen ist gerade nicht erreichbar. Deine gespeicherte Runde bleibt erhalten.',{exact:true}).waitFor();assert.equal(await p.getByRole('button',{name:'Alle Spiele',exact:true}).isEnabled(),true,'error retains exit');assert.equal(animalAttempts,1);await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:shots+'/game-content-error-'+width+'.png'});
     await p.getByRole('button',{name:'Spielwissen erneut laden',exact:true}).click();await p.locator('.world-game-room .quiz-answers').waitFor();assert.equal(animalAttempts,2);await p.getByText('AUFGABE 3 VON 5',{exact:true}).waitFor();
     const saved=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.deepEqual(saved.gameSessions['world:animal-detective'].items,items);assert.equal(saved.gameSessions['world:animal-detective'].index,2);assert.deepEqual(saved.favorites,pass.progress.favorites);
    }else if(id==='knowledge-challenge')await p.locator('.knowledge-challenge .challenge-levels').waitFor();else if(id==='chronology')await p.locator('.chronology-order').waitFor();else await p.locator('.world-game-room .quiz-answers').waitFor();
    const added=requests.slice(before);assert.ok(added.every(c=>c===category),id+' never loads unrelated categories');if(category){assert.equal(added.length,loaded.has(category)?0:id==='animal-detective'?2:1);loaded.add(category);}else assert.deepEqual(added,[],'compact challenge needs no category JSON');
    await p.getByRole('button',{name:'Alle Spiele',exact:true}).click();await p.locator('.playground-grid').waitFor();
   }
   assert.deepEqual([...loaded],['animals','history','people','inventions']);(report.gameContentDemand??=[]).push({width,games:games.length,challengeCategoryRequests:0,firstAnimalRequestsIncludingRetry:animalAttempts,categories:[...loaded],preservedSavedRound:true,exitDuringFailure:true});
  }finally{await c.close();}
 }
 // A genuinely unavailable category must still permit leaving the game.
 const c=await browser.newContext({viewport:{width:320,height:720},serviceWorkers:'block'}),p=await c.newPage();monitor(p);
 try{await p.route('**/world-content-animals-*.json',route=>route.fulfill({json:[]}));await p.goto(base+'#games');await ready(p);await p.locator('[data-game-key="world:animal-detective"]').click();await p.getByRole('button',{name:'Spielwissen erneut laden',exact:true}).waitFor();await p.getByRole('button',{name:'Alle Spiele',exact:true}).click();await p.locator('.playground-grid').waitFor();}finally{await c.close();}
 report.checks.push('All nine world games at320/1440: zero category JSON for catalog/challenge, only needed categories once, corrupt data withheld, bounded retry retains old round/favorite, exit works even without recovery');
}
