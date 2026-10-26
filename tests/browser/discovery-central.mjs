import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {publicUpdates,PREPARED_UPDATES,updateLabel,formatHistoryDay} from '../../app/update-history.ts';
import {DISCOVERY_CONNECTIONS} from '../../app/discovery-data.ts';
import {KNOWLEDGE_CONNECTIONS} from '../../app/knowledge-connections.ts';
const read=async p=>JSON.parse(await fs.readFile(new URL(p,import.meta.url),'utf8'));
const topics=await read('../../app/world-catalog.json'),categories=await read('../../exports/content/world-categories.json');

export function assertHomePanelReserve(boxes){
 const normalEndSpace=boxes.worldMarginBottom+boxes.panelPaddingBottom+boxes.panelBorderBottom;
 assert.ok(boxes.unusedAfterWorld<=normalEndSpace+2,'unnecessary home panel reserve after the six worlds: '+JSON.stringify(boxes));
}
export async function homePanelLayout(page){
 const boxes=await page.evaluate(()=>{
  const panel=document.querySelector('.learning-panel'),world=document.querySelector('.discovery-worlds'),next=document.querySelector('.discovery-pathways');
  if(!panel||!world||!next)throw Error('Home worlds and connections must be present before measuring');
  const p=panel.getBoundingClientRect(),w=world.getBoundingClientRect(),n=next.getBoundingClientRect(),ps=getComputedStyle(panel),ws=getComputedStyle(world);
  return{panelHeight:p.height,worldHeight:w.height,unusedAfterWorld:p.bottom-w.bottom,distanceToConnections:n.top-w.bottom,worldMarginBottom:parseFloat(ws.marginBottom),panelPaddingBottom:parseFloat(ps.paddingBottom),panelBorderBottom:parseFloat(ps.borderBottomWidth),panelMinBlock:ps.minBlockSize};
 });assertHomePanelReserve(boxes);return boxes;
}

export async function discoveryCentral(page,ready,report,width,shots){
 const home=async()=>{await page.evaluate(()=>location.hash='home');try{await page.locator('.discovery-hero').waitFor();}catch(error){report.routeReturnFailure={width,...await page.evaluate(()=>({hash:location.hash,mode:document.querySelector('.earth-app')?.dataset.mode,selectedTabs:[...document.querySelectorAll('[role=tab][aria-selected=true]')].map(e=>e.textContent),heroPresent:!!document.querySelector('.discovery-hero')})).catch(e=>({diagnosticError:e.message}))};await page.screenshot({path:shots+'/route-return-failure-'+width+'.png',fullPage:true}).catch(()=>{});throw error;}};
 const inspect=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'discovery overflow '+width);
 await home();await inspect();
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
  await home();const network=page.locator('.discovery-network');
  await network.getByRole('button',{name:trail.label,exact:true}).focus();await page.keyboard.press('Enter');
  await network.getByText(edge.why,{exact:true}).waitFor();await inspect();
  const start=network.getByRole('button',{name:from.title,exact:true});
  if(width===390)await start.tap();else await start.click();
  await page.getByRole('heading',{name:from.title,exact:true}).waitFor();
  await page.locator('.connection-card').filter({hasText:edge.why}).getByRole('button').click();
  await page.getByRole('heading',{name:to.title,exact:true}).waitFor();
  await page.locator('.connection-card').filter({hasText:edge.why}).getByRole('button').click();
  await page.getByRole('heading',{name:from.title,exact:true}).waitFor();
  await home();await network.getByRole('button',{name:trail.label,exact:true}).click();
  await network.getByRole('button',{name:/^Lernroute:/}).click();
  assert.equal(new URL(page.url()).hash,'#world/route/'+trail.routeId);
  await page.locator('.world-route-stations').waitFor();
 }
 await home();await rapidHashReturn(page,report,width);await page.locator('.discovery-pathways').screenshot({path:shots+'/discovery-pathways-'+width+'.png'});
 await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 const axe=await page.evaluate(async()=>{
  const result=await window.axe.run({include:[['.discovery-hero'],['.discovery-worlds'],['.discovery-pathways']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
  return result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
 });assert.deepEqual(axe,[],'discovery axe '+width);
 await page.locator('.discovery-network').getByRole('button',{name:'Biene & Blüte',exact:true}).click();await page.getByRole('link',{name:'Wissens-Challenge öffnen',exact:true}).click();
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
  assert.equal(await page.getByRole('tab',{name:'Entdecken',exact:true}).getAttribute('aria-selected'),'true');
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
  for(const key of ['gameSessions','notes','favorites','games','journeys','labs','review','settings'])assert.deepEqual(after[key],before[key],'rapid return preserves '+key);
  report.rapidHashReturns.push({width,trigger,controlledSameTurnInput:true,hashAndVisibleAreaAgree:true,storedProgressPreserved:true});
 }
}

export async function offlineDiscoveryCentral(page,report){
 await page.evaluate(()=>location.hash='home');await page.locator('.discovery-hero').waitFor();
 for(const image of await page.locator('.discovery-worlds img').all())await image.evaluate(async im=>{await im.decode();assertImage(im);function assertImage(im){if(!im.naturalWidth)throw Error('Offline gateway image missing');}});
 await page.locator('.discovery-network').getByRole('button',{name:'Meer in Bewegung',exact:true}).click();
 await page.locator('.discovery-connection-why').getByText(/Gezeiten können Strömungen antreiben/).waitFor();
 await page.locator('.discovery-network').getByRole('button',{name:'Biene & Blüte',exact:true}).click();await page.getByRole('link',{name:'Wissens-Challenge öffnen',exact:true}).click();await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.evaluate(()=>location.hash='updates');await page.locator('.updates-timeline').first().waitFor();assert.equal(await page.locator('.updates-timeline>li').count(),publicUpdates().length);await page.getByRole('link',{name:'Zur Startseite',exact:true}).click();await page.locator('.discovery-hero').waitFor();
 await page.getByRole('tab',{name:'Wissenswelten',exact:true}).click();await page.locator('.world-view .world-choice').first().waitFor();assert.equal(await page.locator('.world-view .world-choice').count(),6,'all six worlds remain available in a cold offline browser');assert.equal(await page.locator('.mode-tabs [data-state=active]').innerText(),'Wissenswelten');await page.locator('.world-view').getByRole('button',{name:'Wissenschaft & Weltall',exact:true}).click();await page.locator('.world-topic-tile').first().waitFor();await page.getByRole('tab',{name:'Entdecken',exact:true}).click();await page.locator('.discovery-hero').waitFor();
 report.checks.push('Cold offline discovery: all gateway photos decode, knowledge trail switches, challenge opens, local history, six-world main navigation/category and home work');
}

// First visits must be tested in fresh contexts; accumulated regression state
// otherwise hides empty/resume mistakes. Uses the same production preview.
export async function homeTextGeometry(page){
 const bad=await page.locator('.discovery-hero-copy h1,.discovery-hero-copy>p,.discovery-hero-copy button,.discovery-quiet-links a,.discovery-mobile-help,.mode-tabs button,.discovery-worlds .world-choice,.discovery-text-link,.discovery-pathways h2,.discovery-pair button,.continue-card,.updates-entry,.updates-detail-body,.updates-details>summary,.updates-archive>summary,.updates-archive-intro,.updates-note,.updates-heading,.updates-provenance,.updates-prepared>p,.updates-prepared-entry').evaluateAll(elements=>elements.flatMap(el=>{
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
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'home/history horizontal overflow');
}
async function homeTouchTargets(page){
 for(const control of await page.locator('.discovery-hero-copy button,.discovery-quiet-links a,.discovery-mobile-help,.mode-tabs button,.discovery-worlds button,.gateway-credits summary,.discovery-pathways button,.discovery-pathways a,.update-history a,.update-history summary').all()){
  if(!await control.isVisible())continue;
  assert.equal(await control.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44}),true,'home/history touch target at least 44px: '+await control.innerText());
 }
}
async function homeContrast(control){
 const colors=await control.evaluate(el=>{let bg=el;while(bg.parentElement&&['transparent','rgba(0, 0, 0, 0)'].includes(getComputedStyle(bg).backgroundColor))bg=bg.parentElement;return [getComputedStyle(el).color,getComputedStyle(bg).backgroundColor];});
 const luminance=color=>{const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const [a,b]=colors.map(luminance);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'homepage primary normal/hover text contrast');
}
// Main navigation uses the existing production page and pass; no second runner.
export async function mainNavigation(page,ready,report,width,shots){
 const nav=page.locator('.mode-tabs');
 const selected=async name=>{await page.waitForFunction(name=>document.querySelector('.mode-tabs [data-state=active]')?.textContent===name,name);assert.equal(await nav.locator('[data-state=active]').count(),1);};
 const inspect=async()=>{await homeTextGeometry(page);for(const tab of await nav.getByRole('tab').all()){assert.equal(await tab.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44&&parseFloat(getComputedStyle(el).fontSize)>=14}),true,'readable 44px navigation: '+await tab.innerText());}};
 assert.deepEqual(await nav.getByRole('tab').allTextContents(),['Entdecken','Wissenswelten','Spielplatz','Forscherlabor','Lernreisen','Wissensbuch']);
 const enter=async(name,hash,selector)=>{const tab=nav.getByRole('tab',{name,exact:true});if(width<=390)await tab.tap();else await tab.click();try{await page.waitForFunction(hash=>location.hash==='#'+hash,hash);}catch(error){report.navigationDestinationFailure={name,expectedHash:'#'+hash,...await page.evaluate(()=>({actualHash:location.hash,mode:document.querySelector('.earth-app')?.dataset.mode,activeTabs:[...document.querySelectorAll('.mode-tabs [data-state=active]')].map(e=>e.textContent)}))};await page.screenshot({path:shots+'/navigation-destination-failure-'+width+'.png',fullPage:true}).catch(()=>{});throw error;}if(hash==='globe')await page.locator('#globe-observatory').scrollIntoViewIfNeeded();await page.locator(selector).first().waitFor();await selected(name);await inspect();};
 const world=nav.getByRole('tab',{name:'Wissenswelten',exact:true});
 await nav.getByRole('tab',{name:'Entdecken',exact:true}).focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='home-nav-world');assert.equal(await world.evaluate(el=>el===document.activeElement),true,'arrow keys reach new world tab');assert.equal(new URL(page.url()).hash,'','arrow focus alone does not change the first view');
 await page.keyboard.press('Enter');await page.locator('.world-view').waitFor();await selected('Wissenswelten');assert.equal(new URL(page.url()).hash,'#world','actual existing world hub, not home scroll');await inspect();
 await page.screenshot({path:shots+'/navigation-worlds-'+width+'.png',animations:'disabled'});await page.locator('.world-trips .section-heading').screenshot({path:shots+'/navigation-knowledge-routes-'+width+'.png',animations:'disabled'});await nav.screenshot({path:shots+'/navigation-six-'+width+'.png',animations:'disabled'});for(const tab of await nav.getByRole('tab').all())await homeContrast(tab);await world.hover();await homeContrast(world);await page.mouse.move(0,0);
 await page.goBack();await page.locator('.discovery-hero').waitFor();await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='home-nav-world');assert.equal(await world.evaluate(el=>el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2),true,'Back restores visible keyboard world opener');await nav.screenshot({path:shots+'/navigation-keyboard-'+width+'.png',animations:'disabled'});if(width===320||width===1440){await page.emulateMedia({forcedColors:'active'});assert.equal(await world.evaluate(el=>el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2),true,'system-color keyboard focus');await homeContrast(nav.locator('[data-state=active]'));await nav.screenshot({path:shots+'/navigation-system-colors-'+width+'.png',animations:'disabled'});await page.emulateMedia({forcedColors:'none'});}await page.goForward();await page.locator('.world-view').waitFor();await selected('Wissenswelten');
 for(const [name,hash,selector] of [['Spielplatz','games','.game-tile'],['Forscherlabor','labs','.research-tile'],['Lernreisen','journeys','.journey-tile'],['Wissensbuch','book','.word-card'],['Entdecken','home','.discovery-hero'],['Wissenswelten','world','.world-view']])await enter(name,hash,selector);
 for(const [hash,name] of [['layers','Entdecken'],['day','Entdecken'],['quiz','Spielplatz']]){await page.evaluate(hash=>location.hash=hash,hash);await selected(name);await inspect();}await enter('Wissenswelten','world','.world-view');
 const category=page.locator('.world-view .world-choice').first();const categoryName=await category.getAttribute('aria-label');await category.click();await page.getByRole('heading',{name:categoryName,exact:true}).waitFor();await selected('Wissenswelten');
 const topic=page.locator('.world-topic-tile').first();const topicName=await topic.getAttribute('aria-label'),topicFocus=await topic.getAttribute('data-route-focus');await topic.click();await page.locator('#world-topic-title').waitFor();await selected('Wissenswelten');await page.goBack();await page.getByRole('heading',{name:categoryName,exact:true}).waitFor();
 await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,topicFocus);assert.equal(await page.getByRole('button',{name:topicName,exact:true}).evaluate(el=>el===document.activeElement),true,'category Back restores the actual card opener');
 await page.goBack();await page.locator('.world-view .world-choice').first().waitFor();await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='world-category-animals');assert.equal(await page.locator('.world-view .world-choice').first().evaluate(el=>el===document.activeElement),true,'world hub Back restores category opener');
 await page.evaluate(()=>location.hash='world/topic/science-moon-phases');await page.locator('.world-mini-question').waitFor();await selected('Wissenswelten');await page.getByRole('button',{name:'Das interessiert mich!',exact:true}).click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites.includes('topic:science-moon-phases'));
 const connected=page.locator('.connection-card .knowledge-link').first(),connectionFocus=await connected.getAttribute('data-route-focus');await connected.click();await page.locator('.world-mini-question').waitFor();await page.goBack();await page.waitForFunction(()=>location.hash==='#world/topic/science-moon-phases');await page.locator('.world-mini-question').waitFor();
 await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,connectionFocus);assert.equal(await page.locator('.connection-card .knowledge-link').first().evaluate(el=>el===document.activeElement),true,'article Back restores its knowledge link');
 const routeFocus=await page.locator('.article-routes .knowledge-link').first().getAttribute('data-route-focus');await page.locator('.article-routes .knowledge-link').first().click();await page.locator('.world-route-stations').waitFor();await selected('Wissenswelten');const station=await page.locator('.world-route-stations [aria-current=step]').innerText(),routeHash=new URL(page.url()).hash;const stationLink=page.locator('.embedded .connection-card .knowledge-link').first(),stationFocus=await stationLink.getAttribute('data-route-focus');await stationLink.click();await page.waitForFunction(()=>location.hash.startsWith('#world/topic/'));await page.locator('.world-mini-question').waitFor();await page.goBack();await page.waitForFunction(hash=>location.hash===hash,routeHash);await page.locator('.world-route-stations').waitFor();await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,stationFocus);assert.equal(await page.locator('.world-route-stations [aria-current=step]').innerText(),station,'station is retained when returning from linked knowledge');await page.goBack();await page.locator('.world-mini-question').waitFor();await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,routeFocus);assert.equal(await page.locator('.article-routes .knowledge-link').first().evaluate(el=>el===document.activeElement),true,'route Back restores its article link');
 const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 await page.reload();await ready(page);await page.locator('.world-mini-question').waitFor();await selected('Wissenswelten');assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.favorites),save.favorites);assert.equal(await page.getByRole('button',{name:'In deinem Forscherbuch',exact:true}).getAttribute('aria-pressed'),'true','actual favorite UI survives navigation and reload');assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.notes),save.notes);
 await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('dialog').locator('input').fill('Wissenswelten');await page.locator('[role=option][data-value="area:world"]').click();await page.locator('.world-view .world-choice').first().waitFor();await selected('Wissenswelten');assert.equal(new URL(page.url()).hash,'#world');
 await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('dialog').locator('input').fill('Wissenschaft');await page.locator('[role=option][data-value="world:science"]').click();await page.getByRole('heading',{name:'Wissenschaft & Weltall',exact:true}).waitFor();await selected('Wissenswelten');
 await enter('Entdecken','home','.discovery-hero');
 await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.getByRole('button',{name:'Pass sichern',exact:true}).click();await page.getByRole('switch',{name:'Größere Schrift',exact:true}).click();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});await inspect();await nav.screenshot({path:shots+'/navigation-large-'+width+'.png',animations:'disabled'});await page.keyboard.press('Tab');await nav.getByRole('tab',{name:'Wissenswelten',exact:true}).focus();assert.equal(await world.evaluate(el=>el.matches(':focus-visible')),true,'large-font route starts from a real keyboard focus');await page.keyboard.press('Enter');await page.locator('.world-view').waitFor();await selected('Wissenswelten');await page.waitForFunction(()=>{const el=document.getElementById('world-category-title'),r=el?.getBoundingClientRect();return document.activeElement===el&&el.matches(':focus-visible')&&r.top>=8&&r.bottom<=innerHeight-8;}).catch(async e=>{console.log('Large-font focus diagnostic',await page.locator('#world-category-title').evaluate(el=>{const r=el.getBoundingClientRect();return {active:el===document.activeElement,visibleFocus:el.matches(':focus-visible'),top:r.top,bottom:r.bottom,viewport:innerHeight,scrollY,font:getComputedStyle(el).fontSize};}));throw e;});assert.equal(await page.locator('#world-category-title').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=8&&r.bottom<=innerHeight-8&&el.matches(':focus-visible')}),true,'large-text destination heading remains visibly focused');await page.screenshot({path:shots+'/navigation-large-destination-'+width+'.png',animations:'disabled'});await enter('Entdecken','home','.discovery-hero');
 await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.getByRole('button',{name:'Pass sichern',exact:true}).click();await page.getByRole('switch',{name:'Größere Schrift',exact:true}).click();await page.keyboard.press('Escape');
 report.checks.push('Main navigation '+width+': six destinations, active world/card/route, manual arrow/Enter, Touch/Back/Forward/opener focus, deep-link reload, search hub/categories, retained route station, large text and actual saved favorite/notes'+(width===320||width===1440?', system-color focus':''));
}

export async function homepageOverview(browser,base,ready,monitor,report,shots){
 report.homepageViews=[];
 for(const [width,height] of [[320,720],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080]]){
  const c=await browser.newContext({viewport:{width,height},isMobile:width<=390,hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.goto(base);await ready(p);
   for(const image of await p.locator('.discovery-worlds img').all())await image.evaluate(im=>im.decode());
   assert.equal(await p.locator('.continue-card').count(),0,'empty visitor has no false resume');
   assert.equal(await p.locator('.mode-tabs [role=tab]').count(),6,'six distinct learning hubs');
   assert.equal(await p.locator('.discovery-worlds .world-choice').count(),6);
   assert.equal(await p.locator('#globe-observatory').count(),0,'first home view leaves the full globe in its direct view');
   const start=p.getByRole('button',{name:'WunderKompass durchsuchen',exact:true});
   assert.equal(await start.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),true,'clear first step visible without scrolling '+width);
   await homeTextGeometry(p);await homeTouchTargets(p);await homeContrast(start);await start.hover();await homeContrast(start);await p.mouse.move(0,0);
   const capture=async state=>{await p.evaluate(()=>scrollTo(0,0));const panelLayout=await homePanelLayout(p);await p.screenshot({path:shots+'/home-'+state+'-'+width+'-full.png',fullPage:true,animations:'disabled'});await p.screenshot({path:shots+'/home-'+state+'-'+width+'-top.png',animations:'disabled'});report.homepageViews.push({width,height,state,panelLayout,scrollHeight:await p.evaluate(()=>document.documentElement.scrollHeight)});};
   await capture('first');
   await mainNavigation(p,ready,report,width,shots);
   if(width<=390){await p.getByRole('button',{name:'So geht’s',exact:true}).tap();await p.locator('.help-dialog').waitFor();await p.keyboard.press('Escape');}

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
   await p.locator('.gateway-credits>summary').click();assert.equal(await p.locator('.gateway-credits a').count(),8,'all original and license links preserved');await homeTextGeometry(p);await p.locator('.gateway-credits').screenshot({path:shots+'/home-credits-'+width+'.png'});await p.locator('.gateway-credits>summary').click();
   // Keyboard activation followed by browser Back keeps the visible opener and chosen trail.
   await p.locator('.discovery-trail-options button').last().click();
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
   // Publication history neither fabricates dates nor exposes prepared changes.
   const readProgress=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
   const before=await readProgress();await p.getByRole('link',{name:'Was ist neu?',exact:true}).click();await p.locator('.updates-timeline').first().waitFor();
   assert.equal(await p.locator('.updates-timeline>li').count(),publicUpdates().length);
   assert.deepEqual(await p.locator('.updates-meta>span:first-child').allTextContents(),publicUpdates().map(updateLabel));
   assert.deepEqual(await p.locator('.updates-timeline>li .updates-category').allTextContents(),publicUpdates().map(e=>e.category),'every historical and current update has its own readable category');
   assert.deepEqual(await p.locator('.updates-timeline>li time').allTextContents(),publicUpdates().map(e=>formatHistoryDay(e.availableOn??e.publishedOn??e.confirmedOn)),'concise dates retain the precise evidence in datetime');
   assert.equal(await p.locator('.updates-timeline>li[data-update-channel=sites]').count(),13,'retain every historical Sites publication');
   assert.equal(await p.locator('.updates-timeline>li[data-update-channel=vercel-test]').count(),publicUpdates().filter(e=>e.channel==='vercel-test').length,'include independently confirmed test website rounds');
   assert.equal(await p.locator('.updates-timeline>li').first().getAttribute('data-update-id'),publicUpdates()[0].id,'latest confirmed package keeps its ID and comes first');
   assert.equal(await p.locator('.updates-timeline [data-update-id=history-polish]').count(),1,'merged and deployed PR 19 is an available update');
   assert.equal(await p.locator('.updates-timeline>li').first().locator('time').getAttribute('datetime'),publicUpdates()[0].occurredAt,'actual latest Vercel confirmation timestamp');
   assert.equal(await p.locator('.updates-details[open]').count(),0,'optional changes start collapsed');
   assert.equal(await p.locator('#updates-title').evaluate(el=>el===document.activeElement),true,'lazy history title focus');
   assert.deepEqual(await readProgress(),before,'history is read-only for central pass');
   await homeTextGeometry(p);await homeTouchTargets(p);
   await p.screenshot({path:shots+'/updates-'+width+'-full.png',fullPage:true,animations:'disabled'});
   await p.evaluate(()=>scrollTo(0,0));assert.equal(await p.locator('.updates-timeline>li').first().getByRole('heading').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),true,'first actual update heading stays visible beneath compact channel explanation');await p.screenshot({path:shots+'/updates-test-top-'+width+'.png',animations:'disabled'});
   if(PREPARED_UPDATES.length){await p.locator('.updates-prepared>summary').click();await homeTextGeometry(p);await homeTouchTargets(p);
   assert.equal(await p.locator('.updates-prepared-entry[data-update-status=prepared]').count(),PREPARED_UPDATES.length);assert.deepEqual(await p.locator('.updates-prepared-entry').evaluateAll(entries=>entries.map(e=>e.getAttribute('data-update-id'))),PREPARED_UPDATES.map(entry=>entry.id),'every prepared entry retains its exact identity and order');
   assert.equal(await p.locator('.updates-prepared-entry time,.updates-prepared-entry a').count(),0,'unavailable work has no invented date or feature launch link');
   await p.locator('.updates-prepared').screenshot({path:shots+'/updates-prepared-'+width+'.png',animations:'disabled'});await p.locator('.updates-prepared>summary').click();}
   await p.locator('.updates-archive>summary').click();await homeTextGeometry(p);await p.locator('.updates-timeline>li').last().getByText('6. Oktober 2026',{exact:true}).waitFor();await p.locator('.updates-timeline>li').last().screenshot({path:shots+'/updates-first-release-'+width+'.png',animations:'disabled'});await p.screenshot({path:shots+'/updates-archive-'+width+'-full.png',fullPage:true,animations:'disabled'});
   await p.locator('.updates-provenance>summary').click();await homeTextGeometry(p);
   // Real disclosure controls expose bounded changes and the family benefit.
   for(const entry of publicUpdates()){
    const item=p.locator('.updates-timeline>li[data-update-id="'+entry.id+'"]');
    assert.equal(await item.locator('.updates-category').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=14),true,'category remains readable '+entry.id);
    const disclosure=item.locator('.updates-details');
    await disclosure.locator('summary').click();
    assert.equal(await disclosure.evaluate(el=>el.open),true,'native disclosure opens '+entry.id);
    assert.equal(await disclosure.locator('ul>li').count(),entry.details.length,'all concrete changes readable');
    assert.equal(await disclosure.locator('.updates-benefit').innerText(),'Das bringt es euch\n'+entry.benefit);
    assert.equal(await disclosure.locator('summary').evaluate(el=>{
     const text=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()),range=document.createRange();range.selectNodeContents(text);
     const line=[...range.getClientRects()].at(-1),count=el.querySelector('.updates-count').getBoundingClientRect();
     return count.top<line.bottom&&count.bottom>line.top;
    }),true,'detail count stays with its label, without an orphan line '+entry.id);
   }
   await homeTextGeometry(p);await homeTouchTargets(p);
   for(const id of ['first-visit-home','science-articles','site-v14','site-v12','site-v8','site-v1']){
    const item=p.locator('.updates-timeline>li[data-update-id="'+id+'"]');
    console.log('CHRONICLE_CAPTURE_START',JSON.stringify({width,id}));
    try{await item.screenshot({path:shots+'/updates-details-'+id+'-'+width+'.png',animations:'disabled'});}
    catch(error){
     // Preserve the failed assertion and its original timeout. Diagnose the
     // actual failing width/entry without retrying or replacing its capture.
     const diagnostic=await item.evaluate(el=>{const r=el.getBoundingClientRect();return {rect:{x:r.x,y:r.y,width:r.width,height:r.height},scrollY,viewport:{width:innerWidth,height:innerHeight},documentHeight:document.documentElement.scrollHeight,visibility:document.visibilityState,open:el.querySelector('details')?.open};}).catch(e=>({diagnosticError:e.message}));
     report.chronicleCaptureFailure={width,id,...diagnostic};console.log('CHRONICLE_CAPTURE_FAILURE',JSON.stringify(report.chronicleCaptureFailure));
     await p.screenshot({path:shots+'/updates-details-failure-'+id+'-'+width+'.png',animations:'disabled'}).catch(e=>console.log('CHRONICLE_DIAGNOSTIC_CAPTURE_FAILURE',e.message));
     throw error;
    }
    console.log('CHRONICLE_CAPTURE_DONE',JSON.stringify({width,id}));
   }
   assert.deepEqual(await readProgress(),before,'reading all historical changes and benefits leaves learning progress untouched');
   await p.screenshot({path:shots+'/updates-all-details-'+width+'-full.png',fullPage:true,animations:'disabled'});
   await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
   const expandedAxe=await p.evaluate(async()=>{const r=await window.axe.run({include:[['.update-history']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(expandedAxe,[],'all expanded history WCAG axe '+width);
   const olderLink=p.locator('.updates-timeline>li').last().locator('.updates-links a').first();
   await olderLink.scrollIntoViewIfNeeded();await p.keyboard.press('Tab');await olderLink.focus();const olderId=await olderLink.getAttribute('data-route-focus');await p.keyboard.press('Enter');await p.locator('#globe-observatory').waitFor();assert.equal(new URL(p.url()).hash,'#globe','historical globe links retain the full globe destination');
   await p.goBack();await p.locator('.updates-timeline').first().waitFor();await p.waitForFunction(id=>{const el=document.activeElement;if(el?.getAttribute('data-route-focus')!==id)return false;const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&el.matches(':focus-visible');},olderId);
   assert.equal(await p.locator('.updates-archive').evaluate(el=>el.open),true,'Back restores expanded history archive');
   assert.equal(await p.locator('.updates-details[open]').count(),publicUpdates().length,'Back also restores every expanded entry');
   const olderFocus=await olderLink.evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:innerHeight,visible:el.matches(':focus-visible'),outline:parseFloat(getComputedStyle(el).outlineWidth)};});if(!(olderFocus.top>=0&&olderFocus.bottom<=olderFocus.height&&olderFocus.visible&&olderFocus.outline>=2)){await p.screenshot({path:shots+'/updates-back-failure-'+width+'.png'});console.log('Older entry focus geometry',width,JSON.stringify(olderFocus));}assert.equal(olderFocus.top>=0&&olderFocus.bottom<=olderFocus.height&&olderFocus.visible&&olderFocus.outline>=2,true,'Back restores visible older-entry keyboard focus');
   await p.screenshot({path:shots+'/updates-back-focus-'+width+'.png',animations:'disabled'});
   await p.locator('.updates-links a[href="#world"]').first().click();await p.locator('.world-view').waitFor();assert.equal(new URL(p.url()).hash,'#world');
   await p.goBack();await p.locator('.updates-timeline').first().waitFor();await p.getByRole('link',{name:'Zur Startseite',exact:true}).click();await p.locator('.discovery-hero').waitFor();
   await p.goBack();await p.locator('.updates-timeline').first().waitFor();await p.goForward();await p.locator('.discovery-hero').waitFor();
   await p.getByRole('button',{name:'Alle Welten & Lernrouten',exact:true}).click();await p.locator('.world-view').waitFor();await p.getByRole('tab',{name:'Entdecken',exact:true}).click();await p.locator('.discovery-hero').waitFor();assert.equal(new URL(p.url()).hash,'#home','active exploration tab still returns from world hub');
   // A real synthetic chapter choice creates a valid, resumable pass activity.
   await p.getByRole('tab',{name:'Lernreisen',exact:true}).click();await p.locator('.journey-tile').first().click();await p.locator('.journey-reader').waitFor();
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
   await p.getByRole('link',{name:'Was ist neu?',exact:true}).click();await p.locator('.updates-timeline').first().waitFor();
   await p.locator('.updates-details').first().locator('summary').click();
   await homeTextGeometry(p);await homeTouchTargets(p);
   await p.locator('.updates-timeline>li').first().screenshot({path:shots+'/updates-details-large-'+width+'.png',animations:'disabled'});
   await p.screenshot({path:shots+'/updates-large-'+width+'-full.png',fullPage:true,animations:'disabled'});
   // The resumable-journey path above reloads the page and clears the axe script.
   await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
   const axe=await p.evaluate(async()=>{const r=await window.axe.run({include:[['.update-history']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(axe,[],'history WCAG axe '+width);
   await p.getByRole('link',{name:'Zur Startseite',exact:true}).click();await p.locator('.discovery-hero').waitFor();
   const homeAxe=await p.evaluate(async()=>{const r=await window.axe.run({include:[['.discovery-hero'],['.mode-tabs'],['.discovery-worlds'],['.discovery-pathways'],['.continue-card']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(homeAxe,[],'home WCAG axe '+width);
   if(width===320){
    await p.evaluate(()=>{const save=JSON.parse(localStorage.getItem('erde-entdecken:save:v3'));save.progress.lastActivity={type:'game',id:'unknown-stale-session',family:'classic'};localStorage.setItem('erde-entdecken:save:v3',JSON.stringify(save));});await p.reload();await ready(p);assert.equal(await p.locator('.continue-card').count(),0,'stale activity without matching game never offers false resume');
    await p.emulateMedia({forcedColors:'active'});await p.keyboard.press('Tab');await start.focus();assert.equal(await start.evaluate(el=>el.matches(':focus-visible')&&getComputedStyle(el).outlineStyle==='solid'),true,'system colors retain focus');await p.screenshot({path:shots+'/home-system-colors-320.png',animations:'disabled'});
   }
   console.log('Homepage/history viewport',width,height,'first/return/large passed');
   report.checks.push('Homepage/history '+width+': first/return/large, exact chapter and reload, clear visible first step, touch/text geometry, focus, credits, preserved earth facts, history/back/forward, 13 Sites + independently confirmed test website updates including PR 23, separate undated prepared work, all concrete-change disclosures and family benefits, expanded long history and large-font details, read-only pass, WCAG axe');
  }finally{await c.close();}
 }
}

// Reuse the real chronicle, native disclosures and shared text-geometry checks.
// Chromium's complete home suite still exercises every link, state and Back path.
export async function historyEngineView(page,width,shots,{engine='chromium',capture}={}){
 await page.evaluate(()=>location.hash='updates');await page.locator('#updates-title').waitFor();
 await page.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));
 const entries=publicUpdates(),before=await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 assert.deepEqual(await page.locator('.updates-timeline>li').evaluateAll(es=>es.map(e=>e.dataset.updateId)),entries.map(e=>e.id));
 const archive=page.locator('.updates-archive');if(!await archive.evaluate(el=>el.open))await archive.locator(':scope > summary').click();
 for(const entry of entries){
  const item=page.locator('[data-update-id="'+entry.id+'"]'),d=item.locator('.updates-details');
  if(!await d.evaluate(el=>el.open))await d.locator('summary').click();
  assert.equal(await item.locator('.updates-category').innerText(),entry.category);
  assert.equal(await item.locator('.updates-summary').innerText(),entry.summary);
  assert.equal(await d.locator('li').count(),entry.details.length);
 }
 await homeTextGeometry(page);
 const first=page.locator('.updates-timeline>li').first(),last=page.locator('.updates-timeline>li').last();
 const summary=first.locator('.updates-details>summary');
 await summary.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
 const focus=await summary.evaluate(el=>({active:el===document.activeElement,visible:el.matches(':focus-visible'),outline:parseFloat(getComputedStyle(el).outlineWidth)}));
 if(!focus.active||!focus.visible||focus.outline<2)await page.screenshot({path:shots+'/journey-engine-'+engine+'-history-focus-failure-'+width+'.png',animations:'disabled'});
 assert.equal(focus.active&&focus.visible&&focus.outline>=2,true,'real Tab navigation gives visible keyboard focus '+JSON.stringify(focus));
 await page.keyboard.press('Enter');assert.equal(await first.locator('.updates-details').evaluate(el=>el.open),false);await page.keyboard.press('Enter');assert.equal(await first.locator('.updates-details').evaluate(el=>el.open),true);
 assert.equal(await summary.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2),true,'visible keyboard focus persists when reopening the chronicle');
 const captures=[];
 const take=async(name,item)=>{await item.scrollIntoViewIfNeeded();if(capture)captures.push(await capture(name));else await page.screenshot({path:shots+'/'+name,animations:'disabled'});};
 await take('journey-engine-'+engine+'-history-first-'+width+'.png',first);
 await take('journey-engine-'+engine+'-history-oldest-'+width+'.png',last);
 await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await page.evaluate(async()=>(await window.axe.run('.update-history',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress),before,'chronicle does not write learning progress');
 if(capture)assert.ok(captures[1].scrollY>captures[0].scrollY+1000,'native capture really reaches the far end of the long history');
 return {width,entries:entries.map(e=>e.id),expanded:true,largeText:true,keyboard:true,axe:true,passPreserved:true,...(capture?{captures}:{})};
}
