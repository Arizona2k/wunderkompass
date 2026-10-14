import {whyEngineFlow} from './why-learning.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';
import JOURNEYS from '../../exports/content/journeys.json' with {type:'json'};
import DATA from '../../app/journey-inquiries.json' with {type:'json'};
import {sourceDigest} from '../../scripts/handoff.mjs';
import {bookEngineFlow} from './book-excellence.mjs';
import {chromium,firefox,webkit} from '../../qa/node_modules/playwright/index.mjs';
const kinds=process.argv.includes('--chromium-pair')?['chromium','chromium']:process.argv.includes('--chromium-only')?['chromium']:['firefox','webkit'];
const serial=!process.argv.includes('--parallel')||process.argv.includes('--serial'),output=process.env.QA_ENGINE_OUTPUT_DIR??'.qa-output',port=Number(process.env.QA_ENGINE_PORT??4480);
if(!Number.isInteger(port)||port<1024||port>65534)throw Error('Invalid isolated engine port');
const report={build:(await fs.readFile('dist/index.html','utf8')).match(/name="learning-build" content="([^"]+)"/)?.[1],sourceDigest:await sourceDigest(),status:'running',scope:kinds.join('+'),scheduling:serial?'serial':'parallel isolated servers/profiles',engines:[],errors:[]};
await fs.mkdir(output,{recursive:true});const servers=new Set(),browsers=new Set(),started=performance.now();
process.once('SIGTERM',()=>{for(const server of servers)server.kill('SIGTERM');for(const browser of browsers)void browser.close();process.exitCode=143;});
async function runEngine(kind,offset){
 const name=kinds.filter(k=>k===kind).length>1?kind+'-'+(offset+1):kind,base='http://127.0.0.1:'+(port+offset),started=performance.now(),checked=[],errors=[];
 const server=spawn(process.execPath,['tests/browser/preview-server.mjs'],{env:{...process.env,QA_PORT:String(port+offset)},stdio:['ignore','pipe','pipe']});servers.add(server);let log='',browser;
 server.stdout.on('data',b=>log+=b);server.stderr.on('data',b=>log+=b);
 try{
  for(let n=0;n<40&&!log.includes('WK_PREVIEW_READY');n++){if(server.exitCode!==null)throw Error(log);await new Promise(r=>setTimeout(r,100));}assert.ok(log.includes('WK_PREVIEW_READY'),log);
  browser=await {chromium,firefox,webkit}[kind].launch({headless:true,...(kind==='chromium'&&process.env.QA_BROWSER_EXECUTABLE?{executablePath:process.env.QA_BROWSER_EXECUTABLE}:{}),args:kind==='chromium'?['--enable-unsafe-swiftshader']:[]});browsers.add(browser);
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(20000);await p.goto(base+'/#journeys');await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor();
  for(const j of JOURNEYS){await p.evaluate(id=>location.hash='journeys/'+id+'/1',j.id);const inquiry=p.locator('[data-chapter-inquiry="'+j.id+':0"]');await inquiry.waitFor();await p.getByText(j.steps[0].whyItMatters,{exact:true}).waitFor();for(const [name,value] of [['Ganz einfach · etwa 6–8 Jahre',j.steps[0].starter],['Noch genauer · etwa 12–14 Jahre',j.steps[0].deeper],['Selbst beobachten und erklären · freiwillig',j.steps[0].observe]]){const summary=p.locator('summary').filter({hasText:name}),details=summary.locator('..');assert.equal(await details.evaluate(e=>e.open),false,'detail starts closed');await summary.click();await p.getByText(value,{exact:true}).waitFor();assert.equal(await details.evaluate(e=>e.open),true,'detail opens');await summary.click();assert.equal(await details.evaluate(e=>e.open),false,'detail closes for the next chapter');await p.getByText(value,{exact:true}).waitFor({state:'hidden'});}const c=DATA.chapters.find(c=>c.id===j.id+':0'),q=c.tasks[2];await inquiry.locator('.journey-levels button').nth(2).click();await inquiry.locator('.quiz-answer').nth((q.correct+1)%3).click();assert.equal(await inquiry.getByText(q.why,{exact:true}).count(),0);await inquiry.locator('.quiz-answer').nth(q.correct).click();await inquiry.getByText(q.why,{exact:true}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);checked.push(c.id);}
  await p.evaluate(()=>location.hash='journeys/water/3');await p.locator('[data-chapter-inquiry="water:2"]').waitFor();await p.getByRole('button',{name:'Weiter entdecken',exact:true}).click();await p.locator('[data-chapter-inquiry="water:3"]').waitFor();await p.goBack();await p.locator('[data-chapter-inquiry="water:2"]').waitFor();await p.reload();await p.locator('[data-chapter-inquiry="water:2"]').waitFor();
  for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await p.locator('.journey-levels button').nth(1).focus();await p.screenshot({path:path.join(output,'journey-engine-'+name+'-'+width+'.png'),fullPage:true,animations:'disabled'});}
  await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.journey-reader',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[]);
  const bookProof=await bookEngineFlow(p,output,name),whyProof=await whyEngineFlow(p);
  assert.deepEqual(errors,[]);
  return {name,version:browser.version(),chapters:checked,widths:[320,390,768,1440],...bookProof,...whyProof,seconds:(performance.now()-started)/1000,port:port+offset};
 }finally{await browser?.close();if(browser)browsers.delete(browser);server.kill('SIGTERM');servers.delete(server);}
}
try{
 const outcomes=serial?await (async()=>{const results=[];for(const [i,kind] of kinds.entries()){try{results.push({status:'fulfilled',value:await runEngine(kind,i)});}catch(reason){results.push({status:'rejected',reason});}}return results;})():await Promise.allSettled(kinds.map(runEngine));
 for(const outcome of outcomes){if(outcome.status==='fulfilled')report.engines.push(outcome.value);else report.errors.push(outcome.reason?.stack??String(outcome.reason));}
 if(report.engines.length!==kinds.length||report.errors.length)throw Error('Incomplete or failed actual engine checks: '+report.errors.join('\n'));
 assert.equal(report.sourceDigest,await sourceDigest(),'source remains unchanged throughout engine checks');report.status='passed';
}catch(error){report.status='failed';report.failure=error.stack;throw error;}
finally{for(const browser of browsers)await browser.close();for(const server of servers)server.kill('SIGTERM');report.seconds=(performance.now()-started)/1000;await fs.writeFile(path.join(output,'engine-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));}
