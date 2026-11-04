import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {geoArea,geoOrthographic,geoPath} from 'd3-geo';
import {SAVE_KEY} from '../../app/progress-storage.ts';
import {captureNativeViewport} from './native-screenshot.mjs';
const world=JSON.parse(await fs.readFile(new URL('../../public/world.json',import.meta.url),'utf8'));
const australia=world.features.find(c=>c.properties.iso==='AU');assert(australia);
if(geoArea(australia)>2*Math.PI){if(australia.geometry.type==='Polygon')australia.geometry.coordinates.forEach(r=>r.reverse());else australia.geometry.coordinates.forEach(p=>p.forEach(r=>r.reverse()));}
const place=JSON.parse(await fs.readFile(new URL('../../app/nature-new-places.json',import.meta.url),'utf8')).find(p=>p.id==='daintree');assert(place);
async function actualCamera(page,center){
 const svg=page.locator('.fallback-globe[data-model-mode="globe"]>svg');await svg.waitFor();
 const radius=Number(await svg.locator(':scope>circle').first().getAttribute('r'));assert(radius>0);
 const expected=geoPath(geoOrthographic().translate([250,250]).scale(radius).rotate([-center.lon,-center.lat]))(australia)??'';
 await page.waitForFunction(({expected,name})=>[...document.querySelectorAll('.fallback-globe[data-model-mode="globe"]>svg>path')].find(e=>e.querySelector('title')?.textContent===name)?.getAttribute('d')===expected,{expected,name:australia.properties.name});
 const actual=await svg.evaluate((svg,name)=>{const e=[...svg.querySelectorAll(':scope>path')].find(p=>p.querySelector('title')?.textContent===name),r=e.getBBox();return{path:e.getAttribute('d'),box:{x:r.x,y:r.y,width:r.width,height:r.height}};},australia.properties.name);
 assert.equal(actual.path,expected);return{radius,expectedCenter:center,actualAustralianPath:actual.path,actualAustralianBounds:actual.box};
}
export async function fallbackSelectedFocusAndBookReturn(page,base,{shots=null,engine='chromium',width=page.viewportSize().width,native=false,captureCDP=null}={}){
 await page.goto(base+'/#book');await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
 const saved=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY),before=await saved();
 async function select(){await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true}).fill(place.name);await page.locator('[cmdk-item][data-value="place:daintree"]').click();await page.locator('.info-card').getByRole('heading',{name:place.name,exact:true}).waitFor();}
 await select();const direct=await actualCamera(page,{lat:place.lat,lon:place.lon});assert(direct.actualAustralianBounds.width>0);
 const opener=page.locator('[data-route-focus="globe-nature-book-daintree"]');await opener.focus();await page.keyboard.press('Enter');await page.locator('[data-nature-study-body="daintree"]').waitFor();await page.goBack();await opener.waitFor();
 await page.waitForFunction(()=>document.activeElement?.getAttribute('data-route-focus')==='globe-nature-book-daintree');assert.equal(await page.locator('.info-card h2').innerText(),place.name);const returned=await actualCamera(page,{lat:place.lat,lon:place.lon});assert.equal(returned.actualAustralianPath,direct.actualAustralianPath);
 let actualCapture=null;
 if(shots){const file=path.join(shots,`journey-engine-${engine}-fallback-selected-Daintree-return${native?'-native200':''}-${width}.png`);if(native){await page.locator('.fallback-globe>svg').evaluate(e=>e.scrollIntoView({block:'start'}));actualCapture=await captureNativeViewport(page,file,{cdp:captureCDP});assert(actualCapture.cssWidth===width&&actualCapture.cssHeight===475&&actualCapture.scale===2&&actualCapture.pixelWidth===width*2&&actualCapture.pixelHeight===950);}else await page.locator('.fallback-globe').screenshot({path:file,animations:'disabled'});}
 await page.getByRole('button',{name:'Ansicht zurücksetzen',exact:true}).click();const reset=await actualCamera(page,{lat:22,lon:16});assert.equal(reset.actualAustralianPath,'');
 await select();await actualCamera(page,{lat:place.lat,lon:place.lon});const svg=page.locator('.fallback-globe>svg'),original=await svg.innerHTML();await page.locator('.fallback-globe').focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(old=>document.querySelector('.fallback-globe>svg')?.innerHTML!==old,original);
 await page.getByRole('button',{name:'Ansicht zurücksetzen',exact:true}).click();await actualCamera(page,{lat:22,lon:16});
 const after=await saved();for(const key of['notes','favorites','favoritePlaces','settings','games','missions','labs','experiments','quizResults','quizSession','journeys','chapters','completedChapters','review','gameSessions'])assert.deepEqual(after[key],before[key],key+' preserved through selected-camera/back/reset use');
 return{width,native200:native,actualCapture,actualDirectSelectedPlaceCamera:true,actualBrowserBackSelectedCamera:true,actualLaterResetStillWorks:true,actualKeyboardRotationThenReset:true,entirePriorCriticalPassFieldsPreserved:true,direct,returned,reset};
}
