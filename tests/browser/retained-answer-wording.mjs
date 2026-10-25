import assert from 'node:assert/strict';import path from 'node:path';
import {RETAINED_ANSWER_WORDING as alias} from '../../app/retained-answer-wording.mjs';
import catalog from '../../app/world-catalog.json' with {type:'json'};
import {assertHonestChallengeFeedback} from './challenge-hints.mjs';
await import('../../scripts/test-runtime.mjs');
const {CHALLENGE_BANK,restoreChallenge,emptyChallenge}=await import('../../app/knowledge-challenge.ts');
const {createSave,emptyProgress,SAVE_KEY}=await import('../../app/progress-storage.ts');
const question=CHALLENGE_BANK.find(q=>q.topic===alias.topic),topic=catalog.find(t=>t.id===alias.topic);
function oldRound(finished){const other=CHALLENGE_BANK.filter(q=>q.difficulty==='easy'&&q.id!==question.id).slice(0,5),qs=finished?[...other,question]:[question,...other];return {difficulty:'easy',ids:qs.map(q=>q.id),orders:Object.fromEntries(qs.map(q=>[q.id,[...q.answers].reverse().map(value=>q.id===question.id&&value===alias.after?alias.before:value)])),index:finished?5:0,answer:finished?question.answers[question.correct]:alias.before,done:finished};}
export async function retainedAnswerWordingFlow(browser,base,ready,monitor,report,shots){
 const observed=[];
 for(const width of [320,1440])for(const finished of [false,true]){
  const session=oldRound(finished),expected=restoreChallenge(session,emptyChallenge());assert.deepEqual(expected.ids,session.ids,'legacy fixture represents a valid six-question round');
  const progress=emptyProgress();progress.favorites=['topic:animal-lion'];progress.games=finished?['memory','world:knowledge-challenge']:['memory'];progress.gameSessions={'world:knowledge-challenge':{challenge:session},'world:animal-detective':{items:['animal-lion','animal-koala'],index:1,roundAnswer:'Koala',roundDone:false}};progress.lastActivity={type:'game',id:'world:knowledge-challenge',family:'world'};
  const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});await c.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));},{key:SAVE_KEY,save:createSave(progress)});const p=await c.newPage();monitor(p);
  try{
   await p.goto(base);await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();const room=p.locator('.knowledge-challenge');await room.waitFor();
   if(finished)await room.getByRole('heading',{name:'Sechs Aufgaben gelöst!',exact:true}).waitFor();else{await room.getByRole('heading',{name:question.prompt,exact:true}).waitFor();assert.deepEqual(await room.locator('.quiz-answer > span:last-of-type').allTextContents(),[...question.answers].reverse());assert.equal(await room.locator('.quiz-answer.is-incorrect > span:last-of-type').innerText(),alias.after);assert.equal(await room.getByRole('heading',{name:'Sechs Aufgaben gelöst!',exact:true}).count(),0);}
   await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await room.waitFor();if(finished)await room.getByRole('heading',{name:'Sechs Aufgaben gelöst!',exact:true}).waitFor();else{await room.locator('.quiz-answer.is-incorrect > span:last-of-type').waitFor();assert.equal(await room.locator('.quiz-answer.is-incorrect > span:last-of-type').innerText(),alias.after);}
   const stored=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.deepEqual(stored.gameSessions['world:knowledge-challenge'].challenge,expected);assert.deepEqual(stored.favorites,progress.favorites);assert.deepEqual(stored.games,progress.games);assert.deepEqual(stored.gameSessions['world:animal-detective'],progress.gameSessions['world:animal-detective']);
   if(shots)await room.screenshot({path:path.join(shots,'answer-wording-challenge-'+(finished?'finished':'wrong')+'-'+width+'.png')});
   if(!finished){await room.getByRole('button').filter({has:p.getByText(question.answers[question.correct],{exact:true})}).click();await room.getByText('Deine Auswahl passt.',{exact:true}).waitFor();await assertHonestChallengeFeedback(room);await room.getByRole('button',{name:'Nächste Aufgabe',exact:true}).click();await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await room.waitFor();await p.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['world:knowledge-challenge'].challenge.index===1,SAVE_KEY);const next=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['world:knowledge-challenge'].challenge,SAVE_KEY);assert.deepEqual(next.ids,session.ids);assert.equal(next.answer,null);}
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);observed.push({width,finished,legacyOrder:true,wrongRemainsWrong:!finished,earnedFinishPreserved:finished,reload:true,otherProgressPreserved:true});
  }catch(error){if(shots)await p.screenshot({path:path.join(shots,'answer-wording-failure-'+width+'.png'),fullPage:true}).catch(()=>{});throw error;}finally{await c.close();}
 }
 const malformedMini=[];
 for(const width of [320,1440])for(const kind of ['duplicate','unknown']){
  const items=[kind==='duplicate'?alias.after:'unbekannte synthetische Antwort',alias.before,topic.question.answers[topic.question.correct]];
  const progress=emptyProgress();progress.favorites=['topic:animal-lion'];progress.games=['memory'];progress.gameSessions={memory:{open:[0],matched:[]},['topic:'+alias.topic]:{items,topicAnswer:alias.before}};
  const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  await c.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));},{key:SAVE_KEY,save:createSave(progress)});
  const p=await c.newPage();monitor(p);
  try{
   await p.goto(base+'#world/topic/'+alias.topic);await ready(p);
   const mini=p.locator('.world-mini-question');await mini.getByRole('heading',{name:topic.question.prompt,exact:true}).waitFor();
   assert.deepEqual(await mini.locator('.quiz-answer > span:last-of-type').allTextContents(),topic.question.answers,'malformed mixed alias/unknown choices fall back to all three unique canonical choices');
   assert.equal(await mini.locator('.quiz-answer.is-incorrect').count(),1);assert.equal(await mini.locator('.quiz-answer.is-incorrect > span:last-of-type').innerText(),alias.after);
   await p.reload();await ready(p);await mini.getByRole('heading',{name:topic.question.prompt,exact:true}).waitFor();
   assert.deepEqual(await mini.locator('.quiz-answer > span:last-of-type').allTextContents(),topic.question.answers);
   assert.equal(await mini.locator('.quiz-answer.is-incorrect').count(),1);
   const stored=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
   assert.deepEqual(stored.gameSessions['topic:'+alias.topic].items,items,'interpretation never overwrites original import evidence');
   assert.deepEqual(stored.favorites,progress.favorites);assert.deepEqual(stored.games,progress.games);assert.deepEqual(stored.gameSessions.memory,progress.gameSessions.memory);
   if(shots)await mini.screenshot({path:path.join(shots,'answer-wording-mini-'+kind+'-'+width+'.png')});
   malformedMini.push({width,kind,allThreeCanonicalChoices:true,oldWrongStillWrong:true,reload:true,unrelatedProgressPreserved:true});
  }finally{await c.close();}
 }
 report.answerWordingCompatibility={observed,malformedMini,scope:'Only actual consumers: topic mini-question and six-question knowledge challenge. Other world games generate different questions and remain unchanged.'};report.checks.push('Legacy wrong-answer wording: six-question IDs/shuffled orders/wrong choice/next step and earned finish survive actual resume/reload at320/1440; unrelated progress retained; malformed duplicate aliases/unknown mini orders fall back to all three unique canonical choices');
}
export async function offlineRetainedAnswerWording(p,report){
 const original=await p.evaluate(({key,id,before,answers})=>{const s=JSON.parse(localStorage.getItem(key));s.progress.gameSessions['topic:'+id]={...s.progress.gameSessions['topic:'+id],items:answers.map(v=>v===before.after?before.before:v).reverse(),topicAnswer:before.before};localStorage.setItem(key,JSON.stringify(s));return {favorites:s.progress.favorites,games:s.progress.games};},{key:SAVE_KEY,id:alias.topic,before:alias,answers:topic.question.answers});
 await p.reload();await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor();assert.equal(await p.evaluate(()=>navigator.onLine),false);await p.evaluate(id=>location.hash='world/topic/'+id,alias.topic);const q=p.locator('.world-mini-question');await q.getByRole('heading',{name:question.prompt,exact:true}).waitFor();assert.equal(await q.locator('.quiz-answer.is-incorrect > span:last-of-type').innerText(),alias.after);assert.deepEqual(await q.locator('.quiz-answer > span:last-of-type').allTextContents(),[...topic.question.answers].reverse());await p.reload();await p.locator('.world-mini-question .quiz-answer.is-incorrect > span:last-of-type').waitFor();assert.equal(await p.locator('.world-mini-question .quiz-answer.is-incorrect > span:last-of-type').innerText(),alias.after);await p.evaluate(({key,id,before,after,correct})=>{const s=JSON.parse(localStorage.getItem(key));s.progress.gameSessions['topic:'+id].items=[before,after,correct];s.progress.gameSessions['topic:'+id].topicAnswer=before;localStorage.setItem(key,JSON.stringify(s));},{key:SAVE_KEY,id:alias.topic,before:alias.before,after:alias.after,correct:topic.question.answers[topic.question.correct]});await p.reload();await p.locator('.world-mini-question .quiz-answer').first().waitFor();assert.equal(await p.evaluate(()=>navigator.onLine),false);assert.deepEqual(await p.locator('.world-mini-question .quiz-answer > span:last-of-type').allTextContents(),topic.question.answers,'cold offline duplicate alias order also displays all three canonical choices');assert.equal(await p.locator('.world-mini-question .quiz-answer.is-incorrect').count(),1);const saved=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.deepEqual(saved.favorites,original.favorites);assert.deepEqual(saved.games,original.games);report.answerWordingOffline={coldNavigatorOffline:true,duplicateOrderFallback:true,legacyOrder:true,wrongRemainsWrong:true,reload:true,otherProgressPreserved:true};
}
