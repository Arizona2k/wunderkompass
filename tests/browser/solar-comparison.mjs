import assert from 'node:assert/strict';
import path from 'node:path';
import {prepareAxe} from './axe-loader.mjs';
// Existing diameter ratios are unchanged. Distance oracle: the actually reviewed NASA table, in million km, converted with the exact AU.
const planets=[['Merkur',.383,57.9],['Venus',.949,108.2],['Erde',1,149.6],['Mars',.532,228],['Jupiter',11.21,778.5],['Saturn',9.45,1432],['Uranus',4.01,2867],['Neptun',3.88,4515]].map(([name,diameter,millionKm])=>[name,diameter,millionKm*1_000_000/149597870.7]);
const maximumDistance=4515*1_000_000/149597870.7;
const de=n=>n.toLocaleString('de-DE',{maximumFractionDigits:3});
async function readable(root,state){
 const actual=await root.locator('.planet-size-key p,.planet-size-comparison figcaption,.planet-distance-chart>div>span,.planet-distance-chart strong,.planet-distance-chart>p').evaluateAll(elements=>elements.filter(e=>e.getClientRects().length).map(e=>{
  const b=e.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(e);return {text:e.textContent,font:parseFloat(getComputedStyle(e).fontSize),overflow:e.scrollWidth>e.clientWidth+2,bounds:[...range.getClientRects()].some(r=>r.left<b.left-2||r.right>b.right+2||r.left< -2||r.right>innerWidth+2)};
 }));assert.ok(actual.length>=3,'real visible labels, not only an alternative text');for(const item of actual){assert.ok(item.font>=(state==='large'?18:16),item.text+' respects normal/large readable text size');assert.equal(item.overflow,false,item.text+' no hidden text overflow');assert.equal(item.bounds,false,item.text+' every rendered text line within its container and viewport');}
 assert.equal(await root.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'no horizontal page overflow');
 for(const b of await root.locator('button').all()){const r=await b.boundingBox();assert.ok(r.height>=44&&r.width>=44,'solar control touch target');}
}
export async function exerciseSolar(p,{width,state='normal',shots,capture}={}){
 await p.evaluate(()=>location.hash='world/topic/science-solar-system');const root=p.locator('.model-solar-system');await root.waitFor();const observed=[];
 for(const mode of ['diameters','distances']){
  await root.getByRole('button',{name:mode==='diameters'?'Durchmesser vergleichen':'Sonnenabstände vergleichen',exact:true}).click();
  for(const [name,diameter,distance]of planets){
   const button=root.getByRole('button',{name,exact:true});await button.focus();await p.keyboard.press('Enter');assert.equal(await button.getAttribute('aria-pressed'),'true');
   if(mode==='diameters'){
    const fig=root.locator('.planet-size-comparison');await fig.waitFor();assert.equal(await fig.locator('svg text').count(),0,'scaled SVG words cannot silently clip again');
    assert.deepEqual(await fig.locator('.planet-size-key p').allTextContents(),['Erde · 1',name+' · '+de(diameter)]);
    await fig.locator('figcaption').getByText('Einheit: Erddurchmesser. Beim Saturn zählt der Planet ohne Ringe.',{exact:true}).waitFor();
    const diagram=await fig.locator('svg').evaluate(svg=>{const v=svg.viewBox.baseVal,c=[...svg.querySelectorAll('circle')];return {ratio:Number(c[1].getAttribute('r'))/Number(c[0].getAttribute('r')),contained:[...svg.querySelectorAll('circle,ellipse')].every(e=>{const r=e.getBBox(),stroke=Number(e.getAttribute('stroke-width')??0)/2;return r.x-stroke>=v.x&&r.x+r.width+stroke<=v.x+v.width&&r.y-stroke>=v.y&&r.y+r.height+stroke<=v.y+v.height;}),alternative:svg.getAttribute('aria-label')};});
    assert.ok(Math.abs(diagram.ratio-diameter)<1e-10,name+' original equal diameter scale');assert.equal(diagram.contained,true,name+' entire planet/ring drawing inside SVG');assert.equal(diagram.alternative,`Durchmesser im selben Maßstab: Erde 1, ${name} ${de(diameter)} Erddurchmesser. Abstand der Kreise ohne Bedeutung.`,'original alternative text retained');
    await root.locator('.model-result').getByText(`${name}: ${de(diameter)}-mal der Erddurchmesser.`,{exact:true}).waitFor();
   }else{
    const chart=root.locator('.planet-distance-chart');assert.equal(await chart.locator(':scope > div').count(),8);const row=chart.locator(':scope > div').filter({has:p.getByText(name,{exact:true})});assert.equal(await row.locator('strong').innerText(),de(distance)+' AE');
    const position=await row.locator('.distance-track>span').evaluate(e=>parseFloat(e.style.left));assert.ok(Math.abs(position-distance/maximumDistance*100)<0.0001,'same linear construction with the defined NASA distance source; CSSOM percentage rounding only: '+position+' vs '+distance/maximumDistance*100);
    await root.locator('.model-result').getByText(`${name}: mittlere Bahnentfernung ${de(distance)} AE.`,{exact:true}).waitFor();
   }
   await readable(root,state);observed.push({width,state,planet:name,mode,readableHTML:true,geometry:true,originalScale:true,scaleMeaning:mode==='diameters'?'Unchanged original diameter ratios':'Unchanged linear construction with newly unified NASA distance inputs',distanceAU:distance,distanceMaximumAU:maximumDistance,keyboard:true});
   if(shots&&((mode==='diameters'&&name==='Jupiter')||(mode==='distances'&&name==='Neptun'))){const file=path.join(shots,'solar-caption-'+mode+'-'+state+'-'+width+'.png');await root.locator(mode==='diameters'?'.planet-size-comparison':'.planet-distance-chart').scrollIntoViewIfNeeded();if(capture)await capture(file);else await root.screenshot({path:file,animations:'disabled'});}
  }
  await prepareAxe(p);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.model-solar-system',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[],'solar comparison axe');
 }
 const notes=root.locator('.planet-distance-notes');await notes.locator('summary').focus();await p.keyboard.press('Enter');assert.equal(await notes.evaluate(el=>el.open),true,'source and unit explanation opens by keyboard');
 await notes.getByText('1 AE ist genau 149.597.870,7 Kilometer.',{exact:false}).waitFor();
 assert.deepEqual((await notes.locator('a').evaluateAll(links=>links.map(a=>a.href))).sort(),['https://nssdc.gsfc.nasa.gov/planetary/factsheet/','https://nssdc.gsfc.nasa.gov/planetary/factsheet/fact_notes.html','https://ssd.jpl.nasa.gov/astro_par.html'].sort(),'actual primary distance/definition/unit sources remain reachable as links');
 const noteText=await notes.locator('summary,p').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);return{font:parseFloat(getComputedStyle(el).fontSize),overflow:el.scrollWidth>el.clientWidth+2,outside:[...range.getClientRects()].some(x=>x.left<r.left-2||x.right>r.right+2||x.left< -2||x.right>innerWidth+2)};}));
 for(const item of noteText){assert(item.font>=(state==='large'?18:16),'unit/source explanation remains readable');assert.equal(item.overflow,false);assert.equal(item.outside,false);}
 assert.deepEqual(await p.evaluate(async()=>(await window.axe.run('.model-solar-system',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)),[],'open solar unit/source notes contrast and accessibility');await notes.locator('summary').focus();await p.keyboard.press('Enter');assert.equal(await notes.evaluate(el=>el.open),false);
 return observed;
}
export async function solarFlow(browser,base,ready,monitor,report,shots,{widths=[320,360,390,402,768,1024,1440,1920]}={}){
 const observed=[],started=performance.now();
 for(const width of widths){const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<=402,reducedMotion:'reduce'}),p=await c.newPage();monitor(p);
  try{await p.goto(base+'#world/topic/science-solar-system');await ready(p);for(const state of ['normal','large']){if(state==='large')await p.evaluate(()=>document.querySelector('.earth-app').classList.add('large-reading'));observed.push(...await exerciseSolar(p,{width,state,shots}));}if(width===320){const root=p.locator('.model-solar-system');await root.getByRole('button',{name:'Durchmesser vergleichen',exact:true}).click();const caption=root.locator('figcaption'),original=await caption.getAttribute('style');await caption.evaluate(e=>{e.style.whiteSpace='nowrap';e.style.overflow='hidden';});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'injected caption clipping remains invisible to page overflow alone');await assert.rejects(readable(root,'large'),/no hidden text overflow|every rendered text line/);await root.screenshot({path:path.join(shots,'solar-caption-negative-320.png'),animations:'disabled'});await caption.evaluate((e,style)=>style===null?e.removeAttribute('style'):e.setAttribute('style',style),original);await readable(root,'large');report.solarClippingGuard=true;}console.log('Solar labels',width,'8 planets/2 scales/normal+large passed');}
  catch(error){await p.screenshot({path:path.join(shots,'solar-caption-failure-'+width+'.png'),fullPage:true,timeout:6500}).catch(()=>{});throw error;}finally{await c.close();}
 }
 report.solarCaptionCoverage={observed,seconds:(performance.now()-started)/1000,axe:true,clippingGuard:report.solarClippingGuard===true};report.checks.push('Solar caption regression: all8 planets, unchanged diameter ratios and the shared-source linear distance scale, normal/large HTML labels, every text line inside bounds, keyboard and axe at'+widths.join('/'));
}

export async function offlineSolar(p,report){report.solarOffline={coldRestart:true,observed:await exerciseSolar(p,{width:1280,state:'offline'})};report.checks.push('All8 planet ratios, both solar caption modes and readable units work after actual stopped-server cold offline restart');}
