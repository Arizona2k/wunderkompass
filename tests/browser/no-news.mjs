import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import assert from 'node:assert/strict';
import path from 'node:path';
import {bildanfragen} from './harness.mjs';
const NEWS_REMOVAL_WIDTHS=[320,360,390,768,1024,1440,1920];
const REMOVED_NEWS_ROUTES=['news','news/girl-day-2026','news/unknown'];
const absent=async p=>{
 assert.equal(await p.locator('.news-preview,.news-page,[data-news-id],a[href^="#news"]').count(),0,'removed news has no active view, article or link');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2),false);
};
export async function newsRemovalFlow(browser,base,ready,monitor,report,shots){
 const observed=[],requests=[];
 for(const width of NEWS_REMOVAL_WIDTHS)for(const large of [false,true]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const pass=createSave();pass.progress.settings.largeText=large;pass.progress.notes=[{id:'old-note',text:'Synthetische erhaltene Notiz.',at:'2026-10-18T00:00:00.000Z'}];pass.progress.favorites=['topic:person-albert_einstein'];pass.progress.gameSessions.memory={cards:[1,2],flipped:[0]};await context.addInitScript(({pass,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));},{pass,key:SAVE_KEY});const p=await context.newPage();monitor(p);
  // Vor jedem gewollten Seitenwechsel die Bilder fertig laden lassen, sonst meldet Firefox den Abbruch
  // (NS_BINDING_ABORTED, CI-Lauf 249: Korallenriff-Foto der Startseite). Echte Fehlanfragen bleiben sichtbar.
  const bilderFertig=bildanfragen(p);
  p.on('request',r=>{if(/arizona2k\.github\.io\/wunderkompass-news|\/assets\/news-[^/]+\.(?:js|json|css)/.test(r.url()))requests.push(r.url());});
  try{
   await p.goto(base);await ready(p);await p.locator('.discovery-hero').waitFor();
   if(large)await p.locator('.earth-app').evaluate(e=>e.classList.add('large-reading'));
   await absent(p);
   // Exercise a real retained learning action before checking old news links.
   await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();
   const input=p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true});await input.fill('Vulkan-Werkstatt');
   await p.getByRole('option').filter({hasText:'Vulkan-Werkstatt'}).first().waitFor();
   await input.fill('Ein Wort für absichtliches Wütendmachen');await p.waitForFunction(()=>document.querySelectorAll('[role=option]').length===0);assert.equal(await p.getByRole('option').count(),0,'former news article cannot be found');
   await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});
   const passBefore=await p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);assert.deepEqual(passBefore.notes,pass.progress.notes);assert.deepEqual(passBefore.favorites,pass.progress.favorites);assert.deepEqual(passBefore.gameSessions.memory,pass.progress.gameSessions.memory);
   await bilderFertig();await p.goto(base+'#updates');await ready(p);await p.locator('.kern-neuigkeiten').waitFor();await absent(p);assert.doesNotMatch(await p.locator('.kern-neuigkeiten').textContent(),/Nachrichten|Kindernachrichten|Neue signierte Ausgaben/,'removed feature is not still advertised in visible or expandable history rows');
   const routes=[];
   for(const route of REMOVED_NEWS_ROUTES){
    await bilderFertig();await p.goto(base+'#'+route);await ready(p);await p.locator('.discovery-hero').waitFor();
    await p.waitForFunction(()=>location.hash==='#home');await absent(p);routes.push(route);
   }
   await bilderFertig();await p.reload();await ready(p);await p.locator('.discovery-hero').waitFor();await absent(p);
   assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress),passBefore,'legacy news routes never change the existing pass');
   if(!large&&[320,1440].includes(width))await p.screenshot({path:path.join(shots,'news-removed-'+width+'.png'),fullPage:true});
   await bilderFertig();observed.push({width,large,home:true,search:true,updates:true,routes,reload:true,passPreserved:true});
  }finally{await context.close();}
 }
 assert.deepEqual(requests,[]);report.newsRemoval={observed,noNewsRequests:true};assert.equal(new Set(observed.map(c=>c.width+':'+c.large)).size,NEWS_REMOVAL_WIDTHS.length*2,'every width checked normal and large');
 report.checks.push('News removed: all seven widths normal/large, no homepage/news/search entry or news request; legacy routes and reload return home while preserving the pass');
}
