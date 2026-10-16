import assert from 'node:assert/strict';

// Hold real application navigation frames until after fresh, trusted input.
// Without the product guard both route observers focus MAIN and Enter fails.
export async function pendingRouteFocusFlow(browser,base,ready,monitor,report,shots){
 report.pendingRouteFocus={cases:[],method:'Actual trusted keyboard/touch/mouse input while browser navigation frames are pending; not a full device test'};
 for(const width of [320,1440])for(const input of ['keyboard','pointer']){
  const c=await browser.newContext({viewport:{width,height:900},hasTouch:width===320,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);p.setDefaultTimeout(20000);
  try{
   await p.addInitScript(()=>{const request=requestAnimationFrame.bind(window),cancel=cancelAnimationFrame.bind(window),held=new Map();let holding=false,id=0;window.__focusRace={trusted:[],begin:()=>{holding=true;},pending:()=>held.size,release:()=>{holding=false;const frames=[...held.values()];held.clear();for(const callback of frames)request(callback);}};for(const type of ['keydown','pointerdown'])document.addEventListener(type,event=>{if(holding)window.__focusRace.trusted.push({type,trusted:event.isTrusted});},true);window.requestAnimationFrame=callback=>{if(!holding)return request(callback);const next=--id;held.set(next,callback);return next;};window.cancelAnimationFrame=key=>{if(key<0)held.delete(key);else cancel(key);};});
   await p.goto(base+'#labs');await ready(p);await p.locator('.research-tile').first().waitFor();await p.getByRole('tab',{name:'Wissenswelten',exact:true}).click();await p.locator('.world-trip').first().waitFor();await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await p.evaluate(()=>window.__focusRace.begin());await p.getByRole('tab',{name:'Spielplatz',exact:true}).click();await p.locator('.game-tile').first().waitFor();const pending=await p.evaluate(()=>window.__focusRace.pending());assert.ok(pending>0,'actual navigation restoration is waiting for a browser frame');
   await p.evaluate(()=>window.__focusRace.trusted=[]);const details=p.locator('.playground-guide'),summary=details.locator('summary');await summary.focus();if(input==='keyboard')await p.keyboard.press('Enter');else if(width===320)await summary.tap();else await summary.click();assert.equal(await details.evaluate(e=>e.open),true);
   const beforeY=await p.evaluate(()=>scrollY);await p.evaluate(()=>window.__focusRace.release());await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const afterY=await p.evaluate(()=>scrollY);
   const focused=await summary.evaluate(e=>document.activeElement===e),active=await p.evaluate(()=>({tag:document.activeElement?.tagName,id:document.activeElement?.id})),trustedInput=await p.evaluate(input=>window.__focusRace.trusted.some(event=>event.trusted&&event.type===(input==='keyboard'?'keydown':'pointerdown')),input);
   await p.screenshot({path:shots+'/foundation-route-focus-'+input+'-'+(focused?'':'failure-')+width+'.png',animations:'disabled'});await p.keyboard.press('Enter');const closed=!await details.evaluate(e=>e.open);
   const scrollKept=Math.abs(afterY-beforeY)<=2;report.pendingRouteFocus.cases.push({width,input,pendingFrames:pending,trustedInput,focused,closed,scrollKept,beforeY,afterY,active});assert.equal(trustedInput,true,'actual browser input');assert.equal(focused,true,'pending restoration must not steal fresh user focus');assert.equal(scrollKept,true,'pending restoration must not scroll a fresh interaction away');assert.equal(closed,true,'second Enter still operates the disclosure');
  }finally{await c.close();}
 }
 report.checks.push('Pending navigation frames cannot steal trusted keyboard/touch/mouse focus at320/1440; real disclosure still opens/closes');
}
