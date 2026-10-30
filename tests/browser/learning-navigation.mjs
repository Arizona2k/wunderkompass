import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const ready=page=>page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
const save=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
const preserved=progress=>Object.fromEntries(['notes','favorites','settings','chapters','completedChapters','journeys'].map(key=>[key,progress[key]]));
async function activate(page,control,touch){
 await control.scrollIntoViewIfNeeded();
 // A tap must establish its own actual opener: do not pre-focus a touch control.
 if(touch)await control.tap();else{await control.focus();await page.keyboard.press('Enter');}
}
async function returned(page,hash,opener,scroll){
 await page.waitForFunction(hash=>location.hash===hash,hash);
 await opener.waitFor();
 await page.waitForFunction(element=>document.activeElement===element,await opener.elementHandle());
 assert(await opener.evaluate(element=>{const r=element.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'actual returned opener is visible');
 const first=await page.evaluate(()=>scrollY),started=performance.now();
 // Focus can precede the asynchronous history/layout scroll completion.
 // Await the original scroll predicate; a lasting wrong position still fails.
 await page.waitForFunction(expected=>Math.abs(scrollY-expected)<8,scroll);
 const actual=await page.evaluate(()=>({scroll:scrollY,history:history.state,active:document.activeElement?.outerHTML,bodyHeight:document.body.scrollHeight}));assert(Math.abs(actual.scroll-scroll)<8,'original reading position is restored: '+JSON.stringify({expectedScroll:scroll,...actual}));
 assert(await opener.evaluate(element=>document.activeElement===element),'scroll completion preserves exact returned opener focus');
 return {expectedScroll:scroll,firstMeasuredScroll:first,finalMeasuredScroll:actual.scroll,completionWaitMs:performance.now()-started};
}
export async function chapterLaboratoryReturnPage(page,base,{touch=false,shots=null,engine='chromium'}={}){
 const rows=[];
 for(const item of [
  {chapter:'journeys/water/1',path:'labs/water',label:'Im Forscherlabor ausprobieren · Wasserkreislauf',focus:'water-lab'},
  {chapter:'journeys/nature/1',path:'labs',label:'Alle Forscherlabore ansehen',focus:'nature-lab'}
 ]){
  await page.goto(base+'/#'+item.chapter);await ready(page);await page.locator('.journey-reader').waitFor();
  // Measure the fully loaded reading view. Before task/text readiness, the
  // loading view can still move the opener and the real click saves a different
  // departure position. Two render frames finish the existing scheduled restore.
  await page.locator('[data-chapter-inquiry]').waitFor();
  await page.getByText('Die Erklärung kommt gleich …',{exact:true}).waitFor({state:'hidden'});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const opener=page.locator('[data-route-focus="'+item.focus+'"]');assert.equal(await opener.innerText(),item.label);
  await opener.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));const scroll=await page.evaluate(()=>scrollY),before=preserved(await save(page));
  await activate(page,opener,touch);await page.waitForFunction(hash=>location.hash==='#'+hash,item.path);
  if(item.path==='labs/water'){
   await page.getByRole('heading',{name:'Wasserkreislauf',exact:true,level:1}).waitFor();
   const input=page.locator('#active-research-lab').getByRole('slider').first();
   const initial=Number(await input.getAttribute('aria-valuenow')),maximum=Number(await input.getAttribute('aria-valuemax'));assert(Number.isFinite(initial)&&Number.isFinite(maximum),'actual accessible slider has numeric values');
   await input.focus();await page.keyboard.press(initial>=maximum?'ArrowLeft':'ArrowRight');
   assert.notEqual(Number(await input.getAttribute('aria-valuenow')),initial,'actual laboratory model responds before returning');
  }else await page.locator('.research-grid').waitFor();
  await activate(page,page.getByRole('button',{name:'Zurück zu deinem Ausgangskapitel',exact:true}),touch);
  const firstReturn=await returned(page,'#'+item.chapter,opener,scroll);assert.deepEqual(preserved(await save(page)),before,'chapter stamps, saved resume and personal data stay unchanged');
  await page.goForward();await page.waitForFunction(hash=>location.hash==='#'+hash,item.path);await page.reload();await ready(page);
  await activate(page,page.getByRole('button',{name:'Zurück zu deinem Ausgangskapitel',exact:true}),touch);
  const reloadedReturn=await returned(page,'#'+item.chapter,opener,scroll);assert.deepEqual(preserved(await save(page)),before);
  if(shots)await page.screenshot({path:path.join(shots,`journey-engine-${engine}-chapter-lab-return-${item.focus}-${page.viewportSize().width}.png`),animations:'disabled'});
  rows.push({chapter:item.chapter,target:item.path,actualBackForwardReloadReturn:true,firstReturn,reloadedReturn,touch,personalDataAndChaptersUnchanged:true});
 }
 await page.goto(base+'/#labs/water');await ready(page);await page.locator('#lab-heading').waitFor();
 assert.equal(await page.getByRole('button',{name:'Zurück zu deinem Ausgangskapitel',exact:true}).count(),0,'a direct laboratory entry has no fabricated chapter origin');
 return rows;
}
async function selectionFields(page){return page.locator('.world-filter').evaluate(root=>({query:root.querySelector('input').value,group:root.querySelector('[aria-label="Tiergruppe"]')?.value,habitat:root.querySelector('[aria-label="Lebensraum"]')?.value}));}
export async function worldSelectionReturnPage(page,base,{touch=false,shots=null,engine='chromium'}={}){
 const catalogue=JSON.parse(await fs.readFile(new URL('../../app/world-index.json',import.meta.url),'utf8')),animalCount=catalogue.filter(topic=>topic.category==='animals').length;
 await page.goto(base+'/#world/animals/page/2');await ready(page);await page.getByText(`${animalCount} passende Entdeckerkarten · Seite 2 von ${Math.ceil(animalCount/12)}`,{exact:true}).waitFor();
 const orca=page.locator('[data-route-focus="world-topic-animal-orca"]');await orca.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));
 const scroll=await page.evaluate(()=>scrollY),before=preserved(await save(page)),initialFields=await selectionFields(page);
 await activate(page,orca,touch);await page.locator('#world-topic-title').waitFor();
 await activate(page,page.getByRole('button',{name:'Zurück zu deiner Auswahl',exact:true}),touch);
 await returned(page,'#world/animals/page/2',orca,scroll);assert.deepEqual(await selectionFields(page),initialFields);assert.deepEqual(preserved(await save(page)),before);
 const search=page.getByRole('textbox',{name:'Entdeckerkarten durchsuchen',exact:true});
 if(touch)await search.tap();else await search.focus();await page.keyboard.type('Orca');
 await page.waitForFunction(()=>location.hash==='#world/animals/page/1');await orca.waitFor();
 await activate(page,page.locator('.world-animal-filters>summary'),touch);
 await page.getByRole('combobox',{name:'Tiergruppe',exact:true}).selectOption('Säugetiere');
 const habitat=catalogue.find(topic=>topic.id==='animal-orca').habitat;
 await page.getByRole('combobox',{name:'Lebensraum',exact:true}).selectOption(habitat);await orca.waitFor();
 const fields=await selectionFields(page);assert.deepEqual(fields,{query:'Orca',group:'Säugetiere',habitat});
 await orca.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));const filteredScroll=await page.evaluate(()=>scrollY);
 await activate(page,orca,touch);await page.locator('#world-topic-title').waitFor();await page.reload();await ready(page);
 await activate(page,page.getByRole('button',{name:'Zurück zu deiner Auswahl',exact:true}),touch);
 await returned(page,'#world/animals/page/1',orca,filteredScroll);assert.deepEqual(await selectionFields(page),fields);assert.deepEqual(preserved(await save(page)),before);
 if(shots)await page.screenshot({path:path.join(shots,`journey-engine-${engine}-filtered-world-selection-return-${page.viewportSize().width}.png`),animations:'disabled'});
 await page.goto(base+'/#world/topic/animal-orca');await ready(page);await page.locator('#world-topic-title').waitFor();
 assert.equal(await page.getByRole('button',{name:'Zurück zu deiner Auswahl',exact:true}).count(),0,'direct article entry has an honest general fallback');
 await activate(page,page.getByRole('button',{name:'Die Tierwelt · alle Karten',exact:true}),touch);await page.locator('#world-results').waitFor();
 assert.deepEqual(await selectionFields(page),{query:'',group:'Alle',habitat:'Alle'});
 return {actualPage2OrcaSelectionReturn:true,realTypedQueryAndSelectedFiltersRetained:true,actualArticleReloadReturn:true,visibleFocusAndReadingPosition:true,directEntryGeneralFallback:true,touch,personalDataUnchanged:true};
}

export async function equivalentAnimalHabitatsPage(page,base,{touch=false}={}){
 const catalogue=JSON.parse(await fs.readFile(new URL('../../app/world-index.json',import.meta.url),'utf8')),rows=[];
 await page.goto(base+'/#world/animals');await ready(page);const before=preserved(await save(page));await activate(page,page.locator('.world-animal-filters>summary'),touch);
 const select=page.getByRole('combobox',{name:'Lebensraum',exact:true}),options=await select.locator('option').allTextContents();
 for(const[canonical,variants,mustInclude]of[
  ['Wiesen und Gärten',['Wiesen & Gärten','Wiesen und Gärten'],['animal-honey-bee','animal-garden-cross-spider']],
  ['Flüsse und Seen',['Flüsse & Seen','Flüsse und Seen'],['animal-axolotl','animal-platypus']]
 ]){
  assert(options.includes(canonical));assert(!options.includes(variants[0]),'the duplicate wording is not a second choice');await select.selectOption(canonical);
  const expected=catalogue.filter(topic=>topic.category==='animals'&&variants.includes(topic.habitat)).map(topic=>topic.id).sort(),actual=await page.locator('.world-topic-tile').evaluateAll(nodes=>nodes.map(node=>node.dataset.routeFocus.replace('world-topic-','')).sort());assert.deepEqual(actual,expected);for(const id of mustInclude)assert(actual.includes(id),'both previously separated entries appear together');
  for(const id of actual){const tile=page.locator('[data-route-focus="world-topic-'+id+'"]');assert((await tile.locator('.world-tile-meta').innerText()).includes(catalogue.find(topic=>topic.id===id).habitat),'original detailed habitat wording stays');}rows.push({canonical,actualTopics:actual,originalDetailsRetained:true});
 }
 const aliases=['Wiesen & Gärten','Wiesen und Gärten','Flüsse & Seen','Flüsse und Seen'];for(const habitat of new Set(catalogue.filter(topic=>topic.category==='animals'&&!aliases.includes(topic.habitat)).map(topic=>topic.habitat)))assert(options.includes(habitat),'other habitat groups are not merged');
 await activate(page,page.getByRole('button',{name:'Alle Welten',exact:true}),touch);await activate(page,page.locator('[data-route-focus="world-category-inventions"]'),touch);assert.equal(await page.locator('.world-animal-filters').count(),0);await page.getByText(`${catalogue.filter(topic=>topic.category==='inventions').length} passende Entdeckerkarten · Seite 1 von ${Math.ceil(catalogue.filter(topic=>topic.category==='inventions').length/12)}`,{exact:true}).waitFor();assert.deepEqual(preserved(await save(page)),before);
 return {groups:rows,otherGroupsRetained:true,animalFiltersDoNotAffectInventions:true,personalDataUnchanged:true};
}

export async function volcanoChapterDestinationsPage(page,base,{touch=false}={}){
 const rows=[];for(let index=0;index<5;index++){
  const route='journeys/volcanoes/'+(index+1),target=index===3?'labs/plates':'labs/volcano';await page.goto(base+'/#'+route);await ready(page);await page.locator('[data-chapter-inquiry="volcanoes:'+index+'"]').waitFor();
  const link=page.locator('.journey-chapter-link a');assert.equal(await link.getAttribute('href'),'#'+target,'existing canonical related destination is a relevant model, not an empty book query');await link.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));const scroll=await page.evaluate(()=>scrollY),before=preserved(await save(page));
  await activate(page,link,touch);await page.waitForFunction(hash=>location.hash===hash,'#'+target);await page.locator('#lab-heading').waitFor();await page.locator('#active-research-lab').waitFor();await activate(page,page.getByRole('button',{name:'Zurück zu deinem Ausgangskapitel',exact:true}),touch);const returnedView=await returned(page,'#'+route,link,scroll);assert.deepEqual(preserved(await save(page)),before);rows.push({route,target,actualBodyLinkAndExplicitChapterReturn:true,returnedView});
 }return rows;
}
