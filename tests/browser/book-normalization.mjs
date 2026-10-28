import {bookLightView} from './book-light.mjs';
import {bookHeatView} from './book-heat.mjs';
import {bookMeasurementView} from './book-measurements.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {geoEqualEarth} from 'd3-geo';
const precision=JSON.parse(await fs.readFile(new URL('../../content/book-nature-precision-review.json',import.meta.url),'utf8')).claims;
const state=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
export async function bookPrecisionView(page,report,width,{full=true,shots=null}={}){
 const original=await state(page),initial=await page.evaluate(()=>location.hash),proof={width,words:[],nature:[]};
 const checkNotes=async(card,claim,summary)=>{
  const control=card.locator('summary').filter({hasText:summary});await control.focus();await page.keyboard.press('Enter');await card.locator('details[open] .geography-notes').waitFor();
  assert.deepEqual(await card.locator('.geography-notes a').evaluateAll(links=>links.map(link=>link.href)),claim.sources.map(source=>source.url));
  assert.ok((await card.locator('.geography-notes a').evaluateAll(links=>links.map(link=>getComputedStyle(link).textDecorationLine))).every(decoration=>decoration.includes('underline')),'source links are visually identifiable');
  const bounds=await control.evaluate(e=>{const r=e.getBoundingClientRect();return {height:r.height,left:r.left,right:r.right,width:innerWidth};});assert.ok(bounds.height>=44&&bounds.left>=-1&&bounds.right<=bounds.width+1,'source disclosure has a reachable mobile target');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'readable source notes reflow');
 };
 for(const claim of precision.filter(row=>row.scope==='word')){
  await page.evaluate(term=>location.hash='book/words/'+term,claim.id);const query=page.getByRole('textbox',{name:'Wissenswörter durchsuchen',exact:true});await page.waitForFunction(term=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value===term,claim.id);
  const card=page.locator('.word-card').filter({has:page.getByRole('heading',{name:claim.id,exact:true})});await card.getByText(claim.after[2],{exact:true}).waitFor();await checkNotes(card,claim,'Quellen zur Erklärung');
  for(const button of await card.locator('.speech-button').all()){const bounds=await button.boundingBox();assert.ok(bounds?.width>=44&&bounds.height>=44,'word actions retain readable44px targets');}
  if(shots&&['Gestein','Grundwasser'].includes(claim.id))await card.screenshot({path:shots+'/word-'+claim.id+'-'+width+'.png',animations:'disabled'});
  proof.words.push({id:claim.id,sourceLinksAndReviewedExplanation:true});
 }
 await page.getByRole('tab',{name:'Naturatlas',exact:true}).click();
 for(const claim of precision.filter(row=>row.scope==='nature'&&(full||row.id==='vostok'))){
  const card=page.locator('.atlas-country').filter({has:page.getByRole('heading',{name:claim.after.name,exact:true})});
  if(!await card.count())await page.getByRole('button',{name:'Weitere Naturorte entdecken',exact:true}).click();
  await card.getByText(claim.after.text,{exact:true}).waitFor();await checkNotes(card,claim,'Einordnung und Quellen');
  if(claim.id==='vostok'){
   const expected=geoEqualEarth().fitExtent([[48,48],[752,370]],{type:'Sphere'})([106.8,-78.46667]);const marker=await card.locator('.topic-map-marker').evaluate(e=>{const m=e.transform.baseVal.consolidate().matrix;return [m.e,m.f];});assert.ok(Math.hypot(marker[0]-expected[0],marker[1]-expected[1])<.05,'actual SVG marker depicts the registered station');
  }
  if(shots)await card.screenshot({path:shots+'/nature-'+claim.id+'-'+width+'.png',animations:'disabled'});
  const opener=card.getByRole('button',{name:'Auf der Weltkugel finden',exact:true});await opener.focus();await page.keyboard.press('Enter');const place=page.locator('.info-card.has-place');await place.getByRole('heading',{name:claim.after.name,exact:true}).waitFor();await place.getByText(claim.after.text,{exact:true}).waitFor();assert.deepEqual(await place.locator('.geography-notes a').evaluateAll(links=>links.map(link=>link.href)),claim.sources.map(source=>source.url));await page.goBack();await page.getByRole('tab',{name:'Naturatlas',exact:true}).click();
  proof.nature.push({id:claim.id,reviewedExplanationSourceLinksAndActualGlobe:true,stationMarkerChecked:claim.id==='vostok'});
 }
 const saved=await state(page);for(const key of ['notes','favorites','games','journeys','review','settings','favoritePlaces'])assert.deepEqual(saved[key],original[key],'precision views preserve existing '+key);for(const [id,value]of Object.entries(original.gameSessions))assert.deepEqual(saved.gameSessions[id],value);
 await page.evaluate(hash=>location.hash=hash,initial);(report.bookPrecision??=[]).push(proof);return proof;
}
export async function bookNormalizationView(page,report,width,{measurement=false,shots=null,engine='chromium',native=false}={}){
 const original=await state(page),initial=await page.evaluate(()=>location.hash);report.bookNormalization??=[];
 await page.evaluate(()=>location.hash='book/words/Schwerkraft');const query=page.getByRole('textbox',{name:'Wissenswörter durchsuchen',exact:true});await page.waitForFunction(()=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value==='Schwerkraft');
 for(const[term,title]of[['AQUATOR','Äquator'],['SUSSWASSER','Süßwasser']]){await query.fill(term);await page.locator('.word-card').getByRole('heading',{name:title,exact:true}).waitFor();report.bookNormalization.push({width,query:term,canonicalWord:title,commonNormalization:true});}
 await query.fill('Schwerkraft');const card=page.locator('.word-card').filter({has:page.getByRole('heading',{name:'Schwerkraft',exact:true})}),topic=card.getByRole('button',{name:'Wie Anziehung das Meer bewegt →',exact:true});await topic.waitFor();await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));await topic.focus();await page.keyboard.press('Enter');await page.waitForURL('**/#world/topic/science-tides');await page.locator('.world-article').getByRole('heading',{name:'Der Mond bewegt das Meer',exact:true}).waitFor();await page.getByText('Die Anziehung des Mondes wirkt auf verschiedene Teile der Erde unterschiedlich stark. Zusammen mit dem Einfluss der Sonne entstehen Gezeitenkräfte.',{exact:true}).waitFor();await page.goBack();await card.waitFor();await page.waitForFunction(()=>document.activeElement?.getAttribute('data-route-focus')==='book-word-Schwerkraft-topic');assert.equal(await query.inputValue(),'Schwerkraft');
 const journey=card.getByRole('button',{name:'In einer Lernreise ausprobieren →',exact:true});await journey.focus();await page.keyboard.press('Enter');await page.locator('[data-chapter-inquiry="planet:0"]').waitFor();await page.goBack();await card.waitFor();await page.waitForFunction(()=>document.activeElement?.getAttribute('data-route-focus')==='book-word-Schwerkraft-journey');assert.equal(await query.inputValue(),'Schwerkraft');report.bookNormalization.push({width,word:'Schwerkraft',actualGravityExample:'science-tides',actualPlanetJourney:true,keyboardBackFocusAndQueryPreserved:true});
 await page.getByRole('tab',{name:'Kleiner Atlas',exact:true}).click();await page.getByRole('textbox',{name:'Länderwissen durchsuchen',exact:true}).fill('brasilia');const brazil=page.locator('.atlas-country').filter({has:page.getByRole('heading',{name:'Brasilien',exact:true})});await brazil.waitFor();assert.equal(await brazil.locator('.atlas-capital strong').innerText(),'Brasília');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);report.bookNormalization.push({width,query:'brasilia',canonicalCapital:'Brasília',commonNormalization:true});
 const saved=await state(page);for(const key of ['notes','favorites','games','journeys','review','settings'])assert.deepEqual(saved[key],original[key],'book search and link navigation preserve existing state: '+key);for(const[id,value]of Object.entries(original.gameSessions))assert.deepEqual(saved.gameSessions[id],value,'existing round retained: '+id);await page.evaluate(hash=>location.hash=hash,initial);await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));
 if(width===320)await bookPrecisionView(page,report,width,{full:false});
 if(measurement){await bookMeasurementView(page,report,width,{shots,engine,large:true,native,offline:true});await bookHeatView(page,report,width,{shots,engine,large:true,native,offline:true});await bookLightView(page,report,width,{shots,engine,large:true,native,offline:true});}
 report.checks.push('Book at'+width+': shared accent/ss normalization in words and atlas; gravity points to actual tidal attraction with explained label; real topic/journey keyboard return focus and typed word, old notes/favorites/rounds/reviews retained');
}
