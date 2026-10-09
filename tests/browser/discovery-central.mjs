import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {DISCOVERY_CONNECTIONS} from '../../app/discovery-data.ts';
import {KNOWLEDGE_CONNECTIONS} from '../../app/knowledge-connections.ts';
const read=async p=>JSON.parse(await fs.readFile(new URL(p,import.meta.url),'utf8'));
const topics=await read('../../app/world-catalog.json'),categories=await read('../../exports/content/world-categories.json');

export async function discoveryCentral(page,ready,report,width,shots){
 const home=async()=>{await page.evaluate(()=>location.hash='globe');await page.locator('.discovery-hero').waitFor();};
 const inspect=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'discovery overflow '+width);
 await home();await inspect();
 for(const image of await page.locator('.discovery-worlds img').all())await image.evaluate(async im=>{await im.decode();if(!im.naturalWidth)throw Error('Undecoded gateway image');});
 await page.locator('.discovery-hero').screenshot({path:shots+'/discovery-hero-'+width+'.png'});
 await page.locator('.discovery-worlds').screenshot({path:shots+'/discovery-worlds-'+width+'.png'});
 // The prominent search must restore focus to its actual opener on Escape.
 const search=page.getByRole('button',{name:'Was möchtest du entdecken?',exact:true});
 await search.focus();await page.keyboard.press('Enter');
 await page.getByRole('dialog').locator('input').fill('Mondphasen');
 await page.getByRole('option').filter({hasText:'Warum verändert der Mond seine Form?'}).waitFor();
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
 assert.equal(await search.evaluate(el=>el===document.activeElement),true,'search focus returns');
 await page.getByRole('button',{name:'Direkt zur interaktiven Weltkugel',exact:true}).click();
 assert.equal(await page.locator('#globe-observatory').evaluate(el=>el===document.activeElement),true);
 assert.ok(await page.locator('#globe-observatory').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<60),'globe scroll target');
 // All six gateways work in both the compact centre and the shared world hub.
 for(const c of categories){
  await home();const gateway=page.locator('.discovery-worlds').getByRole('button',{name:c.title,exact:true});
  if(width===390)await gateway.tap();else await gateway.click();
  await page.getByRole('heading',{name:c.title,exact:true}).waitFor();
  assert.equal(new URL(page.url()).hash,'#world/'+c.id);await inspect();
 }
 await home();await page.getByRole('button',{name:'Alle Welten & Lernrouten',exact:true}).click();
 await page.locator('.world-view .world-choice').first().waitFor();
 assert.equal(await page.locator('.world-view .world-choice').count(),categories.length);
 await inspect();
 await page.locator('.world-view').getByRole('button',{name:categories.at(-1).title,exact:true}).click();
 await page.locator('.world-topic-tile').first().waitFor();
 for(const trail of DISCOVERY_CONNECTIONS){
  const edge=KNOWLEDGE_CONNECTIONS.find(c=>c.id===trail.id),from=topics.find(t=>t.id===edge.fromId),to=topics.find(t=>t.id===edge.toId);
  await home();const network=page.locator('.discovery-network');
  await network.getByRole('button',{name:trail.label,exact:true}).focus();await page.keyboard.press('Enter');
  await network.getByText(edge.why,{exact:true}).waitFor();await inspect();
  const start=network.getByRole('button',{name:from.title,exact:true});
  if(width===390)await start.tap();else await start.click();
  await page.getByRole('heading',{name:from.title,exact:true}).waitFor();
  await page.locator('.connection-card').filter({hasText:edge.why}).getByRole('button').click();
  await page.getByRole('heading',{name:to.title,exact:true}).waitFor();
  await page.locator('.connection-card').filter({hasText:edge.why}).getByRole('button').click();
  await page.getByRole('heading',{name:from.title,exact:true}).waitFor();
  await home();await network.getByRole('button',{name:trail.label,exact:true}).click();
  await network.getByRole('button',{name:/^Lernroute:/}).click();
  assert.equal(new URL(page.url()).hash,'#world/route/'+trail.routeId);
  await page.locator('.world-route-stations').waitFor();
 }
 await home();await page.locator('.discovery-pathways').screenshot({path:shots+'/discovery-pathways-'+width+'.png'});
 await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 const axe=await page.evaluate(async()=>{
  const result=await window.axe.run({include:[['.discovery-hero'],['.discovery-worlds'],['.discovery-pathways']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
  return result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
 });assert.deepEqual(axe,[],'discovery axe '+width);
 await page.getByRole('button',{name:'Wissens-Challenge öffnen',exact:true}).click();
 await page.locator('.challenge-levels').waitFor();
 assert.equal(await page.locator('.challenge-levels button').count(),3);
 await page.locator('.challenge-levels').getByRole('button').filter({hasText:'Leicht'}).click();
 await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.reload();await ready(page);await home();
 await page.getByRole('button',{name:'Fortsetzen',exact:true}).click();
 await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 await page.getByRole('button',{name:'Andere Stufe auswählen',exact:true}).click();
 await page.locator('.challenge-levels').waitFor();
 report.checks.push('Discovery centre '+width+': search/focus/globe, six shared gateways, three reciprocal trails/routes, direct challenge/resume, WCAG axe');
}

export async function offlineDiscoveryCentral(page,report){
 await page.evaluate(()=>location.hash='globe');await page.locator('.discovery-hero').waitFor();
 for(const image of await page.locator('.discovery-worlds img').all())await image.evaluate(async im=>{await im.decode();assertImage(im);function assertImage(im){if(!im.naturalWidth)throw Error('Offline gateway image missing');}});
 await page.locator('.discovery-network').getByRole('button',{name:'Meer in Bewegung',exact:true}).click();
 await page.locator('.discovery-connection-why').getByText(/Gezeiten können Strömungen antreiben/).waitFor();
 await page.getByRole('button',{name:'Wissens-Challenge öffnen',exact:true}).click();await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
 report.checks.push('Cold offline discovery: all gateway photos decode, knowledge trail switches, challenge opens');
}
