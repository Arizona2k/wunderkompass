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
