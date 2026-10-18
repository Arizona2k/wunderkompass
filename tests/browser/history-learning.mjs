import {retainedHistoryLearningFlow,offlineRetainedHistoryLearning,nativeRetainedHistoryLearning} from './retained-history-learning.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
const topics=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8')).filter(t=>['history-khipu','history-mohenjo-daro'].includes(t.id));
async function checkGeometry(p){
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'history learning model has no page overflow');
 const bad=await p.getByRole('region',{name:'Geschichtsdetektiv'}).evaluate(el=>{const found=[],walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects())if(r.width&&(r.left< -2||r.right>innerWidth+2))found.push(n.textContent);}return found;});assert.deepEqual(bad,[],'actual diagram labels/tasks are within the viewport');
}
async function explore(p,t,{touch=false}={}){
 const activity=p.getByRole('region',{name:'Geschichtsdetektiv'});
 await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 for(let level=0;level<3;level++){
  const tier=activity.getByRole('group',{name:'Freiwillige Denkstufe'}).getByRole('button').nth(level);if(level===2){const previousTier=activity.getByRole('group',{name:'Freiwillige Denkstufe'}).getByRole('button').nth(level-1);await previousTier.focus();await p.keyboard.press('Tab');assert.equal(await tier.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')),true,'real Tab reaches the third level with a visible keyboard focus');await p.keyboard.press('Enter');assert.equal(await tier.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')),true,'keyboard activation retains its visible focus');}else if(touch)await tier.tap();else await tier.click();assert.equal(await tier.getAttribute('aria-pressed'),'true');
  if(t.id==='history-khipu'){
   await activity.getByRole('combobox',{name:'Erste Menge',exact:true}).selectOption('2');await activity.getByRole('combobox',{name:'Zweite Menge',exact:true}).selectOption('6');await activity.getByRole('img',{name:'Erfundene Zählschnüre: erste Menge 2, zweite Menge 6.'}).waitFor();
   const toggle=activity.getByRole('button',{name:/Bedeutung ausblenden|Unsere Vereinbarung zeigen/});await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),String(level%2===0));
  }else{
   const toggle=activity.getByRole('button',{name:/Vergleichsplan öffnen|Plan mit Verbindung öffnen/});await toggle.click();await activity.getByRole('img',{name:level%2===0?'Erfundener Vergleichsplan: Der Wasserweg endet vor dem Kanal.':'Erfundener Plan mit eingezeichnetem Ablauf vom Haus in den Kanal.'}).waitFor();
  }
  await activity.getByRole('button',{name:'Meine Überlegung vergleichen',exact:true}).click();await activity.getByRole('status').waitFor();await checkGeometry(p);for(const control of await activity.locator('button,select').all()){const box=await control.boundingBox();const witness=await control.evaluate(el=>{const css=getComputedStyle(el);return {tag:el.tagName,label:el.getAttribute('aria-label')??el.textContent,fontSize:css.fontSize,minWidth:css.minWidth,minHeight:css.minHeight,appearance:css.appearance};});assert.ok(box&&box.width>=44&&box.height>=44,'history control has a real44px touch target: '+JSON.stringify({topic:t.id,level,box,...witness}));}
 }
}
export async function historyLearningFlow(browser,base,ready,monitor,report,shots){
 await retainedHistoryLearningFlow(browser,base,ready,monitor,report,shots);
 const observed=[],oldWriting=[];
 for(const width of [320,360,390,768,1024,1440,1920]){
  const c=await browser.newContext({viewport:{width,height:width<768?844:1000},reducedMotion:'reduce',hasTouch:width<768}),p=await c.newPage();monitor(p);
  try{for(const t of topics){
   await p.goto(base+'#world/topic/'+t.id);await ready(p);await p.locator('.world-mini-question').waitFor();await p.getByRole('navigation',{name:'In dieser Entdeckerkarte'}).getByRole('button',{name:/Ausprobieren/}).click();assert.equal(await p.getByRole('region',{name:'Geschichtsdetektiv'}).evaluate(el=>el===document.activeElement),true);await explore(p,t,{touch:width<768});
   const q=p.locator('.world-mini-question');await q.getByRole('button').filter({hasText:t.question.answers[1]}).click();await q.getByText(t.questionFeedback.wrongReasons[1],{exact:true}).waitFor();await q.getByRole('button').filter({hasText:t.question.answers[t.question.correct]}).click();await q.getByText(t.question.why,{exact:true}).waitFor();
   await p.getByRole('region',{name:'Geschichtsdetektiv'}).screenshot({path:path.join(shots,t.id+'-'+width+'.png')});await p.reload();await ready(p);await p.locator('.world-mini-question').getByText(t.question.why,{exact:true}).waitFor();
   const other=t.related[0],focus='world-connection-'+t.id+'-'+other,link=p.locator('[data-route-focus="'+focus+'"]');await link.focus();await p.keyboard.press('Enter');await p.waitForURL('**/#world/topic/'+other);await p.goBack();await p.waitForFunction(value=>document.activeElement?.dataset.routeFocus===value,focus);await checkGeometry(p);
   await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();const dialog=p.getByRole('dialog');await dialog.locator('input').fill(t.id==='history-khipu'?'Khipus':'Mohenjo');await dialog.getByRole('option').filter({hasText:t.title}).first().click();await p.locator('#world-topic-title').waitFor();assert.equal(new URL(p.url()).hash,'#world/topic/'+t.id);
   observed.push({id:t.id,width,levels:3,realControls:true,feedback:true,reload:true,search:true,backFocus:true});
  }
  if(width===320||width===1440){
   const old=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8')).find(t=>t.id==='history-writing');
   await p.goto(base+'#world/topic/'+old.id);await p.locator('.world-mini-question').waitFor();
   for(const summary of await p.locator('.world-short details summary').all())await summary.click();
   await p.getByText(old.learning.starter,{exact:true}).waitFor();await p.getByText(old.learning.observe,{exact:true}).waitFor();
   const question=p.locator('.world-mini-question');for(const index of [1,2]){await question.getByRole('button').filter({hasText:old.question.answers[index]}).click();await question.getByText(old.questionFeedback.wrongReasons[index],{exact:true}).waitFor();}
   await question.screenshot({path:path.join(shots,'history-writing-feedback-'+width+'.png')});await question.getByRole('button').filter({hasText:old.question.answers[0]}).click();await p.reload();await p.locator('.world-mini-question').getByText(old.question.why,{exact:true}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   const oldFocus='world-related-'+old.id+'-'+old.related[0];await p.locator('[data-route-focus="'+oldFocus+'"]').focus();await p.keyboard.press('Enter');await p.waitForURL('**/#world/topic/'+old.related[0]);await p.goBack();await p.waitForFunction(value=>document.activeElement?.dataset.routeFocus===value,oldFocus);
   await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();const search=p.getByRole('dialog');await search.locator('input').fill(old.title);await search.getByRole('option').filter({hasText:old.title}).first().click();await p.locator('.world-mini-question').waitFor();assert.equal(new URL(p.url()).hash,'#world/topic/history-writing');oldWriting.push({width,levels:true,bothWrongReasons:true,retainedCorrectAnswer:true,reload:true,search:true,backFocus:true});
   await p.goto(base+'#world/topic/history-mohenjo-daro');await p.locator('.world-mini-question').waitFor();
  }
  await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('button',{name:'Pass sichern',exact:true}).click();await p.getByRole('switch',{name:'Größere Schrift',exact:true}).click();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});await checkGeometry(p);
  await p.getByRole('region',{name:'Geschichtsdetektiv'}).screenshot({path:path.join(shots,'history-large-'+width+'.png')});
  await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});assert.deepEqual(await p.evaluate(async()=>{const r=await window.axe.run({include:[['.world-article']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));}),[]);
  }finally{await c.close();}
 }
 report.historyLearning={observed,oldWriting};report.checks.push('Two new historical sources at seven widths: three distinct observation/compare/limits tasks, actual vector controls, wrong/right/reload, global search and reciprocal Back focus; large text/axe');
}
export async function offlineHistoryLearning(p,report){
 await offlineRetainedHistoryLearning(p,report);
 for(const t of topics){await p.evaluate(id=>location.hash='world/topic/'+id,t.id);await p.locator('.world-mini-question').waitFor();await explore(p,t);}
 const old=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8')).find(t=>t.id==='history-writing');
 await p.evaluate(()=>location.hash='world/topic/history-writing');await p.locator('.world-mini-question').waitFor();for(const summary of await p.locator('.world-short details summary').all())await summary.click();await p.getByText(old.learning.starter,{exact:true}).waitFor();await p.getByText(old.learning.observe,{exact:true}).waitFor();
 const question=p.locator('.world-mini-question');for(const index of [1,2]){await question.getByRole('button').filter({hasText:old.question.answers[index]}).click();await question.getByText(old.questionFeedback.wrongReasons[index],{exact:true}).waitFor();}await question.getByRole('button').filter({hasText:old.question.answers[0]}).click();await p.reload();await p.locator('.world-mini-question').getByText(old.question.why,{exact:true}).waitFor();
 report.historyWritingOffline={starter:true,observation:true,bothWrongReasons:true,retainedAnswer:true,reload:true};
 report.checks.push('Both previously unopened historical sources and their interactive learning pictures work after actual cold offline restart');
}
export async function historyLearningEngine(browser,base,{engine,shots}){
 const observed=[];
 for(const width of [320,1440]){
  const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage();
  let currentTopic;
  try{for(const t of topics){currentTopic=t.id;await p.goto(base+'#world/topic/'+t.id);await p.locator('.world-mini-question').waitFor();await explore(p,t);await p.getByRole('region',{name:'Geschichtsdetektiv'}).screenshot({path:path.join(shots,'journey-engine-'+engine+'-history-'+t.id+'-'+width+'.png')});observed.push({id:t.id,width,levels:3});}}
  catch(error){
   const prefix='journey-engine-'+engine+'-history-failure-'+width;
   const witness=await p.evaluate(()=>({activeTag:document.activeElement?.tagName,activeText:document.activeElement?.textContent,focusVisible:document.activeElement?.matches(':focus-visible'),pressed:document.activeElement?.getAttribute('aria-pressed'),controls:[...document.querySelectorAll('.history-evidence button,.history-evidence select')].map(el=>{const r=el.getBoundingClientRect(),css=getComputedStyle(el);return {tag:el.tagName,label:el.getAttribute('aria-label')??el.textContent,box:{x:r.x,y:r.y,width:r.width,height:r.height},fontSize:css.fontSize,minWidth:css.minWidth,minHeight:css.minHeight,appearance:css.appearance};})})).catch(()=>null);
   await p.screenshot({path:path.join(shots,prefix+'.png'),fullPage:true}).catch(()=>{});
   await fs.writeFile(path.join(shots,prefix+'.json'),JSON.stringify({engine,width,topic:currentTopic,route:p.url(),witness,error:error.stack},null,2)+'\n');throw error;
  }finally{await c.close();}
 }
 const retained={checks:[]},errors=[];await retainedHistoryLearningFlow(browser,base,p=>p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor(),p=>p.on('pageerror',e=>errors.push(e.message)),retained,shots,{widths:[320,1440]});assert.deepEqual(errors,[]);observed.push(...retained.retainedHistoryLearning.observed.map(e=>({...e,retainedOldArticle:true})));
 return observed;
}
export async function nativeHistoryLearning(p,base,report,capture){
 await nativeRetainedHistoryLearning(p,base,report,capture);
 const observed=[];
 for(const t of topics){await p.goto(base+'#world/topic/'+t.id);await p.locator('.world-mini-question').waitFor();assert.deepEqual(await p.evaluate(()=>({width:innerWidth,scale:devicePixelRatio})),{width:640,scale:2});await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));await explore(p,t);const activity=p.getByRole('region',{name:'Geschichtsdetektiv'});await activity.locator('h3').evaluate(el=>el.scrollIntoView({block:'start'}));await capture('history-learning-native-'+t.id+'-top.png');await activity.locator('figure').evaluate(el=>el.scrollIntoView({block:'start'}));await capture('history-learning-native-'+t.id+'-diagram.png');await activity.locator('.model-buttons').last().evaluate(el=>el.scrollIntoView({block:'start'}));await capture('history-learning-native-'+t.id+'-controls.png');observed.push(t.id);}
 report.historyLearningNative={percent:200,scale:2,largeText:true,observed};report.checks.push('Both historical learning pictures at actual native200% plus large text: all three levels and real controls');
}
