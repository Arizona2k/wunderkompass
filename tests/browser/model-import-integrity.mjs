import assert from 'node:assert/strict';import path from 'node:path';import fs from 'node:fs/promises';
import {captureNativeViewport} from './native-screenshot.mjs';
const saveKey='erde-entdecken:save:v3';
export const readIntegrityPass=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),saveKey);
export async function assertSeasonalLatitude(page,expected=-34){
 const model=page.locator('.research-measurements').filter({has:page.getByRole('slider',{name:/Breitengrad/})});
 const slider=model.getByRole('slider',{name:/Breitengrad/});await slider.waitFor();
 await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));
 assert.equal(Number(await slider.inputValue()),expected,'declared southern model latitude survives restoration');
 const state=await readIntegrityPass(page),s=state.progress.gameSessions['lab:seasons'];assert.equal(s.latitude,expected,'saved southern model latitude');assert.equal(s.month,1);assert.equal(s.tilted,true);
 // Geometric June-solstice model: obliquity23.4°, solar centre, no refraction.
 // Expected physics is computed independently of the application helper.
 const day=24*Math.acos(-Math.tan(expected*Math.PI/180)*Math.tan(23.4*Math.PI/180))/Math.PI;
 const opposite=24-day,noon=90-Math.abs(expected-23.4),text=await model.getByRole('status').innerText();
 assert.ok(text.includes(day.toFixed(1)+' h Tageslicht'));assert.ok(text.includes(opposite.toFixed(1)+' h Tageslicht'));assert.ok(text.includes('Mittagshöhe: '+noon.toFixed(1)+'°'));
 const line=model.locator('svg polyline');assert.equal(await line.isVisible(),true);const shape=await line.evaluate(e=>({june:{x:e.points.getItem(12).x,y:e.points.getItem(12).y},height:e.getBBox().height,visibleHeight:e.getBoundingClientRect().height}));
 assert.equal(shape.june.x,150);assert.ok(Math.abs(shape.june.y-(210-day*7.5))<.001,'drawn June point agrees with the selected southern latitude');assert.ok(Math.abs(shape.height-Math.abs(opposite-day)*7.5)<.001&&shape.visibleHeight>1,'actual annual curve agrees with independent solstice day lengths');
 return {latitude:expected,month:1,tilted:true,daylight:day,noonAltitude:noon,shape,inputExplanationGraphicAndStorage:true};
}
export async function assertRejectedMalformedImport(page,before){
 await page.waitForFunction(()=>[...document.querySelectorAll('[role="alertdialog"]')].some(e=>e.getClientRects().length)||[...document.querySelectorAll('.pass-file-message')].some(e=>e.textContent.includes('beschädigt oder unvollständig')));
 assert.equal(await page.getByRole('alertdialog').count(),0,'damaged import must not open an ordinary replacement confirmation');
 await page.getByRole('status').filter({hasText:'Diese Sicherung ist beschädigt oder unvollständig.'}).waitFor();
 const after=await readIntegrityPass(page);assert.deepEqual(after.progress,before.progress,'invalid file selection preserves every existing progress field');assert.equal(after.epoch,before.epoch,'invalid import cannot create a replacement epoch');
}
export async function malformedImportRegression(page,{report}={}){
 const before=await readIntegrityPass(page),cases=[['missing-progress',{app:'earth-explorer',schemaVersion:3}],['array-progress',{app:'earth-explorer',schemaVersion:3,progress:[]}],['truncated-progress',{...before,progress:{notes:[]}}],['wrong-note-container',{...before,progress:{...before.progress,notes:'beschädigt'}}],['wrong-session-container',{...before,progress:{...before.progress,gameSessions:[]}}]];
 for(const [name,value]of cases){await page.locator('input[type=file]').setInputFiles({name:name+'.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(value))});await assertRejectedMalformedImport(page,before);}
 if(report)(report.malformedImportPreservation??=[]).push({cases:cases.map(([name])=>name),allProgressAndEpochUnchanged:true,noReplacementConfirmation:true});
 return {cases:cases.length,allProgressAndEpochUnchanged:true};
}
export async function seasonalRestoreRegression(page,ready,{width,shots,native=false}={}){
 await page.bringToFront();await page.locator('.seasons-lab').getByRole('button',{name:'Juni',exact:true}).click();const tilt=page.getByRole('switch',{name:'Erdachse um 23,4 Grad neigen',exact:true});if(await tilt.getAttribute('aria-checked')!=='true')await tilt.click();await page.getByRole('button',{name:'34° Süd',exact:true}).click();await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['lab:seasons'].latitude===-34,saveKey);const before=await assertSeasonalLatitude(page);
 await page.evaluate(()=>location.hash='labs');await page.locator('[data-lab-id="seasons"]').click();await page.locator('#lab-heading').waitFor();const reopened=await assertSeasonalLatitude(page);
 await page.reload();await ready(page);await page.locator('#lab-heading').waitFor();const reloaded=await assertSeasonalLatitude(page);
 await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Entdeckerpass sichern',exact:true}).click();const file=path.join(shots,'seasonal-negative-pass-'+width+'.json');await(await download).saveAs(file);const exported=JSON.parse(await fs.readFile(file,'utf8'));assert.equal(exported.progress.gameSessions['lab:seasons'].latitude,-34);
 await page.locator('input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await page.locator('.passport-dialog').waitFor({state:'hidden'});await page.locator('#lab-heading').waitFor();const imported=await assertSeasonalLatitude(page);const after=await readIntegrityPass(page);assert.deepEqual(after.progress,exported.progress,'valid negative model pass import retains all other existing progress too');
 if(shots){const model=page.locator('.research-measurements').filter({has:page.getByRole('slider',{name:/Breitengrad/})});if(native){for(const [n,selector]of ['h3','[role=status]','svg'].entries()){await model.locator(selector).scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,'research-southern-restore-native200-'+width+'-'+n+'.png'));}}else await model.screenshot({path:path.join(shots,'research-southern-restore-'+width+'.png'),animations:'disabled'});}
 return {width,before,reopened,reloaded,imported,actualFileDownloadAndImport:true,allOtherProgressRetained:true};
}
