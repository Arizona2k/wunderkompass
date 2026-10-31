import assert from 'node:assert/strict';
export async function assertEnzymeEndpoints(figure){
 // A committed d attribute can precede the browser's rendered path geometry.
 // Observe the actual next paint and any finite SVG transition, then keep
 // exactly the same independently sampled endpoint and barrier assertions.
 await figure.locator('svg').evaluate(async svg=>{
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  await Promise.all([...svg.querySelectorAll('path')].flatMap(p=>p.getAnimations()).filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));
 });
 const s=await figure.evaluate(root=>{const svg=root.querySelector('svg'),sample=selector=>{const p=svg.querySelector(selector),n=p.getTotalLength(),points=Array.from({length:201},(_,i)=>{const r=p.getPointAtLength(n*i/200);return{x:r.x,y:r.y};});return{first:points[0],last:points.at(-1),minimumY:Math.min(...points.map(p=>p.y))};};return{selected:sample('.gene-path'),reference:sample('.gene-reference'),withEnzyme:svg.dataset.enzymeRoute==='with'};});
 for(const end of['first','last'])for(const axis of['x','y'])assert(Math.abs(s.selected[end][axis]-s.reference[end][axis])<.01,'enzyme and reference must have the same start and end');
 if(s.withEnzyme){assert(s.selected.minimumY>s.reference.minimumY+10,'lower activation barrier is actually drawn: '+JSON.stringify(s));assert(s.selected.minimumY<s.selected.first.y-10,'positive barrier still exists: '+JSON.stringify(s));}else assert(Math.abs(s.selected.minimumY-s.reference.minimumY)<.01,'same unassisted path: '+JSON.stringify(s));
 return s;
}
export async function assertBookGeneFigure(wrapper,kind,{onState=null}={}){
 const figure=wrapper.locator('figure');assert.equal(await figure.count(),1);
 const counts={'gene-output':2,'chromosome-cycle':3,'protein-roles':2,'enzyme-barrier':2,'sequence-change':2,'nucleotide-parts':2,'rna-roles':3,'bacteria-forms':3,'gene-context':2};assert(Object.hasOwn(counts,kind));
 const buttons=figure.getByRole('button');assert.equal(await buttons.count(),counts[kind]);const initial=(await buttons.evaluateAll(es=>es.map(e=>e.getAttribute('aria-pressed')==='true'))).findIndex(Boolean);assert(initial>=0);const rows=[];
 for(let index=0;index<counts[kind];index++){
  const button=buttons.nth(index);await button.focus();await button.page().keyboard.press('Tab');await button.page().keyboard.press('Shift+Tab');assert(await button.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')));await button.page().keyboard.press('Enter');assert.equal(await button.getAttribute('aria-pressed'),'true');
  const state=await figure.evaluate(root=>({status:root.querySelector('[role=status]').textContent,selected:[...root.querySelectorAll('button')].map(b=>b.getAttribute('aria-pressed')==='true'),svgTexts:[...root.querySelectorAll('svg text')].map(e=>e.textContent),facts:[...root.querySelectorAll('dd')].map(e=>e.textContent),routeTitles:[...root.querySelectorAll('.book-gene-route strong')].map(e=>e.textContent),list:[...root.querySelectorAll(':scope>ol:not(.book-gene-route)>li')].map(e=>e.textContent),strips:[...root.querySelectorAll('.book-gene-strip')].map(e=>[...e.children].map(c=>({text:c.textContent,changed:c.getAttribute('data-different')==='true'}))),chromosome:root.querySelector('svg')?.dataset.chromosomeStage,bacteria:root.querySelector('svg')?.dataset.bacteriaForm,rods:root.querySelectorAll('svg rect.gene-form').length,dnaMolecules:root.querySelectorAll('svg .gene-path').length,sisterConnections:root.querySelectorAll('[data-sister-connection]').length,shapes:root.querySelector('svg')?[...root.querySelector('svg').children].filter(e=>['circle','rect','path'].includes(e.localName)).map(e=>e.localName):[]}));
  assert.equal(state.selected.filter(Boolean).length,1);assert(state.selected[index]);assert(state.status.length>30);
  if(kind==='gene-output'){
   assert.deepEqual(state.svgTexts,['Gen']);assert.deepEqual(state.routeTitles,['DNA-Abschnitt','RNA',index===0?'Protein':'Aufgabe der RNA']);assert(state.status.includes(index===0?'anschließend ein Protein':'RNA mit eigener Aufgabe'));
  }else if(kind==='chromosome-cycle'){
   assert.deepEqual(state.facts,[['1','1','1'],['1','2','2'],['2','2','2']][index]);assert.equal(state.rods,index===0?1:2);assert.equal(state.dnaMolecules,index===0?1:2);assert.equal(state.sisterConnections,index===1?1:0);assert.equal(state.chromosome,['before','copied','separated'][index]);
  }else if(kind==='protein-roles'){
   assert(state.status.includes(index===0?'Strukturprotein':'Enzymprotein'));const circles=await figure.locator('svg circle').count();assert.equal(circles,index===0?18:10);
  }else if(kind==='enzyme-barrier')state.independentDrawnEnergy=await assertEnzymeEndpoints(figure);
  else if(kind==='sequence-change'){
   assert.equal(state.strips.length,2);assert.equal(state.strips[0].map(c=>c.text).join(''),'ATCG');assert.equal(state.strips[1].map(c=>c.text).join(''),index===0?'ATCG':'ATGG');assert.deepEqual(state.strips[1].flatMap((c,i)=>c.changed?[i]:[]),index===0?[]:[2]);assert(state.status.includes('nicht bestimmbar'));
  }else if(kind==='nucleotide-parts'){
   assert.deepEqual(state.svgTexts,['1','2','3']);assert(state.list[1].includes(index===0?'Desoxyribose':'Ribose'));assert(state.list[2].includes(index===0?'A, T, C, G':'A, U, C, G'));assert(state.status.includes('eine dieser Basen'));
  }else if(kind==='rna-roles'){
   assert.deepEqual(state.svgTexts,['1','2','3']);assert(state.status.startsWith(['mRNA','rRNA','tRNA'][index]));
  }else if(kind==='bacteria-forms'){
   assert.equal(state.bacteria,String(index));assert.deepEqual(state.shapes,[['circle'],['rect'],['path']][index]);assert(state.status.includes('weder die Art noch ihre mögliche Wirkung'));
  }else if(kind==='gene-context'){
   assert.deepEqual(state.routeTitles,index===0?['Ein Genabschnitt']:['Ein Genabschnitt','Nutzung in Zellen','Weitere Einflüsse']);assert(state.status.includes(index===0?'nicht aus':'keinen einzelnen Einfluss'));
  }
  const svg=figure.locator('svg');if(await svg.count())assert.equal(await svg.evaluate(svg=>{const vb=svg.viewBox.baseVal;return[...svg.querySelectorAll('text')].every(t=>{const r=t.getBBox();return r.x>=vb.x-1&&r.y>=vb.y-1&&r.x+r.width<=vb.x+vb.width+1&&r.y+r.height<=vb.y+vb.height+1;});}),true,'actual SVG glyph bounds stay inside viewBox');
  rows.push({...state,kind,index,actualDrawnStructuresAndMeaning:true});if(onState)await onState(index);
 }
 if(await buttons.nth(initial).getAttribute('aria-pressed')!=='true'){await buttons.nth(initial).focus();await buttons.nth(initial).page().keyboard.press('Enter');assert.equal(await buttons.nth(initial).getAttribute('aria-pressed'),'true');}
 return rows;
}
