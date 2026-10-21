import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {SAVE_KEY} from '../../app/progress-storage.ts';
import {worldGameBank} from '../../app/world-game-bank.ts';
import {worldGameHint,worldGameWrongFeedback} from '../../app/world-game-support.mjs';
const families=['animal-detective','habitats','food'];
const snapshot=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),SAVE_KEY);
async function importFile(p,file){await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.locator('input[type=file]').setInputFiles(file);await p.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await p.locator('.passport-dialog').waitFor({state:'hidden'});}
// Ordinary changed-product regression on the already stopped-server cached app.
// The existing offline lifecycle/assertions finish first and remain unchanged.
// Import a synthetic round through the real pass UI; preserve every other field,
// and restore the original synthetic pass through that UI before returning.
export async function worldGameOfflineSemantics(page,{shots,kind,native=false}){
 const original=await snapshot(page),working=structuredClone(original),prefix='cached-world-semantics-'+kind+(native?'-native':'');
 const originalFile=path.join(shots,prefix+'-original-synthetic-pass.json'),fixture=path.join(shots,prefix+'-rounds-synthetic-pass.json');
 await fs.writeFile(originalFile,JSON.stringify(original,null,2)+'\n');
 for(const game of families){const pool=worldGameBank(game),id=game==='food'?'animal-monarch-butterfly':'animal-walrus';working.progress.gameSessions['world:'+game]={items:[id,...pool.filter(q=>q.id!==id).slice(0,4).map(q=>q.id)],index:0,roundAnswer:game==='habitats'?'Arktis':null,roundDone:false,orders:Object.fromEntries(pool.map(q=>[q.id,[...q.answers].reverse()]))};}
 await fs.writeFile(fixture,JSON.stringify(working,null,2)+'\n');const cases=[];
 for(const width of [320,1440]){
  await page.setViewportSize({width:width*(native?2:1),height:950});assert.equal(await page.evaluate(()=>innerWidth),width);await importFile(page,fixture);
  for(const game of families){
   await page.getByRole('tab',{name:'Spielplatz',exact:true}).click();await page.locator('[data-game-key="world:'+game+'"]').click();const q=worldGameBank(game).find(q=>q.id===working.progress.gameSessions['world:'+game].items[0]),room=page.locator('.world-game-room');await room.getByRole('heading',{name:q.prompt,exact:true}).waitFor();const hint=room.locator('.world-game-hint');assert.equal(await hint.getAttribute('open'),null);await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));await hint.locator('summary').focus();await page.keyboard.press('Enter');await hint.getByText(worldGameHint(game,q),{exact:true}).waitFor();
   if(game==='habitats'){await room.getByText(/Deine frühere Antwort „Arktis“ passt fachlich/).waitFor();assert.equal(await room.locator('.quiz-answer.is-correct>span:nth-of-type(2)').innerText(),'Arktische Küsten und Meere');assert.equal((await snapshot(page)).progress.gameSessions['world:habitats'].roundAnswer,'Arktis');}
   else{assert.equal(await room.getByText(q.why,{exact:true}).count(),0);const wrong=q.answers[1];await room.locator('.quiz-answer').filter({has:page.getByText(wrong,{exact:true})}).click();await room.locator('.lab-feedback').getByText(worldGameWrongFeedback(game,q,wrong),{exact:true}).waitFor();assert.equal(await room.getByText(q.why,{exact:true}).count(),0);await room.locator('.quiz-answer').filter({has:page.getByText(q.answers[q.correct],{exact:true})}).click();}
   await room.getByText('Richtig verbunden!',{exact:true}).waitFor();await room.locator('.lab-feedback').getByText(q.why,{exact:true}).waitFor();await room.getByRole('button',{name:'Erklärung vorlesen',exact:true}).waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);const saved=(await snapshot(page)).progress;assert.deepEqual(saved.games,working.progress.games,'no stamp merely from one answered question');assert.deepEqual(saved.notes,working.progress.notes);assert.deepEqual(saved.favorites,working.progress.favorites);assert.deepEqual(saved.settings,working.progress.settings);for(const[id,value]of Object.entries(original.progress.gameSessions))if(!families.some(f=>'world:'+f===id))assert.deepEqual(saved.gameSessions[id],value);
   assert.deepEqual(saved.gameSessions['world:'+game].items,working.progress.gameSessions['world:'+game].items);assert.equal(saved.gameSessions['world:'+game].index,0);assert.equal(saved.gameSessions['world:'+game].roundDone,false);cases.push({width,native,game,id:q.id,actualCachedAppAfterServerStop:true,voluntaryHint:true,separateWrongAndFinalFeedback:true,oldArcticStringRetained:game==='habitats',unrelatedPassStatesRetained:true});await page.getByRole('button',{name:'Alle Spiele',exact:true}).click();
  }
 }
 await importFile(page,originalFile);const restored=(await snapshot(page)).progress;for(const key of ['gameSessions','notes','favorites','games','review','settings'])assert.deepEqual(restored[key],original.progress[key],'original synthetic pass restored through actual import UI: '+key);assert.equal(cases.length,6);return{cases,originalPassRestoredThroughActualUI:true,audibleOrPhysicalDeviceClaim:false};
}
