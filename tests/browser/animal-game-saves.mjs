import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {worldGameBank} from '../../app/world-game-bank.ts';
import retained from '../fixtures/retained-animal-game-before-expansion.json' with {type:'json'};

const pool=worldGameBank('animal-detective');
const affected=retained.animalDetective.filter(old=>!old.answers.every(a=>pool.find(q=>q.id===old.id).answers.includes(a)));
assert.equal(affected.length,9);
const groups=[affected.slice(0,5),[...affected.slice(5),retained.animalDetective[0]]];
const game='world:animal-detective';
const state=p=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);
const open=async p=>{await p.getByRole('tab',{name:'Spielplatz',exact:true}).click();await p.locator('[data-game-key="'+game+'"]').click();await p.locator('.world-game-room').waitFor();};
async function exactRound(p,old,orders,{wrong=false}={}){
 const current=pool.find(q=>q.id===old.id),room=p.locator('.world-game-room');
 await room.getByRole('heading',{name:current.prompt,exact:true}).waitFor();
 assert.deepEqual(await room.locator('.quiz-answer>span:nth-of-type(2)').allTextContents(),orders[old.id]);
 if(wrong){
  await room.getByText('Noch einmal überlegen.',{exact:true}).waitFor();
  assert.equal(await room.locator('.quiz-answer.is-incorrect>span:nth-of-type(2)').innerText(),old.answers[2]);
  assert.equal(await room.getByRole('button',{name:'Nächste Aufgabe',exact:true}).count(),0);
 }
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
}

export async function retainedAnimalRounds(browser,base,ready,monitor,report,shots){
 report.retainedAnimalRounds??=[];
 for(const width of [320,1440])for(const [round,old] of groups.entries()){
  const options={viewport:{width,height:950},hasTouch:width===320,reducedMotion:'reduce',acceptDownloads:true};
  const context=await browser.newContext(options),pass=createSave(),orders=Object.fromEntries(retained.animalDetective.map(q=>[q.id,[...q.answers].reverse()]));
  pass.progress.settings.largeText=width===320;
  pass.progress.notes=[{id:'old-animal-note',text:'Synthetische alte Notiz.',at:'2026-10-18T00:00:00.000Z'}];
  pass.progress.favorites=['topic:animal-koala'];
  pass.progress.gameSessions.memory={open:[0],matched:[]};
  pass.progress.gameSessions['journey:seasons']={'chapter:2:note':'Synthetischer alter Merkzettel.'};
  pass.progress.gameSessions[game]={items:old.map(q=>q.id),index:0,orders,roundAnswer:old[0].answers[2],roundDone:false};
  await context.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));},{key:SAVE_KEY,save:pass});
  const p=await context.newPage();monitor(p);p.setDefaultTimeout(26000);
  let imported;
  try{
   await p.goto(base);await ready(p);await open(p);await exactRound(p,old[0],orders,{wrong:true});
   await p.reload();await ready(p);await p.getByRole('button',{name:'Fortsetzen',exact:true}).click();await exactRound(p,old[0],orders,{wrong:true});
   await p.screenshot({path:shots+'/animal-retained-wrong-'+round+'-'+width+'.png',fullPage:true});
   await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();
   const download=p.waitForEvent('download');await p.getByRole('button',{name:'Entdeckerpass sichern',exact:true}).click();
   const file=shots+'/synthetic-retained-animal-'+round+'-'+width+'.json';await(await download).saveAs(file);
   const exported=JSON.parse(await fs.readFile(file,'utf8'));assert.equal(exported.schemaVersion,3);
   for(const [id,order]of Object.entries(orders))assert.deepEqual(exported.progress.gameSessions[game].orders[id],order);
   imported=await browser.newContext(options);const restore=await imported.newPage();monitor(restore);restore.setDefaultTimeout(26000);
   await restore.goto(base);await ready(restore);await restore.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();
   await restore.locator('input[type=file]').setInputFiles(file);await restore.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await restore.locator('.passport-dialog').waitFor({state:'hidden'});
   await restore.getByRole('button',{name:'Fortsetzen',exact:true}).click();await exactRound(restore,old[0],orders,{wrong:true});
   const room=restore.locator('.world-game-room');
   for(let index=0;index<old.length;index++){
    const q=old[index];await exactRound(restore,q,orders);
    if(index){await room.locator('.quiz-answer').filter({has:restore.getByText(q.answers[2],{exact:true})}).click();await room.getByText('Noch einmal überlegen.',{exact:true}).waitFor();}
    assert.equal((await state(restore)).games.includes(game),false,'no stamp before completing all five tasks');
    await room.locator('.quiz-answer').filter({has:restore.getByText(q.answers[q.correct],{exact:true})}).click();await room.getByText('Richtig verbunden!',{exact:true}).waitFor();
    await room.getByRole('button',{name:index===4?'Spielstempel sammeln':'Nächste Aufgabe',exact:true}).click();
   }
   await room.getByRole('heading',{name:'Eine ganze Runde gelöst!',exact:true}).waitFor();
   const after=await state(restore);assert.equal(after.gameSessions[game].roundDone,true);assert.ok(after.games.includes(game));
   assert.deepEqual(after.gameSessions[game].items,old.map(q=>q.id));
   for(const [id,order]of Object.entries(orders))assert.deepEqual(after.gameSessions[game].orders[id],order);
   assert.deepEqual(after.notes,pass.progress.notes);assert.deepEqual(after.favorites,pass.progress.favorites);
   for(const id of ['memory','journey:seasons'])assert.deepEqual(after.gameSessions[id],pass.progress.gameSessions[id]);
   await restore.reload();await ready(restore);await open(restore);await room.getByRole('heading',{name:'Eine ganze Runde gelöst!',exact:true}).waitFor();
   report.retainedAnimalRounds.push({width,large:width===320,round,ids:old.map(q=>q.id),oldChoices:true,actualReload:true,actualDownloadAndFreshImport:true,wrongAndCorrect:true,allOldOrdersAndOtherProgressPreserved:true,stampAfterFiveOnly:true});
  }finally{await imported?.close();await context.close();}
 }
 report.checks.push('All nine changed pre-expansion animal choices retained in genuine five-task rounds at320large/1440; real reload, download/fresh import, wrong/right feedback and earned stamp; unrelated progress retained');
}
