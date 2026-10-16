import {whyAtZoom} from './why-learning.mjs';
import {bookStudyAtZoom} from './book-excellence.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
/** Native Chromium zoom preference in a fresh QA profile, never CSS zoom or a
 * change to a user's browser. Partition key "x" is Chromium's default partition:
 * chrome/browser/ui/zoom/chrome_zoom_level_prefs.cc, GetPartitionKey("").
 */
export async function nativeJourneyZoom(chromium,options,base,report,shots,{bookOnly=false,includeBook=true,includeWhy=bookOnly}={}){
 const profile=path.join(shots,bookOnly?(includeBook?'book-native-zoom-profile':'why-native-zoom-profile'):'journey-native-zoom-profile');await fs.rm(profile,{recursive:true,force:true});await fs.mkdir(path.join(profile,'Default'),{recursive:true});
 await fs.writeFile(path.join(profile,'Default','Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(2)/Math.log(1.2)}}}));
 const context=await chromium.launchPersistentContext(profile,{...options,...(!options.executablePath?{channel:'chromium'}:{}),viewport:{width:1280,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}),p=context.pages()[0];const errors=[];p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.bringToFront();
  await p.goto(base+(bookOnly?'/#book':'/#journeys/water/3'));await p.locator(bookOnly?'.word-card':'[data-chapter-inquiry="water:2"]').first().waitFor();
  const cdp=await context.newCDPSession(p);
  const capture=async name=>{const clip=await p.evaluate(()=>({x:scrollX*devicePixelRatio,y:scrollY*devicePixelRatio,width:innerWidth*devicePixelRatio,height:innerHeight*devicePixelRatio,scale:1}));const result=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});await fs.writeFile(path.join(shots,name),Buffer.from(result.data,'base64'));};
  const dimensions=await p.evaluate(()=>({cssWidth:innerWidth,scale:devicePixelRatio,screen:screen.width}));assert.equal(dimensions.cssWidth,640);assert.equal(dimensions.scale,2);
  if(!bookOnly){for(const [id,index] of [['water',2],['inside',0],['navigation',0],['climate',4]]){
   await p.evaluate(route=>location.hash=route,'journeys/'+id+'/'+(index+1));await p.locator('[data-chapter-inquiry="'+id+':'+index+'"]').waitFor();
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'native 200% reflow '+id);
   await p.locator('.journey-task').scrollIntoViewIfNeeded();await p.locator('.journey-levels button').nth(2).focus();await capture('journey-native-200-'+id+'.png');
  }
  await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'native zoom plus large app text');await p.locator('.journey-task').scrollIntoViewIfNeeded();await capture('journey-native-200-large.png');
  await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.journey-reader',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
  }
  if(includeBook)await bookStudyAtZoom(p,report,capture);
  if(includeWhy)await whyAtZoom(p,report,capture);
  if(!bookOnly){report.nativeZoom={percent:200,...dimensions,largeTextAlsoChecked:true};report.speechAvailability=await p.evaluate(()=>({api:'speechSynthesis' in window,germanVoices:window.speechSynthesis?.getVoices().filter(v=>v.lang.startsWith('de')).length??0,audibleTestPerformed:false}));report.checks.push('Actual native Chromium 200% zoom, measured 640 CSS px / 1280 screen px / DPR 2; four journeys, large text, focus, reflow and axe');}assert.deepEqual(errors,[]);
 }finally{await context.close();}
}
