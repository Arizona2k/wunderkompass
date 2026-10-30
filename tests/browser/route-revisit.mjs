import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const ready=page=>page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
const progress=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
async function activate(page,control,touch){await control.scrollIntoViewIfNeeded();if(touch)await control.tap();else{await control.focus();await page.keyboard.press('Enter');}}
async function source(){
 const [routeSource,catalogue]=await Promise.all([fs.readFile(new URL('../../app/world-index.ts',import.meta.url),'utf8'),fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8')]);
 const match=routeSource.match(/export const WORLD_ROUTES=(\[[\s\S]*?\]);/);assert.ok(match,'use the actual existing canonical route array');
 return {routes:vm.runInNewContext('('+match[1]+')'),topics:JSON.parse(catalogue)};
}
const readingInvariant=p=>({...Object.fromEntries(['notes','favorites','settings','chapters','completedChapters','journeys','review'].map(key=>[key,p[key]])),earned:p.discoveries.filter(id=>id.startsWith('learned:')||id.startsWith('route:'))});
function retainOriginalSessions(before,after){for(const [id,session] of Object.entries(before))for(const [key,value] of Object.entries(session))assert.deepEqual(after[id]?.[key],value,'preserve old stored field '+id+'/'+key);}

// Caller supplies a NEW synthetic context. This helper never clears/imports data
// or seeds learned flags; every new learned topic comes from an actual answer.
export async function completeFreshRoutesPage(page,base,{touch=false}={}){
 const {routes,topics}=await source();await page.goto(base+'/#world');await ready(page);
 const before=await progress(page),routeTopics=new Set(routes.flatMap(route=>route.topics));
 assert.equal(before.discoveries.some(id=>id.startsWith('learned:')&&routeTopics.has(id.slice('learned:'.length))),false,'fresh route proof cannot start with seeded route-topic successes');
 for(const route of routes)assert.notEqual(before.gameSessions['route:'+route.id]?.routeDone,true,'fresh proof cannot start with a finished route');
 const rows=[];
 for(const route of routes){
  await page.goto(base+'/#world/route/'+route.id);await ready(page);await page.locator('.world-route-stations').waitFor();
  for(let index=0;index<route.topics.length;index++){
   const id=route.topics[index],topic=topics.find(topic=>topic.id===id);assert.ok(topic);
   await page.getByRole('heading',{name:topic.title,exact:true}).waitFor();
   const next=page.locator('.route-next').getByRole('button',{name:index===route.topics.length-1?'Route abschließen':'Zur nächsten Station',exact:true});
   const alreadyEarned=(await progress(page)).discoveries.includes('learned:'+id);
   if(!alreadyEarned){
    assert(await next.isDisabled(),'an unfinished station remains gated before the actual mini answer');
    const answer=page.locator('.world-mini-question .quiz-answer').filter({has:page.getByText(topic.question.answers[topic.question.correct],{exact:true})});
    await activate(page,answer,touch);await page.waitForFunction(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('learned:'+id),id);
   }
   assert(await next.isEnabled(),'the actually earned station permits advancing');await activate(page,next,touch);
   rows.push({route:route.id,index,topic:id,actualNewAnswer:!alreadyEarned,reusedOnlyEarlierActuallyEarnedTopic:alreadyEarned});
  }
  await page.getByRole('heading',{name:'Deine Wissensroute ist geschafft!',exact:true}).waitFor();
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('route:'+id),route.id);
  assert.equal((await progress(page)).gameSessions['route:'+route.id].routeDone,true);
 }
 assert.equal(rows.length,routes.reduce((count,route)=>count+route.topics.length,0));
 const after=await progress(page);for(const key of ['notes','favorites','favoritePlaces','settings','chapters','completedChapters','journeys'])assert.deepEqual(after[key],before[key],'fresh route completion preserves '+key);
 return {routeCount:routes.length,stationActivations:rows.length,actualNewAnswers:rows.filter(row=>row.actualNewAnswer).length,noSeededSuccess:true,rows};
}

// Can run on the genuine fresh result above or on an actually imported old
// synthetic pass. The caller must retain that pass's real import provenance.
export async function revisitCompletedRoutesPage(page,base,{touch=false}={}){
 const {routes,topics}=await source();await page.goto(base+'/#world');await ready(page);
 const before=await progress(page);for(const route of routes)assert.equal(before.gameSessions['route:'+route.id]?.routeDone,true,'actual completed route required, not inferred from a stamp');
 const expected=readingInvariant(before),sessionsBefore=structuredClone(before.gameSessions),rows=[];
 for(const route of routes){
  await page.goto(base+'/#world/route/'+route.id);await ready(page);await page.getByRole('heading',{name:'Deine Wissensroute ist geschafft!',exact:true}).waitFor();
  const saved=structuredClone((await progress(page)).gameSessions['route:'+route.id]);
  const ids=saved.items?.length===route.topics.length&&saved.items.every(id=>topics.some(topic=>topic.id===id))?saved.items:route.topics;
  await activate(page,page.getByRole('button',{name:'Stationen erneut ansehen',exact:true}),touch);
  const picker=page.locator('.world-route-stations');await picker.waitFor();
  for(let index=0;index<ids.length;index++){
   await activate(page,picker.locator('summary'),touch);
   const button=picker.locator('.route-station-list button').nth(index);assert(await button.isEnabled(),'every old completed station stays accessible');
   await activate(page,button,touch);await page.getByRole('heading',{name:topics.find(topic=>topic.id===ids[index]).title,exact:true}).waitFor();
   await page.waitForFunction(()=>document.activeElement?.id==='world-topic-title');
   assert.equal(await picker.evaluate(element=>element.open),false,'station selection returns to the actual article');
   assert.deepEqual((await progress(page)).gameSessions['route:'+route.id],saved,'revisiting does not rewrite stored routeIndex/items/done or its journal');
  }
  await activate(page,page.locator('.route-next').getByRole('button',{name:'Zur Abschlussansicht',exact:true}),touch);
  await page.getByRole('heading',{name:'Deine Wissensroute ist geschafft!',exact:true}).waitFor();await page.waitForFunction(()=>document.activeElement?.id==='learning-main');
  const afterRevisit=await progress(page);assert.deepEqual(readingInvariant(afterRevisit),expected,'looking at completed stations neither adds a review/stamp/learned flag nor rewrites personal texts');retainOriginalSessions(sessionsBefore,afterRevisit.gameSessions);
  await page.reload();await ready(page);await page.getByRole('button',{name:'Stationen erneut ansehen',exact:true}).waitFor();
  const reloaded=await progress(page);assert.deepEqual(readingInvariant(reloaded),expected,'reload keeps the original completed route and saved data');retainOriginalSessions(sessionsBefore,reloaded.gameSessions);
  rows.push({route:route.id,stations:ids.length,actualSelectionAndReturn:true,savedIndexItemsDoneStampAndPersonalDataPreserved:true});
 }
 return {routeCount:rows.length,stationActivations:rows.reduce((sum,row)=>sum+row.stations,0),rows};
}
