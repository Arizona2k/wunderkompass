import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {runBrowser,base,shots} from './runtime.mjs';
const source=await fs.readFile(new URL('../../app/world-index.ts',import.meta.url),'utf8');
const routes=vm.runInNewContext('('+source.match(/export const WORLD_ROUTES=(\[[\s\S]*?\]);/)[1]+')');
const topics=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const report={routes:[],errors:[],checks:[]};
await runBrowser(async browser=>{
 const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),p=await c.newPage();p.setDefaultTimeout(26000);p.on('pageerror',e=>report.errors.push(e.message));
 const ready=()=>p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
 await p.goto(base+'/#world');await ready();await p.locator('.world-choices').waitFor();
 for(const route of routes){
  await p.locator('.world-trip').filter({has:p.getByRole('heading',{name:route.title,exact:true})}).click();
  for(let i=0;i<route.topics.length;i++){
   const topic=topics.find(t=>t.id===route.topics[i]);assert.ok(topic);
   await p.getByRole('heading',{name:topic.title,exact:true}).waitFor();
   if(i===2){await p.reload();await ready();await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await p.getByRole('heading',{name:topic.title,exact:true}).waitFor();}
   if(!(await p.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),topic.id))){await p.locator('.world-mini-question .quiz-answer').filter({has:p.getByText(topic.question.answers[topic.question.correct],{exact:true})}).click();await p.waitForFunction(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),topic.id);}
   await p.getByRole('button',{name:i===route.topics.length-1?'Route abschließen':'Zur nächsten Station',exact:true}).click();
  }
  await p.getByRole('heading',{name:'Deine Wissensroute ist geschafft!',exact:true}).waitFor();await p.waitForFunction(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('route:'+id),route.id);report.routes.push(route.id);
  await p.getByRole('button',{name:'Eine neue Welt entdecken',exact:true}).click();await p.locator('.world-choices').waitFor();console.log('ROUTE COMPLETE',route.id);
 }
 assert.equal(report.routes.length,6);assert.deepEqual(report.errors,[]);report.checks.push('All six routes completed through actual questions; every route resumes its exact third station after reload.');await fs.writeFile(shots+'/routes-report.json',JSON.stringify(report,null,2));console.log('ALL ROUTES OK');await c.close();
});
