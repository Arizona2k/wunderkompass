import {natureLearningRecordComplete} from '../../scripts/nature-learning-evidence.mjs';
import {readNatureLegend} from './nature-legend.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {SAVE_KEY} from '../../app/progress-storage.ts';
import {drawnNature} from './nature-model-geometry.mjs';
import {prepareAxe} from './axe-loader.mjs';import {captureNativeViewport} from './native-screenshot.mjs';import {preserveOriginalDOM} from './preserve-original-dom.mjs';
const pack=JSON.parse(await fs.readFile(new URL('../../app/nature-learning-content.json',import.meta.url),'utf8'));
const photos=JSON.parse(await fs.readFile(new URL('../../app/world-photos.json',import.meta.url),'utf8'));
const snapshot=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
const figureAttributes={water:'water',geoscience:'geoscience',geology:'geology',habitats:'habitat',landforms:'landform',coast:'coast',process:'process','final-six':'final-six'};
const checkText=(rows,large)=>assert(rows.filter(row=>!row.closed).every(row=>row.font>=(large?20:16)&&!row.overflow),'every visible/opened Nature paragraph and legend retains full reading size and width '+JSON.stringify({large,rows}));

async function actualReturn(page,key){
 await page.goBack();await page.waitForFunction(key=>{const e=document.activeElement,r=e?.getBoundingClientRect();return e?.getAttribute('data-route-focus')===key&&r.bottom>0&&r.top<innerHeight;},key);
}
async function wordReturn(page,body,item){
 const detail=body.locator('[data-history-disclosure="nature-words-'+item.id+'"]');await detail.locator('summary').click();const word=item.learning.relatedWords[0].term,link=detail.locator('a').first();await link.click();await page.locator('[data-route-focus="book-word-target-'+word+'"]').waitFor();
 const incoming=page.locator('[data-history-disclosure="word-nature-'+word+'"]');await incoming.locator('summary').click();const reverse=incoming.locator('[data-route-focus="word-nature-'+word+'-'+item.id+'"]');await reverse.click();await page.locator('[data-nature-study-body="'+item.id+'"]').waitFor();await actualReturn(page,'word-nature-'+word+'-'+item.id);await actualReturn(page,'nature-word-'+item.id+'-'+word);assert(await detail.evaluate(e=>e.open));return{word,actualBothDirectionsAndNativeBack:true};
}
async function placeReturn(page,body,item){
 const detail=body.locator('[data-history-disclosure="nature-related-'+item.id+'"]');await detail.locator('summary').click();const target=item.learning.relatedNature[0].id;await detail.locator('a').first().click();await page.locator('[data-route-focus="book-nature-target-'+target+'"]').waitFor();await actualReturn(page,'nature-related-'+item.id+'-'+target);assert(await detail.evaluate(e=>e.open));return{target,actualNativeBack:true};
}

async function countercases(figure,item){
 const changes={
  'okavango-delta':['[data-nature-connection]','d','M0 0L0 240'],tanganyika:['[data-nature-rift-water]','points','0,0 1,0 1,1 0,1'],'tonle-sap':['[data-nature-water-column]','y','0'],'danube-delta':['[data-nature-connection^="branch-to-sea-"]','d','M0 0L0 240'],
  'grand-canyon':['[data-geoscience-canyon-bed]','d','M0 0L0 240'],'mammoth-cave':['[data-geoscience-upper-passage]','d','M0 0L0 240'],'yellowstone-geysers':['[data-geoscience-geyser-water]','d','M0 0L0 240'],'wadden-sea':['[data-geoscience-tidal-bed]','d','M0 0L0 240'],
  'bryce-hoodoos':['[data-geology-fragment]','cx','0'],'arches-sandstone':['[data-geology-rock-and-opening]','d','M65 220V55H335V220Z'],'crater-lake':['[data-nature-geology-arrow="Verdunstung"]','d','M245 60L245 160'],'white-sands':['[data-geology-crystal]',null,null],
  vatnajokull:['[data-habitat-heat]','cy','80'],daintree:['[data-habitat-site="mountain"] [data-habitat-tree-trunk]','d','M147 204V70'],bialowieza:['[data-habitat-fallen]','width','5'],sundarbans:['[data-habitat-sediment]','cy','120'],
  'lencois-maranhenses':['[data-landform-water-table]','d','M0 0L0 240'],'socotra-vegetation':['[data-landform-natural-island]','d','M0 0L0 240'],'ha-long-bay':['[data-landform-karst-tower]','d','M0 0L0 240'],sognefjord:['[data-landform-fjord-selected-arm]','d','M0 0L0 240'],
  'sargasso-sea':['[data-coast-current]','d','M0 0L0 240'],'ross-ice-shelf':['[data-coast-ice]','d','M0 0L0 240'],'namib-fog':['[data-coast-fog-band]','width','0'],'giants-causeway':['[data-coast-basalt-roof]','d','M0 0L0 240'],
  'yosemite-valley':['[data-process-valley-bed]','d','M0 0L0 240'],'lake-superior':['[data-process-current-land]','d','M0 0L0 240'],'jeju-lava-tube':['[data-process-lava-inner]','d','M0 0L0 240'],pamukkale:['[data-process-terrace-bed]','d','M0 0L0 240'],
  'salar-uyuni':['[data-final-salt-bed]','d','M0 0L0 240'],titicaca:['[data-final-lake]','cx','0'],'victoria-falls':['[data-final-fall-bed]','d','M0 0L0 240'],'iguazu-falls':['[data-final-island]','rx','1'],'great-blue-hole':['[data-final-hollow-bed]','d','M0 0L0 240'],'galapagos-upwelling':['[data-final-upwelling-water]','height','1']
 },change=changes[item.id];assert(change,'missing declared scientific negative');
 const restore=await preserveOriginalDOM(figure);
 try{await figure.locator(change[0]).first().evaluate((el,[attribute,value])=>{if(attribute===null)el.remove();else el.setAttribute(attribute,value);},change.slice(1));await assert.rejects(()=>drawnNature(figure,item,2));}finally{await restore();}
 const legend=figure.locator(':scope > ol,:scope > ul'),restoreLegend=await preserveOriginalDOM(legend);
 try{await legend.evaluate(el=>el.style.setProperty('display','none','important'));await assert.rejects(()=>drawnNature(figure,item,2));}finally{await restoreLegend();}
 const restoreMarkers=await preserveOriginalDOM(legend);
 try{await legend.evaluate(el=>el.style.setProperty('list-style-type','none','important'));await assert.rejects(()=>drawnNature(figure,item,2));}finally{await restoreMarkers();}
 await figure.locator('.book-nature-water-choices button').first().click();await drawnNature(figure,item,0);await figure.locator('.book-nature-water-choices button').last().click();await drawnNature(figure,item,2);
 return{wrongScientificDrawingRejected:true,hiddenLegendRejected:true,missingLegendMarkersRejected:true,sameMountedReactNodesStillOperateAfterRestoration:true};
}

export async function natureLearningView(page,report,width,{shots=null,engine='chromium',large=false,native=false,offline=false,captureSession=null,ids=Object.keys(pack)}={}){
 assert.equal(await page.evaluate(()=>innerWidth),width);const before=await snapshot(page),initial=await page.evaluate(()=>location.hash),wasLarge=await page.locator('.earth-app').evaluate(el=>el.classList.contains('large-reading')),proof=[];
 try{
  for(const id of ids){
   const capturePrefix='journey-engine-'+engine+'-nature-'+(offline?'offline-':'')+(large?'large-':'normal-');const item=pack[id],learning=item.learning,q=learning.question,entry={id,width,engine,large,native,offline,model:learning.figure.kind,states:[],feedback:[],captures:[]};proof.push(entry);
   await page.evaluate(hash=>{location.hash=hash;},'book/nature/'+id);const card=page.locator('.atlas-country.nature-target'),body=card.locator('[data-nature-study-body="'+id+'"]');await body.waitFor();await page.locator('.earth-app').evaluate((el,value)=>el.classList.toggle('large-reading',value),large);
   assert.equal(await card.locator('h4').innerText(),item.name);const figure=body.locator('[data-book-nature-'+figureAttributes[item.family]+'-figure]');assert.equal(await figure.getAttribute('data-book-nature-'+figureAttributes[item.family]+'-figure'),learning.figure.kind);
   for(const[prefix,text]of[['nature-starter-',learning.starter],['nature-deeper-',learning.deeper],['nature-observe-',learning.observe]]){const detail=body.locator('[data-history-disclosure="'+prefix+id+'"]');await detail.locator('summary').click();assert.equal(await detail.locator('p').innerText(),text);const layout=await detail.locator('p').evaluateAll(es=>es.map(e=>({font:parseFloat(getComputedStyle(e).fontSize),overflow:e.scrollWidth>e.clientWidth+2,closed:!!e.closest('details:not([open])'),width:e.clientWidth,scrollWidth:e.scrollWidth})));(entry.actualOpenedText??=[]).push({prefix,layout,open:await detail.evaluate(e=>e.open)});assert(await detail.evaluate(e=>e.open),'explicitly opened Nature detail stays open');checkText(layout,large);}
   assert.equal(await body.locator('.nature-learning-benefit').innerText(),learning.benefit);
   for(let n=0;n<3;n++){
    const button=figure.locator('.book-nature-water-choices button').nth(n);assert.equal(await button.innerText(),learning.figure.controls[n]);await button.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert(await button.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')));await page.keyboard.press('Enter');const actual=await drawnNature(figure,item,n);
    const layout=await figure.evaluate(root=>({text:[...root.querySelectorAll('p,li')].map(e=>({font:parseFloat(getComputedStyle(e).fontSize),overflow:e.scrollWidth>e.clientWidth+2,closed:!!e.closest('details:not([open])')})),labels:[...root.querySelectorAll('svg text')].map(e=>({text:e.textContent,font:parseFloat(getComputedStyle(e).fontSize)*e.ownerSVGElement.getBoundingClientRect().width/e.ownerSVGElement.viewBox.baseVal.width})),buttons:[...root.querySelectorAll('button')].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))}));checkText(layout.text,large);assert(layout.labels.every(row=>row.font>=(large?20:16)),'SVG number labels retain actual rendered reading size');assert(layout.buttons.every(b=>b.w>=44&&b.h>=44));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);entry.states.push({choice:n,actual,layout,legend:await readNatureLegend(figure,id,{large})});
    if(shots&&!native)await figure.screenshot({path:path.join(shots,capturePrefix+id+'-'+n+'-'+width+'.png'),animations:'disabled'});
   }
   const limits=figure.locator('figcaption details');if(await limits.count()){await limits.locator('summary').click();assert(await limits.evaluate(e=>e.open));entry.actualOpenedModelLimits=await limits.innerText();checkText(await limits.locator('p').evaluateAll(es=>es.map(e=>({font:parseFloat(getComputedStyle(e).fontSize),overflow:e.scrollWidth>e.clientWidth+2}))),large);assert(entry.actualOpenedModelLimits.length>120);await limits.locator('summary').click();}else entry.actualVisibleModelLimits=await figure.locator('figcaption').innerText();
   if(engine==='chromium'&&width===320&&!native&&!offline)entry.countercases=await countercases(figure,item);
   const thinking=body.locator('.book-thinking');assert.equal(await thinking.locator('.book-feedback').count(),0);await thinking.locator('summary').click();assert.equal(await thinking.locator('details p').innerText(),q.hint);for(let n=0;n<3;n++){await thinking.locator('.quiz-answer').nth(n).click();const feedback=await thinking.getByRole('status').innerText();assert(feedback.includes(n===q.correct?'Das passt.':'Noch nicht passend.'));assert(feedback.includes(n===q.correct?q.why:q.wrongReasons[n]));entry.feedback.push({choice:n,feedback});}
   const sources=body.locator('[data-history-disclosure="nature-sources-'+id+'"]');await sources.locator('summary').click();assert.deepEqual(await sources.locator('a').evaluateAll(es=>es.map(e=>e.href)),learning.sources.map(s=>s.url));for(const source of learning.sources)assert((await sources.innerText()).includes(source.anchor));entry.actualVisibleSourceAnchors=true;await sources.locator('summary').click();
   const photo=card.locator('.nature-real-photo img');if(await photo.count()){await photo.scrollIntoViewIfNeeded();await page.waitForFunction(id=>{const image=document.querySelector('.nature-real-photo img');return image?.complete&&image.naturalWidth>0&&image.currentSrc.includes(id);},id);entry.actualPhoto=await photo.evaluate(e=>({src:e.currentSrc,alt:e.alt,width:e.naturalWidth,height:e.naturalHeight,fit:getComputedStyle(e).objectFit,displayWidth:e.getBoundingClientRect().width,displayHeight:e.getBoundingClientRect().height}));assert(entry.actualPhoto.alt.length>40&&entry.actualPhoto.fit==='contain');assert(Math.abs(entry.actualPhoto.displayWidth/entry.actualPhoto.displayHeight-entry.actualPhoto.width/entry.actualPhoto.height)<.01);const credits=card.locator('.nature-real-photo figcaption details');await credits.locator('summary').click();const creditText=await credits.innerText(),metadata=photos[id];assert(creditText.includes(metadata.author)&&creditText.includes(metadata.license));assert((await credits.locator('a').evaluateAll(es=>es.map(e=>e.href))).includes(metadata.source_page_url));entry.actualOpenedPhotoCredits=creditText;await credits.locator('summary').click();}
   if(width===320){await prepareAxe(page);entry.axe=await card.evaluate(async el=>(await window.axe.run(el,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));assert.deepEqual(entry.axe,[]);}
   if(shots&&!native)await card.screenshot({path:path.join(shots,capturePrefix+id+'-whole-'+width+'.png'),animations:'disabled'});
   if(shots&&native)for(const[name,target]of[['drawing',figure.locator('svg')],['legend',figure.locator(':scope > ol,:scope > ul')]]){await target.evaluate(e=>e.scrollIntoView({block:'start'}));entry.captures.push({part:name,...await captureNativeViewport(page,path.join(shots,capturePrefix+id+'-native200-'+name+'-'+width+'.png'),{cdp:captureSession})});}
   entry.wordReturn=await wordReturn(page,body,item);entry.placeReturn=await placeReturn(page,body,item);entry.status='passed';
  }
  const after=await snapshot(page);for(const key of ['notes','favorites','favoritePlaces','settings','games','missions','labs','experiments','quizResults','quizSession','journeys','chapters','completedChapters','review','gameSessions'])assert.deepEqual(after[key],before[key],key+' preserved after actual canonical Nature study/return use');report.naturePassPreserved=true;for(const row of proof)assert(natureLearningRecordComplete(row,{native,offline}),row.id+' actual Nature record satisfies its declared numbered or colour/shape legend representation');
 }catch(error){if(shots)await page.screenshot({path:path.join(shots,'journey-engine-'+engine+'-nature-actual-condition-failure'+(offline?'-offline':'')+(native?'-native200':'')+'.png'),fullPage:true}).catch(()=>{});throw error;
 }finally{
  (report.bookNature??=[]).push(...proof);await page.locator('.earth-app').evaluate((el,value)=>el.classList.toggle('large-reading',value),wasLarge);await page.evaluate(hash=>{location.hash=hash;},initial);
 }
 return proof;
}
