import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import Chromium from '/workspace/scratch/42fc63e2bab5/world-browser/node_modules/@sparticuz/chromium/build/index.js';
import {chromium} from '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';
export const project=process.cwd();
export const port=process.env.QA_PORT??'4173';
export const base='http://127.0.0.1:'+port;
export const shots=project+'/.qa-output';
export const launchOptions={executablePath:'/workspace/scratch/42fc63e2bab5/world-browser/engine/chromium',headless:true,env:{...process.env,LD_LIBRARY_PATH:'/workspace/scratch/42fc63e2bab5/world-browser/engine',FONTCONFIG_PATH:'/workspace/scratch/42fc63e2bab5/world-browser/engine/fonts'},args:[...Chromium.args.filter(a=>a!=='--single-process'&&!a.includes('incognito')),'--enable-unsafe-swiftshader'],timeout:15000};
export async function runBrowser(task){
 await fs.mkdir(shots,{recursive:true});
 let output='';
 const server=spawn(process.execPath,process.env.QA_PRODUCTION?['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','dev','--config',process.env.QA_CONFIG??'dist/server/wrangler.json','--local','--persist-to','.wrangler/qa-state-'+port,'--ip','127.0.0.1','--port',port,'--inspector-port','0']:['scripts/run-framework.mjs','dev','--host','127.0.0.1','--port',port,'--strictPort'],{cwd:project,detached:true,env:{...process.env,CLOUDFLARE_CF_FETCH_ENABLED:'false',WRANGLER_SEND_METRICS:'false'},stdio:['ignore','pipe','pipe']});
 server.stdout.on('data',b=>output=(output+b).slice(-5000));server.stderr.on('data',b=>output=(output+b).slice(-5000));
 let browser;
 try{
  let ready=false;
  for(let i=0;i<35;i++){
   if(server.exitCode!==null)throw new Error('QA server exited: '+output);
   try{const r=await fetch(base+'/world.json',{signal:AbortSignal.timeout(800)});if(r.ok){ready=true;break;}}catch{}
   await new Promise(r=>setTimeout(r,500));
  }
  if(!ready)throw new Error('QA server not ready: '+output);
  browser=await chromium.launch(launchOptions);
  console.log('Browser ready:',browser.version());
  const probe=await fetch(base+'/');console.log('Application HTTP:',probe.status);
  console.log('Args:',Chromium.args.filter(a=>/proxy|gl=|angle|headless|sandbox/.test(a)));
  try{return await task(browser);}catch(error){console.log('Server tail:',output);throw error;}
 }finally{
  if(browser)await browser.close().catch(()=>{});
  try{process.kill(-server.pid,'SIGTERM');}catch{}
 }
}
