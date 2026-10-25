import assert from 'node:assert/strict';

export async function assertTextInsideControls(page,selector,label){
 const controls=page.locator(selector);assert.ok(await controls.count(),label+' controls present');
 const overflow=await controls.evaluateAll(elements=>elements.flatMap(element=>{
  const box=element.getBoundingClientRect(),walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),found=[];let node;
  while(node=walker.nextNode()){
   if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);
   for(const r of range.getClientRects())if(r.width&&(r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1))found.push({text:node.textContent.trim(),left:r.left,right:r.right,controlLeft:box.left,controlRight:box.right});
  }
  return found;
 }));assert.deepEqual(overflow,[],label+' text stays within its own control');
}
