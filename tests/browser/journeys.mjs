import {journeySourceView} from './journey-sources.mjs';
export {journeySourceView} from './journey-sources.mjs';
import {nativeJourneyZoom} from './journey-zoom.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import JOURNEYS from '../../exports/content/journeys.json' with {type:'json'};
import {CHAPTER_LINKS} from '../../app/journey-links.ts';
import data from '../../app/journey-inquiries.json' with {type:'json'};
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
export async function assertJourneyDiagram(visual,id,selected){
 await assertWaterWeatherDiagram(visual,id,selected);
 await assertSeasonsOceanDiagram(visual,id,selected);
 if(['inside:3','planet:3','planet:4'].includes(id)){
  // React must paint the selected scene before SVG measurements are taken.
  await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
  const arrows=await visual.locator('svg path[marker-end]').evaluateAll(paths=>paths.map(path=>{const start=path.getPointAtLength(0),end=path.getPointAtLength(path.getTotalLength());return {x:start.x,y:start.y,dx:end.x-start.x,dy:end.y-start.y};}));
  assert.equal(arrows.length,2,'both indicated motions have their own arrowhead: '+id);
  if(id==='inside:3'){
   if(selected===2){assert.ok(arrows.every(a=>Math.abs(a.dx)<1));assert.ok(arrows[0].dy*arrows[1].dy<0,'past arrows are parallel and opposite');await visual.getByText('Blick von oben: seitlich aneinander vorbei',{exact:true}).waitFor();}
   else{arrows.sort((a,b)=>a.x-b.x);assert.ok(selected===0?arrows[0].dx<0&&arrows[1].dx>0:arrows[0].dx>0&&arrows[1].dx<0,'apart and together differ in their actual directions');}
  }
  if(id==='planet:3'){arrows.sort((a,b)=>a.x-b.x);assert.ok(arrows[0].dx>0&&arrows[1].dx<0,'gravity points inward from both sides');}
 }
 if(id==='inside:1'){
  const fields=await visual.locator('svg rect').evaluateAll(es=>es.map(e=>({width:e.getAttribute('width'),height:e.getAttribute('height')})));
  assert.equal(fields.length,3);assert.equal(new Set(fields.map(f=>f.width+':'+f.height)).size,1,'solid/liquid state comparison has no invented quantity scale');
  await visual.getByText(/keine Schichtdicken, Mengen oder Temperaturen/).waitFor();
 }
 if(id==='inside:2'){
  const layers=await visual.locator('svg rect').evaluateAll(es=>es.map(e=>({y:Number(e.getAttribute('y')),h:Number(e.getAttribute('height')),fill:e.getAttribute('fill')})));
  const outline=layers.find(e=>e.fill==='none'),bands=layers.filter(e=>e!==outline&&e.y<outline.y+outline.h);
  assert.equal(bands.length,2,'plate contains both crust and uppermost mantle');assert.equal(bands[0].y,outline.y);assert.equal(bands[0].y+bands[0].h,bands[1].y);assert.equal(bands[1].y+bands[1].h,outline.y+outline.h);
  await visual.getByText(/Eine Platte umfasst Kruste und starren obersten Mantel/).waitFor();
 }
}
async function axe(p,selector){await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});const violations=await p.evaluate(async selector=>(await window.axe.run(selector,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),selector);assert.deepEqual(violations,[],'journey accessibility');}
export async function journeysFlow(browser,base,ready,monitor,report,shots,nativeBrowser){
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',acceptDownloads:true}),p=await context.newPage();monitor(p);p.setDefaultTimeout(20000);
 await p.goto(base+'/#journeys');await ready(p);await p.locator('.journey-tile').first().waitFor();assert.equal(await p.locator('.journey-tile').count(),16);
 report.journeySupport=await journeySupportView(p,{widths:[320,360,390,768,1024,1440,1920],shots,engine:'chromium'});
 await p.locator('.journey-filters input').fill('Wolken');assert.ok(await p.locator('.journey-tile').count()<16);await p.locator('.journey-filters input').fill('');
 for(const c of data.chapters){
  await open(p,c.journeyId,c.index);await geometry(p,c.id);const inquiry=p.locator('[data-chapter-inquiry="'+c.id+'"]');
  assert.ok((await p.locator('.journey-mission').innerText()).includes(c.goal));
  for(let level=0;level<3;level++){
   const q=c.tasks[level];await inquiry.locator('.journey-levels button').nth(level).click();await inquiry.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
   const hint=inquiry.locator('.journey-task summary');if(await hint.evaluate(el=>el.parentElement.open))await hint.click();await hint.click();await inquiry.getByText(q.hint,{exact:true}).waitFor();
   await inquiry.locator('.quiz-answer').nth((q.correct+1)%3).click();await inquiry.getByText('Lass uns den Gedanken prüfen',{exact:true}).waitFor();assert.equal(await inquiry.getByText(q.why,{exact:true}).count(),0);
   await inquiry.locator('.quiz-answer').nth(q.correct).click();await inquiry.getByText(q.why,{exact:true}).waitFor();
  }
  if(c.index>0){const visual=p.locator('[data-chapter-visual="'+c.id+'"]');await visual.waitFor();for(const choice of await visual.locator('button').all()){await choice.click();assert.equal(await choice.getAttribute('aria-pressed'),'true');}}
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
 await context.close();report.checks.push('Legacy resume, deep chapter/back navigation, reciprocal knowledge links, all 16 unchanged final stamp gates and reload');
 for(const width of [320,360,390,768,1024,1440,1920]){
  const ctx=await browser.newContext({viewport:{width,height:width<768?844:1000},hasTouch:width<1024,reducedMotion:'reduce'}),page=await ctx.newPage();monitor(page);page.setDefaultTimeout(20000);await page.goto(base+'/#journeys/inside/1');await ready(page);
  for(const [id,index] of [['inside',0],['navigation',0],['water',2],['climate',4]]){await open(page,id,index);await geometry(page,id+' '+width);const buttons=page.locator('.journey-levels button,.journey-task .quiz-answer,.chapter-actions button');for(const control of await buttons.all()){const box=await control.boundingBox();assert.ok(box.height>=44,'touch height');}await page.screenshot({path:path.join(shots,'journey-'+id+'-'+index+'-'+width+'.png'),fullPage:true,animations:'disabled'});}
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
 await nativeJourneyZoom(nativeBrowser.chromium,nativeBrowser.options,base,report,shots);
}
export async function prepareOfflineJourneys(p){await open(p,'water',2);const inquiry=p.locator('.journey-inquiry');await inquiry.locator('.journey-levels button').nth(2).click();await reveal(inquiry,'Dein Forschermerkzettel · freiwillig');await inquiry.locator('textarea').fill('Offline-Sicherung: Wasser kann seinen Zustand ändern.');await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['journey:water']['chapter:2:note']==='Offline-Sicherung: Wasser kann seinen Zustand ändern.',saveKey);}

// Run the changed learning controls first, also in the existing real-engine path.
// This is a targeted part of the existing journey suite, never a replacement.
export async function journeySupportView(p,{widths,shots,engine}){
 const initialRoute=await p.evaluate(()=>location.hash),started=performance.now(),hints=[],diagrams=[],wasLarge=await p.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading'));
 try{
  const sources=await journeySourceView(p,{widths,shots,engine});
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
     await assertJourneyDiagram(visual,c.id,selected);
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
  return {hints,diagrams,sources,widths,seconds:(performance.now()-started)/1000};
 }catch(error){await p.screenshot({path:path.join(shots,'journey-engine-'+engine+'-support'+'-failure.png'),fullPage:true}).catch(()=>{});throw error;}finally{if(!wasLarge)await p.evaluate(()=>document.querySelector('.earth-app')?.classList.remove('large-reading'));await p.setViewportSize({width:390,height:844});await p.evaluate(hash=>location.hash=hash,initialRoute);if(initialRoute==='#journeys')await p.locator('.journey-filters input').waitFor();}
}
export async function offlineJourneys(p,report){await open(p,'water',2);await reveal(p.locator('.journey-inquiry'),'Dein Forschermerkzettel · freiwillig');assert.equal(await p.locator('.journey-inquiry textarea').inputValue(),'Offline-Sicherung: Wasser kann seinen Zustand ändern.');assert.equal(await p.locator('.journey-levels button').nth(2).getAttribute('aria-pressed'),'true');for(const j of JOURNEYS){await open(p,j.id,4);assert.equal(await p.locator('.journey-task .quiz-answer').count(),3);}await p.evaluate(()=>location.hash='world/topic/science-water-cycle');await p.locator('.journey-topic-links').waitFor();const disclosure=p.locator('details[data-history-disclosure="journey-links-science-water-cycle-water"]');await disclosure.locator('summary').click();await p.locator('.journey-topic-links a[href="#journeys/water/5"]').click();await p.locator('[data-chapter-inquiry="water:4"]').waitFor();report.checks.push('Cold restart without server: complete reciprocal chapter links and all 16 journey inquiries and private notebook/level restore from the same schema-3 pass');}

export async function assertWaterWeatherDiagram(visual,id,selected){
 if(!['water:1','water:2','water:3','water:4','weather:1','weather:2','weather:3','weather:4'].includes(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 const vectors=await visual.locator('svg path[marker-end]').evaluateAll(paths=>paths.map(path=>{const a=path.getPointAtLength(0),b=path.getPointAtLength(path.getTotalLength());return {x:a.x,y:a.y,endY:b.y,dx:b.x-a.x,dy:b.y-a.y};}));
 if(['water:1','water:2'].includes(id)){assert.ok(vectors.some(v=>v.dx===0&&v.dy<0),'water vapour path has an upward arrowhead');assert.ok(vectors.some(v=>v.dx===0&&v.dy>0),'returning water path has a separate downward arrowhead');}
 if(id==='water:3'){
  const regions=await visual.locator('svg rect').evaluateAll(es=>es.map(e=>({y:Number(e.getAttribute('y')),h:Number(e.getAttribute('height'))})));assert.equal(regions.length,2,'soil and groundwater have separate displayed regions');
  const grains=await visual.locator('svg circle').evaluateAll(es=>es.map(e=>Number(e.getAttribute('cy'))));for(const r of regions)assert.ok(grains.some(y=>y>r.y&&y<r.y+r.h),'solid grains occur within both soil and groundwater regions');
  assert.ok(vectors.some(v=>v.endY>regions[1].y&&v.dy>0),'a possible infiltration route actually enters groundwater');await visual.getByText(/Kein unterirdischer See/).waitFor();
 }
 if(id==='water:4'){
  const fields=await visual.locator('svg rect').evaluateAll(es=>es.map(e=>e.getAttribute('width')+':'+e.getAttribute('height')));assert.equal(fields.length,3);assert.equal(new Set(fields).size,1,'protection action is not an invented measured water volume');await visual.getByText(/keine Wassermengen/).waitFor();
 }
 if(id==='weather:1'){
  assert.equal(vectors.length,4,'each of the four circulation directions has its own arrowhead');const vertical=vectors.filter(v=>v.dx===0).sort((a,b)=>a.x-b.x),horizontal=vectors.filter(v=>v.dy===0).sort((a,b)=>a.y-b.y);assert.equal(vertical.length,2);assert.equal(horizontal.length,2);assert.ok(vertical[0].dy<0&&vertical[1].dy>0,'daytime sea-breeze example rises over warmer land and descends over cooler water');assert.ok(horizontal[0].dx>0&&horizontal[1].dx<0,'return above is opposite to surface flow');
  const groundTop=await visual.locator('svg rect').evaluateAll(es=>Math.min(...es.map(e=>Number(e.getAttribute('y')))));assert.ok(vectors.every(v=>v.y<groundTop&&v.endY<groundTop),'air arrows stay above the ground');await visual.getByText(/Nicht jeder Wind bildet diesen Kreislauf/).waitFor();
 }
 if(id==='weather:2'){
  if(selected===0)assert.ok(await visual.locator('svg path').evaluateAll(es=>es.some(e=>e.getAttribute('d')?.endsWith('Z')&&getComputedStyle(e).fill!=='none')),'cumulus has a filled rounded body');
  if(selected===1){assert.ok(await visual.locator('svg g[fill="none"] path').count()>1,'cirrus is shown as separate unfilled wisps');assert.equal(await visual.locator('svg rect').count(),0,'cirrus does not reuse the solid sheet');}
  if(selected===2)assert.ok(await visual.locator('svg rect').evaluateAll(es=>es.some(e=>Number(e.getAttribute('width'))>8*Number(e.getAttribute('height')))),'stratus is a broad flat sheet');
 }
 if(id==='weather:3')await visual.getByText(/ohne Zeitmaßstab/).waitFor();
 if(id==='weather:4'&&selected===2)await visual.getByText('Neue Messungen können helfen, eine Vorhersage zu überarbeiten. Sie bleibt unsicher.',{exact:true}).waitFor();
}

export async function assertSeasonsOceanDiagram(visual,id,selected){
 if(!['seasons:1','seasons:2','seasons:3','seasons:4','ocean:1','ocean:2','ocean:3','ocean:4'].includes(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 const vectors=await visual.locator('svg path[marker-end]').evaluateAll(paths=>paths.map(path=>{const a=path.getPointAtLength(0),b=path.getPointAtLength(path.getTotalLength());return {x:a.x,y:a.y,dx:b.x-a.x,dy:b.y-a.y};}));
 if(['seasons:1','seasons:2'].includes(id)){
  assert.equal(vectors.length,3,'all three depicted incoming rays have arrowheads');assert.ok(vectors.every(v=>v.dx>0&&v.dy===0),'sunlight reaches the Earth from the depicted Sun');
  const rotation=await visual.locator('svg g[transform^="rotate("]').getAttribute('transform');assert.ok(id==='seasons:1'?rotation.startsWith('rotate(-'):!rotation.startsWith('rotate(-'),'northern pole faces toward the Sun in June and away in December in these two different views');await visual.getByText(/verschiedenen Blickrichtungen|anderen Richtung/).waitFor();
 }
 if(id==='seasons:3')await visual.getByText(/erscheint nur in dieser Blickrichtung gerade; sie bleibt um etwa 23,4 Grad/).waitFor();
 if(id==='seasons:4'){
  assert.equal(vectors.length,2,'rotation and revolution each retain a separate arrowhead');const axis=await visual.locator('svg path:not([marker-end])').evaluateAll(es=>es.some(e=>{const a=e.getPointAtLength(0),b=e.getPointAtLength(e.getTotalLength());return a.x<98&&b.x>98&&a.y<82&&b.y>150;}));assert.ok(axis,'the seasons orbit drawing actually includes the tilted rotation axis');await visual.getByText(/keinen maßstäblichen Winkel/).waitFor();
 }
 if(id==='ocean:1'){
  assert.equal(vectors.length,2,'river transport and evaporation each have their own arrowhead');assert.ok(vectors.some(v=>v.dx>0&&v.dy>0),'river transport reaches the sea');assert.ok(vectors.some(v=>v.dx===0&&v.dy<0),'water evaporation points upward separately');await visual.getByText(/keine sichtbaren Salzkörner/).waitFor();await visual.getByText(/Salz zurücklässt/).waitFor();
 }
 if(id==='ocean:2'){
  const labels=await visual.locator('.chapter-diagram-key span').allTextContents();for(const label of ['1 · Lebendes Korallentier','2 · Kleine Algen im Gewebe','3 · Kalkskelett unter dem Tier','4 · Anderes Rifftier'])assert.ok(labels.includes(label),'own readable labelled polyp/skeleton/partners/other animal '+label);
  const pointers=await visual.locator('svg text').allTextContents();assert.deepEqual(pointers,['1','2','3','4'],'all four actual depicted parts have matching readable pointers');
  const algae=await visual.locator('svg circle').evaluateAll(es=>es.filter(e=>Number(e.getAttribute('r'))===9).map(e=>({x:Number(e.getAttribute('cx')),y:Number(e.getAttribute('cy'))})));assert.equal(algae.length,4);assert.ok(algae.every(a=>a.x>116&&a.x<225&&a.y>94&&a.y<184),'algal partners are depicted within polyp tissue');await visual.getByText(/Vergrößertes Beispiel eines Steinkorallen-Polypen/).waitFor();await visual.getByText(/nicht alle Korallenarten/).waitFor();
 }
 if(id==='ocean:3')await visual.getByText(/kein maßstabsgetreues Tiefenprofil/).waitFor();
 if(id==='ocean:4'){assert.equal(vectors.length,2,'both independently depicted current directions have arrowheads');assert.ok(vectors[0].dx*vectors[1].dx<0,'the two selected schematic flow directions are opposed');await visual.getByText(/keine vollständige Karte der Meeresströmungen/).waitFor();}
}
