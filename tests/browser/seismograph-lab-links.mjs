import assert from 'node:assert/strict';
import path from 'node:path';
import {captureNativeViewport} from './native-screenshot.mjs';
import {researchTopicLinks} from '../../app/research-links.ts';
import {RESEARCH_PATHS} from '../../app/research-catalog.ts';

const saveKey='erde-entdecken:save:v3',articleFocus='world-lab-invention-seismograph-quake',labFocus='lab-topic-quake-invention-seismograph';
const reason=researchTopicLinks('quake',RESEARCH_PATHS.quake.topic).find(link=>link.topic==='invention-seismograph')?.why;
const snapshot=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,saveKey);

export async function assertSeismographLabLink(page){
 const link=page.locator('[data-route-focus="'+articleFocus+'"]');
 assert.equal(await link.count(),1,'seismograph offers its explained earthquake-lab connection');
 assert.equal(await link.getAttribute('href'),'#labs/quake');assert.ok(reason);
 await page.locator('.lab-knowledge-connections').getByText(reason,{exact:true}).waitFor();return link;
}

export async function seismographLabRoundTrip(page,{width,shots,engine='chromium',native=false}={}){
 assert.equal(await page.evaluate(()=>location.hash),'#world/topic/invention-seismograph');
 const before=await snapshot(page),link=await assertSeismographLabLink(page);
 const model=page.locator('[data-invention-experiment="seismograph"]');if(!await model.evaluate(e=>e.open))await model.locator(':scope>summary').click();
 await model.getByRole('button',{name:'Boden nach links',exact:true}).click();assert.equal(await model.locator('[data-invention-result]').getAttribute('data-invention-result'),'-1');
 await link.focus();await page.keyboard.press('Enter');await page.locator('#lab-heading').getByText('Erdbeben-Wellen',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>location.hash),'#labs/quake');
 const prior=before.gameSessions['lab:quake'],slider=page.getByRole('slider',{name:/^Tiefe des Herdes:/});if(prior&&Number.isFinite(prior.depth)&&prior.depth>=5&&prior.depth<=40)assert.equal(await slider.getAttribute('aria-valuenow'),String(prior.depth),'link opening retains the existing valid lab state');
 await slider.focus();await page.keyboard.press('End');for(let i=0;i<8;i++)await page.keyboard.press('ArrowLeft');assert.equal(await slider.getAttribute('aria-valuenow'),'32');
 await page.getByRole('button',{name:'Gestein rutschen lassen',exact:true}).click();await page.locator('.quake-waves').waitFor();const labState=(await snapshot(page)).gameSessions['lab:quake'];assert.equal(labState.depth,32);assert.ok(labState.run>0);
 const inverse=page.locator('[data-route-focus="'+labFocus+'"]');assert.equal(await inverse.getAttribute('href'),'#world/topic/invention-seismograph');await inverse.getByText(reason,{exact:true}).waitFor();
 assert.equal(await page.locator('[data-route-focus="lab-topic-quake"]').getAttribute('href'),'#world/topic/science-sound','existing primary sound relation stays reachable');
 if(shots){await inverse.scrollIntoViewIfNeeded();const file=path.join(shots,'seismograph-lab-'+engine+'-'+width+(native?'-native':'')+'.png');if(native)await captureNativeViewport(page,file);else await page.locator('.research-next').screenshot({path:file,animations:'disabled'});}
 await inverse.focus();await page.keyboard.press('Enter');await page.locator('#world-topic-title').getByText('Der Seismograf',{exact:true}).waitFor();const restoredModel=page.locator('[data-invention-experiment="seismograph"]');if(!await restoredModel.evaluate(e=>e.open))await restoredModel.locator(':scope>summary').click();assert.equal(await restoredModel.locator('[data-invention-result]').getAttribute('data-invention-result'),'-1');
 await page.goBack();await page.locator('#lab-heading').waitFor();await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,labFocus);assert.equal(await slider.getAttribute('aria-valuenow'),'32');assert.deepEqual((await snapshot(page)).gameSessions['lab:quake'],labState,'inverse and browser back retain the actual lab session');
 await page.goBack();await page.locator('#world-topic-title').getByText('Der Seismograf',{exact:true}).waitFor();await page.waitForFunction(id=>document.activeElement?.dataset.routeFocus===id,articleFocus);
 await page.reload();await page.locator('[aria-label="Entdeckerpass öffnen"]:not([disabled])').waitFor();await page.locator('[data-invention-experiment="seismograph"]').waitFor();const after=await snapshot(page);
 for(const key of ['notes','favorites','settings'])assert.deepEqual(after[key],before[key],key+' preserved through connected models');for(const key of ['labs','discoveries'])for(const earned of before[key])assert.ok(after[key].includes(earned),'existing earned progress preserved');
 assert.equal(after.gameSessions['topic:invention-seismograph'].inventionExperiment,2);assert.deepEqual(after.gameSessions['lab:quake'],labState,'full reload retains the actual connected lab state');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'connected views reflow');
 return{articleToLab:true,labToArticle:true,bothBrowserBackFocus:true,existingSoundRelation:true,realSessionAndReload:true,protectedProgress:true,depth:32};
}
