import JOURNEY_SOURCES from '../../app/journey-sources.json' with {type:'json'};
import {bookExcellenceFlow} from './book-excellence.mjs';
import {nativeJourneyZoom} from './journey-zoom.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import JOURNEYS from '../../exports/content/journeys.json' with {type:'json'};
import {CHAPTER_LINKS} from '../../app/journey-links.ts';
import data from '../../app/journey-inquiries.json' with {type:'json'};
import book from '../../app/book-content.json' with {type:'json'};
const editorial=JOURNEYS.flatMap(j=>j.steps.map((s,i)=>({...s,id:j.id+':'+i})));
const saveKey='erde-entdecken:save:v3';
async function open(p,id,index){await p.evaluate(route=>location.hash=route,'journeys/'+id+'/'+(index+1));await p.locator('[data-chapter-inquiry="'+id+':'+index+'"]').waitFor();}
async function reveal(p,text){const summary=p.locator('summary').filter({hasText:text});if(!await summary.evaluate(el=>el.parentElement.open))await summary.click();}
async function geometry(p,label){
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,label+' horizontal overflow');
 const escaped=await p.locator('.journey-reader h2,.journey-reader h3,.journey-reader h4,.journey-reader p,.journey-reader button,.journey-reader summary,.journey-reader textarea,.journey-reader a').evaluateAll(elements=>elements.flatMap(el=>{
  if(!el.getClientRects().length||el.closest('details:not([open])')&&!el.closest('summary'))return [];
  const r=el.getBoundingClientRect();return r.left< -2||r.right>innerWidth+2?[el.tagName+': '+el.textContent.slice(0,50)]:[];
 }));assert.deepEqual(escaped,[],label+' readable controls and text within viewport');
}
async function axe(p,selector){await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});const violations=await p.evaluate(async selector=>(await window.axe.run(selector,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),selector);assert.deepEqual(violations,[],'journey accessibility');}
export async function journeysFlow(browser,base,ready,monitor,report,shots,nativeBrowser){
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',acceptDownloads:true}),p=await context.newPage();monitor(p);p.setDefaultTimeout(20000);
 await p.goto(base+'/#journeys');await ready(p);await p.locator('.journey-tile').first().waitFor();assert.equal(await p.locator('.journey-tile').count(),16);
 report.journeySupport=await journeySupportView(p,{widths:[320,360,390,768,1024,1440,1920],shots,engine:'chromium'});
 await p.locator('.journey-filters input').fill('Wolken');assert.ok(await p.locator('.journey-tile').count()<16);await p.locator('.journey-filters input').fill('');
 for(const c of data.chapters){
  await open(p,c.journeyId,c.index);const text=editorial.find(s=>s.id===c.id);await p.getByText(text.whyItMatters,{exact:true}).waitFor();await reveal(p,'Ganz einfach · etwa 6–8 Jahre');await p.getByText(text.starter,{exact:true}).waitFor();await reveal(p,'Noch genauer · etwa 12–14 Jahre');await p.getByText(text.deeper,{exact:true}).waitFor();await reveal(p,'Selbst beobachten und erklären · freiwillig');await p.getByText(text.observe,{exact:true}).waitFor();if(c.journeyId==='ocean'){await reveal(p,'Für Erwachsene: Quellen');for(const key of text.sourceIds){const source=JOURNEY_SOURCES[key],link=p.locator('.journey-source').filter({hasText:source.title});assert.equal(await link.getAttribute('href'),source.url);assert.ok(await link.isVisible());}assert.equal(await p.locator('.journey-source').count(),text.sourceIds.length);}
  await geometry(p,c.id);const inquiry=p.locator('[data-chapter-inquiry="'+c.id+'"]');
  assert.ok((await p.locator('.journey-mission').innerText()).includes(c.goal));
  for(let level=0;level<3;level++){
   const q=c.tasks[level];await inquiry.locator('.journey-levels button').nth(level).click();await inquiry.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
   const hint=inquiry.locator('.journey-task summary');if(await hint.evaluate(el=>el.parentElement.open))await hint.click();await hint.click();await inquiry.getByText(q.hint,{exact:true}).waitFor();
   await inquiry.locator('.quiz-answer').nth((q.correct+1)%3).click();await inquiry.getByText('Lass uns den Gedanken prüfen',{exact:true}).waitFor();assert.equal(await inquiry.getByText(q.why,{exact:true}).count(),0);
   await inquiry.locator('.quiz-answer').nth(q.correct).click();await inquiry.getByText(q.why,{exact:true}).waitFor();
  }
  if(c.index>0){const visual=p.locator('[data-chapter-visual="'+c.id+'"]');await visual.waitFor();assert.ok(await visual.locator('svg').evaluate(svg=>[...svg.children].some(e=>e.tagName!=='defs'&&e.tagName!=='text')),'every chapter graphic has an actual drawing beyond marker definitions');assert.equal(await visual.locator('svg text').evaluateAll(nodes=>nodes.filter(n=>!/^\d+$/.test(n.textContent.trim())).length),0,'words remain readable HTML, not tiny scaled SVG text');for(const label of await visual.locator('.chapter-diagram-key span').all()){assert.ok(parseFloat(await label.evaluate(e=>getComputedStyle(e).fontSize))>=16,'diagram HTML labels at least16px');}if(['moon:1','moon:2','water:2','inside:2','nature:4','countries:3'].includes(c.id))await visual.screenshot({path:path.join(shots,'chapter-diagram-'+c.id.replace(':','-')+'-390.png')});for(const choice of await visual.locator('button').all()){await choice.click();assert.equal(await choice.getAttribute('aria-pressed'),'true');if(c.id==='countries:3'){const i=await choice.evaluate(e=>[...e.parentElement.children].indexOf(e));await visual.locator('.chapter-diagram-key').getByText(['Gemeinsame Landgrenze','Meer','Fluss über die Grenze'][i],{exact:true}).waitFor();assert.equal(await visual.getByText('Feste äußere Hülle',{exact:true}).count(),0,'country borders do not use a tectonic plate graphic');}if(c.journeyId==='moon'&&c.index<=2){assert.ok((await visual.locator('.chapter-diagram-key').innerText()).includes(c.index===2?'halbe Scheibe hell':['Neumond','halbe Scheibe hell','Vollmond'][await choice.evaluate(e=>[...e.parentElement.children].indexOf(e))]),'phase drawing describes the actual chosen observer view');}}}
  assert.equal(await p.locator('.journey-chapter-link a').getAttribute('href'),'#'+CHAPTER_LINKS[c.journeyId][c.index]);
  if(c.index===0){await reveal(inquiry,'Dein Forschermerkzettel · freiwillig');await inquiry.locator('textarea').fill('Synthetischer Prüfmerkzettel für '+c.journeyId);await p.screenshot({path:path.join(shots,'journey-'+c.journeyId+'-390.png'),fullPage:true,animations:'disabled'});}
 }
 report.checks.push('All 80 chapters: 240 distinct levels, voluntary hints, individual wrong/correct feedback and all 64 existing interactive diagrams');
 await open(p,'water',3);await p.reload();await ready(p);await p.locator('[data-chapter-inquiry="water:3"]').waitFor();await p.evaluate(()=>location.hash='journeys/water');await p.locator('[data-chapter-inquiry="water:3"]').waitFor();
 await p.locator('.journey-levels button').nth(2).focus();await p.keyboard.press('Enter');assert.equal(await p.locator('.journey-levels button').nth(2).getAttribute('aria-pressed'),'true');
 await p.getByRole('button',{name:'Vorheriges Kapitel',exact:true}).click();await p.locator('[data-chapter-inquiry="water:2"]').waitFor();await p.goBack();await p.locator('[data-chapter-inquiry="water:3"]').waitFor();
 await p.locator('.journey-chapter-link a').click();await p.locator('.world-article').waitFor();await p.locator('.journey-topic-links a[href="#journeys/water/2"]').click();await p.locator('[data-chapter-inquiry="water:1"]').waitFor();
 for(const j of JOURNEYS){await p.evaluate(id=>location.hash='journeys/'+id+'/6',j.id);await p.getByRole('heading',{name:'Jetzt bist du der Forscher'}).waitFor();await p.locator('.chapter-card .quiz-answer').nth((j.question.correct+1)%3).click();assert.equal(await p.getByRole('button',{name:'Reisestempel sammeln',exact:true}).isEnabled(),false);assert.equal(await p.getByText(j.question.why,{exact:true}).count(),0);await p.locator('.chapter-card .quiz-answer').nth(j.question.correct).click();await p.getByRole('button',{name:'Reisestempel sammeln',exact:true}).click();await p.getByRole('button',{name:'Nächste Reise aussuchen',exact:true}).waitFor();}
 await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).progress.journeys.length===16,saveKey);await p.reload();await ready(p);
 const saved=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),saveKey);assert.equal(saved.progress.journeys.length,16);assert.equal(Object.keys(saved.progress.gameSessions).filter(id=>id.startsWith('journey:')).length,16);
 await context.close();report.checks.push('All 80 individual revised baseline texts, simple/deep reading levels, benefit and voluntary observation are actually displayed with readable open disclosures');report.checks.push('Legacy resume, deep chapter/back navigation, reciprocal knowledge links, all 16 unchanged final stamp gates and reload');
 for(const width of [320,360,390,768,1024,1440,1920]){
  const ctx=await browser.newContext({viewport:{width,height:width<768?844:1000},hasTouch:width<1024,reducedMotion:'reduce'}),page=await ctx.newPage();monitor(page);page.setDefaultTimeout(20000);await page.goto(base+'/#journeys/inside/1');await ready(page);
  for(const [id,index] of [['inside',0],['navigation',0],['water',2],['climate',4],['moon',1],['moon',2],['countries',3],...([0,1,2,3,4].map(i=>['ocean',i]))]){await open(page,id,index);if(id==='ocean'){await reveal(page,'Für Erwachsene: Quellen');for(const key of JOURNEYS.find(j=>j.id===id).steps[index].sourceIds){const source=JOURNEY_SOURCES[key],link=page.locator('.journey-source').filter({hasText:source.title});assert.equal(await link.getAttribute('href'),source.url);assert.ok(await link.isVisible());const box=await link.boundingBox();assert.ok(box.height>=44,'chapter source touch height '+width);}}await geometry(page,id+' '+width);const buttons=page.locator('.journey-levels button,.journey-task .quiz-answer,.chapter-actions button');for(const control of await buttons.all()){const box=await control.boundingBox();assert.ok(box.height>=44,'touch height');}await page.screenshot({path:path.join(shots,'journey-'+id+'-'+index+'-'+width+'.png'),fullPage:true,animations:'disabled'});}
  if([320,390,768,1440].includes(width)){await axe(page,'.journey-reader');await page.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));await geometry(page,'large text '+width);await page.locator('.journey-levels button').nth(1).focus();await page.screenshot({path:path.join(shots,'journey-large-focus-'+width+'.png'),fullPage:true,animations:'disabled'});}
  await page.evaluate(()=>location.hash='world/topic/science-water-cycle');await page.locator('.journey-topic-links').waitFor();
  const links=page.locator('.journey-topic-links'),waterLinks=links.locator('a[href^="#journeys/water/"]');assert.equal(await waterLinks.count(),4,'all four relevant water stations');
  const disclosure=links.locator('details[data-history-disclosure="journey-links-science-water-cycle-water"]');await disclosure.locator('summary').click();
  const target=links.locator('a[href="#journeys/water/5"]');await target.focus();await page.keyboard.press('Enter');await page.locator('[data-chapter-inquiry="water:4"]').waitFor();
  await page.goBack();await links.waitFor();await page.waitForFunction(()=>document.activeElement?.getAttribute('data-route-focus')==='topic-journey-science-water-cycle-water-4');assert.equal(await disclosure.evaluate(el=>el.open),true,'Back restores open stations');
  assert.equal(await links.locator('.connection-card p').filter({hasText:/Kapitel \d+:\s*$/}).count(),0,'every chapter link has a meaningful preview');
  const hrefs=await links.locator('a').evaluateAll(a=>a.map(el=>el.getAttribute('href')));assert.equal(new Set(hrefs).size,hrefs.length,'unique chapter destinations');
  for(const control of await links.locator('summary,a').all()){if(await control.isVisible()){const box=await control.boundingBox();assert.ok(box.height>=44,'chapter link touch height');assert.ok(box.x>=-2&&box.x+box.width<=width+2,'chapter links within viewport');}}
  await links.screenshot({path:path.join(shots,'journey-links-'+width+'.png'),animations:'disabled'});
  if([320,390].includes(width)){await axe(page,'.journey-topic-links');await page.reload();await ready(page);await links.waitFor();assert.equal(await disclosure.evaluate(el=>el.open),true,'Reload retains restored stations');}
  report.views.push({width,name:'journeys, open inquiries and large text'});await ctx.close();
 }
 report.checks.push('Seven journey viewport widths, readable diagrams and complete grouped article-to-chapter links; touch, Enter, Back focus, restored disclosures, reload, large text and WCAG axe');
 const broken=await browser.newContext({viewport:{width:390,height:844}}),retryPage=await broken.newPage();monitor(retryPage);let requests=0;const malformed=structuredClone(data);malformed.chapters[0].tasks[0].correct=99;await retryPage.route('**/journey-inquiries-*.json',async route=>{requests++;if(requests===1)await route.fulfill({json:malformed});else await route.continue();});
 await retryPage.goto(base+'/#journeys/water/3');await ready(retryPage);await retryPage.getByRole('button',{name:'Aufgaben erneut laden',exact:true}).waitFor();assert.equal(await retryPage.locator('.journey-inquiry').count(),0);assert.ok((await retryPage.locator('.chapter-text').innerText()).includes('Kondensation'));await retryPage.getByRole('button',{name:'Aufgaben erneut laden',exact:true}).click();await retryPage.locator('[data-chapter-inquiry="water:2"]').waitFor();assert.equal(requests,2);await broken.close();report.checks.push('Malformed chapter payload fails closed while the old reading text remains; explicit retry loads valid tasks once');

 const searchContext=await browser.newContext({viewport:{width:390,height:844}}),searchPage=await searchContext.newPage();monitor(searchPage);await searchPage.goto(base+'/#journeys');await ready(searchPage);
 for(const j of JOURNEYS)for(let index=0;index<5;index++){const c=j.steps[index];await searchPage.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await searchPage.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(c.title);const result=searchPage.getByRole('option').filter({hasText:c.title+' · '+j.title});await result.first().click();await searchPage.locator('[data-chapter-inquiry="'+j.id+':'+index+'"]').waitFor();assert.ok((await searchPage.locator('.chapter-text').innerText()).includes(c.text.slice(0,30)));}
 await searchContext.close();report.checks.push('All80 chapter search results reach their exact stable chapter, including a previously different saved resume');
 const contentBroken=await browser.newContext({viewport:{width:320,height:844}}),contentPage=await contentBroken.newPage();monitor(contentPage);let contentRequests=0;const malformedContent=structuredClone({schemaVersion:1,journeys:JOURNEYS});delete malformedContent.journeys[0].steps[0].deeper;
 await contentPage.route('**/journey-content-*.json',async route=>{contentRequests++;if(contentRequests===1)await route.fulfill({json:malformedContent});else await route.continue();});
 await contentPage.goto(base+'/#journeys/water/3');await ready(contentPage);await contentPage.getByRole('button',{name:'Kapiteltext erneut laden',exact:true}).waitFor();assert.equal(await contentPage.getByText(JOURNEYS.find(j=>j.id==='water').steps[2].deeper,{exact:true}).count(),0);await contentPage.getByRole('button',{name:'Kapiteltext erneut laden',exact:true}).click();await contentPage.getByText(JOURNEYS.find(j=>j.id==='water').steps[2].whyItMatters,{exact:true}).waitFor();assert.equal(contentRequests,2);await contentBroken.close();report.checks.push('Invalid full chapter set is withheld; safe compact preview and pass survive, explicit retry recovers current complete content');
 for(const damage of ['unsafe','partial-words','partial-why']){
  const bookBroken=await browser.newContext({viewport:{width:390,height:844}}),bookPage=await bookBroken.newPage();monitor(bookPage);let bookRequests=0;const invalidBook=structuredClone({schemaVersion:book.schemaVersion,words:book.words,why:book.why});
  if(damage==='unsafe')invalidBook.words[0][2]='<bad>';else if(damage==='partial-words')invalidBook.words.shift();else invalidBook.why.pop();
  await bookPage.route('**/book-core-*.json',async route=>{bookRequests++;if(bookRequests===1)await route.fulfill({json:invalidBook});else await route.continue();});
  await bookPage.goto(base+'/#book');await ready(bookPage);await bookPage.getByRole('button',{name:'Wissensbuch erneut laden',exact:true}).waitFor();assert.equal(await bookPage.locator('.word-card').count(),0);await bookPage.getByRole('button',{name:'Wissensbuch erneut laden',exact:true}).click();await bookPage.locator('.word-card').first().waitFor();assert.equal(bookRequests,2);await bookBroken.close();
 }
 report.checks.push('Unsafe or well-formed partial word/why payloads show no unvalidated book; explicit retry retrieves the complete book without caching missing entries');
 if(nativeBrowser.includeBook!==false)await bookExcellenceFlow(browser,base,ready,monitor,report,shots);
 await nativeJourneyZoom(nativeBrowser.chromium,nativeBrowser.options,base,report,shots,{includeBook:nativeBrowser.includeBook!==false});
}
export async function prepareOfflineJourneys(p){await open(p,'water',2);const inquiry=p.locator('.journey-inquiry');await inquiry.locator('.journey-levels button').nth(2).click();await reveal(inquiry,'Dein Forschermerkzettel · freiwillig');await inquiry.locator('textarea').fill('Offline-Sicherung: Wasser kann seinen Zustand ändern.');await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['journey:water']['chapter:2:note']==='Offline-Sicherung: Wasser kann seinen Zustand ändern.',saveKey);}
// Run the changed learning controls first, also in the existing real-engine path.
// This is a targeted part of the existing journey suite, never a replacement.
export async function journeySupportView(p,{widths,shots,engine}){
 const initialRoute=await p.evaluate(()=>location.hash),started=performance.now(),hints=[],diagrams=[],wasLarge=await p.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading'));
 try{
  await p.setViewportSize({width:390,height:844});
  for(const c of data.chapters){
   await open(p,c.journeyId,c.index);
   const inquiry=p.locator('[data-chapter-inquiry="'+c.id+'"]');
   for(const [level,q] of c.tasks.entries()){
    await inquiry.locator('.journey-levels button').nth(level).click();
    const summary=inquiry.locator('.journey-task summary'),details=summary.locator('..');
    if(await details.evaluate(e=>e.open))await summary.click();
    assert.equal(await inquiry.getByText(q.hint,{exact:true}).isVisible(),false,'hint stays voluntary');
    await summary.focus();await p.keyboard.press('Enter');
    await inquiry.getByText(q.hint,{exact:true}).waitFor();
    assert.equal(await inquiry.getByText(q.why,{exact:true}).count(),0,'opening a hint does not disclose the answer explanation');
    await summary.click();hints.push(c.id+':'+level);
   }
  }
  for(const width of widths){
   await p.setViewportSize({width,height:900});
   await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));
   for(const c of data.chapters.filter(c=>c.index>0)){
    await open(p,c.journeyId,c.index);
    const visual=p.locator('[data-chapter-visual="'+c.id+'"]');await visual.waitFor();
    await geometry(p,c.id+' diagram '+width);
    assert.ok(await visual.locator('svg').getAttribute('aria-label'),'original image description remains');
    assert.equal(await visual.locator('svg text').evaluateAll(nodes=>nodes.filter(n=>!/^\d+$/.test(n.textContent.trim())).length),0,'words are readable HTML instead of scaled SVG text');
    const choices=await visual.locator('.visual-choice button').all();
    for(const [selected,choice] of choices.entries()){
     await choice.click();assert.equal(await choice.getAttribute('aria-pressed'),'true');
     const labels=await visual.locator('.chapter-diagram-key span').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:e.textContent,size:parseFloat(s.fontSize),left:r.left,right:r.right};}));
     assert.ok(labels.every(l=>l.text&&l.size>=16&&l.left>=-2&&l.right<=width+2),'readable unclipped HTML labels');
     if(c.id==='countries:3'){
      await visual.locator('.chapter-diagram-key').getByText(['Gemeinsame Landgrenze','Meer','Fluss über die Grenze'][selected],{exact:true}).waitFor();
      assert.equal(await visual.getByText('Feste äußere Hülle',{exact:true}).count(),0,'political borders do not show tectonic plates');
     }
     if(c.journeyId==='moon'&&c.index<=2){
      const phase=c.index===2?1:selected;
      await visual.locator('.chapter-diagram-key').getByText('Von der Erde: '+['Neumond','halbe Scheibe hell','Vollmond'][phase],{exact:true}).waitFor();
      assert.equal(await visual.locator('svg circle[fill="#f1cb82"]').count(),phase===2?1:0,'only full moon has a full illuminated disk');
      assert.equal(await visual.locator('svg path[fill="#f1cb82"]').count(),phase===1?1:0,'quarter view has exactly one illuminated half');
     }
     const box=await choice.boundingBox();assert.ok(box.height>=44,'diagram touch target');
    }
    await choices[0].focus();await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');assert.ok(await choices[0].evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')),'visible keyboard focus');
    if([320,1440].includes(width)&&['moon:1','moon:2','water:2','inside:2','countries:3'].includes(c.id))await visual.screenshot({path:path.join(shots,'journey-engine-'+engine+'-support'+'-'+c.id.replace(':','-')+'-'+width+'.png'),animations:'disabled'});
    if([320,1440].includes(width)&&['ocean:4','landscapes:1','water:2'].includes(c.id)){
     const level=c.id==='water:2'?2:0,inquiry=p.locator('.journey-inquiry');await inquiry.locator('.journey-levels button').nth(level).click();
     const summary=inquiry.locator('.journey-task summary');if(!await summary.evaluate(e=>e.parentElement.open))await summary.click();
     await inquiry.getByText(c.tasks[level].hint,{exact:true}).waitFor();await geometry(p,c.id+' open hint '+width);
     await inquiry.locator('.journey-task').screenshot({path:path.join(shots,'journey-engine-'+engine+'-support-hint-'+c.id.replace(':','-')+'-'+width+'.png'),animations:'disabled'});await summary.click();
    }
    diagrams.push({id:c.id,width,states:choices.length,readable:true,largeText:true,keyboard:true});
   }
   await axe(p,'.journey-reader');
  }
  assert.equal(hints.length,240);assert.equal(new Set(hints).size,240);
  assert.equal(diagrams.length,64*widths.length);assert.equal(new Set(diagrams.map(d=>d.id+':'+d.width)).size,diagrams.length);
  return {hints,diagrams,widths,seconds:(performance.now()-started)/1000};
 }catch(error){await p.screenshot({path:path.join(shots,'journey-engine-'+engine+'-support'+'-failure.png'),fullPage:true}).catch(()=>{});throw error;}finally{if(!wasLarge)await p.evaluate(()=>document.querySelector('.earth-app')?.classList.remove('large-reading'));await p.setViewportSize({width:390,height:844});await p.evaluate(hash=>location.hash=hash,initialRoute);if(initialRoute==='#journeys')await p.locator('.journey-filters input').waitFor();}
}
export async function offlineJourneys(p,report){await open(p,'water',2);await p.getByText(JOURNEYS.find(j=>j.id==='water').steps[2].whyItMatters,{exact:true}).waitFor();await reveal(p.locator('.journey-inquiry'),'Dein Forschermerkzettel · freiwillig');assert.equal(await p.locator('.journey-inquiry textarea').inputValue(),'Offline-Sicherung: Wasser kann seinen Zustand ändern.');assert.equal(await p.locator('.journey-levels button').nth(2).getAttribute('aria-pressed'),'true');for(const j of JOURNEYS)for(let i=0;i<5;i++){await open(p,j.id,i);await p.getByText(j.steps[i].whyItMatters,{exact:true}).waitFor();await reveal(p,'Noch genauer · etwa 12–14 Jahre');await p.getByText(j.steps[i].deeper,{exact:true}).waitFor();assert.equal(await p.locator('.journey-task .quiz-answer').count(),3);}await p.evaluate(()=>location.hash='world/topic/science-water-cycle');await p.locator('.journey-topic-links').waitFor();const disclosure=p.locator('details[data-history-disclosure="journey-links-science-water-cycle-water"]');await disclosure.locator('summary').click();await p.locator('.journey-topic-links a[href="#journeys/water/5"]').click();await p.locator('[data-chapter-inquiry="water:4"]').waitFor();report.checks.push('Cold restart without server: complete reciprocal chapter links and all 16 journey inquiries and private notebook/level restore from the same schema-3 pass');}
