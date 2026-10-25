import assert from 'node:assert/strict';

// Check the usable scroll area, not just the outer dialog rectangle: fixed
// headers/footers can cover a control while the dialog itself still fits.
async function reachable(pass,control,name){
 assert.equal(await control.evaluate(el=>{
  const r=el.getBoundingClientRect(),body=el.closest('.passport-atlas').querySelector('.pass-body').getBoundingClientRect();
  const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
  return r.top>=body.top-1&&r.bottom<=body.bottom+1&&r.left>=body.left&&r.right<=body.right&&!!hit&&el.contains(hit);
 }),true,name+' fully visible and hit-testable inside pass body');
}
async function touchSize(control,name){
 assert.equal(await control.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44}),true,name+' touch target at least 44px');
}
async function textFits(pass){
 const clipped=await pass.locator('.pass-wayfinder button,.pass-backup-actions button,.settings-grid label,.passport-stats>div,.progress-overview>div,.pass-more-progress>summary,.pass-badge-collection>summary').evaluateAll(elements=>elements.flatMap(el=>{
  const box=el.getBoundingClientRect(),walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),bad=[];
  while(walker.nextNode()){const node=walker.currentNode;if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);for(const r of range.getClientRects())if(r.width&&r.height&&(r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1))bad.push(node.textContent.trim())}
  return bad;
 }));assert.deepEqual(clipped,[],'pass labels stay inside their own controls/cards');
}
async function keyboardRing(control,name){
 assert.equal(await control.evaluate(el=>el.matches(':focus-visible')),true,name+' visible keyboard focus');
 assert.equal(await control.evaluate(el=>{const s=getComputedStyle(el);return s.outlineStyle==='solid'&&parseFloat(s.outlineWidth)>=2}),true,name+' discernible focus ring');
 // WCAG non-text contrast for the ring against the surface around it.
 const colors=await control.evaluate(el=>{let surface=el.parentElement;while(surface&&getComputedStyle(surface).backgroundColor==='rgba(0, 0, 0, 0)')surface=surface.parentElement;return [getComputedStyle(el).outlineColor,getComputedStyle(surface).backgroundColor]});
 const luminance=color=>{const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const [a,b]=colors.map(luminance),contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(contrast>=3,name+' focus contrast at least 3:1 '+JSON.stringify({outline:colors[0],surface:colors[1],contrast}));
}

async function switchGeometry(control,name){
 assert.equal(await control.evaluate(el=>{const r=el.getBoundingClientRect(),t=el.querySelector('[data-slot=switch-thumb]').getBoundingClientRect();return t.left>=r.left+1&&t.right<=r.right-1&&t.top>=r.top+1&&t.bottom<=r.bottom-1}),true,name+' thumb stays inside touch target');
 const colors=await control.evaluate(el=>{let surface=el.parentElement;while(surface&&getComputedStyle(surface).backgroundColor==='rgba(0, 0, 0, 0)')surface=surface.parentElement;return [getComputedStyle(el).borderColor,getComputedStyle(surface).backgroundColor]});
 const luminance=color=>{const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const [a,b]=colors.map(luminance);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=3,name+' control boundary contrast at least 3:1');
}

async function textContrast(control,name){
 await control.evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished.catch(()=>{}))));
 const colors=await control.evaluate(el=>[getComputedStyle(el).color,getComputedStyle(el).backgroundColor]);
 const luminance=color=>{const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const [a,b]=colors.map(luminance),contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(contrast>=4.5,name+' text contrast at least 4.5:1 ('+contrast.toFixed(2)+')');
}

export async function passDesign(page,report,width,shots){
 const delayed=width===360;let resumeBackup,heldBackup=false;const backupReady=new Promise(resolve=>resumeBackup=resolve);
 const holdBackup=async route=>{heldBackup=true;await backupReady;await route.continue();};
 if(delayed)await page.route('**/progress-panel-*.js',holdBackup);
 try{
 const opener=page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true});await opener.click();
 const pass=page.getByRole('dialog',{name:'Entdeckerpass',exact:true}),nav=pass.getByRole('navigation',{name:'Im Entdeckerpass'});
 await pass.waitFor();const hash=new URL(page.url()).hash,activate=control=>width<=390?control.tap():control.click();
 const frame=async()=>{
  assert.equal(await pass.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollTop===0),true,'pass frame does not overflow or scroll away');
  assert.equal(await pass.locator('.pass-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,'pass body no horizontal overflow '+width);
  for(const selector of ['.pass-header button','.pass-footer button'])assert.equal(await pass.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect(),d=el.closest('[role=dialog]').getBoundingClientRect();return r.top>=d.top&&r.bottom<=d.bottom&&r.width>=44&&r.height>=44}),true,'dialog action always within frame');
  await textFits(pass);
 };
 const backupVisible=async()=>{for(const button of await pass.locator('.pass-backup-actions button').all()){await reachable(pass,button,await button.innerText());await touchSize(button,'backup action')}};
 await frame();await reachable(pass,pass.locator('.passport-stats>div').first(),'first overview value and label');
 for(const button of await nav.getByRole('button').all())await touchSize(button,'pass navigation');
 await page.screenshot({path:shots+'/pass-entry-'+width+'.png',animations:'disabled'});
 for(const [name,id] of [['Überblick','overview'],['Lernwege','learning'],['Gespeichertes & Notizen','saved'],['Pass sichern','backup'],['Abzeichen','badges']]){
  const button=nav.getByRole('button',{name,exact:true});if(width===390)await button.tap();else {await button.focus();await page.keyboard.press('Enter')}
  const section=pass.locator(`[data-pass-section="${id}"]`),heading=section.locator('h3').first();
  assert.equal(await heading.evaluate(el=>el===document.activeElement),true,'pass jump focuses the named heading '+id);
  if(id==='backup'&&delayed){assert.equal(heldBackup,true,'actual delayed backup module was intercepted');await pass.getByText('Deine Sicherung kommt gleich …',{exact:true}).waitFor();resumeBackup();await pass.getByRole('button',{name:'Entdeckerpass sichern',exact:true}).waitFor();assert.equal(await heading.evaluate(el=>el===document.activeElement),true,'stable backup heading retains focus after the delayed controls mount');report.checks.push('Delayed backup module: named heading immediately focused and same focus retained after actual chunk arrival');}
  assert.equal(await section.evaluate(el=>getComputedStyle(el).outlineStyle==='none'),true,'no dominant whole-section outline');
  if(width!==390)await keyboardRing(heading,'section heading '+id);
  assert.equal(new URL(page.url()).hash,hash,'pass jumps preserve current activity');await frame();
  if(id==='backup'){await backupVisible();const save=pass.locator('.pass-backup-actions .primary-button');await textContrast(save,'backup normal');await save.hover();await textContrast(save,'backup hover');await page.screenshot({path:shots+'/pass-backup-hover-'+width+'.png',animations:'disabled'});await page.mouse.move(0,0)}
  await page.screenshot({path:shots+'/pass-'+id+'-'+width+'.png',animations:'disabled'});
 }
 await activate(nav.getByRole('button',{name:'Überblick',exact:true}));
 const more=pass.locator('.pass-more-progress');assert.equal(await more.getAttribute('open'),null);
 await activate(more.locator('summary'));assert.equal(await more.locator('.progress-overview>div').count(),3);await more.getByText('Kapitel erkundet',{exact:true}).waitFor();await frame();await more.locator('summary').scrollIntoViewIfNeeded();await page.screenshot({path:shots+'/pass-extra-stats-'+width+'.png',animations:'disabled'});await activate(more.locator('summary'));
 const badges=pass.locator('[data-pass-section=badges]');for(const details of await badges.locator('.pass-badge-collection').all()){
  const expected=Number((await details.locator('summary').innerText()).match(/von (\d+)/)[1]);await details.locator('summary').click();assert.equal(await details.locator('.passport-badge').count(),expected,'all badges retained');
 }
 await frame();
 await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 const axe=async(selector='.passport-atlas')=>assert.deepEqual(await page.evaluate(async selector=>{const r=await window.axe.run(selector,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))},selector),[],'pass axe '+width);
 await axe();
 await activate(nav.getByRole('button',{name:'Pass sichern',exact:true}));
 for(const name of ['Größere Schrift','Weniger Bewegung']){
  const toggle=pass.getByRole('switch',{name,exact:true});await touchSize(toggle,name);await switchGeometry(toggle,name+' unchecked');
  await activate(toggle.locator('..').locator('span').last());assert.equal(await toggle.isChecked(),true,'touching preference label toggles '+name);await switchGeometry(toggle,name+' checked');
 }
 await frame();assert.equal(await pass.getAttribute('data-reduced-motion'),'true');assert.ok((await pass.getAttribute('class')).includes('large-reading'));
 assert.equal(await pass.evaluate(el=>getComputedStyle(el).animationName),'none','reduced motion includes the dialog frame');
 await activate(nav.getByRole('button',{name:'Überblick',exact:true}));await reachable(pass,pass.locator('.passport-stats>div').first(),'large-text first overview row');await frame();await page.screenshot({path:shots+'/pass-overview-large-'+width+'.png',animations:'disabled'});
 await activate(more.locator('summary'));await more.locator('summary').scrollIntoViewIfNeeded();await frame();assert.equal(await more.locator('.progress-overview span').evaluateAll(els=>els.every(el=>parseFloat(getComputedStyle(el).fontSize)>=18)),true,'extra statistics honor large text');await page.screenshot({path:shots+'/pass-extra-stats-large-'+width+'.png',animations:'disabled'});await activate(more.locator('summary'));
 await activate(nav.getByRole('button',{name:'Pass sichern',exact:true}));await backupVisible();await frame();await page.screenshot({path:shots+'/pass-backup-large-'+width+'.png',animations:'disabled'});
 await pass.getByRole('switch',{name:'Größere Schrift',exact:true}).scrollIntoViewIfNeeded();await frame();await page.screenshot({path:shots+'/pass-display-large-'+width+'.png',animations:'disabled'});
 await pass.locator('.voice-picker').scrollIntoViewIfNeeded();await frame();await page.screenshot({path:shots+'/pass-preferences-large-'+width+'.png',animations:'disabled'});await axe();
 await page.keyboard.press('Tab');const close=pass.getByRole('button',{name:'Entdeckerpass schließen',exact:true});await close.focus();await keyboardRing(close,'header close');await page.screenshot({path:shots+'/pass-keyboard-focus-'+width+'.png',animations:'disabled'});
 await page.emulateMedia({forcedColors:'active'});await keyboardRing(close,'system-color focus');await page.screenshot({path:shots+'/pass-system-colors-'+width+'.png',animations:'disabled'});await page.emulateMedia({forcedColors:'none'});
 await activate(nav.getByRole('button',{name:'Pass sichern',exact:true}));await pass.getByRole('switch',{name:'Größere Schrift',exact:true}).uncheck();await pass.getByRole('switch',{name:'Weniger Bewegung',exact:true}).uncheck();
 await pass.getByRole('button',{name:'Pass neu beginnen',exact:true}).click();const confirmation=page.getByRole('alertdialog');await confirmation.waitFor();assert.equal(await confirmation.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&el.scrollWidth<=el.clientWidth+1}),true,'reset confirmation fits '+width);await axe('.pass-confirmation');await page.screenshot({path:shots+'/pass-reset-confirmation-'+width+'.png',animations:'disabled'});await confirmation.getByRole('button',{name:'Weiter sammeln',exact:true}).click();await page.locator('.pass-confirmation').waitFor({state:'detached'});await pass.waitFor();
 await page.keyboard.press('Escape');await page.locator('.passport-atlas').waitFor({state:'detached'});assert.equal(await opener.evaluate(el=>el===document.activeElement),true,'Escape returns focus to pass opener');
 await opener.click();const footer=pass.getByRole('button',{name:'Weiter entdecken',exact:true});await textContrast(footer,'footer normal');await footer.hover();await textContrast(footer,'footer hover');await footer.click();await page.locator('.passport-atlas').waitFor({state:'detached'});assert.equal(await opener.evaluate(el=>el===document.activeElement),true,'footer returns focus to pass opener');
 report.checks.push('Pass '+width+': heading focus without whole-section frames, keyboard/system-color focus and contrast, normal/hover action text contrast, touch-sized controls/label activation, all badges and extra stats, no label clipping/overlays, both backup actions immediately reachable with normal/large text, reduced dialog motion, hash and focus return preserved');
 }finally{resumeBackup();if(delayed)await page.unroute('**/progress-panel-*.js',holdBackup);}
}
