import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {chromium} from '../qa/node_modules/playwright/index.mjs';
import {exercise,geometry} from '../tests/browser/book-excellence.mjs';
import book from '../app/book-content.json' with {type:'json'};
const rows=[],source='.qa-output/quality-navigation/portable-offline-profile',terms=['Meter','DNA','Prüfsumme','Transit','Taiga','Tsunami'];
for(let i=0;i<6;i++){
 const row={pair:i,term:terms[i],samples:{}};
 for(const variant of i%2?['foreground','baseline']:['baseline','foreground']){
  const profile='work/p35-measure-profile-'+variant;
  await fs.rm(profile,{recursive:true,force:true});await fs.cp(source,profile,{recursive:true});
  const c=await chromium.launchPersistentContext(profile,{headless:true,...(process.env.QA_BROWSER_EXECUTABLE?{executablePath:process.env.QA_BROWSER_EXECUTABLE}:{}),args:['--enable-unsafe-swiftshader'],viewport:{width:1280,height:900},reducedMotion:'reduce'});
  await c.setOffline(true);
  try{
   const p=c.pages()[0];p.setDefaultTimeout(20000);await p.goto('http://127.0.0.1:4183/#book/words/'+encodeURIComponent(row.term));
   await p.locator('[data-book-word="'+row.term+'"]').waitFor();
   if(variant==='foreground')await p.bringToFront();
   const card=p.locator('[data-book-word="'+row.term+'"]');
   await card.locator('.book-study > summary').click();await card.getByText(book.learning[row.term].benefit,{exact:true}).waitFor();
   const start=performance.now();await exercise(p,card,row.term);await geometry(p,card,row.term);
   row.samples[variant]={seconds:(performance.now()-start)/1000,pages:c.pages().length,visibility:await p.evaluate(()=>document.visibilityState)};
   const snapshot=await card.evaluate(e=>({text:e.innerText,links:[...e.querySelectorAll('a')].map(a=>a.getAttribute('href')),open:[...e.querySelectorAll('details')].map(d=>d.open),pressed:[...e.querySelectorAll('[aria-pressed]')].map(e=>e.getAttribute('aria-pressed'))}));
   if(row.snapshot)assert.deepEqual(snapshot,row.snapshot,'all actual rendered texts, sources, levels, choices and models unchanged');else row.snapshot=snapshot;
  }finally{await c.close();}
 }
 delete row.snapshot;rows.push(row);await fs.writeFile('work/p35-measure-profile-foreground.json',JSON.stringify({status:'running',rows},null,2));console.log(JSON.stringify(row));
}
const stats=key=>{const a=rows.map(x=>x.samples[key].seconds).sort((a,b)=>a-b);return {p50:a[Math.floor(a.length*.5)],p95:a[Math.floor(a.length*.95)],sum:a.reduce((x,y)=>x+y,0)}};
const report={status:'passed',scope:'Six interleaved cold-profile pairs; identical actual exercise actions and DOM/source/geometry assertions; local sample only, no CI guarantee',baseline:stats('baseline'),foreground:stats('foreground'),rows};
await fs.writeFile('work/p35-measure-profile-foreground.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
