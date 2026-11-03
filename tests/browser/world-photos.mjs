import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
import assert from 'node:assert/strict';
import photos from '../../app/world-photos.json' with {type:'json'};
import topics from '../../app/world-catalog.json' with {type:'json'};
import naturePhotoCandidates from '../../app/nature-photo-candidates.json' with {type:'json'};
import naturePlaces from '../../app/nature-new-places.json' with {type:'json'};
import {prepareAxe} from './axe-loader.mjs';

// Corresponding real Back boundary: a previously requested category/page focus
// frame is released only after browser history has returned to its source.
export async function pendingPhotoBackFocusFlow(browser,base,ready,monitor,report,shots,{widths=[320,1440],context:providedContext=null,native=false}={}){
 const cases=report.photoPendingBackFocus??=[];
 const engine=browser.browserType().name(),scope=path.resolve(shots??'.qa-output')===path.resolve('.qa-output')?'early':'complete',prefix=(engine==='chromium'?'photo-pending-back-chromium':'journey-engine-'+engine+'-'+scope+'-photo-pending-back');
 for(const width of widths)for(const kind of ['category','pagination']){
  const context=providedContext??await browser.newContext({viewport:{width,height:900},hasTouch:width===320,reducedMotion:'reduce'}),page=await context.newPage();monitor(page);
  try{
   if(native){await page.setViewportSize({width:width*2,height:950});assert.equal(await page.evaluate(()=>innerWidth),width);assert.equal(await page.evaluate(()=>devicePixelRatio),2);}
   await page.addInitScript(()=>{const request=requestAnimationFrame.bind(window),cancel=cancelAnimationFrame.bind(window),held=new Map();let holding=false,id=0;window.__photoBackFrames={begin:()=>{holding=true;},pending:()=>held.size,release:()=>{holding=false;const frames=[...held.values()];held.clear();for(const callback of frames)request(callback);}};window.requestAnimationFrame=callback=>{if(!holding)return request(callback);const next=--id;held.set(next,callback);return next;};window.cancelAnimationFrame=key=>{if(key<0)held.delete(key);else cancel(key);};});
   const original=kind==='category'?'world':'world/science';await page.goto(base+'/#'+original);await ready(page);await page.locator(kind==='category'?'.world-choice':'.world-topic-tile').first().waitFor();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await page.evaluate(()=>window.__photoBackFrames.begin());
   if(kind==='category'){await page.locator('[data-route-focus="world-category-animals"] img').click();await page.locator('.world-topic-tile').first().waitFor();}else{await page.getByRole('button',{name:'Nächste Seite',exact:true}).click();await page.getByText('46 passende Entdeckerkarten · Seite 2 von 4',{exact:true}).waitFor();}
   const pendingBeforeBack=await page.evaluate(()=>window.__photoBackFrames.pending());assert.ok(pendingBeforeBack>0,'real navigation frames are held');
   await page.goBack();await page.waitForFunction(path=>location.hash==='#'+path,original);await page.locator(kind==='category'?'.world-choice':'.world-topic-tile').first().waitFor();await page.evaluate(()=>window.__photoBackFrames.release());await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const expected=kind==='category'?page.locator('[data-route-focus="world-category-animals"]'):page.locator('#world-category-title'),focused=await expected.evaluate(e=>e===document.activeElement),actual=await page.evaluate(()=>({hash:location.hash,active:{id:document.activeElement?.id,key:document.activeElement?.dataset.routeFocus},history:history.state}));cases.push({width,kind,native,pendingBeforeBack,focused,actual});
   if(shots&&native)await captureNativeViewport(page,path.join(shots,prefix+'-'+kind+'-native200-'+width+'.png'));
   if(shots&&!focused)await page.screenshot({path:path.join(shots,prefix+'-'+kind+'-failure-'+width+'.png'),animations:'disabled'});
   assert.equal(focused,true,'deferred '+kind+' focus must not overwrite actual Back restoration');
   if(kind==='pagination'){await page.getByRole('button',{name:'Nächste Seite',exact:true}).click();await page.getByText('46 passende Entdeckerkarten · Seite 2 von 4',{exact:true}).waitFor();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.equal(await page.locator('#world-results').evaluate(e=>e===document.activeElement),true,'untouched pagination keeps its actual results focus');}
  }catch(error){if(shots)await fs.writeFile(path.join(shots,prefix+'-failure.json'),JSON.stringify({engine,scope,cases,status:'failed',failure:error.stack},null,2)+'\n');throw error;}finally{if(providedContext)await page.close();else await context.close();}
 }
 report.checks??=[];report.checks.push('Deferred category/pagination frames cannot replace actual Back focus at'+widths.join('/')+'; untouched pagination still focuses results');
 if(shots)await fs.writeFile(path.join(shots,prefix+'.json'),JSON.stringify({engine,scope,cases,status:'passed',meaning:'Corresponding delayed real application frame after actual browser Back; no reconstructed CI scheduling or physical-device claim.'},null,2)+'\n');
 return cases;
}

// A photo click is a real route opener even where native pointer behaviour
// does not focus buttons. Keep the original Back wait and focus assertion.
export async function photoCardOpenerFlow(browser,base,ready,monitor,shots,{controlled=false,context:providedContext=null,widths=[320,1440],native=false}={}){
 const engine=browser?.browserType().name()??'chromium',cases=[],prefix=engine==='chromium'?'animal-photo-opener-chromium':'journey-engine-'+engine+'-photo-opener';
 for(const width of widths)for(const suppress of controlled?[false,true]:[false]){
  const context=providedContext??await browser.newContext({viewport:{width,height:900},hasTouch:width===320,reducedMotion:'reduce'}),page=await context.newPage();monitor(page);page.setDefaultTimeout(20000);let category='initial';
  try{
   if(native){await page.setViewportSize({width:width*2,height:950});assert.equal(await page.evaluate(()=>innerWidth),width);assert.equal(await page.evaluate(()=>devicePixelRatio),2);}
   if(suppress)await page.addInitScript(()=>document.addEventListener('mousedown',event=>{if(event.target?.closest?.('[data-route-focus^="world-category-"]'))event.preventDefault();},true));
   await page.goto(base+'/#world');await ready(page);
   for(category of ['animals','history','people','buildings']){
    const key='world-category-'+category,card=page.locator('.world-view [data-route-focus="'+key+'"]');
    assert.equal(await card.locator('.world-photo[tabindex],.world-photo [tabindex],.world-photo button,.world-photo a').count(),0,'compact photograph never creates an interactive child inside its card');
    await card.locator('img').click();await page.waitForFunction(category=>location.hash==='#world/'+category,category);await page.locator('.world-topic-tile').first().waitFor();
    await page.goBack();await page.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,key);
    assert.equal(await card.evaluate(el=>el===document.activeElement),true,'photograph click restores its actual card opener');
    const state=await page.evaluate(()=>({recordedOpener:history.state?.wunderFocus,actual:document.activeElement?.dataset.routeFocus}));assert.equal(state.recordedOpener,key,'the actual clicked card was saved before leaving');cases.push({width,category,suppressedNativeMouseFocus:suppress,native,...state});
    if(shots&&native&&category==='buildings')await captureNativeViewport(page,path.join(shots,prefix+'-native200-'+width+'-'+(suppress?'controlled':'ordinary')+'.png'));
   }
  }catch(error){
   const diagnostics={engine,width,category,suppressedNativeMouseFocus:suppress,native,completedCases:cases,actual:await page.evaluate(()=>({hash:location.hash,history:history.state,active:{tag:document.activeElement?.tagName,id:document.activeElement?.id,key:document.activeElement?.dataset.routeFocus}})).catch(()=>null),failure:error.stack};
   if(shots){await fs.writeFile(path.join(shots,prefix+'-failure-'+width+'.json'),JSON.stringify(diagnostics,null,2)+'\n');await page.screenshot({path:path.join(shots,prefix+'-failure-'+width+'.png'),animations:'disabled',timeout:6500}).catch(()=>{});}console.error('PHOTO_CARD_OPENER_FAILURE',JSON.stringify(diagnostics));throw error;
  }finally{if(providedContext)await page.close();else await context.close();}
 }
 if(shots)await fs.writeFile(path.join(shots,prefix+'-'+(controlled?'native-and-controlled':'native-only')+'.json'),JSON.stringify({engine,cases,meaning:'Original photo-card Back focus plus explicit no-native-pointer-focus cases; not a physical device or complete acceptance'},null,2)+'\n');
 return cases;
}

// Later category pages must render their route immediately when real Back restores
// the saved opener. Cover every world and the new Bronze card without repeating
// the complete animal matrix or weakening its existing photo-opener checks.
export async function paginatedCardBackFlow(browser,base,ready,monitor,report,shots){
 const ids=['animal-okapi','history-mohenjo-daro','person-ibn_al_haytham','invention-microscope','building-sydney-opera','science-galaxy','history-bronze'];
 const cases=[];
 for(const width of [320,1440]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===320,reducedMotion:'reduce'}),page=await context.newPage();monitor(page);page.setDefaultTimeout(20000);
  try{
   for(const id of ids){
    const topic=topics.find(t=>t.id===id);assert.ok(topic,'declared retained or new topic');const pool=topics.filter(t=>t.category===topic.category),number=Math.floor(pool.findIndex(t=>t.id===id)/12)+1;assert.ok(number>=2,'real later-page case');
    const route='world/'+topic.category+'/page/'+number,focus='world-topic-'+id,expected=pool.slice((number-1)*12,number*12).map(t=>'world-topic-'+t.id);
    await page.goto(base+'/#'+route);await ready(page);if(width===320)await page.locator('.earth-app').evaluate(e=>e.classList.add('large-reading'));
    const card=page.locator('[data-route-focus="'+focus+'"]');await card.waitFor();
    assert.deepEqual(await page.locator('.world-topic-tile').evaluateAll(es=>es.map(e=>e.dataset.routeFocus)),expected,'all actual page card identities, no stale first page');
    await card.focus();await page.keyboard.press('Enter');await page.locator('#world-topic-title').getByText(topic.title,{exact:true}).waitFor();
    await page.goBack();await card.waitFor();await page.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,focus);
    assert.equal(await page.evaluate(()=>location.hash),'#'+route);assert.equal(await card.evaluate(e=>e===document.activeElement),true,'actual original card has keyboard focus after real Back');
    assert.deepEqual(await page.locator('.world-topic-tile').evaluateAll(es=>es.map(e=>e.dataset.routeFocus)),expected);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
    if(shots&&id==='history-bronze')await card.screenshot({path:path.join(shots,'history-bronze-page-back-'+width+'.png'),animations:'disabled'});
    cases.push({id,category:topic.category,page:number,width,largeText:width===320,expectedCardIds:expected,realKeyboardOpenAndBackFocus:true});
   }
  }finally{await context.close();}
 }
 assert.equal(cases.length,14);report.paginatedCardBack=cases;report.checks.push('Actual later-page identities and real keyboard Back focus for all six worlds and new Bronze card at320large/1440');return cases;
}

// Every verified catalogue picture has one actual canonical reader target.
// The retained49 article pictures keep their original routes and checks; new
// Nature pictures use the real Book photo disclosure rather than a fake article.
export async function inspectCatalogPhoto(page,id){
 const photo=photos[id];assert.ok(photo,'known verified catalogue photo '+id);
 const topic=topics.find(t=>t.image===id),nature=Object.hasOwn(naturePhotoCandidates,id)&&naturePlaces.some(place=>place.id===id);
 assert.ok(topic||nature,'known actual article or Nature Book target '+id);
 const route=topic?'world/topic/'+topic.id:'book/nature/'+encodeURIComponent(id),selector=topic?'.world-article .world-photo':'.atlas-country.nature-target .nature-real-photo .world-photo';
 await page.evaluate(hash=>location.hash=hash,route);
 await page.waitForFunction(({selector,src,alt})=>{const image=document.querySelector(selector+' img');return image?.getAttribute('src')===src&&image?.alt===alt;},{selector,src:photo.src,alt:photo.alt_de});
 const figure=page.locator(selector).first();await figure.locator('img').scrollIntoViewIfNeeded();await figure.locator('img').evaluate(image=>image.decode());
 if(!topic){const disclosure=figure.locator('figcaption details');if(!await disclosure.evaluate(e=>e.open))await disclosure.locator('summary').click();assert(await disclosure.evaluate(e=>e.open));}
 assert.ok((await figure.innerText()).includes(photo.author),id+' author');
 assert.equal(await figure.getByRole('link',{name:photo.license,exact:true}).getAttribute('href'),photo.license_url);
 if(topic){const disclosure=figure.locator('figcaption details');if(!await disclosure.evaluate(e=>e.open))await figure.getByText('Bildquelle & Bearbeitung',{exact:true}).click();assert(await disclosure.evaluate(e=>e.open));}
 assert.equal(await figure.getByRole('link',{name:'Original und Rechte',exact:true}).getAttribute('href'),photo.source_page_url);
 await figure.getByText(photo.transformations_de,{exact:true}).waitFor();
 if(!topic){
  const candidate=naturePhotoCandidates[id],image=figure.locator('img');assert.equal(await image.getAttribute('srcset'),candidate.srcSet);assert.equal(await image.getAttribute('sizes'),candidate.sizes);
  const actual=await image.evaluate(e=>({currentSrc:e.currentSrc,fit:getComputedStyle(e).objectFit,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight}));assert.equal(actual.fit,'contain');assert(actual.naturalWidth>0&&actual.naturalHeight>0);assert(candidate.srcSet.split(',').some(part=>actual.currentSrc.endsWith(part.trim().split(' ')[0])));assert(Math.abs(actual.width/actual.height-actual.naturalWidth/actual.naturalHeight)<.01,'Nature photograph keeps its entire actual selected responsive source ratio');
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,id+' overflow');
 return figure;
}

export async function worldPhotoFlow(browser,base,ready,monitor,report,shots){
 const started=performance.now(),observed=[];
 const inspect=inspectCatalogPhoto;
 for(const width of [320,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();monitor(page);page.setDefaultTimeout(20000);let requests=0;
  page.on('request',request=>{if(/world-photos-.*\.json/.test(request.url()))requests++;});
  try{
   await page.goto(base);await ready(page);assert.equal(requests,0,'Home has immediate complete credits without the deferred catalog');
   for(const id of Object.keys(photos)){const figure=await inspect(page,id);observed.push({id,width});if(['jaguar','western-lowland-gorilla'].includes(id))await figure.screenshot({path:shots+'/animal-photo-retained-'+id+'-'+width+'.png'});if(id==='whale-shark')await figure.screenshot({path:shots+'/animal-photo-rights-'+width+'.png'});}
   assert.equal(requests,1,'One verified metadata request shared by all'+Object.keys(photos).length+' pictures');
  }finally{await context.close();}
 }
 // Clicking the photograph must keep the enclosing card as the history opener.
 // A tabindex on the decorative figure steals this focus and breaks real Back.
 report.photoCardOpeners=await photoCardOpenerFlow(browser,base,ready,monitor,shots,{controlled:true});
 await paginatedCardBackFlow(browser,base,ready,monitor,report,shots);
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
 assert.equal(observed.length,Object.keys(photos).length*2);assert.deepEqual([...new Set(observed.map(row=>row.id))],Object.keys(photos));
 report.photoMetadata={images:Object.keys(photos),cases:observed,immediateHomeCredits:true,oneRequestPerSession:true,tamperAndNetworkRetry:true,retryFocus:true,photoCardBackFocus:true,seconds:(performance.now()-started)/1000};
 report.checks.push('All'+Object.keys(photos).length+' photos and complete rights at320/1440, including real Nature Book disclosures; bounded verified demand catalog, no home catalog request, tamper/network retry with focus');
}

export async function offlineWorldPhotos(page,report){
 const observed=[];
 for(const id of Object.keys(photos)){await inspectCatalogPhoto(page,id);observed.push(id);}
 assert.deepEqual(observed,Object.keys(photos),'every actual catalogue photo is inspected in the stopped-server cold client');
 report.photoOffline={images:observed,coldRestart:true,verifiedCatalog:true};
 report.checks.push('All'+Object.keys(photos).length+' exact pictures, alt texts, responsive Nature sources and complete rights survive stopped-server cold offline restart');
}
