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

// Read the actual painted colors of essential diagram parts on their real surface.
// A declared SVG fill can be the backdrop even when every CSS background is transparent.
export async function assertMeaningfulGraphicContrast(figure,parts,label){
 const rows=[];
 for(const part of parts){
  const elements=figure.locator(part.selector);assert.equal(await elements.count(),1,label+' '+part.name+' exists once');
  const row=await elements.evaluate((el,part)=>{
   const style=getComputedStyle(el);let surface=el;
   while(surface.parentElement&&['transparent','rgba(0, 0, 0, 0)'].includes(getComputedStyle(surface).backgroundColor))surface=surface.parentElement;
   const backdrop=part.backdropSelector?el.closest('svg').querySelector(part.backdropSelector):null;
   if(part.backdropSelector&&!backdrop)throw Error('Missing declared graphic backdrop');
   let opacity=1;for(let node=el;node;node=node.parentElement)opacity*=Number(getComputedStyle(node).opacity);
   return {part:part.name,color:style[part.paint],background:backdrop?getComputedStyle(backdrop).fill:getComputedStyle(surface).backgroundColor,opacity,paintOpacity:Number(part.paint==='stroke'?style.strokeOpacity:style.fillOpacity)};
  },part);
  const luminance=color=>{const values=color.match(/[\d.]+/g)?.map(Number);assert(values&&(values.length===3||values.length===4&&values[3]===1),'opaque actual computed graphic color');const rgb=values.slice(0,3).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
  assert.equal(row.opacity,1,label+' opaque diagram ancestors');assert.equal(row.paintOpacity,1,label+' opaque graphic paint');const[a,b]=[row.color,row.background].map(luminance);row.contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert(row.contrast>=3,label+' '+row.part+' meaningful graphic contrast at least3:1: '+row.contrast);rows.push(row);
 }
 return rows;
}
