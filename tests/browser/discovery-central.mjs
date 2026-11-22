import {AXE_FILE,prepareAxe} from './axe-loader.mjs';
import{assertMeaningfulGraphicContrast}from'./text-geometry.mjs';
import{guideDialogView}from'./guides.mjs';
import{categoryTimelineNavigation}from'./category-timelines.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {NEUIGKEITEN} from '../../app/kern/neuigkeiten.ts';
import {DISCOVERY_CONNECTIONS} from '../../app/discovery-data.ts';
import {KNOWLEDGE_CONNECTIONS} from '../../app/knowledge-connections.ts';
import {bereich,bildanfragen} from './harness.mjs';
import {mehrErfahren,verbindungsKnopf,verbindungsSatz} from './karte-hilfen.mjs';
const read=async p=>JSON.parse(await fs.readFile(new URL(p,import.meta.url),'utf8'));
const topics=await read('../../app/world-catalog.json'),categories=await read('../../exports/content/world-categories.json');

// Date-only control: Playwright's full clock removes real navigation timing entries.
// Keep the browser's actual reload/Back API and timers, and vary only the local date.
async function homeTime(page,instant){await page.addInitScript(instant=>{
 const NativeDate=Date;let value=NativeDate.parse(instant);try{const saved=sessionStorage.getItem('__home-test-clock');if(saved!==null)value=Number(saved);}catch{}
 window.__homeTestTime=value;window.Date=new Proxy(NativeDate,{construct(Target,args){return Reflect.construct(Target,args.length?args:[window.__homeTestTime]);},apply(){return new NativeDate(window.__homeTestTime).toString();},get(Target,key){return key==='now'?()=>window.__homeTestTime:Reflect.get(Target,key);}});
 },instant);}
async function setHomeTime(page,instant){await page.evaluate(instant=>{window.__homeTestTime=Date.parse(instant);sessionStorage.setItem('__home-test-clock',String(window.__homeTestTime));},instant);}

// Meaningful parts of the ISS explanation use the same actual painted-color guard.
export async function assertStationContextContrast(figure){
 return assertMeaningfulGraphicContrast(figure,[{selector:'[data-station-context-earth]',name:'Earth',paint:'fill'},{selector:'[data-station-context-orbit]',name:'orbit',paint:'stroke'},{selector:'[data-station-context-laboratory]',name:'station',paint:'fill'}],'ISS');
}

export async function discoveryPairMedia(page){
 const media=await page.locator('.discovery-pair>article').evaluateAll(articles=>articles.map(article=>{
  const surface=article.querySelector(':scope > figure img[src],:scope > figure svg,:scope > figure ol,:scope > figure [role="img"],:scope > .research-preview img[src]');
  if(!surface)return false;const r=surface.getBoundingClientRect();return r.width>=80&&r.height>=50;
 }));assert.deepEqual(media,[true,true],'both connected topics have an actual visible explanatory figure; button arrows do not count');
 // A real context drawing must still show the actual station and its relation to Earth.
 const stationViews=await page.locator('.discovery-pair>article').evaluateAll(articles=>articles.filter(article=>article.querySelector('[data-route-focus="home-topic-history-iss"]')).map(article=>{
  const figure=article.querySelector('figure[data-station-context="orbital-laboratory"]'),earth=figure?.querySelector('[data-station-context-earth]'),orbit=figure?.querySelector('[data-station-context-orbit]'),station=figure?.querySelector('[data-station-context-laboratory]'),num=(element,key)=>Number(element?.getAttribute(key));
  return {complete:!!earth&&!!orbit&&!!station,earth:{x:num(earth,'cx'),y:num(earth,'cy'),r:num(earth,'r')},orbit:{x:num(orbit,'cx'),y:num(orbit,'cy'),r:num(orbit,'r')},station:{x:num(station,'x')+num(station,'width')/2,y:num(station,'y')+num(station,'height')/2,width:num(station,'width'),height:num(station,'height')},labels:[...(figure?.querySelectorAll('ul>li')??[])].map(el=>el.textContent)};
 }));assert(stationViews.length<=1,'one actual ISS context per paired endpoint');
 for(const view of stationViews){assert(view.complete,'ISS context contains actual Earth, orbit and station');assert(view.earth.r>0&&view.orbit.r>view.earth.r);assert.deepEqual([view.orbit.x,view.orbit.y],[view.earth.x,view.earth.y],'one common centre');assert(view.station.width>0&&view.station.height>0);assert.equal((view.station.x-view.earth.x)**2+(view.station.y-view.earth.y)**2,view.orbit.r**2,'the station symbol lies on the declared schematic orbit');assert.deepEqual(view.labels,['Gefüllter Kreis: Erde.','Rechteck auf der Linie: Raumstation.']);}
 for(const figure of await page.locator('figure[data-station-context="orbital-laboratory"]').all())await assertStationContextContrast(figure);
 const photos=await page.locator('.discovery-pair>article').evaluateAll(articles=>articles.map(article=>{
  const image=article.querySelector(':scope > .world-photo img[src],:scope > .discovery-context-photo img[src]');
  return image?{height:image.getBoundingClientRect().height,fit:getComputedStyle(image).objectFit}:null;
 }));
 if(photos.every(Boolean)){
  assert(photos.every(photo=>photo.fit==='contain'),'paired photos retain their complete subjects');
  assert(Math.abs(photos[0].height-photos[1].height)<=1,'paired photos share an equal frame despite different original formats');
 }
 return media;
}

export async function decodeHomeImages(page){
 await page.locator('.discovery-hero img[src]').waitFor();await page.locator('.discovery-activities').waitFor();await page.locator('[data-discovery-day]').waitFor();
 const top=await page.evaluate(()=>scrollY);
 for(const image of await page.locator('.discovery-hero img[src],.discovery-worlds img[src],.discovery-pair img[src],.discovery-play img[src],.discovery-activities img[src],.daily-discovery img[src]').all()){
  await image.scrollIntoViewIfNeeded();await image.evaluate(async im=>{await im.decode();if(!im.naturalWidth||!im.naturalHeight)throw Error('Undecoded actual Home image');});
 }
 await page.evaluate(async()=>{for(const el of document.querySelectorAll('.discovery-pair svg image,.daily-discovery svg image')){const image=new Image();image.src=el.href.baseVal;await image.decode();}});
 await page.evaluate(top=>scrollTo({top,behavior:'instant'}),top);
}

export async function discoveryVisitCases(browser,base,ready,monitor,report,shots){
 await immediateHomePhotoCases(browser,base,ready,monitor,report,shots);
 const index=await read('../../app/world-index.json'),photos=await read('../../app/world-photos.json');
 for(const timezoneId of ['Europe/Berlin','America/Los_Angeles']){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',timezoneId}),page=await context.newPage();monitor(page);const bilderFertig=bildanfragen(page);page.setDefaultTimeout(20000);
  try{
   await homeTime(page,'2026-10-27T00:15:00Z');await page.goto(base);await ready(page);
   const selection=()=>page.evaluate(()=>({heroId:document.querySelector('[data-discovery-hero]').dataset.discoveryHero,trailId:document.querySelector('[data-discovery-trail-current]').dataset.discoveryTrailCurrent}));
   const daily=()=>page.locator('[data-discovery-day]').evaluate(el=>({day:el.dataset.discoveryDay,target:el.dataset.discoveryTarget}));
   const first=await selection(),day=await daily();assert.equal(day.day,timezoneId==='Europe/Berlin'?'2026-10-27':'2026-10-26');
   await bilderFertig();await page.reload();await ready(page);assert.deepEqual(await selection(),first);assert.deepEqual(await daily(),day);
   await page.getByRole('button',{name:'Anderes Einstiegsmotiv',exact:true}).click();await page.waitForFunction(id=>document.querySelector('[data-discovery-hero]').dataset.discoveryHero!==id,first.heroId);const manual=await selection();assert.equal(manual.trailId,first.trailId);assert.deepEqual(await daily(),day);
   const entry=index.find(t=>t.id===manual.heroId),photo=photos[entry.image];await page.locator('.discovery-feature>a').getByText(entry.homeQuestion,{exact:true}).waitFor();assert.equal(await page.locator('.discovery-feature>a').getAttribute('href'),'#world/topic/'+entry.id);const motif=page.locator('.discovery-hero-art img[src]');await motif.waitFor();await motif.evaluate(im=>im.decode());assert.equal(await motif.getAttribute('src'),photo.src);assert.equal(await motif.getAttribute('alt'),photo.alt_de);
   const credit=page.locator('.discovery-hero-art .photo-disclosure');await credit.locator('summary').click();await credit.getByRole('link',{name:photo.license,exact:true}).waitFor();assert.equal(await credit.getByRole('link',{name:'Original und Rechte',exact:true}).getAttribute('href'),photo.source_page_url);
   await bilderFertig();await page.locator('.discovery-feature>a').focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:entry.title,exact:true}).waitFor();await bilderFertig();await page.goBack();await page.locator('.discovery-hero').waitFor();assert.deepEqual(await selection(),manual);await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===(id==='animal-honey-bee'?'home-bee':'home-motif-'+id),entry.id);assert.equal(await credit.locator('details').getAttribute('open')!==null,true,'Back restores the actual motif attribution disclosure');
   await setHomeTime(page,'2026-10-27T00:44:59.999Z');await bilderFertig();await bereich(page,'explore').click();assert.deepEqual(await selection(),manual,'less than30 idle minutes keeps selection');
   await setHomeTime(page,'2026-10-27T01:14:59.999Z');await page.keyboard.press('Shift');assert.deepEqual(await selection(),manual,'idle reading and renewed input do not rotate');await bilderFertig();await page.reload();await ready(page);assert.deepEqual(await selection(),manual,'idle reload restores selection and pending visit');
   await bilderFertig();await bereich(page,'explore').click();await page.waitForFunction(id=>document.querySelector('[data-discovery-hero]').dataset.discoveryHero!==id,manual.heroId);const next=await selection();assert.notEqual(next.trailId,manual.trailId);assert.deepEqual(await daily(),day);
   const reopened=await context.newPage();monitor(reopened);const reopenedBilder=bildanfragen(reopened);await homeTime(reopened,'2026-10-27T01:15:00Z');await reopened.goto(base);await ready(reopened);assert.notEqual(await reopened.locator('[data-discovery-hero]').getAttribute('data-discovery-hero'),next.heroId,'new opening avoids the previous suitable motif');assert.notEqual(await reopened.locator('[data-discovery-trail-current]').getAttribute('data-discovery-trail-current'),next.trailId);await reopenedBilder();await reopened.close();
   const tomorrow=timezoneId==='Europe/Berlin'?'2026-10-27T23:00:00Z':'2026-10-27T07:00:00Z';await setHomeTime(page,tomorrow);await page.keyboard.press('Shift');await page.waitForFunction(day=>document.querySelector('[data-discovery-day]').dataset.discoveryDay!==day,day.day);const changedDay=await daily();assert.equal(changedDay.day,timezoneId==='Europe/Berlin'?'2026-10-28':'2026-10-27');assert.notEqual(changedDay.target,day.target);assert.deepEqual(await selection(),next,'local date change does not rotate the reading motif');
   await page.screenshot({path:shots+'/home-visit-'+timezoneId.replace('/','-')+'.png',fullPage:true,animations:'disabled'});
   report.checks.push('Actual Home visit/reload/Back/manual/30minute inactivity/read stability/reopening/local midnight/paired motif rights: '+timezoneId);
   const earned=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
   await page.addInitScript(day=>{if(sessionStorage.getItem('__home-test-legacy')){sessionStorage.removeItem('wunderkompass-discovery-visit');localStorage.removeItem('wunderkompass-discovery-last');sessionStorage.setItem('wunderkompass-discovery-trail','science-pollination--animal-honey-bee');localStorage.setItem('wunderkompass-discovery-day',JSON.stringify({day,id:'world:animal-honey-bee'}));history.replaceState({...history.state,wunderHero:null,wunderTrail:'science-pollination--animal-honey-bee',wunderFocus:'home-bee'},'',location.href);sessionStorage.removeItem('__home-test-legacy');}},changedDay.day);
   await page.evaluate(()=>sessionStorage.setItem('__home-test-legacy','1'));await bilderFertig();await page.reload();await ready(page);assert.deepEqual(await selection(),{heroId:'animal-honey-bee',trailId:'science-pollination--animal-honey-bee'});assert.equal((await daily()).target,'animal-honey-bee','valid saved daily ID survives a different current default');await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='home-bee');assert.equal(await page.evaluate(()=>performance.getEntriesByType('navigation')[0].type),'reload');
   const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);for(const key of['notes','favorites','games','gameSessions','chapters','completedChapters','quizResults','settings'])assert.deepEqual(after[key],earned[key]);for(const id of earned.discoveries)assert(after.discoveries.includes(id));
   report.checks.push('Actual M68 legacy Bee/trail/Back-focus presentation and same-day stored topic restore without changing earned pass fields: '+timezoneId);
   await bilderFertig();
  }finally{await context.close();}
 }
}

async function openTrailPicker(page){const picker=page.locator('.discovery-trail-picker');if(!await picker.evaluate(el=>el.open))await picker.locator('summary').first().click();}

export function assertHomePanelReserve(boxes){
 const normalEndSpace=boxes.worldMarginBottom+boxes.panelPaddingBottom+boxes.panelBorderBottom;
 assert.ok(boxes.unusedAfterWorld<=normalEndSpace+2,'unnecessary home panel reserve after the six worlds: '+JSON.stringify(boxes));
}
export async function homePanelLayout(page){
 // The resume card also exists on the previous journey screen. Wait for
 // actual Home and its browser paint, never for a desired geometry value.
 await page.locator('.earth-app[data-mode=home] .discovery-worlds').waitFor();
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const boxes=await page.evaluate(()=>{
  const panel=document.querySelector('.learning-panel'),world=document.querySelector('.discovery-worlds'),next=document.querySelector('.discovery-pathways');
  if(!panel||!world||!next)throw Error('Home worlds and connections must be present before measuring');
  const p=panel.getBoundingClientRect(),w=world.getBoundingClientRect(),n=next.getBoundingClientRect(),ps=getComputedStyle(panel),ws=getComputedStyle(world);
  return{panelHeight:p.height,worldHeight:w.height,unusedAfterWorld:p.bottom-w.bottom,distanceToConnections:n.top-w.bottom,worldMarginBottom:parseFloat(ws.marginBottom),panelPaddingBottom:parseFloat(ps.paddingBottom),panelBorderBottom:parseFloat(ps.borderBottomWidth),panelMinBlock:ps.minBlockSize};
 });assertHomePanelReserve(boxes);return boxes;
}

export async function gatewayModelPreviews(page,report){
 // The visited world hub can remain mounted in an inactive tab. This Home
 // assertion must inspect its own visible previews, not a hidden second copy.
 const previews=page.locator('.discovery-worlds');
 const size=previews.locator('.world-science .gateway-art>svg');await size.waitFor();
 // WebKit can expose a changed SVG attribute while its computed style still
 // describes the preceding paint. Observe the rendered state, not a target value.
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 assert.match(await size.getAttribute('aria-label'),/Erde 1, Jupiter 11,21 Erddurchmesser/);
 const circles=size.locator('circle');assert.equal(await circles.count(),2);
 // Read frame and contents in one rendering state; separate protocol calls
 // can observe different positions while a pending layout is being painted.
 const{boxes,frame}=await size.evaluate(svg=>{const f=svg.getBoundingClientRect();return{frame:{x:f.x,y:f.y,width:f.width,height:f.height},boxes:[...svg.querySelectorAll('circle')].map(el=>{const b=el.getBoundingClientRect();const m=el.getScreenCTM();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,radius:el.r.baseVal.value,scaleX:Math.hypot(m.a,m.b),scaleY:Math.hypot(m.c,m.d)};})};});
 for(const box of boxes)assert.ok(box.width>0&&box.scaleX>0&&Math.abs(box.scaleX-box.scaleY)<.0001,'preview circles keep a uniform visible screen scale');
 const renderedRatio=boxes[1].radius*boxes[1].scaleX/(boxes[0].radius*boxes[0].scaleX);
 // Firefox rounds bounding rectangles to layout units; use its actual SVG
 // transform for the exact size relation, and keep rectangle clipping checks.
 assert.ok(Math.abs(renderedRatio-11.21)<.0001,'preview retains the same Earth/Jupiter diameter scale');
 for(const box of boxes)assert.ok(box.x>=frame.x-1&&box.right<=frame.x+frame.width+1&&box.y>=frame.y-1&&box.bottom<=frame.y+frame.height+1,'whole planet remains inside the preview');
 const bicycle=previews.locator('.world-inventions .gateway-art>svg');assert.match(await bicycle.getAttribute('aria-label'),/Fahrrads mit Pedalen, Kette und Hinterrad/);const wheels=bicycle.locator('circle').all();assert.equal((await wheels).length,4);const first=await bicycle.locator('circle').nth(0).getAttribute('r'),second=await bicycle.locator('circle').nth(1).getAttribute('r');assert.equal(first,second,'actual chain-drive drawing keeps both wheel sizes');assert.equal(await bicycle.locator('path[stroke="#d66229"]').count(),1,'chain path is visible');
 const frameContrast=await bicycle.locator('path[stroke-width="10"]').evaluate(el=>{let surface=el;while(surface.parentElement&&['transparent','rgba(0, 0, 0, 0)'].includes(getComputedStyle(surface).backgroundColor))surface=surface.parentElement;const luminance=color=>{const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};const[a,b]=[getComputedStyle(el).stroke,getComputedStyle(surface).backgroundColor].map(luminance);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05);});assert.ok(frameContrast>=3,'meaningful bicycle frame has at least3:1contrast against its actual surface');
 (report.gatewayModelPreviews??=[]).push({width:await page.evaluate(()=>document.documentElement.clientWidth),earthJupiterRatio:renderedRatio,boundingRectangleRatio:boxes[1].width/boxes[0].width,wholePlanets:true,bicycleChain:true,bicycleFrameContrast:frameContrast});
}

export async function discoveryCentral(page,ready,report,width,shots){
 const home=async()=>{await page.evaluate(()=>location.hash='home');try{await page.locator('.discovery-hero').waitFor();}catch(error){report.routeReturnFailure={width,...await page.evaluate(()=>({hash:location.hash,mode:document.querySelector('.earth-app')?.dataset.mode,selectedTabs:[...document.querySelectorAll('[role=tab][aria-selected=true]')].map(e=>e.textContent),heroPresent:!!document.querySelector('.discovery-hero')})).catch(e=>({diagnosticError:e.message}))};await page.screenshot({path:shots+'/route-return-failure-'+width+'.png',fullPage:true}).catch(()=>{});throw error;}};
 const inspect=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2),false,'discovery overflow '+width);
 await home();await inspect();await decodeHomeImages(page);
 for(const image of await page.locator('.discovery-worlds img').all())await image.evaluate(async im=>{await im.decode();if(!im.naturalWidth)throw Error('Undecoded gateway image');});
 await page.locator('.discovery-hero').screenshot({path:shots+'/discovery-hero-'+width+'.png'});
 await page.locator('.discovery-worlds').screenshot({path:shots+'/discovery-worlds-'+width+'.png'});
 // The prominent search must restore focus to its actual opener on Escape.
 const search=page.getByRole('button',{name:'WunderKompass durchsuchen',exact:true});
 await search.focus();await page.keyboard.press('Enter');
 await page.getByRole('dialog').locator('input').fill('Mondphasen');
 await page.getByRole('option').filter({hasText:'Warum verändert der Mond seine Form?'}).waitFor();
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
 assert.equal(await search.evaluate(el=>el===document.activeElement),true,'search focus returns');
 assert.equal(await page.locator('#globe-observatory').count(),0,'home does not mount the full globe controls');
 await page.getByRole('button',{name:'Direkt zur Weltkugel',exact:true}).focus();await page.keyboard.press('Enter');
 await page.locator('#globe-observatory').waitFor();assert.equal(new URL(page.url()).hash,'#globe');assert.equal(await page.locator('.discovery-hero').count(),0,'legacy globe address has its own full view');
 assert.ok(!/Deutschland/.test(await page.locator('#globe-mission').innerText()),'globe mission does not reveal its answer');
 await page.goBack();await page.locator('.discovery-hero').waitFor();await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='home-globe');
 // All six gateways work in both the compact centre and the shared world hub.
 for(const c of categories){
  await home();const gateway=page.locator('.discovery-worlds').getByRole('button',{name:c.title,exact:true});
  if(width===390)await gateway.tap();else await gateway.click();
  await page.getByRole('heading',{name:c.title,exact:true}).waitFor();
  assert.equal(new URL(page.url()).hash,'#world/'+c.id);await inspect();
 }
 await home();await page.getByRole('button',{name:'Alle Welten & Lernrouten',exact:true}).click();
 await page.locator('.world-view .world-choice').first().waitFor();
 assert.equal(await page.locator('.world-view .world-choice').count(),categories.length);
 await inspect();
 await page.locator('.world-view').getByRole('button',{name:categories.at(-1).title,exact:true}).click();
 await page.locator('.world-topic-tile').first().waitFor();
 for(const trail of DISCOVERY_CONNECTIONS){
  const edge=KNOWLEDGE_CONNECTIONS.find(c=>c.id===trail.id),from=topics.find(t=>t.id===edge.fromId),to=topics.find(t=>t.id===edge.toId);
  await home();await openTrailPicker(page);const network=page.locator('.discovery-network');
  await network.getByRole('button',{name:trail.label,exact:true}).focus();await page.keyboard.press('Enter');
  await network.getByText(edge.why,{exact:true}).waitFor();await inspect();
  const start=network.getByRole('button',{name:from.title,exact:true});
  if(width===390)await start.tap();else await start.click();
  await page.getByRole('heading',{name:from.title,exact:true}).waitFor();
  // Die erklärte Verbindung steht als Kachel in „Dazu passt“ oder unter „Mehr erfahren“, mit demselben Satz „warum“.
  const hin=await verbindungsKnopf(page,from.id,to.id);assert.equal(await verbindungsSatz(hin),edge.why);await hin.click();
  await page.getByRole('heading',{name:to.title,exact:true}).waitFor();
  const zurueck=await verbindungsKnopf(page,to.id,from.id);assert.equal(await verbindungsSatz(zurueck),edge.why);await zurueck.click();
  await page.getByRole('heading',{name:from.title,exact:true}).waitFor();
  await home();await openTrailPicker(page);await network.getByRole('button',{name:trail.label,exact:true}).click();
  await network.getByRole('button',{name:/^Lernroute:/}).click();
  assert.equal(new URL(page.url()).hash,'#world/route/'+trail.routeId);
  await page.locator('.world-route-stations').waitFor();
 }
 if(width===390||width===1440){
  const trails=await read('../../app/discovery-connections.json');await home();await openTrailPicker(page);
  for(const trail of trails){await page.getByRole('combobox',{name:'Wissensspur auswählen',exact:true}).selectOption(trail.id);await page.locator('.discovery-pair>article').first().locator(':scope > figure,:scope > .research-preview').waitFor();await decodeHomeImages(page);await discoveryPairMedia(page);}
  report.checks.push('All'+trails.length+' canonical Home connections show both real topic figures at'+width+'; action icons excluded');
 }
 await home();await rapidHashReturn(page,report,width);await decodeHomeImages(page);await page.locator('.discovery-pathways').screenshot({path:shots+'/discovery-pathways-'+width+'.png'});
 await page.addScriptTag({path:AXE_FILE});
 const axe=await page.evaluate(async()=>{
  const result=await window.axe.run({include:[['.discovery-hero'],['.discovery-worlds'],['.discovery-pathways']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
  return result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
 });assert.deepEqual(axe,[],'discovery axe '+width);
 await openTrailPicker(page);await page.locator('.discovery-network').getByRole('button',{name:'Biene & Blüte',exact:true}).click();await page.getByRole('link',{name:'Wissens-Challenge öffnen',exact:true}).click();
 await page.locator('.challenge-levels').waitFor();
 assert.equal(await page.locator('.challenge-levels button').count(),3);
 await page.locator('.challenge-levels').getByRole('button').filter({hasText:'Leicht'}).click();
 await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.reload();await ready(page);await home();
 await page.getByRole('button',{name:'Fortsetzen',exact:true}).click();
 await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.getByRole('button',{name:'Andere Stufe auswählen',exact:true}).click();
 await page.locator('.challenge-levels').waitFor();
 report.checks.push('Discovery centre '+width+': search/focus/globe, six shared gateways, eight reciprocal trails/routes, direct challenge/resume, WCAG axe');
}

// Exercise competing updates in one turn; normal awaited clicks can conceal
// a separately stored tab mode that survives an already superseded route.
export async function rapidHashReturn(page,report,width){
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 report.rapidHashReturns??=[];
 for(const trigger of ['route-button','world-tab']){
  await page.evaluate(trigger=>{
   const button=trigger==='route-button'?[...document.querySelectorAll('.discovery-network button')].find(b=>b.textContent.startsWith('Lernroute:')):document.querySelector('[data-route-focus="home-nav-world"]');
   if(!button)throw Error('Actual navigation control missing');button.click();location.hash='home';
  },trigger);
  await page.waitForFunction(()=>location.hash==='#home'&&document.querySelector('.earth-app')?.dataset.mode==='home'&&!!document.querySelector('.discovery-hero')?.getClientRects().length,undefined,{timeout:20000});
  assert.deepEqual((await page.getByRole('navigation',{name:'Bereiche',exact:true}).locator('[aria-current=page]').allTextContents()).map(t=>t.trim()),['Start']);
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
  for(const key of ['gameSessions','notes','favorites','games','journeys','labs','review','settings'])assert.deepEqual(after[key],before[key],'rapid return preserves '+key);
  report.rapidHashReturns.push({width,trigger,controlledSameTurnInput:true,hashAndVisibleAreaAgree:true,storedProgressPreserved:true});
 }
}

export async function offlineDiscoveryCentral(page,report){
 await page.evaluate(()=>location.hash='home');await page.locator('.discovery-hero').waitFor();
 for(const image of await page.locator('.discovery-worlds img').all())await image.evaluate(async im=>{await im.decode();assertImage(im);function assertImage(im){if(!im.naturalWidth)throw Error('Offline gateway image missing');}});
 await openTrailPicker(page);await page.locator('.discovery-network').getByRole('button',{name:'Meer in Bewegung',exact:true}).click();
 await page.locator('.discovery-connection-why').getByText(KNOWLEDGE_CONNECTIONS.find(c=>c.id==='science-tides--science-currents').why,{exact:true}).waitFor();
 await openTrailPicker(page);await page.locator('.discovery-network').getByRole('button',{name:'Biene & Blüte',exact:true}).click();await page.getByRole('link',{name:'Wissens-Challenge öffnen',exact:true}).click();await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.evaluate(()=>location.hash='updates');await page.locator('.kern-neuigkeiten').waitFor();assert.equal(await page.locator('.kern-neuigkeiten li[data-neuigkeit]').count(),NEUIGKEITEN.length,'offline: alle Neuigkeiten da');await bereich(page,'explore').click();await page.locator('.discovery-hero').waitFor();
 await bereich(page,'world').click();await page.locator('.world-view .world-choice').first().waitFor();assert.equal(await page.locator('.world-view .world-choice').count(),6,'all six worlds remain available in a cold offline browser');assert.equal((await page.locator('nav[aria-label="Bereiche"] [aria-current=page]').innerText()).trim(),'Welten');await page.locator('.world-view').getByRole('button',{name:'Wissenschaft & Weltall',exact:true}).click();await page.locator('.world-topic-tile').first().waitFor();await bereich(page,'explore').click();await page.locator('.discovery-hero').waitFor();
 await openTrailPicker(page);const previousTrail=await page.getByRole('combobox',{name:'Wissensspur auswählen',exact:true}).inputValue();await page.getByRole('combobox',{name:'Wissensspur auswählen',exact:true}).selectOption('person-mae_jemison--history-iss');await page.locator('[data-route-focus="home-topic-history-iss"]').waitFor();for(const image of await page.locator('.discovery-pair img[src]').all())await image.evaluate(im=>im.decode());await discoveryPairMedia(page);report.checks.push('Actual cold offline Mae Jemison and ISS pair: cached portrait and real orbital-laboratory diagram remain complete');await page.getByRole('combobox',{name:'Wissensspur auswählen',exact:true}).selectOption(previousTrail);
 report.checks.push('Cold offline discovery: all gateway photos decode, knowledge trail switches, challenge opens, local history, six-world main navigation/category and home work');
}

// First visits must be tested in fresh contexts; accumulated regression state
// otherwise hides empty/resume mistakes. Uses the same production preview.
export async function homeTextGeometry(page){
 const bad=await page.locator('.discovery-hero-copy h1,.discovery-feature>a,.discovery-hero button,.discovery-hero .photo-disclosure,.discovery-hero-copy>p,.discovery-hero-copy button,.discovery-quiet-links a,.discovery-mobile-help,.kern-leiste a,.discovery-worlds .world-choice,.discovery-text-link,.discovery-pathways h2,.discovery-concept li,.discovery-concept figcaption,.discovery-context-photo figcaption,.discovery-pair button,.continue-card,.kern-neuigkeiten h1,.kern-neuigkeiten-einleitung,.kern-neuigkeiten li h2,.kern-neuigkeiten li p,.kern-neuigkeiten time,.kern-neuigkeiten summary').evaluateAll(elements=>elements.flatMap(el=>{
  if(!el.getClientRects().length)return [];
  const box=el.getBoundingClientRect(),walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),errors=[];
  while(walker.nextNode()){
   const node=walker.currentNode;if(!node.textContent.trim())continue;
   if(!node.parentElement.getClientRects().length||node.parentElement.closest('details:not([open])')&&!node.parentElement.closest('summary'))continue;
   const range=document.createRange();range.selectNodeContents(node);
   for(const r of range.getClientRects())if(r.width&&r.height&&(r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1))errors.push(node.textContent.trim());
  }
  return errors;
 }));assert.deepEqual(bad,[],'homepage/history text remains inside its controls and sections');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2),false,'home/history horizontal overflow');
}
export async function homeTouchTargets(page){
 for(const control of await page.locator('.discovery-hero-copy button,.discovery-hero button,.discovery-feature>a,.discovery-hero .photo-disclosure summary,.discovery-hero .photo-disclosure a,.discovery-quiet-links a,.discovery-mobile-help,.kern-leiste a,.discovery-worlds button,.gateway-credits summary,.discovery-pathways button,.discovery-pathways a,.discovery-pathways summary,.discovery-pathways select,.discovery-activities button,.discovery-activities summary,.discovery-activities a,.daily-discovery button,.daily-discovery summary,.daily-discovery a,.kern-neuigkeiten summary').all()){
  if(!await control.isVisible())continue;
  assert.equal(await control.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44}),true,'home/history touch target at least 44px: '+await control.innerText());
 }
}
export async function homeContrast(control){
 const colors=await control.evaluate(el=>{let bg=el;while(bg.parentElement&&['transparent','rgba(0, 0, 0, 0)'].includes(getComputedStyle(bg).backgroundColor))bg=bg.parentElement;return [getComputedStyle(el).color,getComputedStyle(bg).backgroundColor];});
 const luminance=color=>{const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const [a,b]=colors.map(luminance);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'homepage primary normal/hover text contrast');
}
// Main navigation uses the existing production page and pass; no second runner.
export async function mainNavigation(page,ready,report,width,shots){
 const nav=page.getByRole('navigation',{name:'Bereiche',exact:true}),link=name=>nav.getByRole('link',{name,exact:true});
 // Nach einem Suchtreffer steht die neue Seite schon da, während der Suchdialog noch zugeht und die Leiste kurz aria-hidden ist: warten, bis sie wieder erreichbar ist.
 const selected=async name=>{await page.waitForFunction(name=>{const leiste=document.querySelector('nav[aria-label="Bereiche"]'),aktiv=leiste?.querySelectorAll('[aria-current=page]')??[];return aktiv.length===1&&aktiv[0].textContent.trim()===name&&!leiste.closest('[aria-hidden=true],[inert]');},name);assert.equal(await nav.locator('[aria-current=page]').count(),1);};
 const inspect=async()=>{await homeTextGeometry(page);for(const tab of await nav.getByRole('link').all()){assert.equal(await tab.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44&&parseFloat(getComputedStyle(el).fontSize)>=14}),true,'readable 44px navigation: '+await tab.innerText());}};
 assert.deepEqual((await nav.getByRole('link').allTextContents()).map(t=>t.trim()),['Start','Welten','Spielen','Labor','Reisen','Buch']);
 const enter=async(name,hash,selector)=>{const tab=link(name);if(width<=390)await tab.tap();else await tab.click();try{await page.waitForFunction(hash=>location.hash==='#'+hash,hash);}catch(error){report.navigationDestinationFailure={name,expectedHash:'#'+hash,...await page.evaluate(()=>({actualHash:location.hash,mode:document.querySelector('.earth-app')?.dataset.mode,activeTabs:[...document.querySelectorAll('nav[aria-label="Bereiche"] [aria-current=page]')].map(e=>e.textContent)}))};await page.screenshot({path:shots+'/navigation-destination-failure-'+width+'.png',fullPage:true}).catch(()=>{});throw error;}if(hash==='globe')await page.locator('#globe-observatory').scrollIntoViewIfNeeded();await page.locator(selector).first().waitFor();await selected(name);await inspect();};
 const world=link('Welten');
 await link('Start').focus();await page.keyboard.press('Tab');await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='home-nav-world');assert.equal(await world.evaluate(el=>el===document.activeElement),true,'Tab reaches the Welten link');assert.equal(new URL(page.url()).hash,'','focus alone does not change the first view');
 await page.keyboard.press('Enter');await page.locator('.world-view').waitFor();await selected('Welten');assert.equal(new URL(page.url()).hash,'#world','actual existing world hub, not home scroll');await inspect();
 await page.screenshot({path:shots+'/navigation-worlds-'+width+'.png',animations:'disabled'});await page.locator('.world-trips .section-heading').screenshot({path:shots+'/navigation-knowledge-routes-'+width+'.png',animations:'disabled'});await nav.screenshot({path:shots+'/navigation-six-'+width+'.png',animations:'disabled'});for(const tab of await nav.getByRole('link').all())await homeContrast(tab);await world.hover();await homeContrast(world);await page.mouse.move(0,0);
 await page.goBack();await page.locator('.discovery-hero').waitFor();await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='home-nav-world');assert.equal(await world.evaluate(el=>el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2),true,'Back restores visible keyboard world opener');await nav.screenshot({path:shots+'/navigation-keyboard-'+width+'.png',animations:'disabled'});if(width===320||width===1440){await page.emulateMedia({forcedColors:'active'});assert.equal(await world.evaluate(el=>el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2),true,'system-color keyboard focus');await homeContrast(nav.locator('[aria-current=page]'));await nav.screenshot({path:shots+'/navigation-system-colors-'+width+'.png',animations:'disabled'});await page.emulateMedia({forcedColors:'none'});}await page.goForward();await page.locator('.world-view').waitFor();await selected('Welten');
 for(const [name,hash,selector] of [['Spielen','games','.game-tile'],['Labor','labs','.research-tile'],['Reisen','journeys','.journey-tile'],['Buch','book','.word-card'],['Start','home','.discovery-hero'],['Welten','world','.world-view']])await enter(name,hash,selector);
 for(const [hash,name] of [['layers','Start'],['day','Start'],['quiz','Spielen']]){await page.evaluate(hash=>location.hash=hash,hash);await selected(name);await inspect();}await enter('Welten','world','.world-view');
 const category=page.locator('.world-view .world-choice').first();const categoryName=await category.getAttribute('aria-label');await category.click();await page.getByRole('heading',{name:categoryName,exact:true}).waitFor();await selected('Welten');
 const topic=page.locator('.world-topic-tile').first();const topicName=await topic.getAttribute('aria-label'),topicFocus=await topic.getAttribute('data-route-focus');await topic.click();await page.locator('#world-topic-title').waitFor();await selected('Welten');await page.goBack();await page.getByRole('heading',{name:categoryName,exact:true}).waitFor();
 await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,topicFocus);assert.equal(await page.getByRole('button',{name:topicName,exact:true}).evaluate(el=>el===document.activeElement),true,'category Back restores the actual card opener');
 await page.goBack();await page.locator('.world-view .world-choice').first().waitFor();await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='world-category-animals');assert.equal(await page.locator('.world-view .world-choice').first().evaluate(el=>el===document.activeElement),true,'world hub Back restores category opener');
 await page.evaluate(()=>location.hash='world/topic/science-moon-phases');await page.locator('.world-mini-question').waitFor();await selected('Welten');await page.getByRole('button',{name:'Merken',exact:true}).click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites.includes('topic:science-moon-phases'));
 // Weitere Verbindungen und Lernrouten stehen in „Mehr erfahren“; nach dem Zurück ist es wieder offen.
 await mehrErfahren(page);const connected=page.locator('.connection-card .knowledge-link').first(),connectionFocus=await connected.getAttribute('data-route-focus');await connected.click();await page.locator('.world-mini-question').waitFor();await page.goBack();await page.waitForFunction(()=>location.hash==='#world/topic/science-moon-phases');await page.locator('.world-mini-question').waitFor();
 await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,connectionFocus);assert.equal(await page.locator('.connection-card .knowledge-link').first().evaluate(el=>el===document.activeElement),true,'article Back restores its knowledge link');
 const routeFocus=await page.locator('.article-routes .knowledge-link').first().getAttribute('data-route-focus');await page.locator('.article-routes .knowledge-link').first().click();await page.locator('.world-route-stations').waitFor();await selected('Welten');const station=await page.locator('.world-route-stations [aria-current=step]').innerText(),routeHash=new URL(page.url()).hash;await mehrErfahren(page.locator('.wissenskarte-eingebettet'));const stationLink=page.locator('.wissenskarte-eingebettet .connection-card .knowledge-link').first(),stationFocus=await stationLink.getAttribute('data-route-focus');await stationLink.click();await page.waitForFunction(()=>location.hash.startsWith('#world/topic/'));await page.locator('.world-mini-question').waitFor();await page.goBack();await page.waitForFunction(hash=>location.hash===hash,routeHash);await page.locator('.world-route-stations').waitFor();await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,stationFocus);assert.equal(await page.locator('.world-route-stations [aria-current=step]').innerText(),station,'station is retained when returning from linked knowledge');await page.goBack();await page.locator('.world-mini-question').waitFor();await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,routeFocus);assert.equal(await page.locator('.article-routes .knowledge-link').first().evaluate(el=>el===document.activeElement),true,'route Back restores its article link');
 const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 await page.reload();await ready(page);await page.locator('.world-mini-question').waitFor();await selected('Welten');assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites),save.favorites);assert.equal(await page.getByRole('button',{name:'Merken',exact:true}).getAttribute('aria-pressed'),'true','actual favorite UI survives navigation and reload');assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.notes),save.notes);
 await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('dialog').locator('input').fill('Wissenswelten');await page.locator('[role=option][data-value="area:world"]').click();await page.locator('.world-view .world-choice').first().waitFor();await selected('Welten');assert.equal(new URL(page.url()).hash,'#world');
 await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('dialog').locator('input').fill('Wissenschaft');await page.locator('[role=option][data-value="world:science"]').click();await page.getByRole('heading',{name:'Wissenschaft & Weltall',exact:true}).waitFor();await selected('Welten');
 await enter('Start','home','.discovery-hero');
 await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.getByRole('button',{name:'Pass sichern',exact:true}).click();await page.getByRole('switch',{name:'Größere Schrift',exact:true}).click();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});await inspect();await nav.screenshot({path:shots+'/navigation-large-'+width+'.png',animations:'disabled'});await page.keyboard.press('Tab');await world.focus();assert.equal(await world.evaluate(el=>el.matches(':focus-visible')),true,'large-font route starts from a real keyboard focus');await page.keyboard.press('Enter');await page.locator('.world-view').waitFor();await selected('Welten');await page.waitForFunction(()=>{const el=document.getElementById('world-category-title'),r=el?.getBoundingClientRect();return document.activeElement===el&&el.matches(':focus-visible')&&r.top>=8&&r.bottom<=innerHeight-8;}).catch(async e=>{console.log('Large-font focus diagnostic',await page.locator('#world-category-title').evaluate(el=>{const r=el.getBoundingClientRect();return {active:el===document.activeElement,visibleFocus:el.matches(':focus-visible'),top:r.top,bottom:r.bottom,viewport:innerHeight,scrollY,font:getComputedStyle(el).fontSize};}));throw e;});assert.equal(await page.locator('#world-category-title').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=8&&r.bottom<=innerHeight-8&&el.matches(':focus-visible')}),true,'large-text destination heading remains visibly focused');await page.screenshot({path:shots+'/navigation-large-destination-'+width+'.png',animations:'disabled'});await enter('Start','home','.discovery-hero');
 await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.getByRole('button',{name:'Pass sichern',exact:true}).click();await page.getByRole('switch',{name:'Größere Schrift',exact:true}).click();await page.keyboard.press('Escape');
 report.checks.push('Main navigation '+width+': six destinations, active world/card/route, Tab/Enter, Touch/Back/Forward/opener focus, deep-link reload, search hub/categories, retained route station, large text and actual saved favorite/notes'+(width===320||width===1440?', system-color focus':''));
}

export async function worldFilterKeyboardFocus(page,ready,report,width){
 const base=new URL(page.url()).origin;await page.goto(base+'/#world/animals');await ready(page);
 const input=page.getByRole('textbox',{name:'Entdeckerkarten durchsuchen',exact:true});await input.waitFor();await input.focus();const firstHistory=await page.evaluate(()=>history.length);await input.pressSequentially('Elefant',{delay:25});
 assert.equal(await input.inputValue(),'Elefant','every real keystroke reaches the filter on the first page');assert(await input.evaluate(el=>el===document.activeElement&&el.selectionStart===el.value.length),'filter keeps actual caret and focus');assert.equal(new URL(page.url()).hash,'#world/animals');assert.equal(await page.evaluate(()=>history.length),firstHistory,'typing does not invent a pagination history entry');
 await input.fill('');await page.getByRole('button',{name:'Nächste Seite',exact:true}).click();await page.waitForURL('**/#world/animals/page/2');await input.focus();const laterHistory=await page.evaluate(()=>history.length);await input.pressSequentially('Panda',{delay:25});assert.equal(await input.inputValue(),'Panda','typing from a later page keeps all characters');assert(await input.evaluate(el=>el===document.activeElement&&el.selectionStart===el.value.length));assert.equal(new URL(page.url()).hash,'#world/animals/page/1');assert.equal(await page.evaluate(()=>history.length),laterHistory,'filter replaces the current page instead of adding a history step');
 const cases={width,firstPageKeyboardAndCaret:true,laterPageKeyboardAndCaret:true,historyPreserved:true};
 for(const [label,key] of [['Tiergruppe','group'],['Lebensraum','habitat']]){await input.fill('');const group=page.getByRole('combobox',{name:'Tiergruppe',exact:true}),habitat=page.getByRole('combobox',{name:'Lebensraum',exact:true});const disclosure=page.locator('.world-animal-filters');if(!await disclosure.evaluate(el=>el.open))await disclosure.locator('summary').click();await group.selectOption({label:'Alle'});await habitat.selectOption({label:'Alle'});await page.getByRole('button',{name:'Nächste Seite',exact:true}).click();await page.waitForURL('**/#world/animals/page/2');const control=page.getByRole('combobox',{name:label,exact:true});await control.focus();await control.selectOption({label:await control.locator('option').nth(1).innerText()});await page.waitForURL('**/#world/animals/page/1');assert(await control.evaluate(el=>el===document.activeElement),'selected '+label+' keeps focus after page reset');assert(await disclosure.evaluate(el=>el.open));cases[key+'FocusAndDisclosurePreserved']=true;}
 (report.worldFilterKeyboard??=[]).push(cases);report.checks.push('Actual category filter typing/caret and both open selects keep focus from page1/page2 without extra history '+width);
}

export async function homepageOverview(browser,base,ready,monitor,report,shots){
 report.homepageViews=[];
 for(const [width,height] of [[320,720],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080]]){
  const c=await browser.newContext({viewport:{width,height},isMobile:width<=390,hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.goto(base);await ready(p);
   for(const image of await p.locator('.discovery-worlds img').all())await image.evaluate(im=>im.decode());
   assert.equal(await p.locator('.continue-card').count(),0,'empty visitor has no false resume');
   assert.equal(await p.getByRole('navigation',{name:'Bereiche',exact:true}).getByRole('link').count(),6,'six distinct learning hubs');
   assert.equal(await p.locator('.discovery-worlds .world-choice').count(),6);
   assert.equal(await p.locator('#globe-observatory').count(),0,'first home view leaves the full globe in its direct view');
   const start=p.getByRole('button',{name:'WunderKompass durchsuchen',exact:true});
   assert.equal(await start.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),true,'clear first step visible without scrolling '+width);
   await homeTextGeometry(p);await homeTouchTargets(p);await homeContrast(start);await start.hover();await homeContrast(start);await p.mouse.move(0,0);
   const capture=async state=>{await decodeHomeImages(p);await p.evaluate(()=>scrollTo(0,0));const panelLayout=await homePanelLayout(p);await p.screenshot({path:shots+'/home-'+state+'-'+width+'-full.png',fullPage:true,animations:'disabled'});await p.screenshot({path:shots+'/home-'+state+'-'+width+'-top.png',animations:'disabled'});report.homepageViews.push({width,height,state,panelLayout,scrollHeight:await p.evaluate(()=>document.documentElement.scrollHeight)});};
   await capture('first');
   await mainNavigation(p,ready,report,width,shots);
   if(width<=390){await p.getByRole('button',{name:'So geht’s',exact:true}).tap();await p.locator('.help-dialog').waitFor();await p.keyboard.press('Escape');}

   await gatewayModelPreviews(p,report);
   await p.locator('.discovery-worlds').screenshot({path:shots+'/home-worlds-'+width+'.png',animations:'disabled'});
   await p.locator('.discovery-pathways').screenshot({path:shots+'/home-next-'+width+'.png',animations:'disabled'});
   await p.evaluate(()=>scrollTo(0,0));
   await p.keyboard.press('Tab');await start.focus();assert.equal(await start.evaluate(el=>el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2),true,'first step keyboard focus');
   await p.screenshot({path:shots+'/home-keyboard-'+width+'.png',animations:'disabled'});await p.keyboard.press('Enter');
   await p.getByRole('dialog').locator('input').waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});assert.equal(await start.evaluate(el=>el===document.activeElement),true,'shared search returns to the actual prominent opener');
   const globe=p.getByRole('button',{name:'Direkt zur Weltkugel',exact:true});await globe.focus();await p.keyboard.press('Enter');await p.locator('#globe-observatory').waitFor();await p.waitForFunction(()=>document.activeElement?.id==='learning-main');assert.equal(new URL(p.url()).hash,'#globe');assert.equal(await p.locator('.discovery-hero').count(),0,'full globe has its own view');await p.locator('#globe-observatory').scrollIntoViewIfNeeded();await p.screenshot({path:shots+'/home-keyboard-globe-'+width+'.png',animations:'disabled'});
   await p.locator('.home-earth-facts>summary').click();await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.equal(await p.locator('.home-earth-facts').evaluate(el=>el.open),true,'a freshly opened facts section stays open after route restoration');assert.equal(await p.locator('.planet-facts button').count(),3);await p.locator('.planet-facts button').first().click();await p.locator('.home-earth-facts>summary').click();
   await p.goBack();await p.locator('.discovery-hero').waitFor();await p.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='home-globe');
   if(width<=390){await globe.tap();await p.locator('#globe-observatory').waitFor();await p.screenshot({path:shots+'/home-touch-globe-'+width+'.png'});await p.goBack();await p.locator('.discovery-hero').waitFor();await p.locator('.discovery-worlds .world-choice').first().tap();await p.getByRole('heading',{name:categories[0].title,exact:true}).waitFor();await p.goBack();await p.locator('.discovery-hero').waitFor();}
   await p.locator('.gateway-credits>summary').click();assert.equal(await p.locator('.gateway-credits a[href^="https://"]').count(),8,'all eight original and license links preserved');assert.deepEqual(await p.locator('.gateway-credits a[href^="#world/topic/"]').evaluateAll(nodes=>nodes.map(el=>el.getAttribute('href'))),['#world/topic/invention-bicycle','#world/topic/science-solar-system'],'both concrete preview learning paths');await homeTextGeometry(p);await p.locator('.gateway-credits').screenshot({path:shots+'/home-credits-'+width+'.png'});await p.locator('.gateway-credits>summary').click();
   // Keyboard activation followed by browser Back keeps the visible opener and chosen trail.
   await openTrailPicker(p);await p.locator('.discovery-trail-options button').last().click();
   const trail=await p.locator('.discovery-trail-options [aria-pressed=true]').innerText();
   const opener=p.locator('.discovery-pair button').first();await opener.scrollIntoViewIfNeeded();await p.keyboard.press('Tab');await opener.focus();
   const openerId=await opener.getAttribute('data-route-focus');await p.keyboard.press('Enter');await p.locator('#world-topic-title').waitFor();
   await p.goBack();await p.locator('.discovery-hero').waitFor();
   await p.waitForFunction(id=>document.activeElement?.getAttribute('data-route-focus')===id,openerId);
   assert.equal(await p.locator('.discovery-trail-options [aria-pressed=true]').innerText(),trail,'Back preserves chosen knowledge trail');
   assert.equal(await p.locator('.discovery-pair button').first().evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2}),true,'Back focus is actually visible in the scrolled home section');
   await p.screenshot({path:shots+'/home-back-focus-'+width+'.png',animations:'disabled'});
   await p.evaluate(()=>scrollTo(0,0));await p.locator('.skip-link').focus();await p.keyboard.press('Enter');
   assert.equal(await p.locator('#learning-main').evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')),true,'keyboard skip navigation remains usable');
   assert.equal(await p.locator('#discovery-title').evaluate(el=>parseFloat(getComputedStyle(el).outlineWidth)>=2),true,'calm heading focus remains visible');
   // „Was ist neu?“ über den Fuß: Titel fokussiert, alle Einträge, Zurück/Vor, axe; der Pass bleibt gleich.
   const readProgress=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
   const before=await readProgress();await p.getByRole('contentinfo').getByRole('link',{name:'Was ist neu?',exact:true}).click();await p.locator('.kern-neuigkeiten').waitFor();
   assert.equal(await p.locator('#updates-title').evaluate(el=>el===document.activeElement),true,'lazy updates title focus');
   await p.screenshot({path:shots+'/updates-'+width+'.png',animations:'disabled'});
   (report.historyViews??=[]).push(await neuigkeitenAnsicht(p,width,shots));
   assert.deepEqual(await readProgress(),before,'„Was ist neu?“ lässt den Pass unverändert');
   await p.getByRole('button',{name:'Alle Welten & Lernrouten',exact:true}).click();await p.locator('.world-view').waitFor();await bereich(p,'explore').click();await p.locator('.discovery-hero').waitFor();assert.equal(new URL(p.url()).hash,'#home','active exploration tab still returns from world hub');
   // A real synthetic chapter choice creates a valid, resumable pass activity.
   await bereich(p,'journeys').click();await p.locator('.journey-tile').first().click();await p.locator('.journey-reader').waitFor();
   const next=p.getByRole('button',{name:'Weiter entdecken',exact:true});await next.click();
   const chapter=await p.locator('.chapter-count').innerText();assert.match(chapter,/Kapitel 2/);
   await p.evaluate(()=>location.hash='home');await p.locator('.continue-card').waitFor();await capture('return');await homeTextGeometry(p);
   await p.getByRole('button',{name:'Weiterlernen',exact:true}).click();await p.locator('.journey-reader').waitFor();assert.equal(await p.locator('.chapter-count').innerText(),chapter,'resume preserves exact chapter');
   await p.reload();await ready(p);await p.evaluate(()=>location.hash='home');await p.locator('.continue-card').waitFor();await p.getByRole('button',{name:'Weiterlernen',exact:true}).click();await p.locator('.journey-reader').waitFor();assert.equal(await p.locator('.chapter-count').innerText(),chapter,'resume after reload');
   await p.evaluate(()=>location.hash='home');await p.locator('.discovery-hero').waitFor();
   await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('button',{name:'Pass sichern',exact:true}).click();await p.getByRole('switch',{name:'Größere Schrift',exact:true}).check();await p.getByRole('switch',{name:'Weniger Bewegung',exact:true}).check();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();
   await homeTextGeometry(p);await homeTouchTargets(p);await capture('large');
   await p.locator('.discovery-worlds').screenshot({path:shots+'/home-worlds-large-'+width+'.png',animations:'disabled'});
   assert.equal(await p.locator('.gateway-compact .world-choice').first().evaluate(el=>getComputedStyle(el).transitionDuration==='0s'),true,'saved reduced motion applies');
   await p.getByRole('contentinfo').getByRole('link',{name:'Was ist neu?',exact:true}).click();await p.locator('.kern-neuigkeiten').waitFor();
   const frueher=p.locator('.kern-neuigkeiten details[data-history-disclosure="neuigkeiten-frueher"]');if(!await frueher.evaluate(el=>el.open))await frueher.locator(':scope > summary').click();
   await homeTextGeometry(p);await homeTouchTargets(p);
   await p.screenshot({path:shots+'/updates-large-'+width+'-full.png',fullPage:true,animations:'disabled'});
   // The resumable-journey path above reloads the page and clears the axe script.
   await prepareAxe(p);
   const axe=await p.evaluate(async()=>{const r=await window.axe.run({include:[['.kern-neuigkeiten']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(axe,[],'updates WCAG axe '+width);
   await bereich(p,'explore').click();await p.locator('.discovery-hero').waitFor();
   const homeAxe=await p.evaluate(async()=>{const r=await window.axe.run({include:[['.discovery-hero'],['.kern-leiste'],['.discovery-worlds'],['.discovery-pathways'],['.continue-card']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(homeAxe,[],'home WCAG axe '+width);
   if(width===320){
    await p.evaluate(()=>{const save=JSON.parse(localStorage.getItem('erde-entdecken:save:v3'));save.progress.lastActivity={type:'game',id:'unknown-stale-session',family:'classic'};localStorage.setItem('erde-entdecken:save:v3',JSON.stringify(save));});await p.reload();await ready(p);assert.equal(await p.locator('.continue-card').count(),0,'stale activity without matching game never offers false resume');
    await p.emulateMedia({forcedColors:'active'});await p.keyboard.press('Tab');await start.focus();assert.equal(await start.evaluate(el=>el.matches(':focus-visible')&&getComputedStyle(el).outlineStyle==='solid'),true,'system colors retain focus');await p.screenshot({path:shots+'/home-system-colors-320.png',animations:'disabled'});
   }
   if(width===320||width===1440){await worldFilterKeyboardFocus(p,ready,report,width);(report.categoryTimelineNavigation??=[]).push(await categoryTimelineNavigation(p));(report.guideDialogs??=[]).push(await guideDialogView(p));}
   console.log('Homepage/history viewport',width,height,'first/return/large passed');
   report.checks.push('Homepage/history '+width+': first/return/large, exact chapter and reload, clear visible first step, touch/text geometry, focus, credits, preserved earth facts, „Was ist neu?“ with all entries, Früher, back/forward and large font, read-only pass, WCAG axe');
  }finally{await c.close();}
 }
}

// „Was ist neu?“ in jedem Browser: alle Einträge in Reihenfolge, große Schrift, Tastatur auf „Früher“,
// Zurück/Vor über die Leiste, axe, Pass bleibt unverändert. Aufrufe: home, engine-journeys, journey-zoom.
export async function neuigkeitenAnsicht(page,width,shots,{engine='chromium',capture}={}){
 await page.evaluate(()=>location.hash='updates');await page.locator('#updates-title').waitFor();
 await page.waitForFunction(()=>document.activeElement?.id==='updates-title');
 assert.equal(await page.locator('#updates-title').evaluate(el=>getComputedStyle(el).outlineStyle),'none','Neuigkeiten '+width+': Titel ohne Fokusrahmen');
 // Große Schrift nur für diese Prüfung; danach wie vorher.
 const grossGesetzt=await page.evaluate(()=>{const app=document.querySelector('.earth-app');if(app.classList.contains('large-reading'))return false;app.classList.add('large-reading');return true;});
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 const ansicht=page.locator('.kern-neuigkeiten');
 assert.deepEqual(await ansicht.locator('li[data-neuigkeit]').evaluateAll(es=>es.map(e=>e.dataset.neuigkeit)),NEUIGKEITEN.map(e=>e.id),'Neuigkeiten '+width+': Einträge und Reihenfolge');
 const frueher=ansicht.locator('details[data-history-disclosure="neuigkeiten-frueher"]'),summary=frueher.locator(':scope > summary');
 if(!await frueher.evaluate(el=>el.open))await summary.click();
 await homeTextGeometry(page);await homeTouchTargets(page);
 await summary.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
 const focus=await summary.evaluate(el=>({active:el===document.activeElement,visible:el.matches(':focus-visible'),outline:parseFloat(getComputedStyle(el).outlineWidth)}));
 if(!focus.active||!focus.visible||focus.outline<2)await page.screenshot({path:shots+'/updates-'+engine+'-focus-failure-'+width+'.png',animations:'disabled'});
 assert.equal(focus.active&&focus.visible&&focus.outline>=2,true,'Neuigkeiten '+width+': sichtbarer Tastaturfokus auf „Früher“ '+JSON.stringify(focus));
 await page.keyboard.press('Enter');assert.equal(await frueher.evaluate(el=>el.open),false,'Enter klappt „Früher“ zu');
 await page.keyboard.press('Enter');assert.equal(await frueher.evaluate(el=>el.open),true,'Enter klappt „Früher“ wieder auf');
 const captures=[];
 const take=async(name,item)=>{await item.scrollIntoViewIfNeeded();if(capture)captures.push(await capture(name));else await page.screenshot({path:shots+'/'+name,animations:'disabled'});};
 await take('updates-'+engine+'-'+width+'.png',ansicht.locator('li[data-neuigkeit]').first());
 await take('updates-'+engine+'-oldest-'+width+'.png',ansicht.locator('li[data-neuigkeit]').last());
 await prepareAxe(page);
 assert.deepEqual(await page.evaluate(async()=>(await window.axe.run('.kern-neuigkeiten',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[],'Neuigkeiten '+width+': axe');
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress),before,'„Was ist neu?“ ändert den Pass nicht');
 if(capture)assert.ok(captures[1].scrollY>captures[0].scrollY+1000,'native capture really reaches the far end of the long history');
 if(grossGesetzt)await page.evaluate(()=>document.querySelector('.earth-app').classList.remove('large-reading'));
 // Zurück/Vor: per Tastatur über die Leiste zum Start, dann zurück. „Früher“ bleibt offen, der Fokus liegt auf „Start“.
 const start=bereich(page,'explore');await start.focus();await page.keyboard.press('Enter');await page.locator('.discovery-hero').waitFor();
 await page.goBack();await ansicht.waitFor();
 assert.equal(new URL(page.url()).hash,'#updates','Zurück führt zu „Was ist neu?“');
 await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='home-nav-explore');
 assert.equal(await frueher.evaluate(el=>el.open),true,'Zurück stellt „Früher“ offen wieder her');
 await page.goForward();await page.locator('.discovery-hero').waitFor();
 return {width,entries:NEUIGKEITEN.map(e=>e.id),expanded:true,largeText:true,keyboard:true,axe:true,passPreserved:true,backForward:true,...(capture?{captures}:{})};
}

async function immediateHomePhotoCases(browser,base,ready,monitor,report,shots){
 const entries=(await read('../../app/world-index.json')).filter(t=>t.homeQuestion&&t.image),photos=await read('../../app/world-photos.json'),trail=(await read('../../app/discovery-connections.json'))[0].id,observed=[];
 for(const width of[320,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();monitor(page);const bilderFertig=bildanfragen(page);page.setDefaultTimeout(20000);let requests=0;
  try{
   await page.route('**/world-photos-*.json',route=>{requests++;return route.abort('failed');});
   await page.goto(base);await ready(page);
   for(const entry of entries){
    await page.evaluate(({id,trail})=>{history.replaceState({...history.state,wunderHero:id,wunderTrail:trail},'');sessionStorage.setItem('wunderkompass-discovery-visit',JSON.stringify({heroId:id,trailId:trail,lastInputAt:Date.now(),idleDue:false}));},{id:entry.id,trail});
    await bilderFertig();await page.reload();await ready(page);await page.waitForFunction(id=>document.querySelector('[data-discovery-hero]')?.dataset.discoveryHero===id,entry.id);
    const photo=photos[entry.image],hero=page.locator('.discovery-hero'),image=hero.locator('img[src]').first();await image.evaluate(im=>im.decode());assert.equal(await image.getAttribute('src'),photo.src);assert.equal(await image.getAttribute('alt'),photo.alt_de);await hero.locator('.discovery-feature>a').getByText(entry.homeQuestion,{exact:true}).waitFor();
    const credit=hero.locator('.photo-disclosure'),details=credit.locator('details');if(!await details.evaluate(el=>el.open))await credit.locator('summary').click();assert((await credit.innerText()).includes(photo.author),entry.id+' immediate author');assert.equal(await credit.getByRole('link',{name:photo.license,exact:true}).getAttribute('href'),photo.license_url);assert.equal(await credit.getByRole('link',{name:'Original und Rechte',exact:true}).getAttribute('href'),photo.source_page_url);await credit.getByText(photo.transformations_de,{exact:true}).waitFor();assert.equal(requests,0,entry.id+' complete Home rights without the deferred article catalog');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2),false,entry.id+' rights disclosure stays within viewport');observed.push({width,id:entry.id,immediateCompleteCanonicalCredits:true,decodedActualPhoto:true});
   }
   await page.screenshot({path:shots+'/home-immediate-rights-'+width+'.png',animations:'disabled'});await bilderFertig();
  }finally{await context.close();}
 }
 assert.equal(observed.length,entries.length*2);report.homeImmediatePhotoCredits=observed;report.checks.push('Every canonical Home photo/question at320/1440 retains complete immediate author/license/original/transformation metadata with deferred article catalog unavailable');
}
