import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
export const opticsTopics=catalog.filter(t=>['invention-camera','invention-telescope','invention-microscope'].includes(t.id));
assert.equal(opticsTopics.length,3);
const reveal=async d=>{if(!await d.evaluate(e=>e.open))await d.locator(':scope > summary').click();};
async function geometry(page,article){
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'optical article reflow');
 const bad=await article.evaluate(root=>{const bad=[];for(const el of root.querySelectorAll('h2,h3,h4,p,summary,button,figcaption,small,.part-name,.story-step-label')){if(!el.getClientRects().length||el.closest('details:not([open])')&&!el.closest('summary'))continue;const r=el.getBoundingClientRect();if(r.width&&(r.left< -2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+2))bad.push(el.tagName+':'+el.textContent.slice(0,80));}return bad;});assert.deepEqual(bad,[],'visible optical text and controls fit');
 for(const button of await article.locator('.story-stations button,.part-button,[data-invention-experiment] button').all()){const r=await button.boundingBox();if(r)assert.ok(r.width>=44&&r.height>=44,'optical control has an actual44px touch target');}
}
export async function opticsSourceView(page,{width,shots,engine='chromium',native=false,questions=false,touch=false}={}){
 const initial=await page.evaluate(()=>location.hash),observed=[];let complete=false;
 try{for(const t of opticsTopics){
  await page.evaluate(id=>location.hash='world/topic/'+id,t.id);const article=page.locator('.article-inventions');await article.getByRole('heading',{name:t.title,exact:true}).waitFor();const question=article.locator('.world-mini-question');await question.waitFor();
  const before=await page.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),t.id);
  for(const d of await article.locator('.world-short details').all())await reveal(d);await article.locator('.world-short').getByText(t.learning.starter,{exact:true}).waitFor();await article.locator('.world-short').getByText(t.learning.observe,{exact:true}).waitFor();
  await reveal(article.locator('.world-more'));for(const text of t.more)await article.locator('.world-more').getByText(text,{exact:true}).waitFor();await reveal(article.locator('.world-sources'));for(const source of t.sources)assert.equal(await article.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  await article.getByRole('navigation',{name:'In dieser Entdeckerkarte'}).getByRole('button',{name:/Ausprobieren$/}).focus();await page.keyboard.press('Enter');assert.equal(await article.locator('.article-experiment').evaluate(el=>el===document.activeElement),true);
  for(let i=0;i<6;i++){const button=article.locator('.story-stations button').nth(i);await button.focus();await page.keyboard.press('Enter');assert.equal(await button.getAttribute('aria-pressed'),'true');await article.locator('.story-panel p').getByText(t.invention.stages[i].text,{exact:true}).waitFor();}
  assert.equal(await article.locator('.then-now').count(),0,'principle walkthrough is not presented as a historical reconstruction');
  if(t.id==='invention-camera'){
   const drawn=await article.locator('[data-optical-rays="pinhole"]').getAttribute('d'),rays=[...drawn.matchAll(/M([\d.]+) ([\d.]+)L([\d.]+) ([\d.]+)L([\d.]+) ([\d.]+)/g)];assert.equal(rays.length,2);
   for(const ray of rays){const [x,y,a,b,c,d]=ray.slice(1).map(Number);assert.ok(Math.abs((a-x)*(d-b)-(b-y)*(c-a))<.1,'actual pinhole segments stay straight through the opening');assert.ok((y-b)*(d-b)<0,'upper and lower image positions are inverted');}
  }
  if(t.id==='invention-telescope'){
   const rays=await article.locator('[data-optical-rays="telescope"]').all();assert.equal(rays.length,5);const outgoing=[];
   for(const ray of rays){const d=await ray.getAttribute('d'),m=d.match(/^M([\d.]+) ([\d.]+)H([\d.]+)L([\d.]+) ([\d.]+)L([\d.]+) ([\d.]+)H([\d.]+)$/);assert.ok(m);const [,x,y,a,b,c,e,f,g]=m.map(Number);assert.ok(x<a&&a<b&&b<e&&e<g);assert.ok(Math.abs((b-a)*(f-c)-(c-y)*(e-b))<.1,'drawn rays continue straight through the shared focus before the eyepiece');outgoing.push(f);}
   assert.equal(new Set(outgoing).size,5,'eyepiece output preserves a parallel bundle instead of collapsing every ray into one line');
  }
  for(let i=0;i<3;i++){const button=article.locator('.part-button').nth(i);if(touch&&i===0)await button.tap();else{await button.focus();await page.keyboard.press('Enter');}await article.locator('.part-explanation p').getByText(t.invention.parts[i].description,{exact:true}).waitFor();assert.equal(await article.locator('.part-hotspot[aria-pressed=true]').getAttribute('aria-label'),'Bauteil '+(i+1)+': '+t.invention.parts[i].name);assert.equal(await button.locator('.part-number').innerText(),String(i+1));}
  let states=[];
  if(t.invention.model){const model=article.locator('[data-invention-experiment]');await reveal(model);const result=model.locator('[data-invention-result]');if(t.invention.model==='aperture'){
   let small;for(const [i,name]of ['Kleine Öffnung','Große Öffnung'].entries()){const b=model.getByRole('button',{name,exact:true});await b.focus();await page.keyboard.press('Enter');await page.waitForFunction(i=>document.querySelector('[data-invention-result]')?.getAttribute('data-invention-result')===String(i),i);const count=Number(await result.getAttribute('data-invention-points'));if(i===0)small=count;else assert.ok(count>small);assert.equal(await model.locator('svg circle').count(),82);states.push(i);}
  }else{let last;for(const n of [1,2,3]){await model.getByRole('button',{name:'Bildgröße '+n,exact:true}).focus();await page.keyboard.press('Enter');await page.waitForFunction(n=>document.querySelector('[data-invention-result]')?.getAttribute('data-invention-result')===String(n),n);const actual=await model.locator('svg g[filter]').getAttribute('transform');if(last)assert.notEqual(actual,last);last=actual;assert.equal(await model.locator('svg filter feGaussianBlur').count(),1);states.push(n);}}
  }
  assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),t.id),before,'voluntary exploration does not award the mini-question mark');
  if(questions){const correct=question.locator('.quiz-answer').filter({has:page.getByText(t.question.answers[t.question.correct],{exact:true})});if(!await correct.isDisabled()){await reveal(question.locator('.world-game-hint'));await question.getByText(t.questionFeedback.hint,{exact:true}).waitFor();for(let i=0;i<3;i++)if(i!==t.question.correct){await question.locator('.quiz-answer').filter({has:page.getByText(t.question.answers[i],{exact:true})}).click();await question.getByText(t.questionFeedback.wrongReasons[i],{exact:true}).waitFor();assert.equal(await question.getByText(t.question.why,{exact:true}).count(),0);}await correct.click();}await question.getByText(t.question.why,{exact:true}).waitFor();}
  await geometry(page,article);
  if(shots&&[320,1440].includes(width)){await article.locator('.invention-blueprint').screenshot({path:path.join(shots,'optics-'+engine+'-'+t.id+'-'+width+'.png'),animations:'disabled'});if(t.invention.model)await article.locator('[data-invention-experiment]').screenshot({path:path.join(shots,'optics-experiment-'+engine+'-'+t.id+'-'+width+'.png'),animations:'disabled'});}
  if(shots&&native){await page.bringToFront();await article.locator('.invention-blueprint').scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,'optics-native-'+engine+'-'+t.id+'-'+width+'.png'));}
  for(const id of t.related){const target=catalog.find(topic=>topic.id===id);assert.ok(target);const focus='world-connection-'+t.id+'-'+id,link=page.locator('[data-route-focus="'+focus+'"]');await link.focus();await page.keyboard.press('Enter');await page.locator('#world-topic-title').getByText(target.title,{exact:true}).waitFor();await page.locator('.world-mini-question').waitFor();assert.equal(new URL(page.url()).hash,'#world/topic/'+id);await page.goBack();await article.getByRole('heading',{name:t.title,exact:true}).waitFor();await page.waitForFunction(focus=>document.activeElement?.dataset.routeFocus===focus,focus);}
  observed.push({id:t.id,width,native,readingLevels:true,sixStages:true,threeKeyboardParts:true,realModelStates:states,questionsChecked:questions,sourceLinks:true,noAutomaticLearningMark:true,relatedTargetsAndBackFocus:t.related});
 }assert.equal(observed.length,3);complete=true;return observed;}finally{if(complete)await page.evaluate(hash=>location.hash=hash,initial);}
}
