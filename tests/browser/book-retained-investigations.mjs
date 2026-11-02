import assert from 'node:assert/strict';
import {preserveOriginalDOM} from './preserve-original-dom.mjs';
const fmt=n=>n.toLocaleString('de-DE',{maximumFractionDigits:2});
export async function assertRetainedExistingInvestigation(wrapper,kind,{onState=null}={}){
 const model=wrapper.locator('[data-investigation="'+kind+'"]'),range=model.locator('input[type=range]');
 await model.waitFor();assert.equal(await range.getAttribute('min'),'0.5');assert.equal(await range.getAttribute('max'),kind==='pendulum'?'3':'1.5');assert.equal(await range.getAttribute('step'),kind==='pendulum'?'0.5':'0.1');
 const step=kind==='pendulum'?.5:.1,count=kind==='pendulum'?6:11,rows=[];
 await range.focus();await wrapper.page().keyboard.press('Home');
 const check=async index=>{
  const value=.5+step*index;assert(Math.abs(Number(await range.inputValue())-value)<1e-12);
  // Inspect a visibly rendered SVG after the input event. Chromium can expose
  // the new path attributes with a cached pre-paint getBBox in a cold client.
  // One actual render frame, then the same exact checks; no polling or retry.
  await model.locator('svg').scrollIntoViewIfNeeded();
  await wrapper.page().evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
  const status=await model.locator('[role=status]').innerText();
  if(kind==='pendulum'){
   const expected=2*Math.PI*Math.sqrt(value/9.81);assert.equal(status,'Zeit für eine volle Schwingung: etwa '+fmt(expected)+' Sekunden.');
   const shape=await model.locator('svg').evaluate(svg=>({path:svg.querySelector('path').getAttribute('d'),string:svg.querySelector('path').getBBox().height,bobY:svg.querySelector('circle').cy.baseVal.value}));
   assert.equal(shape.path,'M120 20V'+(20+value*40));
   assert.equal(shape.string,value*40);assert.equal(shape.bobY,20+value*40);assert((await model.innerText()).includes('Standbild eines idealen Fadenpendels in Ruhelage'));
   return{value,expectedPeriod:expected,actualSVGString:shape.string,actualBobY:shape.bobY};
  }
  const expected=1/Math.sqrt((1-value*value)**2+(.3*value)**2);assert.equal(status,'Relative stationäre Auslenkung im Zahlenmodell: '+fmt(expected)+'. Der Antrieb liefert Energie; die Dämpfung begrenzt die Antwort.');
  const wave=await model.locator('svg path').evaluate(e=>{
   const raw=e.getAttribute('d'),points=[...raw.matchAll(/[ML]\s*(-?[\d.e+]+)[ ,]+(-?[\d.e+]+)/gi)].map(m=>({x:Number(m[1]),y:Number(m[2])}));const y=points.map(p=>p.y);
   const peaks=y.slice(1,-1).filter((v,i)=>v>y[i]&&v>y[i+2]).length,troughs=y.slice(1,-1).filter((v,i)=>v<y[i]&&v<y[i+2]).length;return{points,peaks,troughs,height:e.getBBox().height};
  });
  assert.equal(wave.points.length,62);assert.equal(wave.points[0].x,15);assert.equal(wave.points.at(-1).x,225);
  assert.equal(wave.peaks,3);assert.equal(wave.troughs,3);assert(Math.abs(wave.height-2*Math.min(55,expected*15))<.001);
  assert((await wrapper.innerText()).includes('Die gezeichnete Wellenlinie ist nur ein Höhenvergleich ohne Zeitachse.'));
  assert((await wrapper.innerText()).includes('Im Faktor 0,3 · r bleibt 0,3 bei allen Vergleichen fest'));
  return{value,expectedRelativeResponse:expected,actualWaveHeight:wave.height,actualFixedIllustrativePeaks:wave.peaks,actualFixedIllustrativeTroughs:wave.troughs,noMeasuredTimeAxis:true};
 };
 for(let index=0;index<count;index++){
  if(index)await wrapper.page().keyboard.press('ArrowRight');const actual=await check(index);rows.push({kind,selected:index,...actual,actualDrawnAndSemanticStateChecked:true});if(onState)await onState(index);
 }
 const restoreOriginal=await preserveOriginalDOM(model.locator('svg'));
 try{
  await model.locator('svg').evaluate((svg,kind)=>{if(kind==='pendulum')svg.querySelector('circle').setAttribute('cy','21');else svg.querySelector('path').setAttribute('d','M15 100L225 100');},kind);
  await assert.rejects(()=>check(count-1));rows.at(-1).actualWrongDrawnCountercaseRejected=true;
 }finally{await restoreOriginal();}
 await check(count-1);
 if(kind==='pendulum'){
  const restorePath=await preserveOriginalDOM(model.locator('svg'));
  try{
   await model.locator('svg path').first().evaluate(el=>el.setAttribute('d','M120 20V60'));
   await assert.rejects(()=>check(count-1));rows.at(-1).actualWrongSVGPathCountercaseRejected=true;
  }finally{await restorePath();}
  await check(count-1);
 }
 return rows;
}
