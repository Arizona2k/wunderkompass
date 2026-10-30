import path from 'node:path';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';

const ready=page=>page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))));
async function atHome(page,base){if(await page.evaluate(()=>location.hash)!=='#home')await page.goto(base+'/#home');await ready(page);await page.locator('.discovery-hero').waitFor();}
async function closeAndFocus(page,dialog,opener,close=null){
 await dialog.evaluate(e=>Promise.all(e.getAnimations().map(a=>a.finished.catch(()=>{}))));await page.waitForFunction(e=>e.contains(document.activeElement),await dialog.elementHandle());await settle(page);
 if(close)await dialog.getByRole('button',{name:close,exact:true}).click();else await page.keyboard.press('Escape');
 await dialog.waitFor({state:'detached'});await settle(page);
 assert(await opener.evaluate(e=>e===document.activeElement),'final close restores the actual external opener');
 assert(await opener.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'restored opener is visible without losing its page context');
}

export async function auditGuideReturnPage(page,base,{shots=null,engine='chromium',width=page.viewportSize().width}={}){
 await atHome(page,base);
 const footer=page.locator('.site-footer').getByRole('button',{name:'Für Begleitpersonen & neugierige Köpfe',exact:true});
 const header=page.getByRole('button',{name:'Hilfe öffnen',exact:true});
 const helpOpener=await header.count()?header:page.getByRole('button',{name:'So geht’s',exact:true});
 const parents=page.locator('.parent-guide'),help=page.locator('.help-dialog'),passport=page.locator('.passport-dialog');
 await footer.focus();await page.keyboard.press('Enter');await parents.waitFor();
 await parents.getByRole('button',{name:'So funktioniert die Lernwelt',exact:true}).click();await help.waitFor();
 await closeAndFocus(page,help,footer);
 if(shots)await footer.screenshot({path:path.join(shots,`journey-engine-${engine}-audit-guide-return-${width}.png`),animations:'disabled'});
 await helpOpener.focus();await page.keyboard.press('Enter');await help.waitFor();
 await help.getByRole('button',{name:'Für Eltern & Lehrkräfte',exact:true}).click();await parents.waitFor();
 await parents.getByRole('button',{name:'So funktioniert die Lernwelt',exact:true}).click();await help.waitFor();
 await closeAndFocus(page,help,helpOpener,'Los geht’s');
 await footer.click();await parents.waitFor();await parents.getByRole('button',{name:'Pass und Einstellungen öffnen',exact:true}).click();await passport.waitFor();
 await closeAndFocus(page,passport,footer);
 const passOpener=page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true});await passOpener.focus();await page.keyboard.press('Enter');await passport.waitFor();
 await closeAndFocus(page,passport,passOpener,'Entdeckerpass schließen');
 await footer.click();await parents.waitFor();await parents.getByRole('button',{name:'Gemeinsame Lernreise starten',exact:true}).click();await parents.waitFor({state:'detached'});await page.locator('.journey-reader').waitFor();await settle(page);
 assert.match(await page.evaluate(()=>location.hash),/^#journeys\//);
 assert.equal(await footer.evaluate(e=>e===document.activeElement),false,'intentional navigation does not restore the old guide opener');
 assert(await page.evaluate(()=>document.activeElement?.id==='learning-main'||!!document.activeElement?.closest('.journey-reader')),'new journey receives focus');
 return {width,footerParentHelpEscape:true,helpParentHelpClose:true,parentPassEscape:true,subsequentDirectPassUsesNewOrigin:true,intentionalJourneyReceivesFocus:true};
}

export async function auditFallbackLayerPage(page,base,{shots=null,engine='chromium',width=page.viewportSize().width}={}){
 if(await page.evaluate(()=>location.hash)!=='#layers')await page.goto(base+'/#layers');await ready(page);await page.getByRole('button',{name:'Ansicht zurücksetzen',exact:true}).click();const flat=page.locator('.fallback-globe[data-model-mode="layers"]');await flat.waitFor();
 const radii=()=>flat.locator('svg>circle').evaluateAll(es=>es.map(e=>Number(e.getAttribute('r'))));
 const initial=await radii();assert.equal(initial[0],205);
 assert.equal(await page.getByRole('button',{name:'Drehen & zoomen',exact:true}).count(),0,'flat cutaway offers no ineffective rotation gesture');
 const plus=page.getByRole('button',{name:'Weltkugel vergrößern',exact:true}),minus=page.getByRole('button',{name:'Weltkugel verkleinern',exact:true});
 for(let i=0;i<3;i++)await plus.click();await settle(page);const enlarged=await radii();assert(enlarged[0]>initial[0]);
 for(let i=0;i<10&&await plus.isEnabled();i++)await plus.click();assert(await plus.isDisabled());const maximum=await radii();assert(Math.abs(maximum[0]-240.7)<.001);
 for(let i=0;i<12&&await minus.isEnabled();i++)await minus.click();assert(await minus.isDisabled());const minimum=await radii();assert(Math.abs(minimum[0]-170.7)<.001);
 for(const values of [enlarged,maximum,minimum])for(let i=0;i<4;i++)assert(Math.abs(values[i]/values[0]-initial[i]/initial[0])<.000001,'zoom preserves every layer ratio');
 await page.getByRole('button',{name:'Ansicht zurücksetzen',exact:true}).click();assert.deepEqual(await radii(),initial);
 const layerButtons=await page.locator('.layers-list button').all();assert.equal(layerButtons.length,4);for(const button of layerButtons){await button.focus();await page.keyboard.press('Enter');assert.equal(await button.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.layer-info h2').innerText(),await button.locator('span').nth(1).innerText());}
 if(shots)await flat.screenshot({path:path.join(shots,`journey-engine-${engine}-audit-layer-zoom-${width}.png`),animations:'disabled'});
 if(await page.evaluate(()=>location.hash)!=='#globe')await page.goto(base+'/#globe');await ready(page);const normal=page.locator('.fallback-globe[data-model-mode="globe"]');await normal.waitFor();
 const coarse=await page.evaluate(()=>matchMedia('(pointer:coarse)').matches);assert(await (coarse?page.getByRole('button',{name:'Drehen & zoomen',exact:true}):page.locator('.stage-toolbar .gesture-hint')).isVisible(),'normal2D retains its actual pointer-appropriate control or gesture hint');
 const before=Number(await normal.locator('svg>circle').first().getAttribute('r'));await page.getByRole('button',{name:'Weltkugel vergrößern',exact:true}).click();const after=Number(await normal.locator('svg>circle').first().getAttribute('r'));assert(after>before,'normal2D positive zoom control remains effective');
 return {width,threePlusChangesActualGeometry:true,minimum:minimum[0],maximum:maximum[0],allLayerRatiosPreserved:true,reset49Preserved:true,allFourLayersKeyboardActivated:true,onlyFlatLayerRotationHidden:true,normal2DZoomStillEffective:true};
}

export async function auditCountryNamesPage(page,base,{shots=null,engine='chromium',width=page.viewportSize().width}={}){
 if(await page.evaluate(()=>location.hash)!=='#globe')await page.goto(base+'/#globe');await ready(page);await page.getByRole('button',{name:'Länder',exact:true}).click();const rows=[];
 for(const [name,expected]of [['Simbabwe',['Nord-Ndebele','Manyika','Simbabwe-Gold']],['Sierra Leone',['Mende','Temne','Sierra-leonischer Leone']],['Benin',['Fon','Anii']],['Burundi',['Rundi']]]){
  const combo=page.getByRole('combobox',{name:'Wohin möchtest du reisen?',exact:true});await combo.focus();await combo.press('ControlOrMeta+A');await combo.pressSequentially(name);await page.waitForFunction(name=>{const options=[...document.querySelectorAll('[role=option]')].filter(e=>e.getClientRects().length);return options.length===1&&options[0].textContent.trim()===name;},name);await page.locator('[data-slot=combobox-content]').evaluate(e=>Promise.all(e.getAnimations().map(a=>a.finished.catch(()=>{}))));await settle(page);await combo.press('ArrowDown');await page.waitForFunction(({label,name})=>{const input=document.querySelector('[role=combobox][aria-labelledby="'+label+'"]'),active=document.getElementById(input?.getAttribute('aria-activedescendant')??'');return active?.textContent.trim()===name;},{label:'place-picker-label',name});await combo.press('Enter');await page.getByRole('heading',{name,exact:true}).waitFor();
  const portrait=page.locator('.portrait-details').filter({has:page.getByText('Mehr über '+name,{exact:true})});if(!await portrait.evaluate(e=>e.open)){await portrait.locator(':scope>summary').focus();await page.keyboard.press('Enter');}await portrait.locator('dl').waitFor();const text=await portrait.innerText();for(const label of expected)assert(text.includes(label),name+' readable '+label);
  const facts=await portrait.locator('.country-facts>div').evaluateAll(es=>es.map(e=>({name:e.querySelector('dt')?.textContent,value:e.querySelector('dd')?.textContent})));
  assert(facts.some(f=>f.name==='Menschen · Schätzung 2024'));assert(facts.some(f=>f.name==='Fläche · 2023'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'all country names fit actual viewport');
  if(shots&&name==='Simbabwe')await portrait.screenshot({path:path.join(shots,`journey-engine-${engine}-audit-country-names-${width}.png`),animations:'disabled'});
  rows.push({name,readableNames:expected,referenceYearsUnchanged:true,facts});
 }
 return {width,countries:rows,oldFonAniiRundiPreserved:true};
}

export async function auditPassNavigationPage(page,{width=page.viewportSize().width}={}){
 const cases=[],coarse=await page.evaluate(()=>matchMedia('(pointer:coarse)').matches);
 const activate=async control=>{if(coarse)await control.tap();else{await control.focus();await page.keyboard.press('Enter');}};
 const opener=page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}),pass=page.locator('.passport-dialog');
 const home=async()=>{if(await page.evaluate(()=>location.hash)!=='#home')await activate(page.locator('.brand'));await page.locator('.discovery-hero').waitFor();};
 const open=async()=>{await activate(opener);await pass.waitFor();await pass.evaluate(e=>Promise.all(e.getAnimations().map(a=>a.finished.catch(()=>{}))));};
 const result=async(name,expected)=>{
  await pass.waitFor({state:'detached'});await settle(page);
  const actual=await page.evaluate(()=>({hash:location.hash,focusId:document.activeElement?.id,insideLearningMain:!!document.getElementById('learning-main')?.contains(document.activeElement)}));
  if(typeof expected==='string')assert.equal(actual.hash,expected,name+' target');else assert.match(actual.hash,expected,name+' target');
  assert.equal(await opener.evaluate(e=>e===document.activeElement),false,name+' does not restore the previous pass opener');
  assert(actual.insideLearningMain,name+' focuses the chosen learning view');cases.push({name,...actual});
 };
 assert.equal(await page.evaluate(()=>location.hash),'#globe');
 const selected=await page.locator('.info-card h2').innerText();
 await open();await activate(pass.locator('.pass-resume').getByRole('button',{name:'Fortsetzen',exact:true}));await page.getByRole('heading',{name:selected,exact:true}).waitFor();await result('resume-current-country-same-address','#globe');
 await home();await open();await activate(pass.getByRole('button',{name:'Im Wissensbuch öffnen',exact:true}));await page.locator('#research-note').waitFor();await result('saved-notes','#book/notes');
 await open();await activate(pass.getByRole('button',{name:'Im Wissensbuch öffnen',exact:true}));await page.locator('#research-note').waitFor();await result('saved-notes-same-address','#book/notes');
 await home();await open();await activate(pass.locator('.next-learning'));await page.locator('.journey-reader').waitFor();await result('saved-journey',/^#journeys\/planet\/\d+$/);
 await home();await open();const countries=pass.locator('.learning-map>details').last();if(!await countries.evaluate(e=>e.open))await activate(countries.locator(':scope>summary'));const country=countries.locator('.known-countries button').first();await country.waitFor();const countryName=await country.innerText();await activate(country);await page.getByRole('heading',{name:countryName,exact:true}).waitFor();await result('saved-country','#globe');
 const missions=async()=>{const details=pass.locator('.world-progress>details').first();if(!await details.evaluate(e=>e.open))await activate(details.locator(':scope>summary'));};
 await home();await open();await missions();await activate(pass.locator('.world-missions article').first().getByRole('button',{name:'Mission beginnen',exact:true}));await page.locator('#world-topic-title').waitFor();await result('world-mission-topic','#world/topic/animal-african-savanna-elephant');
 await home();await open();await missions();await activate(pass.locator('.world-missions article').nth(1).getByRole('button',{name:'Mission beginnen',exact:true}));await page.getByRole('heading',{name:'Sortiere die Zeit',exact:true}).waitFor();await result('world-mission-game','#games');
 await open();await missions();await activate(pass.locator('.world-missions article').nth(1).getByRole('button',{name:'Mission beginnen',exact:true}));await page.getByRole('heading',{name:'Sortiere die Zeit',exact:true}).waitFor();await result('world-mission-game-same-address','#games');
 await home();await open();const routes=pass.locator('.world-progress>details').last();if(!await routes.evaluate(e=>e.open))await activate(routes.locator(':scope>summary'));const route=routes.locator('.world-route-links button').first(),title=(await route.innerText()).trim();await activate(route);await page.getByRole('heading',{name:title,exact:true}).waitFor();await result('world-route',/^#world\/route\//);
 await open();await activate(pass.getByRole('button',{name:'Entdeckerpass schließen',exact:true}));await pass.waitFor({state:'detached'});await settle(page);assert(await opener.evaluate(e=>e===document.activeElement));assert(await opener.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}));
 return {width,inputMethod:coarse?'actual-browser-touch':'actual-keyboard',cases,allSevenPassNavigationCallbacks:true,sameAddressCountryNotesAndGame:true,subsequentCloseReturnsToFreshOpener:true};
}

export async function auditUiView(browser,base,{shots=null,engine='chromium'}={}){
 const proof={views:[],...browserErrorArrays()};
 for(const {width,motion,large}of [{width:320,motion:'reduce',large:true},{width:1440,motion:'no-preference',large:false}]){
  const context=await browser.newContext({viewport:{width,height:950},reducedMotion:motion,hasTouch:width===320}),pass=createSave();pass.progress.settings.largeText=large;pass.progress.settings.reducedMotion=motion==='reduce';pass.progress.notes=[{id:'synthetic-audit-ui-note',text:'Synthetische erhaltene Bediennotiz.',at:'2026-10-28T00:00:00.000Z'}];
  await context.addInitScript(({key,pass})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...args){return String(kind).startsWith('webgl')?null:original.call(this,kind,...args);};},{key:SAVE_KEY,pass});
  const page=await context.newPage();page.setDefaultTimeout(26000);monitorBrowserErrors(page,base,proof);const geographyRequests=[];page.on('request',r=>{if(/\/country-portrait-[^/]+\.js(?:\?|$)/.test(r.url()))geographyRequests.push(r.url());});
  try{
   await atHome(page,base);const initial=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.equal(geographyRequests.length,0,'secondary geography module is not requested by Home');
   const guide=await auditGuideReturnPage(page,base,{shots,engine,width});
   const fallback=await auditFallbackLayerPage(page,base,{shots,engine,width});
   const countries=await auditCountryNamesPage(page,base,{shots,engine,width});assert.equal(geographyRequests.length,0,'country details use the existing immediate code path and introduce no independent request that can fail');
   const passNavigation=await auditPassNavigationPage(page,{width});
   const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);for(const key of ['notes','favorites','review','settings','games','journeys'])assert.deepEqual(after[key],initial[key],key+' preserved through actual UI changes');
   proof.views.push({width,motion,large,guide,fallback,countries,passNavigation,noIndependentHomeGeographyRequest:true,countryDetailsWithoutAdditionalModuleRequest:true,syntheticPersonalFieldsPreserved:true});
  }catch(error){if(shots){await page.screenshot({path:path.join(shots,`journey-engine-${engine}-audit-ui-original-failure-${width}.png`),fullPage:true}).catch(()=>{});const original=await page.evaluate(()=>({url:location.href,focus:{tag:document.activeElement?.tagName,id:document.activeElement?.id},inputs:[...document.querySelectorAll('input[role=combobox]')].map(e=>({value:e.value,attributes:Object.fromEntries([...e.attributes].map(a=>[a.name,a.value]))})),options:[...document.querySelectorAll('[role=option]')].filter(e=>e.getClientRects().length).map(e=>({text:e.textContent,id:e.id,attributes:Object.fromEntries([...e.attributes].map(a=>[a.name,a.value]))}))})).catch(e=>({diagnosticFailure:String(e)}));await fs.writeFile(path.join(shots,`journey-engine-${engine}-audit-ui-original-failure-${width}.json`),JSON.stringify({error:error.stack,original,errors:proof},null,2)+'\n');}throw error;}
  finally{await context.close();}
 }
 assert(browserErrorsComplete(proof));return proof;
}
