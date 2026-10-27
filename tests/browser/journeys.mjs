import {bookMeasurementView,bookMeasurementNetworkView} from './book-measurements.mjs';
import {browserErrorArrays,BROWSER_ERROR_FIELDS,monitorBrowserErrors} from '../../scripts/browser-errors.mjs';
import {journeyContentFlow} from './journey-content.mjs';
import {journeyReadingFlow} from './journey-reading.mjs';
import {journeyInquiryLoadFlow} from './journey-inquiry-loader.mjs';
import {journeyTransferFlow} from './journey-transfer.mjs';
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
 await assertLandscapeClimateDiagram(visual,id,selected);
 await assertMoonNavigationDiagram(visual,id);
 await assertVolcanoesQuakesDiagram(visual,id);
 await assertWaterWeatherDiagram(visual,id,selected);
 await assertSeasonsOceanDiagram(visual,id,selected);
 await assertNatureProtectDiagram(visual,id,selected);
 await assertContinentsCountriesDiagram(visual,id);
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
export async function assertLandscapeClimateDiagram(visual,id,selected){
 if(!/^(landscapes|climate):[1-4]$/.test(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 if(id==='landscapes:1'){
  assert.equal(await visual.locator('[data-river-process]').count(),3);
  const d=await visual.locator('[data-river-direction]').evaluate(e=>{const a=e.getPointAtLength(0),b=e.getPointAtLength(e.getTotalLength());return {dx:b.x-a.x,dy:b.y-a.y};});
  assert.ok(d.dx>0&&d.dy>0,'transport follows the drawn downhill river');
  assert.equal(await visual.locator('[data-river-process="'+selected+'"] circle').getAttribute('stroke-width'),'5');
 }
 if(id==='landscapes:2'){
  assert.match(await visual.locator('[data-lake-optional-outflow]').getAttribute('stroke-dasharray'),/\d/,'optional outlet is visibly distinct from the inlet');
  assert.equal(await visual.locator('[data-lake-inflow]').getAttribute('stroke-dasharray'),null);
  const outlet=await visual.locator('svg').evaluate(svg=>{const water=svg.querySelector('[data-lake-water]'),flow=svg.querySelector('[data-lake-optional-outflow]'),surface=water.getPointAtLength(0),start=flow.getPointAtLength(0),end=flow.getPointAtLength(flow.getTotalLength()),box=water.getBBox();return {surfaceY:surface.y,startX:start.x,startY:start.y,endX:end.x,endY:end.y,waterLeft:box.x,waterRight:box.x+box.width};});
  assert.ok(outlet.startX>=outlet.waterLeft&&outlet.startX<=outlet.waterRight&&Math.abs(outlet.startY-outlet.surfaceY)<.01,'possible surface outlet starts at the actual drawn lake surface');
  assert.ok(outlet.endX>outlet.startX&&outlet.endY>=outlet.startY,'unpowered lake outlet never climbs uphill in the drawn cross-section');
  const water=await visual.locator('[data-lake-water]').evaluate(e=>{const b=e.getBBox();return {width:b.width,height:b.height};});assert.ok(water.width>water.height&&water.height>0,'water occupies a basin rather than a flat ocean strip');
 }
 if(id==='landscapes:3'){
  const examples=await visual.locator('[data-desert-example]').evaluateAll(es=>es.map(e=>({w:e.getAttribute('width'),h:e.getAttribute('height')})));
  assert.equal(examples.length,2);assert.deepEqual(examples[0],examples[1],'example size is not an invented desert-area comparison');
  assert.equal(await visual.locator('[data-desert-inland-ice]').count(),1);
 }
 if(id==='landscapes:4'){
  const b=await visual.locator('svg').evaluate(svg=>{const box=s=>{const b=svg.querySelector(s).getBBox();return {x:b.x,y:b.y,width:b.width,height:b.height};};return {land:box('[data-glacier-land]'),ice:box('[data-glacier-ice]'),berg:box('[data-glacier-iceberg]'),water:box('[data-glacier-water]')};});
  assert.ok(b.ice.x+b.ice.width<=b.water.x,'glacier lies on the land side');
  assert.ok(b.berg.x>b.water.x&&b.berg.x>b.ice.x+b.ice.width,'iceberg is separated from the land glacier');
  assert.ok(b.berg.y<b.water.y&&b.berg.y+b.berg.height>b.water.y,'floating iceberg crosses the water surface');
  assert.equal(await visual.locator('[data-glacier-debris]').count(),4);
 }
 if(id==='climate:1'){
  const beams=await visual.locator('[data-sunlight-ray]').evaluateAll(es=>es.map(e=>{const a=e.getPointAtLength(0),b=e.getPointAtLength(e.getTotalLength());return {kind:e.dataset.sunlightRay,x:a.x,y:a.y,dx:b.x-a.x,dy:b.y-a.y};}));
  const steep=beams.filter(b=>b.kind==='steep'),flat=beams.filter(b=>b.kind==='shallow');assert.equal(steep.length,3);assert.equal(flat.length,3);
  const width=rows=>{const a=rows[0],b=rows.at(-1);return Math.abs((b.x-a.x)*a.dy-(b.y-a.y)*a.dx)/Math.hypot(a.dx,a.dy);};
  assert.ok(Math.abs(width(steep)-width(flat))<.01,'both actual bundles have the same width perpendicular to their rays');
  const spans=await visual.locator('[data-sunlight-footprint]').evaluateAll(es=>es.map(e=>e.getTotalLength()));assert.ok(Math.abs(spans[1]/spans[0]-2)<.001,'shallow equal bundle covers twice the ground in this deliberately chosen model');
 }
 if(id==='climate:2'){
  const examples=await visual.locator('[data-climate-rain-example]').evaluateAll(es=>es.map(e=>[...e.querySelectorAll('[data-model-month]')].map(b=>Number(b.getAttribute('height')))));
  assert.equal(examples.length,2);assert.ok(examples.every(e=>e.length===12));assert.equal(examples[0].reduce((a,b)=>a+b),examples[1].reduce((a,b)=>a+b),'same yearly amount');
  assert.equal(new Set(examples[0]).size,1);assert.ok(new Set(examples[1]).size>1,'different actual monthly distribution despite the same yearly amount');
 }
 if(id==='climate:3'){
  assert.equal(await visual.locator('[data-climate-forest-tree]').count(),3);assert.equal(await visual.locator('[data-climate-low-growth]').count(),4);
  const height=selector=>visual.locator(selector).first().evaluate(e=>e.getBoundingClientRect().height);assert.ok(await height('[data-climate-forest-tree]')>await height('[data-climate-low-growth]'),'tundra growth is actually drawn lower');
 }
 if(id==='climate:4'){
  assert.equal(await visual.locator('[data-habitat-species]').count(),1);assert.equal(await visual.locator('[data-habitat-need]').count(),3);assert.equal(await visual.locator('[data-habitat-connection]').count(),3);
  assert.equal(await visual.locator('[data-habitat-connection="'+selected+'"]').getAttribute('stroke-width'),'7');assert.equal(await visual.locator('svg path[marker-end]').count(),0,'needs are not depicted as a compulsory chronological sequence');
 }
}
export async function assertVolcanoesQuakesDiagram(visual,id){
 if(!['volcanoes:1','volcanoes:2','volcanoes:4','quakes:2','quakes:3','quakes:4'].includes(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 if(id==='volcanoes:1'){assert.equal(await visual.locator('svg [data-volcano-path]').count(),3);const conduit=await visual.locator('[data-volcano-path="conduit"]').getAttribute('d');assert.equal((conduit.match(/M/g)||[]).length,3,'actual branched example, not a single universal pipe');await visual.getByText(/kein Maßstab/).waitFor();}
 if(id==='volcanoes:2'||id==='volcanoes:4'){const selector=id==='volcanoes:2'?'[data-eruption-example]':'[data-volcano-monitor]';const boxes=await visual.locator(selector).evaluateAll(es=>es.map(e=>({width:e.getBBox().width,height:e.getBBox().height})));assert.equal(boxes.length,id==='volcanoes:2'?2:3);assert.equal(new Set(boxes.map(b=>b.width+':'+b.height)).size,1,'qualitative examples do not imply measured amounts');await visual.getByText(id==='volcanoes:2'?/Auch fließende Lava und Gase können gefährlich sein|Zähigkeit und Gasgehalt/:/keine zeitliche Schrittfolge/).waitFor();}
 if(id==='quakes:2'){const starts=await visual.locator('[data-seismic-arrival]').evaluateAll(es=>es.map(e=>e.getPointAtLength(0).x));assert.equal(starts.length,2);assert.ok(starts[1]>starts[0],'two distinct actual arrival positions on time axis');const axis=await visual.locator('[data-seismic-time-axis]').evaluate(e=>e.getPointAtLength(e.getTotalLength()).x-e.getPointAtLength(0).x);assert.ok(axis>0,'time axis actually points to the right');assert.equal(await visual.locator('[data-wave-front]').count(),3);await visual.getByText(/erfundene Messkurve/).first().waitFor();}
 if(id==='quakes:3'){assert.equal(await visual.locator('[data-quake-event]').count(),1);assert.equal(await visual.locator('[data-quake-observation]').count(),2);assert.equal(await visual.locator('[data-event-observation-link][marker-end]').count(),2);await visual.getByText(/keine Vergleichsbalken/).waitFor();}
 if(id==='quakes:4'){assert.equal(await visual.locator('[data-tsunami-stage]').count(),3);const water=await visual.locator('[data-tsunami-water]').evaluateAll(es=>es.map(e=>e.getAttribute('d')));assert.equal(new Set(water).size,3,'actual water geometry changes with bottom movement and propagation');const directions=await visual.locator('[data-tsunami-direction]').evaluateAll(es=>es.map(e=>e.getPointAtLength(e.getTotalLength()).x-e.getPointAtLength(0).x));assert.equal(directions.length,2);assert.ok(directions[0]<0&&directions[1]>0,'independent outward propagation arrows');await visual.getByText(/keine gleichen Zeitabstände/).waitFor();}
}
export async function assertMoonNavigationDiagram(visual,id){
 if(!['moon:3','moon:4','navigation:1','navigation:2','navigation:3','navigation:4'].includes(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 if(id==='moon:3'){const earth=visual.locator('[data-force-example="earth"]'),moon=visual.locator('[data-force-example="moon"]');assert.equal(await earth.locator('[data-force-filled="true"]').count(),6);assert.equal(await moon.locator('[data-force-filled="true"]').count(),1);const bodies=await visual.locator('[data-same-mass]').evaluateAll(es=>es.map(e=>e.getAttribute('r')));assert.equal(bodies.length,2);assert.equal(bodies[0],bodies[1]);await visual.getByText(/keine Körpermassen/).waitFor();}
 if(id==='moon:4'){assert.equal(await visual.locator('[data-apollo-role="surface"]').count(),2);assert.equal(await visual.locator('[data-apollo-role="orbit"]').count(),1);const positions=await visual.locator('svg').evaluate(svg=>{const moon=svg.querySelector('[data-apollo-moon]'),orbit=svg.querySelector('[data-apollo-orbit]'),n=(e,k)=>Number(e.getAttribute(k)),cx=n(moon,'cx'),cy=n(moon,'cy'),r=n(moon,'r');return {surface:[...svg.querySelectorAll('[data-apollo-role="surface"]')].map(e=>Math.hypot(n(e,'cx')-cx,n(e,'cy')-cy)-r),orbit:[...svg.querySelectorAll('[data-apollo-role="orbit"]')].map(e=>((n(e,'cx')-n(orbit,'cx'))/n(orbit,'rx'))**2+((n(e,'cy')-n(orbit,'cy'))/n(orbit,'ry'))**2)};});assert.ok(positions.surface.every(d=>Math.abs(d)<.001));assert.ok(positions.orbit.every(v=>Math.abs(v-1)<.001));assert.equal(await visual.locator('svg path[marker-end]').count(),0,'roles do not become a compulsory temporal sequence');}
 if(id==='navigation:1'){await visual.getByText('Links Ort A, rechts Ort B: gleiche Breite, verschiedene Länge',{exact:true}).waitFor();const points=await visual.locator('[data-navigation-place]').evaluateAll(es=>es.map(e=>({x:Number(e.getAttribute('cx')),y:Number(e.getAttribute('cy'))})));assert.equal(points.length,2);assert.equal(points[0].y,points[1].y);assert.notEqual(points[0].x,points[1].x);const distances=await visual.locator('svg').evaluate(svg=>[...svg.querySelectorAll('[data-navigation-place]')].map((point,i)=>{const line=svg.querySelectorAll('[data-navigation-meridian]')[i],x=Number(point.getAttribute('cx')),y=Number(point.getAttribute('cy'));return Math.min(...Array.from({length:201},(_,n)=>{const p=line.getPointAtLength(line.getTotalLength()*n/200);return Math.hypot(x-p.x,y-p.y);}));}));assert.ok(distances.every(d=>d<2),'both actual points lie on their separate drawn meridian and shared latitude');}
 if(id==='navigation:2'){const b=await visual.locator('[data-navigation-zero-longitude]').evaluate(e=>({x:e.getBBox().x,width:e.getBBox().width,height:e.getBBox().height}));assert.ok(b.x>=319.9&&b.width<=45.1&&Math.abs(b.height-224)<.1,'only one pole-to-pole half ellipse marks zero longitude, not its rear antimeridian');await visual.getByText(/nicht auch seine Rückseite/).waitFor();}
 if(id==='navigation:3'){const y=await visual.locator('[data-navigation-tropic]').evaluateAll(es=>es.map(e=>e.getPointAtLength(0).y));assert.equal(y.length,3);assert.ok(y[0]<y[1]&&y[1]<y[2]);for(const value of [y[0],y[2]])assert.ok(Math.abs(Math.asin(Math.abs(value-145)/112)*180/Math.PI-23.4)<.0001,'actual spherical section agrees with stated approximate latitude');}
 if(id==='navigation:4'){const hands=await visual.locator('[data-navigation-clock]').evaluateAll(es=>es.map(e=>e.querySelectorAll('path')[1].getAttribute('d')));assert.equal(hands.length,2);assert.notEqual(hands[0],hands[1]);await visual.getByText(/Zwei erfundene Orte/).waitFor();}
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
  if(c.id==='navigation:4'){const link=p.locator('.journey-chapter-link a');await link.focus();await p.keyboard.press('Enter');await p.waitForURL('**/#labs/clocks');await p.locator('#lab-heading').getByText('Welt-Uhren',{exact:true}).waitFor();const clock=p.locator('#active-research-lab .model-content');await clock.locator('input[type=date]').waitFor();await clock.getByRole('slider',{name:/UTC:/}).waitFor();await p.goBack();await inquiry.waitFor();await p.waitForFunction(()=>document.activeElement?.getAttribute('data-route-focus')==='navigation-related-4');report.journeyClockDestination={actualLab:'clocks',heading:'Welt-Uhren',dateControl:true,UTCControl:true,keyboard:true,backFocus:true};}
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
 await journeyContentFlow(browser,base,report);
 await journeyReadingFlow(browser,base,ready,monitor,report,shots);
 await journeyInquiryLoadFlow(browser,base,report,shots);
 await journeyTransferFlow(browser,base,ready,monitor,report,shots);
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
  let learningHelp;
  if(engine==='firefox'||engine==='webkit'){
   const browser=p.context().browser();assert(browser,'existing engine browser for changed journey helpers');
   const base=new URL(p.url()).origin,helpShots=path.join(shots,'journey-help-'+engine);await fs.mkdir(helpShots,{recursive:true});
   const ready=page=>page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor();
   learningHelp=await journeyLearningHelpView(browser,base,ready,helpShots);
  }
  const bookProof={checks:[]},bookNetwork=await bookMeasurementNetworkView(p,{shots,engine});
  for(const width of [320,1440]){await p.setViewportSize({width,height:900});await bookMeasurementView(p,bookProof,width,{shots,engine});}
  assert.equal(bookProof.bookMeasurements.length,14);
  return {hints,diagrams,sources,widths,bookMeasurements:bookProof.bookMeasurements,bookNetwork,...(learningHelp?{learningHelp}:{}),seconds:(performance.now()-started)/1000};
 }catch(error){await p.screenshot({path:path.join(shots,'journey-engine-'+engine+'-support'+'-failure.png'),fullPage:true}).catch(()=>{});throw error;}finally{if(!wasLarge)await p.evaluate(()=>document.querySelector('.earth-app')?.classList.remove('large-reading'));await p.setViewportSize({width:390,height:844});await p.evaluate(hash=>location.hash=hash,initialRoute);if(initialRoute==='#journeys')await p.locator('.journey-filters input').waitFor();}
}
export async function journeyLearningHelpView(browser,base,ready,shots){
 const proof={checks:[],...browserErrorArrays()},engine=browser.browserType().name(),monitor=page=>monitorBrowserErrors(page,base,proof,{engine});
 try{await journeyReadingFlow(browser,base,ready,monitor,proof,shots);await journeyInquiryLoadFlow(browser,base,proof,shots);await journeyTransferFlow(browser,base,ready,monitor,proof,shots);for(const field of BROWSER_ERROR_FIELDS)assert.deepEqual(proof[field],[],field);return proof;}
 catch(error){await fs.writeFile(path.join(shots,'journey-help-'+engine+'-failure-errors.json'),JSON.stringify({status:'failed',engine,...proof,failure:error.stack},null,2)+'\n');throw error;}
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

export async function assertNatureProtectDiagram(visual,id,selected){
 if(!id.startsWith('nature:')&&!id.startsWith('protect:'))return;
 const forest=['nature:1','climate:2'].includes(id),desert=['nature:2','landscapes:3'].includes(id),habitat=['protect:3','climate:4'].includes(id);
 if(!forest&&!desert&&!habitat&&!['nature:3','nature:4','protect:1','protect:2'].includes(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 const labels=await visual.locator('.chapter-diagram-key span').allTextContents();
 if(forest||desert){const panels=await visual.locator('svg rect').evaluateAll(es=>es.map(e=>({x:Number(e.getAttribute('x')),width:Number(e.getAttribute('width')),height:Number(e.getAttribute('height'))})));assert.equal(panels.length,2,'two separate landscape examples');assert.equal(new Set(panels.map(p=>p.width+':'+p.height)).size,1,'equal qualitative panels do not invent a measured amount');assert.ok(panels[0].x+panels[0].width<panels[1].x,'the examples occupy separate depicted places');assert.deepEqual(labels,forest?['1 · Tropischer Regenwald mit Stockwerken','2 · Offene Savanne mit einzelnen Bäumen']:['1 · Heiße Wüste, zum Beispiel Sahara','2 · Kältewüste, antarktisches Inland']);}
 if(id==='nature:3'){assert.deepEqual(labels,['1 · Nordpol: Meer unter dem Meereis','2 · Südpol: Land unter der Eisdecke']);const filled=await visual.locator('svg > path').evaluateAll(es=>es.map(e=>({x:e.getBBox().x,fill:e.getAttribute('fill')})));assert.ok(filled.some(p=>p.x<320&&p.fill==='#70bccc'),'left polar section depicts sea below ice');assert.ok(filled.some(p=>p.x>320&&p.fill==='#f1cb82'),'right polar section depicts land below ice');if(selected===1)await visual.getByText(/nicht unmittelbar am geografischen Südpol/).waitFor();await visual.getByText(/keine Landkarte oder aktuelle Eiskarte/).waitFor();}
 if(id==='nature:4'||id==='protect:1'){const vectors=await visual.locator('svg path[marker-end]').evaluateAll(paths=>paths.map(path=>{const a=path.getPointAtLength(0),b=path.getPointAtLength(path.getTotalLength());return {dx:b.x-a.x,dy:b.y-a.y,y:a.y,endY:b.y,dash:path.getAttribute('stroke-dasharray'),moves:(path.getAttribute('d').match(/M/g)||[]).length};}));assert.equal(vectors.length,3,'each independently explained direction has its own arrowhead');assert.ok(vectors.every(v=>v.moves===1),'marker must not silently label only the final subpath');if(id==='nature:4'){assert.ok(vectors.every(v=>v.dx>0&&v.dy===0),'energy travels from source toward the next depicted user');assert.ok(vectors[0].dash&&!vectors[1].dash&&!vectors[2].dash,'light is distinguished from food links');await visual.getByText(/Lichtenergie von der Sonne zur Pflanze/).waitFor();await visual.getByText(/kein vollständiges Nahrungsnetz/).waitFor();}else{assert.ok(vectors[0].dy>0&&vectors[1].dy<0&&vectors[2].dy>0,'solar input, outgoing and returned thermal radiation have distinct correct directions');assert.ok(!vectors[0].dash&&vectors[1].dash&&vectors[2].dash,'solar input and thermal radiation are distinguished');assert.ok(vectors[1].endY<vectors[2].y,'some outgoing radiation is actually depicted above the atmospheric schematic');assert.ok(labels.includes('Oberfläche und Atmosphäre, kein Mengenmaßstab'));}}
 if(id==='protect:2'){assert.equal(await visual.locator('svg path[marker-end]').count(),0,'alternative reuse choices have no compulsory sequence arrows');const panels=await visual.locator('svg > g > rect').evaluateAll(es=>es.filter(e=>Number(e.getAttribute('height'))>=200).map(e=>e.getAttribute('width')+':'+e.getAttribute('height')));assert.equal(panels.length,3);assert.equal(new Set(panels).size,1);await visual.getByText(/Drei Möglichkeiten, kein Pflichtablauf/).waitFor();assert.deepEqual(labels,['1 · Weiterbenutzen','2 · Fachgerecht reparieren','3 · Weitergeben oder ausleihen']);}
 if(habitat){assert.deepEqual(labels,[['1 · Blüte als mögliches Nahrungsangebot','2 · Gewässer als Lebensraum','3 · Hecke als möglicher Rückzugsort'][selected]]);const ellipses=await visual.locator('svg ellipse').count();if(selected===0)assert.ok(ellipses>=7,'the food example actually depicts flower and visitor');else if(selected===1)assert.equal(ellipses,1,'the water example actually depicts a pond');else{assert.equal(ellipses,0);assert.equal(await visual.locator('svg circle').count(),5,'the refuge example actually depicts a hedge');}}
}

export async function assertContinentsCountriesDiagram(visual,id){
 if(!['continents:1','continents:2','continents:3','continents:4','countries:1','countries:4'].includes(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 if(id==='continents:1'){assert.equal(await visual.locator('[data-eurasia-land]').count(),1);assert.equal(await visual.locator('[data-eurasia-convention][stroke-dasharray]').count(),1);assert.equal(await visual.locator('svg path[marker-end]').count(),0,'landmass regions are not a chronological sequence');await visual.getByText(/Die Trennlinie ist kein Meer|Keine Küstenkarte/).first().waitFor();}
 if(id==='continents:2'){const actual=await visual.locator('svg').evaluate(svg=>{const n=(e,k)=>Number(e.getAttribute(k)),africa=svg.querySelector('[data-africa-region]'),eq=svg.querySelector('[data-africa-equator]').getPointAtLength(0),a=svg.querySelector('[data-america-north]'),b=svg.querySelector('[data-america-south]'),bridge=svg.querySelector('[data-america-bridge]');return{crossesAfrica:eq.y>n(africa,'y')&&eq.y<n(africa,'y')+n(africa,'height'),joinsBoth:n(bridge,'y')<n(a,'y')+n(a,'height')&&n(bridge,'y')+n(bridge,'height')>n(b,'y')};});assert.equal(actual.crossesAfrica,true);assert.equal(actual.joinsBoth,true);await visual.getByText(/Kästen statt Küstenumrissen/).waitFor();}
 if(id==='continents:3'){const included=await visual.locator('svg').evaluate(svg=>{const region=svg.querySelector('[data-oceania-region]'),shape=svg.querySelector('[data-australia-example]'),n=k=>Number(region.getAttribute(k));return Array.from({length:101},(_,i)=>{const p=shape.getPointAtLength(shape.getTotalLength()*i/100);return((p.x-n('cx'))/n('rx'))**2+((p.y-n('cy'))/n('ry'))**2;}).every(x=>x<1);});assert.equal(included,true,'Australia lies within the separately marked larger region');assert.equal(await visual.locator('[data-oceania-island]').count(),3);assert.equal(await visual.locator('[data-antarctic-land]').count(),1);assert.equal(await visual.locator('[data-antarctic-ice]').count(),1);await visual.getByText(/Antarktika: Eis über Land/).waitFor();}
 if(id==='continents:4'){assert.equal(await visual.locator('[data-round-parallel]').count(),5);assert.equal(await visual.locator('[data-flat-parallel]').count(),5);const shapes=await visual.locator('[data-projection-island]').evaluateAll(es=>es.map(e=>e.getAttribute('points')));assert.equal(shapes.length,2);assert.notEqual(shapes[0],shapes[1]);const spacings=await visual.locator('svg').evaluate(svg=>{const ys=selector=>[...svg.querySelectorAll(selector)].map(e=>e.getPointAtLength(0).y).sort((a,b)=>a-b);return{round:ys('[data-round-parallel]'),flat:ys('[data-flat-parallel]')};});const delta=spacings.flat.slice(1).map((v,i)=>v-spacings.flat[i]);assert(delta.every(v=>Math.abs(v-delta[0])<.001));assert(Math.abs((spacings.round[1]-spacings.round[0])-(spacings.round[2]-spacings.round[1]))>1);await visual.getByText(/erfundenen Insel/).waitFor();}
 if(id==='countries:1'){assert.equal(await visual.locator('[data-capital-symbol]').count(),1);assert.equal(await visual.locator('[data-other-city]').count(),2);assert.equal(await visual.locator('svg path[marker-end]').count(),0,'city roles are not chronological steps');await visual.getByText(/keine maßstäblichen Stadtgrößen/).waitFor();}
 if(id==='countries:4'){const a=visual.locator('[data-area-example="A"]'),b=visual.locator('[data-area-example="B"]');assert.equal(await a.locator('[data-area-cell]').count(),4);assert.equal(await b.locator('[data-area-cell]').count(),8);for(const v of[a,b])assert.equal(await v.locator('[data-example-person]').count(),4);const sizes=await visual.locator('[data-area-cell]').evaluateAll(es=>es.map(e=>e.getAttribute('width')+':'+e.getAttribute('height')));assert.equal(new Set(sizes).size,1,'area units have equal displayed sizes in both examples');await visual.getByText(/keine echten Länder- oder aktuellen Bevölkerungszahlen/).waitFor();}
}
