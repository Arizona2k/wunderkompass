import {AXE_FILE} from './axe-loader.mjs';
import {fourteenConnectedRoutes,retainedConnectedRoutes} from './people-fourteen-connected-routes.mjs';
import {assertWorkshopTypography,blueprintTypographyView} from './article-workshops.mjs';
import {worldEntryNavigation} from './world-entry.mjs';
import {assertModelLabels,worldModelTypographyView} from './model-labels.mjs';
import {scienceOriginalView,waterPhotosynthesisView} from './science-originals.mjs';
import {buildingOriginalSourceView} from './building-originals.mjs';
import {mechanicsSourceView} from './invention-mechanics.mjs';
import {peopleSourceView,peopleLegacyRound} from './people-learning.mjs';
import {electricalSourceView} from './invention-electrical.mjs';
import {opticsSourceView} from './invention-optics.mjs';
import {historySourceView} from './history-learning.mjs';
import {assertTextInsideControls} from './text-geometry.mjs';
import {KARTE,ausprobieren,hatAusprobieren,mehrErfahren} from './karte-hilfen.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const topics=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const peopleActivities=new Set(JSON.parse(await fs.readFile(new URL('../../app/people-inquiries.json',import.meta.url),'utf8')).entries.map(entry=>entry.id));
const examples=['animal-polar-bear','history-maya','person-grace_hopper','invention-car','building-taj-mahal','science-moon-phases','science-tides','science-currents'];
// Gleiche Bedingung wie hatBaustein in app/kern/karte/karten-daten.ts: Karten mit Mitmach-Baustein.
const hatBaustein=t=>!!(t.animal||t.invention||t.building||t.model||t.investigation||t.id==='science-tides');
const drawingAlts={
 'science-moon-phases':'Vier ausgewählte Mondphasen: Neumond, zunehmender Halbmond, Vollmond und abnehmender Halbmond.',
 'science-tides':'Dieselbe schematische Küste bei niedrigem und hohem Wasserstand.',
 'science-currents':'Drei Antriebe für Meeresströmungen: Wind, Gezeiten und Dichteunterschiede.'
};

async function readableLabels(labels){
 for(const label of await labels.all())assert.equal(await label.evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16&&el.scrollWidth<=el.clientWidth+1),true,'HTML diagram label readable without clipping');
}

// Die Wissenskarte (app/kern/karte) an acht Beispielen: Bilder, Zeichnungen, Ausprobieren, axe, Rate mal,
// Lernroute aus „Mehr erfahren“ und zurück. Die alte Sprungleiste „In dieser Entdeckerkarte“ gibt es nicht mehr.
export async function articleAtlas(page,ready,report,width,shots){
 const open=async id=>{const title=topics.find(t=>t.id===id).title;await page.evaluate(id=>location.hash='world/topic/'+id,id);await page.waitForFunction(title=>document.querySelector('.wissenskarte #world-topic-title')?.getAttribute('aria-label')===title,title);await page.waitForTimeout(100);};
 // Alle Bilder der Karte, auch die der „Dazu passt“-Kacheln (die laden erst nahe am Bildschirm, deshalb erst hinscrollen).
 // This function is serialized in the page; do not rely on Node helpers there.
 const decode=async()=>{for(const image of await page.locator(KARTE+' img').all())await image.evaluate(async el=>{el.scrollIntoView({block:'nearest'});await el.decode();if(!el.naturalWidth)throw Error('Image not decoded')});await page.evaluate(()=>scrollTo(0,0));};
 await page.addScriptTag({path:AXE_FILE});
 for(const id of examples){
  const t=topics.find(t=>t.id===id);
  await open(id);await decode();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2),false,'article overflow '+id+' / '+width);
  const art=page.locator(KARTE);await assertTextInsideControls(page,KARTE+' :is(.wissenskarte-knoepfe button,details>summary,.dazu-passt-kachel)','article controls');
  if(drawingAlts[id]){
   await art.getByRole('img',{name:drawingAlts[id],exact:true}).waitFor();
   await readableLabels(art.locator('.topic-diagram-label'));
   if(id==='science-moon-phases'&&width<700)assert.equal(await art.locator('.moon-diagram').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,'mobile phases in two columns');
  }
  assert.equal(new URL(page.url()).hash,'#world/topic/'+id,'card keeps its direct link');
  if(await hatAusprobieren(page)){
   const bereich=await ausprobieren(page);
   const declared=peopleActivities.has(id)?bereich.locator('[data-person-evidence="'+id+'"]'):hatBaustein(t)?bereich.locator('.article-experiment'):null;
   if(declared)assert.equal(await declared.count(),1,id+' has one specifically declared research target');
   else assert.ok(await bereich.locator('.wissenskarte-bausteine>*').count()>0,id+' Ausprobieren shows its evidence');
   assert.equal(new URL(page.url()).hash,'#world/topic/'+id,'Ausprobieren preserves direct link');
  }
  const violations=await page.evaluate(async()=>{const r=await window.axe.run('.wissenskarte',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))});
  assert.deepEqual(violations,[],id+' axe '+width);
 }
 await open('science-tides');await ausprobieren(page);const tide=page.locator('.tide-comparison');
 await tide.getByRole('button',{name:'Hochwasser',exact:true}).click();await tide.getByText('Der hohe Wasserstand bedeckt hier mehr Küstenfläche.',{exact:true}).waitFor();assert.match(await tide.locator('svg').getAttribute('aria-label'),/Hochwasser/);
 await tide.getByRole('button',{name:'Niedrigwasser',exact:true}).focus();await page.keyboard.press('Enter');await tide.getByText('Beim niedrigen Wasserstand liegt hier mehr Küstenfläche frei.',{exact:true}).waitFor();assert.equal(await tide.getByRole('button',{name:'Niedrigwasser',exact:true}).getAttribute('aria-pressed'),'true');
 await readableLabels(tide.locator('.tide-diagram-label'));
 const skip=page.locator('.skip-link');
 assert.equal(await skip.evaluate(el=>el===document.activeElement),false,'comparison focus stays on water control');
 assert.equal(await skip.evaluate(el=>getComputedStyle(el).clipPath),'inset(50%)','unfocused skip link completely clipped, including element captures');
 await page.locator('.wissenskarte-kopf').screenshot({path:shots+'/article-tides-'+width+'.png'});await tide.screenshot({path:shots+'/tide-comparison-'+width+'.png'});
 if(width<700){
  await skip.focus();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.skip-link')).clipPath==='none');
  await page.screenshot({path:shots+'/skip-navigation-focused-'+width+'.png'});
  await page.keyboard.press('Enter');assert.equal(await page.locator('#learning-main').evaluate(el=>el===document.activeElement),true,'skip Enter focuses main');
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.skip-link')).clipPath==='inset(50%)');
  assert.equal(new URL(page.url()).hash,'#world/topic/science-tides','skip preserves topic hash');
  await tide.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await page.screenshot({path:shots+'/tide-comparison-viewport-'+width+'.png'});
 }
 await open('science-moon-phases');const topic=topics.find(t=>t.id==='science-moon-phases'),question=page.locator('.world-mini-question');
 const readPass=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 // Fresh contexts start without solved article answers. Verify no solution or
 // earned learning mark on a wrong attempt, including reload and recovery.
 const wrong=topic.question.answers.find((_,i)=>i!==topic.question.correct);
 const answer=question.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[topic.question.correct],{exact:true})});
 if(!await answer.isDisabled()){
  const hint=question.locator('.world-game-hint');await hint.locator('summary').click();assert.equal(await hint.locator('p').count()>0,true);assert.equal(await question.getByText(topic.question.why,{exact:true}).count(),0);
  await question.locator('.quiz-answer').filter({has:page.getByText(wrong,{exact:true})}).click();
  await question.getByText('Überlege noch einmal.',{exact:true}).waitFor();assert.equal(await question.getByText(topic.question.why,{exact:true}).count(),0);assert.equal((await readPass()).discoveries.includes('learned:'+topic.id),false);
  await page.reload();await ready(page);await question.getByText('Überlege noch einmal.',{exact:true}).waitFor();assert.equal(await question.getByText(topic.question.why,{exact:true}).count(),0);
  await answer.click();assert.equal(await question.locator('.world-game-hint').count(),0);await question.getByText(topic.question.why,{exact:true}).waitFor();assert.ok((await readPass()).discoveries.includes('learned:'+topic.id));
  await page.reload();await ready(page);assert.equal(await answer.isDisabled(),true);
 }
 // Lernroute aus „Mehr erfahren“; in der Route steht die Karte eingebettet, ihr „Ausprobieren“ funktioniert dort auch.
 const mehr=await mehrErfahren(page);
 await mehr.locator('.article-routes').getByRole('button',{name:'Vom Mond bis zum Meer',exact:true}).click();await page.locator('.world-route-stations').waitFor();assert.equal(new URL(page.url()).hash,'#world/route/moon-to-sea');
 const embedded=page.locator('.wissenskarte-eingebettet');await ausprobieren(embedded);await embedded.locator('.article-experiment').waitFor();
 await page.goBack();await page.locator('.wissenskarte-kopf').waitFor();assert.equal(new URL(page.url()).hash,'#world/topic/science-moon-phases');
 assert.equal(await page.locator('details.wissenskarte-mehr').evaluate(el=>el.open),true,'„Mehr erfahren“ is open again after returning from the route');
 await page.locator('.wissenskarte-kopf').screenshot({path:shots+'/article-moon-'+width+'.png'});
 await page.locator('.wissenskarte-kopf .topic-illustration').screenshot({path:shots+'/moon-diagram-'+width+'.png'});
 await page.locator('.dazu-passt').screenshot({path:shots+'/dazu-passt-'+width+'.png'});
 if(width===1440){
  for(const t of topics){await page.evaluate(id=>location.hash='world/topic/'+id,t.id);await page.getByRole('heading',{name:t.title,exact:true}).waitFor();if(t.history?.sensitive)await page.getByRole('button',{name:'Die Erklärung anschauen',exact:true}).click();await page.locator(KARTE).waitFor();await decode();if(await hatAusprobieren(page))await ausprobieren(page);await assertWorkshopTypography(page.locator(KARTE));if(t.model)await assertModelLabels(page.locator('.world-model'));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2),false,'catalog overflow '+t.id)}
  report.checks.push('All '+topics.length+' cards opened at 1440px including voluntary sensitive entry and opened Ausprobieren; images decoded and no horizontal overflow');
 }
 if(width===320){
  await open('science-moon-phases');await page.locator('.earth-app').evaluate(el=>el.classList.add('large-reading'));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2),false,'large reading 320');await page.locator('.world-mini-question').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:shots+'/article-large-reading-320.png'});await page.locator('.earth-app').evaluate(el=>el.classList.remove('large-reading'));
  report.worldModelTypography=await worldModelTypographyView(page);
  report.blueprintTypography=await blueprintTypographyView(page);
  report.worldEntryNavigation=await worldEntryNavigation(page);
 }
 report.peopleViews??=[];report.peopleViews.push(...await peopleSourceView(page,{width,shots,questions:true}));
 if(width===320){
  const initialPeopleRoute=await page.evaluate(()=>location.hash);
  try{
   report.fourteenPersonConnectedRoutes=await fourteenConnectedRoutes(page,new URL(page.url()).origin);
   assert.equal(report.fourteenPersonConnectedRoutes.global.length,14);
   assert.equal(report.fourteenPersonConnectedRoutes.book.length,25);
   report.retainedPersonConnectedRoutes=await retainedConnectedRoutes(page,new URL(page.url()).origin);
   assert.equal(report.retainedPersonConnectedRoutes.global.length,18);
   assert.equal(report.retainedPersonConnectedRoutes.book.length,20);
  }finally{await page.evaluate(hash=>location.hash=hash,initialPeopleRoute);}
 }

 if(width===390)await peopleLegacyRound(page.context().browser(),new URL(page.url()).origin,ready,report,shots);
 report.buildingOriginalViews??=[];report.buildingOriginalViews.push(...await buildingOriginalSourceView(page,{width,shots,questions:true}));
 report.mechanicsViews??=[];report.mechanicsViews.push(...await mechanicsSourceView(page,{width,shots,questions:true}));
 report.electricalViews??=[];report.electricalViews.push(...await electricalSourceView(page,{width,shots,questions:true}));
 report.opticsViews??=[];report.opticsViews.push(...await opticsSourceView(page,{width,shots,questions:true}));
 report.historySourceViews??=[];report.historySourceViews.push(...await historySourceView(page,{width,shots,questions:true}));
 // New science coverage uses both endpoint layouts; all existing atlas widths
 // and activities above remain. Keep one complete mobile image set, rather than
 // duplicating every new image at every width in the bounded review artifact.
 if([320,1440].includes(width)){
  const science=await scienceOriginalView(page,{width,shots:width===320?shots:undefined,questions:true});
  assert.equal(science.length,23,'all retained science originals and 69 inquiries at the atlas endpoints');
  report.scienceOriginalViews??=[];report.scienceOriginalViews.push(...science);
  const water=await waterPhotosynthesisView(page,{width,shots:width===320?shots:undefined});assert.equal(water.length,2);report.waterPhotosynthesisViews??=[];report.waterPhotosynthesisViews.push(...water);
 }
 report.checks.push('Article atlas '+width+': six categories and three scientific drawings with readable 16px HTML labels and original alternative texts, mobile two-column phases, clipped unfocused skip link and keyboard activation, text inside controls, unchanged hash, declared Ausprobieren activities, axe A/AA, wrong/right/reload Rate mal, coastal comparison, learning route from Mehr erfahren with embedded Ausprobieren and reopened area on return');
}

export async function offlineArticleAtlas(page,report){
 // „Ausprobieren“ lädt sein eigenes Skript erst beim Öffnen; auch das muss nach dem kalten Neustart offline da sein.
 await page.evaluate(()=>location.hash='world/topic/science-tides');await ausprobieren(page);await page.locator('.tide-comparison').waitFor();await page.locator('.wissenskarte-ausprobieren .article-experiment').waitFor();await page.locator('.tide-comparison').getByRole('button',{name:'Hochwasser',exact:true}).click();await page.getByText('Der hohe Wasserstand bedeckt hier mehr Küstenfläche.',{exact:true}).waitFor();
 await page.evaluate(()=>location.hash='world/topic/science-moon-phases');await page.locator('.world-mini-question .world-game-hint').waitFor();await page.locator('.world-mini-question .world-game-hint summary').click();assert.ok(await page.locator('.world-mini-question .world-game-hint p').innerText());await page.getByRole('img',{name:drawingAlts['science-moon-phases'],exact:true}).waitFor();assert.equal(await page.locator('.topic-illustration svg').count(),4);await readableLabels(page.locator('.topic-diagram-label'));
 report.peopleCold=await peopleSourceView(page,{width:await page.evaluate(()=>document.documentElement.clientWidth),engine:'chromium-cold'});assert.equal(report.peopleCold.length,18);
 report.mechanicsCold=await mechanicsSourceView(page,{width:await page.evaluate(()=>document.documentElement.clientWidth),engine:'chromium-cold'});assert.equal(report.mechanicsCold.length,6);
 report.electricalCold=await electricalSourceView(page,{width:await page.evaluate(()=>document.documentElement.clientWidth),engine:'chromium-cold'});assert.equal(report.electricalCold.length,3);
 report.opticsCold=await opticsSourceView(page,{width:await page.evaluate(()=>document.documentElement.clientWidth),engine:'chromium-cold'});assert.equal(report.opticsCold.length,3);
 report.historySourceCold=await historySourceView(page,{width:await page.evaluate(()=>document.documentElement.clientWidth),engine:'chromium-cold'});assert.equal(report.historySourceCold.length,3,'all three historical activities survive the actual cold browser restart');
 report.scienceOriginalCold=await scienceOriginalView(page,{width:await page.evaluate(()=>document.documentElement.clientWidth),questions:false});assert.equal(report.scienceOriginalCold.length,23,'all science originals, model states and voluntary inquiries survive the actual cold browser restart');
 report.waterPhotosynthesisCold=await waterPhotosynthesisView(page,{width:await page.evaluate(()=>document.documentElement.clientWidth),questions:false});assert.equal(report.waterPhotosynthesisCold.length,2,'both individually revised articles and all six authored inquiries survive the same cold restart');
 report.checks.push('Card drawings, lazily loaded Ausprobieren, individual Rate mal hint and coastal comparison work after actual cold offline restart');
}
