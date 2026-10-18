import assert from 'node:assert/strict';
import photos from '../../app/world-photos.json' with {type:'json'};
import topics from '../../app/world-catalog.json' with {type:'json'};
import {prepareAxe} from './axe-loader.mjs';

export async function worldPhotoFlow(browser,base,ready,monitor,report,shots){
 const started=performance.now(),observed=[];
 async function inspect(page,id){
  const photo=photos[id],topic=topics.find(t=>t.image===id);assert.ok(topic,id);
  await page.evaluate(id=>location.hash='world/topic/'+id,topic.id);
  await page.waitForFunction(({src,alt})=>{const image=document.querySelector('.world-article .world-photo img');return image?.getAttribute('src')===src&&image?.alt===alt;},{src:photo.src,alt:photo.alt_de});
  const figure=page.locator('.world-article .world-photo').first();await figure.locator('img').scrollIntoViewIfNeeded();await figure.locator('img').evaluate(image=>image.decode());
  assert.ok((await figure.innerText()).includes(photo.author),id+' author');
  assert.equal(await figure.getByRole('link',{name:photo.license,exact:true}).getAttribute('href'),photo.license_url);
  await figure.getByText('Bildquelle & Bearbeitung',{exact:true}).click();
  assert.equal(await figure.getByRole('link',{name:'Original und Rechte',exact:true}).getAttribute('href'),photo.source_page_url);
  await figure.getByText(photo.transformations_de,{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,id+' overflow');
  return figure;
 }
 for(const width of [320,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();monitor(page);page.setDefaultTimeout(20000);let requests=0;
  page.on('request',request=>{if(/world-photos-.*\.json/.test(request.url()))requests++;});
  try{
   await page.goto(base);await ready(page);assert.equal(requests,0,'Home has immediate complete credits without the deferred catalog');
   for(const id of Object.keys(photos)){const figure=await inspect(page,id);observed.push({id,width});if(['jaguar','western-lowland-gorilla'].includes(id))await figure.screenshot({path:shots+'/animal-photo-retained-'+id+'-'+width+'.png'});if(id==='whale-shark')await figure.screenshot({path:shots+'/animal-photo-rights-'+width+'.png'});}
   assert.equal(requests,1,'One verified metadata request shared by all49 pictures');
  }finally{await context.close();}
 }
 // Clicking the photograph must keep the enclosing card as the history opener.
 // A tabindex on the decorative figure steals this focus and breaks real Back.
 for(const width of [320,1440]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===320,reducedMotion:'reduce'}),page=await context.newPage();monitor(page);page.setDefaultTimeout(20000);
  try{
   await page.goto(base+'/#world');await ready(page);
   for(const category of ['animals','history','people','buildings']){
    const key='world-category-'+category,card=page.locator('.world-view [data-route-focus="'+key+'"]');
    assert.equal(await card.locator('.world-photo[tabindex],.world-photo [tabindex],.world-photo button,.world-photo a').count(),0,'compact photograph never creates an interactive child inside its card');
    await card.locator('img').click();await page.waitForFunction(category=>location.hash==='#world/'+category,category);await page.locator('.world-topic-tile').first().waitFor();
    await page.goBack();await page.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,key);
    assert.equal(await card.evaluate(el=>el===document.activeElement),true,'photograph click restores its actual card opener');
   }
  }finally{await context.close();}
 }
 // A failed deferred catalog inside a clickable compact card must stay usable
 // without nesting another button. The article retains its explicit safe retry.
 {
  const context=await browser.newContext({viewport:{width:320,height:900}}),page=await context.newPage();page.setDefaultTimeout(20000);
  try{
   await page.route('**/world-photos-*.json',route=>route.abort('failed'));
   await page.goto(base+'/#world/animals');await ready(page);
   const card=page.locator('.world-topic-tile').filter({has:page.locator('.world-photo [role=status]')}).first();
   await card.getByText('Du kannst die Wissenskarte trotzdem öffnen.',{exact:true}).waitFor();
   assert.equal(await card.locator('button,a,[tabindex]').count(),0,'failed compact photograph never nests controls inside a card');
   await card.screenshot({path:shots+'/animal-photo-card-error-320.png'});await card.click();await page.locator('.world-article').waitFor();
   await page.getByRole('button',{name:'Bild erneut laden',exact:true}).waitFor();
  }finally{await context.close();}
 }
 for(const failure of ['tampered','network']){
  // Expected network errors belong to this isolated negative fixture only.
  const context=await browser.newContext({viewport:{width:320,height:900}}),page=await context.newPage();page.setDefaultTimeout(20000);let requests=0;
  try{
   await page.route('**/world-photos-*.json',async route=>{requests++;if(requests===1){if(failure==='network')await route.abort('failed');else await route.fulfill({contentType:'application/json',body:'{"untrusted":true}'});}else await route.continue();});
   await page.goto(base+'#world/topic/animal-whale-shark');await ready(page);
   const retry=page.getByRole('button',{name:'Bild erneut laden',exact:true});await retry.waitFor();
   assert.equal(await page.locator('.world-article .world-photo img[src]').count(),0,'Never render images from an unverified catalog');
   await prepareAxe(page);assert.deepEqual(await page.evaluate(async()=>(await window.axe.run('.world-article',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
   await retry.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement?.matches('.world-photo'));
   await inspect(page,'whale-shark');assert.equal(requests,2,'Failure clears the shared pending request for a safe retry');
  }finally{await context.close();}
 }
 report.photoMetadata={images:Object.keys(photos),cases:observed,immediateHomeCredits:true,oneRequestPerSession:true,tamperAndNetworkRetry:true,retryFocus:true,photoCardBackFocus:true,seconds:(performance.now()-started)/1000};
 report.checks.push('All49 photos and complete rights at320/1440; bounded verified demand catalog, no home catalog request, tamper/network retry with focus');
}

export async function offlineWorldPhotos(page,report){
 const observed=[];
 for(const[id,photo]of Object.entries(photos)){
  await page.evaluate(id=>location.hash='world/topic/'+id,topics.find(t=>t.image===id).id);
  await page.waitForFunction(({src,alt})=>{const image=document.querySelector('.world-article .world-photo img');return image?.getAttribute('src')===src&&image?.alt===alt;},{src:photo.src,alt:photo.alt_de});
  const figure=page.locator('.world-article .world-photo').first();await figure.locator('img').scrollIntoViewIfNeeded();await figure.locator('img').evaluate(image=>image.decode());
  assert.ok((await figure.innerText()).includes(photo.author));assert.equal(await figure.getByRole('link',{name:photo.license,exact:true}).getAttribute('href'),photo.license_url);observed.push(id);
 }
 report.photoOffline={images:observed,coldRestart:true,verifiedCatalog:true};
 report.checks.push('All49 exact pictures, alt texts and rights survive stopped-server cold offline restart');
}
