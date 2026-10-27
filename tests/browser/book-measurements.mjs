import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';
import {prepareAxe} from './axe-loader.mjs';
import {captureNativeViewport} from './native-screenshot.mjs';
const pack=JSON.parse(await fs.readFile(new URL('../../app/book-measurement-content.json',import.meta.url),'utf8'));
const snapshot=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
const cardFor=(page,term)=>page.locator('.word-card').filter({has:page.getByRole('heading',{name:term,exact:true})});
const ready=page=>page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
async function open(page,term){
 await page.evaluate(term=>location.hash='book/words/'+encodeURIComponent(term),term);
 await page.waitForFunction(term=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value===term,term);
 assert.equal(await page.locator('.word-card h3').first().innerText(),term,'exact dictionary match precedes a substring such as geschmolzen');
 const card=cardFor(page,term),study=card.locator('.book-study');await study.waitFor();
 if(!await study.evaluate(el=>el.open)){await study.locator(':scope>summary').focus();await page.keyboard.press('Enter');}
 return {card,study};
}
async function geometry(page,card){
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Book has no viewport overflow');
 const failures=await card.evaluate(root=>{const r=root.getBoundingClientRect();return [...root.querySelectorAll('p,h4,summary,button,input,label,figcaption,svg[role=img],a')].filter(el=>el.getClientRects().length).flatMap(el=>{const b=el.getBoundingClientRect(),interactive=el.matches('summary,button,a,input');return b.left<r.left-1||b.right>r.right+1||el.scrollWidth>el.clientWidth+2||interactive&&(b.height<43.9||b.width<43.9)?[{tag:el.tagName,text:el.textContent.slice(0,80),left:b.left,right:b.right,width:b.width,height:b.height,cardWidth:r.width}]:[];});});
 assert.deepEqual(failures,[],'readable text/drawings and reachable44px controls inside the current word');
}

export async function bookMeasurementView(page,report,width,{shots=null,engine='chromium',large=false,native=false,offline=false}={}){
 assert.equal(await page.evaluate(()=>innerWidth),width,'actual SI viewport matches its evidence label');
 const original=await snapshot(page),initial=await page.evaluate(()=>location.hash),wasLarge=await page.locator('.earth-app').evaluate(el=>el.classList.contains('large-reading')),proof=[];
 await page.locator('.earth-app').evaluate((el,large)=>el.classList.toggle('large-reading',large),large);
 try{
  for(const [term,item] of Object.entries(pack.learning)){
   const {card,study}=await open(page,term);await study.getByText(item.benefit,{exact:true}).waitFor();assert.equal(await page.locator('.earth-app').evaluate(el=>el.classList.contains('large-reading')),large,'actual SI text state matches its evidence label');
   for(const label of ['Ganz einfach · etwa 6–8 Jahre','Noch genauer · etwa 12–14 Jahre','Selbst beobachten und erklären','Ein Hinweis, wenn du möchtest','Quellen und Prüfstand']){
    const summary=study.locator('summary').getByText(label,{exact:true});if(!await summary.locator('..').evaluate(el=>el.open)){await summary.focus();await page.keyboard.press('Enter');}
   }
   for(const text of [item.starter,item.deeper,item.observe,item.question.hint])await study.getByText(text,{exact:true}).waitFor();
   const sources=study.locator('details').filter({has:page.getByText('Quellen und Prüfstand',{exact:true})});
   assert.deepEqual(await sources.locator('a').evaluateAll(es=>es.map(el=>el.href)),item.sources.map(s=>s.url));
   const checked=pack.sourceReadOn.split('-').reverse().join('.');await sources.getByText('Belegstellenabgleich: '+checked+'.',{exact:false}).waitFor();
   const order=item.question.answers.map((_,i)=>i).filter(i=>i!==item.question.correct).concat(item.question.correct);
   for(const i of order){await study.getByRole('button',{name:item.question.answers[i],exact:true}).click();const correct=i===item.question.correct,expected='Deine Auswahl: '+item.question.answers[i]+'. '+(correct?'Das passt. ':'Noch nicht passend. ')+(correct?item.question.why:item.question.wrongReasons[i]);assert.equal(await study.locator('.book-thinking [role=status]').innerText(),expected);}
   if(item.model){
    const model=study.locator('[data-book-measure]'),range=model.locator('input[type=range]');await range.focus();await page.keyboard.press('Home');
    const low=item.model==='length'?'10 cm = 0,1 m':item.model==='duration'?'Beginn 20 s · Ende 21 s · Dauer 1 s':'-20 °C = 253,15 K';assert.equal(await model.getByRole('status').innerText(),low);
    await page.keyboard.press('End');const high=item.model==='length'?'200 cm = 2 m':item.model==='duration'?'Beginn 20 s · Ende 30 s · Dauer 10 s':'40 °C = 313,15 K';assert.equal(await model.getByRole('status').innerText(),high);
    if(item.model==='duration'){await model.getByRole('button',{name:'Beginn bei 10 s',exact:true}).click();assert.equal(await model.getByRole('status').innerText(),'Beginn 10 s · Ende 20 s · Dauer 10 s');}
   }
   await geometry(page,card);
   if(width===320){await prepareAxe(page);assert.deepEqual(await card.evaluate(async el=>(await window.axe.run(el,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[],'current word accessibility');}
   const nativeCaptures=[];
   if(shots&&native&&[320,640].includes(width)&&item.model){
    const model=study.locator('[data-book-measure]'),prefix=path.join(shots,'journey-engine-'+engine+'-book-si-'+term.toLowerCase()+'-native200-');
    await model.locator('h4').evaluate(el=>el.scrollIntoView({block:'start'}));nativeCaptures.push(await captureNativeViewport(page,prefix+'controls-'+width+'.png'));
    await model.getByRole('status').scrollIntoViewIfNeeded();nativeCaptures.push(await captureNativeViewport(page,prefix+'result-'+width+'.png'));
    for(const capture of nativeCaptures){assert.equal(capture.cssWidth,width);assert.equal(capture.scale,2);assert.equal(capture.pixelWidth,width*2);}
   }else if(shots&&!offline&&!native)await card.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-si-'+term.toLowerCase()+'-normal-'+width+'.png'),animations:'disabled'});
   const topicLink=study.getByRole('link',{name:/Mit „.*weiterdenken/}).first();await topicLink.focus();await page.keyboard.press('Enter');await page.waitForURL('**/#world/topic/'+item.topic);
   const backlink=page.locator('[data-book-measurement-links="'+item.topic+'"]').getByRole('link',{name:term,exact:true});await backlink.waitFor();
   await page.goBack();await cardFor(page,term).waitFor();await page.waitForFunction(term=>document.activeElement?.dataset.routeFocus==='word-topic-'+term,term);
   await cardFor(page,term).locator('.book-topic-link').first().click();await backlink.waitFor();await backlink.focus();await page.keyboard.press('Enter');await page.waitForURL('**/#book/words/'+encodeURIComponent(term));await cardFor(page,term).waitFor();
   proof.push({term,width,large,native200:native,offline,exactFirst:true,allExplanationsHintsAnswersAndSourceLinks:true,modelBounds:!!item.model,nativeCaptures,reciprocalArticleAndRealKeyboardBackFocus:true});
  }
  const saved=await snapshot(page);for(const key of ['notes','favorites','games','journeys','review','settings','favoritePlaces'])assert.deepEqual(saved[key],original[key],'SI exploration preserves existing '+key);for(const [id,value] of Object.entries(original.gameSessions))assert.deepEqual(saved.gameSessions[id],value);
  assert.equal(proof.length,7);(report.bookMeasurements??=[]).push(...proof);return proof;
 }finally{
  await page.locator('.earth-app').evaluate((el,large)=>el.classList.toggle('large-reading',large),wasLarge);await page.evaluate(hash=>location.hash=hash,initial);
 }
}

export async function bookMeasurementNetworkView(page,{shots=null,engine='chromium'}={}){
 const browser=page.context().browser(),base=new URL(page.url()).origin,pattern='**/assets/book-measurement-content-*.json';assert(browser);
 const proof={...browserErrorArrays(),integrityErrorRetry:false,sharedCloseWhilePending:false};
 let context,child,release=()=>{};
 try{
  context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce',serviceWorkers:'block'});const seed=createSave();seed.progress.notes=[{id:'synthetic-si-network',text:'Synthetische erhaltene SI-Notiz.',at:'2026-10-27T00:00:00.000Z'}];
  await context.addInitScript(({key,seed})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(seed));},{key:SAVE_KEY,seed});
  let requests=0;await context.route(pattern,async route=>{requests++;await route.fulfill({status:200,contentType:'application/json',body:'{}'});});child=await context.newPage();monitorBrowserErrors(child,base,proof);await child.goto(base+'/#book/words/Meter');await ready(child);
  const card=cardFor(child,'Meter');await card.getByRole('button',{name:'Später noch einmal lesen',exact:true}).click();const before=await snapshot(child);const {study}=await open(child,'Meter');const retry=study.getByRole('button',{name:'Wortvertiefung erneut laden',exact:true});await retry.waitFor();assert.equal(requests,1);await card.getByText(pack.words.Meter[2],{exact:true}).waitFor();assert.deepEqual((await snapshot(child)).notes,before.notes);assert.deepEqual((await snapshot(child)).favorites,before.favorites);
  if(shots)await card.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-si-integrity-error-320.png'),animations:'disabled'});
  await context.unroute(pattern);await retry.focus();await child.keyboard.press('Enter');await study.getByText(pack.learning.Meter.benefit,{exact:true}).waitFor();await child.waitForFunction(()=>document.activeElement?.matches('.book-study>summary'));assert.deepEqual((await snapshot(child)).notes,before.notes);assert.deepEqual((await snapshot(child)).favorites,before.favorites);proof.integrityErrorRetry=true;await context.close();context=null;
  context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce',serviceWorkers:'block'});let arrived;const started=new Promise(resolve=>arrived=resolve),held=new Promise(resolve=>release=resolve);requests=0;
  await context.route(pattern,async route=>{requests++;arrived();await held;await route.continue();});child=await context.newPage();monitorBrowserErrors(child,base,proof);await child.goto(base+'/#book');await ready(child);await child.locator('.book-filter-panel>summary').click();await child.getByRole('tablist',{name:'Wissenswörter nach Thema',exact:true}).getByRole('tab',{name:'Messen',exact:true}).click();
  const meter=cardFor(child,'Meter').locator('.book-study'),kelvin=cardFor(child,'Kelvin').locator('.book-study');await meter.locator(':scope>summary').click();await started;await meter.locator(':scope>summary').click();await kelvin.locator(':scope>summary').click();assert.equal(requests,1);release();await kelvin.getByText(pack.learning.Kelvin.benefit,{exact:true}).waitFor();await meter.locator(':scope>summary').click();await meter.getByText(pack.learning.Meter.benefit,{exact:true}).waitFor();assert.equal(requests,1);proof.sharedCloseWhilePending=true;
  assert(browserErrorsComplete(proof));return proof;
 }catch(error){if(child&&shots)await child.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-si-network-failure-320.png'),fullPage:true}).catch(()=>{});throw error;}
 finally{release();await context?.close();}
}
