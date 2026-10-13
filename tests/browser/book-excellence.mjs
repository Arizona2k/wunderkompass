import assert from 'node:assert/strict';
import book from '../../app/book-content.json' with {type:'json'};
const terms=Object.keys(book.learning),widths=[320,360,390,768,1024,1440,1920];
async function reveal(details){if(!await details.evaluate(e=>e.open))await details.locator(':scope > summary').click();}
async function openWord(page,name){await page.evaluate(name=>location.hash='book/words/'+encodeURIComponent(name),name);const card=page.locator('[data-book-word="'+name+'"]');await card.waitFor();await reveal(card.locator('.book-study'));return card;}
async function geometry(page,card,label){
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,label+' page reflow');
 const clipped=await card.locator('h3,h4,p,summary,button,a,label').evaluateAll(nodes=>nodes.flatMap(el=>{
  if(!el.getClientRects().length)return [];const r=el.getBoundingClientRect();return r.left< -2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+2?[el.tagName+':'+el.textContent.slice(0,60)]:[];
 }));assert.deepEqual(clipped,[],label+' readable book text and controls');
 for(const control of await card.locator('button,summary,input,a').all())if(await control.isVisible()){
  const r=await control.boundingBox();
  const detail=await control.evaluate(el=>({tag:el.tagName,type:el.getAttribute('type'),text:el.textContent?.slice(0,100),rect:el.getBoundingClientRect().toJSON(),minHeight:getComputedStyle(el).minHeight,height:getComputedStyle(el).height}));
  assert.ok(r&&r.height>=44,label+' touch height '+JSON.stringify({box:r,element:detail}));
 }
}
async function exercise(page,card,name){
 const l=book.learning[name];await card.getByText(l.benefit,{exact:true}).waitFor();
 for(const text of [l.starter,l.deeper,l.observe]){const d=card.locator('details').filter({has:page.getByText(text,{exact:true})}).last();await reveal(d);await d.getByText(text,{exact:true}).waitFor();}
 if(l.illustration==='entities'){assert.equal(await card.locator('.book-entities svg circle').count(),6);assert.equal(await card.locator('.book-entities svg g').count(),3);await card.locator('.book-entities figcaption').filter({hasText:'keine echte Molmenge'}).waitFor();}
 const q=card.locator('.book-thinking');await reveal(q.locator('details'));await q.getByText(l.question.hint,{exact:true}).waitFor();
 const wrong=(l.question.correct+1)%3;await q.locator('.quiz-answer').nth(wrong).click();await q.getByText(l.question.wrongReasons[wrong],{exact:true}).waitFor();assert.equal(await q.getByText(l.question.why,{exact:true}).count(),0,'wrong choice never leaks the correct explanation');await q.locator('.quiz-answer').nth(l.question.correct).click();await q.getByText(l.question.why,{exact:true}).waitFor();
 if(l.model){const model=card.locator('.book-measure'),before=await model.getByRole('status').innerText();await model.getByRole('slider').focus();await page.keyboard.press('End');await page.waitForFunction(({kind,before})=>document.querySelector('[data-book-measure="'+kind+'"] [role=status]')?.textContent!==before,{kind:l.model,before});assert.ok(!/NaN|Infinity|undefined/.test(await model.innerText()));if(l.model==='duration'){await model.getByRole('button',{name:'Beginn bei 10 s',exact:true}).click();await model.getByRole('status').filter({hasText:'Beginn 10 s · Ende 20 s · Dauer 10 s'}).waitFor();}}
 await reveal(card.locator('details').filter({has:page.getByText('Quellen und Prüfstand',{exact:true})}).last());
 for(const source of l.sources)assert.equal(await card.getByRole('link',{name:source.title,exact:true}).getAttribute('href'),source.url);
 await card.getByText(/Eine unabhängige Fachabnahme steht noch aus/).waitFor();assert.equal(await card.locator('.book-topic-link').getAttribute('href'),'#world/topic/'+l.topic);
}
async function axe(page){await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await page.evaluate(async()=>(await window.axe.run('.knowledge-book',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))),[],'book accessibility');}
export async function bookExcellenceFlow(browser,base,ready,monitor,report,shots){
 const visited=[];
 for(const width of widths){const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.goto(base+'#book');await ready(p);await p.locator('.word-card').first().waitFor();await p.getByRole('group',{name:'Wörter nach Anfangsbuchstaben',exact:true}).getByRole('button',{name:'E',exact:true}).click();await p.getByRole('tab',{name:'Messen',exact:true}).click();assert.equal(await p.locator('[data-book-word]').count(),7);const alphabet=p.getByRole('group',{name:'Wörter nach Anfangsbuchstaben',exact:true});assert.equal(await alphabet.getByRole('button',{name:'E',exact:true}).count(),0);await alphabet.getByRole('button',{name:'M',exact:true}).click();assert.equal(await p.locator('[data-book-word]').count(),2);await alphabet.getByRole('button',{name:'Alle',exact:true}).click();
   for(const name of terms){const card=await openWord(p,name);await exercise(p,card,name);await geometry(p,card,name+' '+width);if([320,1440].includes(width)){await card.screenshot({path:shots+'/book-'+name.toLocaleLowerCase('de')+'-'+width+'.png',animations:'disabled'});if(book.learning[name].model)await card.locator('.book-measure').screenshot({path:shots+'/book-model-'+book.learning[name].model+'-'+width+'.png'});await axe(p);}visited.push({name,width});}
   if(width===320){const card=await openWord(p,'Kelvin');await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));await geometry(p,card,'large book320');await card.locator('.book-measure').screenshot({path:shots+'/book-temperature-large-320.png'});await p.evaluate(()=>document.querySelector('.earth-app').classList.remove('large-reading'));}
   if(width===390){
    for(const name of terms){await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(name);await p.getByRole('option').filter({has:p.getByText(name,{exact:true})}).first().click();assert.equal(new URL(p.url()).hash,'#book/words/'+encodeURIComponent(name));await p.locator('[data-book-word="'+name+'"]').waitFor();await p.reload();await ready(p);const card=await openWord(p,name);await card.locator('details[data-history-disclosure="book-deeper-'+name+'"] > summary').click();const link=card.locator('.book-topic-link');await link.focus();await p.keyboard.press('Enter');await p.locator('.world-article').waitFor();await p.goBack();await card.waitFor();await p.waitForFunction(name=>document.activeElement?.getAttribute('data-route-focus')==='word-topic-'+name,name);assert.equal(await card.locator('.book-study').evaluate(e=>e.open),true);}
    await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await p.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill('Cäsium');await p.getByRole('option').filter({has:p.getByText('Sekunde',{exact:true})}).click();await p.locator('[data-book-word="Sekunde"]').waitFor();
    await p.getByRole('tab',{name:'Warum?',exact:true}).click();for(const [question,answer] of book.why){const d=p.locator('.why-card').filter({hasText:question});await reveal(d);await d.getByText(answer,{exact:true}).waitFor();}
   }
   report.views.push({width,name:'all seven measurement words, voluntary levels, models and individual feedback'});
  }finally{await c.close();}
 }
 report.bookCoverage={terms:[...new Set(visited.map(v=>v.name))],widths:[...new Set(visited.map(v=>v.width))],observed:visited,models:[...new Set(terms.map(t=>book.learning[t].model).filter(Boolean))]};report.checks.push('Seven new book explanations at all seven widths: actual easy/deep/observation/source levels, three changing keyboard models, individual hint/wrong/right, all direct/search/reload/context/Back/focus paths, 30 retained Why answers, large text and axe');
}
export async function bookStudyAtZoom(page,report,capture){
 const visited=[];await page.evaluate(()=>document.querySelector('.earth-app').classList.remove('large-reading'));
 for(const name of terms){const card=await openWord(page,name);await exercise(page,card,name);await geometry(page,card,'native book200 '+name);visited.push(name);}
 const card=await openWord(page,'Kelvin');await page.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));await geometry(page,card,'native book200 plus large text');await card.locator('.book-measure').scrollIntoViewIfNeeded();await capture('book-native-200-large.png');
 const dimensions=await page.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio}));assert.equal(dimensions.cssWidth,640);assert.equal(dimensions.scale,2);report.bookNativeZoom={percent:200,...dimensions,terms:visited,largeTextAlsoChecked:true};report.checks.push('All seven book explanations at real native200% zoom with measured640 CSS px/DPR2; keyboard models, readable open levels and combined large app text');
}
export async function prepareOfflineBook(page){const card=await openWord(page,'Meter');const button=card.getByRole('button',{name:'Später noch einmal lesen',exact:true});await button.click();await card.getByRole('button',{name:'Im Notizbuch',exact:true}).waitFor();}
export async function offlineBook(page,report){const visited=[];for(const name of terms){const card=await openWord(page,name);await exercise(page,card,name);visited.push(name);}const card=await openWord(page,'Meter');await card.getByRole('button',{name:'Im Notizbuch',exact:true}).waitFor();report.bookOffline={terms:visited,retainedFavorite:true};report.checks.push('Cold offline after server end: all seven new book explanations, three models, voluntary levels and checked source metadata; same-schema saved word favorite retained');}
export async function bookEngineFlow(page,shots,engine){
 const observed=[],engineWidths=[320,390,768,1440];await page.evaluate(()=>document.querySelector('.earth-app').classList.remove('large-reading'));
 for(const width of engineWidths){await page.setViewportSize({width,height:900});for(const name of terms){const card=await openWord(page,name);await exercise(page,card,name);await geometry(page,card,engine+' book '+name+' '+width);observed.push({name,width});}
  if(width===320||width===1440){const card=await openWord(page,'Kelvin');await card.locator('.book-measure').screenshot({path:shots+'/journey-engine-'+engine+'-book-'+width+'.png'});}
 }
 return {bookTerms:[...new Set(observed.map(v=>v.name))],bookWidths:engineWidths,bookObserved:observed};
}
