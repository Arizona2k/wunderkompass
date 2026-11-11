// Early real source actions using the unchanged full regression's existing helper and preview.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {chromium} from '../../qa/node_modules/playwright/index.mjs';
import {actualPeopleSourceActivation} from './people-source-activation.mjs';
import {HISTORY_REGION_NAMES} from './history-evidence-actions.mjs';
import {sourceDigest} from '../../scripts/handoff.mjs';
import {learningFingerprint} from '../../build/learning-fingerprint.mjs';
import {browserErrorArrays,monitorBrowserErrors,BROWSER_ERROR_FIELDS} from '../../scripts/browser-errors.mjs';
const root=process.cwd(),port=Number(process.env.QA_PORT??4593);
assert(Number.isInteger(port)&&port>=1024&&port<=65530,'isolated preview port');
await fs.mkdir('.qa-output',{recursive:true});
const output=await fs.mkdtemp(path.join(root,'.qa-output/history-source-precondition-'));
const started=performance.now(),source=await sourceDigest(),build=learningFingerprint(root);
const report={status:'running',scope:'partial actual48 history source actions only; never full acceptance',sourceDigest:source,build,at:new Date().toISOString(),...browserErrorArrays()};
let browser,server,log='';
try{
 server=spawn(process.execPath,['tests/browser/preview-server.mjs'],{env:{...process.env,QA_PORT:String(port)},stdio:['ignore','pipe','pipe']});
 server.stdout.on('data',b=>log+=b);server.stderr.on('data',b=>log+=b);
 for(let i=0;i<52&&!log.includes('WK_PREVIEW_READY');i++){assert.equal(server.exitCode,null,log);await new Promise(r=>setTimeout(r,100));}
 assert(log.includes('WK_PREVIEW_READY'),log);
 browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader'],...(process.env.QA_BROWSER_EXECUTABLE?{executablePath:process.env.QA_BROWSER_EXECUTABLE}:{})});
 const context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce'}),page=await context.newPage();
 monitorBrowserErrors(page,'http://127.0.0.1:'+port,report,{engine:'chromium'});page.setDefaultTimeout(30000);
 await page.goto('http://127.0.0.1:'+port+'/#world');await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).waitFor();
 const catalog=JSON.parse(await fs.readFile('app/world-catalog.json','utf8')),ids=Object.keys(HISTORY_REGION_NAMES);
 const expected=ids.flatMap(id=>catalog.find(t=>t.id===id).sources.map(s=>({id,requested:s.url})));assert.equal(ids.length,16);assert.equal(expected.length,48);
 // Full regression imports an already visited synthetic pass. In this fresh
 // early context perform those real visits first, then freeze their progress.
 report.actualPreparationVisits=[];
 for(const id of ids){await page.evaluate(id=>location.hash='world/topic/'+id,id);await page.getByRole('heading',{name:catalog.find(t=>t.id===id).title,exact:true}).waitFor();report.actualPreparationVisits.push(id);}
 await page.waitForFunction(ids=>ids.every(id=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress.discoveries.includes('topic:'+id)),ids);
 report.actualSourceObservations=[];
 report.actualSources=await actualPeopleSourceActivation(page,{ids,pdfOutputDirectory:path.join(output,'source-PDF-originals'),observations:report.actualSourceObservations});
 assert.deepEqual(report.actualSources.observations.map(({id,requested})=>({id,requested})),expected,'all current sources, no filtering');
 assert.equal(report.actualSources.status,'actual destinations loaded, separate factual passages retained');
 for(const field of BROWSER_ERROR_FIELDS)assert.deepEqual(report[field],[],field);
 assert.equal(await sourceDigest(),source);assert.equal(learningFingerprint(root),build);report.status='passed';
}catch(error){report.status='failed';report.failure=error.stack;throw error;}
finally{
 await browser?.close();server?.kill('SIGTERM');report.seconds=(performance.now()-started)/1000;
 await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:report.status,output,seconds:report.seconds,sourceDigest:source,build,sourceDeficits:report.actualSourceObservations?.filter(r=>r.status!=='actual source destination loaded; passage review remains separate').map(r=>({id:r.id,label:r.label,status:r.status,failure:r.failure}))}));
}
