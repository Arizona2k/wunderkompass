import assert from 'node:assert/strict';

export async function passDesign(page,report,width,shots){
 const opener=page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true});await opener.click();
 const pass=page.getByRole('dialog',{name:'Deine Entdeckungen.',exact:true}),nav=pass.getByRole('navigation',{name:'Im Entdeckerpass'});
 await pass.waitFor();const hash=new URL(page.url()).hash;
 const frame=async()=>{
  assert.equal(await pass.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollTop===0),true,'pass frame does not overflow or scroll away');
  assert.equal(await pass.locator('.pass-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,'pass body no horizontal overflow '+width);
  for(const selector of ['.pass-header button','.pass-footer button'])assert.equal(await pass.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect(),d=el.closest('[role=dialog]').getBoundingClientRect();return r.top>=d.top&&r.bottom<=d.bottom&&r.width>=44&&r.height>=44}),true,'dialog action always within frame');
 };
 await frame();await page.screenshot({path:shots+'/pass-entry-'+width+'.png'});
 for(const [name,id] of [['Überblick','overview'],['Lernwege','learning'],['Pass sichern','backup'],['Abzeichen','badges']]){
  const button=nav.getByRole('button',{name,exact:true});if(width===390)await button.tap();else {await button.focus();await page.keyboard.press('Enter')}
  assert.equal(await pass.locator(`[data-pass-section="${id}"]`).evaluate(el=>el===document.activeElement),true,'pass jump '+id);
  assert.equal(new URL(page.url()).hash,hash,'pass jumps preserve current activity');await frame();
  await page.screenshot({path:shots+'/pass-'+id+'-'+width+'.png'});
 }
 const badges=pass.locator('[data-pass-section=badges]');for(const details of await badges.locator('.pass-badge-collection').all()){await details.locator('summary').click();assert.ok(await details.locator('.passport-badge').count());}
 await frame();
 await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 const axe=async(selector='.passport-atlas')=>assert.deepEqual(await page.evaluate(async selector=>{const r=await window.axe.run(selector,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))},selector),[],'pass axe '+width);
 await axe();
 await nav.getByRole('button',{name:'Pass sichern',exact:true}).click();
 await pass.getByRole('switch',{name:'Größere Schrift',exact:true}).check();await pass.getByRole('switch',{name:'Weniger Bewegung',exact:true}).check();await frame();
 assert.equal(await pass.getAttribute('data-reduced-motion'),'true');assert.ok((await pass.getAttribute('class')).includes('large-reading'));
 await pass.locator('.voice-picker').scrollIntoViewIfNeeded();await frame();await page.screenshot({path:shots+'/pass-preferences-large-'+width+'.png'});await axe();
 await pass.getByRole('switch',{name:'Größere Schrift',exact:true}).uncheck();await pass.getByRole('switch',{name:'Weniger Bewegung',exact:true}).uncheck();
 await pass.getByRole('button',{name:'Pass neu beginnen',exact:true}).click();const confirmation=page.getByRole('alertdialog');await confirmation.waitFor();assert.equal(await confirmation.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&el.scrollWidth<=el.clientWidth+1}),true,'reset confirmation fits '+width);await axe('.pass-confirmation');await page.screenshot({path:shots+'/pass-reset-confirmation-'+width+'.png',animations:'disabled'});await confirmation.getByRole('button',{name:'Weiter sammeln',exact:true}).click();await page.locator('.pass-confirmation').waitFor({state:'detached'});await pass.waitFor();
 await page.keyboard.press('Escape');await page.locator('.passport-atlas').waitFor({state:'detached'});assert.equal(await opener.evaluate(el=>el===document.activeElement),true,'Escape returns focus to pass opener');
 await opener.click();await pass.getByRole('button',{name:'Weiter entdecken',exact:true}).click();await page.locator('.passport-atlas').waitFor({state:'detached'});assert.equal(await opener.evaluate(el=>el===document.activeElement),true,'footer returns focus to pass opener');
 report.checks.push('Pass '+width+': four keyboard/touch focus jumps preserve hash; frame actions stay visible, no overflow, full badges, large text/reduced motion, axe A/AA, Escape and footer focus return');
}
