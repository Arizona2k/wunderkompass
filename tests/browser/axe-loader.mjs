import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const file=fileURLToPath(new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url));
const version=JSON.parse(readFileSync(new URL('../../qa/node_modules/axe-core/package.json',import.meta.url),'utf8')).version;
// Keep every audit. Reuse only the pinned library in this document; a reload
// or another version requires injection again. Let visual mutations paint.
export async function prepareAxe(page){
 if(!await page.evaluate(expected=>window.axe?.version===expected&&typeof window.axe.run==='function',version))await page.addScriptTag({path:file});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
export async function verifyAxeLoader(page,report){
 const {default:assert}=await import('node:assert/strict');
 await prepareAxe(page);await page.evaluate(()=>window.__qaAxeIdentity=window.axe);await prepareAxe(page);
 assert.equal(await page.evaluate(()=>window.__qaAxeIdentity===window.axe),true,'same pinned document library reused');
 const audit=()=>page.evaluate(async()=>{const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:result.violations.map(v=>v.id),passes:result.passes.length};});
 const clean=await audit();assert.deepEqual(clean.violations,[]);assert.ok(clean.passes>0,'real rules executed');
 const paragraph=page.locator('[data-book-word="Kelvin"] > p');await paragraph.scrollIntoViewIfNeeded();
 const originalStyle=await paragraph.getAttribute('style');
 await paragraph.evaluate(e=>{e.style.setProperty('color','#ddd','important');e.style.setProperty('background-color','#fff','important');const button=document.createElement('button');button.id='qa-axe-defects';button.style.cssText='width:100px!important;height:44px!important';e.after(button);});
 await prepareAxe(page);const bad=await audit();assert.ok(bad.violations.includes('color-contrast'),'painted contrast defect detected with reused library');assert.ok(bad.violations.includes('button-name'),'unnamed button detected with reused library');
 await page.evaluate(()=>document.getElementById('qa-axe-defects').remove());await paragraph.evaluate((e,style)=>style===null?e.removeAttribute('style'):e.setAttribute('style',style),originalStyle);await prepareAxe(page);assert.deepEqual((await audit()).violations,[],'removed defects do not leave stale results');
 await page.reload();assert.equal(await page.evaluate(()=>!!window.axe),false,'new document does not inherit the test library');await prepareAxe(page);assert.equal(await page.evaluate(()=>window.axe.version),version,'reload receives the pinned library');
 report.axeLibraryReuse={version,realRules:clean.passes,reuse:true,contrastDefectCaught:true,unnamedButtonCaught:true,removalRechecked:true,reloadReinjected:true};report.checks.push('Pinned axe reused only in one document; actual contrast and unnamed-button defects detected after paint, removed defects rechecked, reload reinjected');
}
