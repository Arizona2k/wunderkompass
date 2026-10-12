import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const budgets=JSON.parse(await fs.readFile(new URL('../../performance-budgets.json',import.meta.url),'utf8')).browser;
const routes=[['home','','#discovery-title'],['world','world','.world-choice'],['games','games','.game-tile'],['labs','labs','.research-tile'],['journeys','journeys','.journey-tile'],['book','book','.word-card'],['updates','updates','#updates-title']];

export async function performanceFlow(browser,base,ready,monitor,report){
 report.performance={method:'Production preview, fresh Chromium context, 390×844, reduced motion, no throttling. Pass ready + actual area control + 1200 ms observation. Three samples per area. Synthetic lab metrics, not field Core Web Vitals or a device guarantee.',budgets,samples:[]};
 for(let sample=0;sample<3;sample++)for(const [name,hash,selector] of routes){
  const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.addInitScript(()=>{window.__wkPerf={lcp:0,cls:0,longTaskMs:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__wkPerf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__wkPerf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.__wkPerf.longTaskMs+=e.duration;}).observe({type:'longtask',buffered:true});});
   const started=performance.now();await p.goto(base+(hash?'#'+hash:''));await ready(p);await p.locator(selector).first().waitFor();const readyMs=performance.now()-started;
   // Fixed observation window is part of the documented measurement, not a
   // substitute for readiness or acceptance of a timed-out user interaction.
   await p.waitForTimeout(1200);
   const metrics=await p.evaluate(()=>{const resources=performance.getEntriesByType('resource').map(r=>({file:new URL(r.name).pathname,bytes:r.decodedBodySize}));return {...window.__wkPerf,jsBytes:resources.filter(r=>r.file.endsWith('.js')).reduce((n,r)=>n+r.bytes,0),globe:resources.some(r=>/\/globe-/.test(r.file)),geometry:resources.some(r=>r.file==='/world.json'),resources,scrollY};});
   report.performance.samples.push({area:name,sample,readyMs,...metrics});
   assert.equal(metrics.globe,false,name+' must not preload the 3D globe');
   if(['home','world','updates'].includes(name))assert.equal(metrics.geometry,false,name+' does not need country polygons');
   assert.ok(metrics.jsBytes<=(name==='home'?budgets.homeJsBytes:budgets.areaJsBytes),name+' initial JS budget');
   assert.ok(metrics.cls<=(name==='home'?budgets.homeCls:budgets.areaCls),name+' layout shift budget: '+metrics.cls);
   assert.ok(readyMs<=budgets.readyMs,name+' ready-time budget');assert.ok(metrics.lcp>0&&metrics.lcp<=budgets.lcpMs,name+' observed LCP budget');
   assert.equal(metrics.scrollY,0,name+' direct entry must not steal scroll');
   if(name==='home'&&sample===0){await p.getByRole('button',{name:'Mit der Weltkugel starten',exact:true}).click();await p.locator('.globe-render canvas,.fallback-globe svg').first().waitFor();assert.ok(await p.evaluate(()=>performance.getEntriesByType('resource').some(r=>/\/globe-/.test(r.name))),'globe loads after real user demand');}
   if(name==='world'&&sample===0){assert.ok(!metrics.resources.some(r=>/world-reader-|world-topic-/.test(r.file)),'overview does not load article catalog/model renderer');await p.getByRole('button',{name:/Die Tierwelt/}).first().click();await p.locator('.world-topic-tile').first().click();await p.locator('#world-topic-title').waitFor();assert.ok(await p.evaluate(()=>performance.getEntriesByType('resource').some(r=>/world-reader-/.test(r.name))),'full reader loads for an actual card');await p.goBack();await p.locator('.world-topic-tile').first().waitFor();}
  }finally{await c.close();}
 }
 report.checks.push('Performance budgets across all seven entry areas: three fresh samples, no eager 3D/geodata/reader where unnecessary, bounded JS/LCP/CLS/readiness, real delayed globe/card demand and Back');
}

async function contracts(p){
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'responsive shell overflow');
 const data=await p.locator('[data-learning-component=grid]:visible').evaluateAll(grids=>grids.map(g=>{const style=getComputedStyle(g),cards=[...g.children].filter(c=>c.getClientRects().length).map(c=>{const r=c.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,overflow:c.scrollWidth>c.clientWidth+2};});return {gap:parseFloat(style.gap),display:style.display,cards};}));
 for(const grid of data){assert.equal(grid.display,'grid');assert.ok(grid.gap>=12,'shared spacing contract');for(const card of grid.cards){assert.ok(card.w>=44&&card.h>=44);assert.equal(card.overflow,false);}for(let i=0;i<grid.cards.length;i++)for(let j=i+1;j<grid.cards.length;j++){const a=grid.cards[i],b=grid.cards[j];assert.ok(a.x+a.w<=b.x+1||b.x+b.w<=a.x+1||a.y+a.h<=b.y+1||b.y+b.h<=a.y+1,'cards must not overlap');}}
 const small=await p.locator('.mode-tabs button:visible,[data-learning-component=details] summary:visible,.learning-status button:visible').evaluateAll(nodes=>nodes.filter(n=>{const r=n.getBoundingClientRect();return r.width<44||r.height<44;}).map(n=>n.textContent));assert.deepEqual(small,[],'shared 44px touch contract');
 return data;
}
async function accessibility(p,selector){
 if(!await p.evaluate(()=>!!window.axe))await p.addScriptTag({path:fileURLToPath(new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url))});
 const violations=await p.evaluate(async scope=>(await axe.run(scope,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),selector);
 assert.deepEqual(violations,[],'shared component WCAG checks '+selector);
}
export async function componentFlow(browser,base,ready,monitor,report,shots){
 report.componentViews=[];
 for(const [width,height] of [[320,720],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080]]){
  const c=await browser.newContext({viewport:{width,height},hasTouch:width<=390,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.goto(base+'#labs');await ready(p);await p.locator('.research-tile').first().waitFor();await contracts(p);if(width===320||width===1440)await accessibility(p,'.research-world');await p.screenshot({path:shots+'/foundation-labs-'+width+'.png'});
   await p.getByRole('tab',{name:'Wissenswelten',exact:true}).click();await p.locator('.world-trip').first().waitFor();await contracts(p);
   await p.getByRole('tab',{name:'Spielplatz',exact:true}).click();await p.locator('.game-tile').first().waitFor();
   const details=p.locator('.playground-guide'),summary=details.locator('summary');assert.equal(await details.getAttribute('open'),null);await p.keyboard.press('Tab');await summary.focus();await p.keyboard.press('Enter');assert.equal(await details.evaluate(e=>e.open),true);assert.equal(await summary.evaluate(e=>getComputedStyle(e).outlineStyle==='solid'&&parseFloat(getComputedStyle(e).outlineWidth)>=2),true,'native disclosure visible keyboard focus');
   await p.screenshot({path:shots+'/foundation-details-'+width+'.png'});await p.keyboard.press('Enter');assert.equal(await details.evaluate(e=>e.open),false);
   await p.getByLabel('Thema',{exact:true}).selectOption('Geschichte & Ideen');await p.getByLabel('Spielart',{exact:true}).selectOption('Paare merken');await p.locator('.learning-status[data-tone=empty]').waitFor();assert.equal(await p.locator('.learning-status[data-tone=empty]').getAttribute('role'),'status');await contracts(p);await p.screenshot({path:shots+'/foundation-empty-'+width+'.png'});await p.getByRole('button',{name:'Alle Spiele zeigen',exact:true}).click();await p.locator('.game-tile').first().waitFor();
   await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();
   if(width===320||width===1440){
    const control=p.getByRole('switch',{name:'Weniger Bewegung',exact:true}),initial=await control.getAttribute('aria-checked');
    const visual=()=>control.evaluate(el=>{const r=el.getBoundingClientRect(),thumb=el.querySelector('span').getBoundingClientRect(),css=getComputedStyle(el);return {width:r.width,height:r.height,thumbX:Number((thumb.x-r.x).toFixed(2)),thumbY:Number((thumb.y-r.y).toFixed(2)),thumbW:thumb.width,thumbH:thumb.height,background:css.backgroundColor,border:css.borderColor};});
    await control.click();await control.click();await control.screenshot({animations:'disabled',path:shots+'/foundation-switch-before-'+width+'.png'});const before=await visual();
    await control.click();await control.screenshot({animations:'disabled',path:shots+'/foundation-switch-changed-'+width+'.png'});assert.notDeepEqual(await visual(),before,'switch state visibly changes');
    await control.click();await control.screenshot({animations:'disabled',path:shots+'/foundation-switch-restored-'+width+'.png'});assert.equal(await control.getAttribute('aria-checked'),initial);assert.deepEqual(await visual(),before,'stable switch graphic geometry and colors return without accumulated displacement');
   }
   await p.getByRole('switch',{name:'Größere Schrift',exact:true}).click();await p.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();const geometry=await contracts(p);await p.screenshot({path:shots+'/foundation-large-'+width+'.png'});
   if(width===320||width===1440){await p.emulateMedia({forcedColors:'active'});await p.keyboard.press('Tab');await summary.focus();assert.equal(await summary.evaluate(e=>getComputedStyle(e).outlineStyle==='solid'),true);await p.screenshot({path:shots+'/foundation-system-'+width+'.png'});}
   report.componentViews.push({width,height,geometry,states:['labs','world routes','native details open/closed and keyboard focus','empty/reset','large text',...(width===320||width===1440?['system colors']:[])]});
  }finally{await c.close();}
 }
 // Exercise actual production loading/error/reload states by delaying/failing a
 // real lazy chunk. Intentional network rejection is isolated and documented.
 for(const fault of ['delay','error']){
  const c=await browser.newContext({viewport:{width:320,height:720},reducedMotion:'reduce'}),p=await c.newPage();let release;const gate=new Promise(r=>release=r);let first=true;
  await p.route('**/research-labs-*.js',async route=>{if(first){first=false;if(fault==='error'){await route.abort('failed');return;}await gate;}await route.continue();});
  try{await p.goto(base+'#labs');await ready(p);const status=p.locator('.learning-status[data-tone='+ (fault==='error'?'error':'loading')+']');await status.waitFor();assert.equal(await status.getAttribute('role'),fault==='error'?'alert':'status');await contracts(p);await p.screenshot({path:shots+'/foundation-'+fault+'-320.png'});if(fault==='delay')release();else await p.getByRole('button',{name:'Seite neu laden',exact:true}).click();await p.locator('.research-tile').first().waitFor();await contracts(p);}finally{release();await c.close();}
 }
 report.checks.push('Shared production component visual contracts at seven widths: responsive grids and no collisions, 44px controls, native details keyboard/open/closed, empty/reset, large text/system focus, real lazy loading/error/reload states; screenshots require separate human review');
}
