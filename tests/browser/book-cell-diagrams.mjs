import {assertMitoContour} from './book-cell-geometry.mjs';
import assert from 'node:assert/strict';
export async function assertBookCellFigure(wrapper,kind,{onState=null}={}){
 const figure=wrapper.locator('figure');assert.equal(await figure.count(),1);const buttons=figure.getByRole('button'),count=await buttons.count();assert.equal(count,kind==='cell-examples'?3:2);
 const initial=(await buttons.evaluateAll(es=>es.map(e=>e.getAttribute('aria-pressed')==='true'))).findIndex(Boolean);assert(initial>=0);const rows=[];
 for(let index=0;index<count;index++){
  const button=buttons.nth(index);await button.focus();await button.page().keyboard.press('Tab');await button.page().keyboard.press('Shift+Tab');assert(await button.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')));await button.page().keyboard.press('Enter');assert.equal(await button.getAttribute('aria-pressed'),'true');
  const state=await figure.evaluate(root=>({status:root.querySelector('[role=status]').textContent,selected:[...root.querySelectorAll('button')].map(b=>b.getAttribute('aria-pressed')==='true'),svgTexts:[...root.querySelectorAll('svg text')].map(e=>e.textContent),paths:[...root.querySelectorAll('svg path')].map(p=>p.getAttribute('d')),nuclei:root.querySelectorAll('.book-cell-comparison__nucleus').length,dna:root.querySelectorAll('.book-cell-comparison__dna').length,mitochondria:root.querySelectorAll('.book-cell-comparison__mitochondrion').length,facts:root.querySelector('dl')?.textContent??null,crosses:root.querySelector('svg')?.getAttribute('data-membrane-crosses'),matchingProtein:root.querySelectorAll('[data-matching-protein]').length,symbols:root.querySelectorAll('.cell-process-symbol').length,conversionArrows:root.querySelectorAll('[data-energy-conversion-arrows] .cell-process-arrow').length,folds:root.querySelectorAll('.cell-process-fold').length,mitoDNA:root.querySelectorAll('.cell-process-dna').length,genome:root.querySelector('svg')?.getAttribute('data-genome-example')}));
  assert.equal(state.selected.filter(Boolean).length,1);assert(state.selected[index]);assert(state.status.length>30);
  if(kind==='cell-examples'){
   assert.equal(state.nuclei,index===0?2:0);assert.equal(state.dna,index===0?2:index===1?1:0);assert.equal(state.mitochondria,index===0?1:0);assert(state.facts.includes(index===1?'den Prokaryoten':'den Eukaryoten'));if(index===2)assert(state.status.includes('trotzdem zu den Eukaryoten'));
  }else if(kind==='dna-order'){
   assert.deepEqual(state.svgTexts,index===0?['A','T','A','T','T','A','T','A']:['A','T','T','A','A','T','T','A']);assert(state.status.includes('zwei A und zwei T'));
  }else if(kind==='selective-membrane'){
   assert.equal(state.crosses,String(index===1));assert.equal(state.matchingProtein,index);assert.equal(state.symbols,index+1);assert(state.paths.includes(index===0?'M63 90H98':'M63 90H225'));
  }else if(kind==='mitochondrial-conversion'){
   assert.equal(state.conversionArrows,index===1?3:0);assert.equal(state.folds,1);assert.equal(state.mitoDNA,1);await assertMitoContour(figure);if(index===1)assert(state.status.includes('Energie entsteht dabei nicht aus dem Nichts'));
  }else if(kind==='genome-parts'){
   assert.equal(state.genome,index===0?'short':'long');assert.deepEqual(state.svgTexts,index===0?['AT','CG','TA']:['AT','CG','AT','CG','TA']);assert(state.status.startsWith(index===0?'6 gezeichnete Zeichen':'10 gezeichnete Zeichen'));
  }else assert.fail('Unknown cell drawing kind');
  rows.push({...state,kind,index,actualDrawnStructuresAndMeaning:true});if(onState)await onState(index);
 }
 if(await buttons.nth(initial).getAttribute('aria-pressed')!=='true'){await buttons.nth(initial).focus();await buttons.nth(initial).page().keyboard.press('Enter');assert.equal(await buttons.nth(initial).getAttribute('aria-pressed'),'true');}
 return rows;
}
