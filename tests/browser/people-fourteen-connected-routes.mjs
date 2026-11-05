import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const entries=JSON.parse(await fs.readFile(new URL('../../app/people-inquiries.json',import.meta.url),'utf8')).entries.slice(4);
const links=JSON.parse(await fs.readFile(new URL('../../app/people-book-links.json',import.meta.url),'utf8'));
export async function fourteenConnectedRoutes(page,base,progress={global:[],book:[]}){
 assert.equal(entries.length,14);assert.equal(links.length,25);assert.equal(new Set(links.map(row=>[row.kind,row.term,row.topic].join('|'))).size,links.length,'one distinct reciprocal pair creates one focus identity');
 const {global,book}=progress;
 for(const entry of entries){
  const topic=catalog.find(row=>row.id===entry.id);await page.goto(base+'/#home');
  await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();
  await page.bringToFront();await page.waitForFunction(()=>document.hasFocus());
  const opener=page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true});await opener.focus();await page.keyboard.press('Enter');
  const input=page.getByRole('combobox',{name:'Lernwelt durchsuchen',exact:true});await input.waitFor();
  await page.waitForFunction(()=>document.hasFocus()&&document.activeElement?.matches('.search-dialog [role="combobox"]'));
  assert.equal(await input.inputValue(),'','a newly opened search starts with an empty actual input');
  await page.keyboard.type(topic.title);
  assert.equal(await input.inputValue(),topic.title,'complete title from the actual focused keyboard, including spaces and accents');
  const option=page.locator('[cmdk-item][data-value="topic:'+entry.id+'"]');await option.waitFor();
  for(let i=0;i<40&&await option.getAttribute('data-selected')!=='true';i++)await input.press('ArrowDown');
  assert.equal(await option.getAttribute('data-selected'),'true');await input.press('Enter');
  await page.locator('#world-topic-title').filter({hasText:topic.title}).waitFor();assert.equal(await page.locator('#world-topic-title').innerText(),topic.title);await page.locator('[data-person-evidence="'+entry.id+'"]').waitFor();
  await page.goBack();await page.waitForFunction(()=>location.hash==='#home');await opener.waitFor();global.push({id:entry.id,actualGlobalKeyboardSearch:true,actualBrowserBackToHome:true});
 }
 for(const link of links){
  assert.equal(link.kind,'word');const topic=catalog.find(row=>row.id===link.topic);assert(topic);
  await page.goto(base+'/#world/topic/'+link.topic);await page.locator('#world-topic-title').filter({hasText:topic.title}).waitFor();
  const outKey='topic-word-'+link.topic+'-'+link.term,outbound=page.locator('[data-route-focus="'+outKey+'"]');
  assert.equal(await outbound.count(),1,'a word/person pair has exactly one visible outgoing focus identity');assert.equal(await outbound.getAttribute('href'),'#book/words/'+encodeURIComponent(link.term));await outbound.focus();await page.keyboard.press('Enter');
  await page.waitForFunction(term=>document.querySelector('input[aria-label="Wissenswörter durchsuchen"]')?.value===term,link.term);
  const card=page.locator('.word-card').filter({has:page.getByRole('heading',{name:link.term,exact:true})});await card.waitFor();
  const details=card.locator('[data-book-people-connections="'+link.term+'"]');await details.waitFor();
  if(!await details.evaluate(element=>element.open)){await details.locator(':scope>summary').focus();await page.keyboard.press('Enter');}
  const backKey='book-word-'+link.term+'-person-'+link.topic,backlink=details.locator('[data-route-focus="'+backKey+'"]');
  assert.equal(await backlink.getAttribute('href'),'#world/topic/'+link.topic);await details.getByText(link.connection,{exact:true}).waitFor();
  await backlink.focus();await page.keyboard.press('Enter');await page.locator('#world-topic-title').filter({hasText:topic.title}).waitFor();
  await page.goBack();await card.waitFor();await page.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,backKey);assert(await details.evaluate(element=>element.open));
  await page.goBack();await page.locator('#world-topic-title').filter({hasText:topic.title}).waitFor();await page.waitForFunction(key=>document.activeElement?.dataset.routeFocus===key,outKey);
  book.push({topic:link.topic,term:link.term,actualArticleWordReciprocalRoute:true,actualFullConnectionText:true,actualBothBrowserBackFocusTargets:true,actualBookDisclosureRestored:true});
 }
 return {global,book};
}
