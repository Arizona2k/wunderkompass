import assert from 'node:assert/strict';

export async function bookTabNavigation(page,width){
 const previous=page.viewportSize();await page.setViewportSize({width,height:900});await page.evaluate(()=>location.hash='book');const navigation=page.locator('.book-navigation');await navigation.waitFor();await page.waitForFunction(()=>document.querySelector('.book-navigation')?.dataset.stripOverflow!==undefined);
 await navigation.scrollIntoViewIfNeeded();
 if(width===320){const next=navigation.getByRole('button',{name:'Weitere Buchbereiche anzeigen',exact:true});assert(await next.isVisible());assert(await next.isEnabled());const before=await page.evaluate(()=>({page:scrollY,strip:document.querySelector('.book-navigation .book-tabs').scrollLeft}));await next.click();const after=await page.evaluate(()=>({page:scrollY,strip:document.querySelector('.book-navigation .book-tabs').scrollLeft}));assert(after.strip>before.strip,'visible book arrow actually scrolls its tab strip');assert(Math.abs(after.page-before.page)<=1,'book strip controls preserve the page position');}
 await page.keyboard.press('Tab');
 const cases=[];
 for(const [name,selector]of[['Wörter','.word-grid'],['Warum?','.why-list'],['Notizbuch','.notebook'],['Naturatlas','.atlas'],['Kleiner Atlas','.atlas']]){
  const tab=navigation.getByRole('tab',{name,exact:true});await tab.focus();const box=await tab.evaluate(el=>{const r=el.getBoundingClientRect(),list=el.closest('[role=tablist]').getBoundingClientRect();return {left:r.left,right:r.right,listLeft:list.left,listRight:list.right,width:innerWidth,focused:el===document.activeElement,visibleFocus:el.matches(':focus-visible')};});assert(box.focused&&box.visibleFocus,'actual keyboard focus on '+name);assert(box.left>=box.listLeft-1&&box.right<=box.listRight+1&&box.left>=-1&&box.right<=box.width+1,'entire focused book tab is revealed without clipping: '+name);await page.keyboard.press('Enter');await page.locator('.knowledge-book '+selector).first().waitFor();assert.equal(await tab.getAttribute('aria-selected'),'true');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);cases.push(name);
 }
 await page.setViewportSize(previous);return {width,allFiveKeyboardTabs:cases,visibleNativeScrollControl:width===320};
}
