import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {runBrowser,base,shots} from './runtime.mjs';
const topics=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8')),data=JSON.parse(await fs.readFile(new URL('../fixtures/learning.json',import.meta.url),'utf8'));
const report={topics:[],chapters:[],images:[],errors:[],requests:[],comparisons:[]};
await runBrowser(async browser=>{
 const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.requests.push({status:r.status(),url:r.url()});});
 await p.goto(base);await p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
 for(const t of topics){
  await p.evaluate(id=>{location.hash='world/topic/'+id;},t.id);await p.getByRole('heading',{name:t.title,exact:true}).waitFor();
  if(t.history?.sensitive)await p.getByRole('button',{name:'Die Erklärung anschauen',exact:true}).click();
  await p.locator('.world-short').waitFor();await p.locator('.world-more summary').click();assert.ok(await p.locator('.world-more>p').count()>=2,t.id);
  if(t.image){await p.locator('.world-article-main>.world-photo').scrollIntoViewIfNeeded();await p.waitForFunction(()=>{const im=document.querySelector('.world-article-main>.world-photo img');return im?.complete&&im.naturalWidth>0;});report.images.push(t.id);}
  if(t.invention){const initial=await p.locator('.technology-picture svg').innerHTML();await p.getByRole('button',{name:'Heute',exact:true}).click();const changed=await p.locator('.technology-picture svg').innerHTML();assert.notEqual(initial,changed,t.id+' comparison');report.comparisons.push(t.id);for(const part of t.invention.parts)await p.locator('.blueprint-parts').getByRole('button',{name:new RegExp(part.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).click();}
  await p.locator('.world-mini-question .quiz-answer').filter({has:p.getByText(t.question.answers[t.question.correct],{exact:true})}).click();await p.locator('.world-mini-question').getByText('Gut erklärt!',{exact:true}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,t.id+' overflow');report.topics.push(t.id);
  if(['animal-polar-bear','person-albert_einstein','invention-car','building-giza-pyramids','science-shadows'].includes(t.id))await p.screenshot({path:shots+'/content-'+t.id+'.png',fullPage:true});
  if(report.topics.length%15===0)console.log('CARDS',report.topics.length);
 }
 for(const j of data.JOURNEYS){await p.getByRole('tab',{name:'Lernreisen',exact:true}).click();await p.locator('.journey-tile').filter({has:p.getByRole('heading',{name:j.title,exact:true})}).click();for(let step=0;step<j.steps.length;step++){await p.locator('.journey-outline li button').nth(step).click();await p.locator('#journey-title').getByText(j.steps[step].title,{exact:true}).waitFor();if(step>0){const diagram=p.locator('[data-chapter-visual]');await diagram.waitFor();const before=await diagram.locator('.diagram-explanation').innerText();await diagram.getByRole('button').last().click();assert.notEqual(await diagram.locator('.diagram-explanation').innerText(),before,j.id+step);}else assert.ok(await p.locator('.journey-visual,.chapter-photo').count()>0,j.id+' intro visual');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,j.id+step);report.chapters.push(j.id+':'+step);if(step===2)await p.screenshot({path:shots+'/chapter-'+j.id+'.png',fullPage:true});}await p.getByRole('button',{name:'Alle Lernreisen',exact:true}).click();console.log('JOURNEY',j.id);}
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.requests,[]);await fs.writeFile(shots+'/content-report.json',JSON.stringify(report,null,2));console.log('CONTENT OK',report.topics.length,report.chapters.length,report.comparisons.length);await c.close();
});
