import {completedRouteFocus} from './connected-discoveries.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createSave} from '../../app/progress-storage.ts';
import vm from 'node:vm';
const routeSource=await fs.readFile(new URL('../../app/world-index.ts',import.meta.url),'utf8'),routeMatch=routeSource.match(/export const WORLD_ROUTES=(\[[\s\S]*?\]);/);
assert(routeMatch,'actual canonical route list is required');
const WORLD_ROUTES=vm.runInNewContext('('+routeMatch[1]+')');
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';
import {learningTaskCorrectionsView} from './learning-tasks.mjs';
import {chapterLaboratoryReturnPage,worldSelectionReturnPage,equivalentAnimalHabitatsPage,volcanoChapterDestinationsPage} from './learning-navigation.mjs';
import {completeFreshRoutesPage,revisitCompletedRoutesPage} from './route-revisit.mjs';

export async function learningCorrectionsView(browser,base,{shots,engine='chromium'}={}){
 const proof={scope:'Current mandatory additive learning-audit cases within the existing journey suite: tasks, pending-answer reload/new attempts, chapter/lab and selection returns, genuinely fresh45stations and completed-route compatibility. Generated canonical synthetic fixtures here; original downloadedM78 and actual earlierM77file checks remain separately qualified private evidence.',tasks:null,navigation:[],routesFresh:null,routesCompleted:[]};
 let context,page,current;
 async function load(name,width,completed=false){
  await context?.close();const pass=createSave();pass.progress.notes=[{id:'learning-context-synthetic-note',text:'Synthetische erhaltene Kontextnotiz.',at:'2026-10-29T00:00:00Z'}];pass.progress.settings.largeText=width===320;pass.progress.settings.reducedMotion=width===320;
  if(completed){for(const route of WORLD_ROUTES){pass.progress.gameSessions['route:'+route.id]={items:[...route.topics],routeIndex:route.topics.length-1,routeDone:true};pass.progress.discoveries.push('route:'+route.id,...route.topics.map(id=>'learned:'+id));}pass.progress.discoveries=[...new Set(pass.progress.discoveries)];}
  current={name,width,generatedCanonicalSyntheticFixture:true,...browserErrorArrays()};context=await browser.newContext({viewport:{width,height:950},hasTouch:true,reducedMotion:width===320?'reduce':'no-preference',acceptDownloads:true});page=await context.newPage();page.setDefaultTimeout(20000);monitorBrowserErrors(page,base,current);
  await page.goto(base+'/#home');await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();const file=path.join(shots,`journey-engine-${engine}-learning-context-${name}-${width}-synthetic.json`);await fs.writeFile(file,JSON.stringify(pass,null,2)+'\n');await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.locator('input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await page.locator('.passport-dialog').waitFor({state:'hidden'});assert.equal(await page.locator('.earth-app').evaluate(e=>e.classList.contains('large-reading')),width===320);
 }
 try{
  proof.tasks=await learningTaskCorrectionsView(browser,base,{shots,engine,widths:[320,1440]});
  for(const width of [320,1440]){await load('navigation',width);current.chapter=await chapterLaboratoryReturnPage(page,base,{touch:width===320,shots,engine});current.selection=await worldSelectionReturnPage(page,base,{touch:width===320,shots,engine});current.habitats=await equivalentAnimalHabitatsPage(page,base,{touch:width===320});current.volcanoChapterDestinations=await volcanoChapterDestinationsPage(page,base,{touch:width===320});assert(browserErrorsComplete(current));current.status='passed';proof.navigation.push(current);}
  await load('fresh-routes',320);current.fresh=await completeFreshRoutesPage(page,base,{touch:true});current.revisit=await revisitCompletedRoutesPage(page,base,{touch:true});assert.equal(current.fresh.routeCount,8);assert.equal(current.fresh.stationActivations,45);assert.equal(current.fresh.noSeededSuccess,true);assert.equal(current.revisit.stationActivations,45);assert(browserErrorsComplete(current));current.status='passed';proof.routesFresh=current;
  for(const width of[320,1440]){await load('historical-completed-routes',width,true);if(width===1440){const legacy={checks:[]};await completedRouteFocus(page,legacy);current.existingCompletedRouteFocus=legacy;}current.revisit=await revisitCompletedRoutesPage(page,base,{touch:width===320});assert.equal(current.revisit.routeCount,8);assert.equal(current.revisit.stationActivations,45);assert(browserErrorsComplete(current));current.status='passed';proof.routesCompleted.push(current);}
  return proof;
 }catch(error){await page?.screenshot({path:path.join(shots,`journey-engine-${engine}-learning-corrections-original-failure.png`),fullPage:true}).catch(()=>{});await fs.writeFile(path.join(shots,`journey-engine-${engine}-learning-corrections-original-failure.json`),JSON.stringify({failure:error.stack,current,proof},null,2)+'\n');throw error;}
 finally{await context?.close();}
}
