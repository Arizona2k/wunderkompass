import assert from 'node:assert/strict';
import {MISSION_RESEARCH} from '../../app/mission-research.ts';

const targets=[['Länder','Deutschland'],['Linien','Äquator'],['Länder','Australien'],['Meere','Pazifischer Ozean'],['Länder','Italien'],['Kontinente','Antarktika'],['Meere','Atlantischer Ozean'],['Länder','Japan'],['Kontinente','Asien'],['Länder','Brasilien'],['Meere','Arktischer Ozean'],['Länder','Frankreich']];
export async function globeMissionFlow(page,{shots=null}={}){
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress),views=[];
 await page.evaluate(()=>location.hash='globe');const room=page.locator('#globe-mission');await room.waitFor();
 assert.deepEqual((await state()).missions,[],'mission flow starts without earned mission stamps');
 for(const [i,[kind,name]] of targets.entries()){
  await room.locator('.eyebrow').getByText('MINI-MISSION '+(i+1)+'/12',{exact:true}).waitFor();
  const hint=room.getByRole('button',{name:'Ich brauche einen Tipp',exact:true});assert.equal(await hint.getAttribute('aria-expanded'),'false');await hint.focus();await page.keyboard.press('Enter');
  assert.equal(await room.getByRole('button',{name:'Tipp schließen',exact:true}).getAttribute('aria-expanded'),'true');
  await room.getByRole('button',{name:'Noch ein Hinweis',exact:true}).click();
  await room.getByRole('button',{name:'Zeig mir den Ort',exact:true}).click();assert.equal((await state()).missions.length,i,'revealing the place does not earn a mission');
  await room.getByRole('button',{name:'Zeig mir die Region',exact:true}).click();assert.equal((await state()).missions.length,i,'revealing the region does not earn a mission');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  for(const button of await room.getByRole('button').all())assert.equal(await button.evaluate(e=>e.getBoundingClientRect().height>=48),true,'mission controls retain48px touch targets');
  if(shots){await room.scrollIntoViewIfNeeded();await room.screenshot({path:shots+'/mission-'+i+'-hint-'+page.viewportSize().width+'.png',animations:'disabled'});}
  if(kind==='Linien')await page.locator('.orientation-buttons').getByRole('button',{name,exact:true}).click();
  else{await page.getByRole('button',{name:kind,exact:true}).click();const select=page.getByRole('combobox',{name:'Wohin möchtest du reisen?',exact:true});await select.fill(name);await page.getByRole('option',{name,exact:true}).click();}
  await room.getByRole('heading',{name:'Gefunden! Gut entdeckt.',exact:true}).waitFor();await page.waitForFunction(i=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.missions.includes(i),i);
  assert.equal(await room.locator('.mission-research p').innerText(),MISSION_RESEARCH[i].task);assert.equal(await room.locator('.mission-research a').getAttribute('href'),'#labs/'+MISSION_RESEARCH[i].lab);
  if(shots)await room.screenshot({path:shots+'/mission-'+i+'-found-'+page.viewportSize().width+'.png',animations:'disabled'});
  views.push({i,kind,name,hintsDoNotEarnStamp:true,actualSelectionEarnsStamp:true});
  if(i<targets.length-1){await room.getByRole('button',{name:'Nächste Mini-Mission',exact:true}).click();await page.waitForFunction(()=>document.activeElement?.id==='mission-heading');assert.equal(await room.locator('#mission-hints').count(),0);}
 }
 await page.reload();await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await room.getByRole('button',{name:'Missionen noch mal entdecken',exact:true}).waitFor();assert.deepEqual([...(await state()).missions].sort((a,b)=>a-b),targets.map((_,i)=>i));
 await room.getByRole('button',{name:'Missionen noch mal entdecken',exact:true}).click();await page.waitForFunction(()=>document.activeElement?.id==='mission-heading');assert.equal((await state()).missions.length,12,'voluntary repeat retains earned stamps');
 await page.evaluate(()=>location.hash='games');await page.locator('.playground-grid:visible').waitFor();return views;
}
