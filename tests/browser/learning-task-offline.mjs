import fs from'node:fs/promises';import path from'node:path';import assert from'node:assert/strict';
import{SAVE_KEY}from'../../app/progress-storage.ts';
import{RESEARCH_QUESTIONS}from'../../app/research-catalog.ts';
import labLegacy from'../../app/research-task-compatibility.json'with{type:'json'};
import labFeedback from'../../app/research-feedback.json'with{type:'json'};
import journeyLegacy from'../../app/journey-task-compatibility.json'with{type:'json'};
import journeyData from'../../app/journey-inquiries.json'with{type:'json'};
import{captureNativeViewport}from'./native-screenshot.mjs';
const snapshot=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),SAVE_KEY);
async function importFile(p,file){await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.locator('input[type=file]').setInputFiles(file);await p.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await p.locator('.passport-dialog').waitFor({state:'hidden'});}
export async function learningTaskOfflineSemantics(page,{shots,kind,native=false}){
 const original=await snapshot(page),fixture=structuredClone(original),cases=[],prefix='cached-transfer-'+kind+(native?'-native':'');
 const journeyIds=['seasons:2','countries:4','landscapes:1','climate:2'];
 for(const id of['moon','seasons']){const old=labLegacy.entries[id];fixture.progress.gameSessions['lab:'+id]={...fixture.progress.gameSessions['lab:'+id],researchLevel:'hard','researchAnswer-hard':(old.correct+1)%3,researchHardTaskRevision:0};}
 for(const id of journeyIds){const[journey,index]=id.split(':'),old=journeyLegacy.entries[id+':2'];fixture.progress.gameSessions['journey:'+journey]={...fixture.progress.gameSessions['journey:'+journey],['chapter:'+index+':level']:2,['chapter:'+index+':answer:2']:(old.correct+1)%3};delete fixture.progress.gameSessions['journey:'+journey]['chapter:'+index+':taskRevision:2'];}
 const originalFile=path.join(shots,prefix+'-original-synthetic-pass.json'),file=path.join(shots,prefix+'-fixture-synthetic-pass.json');await fs.writeFile(originalFile,JSON.stringify(original,null,2)+'\n');await fs.writeFile(file,JSON.stringify(fixture,null,2)+'\n');
 const preserve=async()=>{const saved=(await snapshot(page)).progress;for(const key of['notes','favorites','games','journeys','settings'])assert.deepEqual(saved[key],fixture.progress[key]);for(const[id,value]of Object.entries(original.progress.gameSessions))if(!['lab:moon','lab:seasons',...journeyIds.map(id=>'journey:'+id.split(':')[0])].includes(id))assert.deepEqual(saved.gameSessions[id],value);};
 for(const width of[320,1440]){
  await page.setViewportSize({width:width*(native?2:1),height:950});assert.equal(await page.evaluate(()=>innerWidth),width);await page.evaluate(()=>location.hash='globe');await page.locator('.discovery-hero').waitFor();await importFile(page,file);
  for(const id of['moon','seasons']){
   const old=labLegacy.entries[id],q=RESEARCH_QUESTIONS[id].hard,chosen=(old.correct+1)%3,earned=[...(await snapshot(page)).progress.labs];await page.evaluate(id=>location.hash='labs/'+id,id);const box=page.locator('.research-question');await box.getByRole('heading',{name:q.prompt,exact:true}).waitFor();await box.getByText('Deine frühere Auswahl „'+old.answers[chosen]+'“ bleibt gespeichert.',{exact:false}).waitFor();assert.equal((await snapshot(page)).progress.gameSessions['lab:'+id]['researchAnswer-hard'],chosen);assert.deepEqual((await snapshot(page)).progress.labs,earned);await box.getByRole('button',{name:q.answers[chosen],exact:true}).click();await box.getByText(labFeedback[id].hard[chosen],{exact:true}).waitFor();await box.getByRole('button',{name:q.answers[q.correct],exact:true}).click();await box.getByText(q.why,{exact:true}).waitFor();assert.equal((await snapshot(page)).progress.gameSessions['lab:'+id]['researchAnswer-hard'],q.correct);await preserve();cases.push({width,kind,native,family:'lab',id,actualCachedAppAfterServerStop:true,oldChoicePreservedUntilExplicitAnswer:true,currentWrongAndCorrectFeedback:true,noAutomaticStamp:true});
  }
  for(const id of journeyIds){
   const[journey,index]=id.split(':'),old=journeyLegacy.entries[id+':2'],q=journeyData.chapters.find(c=>c.id===id).tasks[2],chosen=(old.correct+1)%3;await page.evaluate(({journey,index})=>location.hash='journeys/'+journey+'/'+(Number(index)+1),{journey,index});const box=page.locator('[data-chapter-inquiry="'+id+'"]');await box.getByRole('heading',{name:q.prompt,exact:true}).waitFor();await box.getByText('Deine frühere Auswahl „'+old.answers[chosen]+'“ bleibt gespeichert.',{exact:false}).waitFor();assert.equal((await snapshot(page)).progress.gameSessions['journey:'+journey]['chapter:'+index+':answer:2'],chosen);assert.equal((await snapshot(page)).progress.gameSessions['journey:'+journey]['chapter:'+index+':taskRevision:2'],undefined);await box.getByRole('button',{name:q.answers[chosen],exact:true}).click();await box.locator('.lab-feedback').getByText(q.wrong[chosen],{exact:true}).waitFor();await box.getByRole('button',{name:q.answers[q.correct],exact:true}).click();await box.locator('.lab-feedback').getByText(q.why,{exact:true}).waitFor();await preserve();cases.push({width,kind,native,family:'journey',id,actualCachedAppAfterServerStop:true,oldChoicePreservedUntilExplicitAnswer:true,currentWrongAndCorrectFeedback:true,noRevisionOnLoad:true});
   // Preserve the original country-feedback capture while that chapter is current.
   // Additional landscape/climate cases deliberately navigate elsewhere afterward.
   if(native&&id==='countries:4'){assert.equal(await page.evaluate(()=>location.hash),'#journeys/countries/5');await box.locator('.lab-feedback').scrollIntoViewIfNeeded();await captureNativeViewport(page,path.join(shots,prefix+'-'+width+'.png'));}
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
  if(!native)await page.screenshot({path:path.join(shots,prefix+'-'+width+'.png'),fullPage:true});
 }
 await page.evaluate(()=>location.hash='globe');await page.locator('.discovery-hero').waitFor();await importFile(page,originalFile);const restored=(await snapshot(page)).progress;for(const key of['gameSessions','notes','favorites','games','labs','journeys','review','settings'])assert.deepEqual(restored[key],original.progress[key],'original cached synthetic pass restored through actual UI: '+key);assert.equal(cases.length,12);return{cases,originalPassRestoredThroughActualUI:true,heardSpeechOrPhysicalDeviceClaim:false};
}
