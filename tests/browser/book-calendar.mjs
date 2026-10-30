import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';
const packs=await Promise.all([['particle','Atom'],['measurement','Mol'],['water','Kohäsion']].map(async([kind,term])=>({kind,term,pack:JSON.parse(await fs.readFile(new URL('../../app/book-'+kind+'-content.json',import.meta.url),'utf8'))})));
// Expected calendar fields are formatted independently from the product's Date API.
const date=value=>value.split('-').reverse().map(Number).join('.');
export async function bookSourceCalendarView(browser,base,{shots=null,engine='chromium'}={}){
 const context=await browser.newContext({timezoneId:'Pacific/Kiritimati',viewport:{width:320,height:900},reducedMotion:'reduce'}),proof={timezone:'Pacific/Kiritimati',panels:[],...browserErrorArrays()},page=await context.newPage();page.setDefaultTimeout(26000);monitorBrowserErrors(page,base,proof,{engine});
 try{
  for(const {kind,term,pack} of packs){
   await page.goto(base+'/#book/words/'+encodeURIComponent(term));await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();const card=page.locator('.word-card').filter({has:page.getByRole('heading',{name:term,exact:true})}),study=card.locator(kind==='measurement'?'[data-book-study]':'[data-book-'+kind+'-study]');await study.locator(':scope>summary').click();const summary=study.getByText('Quellen und Prüfstand',{exact:true});await summary.click();const sources=summary.locator('..');await sources.getByText(new RegExp('Belegstellenabgleich: '+date(pack.sourceReadOn).replaceAll('.','\\.')+'\\.')).waitFor();
   for(const source of pack.learning[term].sources){const row=sources.locator('li').filter({has:page.getByRole('link',{name:source.title,exact:true})});await row.getByText('Quelle abgerufen am '+date(source.checkedOn)+'.'+(source.updatedOn?' Angegebener Quellenstand: '+date(source.updatedOn)+'.':''),{exact:true}).waitFor();}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);if(shots)await sources.screenshot({path:shots+'/book-source-calendar-'+engine+'-'+kind+'-utc14.png',animations:'disabled'});proof.panels.push({kind,term,sourceReadOn:pack.sourceReadOn,individualSources:pack.learning[term].sources.length,actualUTC14CalendarFieldsUnchanged:true});
  }
  assert(browserErrorsComplete(proof));return proof;
 }catch(error){if(shots)await page.screenshot({path:shots+'/book-source-calendar-'+engine+'-original-failure.png',fullPage:true}).catch(()=>{});throw error;}finally{await context.close();}
}
