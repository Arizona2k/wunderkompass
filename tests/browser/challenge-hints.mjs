import assert from 'node:assert/strict';
import {CHALLENGE_BANK, emptyChallenge, restoreChallenge} from '../../app/knowledge-challenge.ts';
import {createSave, emptyProgress, SAVE_KEY} from '../../app/progress-storage.ts';

export async function assertHonestChallengeFeedback(room){
 const feedback=await room.getByRole('status').innerText();
 assert.doesNotMatch(feedback,/Richtig erklärt!|Gut begründet/,'a selection does not certify an unobserved personal explanation');
 assert.match(feedback,/Deine Auswahl passt\./,'correct feedback identifies the demonstrated selection');
}

export async function offlineChallengeHints(page,report){
 const room=page.locator('.knowledge-challenge'),hint=room.locator('.world-game-hint');
 const open=async()=>{await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await page.getByRole('dialog').locator('input').fill('Wissens-Challenge');await page.getByRole('option').filter({hasText:'Wissens-Challenge'}).click();};
 const saved=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);
 async function exercise(q,next){
  assert.ok(q&&[1,2].includes(q.hints.length),'actual authored one- or two-step hint question');
  await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
  await hint.locator('summary').click();await hint.getByText(q.hints[0],{exact:true}).waitFor();
  if(q.hints.length===2){
   assert.equal(await hint.getByText(q.hints[1],{exact:true}).count(),0);
   await hint.getByRole('button',{name:'Noch ein Hinweis',exact:true}).click();
   await hint.getByText(q.hints[1],{exact:true}).waitFor();
  }else{assert.equal(await hint.getByRole('button',{name:'Noch ein Hinweis',exact:true}).count(),0);assert.equal(await hint.locator('.challenge-second-hint').count(),0);}
  const answers=room.locator('.quiz-answer');
  await answers.filter({has:page.getByText(q.answers.find((_,i)=>i!==q.correct),{exact:true})}).click();
  await room.getByText('Noch einmal nachdenken.',{exact:true}).waitFor();
  assert.equal(await room.getByText(q.why,{exact:true}).count(),0);
  await answers.filter({has:page.getByText(q.answers[q.correct],{exact:true})}).click();
  await room.getByText(q.why,{exact:true}).waitFor();await assertHonestChallengeFeedback(room);
  await room.getByRole('button',{name:'Nächste Aufgabe',exact:true}).click();
  await room.getByRole('heading',{name:next.prompt,exact:true}).waitFor();
  assert.equal(await hint.getAttribute('open'),null);
  return {id:q.id,steps:q.hints.length,wrongRightExplanationAndNextReset:true};
 }
 await open();await page.locator('.challenge-levels').getByRole('button').filter({hasText:'Mittel'}).click();
 await page.waitForFunction(key=>{const s=JSON.parse(localStorage.getItem(key)).progress.gameSessions['world:knowledge-challenge']?.challenge;return s?.difficulty==='medium'&&s.index===0&&s.ids.length===6;},SAVE_KEY);
 const state=(await saved()).progress.gameSessions['world:knowledge-challenge'].challenge;
 const random=await exercise(CHALLENGE_BANK.find(q=>q.id===state.ids[0]),CHALLENGE_BANK.find(q=>q.id===state.ids[1]));
 // Retain the real random round above. A valid saved mixed round additionally
 // makes both authored hint shapes mandatory, independent of future pool growth.
 const pool=CHALLENGE_BANK.filter(q=>q.difficulty==='medium'),one=pool.find(q=>q.hints.length===1),two=pool.find(q=>q.hints.length===2);assert.ok(one&&two,'both real authored medium hint shapes exist');
 const questions=[one,two,...pool.filter(q=>q!==one&&q!==two)].slice(0,6);assert.equal(questions.length,6);
 const session={difficulty:'medium',ids:questions.map(q=>q.id),orders:Object.fromEntries(questions.map(q=>[q.id,[...q.answers].reverse()])),index:0,answer:null,done:false};assert.deepEqual(restoreChallenge(session,emptyChallenge()),session);
 const before=await saved(),fixture=structuredClone(before);fixture.progress.gameSessions['world:knowledge-challenge']={...fixture.progress.gameSessions['world:knowledge-challenge'],challenge:session};
 await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();
 await page.locator('input[type=file]').setInputFiles({name:'synthetic-offline-mixed-hints.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});
 await page.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await page.locator('.passport-dialog').waitFor({state:'hidden'});
 await page.waitForFunction(({key,ids})=>JSON.stringify(JSON.parse(localStorage.getItem(key)).progress.gameSessions['world:knowledge-challenge'].challenge.ids)===JSON.stringify(ids),{key:SAVE_KEY,ids:session.ids});
 const imported=await saved();assert.equal(imported.schemaVersion,3);
 for(const key of Object.keys(before.progress).filter(k=>!['gameSessions','lastActivity'].includes(k)))assert.deepEqual(imported.progress[key],before.progress[key],'other actual cold progress retained '+key);
 for(const[key,value]of Object.entries(before.progress.gameSessions))if(key!=='world:knowledge-challenge')assert.deepEqual(imported.progress.gameSessions[key],value,'other actual cold game retained '+key);
 await open();
 const deterministic=[];for(let i=0;i<2;i++)deterministic.push(await exercise(questions[i],questions[i+1]));
 assert.deepEqual(deterministic.map(q=>q.steps),[1,2],'both single and second-step offline behavior remain mandatory');
 report.offlineHintShapes={random,deterministic,actualSyntheticPassImport:true,allOtherProgressRetained:true};
 report.checks.push('Cold offline challenge with server stopped: actual random medium question plus mandatory saved single/two-step cases, wrong/right, explanation, next-question reset and all other pass progress retained');
}

// Synthetic Schema-3 rounds use the same fields as the version before hints.
// Exercise every authored hint in the production UI, rather than trusting a random sample.
export async function challengeHints(browser,base,ready,monitor,report,shots){
 const covered=new Set(),secondSteps=new Set();
 for(const difficulty of ['easy','medium','hard']){
  const pool=CHALLENGE_BANK.filter(q=>q.difficulty===difficulty);
  for(let offset=0;offset<pool.length;offset+=6){
   const questions=pool.slice(offset,offset+6);
   if(questions.length<6)questions.push(...pool.slice(0,6-questions.length));
   const session={difficulty,ids:questions.map(q=>q.id),orders:Object.fromEntries(questions.map(q=>[q.id,[...q.answers].reverse()])),index:0,answer:null,done:false};
   assert.deepEqual(restoreChallenge(session,emptyChallenge()),session);
   const progress=emptyProgress();
   progress.favorites=['topic:animal-polar-bear'];progress.journeys=['ocean'];progress.games=['memory'];
   progress.gameSessions={memory:{open:[0],matched:[]},'world:knowledge-challenge':{challenge:session}};
   progress.lastActivity={type:'game',id:'world:knowledge-challenge',family:'world'};
   const context=await browser.newContext({viewport:{width:360,height:800},reducedMotion:'reduce'});
   await context.addInitScript(({key,save})=>{
    if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));
    // Observe the exact text handed to the speech boundary. This is not a listening test.
    window.__hintSpeech=[];
    window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
    Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'de-DE',localService:true,voiceURI:'test-local'}];},addEventListener(){},removeEventListener(){},speak(u){window.__hintSpeech.push(u.text);queueMicrotask(()=>u.onend?.());}}});
   },{key:SAVE_KEY,save:createSave(progress)});
   const page=await context.newPage();monitor(page);page.setDefaultTimeout(20000);
   const pass=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
   try{
    await page.goto(base);await ready(page);await page.getByRole('button',{name:'Fortsetzen',exact:true}).click();
    const room=page.locator('.knowledge-challenge');
    await room.getByRole('heading',{name:questions[0].prompt,exact:true}).waitFor();
    assert.deepEqual((await pass()).gameSessions['world:knowledge-challenge'].challenge,session);
    for(let index=0;index<6;index++){
     const q=questions[index],hint=room.locator('.world-game-hint');
     await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
     await room.getByText('Thema: '+q.topicTitle,{exact:true}).waitFor();
     assert.equal(await hint.getAttribute('open'),null,q.id+' reset');
     const before=(await pass()).gameSessions['world:knowledge-challenge'].challenge;
     // Hash navigation restores page focus on the next frame. Let that finish
     // before testing the user's deliberate keyboard focus, rather than racing it.
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     await hint.locator('summary').focus();await page.keyboard.press('Enter');
     await hint.getByText(q.hints[0],{exact:true}).waitFor();
     await hint.getByRole('button',{name:'Hinweise vorlesen',exact:true}).click();
     assert.equal(await page.evaluate(()=>window.__hintSpeech.at(-1)),q.hints[0]);
     if(q.hints.length===2){
      assert.equal(await hint.getByText(q.hints[1],{exact:true}).count(),0,q.id+' second premature');
      await hint.getByRole('button',{name:'Noch ein Hinweis',exact:true}).focus();await page.keyboard.press('Enter');
      await hint.getByText(q.hints[1],{exact:true}).waitFor();secondSteps.add(q.id);
      await hint.getByRole('button',{name:'Hinweise vorlesen',exact:true}).click();
      assert.equal(await page.evaluate(()=>window.__hintSpeech.at(-1)),q.hints.join(' '));
      assert.equal(await hint.getByRole('button',{name:'Noch ein Hinweis',exact:true}).count(),0);
     }else assert.equal(await hint.getByRole('button',{name:'Noch ein Hinweis',exact:true}).count(),0);
     assert.deepEqual((await pass()).gameSessions['world:knowledge-challenge'].challenge,before,q.id+' hint changed round');
     assert.equal(await room.getByText(q.why,{exact:true}).count(),0,q.id+' premature explanation');
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,q.id+' overflow');
     if(q.id==='science-gps:mini'){
      await page.screenshot({path:shots+'/challenge-hints-360.png',fullPage:true});
      await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
      assert.deepEqual((await page.evaluate(async()=>window.axe.run('.knowledge-challenge',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}))).violations,[]);
      await page.setViewportSize({width:1440,height:900});
      await page.screenshot({path:shots+'/challenge-hints-1440.png',fullPage:true});
      assert.deepEqual((await page.evaluate(async()=>window.axe.run('.knowledge-challenge',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}))).violations,[]);
      await page.setViewportSize({width:360,height:800});
     }
     const answers=room.locator('.quiz-answer');
     await answers.filter({has:page.getByText(q.answers.find((_,i)=>i!==q.correct),{exact:true})}).click();
     await room.getByText('Noch einmal nachdenken.',{exact:true}).waitFor();
     assert.equal(await room.getByText(q.why,{exact:true}).count(),0,q.id+' wrong explanation');
     if(index===0){
      const wrong=(await pass()).gameSessions['world:knowledge-challenge'].challenge;
      await page.reload();await ready(page);await page.getByRole('button',{name:'Fortsetzen',exact:true}).click();
      await room.getByText('Noch einmal nachdenken.',{exact:true}).waitFor();
      assert.deepEqual((await pass()).gameSessions['world:knowledge-challenge'].challenge,wrong);
      assert.equal(await hint.getAttribute('open'),null);
      assert.equal(await hint.locator('.challenge-second-hint').count(),0);
     }
     await answers.filter({has:page.getByText(q.answers[q.correct],{exact:true})}).click();
     await room.getByText(q.why,{exact:true}).waitFor();await assertHonestChallengeFeedback(room);
     assert.equal(await hint.count(),0,q.id+' hint remains after success');covered.add(q.id);
     await room.getByRole('button',{name:index===5?'Spielstempel sammeln':'Nächste Aufgabe',exact:true}).click();
    }
    await room.getByRole('heading',{name:'Sechs Aufgaben gelöst!',exact:true}).waitFor();
    await page.reload();await ready(page);await page.getByRole('button',{name:'Fortsetzen',exact:true}).click();
    await room.getByRole('heading',{name:'Sechs Aufgaben gelöst!',exact:true}).waitFor();
    const retained=await pass();
    assert.ok(retained.games.includes('world:knowledge-challenge'));assert.ok(retained.games.includes('memory'));
    assert.deepEqual(retained.favorites,progress.favorites);assert.deepEqual(retained.journeys,progress.journeys);
    assert.deepEqual(retained.gameSessions.memory,progress.gameSessions.memory);
    report.checks.push(`Hint bank ${difficulty} ${offset+1}–${Math.min(offset+6,pool.length)}: legacy round, real hints/read boundary, wrong/right, reload, finish and previous progress`);
    console.log('Hint coverage',difficulty,covered.size+'/'+CHALLENGE_BANK.length);
   }finally{await context.close();}
  }
 }
 assert.deepEqual([...covered].sort(),CHALLENGE_BANK.map(q=>q.id).sort());
 assert.deepEqual([...secondSteps].sort(),CHALLENGE_BANK.filter(q=>q.hints.length===2).map(q=>q.id).sort());
 report.challengeHints={questions:covered.size,firstHints:covered.size,secondHints:secondSteps.size,totalHints:covered.size+secondSteps.size,questionIds:[...covered].sort(),secondHintIds:[...secondSteps].sort(),speech:'text boundary stub checked; no listening test',axe:'opened two-step GPS hint at 360 and 1440: zero WCAG A/AA violations'};
}
