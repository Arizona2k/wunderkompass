import assert from 'node:assert/strict';

// Hold real application navigation frames until after fresh, trusted input.
// Without the product guard both route observers focus MAIN and Enter fails.
export async function pendingRouteFocusFlow(browser,base,ready,monitor,report,shots){
 report.pendingRouteFocus={cases:[],method:'Actual trusted keyboard/touch/mouse input while browser navigation frames are pending; not a full device test'};
 for(const width of [320,1440])for(const input of ['keyboard','pointer']){
  const c=await browser.newContext({viewport:{width,height:900},hasTouch:width===320,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(26000);
  try{
   await p.addInitScript(()=>{const request=requestAnimationFrame.bind(window),cancel=cancelAnimationFrame.bind(window),held=new Map();let holding=false,id=0;window.__focusRace={trusted:[],begin:()=>{holding=true;},pending:()=>held.size,release:()=>{holding=false;const frames=[...held.values()];held.clear();for(const callback of frames)request(callback);}};for(const type of ['keydown','pointerdown'])document.addEventListener(type,event=>{if(holding)window.__focusRace.trusted.push({type,trusted:event.isTrusted});},true);window.requestAnimationFrame=callback=>{if(!holding)return request(callback);const next=--id;held.set(next,callback);return next;};window.cancelAnimationFrame=key=>{if(key<0)held.delete(key);else cancel(key);};});
   await p.goto(base+'#labs');await ready(p);await p.locator('.research-tile').first().waitFor();await p.getByRole('tab',{name:'Wissenswelten',exact:true}).click();await p.locator('.world-trip').first().waitFor();await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await p.evaluate(()=>window.__focusRace.begin());await p.getByRole('tab',{name:'Spielplatz',exact:true}).click();await p.locator('.game-tile').first().waitFor();const pending=await p.evaluate(()=>window.__focusRace.pending());assert.ok(pending>0,'actual navigation restoration is waiting for a browser frame');
   await p.evaluate(()=>window.__focusRace.trusted=[]);const details=p.locator('.playground-guide').filter({has:p.getByText('Welches Spiel passt heute?',{exact:true})}),summary=details.locator('summary');assert.equal(await details.count(),1,'specific game guidance target');await summary.focus();if(input==='keyboard')await p.keyboard.press('Enter');else if(width===320)await summary.tap();else await summary.click();assert.equal(await details.evaluate(e=>e.open),true);
   const beforeY=await p.evaluate(()=>scrollY);await p.evaluate(()=>window.__focusRace.release());await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const afterY=await p.evaluate(()=>scrollY);
   const focused=await summary.evaluate(e=>document.activeElement===e),active=await p.evaluate(()=>({tag:document.activeElement?.tagName,id:document.activeElement?.id})),trustedInput=await p.evaluate(input=>window.__focusRace.trusted.some(event=>event.trusted&&event.type===(input==='keyboard'?'keydown':'pointerdown')),input);
   await p.screenshot({path:shots+'/foundation-route-focus-'+input+'-'+(focused?'':'failure-')+width+'.png',animations:'disabled'});await p.keyboard.press('Enter');const closed=!await details.evaluate(e=>e.open);
   const scrollKept=Math.abs(afterY-beforeY)<=2;report.pendingRouteFocus.cases.push({width,input,pendingFrames:pending,trustedInput,focused,closed,scrollKept,beforeY,afterY,active});assert.equal(trustedInput,true,'actual browser input');assert.equal(focused,true,'pending restoration must not steal fresh user focus');assert.equal(scrollKept,true,'pending restoration must not scroll a fresh interaction away');assert.equal(closed,true,'second Enter still operates the disclosure');
  }finally{await c.close();}
 }
 await wayfinderPendingFocusFlow(browser,base,ready,monitor,report,shots);
 report.checks.push('Pending navigation frames cannot steal trusted keyboard/touch/mouse focus at320/1440; real disclosure still opens/closes');
}

// A pending route frame can run between locator.focus() and the next Enter.
// Exercise that actual browser boundary rather than retrying a failed assertion.
export async function wayfinderPendingFocusFlow(browser,base,ready,monitor,report,shots){
 const cases=[];report.wayfinderPendingFocus={cases,method:'Actual app restoration frames released between explicit focus and trusted Enter; untouched-route positive control retains automatic heading focus. Corresponding reproduced condition, not reconstructed CI event timing.'};
 const topics=[['person-mary_anning','.people-evidence'],['person-ibn_al_haytham','.people-evidence'],['history-khipu','.history-evidence'],['history-mohenjo-daro','.history-evidence'],['history-bronze','.history-evidence']];
 for(const width of [320,1440]){
  const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(26000);
  try{
   await p.addInitScript(()=>{const request=requestAnimationFrame.bind(window),cancel=cancelAnimationFrame.bind(window),held=new Map();let holding=false,id=0;window.__wayfinderGap={events:[],begin:()=>{holding=true;window.__wayfinderGap.events=[];},pending:()=>held.size,release:()=>{holding=false;const frames=[...held.values()];held.clear();for(const callback of frames)request(callback);}};for(const type of ['focusin','keydown'])window.addEventListener(type,event=>{if(holding)window.__wayfinderGap.events.push({type,trusted:event.isTrusted});},true);window.requestAnimationFrame=callback=>{if(!holding)return request(callback);const next=--id;held.set(next,callback);return next;};window.cancelAnimationFrame=key=>{if(key<0)held.delete(key);else cancel(key);};});
   await p.goto(base+'#world/topic/invention-generator');await ready(p);await p.locator('.article-inventions .world-mini-question').waitFor();await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   for(const [id,selector]of topics){
    // No fresh focus: restoration must still work, and a forged focus event
    // must not be treated as a real browser focus transition.
    await p.evaluate(id=>{window.__wayfinderGap.begin();location.hash='world/topic/'+id;},id);const activity=p.locator(selector);await activity.waitFor();const untouchedFrames=await p.evaluate(()=>window.__wayfinderGap.pending());assert.ok(untouchedFrames>0,'real untouched app restoration is pending');
    await p.evaluate(()=>document.body.dispatchEvent(new FocusEvent('focusin',{bubbles:true})));const afterForgedEvent=await p.evaluate(()=>window.__wayfinderGap.pending());assert.equal(afterForgedEvent,untouchedFrames,'untrusted focus events cannot cancel navigation');
    await p.evaluate(()=>window.__wayfinderGap.release());await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const headingFocused=await p.locator('#world-topic-title').evaluate(e=>e===document.activeElement);assert.equal(headingFocused,true,'untouched route retains its automatic heading focus');
    await p.evaluate(()=>location.hash='world/topic/invention-generator');await p.locator('.article-inventions .world-mini-question').waitFor();await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await p.evaluate(id=>{window.__wayfinderGap.begin();location.hash='world/topic/'+id;},id);await activity.waitFor();const pendingBeforeFocus=await p.evaluate(()=>window.__wayfinderGap.pending());assert.ok(pendingBeforeFocus>0,'actual app navigation frames are pending before explicit focus');
    const jump=p.locator('.article-wayfinder').getByRole('button',{name:/Ausprobieren$/});await jump.focus();assert.equal(await jump.evaluate(e=>e===document.activeElement),true,'actual wayfinder receives explicit focus');const pendingAfterFocus=await p.evaluate(()=>window.__wayfinderGap.pending());
    await p.evaluate(()=>window.__wayfinderGap.release());await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const wayfinderStillFocused=await jump.evaluate(e=>e===document.activeElement);await p.keyboard.press('Enter');const activityFocused=await activity.evaluate(e=>e===document.activeElement),trustedFocus=await p.evaluate(()=>window.__wayfinderGap.events.some(e=>e.type==='focusin'&&e.trusted));
    const record={width,id,untouchedFrames,afterForgedEvent,headingFocused,pendingBeforeFocus,pendingAfterFocus,trustedFocus,wayfinderStillFocused,activityFocused};cases.push(record);
    if(shots){await activity.scrollIntoViewIfNeeded();await p.screenshot({path:shots+'/foundation-wayfinder-focus-'+id+'-'+(activityFocused?'':'failure-')+width+'.png',animations:'disabled'});}
    assert.equal(trustedFocus,true,'actual browser focus transition observed');assert.equal(wayfinderStillFocused,true,'pending restoration must preserve explicit wayfinder focus before Enter');assert.equal(activityFocused,true,'wayfinder focuses the actual research activity');
   }
  }finally{await c.close();}
 }
 assert.equal(cases.length,10,'both person and all three historical activities at320/1440');
 report.checks.push('Explicit wayfinder focus survives pending navigation before Enter for both biographies and all three historical activities at320/1440; untouched and untrusted-event controls keep automatic heading restoration');
}
