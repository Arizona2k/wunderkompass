import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';
import {worldSelectionReturnPage} from './learning-navigation.mjs';
import {captureNativeViewport} from './native-screenshot.mjs';

// The ordinary native journey context has closed before this touch context is
// opened. Keep the existing at-most-two-browser-groups execution bound.
export async function nativeWorldSelectionReturns(chromium,options,base,report,shots){
 const profile=path.join(shots,'native-world-selection-profile');await fs.mkdir(path.join(profile,'Default'),{recursive:true});
 await fs.writeFile(path.join(profile,'Default','Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(2)/Math.log(1.2)}}}));
 const proof={status:'running',percent:200,views:[],...browserErrorArrays()},context=await chromium.launchPersistentContext(profile,{...options,...(!options.executablePath?{channel:'chromium'}:{}),viewport:{width:1280,height:950},deviceScaleFactor:1,hasTouch:true,reducedMotion:'reduce'});
 const seed=createSave();seed.progress.settings.largeText=true;seed.progress.notes=[{id:'synthetic-native-return',text:'Synthetische unveränderte Rückkehrnotiz.',at:'2026-10-30T00:00:00.000Z'}];
 await context.addInitScript(({key,seed})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(seed));},{key:SAVE_KEY,seed});
 const page=context.pages()[0];page.setDefaultTimeout(20000);monitorBrowserErrors(page,base,proof);
 try{
  for(const width of[640,320]){
   await page.setViewportSize({width:width*2,height:950});await page.goto(base+'/#world/animals/page/2');await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
   const dimensions=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scale:devicePixelRatio}));assert.deepEqual(dimensions,{width,height:475,scale:2});assert(await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading')));
   const result=await worldSelectionReturnPage(page,base,{touch:true,capture:()=>captureNativeViewport(page,path.join(shots,'journey-native-world-selection-native200-'+width+'.png'))});
   assert(result.departure.opener.height>dimensions.height,'the actual card is taller than this short native viewport');
   assert.equal(result.firstReturn.openerVisibility.oversized,true);assert.equal(result.firstReturn.openerVisibility.visible,true);
   assert(Math.abs(result.firstReturn.finalMeasuredScroll-result.departure.scroll)<8,'same original trusted activation reading position at native200');
   assert(Math.abs(result.filteredReturn.finalMeasuredScroll-result.filteredDeparture.scroll)<8,'filtered native200 article/reload return preserves the actual departure');
   // Captured inside the shared helper at the genuine returned filtered opener,
   // before the independent direct-entry/fallback scenario changes the view.
   const capture=result.actualCapture;assert(capture);assert.equal(capture.cssWidth,width);assert.equal(capture.scale,2);assert.equal(capture.pixelWidth,width*2);
   proof.views.push({dimensions,actualTouch:true,largeReading:true,result,capture,actualOversizedOpener:true});
  }
  assert.equal(proof.views.length,2);assert(browserErrorsComplete(proof));proof.status='passed';report.nativeWorldSelection=proof;report.checks.push('Actual native200% touch640/320CSS x475CSS return to oversized cards preserves trusted reading position, exact focus, page/filter/reload context and synthetic personal data');
 }catch(error){proof.status='failed';proof.failure=error.stack;report.nativeWorldSelection=proof;await captureNativeViewport(page,path.join(shots,'journey-native-world-selection-original-failure.png')).catch(()=>{});throw error;}
 finally{await context.close();}
 return proof;
}
