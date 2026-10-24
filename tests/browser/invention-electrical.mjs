import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
import {seismographLabRoundTrip} from './seismograph-lab-links.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
export const electricalTopics=catalog.filter(t=>['invention-battery','invention-generator','invention-transistor'].includes(t.id));
assert.equal(electricalTopics.length,3);
const reveal=async d=>{if(!await d.evaluate(e=>e.open))await d.locator(':scope > summary').click();};
export async function assertLiftDiagram(article){
 const read=async(selector,keys)=>Object.fromEntries(await Promise.all(keys.map(async key=>[key,Number(await article.locator(selector).getAttribute(key))])));
 const cabin=await read('[data-lift-cabin]',['x','y','width','height']),weight=await read('[data-lift-counterweight]',['x','y','width','height']),wheel=await read('[data-lift-sheave]',['cx','cy','r']);
 const path=await article.locator('[data-lift-rope]').getAttribute('d'),values=path.match(/^M([\d.]+) ([\d.]+)V([\d.]+)A([\d.]+) ([\d.]+) 0 0 1 ([\d.]+) ([\d.]+)V([\d.]+)$/);assert.ok(values,'actual supporting rope geometry');const [x1,y1,top,r1,r2,x2,y2,end]=values.slice(1).map(Number);
 assert.equal(x1,cabin.x+cabin.width/2,'rope attaches to cabin centre');assert.equal(y1,cabin.y);assert.equal(x2,weight.x+weight.width/2,'rope attaches to counterweight centre');assert.equal(end,weight.y);assert.equal(top,wheel.cy);assert.equal(y2,wheel.cy);assert.equal(x1,wheel.cx-wheel.r);assert.equal(x2,wheel.cx+wheel.r);assert.equal(r1,wheel.r);assert.equal(r2,wheel.r);assert.ok(wheel.cy-wheel.r>=4,'sheave stays inside viewBox');assert.ok(cabin.y>wheel.cy+wheel.r+10,'cabin clears the drive wheel');assert.ok(weight.y>wheel.cy+wheel.r+10,'counterweight clears the drive wheel');
}
export async function assertRetainedStructureCaption(page){
 const caption=page.locator('.structure-model').getByText('Lastweg: Gewicht → Tragwerk → Untergrund. Die Zeichnung zeigt Richtungen, keine gemessenen Kräfte.',{exact:true});await caption.waitFor();
 const box=await caption.evaluate(e=>{const r=e.getBoundingClientRect();return{tag:e.tagName,left:r.left,right:r.right,viewport:innerWidth,overflow:e.scrollWidth>e.clientWidth+1,font:parseFloat(getComputedStyle(e).fontSize)};});
 assert.equal(box.tag,'P','load path uses wrapping HTML outside the scaled SVG');assert.ok(box.font>=16&&box.left>=-1&&box.right<=box.viewport+1&&!box.overflow,'retained structure load path stays readable and unclipped '+JSON.stringify(box));
 assert.deepEqual(await page.locator('.structure-model svg text').evaluateAll(es=>es.filter(e=>{const b=e.getBBox(),v=e.ownerSVGElement.viewBox.baseVal;return b.x<v.x||b.y<v.y||b.x+b.width>v.x+v.width||b.y+b.height>v.y+v.height;}).map(e=>e.textContent)),[],'retained structure SVG labels stay inside their viewBox');
}
export async function electricalSourceView(page,options={}){const result=await inventionSourceView(page,{...options,topics:electricalTopics});assert.equal(result.length,3);return result;}
export async function inventionSourceView(page,{topics,width,shots,engine='chromium',native=false,questions=false}={}){
 assert.ok(Array.isArray(topics)&&topics.length>0);assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);
 const initial=await page.evaluate(()=>location.hash),observed=[];let complete=false;
 try{for(const t of topics){
  const learned=()=>page.evaluate(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),t.id),before=await learned();
  await page.evaluate(id=>location.hash='world/topic/'+id,t.id);const article=page.locator('.article-inventions');await article.getByRole('heading',{name:t.title,exact:true}).waitFor();const question=article.locator('.world-mini-question');await question.waitFor();
  await page.evaluate(()=>location.hash='world');await page.locator('.world-view .world-choice').first().waitFor();
  await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('dialog').locator('input').fill(t.title);
  await page.locator('[role="option"][data-value="topic:'+t.id+'"]').click();await page.getByRole('dialog').waitFor({state:'hidden'});
  await article.getByRole('heading',{name:t.title,exact:true}).waitFor();await question.waitFor();assert.equal(new URL(page.url()).hash,'#world/topic/'+t.id,'actual new electrical search result opens its own canonical route');
  for(const d of await article.locator('.world-short details').all())await reveal(d);
  for(const text of [t.learning.starter,t.learning.observe,t.learning.benefit])await article.locator('.world-short').getByText(text===t.learning.benefit?'Warum hilft dir das? '+text:text,{exact:true}).waitFor();
  await reveal(article.locator('.world-more'));for(const text of t.more)await article.locator('.world-more').getByText(text,{exact:true}).waitFor();
  await reveal(article.locator('.world-sources'));for(const source of t.sources)assert.equal(await article.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  for(let i=0;i<6;i++){const button=article.locator('.story-stations button').nth(i);await button.focus();await page.keyboard.press('Enter');assert.equal(await button.getAttribute('aria-pressed'),'true');await article.locator('.story-panel p').getByText(t.invention.stages[i].text,{exact:true}).waitFor();}
  assert.equal(await article.locator('.then-now').count(),0,'a principle model is not a historical replica');
  for(let i=0;i<t.invention.parts.length;i++){const button=article.locator('.part-button').nth(i);await button.focus();await page.keyboard.press('Enter');await article.locator('.part-explanation p').getByText(t.invention.parts[i].description,{exact:true}).waitFor();assert.equal(await article.locator('.part-hotspot[aria-pressed=true]').getAttribute('aria-label'),'Bauteil '+(i+1)+': '+t.invention.parts[i].name);}
  if(t.id==='invention-elevator')await assertLiftDiagram(article);
  const states=[];let labConnection;if(t.invention.model){const model=article.locator('[data-invention-experiment="'+t.invention.model+'"]');await reveal(model);const result=model.locator('[data-invention-result]');
   if(t.invention.model==='generator'){
    const paths=[],positions=[];for(const [i,name]of ['Anhalten','Hineinbewegen','Herausbewegen'].entries()){const b=model.getByRole('button',{name,exact:true});await b.focus();await page.keyboard.press('Enter');assert.equal(await b.getAttribute('aria-pressed'),'true');assert.equal(await result.getAttribute('data-invention-result'),String(i));paths.push(await model.locator('svg path[stroke-width="6"]').getAttribute('d'));positions.push(Number(await model.locator('svg rect').getAttribute('x')));states.push(i);}
    assert.equal(new Set(paths).size,3,'actual needle geometry differs for rest and opposite changes');assert.ok(positions[1]>positions[0]);assert.equal(positions[2],positions[0]);assert.match(paths[0],/^M478 147V59$/);assert.match(paths[1],/L513 71$/);assert.match(paths[2],/L443 71$/);
   }else if(t.invention.model==='transistor'){
    for(const target of [0,1,3,2,0]){for(const [bit,prefix]of [[2,'Versorgung'],[1,'Steuersignal']]){const b=model.getByRole('button',{name:new RegExp('^'+prefix+' ')});if((await b.getAttribute('aria-pressed')==='true')!==!!(target&bit)){await b.focus();await page.keyboard.press('Enter');}}
     assert.equal(await result.getAttribute('data-invention-result'),String(target));assert.equal(await model.locator('svg circle').getAttribute('fill'),target===3?'#d66229':'#e6f2f5','only supply and signal together activate the drawn load');assert.equal(await model.locator('svg path[stroke-width="5"]').nth(1).getAttribute('d'),target&1?'M295 73V139':'M295 73L330 128');states.push(target);
    }
   }else if(t.invention.model==='seismograph'){
    for(const [index,name]of ['Ausgangslage','Boden nach rechts','Boden nach links'].entries()){const b=model.getByRole('button',{name,exact:true});await b.focus();await page.keyboard.press('Enter');assert.equal(await b.getAttribute('aria-pressed'),'true');const direction=[0,1,-1][index],actual=result;assert.equal(await actual.getAttribute('data-invention-result'),String(direction));assert.equal(await model.locator('svg>g').getAttribute('transform'),'translate('+(direction*27)+' 0)');assert.equal(await model.locator('svg>circle').getAttribute('cx'),'270','inertial mass stays at the same picture coordinate for this short comparison');assert.equal(await model.locator('svg>path').first().getAttribute('d'),'M'+(270+direction*27)+' 29L270 112','suspension follows the moved frame, not a detached mass');states.push(direction);}
    if([320,1440].includes(width))labConnection=await seismographLabRoundTrip(page,{width,shots,engine,native});
   }else if(t.invention.model==='layers'){
    const up=model.getByRole('button',{name:'Eine Schicht aufbauen',exact:true}),down=model.getByRole('button',{name:'Eine Schicht zurück',exact:true}),cut=model.getByRole('button',{name:/^Mittlere Schicht /});
    const apply=async(n,c)=>{let current=Number(await result.getAttribute('data-invention-result'));while(current<n){await up.click();current++;}while(current>n){await down.click();current--;}if((await cut.getAttribute('aria-pressed')==='true')!==c)await cut.click();assert.equal(await result.getAttribute('data-invention-result'),String(n));assert.equal(await result.getAttribute('data-invention-cut'),String(c));assert.equal(await model.locator('[data-layer]').count(),n);assert.equal(await up.isDisabled(),n===3);assert.equal(await down.isDisabled(),n===0);if(n>=2){assert.equal(await model.locator('[data-layer="2"] rect').count(),c?0:1);assert.equal(await model.locator('[data-layer="2"] path').count(),c?2:0);}states.push({layers:n,cut:c});};
    for(const [n,c]of [[0,false],[1,false],[2,false],[3,false],[3,true],[2,true],[1,true],[0,true],[2,true],[2,false]])await apply(n,c);
   }else assert.fail('No actual model-state coverage for '+t.invention.model);
  }
  assert.equal(await learned(),before,'exploring does not award a learned stamp');
  if(questions){const answer=i=>question.locator('.quiz-answer').filter({has:page.getByText(t.question.answers[i],{exact:true})});if(!await answer(t.question.correct).isDisabled()){await reveal(question.locator('.world-game-hint'));await question.getByText(t.questionFeedback.hint,{exact:true}).waitFor();for(let i=0;i<t.question.answers.length;i++)if(i!==t.question.correct){await answer(i).click();await question.getByText(t.questionFeedback.wrongReasons[i],{exact:true}).waitFor();assert.equal(await question.getByText(t.question.why,{exact:true}).count(),0);}await answer(t.question.correct).click();}await question.getByText(t.question.why,{exact:true}).waitFor();}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'electrical reflow');
  const bad=await article.evaluate(root=>[...root.querySelectorAll('h2,h3,h4,p,summary,button,figcaption,small,.part-name,.story-step-label')].filter(el=>el.getClientRects().length&&(!el.closest('details:not([open])')||el.closest('summary'))).filter(el=>{const r=el.getBoundingClientRect();return r.width&&(r.left< -2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+2);}).map(el=>el.tagName+':'+el.textContent.slice(0,80)));assert.deepEqual(bad,[],'all visible electrical explanations and controls fit');
  for(const b of await article.locator('.story-stations button,.part-button,[data-invention-experiment] button').all()){const r=await b.boundingBox();if(r)assert.ok(r.width>=44&&r.height>=44,'electrical touch target');}
  if(shots&&[320,1440].includes(width)){
   const capture=async(locator,file)=>{if(native){await locator.locator('svg[role="group"],svg[role="img"]').scrollIntoViewIfNeeded();await captureNativeViewport(page,file);}else await locator.screenshot({path:file,animations:'disabled'});};
   await capture(article.locator('.invention-blueprint'),path.join(shots,'electrical-'+engine+'-'+t.id+'-'+width+'.png'));
   if(t.invention.model)await capture(article.locator('[data-invention-experiment]'),path.join(shots,'electrical-experiment-'+engine+'-'+t.id+'-'+width+'.png'));
  }
  if(shots&&native){
   await page.bringToFront();await article.locator('.invention-blueprint .blueprint-svg').scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,'electrical-native-'+engine+'-'+t.id+'-'+width+'.png'));
   await article.locator('.part-button').last().scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,'electrical-native-parts-'+engine+'-'+t.id+'-'+width+'.png'));
   if(t.invention.model){const model=article.locator('[data-invention-experiment]');await model.locator('svg').scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,'electrical-native-model-'+engine+'-'+t.id+'-'+width+'.png'));await model.locator('[data-invention-result]').scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,'electrical-native-controls-'+engine+'-'+t.id+'-'+width+'.png'));}
  }
  for(const id of t.related){const target=catalog.find(topic=>topic.id===id);assert.ok(target);assert.ok(target.related.includes(t.id),'reciprocal target');const focus='world-connection-'+t.id+'-'+id,link=page.locator('[data-route-focus="'+focus+'"]');await link.focus();await page.keyboard.press('Enter');await page.locator('#world-topic-title').getByText(target.title,{exact:true}).waitFor();await page.locator('.world-mini-question').waitFor();assert.equal(new URL(page.url()).hash,'#world/topic/'+id);if(id==='building-eiffel-tower')await assertRetainedStructureCaption(page);await page.goBack();await article.getByRole('heading',{name:t.title,exact:true}).waitFor();await page.waitForFunction(focus=>document.activeElement?.dataset.routeFocus===focus,focus);}
  observed.push({id:t.id,width,native,readingLevels:true,sixStages:true,keyboardParts:t.invention.parts.length,realModelStates:states,...(labConnection?{labConnection}:{}),questionsChecked:questions,sourceLinks:true,actualSearch:true,directRoute:true,noAutomaticLearningMark:true,relatedTargetsAndBackFocus:t.related});
 }assert.equal(observed.length,topics.length);complete=true;return observed;}finally{if(complete)await page.evaluate(hash=>location.hash=hash,initial);}
}
