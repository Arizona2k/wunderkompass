import assert from 'node:assert/strict';
import {natureLegendMode} from '../../scripts/nature-learning-evidence.mjs';

// Read the actual authored representation: five numbered families and three
// colour/shape-key families. No SVG glyph is invented for an unnumbered model.
export async function readNatureLegend(figure,id,{large=false}={}){
 const mode=natureLegendMode(id),list=figure.locator(':scope > ol,:scope > ul');assert.equal(await list.count(),1);assert(await list.isVisible(),'actual Nature HTML legend is visible');
 const actual=await list.evaluate(list=>{
  const style=getComputedStyle(list),items=[...list.querySelectorAll(':scope > li')].map(li=>{const s=getComputedStyle(li),m=getComputedStyle(li,'::marker'),font=parseFloat(s.fontSize),markerFont=parseFloat(m.fontSize),color=m.color||s.color,content=m.content||'normal';return{text:li.textContent.trim(),font,markerFont:Number.isFinite(markerFont)?markerFont:font,markerMetricBasis:Number.isFinite(markerFont)?'computed-pseudo':'inherited-list-font',markerVisible:s.listStyleType!=='none'&&m.display!=='none'&&m.visibility!=='hidden'&&parseFloat(m.opacity||'1')>0&&color!=='transparent'&&!/rgba\([^)]*,\s*0\)$|\/\s*0\)$/.test(color)&&!['none','""',"''"].includes(content)};});
  return{tag:list.tagName,visible:list.getClientRects().length>0&&style.display!=='none'&&style.visibility!=='hidden'&&parseFloat(style.opacity)>0,style:style.listStyleType,items};
 });
 actual.mode=mode;assert.equal(actual.tag,mode==='numbered'?'OL':'UL');assert(actual.visible&&actual.items.length>0);assert(actual.items.every(item=>item.text&&item.font>=(large?20:16)&&item.markerFont>=(large?20:16)&&item.markerVisible),'all actual Nature key items and markers retain full reading size and visibility');return actual;
}
