// Screenshots der Stilproben nach .qa-output/stilproben/ (nicht in Git).
// Aufruf: node docs/entwurf/2026-11-25-stilproben/aufnahmen.mjs [scale] [breiten]   z. B. "2" oder "1 320,390,768,1280,1440"
// Nur einzelne Seiten: NUR=c-start,c-spiel node …
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../..');
const {chromium} = createRequire(path.join(ROOT, 'package.json'))('playwright');
const scale = Number(process.argv[2] ?? 1);
const breiten = (process.argv[3] ?? '390,1280').split(',').map(Number);
const OUT = path.join(ROOT, '.qa-output/stilproben', scale > 1 ? '2x' : '');
fs.mkdirSync(OUT, {recursive: true});

const browser = await chromium.launch();
for (const b of breiten) {
  const ctx = await browser.newContext({viewport: {width: b, height: b < 900 ? 844 : 800}, deviceScaleFactor: scale, reducedMotion: 'reduce', hasTouch: b < 900});
  const page = await ctx.newPage();
  for (const n of (process.env.NUR ? process.env.NUR.split(',') : ['a-start', 'a-karte', 'a-spiel', 'b-start', 'b-karte', 'b-spiel', 'c-start', 'c-karte', 'c-spiel', 'c-spiel-falsch'])) {
    await page.goto(pathToFileURL(path.join(DIR, n + '.html')).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    const ueber = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ueber > 0) console.log(`Achtung: ${n} @${b} ist ${ueber}px zu breit`);
    await page.screenshot({path: path.join(OUT, `${n}-${b}.png`)});
    await page.addStyleTag({content: 'body{position:relative}.fuss{position:absolute!important}'});
    await page.screenshot({path: path.join(OUT, `${n}-${b}-ganz.png`), fullPage: true});
  }
  await ctx.close();
}
await browser.close();
console.log('fertig:', OUT);
