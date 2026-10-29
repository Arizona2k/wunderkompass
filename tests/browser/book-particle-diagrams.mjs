import assert from 'node:assert/strict';

export async function assertBookParticleFigure(figure,kind,{term,onState=null}={}){
 const specifications={
  'atom-regions':[],
  'isotope-counts':term==='Neutron'?[[1,0],[1,1],[1,2]]:[[6,6],[6,7]],
  'element-identity':[[6,6,6],[6,7,6],[6,6,5],[7,6,6]],
  'ion-charge':[[6,6,6],[6,6,5]]
 },expected=specifications[kind];assert(expected);
 const controls=figure.locator('.visual-choice button'),count=await controls.count(),states=[];assert.equal(count,expected.length);
 for(let selected=0;selected<Math.max(1,count);selected++){
  if(count){await controls.nth(selected).click();assert.equal(await controls.nth(selected).getAttribute('aria-pressed'),'true');await controls.nth(selected).focus();await figure.page().keyboard.press('Enter');assert.equal(await controls.nth(selected).getAttribute('aria-pressed'),'true');}
  await figure.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
  const rows=await figure.locator('[data-particle-row]').evaluateAll(es=>es.map(e=>({name:e.getAttribute('data-particle-row'),count:Number(e.getAttribute('data-count')),symbols:e.querySelectorAll('[data-particle-symbol]').length})));
  const target=expected[selected]??[];assert.deepEqual(rows.map(r=>r.symbols),target,'actual drawn particle counts match independent state specification');assert.deepEqual(rows.map(r=>r.count),target);assert.deepEqual(rows.map(r=>r.name),target.length===3?['p','n','e']:target.length===2?['p','n']:[]);
  const drawnRows=await figure.locator('[data-particle-row]').evaluateAll(rows=>rows.map(row=>[...row.querySelectorAll('[data-particle-symbol]')].map(symbol=>{const b=symbol.getBBox();return{x:b.x,width:b.width,center:b.x+b.width/2};})));
  for(const row of drawnRows)if(row.length){assert(Math.abs(row.reduce((sum,b)=>sum+b.center,0)/row.length-160)<1,'symbols stay centered within the counting frame');for(let i=1;i<row.length;i++)assert(row[i].x>row[i-1].x+row[i-1].width,'drawn symbols remain separated for counting');}
  if(kind==='atom-regions'){assert.equal(await figure.locator('[data-particle-region="envelope"]').count(),1);assert.equal(await figure.locator('[data-particle-region="nucleus"]').count(),1);}
  if(target.length){const status=await figure.getByRole('status').innerText();assert(status.includes(String(target[0])+' Proton')&&status.includes(String(target[1])+' Neutron'));if(target.length===3){assert(status.includes(String(target[2])+' Elektronen'));assert((target[0]===target[2])?status.includes('gleichen sich aus'):status.includes('positiv geladen'));}else assert(status.includes('Summe ist '+(target[0]+target[1])));}
  const geometry=await figure.locator('svg').evaluate(e=>{const v=e.viewBox.baseVal;return[...e.querySelectorAll('path,circle')].flatMap(shape=>{const b=shape.getBBox();return b.x<v.x-1||b.y<v.y-1||b.x+b.width>v.x+v.width+1||b.y+b.height>v.y+v.height+1?[shape.outerHTML.slice(0,160)]:[];});});assert.deepEqual(geometry,[],'actual geometry remains inside its viewBox');assert.equal(await figure.locator('svg text').count(),0,'all explanatory labels are normal HTML');
  if(onState)await onState(selected);states.push({kind,selected,keyboard:count>0,actualMouseActivation:count>0,semanticGeometry:true});
 }
 if(count){await controls.first().focus();await figure.page().keyboard.press('Enter');}
 return states;
}
