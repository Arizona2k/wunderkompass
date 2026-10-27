import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {worldGameBank} from '../../app/world-game-bank.ts';
import legacy from '../fixtures/legacy-habitat-three-actual-questions.json' with {type:'json'};

const game='world:habitats',pool=worldGameBank('habitats');
const ids=['animal-walrus','animal-orca','animal-blue-whale','animal-koala','animal-lion'];
const state=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)).progress,SAVE_KEY);
async function open(p){await p.getByRole('tab',{name:'Spielplatz',exact:true}).click();await p.locator('[data-game-key="'+game+'"]').click();await p.locator('.world-game-room').waitFor();}
async function importPass(p,file){await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.locator('input[type=file]').setInputFiles(file);await p.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await p.locator('.passport-dialog').waitFor({state:'hidden'});await open(p);}
function unchanged(progress,pass){
 for(const key of ['notes','favorites'])assert.deepEqual(progress[key],pass.progress[key]);
 for(const id of ['memory','journey:water','world:technology'])assert.deepEqual(progress.gameSessions[id],pass.progress.gameSessions[id]);
 assert.deepEqual(progress.gameSessions[game].items,ids);assert.equal(progress.gameSessions[game].unrelated,'preserve');assert.deepEqual(progress.gameSessions[game].orders.futureField,{keep:true});
}

export async function habitatAnswerSemantics(browser,base,ready,monitor,report,shots){
 report.habitatAnswerSemantics??=[];
 for(const width of [320,1440]){
  const pass=createSave();pass.progress.settings.largeText=width===320;pass.progress.games=['memory'];pass.progress.favorites=['topic:animal-walrus'];pass.progress.notes=[{id:'old-habitat-note',text:'Vorhandene synthetische Notiz.',at:'2026-10-18T00:00:00.000Z'}];pass.progress.gameSessions.memory={open:[0],matched:[]};pass.progress.gameSessions['journey:water']={'chapter:2:note':'Unberührte Wassernotiz.'};pass.progress.gameSessions['world:technology']={items:['invention-paper'],roundAnswer:'Alte Auswahl',orders:{future:{keep:true}}};pass.progress.gameSessions[game]={items:ids,index:0,roundAnswer:'Arktis',roundDone:false,orders:{...Object.fromEntries(legacy.questions.map(q=>[q.id,[...q.answers].reverse()])),futureField:{keep:true}},unrelated:'preserve'};pass.progress.review['world-game:habitats:animal-walrus']={correct:false,seen:2,due:'2026-10-18'};
  const file=shots+'/synthetic-old-habitat-'+width+'.json';await fs.writeFile(file,JSON.stringify(pass,null,2)+'\n');
  let context=await browser.newContext({viewport:{width,height:950},hasTouch:width===320,reducedMotion:'reduce',acceptDownloads:true}),p=await context.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.goto(base);await ready(p);await importPass(p,file);const room=p.locator('.world-game-room');
   await room.getByText('Richtig verbunden!',{exact:true}).waitFor();await room.getByText(/Deine frühere Antwort „Arktis“ passt fachlich/).waitFor();
   assert.equal(await room.locator('.quiz-answer.is-correct').getAttribute('aria-pressed'),'true');assert.equal(await room.locator('.quiz-answer.is-correct>span:nth-of-type(2)').innerText(),'Arktische Küsten und Meere');assert.equal(await room.locator('.quiz-answer').filter({has:p.getByText('Arktis',{exact:true})}).count(),0);
   let progress=await state(p);unchanged(progress,pass);assert.equal(progress.gameSessions[game].roundAnswer,'Arktis');assert.deepEqual(progress.games,pass.progress.games);assert.deepEqual(progress.review,pass.progress.review,'opening/importing does not fabricate a new correct review or stamp');
   await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await room.getByText('Richtig verbunden!',{exact:true}).waitFor();assert.equal((await state(p)).gameSessions[game].roundAnswer,'Arktis');
   await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();const downloading=p.waitForEvent('download');await p.getByRole('button',{name:'Entdeckerpass sichern',exact:true}).click();const downloaded=shots+'/actual-habitat-download-'+width+'.json';await(await downloading).saveAs(downloaded);const exported=JSON.parse(await fs.readFile(downloaded,'utf8'));unchanged(exported.progress,pass);assert.equal(exported.progress.gameSessions[game].roundAnswer,'Arktis');assert.deepEqual(exported.progress.games,pass.progress.games);
   await context.close();context=await browser.newContext({viewport:{width,height:950},hasTouch:width===320,reducedMotion:'reduce',acceptDownloads:true});p=await context.newPage();monitor(p);p.setDefaultTimeout(20000);await p.goto(base);await ready(p);await importPass(p,downloaded);const restored=p.locator('.world-game-room');await restored.getByText('Richtig verbunden!',{exact:true}).waitFor();await restored.screenshot({path:shots+'/habitat-accepted-old-arctic-'+width+'.png'});
   for(let index=0;index<ids.length;index++){
    const q=pool.find(q=>q.id===ids[index]);await restored.getByRole('heading',{name:q.prompt,exact:true}).waitFor();assert.equal((await state(p)).games.includes(game),false,'no game stamp before all five tasks');
    if(index){await restored.locator('.quiz-answer').filter({has:p.getByText(q.answers[1],{exact:true})}).click();await restored.getByText('Noch einmal überlegen.',{exact:true}).waitFor();assert.equal(await restored.getByRole('button',{name:'Nächste Aufgabe',exact:true}).count(),0);await restored.locator('.quiz-answer').filter({has:p.getByText(q.answers[q.correct],{exact:true})}).click();await restored.getByText('Richtig verbunden!',{exact:true}).waitFor();}
    await restored.getByRole('button',{name:index===4?'Spielstempel sammeln':'Nächste Aufgabe',exact:true}).click();
   }
   await restored.getByRole('heading',{name:'Eine ganze Runde gelöst!',exact:true}).waitFor();progress=await state(p);unchanged(progress,pass);assert(progress.games.includes(game));assert(progress.games.includes('memory'));assert.equal(progress.review['world-game:habitats:animal-walrus'].correct,true);assert.equal(progress.gameSessions[game].roundDone,true);
   await p.reload();await ready(p);await open(p);await p.locator('.world-game-room').getByRole('heading',{name:'Eine ganze Runde gelöst!',exact:true}).waitFor();assert((await state(p)).games.includes(game));
   const blue=structuredClone(pass);blue.progress.gameSessions[game].index=2;blue.progress.gameSessions[game].roundAnswer='Arktis';blue.progress.games=['memory',game];const blueFile=shots+'/synthetic-blue-whale-old-wrong-'+width+'.json';await fs.writeFile(blueFile,JSON.stringify(blue,null,2)+'\n');await importPass(p,blueFile);const negative=p.locator('.world-game-room');await negative.getByText(/Deine frühere Auswahl „Arktis“ gehört nicht mehr/).waitFor();assert.equal(await negative.getByText('Richtig verbunden!',{exact:true}).count(),0);assert.equal(await negative.getByRole('button',{name:'Nächste Aufgabe',exact:true}).count(),0);progress=await state(p);assert.equal(progress.gameSessions[game].roundAnswer,'Arktis');assert(progress.games.includes(game),'previously earned stamp survives a factual correction');unchanged(progress,blue);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   report.habitatAnswerSemantics.push({width,large:width===320,realImportReloadDownloadAndFreshImport:true,oldArcticAcceptedForWalrus:true,noAutomaticReviewOrStamp:true,fiveTaskRoundCompleted:true,blueWhaleArcticNotAccepted:true,previousEarnedStampAndOtherStatesRetained:true});
  }finally{await context.close();}
 }
 report.checks.push('Semantic habitat regression: real old Walrus Arctic import/reload/download/fresh import and five-task completion at320large/1440; blue-whale Arctic stays incorrect; earned progress and unrelated states retained');
}
