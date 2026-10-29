import {assertBookParticleFigure} from './book-particle-diagrams.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {prepareAxe} from './axe-loader.mjs';
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';
import {captureNativeViewport} from './native-screenshot.mjs';
const pack=JSON.parse(await fs.readFile(new URL('../../app/book-particle-content.json',import.meta.url),'utf8'));
const whyIndex=JSON.parse(await fs.readFile(new URL('../../exports/content/why-questions.json',import.meta.url),'utf8'));
const snapshot=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);

export async function bookParticleView(page,report,width,{shots=null,engine='chromium',large=false,native=false,offline=false,captureSession=null}={}){
 assert.equal(await page.evaluate(()=>innerWidth),width,'actual particle viewport matches evidence');
 const original=await snapshot(page),initial=await page.evaluate(()=>location.hash),wasLarge=await page.locator('.earth-app').evaluate(el=>el.classList.contains('large-reading')),proof=[];
 await page.locator('.earth-app').evaluate((el,large)=>el.classList.toggle('large-reading',large),large);
 try{
  for(const [kind,items]of[['words',pack.learning],['why',pack.whyLearning]])for(const [term,item]of Object.entries(items)){
   await page.evaluate(({kind,term})=>location.hash='book/'+kind+'/'+encodeURIComponent(term),{kind,term});
   let card;
   if(kind==='words'){
    await page.waitForFunction(term=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value===term,term);
    assert.equal(await page.locator('.word-card h3').first().innerText(),term,'exact particle term precedes substrings');
    card=page.locator('.word-card').filter({has:page.getByRole('heading',{name:term,exact:true})});
   }else{
    const index=whyIndex.findIndex(q=>q.question===term);assert(index>=0);card=page.locator('#why-entry-'+index);await card.waitFor();
    // The existing hash lookup opens its target on the next animation frame.
    // Wait for that real deep-link behavior; an early Enter can close it again.
    await page.waitForFunction(index=>document.getElementById('why-entry-'+index)?.open,index);
   }
   const study=card.locator('[data-book-particle-study]');await study.waitFor();if(!await study.evaluate(el=>el.open)){await study.locator(':scope>summary').focus();await page.keyboard.press('Enter');}
   await study.getByText(item.benefit,{exact:true}).waitFor();
   const labels=['Ganz einfach · etwa 6–8 Jahre','Noch genauer · etwa 12–14 Jahre','Selbst beobachten und erklären','Quellen und Prüfstand',...(item.question?['Ein Hinweis, wenn du möchtest']:[]),...(item.relatedWords?.length?['Mit anderen Wörtern weiterdenken']:[]),...(item.relatedQuestions?.length?['Passende Warum-Fragen erkunden']:[])];
   for(const label of labels){const summary=study.locator('summary').getByText(label,{exact:true});if(!await summary.locator('..').evaluate(el=>el.open)){await summary.focus();await page.keyboard.press('Enter');}}
   for(const text of[item.starter,item.deeper,item.observe])await study.getByText(text,{exact:true}).waitFor();
   for(const source of item.sources){const date=value=>value.split('-').reverse().map(Number).join('.');const row=study.locator('li').filter({has:page.getByRole('link',{name:source.title,exact:true})});await row.getByText('Quelle abgerufen am '+date(source.checkedOn)+'.'+(source.updatedOn?' Angegebener Quellenstand: '+date(source.updatedOn)+'.':''),{exact:true}).waitFor();}
   const sources=study.locator('details').filter({has:page.getByText('Quellen und Prüfstand',{exact:true})});assert.deepEqual(await sources.locator('a').evaluateAll(es=>es.map(e=>e.href)),item.sources.map(s=>s.url));await sources.getByText('Belegstellenabgleich: '+pack.sourceReadOn.split('-').reverse().join('.')+'.',{exact:false}).waitFor();
   const figure=study.locator('[data-book-particle-figure]');assert.equal(await figure.getAttribute('data-book-particle-figure'),item.figure);const modelStates=await assertBookParticleFigure(figure,item.figure,{term,onState:shots&&!native&&!offline?async selected=>{await figure.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-particle-'+kind+'-'+(kind==='words'?Object.keys(pack.learning):Object.keys(pack.whyLearning)).indexOf(term)+'-choice-'+selected+'-'+(large?'large':'normal')+'-'+width+'.png'),animations:'disabled'});}:null});await figure.getByText('Eigene Zeichnung mit KI-Unterstützung.',{exact:false}).waitFor();
   if(item.question){const q=item.question;for(const i of q.answers.map((_,i)=>i).filter(i=>i!==q.correct).concat(q.correct)){await study.getByRole('button',{name:q.answers[i],exact:true}).click();assert.equal(await study.locator('.book-thinking [role=status]').innerText(),'Deine Auswahl: '+q.answers[i]+'. '+(i===q.correct?'Das passt. '+q.why:'Noch nicht passend. '+q.wrongReasons[i]));}}
   const overflowing=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);if(overflowing)report.particleOverflow={term,kind,width,large,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,elements:[...document.querySelectorAll('body *')].filter(e=>e.getClientRects().length&&!e.closest('svg')).flatMap(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+2||r.left< -2?[{tag:e.tagName,class:e.className,text:e.textContent.slice(0,90),left:r.left,right:r.right}]:[];}).slice(-35)}))};assert.equal(overflowing,false);
   const failures=await card.evaluate((root,{large})=>{const bounds=root.getBoundingClientRect();return[...root.querySelectorAll('p,h4,summary,button,a,figcaption,svg[role=img],.book-model-key li')].filter(el=>el.getClientRects().length).flatMap(el=>{const r=el.getBoundingClientRect(),interactive=el.matches('summary,button,a'),legend=el.matches('[data-book-particle-figure] figcaption,.book-model-key li');return r.left<bounds.left-1||r.right>bounds.right+1||el.scrollWidth>el.clientWidth+2||interactive&&(r.width<43.9||r.height<43.9)||legend&&parseFloat(getComputedStyle(el).fontSize)<(large?19.9:15.9)?[{tag:el.tagName,text:el.textContent.slice(0,100),width:r.width,height:r.height,font:getComputedStyle(el).fontSize}]:[];});},{large});assert.deepEqual(failures,[],'particle content/drawing/16-20px legends/44px controls fit actual card');
   if(width===320){await prepareAxe(page);assert.deepEqual(await card.evaluate(async el=>(await window.axe.run(el,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);}
   const nativeCaptures=[];
   if(shots&&native&&[320,640].includes(width)){
    const prefix=path.join(shots,'journey-engine-'+engine+'-book-particle-'+kind+'-'+(kind==='words'?Object.keys(pack.learning):Object.keys(pack.whyLearning)).indexOf(term)+'-native200-');
    for(const[part,target]of[['drawing',figure.locator('h4')],['legend',figure.locator('figcaption')]]){await target.evaluate(el=>el.scrollIntoView({block:'start'}));const capture=await captureNativeViewport(page,prefix+part+'-'+width+'.png',{cdp:captureSession});assert.equal(capture.cssWidth,width);assert.equal(capture.scale,2);assert.equal(capture.pixelWidth,width*2);nativeCaptures.push(capture);}
   }else if(shots&&!offline&&!native)await card.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-particle-'+(kind==='words'?Object.keys(pack.learning).indexOf(term):5+Object.keys(pack.whyLearning).indexOf(term))+'-'+(large?'large':'normal')+'-'+width+'.png'),animations:'disabled'});
   const topic=study.locator('.book-connection a');await topic.focus();await page.keyboard.press('Enter');await page.waitForURL('**/#world/topic/'+item.topic);
   for(const word of Object.keys(pack.learning).filter(term=>pack.learning[term].topic===item.topic))await page.locator('[data-book-measurement-links="'+item.topic+'"]').getByRole('link',{name:word,exact:true}).waitFor();
   await page.goBack();await card.waitFor();await page.waitForFunction(term=>document.activeElement?.dataset.routeFocus==='word-topic-'+term,term);
   proof.push({term,kind,width,large,native200:native,nativeCaptures,offline,figure:item.figure,modelStates,allReadingLevelsHintsAnswersFeedbackAndSources:true,normalHTMLLegends:true,actualKeyboardArticleAndBackFocus:true});
  }
  const saved=await snapshot(page);for(const key of['notes','favorites','games','journeys','review','settings','favoritePlaces'])assert.deepEqual(saved[key],original[key],'particle exploration preserves '+key);for(const[id,value]of Object.entries(original.gameSessions))assert.deepEqual(saved.gameSessions[id],value);
  assert.equal(proof.length,5);(report.bookParticle??=[]).push(...proof);return proof;
 }finally{await page.locator('.earth-app').evaluate((el,large)=>el.classList.toggle('large-reading',large),wasLarge);await page.evaluate(hash=>location.hash=hash,initial);}
}


export async function bookParticleNetworkView(page,{shots=null,engine='chromium'}={}){
 const browser=page.context().browser(),base=new URL(page.url()).origin,pattern='**/assets/book-particle-content-*.json';assert(browser);
 const proof={...browserErrorArrays(),integrityErrorRetry:false,sharedCloseWhilePending:false};
 const cardFor=(p,term)=>p.locator('.word-card').filter({has:p.getByRole('heading',{name:term,exact:true})});
 const ready=p=>p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
 let context,child,release=()=>{};
 try{
  context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  const seed=createSave();seed.progress.notes=[{id:'synthetic-particle-network',text:'Synthetische erhaltene Atomnotiz.',at:'2026-10-28T00:00:00.000Z'}];
  await context.addInitScript(({key,seed})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(seed));},{key:SAVE_KEY,seed});
  let requests=0;await context.route(pattern,async route=>{requests++;await route.fulfill({status:200,contentType:'application/json',body:'{}'});});
  child=await context.newPage();monitorBrowserErrors(child,base,proof);await child.goto(base+'/#book/words/'+encodeURIComponent('Atom'));await ready(child);
  const card=cardFor(child,'Atom');await card.getByRole('button',{name:'Später noch einmal lesen',exact:true}).click();const before=await snapshot(child),study=card.locator('[data-book-particle-study]');
  await study.locator(':scope>summary').focus();await child.keyboard.press('Enter');const retry=study.getByRole('button',{name:'Vertiefung erneut laden',exact:true});await retry.waitFor();assert.equal(requests,1);
  await card.getByText(pack.words['Atom'][2],{exact:true}).waitFor();for(const key of['notes','favorites'])assert.deepEqual((await snapshot(child))[key],before[key]);
  if(shots)await card.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-particle-integrity-error-320.png'),animations:'disabled'});
  await context.unroute(pattern);await retry.focus();await child.keyboard.press('Enter');await study.getByText(pack.learning['Atom'].benefit,{exact:true}).waitFor();await child.waitForFunction(()=>document.activeElement?.matches('[data-book-particle-study]>summary'));
  for(const key of['notes','favorites'])assert.deepEqual((await snapshot(child))[key],before[key]);proof.integrityErrorRetry=true;await context.close();context=null;
  context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  let arrived;const started=new Promise(resolve=>arrived=resolve),held=new Promise(resolve=>release=resolve);requests=0;
  await context.route(pattern,async route=>{requests++;arrived();await held;await route.continue();});child=await context.newPage();monitorBrowserErrors(child,base,proof);
  await child.goto(base+'/#book');await ready(child);await child.waitForFunction(()=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value==='');
  // These terms are beyond the first24 visible words. Reach both through
  // the actual existing pagination before exercising concurrent disclosures.
  for(let n=0;!await cardFor(child,'Atom').count()||!await cardFor(child,'Isotop').count();n++){assert(n<5,'particle terms are reachable through existing word pagination');await child.getByRole('button',{name:/^Weitere Wörter entdecken/}).click();}
  const warmth=cardFor(child,'Atom').locator('[data-book-particle-study]'),radiation=cardFor(child,'Isotop').locator('[data-book-particle-study]');
  await warmth.locator(':scope>summary').click();await started;await warmth.locator(':scope>summary').click();await radiation.locator(':scope>summary').click();assert.equal(requests,1);release();
  await radiation.getByText(pack.learning['Isotop'].benefit,{exact:true}).waitFor();await warmth.locator(':scope>summary').click();await warmth.getByText(pack.learning['Atom'].benefit,{exact:true}).waitFor();assert.equal(requests,1);proof.sharedCloseWhilePending=true;
  await child.evaluate(()=>location.hash='book/words/'+encodeURIComponent('Proton'));const protonStudy=cardFor(child,'Proton').locator('[data-book-particle-study]');await protonStudy.waitFor();if(!await protonStudy.evaluate(e=>e.open))await protonStudy.locator(':scope>summary').click();const protonFigure=protonStudy.locator('figure');await protonFigure.waitFor();
  await protonFigure.locator('[data-particle-row="p"]>[data-particle-symbol]').first().evaluate(e=>{window.__particleNegativeOriginal={node:e,parent:e.parentNode,next:e.nextSibling};e.remove();});
  await assert.rejects(()=>assertBookParticleFigure(protonFigure,'element-identity',{term:'Proton'}),/actual drawn particle counts/,'missing actual proton fails even if metadata still claims six');
  await child.evaluate(()=>{const s=window.__particleNegativeOriginal;s.parent.insertBefore(s.node,s.next);delete window.__particleNegativeOriginal;});await assertBookParticleFigure(protonFigure,'element-identity',{term:'Proton'});proof.missingDrawnProtonNegative=true;

  assert(browserErrorsComplete(proof));return proof;
 }catch(error){if(child&&shots)await child.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-particle-network-failure-320.png'),fullPage:true}).catch(()=>{});throw error;}
 finally{release();await context?.close();}
}
