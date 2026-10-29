import assert from 'node:assert/strict';

export async function assertBookWaterFigure(figure,kind,{onState=null}={}){
 const controls=figure.locator('.visual-choice button'),count=await controls.count(),states=[];
 assert.equal(count,{'molecule-pairs':2,'surface-support':2,'mass-volume':3,'limited-capillary':0,'ship-displacement':0}[kind]);
 for(let selected=0;selected<Math.max(1,count);selected++){
  if(count){await controls.nth(selected).focus();await figure.page().keyboard.press('Enter');assert.equal(await controls.nth(selected).getAttribute('aria-pressed'),'true');}
  await figure.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
  if(kind==='molecule-pairs'){
   assert.equal(await figure.locator('[data-water-symbol]').count(),6,'changing the highlighted relationship preserves the water symbols');
   assert.equal(await figure.locator('[data-water-pair="water-water"]').count(),selected===0?4:0);
   assert.equal(await figure.locator('[data-water-pair="water-wall"]').count(),selected===1?2:0);
   const connections=await figure.locator('[data-water-pair]').evaluateAll(es=>es.map(e=>{const a=e.getPointAtLength(0),b=e.getPointAtLength(e.getTotalLength());return[a.x,a.y,b.x,b.y];}));
   for(const [x,y,endX,endY]of connections){assert.equal(y,endY);assert(selected===0?[85,140].includes(x)&&endX-x===55:x===195&&endX===267,'actual lines join the intended water pair or wall');}
  }
  if(kind==='surface-support'){
   const shape=await figure.locator('[data-water-thought-object]').evaluate(e=>({cx:e.cx.baseVal.value,cy:e.cy.baseVal.value,rx:e.rx.baseVal.value,ry:e.ry.baseVal.value}));
   assert.deepEqual(shape,{cx:160,cy:selected===0?70:120,rx:38,ry:5},'same object changes its contact with the interface, not its dimensions');
   await figure.getByRole('status').getByText(selected===0?/Kontakt mit der Wasser-Luft-Grenzfläche/:/vollständig unterhalb/).waitFor();
  }
  if(kind==='limited-capillary'){
   const boxes=await figure.locator('[data-water-capillary]').evaluateAll(es=>es.map(e=>{const b=e.getBBox();return{x:b.x,y:b.y,width:b.width,bottom:b.y+b.height};}));
   assert.equal(boxes.length,2);assert(boxes[0].width<boxes[1].width&&boxes[0].y<boxes[1].y&&boxes.every(b=>b.y>20&&b.y<115&&b.bottom===165),'same reservoir, narrower tube, higher but bounded liquid');
  }
  if(kind==='mass-volume'){
   const expected=[[[2,2],[4,2]],[[4,2],[4,4]],[[4,2],[6,6]]][selected];
   const bodies=await figure.locator('[data-water-density-body]').evaluateAll(es=>es.map(e=>({mass:Number(e.dataset.mass),volume:Number(e.dataset.volume),actualUnits:e.querySelectorAll('rect').length})));
   assert.deepEqual(bodies,expected.map(([mass,volume])=>({mass,volume,actualUnits:volume})),'actual drawn volume agrees with each mass/volume pair');
   const [a,b]=bodies;assert(selected===0?a.volume===b.volume&&a.mass/a.volume<b.mass/b.volume:selected===1?a.mass===b.mass&&a.mass/a.volume>b.mass/b.volume:a.mass<b.mass&&a.volume<b.volume&&a.mass/a.volume>b.mass/b.volume,'density follows the ratio rather than larger mass or larger shape');
   const status=await figure.getByRole('status').innerText();assert(status.includes(`${a.mass} Masseneinheiten in ${a.volume} Volumeneinheiten → ${a.mass/a.volume}`)&&status.includes(`B: ${b.mass} in ${b.volume} → ${b.mass/b.volume}`));
  }
  if(kind==='ship-displacement'){
   const shape=await figure.locator('[data-water-shape]').evaluateAll(es=>es.map(e=>({fill:e.getAttribute('fill'),box:{x:e.getBBox().x,width:e.getBBox().width}})));
   assert.equal(shape.length,2);assert.equal(shape[0].fill,shape[1].fill);assert(shape[0].box.x+shape[0].box.width<shape[1].box.x);
   assert.equal(await figure.locator('[data-water-interior][fill="none"]').count(),1);await figure.getByText(/ohne Massenzahlen, Maßstab, Wasserstand oder zugesicherte Schwimmlage/).waitFor();
  }
  const escaped=await figure.locator('svg').evaluate(e=>{const v=e.viewBox.baseVal;return [...e.querySelectorAll('path,rect,circle,ellipse')].flatMap(el=>{const b=el.getBBox();return b.x<v.x-1||b.y<v.y-1||b.x+b.width>v.x+v.width+1||b.y+b.height>v.y+v.height+1?[el.outerHTML.slice(0,160)]:[];});});assert.deepEqual(escaped,[],'learning geometry stays inside the actual viewBox');
  if(onState)await onState(selected);states.push({kind,selected,keyboard:count>0,semanticGeometry:true});
 }
 if(count){await controls.first().focus();await figure.page().keyboard.press('Enter');}
 return states;
}
