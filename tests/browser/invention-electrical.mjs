import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
export const electricalTopics=catalog.filter(t=>['invention-battery','invention-generator','invention-transistor'].includes(t.id));
assert.equal(electricalTopics.length,3);
const reveal=async d=>{if(!await d.evaluate(e=>e.open))await d.locator(':scope > summary').click();};
export async function electricalSourceView(page,{width,shots,engine='chromium',native=false,questions=false}={}){
 const initial=await page.evaluate(()=>location.hash),observed=[];let complete=false;
 try{for(const t of electricalTopics){
  await page.evaluate(id=>location.hash='world/topic/'+id,t.id);const article=page.locator('.article-inventions');await article.getByRole('heading',{name:t.title,exact:true}).waitFor();const question=article.locator('.world-mini-question');await question.waitFor();
  const learned=()=>page.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),t.id),before=await learned();
  for(const d of await article.locator('.world-short details').all())await reveal(d);
  for(const text of [t.learning.starter,t.learning.observe,t.learning.benefit])await article.locator('.world-short').getByText(text===t.learning.benefit?'Warum hilft dir das? '+text:text,{exact:true}).waitFor();
  await reveal(article.locator('.world-more'));for(const text of t.more)await article.locator('.world-more').getByText(text,{exact:true}).waitFor();
  await reveal(article.locator('.world-sources'));for(const source of t.sources)assert.equal(await article.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  for(let i=0;i<6;i++){const button=article.locator('.story-stations button').nth(i);await button.focus();await page.keyboard.press('Enter');assert.equal(await button.getAttribute('aria-pressed'),'true');await article.locator('.story-panel p').getByText(t.invention.stages[i].text,{exact:true}).waitFor();}
  assert.equal(await article.locator('.then-now').count(),0,'a principle model is not a historical replica');
  for(let i=0;i<t.invention.parts.length;i++){const button=article.locator('.part-button').nth(i);await button.focus();await page.keyboard.press('Enter');await article.locator('.part-explanation p').getByText(t.invention.parts[i].description,{exact:true}).waitFor();assert.equal(await article.locator('.part-hotspot[aria-pressed=true]').getAttribute('aria-label'),'Bauteil '+(i+1)+': '+t.invention.parts[i].name);}
  const states=[];if(t.invention.model){const model=article.locator('[data-invention-experiment="'+t.invention.model+'"]');await reveal(model);const result=model.locator('[data-invention-result]');
   if(t.invention.model==='generator'){
    const paths=[],positions=[];for(const [i,name]of ['Anhalten','Hineinbewegen','Herausbewegen'].entries()){const b=model.getByRole('button',{name,exact:true});await b.focus();await page.keyboard.press('Enter');assert.equal(await b.getAttribute('aria-pressed'),'true');assert.equal(await result.getAttribute('data-invention-result'),String(i));paths.push(await model.locator('svg path[stroke-width="6"]').getAttribute('d'));positions.push(Number(await model.locator('svg rect').getAttribute('x')));states.push(i);}
    assert.equal(new Set(paths).size,3,'actual needle geometry differs for rest and opposite changes');assert.ok(positions[1]>positions[0]);assert.equal(positions[2],positions[0]);assert.match(paths[0],/^M478 147V59$/);assert.match(paths[1],/L513 71$/);assert.match(paths[2],/L443 71$/);
   }else{
    for(const target of [0,1,3,2,0]){for(const [bit,prefix]of [[2,'Versorgung'],[1,'Steuersignal']]){const b=model.getByRole('button',{name:new RegExp('^'+prefix+' ')});if((await b.getAttribute('aria-pressed')==='true')!==!!(target&bit)){await b.focus();await page.keyboard.press('Enter');}}
     assert.equal(await result.getAttribute('data-invention-result'),String(target));assert.equal(await model.locator('svg circle').getAttribute('fill'),target===3?'#d66229':'#e6f2f5','only supply and signal together activate the drawn load');assert.equal(await model.locator('svg path[stroke-width="5"]').nth(1).getAttribute('d'),target&1?'M295 73V139':'M295 73L330 128');states.push(target);
    }
   }
  }
  assert.equal(await learned(),before,'exploring does not award a learned stamp');
  if(questions){const answer=i=>question.locator('.quiz-answer').filter({has:page.getByText(t.question.answers[i],{exact:true})});if(!await answer(t.question.correct).isDisabled()){await reveal(question.locator('.world-game-hint'));await question.getByText(t.questionFeedback.hint,{exact:true}).waitFor();for(let i=0;i<t.question.answers.length;i++)if(i!==t.question.correct){await answer(i).click();await question.getByText(t.questionFeedback.wrongReasons[i],{exact:true}).waitFor();assert.equal(await question.getByText(t.question.why,{exact:true}).count(),0);}await answer(t.question.correct).click();}await question.getByText(t.question.why,{exact:true}).waitFor();}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'electrical reflow');
  const bad=await article.evaluate(root=>[...root.querySelectorAll('h2,h3,h4,p,summary,button,figcaption,small,.part-name,.story-step-label')].filter(el=>el.getClientRects().length&&(!el.closest('details:not([open])')||el.closest('summary'))).filter(el=>{const r=el.getBoundingClientRect();return r.width&&(r.left< -2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+2);}).map(el=>el.tagName+':'+el.textContent.slice(0,80)));assert.deepEqual(bad,[],'all visible electrical explanations and controls fit');
  for(const b of await article.locator('.story-stations button,.part-button,[data-invention-experiment] button').all()){const r=await b.boundingBox();if(r)assert.ok(r.width>=44&&r.height>=44,'electrical touch target');}
  if(shots&&[320,1440].includes(width)){await article.locator('.invention-blueprint').screenshot({path:path.join(shots,'electrical-'+engine+'-'+t.id+'-'+width+'.png'),animations:'disabled'});if(t.invention.model)await article.locator('[data-invention-experiment]').screenshot({path:path.join(shots,'electrical-experiment-'+engine+'-'+t.id+'-'+width+'.png'),animations:'disabled'});}
  if(shots&&native){await page.bringToFront();await article.locator('.invention-blueprint').scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,'electrical-native-'+engine+'-'+t.id+'-'+width+'.png'));}
  for(const id of t.related){const target=catalog.find(topic=>topic.id===id);assert.ok(target);assert.ok(target.related.includes(t.id),'reciprocal target');const focus='world-connection-'+t.id+'-'+id,link=page.locator('[data-route-focus="'+focus+'"]');await link.focus();await page.keyboard.press('Enter');await page.locator('#world-topic-title').getByText(target.title,{exact:true}).waitFor();await page.locator('.world-mini-question').waitFor();assert.equal(new URL(page.url()).hash,'#world/topic/'+id);await page.goBack();await article.getByRole('heading',{name:t.title,exact:true}).waitFor();await page.waitForFunction(focus=>document.activeElement?.dataset.routeFocus===focus,focus);}
  observed.push({id:t.id,width,native,readingLevels:true,sixStages:true,keyboardParts:t.invention.parts.length,realModelStates:states,questionsChecked:questions,sourceLinks:true,noAutomaticLearningMark:true,relatedTargetsAndBackFocus:t.related});
 }assert.equal(observed.length,3);complete=true;return observed;}finally{if(complete)await page.evaluate(hash=>location.hash=hash,initial);}
}
