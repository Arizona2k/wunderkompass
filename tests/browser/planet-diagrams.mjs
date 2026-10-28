import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';

export async function assertPlanetDiagram(visual,id,selected){
 if(!/^planet:[1-4]$/.test(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 if(id==='planet:1'){
  const cells=await visual.locator('[data-planet-area]').evaluateAll(es=>es.map(e=>({kind:e.dataset.planetArea,w:e.getAttribute('width'),h:e.getAttribute('height'),fill:e.getAttribute('fill'),stroke:e.getAttribute('stroke')})));
  assert.equal(cells.length,100,'the whole surface has100 equal-area fields');assert.equal(new Set(cells.map(c=>c.w+':'+c.h)).size,1);
  assert.equal(cells.filter(c=>c.kind==='water').length,71);assert.equal(cells.filter(c=>c.kind==='land').length,29);
  assert(cells.filter(c=>c.kind==='water').every(c=>c.fill==='#70bccc'),'water stays blue when selected');assert(cells.filter(c=>c.kind==='land').every(c=>c.fill==='#83bc99'),'land stays green when selected');
  assert(cells.every(c=>(c.stroke!=='none')===(c.kind===(selected===0?'water':'land'))),'selection outlines exactly the chosen area');
 }
 if(id==='planet:2'){
  assert.equal(await visual.locator('[data-planet-atmosphere]').count(),1);assert.equal(await visual.locator('[data-planet-earth]').count(),1);
  assert.equal(await visual.locator('[data-planet-wind-leaf]').count(),selected===2?1:0,'wind has an actual visible effect example only in the wind view');
  if(selected===1)await visual.getByText('Sauerstoff: ein Teil davon',{exact:true}).waitFor();
  if(selected===2)assert.equal(await visual.locator('[data-planet-wind][marker-end]').count(),1);
 }
 if(id==='planet:3'){
  assert.equal(await visual.locator('[data-planet-person]').count(),2);assert.equal(await visual.locator('[data-planet-person][data-selected="true"]').getAttribute('data-planet-person'),String(selected));
  const geometry=await visual.locator('svg').evaluate(svg=>{const earth=svg.querySelector('[data-planet-earth]'),cx=Number(earth.getAttribute('cx')),cy=Number(earth.getAttribute('cy'));return [...svg.querySelectorAll('[data-planet-down]')].map(p=>{const a=p.getPointAtLength(0),b=p.getPointAtLength(p.getTotalLength());return {start:Math.hypot(a.x-cx,a.y-cy),end:Math.hypot(b.x-cx,b.y-cy),cross:(b.x-a.x)*(cy-a.y)-(b.y-a.y)*(cx-a.x),dot:(b.x-a.x)*(cx-a.x)+(b.y-a.y)*(cy-a.y)};});});
  assert.equal(geometry.length,2);assert(geometry.every(v=>v.end<v.start&&v.dot>0&&Math.abs(v.cross)<.01),'both actual local-down arrows point inward toward the same centre');
 }
 if(id==='planet:4'){
  const geometry=await visual.locator('svg').evaluate((svg,selected)=>{const n=(e,k)=>Number(e.getAttribute(k)),rotation=svg.querySelector('[data-planet-rotation-earth]'),axis=svg.querySelector('[data-planet-rotation-axis]'),orbit=svg.querySelector('[data-planet-orbit]'),sun=svg.querySelector('[data-planet-orbit-sun]'),earth=svg.querySelector('[data-planet-orbit-earth]'),rotationPath=svg.querySelector('[data-planet-motion="rotation"]'),orbitPath=svg.querySelector('[data-planet-motion="orbit"]');if(!rotation||!axis||!orbit||!sun||!earth||!rotationPath||!orbitPath)return null;const a=axis.getPointAtLength(0),b=axis.getPointAtLength(axis.getTotalLength()),length=orbitPath.getTotalLength(),end=orbitPath.getPointAtLength(length),before=orbitPath.getPointAtLength(length-1),radial={x:end.x-n(orbit,'cx'),y:end.y-n(orbit,'cy')},tangent={x:end.x-before.x,y:end.y-before.y};return {axisCentered:a.x===n(rotation,'cx')&&b.x===n(rotation,'cx')&&a.y<n(rotation,'cy')&&b.y>n(rotation,'cy'),separateViews:n(rotation,'cx')+n(rotation,'r')<n(orbit,'cx')-n(orbit,'r'),sunCentered:n(sun,'cx')===n(orbit,'cx')&&n(sun,'cy')===n(orbit,'cy'),earthOnOrbit:Math.abs(Math.hypot(n(earth,'cx')-n(orbit,'cx'),n(earth,'cy')-n(orbit,'cy'))-n(orbit,'r')),arrowOnOrbit:Math.abs(Math.hypot(radial.x,radial.y)-n(orbit,'r')),tangentCosine:Math.abs(radial.x*tangent.x+radial.y*tangent.y)/Math.hypot(radial.x,radial.y)/Math.hypot(tangent.x,tangent.y),selectedStroke:(selected===0?rotationPath:orbitPath).getAttribute('stroke'),otherStroke:(selected===0?orbitPath:rotationPath).getAttribute('stroke')};},selected);
  assert(geometry,'rotation and orbit need distinct actual drawings');assert(geometry.axisCentered&&geometry.separateViews&&geometry.sunCentered);assert(geometry.earthOnOrbit<.01&&geometry.arrowOnOrbit<.01&&geometry.tangentCosine<.05,'the orbit and its direction agree geometrically');assert.notEqual(geometry.selectedStroke,geometry.otherStroke,'the selected motion is visibly distinguished');
  assert.equal(await visual.locator('svg path[marker-end]').count(),2);
  const spacing=await visual.locator('svg').evaluate(svg=>{const orbit=svg.querySelector('[data-planet-orbit]'),label=[...svg.querySelectorAll('text')].find(e=>e.textContent==='2'),b=label.getBBox(),v=svg.viewBox.baseVal;return {below:b.y>=Number(orbit.getAttribute('cy'))+Number(orbit.getAttribute('r'))+1,inside:b.y+b.height<=v.height+1};});assert(spacing.below&&spacing.inside,'the orbit number stays below the orbit and inside the viewBox');
 }
}

export async function planetDiagramViews(page,{width,large=true,native=false,offline=false,networkOffline=false,serverStopped=false,captureSession=null,shots,engine}){
 const rows=[],wasLarge=await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading'));
 assert.equal(await page.evaluate(()=>innerWidth),width);assert.equal(await page.evaluate(()=>devicePixelRatio),native?2:1);assert.equal(await page.evaluate(()=>!navigator.onLine),networkOffline,'actual network state matches the declared fixture');if(offline)assert(serverStopped||networkOffline,'offline evidence requires a stopped origin or actual disconnected client');
 try{
  for(let step=1;step<5;step++){
   await page.evaluate(step=>location.hash='journeys/planet/'+(step+1),step);await page.locator('[data-chapter-inquiry="planet:'+step+'"]').waitFor();await page.locator('.earth-app').evaluate((e,large)=>e.classList.toggle('large-reading',large),large);
   const figure=page.locator('[data-chapter-visual="planet:'+step+'"]'),buttons=figure.locator('button');
   for(let selected=0;selected<await buttons.count();selected++){
    await buttons.nth(selected).focus();await page.keyboard.press('Enter');assert.equal(await buttons.nth(selected).getAttribute('aria-pressed'),'true');await assertPlanetDiagram(figure,'planet:'+step,selected);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
    const metrics=await figure.locator('figcaption,.chapter-diagram-key span,button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {text:e.textContent,font:parseFloat(getComputedStyle(e).fontSize),left:r.left,right:r.right,height:r.height,button:e.tagName==='BUTTON'};}));assert(metrics.every(m=>m.left>=-2&&m.right<=width+2&&m.font>=(large&&!m.button?20:16)&&(!m.button||m.height>=44)),JSON.stringify(metrics));
    assert.equal(await page.evaluate(()=>!navigator.onLine),networkOffline,'network state before every capture');if(shots){const file=path.join(shots,`journey-engine-${engine}-planet-${step}-${selected}-${width}-${native?'native200-':''}${offline?'cold':'online'}-${large?'large':'normal'}.png`);await figure.locator('svg').scrollIntoViewIfNeeded();if(native)await captureNativeViewport(page,file,{cdp:captureSession});else await figure.screenshot({path:file,animations:'disabled'});assert((await fs.stat(file)).size>1000);}assert.equal(await page.evaluate(()=>!navigator.onLine),networkOffline,'screenshot protocol preserves the declared network state');
    rows.push({id:'planet:'+step,selected,width,large,native,offline,networkOffline,serverStopped,keyboard:true,semanticGeometry:true,labelsAndModelLimitsReadable:true});
   }
  }
  assert.equal(rows.length,9);return rows;
 }finally{await page.locator('.earth-app').evaluate((e,wasLarge)=>e.classList.toggle('large-reading',wasLarge),wasLarge);}
}
