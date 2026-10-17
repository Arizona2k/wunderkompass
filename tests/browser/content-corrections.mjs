import photos from '../../app/world-photos.json' with {type:'json'};
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import catalog from '../../app/world-catalog.json' with {type:'json'};
import registry from '../../content/editorial-reviews.json' with {type:'json'};
import history from '../../content/history-editorial-review.json' with {type:'json'};
await import('../../scripts/test-runtime.mjs');
const {createSave,SAVE_KEY}=await import('../../app/progress-storage.ts');
const corrected=registry.questionCorrections.map(c=>catalog.find(t=>t.id===c.topic));
const reflections=history.legacyCountercheck20261018.entries.map(e=>catalog.find(t=>t.id===e.id));
const open=async(p,id)=>{
 const t=catalog.find(t=>t.id===id);await p.evaluate(id=>location.hash='world/topic/'+id,id);await p.getByRole('heading',{name:t.title,exact:true}).waitFor();
 if(t.history?.sensitive&&await p.locator('.sensitive-intro').count()){
  assert.equal(await p.locator('.world-mini-question').count(),0,'sensitive explanation stays behind the existing voluntary introduction');
  await p.getByRole('button',{name:'Die Erklärung anschauen',exact:true}).click();
 }
 const q=p.locator('.world-mini-question');await q.getByRole('heading',{name:t.question.prompt,exact:true}).waitFor();return q;
};
async function bounds(p,root){assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);assert.deepEqual(await root.evaluate(root=>[...root.querySelectorAll('p,h3,button')].flatMap(e=>{if(!e.getClientRects().length)return [];const range=document.createRange();range.selectNodeContents(e);return [...range.getClientRects()].flatMap(r=>r.left< -2||r.right>innerWidth+2?[e.textContent]:[]);})),[]);}
async function answerChain(p,t){
 const q=await open(p,t.id);await q.getByRole('heading',{name:t.question.prompt,exact:true}).waitFor();
 for(const [i,answer]of t.question.answers.entries())if(i!==t.question.correct){await q.getByRole('button').filter({has:p.getByText(answer,{exact:true})}).click();await q.getByRole('status').getByText(t.questionFeedback?.wrongReasons[i]??'Vergleiche die Antworten mit der Erklärung oder dem Modell. Du kannst in Ruhe noch einmal wählen.',{exact:true}).waitFor();await bounds(p,q);}
 await q.getByRole('button').filter({has:p.getByText(t.question.answers[t.question.correct],{exact:true})}).click();await q.getByRole('status').getByText(t.question.why,{exact:true}).waitFor();await bounds(p,q);
 await p.reload();await p.locator('.world-mini-question').getByRole('status').getByText(t.question.why,{exact:true}).waitFor();
}
async function correctedPhoto(p,id){
 await open(p,'animal-'+id);const photo=p.locator('.world-photo:not(.compact)').first(),data=photos[id];await photo.locator('img').evaluate(i=>i.decode());await photo.getByText(data.caption,{exact:true}).waitFor();assert.ok((await photo.innerText()).includes(data.author));assert.equal(await photo.getByRole('link',{name:data.license,exact:true}).getAttribute('href'),data.license_url);await bounds(p,photo);return photo;
}
export async function contentCorrectionsFlow(browser,base,ready,monitor,report,shots){
 const observed=[];report.contentCorrectionProgress=observed;
 for(const width of [320,1440]){
  const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage();monitor(p);
  const pass=createSave();pass.progress.favorites=['topic:person-albert_einstein'];pass.progress.gameSessions.memory={cards:[1,2],flipped:[0]};
  for(const t of corrected)pass.progress.gameSessions['topic:'+t.id]={items:[...t.question.answers].reverse(),topicAnswer:t.question.answers.at(-1)};
  await c.addInitScript(({pass,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(pass));},{pass,key:SAVE_KEY});
  try{
   await p.goto(base);await ready(p);
   for(const t of corrected){const q=await open(p,t.id);assert.deepEqual(await q.locator('.quiz-answer > span:last-of-type').allTextContents(),[...t.question.answers].reverse(),'saved shuffled answer order retained');await answerChain(p,t);if(['invention-internet','person-albert_einstein'].includes(t.id))await p.locator('.world-mini-question').screenshot({path:path.join(shots,'content-corrected-'+t.id+'-'+width+'.png')});observed.push({id:t.id,width,oldSave:true,allChoices:true,reload:true});}
   for(const t of reflections){await open(p,t.id);await p.locator('.world-surprise').getByText(t.surprise,{exact:true}).waitFor();await bounds(p,p.locator('.world-surprise'));}
   for(const id of ['whale-shark','garden-cross-spider']){await correctedPhoto(p,id);await p.screenshot({path:path.join(shots,'content-media-'+id+'-'+width+'.png')});}
   const saved=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,SAVE_KEY);assert.deepEqual(saved.favorites,pass.progress.favorites);assert.deepEqual(saved.gameSessions.memory,pass.progress.gameSessions.memory);
  }catch(error){await p.screenshot({path:path.join(shots,'content-correction-failure-'+width+'.png'),fullPage:true}).catch(()=>{});await fs.writeFile(path.join(shots,'content-correction-failure-'+width+'.json'),JSON.stringify({route:p.url(),error:error.stack},null,2));throw error;}finally{await c.close();}
 }
 report.contentCorrections={observed,reflectionIds:reflections.map(t=>t.id),scope:'Actual served prompts/explanations/all answer feedback, historical saves and reverse order; semantic/source counterreading remains documentary.'};report.checks.push('31 specifically corrected question chains at320/1440 with saved reverse choices, every wrong/right/reload and unrelated progress retained;26 individual history reflections reflow');
}
export async function offlineContentCorrections(p,report){
 for(const id of ['invention-internet','person-albert_einstein','history-fire','history-apollo11']){const t=catalog.find(t=>t.id===id),q=await open(p,id);const reset=q.getByRole('button',{name:'Später noch einmal prüfen',exact:true});if(await reset.count())await reset.click();await answerChain(p,t);}
 for(const id of ['whale-shark','garden-cross-spider'])await correctedPhoto(p,id);
 report.contentCorrectionsOffline={ids:['invention-internet','person-albert_einstein','history-fire','history-apollo11'],actualReload:true};
}
