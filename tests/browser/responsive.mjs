import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {runBrowser,base,shots} from './runtime.mjs';
const sizes=[[360,780],[375,812],[390,844],[430,932],[844,390],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080],[2560,1440]];
const readers=['animal-dromedary','history-maya','person-albert_einstein','invention-car','building-colosseum','science-solar-system','science-foodweb'];
const report=process.env.QA_RESUME?JSON.parse(await fs.readFile(shots+'/responsive-report.json','utf8')):{sizes,views:[],errors:[],consoleErrors:[],violations:[],overflow:[],images:[],smallTargets:[],checks:[]};
await runBrowser(async browser=>{
 const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),p=await c.newPage();p.setDefaultTimeout(25000);
 p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
 await p.goto(base);await p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await p.locator('.globe-render canvas,.fallback-globe svg').waitFor();
 await p.addScriptTag({path:'/workspace/scratch/42fc63e2bab5/earth-qa/node_modules/axe-core/axe.min.js'});
 async function inspect(id,axe=false,screen=false){
  await p.evaluate(()=>document.fonts.ready);
  const layout=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,skip:{focused:document.activeElement?.classList.contains('skip-link'),top:document.querySelector('.skip-link')?.getBoundingClientRect().top},small:[...document.querySelectorAll('button,a,input,select,[role="slider"]')].filter(e=>e.getClientRects().length&&!e.disabled&&!e.matches('.sr-only,.skip-link,[aria-hidden="true"]')&&!e.closest('[hidden]')&&!(e.closest('details:not([open])')&&!e.closest('summary'))&&!(e.tagName==='A'&&getComputedStyle(e).display==='inline')).map(e=>{const b=e.getBoundingClientRect();return {name:e.getAttribute('aria-label')||e.innerText?.trim().slice(0,50)||e.tagName,width:Math.round(b.width),height:Math.round(b.height)}}).filter(e=>e.width<24||e.height<24)}));
  report.views.push({id,...layout});if(layout.scroll>layout.width+2)report.overflow.push({id,...layout});if(layout.small.length)report.smallTargets.push({id,targets:layout.small});
  if(axe){if(!(await p.evaluate(()=>typeof window.axe==='object')))await p.addScriptTag({path:'/workspace/scratch/42fc63e2bab5/earth-qa/node_modules/axe-core/axe.min.js'});const r=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));if(r.violations.length)report.violations.push({id,rules:r.violations.map(v=>({rule:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
  if(screen){await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:shots+'/responsive-'+id+'.png',timeout:30000});}
 }
 const nav=async(name,selector)=>{await p.getByRole('tab',{name,exact:true}).click();await p.locator(selector).first().waitFor();};
 for(const [width,height] of process.env.QA_RESUME?[]:sizes){
  await p.setViewportSize({width,height});const suffix=width+'x'+height,audit=[360,768,1440].includes(width),screen=[360,390,768,1440].includes(width);
  await nav('Entdecken','.globe-stage');await inspect('home-'+suffix,audit,screen);
  const brand=p.locator('.brand');const brandBox=await brand.boundingBox(),rightBox=await p.locator('.header-right').boundingBox();assert.ok(brandBox.x+brandBox.width<=rightBox.x+2,suffix+' brand overlap');
  await p.getByRole('button',{name:'Erdschichten',exact:true}).click();await inspect('layers-'+suffix,audit);
  await p.getByRole('button',{name:'Tag & Nacht',exact:true}).click();await inspect('day-'+suffix);
  for(const [name,selector,key] of [['Lernreisen','.journey-tile','journeys'],['Spielplatz','.game-tile','games'],['Forscherlabor','.research-grid','labs'],['Wissensbuch','.word-card','book']]){
   await nav(name,selector);await inspect(key+'-'+suffix,audit,screen&&key==='journeys');
  }
  await p.evaluate(()=>location.hash='world');await p.locator('.world-choices').waitFor();await inspect('world-'+suffix,audit);
  if([360,390,768,1024,1440,1920].includes(width))for(const id of readers){
   await p.evaluate(id=>location.hash='world/topic/'+id,id);await p.locator('.world-mini-question').waitFor();
   for(const im of await p.locator('.world-article-main>.world-photo img').all()){await im.scrollIntoViewIfNeeded();assert.ok(await im.evaluate(async i=>{await i.decode().catch(()=>{});return i.complete&&i.naturalWidth>0;}),id+' image');report.images.push({id,width});}
   await inspect(id+'-'+suffix,audit,screen&&id==='person-albert_einstein');
  }
  await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.locator('.passport-dialog').waitFor();await inspect('pass-'+suffix,audit);await p.keyboard.press('Escape');
  await p.getByRole('button',{name:'Für Eltern & neugierige Köpfe',exact:true}).click();await p.getByRole('heading',{name:'Gemeinsam die Erde verstehen',exact:true}).waitFor();await inspect('parents-'+suffix,audit);await p.keyboard.press('Escape');
  await p.evaluate(()=>location.hash='world');await p.locator('.world-choices').waitFor();
  console.log('VIEWPORT',suffix,'views',report.views.length);await fs.writeFile(shots+'/responsive-report.json',JSON.stringify(report,null,2));
 }
 // Keyboard-only entry and dismissal: skip link, search dialog and a diagram hotspot.
 await p.reload();await p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();for(let i=0;i<20&&!(await p.locator('.skip-link').evaluate(e=>e===document.activeElement));i++)await p.keyboard.press('Shift+Tab');assert.ok(await p.locator('.skip-link').evaluate(e=>e===document.activeElement));await p.keyboard.press('Enter');await p.waitForFunction(()=>document.activeElement?.id==='learning-main');
 await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).focus();await p.keyboard.press('Enter');await p.getByRole('dialog').waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});assert.ok(await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).evaluate(e=>e===document.activeElement));
 await p.setViewportSize({width:1440,height:900});
 for(const name of ['Entdeckerpass öffnen','Hilfe öffnen','Für Eltern & neugierige Köpfe']){const opener=p.getByRole('button',{name,exact:true});await opener.focus();await p.keyboard.press('Enter');await p.getByRole('dialog').waitFor();if(name==='Für Eltern & neugierige Köpfe')await p.getByRole('heading',{name:'Gemeinsam die Erde verstehen',exact:true}).waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});await p.waitForFunction(label=>document.activeElement?.getAttribute('aria-label')===label||document.activeElement?.textContent?.trim()===label,name);}
 for(const width of [360,768,1440]){await p.setViewportSize({width,height:900});await p.getByRole('button',{name:'Für Eltern & neugierige Köpfe',exact:true}).click();await p.getByRole('heading',{name:'Gemeinsam die Erde verstehen',exact:true}).waitFor();await inspect('parents-corrected-'+width,true,width===360||width===1440);await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});}
 await p.setViewportSize({width:390,height:844});await p.getByRole('button',{name:'Für Eltern & neugierige Köpfe',exact:true}).click();await p.getByRole('heading',{name:'Gemeinsam die Erde verstehen',exact:true}).waitFor();await inspect('parents-corrected-390',true,true);await p.getByRole('button',{name:'So funktioniert die Lernwelt',exact:true}).click();await p.getByRole('heading',{name:'Einmal um die Welt, bitte!',exact:true}).waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});
 await p.evaluate(()=>location.hash='world/topic/invention-car');await p.locator('.blueprint-svg').waitFor();const hot=p.locator('.blueprint-svg [role="button"]').first();await hot.focus();await p.keyboard.press('Enter');
 report.checks.push('Keyboard: skip link, dialog focus return and SVG hotspot. OS reduced-motion preference used.');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.overflow,[]);assert.deepEqual(report.violations,[]);assert.deepEqual(report.smallTargets,[]);await fs.writeFile(shots+'/responsive-report.json',JSON.stringify(report,null,2));console.log('RESPONSIVE OK',report.views.length);await c.close();
});
