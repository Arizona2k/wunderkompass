import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {publicUpdates,updateLabel} from '../../app/update-history.ts';
import {DISCOVERY_CONNECTIONS} from '../../app/discovery-data.ts';
import {KNOWLEDGE_CONNECTIONS} from '../../app/knowledge-connections.ts';
const read=async p=>JSON.parse(await fs.readFile(new URL(p,import.meta.url),'utf8'));
const topics=await read('../../app/world-catalog.json'),categories=await read('../../exports/content/world-categories.json');

export async function discoveryCentral(page,ready,report,width,shots){
 const home=async()=>{await page.evaluate(()=>location.hash='globe');await page.locator('.discovery-hero').waitFor();};
 const inspect=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'discovery overflow '+width);
 await home();await inspect();
 for(const image of await page.locator('.discovery-worlds img').all())await image.evaluate(async im=>{await im.decode();if(!im.naturalWidth)throw Error('Undecoded gateway image');});
 await page.locator('.discovery-hero').screenshot({path:shots+'/discovery-hero-'+width+'.png'});
 await page.locator('.discovery-worlds').screenshot({path:shots+'/discovery-worlds-'+width+'.png'});
 // The prominent search must restore focus to its actual opener on Escape.
 const search=page.getByRole('button',{name:'Was möchtest du entdecken?',exact:true});
 await search.focus();await page.keyboard.press('Enter');
 await page.getByRole('dialog').locator('input').fill('Mondphasen');
 await page.getByRole('option').filter({hasText:'Warum verändert der Mond seine Form?'}).waitFor();
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
 assert.equal(await search.evaluate(el=>el===document.activeElement),true,'search focus returns');
 await page.getByRole('button',{name:'Mit der Weltkugel starten',exact:true}).click();
 assert.equal(await page.locator('#globe-observatory').evaluate(el=>el===document.activeElement),true);
 assert.ok(await page.locator('#globe-observatory').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<60),'globe scroll target');
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
 await home();await page.locator('.discovery-pathways').screenshot({path:shots+'/discovery-pathways-'+width+'.png'});
 await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 const axe=await page.evaluate(async()=>{
  const result=await window.axe.run({include:[['.discovery-hero'],['.discovery-worlds'],['.discovery-pathways']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
  return result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
 });assert.deepEqual(axe,[],'discovery axe '+width);
 await page.getByRole('button',{name:'Wissens-Challenge öffnen',exact:true}).click();
 await page.locator('.challenge-levels').waitFor();
 assert.equal(await page.locator('.challenge-levels button').count(),3);
 await page.locator('.challenge-levels').getByRole('button').filter({hasText:'Leicht'}).click();
 await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.reload();await ready(page);await home();
 await page.getByRole('button',{name:'Fortsetzen',exact:true}).click();
 await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.getByRole('button',{name:'Andere Stufe auswählen',exact:true}).click();
 await page.locator('.challenge-levels').waitFor();
 report.checks.push('Discovery centre '+width+': search/focus/globe, six shared gateways, three reciprocal trails/routes, direct challenge/resume, WCAG axe');
}

export async function offlineDiscoveryCentral(page,report){
 await page.evaluate(()=>location.hash='globe');await page.locator('.discovery-hero').waitFor();
 for(const image of await page.locator('.discovery-worlds img').all())await image.evaluate(async im=>{await im.decode();assertImage(im);function assertImage(im){if(!im.naturalWidth)throw Error('Offline gateway image missing');}});
 await page.locator('.discovery-network').getByRole('button',{name:'Meer in Bewegung',exact:true}).click();
 await page.locator('.discovery-connection-why').getByText(/Gezeiten können Strömungen antreiben/).waitFor();
 await page.getByRole('button',{name:'Wissens-Challenge öffnen',exact:true}).click();await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.evaluate(()=>location.hash='updates');await page.locator('.updates-timeline').first().waitFor();assert.equal(await page.locator('.updates-timeline>li').count(),publicUpdates().length);await page.getByRole('link',{name:'Zur Startseite',exact:true}).click();await page.locator('.discovery-hero').waitFor();
 report.checks.push('Cold offline discovery: all gateway photos decode, knowledge trail switches, challenge opens, local history and home navigation work');
}

// First visits must be tested in fresh contexts; accumulated regression state
// otherwise hides empty/resume mistakes. Uses the same production preview.
export async function homeTextGeometry(page){
 const bad=await page.locator('.discovery-hero-copy h1,.discovery-hero-copy>p,.discovery-hero-copy button,.discovery-quiet-links a,.discovery-mobile-help,.mode-tabs button,.discovery-worlds .world-choice,.discovery-text-link,.discovery-pathways h2,.discovery-pair button,.continue-card,.updates-entry,.updates-note,.updates-heading,.updates-provenance,.updates-prepared>p,.updates-prepared-entry').evaluateAll(elements=>elements.flatMap(el=>{
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
 const colors=await control.evaluate(el=>[getComputedStyle(el).color,getComputedStyle(el).backgroundColor]);
 const luminance=color=>{const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const [a,b]=colors.map(luminance);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'homepage primary normal/hover text contrast');
}
export async function homepageOverview(browser,base,ready,monitor,report,shots){
 report.homepageViews=[];
 for(const [width,height] of [[320,720],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080]]){
  const c=await browser.newContext({viewport:{width,height},isMobile:width<=390,hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.goto(base);await ready(p);await p.locator('canvas').waitFor();
   for(const image of await p.locator('.discovery-worlds img').all())await image.evaluate(im=>im.decode());
   assert.equal(await p.locator('.continue-card').count(),0,'empty visitor has no false resume');
   assert.equal(await p.locator('.mode-tabs [role=tab]').count(),5,'five distinct learning hubs');
   assert.equal(await p.locator('.discovery-worlds .world-choice').count(),6);
   assert.ok(!/Deutschland/.test(await p.locator('#globe-mission').innerText()),'first mission does not reveal its answer');
   const start=p.getByRole('button',{name:'Mit der Weltkugel starten',exact:true});
   assert.equal(await start.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),true,'clear first step visible without scrolling '+width);
   await homeTextGeometry(p);await homeTouchTargets(p);await homeContrast(start);await start.hover();await homeContrast(start);await p.mouse.move(0,0);
   const capture=async state=>{await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:shots+'/home-'+state+'-'+width+'-full.png',fullPage:true,animations:'disabled'});await p.screenshot({path:shots+'/home-'+state+'-'+width+'-top.png',animations:'disabled'});report.homepageViews.push({width,height,state,scrollHeight:await p.evaluate(()=>document.documentElement.scrollHeight)});};
   await capture('first');
   if(width<=390){await p.getByRole('button',{name:'So geht’s',exact:true}).tap();await p.locator('.help-dialog').waitFor();await p.keyboard.press('Escape');}

   await p.locator('.discovery-worlds').screenshot({path:shots+'/home-worlds-'+width+'.png',animations:'disabled'});
   await p.locator('.discovery-pathways').screenshot({path:shots+'/home-next-'+width+'.png',animations:'disabled'});
   await p.evaluate(()=>scrollTo(0,0));
   await p.keyboard.press('Tab');await start.focus();assert.equal(await start.evaluate(el=>el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2),true,'first step keyboard focus');
   await p.screenshot({path:shots+'/home-keyboard-'+width+'.png',animations:'disabled'});await p.keyboard.press('Enter');
   assert.equal(await p.locator('#globe-observatory').evaluate(el=>el===document.activeElement&&Math.abs(el.getBoundingClientRect().top)<60),true,'actual globe scroll/focus target');
   if(width<=390){await p.getByRole('button',{name:'Mit der Weltkugel starten',exact:true}).tap();await p.screenshot({path:shots+'/home-touch-globe-'+width+'.png'});await p.locator('.discovery-worlds .world-choice').first().tap();await p.getByRole('heading',{name:categories[0].title,exact:true}).waitFor();await p.goBack();await p.locator('.discovery-hero').waitFor();}
   await p.locator('.home-earth-facts>summary').click();await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.equal(await p.locator('.home-earth-facts').evaluate(el=>el.open),true,'a freshly opened facts section stays open after Back restoration');assert.equal(await p.locator('.planet-facts button').count(),3);await p.locator('.planet-facts button').first().click();await p.locator('.home-earth-facts>summary').click();
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
   const before=await readProgress();await p.getByRole('link',{name:'✨ Was ist neu?',exact:true}).click();await p.locator('.updates-timeline').first().waitFor();
   assert.equal(await p.locator('.updates-timeline>li').count(),publicUpdates().length);
   assert.deepEqual(await p.locator('.updates-meta>span:first-child').allTextContents(),publicUpdates().map(updateLabel));
   assert.equal(await p.locator('.updates-timeline>li[data-update-channel=sites]').count(),13,'retain every historical Sites publication');
   assert.equal(await p.locator('.updates-timeline>li[data-update-channel=vercel-test]').count(),9,'include independently confirmed test website rounds');
   assert.equal(await p.locator('.updates-timeline>li').first().getAttribute('data-update-id'),'explorer-pass-fine','latest available pass update comes first');
   assert.equal(await p.locator('.updates-timeline [data-update-id=first-visit-home]').count(),0,'open PR 18 is not an available update');
   assert.equal(await p.locator('.updates-timeline>li').first().locator('time').getAttribute('datetime'),'2026-10-10','use actual Vercel success date, not observation date');
   assert.equal(await p.locator('#updates-title').evaluate(el=>el===document.activeElement),true,'lazy history title focus');
   assert.deepEqual(await readProgress(),before,'history is read-only for central pass');
   await homeTextGeometry(p);await homeTouchTargets(p);
   await p.screenshot({path:shots+'/updates-'+width+'-full.png',fullPage:true,animations:'disabled'});
   await p.evaluate(()=>scrollTo(0,0));assert.equal(await p.locator('.updates-timeline>li').first().getByRole('heading').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),true,'first actual update heading stays visible beneath compact channel explanation');await p.screenshot({path:shots+'/updates-test-top-'+width+'.png',animations:'disabled'});
   await p.locator('.updates-prepared>summary').click();await homeTextGeometry(p);await homeTouchTargets(p);
   assert.equal(await p.locator('.updates-prepared-entry[data-update-status=prepared]').count(),1);assert.equal(await p.locator('.updates-prepared-entry').getAttribute('data-update-id'),'first-visit-home');
   assert.equal(await p.locator('.updates-prepared-entry time,.updates-prepared-entry a').count(),0,'unavailable work has no invented date or feature launch link');
   await p.locator('.updates-prepared').screenshot({path:shots+'/updates-prepared-'+width+'.png',animations:'disabled'});await p.locator('.updates-prepared>summary').click();
   await p.locator('.updates-archive>summary').click();await homeTextGeometry(p);await p.locator('.updates-timeline>li').last().getByText('6. Oktober 2026',{exact:true}).waitFor();await p.locator('.updates-timeline>li').last().screenshot({path:shots+'/updates-first-release-'+width+'.png',animations:'disabled'});await p.screenshot({path:shots+'/updates-archive-'+width+'-full.png',fullPage:true,animations:'disabled'});
   await p.locator('.updates-provenance>summary').click();await homeTextGeometry(p);
   await p.locator('.updates-entry details').first().locator('summary').click();await homeTextGeometry(p);
   const olderLink=p.locator('.updates-timeline>li').last().locator('.updates-links a').first();
   await olderLink.scrollIntoViewIfNeeded();await p.keyboard.press('Tab');await olderLink.focus();const olderId=await olderLink.getAttribute('data-route-focus');await p.keyboard.press('Enter');await p.locator('.discovery-hero').waitFor();
   await p.goBack();await p.locator('.updates-timeline').first().waitFor();await p.waitForFunction(id=>document.activeElement?.getAttribute('data-route-focus')===id,olderId);
   assert.equal(await p.locator('.updates-archive').evaluate(el=>el.open),true,'Back restores expanded history archive');
   assert.equal(await olderLink.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&el.matches(':focus-visible')&&parseFloat(getComputedStyle(el).outlineWidth)>=2}),true,'Back restores visible older-entry keyboard focus');
   await p.screenshot({path:shots+'/updates-back-focus-'+width+'.png',animations:'disabled'});
   await p.locator('.updates-links a').first().click();await p.locator('.world-view').waitFor();assert.equal(new URL(p.url()).hash,'#world');
   await p.goBack();await p.locator('.updates-timeline').first().waitFor();await p.getByRole('link',{name:'Zur Startseite',exact:true}).click();await p.locator('.discovery-hero').waitFor();
   await p.goBack();await p.locator('.updates-timeline').first().waitFor();await p.goForward();await p.locator('.discovery-hero').waitFor();
   await p.getByRole('button',{name:'Alle Welten & Lernrouten',exact:true}).click();await p.locator('.world-view').waitFor();await p.getByRole('tab',{name:'Entdecken',exact:true}).click();await p.locator('.discovery-hero').waitFor();assert.equal(new URL(p.url()).hash,'#globe','active exploration tab still returns from world hub');
   // A real synthetic chapter choice creates a valid, resumable pass activity.
   await p.getByRole('tab',{name:'Lernreisen',exact:true}).click();await p.locator('.journey-tile').first().click();await p.locator('.journey-reader').waitFor();
   const next=p.getByRole('button',{name:'Weiter entdecken',exact:true});await next.click();
   const chapter=await p.locator('.chapter-count').innerText();assert.match(chapter,/Kapitel 2/);
   await p.evaluate(()=>location.hash='globe');await p.locator('.continue-card').waitFor();await capture('return');await homeTextGeometry(p);
   await p.getByRole('button',{name:'Weiterlernen',exact:true}).click();await p.locator('.journey-reader').waitFor();assert.equal(await p.locator('.chapter-count').innerText(),chapter,'resume preserves exact chapter');
   await p.reload();await ready(p);await p.evaluate(()=>location.hash='globe');await p.locator('.continue-card').waitFor();await p.getByRole('button',{name:'Weiterlernen',exact:true}).click();await p.locator('.journey-reader').waitFor();assert.equal(await p.locator('.chapter-count').innerText(),chapter,'resume after reload');
   await p.evaluate(()=>location.hash='globe');await p.locator('.discovery-hero').waitFor();
   await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('button',{name:'Pass sichern',exact:true}).click();await p.getByRole('switch',{name:'Größere Schrift',exact:true}).check();await p.getByRole('switch',{name:'Weniger Bewegung',exact:true}).check();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();
   await homeTextGeometry(p);await homeTouchTargets(p);await capture('large');
   await p.locator('.discovery-worlds').screenshot({path:shots+'/home-worlds-large-'+width+'.png',animations:'disabled'});
   assert.equal(await p.locator('.gateway-compact .world-choice').first().evaluate(el=>getComputedStyle(el).transitionDuration==='0s'),true,'saved reduced motion applies');
   await p.getByRole('link',{name:'✨ Was ist neu?',exact:true}).click();await p.locator('.updates-timeline').first().waitFor();await homeTextGeometry(p);await p.screenshot({path:shots+'/updates-large-'+width+'-full.png',fullPage:true,animations:'disabled'});
   await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
   const axe=await p.evaluate(async()=>{const r=await window.axe.run({include:[['.update-history']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(axe,[],'history WCAG axe '+width);
   await p.getByRole('link',{name:'Zur Startseite',exact:true}).click();await p.locator('.discovery-hero').waitFor();
   const homeAxe=await p.evaluate(async()=>{const r=await window.axe.run({include:[['.discovery-hero'],['.mode-tabs'],['.discovery-worlds'],['.discovery-pathways'],['.continue-card']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(homeAxe,[],'home WCAG axe '+width);
   if(width===320){
    await p.evaluate(()=>{const save=JSON.parse(localStorage.getItem('erde-entdecken:save:v3'));save.progress.lastActivity={type:'game',id:'unknown-stale-session',family:'classic'};localStorage.setItem('erde-entdecken:save:v3',JSON.stringify(save));});await p.reload();await ready(p);assert.equal(await p.locator('.continue-card').count(),0,'stale activity without matching game never offers false resume');
    await p.emulateMedia({forcedColors:'active'});await p.keyboard.press('Tab');await start.focus();assert.equal(await start.evaluate(el=>el.matches(':focus-visible')&&getComputedStyle(el).outlineStyle==='solid'),true,'system colors retain focus');await p.screenshot({path:shots+'/home-system-colors-320.png',animations:'disabled'});
   }
   console.log('Homepage/history viewport',width,height,'first/return/large passed');
   report.checks.push('Homepage/history '+width+': first/return/large, exact chapter and reload, clear visible first step, touch/text geometry, focus, credits, preserved earth facts, history/back/forward, 13 Sites + 9 confirmed test website updates, dated channel labels and separate undated PR 18, read-only pass, WCAG axe');
  }finally{await c.close();}
 }
}
