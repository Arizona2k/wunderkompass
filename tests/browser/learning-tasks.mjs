import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {worldGameBank} from '../../app/world-game-bank.ts';
import {CHALLENGE_BANK,createChallenge} from '../../app/knowledge-challenge.ts';
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';

const ready=page=>page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
async function activate(page,control,touch){await control.scrollIntoViewIfNeeded();if(touch)await control.tap();else{await control.focus();await page.keyboard.press('Enter');}}
async function responses(page,room,question,key,touch,reloadAfterFirst){
 const before=await saved(page),prior=before.review[key],rows=[];let first;
 for(const answer of [...question.answers.filter((_,i)=>i!==question.correct),question.answers[question.correct]]){
  await activate(page,room.locator('.quiz-answer').filter({has:page.getByText(answer,{exact:true})}),touch);
  await page.waitForFunction(({key,seen})=>JSON.parse(localStorage.getItem(key)).progress.review[seen.key]?.seen===seen.count,{key:SAVE_KEY,seen:{key,count:(prior?.seen??0)+1}});
  const now=await saved(page);if(!first)first=structuredClone(now.review[key]);else assert.deepEqual(now.review[key],first,'correction attempts must not count as additional repetitions');
  assert.deepEqual(now.notes,before.notes,'actual post-import note identities and text remain');rows.push({answer,review:now.review[key]});if(rows.length===1&&reloadAfterFirst){await reloadAfterFirst();const reloaded=await saved(page);assert.deepEqual(reloaded.review[key],first,'reload of the pending first response is the same attempt');assert.deepEqual(reloaded.notes,before.notes);}
 }
 return {prior:prior??null,stages:rows,oneReviewForTheWholeAttempt:true};
}
export async function learningTaskCorrectionsView(browser,base,{shots,engine='chromium',widths=[320,1440]}={}){
 const rows=[];let context,page,current;
 const catalogue=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
 async function load(name,width,pass){
  await context?.close();current={name,width,...browserErrorArrays()};rows.push(current);context=await browser.newContext({viewport:{width,height:950},hasTouch:true,reducedMotion:width===320?'reduce':'no-preference',acceptDownloads:true});page=await context.newPage();page.setDefaultTimeout(20000);monitorBrowserErrors(page,base,current);
  pass.progress.notes=[{id:'learning-audit-synthetic-note',text:'Nur eine synthetische Prüfnotiz.',at:'2026-10-29T00:00:00Z'}];pass.progress.settings.largeText=width===320;pass.progress.settings.reducedMotion=width===320;
  await page.goto(base+'/#home');await ready(page);const file=path.join(shots,`journey-engine-${engine}-learning-task-${name}-${width}-synthetic.json`);await fs.writeFile(file,JSON.stringify(pass,null,2)+'\n');
  await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.locator('input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await page.locator('.passport-dialog').waitFor({state:'hidden'});current.actualSyntheticFileImported=true;
 }
 async function game(name,width){await activate(page,page.getByRole('tab',{name:'Spielplatz',exact:true}),width===320);await activate(page,page.locator('[data-game-key="'+name+'"]'),width===320);return page.locator('.game-room:visible');}
 function complete(){assert(browserErrorsComplete(current));current.status='passed';}
 try{
  for(const width of widths){const touch=width===320;
   for(const [gameId,id] of [['people','person-karl_benz'],['people','person-al_khwarizmi'],['technology','invention-telescope'],['then-now','invention-compass-today']]){
    const pool=worldGameBank(gameId),q=pool.find(item=>item.id===id);assert(q);const pass=createSave();pass.progress.gameSessions['world:'+gameId]={items:[id],index:0,roundAnswer:null,roundDone:false,orders:{[id]:q.answers}};
    await load(id,width,pass);const room=await game('world:'+gameId,width);await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
    if(id==='person-karl_benz')assert(!/\b(?:Karl\s+)?Benz\b/iu.test(q.prompt),'recognition clue does not name Benz');
    if(id==='person-al_khwarizmi')assert(!/al[-\s]?(?:Chwarizmi|Khwarizmi)/iu.test(q.prompt),'recognition clue does not name either alias');
    if(id==='invention-telescope'){assert(/Linsen oder Spiegel/.test(q.prompt)&&/Licht/.test(q.prompt));assert(!/Fernrohr|Teleskop/i.test(q.prompt));}
    if(gameId==='then-now')assert.equal(q.answers[q.correct],'Früher und heute');
    const hint=room.locator('.world-game-hint');await activate(page,hint.locator('summary'),touch);current.actualHint=await hint.locator('p').innerText();current.actualPrompt=await room.getByRole('heading',{name:q.prompt,exact:true}).innerText();current.actualChoices=await room.locator('.quiz-answer').allTextContents();
    current.responses=await responses(page,room,q,'world-game:'+gameId+':'+id,touch,async()=>{await page.reload();await ready(page);await game('world:'+gameId,width);await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();});
    const beforeReload=await saved(page);await page.reload();await ready(page);const reloaded=await game('world:'+gameId,width);await reloaded.getByRole('heading',{name:q.prompt,exact:true}).waitFor();assert.deepEqual((await saved(page)).review,beforeReload.review,'reload does not add a repetition');assert.deepEqual((await saved(page)).notes,beforeReload.notes);
    if(id==='invention-compass-today'&&width===320)await reloaded.screenshot({path:path.join(shots,`journey-engine-${engine}-learning-compass-current-${width}.png`),animations:'disabled'});
    current.reloadRetainsOneAttempt=true;
    if(id==='person-karl_benz'){
     const beforeNew=await saved(page);await activate(page,reloaded.getByRole('button',{name:'Neue Runde',exact:true}),touch);await reloaded.locator('.game-board h2').waitFor();const prompt=await reloaded.locator('.game-board h2').innerText(),next=pool.find(q=>q.prompt===prompt);assert(next,'new actual round uses a canonical question');const key='world-game:'+gameId+':'+next.id;
     await activate(page,reloaded.locator('.quiz-answer').filter({has:page.getByText(next.answers[next.correct],{exact:true})}),touch);await page.waitForFunction(({storage,key,seen})=>JSON.parse(localStorage.getItem(storage)).progress.review[key]?.seen===seen,{storage:SAVE_KEY,key,seen:(beforeNew.review[key]?.seen??0)+1});const afterNew=await saved(page);for(const[oldKey,value]of Object.entries(beforeNew.review))if(oldKey!==key)assert.deepEqual(afterNew.review[oldKey],value,'a new round preserves prior independent reviews');assert.deepEqual(afterNew.notes,beforeNew.notes);current.deliberateNewWorldRoundCountsOnce=true;
    }
    complete();
   }
   // Old statements are retained as old selections, never silently reclassified.
   for(const oldAnswer of ['Heute','Früher','Nur ein Zukunftswunsch']){
    const id='invention-compass-today',q=worldGameBank('then-now').find(q=>q.id===id),other=worldGameBank('then-now').find(q=>q.id!==id),pass=createSave();pass.progress.gameSessions['world:then-now']={items:[id],index:0,roundAnswer:oldAnswer,roundDone:false,orders:{[id]:['Heute','Früher','Nur ein Zukunftswunsch'],[other.id]:other.answers}};
    await load('old-compass-'+oldAnswer.replaceAll(' ','-'),width,pass);const room=await game('world:then-now',width);await room.getByText('Deine frühere Auswahl „'+oldAnswer+'“ gehört nicht mehr zu den überarbeiteten Antwortmöglichkeiten. Wähle erneut; deine Runde und Erfolge bleiben erhalten.',{exact:true}).waitFor();
    const before=await saved(page);assert.equal(before.gameSessions['world:then-now'].roundAnswer,oldAnswer);assert.deepEqual(before.gameSessions['world:then-now'].orders[other.id],other.answers);assert.equal(before.review['world-game:then-now:'+id],undefined);current.oldAnswerNotReinterpreted=oldAnswer;current.unrelatedOrderPreserved=true;
    await activate(page,room.locator('.quiz-answer').filter({has:page.getByText(q.answers[q.correct],{exact:true})}),touch);await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).progress.review['world-game:then-now:invention-compass-today']?.seen===1,SAVE_KEY);assert.deepEqual((await saved(page)).notes,before.notes);complete();
   }
   const topic=catalogue.find(topic=>topic.id==='animal-honey-bee');await load('mini-review',width,createSave());await page.goto(base+'/#world/topic/'+topic.id);await ready(page);const mini=page.locator('.world-mini-question');await mini.getByRole('heading',{name:topic.question.prompt,exact:true}).waitFor();current.responses=await responses(page,mini,topic.question,'world-question:'+topic.id,touch,async()=>{await page.reload();await ready(page);await mini.getByRole('heading',{name:topic.question.prompt,exact:true}).waitFor();});
   await activate(page,mini.getByRole('button',{name:'Später noch einmal prüfen',exact:true}),touch);await activate(page,mini.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[topic.question.correct],{exact:true})}),touch);await page.waitForFunction(({key,id})=>JSON.parse(localStorage.getItem(key)).progress.review['world-question:'+id]?.seen===2,{key:SAVE_KEY,id:topic.id});current.deliberateNewMiniAttemptCountsOnce=true;complete();
   const challenge=createChallenge('easy',[],()=>0.37),q=CHALLENGE_BANK.find(q=>q.id===challenge.ids[0]),pass=createSave();pass.progress.gameSessions['world:knowledge-challenge']={challenge};await load('challenge-review',width,pass);const challengeRoom=await game('world:knowledge-challenge',width);current.responses=await responses(page,challengeRoom,q,'challenge:'+q.id,touch,async()=>{await page.reload();await ready(page);await game('world:knowledge-challenge',width);await challengeRoom.getByRole('heading',{name:q.prompt,exact:true}).waitFor();});complete();
   // All seven actual callers of the shared advanced hint stack retain the
   // solution after an answer; none displays the full solution as a hint.
   for(const id of ['flags','capitals','silhouettes','animal-detective','climate-detective','photos','treasure']){
    const pass=createSave();if(id==='flags')pass.progress.gameSessions.flags={items:[{q:'Zu welchem Land gehört diese Flagge?',choices:['Deutschland','Japan','Frankreich'],correct:'Japan',why:'Japan hat Tokio als Hauptstadt.',iso:'JP'}],index:0,answer:null,done:false};await load('hints-'+id,width,pass);const room=await game('extra:'+id,width);await room.locator('.learning-hints').waitFor();
    const before=await saved(page),session=before.gameSessions[id],item=session.items[session.index],hint=room.locator('.learning-hints'),more=hint.getByRole('button');assert.equal(session.answer,null);assert(typeof item.why==='string'&&item.why.length>0);
    await activate(page,more,touch);await activate(page,more,touch);assert.equal(await hint.locator('li').count(),2);assert(await more.isDisabled(),'the third full solution is not a pre-answer hint');const text=await hint.innerText();assert(!text.includes(item.why),'full explanation remains undisclosed before an answer');if(id==='flags')assert(!text.includes('Japan'));assert.deepEqual((await saved(page)).gameSessions[id],session,'hint viewing does not submit an answer');
    await activate(page,room.locator('.quiz-answer').filter({has:page.getByText(item.correct,{exact:true})}),touch);await room.locator('.game-feedback').getByText(item.why,{exact:true}).waitFor();assert.deepEqual((await saved(page)).notes,before.notes);current.twoHelpfulHintsAndPostAnswerExplanation=true;if(id==='flags'&&width===320)await room.screenshot({path:path.join(shots,`journey-engine-${engine}-learning-japan-post-answer-${width}.png`),animations:'disabled'});complete();
   }
  }
  return {cases:rows,widths,scope:'Actual current canonical question text/allchoices/hints/feedback and wrong-correction-oneattempt, retiredcompasschoices, deliberate newmini attempt, challenge and all7advanced hintcallers; real syntheticfileimports. Not whole-game or fullnative acceptance.'};
 }catch(error){await page?.screenshot({path:path.join(shots,`journey-engine-${engine}-learning-task-original-failure.png`),fullPage:true}).catch(()=>{});await fs.writeFile(path.join(shots,`journey-engine-${engine}-learning-task-original-failure.json`),JSON.stringify({failure:error.stack,cases:rows},null,2)+'\n');throw error;}
 finally{await context?.close();}
}
