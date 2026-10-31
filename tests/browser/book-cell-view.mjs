import {assertMitoContour} from './book-cell-geometry.mjs';
// Shared cell learning checks for the existing regular and cold browser callers.
import {assertBookCellFigure} from './book-cell-diagrams.mjs';
import {bookRelatedWordView} from './book-related-words.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {prepareAxe} from './axe-loader.mjs';
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';
import {captureNativeViewport} from './native-screenshot.mjs';
const pack=JSON.parse(await fs.readFile(new URL('../../app/book-cell-content.json',import.meta.url),'utf8'));
const whyIndex=JSON.parse(await fs.readFile(new URL('../../exports/content/why-questions.json',import.meta.url),'utf8'));
const snapshot=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);

export async function bookCellView(page,report,width,{shots=null,engine='chromium',large=false,native=false,offline=false,captureSession=null}={}){
 assert.equal(await page.evaluate(()=>innerWidth),width,'actual cell viewport matches evidence');
 const original=await snapshot(page),initial=await page.evaluate(()=>location.hash),wasLarge=await page.locator('.earth-app').evaluate(el=>el.classList.contains('large-reading')),proof=[];
 await page.locator('.earth-app').evaluate((el,large)=>el.classList.toggle('large-reading',large),large);
 try{
  for(const [kind,items]of[['words',pack.learning],['why',pack.whyLearning]])for(const [term,item]of Object.entries(items)){
   await page.evaluate(({kind,term})=>location.hash='book/'+kind+'/'+encodeURIComponent(term),{kind,term});
   let card;
   if(kind==='words'){
    await page.waitForFunction(term=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value===term,term);
    assert.equal(await page.locator('.word-card h3').first().innerText(),term,'exact cell term precedes substrings');
    card=page.locator('.word-card').filter({has:page.getByRole('heading',{name:term,exact:true})});
   }else{
    const index=whyIndex.findIndex(q=>q.question===term);assert(index>=0);card=page.locator('#why-entry-'+index);await card.waitFor();
    // The existing hash lookup opens its target on the next animation frame.
    // Wait for that real deep-link behavior; an early Enter can close it again.
    await page.waitForFunction(index=>document.getElementById('why-entry-'+index)?.open,index);
   }
   const study=card.locator('[data-book-cell-study]');await study.waitFor();if(!await study.evaluate(el=>el.open)){await study.locator(':scope>summary').focus();await page.keyboard.press('Enter');}
   await study.getByText(item.benefit,{exact:true}).waitFor();
   const labels=['Ganz einfach · etwa 6–8 Jahre','Noch genauer · etwa 12–14 Jahre','Selbst beobachten und erklären','Quellen und Prüfstand',...(item.question?['Ein Hinweis, wenn du möchtest']:[]),...(item.relatedWords?.length?['Mit anderen Wörtern weiterdenken']:[]),...(item.relatedQuestions?.length?['Passende Warum-Fragen erkunden']:[])];
   for(const label of labels){const summary=study.locator('summary').getByText(label,{exact:true});if(!await summary.locator('..').evaluate(el=>el.open)){await summary.focus();await page.keyboard.press('Enter');}}
   for(const text of[item.starter,item.deeper,item.observe])await study.getByText(text,{exact:true}).waitFor();
   for(const source of item.sources){const date=value=>value.split('-').reverse().map(Number).join('.');const row=study.locator('li').filter({has:page.getByRole('link',{name:source.title,exact:true})});await row.getByText('Quelle abgerufen am '+date(source.checkedOn)+'.'+(source.updatedOn?' Angegebener Quellenstand: '+date(source.updatedOn)+'.':''),{exact:true}).waitFor();}
   const sources=study.locator('details').filter({has:page.getByText('Quellen und Prüfstand',{exact:true})});assert.deepEqual(await sources.locator('a').evaluateAll(es=>es.map(e=>e.href)),item.sources.map(s=>s.url));await sources.getByText('Belegstellenabgleich: '+pack.sourceReadOn.split('-').reverse().join('.')+'.',{exact:false}).waitFor();
   const figure=study.locator('[data-book-cell-figure]');assert.equal(await figure.getAttribute('data-book-cell-figure'),item.figure);const modelStates=await assertBookCellFigure(figure,item.figure,{term,onState:shots&&!native&&!offline?async selected=>{await figure.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-cell-'+kind+'-'+(kind==='words'?Object.keys(pack.learning):Object.keys(pack.whyLearning)).indexOf(term)+'-choice-'+selected+'-'+(large?'large':'normal')+'-'+width+'.png'),animations:'disabled'});}:null});await figure.getByText('Eigene Modellskizze · KI-unterstützt',{exact:false}).waitFor();
   if(item.question){const q=item.question;for(const i of q.answers.map((_,i)=>i).filter(i=>i!==q.correct).concat(q.correct)){await study.getByRole('button',{name:q.answers[i],exact:true}).click();assert.equal(await study.locator('.book-thinking [role=status]').innerText(),'Deine Auswahl: '+q.answers[i]+'. '+(i===q.correct?'Das passt. '+q.why:'Noch nicht passend. '+q.wrongReasons[i]));}}
   const overflowing=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);if(overflowing)report.cellOverflow={term,kind,width,large,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,elements:[...document.querySelectorAll('body *')].filter(e=>e.getClientRects().length&&!e.closest('svg')).flatMap(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+2||r.left< -2?[{tag:e.tagName,class:e.className,text:e.textContent.slice(0,90),left:r.left,right:r.right}]:[];}).slice(-35)}))};assert.equal(overflowing,false);
   const failures=await card.evaluate((root,{large})=>{const bounds=root.getBoundingClientRect();return[...root.querySelectorAll('p,h4,summary,button,a,figcaption,svg[role=img],.book-model-key li,[data-book-cell-figure] li,[data-book-cell-figure] .model-caption')].filter(el=>el.getClientRects().length).flatMap(el=>{const r=el.getBoundingClientRect(),interactive=el.matches('summary,button,a'),legend=el.matches('[data-book-cell-figure] figcaption,.book-model-key li,[data-book-cell-figure] li,[data-book-cell-figure] .model-caption');return r.left<bounds.left-1||r.right>bounds.right+1||el.scrollWidth>el.clientWidth+2||interactive&&(r.width<43.9||r.height<43.9)||legend&&parseFloat(getComputedStyle(el).fontSize)<(large?19.9:15.9)?[{tag:el.tagName,text:el.textContent.slice(0,100),width:r.width,height:r.height,font:getComputedStyle(el).fontSize}]:[];});},{large});assert.deepEqual(failures,[],'cell content/drawing/16-20px legends/44px controls fit actual card');
   if(width===320){await prepareAxe(page);assert.deepEqual(await card.evaluate(async el=>(await window.axe.run(el,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);}
   const nativeCaptures=[];
   if(shots&&native&&[320,640].includes(width)){
    const prefix=path.join(shots,'journey-engine-'+engine+'-book-cell-'+kind+'-'+(kind==='words'?Object.keys(pack.learning):Object.keys(pack.whyLearning)).indexOf(term)+'-native200-');
    for(const[part,target]of[['drawing',figure.locator('svg')],['legend',figure.locator('.model-caption,ol li').last()]]){await target.evaluate(el=>el.scrollIntoView({block:'start'}));const capture=await captureNativeViewport(page,prefix+part+'-'+width+'.png',{cdp:captureSession});assert.equal(capture.cssWidth,width);assert.equal(capture.scale,2);assert.equal(capture.pixelWidth,width*2);nativeCaptures.push(capture);}
   }else if(shots&&!offline&&!native)await card.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-cell-'+(kind==='words'?Object.keys(pack.learning).indexOf(term):8+Object.keys(pack.whyLearning).indexOf(term))+'-'+(large?'large':'normal')+'-'+width+'.png'),animations:'disabled'});
   const topic=study.locator('.book-connection a');await topic.focus();await page.keyboard.press('Enter');await page.waitForURL('**/#world/topic/'+item.topic);
   for(const [relatedKind,relatedItems]of[['words',pack.learning],['why',pack.whyLearning]])for(const [relatedTerm,related]of Object.entries(relatedItems).filter(([,value])=>value.topic===item.topic)){const backlink=page.locator('[data-book-measurement-links="'+item.topic+'"]').getByRole('link',{name:relatedTerm,exact:true});await backlink.waitFor();assert.equal(await backlink.getAttribute('href'),'#book/'+relatedKind+'/'+encodeURIComponent(relatedTerm));}
   await page.goBack();await card.waitFor();await page.waitForFunction(term=>document.activeElement?.dataset.routeFocus==='word-topic-'+term,term);
   proof.push({term,kind,width,large,native200:native,nativeCaptures,offline,figure:item.figure,modelStates,allReadingLevelsHintsAnswersFeedbackAndSources:true,normalHTMLLegends:true,actualKeyboardArticleAndBackFocus:true});
  }
  const saved=await snapshot(page);for(const key of['notes','favorites','games','journeys','review','settings','favoritePlaces'])assert.deepEqual(saved[key],original[key],'cell exploration preserves '+key);for(const[id,value]of Object.entries(original.gameSessions))assert.deepEqual(saved.gameSessions[id],value);
  assert.equal(proof.length,10);(report.bookCell??=[]).push(...proof);return proof;
 }finally{await page.locator('.earth-app').evaluate((el,large)=>el.classList.toggle('large-reading',large),wasLarge);await page.evaluate(hash=>location.hash=hash,initial);}
}


export async function bookCellNetworkView(page,{shots=null,engine='chromium'}={}){
 const browser=page.context().browser(),base=new URL(page.url()).origin,pattern='**/assets/book-cell-content-*.json';assert(browser);
 const proof={...browserErrorArrays(),integrityErrorRetry:false,sharedCloseWhilePending:false};
 const cardFor=(p,term)=>p.locator('.word-card').filter({has:p.getByRole('heading',{name:term,exact:true})});
 const ready=p=>p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
 let context,child,release=()=>{};
 try{
  context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  const seed=createSave();seed.progress.notes=[{id:'synthetic-cell-network',text:'Synthetische erhaltene Zellenotiz.',at:'2026-10-28T00:00:00.000Z'}];
  await context.addInitScript(({key,seed})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(seed));},{key:SAVE_KEY,seed});
  let requests=0;await context.route(pattern,async route=>{requests++;await route.fulfill({status:200,contentType:'application/json',body:'{}'});});
  child=await context.newPage();monitorBrowserErrors(child,base,proof);await child.goto(base+'/#book/words/'+encodeURIComponent('Zelle'));await ready(child);
  const card=cardFor(child,'Zelle');await card.getByRole('button',{name:'Später noch einmal lesen',exact:true}).click();const before=await snapshot(child),study=card.locator('[data-book-cell-study]');
  await study.locator(':scope>summary').focus();await child.keyboard.press('Enter');const retry=study.getByRole('button',{name:'Vertiefung erneut laden',exact:true});await retry.waitFor();assert.equal(requests,1);
  await card.getByText(pack.words['Zelle'][2],{exact:true}).waitFor();for(const key of['notes','favorites'])assert.deepEqual((await snapshot(child))[key],before[key]);
  if(shots)await card.screenshot({path:path.join(shots,'journey-engine-'+engine+'-book-cell-integrity-error-320.png'),animations:'disabled'});
  await context.unroute(pattern);await retry.focus();await child.keyboard.press('Enter');await study.getByText(pack.learning['Zelle'].benefit,{exact:true}).waitFor();await child.waitForFunction(()=>document.activeElement?.matches('[data-book-cell-study]>summary'));
  for(const key of['notes','favorites'])assert.deepEqual((await snapshot(child))[key],before[key]);proof.integrityErrorRetry=true;await context.close();context=null;
  context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  let arrived;const started=new Promise(resolve=>arrived=resolve),held=new Promise(resolve=>release=resolve);requests=0;
  await context.route(pattern,async route=>{requests++;arrived();await held;await route.continue();});child=await context.newPage();monitorBrowserErrors(child,base,proof);
  await child.goto(base+'/#book');await ready(child);await child.waitForFunction(()=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value==='');
  // These terms are beyond the first24 visible words. Reach both through
  // the actual existing pagination before exercising concurrent disclosures.
  for(let n=0;!await cardFor(child,'Zelle').count()||!await cardFor(child,'Zellmembran').count();n++){assert(n<5,'cell terms are reachable through existing word pagination');await child.getByRole('button',{name:/^Weitere Wörter entdecken/}).click();}
  const cellStudy=cardFor(child,'Zelle').locator('[data-book-cell-study]'),membraneStudy=cardFor(child,'Zellmembran').locator('[data-book-cell-study]');
  await cellStudy.locator(':scope>summary').click();await started;await cellStudy.locator(':scope>summary').click();await membraneStudy.locator(':scope>summary').click();assert.equal(requests,1);release();
  await membraneStudy.getByText(pack.learning['Zellmembran'].benefit,{exact:true}).waitFor();await cellStudy.locator(':scope>summary').click();await cellStudy.getByText(pack.learning['Zelle'].benefit,{exact:true}).waitFor();assert.equal(requests,1);proof.sharedCloseWhilePending=true;
  await child.evaluate(()=>location.hash='book/words/'+encodeURIComponent('Mitochondrium'));
  const mitoStudy=cardFor(child,'Mitochondrium').locator('[data-book-cell-study]');await mitoStudy.waitFor();if(!await mitoStudy.evaluate(e=>e.open))await mitoStudy.locator(':scope>summary').click();
  const figure=mitoStudy.locator('[data-book-cell-figure="mitochondrial-conversion"]');await figure.waitFor();await assertBookCellFigure(figure,'mitochondrial-conversion');
  const contour=figure.locator('.cell-process-fold'),original=await contour.getAttribute('d');
  // Exact earlier rendered crossing contour, retained as the concrete visual regression.
  const priorCrossing='M79 84Q90 56 111 58L113 89L127 60L137 95L152 62L161 96L176 67Q211 86 191 111L174 112L162 91L151 122L135 94L125 123L108 100L96 114Q77 105 79 84Z';
  try{await contour.evaluate((node,value)=>node.setAttribute('d',value),priorCrossing);await assert.rejects(()=>assertMitoContour(figure),/must not self-cross/,'actual old rendered crossing cannot pass otherwise valid controls and status');}finally{await contour.evaluate((node,value)=>node.setAttribute('d',value),original);}
  await assertMitoContour(figure);proof.actualEarlierCrossingContourNegativeDetected=true;
  assert(browserErrorsComplete(proof));return proof;
 }finally{release();await context?.close();}
}
