import assert from'node:assert/strict';
const kinds=["generation-frequency", "microstructure-examples", "ecosystem-relationships", "decomposition-transfer", "carbon-labelled-paths", "rain-count-versus-amount"];
export async function assertEcologyDrawnState(figure,kind,selected){
 const svg=figure.locator('svg');await svg.scrollIntoViewIfNeeded();await figure.evaluate(async root=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));for(const p of root.querySelectorAll('svg path')){getComputedStyle(p).getPropertyValue('d');p.getBoundingClientRect();}});
 const text=await figure.innerText();
 if(['ecosystem-relationships','carbon-labelled-paths'].includes(kind)){
 const numbered=await figure.locator('ol').evaluate(el=>({style:getComputedStyle(el).listStyleType,position:getComputedStyle(el).listStylePosition,count:el.querySelectorAll('li').length,padding:parseFloat(getComputedStyle(el).paddingLeft)}));assert.equal(numbered.style,'decimal');assert.equal(numbered.position,'outside');assert(numbered.padding>=26);assert.equal(numbered.count,kind==='carbon-labelled-paths'?3:[3,6,7][selected]);
 }
 const boxes=await svg.locator('text').evaluateAll(es=>es.map(e=>{const b=e.getBBox();return{text:e.textContent,x:b.x,y:b.y,w:b.width,h:b.height}}));
 for(const b of boxes){assert(b.x>=0&&b.y>=0&&b.x+b.w<=400&&b.y+b.h<=260,'visible non-clipped SVG glyph '+JSON.stringify(b));}
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'distinct diagram labels do not touch');}
 if(kind==='generation-frequency'){
  assert.equal(await figure.locator('[data-ecology-individual]').count(),8);assert.equal(await figure.locator('[data-ecology-cross]').count(),[2,4,3][selected]);assert.equal(await figure.locator('[data-marked="true"]').count(),[2,4,3][selected]);assert.equal(await figure.locator('[data-ecology-marked-count]').getAttribute('data-ecology-marked-count'),String([2,4,3][selected]));assert(text.includes(['25 Prozent','50 Prozent','37,5 Prozent'][selected]));
  const centers=await figure.locator('[data-ecology-individual] circle').evaluateAll(es=>es.map(e=>({x:e.cx.baseVal.value,y:e.cy.baseVal.value,r:e.r.baseVal.value})));assert.equal(new Set(centers.map(c=>c.x+':'+c.y)).size,8);for(let n=0;n<8;n++)assert.deepEqual(centers[n],{x:70+n%4*80,y:60+Math.floor(n/4)*75,r:23});
 }
 if(kind==='microstructure-examples'){
  assert.equal(await figure.locator('[data-ecology-bacterium-cell]').count(),selected===1?0:1);assert.equal(await figure.locator('[data-ecology-fungal-cell]').count(),selected===0?0:6);
  if(selected!==0){const cells=await figure.locator('[data-ecology-fungal-cell]').evaluateAll(es=>es.map(e=>({x:e.x.baseVal.value,y:e.y.baseVal.value,w:e.width.baseVal.value,h:e.height.baseVal.value})));assert.deepEqual(cells,Array.from({length:6},(_,n)=>({x:145+n*39,y:70,w:39,h:55})));assert(text.includes('sechs gezeichneten Zellräumen'));}
  assert(text.includes('keinen gemeinsamen Größenmaßstab'));assert(text.includes('keine Mikroskopaufnahmen'));
 }
 if(kind==='ecosystem-relationships'){
  const expected=[['plant','animal','fungus'],['plant','animal','fungus','light','water','soil'],['plant','animal','fungus','light','water','soil','dead-material']][selected];assert.deepEqual(await figure.locator('[data-ecology-node]').evaluateAll(es=>es.map(e=>e.dataset.ecologyNode)),expected);
  assert.equal(await figure.locator('[data-ecology-node] circle').count(),3);assert.equal(await figure.locator('[data-ecology-node] rect').count(),[0,3,4][selected]);assert.equal(await figure.locator('[data-ecology-arrow]').count(),selected===2?3:0);assert.deepEqual(await svg.locator('text').allTextContents(),expected.map((_,n)=>String(n+1)));
  if(selected===2){assert.deepEqual(await figure.locator('[data-ecology-arrow]').evaluateAll(es=>es.map(e=>e.dataset.ecologyArrow)),['light-plant','plant-animal','dead-material-fungus']);assert(text.includes('keine Weitergabe von Stoff aus dem Licht'));}
 }
 if(kind==='decomposition-transfer'){
  assert.equal(await figure.locator('[data-ecology-transfer-marker]').count(),12);assert.equal(await figure.locator('[data-location="remaining"]').count(),[12,8,5][selected]);assert.equal(await figure.locator('[data-location="transferred"]').count(),[0,4,7][selected]);assert.equal(await figure.locator('[data-ecology-conserved]').getAttribute('data-ecology-conserved'),'12');
  const markers=await figure.locator('[data-ecology-transfer-marker]').evaluateAll(es=>es.map(e=>{const b=e.getBBox();return{location:e.dataset.location,x:b.x,y:b.y,w:b.width,h:b.height}}));for(const m of markers){assert(m.location==='remaining'?m.x>=15&&m.x+m.w<=190:m.x>=210&&m.x+m.w<=385);assert(m.y>=30&&m.y+m.h<=200);}assert(text.includes('keine Atome, gemessenen Massen oder echten Zeitangaben'));
 }
 if(kind==='carbon-labelled-paths'){
  assert.equal(await figure.locator('[data-ecology-arrow]').count(),1);assert.equal(await figure.locator('[data-ecology-carbon-node]').count(),3);assert.equal(await figure.locator('[data-ecology-arrow]').getAttribute('data-ecology-arrow'),[['air','plant'],['plant','air'],['dead-material','air']][selected].join('-'));
  const points={air:{x:200,y:45},plant:{x:70,y:190},'dead-material':{x:330,y:190}},[from,to]=[['air','plant'],['plant','air'],['dead-material','air']][selected],a=points[from],b=points[to],dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy),actual=await figure.locator('[data-ecology-arrow]').evaluate(e=>{const a=e.getPointAtLength(0),b=e.getPointAtLength(e.getTotalLength());return{ax:a.x,ay:a.y,bx:b.x,by:b.y}});
  assert(Math.abs(actual.ax-(a.x+31*dx/l))<.001&&Math.abs(actual.ay-(a.y+31*dy/l))<.001&&Math.abs(actual.bx-(b.x-31*dx/l))<.001&&Math.abs(actual.by-(b.y-31*dy/l))<.001,'actual clipped arrow has correct direction and endpoints');assert(text.includes(['Fotosynthese','Zellatmung','Zersetzung'][selected]));assert(text.includes('keine Menge oder Geschwindigkeit'));
 }
 if(kind==='rain-count-versus-amount'){
  const expected=selected===0?['A']:selected===1?['B']:['A','B'];assert.equal(await figure.locator('[data-ecology-rain-bar]').count(),expected.length*4);assert.deepEqual(await figure.locator('[data-ecology-day]').allTextContents(),['1','2','3','4']);
  for(const letter of expected){const values=letter==='A'?[10,0,10,0]:[1,0,1,0];for(let n=0;n<4;n++){const bar=figure.locator('[data-ecology-rain-bar="'+letter+'-'+n+'"]');assert.equal(Number(await bar.getAttribute('height')),values[n]*14);assert.equal(Number(await bar.getAttribute('y')),190-values[n]*14);assert.equal(await figure.locator('[data-ecology-rain-value="'+letter+'-'+n+'"]').textContent(),String(values[n]));if(letter==='B')assert.equal(await bar.getAttribute('stroke-dasharray'),'4 3');}assert.equal(await figure.locator('[data-ecology-wet-days="'+letter+'"]').textContent(),'2 Regentage');assert.equal(await figure.locator('[data-ecology-total-mm="'+letter+'"]').textContent(),(letter==='A'?20:2)+' Millimeter');}
  assert(text.includes('Eine Dürrediagnose ist aus diesen vier erfundenen Tagen nicht möglich.'));
 }
 const observedGeometry=await svg.evaluate(el=>[...el.querySelectorAll('circle,rect,path,text')].map(e=>({tag:e.tagName,attributes:[...e.attributes].map(a=>[a.name,a.value])})));return{observedGeometry,svgTexts:await svg.locator('text').allTextContents(),html:await figure.locator('p,li').allTextContents()};
}
export async function assertBookEcologyFigure(figure,kind,{onState=null}={}){
 assert(kinds.includes(kind));const buttons=figure.locator('.book-ecology-choices button');assert.equal(await buttons.count(),3);const initial=await buttons.evaluateAll(es=>es.findIndex(e=>e.getAttribute('aria-pressed')==='true'));assert(initial>=0);const rows=[];
 for(let selected=0;selected<3;selected++){const button=buttons.nth(selected);await button.focus();await button.page().keyboard.press('Tab');await button.page().keyboard.press('Shift+Tab');assert(await button.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')));await button.page().keyboard.press('Enter');const selectedControls=await buttons.evaluateAll(es=>es.map(e=>e.getAttribute('aria-pressed')==='true'));assert.equal(selectedControls.filter(Boolean).length,1);assert(selectedControls[selected]);const actual=await assertEcologyDrawnState(figure,kind,selected);const glyphs=await figure.locator('svg').evaluate(svg=>{const v=svg.viewBox.baseVal;return[...svg.querySelectorAll('text')].map(t=>{const b=t.getBBox();return{text:t.textContent,inside:b.x>=v.x-1&&b.y>=v.y-1&&b.x+b.width<=v.x+v.width+1&&b.y+b.height<=v.y+v.height+1};});});assert(glyphs.every(x=>x.inside));assert(actual.html.at(-1).includes('Eigene Modellzeichnung'));rows.push({kind,selected,selectedControls,...actual,actualDrawnStructuresAndMeaning:true});if(onState)await onState(selected);}
 if(initial!==2){await buttons.nth(initial).focus();await buttons.nth(initial).page().keyboard.press('Enter');}return rows;
}
