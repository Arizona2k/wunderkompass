import assert from 'node:assert/strict';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
import {prepareAxe} from './axe-loader.mjs';
import catalog from '../../app/world-catalog.json' with {type:'json'};
import review from '../../content/science-originals-review.json' with {type:'json'};
import thinking from '../../app/science-thinking.json' with {type:'json'};
import connections from '../../app/world-connections.json' with {type:'json'};
const topics=review.topics.map(entry=>catalog.find(t=>t.id===entry.id));
// Source-derived roles: OpenStax heat transfer, IOP elasticity, the geometric
// reflection criterion, NHGRI cell structures and NASA comet-tail directions.
const keyedLabels={
 'heat-transfer':['Leitung: durch Material','Strömung: mit bewegter Luft','Strahlung: ohne Kontakt'],
 elasticity:['Vor der Belastung','Während der Belastung','Nach dem Entlasten'],
 symmetry:['Linke Form','Spiegelachse','Gespiegelte Form'],
 cell:['Außen: Zellwand','Innen angrenzend: Membran','Runder Bereich: Zellkern'],
 comet:['Sonne links','Ionenschweif ungefähr weg von der Sonne','Staubschweif kann gekrümmt sein']
};
export async function assertScienceDiagramLegend(article,kind){
 if(!keyedLabels[kind])return null;const figure=article.locator('[data-science-diagram="'+kind+'"]');
 assert.deepEqual(await figure.locator('.science-keyed-labels li span').allTextContents(),keyedLabels[kind],'actual numbered legend has source-defined roles');
 assert.deepEqual(await figure.locator('.science-keyed-labels li strong').allTextContents(),['1','2','3']);
 assert.deepEqual(await figure.locator('[data-diagram-marker] text').allTextContents(),['1','2','3']);
 const actual=await figure.evaluate(figure=>{const large=!!figure.closest('.large-reading'),svg=figure.querySelector('svg'),box=svg.getBoundingClientRect();return {large,labels:[...figure.querySelectorAll('.science-keyed-labels li')].map(e=>({font:parseFloat(getComputedStyle(e.querySelector('span')).fontSize),text:e.textContent,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})),markers:[...svg.querySelectorAll('[data-diagram-marker] text')].map(e=>{const b=e.getBoundingClientRect(),m=e.getScreenCTM();return {font:parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.a,m.b),inside:b.left>=box.left-1&&b.right<=box.right+1&&b.top>=box.top-1&&b.bottom<=box.bottom+1};})};});
 assert.ok(actual.labels.every(e=>e.font>=(actual.large?18.3:16)),'keyed labels respect normal and large reading');assert.ok(actual.markers.every(e=>e.inside&&e.font>=(actual.large?18.3:16)),'actual drawn keys are fully visible and readable');return actual;
}

export async function assertPressureContact(model){
 const actual=await model.locator('svg').evaluate(svg=>{const contact=svg.querySelector('rect').getBBox(),arrow=svg.querySelector('path').getBBox();return {left:contact.x,right:contact.x+contact.width,top:contact.y,forceX:arrow.x+arrow.width/2,forceEnd:arrow.y+arrow.height};});
 assert.ok(actual.forceX>=actual.left&&actual.forceX<=actual.right,'normal force must act on the actual drawn contact area');
 assert.ok(Math.abs(actual.forceEnd-actual.top)<.01,'force arrow meets the drawn contact surface');return actual;
}

async function geometry(page,root,label){
 const actual=await root.evaluate(root=>({overflow:document.documentElement.scrollWidth>innerWidth+2,bad:[...root.querySelectorAll('p,h2,h3,h4,button,summary,label,figcaption,.science-diagram-labels span')].filter(e=>e.getClientRects().length&&(!e.closest('details:not([open])')||e.closest('details:not([open])').querySelector(':scope>summary')===e)).flatMap(e=>{const b=e.getBoundingClientRect();return b.left< -2||b.right>innerWidth+2||e.scrollWidth>e.clientWidth+2||(e.matches('button,summary')&&b.height<44)?[{text:e.textContent.slice(0,80),left:b.left,right:b.right,height:b.height}]:[];})}));
 assert.equal(actual.overflow,false,label+' page overflow');assert.deepEqual(actual.bad,[],label+' readable actual text and controls');
}

export async function assertScienceThinkingTypography(root){
 const actual=await root.evaluate(root=>({large:!!root.closest('.large-reading'),fonts:[...root.querySelectorAll('p:not(.eyebrow),h4,button,summary,.lab-feedback strong')].filter(e=>e.getClientRects().length&&(!e.closest('details:not([open])')||e.closest('details:not([open])').querySelector(':scope>summary')===e)).map(e=>({text:e.textContent.slice(0,65),font:parseFloat(getComputedStyle(e).fontSize)}))}));
 assert.ok(actual.fonts.every(e=>e.font>=(actual.large?18.3:16)),'actual inquiry text respects normal/large reading '+JSON.stringify(actual));return actual;
}

export async function assertScienceModelTypography(model){
 const actual=await model.evaluate(root=>({large:!!root.closest('.large-reading'),fonts:[...root.querySelectorAll('label,.small-note')].map(e=>({text:e.textContent.slice(0,80),font:parseFloat(getComputedStyle(e).fontSize)}))}));
 assert.ok(actual.fonts.length>=2,'actual model includes input labels and an explicit limit');
 assert.ok(actual.fonts.every(e=>e.font>=(actual.large?18.3:16)),'model controls and limits respect normal/large reading '+JSON.stringify(actual));return actual;
}

export async function scienceThinkingView(page,topic,{width,shots,native=false}={}){
 const entry=thinking.entries.find(entry=>entry.id===topic.id);assert.ok(entry);
 const root=page.locator('[data-science-thinking="'+topic.id+'"]');await root.getByRole('heading',{name:'Vermuten, prüfen und weiterdenken',exact:true}).waitFor();await page.bringToFront();
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress),protectedFields=['discoveries','journeys','games','missions','labs','experiments','favorites','favoritePlaces','chapters','completedChapters','review','notes','settings','quizResults','quizSession'];
 await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));const before=await state(),modelValues=await page.locator('.science-investigation input').evaluateAll(es=>es.map(e=>e.value)),stages=[];
 for(const [index,task]of entry.stages.entries()){
  const level=root.getByRole('group',{name:'Denkstufe zum Modell',exact:true}).getByRole('button').nth(index);await level.focus();await page.keyboard.press('Enter');assert.equal(await level.getAttribute('aria-pressed'),'true');
  const section=root.locator('[data-science-thinking-stage="'+task.id+'"]');await section.getByRole('heading',{name:task.prompt,exact:true}).waitFor();for(const text of [task.goal,task.example])assert.ok((await section.innerText()).includes(text));
  const hint=section.locator('details');if(!await hint.evaluate(e=>e.open))await hint.locator('summary').click();await hint.getByText(task.hint,{exact:true}).waitFor();
  const right=task.answers.find(a=>a.id===task.correct);for(const wrong of task.answers.filter(a=>a.id!==task.correct)){const choice=section.getByRole('button',{name:wrong.text,exact:true});await choice.click();await section.getByRole('status').getByText(wrong.feedback,{exact:true}).waitFor();assert.equal(await choice.getAttribute('aria-pressed'),'true');assert.equal(await section.getByText(right.feedback,{exact:true}).count(),0,'wrong feedback never inserts the separate right explanation');}
  await section.getByRole('button',{name:right.text,exact:true}).click();await section.getByRole('status').getByText(right.feedback,{exact:true}).waitFor();await geometry(page,root,topic.id+' thinking '+task.id+' '+width);
  const typography=await assertScienceThinkingTypography(root);
  const captures=[];if(shots&&!native)await root.screenshot({path:path.join(shots,topic.id+'-thinking-'+task.id+'-'+width+'.png'),animations:'disabled'});
  if(shots&&native)for(const [n,selector]of ['h4','[role=status]'].entries()){await section.locator(selector).first().evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));captures.push(await captureNativeViewport(page,path.join(shots,topic.id+'-thinking-'+task.id+'-native200-'+width+'-'+n+'.png')));}
  stages.push({id:task.id,hint:true,specificWrongFeedbacks:2,rightFeedback:true,typography,captures});
 }
 const sources=root.locator('details').filter({has:page.getByText('Quellen zum Forscherblick',{exact:true})});if(!await sources.evaluate(e=>e.open))await sources.locator('summary').click();assert.deepEqual(await sources.locator('a').evaluateAll(as=>as.map(a=>a.href)),entry.sources);await geometry(page,root,topic.id+' inquiry sources '+width);
 await prepareAxe(page);const axe=await page.evaluate(async id=>(await window.axe.run('[data-science-thinking=\"'+id+'\"]',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),topic.id);assert.deepEqual(axe,[],'current scoped science inquiry accessibility');
 const after=await state();for(const field of protectedFields)assert.deepEqual(after[field],before[field],topic.id+' inquiry preserves '+field);for(const task of entry.stages)assert.equal(after.gameSessions['topic:'+topic.id]['scienceThinkingAnswer:'+task.id],task.answers.find(a=>a.id===task.correct).text);assert.equal(after.gameSessions['topic:'+topic.id].scienceThinkingLevel,2);assert.deepEqual(await page.locator('.science-investigation input').evaluateAll(es=>es.map(e=>e.value)),modelValues,'voluntary answers do not change the model inputs');
 return {id:topic.id,stages,sourceLinks:true,protectedProgress:true,modelInputsPreserved:true,axe};
}

// Regression for the actual .5 -> 0 saved-value failure: inspect the selected
// scientific input, its explanation, drawn shape AND stored state after reload.
export async function scienceFractionalRestoreView(page){
 const observed=[],key='erde-entdecken:save:v3',read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,key);
 const large=await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading'));
 for(const {id,kind,value,steps}of [{id:'science-resonance',kind:'resonance',value:.8,steps:3},{id:'science-pendulum',kind:'pendulum',value:2.5,steps:4}]){
  await page.bringToFront();await page.evaluate(id=>location.hash='world/topic/'+id,id);
  const model=page.locator('[data-investigation="'+kind+'"]'),slider=model.getByRole('slider').first();await slider.waitFor();await slider.press('Home');for(let i=0;i<steps;i++)await slider.press('ArrowRight');
  await page.waitForFunction(({id,value,key})=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['topic:'+id]?.investigationValue===value,{id,value,key});
  const inspect=async()=>{assert.equal(Number(await slider.inputValue()),value,'fractional input '+id);const state=await read();assert.equal(state.gameSessions['topic:'+id].investigationValue,value,'fractional saved value '+id);const status=await model.getByRole('status').innerText();
   if(kind==='pendulum'){const seconds=(2*Math.PI*Math.sqrt(value/9.81)).toLocaleString('de-DE',{maximumFractionDigits:2});assert.equal(status,'Zeit für eine volle Schwingung: etwa '+seconds+' Sekunden.');const shape=await model.locator('svg').evaluate(svg=>({string:svg.querySelector('path').getBBox().height,bobY:svg.querySelector('circle').cy.baseVal.value}));assert.equal(shape.string,value*40);assert.equal(shape.bobY,20+value*40);}
   else{const gain=1/Math.sqrt((1-value**2)**2+(.3*value)**2);assert.ok(status.includes(gain.toLocaleString('de-DE',{maximumFractionDigits:2})));const height=await model.locator('svg path').evaluate(e=>e.getBBox().height);assert.ok(Math.abs(height-2*Math.min(55,gain*15))<4,'drawn response matches the selected frequency');}
   return {value,status,svg:await model.locator('svg').innerHTML(),state};};
  // Read the rendered endpoint after the same two paint frames used by the
  // ordinary model-state guard; reduced-motion CSS still has a .01ms transition.
  await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));
  const before=await inspect();await page.reload();await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await page.locator('.earth-app').evaluate((e,large)=>e.classList.toggle('large-reading',large),large);await slider.waitFor();await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));const after=await inspect();assert.equal(after.status,before.status);assert.equal(after.svg,before.svg);for(const field of Object.keys(before.state).filter(k=>k!=='lastActivity'))assert.deepEqual(after.state[field],before.state[field],'reload retains '+field+' '+id);observed.push({id,value,displayExplanationShapeAndStorage:true,allOtherProgressRetained:true});
 }
 return observed;
}

export async function assertScienceReciprocalLink(page,sourceId,targetId,explained){
 const reverse=(explained?'world-connection-':'world-related-')+targetId+'-'+sourceId,link=page.locator('[data-route-focus="'+reverse+'"]');
 assert.equal(await link.count(),1,'actual reciprocal science link must exist '+targetId+' -> '+sourceId);await link.waitFor();
}

async function scienceSourcePaths(page,topic){
 await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();
 await page.getByRole('combobox').fill(topic.title);await page.getByRole('option').filter({hasText:topic.title}).first().click();
 await page.getByRole('heading',{name:topic.title,exact:true}).waitFor();assert.equal(new URL(page.url()).hash,'#world/topic/'+topic.id);
 const observed=[];
 for(const id of topic.related){
  const target=catalog.find(t=>t.id===id);assert.ok(target.related.includes(topic.id),'reciprocal source relationship '+id);
  const connection=connections.connections.find(c=>[c.fromId,c.toId].includes(topic.id)&&[c.fromId,c.toId].includes(id));
  const focus=(connection?'world-connection-':'world-related-')+topic.id+'-'+id,link=page.locator('[data-route-focus="'+focus+'"]');
  if(connection)assert.equal(await link.locator('..').locator('p').innerText(),connection.why,'actual source-derived connection explanation');
  await link.focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:target.title,exact:true}).waitFor();await page.locator('.world-mini-question').waitFor();
  await assertScienceReciprocalLink(page,topic.id,id,!!connection);
  await page.goBack();await page.getByRole('heading',{name:topic.title,exact:true}).waitFor();await page.waitForFunction(focus=>document.activeElement?.dataset.routeFocus===focus,focus);
  observed.push({id,explanation:connection?.why??null,actualReciprocalLink:true,backRestoresOriginalFocus:true});
 }
 return {actualSearch:true,related:observed};
}

export async function scienceOriginalView(page,{width,shots,questions=true,native=false,modelsOnly=false}={}){
 const observed=[];
 for(const t of topics.filter(t=>!modelsOnly||t.investigation)){
  await page.evaluate(id=>location.hash='world/topic/'+id,t.id);const article=page.locator('.world-article');await article.getByRole('heading',{name:t.title,exact:true}).waitFor();
  for(const detail of await article.locator('.world-short details,.world-more,.world-sources').all())if(!await detail.evaluate(e=>e.open))await detail.locator(':scope>summary').click();
  for(const text of [t.intro,...t.paragraphs,...t.more,t.learning.starter,t.learning.observe,t.learning.benefit,...t.facts.map(f=>f.text)])assert.ok((await article.innerText()).includes(text),t.id+' actual displayed explanation');
  for(const source of t.sources)assert.equal(await article.getByRole('link',{name:source.label,exact:true}).getAttribute('href'),source.url);
  await assertScienceDiagramLegend(article,t.id.replace('science-',''));
  const states=[];let modelTypography=null;
  if(t.investigation){
   const model=article.locator('[data-investigation="'+t.investigation+'"]'),slider=model.getByRole('slider').first();
   modelTypography=await assertScienceModelTypography(model);
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
  const inquiry=modelsOnly?null:await scienceThinkingView(page,t,{width,shots,native});
  await geometry(page,article,t.id+' '+width);
  const captures=[];
  if(shots&&!native){
   // Capture scientific media directly. The ten interactive topics have a
   // generic hero; static topics already show their own diagrams in the hero.
   const selector=t.investigation?'.science-investigation':'.science-explanation-diagram',file=t.investigation?t.id+'-'+width+'-model.png':t.id+'-diagram-'+width+'.png';
   await article.locator(selector).screenshot({path:path.join(shots,file),animations:'disabled'});
  }
  if(shots&&native){
   const sections=t.investigation?['.science-investigation h3','.science-investigation label','.science-investigation svg','.science-investigation [role=status]','.science-investigation .small-note']:['.world-article-heading h2','.science-explanation-diagram svg','.science-diagram-labels','.science-explanation-diagram figcaption'];
   for(const [index,selector]of sections.entries()){const part=article.locator(selector).first();await part.evaluate(async e=>{e.scrollIntoView({block:'start',behavior:'instant'});await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));});captures.push(await captureNativeViewport(page,path.join(shots,t.id+'-native200-'+width+'-'+index+'.png')));}
  }
  const paths=questions&&width===320?await scienceSourcePaths(page,t):null;
  observed.push({id:t.id,width,native,inquiry,modelTypography,paths,explanationAndSources:true,questions,wrongReasons:questions?2:0,states,captures});
 }
 for(const proof of await scienceFractionalRestoreView(page))observed.find(view=>view.id===proof.id).fractionalRestore=proof;
 return observed;
}
