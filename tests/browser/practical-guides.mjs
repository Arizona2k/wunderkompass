import assert from 'node:assert/strict';

export async function assertPracticalGuide(item,minimum=16){
 const data=await item.evaluate(root=>({
  open:root.open,steps:root.querySelectorAll('.experiment-steps>li').length,
  overflow:document.documentElement.scrollWidth>innerWidth+1,
  issues:[...root.querySelectorAll('p,h3,a,button')].filter(e=>e.checkVisibility()).flatMap(e=>{
   const r=e.getBoundingClientRect(),font=parseFloat(getComputedStyle(e).fontSize),bad=[];
   const walk=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
   while(walk.nextNode()){const n=walk.currentNode;if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);for(const b of range.getClientRects())if(b.left<r.left-1||b.right>r.right+1)bad.push('text escapes '+e.tagName);}
   return [{font,bad,text:e.textContent.slice(0,60)}];
  })
 }));
 assert.equal(data.open,true);assert.equal(data.steps,3);assert.equal(data.overflow,false);
 assert.deepEqual(data.issues.filter(e=>e.font<minimum-.1||e.bad.length),[],'practical instructions retain readable text inside their own surface');
 assert.equal(await item.locator('summary').evaluate(e=>e.getBoundingClientRect().height>=48),true);
 return data;
}
