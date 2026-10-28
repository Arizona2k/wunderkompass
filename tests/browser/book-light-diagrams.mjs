import assert from 'node:assert/strict';

export async function assertBookLightFigure(figure,kind,{onState=null}={}){
 const controls=figure.locator('.visual-choice button'),count=await controls.count(),states=[];
 for(let selected=0;selected<Math.max(1,count);selected++){
  if(count){await controls.nth(selected).focus();await figure.page().keyboard.press('Enter');assert.equal(await controls.nth(selected).getAttribute('aria-pressed'),'true');}
  await figure.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
  const geometry=await figure.evaluate((root,{kind})=>{
   const vector=s=>{const e=root.querySelector(s);if(!e)return null;const a=e.getPointAtLength(0),b=e.getPointAtLength(e.getTotalLength());return {x:a.x,y:a.y,endX:b.x,endY:b.y,dx:b.x-a.x,dy:b.y-a.y};};
   if(kind==='reflection'||kind==='refraction')return {incident:vector('[data-light-incident]'),out:vector(kind==='reflection'?'[data-light-reflected]':'[data-light-refracted]')};
   if(kind==='absorption'){const path=vector('[data-light-absorbed]'),material=root.querySelector('[data-light-material]');return {path,inside:material.isPointInFill(new DOMPoint(path.endX,path.endY)),left:material.getBBox().x};}
   if(kind==='energy-paths'){const b=root.querySelector('[data-light-system-boundary]').getBBox();return {left:b.x,right:b.x+b.width,input:vector('[data-light-energy-path="electrical"]'),light:vector('[data-light-energy-path="light"]'),environment:vector('[data-light-energy-path="environment"]')};}
   if(kind==='radiation-medium'){const b=root.querySelector('[data-light-vacuum]').getBBox();return {path:vector('[data-light-medium-path]'),left:b.x,right:b.x+b.width};}
   if(kind==='frequency'||kind==='wavelength'){
    const points=[...root.querySelector('[data-light-wave]').points].map(p=>({x:p.x,y:p.y})),peaks=points.filter((p,i)=>i>0&&i<points.length-1&&p.y<points[i-1].y&&p.y<points[i+1].y);
    return {width:points.at(-1).x-points[0].x,height:Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y)),peaks,span:kind==='wavelength'?vector('[data-light-wavelength-span]'):null};
   }
   if(kind==='polarization-axis')return [...root.querySelectorAll('[data-light-polarization-axis]')].map(e=>vector('[data-light-polarization-axis="'+e.dataset.lightPolarizationAxis+'"]'));
   return null;
  },{kind});
  if(kind==='reflection'){
   const {incident:a,out:b}=geometry;assert(a&&b);assert(Math.abs(a.endX-b.x)<.01&&Math.abs(a.endY-b.y)<.01,'reflected light starts at the same interface point');
   assert(a.dy>0&&b.dy<0&&Math.abs(Math.abs(a.dx/a.dy)-Math.abs(b.dx/b.dy))<.001,'equal incidence and reflection angles, both above the mirror');
  }
  if(kind==='refraction'){
   const {incident:a,out:b}=geometry;assert(Math.abs(a.endX-b.x)<.01&&Math.abs(a.endY-b.y)<.01&&a.dy>0&&b.dy>0,'light crosses one shared interface point');
   if(selected===0)assert(a.dx>0&&b.dx>0&&Math.abs(b.dx/b.dy)<Math.abs(a.dx/a.dy),'air to water bends toward the normal');
   else assert(Math.abs(a.dx)<.01&&Math.abs(b.dx)<.01,'normal incidence stays straight');
  }
  if(kind==='scattering')assert.equal(await figure.locator('[data-light-scattered]').count(),3);
  if(kind==='absorption')assert(geometry.path.x<geometry.left&&geometry.inside,'energy comes from outside and is taken up within the actual material');
  if(kind==='photon-model')assert.equal(await figure.locator('[data-light-count-token]').count(),selected===0?3:6);
  if(kind==='radiation-medium'){
   assert(geometry.path.x<geometry.left);assert(selected===0?geometry.path.endX>geometry.right:geometry.path.endX<geometry.left,'only electromagnetic path traverses vacuum');
  }
  if(kind==='spectrum'){
   assert.deepEqual(await figure.locator('[data-light-spectrum-region]').evaluateAll(es=>es.map(e=>e.dataset.lightSpectrumRegion)),['Radio','Infrarot','Sichtbar']);
   assert.equal(await figure.locator('[data-light-spectrum-gap]').count(),1);await figure.getByText(/Mikrowellen zwischen Radio und Infrarot/).waitFor();
  }
  if(kind==='infrared-palette'){
   assert.deepEqual(await figure.locator('[data-light-signal]').evaluateAll(es=>es.map(e=>Number(e.dataset.lightSignal))),[10,20,30]);
   const colours=await figure.locator('[data-light-signal]>span:first-child').evaluateAll(es=>es.map(e=>getComputedStyle(e).backgroundColor));
   assert.equal(new Set(colours).size,3);assert(selected===0?colours.some(c=>!/^rgb\((\d+), \1, \1\)$/.test(c)):colours.every(c=>/^rgb\((\d+), \1, \1\)$/.test(c)),'palette changes presentation, never sample values');
  }
  if(kind==='frequency'||kind==='wavelength'){
   const cycles=kind==='frequency'?(selected===0?4:8):(selected===0?2:4);assert.equal(geometry.peaks.length,cycles);assert(Math.abs(geometry.height-60)<.01&&Math.abs(geometry.width-260)<.01,'same amplitude and axis extent');
   if(kind==='wavelength')assert(Math.abs(geometry.span.x-geometry.peaks[0].x)<.01&&Math.abs(geometry.span.endX-geometry.peaks[1].x)<.01,'wavelength arrow joins consecutive crests');
  }
  if(kind==='energy-paths'){
   assert.deepEqual(await figure.locator('[data-light-energy-path]').evaluateAll(es=>es.map(e=>e.dataset.lightEnergyPath)),['electrical','light','environment']);
   assert(geometry.input.x<geometry.left&&geometry.input.endX>geometry.left&&geometry.input.endX<geometry.right,'electrical path enters the lamp system');
   assert([geometry.light,geometry.environment].every(v=>v.x>geometry.left&&v.x<geometry.right&&v.endX>geometry.right),'both outgoing paths leave the actual system boundary');assert(geometry.light.dy<0&&geometry.environment.dy>0,'outgoing paths match their upper/lower HTML descriptions');
  }
  if(kind==='polarization-axis'){
   assert.equal(geometry.length,3);assert(geometry[0].dx*geometry[1].dx>0&&geometry[0].dy===0&&geometry[1].dy===0&&geometry[2].dx===0&&geometry[2].dy>0,'two horizontal axes differ from the third vertical axis');
   await figure.getByText(/keine Flugrichtung/).waitFor();
  }
  const svg=figure.locator('svg');if(await svg.count()){
   const escaped=await svg.evaluate(e=>{const v=e.viewBox.baseVal;return [...e.querySelectorAll('path:not(defs path),rect,circle,polyline')].flatMap(el=>{const b=el.getBBox();return b.x<v.x-1||b.y<v.y-1||b.x+b.width>v.x+v.width+1||b.y+b.height>v.y+v.height+1?[el.outerHTML.slice(0,180)]:[];});});assert.deepEqual(escaped,[],'drawn learning objects remain inside the viewBox');
  }
  if(onState)await onState(selected);states.push({kind,selected,keyboard:count>0,semanticGeometry:true});
 }
 if(count){await controls.first().focus();await figure.page().keyboard.press('Enter');}
 return states;
}
