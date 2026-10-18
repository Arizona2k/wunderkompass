import assert from 'node:assert/strict';
import {INVENTION_EXPERIMENTS} from '../../app/invention-experiment-contract.mjs';

export async function exerciseInventionExperiment(page,card,topic){
 const kind=topic.invention.model;if(!kind)return null;
 const root=card.locator('[data-invention-experiment="'+kind+'"]');await root.waitFor({state:'attached'});if(!await root.evaluate(e=>e.open))await root.locator(':scope > summary').click();
 const status=root.locator('[data-invention-result]'),states=[],visuals=[];
 const observe=async expected=>{await page.waitForFunction(({kind,expected})=>document.querySelector('[data-invention-experiment="'+kind+'"] [data-invention-result]')?.getAttribute('data-invention-result')===String(expected),{kind,expected});const actual=Number(await status.getAttribute('data-invention-result'));states.push(actual);assert.equal(actual,expected);};
 const activate=async button=>{await button.focus();await page.keyboard.press('Enter');};
 if(kind==='generator'){
  for(const [name,state]of[['Anhalten',0],['Hineinbewegen',1],['Herausbewegen',2]]){await activate(root.getByRole('button',{name,exact:true}));await observe(state);visuals.push(await root.locator('svg path').first().getAttribute('d'));}
  assert.equal(new Set(visuals).size,3,'the actual needle changes with all three induction states');await status.getByText(/Momentaufnahme beim Herausbewegen/).waitFor();await activate(root.getByRole('button',{name:'Anhalten',exact:true}));await observe(0);await status.getByText(/keinen dauernden Strom/).waitFor();
 }else if(kind==='transistor'){
  const power=root.getByRole('button',{name:/^Versorgung /}),signal=root.getByRole('button',{name:/^Steuersignal /});
  for(const button of[power,signal])if(await button.getAttribute('aria-pressed')==='true')await activate(button);await observe(0);const off=await root.locator('svg circle').getAttribute('fill');
  await activate(signal);await observe(1);await status.getByText(/Versorgung fehlt/).waitFor();assert.equal(await root.locator('svg circle').getAttribute('fill'),off,'input alone never powers the output');
  await activate(power);await observe(3);const on=await root.locator('svg circle').getAttribute('fill');assert.notEqual(on,off,'both inputs change the actual lamp');
  await activate(signal);await observe(2);assert.equal(await root.locator('svg circle').getAttribute('fill'),off,'power alone leaves the controlled output off');await activate(power);await observe(0);
 }else if(kind==='layers'){
  const back=root.getByRole('button',{name:'Eine Schicht zurück',exact:true}),up=root.getByRole('button',{name:'Eine Schicht aufbauen',exact:true}),cut=root.getByRole('button',{name:/^Mittlere Schicht /});
  while(!await back.isDisabled())await activate(back);if(await cut.getAttribute('aria-pressed')==='true')await activate(cut);await observe(0);assert.equal(await root.locator('svg [data-layer]').count(),0);
  for(const n of[1,2,3]){await activate(up);await observe(n);assert.equal(await root.locator('svg [data-layer]').count(),n);}assert.equal(await up.isDisabled(),true);
  const before=await root.locator('svg rect').count();await activate(cut);assert.equal(await status.getAttribute('data-invention-cut'),'true');assert.equal(await root.locator('svg rect').count(),before-1,'middle rectangle is actually replaced with separated parts');await status.getByText(/Gesamtform ist verändert/).waitFor();
 }else if(kind==='resolution'){
  for(const n of[1,2,3]){await activate(root.getByRole('button',{name:'Bildgröße '+n,exact:true}));await observe(n);visuals.push(await root.locator('svg g[filter]').getAttribute('transform'));}
  assert.equal(new Set(visuals).size,3,'the actual blurred group is scaled, not replaced by sharper geometry');const filter=await root.locator('svg g[filter]').getAttribute('filter');assert.ok(filter.startsWith('url(#'));assert.equal(await root.locator('svg filter feGaussianBlur').count(),1);await status.getByText(/neue Bildinformation wird nicht berechnet/).waitFor();
 }else if(kind==='aperture'){
  await activate(root.getByRole('button',{name:'Kleine Öffnung',exact:true}));await observe(0);const small=Number(await status.getAttribute('data-invention-points')),radius=Number(await root.locator('svg circle').first().getAttribute('r'));
  await activate(root.getByRole('button',{name:'Große Öffnung',exact:true}));await observe(1);const large=Number(await status.getAttribute('data-invention-points'));assert.ok(Number.isInteger(small)&&small>0&&large>small);assert.ok(Number(await root.locator('svg circle').first().getAttribute('r'))>radius);assert.equal(await root.locator('svg circle').count(),82,'the same81 source points plus aperture remain');await status.getByText(/Stern selbst wird dadurch nicht heller oder näher/).waitFor();
 }else if(kind==='seismograph'){
  const offsets=[];for(const[name,state]of[['Ausgangslage',0],['Boden nach rechts',1],['Boden nach links',-1]]){await activate(root.getByRole('button',{name,exact:true}));await observe(state);const transform=await root.locator('svg > g').getAttribute('transform');offsets.push(Number(transform.match(/translate\(([-\d.]+)/)[1]));assert.equal(await root.locator('svg > circle').getAttribute('cx'),'270','initial mass reference stays fixed during the qualitative comparison');}
  assert.equal(offsets[0],0);assert.ok(offsets[1]>0&&offsets[2]<0);assert.equal(offsets[1],-offsets[2]);await status.getByText(/Gehäuse folgt dem Boden nach links/).waitFor();
 }else throw Error('No actual browser exercise for '+kind);
 const unique=[...new Set(states)].sort((a,b)=>a-b);assert.deepEqual(unique,INVENTION_EXPERIMENTS[kind].states,'all qualitative states actually observed');
 return {id:topic.id,kind,width:await page.evaluate(()=>innerWidth),states:unique,effectsVerified:true};
}
