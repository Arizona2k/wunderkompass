import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {browserErrorArrays,monitorBrowserErrors,browserErrorsComplete} from '../../scripts/browser-errors.mjs';
const questions=JSON.parse(await fs.readFile(new URL('../../exports/content/why-questions.json',import.meta.url),'utf8'));
const ship='Warum kann ein Schiff aus schwerem Material schwimmen?';
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))));
async function visibleTarget(target){assert(await target.evaluate(e=>{const style=getComputedStyle(e),box=e.getBoundingClientRect();return e===document.activeElement&&style.outlineStyle!=='none'&&parseFloat(style.outlineWidth)>=2&&box.top>=0&&box.bottom<=innerHeight;}),'explicit keyboard destination has a visible outline and is in view');}
async function choose(page,term,kind){
 await page.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();
 const dialog=page.getByRole('dialog'),field=dialog.locator('input');await field.pressSequentially(term);
 const target=page.locator('[role=option]').filter({has:page.getByText(term,{exact:true})});
 const option=page.locator('[role=option][data-value="'+kind+':'+term+'"]');await option.waitFor();
 for(let i=0;i<=await page.getByRole('option').count()&&await option.getAttribute('aria-selected')!=='true';i++)await field.press('ArrowDown');
 assert.equal(await option.getAttribute('aria-selected'),'true');assert(await target.count()>0);
 await field.press('Enter');await dialog.waitFor({state:'detached'});await settle(page);
}

// A deliberate command to the same URI differs from Back to a saved reading view.
// Each isolated context uses only its own synthetic pass; the caller is untouched.
export async function bookCommandView(browser,base,{shots=null,engine='chromium'}={}){
 const proof={cases:[],...browserErrorArrays()};
 for(const motion of ['reduce','no-preference']){
  const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:motion}),page=await context.newPage();page.setDefaultTimeout(20000);monitorBrowserErrors(page,base,proof,{engine});
  const fresh=async hash=>{await page.goto('about:blank');await page.goto(base+'/#'+hash);await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();};
  try{
   await fresh('book/words/Atom');const query=page.getByRole('textbox',{name:'Wissenswörter durchsuchen'});await query.fill('');await query.pressSequentially('Proton');await page.getByRole('heading',{name:'Proton',exact:true}).waitFor();
   await choose(page,'Atom','word');assert.equal(await query.inputValue(),'Atom');const atom=page.getByRole('heading',{name:'Atom',exact:true});await atom.waitFor();await page.waitForFunction(()=>document.activeElement?.dataset.routeFocus==='book-word-target-Atom');await visibleTarget(atom);
   proof.cases.push({motion,id:'same-URI-word',query:'Atom',actualKeyboardTargetFocus:true});
   await fresh('book/why/'+encodeURIComponent(ship));const question=page.locator('#why-entry-'+questions.findIndex(q=>q.question===ship));await page.waitForFunction(id=>document.getElementById(id)?.open,await question.getAttribute('id'));await question.locator(':scope>summary').click();assert.equal(await question.evaluate(e=>e.open),false);
   await choose(page,ship,'why');assert(await question.evaluate(e=>e.open));await page.waitForFunction(term=>document.activeElement?.dataset.routeFocus==='book-why-target-'+term,ship);await visibleTarget(question.locator(':scope>summary'));
   proof.cases.push({motion,id:'same-URI-Why',actualReopened:true,actualKeyboardTargetFocus:true});
   await fresh('book/words/Mol');const related=page.locator('[data-book-related-words="Mol"]');await related.locator(':scope>summary').click();await related.getByRole('link',{name:'Mit „Atom“ weiterdenken →',exact:true}).click();await atom.waitFor();await page.goBack();await page.getByRole('heading',{name:'Mol',exact:true}).waitFor();await settle(page);
   const study=page.locator('[data-book-study="Mol"]');assert.equal(await study.evaluate(e=>e.open),false);await study.locator(':scope>summary').click();await study.locator('.book-thinking').waitFor({state:'attached'});await settle(page);assert(await study.evaluate(e=>e.open),'first manual study opening after Back stays open');assert.equal(await study.locator(':scope>summary').evaluate(e=>e===document.activeElement),true);
   proof.cases.push({motion,id:'manual-first-study-open-after-Back',actualOpen:true,manualFocusRetained:true});
   if(shots)await study.screenshot({path:shots+'/book-command-'+engine+'-'+motion+'.png',animations:'disabled'});
   // Save an open study through real navigation, then delay its reload response.
   const link=related.getByRole('link',{name:'Mit „Atom“ weiterdenken →',exact:true});await link.click();await atom.waitFor();await page.goBack();await page.getByRole('heading',{name:'Mol',exact:true}).waitFor();await settle(page);
   assert(await study.evaluate(e=>e.open));let release;const hold=new Promise(resolve=>release=resolve);
   const intercept=async route=>{await hold;await route.continue();};await page.route('**/book-measurement-content-*.json',intercept);const pending=page.waitForRequest('**/book-measurement-content-*.json');
   try{
    await page.reload();await pending;await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await study.locator('[role=status]').waitFor();
    const field=page.getByRole('textbox',{name:'Wissenswörter durchsuchen'});await field.click();const before=await page.evaluate(()=>scrollY);release();await study.locator('.book-thinking').waitFor({state:'attached'});await settle(page);
    assert(await study.evaluate(e=>e.open));assert(await field.evaluate(e=>e===document.activeElement),'new reading focus survives deferred old view');assert(Math.abs(await page.evaluate(()=>scrollY)-before)<=2,'deferred old view does not scroll over new interaction');
    proof.cases.push({motion,id:'delayed-return-new-interaction',actualFetchReleased:true,manualFocusAndScrollRetained:true});
   }finally{release();await page.unroute('**/book-measurement-content-*.json',intercept);}
  }catch(error){error.bookCommandProof=proof;if(shots)await page.screenshot({path:shots+'/book-command-'+engine+'-'+motion+'-original-failure.png',fullPage:true}).catch(()=>{});throw error;}finally{await context.close();}
 }
 assert.equal(proof.cases.length,8);assert(browserErrorsComplete(proof));return proof;
}
