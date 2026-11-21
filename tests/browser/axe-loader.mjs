import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
// axe-core kommt aus den Projekt-Abhängigkeiten (package.json, exakt gepinnt).
const require = createRequire(import.meta.url);
export const AXE_FILE = require.resolve('axe-core/axe.min.js');
const version = JSON.parse(readFileSync(require.resolve('axe-core/package.json'), 'utf8')).version;
// Keep every audit. Reuse only the pinned library in this document; a reload
// or another version requires injection again. Let visual mutations paint.
export async function prepareAxe(page){
 if(!await page.evaluate(expected=>window.axe?.version===expected&&typeof window.axe.run==='function',version))await page.addScriptTag({path:AXE_FILE});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
