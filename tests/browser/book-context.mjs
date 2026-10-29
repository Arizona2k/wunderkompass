import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const words=JSON.parse(await fs.readFile(new URL('../../exports/content/knowledge-words.json',import.meta.url),'utf8'));
const why=JSON.parse(await fs.readFile(new URL('../../exports/content/why-questions.json',import.meta.url),'utf8'));
const ship='Warum kann ein Schiff aus schwerem Material schwimmen?';
const cardFor=(page,term)=>page.locator('.word-card').filter({has:page.getByRole('heading',{name:term,exact:true})});
async function open(details){if(!await details.evaluate(e=>e.open))await details.locator(':scope>summary').click();}
async function keyFocus(page,link){await link.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert(await link.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')));}
async function returnTo(page,link){await page.goBack();await link.waitFor();await page.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,await link.getAttribute('data-route-focus'));assert(await link.evaluate(e=>{const r=e.getBoundingClientRect();return e.matches(':focus-visible')&&r.top>=0&&r.bottom<=innerHeight;}),'Back restores the visible original keyboard opener without refocusing');}
const view=page=>page.evaluate(()=>({book:history.state?.wunderBook,scroll:scrollY,open:[...document.querySelectorAll('details[data-history-disclosure][open]')].map(e=>e.dataset.historyDisclosure)}));

export async function bookContextView(page,report,width,{large=false,shots=null,engine='chromium'}={}){
 await page.setViewportSize({width,height:900});await page.evaluate(()=>location.hash='book');await page.locator('.knowledge-book').waitFor();await page.locator('.earth-app').evaluate((e,v)=>e.classList.toggle('large-reading',v),large);
 await page.locator('.book-navigation').getByRole('tab',{name:'Wörter',exact:true}).click();const input=page.getByRole('textbox',{name:'Wissenswörter durchsuchen'});await input.fill('');await input.pressSequentially('Brechung');
 const filters=page.locator('.book-filter-panel');await open(filters);await filters.getByRole('tab',{name:words.find(w=>w.term==='Brechung').short,exact:true}).click();await filters.getByRole('button',{name:'B',exact:true}).click();
 const card=cardFor(page,'Brechung'),study=card.locator('[data-book-light-study]');await open(study);await open(study.locator('[data-history-disclosure="book-related-Brechung"]'));
 const related=card.locator('a[href="#book/words/Reflexion"]');await keyFocus(page,related);const before=await view(page);await page.keyboard.press('Enter');await cardFor(page,'Reflexion').waitFor();await returnTo(page,related);const after=await view(page);assert.deepEqual(after.book,before.book);assert.deepEqual(after.open,before.open);assert(Math.abs(after.scroll-before.scroll)<=2);
 if(shots)await card.screenshot({path:shots+'/book-context-'+engine+'-'+width+'.png',animations:'disabled'});
 await page.goForward();await cardFor(page,'Reflexion').waitFor();await page.reload();await cardFor(page,'Reflexion').waitFor();await page.locator('.earth-app').evaluate((e,v)=>e.classList.toggle('large-reading',v),large);assert.equal(await input.inputValue(),'Reflexion');await returnTo(page,related);assert.deepEqual((await view(page)).book,before.book);
 const article=card.locator('a[href^="#world/topic/"]').first();await keyFocus(page,article);await page.keyboard.press('Enter');await page.locator('#world-topic-title').waitFor();await returnTo(page,article);assert.deepEqual((await view(page)).book,before.book);
 await page.locator('.book-navigation').getByRole('tab',{name:'Warum?',exact:true}).click();const question=page.locator('#why-entry-'+why.findIndex(q=>q.question===ship));await open(question);const water=question.locator('[data-book-water-study]');await open(water);await open(water.locator('[data-history-disclosure="book-related-'+ship+'"]'));const density=question.locator('a[href="#book/words/Dichte"]');await keyFocus(page,density);const whyBefore=await view(page);await page.keyboard.press('Enter');await cardFor(page,'Dichte').waitFor();await returnTo(page,density);assert.equal(await page.locator('.book-navigation').getByRole('tab',{name:'Warum?',exact:true}).getAttribute('aria-selected'),'true');assert.deepEqual((await view(page)).book,whyBefore.book);assert.deepEqual((await view(page)).open,whyBefore.open);
 const row={width,large,typedWordWordBack:true,whyWordBack:true,articleBack:true,categoryAndLetterRetained:true,actualVisibleKeyboardFocus:true,forwardReloadAndBack:true,sourceScrollPreserved:true};(report.bookContext??=[]).push(row);return row;
}

export async function bookSearchView(page,report,width){
 await page.setViewportSize({width,height:900});await page.evaluate(()=>location.hash='book/notes');await page.locator('#research-note').waitFor();const rows=[];
 for(const [query,target]of [['Mond Schatten','chapter:moon:2'],['Vulkan Gas','lab:volcano'],['Warum entstehen Jahreszeiten?','topic:science-seasons'],['Elefant Afrika','topic:animal-african-savanna-elephant'],['Elefamt','topic:animal-african-savanna-elephant'],['Elefant Vulkanquantensalat',null]]){
  await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();const dialog=page.getByRole('dialog'),input=dialog.locator('input');await input.pressSequentially(query);await dialog.getByText('Kapiteltexte werden noch ergänzt …',{exact:true}).waitFor({state:'detached'});
  if(target){const option=page.locator('[role=option][data-value="'+target+'"]');await option.waitFor();for(let i=0;i<=await page.getByRole('option').count()&&await option.getAttribute('aria-selected')!=='true';i++)await input.press('ArrowDown');assert.equal(await option.getAttribute('aria-selected'),'true','actual command-key navigation selects the canonical target');await input.press('Enter');await dialog.waitFor({state:'detached'});assert.notEqual(await page.evaluate(()=>location.hash),'#book/notes');await page.goBack();await page.locator('#research-note').waitFor();}
  else {assert.equal(await page.getByRole('option').count(),0);await dialog.getByRole('status').waitFor();await page.keyboard.press('Escape');}
  rows.push({query,target,actualTypedInput:true,actualTargetAndBack:!!target,negative:!target});
 }
 await page.evaluate(()=>location.hash='world/animals');const field=page.getByRole('textbox',{name:'Entdeckerkarten durchsuchen'});await field.waitFor();const found=[];
 for(const query of ['Elefant','Ele\u00adfant']){await field.fill('');await field.pressSequentially(query);const card=page.locator('[data-route-focus="world-topic-animal-african-savanna-elephant"]');await card.waitFor();found.push(await card.innerText());}
 assert.equal(found[0],found[1]);await field.fill('');const row={width,queries:rows,softHyphenSameCanonicalCard:true};(report.bookSearch??=[]).push(row);return row;
}
