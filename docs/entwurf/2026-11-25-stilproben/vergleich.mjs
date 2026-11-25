// Vergleichsbilder A neben B aus den 2x-Aufnahmen nach .qa-output/stilproben/vergleich/ (nicht in Git).
// Aufruf nach 'aufnahmen.mjs 2': node docs/entwurf/2026-11-25-stilproben/vergleich.mjs
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const {chromium}=createRequire(ROOT+'/package.json')('playwright');
const D=ROOT+'/.qa-output/stilproben/2x/';
const OUT=ROOT+'/.qa-output/stilproben/vergleich/'; fs.mkdirSync(OUT,{recursive:true});
const css=`body{margin:0;background:#fff;font:700 30px system-ui;color:#222;padding:24px}
.reihe{display:flex;gap:28px;align-items:flex-start}.spalte{flex:1}.spalte h2{margin:0 0 12px;font-size:30px}
img{width:100%;display:block;border:2px solid #ccc;border-radius:12px}p{font:400 22px system-ui;margin:16px 0 0;color:#555}`;
const blatt=(titel,paare,breite)=>`<html><head><style>${css}</style></head><body style="width:${breite}px"><h1 style="margin:0 0 20px;font-size:34px">${titel}</h1>${paare.map(([a,b])=>`<div class="reihe" style="margin-bottom:28px"><div class="spalte"><h2>A „Kartenwerk“</h2><img src="file://${D}${a}"></div><div class="spalte"><h2>B „Sammelheft“</h2><img src="file://${D}${b}"></div></div>`).join('')}<p>Stilproben, nicht die echte Seite. Echte Inhalte und Fotos aus WunderKompass.</p></body></html>`;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:800}});
const jobs=[
 ['1-handy-start-und-spiel','Handy: Start und Spiel',[['a-start-390.png','b-start-390.png'],['a-spiel-390.png','b-spiel-390.png']],900],
 ['2-handy-wissenskarte','Handy: Wissenskarte (ganze Seite)',[['a-karte-390-ganz.png','b-karte-390-ganz.png']],900],
 ['3-rechner-start','Rechner: Start',[['a-start-1280.png','b-start-1280.png']],1800],
 ['4-rechner-karte-und-spiel','Rechner: Wissenskarte und Spiel',[['a-karte-1280.png','b-karte-1280.png'],['a-spiel-1280.png','b-spiel-1280.png']],1800],
];
// Probe C „Kompass“ (Mischung): Seiten nebeneinander
const reihe=(titel,bilder,breite)=>`<html><head><style>${css}</style></head><body style="width:${breite}px"><h1 style="margin:0 0 20px;font-size:34px">${titel}</h1><div class="reihe">${bilder.map(([u,b])=>`<div class="spalte"><h2>${u}</h2><img src="file://${D}${b}"></div>`).join('')}</div><p>Stilprobe C „Kompass“, nicht die echte Seite. Echte Inhalte und Fotos aus WunderKompass.</p></body></html>`;
const cJobs=[
 ['5-mischung-handy','Mischung „Kompass“ auf dem Handy',[['Start','c-start-390-ganz.png'],['Spiel: richtig','c-spiel-390.png'],['Spiel: noch nicht richtig','c-spiel-falsch-390.png']],1500],
 ['6-mischung-rechner','Mischung „Kompass“ auf dem Rechner',[['Start','c-start-1280.png'],['Spiel: richtig','c-spiel-1280.png']],1800],
];
for(const [n,t,paare,w] of jobs){const f=OUT+n+'.html';fs.writeFileSync(f,blatt(t,paare,w));await p.setViewportSize({width:w+48,height:800});await p.goto('file://'+f);await p.waitForLoadState('networkidle');await p.screenshot({path:OUT+n+'.png',fullPage:true});fs.unlinkSync(f);}
for(const [n,t,bilder,w] of cJobs){const f=OUT+n+'.html';fs.writeFileSync(f,reihe(t,bilder,w));await p.setViewportSize({width:w+48,height:800});await p.goto('file://'+f);await p.waitForLoadState('networkidle');await p.screenshot({path:OUT+n+'.png',fullPage:true});fs.unlinkSync(f);}
await b.close();console.log(fs.readdirSync(OUT));
