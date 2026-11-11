import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import assert from 'node:assert/strict';
import path from 'node:path';
import {NEWS_REMOVAL_WIDTHS,REMOVED_NEWS_ROUTES,newsRemovalComplete} from '../../scripts/news-removal-evidence.mjs';
import worldIndex from '../../app/world-index.json' with {type:'json'};
const absent=async p=>{
 assert.equal(await p.locator('.news-preview,.news-page,[data-news-id],a[href^="#news"]').count(),0,'removed news has no active view, article or link');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
};
export async function newsRemovalFlow(browser,base,ready,monitor,report,shots){
 const observed=[],requests=[];
 for(const width of NEWS_REMOVAL_WIDTHS)for(const large of [false,true]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const pass=createSave();pass.progress.settings.largeText=large;pass.progress.notes=[{id:'old-note',text:'Synthetische erhaltene Notiz.',at:'2026-10-18T00:00:00.000Z'}];pass.progress.favorites=['topic:person-albert_einstein'];pass.progress.gameSessions.memory={cards:[1,2],flipped:[0]};await context.addInitScript(({pass,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));},{pass,key:SAVE_KEY});const p=await context.newPage();monitor(p);
  p.on('request',r=>{if(/arizona2k\.github\.io\/wunderkompass-news|\/assets\/news-[^/]+\.(?:js|json|css)/.test(r.url()))requests.push(r.url());});
  let homeLongQuestionReflow;
  try{
   await p.goto(base);await ready(p);await p.locator('.discovery-hero').waitFor();
   if(width===320&&large){
    // A real reload restores this valid presentation choice. The saved large
    // text setting and the entire original pass remain in their normal store.
    await p.evaluate(()=>{const key='wunderkompass-discovery-visit',old=JSON.parse(sessionStorage.getItem(key));if(!old?.trailId)throw Error('Actual existing presentation required');const value={...old,heroId:'history-bronze',lastInputAt:Date.now(),idleDue:false};sessionStorage.setItem(key,JSON.stringify(value));history.replaceState({...history.state,wunderHero:value.heroId,wunderTrail:value.trailId},'',location.href);});
    await p.reload();await ready(p);await p.locator('.earth-app.large-reading').waitFor();await p.locator('[data-discovery-hero="history-bronze"]').waitFor();
    assert.equal(await p.locator('.discovery-feature>a').innerText(),worldIndex.find(t=>t.id==='history-bronze').homeQuestion,'the entire canonical question remains');
    homeLongQuestionReflow=await p.evaluate(()=>{const a=document.querySelector('.discovery-feature>a'),r=a.getBoundingClientRect(),arrow=a.querySelector('svg').getBoundingClientRect(),range=document.createRange();range.selectNodeContents(a);return{heroId:'history-bronze',actualReload:true,savedLargeText:JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.settings.largeText,font:parseFloat(getComputedStyle(a).fontSize),viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,link:{left:r.left,right:r.right},arrow:{left:arrow.left,right:arrow.right,width:arrow.width},textRects:[...range.getClientRects()].filter(x=>x.width&&x.height).map(x=>({left:x.left,right:x.right}))};});
    assert.equal(homeLongQuestionReflow.savedLargeText,true);assert.equal(homeLongQuestionReflow.font,34,'preserve the actual large-reading font');assert.equal(homeLongQuestionReflow.scrollWidth,320,'long compound words cannot expand the viewport');
    assert(homeLongQuestionReflow.arrow.width>=18&&homeLongQuestionReflow.arrow.right<=homeLongQuestionReflow.link.right+1);assert(homeLongQuestionReflow.textRects.every(r=>r.left>=homeLongQuestionReflow.link.left-1&&r.right<=homeLongQuestionReflow.link.right+1),'all actual text and arrow stay inside the link');
    await p.locator('.discovery-hero').screenshot({path:path.join(shots,'news-removed-bronze-large-320.png'),animations:'disabled'});
   }
   if(large)await p.locator('.earth-app').evaluate(e=>e.classList.add('large-reading'));
   await absent(p);
   // Exercise a real retained learning action before checking old news links.
   await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();
   const input=p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true});await input.fill('Vulkan-Werkstatt');
   await p.getByRole('option').filter({hasText:'Vulkan-Werkstatt'}).first().waitFor();
   await input.fill('Ein Wort für absichtliches Wütendmachen');await p.waitForFunction(()=>document.querySelectorAll('[role=option]').length===0);assert.equal(await p.getByRole('option').count(),0,'former news article cannot be found');
   await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});
   const passBefore=await p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);assert.deepEqual(passBefore.notes,pass.progress.notes);assert.deepEqual(passBefore.favorites,pass.progress.favorites);assert.deepEqual(passBefore.gameSessions.memory,pass.progress.gameSessions.memory);
   await p.goto(base+'#updates');await ready(p);await p.locator('.update-history').waitFor();await absent(p);assert.doesNotMatch(await p.locator('.update-history').textContent(),/Nachrichten|Kindernachrichten|Neue signierte Ausgaben/,'removed feature is not still advertised in visible or expandable history rows');
   const routes=[];
   for(const route of REMOVED_NEWS_ROUTES){
    await p.goto(base+'#'+route);await ready(p);await p.locator('.discovery-hero').waitFor();
    await p.waitForFunction(()=>location.hash==='#home');await absent(p);routes.push(route);
   }
   await p.reload();await ready(p);await p.locator('.discovery-hero').waitFor();await absent(p);
   assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress),passBefore,'legacy news routes never change the existing pass');
   if(!large&&[320,1440].includes(width))await p.screenshot({path:path.join(shots,'news-removed-'+width+'.png'),fullPage:true});
   observed.push({width,large,home:true,search:true,updates:true,routes,reload:true,passPreserved:true,...(homeLongQuestionReflow?{homeLongQuestionReflow}:{})});
  }finally{await context.close();}
 }
 assert.deepEqual(requests,[]);report.newsRemoval={observed,noNewsRequests:true};assert(newsRemovalComplete(report.newsRemoval));
 report.checks.push('News removed: all seven widths normal/large, no homepage/news/search entry or news request; legacy routes and reload return home while preserving the pass');
}
