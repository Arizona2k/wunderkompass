import assert from 'node:assert/strict';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';

// Compare actual drawn material against actual drawn terrain, not a copied path.
export async function assertLavaOnSurface(visual,terrainSelector,lavaSelector){
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 const samples=await visual.locator('svg').evaluate((svg,{terrainSelector,lavaSelector})=>{
  const terrain=svg.querySelector(terrainSelector),lava=svg.querySelector(lavaSelector);
  if(!terrain||!lava)return null;
  return [.15,.3,.5,.7,.9].map(f=>{
   const p=lava.getPointAtLength(lava.getTotalLength()*f),above=new DOMPoint(p.x,p.y-2),below=new DOMPoint(p.x,p.y+2);
   return {above:terrain.isPointInFill(above),below:terrain.isPointInFill(below)};
  });
 },{terrainSelector,lavaSelector});
 assert(samples?.length===5,'surface lava and terrain must both exist');
 assert(samples.every(p=>!p.above&&p.below),'lava follows the actual surface: rock below, open air above');
}

export async function assertInsideDiagrams(visual,id,selected){
 if(!['inside:4','volcanoes:1','volcanoes:3'].includes(id))return;
 await visual.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 if(id==='inside:4'){
  await assertLavaOnSurface(visual,'[data-inside-terrain]','[data-inside-surface-lava]');
  const inside=await visual.locator('svg').evaluate(svg=>{
   const terrain=svg.querySelector('[data-inside-terrain]'),magma=svg.querySelector('[data-inside-magma]'),b=magma.getBBox();
   return [[.25,.5],[.5,.5],[.75,.5]].every(([x,y])=>terrain.isPointInFill(new DOMPoint(b.x+x*b.width,b.y+y*b.height)));
  });
  assert(inside,'magma reservoir is within the ground');
  await visual.getByText(/keine Temperatur/).waitFor();
 }
 if(id==='volcanoes:1')await assertLavaOnSurface(visual,'[data-volcano-terrain]','[data-volcano-path="surface"]');
 if(id==='volcanoes:3'){
  const forms=await visual.locator('[data-volcano-form]').evaluateAll(es=>es.map(e=>{const b=e.getBBox();return {kind:e.dataset.volcanoForm,width:b.width,height:b.height};}));
  assert.equal(forms.length,2,'both qualitative profiles are visible together');
  const shield=forms.find(e=>e.kind==='shield'),composite=forms.find(e=>e.kind==='composite');
  assert(Math.abs(shield.width-composite.width)<.1,'same example width, no invented real-size comparison');
  assert(shield.height/shield.width<composite.height/composite.width/2,'shield profile is visibly flatter');
  assert.equal(await visual.locator(`[data-volcano-form-emphasis="${selected}"]`).getAttribute('stroke-width'),'7');
  assert.equal(await visual.locator('[data-inside-magma],[data-volcano-path]').count(),0,'shape comparison does not mix in a buried lava path');
 }
}

export async function insideDiagramViews(page,{width,large=true,native=false,offline=false,networkOffline=false,serverStopped=false,captureSession=null,shots=null,engine='chromium'}){
 assert.equal(await page.evaluate(()=>innerWidth),width);assert.equal(await page.evaluate(()=>devicePixelRatio),native?2:1);assert.equal(await page.evaluate(()=>!navigator.onLine),networkOffline);
 if(offline)assert(serverStopped||networkOffline,'cached diagram proof requires a stopped origin or disconnected client');
 const rows=[];
 for(const id of['inside:4','volcanoes:1','volcanoes:3']){
  const [journey,index]=id.split(':');await page.evaluate(route=>location.hash=route,'journeys/'+journey+'/'+(Number(index)+1));const visual=page.locator(`[data-chapter-visual="${id}"]`);await visual.waitFor();await page.locator('.earth-app').evaluate((e,large)=>e.classList.toggle('large-reading',large),large);
  const buttons=visual.locator('button');
  for(let selected=0;selected<await buttons.count();selected++){
   await buttons.nth(selected).focus();await page.keyboard.press('Enter');assert.equal(await buttons.nth(selected).getAttribute('aria-pressed'),'true');await assertInsideDiagrams(visual,id,selected);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   const metrics=await visual.locator('figcaption,.chapter-diagram-key span,button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {font:parseFloat(getComputedStyle(e).fontSize),left:r.left,right:r.right,height:r.height,button:e.tagName==='BUTTON'};}));assert(metrics.every(m=>m.left>=-2&&m.right<=width+2&&m.font>=(large&&!m.button?20:16)&&(!m.button||m.height>=44)),'keys, limits and controls reflow at16/20px');
   if(shots){const file=path.join(shots,`journey-engine-${engine}-${id.replace(':','-')}-${selected}-${width}-${native?'native200-':''}${offline?'cold':'online'}-${large?'large':'normal'}.png`);await visual.locator('svg').scrollIntoViewIfNeeded();if(native)await captureNativeViewport(page,file,{cdp:captureSession});else await visual.screenshot({path:file,animations:'disabled'});}
   assert.equal(await page.evaluate(()=>!navigator.onLine),networkOffline);rows.push({id,selected,width,large,native,offline,networkOffline,serverStopped,actualSurfaceOrFormGeometry:true,keyboard:true});
  }
 }
 assert.equal(rows.length,8);return rows;
}
