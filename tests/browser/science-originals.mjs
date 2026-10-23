import assert from 'node:assert/strict';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
import catalog from '../../app/world-catalog.json' with {type:'json'};
import review from '../../content/science-originals-review.json' with {type:'json'};
const topics=review.topics.map(entry=>catalog.find(t=>t.id===entry.id));

export async function assertPressureContact(model){
 const actual=await model.locator('svg').evaluate(svg=>{const contact=svg.querySelector('rect').getBBox(),arrow=svg.querySelector('path').getBBox();return {left:contact.x,right:contact.x+contact.width,top:contact.y,forceX:arrow.x+arrow.width/2,forceEnd:arrow.y+arrow.height};});
 assert.ok(actual.forceX>=actual.left&&actual.forceX<=actual.right,'normal force must act on the actual drawn contact area');
 assert.ok(Math.abs(actual.forceEnd-actual.top)<.01,'force arrow meets the drawn contact surface');return actual;
}

async function geometry(page,root,label){
 const actual=await root.evaluate(root=>({overflow:document.documentElement.scrollWidth>innerWidth+2,bad:[...root.querySelectorAll('p,h2,h3,h4,button,summary,label,figcaption,.science-diagram-labels span')].filter(e=>e.getClientRects().length&&(!e.closest('details:not([open])')||e.closest('details:not([open])').querySelector(':scope>summary')===e)).flatMap(e=>{const b=e.getBoundingClientRect();return b.left< -2||b.right>innerWidth+2||e.scrollWidth>e.clientWidth+2||(e.matches('button,summary')&&b.height<44)?[{text:e.textContent.slice(0,80),left:b.left,right:b.right,height:b.height}]:[];})}));
 assert.equal(actual.overflow,false,label+' page overflow');assert.deepEqual(actual.bad,[],label+' readable actual text and controls');
}

export async function scienceOriginalView(page,{width,shots,questions=true,native=false,modelsOnly=false}={}){
 const observed=[];
 for(const t of topics.filter(t=>!modelsOnly||t.investigation)){
  await page.evaluate(id=>location.hash='world/topic/'+id,t.id);const article=page.locator('.world-article');await article.getByRole('heading',{name:t.title,exact:true}).waitFor();
  for(const detail of await article.locator('.world-short details,.world-more,.world-sources').all())if(!await detail.evaluate(e=>e.open))await detail.locator(':scope>summary').click();
  for(const text of [t.intro,...t.paragraphs,...t.more,t.learning.starter,t.learning.observe,t.learning.benefit,...t.facts.map(f=>f.text)])assert.ok((await article.innerText()).includes(text),t.id+' actual displayed explanation');
  for(const source of t.sources)assert.equal(await article.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  const states=[];
  if(t.investigation){
   const model=article.locator('[data-investigation="'+t.investigation+'"]'),slider=model.getByRole('slider').first();
   const keys=['pressure','buoyancy'].includes(t.investigation)?['Home','ArrowRight','ArrowRight','End','Home']:t.investigation==='angle'?['Home','ArrowRight','Home','ArrowRight6','End','ArrowLeft','Home']:t.investigation==='resonance'?['Home','ArrowRight','Home','ArrowRight5','End','Home']:['Home','ArrowRight','End','Home'];
   for(const key of keys){
    if(/^ArrowRight[0-9]$/.test(key)){for(let i=0;i<Number(key.slice(-1));i++)await slider.press('ArrowRight');}else await slider.press(key);const value=Number(await slider.inputValue());await page.waitForFunction(({kind,value})=>Number(document.querySelector('[data-investigation="'+kind+'"] label strong')?.textContent.replace(',','.'))===value,{kind:t.investigation,value});
    // Even reduced-motion CSS uses a .01ms transition. Inspect the rendered
    // endpoint after actual paint frames, rather than just the new DOM attribute.
    await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));
    const status=await model.getByRole('status').innerText();assert.doesNotMatch(status,/NaN|Infinity|undefined/);
    let shape=null;
    if(t.investigation==='pressure'){
     // Independent source criterion: fixed12N normal to selected area, P=F/A.
     const expected={1:'12',2:'6',3:'4',6:'2'}[value];assert.ok(expected);assert.equal(status,'12 N / '+value+' m² = '+expected+' Pa');shape=await assertPressureContact(model);
    }
    if(t.investigation==='lever'){
     assert.equal(status,'Gleichgewicht: '+({1:12,2:6,6:2}[value])+' N am Kraftarm, Last 12 N am Lastarm 1 m.');
     const geometry=await model.locator('svg').evaluate(svg=>{const r=svg.querySelector('rect').getBBox(),a=svg.querySelectorAll('path')[1].getBBox();return {loadX:r.x+r.width/2,forceX:a.x+a.width/2,forceEnd:a.y+a.height};});assert.equal((geometry.forceX-65)/(65-geometry.loadX),value,'actual lever arms share the source-defined length scale');assert.equal(geometry.forceEnd,100);
    }
    if(t.investigation==='pendulum'){const seconds={.5:'1,42',1:'2,01',3:'3,47'}[value];assert.ok(seconds);assert.equal(status,'Zeit für eine volle Schwingung: etwa '+seconds+' Sekunden.');const points=await model.locator('svg').evaluate(svg=>{const support=svg.querySelector('path').getBBox(),bob=svg.querySelector('circle').getBBox();return {stringEnd:support.y+support.height,bobCentre:bob.y+bob.height/2};});assert.ok(Math.abs(points.stringEnd-points.bobCentre)<.01,'string length reaches actual bob centre '+JSON.stringify(points));}
    if(t.investigation==='angle'){assert.ok(status.startsWith(value+'°'));if(value===90)assert.ok(status.includes('rechter Winkel'));if(value===165)assert.ok(status.includes('stumpfer Winkel'));const actual=await model.locator('svg path').evaluate(e=>{const p=e.getPointAtLength(0);return {x:p.x,y:p.y};});assert.ok(Math.abs(actual.x-(110+85*Math.cos(value*Math.PI/180)))<.001&&Math.abs(actual.y-(125-85*Math.sin(value*Math.PI/180)))<.001,'drawn direction matches the degree measure');}
    if(t.investigation==='resonance'){const expected=1/Math.sqrt((1-value**2)**2+(.3*value)**2);assert.ok(status.includes(expected.toLocaleString('de-DE',{maximumFractionDigits:2})));const height=await model.locator('svg path').evaluate(e=>e.getBBox().height);assert.ok(Math.abs(height-2*Math.min(55,expected*15))<.001,'same stationary response in the actual wave, not just numeric feedback');}
    if(t.investigation==='checksum'){const second=Number(await model.getByRole('slider').nth(1).inputValue());assert.ok(status.includes('Folge '+value+', '+second+' → Summe '+(value+second)));assert.ok(status.includes('Umgekehrt: '+second+', '+value+' → Summe '+(second+value)));}
    if(t.investigation==='encryption'){assert.ok(status.includes('WELT → '+({0:'WELT',1:'XFMU',25:'VDKS'}[value])));assert.ok(status.includes('Verschiebung '+((26-value)%26)));}
    if(t.investigation==='fractals'){
     assert.equal(await model.locator('polygon').count(),[1,3,9,27,81][value]);
     const outside=await model.locator('polygon').evaluateAll(elements=>elements.flatMap(e=>{const b=e.getBBox();return b.x<0||b.y<0||b.x+b.width>240||b.y+b.height>180?[{x:b.x,y:b.y,width:b.width,height:b.height}]:[];}));assert.deepEqual(outside,[],'actual finite triangles fit the shown viewport');
    }
    if(t.investigation==='buoyancy'&&value===6){assert.ok(status.includes('3 Liter verdrängt'));assert.ok(status.includes('29,43 N'));assert.ok(status.includes('50 %'));const body=await model.locator('svg rect').nth(1).evaluate(e=>({y:e.y.baseVal.value,height:e.height.baseVal.value}));assert.equal((body.y+body.height-75)/body.height,.5,'half of the body is actually below the drawn waterline');}
    states.push({key,value,status,...(shape?{contact:shape}:{})});
   }
   if(t.investigation==='probability'){await model.getByRole('button',{name:'Neue Würfelserie untersuchen',exact:true}).click();await model.getByRole('status').filter({hasText:'6 simulierte Würfe'}).waitFor();assert.equal(await model.locator('.science-dice-labels li').count(),6);const counts=await model.locator('.science-dice-labels li').allTextContents();assert.equal(counts.reduce((n,text)=>n+Number(text.split(':')[1].trim()),0),6,'all actual counts sum to the displayed sample, no exact-distribution demand');}
  }
  if(questions){
   const q=article.locator('.world-mini-question'),right=q.locator('.quiz-answer').filter({has:page.getByText(t.question.answers[t.question.correct],{exact:true})});
   if(await right.isDisabled())await q.getByRole('button',{name:'Später noch einmal prüfen',exact:true}).click();
   const hint=q.locator('.world-game-hint');if(!await hint.evaluate(e=>e.open))await hint.locator('summary').click();await q.getByText(t.questionFeedback.hint,{exact:true}).waitFor();
   for(let i=0;i<t.question.answers.length;i++)if(i!==t.question.correct){await q.locator('.quiz-answer').filter({has:page.getByText(t.question.answers[i],{exact:true})}).click();await q.getByText(t.questionFeedback.wrongReasons[i],{exact:true}).waitFor();assert.equal(await q.getByText(t.question.why,{exact:true}).count(),0,'wrong feedback does not show separate correct explanation');}
   await right.click();await q.getByText(t.question.why,{exact:true}).waitFor();
  }
  await geometry(page,article,t.id+' '+width);
  const captures=[];
  if(shots&&!native){await article.locator('.article-hero').screenshot({path:path.join(shots,t.id+'-'+width+'-hero.png'),animations:'disabled'});if(t.investigation)await article.locator('.science-investigation').screenshot({path:path.join(shots,t.id+'-'+width+'-model.png'),animations:'disabled'});}
  if(shots&&native){
   const sections=t.investigation?['.science-investigation h3','.science-investigation label','.science-investigation svg','.science-investigation [role=status]','.science-investigation .small-note']:['.world-article-heading h2','.science-explanation-diagram svg','.science-diagram-labels','.science-explanation-diagram figcaption'];
   for(const [index,selector]of sections.entries()){const part=article.locator(selector).first();await part.evaluate(async e=>{e.scrollIntoView({block:'start',behavior:'instant'});await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));});captures.push(await captureNativeViewport(page,path.join(shots,t.id+'-native200-'+width+'-'+index+'.png')));}
  }
  observed.push({id:t.id,width,native,explanationAndSources:true,questions,wrongReasons:questions?2:0,states,captures});
 }
 return observed;
}
