import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {runBrowser,base,shots} from './runtime.mjs';
const data=JSON.parse(await fs.readFile(new URL('../fixtures/learning.json',import.meta.url),'utf8'));
const extra=[['flags','Flaggen-Forscher'],['flag-memory','Flaggen-Memory'],['capitals','Hauptstadt-Reise'],['continent-sort','Länder einsortieren'],['continent-puzzle','Kontinente-Puzzle'],['silhouettes','Länder-Silhouetten'],['animal-detective','Tierdetektiv'],['habitat-sort','Lebensraum-Sortierer'],['climate-detective','Klima-Detektiv'],['weather-match','Wetter-Zeichen'],['volcano-label','Vulkan beschriften'],['photos','Foto-Forscher'],['worldtour','Abenteuer-Weltreise'],['treasure','Schatzsuche der Natur'],['ocean-find','Ozean-Navigator'],['neighbors','Nachbarn entdecken']];
const classics=[['memory','Länder-Memory'],['order','Bring’s in die Reihenfolge'],['habitats','Wer lebt wo?'],['detective','Stimmt das wirklich?']];
const stations=['Deutschland','Giraffe','Größte heiße Wüste','Anden','Tropischer Regenwald','Er ist der größte Ozean','Ein Kontinent'];
const report=process.env.QA_RESUME?JSON.parse(await fs.readFile(shots+'/quality-legacy-games-report.json','utf8')):{browser:'',checks:[],errors:[],consoleErrors:[],completed:[],missing:[]};
await runBrowser(async browser=>{
 report.browser=browser.version();const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce',acceptDownloads:true}),p=await c.newPage();p.setDefaultTimeout(20000);
 p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
 const wait=(fn,arg)=>p.waitForFunction(fn,arg,{polling:250});
 const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 const snap=async id=>{await wait(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.gameSessions[id]!==undefined,id);return(await state()).gameSessions[id];};
 const open=async name=>{await p.getByRole('tab',{name:'Spielplatz',exact:true}).tap();await p.locator('.game-tile').filter({has:p.getByRole('heading',{name,exact:true})}).tap();await p.locator(name==='Das große Welt-Quiz'?'.quiz-card':name==='Weltreise-Suche'?'#globe-mission':'.game-board:visible').waitFor();};
 async function saved(id){await wait(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.games.includes(id),id);report.completed.push(id);console.log('PLAYED',id);await fs.writeFile(shots+'/quality-legacy-games-report.json',JSON.stringify(report,null,2));}
 const back=()=>p.getByRole('button',{name:'Alle Spiele',exact:true}).tap();
 async function memory(id){await wait(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.gameSessions[id]?.cards?.length===12,id);const s=await snap(id);const byPair=[...new Set(s.cards.map(c=>c.pair))];const first=s.cards[0],wrong=s.cards.find(c=>c.pair!==first.pair);await p.getByRole('button',{name:'Karte '+(s.cards.indexOf(first)+1)+' aufdecken',exact:true}).tap();await p.getByRole('button',{name:'Karte '+(s.cards.indexOf(wrong)+1)+' aufdecken',exact:true}).tap();await p.getByRole('button',{name:'Karten wieder zudecken',exact:true}).tap();for(const pair of byPair){for(const card of s.cards.filter(c=>c.pair===pair))await p.getByRole('button',{name:'Karte '+(s.cards.indexOf(card)+1)+' aufdecken',exact:true}).tap();}await saved(id);}
 await p.goto(base);await p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
 for(const [id,name] of (process.env.QA_RESUME?[]:classics)){
  await open(name);
  if(id==='memory')await memory(id);
  else if(id==='order'){
   for(const topic of ['layers','water']){if(topic==='water')await p.getByRole('button',{name:'Wasserkreislauf',exact:true}).tap();const s=await snap(id);const correct=topic==='layers'?data.LAYERS.map(l=>l.name):['Wasser verdunstet','Tröpfchen bilden eine Wolke','Regen fällt zur Erde','Wasser fließt zurück'];for(const n of correct)await p.locator('.order-pool').getByRole('button',{name:n,exact:true}).tap();await p.getByRole('button',{name:'Reihenfolge prüfen',exact:true}).tap();await saved('order-'+topic);}
  }else{
   let s=await snap(id);for(let i=0;i<s.items.length;i++){s=await snap(id);const current=s.items[i],right=id==='habitats'?current.correct:(current[1]?'Stimmt':'Stimmt nicht');if(id==='habitats'&&i===0){await p.locator('.habitat-options button').filter({hasNot:p.getByText(right,{exact:true})}).first().tap();await p.getByText('Denk an den Hinweis und probier noch einmal.',{exact:true}).waitFor();}await p.locator(id==='habitats'?'.habitat-options':'.truth-buttons').getByRole('button',{name:right,exact:true}).tap();await p.getByRole('button',{name:i===s.items.length-1?(id==='habitats'?'Spiel abschließen':'Ergebnis ansehen'):(id==='habitats'?'Nächstes Lebewesen':'Nächste Aussage'),exact:true}).tap();}await saved(id);
  }
  await back();
 }
 for(const [id,name] of extra.filter(([id])=>(!process.env.QA_ONLY||process.env.QA_ONLY.split(',').includes(id))&&(!process.env.QA_RESUME||!report.completed.includes(id)))){
  console.log('OPENING',id);await open(name);console.log('VISIBLE',id);let s=await snap(id);console.log('SAVED',id,Object.keys(s));
  if(id==='flag-memory')await memory(id);
  else if(['continent-sort','habitat-sort','weather-match'].includes(id)){
   await wait(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.gameSessions[id]?.items?.length>0,id);s=await snap(id);
   for(const [i,item] of s.items.entries()){await p.locator('.sorting-deck button').filter({hasText:item.name}).first().tap();if(i===0){await p.locator('.sort-target').filter({hasNot:p.getByText(item.target,{exact:true})}).first().tap();assert.ok((await state()).gameSessions[id].found.length===0);}await p.locator('.sort-target').filter({has:p.getByText(item.target,{exact:true})}).tap();}await saved(id);
  }else if(id==='continent-puzzle'){for(let i=0;i<data.CONTINENTS.length;i++){await p.locator('.sorting-deck').getByRole('button',{name:data.CONTINENTS[i].name,exact:true}).tap();await p.getByRole('button',{name:'Feld '+(i+1),exact:true}).tap();}await saved(id);}
  else if(id==='volcano-label'){for(const [i,name] of ['Krater','Schlot','Magmakammer','Lava'].entries()){await p.locator('.sorting-deck').getByRole('button',{name,exact:true}).tap();await p.getByRole('button',{name:'Feld '+(i+1),exact:true}).tap();}await saved(id);}
  else if(id==='worldtour'){for(let i=0;i<7;i++){await p.locator('.quiz-answers').getByRole('button',{name:stations[i],exact:true}).tap();await p.getByRole('button',{name:i===6?'Weltreise abschließen':'Zur nächsten Station',exact:true}).tap();}await saved(id);}
  else if(id==='ocean-find'){for(let i=0;i<5;i++){await p.getByRole('button',{name:'Punkt '+(i+1),exact:true}).tap();if(i<4)await p.getByRole('button',{name:'Nächster Ozean',exact:true}).tap();}await saved(id);}
  else if(id==='neighbors'){for(const name of ['Dänemark','Polen','Tschechien','Österreich','Schweiz','Frankreich','Luxemburg','Belgien','Niederlande'])await p.locator('.habitat-options button').filter({hasText:name}).tap();await saved(id);}
  else{
   await wait(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.gameSessions[id]?.items?.length>0,id);s=await snap(id);
   for(let i=0;i<s.items.length;i++){const item=s.items[i];console.log('QUESTION',id,i,item.correct,JSON.stringify(s).length);if(i===0){console.log('WRONG TAP');await p.locator('.quiz-answers button').filter({hasNot:p.getByText(item.correct,{exact:true})}).first().tap();await p.getByText('Noch einmal kombinieren.',{exact:true}).waitFor();console.log('WRONG FEEDBACK');}await p.locator('.quiz-answers').getByRole('button',{name:item.correct,exact:true}).tap();console.log('RIGHT TAP');if(i===0&&!process.env.QA_NO_RELOAD){console.log('RELOAD');const before=(await state()).gameSessions[id];await p.reload();await p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await p.getByRole('button',{name:'Fortsetzen',exact:true}).tap();assert.deepEqual((await state()).gameSessions[id].items,before.items);report.checks.push(id+': exact shuffled items and answer restored after real reload');}await p.getByRole('button',{name:i===s.items.length-1?'Spiel abschließen':'Nächste Spur',exact:true}).tap();console.log('NEXT');}await saved(id);
  }
  await p.locator('.game-board:visible').screenshot({path:shots+'/quality-played-'+id+'.png',timeout:39000});await back();
 }
 if(!process.env.QA_SKIP_FINAL){
 await open('Das große Welt-Quiz');await p.locator('.quiz-card').waitFor();await wait(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.quizSession?.ids?.length>0);
 let q=(await state()).quizSession;for(let i=0;i<q.ids.length;i++){const item=data.QUESTIONS.find(t=>t.id===q.ids[i]);await p.locator('.quiz-answers').getByRole('button',{name:new RegExp(item.answers[item.correct].replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).tap();await p.getByRole('button',{name:i===q.ids.length-1?'Ergebnis ansehen':'Nächste Frage',exact:true}).tap();}await saved('quiz');await p.screenshot({path:shots+'/quality-played-quiz.png',fullPage:true});await back();
 await open('Weltreise-Suche');await p.locator('#globe-mission').waitFor();
 const missions=[['Länder','Deutschland'],['Linien & Pole','Äquator'],['Länder','Australien'],['Meere','Pazifischer Ozean'],['Länder','Italien'],['Kontinente','Antarktika'],['Meere','Atlantischer Ozean'],['Länder','Japan'],['Kontinente','Asien'],['Länder','Brasilien'],['Meere','Arktischer Ozean'],['Länder','Frankreich']];
 for(let i=0;i<missions.length;i++){const [kind,name]=missions[i];if(kind==='Linien & Pole'){await p.getByRole('button',{name:'Ich brauche einen Tipp',exact:true}).tap();await p.getByRole('button',{name:'Noch ein Hinweis',exact:true}).tap();await p.getByRole('button',{name:'Zeig mir die Region',exact:true}).tap();await p.getByRole('button',{name:'Äquator',exact:true}).first().tap();}else{await p.getByRole('button',{name:kind,exact:true}).tap();const select=p.getByRole('combobox',{name:'Wohin möchtest du reisen?',exact:true});await select.fill(name);await select.press('ArrowDown');await select.press('Enter');}await wait(i=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.missions.includes(i),i);if(i<11)await p.getByRole('button',{name:'Nächste Mini-Mission',exact:true}).tap();}
 report.completed.push('hunt');await p.reload();await p.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();assert.equal((await state()).missions.length,12);assert.equal((await state()).quizResults.length,1);report.checks.push('Full quiz and all 12 globe missions completed and persisted after reload');
 }
 await fs.writeFile(shots+'/quality-legacy-games-report.json',JSON.stringify(report,null,2));console.log('LEGACY AUDIT',JSON.stringify(report));await c.close();
});
