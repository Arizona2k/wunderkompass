import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import JOURNEYS from '../../exports/content/journeys.json' with {type:'json'};
async function open(p,id,index){await p.evaluate(route=>location.hash=route,'journeys/'+id+'/'+(index+1));await p.locator('[data-chapter-inquiry="'+id+':'+index+'"]').waitFor();}
async function reveal(p,text){const summary=p.locator('summary').filter({hasText:text});if(!await summary.evaluate(el=>el.parentElement.open))await summary.click();}
// Source access is part of the existing real-engine suite, not a new gate.
export async function journeySourceView(p,{widths,shots,engine}){
 const initialRoute=await p.evaluate(()=>location.hash),viewport=p.viewportSize(),wasLarge=await p.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading')),views=[];let witness=null;
 try{
  // Real-engine suites return here after opening and closing isolated contexts.
  // Keyboard assertions must act on the foreground document, as a user would.
  const previouslyFocused=await p.evaluate(()=>document.hasFocus());await p.bringToFront();
  console.log('SOURCE_KEYBOARD_DOCUMENT',JSON.stringify({engine,previouslyFocused,focused:await p.evaluate(()=>document.hasFocus())}));
  for(const width of widths){
   await p.setViewportSize({width,height:900});
   for(const large of [false,true]){
    await p.locator('.earth-app').evaluate((e,large)=>e.classList.toggle('large-reading',large),large);
    for(const journey of JOURNEYS){
     witness={engine,journey:journey.id,width,large,stage:'opening'};
     await open(p,journey.id,0);await reveal(p,'Für Erwachsene: Quellen');
     const source=p.locator('a.journey-source');
     assert.equal(await source.count(),1,'one unchanged original source per journey');
     assert.equal(await source.getAttribute('href'),journey.source,'original source destination');
     assert.equal(await source.innerText(),journey.sourceName,'original source credit');
     assert.equal(await source.getAttribute('target'),'_blank');
     assert.ok((await source.getAttribute('rel')).split(/\s+/).includes('noreferrer'));
     // Observe the requested actual style state across engines, rather than
     // assuming immediate readiness; never retry the action or relax its minimum.
     witness={...witness,stage:'waiting-for-requested-font',fontBefore:await source.evaluate(e=>getComputedStyle(e).fontSize)};
     await p.waitForFunction(({large})=>{const e=document.querySelector('a.journey-source');return e&&Math.abs(parseFloat(getComputedStyle(e).fontSize)-(large?18.4:16))<.01;},{large});
     if(Math.abs(parseFloat(witness.fontBefore)-(large?18.4:16))>=.01)console.log('SOURCE_FONT_SETTLED',JSON.stringify({...witness,fontAfter:await source.evaluate(e=>getComputedStyle(e).fontSize)}));
     const metric=await source.evaluate(e=>{const r=e.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(e);const ink=range.getBoundingClientRect();return {height:r.height,font:parseFloat(getComputedStyle(e).fontSize),left:r.left,right:r.right,inkLeft:ink.left,inkRight:ink.right};});
     assert.ok(metric.height>=44,'source link touch target: '+journey.id+' '+width+' '+large);
     assert.ok(metric.font>=(large?18.3:16),'source credit follows the large-reading setting');
     assert.ok(metric.left>=-2&&metric.right<=width+2&&metric.inkLeft>=metric.left-2&&metric.inkRight<=metric.right+2,'source text stays visible');
     const focusState=()=>p.evaluate(()=>{const e=document.activeElement,s=e&&getComputedStyle(e);return {element:e?.outerHTML.slice(0,600),tag:e?.tagName,href:e?.getAttribute('href'),focusVisible:e?.matches(':focus-visible'),outlineWidth:s?.outlineWidth,outlineStyle:s?.outlineStyle,hasDocumentFocus:document.hasFocus()};});
     await source.focus();const before=await focusState();await p.keyboard.press('Tab');const next=await focusState();await p.keyboard.press('Shift+Tab');const returned=await focusState();
     witness={engine,journey:journey.id,width,large,stage:'keyboard-result',expectedHref:journey.source,expectedElement:await source.evaluate(e=>e.outerHTML),before,next,returned,route:p.url()};
     // Wait for the actual browser result, without another key press or focus call.
     await p.waitForFunction(()=>{const e=document.querySelector('a.journey-source');return e===document.activeElement&&e.matches(':focus-visible');});
     if(returned.element!==before.element||!returned.focusVisible)console.log('SOURCE_FOCUS_SETTLED',JSON.stringify({...witness,settled:await focusState()}));
     assert.ok(await source.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')),'source keyboard focus stays visible '+JSON.stringify(witness));
     views.push({journey:journey.id,width,large,...metric,keyboard:true});
     if(journey.id==='navigation'&&[320,1440].includes(width))await source.locator('..').screenshot({path:path.join(shots,'journey-engine-'+engine+'-sources-'+(large?'large':'normal')+'-'+width+'.png'),animations:'disabled'});
    }
   }
  }
  // Every chapter keeps the same original source, including completed/resumed paths.
  for(const journey of JOURNEYS)for(let index=0;index<journey.steps.length;index++){
   await open(p,journey.id,index);await reveal(p,'Für Erwachsene: Quellen');
   assert.equal(await p.locator('a.journey-source').getAttribute('href'),journey.source);
  }
  assert.equal(views.length,JOURNEYS.length*widths.length*2);
  return {views,chapters:80,scope:'source credit readability, touch, keyboard and unchanged original links'};
 }catch(error){
  const current=await p.evaluate(()=>{const e=document.querySelector('a.journey-source');return {font:e&&getComputedStyle(e).fontSize,large:document.querySelector('.earth-app')?.classList.contains('large-reading'),active:document.activeElement?.outerHTML.slice(0,600)};}).catch(()=>null);
  const failure={scope:'actual source-state failure',witness,current,error:error.stack};console.error('JOURNEY_SOURCE_FOCUS_FAILURE',JSON.stringify(failure));
  await fs.writeFile(path.join(shots,'journey-engine-'+engine+'-source-keyboard-failure.json'),JSON.stringify(failure,null,2));
  await p.screenshot({path:path.join(shots,'journey-engine-'+engine+'-source-keyboard-failure.png'),fullPage:true,animations:'disabled'}).catch(()=>{});throw error;
 }finally{
  await p.locator('.earth-app').evaluate((e,large)=>e.classList.toggle('large-reading',large),wasLarge);
  await p.setViewportSize(viewport);await p.evaluate(hash=>location.hash=hash,initialRoute);
  if(initialRoute==='#journeys')await p.locator('.journey-filters input').waitFor();
 }
}
