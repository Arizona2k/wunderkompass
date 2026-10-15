import {prepareAxe,verifyAxeLoader} from './axe-loader.mjs';
import assert from 'node:assert/strict';
import book from '../../app/book-content.json' with {type:'json'};
import studyIndex from '../../app/book-study-index.json' with {type:'json'};
import topicIndex from '../../app/book-topic-index.json' with {type:'json'};
const terms=Object.keys(book.learning),widths=[320,360,390,768,1024,1440,1920];
async function reveal(details){if(!await details.evaluate(e=>e.open))await details.locator(':scope > summary').click();}
async function openWord(page,name){await page.evaluate(name=>location.hash='book/words/'+encodeURIComponent(name),name);const card=page.locator('[data-book-word="'+name+'"]');await card.waitFor();await reveal(card.locator('.book-study'));return card;}
export async function geometry(page,card,label){
 const inspection=await card.locator('h3,h4,p,summary,button,a,label,input').evaluateAll(nodes=>{
  const clipped=[],small=[];
  for(const el of nodes){
   const r=el.getBoundingClientRect(),style=getComputedStyle(el);
   if(!el.getClientRects().length)continue;
   if(el.matches('h3,h4,p,summary,button,a,label')&&(r.left< -2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+2))clipped.push(el.tagName+':'+el.textContent.slice(0,60));
   if(el.matches('button,summary,input,a')&&r.width!==0&&r.height!==0&&style.visibility!=='hidden'&&style.visibility!=='collapse'&&r.height<44)small.push({tag:el.tagName,text:el.textContent?.slice(0,100),rect:r.toJSON(),minHeight:style.minHeight,height:style.height});
  }
  const zeros=[],root=nodes[0]?.closest('article');if(root){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode,p=n.parentElement;if(n.textContent.trim()==='0'&&['DIV','DETAILS','ARTICLE'].includes(p.tagName)&&p.getClientRects().length&&!p.closest('.book-measure'))zeros.push(p.className||p.tagName);}}
  return {overflow:document.documentElement.scrollWidth>innerWidth+2,clipped,small,zeros};
 });
 assert.equal(inspection.overflow,false,label+' page reflow');assert.deepEqual(inspection.clipped,[],label+' readable book text and controls');assert.deepEqual(inspection.small,[],label+' strict44px touch height');assert.deepEqual(inspection.zeros,[],label+' no stray conditional zero');
}
export async function exercise(page,card,name){
 const l=book.learning[name];await card.getByText(l.benefit,{exact:true}).waitFor();
 for(const text of [l.starter,l.deeper,l.observe]){const d=card.locator('details').filter({has:page.getByText(text,{exact:true})}).last();await reveal(d);await d.getByText(text,{exact:true}).waitFor();}
 if(l.illustration==='entities'){assert.equal(await card.locator('.book-entities svg circle').count(),6);assert.equal(await card.locator('.book-entities svg g').count(),3);await card.locator('.book-entities figcaption').filter({hasText:'keine echte Molmenge'}).waitFor();}
 const q=card.locator('.book-thinking');await reveal(q.locator('details'));await q.getByText(l.question.hint,{exact:true}).waitFor();
 for(let wrong=0;wrong<l.question.answers.length;wrong++)if(wrong!==l.question.correct){await q.locator('.quiz-answer').nth(wrong).click();await q.getByText(l.question.wrongReasons[wrong],{exact:true}).waitFor();assert.equal(await q.getByText(l.question.why,{exact:true}).count(),0,'either wrong choice never leaks the correct explanation');}await q.locator('.quiz-answer').nth(l.question.correct).click();await q.getByText(l.question.why,{exact:true}).waitFor();
 if(l.model){const model=card.locator('.book-measure'),before=await model.getByRole('status').innerText();await model.getByRole('slider').focus();await page.keyboard.press('End');await page.waitForFunction(({kind,before})=>document.querySelector('[data-book-measure="'+kind+'"] [role=status]')?.textContent!==before,{kind:l.model,before});assert.ok(!/NaN|Infinity|undefined/.test(await model.innerText()));if(l.model==='duration'){await model.getByRole('button',{name:'Beginn bei 10 s',exact:true}).click();await model.getByRole('status').filter({hasText:'Beginn 10 s · Ende 20 s · Dauer 10 s'}).waitFor();}}
 await reveal(card.locator('details').filter({has:page.getByText('Quellen und Prüfstand',{exact:true})}).last());
 for(const source of l.sources)assert.equal(await card.getByRole('link',{name:source.title,exact:true}).getAttribute('href'),source.url);
 if(l.relatedWords?.length){const d=card.locator('[data-history-disclosure="book-related-'+name+'"]');await reveal(d);for(const link of l.relatedWords){await d.getByText(link.reason,{exact:true}).waitFor();assert.equal(await d.getByRole('link',{name:'Mit „'+link.term+'“ weiterdenken →',exact:true}).getAttribute('href'),'#book/words/'+encodeURIComponent(link.term));}}
 if(l.relatedQuestions?.length){const d=card.locator('[data-history-disclosure="word-why-'+name+'"]');await reveal(d);for(const link of l.relatedQuestions){await d.getByText(link.reason,{exact:true}).waitFor();assert.equal(await d.getByRole('link',{name:link.question+' →',exact:true}).getAttribute('href'),'#book/why/'+encodeURIComponent(link.question));}}
 await card.getByText(/Eine unabhängige Fachabnahme steht noch aus/).waitFor();assert.equal(await card.locator('.book-connection .book-topic-link').getAttribute('href'),l.topic?'#world/topic/'+l.topic:'#labs/'+l.lab);
}
async function axe(page){await prepareAxe(page);assert.deepEqual(await page.evaluate(async()=>(await window.axe.run('.knowledge-book',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))),[],'book accessibility');}
export async function bookExcellenceFlow(browser,base,ready,monitor,report,shots){
 const auditContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),auditPage=await auditContext.newPage();monitor(auditPage);try{await auditPage.goto(base+'#book/words/Kelvin');await ready(auditPage);await auditPage.locator('[data-book-word=\"Kelvin\"]').waitFor();await auditPage.locator('.book-study > summary').click();await auditPage.locator('.book-thinking').waitFor();await verifyAxeLoader(auditPage,report);}finally{await auditContext.close();}
 const visited=[];report.bookPhaseTimings=[];
 const fixtureContext=await browser.newContext({viewport:{width:320,height:900}}),fixture=await fixtureContext.newPage();
 try{
  for(const [name,html,valid] of [
   ['exact44','<button style="height:44px">Button</button>',true],
   ['actual43','<button style="height:43px">Button</button>',false],
   ['clipped','<button style="height:44px;width:500px">Button</button>',false],
   ['hidden-clipped','<button style="height:44px;width:500px;visibility:hidden">Hidden</button>',false],
   ['stray-zero','<div>0</div><button style="height:44px">Visible</button>',false],
   ['hidden-small','<button style="height:1px;visibility:hidden">Hidden</button><button style="height:44px">Visible</button>',true],
  ]){
   await fixture.setContent('<style>body{margin:0}button{border:0;box-sizing:border-box}</style><article>'+html+'</article>');const run=()=>geometry(fixture,fixture.locator('article'),name);if(valid)await run();else await assert.rejects(run);
  }
 }finally{await fixtureContext.close();}
 report.checks.push('Actual DOM fixtures retain exact44px acceptance and reject43px controls/overflow including hidden overflowing text; hidden non-overflowing controls keep previous visibility semantics');
 const lazyContext=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce'}),lazy=await lazyContext.newPage();monitor(lazy);lazy.setDefaultTimeout(20000);const requests=[];
 lazy.on('request',request=>{if(/\/book-study-[a-f0-9]{16}-[^/]+\.json$/.test(new URL(request.url()).pathname))requests.push(request.url());});
 try{
  await lazy.goto(base+'#book/words/Meter');await ready(lazy);const card=lazy.locator('[data-book-word="Meter"]');await card.waitFor();assert.equal(requests.length,0,'definition does not fetch unopened learning parts');
  let attempts=0;await lazy.route('**/'+studyIndex.Meter.file.replace('.json','-*.json'),async route=>{attempts++;if(attempts===1)await route.fulfill({contentType:'application/json',body:JSON.stringify({schemaVersion:1,term:'Meter',learning:{starter:'Nicht belegte Ersetzung'}})});else await route.continue();});
  await reveal(card.locator('.book-study'));await card.getByRole('button',{name:'Wortvertiefung erneut laden',exact:true}).waitFor();assert.equal(await card.getByText(book.learning.Meter.deeper,{exact:true}).count(),0);await card.getByRole('button',{name:'Wortvertiefung erneut laden',exact:true}).focus();await lazy.keyboard.press('Enter');await card.getByText(book.learning.Meter.benefit,{exact:true}).waitFor();await lazy.waitForFunction(()=>document.activeElement?.matches('[data-book-word="Meter"] > .book-study > summary'));assert.equal(attempts,2,'failed part is not cached');
  await card.locator('.book-study > summary').click();await card.locator('.book-study > summary').click();await card.getByText(book.learning.Meter.benefit,{exact:true}).waitFor();assert.equal(requests.length,2,'validated part is reused on reopen');assert.equal(await card.locator('h3').innerText(),'Meter','definition remains available throughout failure');
  const topic=book.learning.Meter.topic,meta=topicIndex[topic];let topicAttempts=0;
  await lazy.route('**/'+meta.file.replace('.json','-*.json'),async route=>{topicAttempts++;if(topicAttempts===1)await route.fulfill({contentType:'application/json',body:JSON.stringify({schemaVersion:1,topic,links:[{term:'UnsupportedWord',reason:'Ungeprüfter Ersatz'}]})});else await route.continue();});
  await lazy.evaluate(topic=>location.hash='world/topic/'+topic,topic);await lazy.locator('.world-article').waitFor();assert.equal(topicAttempts,0,'world article never fetches unopened reciprocal text');
  const reciprocal=lazy.locator('[data-history-disclosure="topic-book-'+topic+'"]');await reveal(reciprocal);const retry=reciprocal.getByRole('button',{name:'Buchverbindungen erneut laden',exact:true});await retry.waitFor();assert.equal(await reciprocal.getByText('Ungeprüfter Ersatz',{exact:true}).count(),0);await retry.focus();await lazy.keyboard.press('Enter');await reciprocal.getByRole('link',{name:'„Meter“ im Wissensbuch öffnen →',exact:true}).waitFor();await lazy.waitForFunction(()=>document.activeElement?.matches('.book-world-links > summary'));assert.equal(topicAttempts,2,'damaged reciprocal part remains retryable');
  await reciprocal.locator(':scope > summary').click();await reciprocal.locator(':scope > summary').click();assert.equal(topicAttempts,2,'valid reciprocal reopen uses only the checked cached part');
 }finally{await lazyContext.close();}
 report.checks.push('Book/world views fetch no unopened enrichment or reciprocal text; corrupted word and topic parts are withheld, keyboard retry restores summary focus, checked reopening makes no additional request and core views remain available');
 for(const width of widths){const widthStarted=performance.now();const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.goto(base+'#book');await ready(p);await p.locator('.word-card').first().waitFor();await p.getByRole('group',{name:'Wörter nach Anfangsbuchstaben',exact:true}).getByRole('button',{name:'E',exact:true}).click();await p.getByRole('tab',{name:'Messen',exact:true}).click();assert.equal(await p.locator('[data-book-word]').count(),7);const alphabet=p.getByRole('group',{name:'Wörter nach Anfangsbuchstaben',exact:true});assert.equal(await alphabet.getByRole('button',{name:'E',exact:true}).count(),0);await alphabet.getByRole('button',{name:'M',exact:true}).click();assert.equal(await p.locator('[data-book-word]').count(),2);await alphabet.getByRole('button',{name:'Alle',exact:true}).click();
   for(const name of terms){const card=await openWord(p,name);await exercise(p,card,name);await geometry(p,card,name+' '+width);if([320,1440].includes(width)){await card.screenshot({path:shots+'/book-'+name.toLocaleLowerCase('de')+'-'+width+'.png',animations:'disabled'});if(book.learning[name].model)await card.locator('.book-measure').screenshot({path:shots+'/book-model-'+book.learning[name].model+'-'+width+'.png'});await axe(p);}visited.push({name,width});}
   report.bookPhaseTimings.push({phase:'full word matrix with screenshot/axe',width,seconds:(performance.now()-widthStarted)/1000});
   if(width===320){const card=await openWord(p,'Kelvin');await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));await geometry(p,card,'large book320');await card.locator('.book-measure').screenshot({path:shots+'/book-temperature-large-320.png'});await p.evaluate(()=>document.querySelector('.earth-app').classList.remove('large-reading'));}
   if(width===390){
    const navigationStarted=performance.now();await bookNavigationFlow(p,ready,terms,shots);report.bookPhaseTimings.push({phase:'all180 global search/reload/reciprocal/Back paths',width,seconds:(performance.now()-navigationStarted)/1000});
    await openWord(p,'DNA');await p.getByRole('group',{name:'Wörter nach Anfangsbuchstaben',exact:true}).getByRole('button',{name:'M',exact:true}).click();await p.locator('[data-book-word="Meter"]').waitFor();assert.equal(await p.locator('[data-book-word="DNA"]').count(),0,'alphabet deliberately leaves an exact routed definition');await p.getByRole('group',{name:'Wörter nach Anfangsbuchstaben',exact:true}).getByRole('button',{name:'Alle',exact:true}).click();assert.ok(await p.locator('.word-card').count()>1,'reset restores the broad list');
    await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill('Cäsium');await p.getByRole('option').filter({has:p.getByText('Sekunde',{exact:true})}).click();await p.locator('[data-book-word="Sekunde"]').waitFor();
    const localSearch=p.getByRole('textbox',{name:'Wissenswörter durchsuchen',exact:true});await localSearch.fill('Cäsium');await p.locator('[data-book-word="Sekunde"]').waitFor();assert.equal(await p.locator('.word-card').count(),1,'local word search includes actual deeper text');
    await p.getByRole('tab',{name:'Warum?',exact:true}).click();while(await p.getByRole('button',{name:'Weitere Warum-Fragen entdecken',exact:true}).count())await p.getByRole('button',{name:'Weitere Warum-Fragen entdecken',exact:true}).click();for(const [question,answer] of book.why){const d=p.locator('.why-card').filter({hasText:question});await reveal(d);await d.getByText(answer,{exact:true}).waitFor();}
   }
   report.views.push({width,name:terms.length+' individual book explanations, voluntary levels, models and feedback'});
  }finally{await c.close();}
 }
 report.bookCoverage={terms:[...new Set(visited.map(v=>v.name))],widths:[...new Set(visited.map(v=>v.width))],observed:visited,models:[...new Set(terms.map(t=>book.learning[t].model).filter(Boolean))]};report.checks.push(terms.length+' individual book explanations at all seven widths: actual easy/deep/observation/source levels, three changing keyboard models, individual hint/wrong/right, all direct/search/reload/context/Back/focus paths, all retained and new Why answers, large text and axe');
}
export async function bookStudyAtZoom(page,report,capture){
 const visited=[];await page.evaluate(()=>document.querySelector('.earth-app').classList.remove('large-reading'));
 for(const name of terms){const card=await openWord(page,name);await exercise(page,card,name);await geometry(page,card,'native book200 '+name);visited.push(name);}
 const card=await openWord(page,'Kelvin');await page.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));await geometry(page,card,'native book200 plus large text');await card.locator('.book-measure').scrollIntoViewIfNeeded();await capture('book-native-200-large.png');
 const dimensions=await page.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));assert.equal(dimensions.cssWidth,640);assert.equal(dimensions.scale,2);report.bookNativeZoom={percent:200,...dimensions,terms:visited,largeTextAlsoChecked:true};report.checks.push(terms.length+' book explanations at real native200% zoom with measured640 CSS px/DPR2; keyboard models, readable open levels and combined large app text');
}
export async function prepareOfflineBook(page){const card=await openWord(page,'Meter');const button=card.getByRole('button',{name:'Später noch einmal lesen',exact:true});await button.click();await card.getByRole('button',{name:'Im Notizbuch',exact:true}).waitFor();}
export async function offlineBook(page,report){
 const visited=[];for(const name of terms){const card=await openWord(page,name);await exercise(page,card,name);visited.push(name);}
 const topics=[];for(const [topic] of Object.entries(topicIndex)){
  const lab=topic.startsWith('lab-');await page.evaluate(({topic,lab})=>location.hash=lab?'labs/'+topic.slice(4):'world/topic/'+topic,{topic,lab});await page.locator(lab?'#lab-heading':'.world-article').waitFor();const details=page.locator('[data-history-disclosure="topic-book-'+topic+'"]');await reveal(details);
  for(const [term,l] of Object.entries(book.learning).filter(([,l])=>(l.topic??'lab-'+l.lab)===topic)){const entry=details.locator('li').filter({has:page.getByRole('link',{name:'„'+term+'“ im Wissensbuch öffnen →',exact:true})}),link=entry.getByRole('link',{name:'„'+term+'“ im Wissensbuch öffnen →',exact:true});await entry.getByText(l.connection,{exact:true}).waitFor();assert.equal(await link.getAttribute('href'),'#book/words/'+encodeURIComponent(term));}topics.push(topic);
 }
 const name='Mikroorganismus',card=await openWord(page,name),pair=book.learning[name].relatedWords[0];await reveal(card.locator('[data-history-disclosure="book-related-'+name+'"]'));const link=card.getByRole('link',{name:'Mit „'+pair.term+'“ weiterdenken →',exact:true});await link.focus();await page.keyboard.press('Enter');await page.locator('[data-book-word="'+pair.term+'"]').waitFor();await page.goBack();await card.waitFor();await page.waitForFunction(key=>document.activeElement?.getAttribute('data-route-focus')===key,'word-related-'+name+'-'+pair.term);
 const meter=await openWord(page,'Meter');await meter.getByRole('button',{name:'Im Notizbuch',exact:true}).waitFor();report.bookOffline={terms:visited,topics,retainedFavorite:true,reciprocalNavigationAndBackFocus:true};report.checks.push('Cold offline after server end: '+terms.length+' book explanations and '+topics.length+' reciprocal topic parts, three models, voluntary levels, source metadata, real word navigation/Back focus and same-schema saved favorite');
}
export async function bookEngineFlow(page,shots,engine){
 const observed=[],engineWidths=[320,390,768,1440];await page.evaluate(()=>document.querySelector('.earth-app').classList.remove('large-reading'));
 for(const width of engineWidths){await page.setViewportSize({width,height:900});for(const name of terms){const card=await openWord(page,name);await exercise(page,card,name);await geometry(page,card,engine+' book '+name+' '+width);observed.push({name,width});if(observed.length%30===0)console.log('ENGINE_PROGRESS',JSON.stringify({engine,phase:'book',cases:observed.length,total:terms.length*engineWidths.length,width,term:name}));}
  if(width===320||width===1440){const card=await openWord(page,'Kelvin');await card.locator('.book-measure').screenshot({path:shots+'/journey-engine-'+engine+'-book-'+width+'.png'});}
 }
 return {bookTerms:[...new Set(observed.map(v=>v.name))],bookWidths:engineWidths,bookObserved:observed};
}

export async function bookNavigationFlow(p,ready,names=terms,shots='work'){
 for(const name of names){try{
await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(name);await p.getByRole('option').filter({has:p.getByText('Wissenswörter',{exact:true})}).filter({has:p.getByText(name,{exact:true})}).click();assert.equal(new URL(p.url()).hash,'#book/words/'+encodeURIComponent(name));await p.locator('[data-book-word="'+name+'"]').waitFor();await p.reload();await ready(p);const card=await openWord(p,name);await card.locator('details[data-history-disclosure="book-deeper-'+name+'"] > summary').click();const learning=book.learning[name],destination=learning.topic??'lab-'+learning.lab,link=card.locator('.book-connection .book-topic-link');await link.focus();await p.keyboard.press('Enter');await p.locator(learning.topic?'.world-article':'#lab-heading').waitFor();
     const reciprocal=p.locator('[data-history-disclosure="topic-book-'+destination+'"]');await reveal(reciprocal);const backLink=reciprocal.getByRole('link',{name:'„'+name+'“ im Wissensbuch öffnen →',exact:true});await backLink.focus();await p.keyboard.press('Enter');await card.waitFor();assert.equal(await p.locator('.word-card').count(),1,'exact routed definition');await p.goBack();await reciprocal.waitFor();await p.waitForFunction(key=>document.activeElement?.getAttribute('data-route-focus')===key,'topic-word-'+destination+'-'+name);await p.goBack();await card.waitFor();await p.waitForFunction(key=>document.activeElement?.getAttribute('data-route-focus')===key,(learning.topic?'word-topic-':'word-lab-')+name);assert.equal(await card.locator('.book-study').evaluate(e=>e.open),true);
     const related=book.learning[name].relatedWords?.[0];if(related){const d=card.locator('[data-history-disclosure="book-related-'+name+'"]');await reveal(d);const target=d.getByRole('link',{name:'Mit „'+related.term+'“ weiterdenken →',exact:true});await target.focus();await p.keyboard.press('Enter');await p.locator('[data-book-word="'+related.term+'"]').waitFor();assert.equal(await p.locator('.word-card').count(),1);await p.goBack();await card.waitFor();await p.waitForFunction(key=>document.activeElement?.getAttribute('data-route-focus')===key,'word-related-'+name+'-'+related.term);}

 }catch(error){const state=await p.evaluate(()=>({url:location.href,active:{tag:document.activeElement?.tagName,focus:document.activeElement?.getAttribute('data-route-focus')},history:history.state,focusTrace:window.__focusTrace}));await p.screenshot({path:shots+'/book-navigation-failure.png',fullPage:true,animations:'disabled'});console.error('BOOK_NAVIGATION_FAILURE',JSON.stringify({name,...state}));throw new Error('Book navigation '+name+': '+error.message+'\n'+JSON.stringify(state),{cause:error});}}
}
